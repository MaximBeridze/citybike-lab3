# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-availability.spec.js >> BUG-101: available-only filter excludes zero-bike stations
- Location: tests\02-availability.spec.js:3:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByTestId('station-card')
Expected: 3
Received: 4
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" getByTestId('station-card') with timeout 5000ms
  - waiting for getByTestId('station-card')
    14 × locator resolved to 4 elements
       - unexpected value "4"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - text: CITYBIKE / LIVE SERVICE
    - heading "Find your next bike" [level=1] [ref=e4]
    - paragraph [ref=e5]: Check station availability and reserve a bike for your journey.
  - main [ref=e6]:
    - region [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]:
          - paragraph [ref=e10]: 01 / STATION FINDER
          - heading "Nearby stations" [level=2] [ref=e11]
        - generic [ref=e12]: 4 stations
      - generic [ref=e13]:
        - generic [ref=e14]: Search stations
        - searchbox "Search stations" [ref=e15]
        - generic [ref=e16]:
          - checkbox "Available bikes only" [checked] [active] [ref=e17]
          - text: Available bikes only
      - generic [ref=e18]:
        - article [ref=e19]:
          - generic [ref=e20]:
            - heading "Central Square" [level=3] [ref=e21]
            - paragraph [ref=e22]: 8 bikes available · 4 empty docks
          - button "Reserve at Central Square" [ref=e23] [cursor=pointer]
        - article [ref=e24]:
          - generic [ref=e25]:
            - heading "Riverside Park" [level=3] [ref=e26]
            - paragraph [ref=e27]: 0 bikes available · 12 empty docks
          - button "Reserve at Riverside Park" [disabled] [ref=e28]
        - article [ref=e29]:
          - generic [ref=e30]:
            - heading "Market Street" [level=3] [ref=e31]
            - paragraph [ref=e32]: 3 bikes available · 6 empty docks
          - button "Reserve at Market Street" [ref=e33] [cursor=pointer]
        - article [ref=e34]:
          - generic [ref=e35]:
            - heading "Campus North" [level=3] [ref=e36]
            - paragraph [ref=e37]: 1 bikes available · 7 empty docks
          - button "Reserve at Campus North" [ref=e38] [cursor=pointer]
    - status [ref=e39]
  - contentinfo [ref=e40]: Training environment — fictional service, no real reservations.
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test('BUG-101: available-only filter excludes zero-bike stations', async ({ page }) => {
  4  |   await page.goto('/');
  5  | 
  6  |   const stations = page.getByTestId('station-card');
  7  |   const riverside = page.getByRole('heading', {
  8  |     name: 'Riverside Park',
  9  |     exact: true
  10 |   });
  11 | 
  12 |   await expect(stations).toHaveCount(4);
  13 |   await expect(riverside).toBeVisible();
  14 | 
  15 |   await page.getByRole('checkbox', {
  16 |     name: 'Available bikes only'
  17 |   }).check();
  18 | 
> 19 |   await expect(stations).toHaveCount(3);
     |                          ^ Error: expect(locator).toHaveCount(expected) failed
  20 |   await expect(riverside).toHaveCount(0);
  21 | });
  22 | 
```