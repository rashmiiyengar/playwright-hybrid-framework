import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';

export class SauceInventoryPage extends BasePage {
  readonly appLogo: Locator;

  constructor(page: Page) {
    super(page);
    this.appLogo = this.page.locator('.app_logo'); // Element that indicates a successful login
  }

  /**
   * Validate that the user is logged in by checking the visibility of the app logo.
   */
  async validateLogin(): Promise<void> {
    // Wait for the page to be fully loaded before checking login
    await this.waitForPageLoad();
    
    // Wait for the app logo to be visible, indicating successful login
    await this.appLogo.waitFor({ state: 'visible', timeout: 10000 });
  }
}
