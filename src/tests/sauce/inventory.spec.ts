import { test, expect } from '../../framework/fixtures';
import { SauceInventoryPage } from '../../pages/sauce-page-objects/inventory-page';
import { Config } from '../../config/config';

test('Sauce Demo - Add item to cart', async ({ page, currentSite }) => {
  // Skip test if not running on sauce site
  test.skip(currentSite !== 'sauce', 'This test only runs on Sauce Demo site');
  
  // Go to inventory page - already authenticated
 
  
  // Create page object
  const inventoryPage = new SauceInventoryPage(page);
  
  // Verify we are on the inventory page
  await expect(inventoryPage.inventoryContainer).toBeVisible();
  
  // Add item to cart
  await inventoryPage.addItemToCart(0);
  
  // Verify item was added
  await expect(inventoryPage.cartBadge).toBeVisible();
  await expect(inventoryPage.cartBadge).toHaveText('1');
});