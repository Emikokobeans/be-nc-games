const express = require('express');
const {
  handleCustomErrors,
  handlePSQL400Errors,
  handle500s
} = require('./errors/index');
const cors = require('cors');

app.use(cors());

const apiRouter = require('./routers/api.router');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.all('*', (req, res) => {
  res.status(404).send({ msg: 'Path not found' });
});

app.use(handleCustomErrors);
app.use(handlePSQL400Errors);
app.use(handle500s);

module.exports = app;
