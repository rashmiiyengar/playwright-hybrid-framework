import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
  
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
  
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
  
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }
  
  async clickElement(selector: string): Promise<void> {
    await this.page.click(selector);
  }
  
  async fillField(selector: string, value: string): Promise<void> {
    await this.page.fill(selector, value);
  }
  
  async isElementVisible(selector: string, timeout?: number): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { 
        state: 'visible', 
        timeout: timeout || 5000 
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
