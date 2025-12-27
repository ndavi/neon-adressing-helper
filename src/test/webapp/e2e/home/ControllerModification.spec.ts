import { expect, test } from '@playwright/test';
import { HomePage } from '../common/primary/app/Home-Page';

test.describe('Controller Modification', () => {
  test('should modify controllers and outputs and update universe counts', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.setControllersCount(1);
    await expect(homePage.controllerCards).toHaveCount(1);

    expect(await homePage.getUniverseCount(0)).toBe('1');
    expect(await homePage.getEndUniverse(0)).toBe('0');
    const totalCount = page.locator('[data-selector="total-universe-count"]');
    await expect(totalCount).toHaveText('1');

    const outputCards = await homePage.getOutputCards(0);
    const firstOutput = outputCards.first();
    await firstOutput.locator('[data-selector="add-bar-button"]').click();

    expect(await homePage.getUniverseCount(0)).toBe('2');
    expect(await homePage.getEndUniverse(0)).toBe('1');
    await expect(totalCount).toHaveText('2');

    await homePage.duplicateController(0);
    await expect(homePage.controllerCards).toHaveCount(2);

    await expect(totalCount).toHaveText('4');

    await homePage.deleteController(0);
    await expect(homePage.controllerCards).toHaveCount(1);
    await expect(totalCount).toHaveText('2');

    const outputs = homePage.controllerCards.nth(0).locator('[data-selector="led-output-card"]');
    await expect(outputs).toHaveCount(1);

    await homePage.duplicateOutput(0, 0);
    await expect(outputs).toHaveCount(2);
    expect(await homePage.getUniverseCount(0)).toBe('3');
    await expect(totalCount).toHaveText('3');

    await homePage.deleteOutput(0, 0);
    await expect(outputs).toHaveCount(1);
    await expect(totalCount).toHaveText('2');
  });
});
