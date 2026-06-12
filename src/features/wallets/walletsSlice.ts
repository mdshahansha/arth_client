import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWallets } from '../../api/wallets.api';
import { normalizeError } from '../../api/apiClient';
import type { WalletsData, SerializedError } from '../../types';
import type { RootState } from '../../app/store';

interface WalletsState {
  data: WalletsData | null;
  loading: boolean;
  error: SerializedError | null;
}

const initialState: WalletsState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchWalletsThunk = createAsyncThunk<
  WalletsData,
  void,
  { state: RootState; rejectValue: SerializedError }
>('wallets/fetch', async (_, { rejectWithValue }) => {
  try {
    return await fetchWallets();
  } catch (error) {
    return rejectWithValue(normalizeError(error));
  }
}, {
  condition: (_, { getState }) => {
    const { wallets } = getState() as RootState;
    return !wallets.loading;
  },
});

const walletsSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    clearWallets(state) {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalletsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWalletsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? { code: 'UNKNOWN_ERROR', message: 'Failed to fetch wallets' };
      });
  },
});

export const { clearWallets } = walletsSlice.actions;

export const selectWalletsData = (state: RootState) => state.wallets.data;
export const selectWalletsLoading = (state: RootState) => state.wallets.loading;
export const selectWalletsError = (state: RootState) => state.wallets.error;

export default walletsSlice.reducer;
