import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDashboard } from '../../api/dashboard.api';
import { normalizeError } from '../../api/apiClient';
import type { DashboardData, SerializedError } from '../../types';
import type { RootState } from '../../app/store';

/* ─── State ─── */
interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: SerializedError | null;
  lastFetched: number | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
  lastFetched: null,
};

/* ─── Stale-time: skip refetch if data is < 60s old ─── */
const STALE_TIME = 60_000;

/* ─── Async Thunk ─── */
export const fetchDashboardThunk = createAsyncThunk<
  DashboardData,
  void,
  { state: RootState; rejectValue: SerializedError }
>('dashboard/fetch', async (_, { rejectWithValue, getState }) => {
  const { dashboard } = getState();
  // Skip fetch if data is fresh
  if (
    dashboard.data &&
    dashboard.lastFetched &&
    Date.now() - dashboard.lastFetched < STALE_TIME
  ) {
    return dashboard.data;
  }
  try {
    return await fetchDashboard();
  } catch (error) {
    return rejectWithValue(normalizeError(error));
  }
}, {
  // Prevent duplicate concurrent requests
  condition: (_, { getState }) => {
    const { dashboard } = getState() as RootState;
    return !dashboard.loading;
  },
});

/* Force refetch — ignores stale-time */
export const refetchDashboardThunk = createAsyncThunk<
  DashboardData,
  void,
  { rejectValue: SerializedError }
>('dashboard/refetch', async (_, { rejectWithValue }) => {
  try {
    return await fetchDashboard();
  } catch (error) {
    return rejectWithValue(normalizeError(error));
  }
});

/* ─── Slice ─── */
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboard(state) {
      state.data = null;
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchDashboardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? { code: 'UNKNOWN_ERROR', message: 'Failed to fetch dashboard' };
      })
      .addCase(refetchDashboardThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refetchDashboardThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(refetchDashboardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? { code: 'UNKNOWN_ERROR', message: 'Failed to fetch dashboard' };
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;

/* ─── Selectors ─── */
export const selectDashboard = (state: RootState) => state.dashboard;
export const selectDashboardData = (state: RootState) => state.dashboard.data;
export const selectDashboardLoading = (state: RootState) => state.dashboard.loading;
export const selectDashboardError = (state: RootState) => state.dashboard.error;
export const selectMonthlyBreakdown = (state: RootState) => state.dashboard.data?.monthlyBreakdown;
export const selectCategoryBreakdown = (state: RootState) => state.dashboard.data?.categoryBreakdown;

export default dashboardSlice.reducer;
