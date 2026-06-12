import { isRejectedWithValue, type Middleware } from '@reduxjs/toolkit';
import { notificationService } from '../services/notificationService';
import { ErrorCodes } from '../constants/api';
import type { SerializedError } from '../types';

/**
 * Redux middleware that catches rejected async thunks and shows toast notifications.
 * Auth errors (401) are handled silently — the auth slice opens the login modal.
 */
export const errorMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const error = action.payload as SerializedError;

    // Auth errors are handled by authSlice + 401 interceptor — skip toast
    const silentCodes = new Set([
      ErrorCodes.NO_TOKEN,
      ErrorCodes.INVALID_TOKEN,
      ErrorCodes.SESSION_REVOKED,
    ]);

    if (!silentCodes.has(error.code)) {
      notificationService.error(error.message);
    }
  }

  return next(action);
};
