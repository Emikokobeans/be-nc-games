const format = require('pg-format');
const { formatCategoryData } = require('../utils/data-manipulation');
const db = require('../connection');

const seed = async (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  await db.query('DROP TABLE IF EXISTS comments;');
  await db.query('DROP TABLE IF EXISTS reviews;');
  await db.query('DROP TABLE IF EXISTS users;');
  await db.query('DROP TABLE IF EXISTS categories;');

  await db.query(`CREATE TABLE categories (
    slug TEXT UNIQUE PRIMARY KEY NOT NULL,
    description TEXT NOT NULL
  );`);

  await db.query(`CREATE TABLE users (
username TEXT UNIQUE PRIMARY KEY NOT NULL,
avatar_url TEXT NOT NULL,
name VARCHAR(100) NOT NULL);`);

  const url =
    'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg';

  await db.query(`CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  review_body TEXT NOT NULL,
  designer TEXT NOT NULL,
  review_img_url TEXT DEFAULT '${url}',
  votes INT DEFAULT 0,
  category TEXT REFERENCES categories (slug),
  owner TEXT REFERENCES users (username),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);`);
  await db.query(`CREATE TABLE comments (
  comment_id SERIAL PRIMARY KEY,
  author TEXT REFERENCES users (username),
  review_id INT REFERENCES reviews (review_id),
  votes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  body TEXT NOT NULL
);`);

  const categoryValues = formatCategoryData(categoryData);
  await db.query(
    format(
      `INSERT INTO categories (slug, description) VALUES %L RETURNING *;`,
      categoryValues
    )
  );

  // 1. create tables
  // 2. insert data
};

module.exports = seed;
