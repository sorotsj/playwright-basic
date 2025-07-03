import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/auth/login.page';
import { DashboardPage } from '../pages/dashboard/dashboard.page';

/**
 * Custom Playwright fixtures for authentication testing
 * Extends the base test with page objects and utilities
 */

// Define the types for our fixtures
type AuthFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

/**
 * Extend the base test with custom fixtures
 */
export const test = base.extend<AuthFixtures>({
  /**
   * Login Page fixture
   * Provides a pre-configured LoginPage instance
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  /**
   * Dashboard Page fixture
   * Provides a pre-configured DashboardPage instance
   */
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  }
});

/**
 * Additional test utilities and fixtures
 */

// Re-export expect for convenience
export { expect } from '@playwright/test';

/**
 * Custom fixture for authenticated user
 * Automatically logs in a user before the test
 */
export const authenticatedTest = base.extend<AuthFixtures & { authenticatedPage: Page }>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  authenticatedPage: async ({ page, loginPage }, use) => {
    // Automatically login with default test user
    await loginPage.navigateToLogin();
    await loginPage.quickLogin('test@example.com', 'ValidPassword123!');
    
    // Wait for successful login
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    await use(page);
  }
});

/**
 * Fixture for admin user authentication
 */
export const adminTest = base.extend<AuthFixtures & { adminPage: Page }>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  adminPage: async ({ page, loginPage }, use) => {
    // Automatically login with admin user
    await loginPage.navigateToLogin();
    await loginPage.quickLogin('admin@example.com', 'AdminPassword123!');
    
    // Wait for successful login
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    await use(page);
  }
});