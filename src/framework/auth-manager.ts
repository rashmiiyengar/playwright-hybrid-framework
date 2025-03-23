import fs from 'fs';
import path from 'path';
import { chromium, BrowserContext } from '@playwright/test';
import { Config, SiteType } from '../config/config';

export class AuthManager {
  static async setupAuth(site: SiteType): Promise<string> {
    const authConfig = Config.getAuthConfig(site);
    const storageStateFile = authConfig.storageStateFile;
    const absoluteStorageStateFile = path.resolve(process.cwd(), storageStateFile);
    const authFolder = path.dirname(absoluteStorageStateFile);
    
    // Check if storage state already exists and is fresh
    if (fs.existsSync(absoluteStorageStateFile)) {
      const stats = fs.statSync(absoluteStorageStateFile);
      const fileAge = (new Date().getTime() - stats.mtime.getTime()) / 1000 / 60; // in minutes
      
      if (fileAge < 60) {
        console.log(`Using existing auth state for ${site}`);
        return absoluteStorageStateFile;
      }
    }

    // Create auth directory if needed
    if (!fs.existsSync(authFolder)) {
      fs.mkdirSync(authFolder, { recursive: true });
    }

    // Setup new auth session
    console.log(`Creating new auth state for ${site}`);
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Go to the site
    await page.goto(Config.getBaseUrl(site));
    
    // Perform the login
    if (site === 'sauce') {
      await page.fill('#user-name', authConfig.credentials.username);
      await page.fill('#password', authConfig.credentials.password);
      await page.click('#login-button');
    } else if (site === 'azure') {
      await page.fill('#username', authConfig.credentials.username);
      await page.fill('#password', authConfig.credentials.password);
      await page.click('.login-btn');
    }
    
    // Wait for successful login
    await page.waitForSelector(authConfig.loggedInSelector);
    
    // Save the storage state
    await context.storageState({ path: absoluteStorageStateFile });
    
    await browser.close();
    return absoluteStorageStateFile;
  }
}
