import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const secret = process.env.REVALIDATE_SECRET;

  console.log('[Revalidate] Webhook received');

  if (!secret) {
    console.error('[Revalidate] REVALIDATE_SECRET not configured');
    return NextResponse.json(
      { message: 'REVALIDATE_SECRET not configured' },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${secret}`) {
    console.error('[Revalidate] Invalid token');
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const model = body.model || body.entry?.uid?.split('.')[1];
    const slug = body.slug || body.entry?.slug;
    const type = body.entry?.type;

    console.log('[Revalidate] model:', model, 'slug:', slug, 'type:', type);

    const revalidated: string[] = [];

    if (model === 'project') {
      revalidatePath('/projects', 'page');
      revalidated.push('/projects');

      if (type === 'article') {
        revalidatePath('/article', 'layout');
        revalidated.push('/article');
      } else {
        revalidatePath('/project', 'layout');
        revalidated.push('/project');
      }

      revalidatePath('/', 'page');
      revalidated.push('/');
    } else if (model === 'about' || model === 'tool') {
      revalidatePath('/', 'page');
      revalidated.push('/');
    } else if (model === 'global-seo') {
      revalidatePath('/', 'layout');
      revalidated.push('/ (layout)');
    } else if (model === 'cv-page' || model === 'career-chapter' || model === 'certificate' || model === 'certificate-supplier' || model === 'business') {
      revalidatePath('/cv', 'page');
      revalidated.push('/cv');
    } else {
      revalidatePath('/', 'layout');
      revalidated.push('/ (full layout fallback)');
    }

    console.log('[Revalidate] Revalidated:', revalidated.join(', '));

    return NextResponse.json({
      revalidated: true,
      paths: revalidated,
      now: Date.now()
    });
  } catch (err) {
    console.error('[Revalidate] Error:', err);
    return NextResponse.json(
      { message: 'Error revalidating', error: String(err) },
      { status: 500 }
    );
  }
}
