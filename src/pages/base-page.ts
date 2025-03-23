// File: pages/base-page.ts
import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
  
  async waitForPageLoad(timeout: number = 30000): Promise<void> {
    try {
      await this.page.waitForLoadState('networkidle', { timeout });
    } catch (error) {
      console.warn('Warning: Network idle timeout exceeded, continuing anyway');

    }
  }
  
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
  
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    await this.waitForPageLoad();
  }
  
  async clickElement(selector: string, options?: { timeout?: number, force?: boolean }): Promise<void> {
    await this.page.click(selector, options);
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

  async waitForSelector(selector: string, timeout?: number): Promise<void> {
    await this.page.waitForSelector(selector, {
      timeout: timeout || 10000
    });
  }
  
  async expectElementToBeVisible(selector: string, timeout?: number): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible({ timeout: timeout || 5000 });
  }
  
  async getText(selector: string): Promise<string | null> {
    return await this.page.locator(selector).textContent();
  }
  
  async getCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }
  
  async screenshotElement(selector: string, filename: string): Promise<void> {
    await this.page.locator(selector).screenshot({ path: `./screenshots/${filename}` });
  }
}