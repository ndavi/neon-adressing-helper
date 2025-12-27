import { expect, test } from '@playwright/test';
import { HomePage } from '../common/primary/app/Home-Page';

test.describe('Controller Modification', () => {
  test('should duplicate and delete controllers and outputs', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Start with 1 controller
    await homePage.setControllersCount(1);
    await expect(homePage.controllerCards).toHaveCount(1);

    // Duplicate controller
    await homePage.duplicateController(0);
    await expect(homePage.controllerCards).toHaveCount(2);

    // Check titles to ensure order
    await expect(homePage.controllerCards.nth(0)).toContainText('Contrôleur 1');
    await expect(homePage.controllerCards.nth(1)).toContainText('Contrôleur 2');

    // Delete first controller
    await homePage.deleteController(0);
    await expect(homePage.controllerCards).toHaveCount(1);
    await expect(homePage.controllerCards.nth(0)).toContainText('Contrôleur 1'); // Re-indexed? No, title uses index + 1 from loop. If we remove index 0, the one that was index 1 becomes index 0, so it displays "Contrôleur 1".

    // Output manipulation
    // Ensure we have 1 output initially (default)
    const outputs = homePage.controllerCards.nth(0).locator('[data-selector="led-output-card"]');
    await expect(outputs).toHaveCount(1);

    // Duplicate output
    await homePage.duplicateOutput(0, 0);
    await expect(outputs).toHaveCount(2);

    // Delete output
    await homePage.deleteOutput(0, 0);
    await expect(outputs).toHaveCount(1);
  });

  test('should display universe count and end universe', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.setControllersCount(1);
    const outputCards = await homePage.getOutputCards(0);
    const firstOutput = outputCards.first();

    // Initial state: 1 output with 0 bars -> 0 channels -> 0 universes
    // Start universe is 0 (default)
    expect(await homePage.getUniverseCount(0)).toBe('0');
    expect(await homePage.getEndUniverse(0)).toBe('0');

    // Add a bar to the first output (2M -> 357 channels)
    await firstOutput.locator('[data-selector="add-bar-button"]').click();
    // Now: 1 bar (2M) -> 357 channels -> 1 universe
    // Start: 0, Count: 1, End: 0 + 1 - 1 = 0
    expect(await homePage.getUniverseCount(0)).toBe('1');
    expect(await homePage.getEndUniverse(0)).toBe('0');

    // Add another bar to the first output
    await firstOutput.locator('[data-selector="add-bar-button"]').click();
    // Now: 2 bars (2M) -> 714 channels -> 2 universes
    // Start: 0, Count: 2, End: 0 + 2 - 1 = 1
    expect(await homePage.getUniverseCount(0)).toBe('2');
    expect(await homePage.getEndUniverse(0)).toBe('1');
  });

  test('should display total universe count', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.setControllersCount(2);

    const outputCards = await homePage.getOutputCards(0);
    const firstOutput = outputCards.first();

    // 1st controller: add 2 bars -> 2 universes
    await firstOutput.locator('[data-selector="add-bar-button"]').click();
    await firstOutput.locator('[data-selector="add-bar-button"]').click();

    // 2nd controller: add 1 bar -> 1 universe
    const outputCards2 = await homePage.getOutputCards(1);
    await outputCards2.first().locator('[data-selector="add-bar-button"]').click();

    // Total should be 3
    const totalCount = await page.locator('[data-selector="total-universe-count"]').textContent();
    expect(totalCount?.trim()).toBe('3');
  });
});
