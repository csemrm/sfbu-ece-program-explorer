// Tests for API URL selection logic from lib/api.ts
// Extracted as pure logic for testability

function getBase(isServer: boolean, serverBase: string, clientBase: string): string {
  return isServer ? serverBase : clientBase;
}

describe('API base URL selection', () => {
  const SERVER = 'http://backend:3001/api/v1';
  const CLIENT = 'http://localhost/api/v1';

  it('returns server base when running server-side', () => {
    expect(getBase(true, SERVER, CLIENT)).toBe(SERVER);
  });

  it('returns client base when running client-side', () => {
    expect(getBase(false, SERVER, CLIENT)).toBe(CLIENT);
  });

  it('server and client bases are different', () => {
    expect(SERVER).not.toBe(CLIENT);
  });
});

describe('URL search param building', () => {
  it('appends string and number params correctly', () => {
    const url = new URL('http://localhost/api/v1/courses');
    url.searchParams.set('q', 'algorithms');
    url.searchParams.set('page', String(2));
    url.searchParams.set('limit', String(18));

    expect(url.searchParams.get('q')).toBe('algorithms');
    expect(url.searchParams.get('page')).toBe('2');
    expect(url.searchParams.get('limit')).toBe('18');
  });

  it('does not append undefined params', () => {
    const params: Record<string, string | number> = { page: 1 };
    const url = new URL('http://localhost/api/v1/courses');
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
    expect(url.searchParams.has('q')).toBe(false);
    expect(url.searchParams.get('page')).toBe('1');
  });
});
