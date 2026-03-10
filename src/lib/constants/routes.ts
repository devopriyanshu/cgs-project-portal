// src/lib/constants/routes.ts

export const ROUTES = {
  AUTH: {
    LOGIN:           '/login',
    REGISTER:        '/register',
    VERIFY_EMAIL:    '/verify-email',
    FORGOT_PASSWORD: '/forgot-password',
  },
  DASHBOARD: '/dashboard',
  PROJECTS: {
    LIST:      '/projects',
    NEW:       '/projects/new',
    DETAIL:    (id: string) => `/projects/${id}`,
    DOCUMENTS: (id: string) => `/projects/${id}/documents`,
    MRV:       (id: string) => `/projects/${id}/mrv`,
    CREDITS:   (id: string) => `/projects/${id}/credits`,
    SETTINGS:  (id: string) => `/projects/${id}/settings`,
  },
  FPO: {
    DASHBOARD:     '/fpo',
    FARMERS:       '/fpo/farmers',
    FARMER_DETAIL: (id: string) => `/fpo/farmers/${id}`,
    PRACTICE_LOG:  '/fpo/practice-log',
    PAYOUTS:       '/fpo/payouts',
  },
  CREDITS: {
    LIST:   '/credits',
    DETAIL: (id: string) => `/credits/${id}`,
  },
  NOTIFICATIONS: '/notifications',
  SETTINGS: {
    PROFILE:      '/settings/profile',
    ORGANIZATION: '/settings/organization',
    KYC:          '/settings/kyc',
  },
} as const;

export const EXTERNAL_URLS = {
  MARKETPLACE:      import.meta.env.VITE_MARKETPLACE_URL ?? 'https://marketplace.cgs.green',
  CORPORATE_PORTAL: import.meta.env.VITE_CORPORATE_URL ?? 'https://corporate.cgs.green',
  LANDING_PAGE:     'https://commongroundsolutions.in',
  DOCS:             'https://docs.commongroundsolutions.in',
  HELP:             'https://help.commongroundsolutions.in',
} as const;
