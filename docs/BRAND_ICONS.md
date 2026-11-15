# Brand icons (stack logos)

Tool logos in the stack section and on project tool badges come from three places, checked in this order:

1. **Curated overrides:** `lib/brand-icons/overrides.ts`, for the few logos the library gets wrong.
2. **theSVG Color:** the `@iconify-json/thesvg-color` package (pinned), for everything else.
3. **Uploaded image:** the Tool's `image` field in Strapi, as a last-resort fallback.

All logos are rendered server-side as inline SVG. No icon data reaches the browser, and no logo is fetched at runtime.

## Adding a tool (usually no code)

1. In Strapi, create the Tool and set **`iconSlug`** to the theSVG name, e.g. `figma`. Browse names at <https://icon-sets.iconify.design/thesvg-color/>.
2. If theSVG ships separate versions, use the one meant for light backgrounds as `iconSlug` and the other as **`iconSlugDark`**, e.g. `github-light` / `github-dark`. **Check both by eye.** The naming is inconsistent: Miro's `-light` is white.
3. Preview locally (`npm run cms:db:pull`, `npm run cms:dev`, `npm run dev:local-cms`). Then run `npx playwright test e2e/brand-icons.spec.ts`, which fails if any logo disappears in light or dark mode.

## When a logo is wrong, add an override

Add an override when theSVG's logo is outdated, invisible in one mode, or off-brand. Key it by the **same slug** the CMS uses, so no content changes.

```ts
// lib/brand-icons/overrides.ts
render: {
  // Monochrome: currentColor follows the site's text colour in light AND dark mode.
  light: { width: 24, height: 24, body: '<g fill="currentColor">…</g>' },
},
posthog: {
  // Keep theSVG's light logo; supply only a dark-mode version.
  dark: { width: 52, height: 28, body: '…' },
},
```

- `light` replaces the logo everywhere. Prefer `currentColor` for single-colour marks.
- `dark` adds or replaces the dark-mode version.
- Source the artwork from the brand's own press kit where possible, otherwise from theSVG, svgl or Simple Icons. Copy it in as a fixed string, so a package update can't change it.
- Add a unit test in `lib/brand-icons.test.ts` and confirm the e2e visibility check passes.

Current overrides: **Render** (monochrome; theSVG's is black on black in dark mode), **Linear** (monochrome, per Linear's current brand guidance), **PostHog** (dark version with a white hedgehog head), **Pro Tools** (2019 purple `#7826E7`; theSVG still has the pre-2019 green).
