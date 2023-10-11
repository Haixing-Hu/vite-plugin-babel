/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import * as babel from '@babel/core';

const DEFAULT_FILTER = /\.(jsx?|vue)$/;

const babelPlugin = ({ config = {}, filter = DEFAULT_FILTER }) => ({
  name: 'vite-plugin-babel',
  transform: (src, id) => {
    if (filter.test(id)) {
      config.filename = id;
      return babel.transform(src, config);
    }
  },
});

export default babelPlugin;
