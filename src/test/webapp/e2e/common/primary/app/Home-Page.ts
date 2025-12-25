import { type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly controllersInput: Locator;
  readonly downloadButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.controllersInput = page.locator('#controllers-count');
    this.downloadButton = page.locator('.button');
  }

  async verifyLogoVisible() {
    const logo = this.page.locator('img[alt="Vue logo"]');
    await logo.waitFor({ state: 'visible' });
    const isVisible = await logo.isVisible();
    if (!isVisible) throw new Error('Logo is not visible');

    // Check if image is actually loaded (naturalWidth > 0)
    const naturalWidth = await logo.evaluate((img: HTMLImageElement) => img.naturalWidth);
    if (naturalWidth === 0) throw new Error('Logo image failed to load (naturalWidth is 0)');
  }

  async goto() {
    await this.page.goto('/');
  }

  async setControllersCount(count: number) {
    await this.controllersInput.fill(count.toString());
  }

  async downloadExampleCsv() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.downloadButton.click();
    return downloadPromise;
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `target/playwright-screenshots/${name}.png`, fullPage: true });
  }
}
