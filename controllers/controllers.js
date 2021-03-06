const {
  selectCategories,
  selectReview,
  updateVotes,
  selectReviews,
  selectComments,
  addComment,
  selectAllEndpoints,
  selectComment,
  selectUsers,
  selectUsername,
  updateCommentVotes
} = require('../models/models');

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories: categories });
    })
    .catch((err) => next(err));
};

exports.getReviewID = (req, res, next) => {
  selectReview(req.params.review_id)
    .then((review) => {
      res.status(200).send({ review: review });
    })
    .catch((err) => next(err));
};

exports.patchVotes = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateVotes(review_id, inc_votes)
    .then((response) => {
      res.status(200).send({ updated_review: response });
    })
    .catch((err) => next(err));
};

exports.getReviews = (req, res, next) => {
  const { sort_by, order, category } = req.query;
  selectReviews(sort_by, order, category)
    .then((reviews) => {
      res.status(200).send({ reviews: reviews });
    })
    .catch((err) => next(err));
};

exports.getComments = (req, res, next) => {
  const { review_id } = req.params;
  selectComments(review_id)
    .then((response) => {
      res.status(200).send({ comments: response });
    })
    .catch((err) => next(err));
};

exports.postComment = (req, res, next) => {
  const { review_id } = req.params;
  const { username, body } = req.body;
  addComment(review_id, username, body)
    .then((response) => {
      res.status(200).send({ comment: response });
    })
    .catch((err) => next(err));
};

exports.getAllEndpoints = (req, res, next) => {
  const response = selectAllEndpoints();
  res.status(200).send(response);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  selectComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users: users });
    })
    .catch((err) => next(err));
};

exports.getUsername = (req, res, next) => {
  const { username } = req.params;
  selectUsername(username)
    .then((username) => {
      res.status(200).send({ user: username });
    })
    .catch((err) => next(err));
};

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentVotes(comment_id, inc_votes)
    .then((response) => {
      res.status(200).send({ updated_comment: response });
    })
    .catch((err) => next(err));
};
