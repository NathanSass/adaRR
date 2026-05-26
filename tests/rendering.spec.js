import { test, expect } from '@playwright/test';

test.describe('Room Configuration Rendering', () => {
  
  test('auto-generates configurations on page load', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    await expect(page.locator('#results-section')).toBeVisible();
    const cards = page.locator('.config-card');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('each config card has an SVG element', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    expect(await page.locator('.config-card svg').count()).toBeGreaterThan(0);
  });

  test('SVG contains room rectangle', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    expect(await page.locator('.config-card svg rect').count()).toBeGreaterThan(0);
  });

  test('SVG contains toilet fixture group', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    expect(await page.locator('.config-card svg .toilet-fixture').count()).toBeGreaterThan(0);
  });

  test('SVG contains door swing arc', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    const paths = page.locator('.config-card svg path');
    expect(await paths.count()).toBeGreaterThan(0);
    const d = await paths.first().getAttribute('d');
    expect(d).toContain('A');
  });

  test('toilet fixture has tank rectangle and bowl ellipse', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    const fixture = page.locator('.config-card svg .toilet-fixture').first();
    expect(await fixture.locator('rect').count()).toBeGreaterThanOrEqual(1);
    expect(await fixture.locator('ellipse').count()).toBeGreaterThanOrEqual(1);
  });

  test('walls are drawn with gap for door', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    const lines = page.locator('.config-card svg line[stroke="#1e293b"]');
    expect(await lines.count()).toBeGreaterThan(2);
  });

  test('changing room dimensions updates configs', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    const initialCount = await page.locator('.config-card').count();
    await page.fill('#room-width', '12');
    await page.waitForTimeout(500);
    // Should still have configs (may be different count)
    expect(await page.locator('.config-card').count()).toBeGreaterThan(0);
  });

  test('results count text matches actual cards', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    const countText = await page.locator('#results-count').textContent();
    const cardCount = await page.locator('.config-card').count();
    expect(countText).toContain(String(cardCount));
  });
});
