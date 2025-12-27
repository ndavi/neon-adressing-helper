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

  async configureExampleState() {
    const cards = this.controllerCards;
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      const targetCount = i < 4 ? 8 : 4;
      const card = cards.nth(i);
      const outputInput = card.locator('input').nth(1);
      await outputInput.fill(targetCount.toString());
    }

    // Wait for the UI to update after changing output counts
    // This is implicit in Playwright actions but good to be aware of

    for (let i = 0; i < count; i++) {
      const outputCount = i < 4 ? 8 : 4;
      const currentCard = cards.nth(i);

      for (let k = 0; k < outputCount; k++) {
        const outputCard = currentCard.locator(selector('led-output-card')).nth(k);

        // Add first bar (0 -> 1)
        await outputCard.locator(selector('add-bar-button')).click();

        const needsSecondBar = (i < 4 && k < 2) || i === 4;
        if (needsSecondBar) {
          // Add second bar (1 -> 2)
          await outputCard.locator(selector('add-bar-button')).click();
        }
      }
    }
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
