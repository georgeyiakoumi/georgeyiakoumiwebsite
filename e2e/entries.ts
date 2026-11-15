import type { Page } from '@playwright/test'

// Every project and article page, from the sitemap. The projects listing only
// renders the selected type tab, so crawling its links misses entries.
export async function getEntryPaths(page: Page): Promise<string[]> {
  const response = await page.request.get('/sitemap.xml')
  const xml = await response.text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => new URL(match[1]).pathname)
    .filter((path) => /^\/(project|article)\//.test(path))
}
