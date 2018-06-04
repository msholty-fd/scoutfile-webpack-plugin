const pluginName = 'ScoutfilePlugin';
const fs = require('fs');

class ScoutfilePlugin {
  constructor(options = {}) {
    this.chunks = options.chunks;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap(pluginName, compilation => {
      const entryScriptInjections = [];
      compilation.entrypoints.forEach(entrypoint => {
        const { hash, renderedHash, name, id } = entrypoint.runtimeChunk;
        const createArgs = `${hash}, ${renderedHash}, ${name}, ${id}`;
        if (!this.chunks || this.chunks.includes(name)) {
          entryScriptInjections.push(`document.body.appendChild(createAppScript("${createArgs}"));`)
        }
      });

      const scout = `
(function () { 
  'use strict';
  var chunkFilename = ${compilation.outputOptions.chunkFilename};

  var query = window.location.search.substring(1)
    .split('&')
    .map(pairString => pairString.split('='))
    .reduce((map, tuple) => {
      map[tuple[0]] = tuple[1];
      return map;
    }, {});

  function createAppScript(hash, renderedHash, name, id) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.charset = "utf-8";
    var filename;
    if (query.name && query.name === 'dev') {
      filename = name + ".js";
    } else if (query.name) {
      filename = chunkFilename
        .replace('[hash]', query.name)
        .replace('[chunkhash]', query.name)
        .replace('[name]', name)
        .replace('[id]', id);
    } else {
      filename = chunkFilename
        .replace('[hash]', hash)
        .replace('[chunkhash]', renderedHash)
        .replace('[name]', name)
        .replace('[id]', id);
    }
    
    script.src = "${compilation.options.output.publicPath}" + filename
    return script;
  }
  
  ${[...entryScriptInjections].join('')}
})();
`;

      fs.writeFile(__dirname + '/dist/scout.js', scout, function (err) {
        if (err) {
          return console.warn(err);
        }

        console.log('The file was saved!');
      });
    });
  }
}

module.exports = ScoutfilePlugin;
