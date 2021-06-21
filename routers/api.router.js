const express = require('express');
const { getAllEndpoints } = require('../controllers/controllers');
const reviewsRouter = require('./reviews.router');
const categoriesRouter = require('./categories.router');

const apiRouter = express.Router();

apiRouter.get('/', getAllEndpoints);

apiRouter.use('/categories', categoriesRouter);

apiRouter.use('/reviews', reviewsRouter);

module.exports = apiRouter;
