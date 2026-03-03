import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Feature: [name]', () => {
  test('given [context] when [action] then [expected]', async ({ page }) => {
    // Given - setup / preconditions
    // When - user action
    await page.getByRole('button', { name: 'Submit' }).click();
    // Then - assertion
    await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
  });
});
