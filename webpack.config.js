const path = require('path');

module.exports = {
  entry: './inject/index.js',
  output: {
    path: path.resolve('chrome'),
    filename: 'jisc.js',
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
    ],
  },
};
