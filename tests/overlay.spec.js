import { test, expect } from '@playwright/test';

test.describe('ADA Compliance Overlay', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('#room-width', '10');
    await page.fill('#room-depth', '8');
    await page.click('#generate');
    await page.waitForTimeout(300);
  });

  test('overlay toggle checkbox exists', async ({ page }) => {
    await expect(page.locator('#show-overlay')).toBeVisible();
  });

  test('checking toggle adds turning radius circle', async ({ page }) => {
    await page.check('#show-overlay');
    await page.waitForTimeout(100);
    const circle = page.locator('.config-card svg .turning-radius');
    expect(await circle.count()).toBeGreaterThan(0);
  });

  test('checking toggle adds centerline marker', async ({ page }) => {
    await page.check('#show-overlay');
    await page.waitForTimeout(100);
    const line = page.locator('.config-card svg .centerline');
    expect(await line.count()).toBeGreaterThan(0);
  });

  test('checking toggle adds clear floor space rectangle', async ({ page }) => {
    await page.check('#show-overlay');
    await page.waitForTimeout(100);
    const rect = page.locator('.config-card svg .clear-floor');
    expect(await rect.count()).toBeGreaterThan(0);
  });

  test('unchecking toggle removes overlay elements', async ({ page }) => {
    await page.check('#show-overlay');
    await page.waitForTimeout(100);
    await page.uncheck('#show-overlay');
    await page.waitForTimeout(100);
    const overlay = page.locator('.config-card svg .ada-overlay');
    expect(await overlay.count()).toBe(0);
  });

  test('overlay contains ADA dimension labels', async ({ page }) => {
    await page.check('#show-overlay');
    await page.waitForTimeout(100);
    // Check for the dimension text in the SVG
    const svgContent = await page.locator('.config-card svg').first().innerHTML();
    expect(svgContent).toContain('60"');
    expect(svgContent).toContain('48"');
    expect(svgContent).toContain('18"');
  });
});
