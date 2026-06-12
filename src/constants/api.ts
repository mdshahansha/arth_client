
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

export const REQUEST_TIMEOUT = 15_000;
export const MAX_RETRIES = 2;
export const RETRY_DELAY = 1_000;

export const ErrorCodes = {
  NO_TOKEN: 'NO_TOKEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  SESSION_REVOKED: 'SESSION_REVOKED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export const StorageKeys = {
  TOKEN: 'token',
  USER: 'user',
  THEME_MODE: 'themeMode',
} as const;

export const AUTH_EXPIRED_EVENT = 'auth:expired';
