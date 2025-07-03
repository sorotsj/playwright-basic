// Authentication-related TypeScript interfaces and types

export interface UserCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AdminCredentials extends UserCredentials {
  role: 'admin';
}

export interface LoginFormElements {
  emailInput: string;
  passwordInput: string;
  loginButton: string;
  rememberMeCheckbox: string;
  forgotPasswordLink: string;
  signupLink: string;
  errorMessage: string;
  loadingSpinner: string;
}

export interface ValidationMessage {
  type: 'error' | 'success' | 'warning';
  text: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface TestUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  isActive: boolean;
}

export interface PageElements {
  selector: string;
  description: string;
  isRequired: boolean;
}

export interface TestConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  headless: boolean;
  browsers: string[];
}