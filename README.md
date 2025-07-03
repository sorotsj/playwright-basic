# Comprehensive Login UI Test Suite with Playwright

A complete login UI testing framework using Playwright with TypeScript, following best practices and Page Object Model pattern.

## 🚀 Features

- ✅ **Page Object Model (POM)** pattern for maintainable tests
- ✅ **TypeScript** for type safety and better IDE support
- ✅ **Custom Playwright fixtures** for streamlined test setup
- ✅ **Data-driven testing** with JSON test data
- ✅ **Comprehensive error handling** and validation
- ✅ **Screenshot capture** on test failures
- ✅ **Multi-browser testing** support (Chrome, Firefox, Safari, Edge)
- ✅ **Mobile and tablet** responsive testing
- ✅ **Detailed test reporting** (HTML, JSON, JUnit)
- ✅ **Form validation testing** for all edge cases
- ✅ **UI behavior verification** with loading states

## 📁 Project Structure

```
tests/
├── config/
│   └── playwright.config.ts      # Playwright configuration
├── data/
│   └── auth-data.json            # Test data in JSON format
├── fixtures/
│   └── auth.fixture.ts           # Custom Playwright fixtures
├── pages/
│   ├── auth/
│   │   └── login.page.ts         # Login page object
│   ├── dashboard/
│   │   └── dashboard.page.ts     # Dashboard page object
│   └── common/
│       └── base.page.ts          # Base page class
├── specs/
│   └── auth/
│       └── login.spec.ts         # Login test specifications
├── utils/
│   ├── constants/
│   │   ├── test-data.constants.ts # Test data constants
│   │   └── urls.constants.ts      # URL constants
│   └── types/
│       └── auth.types.ts          # TypeScript interfaces
├── reports/
│   ├── html/                     # HTML test reports
│   ├── json/                     # JSON test reports
│   └── screenshots/              # Test screenshots
└── global-setup.ts               # Global test setup
```

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npm run test:install
   ```

## 🧪 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with UI mode
npm run test:ui

# Show test reports
npm run test:report
```

### Advanced Commands

```bash
# Run specific test file
npx playwright test login.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium-desktop

# Run tests with specific tag
npx playwright test --grep "successful login"

# Run tests in parallel
npx playwright test --workers=4

# Generate code
npx playwright codegen
```

## 📊 Test Coverage

### Login Scenarios Covered

#### ✅ Successful Login Tests
- Login with valid credentials
- Login with remember me option
- Admin user login
- Cross-browser compatibility

#### ✅ Failed Login Tests
- Invalid credentials error
- Wrong email validation
- Wrong password validation
- Empty email validation
- Empty password validation
- Invalid email format validation
- Disabled button state

#### ✅ Form Validation Tests
- Form elements presence
- Form clearing functionality
- Navigation to forgot password
- Navigation to signup
- Remember me checkbox functionality
- Password visibility toggle

#### ✅ UI Behavior Tests
- Loading spinner visibility
- Screenshot capture on failure
- Form state maintenance
- Data-driven testing scenarios

### Browser Support

- **Desktop:** Chrome, Firefox, Safari, Edge
- **Mobile:** Chrome on Android, Safari on iOS
- **Tablet:** iPad Pro simulation
- **High DPI:** Retina display support

## 🎯 Test Data

### Valid Test Users

```typescript
// Standard User
email: "test@example.com"
password: "ValidPassword123!"

// Admin User  
email: "admin@example.com"
password: "AdminPassword123!"
```

### Test Scenarios

The test suite includes data-driven tests covering:
- 6+ successful login scenarios
- 8+ failed login scenarios
- 5+ form validation scenarios
- Cross-browser compatibility tests

## 📈 Reporting

Tests generate multiple report formats:

- **HTML Report:** `tests/reports/html/index.html`
- **JSON Report:** `tests/reports/json/test-results.json`
- **JUnit XML:** `tests/reports/junit.xml`
- **Screenshots:** `tests/reports/screenshots/`

## 🔧 Configuration

### Environment Variables

```bash
# Base URL for testing
BASE_URL=https://example.com

# Browser mode
HEADLESS=false

# Skip application warmup
SKIP_WARMUP=true

# Start local server
START_LOCAL_SERVER=false
```

### Playwright Configuration

The configuration supports:
- Multiple browser projects
- Mobile and tablet testing
- Parallel test execution
- Retry mechanisms
- Screenshot/video capture
- Trace recording

## 🏗️ Architecture

### Page Object Model

```typescript
// Base Page (common functionality)
export abstract class BasePage {
  // Common methods for all pages
}

// Login Page (specific to login)
export class LoginPage extends BasePage {
  // Login-specific methods
}

// Dashboard Page (post-login validation)
export class DashboardPage extends BasePage {
  // Dashboard-specific methods
}
```

### Custom Fixtures

```typescript
// Standard test with page objects
test('login test', async ({ loginPage, dashboardPage }) => {
  // Test implementation
});

// Authenticated test (auto-login)
authenticatedTest('dashboard test', async ({ authenticatedPage }) => {
  // Test with user already logged in
});
```

## 🚦 Best Practices

### 1. Element Selection
- Uses `data-testid` attributes for reliable element selection
- Avoids CSS selectors that can break with UI changes

### 2. Wait Strategies
- Implements proper wait conditions for dynamic content
- Uses `waitForLoadState` for page transitions
- Handles loading states and async operations

### 3. Error Handling
- Comprehensive try-catch blocks
- Meaningful error messages
- Screenshot capture on failures

### 4. Test Data Management
- Centralized test data in JSON files
- Constants for reusable values
- Type-safe interfaces

### 5. Code Organization
- Separation of concerns with page objects
- Reusable fixtures and utilities
- Clear naming conventions

## 🔍 Debugging

### Common Issues

1. **Browser not installed:**
   ```bash
   npm run test:install
   ```

2. **Tests timing out:**
   - Check network connectivity
   - Increase timeout values
   - Use headed mode to see what's happening

3. **Element not found:**
   - Verify `data-testid` attributes exist
   - Check if element is visible/enabled
   - Add wait conditions

### Debug Tools

```bash
# Run single test in debug mode
npx playwright test login.spec.ts --debug

# Use trace viewer
npx playwright show-trace trace.zip

# Generate test code
npx playwright codegen https://example.com/login
```

## 📝 Contributing

1. Follow the existing code structure
2. Add tests for new functionality
3. Update documentation
4. Ensure all tests pass
5. Follow TypeScript best practices

## 📄 License

This project is licensed under the ISC License.