import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

/* ─── State ─── */
interface UiState {
  activeNav: string;
  globalLoading: boolean;
  loadingKeys: Record<string, boolean>;
}

const initialState: UiState = {
  activeNav: 'Dashboard',
  globalLoading: false,
  loadingKeys: {},
};

/* ─── Slice ─── */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveNav(state, action: PayloadAction<string>) {
      state.activeNav = action.payload;
    },
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload;
    },
    setLoadingKey(state, action: PayloadAction<{ key: string; loading: boolean }>) {
      if (action.payload.loading) {
        state.loadingKeys[action.payload.key] = true;
      } else {
        delete state.loadingKeys[action.payload.key];
      }
    },
  },
});

export const { setActiveNav, setGlobalLoading, setLoadingKey } = uiSlice.actions;

/* ─── Selectors ─── */
export const selectActiveNav = (state: RootState) => state.ui.activeNav;
export const selectGlobalLoading = (state: RootState) => state.ui.globalLoading;
export const selectIsLoading = (key: string) => (state: RootState) =>
  state.ui.loadingKeys[key] ?? false;
export const selectHasAnyLoading = (state: RootState) =>
  Object.keys(state.ui.loadingKeys).length > 0;

export default uiSlice.reducer;
