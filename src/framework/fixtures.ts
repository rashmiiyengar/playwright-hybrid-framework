import { test as base } from '@playwright/test';
import { AuthManager } from './auth-manager';
import { Config, SiteType } from './config';

type CustomFixtures = {
  currentSite: SiteType;
  baseURL: string;
};

export const test = base.extend<CustomFixtures>({
  // Provide the current site type to tests
  currentSite: async ({}, use) => {
    const siteType = (process.env.SITE || 'sauce') as SiteType;
    console.log(`Using site: ${siteType}`);
    await use(siteType);
  },

  // Override the context to use auth storage state
  context: async ({ browser, currentSite }, use) => {
    console.log(`Setting up auth for site: ${currentSite}`);
    const storageStatePath = await AuthManager.setupAuth(currentSite);
    console.log(`Auth setup complete, storage path: ${storageStatePath}`);
    const context = await browser.newContext({ storageState: storageStatePath });
    await use(context);
  },
  
  baseURL: async ({ currentSite }, use) => {
    const url = Config.getBaseUrl(currentSite);
    console.log(`Using base URL: ${url}`);
    await use(url);
  },
});

export { expect } from '@playwright/test';