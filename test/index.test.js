import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock @babel/core so we can control babel.transform without modifying the real module
vi.mock('@babel/core', () => {
  return {
    transform: vi.fn(),
  };
});

import plugin from '../src/index.js';
import * as babel from '@babel/core';

describe('vite-plugin-babel', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('transforms non-node_modules files matching the filter', () => {
    babel.transform.mockReturnValue({ code: 'transformed' });
    const p = plugin({ config: { presets: [] } });
    const res = p.transform('const a = 1;', '/project/src/foo.js');
    expect(babel.transform).toHaveBeenCalled();
    expect(res).toEqual({ code: 'transformed' });
  });

  it('does not transform files inside node_modules by default', () => {
    babel.transform.mockImplementation(() => { throw new Error('should not be called'); });
    const p = plugin({});
    const res = p.transform('/project/node_modules/pkg/index.js', '/project/node_modules/pkg/index.js');
    // transform should return null and babel.transform should not be called
    expect(res).toBeNull();
    expect(babel.transform).not.toHaveBeenCalled();
  });

  it('transforms specified package in transpileDependencies (string package name)', () => {
    babel.transform.mockReturnValue({ code: 'ok' });
    const p = plugin({ transpileDependencies: ['pkg'] });
    const id = '/project/node_modules/pkg/src/index.js';
    const res = p.transform('code', id);
    expect(babel.transform).toHaveBeenCalled();
    expect(res).toEqual({ code: 'ok' });
  });

  it('transforms scoped package when listed', () => {
    babel.transform.mockReturnValue({ code: 'scoped' });
    const p = plugin({ transpileDependencies: ['@scope/pkg'] });
    const id = '/project/node_modules/@scope/pkg/lib/index.js';
    const res = p.transform('code', id);
    expect(babel.transform).toHaveBeenCalled();
    expect(res).toEqual({ code: 'scoped' });
  });

  it('supports RegExp entries in transpileDependencies', () => {
    babel.transform.mockReturnValue({ code: 're' });
    const p = plugin({ transpileDependencies: [/^@scope\//] });
    const id = '/project/node_modules/@scope/other/index.js';
    const res = p.transform('code', id);
    expect(babel.transform).toHaveBeenCalled();
    expect(res).toEqual({ code: 're' });
  });

  it('supports regex-like strings in transpileDependencies', () => {
    babel.transform.mockReturnValue({ code: 'restr' });
    const p = plugin({ transpileDependencies: ['/^pkg-/'] });
    const id = '/project/node_modules/pkg-foo/index.js';
    const res = p.transform('code', id);
    expect(babel.transform).toHaveBeenCalled();
    expect(res).toEqual({ code: 'restr' });
  });

  it('respects the filter option', () => {
    babel.transform.mockReturnValue({ code: 'ok' });
    const p = plugin({ filter: /\.jsx?($|\?)/ });
    const res = p.transform('code', '/project/src/file.css');
    expect(res).toBeNull();
    expect(babel.transform).not.toHaveBeenCalled();
  });
});

