import { test as base } from '@playwright/test';
import { AuthManager } from './auth-manager';
import { SiteType, Config, SiteConfig } from './config';

// Get the site from environment variable or default to sauce
const site = (process.env.SITE as SiteType) || 'sauce';

// Define interface for test fixtures
interface TestFixtures {
  currentSite: SiteType;
  baseUrl: string;
  siteConfig: any;
}

// Create a test fixture that automatically handles authentication
export const test = base.extend<TestFixtures>({
  // Override the context fixture to use stored authentication
  context: async ({ browser }, use) => {
    console.log('Setting up auth for site:', site);
    try {
      // Setup authentication and get the storage state file
      const storageStatePath = await AuthManager.setupAuth(site);
      console.log('Auth setup complete, storage path:', storageStatePath);
      
      // Create a context with the stored authentication
      const context = await browser.newContext({
        storageState: storageStatePath
      });
      
      await use(context);
      await context.close();
    } catch (error) {
      console.error('Error in auth setup:', error);
      throw error;
    }
  },
  
  // Custom property to easily access the current site
  currentSite: async ({}, use) => {
    await use(site);
  },
  
  // Custom property to easily access the base URL
  baseUrl: async ({}, use) => {
    await use(Config.getBaseUrl(site));
  },
  
  // Access to full site config
  siteConfig: async ({}: any, use: (arg0: SiteConfig) => any) => {
    await use(Config.getSiteConfig(site));
  },
  
  // Automatically navigate to base URL before each test
  page: async ({ page, baseUrl }, use) => {
    await page.goto(baseUrl);
    await use(page);
  }
});

export { expect } from '@playwright/test';