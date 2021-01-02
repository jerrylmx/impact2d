const path = require('path');
// var glob = require("glob");

module.exports = {
  target: 'node',
  mode: 'development',
  devtool: false,
  // entry: {
  //   js: glob.sync("./src/*.js"),
  // },
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './dist/'),
    library: 'Impact2d',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.(ts|js)x?$/,
  //       exclude: /node_modules/,
  //       use: [
  //         {loader: 'babel-loader'},
  //       ]
  //     }
  //   ]
  // }
};