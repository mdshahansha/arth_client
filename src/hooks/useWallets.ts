import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchWalletsThunk, selectWalletsData, selectWalletsLoading, selectWalletsError } from '../features/wallets/walletsSlice';
import { selectIsAuthenticated } from '../features/auth/authSlice';

export function useWallets() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const data = useAppSelector(selectWalletsData);
  const loading = useAppSelector(selectWalletsLoading);
  const error = useAppSelector(selectWalletsError);

  useEffect(() => {
    if (isAuthenticated && !data) {
      dispatch(fetchWalletsThunk());
    }
  }, [isAuthenticated, data, dispatch]);

  return {
    wallets: data?.wallets ?? [],
    totalBalance: data?.totalBalance ?? 0,
    loading,
    error,
  };
}
