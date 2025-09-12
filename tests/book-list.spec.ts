import { expect, test } from '@playwright/test';

test(`
  Given the book list page is loaded
  When checking the book items
  Then at least 3 books are displayed
`, async ({ page }) => {
  await page.goto('http://localhost:4200');

  const bookItems = page.locator('[data-testid="book-item"]');
  const count = await bookItems.count();

  expect(count).toBeGreaterThanOrEqual(3);
});

test(`
  Given a list of books
  When typing "Database" in the search
  Then it shows at least one search result
`, async ({ page }) => {
  await page.goto('http://localhost:4200');

  // Wait for the initial book list to load
  await page.locator('[data-testid="book-item"]').first().waitFor({ state: 'visible' });

  // Find the search input and enter "Database"
  const searchInput = page.locator('[data-testid="book-search-input"]');
  await searchInput.fill('Database');

  // Wait for search results to update (there's a 300ms debounce)
  await page.waitForTimeout(500);

  // Check that at least one book is found
  const bookItems = page.locator('[data-testid="book-item"]');
  const count = await bookItems.count();

  expect(count).toBeGreaterThanOrEqual(1);
});
