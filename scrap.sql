\c nc_games

SELECT reviews.*, COUNT(comment_id) AS comment_count FROM reviews
LEFT JOIN comments ON comments.review_id = reviews.review_id
GROUP BY reviews.review_id

