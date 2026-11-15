import { icons as thesvgColor } from "@iconify-json/thesvg-color";
import type { IconifyIcon } from "@iconify/types";
import { getIconData, iconToHTML, iconToSVG, replaceIDs } from "@iconify/utils";
import { BRAND_ICON_OVERRIDES, type BrandIconOverride, type Recolor } from "./brand-icons/overrides";

export interface BrandIcon {
  light: string;
  dark?: string;
}

export interface BrandIconSlugs {
  iconSlug?: string | null;
  iconSlugDark?: string | null;
}

type Overrides = Record<string, BrandIconOverride>;

function toHTML(data: IconifyIcon) {
  const { attributes, body } = iconToSVG(data, { height: "auto" });
  return iconToHTML(replaceIDs(body), {
    ...attributes,
    "aria-hidden": "true",
    focusable: "false",
  });
}

export function recolor(data: IconifyIcon, colours: Recolor, slug: string): IconifyIcon {
  let body = data.body;
  for (const [from, to] of Object.entries(colours)) {
    const pattern = new RegExp(`(fill|stroke|stop-color)="${from}"`, "gi");
    if (!pattern.test(body)) {
      throw new Error(`Brand icon override "${slug}": colour ${from} not found. theSVG artwork may have changed.`);
    }
    body = body.replace(pattern, `$1="${to}"`);
  }
  return { ...data, body };
}

function libraryIcon(slug: string) {
  return getIconData(thesvgColor, slug) ?? undefined;
}

function resolveLight(slug: string, override: BrandIconOverride | undefined) {
  if (override?.light) return override.light;
  const data = libraryIcon(slug);
  if (!data) return undefined;
  return override?.recolor ? recolor(data, override.recolor, slug) : data;
}

function resolveDark(slug: string, override: BrandIconOverride | undefined, darkSlug: string | undefined, overrides: Overrides) {
  if (override?.dark) return override.dark;
  if (override?.darkRecolor) {
    const data = libraryIcon(slug);
    return data ? recolor(data, override.darkRecolor, slug) : undefined;
  }
  // A curated light logo (usually currentColor) is authoritative in both modes.
  if (override?.light) return undefined;
  return darkSlug ? resolveLight(darkSlug, overrides[darkSlug]) : undefined;
}

const normalise = (slug: string | null | undefined) => slug?.trim() || undefined;

export function getBrandIconSVG(slug: string | null | undefined, overrides: Overrides = BRAND_ICON_OVERRIDES): string | null {
  const key = normalise(slug);
  if (!key) return null;
  const data = resolveLight(key, overrides[key]);
  return data ? toHTML(data) : null;
}

export function getBrandIcon({ iconSlug, iconSlugDark }: BrandIconSlugs, overrides: Overrides = BRAND_ICON_OVERRIDES): BrandIcon | undefined {
  const key = normalise(iconSlug);
  if (!key) return undefined;
  const override = overrides[key];

  const light = resolveLight(key, override);
  if (!light) return undefined;
  const dark = resolveDark(key, override, normalise(iconSlugDark), overrides);
  return dark ? { light: toHTML(light), dark: toHTML(dark) } : { light: toHTML(light) };
}

export function withBrandIcons<T extends BrandIconSlugs>(items: T[]): (T & { icon?: BrandIcon })[] {
  return items.map((item) => {
    const icon = getBrandIcon(item);
    return icon ? { ...item, icon } : item;
  });
}
