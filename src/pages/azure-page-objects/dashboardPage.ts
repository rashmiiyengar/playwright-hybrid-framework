import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../framework/base-page';

export class DashboardPage extends BasePage {
  readonly dashboardContainer: Locator;
  readonly userProfile: Locator;
  readonly menuItems: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardContainer = page.locator('.dashboard-container');
    this.userProfile = page.locator('.user-profile');
    this.menuItems = page.locator('.menu-item');
  }

  async navigateToSection(sectionName: string): Promise<void> {
    await this.page.click(`.menu-item:text("${sectionName}")`);
  }

  async getUserInfo(): Promise<string> {
    return await this.userProfile.innerText();
  }
}