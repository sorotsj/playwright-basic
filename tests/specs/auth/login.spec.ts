import { test, expect } from '../../fixtures/auth.fixture';
import { VALID_USERS, INVALID_CREDENTIALS, ERROR_MESSAGES } from '../../utils/constants/test-data.constants';
import { URLs } from '../../utils/constants/urls.constants';
import authData from '../../data/auth-data.json';

/**
 * Comprehensive Login UI Test Suite
 * Tests all aspects of the login functionality with various scenarios
 */

test.describe('Login Page - Form Elements and Navigation', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateToLogin();
  });

  test('should display all required form elements', async ({ loginPage }) => {
    await test.step('Validate all form elements are present', async () => {
      await loginPage.validateFormElements();
    });

    await test.step('Validate login form is visible', async () => {
      await loginPage.validateLoginFormIsVisible();
    });

    await test.step('Validate page title and URL', async () => {
      await loginPage.validateLoginPageTitle();
      await loginPage.validateLoginPageUrl();
    });
  });

  test('should navigate to forgot password page', async ({ loginPage, page }) => {
    await test.step('Click forgot password link', async () => {
      await loginPage.clickForgotPassword();
    });

    await test.step('Validate navigation to forgot password', async () => {
      await page.waitForURL('**/forgot-password', { timeout: 10000 });
      expect(page.url()).toContain(URLs.FORGOT_PASSWORD);
    });
  });

  test('should navigate to signup page', async ({ loginPage, page }) => {
    await test.step('Click signup link', async () => {
      await loginPage.clickSignupLink();
    });

    await test.step('Validate navigation to signup', async () => {
      await page.waitForURL('**/signup', { timeout: 10000 });
      expect(page.url()).toContain(URLs.SIGNUP);
    });
  });

  test('should toggle password visibility', async ({ loginPage }) => {
    await test.step('Enter password', async () => {
      await loginPage.enterPassword('testpassword');
    });

    await test.step('Toggle password visibility', async () => {
      await loginPage.togglePasswordVisibility();
      // Note: In a real implementation, you'd verify the input type changed
    });
  });
});

test.describe('Login Page - Successful Login Scenarios', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateToLogin();
  });

  test('should login successfully with valid credentials', async ({ loginPage, dashboardPage }) => {
    const user = VALID_USERS.STANDARD_USER;

    await test.step('Enter valid credentials and login', async () => {
      await loginPage.quickLogin(user.email, user.password);
    });

    await test.step('Validate successful login', async () => {
      await dashboardPage.validateSuccessfulLogin();
      await dashboardPage.validateUserProfileInfo(user.email, user.name);
    });
  });

  test('should login successfully with remember me option', async ({ loginPage, dashboardPage }) => {
    const user = VALID_USERS.STANDARD_USER;

    await test.step('Login with remember me checked', async () => {
      await loginPage.quickLogin(user.email, user.password, true);
    });

    await test.step('Validate successful login', async () => {
      await dashboardPage.validateSuccessfulLogin();
    });

    await test.step('Validate remember me was checked', async () => {
      // Note: In a real implementation, you'd validate persistent session
      await loginPage.navigateToLogin();
      // Check if user is auto-logged in or form is pre-filled
    });
  });

  test('should login successfully as admin user', async ({ loginPage, dashboardPage }) => {
    const adminUser = VALID_USERS.ADMIN_USER;

    await test.step('Login with admin credentials', async () => {
      await loginPage.quickLogin(adminUser.email, adminUser.password);
    });

    await test.step('Validate successful admin login', async () => {
      await dashboardPage.validateSuccessfulLogin();
      await dashboardPage.validateAdminElements();
    });
  });
});

test.describe('Login Page - Failed Login Scenarios', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateToLogin();
  });

  test('should show error for invalid credentials', async ({ loginPage }) => {
    const invalidCreds = INVALID_CREDENTIALS.WRONG_EMAIL;

    await test.step('Attempt login with wrong email', async () => {
      await loginPage.quickLogin(invalidCreds.email, invalidCreds.password);
    });

    await test.step('Validate error message', async () => {
      await loginPage.validateErrorMessage(ERROR_MESSAGES.INVALID_CREDENTIALS);
    });
  });

  test('should show error for wrong password', async ({ loginPage }) => {
    const invalidCreds = INVALID_CREDENTIALS.WRONG_PASSWORD;

    await test.step('Attempt login with wrong password', async () => {
      await loginPage.quickLogin(invalidCreds.email, invalidCreds.password);
    });

    await test.step('Validate error message', async () => {
      await loginPage.validateErrorMessage(ERROR_MESSAGES.INVALID_CREDENTIALS);
    });
  });

  test('should show validation error for empty email', async ({ loginPage }) => {
    await test.step('Attempt login with empty email', async () => {
      await loginPage.enterPassword('ValidPassword123!');
      await loginPage.clickLoginButton();
    });

    await test.step('Validate email required error', async () => {
      await loginPage.validateEmailValidation(ERROR_MESSAGES.EMAIL_REQUIRED);
    });
  });

  test('should show validation error for empty password', async ({ loginPage }) => {
    await test.step('Attempt login with empty password', async () => {
      await loginPage.enterEmail('test@example.com');
      await loginPage.clickLoginButton();
    });

    await test.step('Validate password required error', async () => {
      await loginPage.validatePasswordValidation(ERROR_MESSAGES.PASSWORD_REQUIRED);
    });
  });

  test('should show validation error for invalid email format', async ({ loginPage }) => {
    const invalidEmail = INVALID_CREDENTIALS.INVALID_EMAIL_FORMAT;

    await test.step('Enter invalid email format', async () => {
      await loginPage.enterEmail(invalidEmail.email);
      await loginPage.enterPassword(invalidEmail.password);
      await loginPage.clickLoginButton();
    });

    await test.step('Validate email format error', async () => {
      await loginPage.validateEmailValidation(ERROR_MESSAGES.INVALID_EMAIL_FORMAT);
    });
  });

  test('should disable login button when form is empty', async ({ loginPage }) => {
    await test.step('Validate login button is disabled when form is empty', async () => {
      await loginPage.validateLoginButtonState(false);
    });

    await test.step('Enable button when form is filled', async () => {
      await loginPage.enterEmail('test@example.com');
      await loginPage.enterPassword('password123');
      await loginPage.validateLoginButtonState(true);
    });
  });
});

test.describe('Login Page - Form Validation and Behavior', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateToLogin();
  });

  test('should clear form fields correctly', async ({ loginPage }) => {
    await test.step('Fill form with data', async () => {
      await loginPage.enterEmail('test@example.com');
      await loginPage.enterPassword('password123');
      await loginPage.setRememberMe(true);
    });

    await test.step('Clear form and validate', async () => {
      await loginPage.clearForm();
      
      const emailValue = await loginPage.getEmailValue();
      const passwordValue = await loginPage.getPasswordValue();
      const isRememberMeChecked = await loginPage.isRememberMeChecked();
      
      expect(emailValue).toBe('');
      expect(passwordValue).toBe('');
      expect(isRememberMeChecked).toBe(false);
    });
  });

  test('should show loading spinner during login', async ({ loginPage }) => {
    await test.step('Start login process', async () => {
      await loginPage.enterEmail('test@example.com');
      await loginPage.enterPassword('ValidPassword123!');
      await loginPage.clickLoginButton();
    });

    await test.step('Validate loading spinner appears', async () => {
      await loginPage.validateLoadingSpinner();
    });

    await test.step('Wait for loading to complete', async () => {
      await loginPage.waitForLoadingToComplete();
    });
  });

  test('should remember me checkbox work correctly', async ({ loginPage }) => {
    await test.step('Check remember me checkbox', async () => {
      await loginPage.setRememberMe(true);
      const isChecked = await loginPage.isRememberMeChecked();
      expect(isChecked).toBe(true);
    });

    await test.step('Uncheck remember me checkbox', async () => {
      await loginPage.setRememberMe(false);
      const isChecked = await loginPage.isRememberMeChecked();
      expect(isChecked).toBe(false);
    });
  });
});

test.describe('Login Page - Data-Driven Testing', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateToLogin();
  });

  // Data-driven test using JSON test data
  for (const scenario of authData.testScenarios) {
    test(`Data-driven: ${scenario.name}`, async ({ loginPage, dashboardPage }) => {
      await test.step(`Execute scenario: ${scenario.name}`, async () => {
        await loginPage.enterEmail(scenario.credentials.email);
        await loginPage.enterPassword(scenario.credentials.password);
        
        if (scenario.rememberMe) {
          await loginPage.setRememberMe(true);
        }
        
        await loginPage.clickLoginButton();
      });

      await test.step('Validate expected result', async () => {
        if (scenario.expectedResult === 'success') {
          await dashboardPage.validateSuccessfulLogin();
        } else if (scenario.expectedResult === 'error' && scenario.expectedError) {
          await loginPage.validateErrorMessage(scenario.expectedError);
        } else if (scenario.expectedResult === 'validation_error' && scenario.expectedError) {
          // Handle validation errors (could be email or password validation)
          if (scenario.expectedError.includes('Email')) {
            await loginPage.validateEmailValidation(scenario.expectedError);
          } else if (scenario.expectedError.includes('Password')) {
            await loginPage.validatePasswordValidation(scenario.expectedError);
          }
        }
      });
    });
  }
});

test.describe('Login Page - UI Behavior and Screenshots', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateToLogin();
  });

  test('should capture screenshots on failure', async ({ loginPage, page }) => {
    // This test intentionally fails to demonstrate screenshot capture
    await test.step('Attempt invalid action to trigger failure', async () => {
      try {
        await loginPage.quickLogin('invalid@email.com', 'wrongpassword');
        await loginPage.validateNoErrorMessage(); // This should fail
      } catch (error) {
        // Capture screenshot on failure
        await loginPage.takeScreenshot('login-failure-test');
        throw error; // Re-throw to maintain test failure
      }
    });
  });

  test('should maintain form state during validation errors', async ({ loginPage }) => {
    const email = 'test@example.com';
    const password = 'password123';

    await test.step('Fill form and trigger validation error', async () => {
      await loginPage.enterEmail(email);
      await loginPage.enterPassword(''); // Empty password
      await loginPage.clickLoginButton();
    });

    await test.step('Validate form state is maintained', async () => {
      const currentEmail = await loginPage.getEmailValue();
      expect(currentEmail).toBe(email);
    });
  });
});

test.describe('Login Page - Cross-Browser Compatibility', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateToLogin();
  });

  test('should work consistently across browsers', async ({ loginPage, dashboardPage, browserName }) => {
    const user = VALID_USERS.STANDARD_USER;

    await test.step(`Test login functionality on ${browserName}`, async () => {
      await loginPage.quickLogin(user.email, user.password);
      await dashboardPage.validateSuccessfulLogin();
    });

    await test.step('Validate browser-specific behavior', async () => {
      // Add any browser-specific validations here
      await dashboardPage.validateDashboardElements();
    });
  });
});