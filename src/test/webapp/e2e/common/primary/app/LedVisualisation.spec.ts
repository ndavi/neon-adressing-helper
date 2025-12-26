import { expect, test } from '@playwright/test';
import { HomePage } from './Home-Page';

test.describe('Led Visualisation', () => {
  test('should visualize output bars when adding them', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.setControllersCount(1);

    const controllerCard = page.locator('.controller-card').first();
    await expect(controllerCard).toBeVisible();

    const outputsInput = controllerCard.getByLabel('Nombre de sorties');
    await outputsInput.fill('1');

    const outputCard = page.locator('.v-card').filter({ hasText: 'Sortie 1' }).first();
    await expect(outputCard).toBeVisible();

    const plusBtn = outputCard.locator('button').filter({ has: page.locator('.mdi-plus') });
    await plusBtn.click();

    const bar = outputCard.locator('[title="Barre 1 (2M)"]');
    await expect(bar).toBeVisible();
  });
});
