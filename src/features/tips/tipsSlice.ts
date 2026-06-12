import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTips, toggleSaveTip } from '../../api/tips.api';
import { normalizeError } from '../../api/apiClient';
import type { TipsData, SerializedError } from '../../types';
import type { RootState } from '../../app/store';

interface TipsState {
  data: TipsData | null;
  loading: boolean;
  error: SerializedError | null;
}

const initialState: TipsState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchTipsThunk = createAsyncThunk<
  TipsData,
  void,
  { rejectValue: SerializedError }
>('tips/fetch', async (_, { rejectWithValue }) => {
  try {
    return await fetchTips();
  } catch (error) {
    return rejectWithValue(normalizeError(error));
  }
});

export const toggleSaveTipThunk = createAsyncThunk<
  { tipId: string; saved: boolean },
  string,
  { rejectValue: SerializedError }
>('tips/toggleSave', async (tipId, { rejectWithValue }) => {
  try {
    return await toggleSaveTip(tipId);
  } catch (error) {
    return rejectWithValue(normalizeError(error));
  }
});

const tipsSlice = createSlice({
  name: 'tips',
  initialState,
  reducers: {
    clearTips(state) {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTipsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTipsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTipsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? { code: 'UNKNOWN_ERROR', message: 'Failed to fetch tips' };
      })
      .addCase(toggleSaveTipThunk.fulfilled, (state, action) => {
        if (!state.data) return;
        const { tipId, saved } = action.payload;
        if (saved) {
          state.data.savedIds.push(tipId);
        } else {
          state.data.savedIds = state.data.savedIds.filter((id) => id !== tipId);
        }
      });
  },
});

export const { clearTips } = tipsSlice.actions;

export const selectTipsData = (state: RootState) => state.tips.data;
export const selectTipsLoading = (state: RootState) => state.tips.loading;

export default tipsSlice.reducer;
