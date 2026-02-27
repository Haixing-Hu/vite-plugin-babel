# vite-plugin-babel

[![npm package](https://img.shields.io/npm/v/@qubit-ltd/vite-plugin-babel.svg)](https://npmjs.com/package/@qubit-ltd/vite-plugin-babel)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![中文文档](https://img.shields.io/badge/文档-中文版-blue.svg)](README.zh_CN.md)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Haixing-Hu/vite-plugin-babel/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/Haixing-Hu/vite-plugin-babel/tree/master)


[vite-plugin-babel] is a plugin designed for the [Vite] build tool, enabling you
to integrate the [Babel] transpiler into your [Vite] project. This empowers your
project to harness advanced capabilities, such as those presented by the
[JavaScript Decorators proposal].

**NOTE:** While there already exists [owlsdepartment's vite-plugin-babel], which
promises to infuse [Babel] support into [Vite], our experience revealed challenges
when handling [Vue] Single File Components (SFCs). Upon a close inspection of its
source code, it became apparent that for accurate transpilation, it was necessary
to apply [Babel] after [vite-plugin-vue] had processed the source code.
Interestingly, owlsdepartment's plugin calls the `esbuildPluginBabel()` during its
`config()` stage, and the `esbuildPluginBabel()` attempts to transform the source
code within its `setup()` function. This sequence led to the transpilation by [Babel]
being applied before [vite-plugin-vue] had the opportunity to process it.
Hence, we made the decision to develop a new plugin to correctly manage this process.

## Installation

You can install this plugin using `npm`:

```shell
npm install --save-dev @qubit-ltd/vite-plugin-babel
```

Or with `yarn`:

```shell
yarn add --dev @qubit-ltd/vite-plugin-babel
```

## Usage

To use this plugin, import and add it to your [Vite] configuration file `vite.config.js`:

```js
import babelPlugin from '@qubit-ltd/vite-plugin-babel';

export default {
  plugins: [
    // ...
    babelPlugin()
  ]
}
```

**Note:** It's recommended to place this plugin after other plugins in the list
so that Babel transpiles source code after other plugins have processed it.
For example, if your [Vite] project uses the [vite-plugin-vue] plugin, make sure
to place this plugin after the [vite-plugin-vue] plugin so that [Babel]
transpiles source code processed by the [vite-plugin-vue] plugin.

## Configuration Options

This plugin supports several configuration options that you can pass when
initializing it. Here are the available options and their default values:

| Option   | Type     | Default              | Description                                                                                   |
|----------|----------|----------------------|-----------------------------------------------------------------------------------------------|
| `config` | `object` | `{}`                 | An object used to initialize the [Babel] transpiler, including [Babel configuration options]. |
| `filter` | `RegExp` | `/\.(jsx?|vue)($|\?)/` | A regular expression used to match source code files that should be transpiled.               |
| `transpileDependencies` | `Array<string|RegExp>` | `[]` | A list of dependencies under `node_modules` that should be transpiled. By default files in `node_modules` are ignored; use this option to explicitly include packages (supports exact package names like `"pkg"` or `"@scope/pkg"`, RegExp instances, or regex-like strings `"/^pkg-/"`). |

## Example

Let's say you've created a [Vue] project using [create-vue], and you want to use
the [vue3-class-component] package to write Vue components using JavaScript
classes, taking advantage of the latest syntax features from the
[JavaScript Decorators proposal].

First, install [Babel] and related plugins:

```shell
yarn add @qubit-ltd/vue3-class-component
yarn add --dev @babel/core @babel/runtime @babel/preset-env
yarn add --dev @babel/plugin-proposal-decorators @babel/plugin-transform-class-properties @babel/plugin-transform-runtime
yarn add --dev @qubit-ltd/vite-plugin-babel
```

Next, configure your [Vite] project in the `vite.config.js` file as follows:

```javascript
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import babel from '@qubit-ltd/vite-plugin-babel';

export default defineConfig({
  plugins: [
    vue({
      script: {
        babelParserPlugins: ['decorators'],   // enable decorators support
      },
    }),
    babel({
      config: {
        presets: [
          ["@babel/preset-env", { "modules": false }]
        ],
        plugins: [
          "@babel/plugin-transform-runtime",
          ["@babel/plugin-proposal-decorators", { "version": "2023-05" }],
          "@babel/plugin-transform-class-properties"
        ],
      },
      filter: /\.(jsx?|vue)($|\?)/,
      // By default files in node_modules are not transformed. To transpile specific
      // dependencies (for example some packages published in ESNext), specify them:
      // transpileDependencies: ['some-es-package', /^@scope\//],
      transpileDependencies: ['some-es-package'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```

In the configuration above, we specify [Babel] configuration directly in the
`config` option of the [vite-plugin-babel] plugin. You can also place [Babel]
configuration in the `.babelrc`, `.babelrc.json`, or `babel.config.js`
configuration file and use the default configuration of the
[vite-plugin-babel] plugin like this:

```javascript
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import babel from '@qubit-ltd/vite-plugin-babel';

export default defineConfig({
  plugins: [
    vue({
      script: {
        babelParserPlugins: ['decorators'], // enable decorators support
      },
    }),
    babel(),        // Babel configuration is in .babelrc.json
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```

For more information, you can check out the [vue3-class-component-demo-vite] project.

## Contributing

If you find any issues or have suggestions for improvements, please feel free
to open an issue or submit a pull request to the [GitHub repository].

## License

This plugin is distributed under the Apache 2.0 license. See the [LICENSE](LICENSE) file for more details.


[vite-plugin-babel]: https://npmjs.com/package/@qubit-ltd/vite-plugin-babel
[owlsdepartment's vite-plugin-babel]: https://www.npmjs.com/package/vite-plugin-babel
[vite-plugin-vue]: https://www.npmjs.com/package/@vitejs/plugin-vue
[Vue]: https://vuejs.org/
[vue3-class-component]: https://github.com/Haixing-Hu/vue3-class-component
[create-vue]: https://github.com/vuejs/create-vue
[Vite]: https://vitejs.dev/
[Babel]: https://babeljs.io/
[Babel configuration options]: https://babeljs.io/docs/options
[JavaScript Decorators proposal]: https://github.com/tc39/proposal-decorators
[vue3-class-component-demo-vite]: https://github.com/Haixing-Hu/vue3-class-component-demo-vite
[GitHub repository]: https://github.com/Haixing-Hu/vite-plugin-babel
