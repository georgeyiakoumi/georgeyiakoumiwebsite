import type { IconifyIcon } from "@iconify/types";

export interface BrandIconOverride {
  light?: IconifyIcon;
  dark?: IconifyIcon;
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
  // The black (#111) hedgehog head disappears on dark backgrounds.
  posthog: {
    dark: { width: 52, height: 28, body: "<path fill=\"url(#SVGUJK2UHTN)\" d=\"M10.74 7.16L4.54.8A2.66 2.66 0 0 0 0 2.66V7.5l10.74 11.18z\"/><path fill=\"url(#SVGXXkqtbOL)\" d=\"M9.19 28h1.55v-9.32L0 7.5v10.73z\"/><path fill=\"url(#SVGYxonFbIW)\" d=\"M0 25.41A2.6 2.6 0 0 0 2.58 28H9.2L0 18.23z\"/><path fill=\"url(#SVG61kXZRSd)\" d=\"M10.74 2.66v4.5l11.22 11.52V7.63L15.3.8a2.66 2.66 0 0 0-4.56 1.86\"/><path fill=\"url(#SVGWBoFabbN)\" d=\"M10.74 28h8.96l-8.96-9.32z\"/><path fill=\"url(#SVGF9riBetx)\" d=\"M10.74 7.16v11.52L19.7 28h2.26v-9.32z\"/><path fill=\"url(#SVGsr7PheXP)\" d=\"M21.96 2.67v4.96l11.3 11.6h.02V7.75L26.63.85a2.8 2.8 0 0 0-2-.85a2.67 2.67 0 0 0-2.67 2.67\"/><path fill=\"url(#SVGR522SdkB)\" d=\"M21.96 7.63v11.05L31.03 28h2.25v-8.75z\"/><path fill=\"url(#SVGm6AeMciT)\" d=\"M21.96 28h9.07l-9.07-9.32z\"/><path fill=\"#fff\" d=\"M51.66 25.22A1.9 1.9 0 0 0 50 23.33l-.34-.04c-1-.13-1.94-.6-2.65-1.33L33.28 7.75V28H49a2.66 2.66 0 0 0 2.67-2.67zM39.2 23.54h-.09a1.78 1.78 0 1 1 .1 0\"/><defs><linearGradient id=\"SVGsr7PheXP\" x1=\"21.96\" x2=\"33.28\" y1=\"9.62\" y2=\"9.62\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#ffd849\"/><stop offset=\".96\" stop-color=\"#fbae01\"/></linearGradient><linearGradient id=\"SVGR522SdkB\" x1=\"21.96\" x2=\"33.28\" y1=\"17.81\" y2=\"17.81\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#ffb700\"/><stop offset=\"1\" stop-color=\"#f9aa01\"/></linearGradient><linearGradient id=\"SVGm6AeMciT\" x1=\"21.96\" x2=\"31.03\" y1=\"23.34\" y2=\"23.34\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#ff9500\"/><stop offset=\"1\" stop-color=\"#f8aa00\"/></linearGradient><linearGradient id=\"SVG61kXZRSd\" x1=\"10.74\" x2=\"21.96\" y1=\"9.34\" y2=\"9.34\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#ff651e\"/><stop offset=\"1\" stop-color=\"#e4400a\"/></linearGradient><linearGradient id=\"SVGWBoFabbN\" x1=\"10.74\" x2=\"19.7\" y1=\"23.34\" y2=\"23.34\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#c42c00\"/><stop offset=\"1\" stop-color=\"#d63600\"/></linearGradient><linearGradient id=\"SVGF9riBetx\" x1=\"10.74\" x2=\"21.96\" y1=\"17.58\" y2=\"17.58\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#ef3c00\"/><stop offset=\"1\" stop-color=\"#d63601\"/></linearGradient><linearGradient id=\"SVGUJK2UHTN\" x1=\"0\" x2=\"10.74\" y1=\"9.34\" y2=\"9.34\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#3f80ff\"/><stop offset=\"1\" stop-color=\"#084fe0\"/></linearGradient><linearGradient id=\"SVGXXkqtbOL\" x1=\"0\" x2=\"10.74\" y1=\"17.75\" y2=\"17.75\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#0255ff\"/><stop offset=\"1\" stop-color=\"#0145d2\"/></linearGradient><linearGradient id=\"SVGYxonFbIW\" x1=\"0\" x2=\"9.19\" y1=\"23.11\" y2=\"23.11\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#0041c6\"/><stop offset=\"1\" stop-color=\"#0045d0\"/></linearGradient></defs>" },
  },
};
