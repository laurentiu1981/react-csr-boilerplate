const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const config = require('./webpack.config.js');

module.exports = (env, args) => merge(config(env, args), {
  plugins: [
    new UglifyJSPlugin(),
    new CompressionPlugin()
  ]
});
