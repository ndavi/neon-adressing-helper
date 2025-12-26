import { expect, test } from '@playwright/test';
import { HomePage } from './Home-Page';

test.describe('Home', () => {
  test('display home page, interact and download', async ({ page }) => {
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`Console Error: "${msg.text()}"`);
      }
    });

    const homePage = new HomePage(page);
    await homePage.goto();
    await expect(page).toHaveTitle('NeonAdressingTool');

    await homePage.setControllersCount(5);
    await expect(homePage.controllersInput).toHaveValue('5');

    await expect(homePage.visualizerNodes).toHaveCount(5);
    await expect(homePage.visualizerNodes.first()).toContainText('U: 0');

    const download = await homePage.downloadExampleCsv();
    expect(download.suggestedFilename()).toBe('neon-addressing.csv');

    await homePage.takeScreenshot('homepage-ux');
  });
});
