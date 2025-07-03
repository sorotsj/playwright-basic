import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Comprehensive Login UI Testing
 * Supports multiple browsers, devices, and reporting options
 */
export default defineConfig({
  // Test directory
  testDir: '../specs',
  
  // Global test configuration
  timeout: 30 * 1000, // 30 seconds per test
  expect: {
    timeout: 10 * 1000, // 10 seconds for assertions
  },
  
  // Test execution settings
  fullyParallel: true, // Run tests in parallel
  forbidOnly: !!process.env.CI, // Fail if test.only in CI
  retries: process.env.CI ? 2 : 1, // Retry failed tests
  workers: process.env.CI ? 1 : undefined, // Limit workers in CI
  
  // Test reporting
  reporter: [
    ['html', { 
      outputFolder: '../reports/html',
      open: 'never'
    }],
    ['json', { 
      outputFile: '../reports/json/test-results.json' 
    }],
    ['list'],
    ['junit', { 
      outputFile: '../reports/junit.xml' 
    }]
  ],
  
  // Global test settings
  use: {
    // Base URL for tests
    baseURL: process.env.BASE_URL || 'https://example.com',
    
    // Browser settings
    headless: process.env.HEADLESS !== 'false',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Action timeouts
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
    
    // Capture settings
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    
    // Test context
    locale: 'en-US',
    timezoneId: 'America/New_York',
    
    // Additional context options
    permissions: [],
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9'
    }
  },

  // Project configurations for different browsers and devices
  projects: [
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    },

    {
      name: 'firefox-desktop',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 }
      },
    },

    {
      name: 'webkit-desktop',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 }
      },
    },

    // Mobile testing
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },

    // Tablet testing
    {
      name: 'tablet-chrome',
      use: { ...devices['iPad Pro'] },
    },

    // Edge browser
    {
      name: 'edge-desktop',
      use: { 
        ...devices['Desktop Edge'],
        viewport: { width: 1280, height: 720 }
      },
    },

    // High DPI testing
    {
      name: 'chrome-high-dpi',
      use: {
        ...devices['Desktop Chrome HiDPI'],
        viewport: { width: 1920, height: 1080 }
      },
    }
  ],

  // Output directories
  outputDir: '../reports/test-results',
  
  // Global setup and teardown
  globalSetup: '../global-setup.ts',
  
  // Web server configuration (if testing local app)
  webServer: process.env.START_LOCAL_SERVER === 'true' ? {
    command: 'npm run start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  } : undefined,

  // Test matching patterns
  testMatch: [
    '**/*.spec.ts',
    '**/*.test.ts'
  ],

  // Ignored files
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/reports/**'
  ],

  // Metadata
  metadata: {
    'Test Suite': 'Comprehensive Login UI Tests',
    'Framework': 'Playwright with TypeScript',
    'Pattern': 'Page Object Model',
    'Environment': process.env.NODE_ENV || 'test'
  }
});