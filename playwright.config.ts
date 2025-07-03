import { defineConfig } from '@playwright/test';
import baseConfig from './tests/config/playwright.config';

/**
 * Main Playwright Configuration
 * Imports the comprehensive configuration from tests/config
 */
export default defineConfig({
  ...baseConfig,
  // Override testDir to be relative to root
  testDir: './tests/specs',
  // Override outputDir to be relative to root
  outputDir: './tests/reports/test-results',
  // Override globalSetup to be relative to root
  globalSetup: './tests/global-setup.ts'
});