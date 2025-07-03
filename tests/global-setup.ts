import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * Global setup for Playwright tests
 * Runs before all test suites to prepare the test environment
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');

  // Create reports directories if they don't exist
  await createReportsDirectories();

  // Setup environment variables
  setupEnvironmentVariables();

  // Optional: Seed test data or setup test database
  await setupTestData();

  // Optional: Warm up the application
  await warmupApplication(config);

  console.log('✅ Global setup completed successfully');
}

/**
 * Create necessary report directories
 */
async function createReportsDirectories(): Promise<void> {
  const reportsDir = path.join(__dirname, 'reports');
  const directories = [
    path.join(reportsDir, 'html'),
    path.join(reportsDir, 'json'),
    path.join(reportsDir, 'screenshots'),
    path.join(reportsDir, 'videos'),
    path.join(reportsDir, 'traces')
  ];

  for (const dir of directories) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  }
}

/**
 * Setup environment variables for testing
 */
function setupEnvironmentVariables(): void {
  // Set default environment variables if not already set
  if (!process.env.BASE_URL) {
    process.env.BASE_URL = 'https://example.com';
    console.log('🌐 Set default BASE_URL:', process.env.BASE_URL);
  }

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'test';
    console.log('⚙️ Set NODE_ENV:', process.env.NODE_ENV);
  }

  // Set test-specific timeouts
  process.env.TEST_TIMEOUT = process.env.TEST_TIMEOUT || '30000';
  process.env.EXPECT_TIMEOUT = process.env.EXPECT_TIMEOUT || '10000';

  console.log('🔧 Environment variables configured');
}

/**
 * Setup test data (e.g., database seeding, API mocking)
 */
async function setupTestData(): Promise<void> {
  try {
    // Here you could:
    // - Seed a test database
    // - Setup API mocks
    // - Create test user accounts
    // - Setup test data files

    console.log('📊 Test data setup completed');
  } catch (error) {
    console.warn('⚠️ Test data setup failed (non-critical):', error);
  }
}

/**
 * Warm up the application to improve test performance
 */
async function warmupApplication(config: FullConfig): Promise<void> {
  if (process.env.SKIP_WARMUP === 'true') {
    console.log('🔥 Skipping application warmup');
    return;
  }

  try {
    const baseURL = config.projects[0]?.use?.baseURL || process.env.BASE_URL;
    
    if (!baseURL) {
      console.log('🔥 No base URL configured, skipping warmup');
      return;
    }

    console.log('🔥 Warming up application...');
    
    // Launch a browser to warm up the application
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Visit main pages to warm up
      await page.goto(baseURL, { timeout: 30000, waitUntil: 'networkidle' });
      console.log('🔥 Warmed up home page');

      // Warm up login page
      await page.goto(`${baseURL}/login`, { timeout: 30000, waitUntil: 'networkidle' });
      console.log('🔥 Warmed up login page');

    } catch (error) {
      console.warn('⚠️ Application warmup failed (non-critical):', error);
    } finally {
      await browser.close();
    }

    console.log('🔥 Application warmup completed');
  } catch (error) {
    console.warn('⚠️ Application warmup failed (non-critical):', error);
  }
}

/**
 * Optional: Setup authentication tokens for API testing
 */
async function setupAuthenticationTokens(): Promise<void> {
  try {
    // Here you could:
    // - Generate authentication tokens
    // - Store them for use in tests
    // - Setup authenticated browser contexts

    console.log('🔐 Authentication tokens setup completed');
  } catch (error) {
    console.warn('⚠️ Authentication tokens setup failed (non-critical):', error);
  }
}

/**
 * Optional: Verify test environment health
 */
async function verifyEnvironmentHealth(): Promise<void> {
  try {
    const baseURL = process.env.BASE_URL;
    
    if (!baseURL) {
      console.log('🏥 No base URL configured, skipping health check');
      return;
    }

    console.log('🏥 Checking environment health...');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      const response = await page.goto(baseURL, { timeout: 30000 });
      
      if (response && response.ok()) {
        console.log('🏥 Environment health check passed');
      } else {
        console.warn('⚠️ Environment health check failed - server not responding properly');
      }
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.warn('⚠️ Environment health check failed (non-critical):', error);
  }
}

export default globalSetup;