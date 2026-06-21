import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page).toHaveTitle(/George Yiakoumi/);
  });

  test('should have navigation menu', async ({ page }) => {
    await page.goto('/');

    // Check for navigation links
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should have working dark mode toggle', async ({ page }) => {
    await page.goto('/');

    // Verify toggle button exists and is interactive
    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).toBeEnabled();
  });

  test('should navigate to projects page', async ({ page }) => {
    await page.goto('/');

    // Click on projects link
    await page.click('text=Projects');

    // Verify we're on the projects page
    await expect(page).toHaveURL(/\/projects/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check page loads on mobile
    await expect(page).toHaveTitle(/George Yiakoumi/);
  });
});
