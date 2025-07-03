import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../common/base.page';
import { URLs } from '../../utils/constants/urls.constants';
import { TEST_IDS, TIMEOUTS } from '../../utils/constants/test-data.constants';

/**
 * Dashboard Page Object Model
 * Handles all interactions with the dashboard page after successful login
 */
export class DashboardPage extends BasePage {
  // Page elements
  private readonly dashboardHeader: Locator;
  private readonly userProfile: Locator;
  private readonly logoutButton: Locator;
  private readonly welcomeMessage: Locator;
  private readonly navigationMenu: Locator;
  private readonly profileDropdown: Locator;
  private readonly userNameDisplay: Locator;
  private readonly userEmailDisplay: Locator;
  private readonly settingsLink: Locator;
  private readonly profileLink: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators using data-testid attributes
    this.dashboardHeader = this.page.getByTestId(TEST_IDS.DASHBOARD_HEADER);
    this.userProfile = this.page.getByTestId(TEST_IDS.USER_PROFILE);
    this.logoutButton = this.page.getByTestId(TEST_IDS.LOGOUT_BUTTON);
    this.welcomeMessage = this.page.locator('[data-testid="welcome-message"]');
    this.navigationMenu = this.page.locator('[data-testid="navigation-menu"]');
    this.profileDropdown = this.page.locator('[data-testid="profile-dropdown"]');
    this.userNameDisplay = this.page.locator('[data-testid="user-name-display"]');
    this.userEmailDisplay = this.page.locator('[data-testid="user-email-display"]');
    this.settingsLink = this.page.locator('[data-testid="settings-link"]');
    this.profileLink = this.page.locator('[data-testid="profile-link"]');
  }

  /**
   * Navigate to the dashboard page
   * @param baseUrl - Optional base URL override
   */
  async navigateToDashboard(baseUrl?: string): Promise<void> {
    const url = `${baseUrl || URLs.BASE_URL}${URLs.DASHBOARD}`;
    await this.navigateToUrl(url);
    await this.waitForPageLoad();
    await this.validateDashboardIsLoaded();
  }

  /**
   * Validate that the dashboard is properly loaded
   */
  async validateDashboardIsLoaded(): Promise<void> {
    await this.waitForElement(this.dashboardHeader, TIMEOUTS.MEDIUM);
    await expect(this.dashboardHeader).toBeVisible();
  }

  /**
   * Validate successful login by checking dashboard elements
   */
  async validateSuccessfulLogin(): Promise<void> {
    await this.validateDashboardIsLoaded();
    await expect(this.userProfile).toBeVisible();
    await this.validateDashboardUrl();
  }

  /**
   * Validate dashboard page title
   */
  async validateDashboardPageTitle(): Promise<void> {
    await this.validatePageTitle('Dashboard - Playwright Basic');
  }

  /**
   * Validate dashboard URL
   */
  async validateDashboardUrl(): Promise<void> {
    await this.validateUrlContains(URLs.DASHBOARD);
  }

  /**
   * Validate welcome message is displayed
   * @param expectedUserName - Optional expected user name in welcome message
   */
  async validateWelcomeMessage(expectedUserName?: string): Promise<void> {
    await this.waitForElement(this.welcomeMessage, TIMEOUTS.MEDIUM);
    await expect(this.welcomeMessage).toBeVisible();
    
    if (expectedUserName) {
      const welcomeText = await this.getElementText(this.welcomeMessage);
      expect(welcomeText).toContain(expectedUserName);
    }
  }

  /**
   * Validate user profile information is displayed
   * @param expectedEmail - Expected user email
   * @param expectedName - Expected user name
   */
  async validateUserProfileInfo(expectedEmail?: string, expectedName?: string): Promise<void> {
    await this.waitForElement(this.userProfile, TIMEOUTS.MEDIUM);
    await expect(this.userProfile).toBeVisible();

    if (expectedEmail && await this.isElementVisible(this.userEmailDisplay)) {
      const displayedEmail = await this.getElementText(this.userEmailDisplay);
      expect(displayedEmail).toContain(expectedEmail);
    }

    if (expectedName && await this.isElementVisible(this.userNameDisplay)) {
      const displayedName = await this.getElementText(this.userNameDisplay);
      expect(displayedName).toContain(expectedName);
    }
  }

  /**
   * Open profile dropdown menu
   */
  async openProfileDropdown(): Promise<void> {
    await this.clickElement(this.profileDropdown);
    await this.waitForElement(this.logoutButton, TIMEOUTS.SHORT);
  }

  /**
   * Click logout button
   */
  async clickLogout(): Promise<void> {
    // Open profile dropdown if logout button is not visible
    const isLogoutVisible = await this.isElementVisible(this.logoutButton);
    if (!isLogoutVisible) {
      await this.openProfileDropdown();
    }
    
    await this.clickElement(this.logoutButton);
  }

  /**
   * Perform logout and validate redirection
   */
  async logout(): Promise<void> {
    await this.clickLogout();
    
    // Wait for redirection to login page or home page
    await this.page.waitForFunction(
      (dashboardPath) => !window.location.pathname.includes(dashboardPath),
      URLs.DASHBOARD,
      { timeout: TIMEOUTS.MEDIUM }
    );
  }

  /**
   * Navigate to profile page
   */
  async navigateToProfile(): Promise<void> {
    // Open profile dropdown if needed
    const isProfileLinkVisible = await this.isElementVisible(this.profileLink);
    if (!isProfileLinkVisible) {
      await this.openProfileDropdown();
    }
    
    await this.clickElement(this.profileLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to settings page
   */
  async navigateToSettings(): Promise<void> {
    // Open profile dropdown or navigation menu if needed
    const isSettingsLinkVisible = await this.isElementVisible(this.settingsLink);
    if (!isSettingsLinkVisible) {
      await this.openProfileDropdown();
    }
    
    await this.clickElement(this.settingsLink);
    await this.waitForPageLoad();
  }

  /**
   * Validate navigation menu is present
   */
  async validateNavigationMenu(): Promise<void> {
    await this.waitForElement(this.navigationMenu, TIMEOUTS.MEDIUM);
    await expect(this.navigationMenu).toBeVisible();
  }

  /**
   * Validate all dashboard elements are present
   */
  async validateDashboardElements(): Promise<void> {
    await expect(this.dashboardHeader).toBeVisible();
    await expect(this.userProfile).toBeVisible();
    await expect(this.navigationMenu).toBeVisible();
    
    // Profile dropdown might be collapsed initially
    const isDropdownVisible = await this.isElementVisible(this.profileDropdown);
    if (isDropdownVisible) {
      await expect(this.profileDropdown).toBeVisible();
    }
  }

  /**
   * Check if user is logged in (dashboard is accessible)
   */
  async isUserLoggedIn(): Promise<boolean> {
    try {
      await this.validateDashboardIsLoaded();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get displayed user name from dashboard
   */
  async getDisplayedUserName(): Promise<string> {
    if (await this.isElementVisible(this.userNameDisplay)) {
      return await this.getElementText(this.userNameDisplay);
    }
    return '';
  }

  /**
   * Get displayed user email from dashboard
   */
  async getDisplayedUserEmail(): Promise<string> {
    if (await this.isElementVisible(this.userEmailDisplay)) {
      return await this.getElementText(this.userEmailDisplay);
    }
    return '';
  }

  /**
   * Validate admin-specific elements (if user is admin)
   */
  async validateAdminElements(): Promise<void> {
    const adminPanel = this.page.locator('[data-testid="admin-panel"]');
    const userManagementLink = this.page.locator('[data-testid="user-management-link"]');
    
    // These elements should only be visible for admin users
    if (await this.isElementVisible(adminPanel)) {
      await expect(adminPanel).toBeVisible();
    }
    
    if (await this.isElementVisible(userManagementLink)) {
      await expect(userManagementLink).toBeVisible();
    }
  }

  /**
   * Validate standard user elements (non-admin user)
   */
  async validateStandardUserElements(): Promise<void> {
    const adminPanel = this.page.locator('[data-testid="admin-panel"]');
    const userManagementLink = this.page.locator('[data-testid="user-management-link"]');
    
    // These elements should not be visible for standard users
    const isAdminPanelVisible = await this.isElementVisible(adminPanel);
    const isUserManagementVisible = await this.isElementVisible(userManagementLink);
    
    expect(isAdminPanelVisible).toBe(false);
    expect(isUserManagementVisible).toBe(false);
  }

  /**
   * Wait for dashboard to fully load with all async content
   */
  async waitForDashboardToLoad(): Promise<void> {
    await this.waitForPageLoad();
    await this.validateDashboardIsLoaded();
    
    // Wait for any loading indicators to disappear
    const loadingIndicator = this.page.locator('[data-testid="loading-indicator"]');
    if (await this.isElementVisible(loadingIndicator)) {
      await this.waitForElementToBeHidden(loadingIndicator, TIMEOUTS.MEDIUM);
    }
  }

  /**
   * Validate that logout was successful
   */
  async validateLogoutSuccess(): Promise<void> {
    // Should be redirected away from dashboard
    await this.page.waitForFunction(
      (dashboardPath) => !window.location.pathname.includes(dashboardPath),
      URLs.DASHBOARD,
      { timeout: TIMEOUTS.MEDIUM }
    );
    
    // Should not be able to access dashboard without re-authentication
    const currentUrl = this.getCurrentUrl();
    expect(currentUrl).not.toContain(URLs.DASHBOARD);
  }
}