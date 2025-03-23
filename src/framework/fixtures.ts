import { test as base } from '@playwright/test';
import { AuthManager } from './auth-manager';
import { SiteType } from '../config/config';

// Get the site from environment variable or default to sauce
const site = (process.env.SITE as SiteType) || 'sauce';

// Define interface for test fixtures
interface TestFixtures {
  currentSite: SiteType;
}

// Create a test fixture that automatically handles authentication
export const test = base.extend<TestFixtures>({
  // Override the context fixture to use stored authentication
  context: async ({ browser }, use) => {
    // Setup authentication and get the storage state file
    const storageStatePath = await AuthManager.setupAuth(site);
    
    // Create a context with the stored authentication
    const context = await browser.newContext({
      storageState: storageStatePath
    });
    
    await use(context);
    await context.close();
  },
  
  // Custom property to easily access the current site
  currentSite: async ({}, use) => {
    await use(site);
  }
});

export { expect } from '@playwright/test';