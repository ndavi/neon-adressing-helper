import { expect, test, type Download, type Page } from '@playwright/test';
import { HomePage } from '../common/primary/app/Home-Page';
import { selector } from '../DataSelectorHelper';

const givenCompositeBarCreated = async (page: Page, barName: string): Promise<void> => {
  await page.goto('/bar-catalog');
  await page.locator(selector('add-2m-segment')).click();
  await page.locator(selector('add-1m-segment')).click();
  await page.locator(selector('add-2m-segment')).click();
  await expect(page.locator(selector('builder-name'))).toHaveText(barName);
  await page.locator(selector('save-composite-bar')).click();
  await expect(page.locator(selector('catalog-bar-item'))).toHaveCount(1);
};

const whenUsingCompositeBarAndExporting = async (page: Page, barName: string): Promise<Download> => {
  await page.locator(selector('back-button')).click();
  await page.waitForURL('**/home');

  const homePage = new HomePage(page);
  await homePage.clickBarAtIndex(0, 0, 0);
  await homePage.selectBarFromMenu(barName);

  return await homePage.downloadExampleCsv();
};

const thenCsvContainsSingleCompositeBarLine = async (download: Download, expectedBarName: string): Promise<void> => {
  const readStream = await download.createReadStream();
  if (!readStream) {
    throw new Error('Download read stream is null');
  }

  const csvContent = await new Promise<string>((resolve, reject) => {
    let data = '';
    readStream.on('data', chunk => {
      data += chunk.toString();
    });
    readStream.on('end', () => {
      resolve(data);
    });
    readStream.on('error', reject);
  });

  const lines = csvContent.split('\n');
  const barLines = lines.filter(line => line.startsWith('BARRE NEON'));
  expect(barLines).toHaveLength(1);
  expect(barLines[0]).toContain(`BARRE NEON - ${expectedBarName}`);
};

test.describe('Composite Bar Export', () => {
  test('Should export a composite bar as a single CSV line', async ({ page }) => {
    const barName = '2M+1M+2M';

    await givenCompositeBarCreated(page, barName);
    const download = await whenUsingCompositeBarAndExporting(page, barName);
    await thenCsvContainsSingleCompositeBarLine(download, barName);
  });
});
