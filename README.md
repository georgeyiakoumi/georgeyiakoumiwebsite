# George Yiakoumi Portfolio

A modern, full-stack portfolio website showcasing design and development work. Built with Next.js 15 and powered by a headless Strapi CMS, featuring smooth animations, dark mode, and a fully responsive design.

## Features

- **Dynamic Content Management**: All portfolio projects, about page content, and contact information managed through Strapi CMS
- **Media Gallery**: Projects support mixed media galleries with images and auto-playing videos distributed between content sections
- **Rich Text Rendering**: Custom renderer supporting nested lists, formatting, embedded images, code blocks, and more
- **Responsive Design**: Mobile-first approach with seamless adaptation across all screen sizes
- **Dark Mode**: System-aware theme switching with persistent user preference
- **Smooth Animations**: Interactive animated icons, smooth transitions, scroll-triggered video playback, and scroll-aware UI hiding on mobile
- **Code Blocks**: Syntax-highlighted code snippets in project pages using Shiki with light/dark theme support
- **Share Bar**: Copy link, native share (mobile), and LinkedIn share on all project pages
- **Comparison Slider**: Before/after image comparison with V1 (overlay) and V2 (track below) variants
- **Type-Safe**: Full TypeScript integration across frontend and API layer
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Optimized Performance**: ISR caching with webhook-based revalidation for low server costs and real-time updates

## Getting Started

### Prerequisites

- Node.js 22.15.1 (managed via nvm)
- Strapi CMS instance running (configure via environment variables)

### Environment Variables

#### Frontend (.env.local)

Create a `.env.local` file in the project root:

```bash
# Strapi CMS
STRAPI_API_URL=your_strapi_url
STRAPI_API_TOKEN=your_api_token

# Cloudflare API (optional - for manual cache purging)
CLOUDFLARE_ZONE_ID=your_zone_id
CLOUDFLARE_API_TOKEN=your_api_token
```

#### CMS (cms/.env)

The CMS requires its own environment file at `cms/.env`:

```bash
HOST=0.0.0.0
PORT=1337
APP_KEYS=your_app_keys
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt
JWT_SECRET=your_jwt_secret

# Database (PostgreSQL/Supabase)
DATABASE_CLIENT=postgres
DATABASE_HOST=your_db_host
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_db_password
DATABASE_SSL=true

# Cloudinary (for media storage)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
```

**Note:** The `cms/.env` file is gitignored for security.

### Development Servers

#### Frontend (Next.js)

Run the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

#### CMS (Strapi)

The CMS runs separately from the frontend. You can start it in two ways:

**Option 1: From project root**
```bash
npm run cms:dev
```

**Option 2: From cms directory**
```bash
cd cms
npm run develop
```

Open [http://localhost:1337/admin](http://localhost:1337/admin) to access the Strapi admin panel.

**Troubleshooting:**
- If you get "Port 1337 is already used by another application", kill the existing process:
  ```bash
  lsof -ti:1337 | xargs kill -9
  ```
  Then try starting Strapi again.

### Storybook

Run Storybook to view and develop UI components in isolation:

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006) to view the component library.

**Storybook includes:**
- All shadcn/ui components with interactive controls
- Custom components (Section, LogoItem, ProjectCard, etc.)
- Theme switching for testing dark mode
- Accessibility testing tools
- Multiple viewports for responsive testing

**Deployment:**
Storybook can be deployed separately to showcase the component library:
```bash
npm run build-storybook
netlify deploy --dir=storybook-static --prod
```

## Available Scripts

### Frontend
- `npm run dev` - Start Next.js development server (port 3000)
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

### CMS (from project root)
- `npm run cms:dev` - Start Strapi development server (port 1337)
- `npm run cms:build` - Build Strapi admin panel
- `npm run cms:start` - Start Strapi in production mode

### Storybook
- `npm run storybook` - Start Storybook dev server (port 6006)
- `npm run build-storybook` - Build Storybook for production

## Tech Stack

### Frontend
- **Framework**: Next.js 15.5.2 with React 19.1.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.13
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React + @animate-ui/icons for animated components
- **Syntax Highlighting**: Shiki (VS Code engine, server-rendered, dual theme)
- **Animation**: CSS transitions and @animate-ui interactive animations
- **Forms**: React Hook Form + Zod
- **Theme**: next-themes (dark mode support)
- **Development**: Storybook 8.5 for component development and documentation

### CMS
- **Headless CMS**: Strapi 5.8.1
- **Content Types**: Projects (client, personal, article), About Page, Contact Info, Tools
- **Dynamic Zone Blocks**: Rich text, images, video, carousel, comparison slider (V1/V2), stats, code blocks
- **Media**: Cloudinary integration for images and video

## Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── about/               # About page with GSAP animations
│   ├── portfolio/           # Portfolio listing and detail pages
│   │   └── [slug]/         # Dynamic project pages
│   ├── contact/            # Contact page
│   └── layout.tsx          # Root layout with navigation
├── components/             # React components
│   ├── ui/                # shadcn/ui components (Typography, AnimatedTabs, etc.)
│   ├── project-blocks/    # Dynamic zone block renderers (code, image, video, etc.)
│   ├── legacy/            # V1 components kept for backwards compatibility
│   └── ...                # Custom components (ShareBar, ThemedLogo, etc.)
├── hooks/                 # Custom React hooks
│   ├── use-mobile.ts
│   └── use-scroll-visibility.ts  # Shared scroll-aware hide/show context
├── lib/                   # Utilities and integrations
│   ├── strapi.ts         # Strapi API client
│   ├── strapi-queries.ts # Content fetching functions
│   └── strapi-blocks-renderer.tsx # Rich text renderer
└── public/               # Static assets
```

## Content Management

Portfolio content is managed through Strapi CMS with the following content types:

- **Projects**: Portfolio case studies with rich text sections (Challenge, Solution, Role, Impact, Takeaway), images, tags, and external links
- **About Page**: Personal bio, skills, and work experience
- **Contact Info**: Contact details and social links

### Rich Text Features

The custom rich text renderer supports:
- Paragraphs with text formatting (bold, italic, underline, strikethrough, code)
- Nested bullet and ordered lists
- Headings (h1-h6)
- Blockquotes
- Code blocks
- Links
- Embedded images within content sections

## Pages

- **Home** (`/`) - Landing page with bio, latest project, business logos, tools, and contact CTA
- **Projects** (`/projects`) - Filterable project listing with animated tabs (Client Work, Personal Projects, Articles)
- **Project Details** (`/project/[slug]`) - Individual case studies with dynamic zone blocks (rich text, images, video, comparison sliders, code blocks, stats) and share bar
- **Contact** (`/contact`) - Contact form with validation and toast notifications (using Sonner)

## Caching Strategy

This project uses an optimized caching strategy that balances performance with real-time content updates:

### ISR with Webhook-Based Revalidation

- **Server-Side Caching**: Pages are cached for 1 hour using Next.js ISR (`revalidate: 3600`)
- **On-Demand Revalidation**: Strapi webhooks trigger instant cache clearing when content is published
- **Browser Caching**: HTML pages use `Cache-Control: max-age=0, must-revalidate` to prevent stale browser cache
- **Static Assets**: JS, CSS, and images cached for 1 year with `immutable` flag for optimal performance

### Benefits

✅ **Low server costs** - Most requests served from cache (minimal Netlify function usage)
✅ **Real-time updates** - Content changes appear immediately after publishing in Strapi
✅ **No manual cache clearing** - Webhooks handle cache invalidation automatically
✅ **Optimal performance** - Static assets heavily cached while HTML stays fresh

### How It Works

1. Normal visitors see cached pages (served from CDN, no function calls)
2. You publish content in Strapi → webhook fires to `/api/revalidate`
3. Next.js clears cache for affected pages using `revalidatePath()`
4. Next request regenerates page with fresh content from Strapi
5. Subsequent visitors see the updated cached content

For webhook setup instructions, see `claude-guides/WEBHOOK_SETUP.md` (local development guide, not in repo).

## Deployment

This project is designed to be deployed on modern hosting platforms:

- **CDN**: Cloudflare (DNS and edge caching in front of Netlify)
- **Frontend**: Netlify (with `@netlify/plugin-nextjs`)
- **CMS**: Render (Strapi 5)
- **Database**: Supabase (PostgreSQL)
- **Media**: Cloudinary CDN

### CDN Architecture

The site uses a **two-tier CDN architecture**:
1. **Cloudflare** - Primary CDN layer handling DNS and edge caching globally
2. **Netlify Edge** - Secondary CDN layer serving Next.js application

**Automated Cache Purging**: When code is pushed to `main`, GitHub Actions automatically:
1. Waits for Netlify deployment to complete
2. Purges Cloudflare cache for all main pages
3. Ensures fresh content is served globally

**Manual Cache Purging** (if needed):
```bash
# Purge Cloudflare cache for main pages (HTML only)
npm run purge:cloudflare

# Purge EVERYTHING (use sparingly - impacts CDN performance)
npm run purge:cloudflare:all
```

**Old Manual Method** (deprecated):
- Netlify: "Deploy without cache" in dashboard
- Cloudflare: https://dash.cloudflare.com → Caching → Purge Cache

### Environment Variables

**Frontend** (`.env.local` and Netlify):
- `STRAPI_API_URL` - Public Strapi API URL
- `STRAPI_API_TOKEN` - Server-side API token
- `REVALIDATE_SECRET` - Webhook authentication secret

**Cloudflare API** (for automated cache purging):
- `CLOUDFLARE_ZONE_ID` - Zone ID from Cloudflare dashboard (domain overview)
- `CLOUDFLARE_API_TOKEN` - API token with "Cache Purge" permission

**Setting up Cloudflare API**: See `claude-guides/CLOUDFLARE_SETUP.md` for complete step-by-step instructions (local guide, not in repo).

## Quality Standards

This project maintains high standards across 4 key areas:

1. **Accessibility** - 100/100 Lighthouse score, WCAG 2.1 AA compliant
2. **Performance** - 92/100 Lighthouse score, Core Web Vitals optimized
3. **SEO** - Comprehensive metadata, sitemap, structured data
4. **Testing** - Unit, component, and E2E test coverage with CI/CD

**All code changes must maintain these standards.** See [CLAUDE.md](CLAUDE.md) for complete rules and guidelines.

### Pre-commit Checklist

Before committing changes:

```bash
npm run lint          # ESLint check
npx tsc --noEmit      # TypeScript check
npm run test:run      # Unit tests
npm run test:e2e      # E2E tests (optional for minor changes)
npm run build         # Production build
```

GitHub Actions CI will automatically verify these checks on all PRs.

## Documentation

For detailed technical documentation and development guidelines, see [CLAUDE.md](CLAUDE.md).
