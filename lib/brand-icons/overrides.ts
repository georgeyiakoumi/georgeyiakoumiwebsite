import type { IconifyIcon } from "@iconify/types";

export type Recolor = Record<string, string>;

export interface BrandIconOverride {
  /** Replaces the logo in both modes (use currentColor for single-colour marks). */
  light?: IconifyIcon;
  /** Adds or replaces the dark-mode logo. */
  dark?: IconifyIcon;
  /** Recolours theSVG's logo, e.g. a brand refresh. Fails if a colour isn't found. */
  recolor?: Recolor;
  /** Dark-mode version made by recolouring theSVG's logo. */
  darkRecolor?: Recolor;
}

// Curated logos that replace or complement theSVG where its version is wrong.
// Keyed by the same slug the CMS uses. Monochrome logos use currentColor, so they
// follow the site text colour in light and dark mode. See docs/BRAND_ICONS.md.
export const BRAND_ICON_OVERRIDES: Record<string, BrandIconOverride> = {
  // theSVG has no fill (renders black) and no dark variant.
  render: {
    light: { width: 24, height: 24, body: "<g fill=\"currentColor\"><path d=\"M18.263.007c-3.121-.147-5.744 2.109-6.192 5.082c-.018.138-.045.272-.067.405c-.696 3.703-3.936 6.507-7.827 6.507a7.9 7.9 0 0 1-3.825-.979a.202.202 0 0 0-.302.178V24H12v-8.999c0-1.656 1.338-3 2.987-3h2.988c3.382 0 6.103-2.817 5.97-6.244c-.12-3.084-2.61-5.603-5.682-5.75\"/></g>" },
  },
  // Linear now presents its mark in monochrome; theSVG ships the old #5E6AD2.
  linear: {
    light: { width: 100, height: 100, body: "<path fill=\"currentColor\" d=\"M1.225 61.523c-.222-.949.908-1.546 1.597-.857l36.512 36.512c.69.69.092 1.82-.857 1.597c-18.425-4.323-32.93-18.827-37.252-37.252M.002 46.889a1 1 0 0 0 .29.76L52.35 99.71c.201.2.478.307.76.29c2.37-.149 4.695-.46 6.963-.927c.765-.157 1.03-1.096.478-1.648L2.576 39.448c-.552-.551-1.491-.286-1.648.479a50 50 0 0 0-.926 6.962M4.21 29.705a.99.99 0 0 0 .208 1.1l64.776 64.776a.99.99 0 0 0 1.1.208a50 50 0 0 0 5.185-2.684a.98.98 0 0 0 .183-1.54L8.436 24.336a.98.98 0 0 0-1.541.183a50 50 0 0 0-2.684 5.185Zm8.448-11.631a.986.986 0 0 1-.045-1.354C21.78 6.46 35.111 0 49.952 0C77.592 0 100 22.407 100 50.048c0 14.84-6.46 28.172-16.72 37.338a.986.986 0 0 1-1.354-.045L12.659 18.074Z\"/>" },
  },
  // Pro Tools rebranded to purple (#7826E7) in 2019; theSVG still ships the old green.
  // Colour taken from Avid's official PT2019 icon (Wikimedia Commons, CC BY 4.0).
  "pro-tools": {
    recolor: { "#7acb10": "#7826E7" },
  },
  // The black (#111) hedgehog head disappears on dark backgrounds.
  posthog: {
    darkRecolor: { "#111": "#fff" },
  },
};
