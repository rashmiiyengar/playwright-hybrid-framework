import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';
import { Config, SiteType } from './config';

interface LoginSelectors {
  usernameField: string;
  passwordField: string;
  submitButton: string;
  loggedInSelector: string;
}

export class AuthManager {
  private static getLoginSelectors(site: SiteType): LoginSelectors {
    const selectors: Record<SiteType, LoginSelectors> = {
      'sauce': {
        usernameField: '#user-name',
        passwordField: '#password',
        submitButton: '#login-button',
        loggedInSelector: '.app_logo'
      },
      'second': {
        usernameField: '#username',
        passwordField: '#password',
        submitButton: '.login-btn',
        loggedInSelector: '.dashboard-container'
      },
      'third': {
        usernameField: '#email',
        passwordField: '#password',
        submitButton: 'button[type="submit"]',
        loggedInSelector: '.user-dashboard'
      }
    };
    
    return selectors[site];
  }

  static async setupAuth(site: SiteType): Promise<string> {
    // Validate site type
    const validSite = Config.getSiteType(site as string);
    console.log(`Setting up auth for site: ${validSite}`);

    const authConfig = Config.getAuthConfig(validSite);
    const storageStateFile = authConfig.storageStateFile;
    const relativeStorageStateFile = path.resolve(process.cwd(), storageStateFile);

    if (fs.existsSync(relativeStorageStateFile)) {
      const stats = fs.statSync(relativeStorageStateFile);
      const fileAge = (Date.now() - stats.mtime.getTime()) / 1000 / 60;
      const maxAge = parseInt(process.env.AUTH_MAX_AGE || '60');

      if (fileAge < maxAge) {
        console.log(`✅ Using existing auth state for ${validSite} (${fileAge.toFixed(2)} min old)`);
        return relativeStorageStateFile;
      }
    }

    const authFolder = path.dirname(relativeStorageStateFile);
    if (!fs.existsSync(authFolder)) fs.mkdirSync(authFolder, { recursive: true });

    const screenshotsDir = path.resolve(process.cwd(), '../screenshots');
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

    console.log(`🔒 Creating new auth state for ${validSite}`);
    const browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      const baseUrl = Config.getBaseUrl(validSite);
      console.log(`🌍 Navigating to: ${baseUrl}`);
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

      console.log(`📸 Taking pre-login screenshot`);
      await page.screenshot({ path: `./screenshots/${validSite}-before-login.png` });

      const selectors = AuthManager.getLoginSelectors(validSite);
      console.log(`🔍 Using selectors for ${validSite}:`, selectors);

      if (await page.isClosed()) throw new Error("Page was closed prematurely");

      // Ensure all elements are visible
      await Promise.all([
        page.waitForSelector(selectors.usernameField, { timeout: 10000 }),
        page.waitForSelector(selectors.passwordField, { timeout: 10000 }),
        page.waitForSelector(selectors.submitButton, { timeout: 10000 })
      ]);

      console.log(`⌨️ Filling login form`);
      await page.fill(selectors.usernameField, authConfig.credentials.username);
      await page.fill(selectors.passwordField, authConfig.credentials.password);
      await page.click(selectors.submitButton);

      console.log(`⏳ Waiting for logged-in selector: ${selectors.loggedInSelector}`);
      await page.waitForSelector(selectors.loggedInSelector, { timeout: 15000 });

      await page.screenshot({ path: `./screenshots/${validSite}-after-login.png` });
      await context.storageState({ path: relativeStorageStateFile });
      console.log(`✅ Auth state saved: ${relativeStorageStateFile}`);

    } catch (error) {
      console.error(`❌ Error setting up auth for ${validSite}:`, error);
      if (!page.isClosed()) {
        await page.screenshot({ path: `./screenshots/${validSite}-login-error.png` });
        console.log(`📸 Error screenshot saved.`);
      }
      throw error;
    } finally {
      console.log("🚪 Closing resources...");
      if (!page.isClosed()) await page.close();
      await context.close();
      await browser.close();
    }

    return relativeStorageStateFile;
  }
}
