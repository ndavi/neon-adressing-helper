import { expect, test } from '@playwright/test';
import { HomePage } from './Home-Page';

test.describe('Resizable Split Pane', () => {
  test('should resize the split pane when dragging the divider', async ({ page }) => {
    // Given
    const homePage = new HomePage(page);
    await homePage.goto();

    const viewportSize = page.viewportSize();
    const isDesktop = viewportSize !== null && viewportSize.width >= 960;
    test.skip(!isDesktop, 'Split pane is only visible on desktop');

    const divider = page.locator('.split-pane-divider');
    await expect(divider).toBeVisible();

    const leftPane = page.locator('.split-pane-left');
    const initialWidth = await leftPane.evaluate(el => el.getBoundingClientRect().width);

    // When - drag the divider 100px to the left
    const dividerBox = await divider.boundingBox();
    if (!dividerBox) throw new Error('Divider not found');

    await page.mouse.move(dividerBox.x + dividerBox.width / 2, dividerBox.y + dividerBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(dividerBox.x - 100, dividerBox.y + dividerBox.height / 2);
    await page.mouse.up();

    // Then - left pane should be narrower
    const newWidth = await leftPane.evaluate(el => el.getBoundingClientRect().width);
    expect(newWidth).toBeLessThan(initialWidth);
  });

  test('should persist split pane width across page reloads', async ({ page }) => {
    // Given
    const homePage = new HomePage(page);
    await homePage.goto();

    const viewportSize = page.viewportSize();
    const isDesktop = viewportSize !== null && viewportSize.width >= 960;
    test.skip(!isDesktop, 'Split pane is only visible on desktop');

    const divider = page.locator('.split-pane-divider');
    const leftPane = page.locator('.split-pane-left');

    // When - resize the pane
    const dividerBox = await divider.boundingBox();
    if (!dividerBox) throw new Error('Divider not found');

    await page.mouse.move(dividerBox.x + dividerBox.width / 2, dividerBox.y + dividerBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(dividerBox.x - 150, dividerBox.y + dividerBox.height / 2);
    await page.mouse.up();

    const widthAfterResize = await leftPane.evaluate(el => el.getBoundingClientRect().width);

    // When - reload the page
    await page.reload();

    // Then - width should be persisted
    const widthAfterReload = await leftPane.evaluate(el => el.getBoundingClientRect().width);
    expect(Math.abs(widthAfterReload - widthAfterResize)).toBeLessThan(5);
  });
});
