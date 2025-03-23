import { test } from '../../framework/fixtures';
import { SauceInventoryPage } from '../../pages/sauce-page-objects/inventory-page';

test.describe('Sauce Demo - Inventory Page Tests', () => {
  test.beforeEach(async ({ page, currentSite, baseURL }) => {
    test.skip(currentSite !== 'sauce', 'These tests only run on Sauce Demo site');
    
    await page.goto(`${baseURL}/inventory.html`);
    
    page.on('dialog', async (dialog) => {
      console.log('Dialog appeared:', dialog.type());
      await dialog.dismiss();
    });
  });

  test('Verify if user is logged in', async ({ page }) => {
    const inventoryPage = new SauceInventoryPage(page);
    const isLoaded = await inventoryPage.verifyInventoryPageLoaded();
    test.expect(isLoaded).toBeTruthy();
  });
  
});