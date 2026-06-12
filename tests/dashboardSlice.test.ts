import { describe, it, expect } from 'vitest';
import dashboardReducer, { clearDashboard } from '../src/features/dashboard/dashboardSlice';
import type { DashboardData } from '../src/types';

const initialState = {
  data: null,
  loading: false,
  error: null,
  lastFetched: null,
};

const mockDashboard: DashboardData = {
  user: { id: '1', name: 'Test', email: 'test@test.com', profile_image_url: null },
  totalSpend: 500000,
  totalIncome: 1000000,
  monthlyBreakdown: [{ month: '2026-01', debit: 200000, credit: 500000 }],
  categoryBreakdown: [{ category: 'food', amount: 150000 }],
};

describe('dashboardSlice', () => {
  it('should return initial state', () => {
    const state = dashboardReducer(undefined, { type: 'unknown' });
    expect(state.data).toBeNull();
    expect(state.loading).toBe(false);
  });

  it('clearDashboard should reset state', () => {
    const prev = { ...initialState, data: mockDashboard, lastFetched: Date.now() };
    const state = dashboardReducer(prev, clearDashboard());
    expect(state.data).toBeNull();
    expect(state.lastFetched).toBeNull();
  });

  it('fetch pending sets loading', () => {
    const state = dashboardReducer(initialState, { type: 'dashboard/fetch/pending' });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetch fulfilled sets data', () => {
    const state = dashboardReducer(initialState, {
      type: 'dashboard/fetch/fulfilled',
      payload: mockDashboard,
    });
    expect(state.loading).toBe(false);
    expect(state.data).toEqual(mockDashboard);
    expect(state.lastFetched).toBeTruthy();
  });

  it('fetch rejected sets error', () => {
    const error = { code: 'NETWORK_ERROR', message: 'Failed' };
    const state = dashboardReducer(initialState, {
      type: 'dashboard/fetch/rejected',
      payload: error,
    });
    expect(state.loading).toBe(false);
    expect(state.error).toEqual(error);
  });
});
