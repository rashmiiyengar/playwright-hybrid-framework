// File: pages/sauce-page-objects/inventory-page.ts
import { Page, expect } from '@playwright/test';
import { BasePage } from '../base-page';

export class SauceInventoryPage extends BasePage {
  private readonly inventoryContainer = '.app_logo';
  
  constructor(page: Page) {
    super(page);
  }
  
  async verifyInventoryPageLoaded(): Promise<boolean> {
    try {
      await this.waitForSelector(this.inventoryContainer, 10000);
      return true;
    } catch (error) {
      console.error('Error verifying inventory page loaded:', error);
      return false;
    }
  }
}