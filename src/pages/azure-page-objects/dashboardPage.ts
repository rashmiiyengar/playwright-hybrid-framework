import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';

export class SecondDashboardPage extends BasePage {
  readonly dashboardContainer: Locator;
  readonly userGreeting: Locator;
  readonly menuItems: Locator;
  
  constructor(page: Page) {
    super(page);
    this.dashboardContainer = page.locator('.dashboard-container');
    this.userGreeting = page.locator('.user-greeting');
    this.menuItems = page.locator('.menu-item');
  }
  
  async navigateToMenuItem(menuName: string): Promise<void> {
    const menuLocator = this.page.locator(`.menu-item:has-text("${menuName}")`);
    await menuLocator.click();
  }
  
  async getUserName(): Promise<string> {
    const greeting = await this.userGreeting.textContent();
    return greeting ? greeting.replace('Welcome, ', '').replace('!', '') : '';
  }
  
  async isLoggedIn(): Promise<boolean> {
    return await this.dashboardContainer.isVisible();
  }
}