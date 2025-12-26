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
