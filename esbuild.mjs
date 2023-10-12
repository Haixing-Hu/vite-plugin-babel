/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import * as esbuild from 'esbuild'

async function bundle(format) {
  const minify = (process.env.NODE_ENV === 'production');
  const outfile = `./dist/vite-plugin-babel.${format}.js`;
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
