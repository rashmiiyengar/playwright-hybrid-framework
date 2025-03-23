// auth-manager.ts
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
  // Define the site-specific login selectors directly in the AuthManager
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
    
    return selectors[site] || selectors['sauce'];
  }

  static async setupAuth(site: SiteType): Promise<string> {
    const authConfig = Config.getAuthConfig(site);
    const storageStateFile = authConfig.storageStateFile;
    const absoluteStorageStateFile = path.resolve(process.cwd(), storageStateFile);
    const authFolder = path.dirname(absoluteStorageStateFile);
    
    // Check if storage state already exists and is fresh
    if (fs.existsSync(absoluteStorageStateFile)) {
      const stats = fs.statSync(absoluteStorageStateFile);
      const fileAge = (new Date().getTime() - stats.mtime.getTime()) / 1000 / 60; // in minutes
      const maxAge = parseInt(process.env.AUTH_MAX_AGE || '60'); // Default 60 minutes
      
      if (fileAge < maxAge) {
        console.log(`Using existing auth state for ${site} (${fileAge.toFixed(2)} minutes old)`);
        return absoluteStorageStateFile;
      }
    }

    // Create auth directory if needed
    if (!fs.existsSync(authFolder)) {
      fs.mkdirSync(authFolder, { recursive: true });
    }

    // Ensure screenshots directory exists
    const screenshotsDir = path.resolve(process.cwd(), './screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    // Setup new auth session
    console.log(`Creating new auth state for ${site}`);
    const browser = await chromium.launch({ 
      headless: process.env.HEADLESS !== 'false'
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      // Go to the site
      console.log(`Navigating to: ${Config.getBaseUrl(site)}`);
      await page.goto(Config.getBaseUrl(site));
      
      // Log current page details
      console.log(`Current URL after navigation: ${page.url()}`);
      await page.screenshot({ path: `./screenshots/${site}-before-login.png` });
      
      // Get login selectors for this site
      const selectors = AuthManager.getLoginSelectors(site);
      console.log(`Using selectors for ${site}:`, selectors);
      
      // Check if selectors are present
      const usernameVisible = await page.isVisible(selectors.usernameField);
      const passwordVisible = await page.isVisible(selectors.passwordField);
      const submitVisible = await page.isVisible(selectors.submitButton);
      
      console.log(`Login form visibility check:
        - Username field (${selectors.usernameField}): ${usernameVisible}
        - Password field (${selectors.passwordField}): ${passwordVisible}
        - Submit button (${selectors.submitButton}): ${submitVisible}`);
      
      if (!usernameVisible || !passwordVisible || !submitVisible) {
        console.log("One or more login elements not found on page!");
        // Dump HTML for debugging
        const pageContent = await page.content();
        fs.writeFileSync(`./screenshots/${site}-page-content.html`, pageContent);
      }
      
      // Fill login form using site-specific selectors
      console.log(`Entering username: ${authConfig.credentials.username}`);
      await page.fill(selectors.usernameField, authConfig.credentials.username);
      
      console.log(`Entering password: ***`);
      await page.fill(selectors.passwordField, authConfig.credentials.password);
      
      console.log(`Clicking submit button: ${selectors.submitButton}`);
      await page.click(selectors.submitButton);
      
      console.log(`Waiting for logged-in selector: ${selectors.loggedInSelector}`);
      
      // Wait for successful login
      await page.screenshot({ path: `./screenshots/${site}-after-login.png` });
    } catch (error) {
      console.error(`❌ Error setting up auth for ${site}:`, error);
      // Take screenshot on failure
      await page.screenshot({ path: `./screenshots/${site}-login-error.png` });
      throw error;
    } finally {
      await browser.close();
    }
    
    return absoluteStorageStateFile;
  }
}