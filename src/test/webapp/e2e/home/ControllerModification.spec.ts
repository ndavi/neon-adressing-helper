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
});
