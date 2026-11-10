import { expect, test } from '@playwright/test'

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

  test('booking form requires name and email, then confirms', async ({ page }) => {
    await page.goto('/#booking')
    const form = page.getByRole('form', { name: 'Booking request' })
    await form.getByRole('button', { name: 'Send booking request' }).click()
    // Native validation blocks submission while required fields are empty.
    await expect(form).toBeVisible()

    await form.getByLabel('Name').fill('Ana')
    await form.getByLabel('Email').fill('ana@venue.com')
    await form.getByRole('button', { name: 'Send booking request' }).click()
    await expect(page.getByRole('status')).toContainText('mensaje recibido')
  })
})

test('no page scrolls sideways on a narrow phone', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  for (const path of ['/', '/shows']) {
    await page.goto(path)
    const width = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(width, path).toBeLessThanOrEqual(360)
  }
})

test.describe('shows', () => {
  test('nav goes to the shows page and tabs switch between upcoming and past', async ({ page }) => {
    await page.goto('/')
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
