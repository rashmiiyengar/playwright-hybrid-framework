import { Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected page: Page) {}
  
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}