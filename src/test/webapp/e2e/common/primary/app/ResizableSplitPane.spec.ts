import { expect, type Locator, type Page, test } from '@playwright/test';
import { HomePage } from './Home-Page';

test.describe('Resizable Split Pane', () => {
  test('should resize the split pane when dragging the divider to the left', async ({ page }) => {
    await givenDesktopHomePage(page);
    const initialWidth = await givenLeftPaneWidth(page);

    await whenDraggingDividerToLeft(page, 100);

    await thenLeftPaneShouldBeNarrower(page, initialWidth);
  });

  test('should persist split pane width across page reloads', async ({ page }) => {
    await givenDesktopHomePage(page);

    await whenDraggingDividerToLeft(page, 150);
    const widthAfterResize = await givenLeftPaneWidth(page);

    await whenReloadingPage(page);

    await thenWidthShouldBePersisted(page, widthAfterResize);
  });
});

async function givenDesktopHomePage(page: Page): Promise<void> {
  const homePage = new HomePage(page);
  await homePage.goto();

  const viewportSize = page.viewportSize();
  const isDesktop = viewportSize !== null && viewportSize.width >= 960;
  test.skip(!isDesktop, 'Split pane is only visible on desktop');

  const divider = dividerLocator(page);
  await expect(divider).toBeVisible();
}

async function givenLeftPaneWidth(page: Page): Promise<number> {
  const leftPane = leftPaneLocator(page);
  return await leftPane.evaluate(el => el.getBoundingClientRect().width);
}

async function whenDraggingDividerToLeft(page: Page, pixels: number): Promise<void> {
  const divider = dividerLocator(page);
  const dividerBox = await divider.boundingBox();
  if (!dividerBox) throw new Error('Divider not found');

  const centerX = dividerBox.x + dividerBox.width / 2;
  const centerY = dividerBox.y + dividerBox.height / 2;

  await page.mouse.move(centerX, centerY);
  await page.mouse.down();
  await page.mouse.move(centerX - pixels, centerY);
  await page.mouse.up();
}

async function whenReloadingPage(page: Page): Promise<void> {
  await page.reload();
}

async function thenLeftPaneShouldBeNarrower(page: Page, initialWidth: number): Promise<void> {
  const newWidth = await givenLeftPaneWidth(page);
  expect(newWidth).toBeLessThan(initialWidth);
}

async function thenWidthShouldBePersisted(page: Page, expectedWidth: number): Promise<void> {
  const currentWidth = await givenLeftPaneWidth(page);
  expect(Math.abs(currentWidth - expectedWidth)).toBeLessThan(5);
}

function dividerLocator(page: Page): Locator {
  return page.locator('.split-pane-divider');
}

function leftPaneLocator(page: Page): Locator {
  return page.locator('.split-pane-left');
}
