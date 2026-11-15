import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import { revalidatePath } from 'next/cache';
import { POST } from './route';

function request(authorization: string | null, body: unknown = { model: 'tool' }) {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (authorization !== null) headers.set('authorization', authorization);
  return new NextRequest('http://localhost/api/revalidate', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(revalidatePath).mockClear();
    vi.stubEnv('REVALIDATE_SECRET', 'correct-secret');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('returns 500 when the secret is not configured', async () => {
    vi.stubEnv('REVALIDATE_SECRET', '');
    const res = await POST(request('Bearer anything'));
    expect(res.status).toBe(500);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it.each([
    ['missing header', null],
    ['wrong secret', 'Bearer wrong-secret'],
    ['secret without Bearer prefix', 'correct-secret'],
    ['secret with a longer value', 'Bearer correct-secret-extra'],
  ])('rejects a request with %s', async (_label, authorization) => {
    const res = await POST(request(authorization));
    expect(res.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('revalidates the homepage for a tool change with the correct secret', async () => {
    const res = await POST(request('Bearer correct-secret', { model: 'tool' }));
    expect(res.status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith('/', 'page');
  });
});
