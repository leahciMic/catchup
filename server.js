const path = require('path');
const express = require('express');

const app = express();
const publicPath = express.static(path.join(__dirname, './dist'));

const port = (process.env.PORT || 8080);

app.use('/', publicPath);

app.listen(port);
console.log(`Listening at http://localhost:${port}`);
