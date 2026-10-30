const { test, expect } = require('@playwright/test');

test('BUG-101: available-only filter excludes zero-bike stations', async ({ page }) => {
  await page.goto('/');

  const stations = page.getByTestId('station-card');
  const riverside = page.getByRole('heading', {
    name: 'Riverside Park',
    exact: true
  });

  await expect(stations).toHaveCount(4);
  await expect(riverside).toBeVisible();

  await page.getByRole('checkbox', {
    name: 'Available bikes only'
  }).check();

  await expect(stations).toHaveCount(3);
  await expect(riverside).toHaveCount(0);
});
