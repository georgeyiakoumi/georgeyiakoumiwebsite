import { test, expect, type Page } from '@playwright/test'
import { getEntryPaths } from './entries'

/**
 * Media integrity tests — verify images load correctly across the site.
 *
 * Catches:
 * - Broken image URLs (404s, corrupted responses)
 * - Cloudinary transformation errors (e.g. f_auto on SVGs)
 * - Missing f_auto,q_auto on raster images
 */

const CLOUDINARY_UPLOAD_PATTERN = /\/upload\//
const OPTIMISATION_PATTERN = /\/upload\/f_auto,q_auto\//
const SVG_EXTENSIONS = ['.svg']

interface ImageInfo {
  src: string
  alt: string
}

/** Collect all rendered <img> src/alt pairs from the page. */
async function getRenderedImages(page: Page): Promise<ImageInfo[]> {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll('img'))
      .filter((img) => !!img.src)
      .map((img) => ({ src: img.src, alt: img.alt || '' }))
  })
}

/** Check that a URL returns a 200 and a valid image content-type. */
async function assertImageLoads(page: Page, src: string) {
  const response = await page.request.get(src)
  expect(
    response.status(),
    `Image failed to load (${response.status()}): ${src}`
  ).toBe(200)

  const contentType = response.headers()['content-type'] ?? ''
  expect(
    contentType,
    `Unexpected content-type "${contentType}" for image: ${src}`
  ).toMatch(/^image\//)
}

function isSvgUrl(src: string): boolean {
  try {
    const pathname = new URL(src).pathname
    return SVG_EXTENSIONS.some((ext) => pathname.endsWith(ext))
  } catch {
    return false
  }
}

function isCloudinaryUrl(src: string): boolean {
  return CLOUDINARY_UPLOAD_PATTERN.test(src)
}

/** Find a project URL from the homepage (featured work) or projects listing. */
async function findProjectUrl(page: Page): Promise<string | null> {
  // Try homepage first (featured work cards are ISR-cached)
  await page.goto('/', { waitUntil: 'networkidle' })
  const homeLink = page.locator('a[href^="/project/"]').first()
  if ((await homeLink.count()) > 0) {
    return await homeLink.getAttribute('href')
  }

  // Fall back to projects listing
  await page.goto('/projects', { waitUntil: 'networkidle' })
  const listingLink = page.locator('a[href^="/project/"]').first()
  if ((await listingLink.count()) > 0) {
    return await listingLink.getAttribute('href')
  }

  return null
}

// ---------------------------------------------------------------------------
// Homepage
// ---------------------------------------------------------------------------

test.describe('Media integrity — Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
  })

  test('all images load with 200 and valid content-type', async ({ page }) => {
    const images = await getRenderedImages(page)
    expect(images.length, 'Expected at least one image on the homepage').toBeGreaterThan(0)

    for (const img of images) {
      await assertImageLoads(page, img.src)
    }
  })

  test('Cloudinary raster images include f_auto,q_auto', async ({ page }) => {
    const images = await getRenderedImages(page)
    const rasterCloudinary = images.filter(
      (img) => isCloudinaryUrl(img.src) && !isSvgUrl(img.src)
    )

    for (const img of rasterCloudinary) {
      expect(
        img.src,
        `Raster image missing f_auto,q_auto optimisation: ${img.src}`
      ).toMatch(OPTIMISATION_PATTERN)
    }
  })

  test('Cloudinary SVGs do NOT include f_auto,q_auto', async ({ page }) => {
    const images = await getRenderedImages(page)
    const svgCloudinary = images.filter(
      (img) => isCloudinaryUrl(img.src) && isSvgUrl(img.src)
    )

    for (const img of svgCloudinary) {
      expect(
        img.src,
        `SVG should not have f_auto,q_auto (corrupts rendering): ${img.src}`
      ).not.toMatch(OPTIMISATION_PATTERN)
    }
  })
})

// ---------------------------------------------------------------------------
// Project detail page
// ---------------------------------------------------------------------------

test.describe('Media integrity — Project page', () => {
  let projectUrl: string | null

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    projectUrl = await findProjectUrl(page)
    await page.close()
  })

  test('all images load with 200 and valid content-type', async ({ page }) => {
    test.skip(!projectUrl, 'No project pages available (CMS may be offline)')
    await page.goto(projectUrl!, { waitUntil: 'networkidle' })

    const images = await getRenderedImages(page)
    test.skip(images.length === 0, 'No images found on project page — CMS may be returning empty data (Render cold start)')

    for (const img of images) {
      await assertImageLoads(page, img.src)
    }
  })

  test('Cloudinary raster images include f_auto,q_auto', async ({ page }) => {
    test.skip(!projectUrl, 'No project pages available (CMS may be offline)')
    await page.goto(projectUrl!, { waitUntil: 'networkidle' })

    const images = await getRenderedImages(page)
    const rasterCloudinary = images.filter(
      (img) => isCloudinaryUrl(img.src) && !isSvgUrl(img.src)
    )

    for (const img of rasterCloudinary) {
      expect(
        img.src,
        `Raster image missing f_auto,q_auto optimisation: ${img.src}`
      ).toMatch(OPTIMISATION_PATTERN)
    }
  })

  test('Cloudinary SVGs do NOT include f_auto,q_auto', async ({ page }) => {
    test.skip(!projectUrl, 'No project pages available (CMS may be offline)')
    await page.goto(projectUrl!, { waitUntil: 'networkidle' })

    const images = await getRenderedImages(page)
    const svgCloudinary = images.filter(
      (img) => isCloudinaryUrl(img.src) && isSvgUrl(img.src)
    )

    for (const img of svgCloudinary) {
      expect(
        img.src,
        `SVG should not have f_auto,q_auto (corrupts rendering): ${img.src}`
      ).not.toMatch(OPTIMISATION_PATTERN)
    }
  })
})

// ---------------------------------------------------------------------------
// Lottie blocks
// ---------------------------------------------------------------------------

test('every Lottie block renders an animation with real height', async ({ page }) => {
  test.setTimeout(300_000)
  await page.setViewportSize({ width: 1440, height: 900 })
  const collapsed: string[] = []
  let checked = 0

  for (const path of await getEntryPaths(page)) {
    await page.goto(path, { waitUntil: 'networkidle' })
    const displays = page.locator('main .lottie-display')
    const count = await displays.count()
    for (let i = 0; i < count; i++) {
      const display = displays.nth(i)
      await display.evaluate((el) => el.scrollIntoView({ block: 'center' }))
      await expect(display.locator('svg').first()).toBeAttached()
      const height = (await display.boundingBox())?.height ?? 0
      if (height < 100) collapsed.push(`${path} #${i + 1} (${Math.round(height)}px)`)
      checked++
    }
  }

  test.skip(checked === 0, 'No Lottie blocks in the current content')
  expect(collapsed, 'Lottie blocks that collapsed').toEqual([])
})
