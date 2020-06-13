const merge = require('webpack-merge');
const config = require('./webpack.config.js');

module.exports = (env, args) => merge(config(env, args), {
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    historyApiFallback: true,
    disableHostCheck: true,
  },
});