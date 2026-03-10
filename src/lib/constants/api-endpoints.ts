// src/lib/constants/api-endpoints.ts
// ⚠️ ALL API calls must reference constants from this file.
// No string literals for endpoints anywhere else in the codebase.
// Backend uses NestJS global prefix 'api' + URI versioning v1 → /api/v1/
// The baseURL in apiClient is the backend origin (http://localhost:3000 in dev)
// So endpoints here are /api/v1/... to match the backend routing exactly.

const V1 = '/api/v1';

export const API_ENDPOINTS = {

  // ─── AUTH ────────────────────────────────────────────────────────────
  AUTH: {
    REGISTER:          `${V1}/auth/register`,
    LOGIN:             `${V1}/auth/login`,
    LOGOUT:            `${V1}/auth/logout`,
    REFRESH:           `${V1}/auth/refresh`,
    ME:                `${V1}/auth/me`,
  },

  // ─── USERS ───────────────────────────────────────────────────────────
  USERS: {
    PROFILE:           `${V1}/users/profile`,
    UPDATE_PROFILE:    `${V1}/users/profile`,
    CHANGE_PASSWORD:   `${V1}/users/change-password`,
    UPLOAD_AVATAR:     `${V1}/users/avatar`,
  },

  // ─── KYC ─────────────────────────────────────────────────────────────
  KYC: {
    STATUS:            `${V1}/kyc/status`,
    SUBMIT_INDIVIDUAL: `${V1}/kyc/aadhaar`,
    SUBMIT_BUSINESS:   `${V1}/kyc/gstin`,
    UPLOAD_DOCUMENT:   `${V1}/kyc/documents`,
  },

  // ─── ORGANIZATIONS ───────────────────────────────────────────────────
  ORGANIZATIONS: {
    MY_ORG:            `${V1}/organizations/mine`,
    CREATE:            `${V1}/organizations`,
    UPDATE:            (orgId: string) => `${V1}/organizations/${orgId}`,
    MEMBERS:           (orgId: string) => `${V1}/organizations/${orgId}/members`,
    INVITE_MEMBER:     (orgId: string) => `${V1}/organizations/${orgId}/members/invite`,
  },

  // ─── PROJECTS ────────────────────────────────────────────────────────
  PROJECTS: {
    LIST:              `${V1}/projects`,
    CREATE:            `${V1}/projects`,
    GET:               (id: string) => `${V1}/projects/${id}`,
    UPDATE:            (id: string) => `${V1}/projects/${id}`,
    SUBMIT:            (id: string) => `${V1}/projects/${id}/submit`,
    DOCUMENTS:         (id: string) => `${V1}/projects/${id}/documents`,
    UPLOAD_DOCUMENT:   (id: string) => `${V1}/projects/${id}/documents/upload`,
    DELETE_DOCUMENT:   (id: string, docId: string) => `${V1}/projects/${id}/documents/${docId}`,
    ELIGIBILITY:       (id: string) => `${V1}/projects/${id}/eligibility`,
    QUALITY_SCORE:     (id: string) => `${V1}/projects/${id}/quality-score`,
  },

  // ─── MRV ─────────────────────────────────────────────────────────────
  MRV: {
    LIST:              (projectId: string) => `${V1}/projects/${projectId}/mrv`,
    GET:               (projectId: string, mrvId: string) => `${V1}/projects/${projectId}/mrv/${mrvId}`,
    CREATE:            (projectId: string) => `${V1}/projects/${projectId}/mrv`,
    UPDATE:            (projectId: string, mrvId: string) => `${V1}/projects/${projectId}/mrv/${mrvId}`,
    REQUEST_SATELLITE: (projectId: string, mrvId: string) => `${V1}/projects/${projectId}/mrv/${mrvId}/satellite`,
    SATELLITE_STATUS:  (projectId: string, mrvId: string) => `${V1}/projects/${projectId}/mrv/${mrvId}/satellite/status`,
    SOIL_SAMPLES:      (mrvId: string) => `${V1}/mrv/${mrvId}/soil-samples`,
    ADD_SOIL_SAMPLE:   (mrvId: string) => `${V1}/mrv/${mrvId}/soil-samples`,
    SUBMIT_TO_VVB:     (mrvId: string) => `${V1}/mrv/${mrvId}/submit-vvb`,
    DOWNLOAD_PACKAGE:  (mrvId: string) => `${V1}/mrv/${mrvId}/download-package`,
  },

  // ─── CREDITS ─────────────────────────────────────────────────────────
  CREDITS: {
    LIST:              `${V1}/credits`,
    GET:               (id: string) => `${V1}/credits/${id}`,
    LEDGER:            (id: string) => `${V1}/credits/${id}/ledger`,
    CREATE_LISTING:    (id: string) => `${V1}/credits/${id}/list`,
    DELIST:            (id: string) => `${V1}/credits/${id}/unlist`,
    BULK_LIST:         `${V1}/credits/bulk-list`,
  },

  // ─── MARKETPLACE ─────────────────────────────────────────────────────
  MARKETPLACE: {
    LISTINGS:          `${V1}/marketplace/listings`,
    MY_LISTINGS:       `${V1}/marketplace/listings/mine`,
    GET_LISTING:       (id: string) => `${V1}/marketplace/listings/${id}`,
    UPDATE_LISTING:    (id: string) => `${V1}/marketplace/listings/${id}`,
  },

  // ─── FPO ─────────────────────────────────────────────────────────────
  FPO: {
    DETAILS:           `${V1}/fpo/details`,
    STATS:             `${V1}/fpo/stats`,
    FARMERS:           `${V1}/fpo/farmers`,
    GET_FARMER:        (id: string) => `${V1}/fpo/farmers/${id}`,
    ENROLL_FARMER:     `${V1}/fpo/farmers`,
    UPDATE_FARMER:     (id: string) => `${V1}/fpo/farmers/${id}`,
    DEACTIVATE_FARMER: (id: string) => `${V1}/fpo/farmers/${id}/deactivate`,
    BATCH_ENROLL:      `${V1}/fpo/farmers/batch`,
    BATCH_STATUS:      (batchId: string) => `${V1}/fpo/farmers/batch/${batchId}`,
    FARMS:             (farmerId: string) => `${V1}/fpo/farmers/${farmerId}/farms`,
    ADD_FARM:          (farmerId: string) => `${V1}/fpo/farmers/${farmerId}/farms`,
    PRACTICE_CHANGES:  `${V1}/fpo/practice-changes`,
    LOG_PRACTICE:      `${V1}/fpo/practice-changes`,
    PAYOUTS:           `${V1}/fpo/payouts`,
    RETRY_PAYOUT:      (payoutId: string) => `${V1}/fpo/payouts/${payoutId}/retry`,
    PRESIGNED_UPLOAD:  `${V1}/fpo/upload-url`,
  },

  // ─── NOTIFICATIONS ───────────────────────────────────────────────────
  NOTIFICATIONS: {
    LIST:              `${V1}/notifications`,
    MARK_READ:         (id: string) => `${V1}/notifications/${id}/read`,
    MARK_ALL_READ:     `${V1}/notifications/mark-all-read`,
    PREFERENCES:       `${V1}/notifications/preferences`,
  },

  // ─── UPLOADS ─────────────────────────────────────────────────────────
  UPLOADS: {
    PRESIGNED_URL:     `${V1}/uploads/presigned-url`,
  },

  // ─── PAYMENTS ───────────────────────────────────────────────────────
  PAYMENTS: {
    CREATE_ORDER:      `${V1}/payments/initiate`,
    VERIFY:            `${V1}/payments/confirm`,
  },

} as const;

export type EndpointFn = (...args: string[]) => string;
