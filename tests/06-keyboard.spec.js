const { test, expect } = require('@playwright/test');

test('reservation controls work with the keyboard', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('station-card')).toHaveCount(4);

  const search = page.getByRole('searchbox', {
    name: 'Search stations'
  });
  const available = page.getByRole('checkbox', {
    name: 'Available bikes only'
  });
  const reserve = page.getByRole('button', {
    name: 'Reserve at Central Square',
    exact: true
  });
  const email = page.getByRole('textbox', {
    name: 'Email address'
  });
  const confirm = page.getByRole('button', {
    name: 'Confirm reservation',
    exact: true
  });

  // Follow the page's keyboard navigation order.
  await page.keyboard.press('Tab');
  await expect(search).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(available).toBeFocused();

  await page.keyboard.press('Space');
  await expect(available).toBeChecked();
  await expect(page.getByTestId('station-card')).toHaveCount(3);

  await page.keyboard.press('Tab');
  await expect(reserve).toBeFocused();

  // Opening the reservation form should focus its email field.
  await page.keyboard.press('Enter');
  await expect(email).toBeFocused();

  // Type into the focused field without using the mouse.
  await page.keyboard.type('invalid-email');

  await page.keyboard.press('Tab');
  await expect(confirm).toBeFocused();

  // Verify that Confirm can be activated with the keyboard.
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('alert').filter({
      hasText: 'Enter a valid email address.'
    })
  ).toBeVisible();
});