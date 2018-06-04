# scoutfile-webpack-plugin
Dynamically load your project assets on load time and have control of which assets are served via url parameters

<h2 align="center">Install Alpha</h2>

```bash
  npm i --save-dev scoutfile-webpack-plugin
```

```bash
  yarn add --dev scoutfile-webpack-plugin
```

<h2 align="center">Usage</h2>

In your webpack configuration file, include this plugin in the list of plugins:

```js
const ScoutfilePlugin = require('scoutfile-webpack-plugin');

module.exports = {
  plugins: [
    new ScoutfilePlugin(),
  ],
};
```

If you want to only include specific chunks, pass in a configuration to the plugin:

```js
const ScoutfilePlugin = require('scoutfile-webpack-plugin');

module.exports = {
  plugins: [
    new ScoutfilePlugin({
      chunks: ['main'],
    }),
  ],
};
```