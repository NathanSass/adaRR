import { test, expect } from '@playwright/test';

test.describe('Interactive Door Placement', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(200);
  });

  test('room preview canvas exists', async ({ page }) => {
    const preview = page.locator('#room-preview');
    await expect(preview).toBeVisible();
  });

  test('room preview renders room outline', async ({ page }) => {
    const hasContent = await page.evaluate(() => {
      const canvas = document.getElementById('room-preview');
      if (!canvas) return false;
      const ctx = canvas.getContext('2d');
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let filled = 0;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 0) filled++;
      }
      return filled > 100;
    });
    expect(hasContent).toBe(true);
  });

  test('door is rendered as blue element on preview', async ({ page }) => {
    const hasBlue = await page.evaluate(() => {
      const canvas = document.getElementById('room-preview');
      if (!canvas) return false;
      const ctx = canvas.getContext('2d');
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let bluePixels = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i+2] > 150 && data[i] < 100 && data[i+3] > 50) bluePixels++;
      }
      return bluePixels > 30;
    });
    expect(hasBlue).toBe(true);
  });

  test('dragging door updates door-x input value', async ({ page }) => {
    const preview = page.locator('#room-preview');
    const box = await preview.boundingBox();
    
    // Get initial door-x value
    const initialX = await page.inputValue('#door-x');
    
    // Drag from center-top (where door is) to the right
    const startX = box.x + box.width * 0.4; // approximate door position
    const startY = box.y + box.height * 0.15; // top wall area
    const endX = box.x + box.width * 0.7; // drag right
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, startY, { steps: 5 });
    await page.mouse.up();
    
    await page.waitForTimeout(100);
    const newX = await page.inputValue('#door-x');
    
    // Door should have moved (value changed)
    expect(parseFloat(newX)).not.toBe(parseFloat(initialX));
  });

  test('dragging door auto-regenerates configurations', async ({ page }) => {
    // First generate configs
    await page.click('#generate');
    await page.waitForTimeout(200);
    const initialCount = await page.locator('.config-card').count();
    
    // Now drag the door
    const preview = page.locator('#room-preview');
    const box = await preview.boundingBox();
    const startX = box.x + box.width * 0.4;
    const startY = box.y + box.height * 0.15;
    const endX = box.x + box.width * 0.6;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, startY, { steps: 5 });
    await page.mouse.up();
    
    await page.waitForTimeout(300);
    
    // Results section should still be visible (auto-regenerated)
    await expect(page.locator('#results-section')).toBeVisible();
  });

  test('door cannot be dragged outside room boundaries', async ({ page }) => {
    const preview = page.locator('#room-preview');
    const box = await preview.boundingBox();
    
    // Try to drag door way past the right edge
    const startX = box.x + box.width * 0.4;
    const startY = box.y + box.height * 0.15;
    const endX = box.x + box.width * 0.99; // extreme right
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, startY, { steps: 5 });
    await page.mouse.up();
    
    await page.waitForTimeout(100);
    const doorX = parseFloat(await page.inputValue('#door-x'));
    const roomW = parseFloat(await page.inputValue('#room-width'));
    const doorW = parseFloat(await page.inputValue('#door-w'));
    
    // Door position + width should not exceed room width
    expect(doorX + doorW).toBeLessThanOrEqual(roomW + 0.1);
  });

  test('cursor changes to grab when hovering over door', async ({ page }) => {
    const preview = page.locator('#room-preview');
    const box = await preview.boundingBox();
    
    // Move to where the door should be (top-center area)
    const doorX = box.x + box.width * 0.4;
    const doorY = box.y + box.height * 0.15;
    
    await page.mouse.move(doorX, doorY);
    await page.waitForTimeout(100);
    
    const cursor = await preview.evaluate(el => el.style.cursor);
    expect(cursor).toBe('grab');
  });
});
