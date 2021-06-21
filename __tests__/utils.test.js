const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const {
  formatCategoryData,
  formatUserData,
  formatReviewData,
  getReviewRef,
  getCommentsCopy,
  mapComments
} = require('../db/utils/data-manipulation');

describe('formatCategoryData', () => {
  test('returns empty array for no data', () => {
    expect(formatCategoryData([])).toEqual([]);
  });
  test('each category replaced with [slug, description] with a single input', () => {
    expect(
      formatCategoryData([
        {
          slug: 'euro game',
          description: 'Abstact games that involve little luck'
        }
      ])
    ).toEqual([['euro game', 'Abstact games that involve little luck']]);
  });
  test('each category replace with [slug, description] with a multiple inputs', () => {
    expect(
      formatCategoryData([
        {
          slug: 'euro game',
          description: 'Abstact games that involve little luck'
        },
        {
          slug: 'social deduction',
          description: "Players attempt to uncover each other's hidden role"
        },
        { slug: 'dexterity', description: 'Games involving physical skill' }
      ])
    ).toEqual([
      ['euro game', 'Abstact games that involve little luck'],
      [
        'social deduction',
        "Players attempt to uncover each other's hidden role"
      ],
      ['dexterity', 'Games involving physical skill']
    ]);
  });

  test('does not mutate original input', () => {
    const categoryData = [
      {
        slug: 'euro game',
        description: 'Abstact games that involve little luck'
      }
    ];
    formatCategoryData(categoryData);
    expect(categoryData).toEqual([
      {
        slug: 'euro game',
        description: 'Abstact games that involve little luck'
      }
    ]);
  });
});

describe('formatUserData', () => {
  test('returns empty array for no data', () => {
    expect(formatUserData([])).toEqual([]);
  });
  test('each category replaced with [username, avatar_url, name] with a single input', () => {
    expect(
      formatUserData([
        {
          username: 'mallionaire',
          name: 'haz',
          avatar_url:
            'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
        }
      ])
    ).toEqual([
      [
        'mallionaire',
        'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
        'haz'
      ]
    ]);
  });
  test('each category replace with [username, avatar_url, name] with a multiple inputs', () => {
    const data = [
      {
        username: 'mallionaire',
        name: 'haz',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
      },
      {
        username: 'philippaclaire9',
        name: 'philippa',
        avatar_url:
          'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
      },
      {
        username: 'bainesface',
        name: 'sarah',
        avatar_url:
          'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
      }
    ];
    const expected = [
      [
        'mallionaire',
        'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
        'haz'
      ],
      [
        'philippaclaire9',
        'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
        'philippa'
      ],
      [
        'bainesface',
        'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
        'sarah'
      ]
    ];
    expect(formatUserData(data)).toEqual(expected);
  });
  test('does not mutate original input', () => {
    const data = [
      {
        username: 'mallionaire',
        name: 'haz',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
      }
    ];
    formatUserData(data);
    expect(data).toEqual([
      {
        username: 'mallionaire',
        name: 'haz',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
      }
    ]);
  });
});

describe('formatReviewData', () => {
  test('returns empty array for no data', () => {
    expect(formatUserData([])).toEqual([]);
  });
  test('each category replaced with [title, review_body, designer, review_img_url, votes, category, owner, created_at] with a single input', () => {
    const review = [
      {
        title: 'Agricola',
        designer: 'Uwe Rosenberg',
        owner: 'mallionaire',
        review_body: 'Farmyard fun!',
        category: 'euro game',
        created_at: new Date(1610964020514),
        votes: 1,
        review_img_url:
          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
      }
    ];
    const result = [
      [
        'Agricola',
        'Farmyard fun!',
        'Uwe Rosenberg',
        'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        1,
        'euro game',
        'mallionaire',
        new Date(1610964020514)
      ]
    ];
    expect(formatReviewData(review)).toEqual(result);
  });
  test('each category replace with [title, review_body, designer, review_img_url, votes, category, owner, created_at] with a multiple inputs', () => {
    const reviews = [
      {
        title: 'Agricola',
        designer: 'Uwe Rosenberg',
        owner: 'mallionaire',
        review_body: 'Farmyard fun!',
        category: 'euro game',
        created_at: new Date(1610964020514),
        votes: 1,
        review_img_url:
          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
      },
      {
        title: 'Jenga',
        designer: 'Leslie Scott',
        owner: 'philippaclaire9',
        review_body: 'Fiddly fun for all the family',
        category: 'dexterity',
        created_at: new Date(1610964101251),
        votes: 5,
        review_img_url:
          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
      }
    ];
    const result = [
      [
        'Agricola',
        'Farmyard fun!',
        'Uwe Rosenberg',
        'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        1,
        'euro game',
        'mallionaire',
        new Date(1610964020514)
      ],
      [
        'Jenga',
        'Fiddly fun for all the family',
        'Leslie Scott',
        'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        5,
        'dexterity',
        'philippaclaire9',
        new Date(1610964101251)
      ]
    ];
    expect(formatReviewData(reviews)).toEqual(result);
  });
  test('does not mutate original input', () => {
    const review = [
      {
        title: 'Agricola',
        designer: 'Uwe Rosenberg',
        owner: 'mallionaire',
        review_body: 'Farmyard fun!',
        category: 'euro game',
        created_at: new Date(1610964020514),
        votes: 1,
        review_img_url:
          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
      }
    ];
    formatReviewData(review);
    expect(review).toEqual([
      {
        title: 'Agricola',
        designer: 'Uwe Rosenberg',
        owner: 'mallionaire',
        review_body: 'Farmyard fun!',
        category: 'euro game',
        created_at: new Date(1610964020514),
        votes: 1,
        review_img_url:
          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
      }
    ]);
  });
});

describe('comments', () => {
  describe('getReviewRef', () => {
    test('returns an empty object, when passed an empty array', () => {
      const input = [];
      const actual = getReviewRef(input);
      const expected = {};
      expect(actual).toEqual(expected);
    });
    test('return title: review_id when passed a single array object', () => {
      const input = [{ review_id: 8, title: 'Wizzard' }];
      const actual = getReviewRef(input);
      const expected = { Wizzard: 8 };
      expect(actual).toEqual(expected);
    });
    test('returns title: review_id when passed multiple array objects', () => {
      const input = [
        { review_id: 8, title: 'Wizzard' },
        { review_id: 13, title: 'BioShock' }
      ];
      const actual = getReviewRef(input);
      const expected = { Wizzard: 8, BioShock: 13 };
      expect(actual).toEqual(expected);
    });
    test('original array is not mutated', () => {
      const input = [
        { review_id: 8, title: 'Wizzard' },
        { review_id: 13, title: 'BioShock' }
      ];
      getReviewRef(input);
      expect(input).toEqual([
        { review_id: 8, title: 'Wizzard' },
        { review_id: 13, title: 'BioShock' }
      ]);
    });
  });
  describe('getCommentsCopy', () => {
    test('copies input without mutating original data', () => {
      const input = [
        {
          body: 'I loved this game too!',
          belongs_to: 'Jenga',
          created_by: 'bainesface',
          votes: 16,
          created_at: new Date(1511354613389)
        }
      ];
      const unmutated = [
        {
          body: 'I loved this game too!',
          belongs_to: 'Jenga',
          created_by: 'bainesface',
          votes: 16,
          created_at: new Date(1511354613389)
        }
      ];
      const output = getCommentsCopy(input);
      expect(input).toEqual(unmutated);
      expect(output).not.toBe(input);
    });
  });
  describe('mapComments', () => {
    test('when passed empty argument objects, returns an empty array', () => {
      const commentCopy = [];
      const reviewRef = {};
      const output = [];
      expect(mapComments(commentCopy, reviewRef)).toEqual(output);
    });
    test('returns a new formated array when given a single array object and an object', () => {
      const commentCopy = [
        {
          body: 'I loved this game too!',
          belongs_to: 'Jenga',
          created_by: 'bainesface',
          votes: 16,
          created_at: new Date(1511354613389)
        }
      ];
      const reviewRef = { Jenga: 8 };
      const output = [
        ['bainesface', 8, 16, new Date(1511354613389), 'I loved this game too!']
      ];
      expect(mapComments(commentCopy, reviewRef)).toEqual(output);
    });
    test('returns a new formated array of arrays, when passed multiple array objects and reference objects', () => {
      const commentCopy = [
        {
          body: 'I loved this game too!',
          belongs_to: 'Jenga',
          created_by: 'bainesface',
          votes: 16,
          created_at: new Date(1511354613389)
        },
        {
          body: 'My dog loved this game too!',
          belongs_to: 'Ultimate Werewolf',
          created_by: 'mallionaire',
          votes: 13,
          created_at: new Date(1610964545410)
        }
      ];
      const reviewRef = { Jenga: 8, 'Ultimate Werewolf': 4 };
      const output = [
        [
          'bainesface',
          8,
          16,
          new Date(1511354613389),
          'I loved this game too!'
        ],
        [
          'mallionaire',
          4,
          13,
          new Date(1610964545410),
          'My dog loved this game too!'
        ]
      ];
      expect(mapComments(commentCopy, reviewRef)).toEqual(output);
    });
  });
});
