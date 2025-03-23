import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';

export class SauceInventoryPage extends BasePage {
  readonly inventoryContainer: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  
  constructor(page: Page) {
    super(page);
    this.inventoryContainer = page.locator('.header_secondary_container');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('.product_sort_container');
  }
  
  async addItemToCart(itemIndex: number): Promise<void> {
    const addToCartButtons = this.page.locator('.inventory_item button');
    await addToCartButtons.nth(itemIndex).click();
  }
  
  async sortProducts(sortOption: string): Promise<void> {
    await this.sortDropdown.selectOption(sortOption);
  }
  
  async getProductNames(): Promise<string[]> {
    const productNameElements = this.page.locator('.inventory_item_name');
    return await productNameElements.allTextContents();
  }
  
  async getProductPrices(): Promise<number[]> {
    const priceElements = this.page.locator('.inventory_item_price');
    const priceTexts = await priceElements.allTextContents();
    return priceTexts.map(text => parseFloat(text.replace('$', '')));
  }
}
