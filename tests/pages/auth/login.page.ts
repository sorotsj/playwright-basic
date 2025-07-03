import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../common/base.page';
import { UserCredentials } from '../../utils/types/auth.types';
import { URLs } from '../../utils/constants/urls.constants';
import { TEST_IDS, ERROR_MESSAGES, TIMEOUTS } from '../../utils/constants/test-data.constants';

/**
 * Login Page Object Model
 * Handles all interactions with the login page
 */
export class LoginPage extends BasePage {
  // Page elements
  private readonly loginForm: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly signupLink: Locator;
  private readonly errorMessage: Locator;
  private readonly loadingSpinner: Locator;
  private readonly showPasswordToggle: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators using data-testid attributes
    this.loginForm = this.page.getByTestId(TEST_IDS.LOGIN_FORM);
    this.emailInput = this.page.getByTestId(TEST_IDS.EMAIL_INPUT);
    this.passwordInput = this.page.getByTestId(TEST_IDS.PASSWORD_INPUT);
    this.loginButton = this.page.getByTestId(TEST_IDS.LOGIN_BUTTON);
    this.rememberMeCheckbox = this.page.getByTestId(TEST_IDS.REMEMBER_ME_CHECKBOX);
    this.forgotPasswordLink = this.page.getByTestId(TEST_IDS.FORGOT_PASSWORD_LINK);
    this.signupLink = this.page.getByTestId(TEST_IDS.SIGNUP_LINK);
    this.errorMessage = this.page.getByTestId(TEST_IDS.ERROR_MESSAGE);
    this.loadingSpinner = this.page.getByTestId(TEST_IDS.LOADING_SPINNER);
    this.showPasswordToggle = this.page.locator('[data-testid="show-password-toggle"]');
  }

  /**
   * Navigate to the login page
   * @param baseUrl - Optional base URL override
   */
  async navigateToLogin(baseUrl?: string): Promise<void> {
    const url = `${baseUrl || URLs.BASE_URL}${URLs.LOGIN}`;
    await this.navigateToUrl(url);
    await this.waitForPageLoad();
    await this.validateLoginFormIsVisible();
  }

  /**
   * Enter email in the email input field
   * @param email - Email address to enter
   */
  async enterEmail(email: string): Promise<void> {
    await this.fillInput(this.emailInput, email);
  }

  /**
   * Enter password in the password input field
   * @param password - Password to enter
   */
  async enterPassword(password: string): Promise<void> {
    await this.fillInput(this.passwordInput, password);
  }

  /**
   * Click the login button
   */
  async clickLoginButton(): Promise<void> {
    await this.clickElement(this.loginButton);
  }

  /**
   * Check or uncheck the remember me checkbox
   * @param checked - Whether to check the checkbox
   */
  async setRememberMe(checked: boolean): Promise<void> {
    const isCurrentlyChecked = await this.isElementChecked(this.rememberMeCheckbox);
    if (isCurrentlyChecked !== checked) {
      await this.clickElement(this.rememberMeCheckbox);
    }
  }

  /**
   * Complete login process with provided credentials
   * @param credentials - User credentials
   */
  async login(credentials: UserCredentials): Promise<void> {
    await this.enterEmail(credentials.email);
    await this.enterPassword(credentials.password);
    
    if (credentials.rememberMe) {
      await this.setRememberMe(true);
    }
    
    await this.clickLoginButton();
  }

  /**
   * Quick login method for valid credentials
   * @param email - Email address
   * @param password - Password
   * @param rememberMe - Whether to check remember me
   */
  async quickLogin(email: string, password: string, rememberMe: boolean = false): Promise<void> {
    await this.login({ email, password, rememberMe });
  }

  /**
   * Clear all form fields
   */
  async clearForm(): Promise<void> {
    await this.emailInput.clear();
    await this.passwordInput.clear();
    
    // Uncheck remember me if checked
    if (await this.isElementChecked(this.rememberMeCheckbox)) {
      await this.setRememberMe(false);
    }
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
  }

  /**
   * Click signup link
   */
  async clickSignupLink(): Promise<void> {
    await this.clickElement(this.signupLink);
  }

  /**
   * Toggle password visibility
   */
  async togglePasswordVisibility(): Promise<void> {
    if (await this.isElementVisible(this.showPasswordToggle)) {
      await this.clickElement(this.showPasswordToggle);
    }
  }

  // Validation methods

  /**
   * Validate that the login form is visible and ready
   */
  async validateLoginFormIsVisible(): Promise<void> {
    await this.waitForElement(this.loginForm);
    await expect(this.loginForm).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Validate all form elements are present
   */
  async validateFormElements(): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.rememberMeCheckbox).toBeVisible();
    await expect(this.forgotPasswordLink).toBeVisible();
    await expect(this.signupLink).toBeVisible();
  }

  /**
   * Validate login button is enabled/disabled
   * @param shouldBeEnabled - Expected state
   */
  async validateLoginButtonState(shouldBeEnabled: boolean): Promise<void> {
    if (shouldBeEnabled) {
      await expect(this.loginButton).toBeEnabled();
    } else {
      await expect(this.loginButton).toBeDisabled();
    }
  }

  /**
   * Validate error message is displayed
   * @param expectedMessage - Expected error message
   */
  async validateErrorMessage(expectedMessage: string): Promise<void> {
    await this.waitForElement(this.errorMessage, TIMEOUTS.MEDIUM);
    await expect(this.errorMessage).toBeVisible();
    const actualMessage = await this.getElementText(this.errorMessage);
    expect(actualMessage).toContain(expectedMessage);
  }

  /**
   * Validate no error message is displayed
   */
  async validateNoErrorMessage(): Promise<void> {
    const isErrorVisible = await this.isElementVisible(this.errorMessage);
    expect(isErrorVisible).toBe(false);
  }

  /**
   * Validate loading spinner is visible
   */
  async validateLoadingSpinner(): Promise<void> {
    await this.waitForElement(this.loadingSpinner, TIMEOUTS.SHORT);
    await expect(this.loadingSpinner).toBeVisible();
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadingToComplete(): Promise<void> {
    try {
      await this.waitForElement(this.loadingSpinner, TIMEOUTS.SHORT);
      await this.waitForElementToBeHidden(this.loadingSpinner, TIMEOUTS.MEDIUM);
    } catch {
      // Loading spinner might not appear for fast responses
    }
  }

  /**
   * Validate email field validation
   * @param expectedError - Expected validation error
   */
  async validateEmailValidation(expectedError?: string): Promise<void> {
    const emailValidation = this.page.locator('[data-testid="email-validation"]');
    if (expectedError) {
      await expect(emailValidation).toBeVisible();
      const validationText = await this.getElementText(emailValidation);
      expect(validationText).toContain(expectedError);
    } else {
      const isVisible = await this.isElementVisible(emailValidation);
      expect(isVisible).toBe(false);
    }
  }

  /**
   * Validate password field validation
   * @param expectedError - Expected validation error
   */
  async validatePasswordValidation(expectedError?: string): Promise<void> {
    const passwordValidation = this.page.locator('[data-testid="password-validation"]');
    if (expectedError) {
      await expect(passwordValidation).toBeVisible();
      const validationText = await this.getElementText(passwordValidation);
      expect(validationText).toContain(expectedError);
    } else {
      const isVisible = await this.isElementVisible(passwordValidation);
      expect(isVisible).toBe(false);
    }
  }

  /**
   * Get current email input value
   */
  async getEmailValue(): Promise<string> {
    return await this.emailInput.inputValue();
  }

  /**
   * Get current password input value
   */
  async getPasswordValue(): Promise<string> {
    return await this.passwordInput.inputValue();
  }

  /**
   * Check if remember me is checked
   */
  async isRememberMeChecked(): Promise<boolean> {
    return await this.isElementChecked(this.rememberMeCheckbox);
  }

  /**
   * Validate login page title
   */
  async validateLoginPageTitle(): Promise<void> {
    await this.validatePageTitle('Login - Playwright Basic');
  }

  /**
   * Validate login page URL
   */
  async validateLoginPageUrl(): Promise<void> {
    await this.validateUrlContains(URLs.LOGIN);
  }

  /**
   * Attempt login and handle potential errors
   * @param credentials - User credentials
   * @param expectSuccess - Whether login should succeed
   */
  async attemptLogin(credentials: UserCredentials, expectSuccess: boolean = true): Promise<void> {
    await this.login(credentials);
    
    if (expectSuccess) {
      await this.waitForLoadingToComplete();
      // Should redirect away from login page
      await this.page.waitForFunction(
        (loginPath) => !window.location.pathname.includes(loginPath),
        URLs.LOGIN,
        { timeout: TIMEOUTS.MEDIUM }
      );
    } else {
      await this.validateErrorMessage(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }
  }
}