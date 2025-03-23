export interface SiteCredentials {
    username: string;
    password: string;
  }
  
  export interface SiteAuthConfig {
    storageStateFile: string;
    credentials: SiteCredentials;
    loggedInSelector: string;
  }
  
  export interface SiteConfig {
    baseUrl: string;
    authConfig: SiteAuthConfig;
  }
  
  export type SiteType = 'sauce' | 'azure';
  
  export class Config {
    private static readonly sites: Record<SiteType, SiteConfig> = {
      'sauce': {
        baseUrl: 'https://www.saucedemo.com',
        authConfig: {
          storageStateFile: './auth/sauce-storage-state.json',
          credentials: {
            username: 'standard_user',
            password: 'secret_sauce'
          },
          loggedInSelector: '.app_logo'
        }
      },
      'azure': {
        baseUrl: 'https://trainee-web-app.azurewebsites.net/auth/login',
        authConfig: {
          storageStateFile: './auth/other-storage-state.json',
          credentials: {
            username: 'testuser',
            password: 'password123'
          },
          loggedInSelector: '.dashboard-container'
        }
      }
    };
  
    static getBaseUrl(site: SiteType): string {
      return this.sites[site]?.baseUrl || this.sites['sauce'].baseUrl;
    }
  
    static getAuthConfig(site: SiteType): SiteAuthConfig {
      return this.sites[site]?.authConfig || this.sites['sauce'].authConfig;
    }
  
    static getSiteConfig(site: SiteType): SiteConfig {
      return this.sites[site] || this.sites['sauce'];
    }
  }
  