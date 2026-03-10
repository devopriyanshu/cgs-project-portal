// src/lib/api/error-handler.ts

const ERROR_MESSAGES: Record<string, string> = {
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  RESOURCE_NOT_FOUND: "We couldn't find what you were looking for.",
  VALIDATION_ERROR: 'Please check your inputs and try again.',
  DUPLICATE_EMAIL: 'This email address is already registered.',
  DUPLICATE_PHONE: 'This phone number is already registered.',
  INVALID_CREDENTIALS: 'Incorrect email or password. Please try again.',
  ACCOUNT_NOT_VERIFIED: 'Please verify your email before logging in.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  PAYMENT_FAILED: 'Payment was not successful. Please try again or contact support.',
  UPLOAD_FAILED: 'File upload failed. Please check your connection and try again.',
  NETWORK_ERROR: 'Connection lost. Please check your internet connection.',
  INTERNAL_SERVER_ERROR: 'Something went wrong on our end. Our team has been notified.',
  KYC_INCOMPLETE: 'Please complete your KYC verification to continue.',
  ORGANISATION_NOT_FOUND: "We couldn't find your organisation details.",
};

export function getErrorMessage(code: string, fallback?: string): string {
  return ERROR_MESSAGES[code] ?? fallback ?? 'An unexpected error occurred. Please try again.';
}

export interface NormalizedError {
  status: number;
  code: string;
  message: string;
  errors: Array<{ field: string; message: string }>;
  requestId?: string;
}

export function isNormalizedError(err: unknown): err is NormalizedError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    'code' in err &&
    'message' in err
  );
}
