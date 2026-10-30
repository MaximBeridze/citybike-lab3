const { test, expect } = require('@playwright/test');

const cases = [
  {
    description: 'case-insensitive search',
    query: 'cEnTrAl',
    expected: ['Central Square']
  },
  {
    description: 'nonexistent station',
    query: 'Atlantis',
    expected: []
  },
  {
    description: 'partial name',
    query: 'ivers',
    expected: ['Riverside Park']
  },
  {
    description: 'partial match across multiple stations',
    query: 'ar',
    expected: ['Central Square', 'Riverside Park', 'Market Street']
  }
];

for (const { description, query, expected } of cases) {
  test(`search: ${description}`, async ({ page }) => {
    await page.goto('/');

    const cards = page.getByTestId('station-card');

    await expect(cards).toHaveCount(4);

    await page.getByRole('searchbox', {
      name: 'Search stations'
    }).fill(query);

    await expect(cards).toHaveCount(expected.length);

    if (expected.length > 0) {
      await expect(cards.getByRole('heading')).toHaveText(expected);
    } else {
      await expect(
        page.getByText('No stations match your filters.', { exact: true })
      ).toBeVisible();
    }
  });
}