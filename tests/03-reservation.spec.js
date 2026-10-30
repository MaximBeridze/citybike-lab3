const { test, expect } = require('@playwright/test');

// MISSION 3 — Add two realistic tests:
// (a) invalid email gives visible error without a POST to /api/reservations
// (b) a successful reservation; intercept/mock POST /api/reservations and assert
//     the JSON request payload and success message.

test('invalid email blocks reservation', async ({ page }) => {
  const reservationPosts = [];
  page.on('request', request => {
    if (request.method() === 'POST' &&
        new URL(request.url()).pathname === '/api/reservations') {
      reservationPosts.push(request);
    }
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Reserve at Central Square', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('invalid-email');
  await page.getByRole('button', { name: 'Confirm reservation', exact: true }).click();

  await expect(page.getByRole('alert').filter({
    hasText: 'Enter a valid email address.'
  })).toBeVisible();
  expect(reservationPosts).toHaveLength(0);
});

test('reservation sends correct payload and confirms booking', async ({ page }) => {
  let requestData;

  // Intercept the reservation request before submitting the form.
  await page.route('**/api/reservations', async route => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }

    // Read the JSON sent by the application.
    requestData = route.request().postDataJSON();

    // Return a simulated successful server response.
    await route.fulfill({
      status: 201,
      json: { reservationId: 'CB-DEMO-777' }
    });
  });

  await page.goto('/');
  await page.getByRole('button', {
    name: 'Reserve at Central Square',
    exact: true
  }).click();

  await page.getByRole('textbox', {
    name: 'Email address'
  }).fill('student@example.com');

  await page.getByRole('button', {
    name: 'Confirm reservation',
    exact: true
  }).click();

  await expect(page.getByRole('status')).toHaveText(
    'Reservation confirmed: CB-DEMO-777'
  );

  expect(requestData).toEqual({
    stationId: 'central',
    email: 'student@example.com'
  });
});
