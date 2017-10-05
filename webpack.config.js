const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const jsonLoader = {
  test: /\.json$/,
  loader: 'json-loader',
};

const vueLoader = {
  test: /\.vue$/,
  loader: 'vue-loader',
};

const babelLoader = {
  test: /\.js$/,
  loader: 'babel-loader',
  exclude: /node_modules/,
};

const cssLoader = {
  test: /\.css$/,
  loader: ['style-loader', 'css-loader'],
};

module.exports = {
  context: `${__dirname}/`,
  entry: {
    app: './src/entry.js',
  },
  module: {
    loaders: [jsonLoader, vueLoader, babelLoader, cssLoader].filter(x => x !== undefined),
  },
  output: Object.assign({
    path: path.join(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
    sourceMapFilename: '[name].[chunkhash].js.map',
  }),
  resolve: {
    extensions: ['.js', '.vue', '.css', '.json'],
    alias: {
      lib: path.resolve(__dirname, 'src/lib'),
      components: path.resolve(__dirname, 'src/components'),
      views: path.resolve(__dirname, 'src/views'),
      layouts: path.resolve(__dirname, 'src/layouts')
    },
  },
  plugins: [
    new FriendlyErrorsPlugin(),
    isProduction ? new UglifyJSPlugin({ comments: false, sourceMap: true }) : () => {},
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      inject: true,
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: isProduction,
      progress: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      'process.env.VUE_ENV': '\'server\'',
    }),
  ].filter(x => x),
  devServer: {
    host: '0.0.0.0',
    contentBase: './public/',
  },
  devtool: isProduction ? 'source-map' : 'source-map',
  node: {
    ms: false,
    process: false,
    Buffer: false,
    net: 'empty',
    tls: 'empty',
    fs: 'empty',
    dns: 'empty',
  },
};
