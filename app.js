const express = require('express');
const {}

const app = express();

app.use(express.json());

app.get('api/categories', getCategories);

module.exports = app;