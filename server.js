const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config.js');

const app = express();
const publicPath = express.static(path.join(__dirname, './public'));

const port = (process.env.PORT || 8080);

const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, config.devServer));
app.use('/', publicPath);

app.listen(port);
console.log(`Listening at http://localhost:${port}`);
