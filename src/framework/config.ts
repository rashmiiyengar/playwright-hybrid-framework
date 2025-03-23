// config.ts
export interface SiteCredentials {
  username: string;
  password: string;
}

export interface SiteAuthConfig {
  storageStateFile: string;
  credentials: SiteCredentials;
}

export interface SiteConfig {
  baseUrl: string;
  authConfig: SiteAuthConfig;
}

export type SiteType = 'sauce' | 'second' | 'third';

export class Config {
  private static readonly sites: Record<SiteType, SiteConfig> = {
    'sauce': {
      baseUrl: process.env.SAUCE_BASE_URL || 'https://www.saucedemo.com',
      authConfig: {
        storageStateFile: process.env.SAUCE_STORAGE_STATE || './auth/sauce-storage-state.json',
        credentials: {
          username: process.env.SAUCE_USERNAME || 'standard_user',
          password: process.env.SAUCE_PASSWORD || 'secret_sauce'
        }
      }
    },
    'second': {
      baseUrl: process.env.SECOND_BASE_URL || 'https://www.anotherwebsite.com',
      authConfig: {
        storageStateFile: process.env.SECOND_STORAGE_STATE || './auth/second-storage-state.json',
        credentials: {
          username: process.env.SECOND_USERNAME || 'admin_user',
          password: process.env.SECOND_PASSWORD || 'admin_password'
        }
      }
    },
    'third': {
      baseUrl: process.env.THIRD_BASE_URL || 'https://www.thirdwebsite.com',
      authConfig: {
        storageStateFile: process.env.THIRD_STORAGE_STATE || './auth/third-storage-state.json',
        credentials: {
          username: process.env.THIRD_USERNAME || 'test_user',
          password: process.env.THIRD_PASSWORD || 'test_password'
        }
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
  
  static getAvailableSites(): SiteType[] {
    return Object.keys(this.sites) as SiteType[];
  }
}