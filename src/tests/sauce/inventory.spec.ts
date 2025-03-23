import { test, expect } from '../../framework/fixtures';
import { SauceInventoryPage } from '../../pages/sauce-page-objects/inventory-page';

test.describe('Sauce Demo - Login Verification', () => {
  test.beforeEach(async ({ page, currentSite }) => {
    // Skip all tests in this describe block if not running on Sauce Demo site
    test.skip(currentSite !== 'sauce', 'These tests only run on Sauce Demo site');
    
    // Listen for dialogs (like password change prompts) and dismiss them
    page.on('dialog', async (dialog) => {
      console.log('Dialog type:', dialog.type());
      if (dialog.type() === 'alert' || dialog.type() === 'confirm') {
        await dialog.dismiss(); // Dismiss password change or any similar dialog
      }
    });
  });

  test('Verify if user is logged in', async ({ page }) => {
    // Create page object
    const inventoryPage = new SauceInventoryPage(page);

    // Verify we are on the inventory page and logged in
    await inventoryPage.validateLogin();
  });
});
