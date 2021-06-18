const reviewsRouter = require('express').Router();

const {
  getReviewID,
  patchVotes,
  getReviews,
  getComments,
  postComment
} = require('../controllers/controllers');

reviewsRouter.get('/', getReviews);

reviewsRouter.route('/:review_id').get(getReviewID).patch(patchVotes);
reviewsRouter.route('/:review_id/comments').get(getComments).post(postComment);

module.exports = reviewsRouter;
