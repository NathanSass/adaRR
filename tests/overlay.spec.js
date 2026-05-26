import { test, expect } from '@playwright/test';

test.describe('ADA Compliance Overlay', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
  });

  test('overlay is shown by default', async ({ page }) => {
    const overlay = page.locator('.config-card svg .ada-overlay');
    expect(await overlay.count()).toBeGreaterThan(0);
  });

  test('overlay includes turning radius circle', async ({ page }) => {
    const circle = page.locator('.config-card svg .turning-radius');
    expect(await circle.count()).toBeGreaterThan(0);
  });

  test('overlay includes centerline marker', async ({ page }) => {
    const line = page.locator('.config-card svg .centerline');
    expect(await line.count()).toBeGreaterThan(0);
  });

  test('overlay includes clear floor space rectangle', async ({ page }) => {
    const rect = page.locator('.config-card svg .clear-floor');
    expect(await rect.count()).toBeGreaterThan(0);
  });

  test('unchecking toggle removes overlay elements', async ({ page }) => {
    await page.uncheck('#show-overlay');
    await page.waitForTimeout(100);
    const overlay = page.locator('.config-card svg .ada-overlay');
    expect(await overlay.count()).toBe(0);
  });

  test('overlay contains ADA dimension labels', async ({ page }) => {
    const svgContent = await page.locator('.config-card svg').first().innerHTML();
    expect(svgContent).toContain('60"');
    expect(svgContent).toContain('48"');
    expect(svgContent).toContain('18"');
  });
});
