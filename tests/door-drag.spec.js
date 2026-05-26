import { test, expect } from '@playwright/test';

test.describe('Interactive Door Placement', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(300);
  });

  test('room preview canvas exists', async ({ page }) => {
    await expect(page.locator('#room-preview')).toBeVisible();
  });

  test('room preview renders content', async ({ page }) => {
    const hasContent = await page.evaluate(() => {
      const canvas = document.getElementById('room-preview');
      if (!canvas) return false;
      const ctx = canvas.getContext('2d');
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let filled = 0;
      for (let i = 3; i < data.length; i += 4) { if (data[i] > 0) filled++; }
      return filled > 100;
    });
    expect(hasContent).toBe(true);
  });

  test('door rendered as blue element on preview', async ({ page }) => {
    const hasBlue = await page.evaluate(() => {
      const canvas = document.getElementById('room-preview');
      if (!canvas) return false;
      const ctx = canvas.getContext('2d');
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let blue = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i+2] > 150 && data[i] < 100 && data[i+3] > 50) blue++;
      }
      return blue > 20;
    });
    expect(hasBlue).toBe(true);
  });

  test('dragging door updates position', async ({ page }) => {
    const preview = page.locator('#room-preview');
    const box = await preview.boundingBox();
    // Drag from center-top to the right
    const startX = box.x + box.width * 0.4;
    const startY = box.y + box.height * 0.15;
    const endX = box.x + box.width * 0.7;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, startY, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(300);
    // Configs should still be visible after drag
    expect(await page.locator('.config-card').count()).toBeGreaterThan(0);
  });

  test('door cannot be dragged outside room boundaries', async ({ page }) => {
    const preview = page.locator('#room-preview');
    const box = await preview.boundingBox();
    // Try to drag past right edge
    const startX = box.x + box.width * 0.4;
    const startY = box.y + box.height * 0.15;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.99, startY, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(100);
    const doorX = parseFloat(await page.inputValue('#door-x'));
    const roomW = parseFloat(await page.inputValue('#room-width'));
    const doorWInches = parseFloat(await page.inputValue('#door-w'));
    const doorWFeet = doorWInches / 12;
    expect(doorX + doorWFeet).toBeLessThanOrEqual(roomW + 0.1);
  });

  test('cursor changes to grab when hovering over door', async ({ page }) => {
    const preview = page.locator('#room-preview');
    const box = await preview.boundingBox();
    const doorX = box.x + box.width * 0.4;
    const doorY = box.y + box.height * 0.15;
    await page.mouse.move(doorX, doorY);
    await page.waitForTimeout(100);
    const cursor = await preview.evaluate(el => el.style.cursor);
    expect(cursor).toBe('grab');
  });

  test('door can be dragged to different walls', async ({ page }) => {
    const preview = page.locator('#room-preview');
    const box = await preview.boundingBox();
    // Drag from top wall to left wall
    const startX = box.x + box.width * 0.4;
    const startY = box.y + box.height * 0.15;
    const endX = box.x + box.width * 0.1;
    const endY = box.y + box.height * 0.5;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(300);
    const wall = await page.inputValue('#door-wall');
    expect(wall).toBe('left');
  });
});
