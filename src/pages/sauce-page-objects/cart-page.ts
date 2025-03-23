import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';

export class SauceCartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  
  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('#checkout');
  }
  
  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }
  
  async removeItem(itemIndex: number): Promise<void> {
    const removeButtons = this.page.locator('.cart_item button');
    await removeButtons.nth(itemIndex).click();
  }
  
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}