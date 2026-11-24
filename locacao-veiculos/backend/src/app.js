require('dotenv').config();

const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { naoEncontrado, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use(routes);
app.use(naoEncontrado);
app.use(errorHandler);

module.exports = app;
