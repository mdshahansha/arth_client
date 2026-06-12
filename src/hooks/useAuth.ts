import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  loginThunk,
  registerThunk,
  logoutThunk,
  openLoginModal,
  closeLoginModal,
  openRegisterModal,
  closeRegisterModal,
  sessionExpiredAction,
  clearRegisterSuccess,
  selectAuth,
} from '../features/auth/authSlice';
import { clearDashboard } from '../features/dashboard/dashboardSlice';
import { clearTransactions } from '../features/transactions/transactionsSlice';
import { AUTH_EXPIRED_EVENT } from '../constants/api';
import type { LoginPayload, RegisterInput } from '../types';

/**
 * Central auth hook — replaces useAuthContext entirely.
 * Handles login, register, logout, modals, and 401 session-expired events.
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);

  /* Listen for 401 events from axios interceptor */
  useEffect(() => {
    const handleExpired = () => {
      dispatch(sessionExpiredAction());
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired);
  }, [dispatch]);

  const login = useCallback(
    (payload: LoginPayload) => dispatch(loginThunk(payload)),
    [dispatch],
  );

  const register = useCallback(
    (payload: RegisterInput) => dispatch(registerThunk(payload)),
    [dispatch],
  );

  const logout = useCallback(async () => {
    await dispatch(logoutThunk());
    dispatch(clearDashboard());
    dispatch(clearTransactions());
  }, [dispatch]);

  return {
    /* State */
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoginModalOpen: auth.isLoginModalOpen,
    isRegisterModalOpen: auth.isRegisterModalOpen,
    sessionExpired: auth.sessionExpired,
    loginLoading: auth.loginLoading,
    loginError: auth.loginError,
    registerLoading: auth.registerLoading,
    registerError: auth.registerError,
    registerSuccess: auth.registerSuccess,
    logoutLoading: auth.logoutLoading,

    /* Actions */
    login,
    register,
    logout,
    openLoginModal: useCallback(() => dispatch(openLoginModal()), [dispatch]),
    closeLoginModal: useCallback(() => dispatch(closeLoginModal()), [dispatch]),
    openRegisterModal: useCallback(() => dispatch(openRegisterModal()), [dispatch]),
    closeRegisterModal: useCallback(() => dispatch(closeRegisterModal()), [dispatch]),
    clearRegisterSuccess: useCallback(() => dispatch(clearRegisterSuccess()), [dispatch]),
  };
}
