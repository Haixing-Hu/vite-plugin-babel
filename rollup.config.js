/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/

function bundle(format) {
  const file = `dist/index.${format}.js`;
  return {
    input: 'src/index.js',
    output: {
      file,
      sourcemap: false,
      format,
    },
    external: '@babel/core',
  };
}

module.exports = [
  bundle('cjs'),
  bundle('es'),
];
