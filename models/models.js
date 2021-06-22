const db = require('../db/connection');
const fs = require('fs');

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories`).then(({ rows }) => rows);
};

exports.selectReview = (id) => {
  let queryStr = `SELECT reviews.*, COUNT(comment_id) AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id`;

  const queryValues = [];
  if (id) {
    queryStr += ` WHERE reviews.review_id = $1`;
    queryValues.push(id);
  }
  queryStr += ` GROUP BY reviews.review_id;`;

  const idNum = parseInt(id);

  if (!Number.isNaN(idNum)) {
    return db.query(queryStr, queryValues).then((res) => {
      if (res.rows.length > 0) {
        return res.rows;
      } else {
        return Promise.reject({ status: 404, msg: 'Invalid id' });
      }
    });
  } else {
    return Promise.reject({
      status: 400,
      msg: 'Bad request'
    });
  }
};

exports.updateVotes = (review_id, inc_votes) => {
  const idNum = parseInt(review_id);
  if (!Number.isNaN(idNum)) {
    return db
      .query(`SELECT votes FROM reviews WHERE review_id = $1;`, [review_id])
      .then((result) => {
        if (result.rows.length === 0 || typeof inc_votes !== 'number') {
          return Promise.reject({ status: 400, msg: 'Invalid request' });
        } else {
          const newVotes = result.rows[0].votes + inc_votes;
          return db
            .query(
              `UPDATE reviews SET votes = $1 WHERE review_id = $2 RETURNING *;`,
              [newVotes, review_id]
            )
            .then((result) => {
              return result.rows[0];
            });
        }
      });
  } else {
    return Promise.reject({
      status: 400,
      msg: 'Bad request'
    });
  }
};

exports.selectReviews = (sort_by = 'created_at', order = 'asc', category) => {
  const validColumns = [
    'title',
    'owner',
    'created_at',
    'review_id',
    'review_body',
    'designer',
    'review_img_url',
    'votes',
    'category',
    'comment_count'
  ];
  const validCategories = [
    'strategy',
    'hidden-roles',
    'dexterity',
    'push-your-luck',
    'roll-and-write',
    'deck-building',
    'engine-building',
    'euro game',
    'social deduction'
  ];
  const validOrders = ['asc', 'desc'];

  if (!validColumns.includes(sort_by) || !validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: 'invalid input' });
  }

  let queryStr = `SELECT title, owner, reviews.created_at, reviews.review_id, designer, review_img_url, reviews.votes, category, COUNT(comment_id) AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id`;

  const categoryValue = [];
  if (category) {
    if (!validCategories.includes(category)) {
      return Promise.reject({ status: 404, msg: 'Bad request' });
    } else {
      queryStr += ` WHERE category = $1`;
      categoryValue.push(category);
    }
  }

  queryStr += ` GROUP BY reviews.review_id`;

  const orderVariable = ` ORDER BY ${sort_by} ` + order + ';';

  queryStr += orderVariable;

  return db.query(queryStr, categoryValue).then((reviews) => {
    return reviews.rows;
  });
};

exports.selectComments = (review_id) => {
  const idNum = parseInt(review_id);
  if (!Number.isNaN(idNum)) {
    return db
      .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: 'Please provide a valid review_id'
          });
        } else {
          return db
            .query(`SELECT * FROM comments WHERE review_id = $1;`, [review_id])
            .then((res) => {
              return res.rows;
            });
        }
      });
  } else {
    return Promise.reject({
      status: 400,
      msg: 'Bad request'
    });
  }
};

exports.addComment = (review_id, username, body) => {
  const idNum = parseInt(review_id);
  if (!Number.isNaN(idNum)) {
    return db
      .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: 'Please provide a valid review_id'
          });
        } else {
          return db
            .query(`SELECT * FROM users WHERE username = $1;`, [username])
            .then((result) => {
              if (result.rows.length === 0) {
                return Promise.reject({
                  status: 404,
                  msg: 'Please provide a valid username'
                });
              } else {
                return db
                  .query(
                    `INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
                    [review_id, username, body]
                  )
                  .then((result) => {
                    return result.rows;
                  });
              }
            });
        }
      });
  } else {
    return Promise.reject({
      status: 400,
      msg: 'Bad request'
    });
  }
};

exports.selectAllEndpoints = () => {
  const endpoints = fs.readFileSync('./endpoints.json');
  const parsedEPs = JSON.parse(endpoints);
  return parsedEPs;
};

exports.selectComment = (comment_id) => {
  const idNum = parseInt(comment_id);
  if (!Number.isNaN(idNum)) {
    return db
      .query(`SELECT * FROM comments WHERE comment_id = $1;`, [comment_id])
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: 'Not found!'
          });
        } else {
          return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [
            comment_id
          ]);
        }
      });
  } else {
    return Promise.reject({
      status: 400,
      msg: 'Please provide a valid comment_id'
    });
  }
};
