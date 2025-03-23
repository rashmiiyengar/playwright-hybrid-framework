import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../framework/base-page';
import { Config } from '../../config/config';

export class SauceLoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
  }

  async navigate(): Promise<void> {
    await this.page.goto(Config.getBaseUrl('sauce'));
  }

  async login(username?: string, password?: string): Promise<void> {
    const authConfig = Config.getAuthConfig('sauce');
    await this.usernameInput.fill(username || authConfig.credentials.username);
    await this.passwordInput.fill(password || authConfig.credentials.password);
    await this.loginButton.click();
  }
}
