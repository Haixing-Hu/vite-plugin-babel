# vite-plugin-babel

[![npm package](https://img.shields.io/npm/v/@haixing_hu/vite-plugin-babel.svg)](https://npmjs.com/package/@haixing_hu/vite-plugin-babel)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![English Document](https://img.shields.io/badge/Document-English-blue.svg)](README.md)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Haixing-Hu/vite-plugin-babel/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/Haixing-Hu/vite-plugin-babel/tree/master)

[vite-plugin-babel] 是专为 [Vite] 构建工具设计的插件，允许你将 [Babel] 转译器集成到你的
[Vite] 项目中。这赋予了你的项目更强大的能力，如 [JavaScript装饰器提案] 所示。

**注意：** 尽管已经存在 [owlsdepartment 的 vite-plugin-babel]，承诺将[Babel]支持集成到[Vite]中，
但我们发现，该插件在处理 [Vue] 单文件组件（SFCs）时会出现一些挑战。经过对其源代码的仔细检查，
我们发现为了实现准确的转译，必须在 [vite-plugin-vue] 处理源代码后应用 [Babel]。然而，
owlsdepartment 的插件在其 `config()` 阶段调用了 `esbuildPluginBabel()`，而
`esbuildPluginBabel()` 试图在其 `setup()` 函数中调用 [Babel] 转换源代码。
这个顺序导致 [Babel] 的转译发生在 [vite-plugin-vue] 处理代码之前。
因此，我们决定开发一个新的插件来正确处理这个过程。

## 安装

您可以使用 `npm` 安装该插件：

```shell
npm install --save-dev @haixing_hu/vite-plugin-babel
```

或者使用 `yarn`：

```shell
yarn add --dev @haixing_hu/vite-plugin-babel
```

## 使用方法

在你的 [Vite] 配置文件 `vite.config.js` 中引入并使用该插件：

```js
import babel from '@haixing_hu/vite-plugin-babel';

export default {
  plugins: [
    // ...
    babel()
  ]
}
```

**注意：** 通常我们应该将该插件放在所有插件最后，从而使得此插件可以在前面其他插件处理完源码文件
后再对源码文件利用 [Babel] 进行转译。例如，如果您的 [Vite] 项目使用了 [vite-plugin-vue]
插件，应该将此插件放在 [vite-plugin-vue] 插件之后，从而可以使得 [Babel] 转译的源码文件是经
过 [vite-plugin-vue] 插件处理过的。

## 配置选项

该插件支持一些配置选项，你可以在插件初始化时传递给它。以下是可能的配置选项和默认值：

| 选项       | 类型       | 默认值                  | 说明                                      |
|----------|----------|----------------------|-----------------------------------------|
| `config` | `object` | `{}`                 | 用于初始化 [Babel] 转译器的对象，包含了 [Babel 配置选项] 。 |
| `filter` | `RegExp` | `/\.(jsx? \| vue)$/` | 用于匹配需要转译的源码文件的正则表达式。                    |

## 示例

假设我们用 [create-vue] 创建了一个 [Vue] 项目，然后我们想要在项目中使用 [vue3-class-component]
以支持通过 JavaScript 类编写 [Vue] 组件，我们需要为该项目提供 [Babel] 及相关插件，
从而可以使用最新的 [JavaScript 装饰器提案] 语法。

首先，我们需要安装 [Babel] 及相关插件：
```shell
yarn add @haixing_hu/vue3-class-component
yarn add --dev @babel/core @babel/runtime @babel/preset-env
yarn add --dev @babel/plugin-proposal-decorators @babel/plugin-transform-class-properties @babel/plugin-transform-runtime
yarn add --dev @haixing_hu/vite-plugin-babel
```

接下来配置 [Vite] 项目的 `vite.config.js` 文件如下：
```javascript
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import babel from '@haixing_hu/vite-plugin-babel';

export default defineConfig({
  plugins: [
    vue({
      script: {
        babelParserPlugins: ['decorators'],  // 启用装饰器语法支持
      },
    }),
    babel({
      config: {                              // Babel 的配置直接嵌入在参数 config 中
        presets: [
          ["@babel/preset-env", { "modules": false }]
        ],
        plugins: [
          "@babel/plugin-transform-runtime",
          ["@babel/plugin-proposal-decorators", { "version": "2023-05" }],
          "@babel/plugin-transform-class-properties"
        ],
      },
      filter: /\.(jsx? \| vue)$/,           // 此参数可以指定需要处理的文件名的正则表达式
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```

在上面的配置中，我们直接在 [vite-plugin-babel] 插件的配置选项`config`中指定了 [Babel]
的配置选项，也可以将 [Babel] 的配置选项放在 `.babelrc`、`.babelrc.json`、或
`babel.config.js` 等配置文件中，然后使用 [vite-plugin-babel] 插件的默认配置，即
```javascript
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import babel from '@haixing_hu/vite-plugin-babel';

export default defineConfig({
  plugins: [
    vue({
      script: {
        babelParserPlugins: ['decorators'], // 启用装饰器语法支持
      },
    }),
    babel(),  // Babel 配置在 `.babelrc.json` 等默认配置文件中
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```
具体可以参见 [vue3-class-component-demo-vite] 项目。

## 贡献

如果你发现任何问题或有改进建议，欢迎提交 issue 或者 PR 到本项目的 [GitHub 仓库]。

## 许可

此插件采用 Apache 2.0 许可证。详细信息请查阅 [LICENSE](LICENSE) 文件。

[vite-plugin-babel]: https://npmjs.com/package/@haixing_hu/vite-plugin-babel
[owlsdepartment 的 vite-plugin-babel]: https://www.npmjs.com/package/vite-plugin-babel
[vite-plugin-vue]: https://www.npmjs.com/package/@vitejs/plugin-vue
[Vue]: https://vuejs.org/
[vue3-class-component]: https://github.com/Haixing-Hu/vue3-class-component
[create-vue]: https://github.com/vuejs/create-vue
[Vite]: https://vitejs.dev/
[Babel]: https://babeljs.io/
[Babel 配置选项]: https://babeljs.io/docs/options
[JavaScript 装饰器提案]: https://github.com/tc39/proposal-decorators
[vue3-class-component-demo-vite]: https://github.com/Haixing-Hu/vue3-class-component-demo-vite
[GitHub 仓库]: https://github.com/Haixing-Hu/vite-plugin-babel
