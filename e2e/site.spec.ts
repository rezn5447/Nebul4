import { loadEnvConfig } from '@next/env'
import { expect, test } from '@playwright/test'

// Read .env.local so tests know whether a real Resend key is available.
loadEnvConfig(process.cwd())

test.describe('home', () => {
  test('shows the hero, next shows and every section', async ({ page, isMobile }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Nebul4/)
    await expect(page.getByRole('heading', { level: 1, name: 'NEBUL4' })).toBeVisible()
    // The design shows the next three dates, trimmed to one on narrow screens.
    await expect(page.getByRole('list', { name: 'Próximos shows' }).getByRole('listitem')).toHaveCount(isMobile ? 1 : 3)

    for (const name of ['Un tributo a nuestros iconos.', 'La banda', 'Repertorio', 'Fotos']) {
      await expect(page.getByRole('heading', { level: 2, name })).toBeAttached()
    }
  })

  test('hero uses the wide display face', async ({ page }) => {
    await page.goto('/')
    const h1 = page.getByRole('heading', { level: 1, name: 'NEBUL4' })
    await expect(h1).toHaveCSS('font-stretch', '125%')
    const family = await h1.evaluate((el) => getComputedStyle(el).fontFamily)
    expect(family).toMatch(/Archivo/i)
  })

  test('hovering a photo flips it to color on desktop', async ({ page, isMobile }) => {
    test.skip(isMobile, 'hover is a mouse interaction')
    await page.goto('/#fotos')
    const photo = page.getByRole('button', { name: /^Rehearsal room/ })
    await expect(photo).toHaveAttribute('aria-pressed', 'false')
    await photo.hover()
    await expect(photo).toHaveAttribute('aria-pressed', 'true')
    await page.mouse.move(0, 0)
    await expect(photo).toHaveAttribute('aria-pressed', 'false')
  })

  test('tapping a photo flips it to color and back', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'tap is a touch interaction')
    await page.goto('/#fotos')
    const photo = page.getByRole('button', { name: /^Rehearsal room/ })
    await expect(photo).toHaveAttribute('aria-pressed', 'false')
    await photo.tap()
    await expect(photo).toHaveAttribute('aria-pressed', 'true')
    await photo.tap()
    await expect(photo).toHaveAttribute('aria-pressed', 'false')
  })

  test('booking form blocks submission until name and email are filled', async ({ page }) => {
    await page.goto('/#booking')
    const form = page.getByRole('form', { name: 'Booking request' })
    await form.getByRole('button', { name: 'Send booking request' }).click()
    // Native validation keeps the form on screen while required fields are empty.
    await expect(form).toBeVisible()
    await expect(form.getByLabel('Name')).toHaveJSProperty('validity.valueMissing', true)
  })

  test('the server rejects a past date and keeps what was typed', async ({ page }) => {
    await page.goto('/#booking')
    const form = page.getByRole('form', { name: 'Booking request' })
    await form.getByLabel('Name').fill('Ana')
    await form.getByLabel('Email').fill('ana@venue.com')
    await form.getByLabel('Event date').fill('2020-01-01')
    await form.getByLabel('Details').fill('Two sets')
    await form.getByRole('button', { name: 'Send booking request' }).click()

    await expect(form.getByText('That date has already passed.')).toBeVisible()
    await expect(form.getByLabel('Event date')).toHaveAttribute('aria-invalid', 'true')
    await expect(form.getByLabel('Name')).toHaveValue('Ana')
    await expect(form.getByLabel('Details')).toHaveValue('Two sets')
  })

  test('a valid request is emailed through Resend and confirmed', async ({ page, isMobile }) => {
    test.skip(!process.env.RESEND_API_KEY, 'needs RESEND_API_KEY (run `vercel env pull`)')
    test.skip(isMobile, 'one real send per run is enough')
    await page.goto('/#booking')
    const form = page.getByRole('form', { name: 'Booking request' })
    await form.getByLabel('Name').fill('Playwright test')
    await form.getByLabel('Email').fill('test@example.com')
    await form.getByLabel('City / venue').fill('Santa Maria, CA')
    await form.getByRole('button', { name: 'Send booking request' }).click()
    await expect(page.getByRole('status')).toContainText('mensaje recibido', { timeout: 15_000 })
  })

  test('page carries search and sharing metadata', async ({ page, request }) => {
    await page.goto('/')
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /opengraph-image/)
    const jsonLd = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}')
    expect(jsonLd['@graph'][0]).toMatchObject({ '@type': 'MusicGroup', name: 'Nebul4' })
    expect(jsonLd['@graph'].some((n: { '@type': string }) => n['@type'] === 'MusicEvent')).toBe(true)

    expect((await request.get('/sitemap.xml')).ok()).toBe(true)
    expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap:')
  })
})

for (const width of [360, 768]) {
  // 360 is a narrow phone; 768 is the narrowest width that shows the full desktop nav.
  test(`no page scrolls sideways at ${width}px wide`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    for (const path of ['/', '/shows']) {
      await page.goto(path)
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      expect(scrollWidth, path).toBeLessThanOrEqual(width)
      // The hero clips its overflow, so a crowded nav would hide the button without widening the page.
      await expect(page.getByRole('link', { name: 'Book the band' })).toBeInViewport({ ratio: 1 })
    }
  })
}

test('phone menu opens, links to a section and closes', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'the menu only exists at phone width')
  await page.goto('/shows')
  const toggle = page.getByRole('button', { name: 'Open menu' })
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true')
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Banda' }).click()
  await expect(page).toHaveURL(/\/#banda$/)
  await expect(page.getByRole('heading', { level: 2, name: 'La banda' })).toBeInViewport()
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
})

test('unknown pages show the branded 404 with a way back', async ({ page }) => {
  const res = await page.goto('/no-such-page')
  expect(res?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1, name: 'Perdidos en el espacio.' })).toBeVisible()
  await page.getByRole('link', { name: 'Back home' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'NEBUL4' })).toBeVisible()
})

test.describe('shows', () => {
  test('nav goes to the shows page and tabs switch between upcoming and past', async ({ page, isMobile }) => {
    await page.goto('/')
    // On phones, Shows lives in the menu.
    if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Shows' }).click()
    await expect(page).toHaveURL(/\/shows$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Shows' })).toBeVisible()

    const upcoming = page.getByRole('tab', { name: /Próximos/ })
    const past = page.getByRole('tab', { name: /Pasados/ })
    await expect(upcoming).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByText('Next show')).toBeVisible()

    await past.click()
    await expect(past).toHaveAttribute('aria-selected', 'true')
    // Scope to the panel: Next keeps the previous route mounted (hidden) to preserve its state.
    const panel = page.getByRole('tabpanel')
    await expect(panel.getByRole('heading', { level: 2, name: '2025' })).toBeVisible()
    await expect(panel.getByText('First show', { exact: false }).first()).toBeVisible()
    await expect(panel.getByText('Next show')).toHaveCount(0)
  })

  test('"Book the band" from shows lands on the booking section', async ({ page }) => {
    await page.goto('/shows')
    await page.getByRole('link', { name: 'Book the band' }).click()
    await expect(page).toHaveURL(/\/#booking$/)
    await expect(page.getByRole('form', { name: 'Booking request' })).toBeInViewport()
  })
})
