import { Page, Locator, expect } from '@playwright/test';

/**
 * Abstract base class for all page objects
 * Provides common functionality and utilities shared across all pages
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for the page to be fully loaded
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForPageLoad(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
    await this.page.waitForLoadState('domcontentloaded', { timeout });
  }

  /**
   * Get the current page title
   * @returns Promise<string> - The page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get the current page URL
   * @returns string - The current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Take a screenshot of the current page
   * @param name - Optional name for the screenshot
   * @returns Promise<Buffer> - Screenshot buffer
   */
  async takeScreenshot(name?: string): Promise<Buffer> {
    const screenshotName = name || `screenshot-${Date.now()}`;
    return await this.page.screenshot({
      path: `tests/reports/screenshots/${screenshotName}.png`,
      fullPage: true
    });
  }

  /**
   * Wait for an element to be visible
   * @param locator - The element locator
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for an element to be hidden
   * @param locator - The element locator
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForElementToBeHidden(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Check if element is visible
   * @param locator - The element locator
   * @returns Promise<boolean> - True if visible, false otherwise
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Click element with retry mechanism
   * @param locator - The element locator
   * @param timeout - Optional timeout in milliseconds
   */
  async clickElement(locator: Locator, timeout: number = 10000): Promise<void> {
    await this.waitForElement(locator, timeout);
    await locator.click();
  }

  /**
   * Fill input field with text
   * @param locator - The input element locator
   * @param text - Text to fill
   * @param timeout - Optional timeout in milliseconds
   */
  async fillInput(locator: Locator, text: string, timeout: number = 10000): Promise<void> {
    await this.waitForElement(locator, timeout);
    await locator.clear();
    await locator.fill(text);
  }

  /**
   * Get text content from element
   * @param locator - The element locator
   * @returns Promise<string> - The text content
   */
  async getElementText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    const text = await locator.textContent();
    return text || '';
  }

  /**
   * Get attribute value from element
   * @param locator - The element locator
   * @param attribute - Attribute name
   * @returns Promise<string | null> - The attribute value
   */
  async getElementAttribute(locator: Locator, attribute: string): Promise<string | null> {
    await this.waitForElement(locator);
    return await locator.getAttribute(attribute);
  }

  /**
   * Check if element is enabled
   * @param locator - The element locator
   * @returns Promise<boolean> - True if enabled, false otherwise
   */
  async isElementEnabled(locator: Locator): Promise<boolean> {
    await this.waitForElement(locator);
    return await locator.isEnabled();
  }

  /**
   * Check if element is checked (for checkboxes/radio buttons)
   * @param locator - The element locator
   * @returns Promise<boolean> - True if checked, false otherwise
   */
  async isElementChecked(locator: Locator): Promise<boolean> {
    await this.waitForElement(locator);
    return await locator.isChecked();
  }

  /**
   * Scroll element into view
   * @param locator - The element locator
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Navigate to a specific URL
   * @param url - The URL to navigate to
   * @param timeout - Optional timeout in milliseconds
   */
  async navigateToUrl(url: string, timeout: number = 30000): Promise<void> {
    await this.page.goto(url, { waitUntil: 'networkidle', timeout });
  }

  /**
   * Refresh the current page
   */
  async refreshPage(): Promise<void> {
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  /**
   * Go back to previous page
   */
  async goBack(): Promise<void> {
    await this.page.goBack({ waitUntil: 'networkidle' });
  }

  /**
   * Go forward to next page
   */
  async goForward(): Promise<void> {
    await this.page.goForward({ waitUntil: 'networkidle' });
  }

  /**
   * Wait for specific text to appear on page
   * @param text - Text to wait for
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForText(text: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForFunction(
      (searchText) => document.body.textContent?.includes(searchText),
      text,
      { timeout }
    );
  }

  /**
   * Validate page title
   * @param expectedTitle - Expected page title
   */
  async validatePageTitle(expectedTitle: string): Promise<void> {
    const actualTitle = await this.getPageTitle();
    expect(actualTitle).toBe(expectedTitle);
  }

  /**
   * Validate current URL contains expected path
   * @param expectedPath - Expected URL path
   */
  async validateUrlContains(expectedPath: string): Promise<void> {
    const currentUrl = this.getCurrentUrl();
    expect(currentUrl).toContain(expectedPath);
  }
}