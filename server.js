const express = require('express');
const app = express();
const router = require('./routers');
const dotenv = require('dotenv');
app.use(express.urlencoded({ extended:false }));
app.use(express.json());

app.use(router);

module.exports = app;