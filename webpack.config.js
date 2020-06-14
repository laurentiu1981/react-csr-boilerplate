var webpack = require('webpack');
var path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'src/app');

const loadConfig = (env) => {

  // Get the root path (assuming your webpack config is in the root of your project!)
  const currentPath = path.join(__dirname);

  // Load .env  .env.[declared-mode] .env.local .env.[declared-mode].local
  const configs = ['.env', '.env.' + env, '.env.local', '.env.' + env + '.local'];

  let configPath, fileEnv, envKeys;

  return configs.reduce((prev, next) => {
    configPath = currentPath + "/" + next;
    if (!fs.existsSync(configPath)) {
      return prev;
    }
    fileEnv = dotenv.config({path: configPath}).parsed;
    // reduce it to a nice object, the same as before (but with the variables from the file)
    envKeys = Object.keys(fileEnv).reduce((prev, next) => {
      prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
      return prev;
    }, prev);
    return prev;
  }, {});
};

module.exports = (env, argv) => {
  const environment = argv && (argv.configFile || argv.mode || '');
  const envKeys = loadConfig(environment);
  return {
    entry: [
      APP_DIR + '/index.js'
    ],
    output: {
      path: BUILD_DIR, filename: 'bundle.js',
      publicPath: "/"
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: [
            path.resolve(__dirname, "src"),
          ],
          loader: 'babel-loader'
        },
        {
          test: /\.(scss|css)$/,
          use: [
            'style-loader',
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                sourceMap: true
              }
            },
            {
              loader: "sass-loader"
            }
          ]
        },
        {
          test: /\.(png|gif|jpg|svg)$/,
          loader: 'file-loader',
          options: {
            esModule: false,
          },
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: "style.css",
        chunkFilename: "[id].css"
      }),
      new webpack.DefinePlugin(envKeys),
      new HtmlWebpackPlugin({
        hash: true,
        template: 'index.html'
      })
    ],
    resolve: {
      extensions: ['*', '.jsx', '.js', '.json'],
      modules: [
        path.resolve('./node_modules'),
        path.resolve('./src'),
        path.resolve('./src/app'),
      ]
    },
    watchOptions: {
      ignored: /node_modules/,
    },
    "devServer": {
      // every request made to 'locahost:8080/api/xxxx' will be proxyfied to 'http://localhost:5000/api/xxxx'
      proxy: {
        "/api/*": {
          target: "http://localhost:5000",
          secure: false,
        },

      }
    }
  }
};