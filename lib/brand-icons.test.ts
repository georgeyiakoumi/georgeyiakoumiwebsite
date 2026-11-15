import { describe, it, expect } from 'vitest';
import { getBrandIcon, getBrandIconSVG, withBrandIcons } from './brand-icons';

describe('getBrandIconSVG', () => {
  it('returns null for empty or unknown slugs', () => {
    expect(getBrandIconSVG(null)).toBeNull();
    expect(getBrandIconSVG(undefined)).toBeNull();
    expect(getBrandIconSVG('')).toBeNull();
    expect(getBrandIconSVG('definitely-not-a-real-brand')).toBeNull();
  });

  it('renders a decorative inline SVG for a known slug', () => {
    const svg = getBrandIconSVG('figma');
    expect(svg).toMatch(/^<svg /);
    expect(svg).toContain('aria-hidden="true"');
    expect(svg).toContain('focusable="false"');
    expect(svg).toContain('viewBox=');
    expect(svg).toMatch(/<\/svg>$/);
  });

  it('trims whitespace from CMS-entered slugs', () => {
    expect(getBrandIconSVG('  figma ')).toMatch(/^<svg /);
  });

  it('gives each rendered copy unique internal IDs so inline SVGs do not clash', () => {
    const first = getBrandIconSVG('nextdotjs')!;
    const second = getBrandIconSVG('nextdotjs')!;
    const ids = (svg: string) => [...svg.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
    expect(ids(first).length).toBeGreaterThan(0);
    expect(ids(first).some((id) => ids(second).includes(id))).toBe(false);
  });

  it('resolves every slug the stack section relies on', () => {
    const slugs = [
      'after-effects', 'illustrator', 'indesign', 'photoshop', 'premiere', 'pro-tools',
      'blender', 'excalidraw', 'figma', 'webflow', 'cloudflare', 'cloudinary', 'css3',
      'motion-light', 'motion-dark', 'github-light', 'github-dark', 'gsap', 'html5',
      'javascript', 'lottiefiles', 'netlify', 'nextdotjs', 'radix-ui-light', 'radix-ui-dark',
      'react-light', 'react-dark', 'render', 'sass', 'shadcn-ui-light', 'shadcn-ui-dark',
      'storybook', 'supabase', 'tailwind-css', 'visual-studio-code', 'claude', 'linear',
      'miro-light', 'miro-dark', 'notion',
    ];
    const missing = slugs.filter((slug) => getBrandIconSVG(slug) === null);
    expect(missing).toEqual([]);
  });
});

describe('getBrandIcon', () => {
  it('returns undefined when there is no usable light slug', () => {
    expect(getBrandIcon({})).toBeUndefined();
    expect(getBrandIcon({ iconSlug: 'not-real', iconSlugDark: 'github-dark' })).toBeUndefined();
  });

  it('returns only a light icon when no dark slug is set', () => {
    const icon = getBrandIcon({ iconSlug: 'figma' });
    expect(icon?.light).toMatch(/^<svg /);
    expect(icon).not.toHaveProperty('dark');
  });

  it('ignores an unknown dark slug', () => {
    const icon = getBrandIcon({ iconSlug: 'figma', iconSlugDark: 'not-real' });
    expect(icon).not.toHaveProperty('dark');
  });

  it('returns light and dark icons when both slugs resolve', () => {
    const icon = getBrandIcon({ iconSlug: 'github-light', iconSlugDark: 'github-dark' });
    expect(icon?.light).toMatch(/^<svg /);
    expect(icon?.dark).toMatch(/^<svg /);
    expect(icon?.light).not.toBe(icon?.dark);
  });
});

describe('withBrandIcons', () => {
  it('adds icons where slugs resolve and leaves other items untouched', () => {
    const items = [
      { name: 'Figma', iconSlug: 'figma' },
      { name: 'Legacy', iconSlug: null },
    ];
    const [figma, legacy] = withBrandIcons(items);
    expect(figma.icon?.light).toMatch(/^<svg /);
    expect(legacy).toBe(items[1]);
    expect(legacy).not.toHaveProperty('icon');
  });
});
