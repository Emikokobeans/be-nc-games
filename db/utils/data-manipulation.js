// extract any functions you are using to manipulate your data, into this file

exports.formatCategoryData = (categoryData) => {
  return categoryData.map((category) => {
    return [category.slug, category.description];
  });
};

exports.formatUserData = (userData) => {
  return userData.map((user) => {
    return [user.username, user.avatar_url, user.name];
  });
};

exports.formatReviewData = (reviewData) => {
  return reviewData.map((review) => {
    return [
      review.title,
      review.review_body,
      review.designer,
      review.review_img_url,
      review.votes,
      review.category,
      review.owner,
      review.created_at
    ];
  });
};

exports.getReviewRef = (reference) => {
  let commentRef = {};
  if (reference.length !== 0) {
    for (const comment of reference) {
      commentRef[comment.title] = comment.review_id;
    }
  }
  return commentRef;
};

exports.getCommentsCopy = (commentData) => {
  const commentsCopy = [];
  commentData.forEach((comment, i) => {
    commentsCopy[i] = { ...comment };
  });
  return commentsCopy;
};

exports.mapComments = (commentCopy, reviewRef) => {
  commentCopy.forEach((comment) => {
    comment.review_id = reviewRef[comment.belongs_to];
  });
  return commentCopy.map((comment) => {
    return [
      comment.created_by,
      comment.review_id,
      comment.votes || 0,
      comment.created_at,
      comment.body
    ];
  });
};
