var config = require('./webpack.config.js')();

var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// open visualizer after build.
config.plugins.push(new BundleAnalyzerPlugin());

module.exports = config;