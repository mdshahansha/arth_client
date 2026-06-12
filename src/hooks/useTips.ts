import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchTipsThunk, toggleSaveTipThunk, selectTipsData, selectTipsLoading } from '../features/tips/tipsSlice';

export function useTips() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectTipsData);
  const loading = useAppSelector(selectTipsLoading);

  useEffect(() => {
    if (!data) {
      dispatch(fetchTipsThunk());
    }
  }, [data, dispatch]);

  const toggleSave = useCallback((tipId: string) => {
    dispatch(toggleSaveTipThunk(tipId));
  }, [dispatch]);

  return {
    tips: data?.tips ?? [],
    savedIds: data?.savedIds ?? [],
    loading,
    toggleSave,
  };
}
