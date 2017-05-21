const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('pre-build'),
    filename: 'jisc.js',
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      { context: 'platform/chromium', from: '**/*', to: '.' },
      { context: 'src', from: '*.css', to: '.' },
    ])
  ]
};
