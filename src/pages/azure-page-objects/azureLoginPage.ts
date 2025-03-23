import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../framework/base-page';
import { Config } from '../../config/config';

export class OtherLoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('.login-btn');
  }

  async navigate(): Promise<void> {
    await this.page.goto(Config.getBaseUrl('azure'));
  }

  async login(username?: string, password?: string): Promise<void> {
    const authConfig = Config.getAuthConfig('azure');
    await this.usernameInput.fill(username || authConfig.credentials.username);
    await this.passwordInput.fill(password || authConfig.credentials.password);
    await this.loginButton.click();
  }
}
