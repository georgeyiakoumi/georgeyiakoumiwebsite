import { test, expect, type Page } from '@playwright/test'

// The site scrolls inside <main> (overflow-y-auto), not the window, so lazy media
// only loads if <main> itself is scrolled.
async function scrollMainToBottom(page: Page) {
  await page.evaluate(async () => {
    const main = document.querySelector('main')
    if (!main) return
    for (let y = 0; y < main.scrollHeight; y += 600) {
      main.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 150))
    }
    main.scrollTo(0, main.scrollHeight)
  })
}

test('privacy page renders the notice', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', err => errors.push(err.message))

  await page.goto('/privacy')

  await expect(page).toHaveTitle(/Privacy/)
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy' })).toBeVisible()
  await expect(page.getByText(/doesn't use cookies, analytics or tracking/)).toBeVisible()
  await expect(page.getByRole('link', { name: 'homepage' })).toHaveAttribute('href', '/')
  expect(errors).toHaveLength(0)
})

test('site makes no third-party requests', async ({ page }) => {
  test.setTimeout(180_000)
  const thirdParty: string[] = []
  page.on('request', req => {
    const url = new URL(req.url())
    if (!['localhost', '127.0.0.1'].includes(url.hostname) && !url.protocol.startsWith('data')) {
      thirdParty.push(req.url())
    }
  })

  for (const path of ['/', '/projects', '/privacy']) {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
  }

  await page.goto('/projects')
  const entryLinks = await page.locator('a[href^="/project/"], a[href^="/article/"]').evaluateAll(
    links => [...new Set(links.map(link => link.getAttribute('href')).filter(Boolean))] as string[]
  )
  expect(entryLinks.length).toBeGreaterThan(0)
  for (const href of entryLinks) {
    await page.goto(href)
    await scrollMainToBottom(page)
    await page.waitForLoadState('networkidle')
  }

  expect(thirdParty).toEqual([])
})

test('desktop footer popover links to the privacy page and closes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  await page.getByRole('button', { name: 'Footer information' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()

  await dialog.getByRole('link', { name: 'Privacy' }).click()
  await expect(page).toHaveURL(/\/privacy$/)
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('mobile footer drawer links to the privacy page and closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await page.getByRole('button', { name: 'Open footer information' }).click()
  const drawer = page.getByRole('dialog')
  await expect(drawer).toBeVisible()

  await drawer.getByRole('link', { name: 'Privacy' }).click()
  await expect(page).toHaveURL(/\/privacy$/)
  await expect(page.getByRole('dialog')).toHaveCount(0)
})
