import { type Locator, type Page } from '@playwright/test';
import { selector } from '../../../DataSelectorHelper';

export class HomePage {
  readonly page: Page;
  readonly controllersInput: Locator;
  readonly downloadButton: Locator;
  readonly visualizerNodes: Locator;
  readonly controllerCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.controllersInput = page.locator('#controllers-count');
    this.downloadButton = page.locator(selector('download-button'));
    this.visualizerNodes = page.locator(selector('controller-node'));
    this.controllerCards = page.locator(selector('controller-card'));
  }

  async goto() {
    await this.page.goto('/');
  }

  async setControllersCount(count: number) {
    await this.controllersInput.fill(count.toString());
  }

  async duplicateController(index: number) {
    await this.controllerCards.nth(index).locator(selector('duplicate-controller')).click();
  }

  async deleteController(index: number) {
    await this.controllerCards.nth(index).locator(selector('delete-controller')).click();
  }

  async duplicateOutput(controllerIndex: number, outputIndex: number) {
    await this.controllerCards.nth(controllerIndex).locator(selector('duplicate-output')).nth(outputIndex).click();
  }

  async deleteOutput(controllerIndex: number, outputIndex: number) {
    await this.controllerCards.nth(controllerIndex).locator(selector('delete-output')).nth(outputIndex).click();
  }

  async getOutputCards(controllerIndex: number) {
    return this.controllerCards.nth(controllerIndex).locator(selector('led-output-card')); // Assuming we have a selector for LedOutputCard if we added it, let's check
  }

  async getVisualizerNodesCount() {
    return await this.visualizerNodes.count();
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
