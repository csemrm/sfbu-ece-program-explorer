// Tests for CoursePagination href building logic (pure function extracted inline)
function pageHref(p: number, searchParams: Record<string, string>): string {
  const params = new URLSearchParams(searchParams);
  params.set('page', String(p));
  return `/courses?${params.toString()}`;
}

describe('pageHref()', () => {
  it('sets page param on empty searchParams', () => {
    expect(pageHref(1, {})).toBe('/courses?page=1');
    expect(pageHref(3, {})).toBe('/courses?page=3');
  });

  it('preserves existing search params', () => {
    const url = pageHref(2, { q: 'algo', level: 'graduate' });
    expect(url).toContain('page=2');
    expect(url).toContain('q=algo');
    expect(url).toContain('level=graduate');
  });

  it('overwrites existing page param', () => {
    const url = pageHref(5, { page: '1' });
    expect(url).toBe('/courses?page=5');
  });
});
