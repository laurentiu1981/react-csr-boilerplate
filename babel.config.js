module.exports = api => {
  var env = api.cache(() => process.env.NODE_ENV);
  api.cache(true);
  const presets = [
    [
      require("@babel/preset-env"),
      {
        "useBuiltIns": "entry",
        "corejs": "3"
      }
    ],
    require("@babel/preset-react"),
  ];
  const plugins = [
    require("@babel/plugin-proposal-class-properties"),
    require("@babel/plugin-proposal-function-bind"),
    require("react-hot-loader/babel"),
  ];

  if (env === 'test') {
    plugins.push("require-context-hook");
    plugins.push("@babel/plugin-transform-runtime");
  }
  return {presets, plugins};
};