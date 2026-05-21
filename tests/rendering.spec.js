import { test, expect } from '@playwright/test';

test.describe('Room Configuration Rendering', () => {
  
  test('generates configurations when button clicked', async ({ page }) => {
    await page.goto('/');
    await page.fill('#room-width', '10');
    await page.fill('#room-depth', '8');
    await page.click('#generate');
    await page.waitForTimeout(300);
    await expect(page.locator('#results-section')).toBeVisible();
    const cards = page.locator('.config-card');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('each config card has an SVG element', async ({ page }) => {
    await page.goto('/');
    await page.fill('#room-width', '10');
    await page.fill('#room-depth', '8');
    await page.click('#generate');
    await page.waitForTimeout(300);
    expect(await page.locator('.config-card svg').count()).toBeGreaterThan(0);
  });

  test('SVG contains room rectangle', async ({ page }) => {
    await page.goto('/');
    await page.fill('#room-width', '10');
    await page.fill('#room-depth', '8');
    await page.click('#generate');
    await page.waitForTimeout(300);
    expect(await page.locator('.config-card svg rect').count()).toBeGreaterThan(0);
  });

  test('SVG contains toilet fixture group', async ({ page }) => {
    await page.goto('/');
    await page.fill('#room-width', '10');
    await page.fill('#room-depth', '8');
    await page.click('#generate');
    await page.waitForTimeout(300);
    expect(await page.locator('.config-card svg .toilet-fixture').count()).toBeGreaterThan(0);
  });

  test('SVG contains door swing arc', async ({ page }) => {
    await page.goto('/');
    await page.fill('#room-width', '10');
    await page.fill('#room-depth', '8');
    await page.click('#generate');
    await page.waitForTimeout(300);
    // Door swing is a path element with an arc command
    const paths = page.locator('.config-card svg path');
    expect(await paths.count()).toBeGreaterThan(0);
    const d = await paths.first().getAttribute('d');
    expect(d).toContain('A'); // arc command
  });

  test('toilet fixture has tank rectangle and bowl ellipse', async ({ page }) => {
    await page.goto('/');
    await page.fill('#room-width', '10');
    await page.fill('#room-depth', '8');
    await page.click('#generate');
    await page.waitForTimeout(300);
    const fixture = page.locator('.config-card svg .toilet-fixture').first();
    expect(await fixture.locator('rect').count()).toBeGreaterThanOrEqual(1); // tank
    expect(await fixture.locator('ellipse').count()).toBeGreaterThanOrEqual(1); // bowl
  });

  test('walls are drawn with gap for door', async ({ page }) => {
    await page.goto('/');
    await page.fill('#room-width', '10');
    await page.fill('#room-depth', '8');
    await page.click('#generate');
    await page.waitForTimeout(300);
    // Should have wall lines (more than just the room rect outline)
    const lines = page.locator('.config-card svg line[stroke="#1e293b"]');
    expect(await lines.count()).toBeGreaterThan(2);
  });

  test('different room dimensions produce different configs', async ({ page }) => {
    await page.goto('/');
    await page.fill('#room-width', '6');
    await page.fill('#room-depth', '5');
    await page.click('#generate');
    await page.waitForTimeout(300);
    const smallCount = await page.locator('.config-card').count();
    await page.fill('#room-width', '12');
    await page.fill('#room-depth', '10');
    await page.click('#generate');
    await page.waitForTimeout(300);
    const largeCount = await page.locator('.config-card').count();
    expect(largeCount).toBeGreaterThanOrEqual(smallCount);
  });

  test('results count text matches actual cards', async ({ page }) => {
    await page.goto('/');
    await page.fill('#room-width', '10');
    await page.fill('#room-depth', '8');
    await page.click('#generate');
    await page.waitForTimeout(300);
    const countText = await page.locator('#results-count').textContent();
    const cardCount = await page.locator('.config-card').count();
    expect(countText).toContain(String(cardCount));
  });
});
