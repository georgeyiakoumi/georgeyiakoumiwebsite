import { icons as thesvgColor } from "@iconify-json/thesvg-color";
import type { IconifyIcon } from "@iconify/types";
import { getIconData, iconToHTML, iconToSVG, replaceIDs } from "@iconify/utils";
import { BRAND_ICON_OVERRIDES, type BrandIconOverride } from "./brand-icons/overrides";

export interface BrandIcon {
  light: string;
  dark?: string;
}

export interface BrandIconSlugs {
  iconSlug?: string | null;
  iconSlugDark?: string | null;
}

function toHTML(data: IconifyIcon) {
  const { attributes, body } = iconToSVG(data, { height: "auto" });
  return iconToHTML(replaceIDs(body), {
    ...attributes,
    "aria-hidden": "true",
    focusable: "false",
  });
}

export function getBrandIconSVG(
  slug: string | null | undefined,
  overrides: Record<string, BrandIconOverride> = BRAND_ICON_OVERRIDES
): string | null {
  if (!slug) return null;
  const key = slug.trim();
  const override = overrides[key]?.light;
  if (override) return toHTML(override);
  const data = getIconData(thesvgColor, key);
  return data ? toHTML(data) : null;
}

export function getBrandIcon(
  { iconSlug, iconSlugDark }: BrandIconSlugs,
  overrides: Record<string, BrandIconOverride> = BRAND_ICON_OVERRIDES
): BrandIcon | undefined {
  const light = getBrandIconSVG(iconSlug, overrides);
  if (!light) return undefined;

  const curatedDark = iconSlug ? overrides[iconSlug.trim()]?.dark : undefined;
  const dark = curatedDark ? toHTML(curatedDark) : getBrandIconSVG(iconSlugDark, overrides);
  return dark ? { light, dark } : { light };
}

export function withBrandIcons<T extends BrandIconSlugs>(items: T[]): (T & { icon?: BrandIcon })[] {
  return items.map((item) => {
    const icon = getBrandIcon(item);
    return icon ? { ...item, icon } : item;
  });
}
