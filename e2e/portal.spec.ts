import { expect, test } from '@playwright/test'

test('creates a featured course and places it after older featured courses', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Pebble Beach Golf Links' })).toBeVisible()

  await page.getByRole('link', { name: 'Create a course' }).click()
  await page.getByLabel('Title').fill('Zebra Ridge')
  await expect(page.getByRole('complementary', { name: 'Card preview' })).toContainText('Zebra Ridge')

  await page.getByLabel('Course description').fill('A new featured routing above the canyon.')
  await page.getByLabel('Difficulty').selectOption('5')
  await page.getByLabel('Par').fill('71')
  await page.getByLabel('City').fill('California')
  await page.getByLabel('Country').selectOption('US')
  await page.getByRole('checkbox', { name: 'Featured course' }).check()
  await page.locator('input[type="file"]').setInputFiles('public/images/pebble.jpg')
  await expect(page.getByRole('button', { name: 'Use photo' })).toBeEnabled()
  await page.getByRole('button', { name: 'Use photo' }).click()
  await page.getByRole('button', { name: 'Save' }).click()

  await expect(page.getByRole('heading', { name: 'Zebra Ridge' })).toBeVisible()
  const titles = await page.getByRole('heading', { level: 2 }).allTextContents()
  expect(titles.indexOf('Pebble Beach Golf Links')).toBeGreaterThanOrEqual(0)
  expect(titles.indexOf('Pebble Beach Golf Links')).toBeLessThan(titles.indexOf('Zebra Ridge'))
  expect(titles.indexOf('Zebra Ridge')).toBeLessThan(titles.indexOf('Albany'))
})

test('rolls a failed delete back onto the list', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Albany' })).toBeVisible()

  await page.getByText('Review tools').click()
  await page.getByRole('checkbox', { name: 'Simulate delete failure' }).check()
  await page.getByRole('button', { name: 'Actions for Albany' }).click()
  await page.getByRole('menuitem', { name: 'Delete' }).click()
  await page.getByRole('dialog', { name: 'Delete course' }).getByRole('button', { name: 'Delete' }).click()

  await expect(page.getByRole('alert')).toContainText('Could not delete Albany')
  await expect(page.getByRole('heading', { name: 'Albany' })).toBeVisible()
})
