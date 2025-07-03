// Test data constants for authentication testing

import { UserCredentials, AdminCredentials, TestUser } from '../types/auth.types';

export const VALID_USERS: { [key: string]: TestUser } = {
  STANDARD_USER: {
    id: 'user-001',
    email: 'test@example.com',
    password: 'ValidPassword123!',
    name: 'Test User',
    role: 'user',
    isActive: true
  },
  ADMIN_USER: {
    id: 'admin-001',
    email: 'admin@example.com',
    password: 'AdminPassword123!',
    name: 'Admin User',
    role: 'admin',
    isActive: true
  },
  INACTIVE_USER: {
    id: 'user-inactive',
    email: 'inactive@example.com',
    password: 'InactiveUser123!',
    name: 'Inactive User',
    role: 'user',
    isActive: false
  }
} as const;

export const INVALID_CREDENTIALS = {
  WRONG_EMAIL: {
    email: 'wrong@example.com',
    password: 'ValidPassword123!'
  },
  WRONG_PASSWORD: {
    email: 'test@example.com',
    password: 'WrongPassword123!'
  },
  EMPTY_EMAIL: {
    email: '',
    password: 'ValidPassword123!'
  },
  EMPTY_PASSWORD: {
    email: 'test@example.com',
    password: ''
  },
  EMPTY_BOTH: {
    email: '',
    password: ''
  },
  INVALID_EMAIL_FORMAT: {
    email: 'invalid-email',
    password: 'ValidPassword123!'
  }
} as const;

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'Password is required',
  INVALID_EMAIL_FORMAT: 'Please enter a valid email address',
  ACCOUNT_LOCKED: 'Account has been locked due to multiple failed login attempts',
  ACCOUNT_INACTIVE: 'Account is inactive. Please contact support.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  NETWORK_ERROR: 'Network error. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.'
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'You have been logged out successfully',
  PASSWORD_RESET_SENT: 'Password reset link has been sent to your email'
} as const;

export const FORM_VALIDATION = {
  EMAIL: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 254,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  }
} as const;

export const TIMEOUTS = {
  SHORT: 5000,        // 5 seconds
  MEDIUM: 10000,      // 10 seconds
  LONG: 30000,        // 30 seconds
  EXTRA_LONG: 60000   // 60 seconds
} as const;

export const TEST_IDS = {
  LOGIN_FORM: 'login-form',
  EMAIL_INPUT: 'email-input',
  PASSWORD_INPUT: 'password-input',
  LOGIN_BUTTON: 'login-button',
  REMEMBER_ME_CHECKBOX: 'remember-me-checkbox',
  FORGOT_PASSWORD_LINK: 'forgot-password-link',
  SIGNUP_LINK: 'signup-link',
  ERROR_MESSAGE: 'error-message',
  LOADING_SPINNER: 'loading-spinner',
  DASHBOARD_HEADER: 'dashboard-header',
  USER_PROFILE: 'user-profile',
  LOGOUT_BUTTON: 'logout-button'
} as const;