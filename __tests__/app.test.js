const db = require('../db/connection');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');
const app = require('../app');

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

describe('GET /api/categories', () => {
  test('responds with 200 and an array of categories', () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then((res) => {
        const { categories } = res.body;
        expect(Array.isArray(categories)).toBe(true);
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String)
            })
          );
        });
      });
  });
});

describe('GET /api/reviews/:review_id', () => {
  test('responds with 200 and the specified review', () => {
    return request(app)
      .get('/api/reviews/1')
      .expect(200)
      .then((res) => {
        const { review } = res.body;
        expect(Array.isArray(review)).toBe(true);
        expect(review).toHaveLength(1);
        review.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: 'mallionaire',
              title: 'Agricola',
              review_id: 1,
              designer: 'Uwe Rosenberg',
              review_img_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
              category: 'euro game',
              created_at: expect.any(String),
              votes: expect.any(Number)
            })
          );
        });
      });
  });
  test('responds with 200 and the review to have a comment_count property', () => {
    return request(app)
      .get('/api/reviews/2')
      .expect(200)
      .then((res) => {
        expect(res.body.review[0].comment_count).toBe('3');
      });
  });
  test('responds with 400 when given an invalid id type', () => {
    return request(app)
      .get('/api/reviews/string')
      .expect(400)
      .then((res) => {
        const { body } = res;
        expect(body.msg).toBe('Bad request');
      });
  });
  test('responds with 404 when given an id that does not exist', () => {
    return request(app)
      .get('/api/reviews/49')
      .expect(404)
      .then((res) => {
        const { body } = res;
        expect(body.msg).toBe('Invalid id');
      });
  });
});

describe('PATCH /api/reviews/:review_id', () => {
  test('responds with 200 and updated review - incrementing the vote', () => {
    return request(app)
      .patch('/api/reviews/1')
      .send({ inc_votes: 2 })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          updated_review: {
            owner: 'mallionaire',
            title: 'Agricola',
            review_id: 1,
            review_body: 'Farmyard fun!',
            designer: 'Uwe Rosenberg',
            review_img_url:
              'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            category: 'euro game',
            created_at: expect.any(String),
            votes: 3
          }
        });
      });
  });
  test('responds with 200 and updated review - decrementing the vote', () => {
    return request(app)
      .patch('/api/reviews/1')
      .send({ inc_votes: -2 })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          updated_review: {
            owner: expect.any(String),
            title: expect.any(String),
            review_id: 1,
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: -1
          }
        });
      });
  });
  test('responds with 400 when given an invalid id', () => {
    return request(app)
      .patch('/api/reviews/49')
      .send({ inc_votes: -2 })
      .expect(400)
      .then((res) => {
        const { body } = res;
        expect(body.msg).toBe('Invalid request');
      });
  });
  test('responds with 400 when given an invalid id type', () => {
    return request(app)
      .patch('/api/reviews/string')
      .send({ inc_votes: -2 })
      .expect(400)
      .then((res) => {
        const { body } = res;
        expect(body.msg).toBe('Bad request');
      });
  });
  test('responds with 400 when given and invalid patch request', () => {
    return request(app)
      .patch('/api/reviews/1')
      .send({ inc_votes: 'hello' })
      .expect(400)
      .then((res) => {
        const { body } = res;
        expect(body.msg).toBe('Invalid request');
      });
  });
});

describe('GET /api/reviews', () => {
  test('responds with 200 and an array of reviews', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then((result) => {
        const { reviews } = result.body;
        expect(Array.isArray(reviews)).toBe(true);
        expect(reviews).toHaveLength(13);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              designer: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String)
            })
          );
        });
      });
  });
  test('responds with 200 and an array of reviews sorted by date by default', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then((result) => {
        const { reviews } = result.body;
        expect(reviews).toBeSortedBy('created_at');
      });
  });
  test('responds with 200 and an array of reviews sorted by the given input', () => {
    return request(app)
      .get('/api/reviews?sort_by=owner')
      .expect(200)
      .then((result) => {
        const { reviews } = result.body;
        expect(reviews).toBeSortedBy('owner');
      });
  });
  test('responds with 400 when given an invalid sort input', () => {
    return request(app)
      .get('/api/reviews?sort_by=nonsense')
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe('invalid input');
      });
  });
  test('responds with 200 with order specified', () => {
    return request(app)
      .get('/api/reviews?order=desc')
      .expect(200)
      .then((result) => {
        const { reviews } = result.body;
        expect(reviews).toBeSortedBy('created_at', { descending: true });
      });
  });
  test('responds with 400 when given an invalid order', () => {
    return request(app)
      .get('/api/reviews?order=nonsense')
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe('invalid input');
      });
  });
  describe('category', () => {
    test('responds with 200 and an array of reviews specified by the category', () => {
      return request(app)
        .get('/api/reviews?category=dexterity')
        .expect(200)
        .then((result) => {
          const { reviews } = result.body;
          expect(Array.isArray(reviews)).toBe(true);
          expect(reviews).toHaveLength(1);
          expect(reviews).toBeSortedBy('created_at', { ascending: true });
        });
    });
    test('responds with 200 and an array of reviews when no category is provided', () => {
      return request(app)
        .get('/api/reviews')
        .expect(200)
        .then((result) => {
          const { reviews } = result.body;
          expect(Array.isArray(reviews)).toBe(true);
          expect(reviews).toHaveLength(13);
          expect(reviews).toBeSortedBy('created_at', { ascending: true });
        });
    });
    test('responds with 404 when given an invalid category', () => {
      return request(app)
        .get('/api/reviews?category=nonsense')
        .expect(404)
        .then((result) => {
          expect(result.body.msg).toBe('Bad request');
        });
    });
    test('responds with 200, when given a valid category but returns an empty array when it has no reviews', () => {
      return request(app)
        .get('/api/reviews?category=push-your-luck')
        .expect(200)
        .then((result) => {
          const { reviews } = result.body;
          expect(Array.isArray(reviews)).toBe(true);
          expect(reviews).toHaveLength(0);
        });
    });
  });
});

describe('GET /api/reviews/:review_id/comments', () => {
  test('responds with 200 with an array of comments for the given review_id', () => {
    return request(app)
      .get('/api/reviews/2/comments')
      .expect(200)
      .then((res) => {
        const { comments } = res.body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments).toHaveLength(3);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String)
            })
          );
        });
      });
  });
  test('responds with 404 when given an invalid review_id', () => {
    return request(app)
      .get('/api/reviews/49/comments')
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toEqual('Please provide a valid review_id');
      });
  });
  test('responds with 400 when given and invalid type', () => {
    return request(app)
      .get('/api/reviews/nonsense/comments')
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toEqual('Bad request');
      });
  });
  test('responds with 200 and an empty array when given a valid id that has no comments', () => {
    return request(app)
      .get('/api/reviews/5/comments')
      .expect(200)
      .then((result) => {
        const { comments } = result.body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments).toHaveLength(0);
      });
  });
});

describe('POST /api/reviews/:review_id/comments', () => {
  test('responds with 200 with the posted comment', () => {
    return request(app)
      .post('/api/reviews/1/comments')
      .send({ username: 'bainesface', body: 'It is okay' })
      .expect(200)
      .then((res) => {
        const { comment } = res.body;
        expect(Array.isArray(comment)).toBe(true);
        expect(comment).toHaveLength(1);
        comment.forEach((result) => {
          expect(result).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String)
            })
          );
        });
      });
  });
  test('responds with 404 when given a non existent review_id', () => {
    return request(app)
      .post('/api/reviews/49/comments')
      .send({ username: 'bainesface', body: 'It is okay' })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toEqual('Please provide a valid review_id');
      });
  });
  test('responds with 404 when given an invalid username', () => {
    return request(app)
      .post('/api/reviews/3/comments')
      .send({ username: 'nonsense', body: 'It is okay' })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toEqual('Please provide a valid username');
      });
  });
  test('responds with 400 when given an invalid type', () => {
    return request(app)
      .post('/api/reviews/nonsense/comments')
      .send({ username: 'bainesface', body: 'It is okay' })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toEqual('Bad request');
      });
  });
});

describe('GET /api', () => {
  test('responds with 200 and JSON describing all available endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then((result) => {
        expect(typeof result.body).toBe('object');
      });
  });
});

describe.only('DELETE /api/comments/:comment_id', () => {
  test('responds with 204, no content and deletes the given comment', () => {
    return request(app).delete('/api/comments/1').expect(204);
  });
  test('responds with 404 when given a non existent comment id', () => {
    return request(app)
      .delete('/api/comments/49')
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toEqual('Not found!');
      });
  });
  test('responds with 400 when given an invalid id type', () => {
    return request(app)
      .delete('/api/comments/nonsense')
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toEqual('Please provide a valid comment_id');
      });
  });
});
