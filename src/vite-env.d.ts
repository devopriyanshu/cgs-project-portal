/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_ENV: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_PORTAL_BASE_URL: string;
  readonly VITE_MARKETPLACE_URL: string;
  readonly VITE_CORPORATE_URL: string;
  readonly VITE_RAZORPAY_KEY_ID: string;
  readonly VITE_FEATURE_BATCH_ENROLLMENT: string;
  readonly VITE_FEATURE_SATELLITE_MONITORING: string;
  readonly VITE_FEATURE_SECONDARY_MARKET: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_GA_MEASUREMENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
