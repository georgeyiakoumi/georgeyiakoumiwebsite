import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchAPI, getBrowserMediaURL, getStrapiMediaURL, getStrapiURL, toProxiedMediaURL } from './strapi';

describe('getStrapiMediaURL', () => {
  it('returns null for null input', () => {
    expect(getStrapiMediaURL(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(getStrapiMediaURL(undefined)).toBeNull();
  });

  it('proxies own-account Cloudinary SVGs through the site domain', () => {
    const url = 'https://res.cloudinary.com/georgeyiakoumi/image/upload/v1/logo.svg';
    expect(getStrapiMediaURL(url)).toBe('/media/image/upload/v1/logo.svg');
  });

  it('proxies SVGs with a query string', () => {
    const url = 'https://res.cloudinary.com/georgeyiakoumi/image/upload/v1/logo.svg?v=2';
    expect(getStrapiMediaURL(url)).toBe('/media/image/upload/v1/logo.svg?v=2');
  });

  it('leaves SVGs from other origins unchanged', () => {
    const url = 'https://res.cloudinary.com/someone-else/image/upload/v1/logo.svg';
    expect(getStrapiMediaURL(url)).toBe(url);
  });

  it('adds f_auto,q_auto to Cloudinary raster URLs and keeps them absolute', () => {
    const url = 'https://res.cloudinary.com/georgeyiakoumi/image/upload/v1/photo.jpg';
    expect(getStrapiMediaURL(url)).toBe(
      'https://res.cloudinary.com/georgeyiakoumi/image/upload/f_auto,q_auto/v1/photo.jpg'
    );
  });

  it('prepends Strapi URL for relative paths', () => {
    const url = '/uploads/image.png';
    expect(getStrapiMediaURL(url)).toBe(`${getStrapiURL()}/uploads/image.png`);
  });
});

describe('toProxiedMediaURL', () => {
  it('returns null for empty input', () => {
    expect(toProxiedMediaURL(null)).toBeNull();
    expect(toProxiedMediaURL(undefined)).toBeNull();
    expect(toProxiedMediaURL('')).toBeNull();
  });

  it('rewrites own-account Cloudinary URLs to the /media proxy', () => {
    expect(
      toProxiedMediaURL('https://res.cloudinary.com/georgeyiakoumi/video/upload/v1/clip.mp4')
    ).toBe('/media/video/upload/v1/clip.mp4');
  });

  it('leaves other URLs unchanged', () => {
    const other = 'https://res.cloudinary.com/someone-else/video/upload/v1/clip.mp4';
    expect(toProxiedMediaURL(other)).toBe(other);
    expect(toProxiedMediaURL('/uploads/a.png')).toBe('/uploads/a.png');
  });
});

describe('getBrowserMediaURL', () => {
  it('returns null for empty input', () => {
    expect(getBrowserMediaURL(null)).toBeNull();
  });

  it('proxies videos without format negotiation, so shared caches serve one format to every browser', () => {
    const url = getBrowserMediaURL('https://res.cloudinary.com/georgeyiakoumi/video/upload/v1/clip.mp4');
    expect(url).toBe('/media/video/upload/q_auto/v1/clip.mp4');
    expect(url).not.toContain('f_auto');
  });

  it('proxies raster images with q_auto only', () => {
    expect(getBrowserMediaURL('https://res.cloudinary.com/georgeyiakoumi/image/upload/v1/shot.jpg')).toBe(
      '/media/image/upload/q_auto/v1/shot.jpg'
    );
  });

  it('proxies SVGs and raw files (Lottie JSON) untouched', () => {
    expect(getBrowserMediaURL('https://res.cloudinary.com/georgeyiakoumi/image/upload/v1/logo.svg')).toBe(
      '/media/image/upload/v1/logo.svg'
    );
    expect(getBrowserMediaURL('https://res.cloudinary.com/georgeyiakoumi/raw/upload/v1/anim.json')).toBe(
      '/media/raw/upload/v1/anim.json'
    );
  });

  it('leaves non-Cloudinary and relative URLs to the usual handling', () => {
    expect(getBrowserMediaURL('https://example.com/a.mp4')).toBe('https://example.com/a.mp4');
    expect(getBrowserMediaURL('/uploads/a.png')).toBe(`${getStrapiURL()}/uploads/a.png`);
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
