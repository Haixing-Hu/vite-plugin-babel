////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import * as babel from '@babel/core';

// Vite virtual module IDs may include a query (e.g. *.vue?vue&type=script)
const DEFAULT_FILTER = /\.(jsx?|vue)($|\?)/;

// Regex to detect node_modules paths
const NODE_MODULES_RE = /node_modules[\\/]/;

// Extract package name from a module id under node_modules.
// Examples:
// - "/.../node_modules/pkg/..." -> "pkg"
// - "/.../node_modules/@scope/pkg/..." -> "@scope/pkg"
function getPackageNameFromId(moduleId) {
  const m = moduleId.match(/node_modules[\\/](?:@[^\\/]+[\\/][^\\/]+|[^\\/]+)(?=[\\/]|$)/);
  if (!m) {
    return null;
  }
  return m[0].replace(/node_modules[\\/]/, '');
}

// Determine whether a moduleId matches any entry in transpileDependencies.
// Supported list item types:
// - RegExp instance
// - string exact package name, e.g. "pkg" or "@scope/pkg"
// - string that looks like '/pattern/' which will be converted to RegExp
function matchesTranspileList(moduleId, list) {
  if (!Array.isArray(list) || list.length === 0) {
    return false;
  }
  const pkg = getPackageNameFromId(moduleId);
  for (const item of list) {
    if (item instanceof RegExp) {
      if (item.test(moduleId) || (pkg && item.test(pkg))) {
        return true;
      }
    } else if (typeof item === 'string') {
      if (item.startsWith('/') && item.endsWith('/')) {
        try {
          const re = new RegExp(item.slice(1, -1));
          if (re.test(moduleId) || (pkg && re.test(pkg))) {
            return true;
          }
        } catch (e) {
          // ignore invalid regex
        }
      } else {
        if (pkg === item) {
          return true;
        }
        if (moduleId.indexOf(`/node_modules/${item}/`) !== -1) {
          return true;
        }
      }
    }
  }
  return false;
}

const babelPlugin = (options = {}) => {
  console.info('[vite-plugin-babel] Loading vite-plugin-babel with options:', options);
  return {
    name: 'vite-plugin-babel',
    enforce: 'post',
    transform: (src, id) => {
      console.info(`[vite-plugin-babel] Transforming file ${id}...`);
      const config = options.config || {};
      const filter = options.filter || DEFAULT_FILTER;

      // By default do not transform files in node_modules unless explicitly listed
      const transpileDeps = options.transpileDependencies || [];
      const isInNodeModules = NODE_MODULES_RE.test(id);

      // If file matches filter and is not in node_modules => transform
      if (!isInNodeModules && filter.test(id)) {
        config.filename = id;
        console.info(`[vite-plugin-babel] The file ${id} will be transformed with config:`, config);
        return babel.transform(src, config);
      }

      // If file is in node_modules, only transform when it matches transpileDependencies
      if (isInNodeModules && matchesTranspileList(id, transpileDeps) && filter.test(id)) {
        config.filename = id;
        console.info(`[vite-plugin-babel] The node_modules file ${id} matches transpileDependencies and will be transformed with config:`, config);
        return babel.transform(src, config);
      }

      return null;
    },
    buildEnd: () => {
      console.info('[vite-plugin-babel] The build process is finished.');
    },
  };
};

export default babelPlugin;
