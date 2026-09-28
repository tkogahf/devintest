import { expect, test } from '@playwright/test'

test('loads the app shell and home page', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1, name: 'devintest' })).toBeVisible()
  await expect(page.getByRole('main')).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Home' })).toBeVisible()
})

test('exposes a keyboard-reachable skip link that focuses main content', async ({ page }) => {
  await page.goto('/')

  await page.keyboard.press('Tab')
  const skipLink = page.getByRole('link', { name: 'Skip to main content' })
  await expect(skipLink).toBeFocused()

  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
})
