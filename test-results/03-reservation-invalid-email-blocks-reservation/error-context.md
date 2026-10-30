# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 03-reservation.spec.js >> invalid email blocks reservation
- Location: tests\03-reservation.spec.js:8:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('alert').filter({ hasText: 'Enter a valid email address.' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('alert').filter({ hasText: 'Enter a valid email address.' }) with timeout 5000ms
  - waiting for getByRole('alert').filter({ hasText: 'Enter a valid email address.' })

```

```yaml
- banner:
  - text: CITYBIKE / LIVE SERVICE
  - heading "Find your next bike" [level=1]
  - paragraph: Check station availability and reserve a bike for your journey.
- main:
  - region "Nearby stations":
    - paragraph: 01 / STATION FINDER
    - heading "Nearby stations" [level=2]
    - text: 4 stations Search stations
    - searchbox "Search stations"
    - checkbox "Available bikes only"
    - text: Available bikes only
    - article:
      - heading "Central Square" [level=3]
      - paragraph: 8 bikes available · 4 empty docks
      - button "Reserve at Central Square"
    - article:
      - heading "Riverside Park" [level=3]
      - paragraph: 0 bikes available · 12 empty docks
      - button "Reserve at Riverside Park" [disabled]
    - article:
      - heading "Market Street" [level=3]
      - paragraph: 3 bikes available · 6 empty docks
      - button "Reserve at Market Street"
    - article:
      - heading "Campus North" [level=3]
      - paragraph: 1 bikes available · 7 empty docks
      - button "Reserve at Campus North"
  - region "Reserve a bike":
    - paragraph: 02 / RESERVATION
    - heading "Reserve a bike" [level=2]
    - paragraph: "Selected station: Central Square"
    - text: Email address
    - textbox "Email address":
      - /placeholder: name@example.com
      - text: invalid-email
    - button "Confirm reservation"
  - status: Reservation failed. Please retry.
- contentinfo: Training environment — fictional service, no real reservations.
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | // MISSION 3 — Add two realistic tests:
  4  | // (a) invalid email gives visible error without a POST to /api/reservations
  5  | // (b) a successful reservation; intercept/mock POST /api/reservations and assert
  6  | //     the JSON request payload and success message.
  7  | 
  8  | test('invalid email blocks reservation', async ({ page }) => {
  9  |   const reservationPosts = [];
  10 |   page.on('request', request => {
  11 |     if (request.method() === 'POST' &&
  12 |         new URL(request.url()).pathname === '/api/reservations') {
  13 |       reservationPosts.push(request);
  14 |     }
  15 |   });
  16 | 
  17 |   await page.goto('/');
  18 |   await page.getByRole('button', { name: 'Reserve at Central Square', exact: true }).click();
  19 |   await page.getByRole('textbox', { name: 'Email address' }).fill('invalid-email');
  20 |   await page.getByRole('button', { name: 'Confirm reservation', exact: true }).click();
  21 | 
  22 |   await expect(page.getByRole('alert').filter({
  23 |     hasText: 'Enter a valid email address.'
> 24 |   })).toBeVisible();
     |       ^ Error: expect(locator).toBeVisible() failed
  25 |   expect(reservationPosts).toHaveLength(0);
  26 | });
  27 | 
  28 | test('reservation sends correct payload and confirms booking', async ({ page }) => {
  29 |   let requestData;
  30 | 
  31 |   // Intercept the reservation request before submitting the form.
  32 |   await page.route('**/api/reservations', async route => {
  33 |     if (route.request().method() !== 'POST') {
  34 |       await route.continue();
  35 |       return;
  36 |     }
  37 | 
  38 |     // Read the JSON sent by the application.
  39 |     requestData = route.request().postDataJSON();
  40 | 
  41 |     // Return a simulated successful server response.
  42 |     await route.fulfill({
  43 |       status: 201,
  44 |       json: { reservationId: 'CB-DEMO-777' }
  45 |     });
  46 |   });
  47 | 
  48 |   await page.goto('/');
  49 |   await page.getByRole('button', {
  50 |     name: 'Reserve at Central Square',
  51 |     exact: true
  52 |   }).click();
  53 | 
  54 |   await page.getByRole('textbox', {
  55 |     name: 'Email address'
  56 |   }).fill('student@example.com');
  57 | 
  58 |   await page.getByRole('button', {
  59 |     name: 'Confirm reservation',
  60 |     exact: true
  61 |   }).click();
  62 | 
  63 |   await expect(page.getByRole('status')).toHaveText(
  64 |     'Reservation confirmed: CB-DEMO-777'
  65 |   );
  66 | 
  67 |   expect(requestData).toEqual({
  68 |     stationId: 'central',
  69 |     email: 'student@example.com'
  70 |   });
  71 | });
  72 | 
```