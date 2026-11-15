import { icons as thesvgColor } from "@iconify-json/thesvg-color";
import { getIconData, iconToHTML, iconToSVG, replaceIDs } from "@iconify/utils";

export interface BrandIcon {
  light: string;
  dark?: string;
}

export interface BrandIconSlugs {
  iconSlug?: string | null;
  iconSlugDark?: string | null;
}

export function getBrandIconSVG(slug: string | null | undefined): string | null {
  if (!slug) return null;
  const data = getIconData(thesvgColor, slug.trim());
  if (!data) return null;

  const { attributes, body } = iconToSVG(data, { height: "auto" });
  return iconToHTML(replaceIDs(body), {
    ...attributes,
    "aria-hidden": "true",
    focusable: "false",
  });
}

export function getBrandIcon({ iconSlug, iconSlugDark }: BrandIconSlugs): BrandIcon | undefined {
  const light = getBrandIconSVG(iconSlug);
  if (!light) return undefined;
  const dark = getBrandIconSVG(iconSlugDark);
  return dark ? { light, dark } : { light };
}

export function withBrandIcons<T extends BrandIconSlugs>(items: T[]): (T & { icon?: BrandIcon })[] {
  return items.map((item) => {
    const icon = getBrandIcon(item);
    return icon ? { ...item, icon } : item;
  });
}
