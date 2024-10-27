////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import * as esbuild from 'esbuild'

function getExt(format) {
  switch (format) {
    case 'cjs':
      return 'cjs';
    case 'esm':
      return 'mjs';
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

async function bundle(format) {
  const minify = (process.env.NODE_ENV === 'production');
  const ext = getExt(format);
  const outfile = `./dist/vite-plugin-babel.${ext}`;
  await esbuild.build({
    entryPoints: ['./src/index.js'],
    outfile,
    format,
    bundle: true,
    sourcemap: 'linked',
    external: ['@babel/core'],
    drop: ['debugger', 'console'],
    logLevel: 'info',
  });
}

bundle('cjs');
bundle('esm');
