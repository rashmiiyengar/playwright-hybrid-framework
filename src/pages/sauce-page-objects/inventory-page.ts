import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../framework/base-page';

export class SauceInventoryPage extends BasePage {
  readonly inventoryContainer: Locator;
  readonly inventoryItems: Locator;
  readonly addToCartButtons: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryContainer = page.locator('.app_logo');
    this.inventoryItems = page.locator('.inventory_item');
    this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async addItemToCart(itemIndex: number = 0): Promise<void> {
    await this.addToCartButtons.nth(itemIndex).click();
  }

  async getItemCount(): Promise<number> {
    return await this.inventoryItems.count();
  }

  async goToCart(): Promise<void> {
    await this.page.click('.shopping_cart_link');
  }
}
