import { test, expect, type Page } from '@playwright/test'

// Share of a logo's painted pixels that must stand out from the background behind it.
// A vanished logo (e.g. black on black) scores ~0. App-icon style logos on a dark
// background (dark square, bright letters) legitimately score ~13-17%.
const MIN_VISIBLE_SHARE = 0.08

async function logoVisibility(page: Page) {
  return page.evaluate(async () => {
    // Theme colours are OKLCH (Tailwind v4); let the browser convert any CSS colour to RGBA.
    const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!
    const parse = (value: string) => {
      probe.clearRect(0, 0, 1, 1)
      probe.fillStyle = value
      probe.fillRect(0, 0, 1, 1)
      const [r, g, b, a] = probe.getImageData(0, 0, 1, 1).data
      return [r, g, b, a / 255]
    }
    const luminance = ([r, g, b]: number[]) => {
      const channel = (v: number) => {
        const c = v / 255
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
      }
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
    }
    const contrast = (a: number[], b: number[]) => {
      const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
      return (hi + 0.05) / (lo + 0.05)
    }

    const backgroundBehind = (element: Element) => {
      for (let node: Element | null = element; node; node = node.parentElement) {
        const color = parse(getComputedStyle(node).backgroundColor)
        if ((color[3] ?? 1) > 0.5) return color
      }
      return [255, 255, 255, 1]
    }
    const cards = [...document.querySelectorAll<HTMLElement>('[role="img"][aria-label^="Logo for"]')]
    const results: { name: string; share: number }[] = []

    for (const card of cards) {
      const pageBackground = backgroundBehind(card.parentElement ?? card)
      const visible = [...card.querySelectorAll<HTMLElement>('span')].find(
        (span) => span.querySelector('svg[focusable="false"]') && getComputedStyle(span).display !== 'none'
      )
      const svg = visible?.querySelector('svg')
      if (!svg) continue

      const clone = svg.cloneNode(true) as SVGSVGElement
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
      clone.setAttribute('width', '96')
      clone.setAttribute('height', '96')
      clone.style.color = getComputedStyle(svg).color

      const image = new Image()
      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`
      await image.decode()

      const canvas = document.createElement('canvas')
      canvas.width = 96
      canvas.height = 96
      const context = canvas.getContext('2d')!
      context.drawImage(image, 0, 0, 96, 96)
      const { data } = context.getImageData(0, 0, 96, 96)

      let painted = 0
      let standsOut = 0
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3] / 255
        if (alpha < 0.5) continue
        painted++
        const blended = [0, 1, 2].map((c) => data[i + c] * alpha + pageBackground[c] * (1 - alpha))
        if (contrast(blended, pageBackground) >= 1.5) standsOut++
      }
      results.push({ name: card.getAttribute('aria-label')!.replace('Logo for ', ''), share: painted ? standsOut / painted : 0 })
    }
    return results
  })
}

for (const colorScheme of ['light', 'dark'] as const) {
  test(`stack logos are visible in ${colorScheme} mode`, async ({ browser }) => {
    const context = await browser.newContext({ colorScheme, viewport: { width: 1440, height: 900 } })
    const page = await context.newPage()
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await logoVisibility(page)
    test.skip(results.length === 0, 'No brand-icon logos on this content (slugs not set yet)')

    const invisible = results.filter((r) => r.share < MIN_VISIBLE_SHARE).map((r) => `${r.name} (${Math.round(r.share * 100)}%)`)
    expect(invisible, `Logos that mostly disappear in ${colorScheme} mode`).toEqual([])
    await context.close()
  })
}
