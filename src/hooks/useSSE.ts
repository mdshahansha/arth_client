import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import { refetchDashboardThunk } from '../features/dashboard/dashboardSlice';
import { API_BASE_URL } from '../constants/api';

export function useSSE() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const sourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      sourceRef.current?.close();
      sourceRef.current = null;
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    const url = `${API_BASE_URL}/dashboard/events?token=${encodeURIComponent(token)}`;
    const source = new EventSource(url);
    sourceRef.current = source;

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'dashboard:update') {
          dispatch(refetchDashboardThunk());
        }
      } catch {
        // ignore malformed events
      }
    };

    source.onerror = () => {
      source.close();
      sourceRef.current = null;
    };

    return () => {
      source.close();
      sourceRef.current = null;
    };
  }, [isAuthenticated, dispatch]);
}
