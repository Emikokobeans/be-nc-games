const express = require('express');
const {
  getCategories,
  getAllEndpoints
} = require('../controllers/controllers');
const reviewsRouter = require('./reviews.router');

const apiRouter = express.Router();

apiRouter.get('/', getAllEndpoints);

apiRouter.get('/categories', getCategories);

apiRouter.use('/reviews', reviewsRouter);

module.exports = apiRouter;
