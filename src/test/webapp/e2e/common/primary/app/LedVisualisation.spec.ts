import { expect, test } from '@playwright/test';
import { HomePage } from './Home-Page';

test.describe('Led Visualisation', () => {
  test('should visualize output bars when adding them', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // 1 Controller
    await homePage.setControllersCount(1);

    // Set 1 output for Controller 1
    // Based on HomepageVue, we have a v-text-field for universe and one for outputs.
    // We target the input inside the first controller card.
    const controllerCard = page.locator('.controller-card').first();
    await expect(controllerCard).toBeVisible();

    // The second input in the card is "Nombre de sorties"
    // Vuetify inputs are wrapped, we target the input element.
    // Label is "Nombre de sorties"
    const outputsInput = controllerCard.getByLabel('Nombre de sorties');
    await outputsInput.fill('1');

    // Check if LedOutputCard appears.
    // LedOutputCard has text "Sortie 1".
    // It should be inside the controller card or associated with it.
    // In the future implementation, it will likely be inside the controller card or below the inputs.
    // We search for text "Sortie 1" anywhere for now, but scoped to valid area is better.
    const outputCard = page.locator('.v-card').filter({ hasText: 'Sortie 1' }).first();
    await expect(outputCard).toBeVisible();

    // Click "+"
    // The button has icon mdi-plus.
    const plusBtn = outputCard.locator('button').filter({ has: page.locator('.mdi-plus') });
    await plusBtn.click();

    // Check for bar
    // The bar has title 'Barre 1'
    const bar = outputCard.locator('[title="Barre 1"]');
    await expect(bar).toBeVisible();
  });
});
