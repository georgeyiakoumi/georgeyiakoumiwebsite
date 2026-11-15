# George Yiakoumi Portfolio Project Documentation

## Project Overview
This is a personal portfolio website built with modern web technologies to showcase design and development work.

## Tech Stack

### Framework
- **Next.js 16** - React framework with App Router (Turbopack in dev)
- **React 19** - UI library
- **TypeScript** - All code is TypeScript (`.ts`/`.tsx`, scripts as `.mts`)

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS; theme tokens are OKLCH CSS variables in `app/globals.css`
- **shadcn/ui** - Component source in `components/ui/` (built on Radix UI)
- **Radix UI** - Unstyled, accessible primitives (`radix-ui` package)
- **class-variance-authority** / **tailwind-merge** - Variants and class merging via `cn()`

### Icons
- **Lucide React** - Static icons
- **Animated icons** (`components/ui/` files such as `at-sign.tsx`, `chevron-right.tsx`) - from the `@lucide-animated` shadcn registry, built on **motion** (`motion/react`). Each exposes a ref handle with `startAnimation()` / `stopAnimation()`, typically triggered on hover.
- **Brand logos** (stack section, tool badges) - theSVG via Iconify, with curated overrides. See [docs/BRAND_ICONS.md](docs/BRAND_ICONS.md).

### Animation
- **GSAP** (+ ScrollTrigger) - Scroll-driven and timeline animation (the scroll container is `<main>`, not `window`)
- **lottie-react** - Footer logo animation and Lottie project blocks
- **CSS / Tailwind transitions** - Theme switching and UI state changes

### Theme & Dark Mode
- **next-themes** - System-aware dark mode with a manual toggle (top-right)

### Syntax Highlighting
- **Shiki** - Server-side syntax highlighting using VS Code's engine
  - Uses `createHighlighter` singleton pattern (not `codeToHtml`) for tree-shaking
  - Only loads supported languages and 2 themes (github-dark, github-light)
  - Dual theme support matching light/dark mode

### Additional Libraries
- **Sonner** - Toast notifications
- **embla-carousel-react** - Carousels
- **recharts** - Data visualisation (stats blocks)
- **react-zoom-pan-pinch** - Zoomable images in project pages

### CMS (Content Management)
- **Strapi 5** - Headless CMS in `/cms` (separate Node.js app, Node 22)
- **PostgreSQL** - Database (Supabase)
- **Cloudinary** - Media storage; browser-loaded media is proxied through `/media/*` on our own domain
- Production and local CMS are fully isolated. See [docs/ENVIRONMENTS.md](docs/ENVIRONMENTS.md).

## Project Structure

```
├── app/                       # Next.js App Router
│   ├── page.tsx               # Homepage (hero, about, featured work, stack, companies, testimonials)
│   ├── projects/page.tsx      # Projects listing (filterable by type)
│   ├── project/[slug]/        # Case study pages
│   ├── article/[slug]/        # Article pages
│   ├── privacy/page.tsx       # Privacy notice
│   ├── api/revalidate/        # Strapi → ISR revalidation webhook
│   ├── layout.tsx             # Root layout
│   ├── sitemap.ts / robots.ts
│   └── globals.css            # Tailwind + theme tokens
├── components/
│   ├── ui/                    # shadcn/ui components + animated icons
│   ├── layout/                # Navigation, footer, section, theme provider, mode toggle
│   ├── home/                  # Homepage sections
│   ├── project/               # Project cards, case study layout, content blocks
│   ├── legacy/                # V1 comparison slider (still used by one project)
│   ├── brand-icon.tsx         # Light/dark brand logo renderer
│   └── logo-card.tsx          # Stack/company logo tile
├── lib/
│   ├── strapi.ts              # API client and media URL helpers
│   ├── strapi-queries.ts      # Data fetching + content types
│   ├── brand-icons.ts         # Brand logo resolution (+ brand-icons/overrides.ts)
│   ├── metadata.ts            # SEO metadata and JSON-LD
│   └── constants.ts           # Author, navigation, privacy date
├── hooks/                     # use-scroll-visibility, use-hero-animation, use-media-query, use-sticky-trigger
├── e2e/                       # Playwright tests (incl. privacy and brand-icon visibility checks)
├── scripts/                   # cms-db-pull.mts, purge-cloudflare.mjs
├── docs/                      # ENVIRONMENTS.md, BRAND_ICONS.md
├── cms/                       # Strapi 5 app (config, content types, bootstrap guards)
└── public/                    # Static assets (favicons, gy-logo)
```

## Key Features

### Navigation
- Fixed navigation menu (bottom-center on mobile, top-left on desktop)
- Labels visible on mobile as text-xs beneath icons in vertical layout
- Links: About, Projects, CV and Email (both from Strapi), LinkedIn, GitHub
- Footer logo (animated Lottie, bottom-right on desktop): opens a popover on desktop and a drawer on mobile, with copyright, tagline and the Privacy link
- **Scroll-aware visibility**: All fixed UI elements (nav, mode toggle, logo, back button) hide while scrolling on mobile and reappear after 150ms idle. Uses shared `ScrollVisibilityProvider` context with a single scroll listener. Desktop unaffected.

### Privacy
- No cookies, analytics or third-party requests from the visitor's browser. `e2e/privacy.spec.ts` fails if any page contacts another domain.
- Third-party iframes/embeds are not supported. Videos are Cloudinary uploads served via the `/media` proxy.

### Animations
- Animated icons triggered on hover via ref handles
- Smooth CSS transitions for theme switching and UI interactions
- Loading states with skeleton components

#### Animation Best Practices (Reference: emilkowal.ski/ui/7-practical-animation-tips)

**Core Principles:**
1. **Button Active States**: Apply `active:scale-[0.97]` for immediate tactile feedback on all interactive elements
2. **Natural Motion**: Never animate from `scale(0)` - start at `scale(0.9)` or higher for organic motion
3. **Tooltip Interactions**: First tooltip shows with delay; subsequent tooltips skip delay and animation using `data-instant` attribute
4. **Easing Strategy**:
   - Use `ease-out` for entering/exiting content (accelerates at start, feels responsive)
   - Target 180ms duration for most UI animations, never exceed 300ms
   - Prefer custom easing curves (easings.co) over browser defaults for refined motion
5. **Origin-Aware Animations**: Set `transform-origin` using CSS variables (e.g., `--radix-dropdown-menu-content-transform-origin`) so popovers/dropdowns scale from trigger point
6. **Speed as Priority**:
   - Fast animations improve perceived performance
   - Remove animations for frequently repeated interactions (delight becomes friction)
   - Faster spinners make loading feel quicker regardless of actual duration
7. **Blur Transitions**: Apply `filter: blur(2px)` during state transitions to mask imperfections and blend discrete states
8. **Responsive Breakpoints**: Hover effects must use `xl:hover:` prefix (1280px+) to prevent mobile/tablet interaction issues
9. **Compound Details**: Small unseen refinements aggregate to create polished, intentional interfaces

**Implementation Guidelines:**
- Keep animations smooth and performant - measure with Chrome DevTools Performance panel
- Test animations at different speeds and on lower-end devices
- Consider motion preferences using `prefers-reduced-motion` media query
- All hover effects and scale transforms should be desktop-only (xl breakpoint)

### Dark Mode
- System-aware dark mode with manual toggle
- **IMPORTANT**: Use `resolvedTheme` (not `theme`) from next-themes when checking current theme — `theme` returns `"system"` on first load, not the actual resolved value
- Persistent theme selection
- Smooth transitions without flicker

## Development Commands

### Frontend (Next.js)
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

### CMS (Strapi)
```bash
# Start CMS in development mode (from project root)
npm run cms:dev

# Build CMS (from project root)
npm run cms:build

# Copy production content into the local CMS (read-only against prod)
npm run cms:db:pull

# Run the website against the local CMS instead of production
npm run dev:local-cms
```

**Note**: The CMS runs on port 1337 by default. Access the admin panel at `http://localhost:1337/admin`

### Environments (read before touching the CMS)
**CRITICAL**: Production and local are fully separate. See [docs/ENVIRONMENTS.md](docs/ENVIRONMENTS.md).
- Always start the local CMS with `npm run cms:dev` (Node 22). Never run `strapi develop` or `strapi start` directly in `cms/`. There is no `cms/.env`, and production secrets never go in local files.
- The local CMS sets `CMS_ENV=local`: its config refuses any non-localhost database and any Cloudinary credentials, so uploads stay on disk and can't affect production media.
- Never write to production with direct SQL or `strapi transfer --to`. Use a temporary, scoped, expiring API token or the admin panel.
- Strapi drops columns for removed fields on deploy. Rehearse schema changes against a local copy (`npm run cms:db:pull`) first.

## Important Notes

### Netlify Function Usage
**CRITICAL: Always check Netlify function usage impact before implementing solutions**

This project is hosted on Netlify Free Tier with limited serverless function invocations per month. Before implementing any solution, ALWAYS verify it won't cause excessive function usage:

#### What Causes High Function Usage:
- `export const dynamic = "force-dynamic"` in pages (forces SSR on every request)
- `cache: 'no-store'` in fetch calls (bypasses caching, hits functions every time)
- Missing `revalidate` exports (defaults to always dynamic)
- Missing `generateStaticParams` for dynamic routes

#### Best Practices:
- Use ISR (Incremental Static Regeneration) with `revalidate: 3600` for most pages
- Use `generateStaticParams` for dynamic routes to pre-render at build time
- Default to `cache: 'force-cache'` for Strapi API calls
- Only use `cache: 'no-store'` when absolutely necessary (real-time data)
- Configure aggressive caching headers in [netlify.toml](netlify.toml) for static assets
- Use Next.js tags and `revalidatePath`/`revalidateTag` for on-demand revalidation

#### Current Configuration:
- Pages use ISR with 1-hour revalidation
- Strapi API calls default to `force-cache`
- Static assets cached for 1 year with immutable headers
- Using `@netlify/plugin-nextjs` (do NOT enable Netlify Prerender Extension)

### Current Status
- **Pages**: Homepage (about, featured work, stack, companies, testimonials), Projects listing, case study and article pages, Privacy
- **Contact**: Email (`mailto:`) and CV links from Strapi. There is no contact form.
- **CMS Integration**: Fully integrated with Strapi for all dynamic content
- **Responsive Design**: Fully responsive across all breakpoints (mobile, tablet, desktop)
- **Animations**: Interactive animated icons throughout, smooth CSS transitions

### Code Style
- Use TypeScript exclusively (.tsx/.ts files) - no JavaScript files
- Use Tailwind classes for styling
- Follow existing component patterns in components/ui
- No unnecessary comments in code
- Keep animations smooth and performant
- **Typography**: ALWAYS use the `Typography` component (`components/ui/typography.tsx`) for ALL text elements. Never use raw `<p>`, `<h1>`–`<h6>`, `<blockquote>`, `<figcaption>`, `<code>`, or `<span>` with text styling classes. Available variants: `h1`–`h6`, `p`, `lead`, `large`, `small`, `muted`, `figcaption`, `blockquote`, `overline`, `code`. Use the `as` prop to override the rendered HTML element when needed.

### Media Handling
- All media assets hosted on Cloudinary via Strapi
- **Images**: Use Next.js Image component with fill prop and sizes="100vw" for responsive images
- **Videos**: Use native HTML5 video element with Intersection Observer for auto-play on scroll
  - Videos auto-play when 50% visible, pause when out of view
  - Muted and looped for smooth background effect
  - No controls displayed for immersive experience
- Aspect ratios controlled via wrapper divs with Tailwind aspect-* utilities
- Support for responsive aspect ratios using breakpoint prefixes (sm:, md:, lg:, etc.)
- **Media Gallery**: Projects support mixed media (images + videos) distributed between content sections
  - Media items alternate between Challenge, Solution, Role, Impact sections
  - Gracefully handles variable number of media items (1-4+)

### Testing & Validation
- Always run `npm run lint` before committing
- Test dark mode toggle functionality
- Verify responsive design on mobile/tablet/desktop
- Check scroll animations performance

## Deployment Architecture

### CDN Stack
The site uses a **two-tier CDN architecture**:

1. **Cloudflare** (Primary CDN)
   - DNS management
   - Global edge caching
   - DDoS protection
   - SSL/TLS termination

2. **Netlify Edge** (Secondary CDN)
   - Next.js application hosting
   - Serverless functions
   - Automatic deployments from GitHub

**Automated Cache Purging**:
GitHub Actions workflow automatically purges Cloudflare cache on every push to `main`:
1. Waits 60 seconds for Netlify deployment
2. Runs `npm run purge:cloudflare` to clear main pages
3. Ensures fresh content served globally

**Manual Cache Purging** (when needed):
```bash
npm run purge:cloudflare      # Purge main pages (recommended)
npm run purge:cloudflare:all  # Purge everything (use sparingly)
```

**Required Environment Variables** (GitHub Secrets & local `.env.local`):
- `CLOUDFLARE_ZONE_ID` - From Cloudflare dashboard
- `CLOUDFLARE_API_TOKEN` - API token with "Cache Purge" permission

### Hosting Infrastructure
- **Frontend**: Netlify with `@netlify/plugin-nextjs`
- **CMS**: Render (Strapi 5)
- **Database**: Supabase (PostgreSQL)
- **Media Storage**: Cloudinary CDN

### Cloudflare Configuration for Next.js

**CRITICAL: Cloudflare settings MUST be configured correctly to avoid conflicts with Next.js optimization**

#### Recommended Speed Settings:

**✅ ENABLED (Recommended)**:
- **HTTP/2** - Modern protocol for faster page loads
- **HTTP/3 (with QUIC)** - Latest protocol version for improved performance
- **Early Hints** - Preload critical resources before full response
- **Speed Brain** - Beta feature for predictive prefetching (optional)
- **Auto Minify** - HTML, CSS, JS minification (safe for Next.js production builds)

**❌ DISABLED (Required)**:
- **Rocket Loader** - OFF (breaks React hydration and Next.js client-side JavaScript)
- **Cloudflare Fonts** - OFF (conflicts with Next.js `next/font/google` optimization, causes double-optimization)
- **Mirage** - OFF (not compatible with Next.js Image component)

#### Caching Settings:

**Browser Cache TTL**: Set to **30 minutes** (or max 1 hour)
- Default 4+ hours causes stale asset issues during deployments
- Shorter TTL ensures users get fresh content faster
- Located in: Speed → Optimization → Content Optimization → Browser Cache TTL

**Cloudflare Cache Level**: Standard
- Let Cloudflare determine what to cache
- Next.js assets have proper cache headers

**Page Rules** (already configured):
```
Rule 1: georgeyiakoumi.com/_next/*
- Cache Level: Bypass
- Purpose: Prevent Cloudflare from caching Next.js dynamic routes
```

#### Why These Settings Matter:

1. **Rocket Loader** injects JavaScript that delays execution, breaking React's hydration process
2. **Cloudflare Fonts** tries to optimize Google Fonts that Next.js already optimizes via `next/font`, causing:
   - Double font loading
   - FOUT (Flash of Unstyled Text)
   - Potential MIME type conflicts
3. **High Browser Cache TTL** means users cache old JavaScript chunks for hours, causing MIME type errors and 404s when new deployments change chunk hashes

#### Propagation Time:
- Setting changes typically propagate within **1-5 minutes**
- In rare cases, can take up to **15 minutes** for all edge nodes to update
- Clear browser cache after making Cloudflare changes to test properly

## Environment Requirements
- Node.js 22.15.1 (via nvm)
- npm package manager

## Git Repository
Project uses Git for version control with .gitignore configured for both Next.js and Strapi.

### Monorepo Structure
- Frontend and CMS are in the same repository
- CMS lives in `/cms` folder with its own `package.json` and `node_modules`
- CMS database, uploads, and build artifacts are gitignored
- CMS `.env` file contains sensitive credentials and is gitignored

## CMS Content Types
The Strapi CMS includes the following content types:
- **Projects** - Portfolio case studies with:
  - Rich text content sections (Challenge, Solution, Role, Impact, Takeaway)
  - Media gallery field supporting multiple images and videos
  - Dynamic zone blocks: rich-text, image, video (Cloudinary uploads only), carousel, comparison-slider (V1 legacy + V2), stats, code-block, lottie
  - Hero image, thumbnail, tags, dates, client info, tools, snapshot items
  - Type enum: `client`, `personal`, `article`
  - Slug for URL routing
- **Project Tags** - Tags for projects
- **About** - Homepage about content, stack heading, contact copy, CV URL, email
- **Global SEO** - Site-wide SEO metadata
- **Tools** - Stack section and project tool badges (`iconSlug` / `iconSlugDark` for brand logos)
- **Businesses** (+ Business Sectors, Business Tags) - Companies section
- **Testimonials** - Testimonials section

## Quality Standards & Best Practices

This project has undergone comprehensive optimization across 4 key phases. **ALL future code changes MUST respect and honor these established patterns and rules.**

### Phase 1: Accessibility (100/100 Score Achieved)

**WCAG 2.1 Compliance - Level AA (AAA where possible)**

#### Critical Rules:
1. **ARIA Attributes**: All interactive components MUST have valid ARIA attributes
   - Tabs MUST have corresponding TabsContent elements
   - aria-controls MUST reference existing DOM elements
   - Never use ARIA on non-interactive elements
2. **Touch Targets**: Minimum 48px × 48px for all interactive elements
   - Carousel dots, buttons, links all meet this standard
   - Use padding or pseudo-elements to expand hit areas without visual size change
3. **Keyboard Navigation**: All interactive elements MUST be keyboard accessible
   - Focus visible on all interactive elements
   - Tab order follows logical flow
   - Escape key closes modals/dropdowns
4. **Semantic HTML**: Use proper landmarks and heading hierarchy
   - One h1 per page
   - No heading level skips (h1 → h2 → h3, never h1 → h3)
   - nav, main, section, article used appropriately
5. **Form Labels**: Every input MUST have an associated label
   - Use proper <label> with htmlFor attribute
   - Placeholder is NOT a substitute for label
6. **Alt Text**: All images MUST have descriptive alt text
   - Decorative images use empty alt=""
   - Functional images describe action/purpose
7. **Color Contrast**: Minimum 4.5:1 for text, 3:1 for UI components
   - Test both light and dark modes
   - Use tools like WebAIM Contrast Checker

**Testing**: Run Lighthouse accessibility audits before committing
```bash
npx lighthouse http://localhost:3000 --only-categories=accessibility --view
```

### Phase 2: Performance (92/100 Score Achieved)

**Core Web Vitals Targets:**
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

#### Critical Rules:
1. **Server Components First**: Default to Server Components
   - Only use "use client" when absolutely necessary (state, hooks, browser APIs)
   - Fetch data server-side in parallel using Promise.all()
   - Eliminates loading states and client-side waterfalls
2. **Resource Hints**: Always include for external resources
   - Browsers must only ever connect to the site's own domain (no third-party requests from the visitor)
   - Direct-to-browser Cloudinary media (video, SVG, fetch, raw img) goes through `getBrowserMediaURL()` → `/media/*` proxy in netlify.toml
   - `next/image` rasters stay on Cloudinary URLs (Netlify Image CDN fetches them server-side)
3. **Image Optimization**:
   - Use Next.js Image component with fill prop
   - Add fetchPriority="high" to LCP images (hero, above-fold)
   - Enable AVIF format in next.config.mjs
   - Blur placeholders for instant visual feedback
   - sizes="100vw" or specific sizes for responsive images
4. **Code Splitting & Lazy Loading**:
   - Dynamic imports for components not needed immediately
   - Animation components loaded lazily (AnimateIcon, etc.)
   - Use React.lazy() with Suspense boundaries
5. **Font Optimization**:
   - adjustFontFallback enabled to prevent layout shift
   - Preload critical font files
   - Font display: swap for faster FCP
6. **ISR Configuration**:
   - All pages use revalidate: 3600 (1 hour)
   - generateStaticParams for dynamic routes
   - cache: 'force-cache' for all Strapi API calls
   - Only use cache: 'no-store' when data must be real-time
7. **Bundle Optimization**:
   - modularizeImports for lucide-react and @radix-ui
   - Tree shaking enabled
   - Remove console logs in production
   - Extended image cache TTL (1 year)
8. **CSS Performance**:
   - willChange for animated properties
   - transform and opacity for 60fps animations
   - Avoid animating width, height, top, left

**Testing**: Run Lighthouse performance audits on production builds
```bash
npm run build
npx lighthouse http://localhost:3000 --only-categories=performance --view
```

### Phase 3: SEO (Comprehensive Implementation)

#### Critical Rules:
1. **Metadata**: Every page MUST export metadata or generateMetadata
   - title: Unique, descriptive (50-60 chars)
   - description: Compelling summary (150-160 chars)
   - openGraph: Images, URLs, type
   - twitter: Card type, images
2. **Structured Data**: JSON-LD on project pages
   - Schema.org CreativeWork for portfolio projects
   - Include name, description, image, datePublished, keywords
3. **Sitemap**: Auto-generated from routes
   - Dynamic sitemap.ts exports all static and dynamic pages
   - Updates automatically when projects added/removed
4. **Robots.txt**: Configured for optimal crawling
   - Allow all bots on public pages
   - Disallow admin, API routes, draft content
5. **Canonical URLs**: Prevent duplicate content issues
   - Set canonical in metadata for each page

**Files**:
- [app/sitemap.ts](app/sitemap.ts) - Dynamic sitemap generation
- [app/robots.ts](app/robots.ts) - Crawler configuration
- [lib/metadata.ts](lib/metadata.ts) - Reusable metadata utilities

### Phase 4: Testing (Comprehensive Coverage)

#### Critical Rules:
1. **Write Tests BEFORE Committing**: New features MUST include tests
   - Unit tests for utilities/functions
   - Component tests for UI components
   - E2E tests for critical user flows
2. **Test Pyramid**:
   - **Unit tests** (majority): Fast, isolated, focused
   - **Component tests**: Integration of component + children
   - **E2E tests** (fewer): Critical paths only (homepage, navigation, privacy/no third-party requests, brand-icon visibility)
3. **Coverage Requirements**:
   - Utilities: 100% coverage (small, pure functions)
   - Components: Test all props, variants, states
   - E2E: Cover happy path + critical error states
4. **Run Tests Before Committing**:
   ```bash
   npm run test:run  # Unit + component tests
   npm run test:e2e  # E2E tests
   ```
5. **Test Naming Conventions**:
   - Unit tests: `*.test.ts`
   - Component tests: `*.test.tsx`
   - E2E tests: `*.spec.ts` (in e2e/ directory)
6. **What to Test**:
   - ✅ Pure functions (utils, helpers)
   - ✅ Component rendering with different props
   - ✅ User interactions (clicks, typing, navigation)
   - ✅ Form validation and submission
   - ✅ Error states and loading states
   - ❌ Don't test implementation details
   - ❌ Don't test third-party libraries

**Testing Stack**:
- Vitest - Unit & component tests
- Playwright - E2E tests (Chromium only in CI for speed)
- React Testing Library - Component testing

See [TESTING.md](TESTING.md) for full documentation.

### GitHub Actions CI/CD

**Continuous Integration**: All PRs MUST pass CI checks before merging

The CI pipeline runs on every push and PR:
1. **Lint Check**: ESLint must pass (no errors)
2. **Type Check**: TypeScript compilation must succeed
3. **Unit Tests**: Vitest tests must pass
4. **E2E Tests**: Playwright tests must pass in Chromium
5. **Build**: Production build must succeed

**Configuration**: [.github/workflows/test.yml](.github/workflows/test.yml)

**Local Pre-commit Checklist**:
```bash
npm run lint          # ESLint check
npx tsc --noEmit      # TypeScript check
npm run test:run      # Unit tests
npm run test:e2e      # E2E tests
npm run build         # Production build
```

## Workflow: Starting Any Task or Issue

Before writing any code, follow this process for every task:

1. **Plan** — Define the problem clearly and outline the solution approach
2. **Create a Linear ticket** — Use the Linear MCP to create a ticket with the title, description (problem + solution), and appropriate priority
3. **Create a branch** — Use the `gitBranchName` returned by Linear (e.g. `george/geo-201-ticket-name`) to create and checkout a new git branch
4. **Work on the branch** — All code changes happen on that branch
5. **PR & merge** — When complete, create a PR referencing the Linear ticket

This applies to all feature work, bug fixes, and improvements — no matter how small.

## Summary: Making Changes to This Codebase

When implementing new features or fixing bugs:

1. ✅ **Accessibility First**: Ensure WCAG AA compliance (ARIA, keyboard nav, contrast)
2. ✅ **Performance Aware**: Use Server Components, optimize images, lazy load non-critical code
3. ✅ **SEO Complete**: Add metadata, structured data for new pages
4. ✅ **Test Coverage**: Write unit/component/E2E tests as appropriate
5. ✅ **CI Passing**: All checks must pass before merging
6. ✅ **Respect Animation Rules**: ≤300ms, ease-out, motion-reduce support

**These are not suggestions - they are requirements.** The quality bar has been set across these 4 phases and must be maintained.

### Reusable Components
- **AnimatedTabs** (`components/ui/animated-tabs.tsx`) — Shared animated clip-path tab switcher used on both homepage (tools) and projects page (type filter). Always use this instead of building custom tab UI.
- **ShareBar** (`components/share-bar.tsx`) — Copy link, native share (mobile only via pointer:coarse), LinkedIn share (desktop only). Renders on all project entry types.
- **ScrollVisibilityProvider** (`hooks/use-scroll-visibility.ts`) — Context provider with single shared scroll listener. All fixed UI elements consume `useScrollVisibility()` hook.

### Project Block Consistency
- All project blocks use consistent max-widths: `md:max-w-md lg:max-w-xl xl:max-w-2xl`
- All captions use `<Typography variant="figcaption">`
- Blocks wrap content in `<figure>` with `px-8 lg:px-0`

## Future Enhancements
1. Add more portfolio projects through Strapi CMS
2. Add page transitions between routes
3. Migrate UI primitives from Radix UI to Base UI