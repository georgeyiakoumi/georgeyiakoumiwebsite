import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchAPI, getStrapiMediaURL, getStrapiURL } from './strapi';

describe('getStrapiMediaURL', () => {
  it('returns null for null input', () => {
    expect(getStrapiMediaURL(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(getStrapiMediaURL(undefined)).toBeNull();
  });

  it('returns SVG URLs unchanged', () => {
    const url = 'https://res.cloudinary.com/test/upload/v1/logo.svg';
    expect(getStrapiMediaURL(url)).toBe(url);
  });

  it('adds f_auto,q_auto to Cloudinary raster URLs', () => {
    const url = 'https://res.cloudinary.com/test/upload/v1/photo.jpg';
    expect(getStrapiMediaURL(url)).toBe(
      'https://res.cloudinary.com/test/upload/f_auto,q_auto/v1/photo.jpg'
    );
  });

  it('prepends Strapi URL for relative paths', () => {
    const url = '/uploads/image.png';
    expect(getStrapiMediaURL(url)).toBe(`${getStrapiURL()}/uploads/image.png`);
  });
});

describe('getStrapiURL', () => {
  it('returns base URL with no path', () => {
    expect(getStrapiURL()).toMatch(/^https?:\/\//);
  });

  it('appends path to base URL', () => {
    expect(getStrapiURL('/api/test')).toMatch(/\/api\/test$/);
  });
});

describe('fetchAPI', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns data from successful response', async () => {
    const mockData = { id: 1, title: 'Test' };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockData }),
    }));

    const result = await fetchAPI({ endpoint: '/projects' });
    expect(result).toEqual(mockData);
  });

  it('throws on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: () => Promise.resolve('Not found'),
    }));

    await expect(fetchAPI({ endpoint: '/missing' })).rejects.toThrow('Strapi API error: 404');
  });

  it('throws on network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    await expect(fetchAPI({ endpoint: '/projects' })).rejects.toThrow('Network error');
  });

  it('appends query params to URL', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [] }),
    });
    vi.stubGlobal('fetch', mockFetch);

    await fetchAPI({ endpoint: '/projects', query: { 'sort[0]': 'title:asc' } });

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain('sort%5B0%5D=title%3Aasc');
  });

  it('includes Authorization header when token is set', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [] }),
    });
    vi.stubGlobal('fetch', mockFetch);

    await fetchAPI({ endpoint: '/projects' });

    const calledHeaders = mockFetch.mock.calls[0][1].headers;
    expect(calledHeaders['Content-Type']).toBe('application/json');
  });
});
