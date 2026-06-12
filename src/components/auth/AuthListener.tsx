import { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { sessionExpiredAction } from '../../features/auth/authSlice';
import { clearDashboard } from '../../features/dashboard/dashboardSlice';
import { clearTransactions } from '../../features/transactions/transactionsSlice';
import { AUTH_EXPIRED_EVENT } from '../../constants/api';

/**
 * Headless component: listens for auth:expired events from the axios
 * interceptor and dispatches Redux actions to clear state + show login.
 */
export function AuthListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleExpired = () => {
      dispatch(sessionExpiredAction());
      dispatch(clearDashboard());
      dispatch(clearTransactions());
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired);
  }, [dispatch]);

  return null;
}
