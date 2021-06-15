const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const { formatCategoryData } = require('../db/utils/data-manipulation');
const db = require('../db/connection');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('formatCategoryData', () => {
  test('returns empty array for no data', () => {
    expect(formatCategoryData([])).toEqual([]);
  });
  test('each category replaced with [slug, description]', () => {
    expect(
      formatCategoryData([
        {
          slug: 'euro game',
          description: 'Abstact games that involve little luck'
        }
      ])
    ).toEqual([['euro game', 'Abstact games that involve little luck']]);
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
