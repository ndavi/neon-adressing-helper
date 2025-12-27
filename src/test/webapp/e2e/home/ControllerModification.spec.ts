import { expect, test } from '@playwright/test';
import { HomePage } from '../common/primary/app/Home-Page';

test.describe('Controller Modification', () => {
  test('should modify controllers and outputs and update universe counts', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Start with 1 controller
    await homePage.setControllersCount(1);
    await expect(homePage.controllerCards).toHaveCount(1);

    // Check initial universe counts (1 bar = 1 universe)
    expect(await homePage.getUniverseCount(0)).toBe('1');
    expect(await homePage.getEndUniverse(0)).toBe('0');
    const totalCount = page.locator('[data-selector="total-universe-count"]');
    await expect(totalCount).toHaveText('1');

    // Add 1 more bar to have 2 bars total
    const outputCards = await homePage.getOutputCards(0);
    const firstOutput = outputCards.first();
    await firstOutput.locator('[data-selector="add-bar-button"]').click();

    // Now: 2 bars (2M) -> 714 channels -> 2 universes
    // Start: 0, Count: 2, End: 1
    expect(await homePage.getUniverseCount(0)).toBe('2');
    expect(await homePage.getEndUniverse(0)).toBe('1');
    await expect(totalCount).toHaveText('2');

    // Duplicate controller (which has 2 bars -> 2 universes)
    await homePage.duplicateController(0);
    await expect(homePage.controllerCards).toHaveCount(2);

    // Total should be 2 + 2 = 4
    await expect(totalCount).toHaveText('4');

    // Delete first controller
    await homePage.deleteController(0);
    await expect(homePage.controllerCards).toHaveCount(1);
    // Total should be 2 again
    await expect(totalCount).toHaveText('2');

    // Output manipulation
    const outputs = homePage.controllerCards.nth(0).locator('[data-selector="led-output-card"]');
    await expect(outputs).toHaveCount(1);

    // Duplicate output (which has 2 bars -> 2 universes)
    await homePage.duplicateOutput(0, 0);
    await expect(outputs).toHaveCount(2);
    // Total should be 3 universes (1428 channels)
    expect(await homePage.getUniverseCount(0)).toBe('3');
    await expect(totalCount).toHaveText('3');

    // Delete output
    await homePage.deleteOutput(0, 0);
    await expect(outputs).toHaveCount(1);
    await expect(totalCount).toHaveText('2');
  });
});
