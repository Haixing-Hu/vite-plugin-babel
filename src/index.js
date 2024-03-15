////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import * as babel from '@babel/core';

const DEFAULT_FILTER = /\.(jsx?|vue)$/;

const babelPlugin = (options = {}) => ({
  name: 'vite-plugin-babel',
  enforce: 'post',
  transform: (src, id) => {
    const config = options.config || {};
    const filter = options.filter || DEFAULT_FILTER;
    if (filter.test(id)) {
      config.filename = id;
      console.info(`Transforming file ${id} with config:`, config);
      return babel.transform(src, config);
    }
    return null;
  },
});

export default babelPlugin;
