# scoutfile-webpack-plugin
Dynamically load your project assets on load time and have control of which assets are served via url parameters.

Normally when you build an application with webpack, you inject your javascript entrypoint(s) into your html so they are loaded when
the document is accessed. Files are generally long-term cached and `[chunkhash]`s are applied to the filename to ensure the user only
downloads a file when the contents have changed.

What this plugin provides on top of this is a middle-man that allows you more control over which javascript files are being served.
You can leverage url parameters to dynamically redefine which chunk you want to access on load time, which helps improve your workflow
in a lot of cool ways. For example, imagine your build produced these files:

```bash
          Asset       Size  Chunks                    Chunk Names
 main.abc123.js    200 KiB       2  [emitted]         main
  foo.def444.js    100 KiB    0, 3  [emitted]         foo
react.aaa111.js   14.7 KiB       4  [emitted]         react
Entrypoint main = main.abc123.js
```

If your `index.html` loaded `scout.js`, you could type a url parameters like `?main=ccc444` when accessing your application.
This would tell the scout to instead load `main.ccc444.js` instead of `main.abc123.js` from wherever you host your files.
This opens the door to a lot of cool workflow improvements within your team, like being able to manually test the changes in
an application from commit-to-commit by just using the scout hash instead of checking out a branch and running it locally!

Using the same example from above, you can also run your local code in a production instance by adding `?main=dev`. What this does
is instead of loading `main.abc123.js`, it will load `localhost:{port}/main.js`. This allows you to quickly debug issues in any instance
running a `scout.js` and not necessarily be concerned about what backend you are running on your machine. The root of the file served is
will be whatever you defined `output.publicPath` to be.


<h2 align="center">Install</h2>

```bash
  npm i --save-dev scoutfile-webpack-plugin
```

```bash
  yarn add --dev scoutfile-webpack-plugin
```

In your html that you serve in production, include a reference to the `scout.js` file that is produced in the build.

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