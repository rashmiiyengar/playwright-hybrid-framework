import path from 'path';

// Define the available site types
export type SiteType = 'sauce' | 'second' | 'third';

interface AuthCredentials {
  username: string;
  password: string;
}

interface AuthConfig {
  credentials: AuthCredentials;
  storageStateFile: string;
}

export class Config {
  static getBaseUrl(site: SiteType): string {
    const baseUrls: Record<SiteType, string> = {
      'sauce': process.env.SAUCE_BASE_URL || 'https://www.saucedemo.com',
      'second': process.env.SECOND_BASE_URL || 'https://www.anotherwebsite.com',
      'third': 'https://your-third-site.com',
    };
    
    return baseUrls[site] || baseUrls['sauce'];
  }

  static getAuthConfig(site: SiteType): AuthConfig {
    // Default credentials for each site
    const configs: Record<SiteType, AuthConfig> = {
      'sauce': {
        credentials: {
          username: process.env.SAUCE_USERNAME || '',
          password: process.env.SAUCE_PASSWORD || '',
        },
        storageStateFile: process.env.SAUCE_STORAGE_STATE || './auth/sauce-storage-state.json',
      },
      'second': {
        credentials: {
          username: process.env.SECOND_USERNAME || 'demo',
          password: process.env.SECOND_PASSWORD || 'demo',
        },
        storageStateFile: process.env.SECOND_STORAGE_STATE || './auth/second-storage-state.json',
      },
      'third': {
        credentials: {
          username: process.env.THIRD_USERNAME || 'user',
          password: process.env.THIRD_PASSWORD || 'password',
        },
        storageStateFile: './auth/third-storage-state.json',
      }
    };
    
    return configs[site] || configs['sauce'];
  }

  // Validate if a string is a valid SiteType
  static isSiteType(site: string): site is SiteType {
    return ['sauce', 'second', 'third'].includes(site);
  }

  // Get site type safely from environment or input
  static getSiteType(envSite?: string): SiteType {
    const site = envSite || process.env.SITE || 'sauce';
    return Config.isSiteType(site) ? site : 'sauce';
  }
}
