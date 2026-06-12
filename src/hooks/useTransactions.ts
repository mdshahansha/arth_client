import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchTransactionsThunk,
  fetchNextPageThunk,
  selectTransactionItems,
  selectTransactionsLoading,
  selectTransactionsLoadingMore,
  selectTransactionsError,
  selectHasNextPage,
} from '../features/transactions/transactionsSlice';
import { selectIsAuthenticated } from '../features/auth/authSlice';

/**
 * Transactions hook — auto-fetches page 1 when authenticated,
 * provides infinite-scroll via fetchNextPage.
 */
export function useTransactions() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const items = useAppSelector(selectTransactionItems);
  const loading = useAppSelector(selectTransactionsLoading);
  const loadingMore = useAppSelector(selectTransactionsLoadingMore);
  const error = useAppSelector(selectTransactionsError);
  const hasNextPage = useAppSelector(selectHasNextPage);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTransactionsThunk());
    }
  }, [isAuthenticated, dispatch]);

  const fetchNextPage = useCallback(() => {
    dispatch(fetchNextPageThunk());
  }, [dispatch]);

  const refetch = useCallback(() => {
    dispatch(fetchTransactionsThunk());
  }, [dispatch]);

  return {
    items,
    loading,
    loadingMore,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
  };
}
