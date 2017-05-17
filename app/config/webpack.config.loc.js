const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

webpackConfig.plugins.push(new webpack.EnvironmentPlugin({
  NODE_ENV: 'loc',
}));

module.exports = webpackConfig;
