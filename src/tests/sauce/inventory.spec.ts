import { test, expect } from '../../framework/fixtures';
import { SauceInventoryPage } from '../../pages/sauce-page-objects/inventory-page';
import { SauceCartPage } from '../../pages/sauce-page-objects/cart-page';

test.describe('Sauce Demo - Inventory Tests', () => {
  test.beforeEach(async ({ currentSite }) => {
    // Skip all tests in this describe block if not running on sauce site
    test.skip(currentSite !== 'sauce', 'These tests only run on Sauce Demo site');
  });

  test('Add item to cart', async ({ page }) => {
    // Create page object
    const inventoryPage = new SauceInventoryPage(page);
    
    // Verify we are on the inventory page
    await expect(inventoryPage.inventoryContainer).toBeVisible({ timeout: 10000 });
    
    // Add item to cart
    await inventoryPage.addItemToCart(0);
    
    // Verify item was added
    await expect(inventoryPage.cartBadge).toBeVisible();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});