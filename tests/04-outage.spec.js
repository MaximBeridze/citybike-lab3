const { test, expect } = require('@playwright/test');

test('station list recovers after an API outage', async ({ page }) => {
  let attempts = 0;

  await page.route('**/api/stations', async route => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }

    attempts++;

    if (attempts === 1) {
      await route.fulfill({
        status: 503,
        json: { error: 'Service unavailable' }
      });
    } else {
      await route.continue();
    }
  });

  await page.goto('/');

  const alert = page.getByRole('alert').filter({
    hasText: 'Unable to load stations.'
  });
  await expect(alert).toBeVisible();

  await page.getByRole('button', {
    name: 'Retry loading',
    exact: true
  }).click();

  await expect(page.getByTestId('station-card')).toHaveCount(4);
  await expect(alert).toBeHidden();
});