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

const babelPlugin = (options = {}) => {
  console.info('[vite-plugin-babel] Loading vite-plugin-babel with options:', options);
  return {
    name: 'vite-plugin-babel',
    enforce: 'post',
    transform: (src, id) => {
      console.info(`[vite-plugin-babel] Transforming file ${id}...`);
      const config = options.config || {};
      const filter = options.filter || DEFAULT_FILTER;
      if (filter.test(id)) {
        config.filename = id;
        console.info(`[vite-plugin-babel] The file ${id} will be transformed with config:`, config);
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
