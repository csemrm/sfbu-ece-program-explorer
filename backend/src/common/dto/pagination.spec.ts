import { paginate } from './pagination.dto';

describe('paginate()', () => {
  it('returns data, total, page, limit, totalPages', () => {
    const result = paginate(['a', 'b', 'c'], 30, 2, 10);
    expect(result).toEqual({
      data: ['a', 'b', 'c'],
      total: 30,
      page: 2,
      limit: 10,
      totalPages: 3,
    });
  });

  it('computes totalPages via ceil', () => {
    expect(paginate([], 21, 1, 10).totalPages).toBe(3);
    expect(paginate([], 20, 1, 10).totalPages).toBe(2);
    expect(paginate([], 1, 1, 10).totalPages).toBe(1);
    expect(paginate([], 0, 1, 10).totalPages).toBe(0);
  });

  it('passes data through unchanged', () => {
    const items = [{ id: '1' }, { id: '2' }];
    expect(paginate(items, 2, 1, 20).data).toBe(items);
  });
});
