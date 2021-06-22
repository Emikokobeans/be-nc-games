\c nc_games

-- SELECT reviews.*, COUNT(comment_id) AS comment_count FROM reviews
-- LEFT JOIN comments ON comments.review_id = reviews.review_id
-- GROUP BY reviews.review_id

-- SELECT * FROM comments WHERE EXISTS (SELECT * FROM reviews WHERE comments.review_id = 5)

-- SELECT * FROM reviews WHERE review_id = 49

SELECT username FROM users 
