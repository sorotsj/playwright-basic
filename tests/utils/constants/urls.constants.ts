// URL constants for navigation

export const URLs = {
  // Base URLs
  BASE_URL: process.env.BASE_URL || 'https://example.com',
  
  // Authentication URLs
  LOGIN: '/login',
  LOGOUT: '/logout',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Dashboard URLs
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // Admin URLs
  ADMIN_DASHBOARD: '/admin',
  USER_MANAGEMENT: '/admin/users',
  
  // Other URLs
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact'
} as const;

export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
  PROFILE: '/api/user/profile',
  USERS: '/api/users'
} as const;

export const ROUTES = {
  PUBLIC: [URLs.HOME, URLs.ABOUT, URLs.CONTACT, URLs.LOGIN, URLs.SIGNUP, URLs.FORGOT_PASSWORD],
  PROTECTED: [URLs.DASHBOARD, URLs.PROFILE, URLs.SETTINGS],
  ADMIN_ONLY: [URLs.ADMIN_DASHBOARD, URLs.USER_MANAGEMENT]
} as const;