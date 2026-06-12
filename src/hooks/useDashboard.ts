import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchDashboardThunk,
  refetchDashboardThunk,
  selectDashboardData,
  selectDashboardLoading,
  selectDashboardError,
  selectCategoryBreakdown,
  selectMonthlyBreakdown,
} from '../features/dashboard/dashboardSlice';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import { useCallback } from 'react';

/**
 * Dashboard hook — auto-fetches when authenticated, provides data + loading + error.
 */
export function useDashboard() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const data = useAppSelector(selectDashboardData);
  const loading = useAppSelector(selectDashboardLoading);
  const error = useAppSelector(selectDashboardError);
  const categories = useAppSelector(selectCategoryBreakdown);
  const monthlyBreakdown = useAppSelector(selectMonthlyBreakdown);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchDashboardThunk());
    }
  }, [isAuthenticated, dispatch]);

  const refetch = useCallback(() => {
    dispatch(refetchDashboardThunk());
  }, [dispatch]);

  return {
    data,
    loading,
    error,
    categories,
    monthlyBreakdown,
    refetch,
  };
}
