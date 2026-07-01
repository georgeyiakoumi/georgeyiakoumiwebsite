const STRAPI_API_URL = process.env.STRAPI_API_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

interface StrapiRequestOptions {
  endpoint: string;
  query?: Record<string, string | number | boolean>;
  cache?: RequestCache;
  tags?: string[];
}

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export async function fetchAPI<T>(
  { endpoint, query, cache = 'force-cache', tags }: StrapiRequestOptions
): Promise<T> {
  const url = new URL(`/api${endpoint}`, STRAPI_API_URL);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
  }

  try {
    const isDev = process.env.NODE_ENV === 'development';
    const response = await fetch(url.toString(), {
      headers,
      cache: isDev ? 'force-cache' : cache,
      next: isDev ? undefined : { revalidate: 3600, ...(tags && { tags }) },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi API error response:', errorText);
      throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
    }

    const data: StrapiResponse<T> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching from Strapi:', error);
    throw error;
  }
}

export function getStrapiURL(path = '') {
  return `${STRAPI_API_URL}${path}`;
}

export function getStrapiMediaURL(url: string | null | undefined) {
  if (!url) return null;
  if (url.startsWith('http')) {
    if (url.endsWith('.svg')) return url;
    return url.replace('/upload/', '/upload/f_auto,q_auto/');
  }
  return getStrapiURL(url);
}