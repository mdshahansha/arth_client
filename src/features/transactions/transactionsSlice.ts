import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTransactions } from '../../api/transactions.api';
import { normalizeError } from '../../api/apiClient';
import type { Transaction, PaginationMeta, SerializedError } from '../../types';
import type { RootState } from '../../app/store';

/* ─── State ─── */
interface TransactionsState {
  items: Transaction[];
  pagination: PaginationMeta | null;
  loading: boolean;
  loadingMore: boolean;
  error: SerializedError | null;
  currentPage: number;
}

const initialState: TransactionsState = {
  items: [],
  pagination: null,
  loading: false,
  loadingMore: false,
  error: null,
  currentPage: 0,
};

const PAGE_LIMIT = 10;

/* ─── Async Thunks ─── */

/** Fetch first page (resets list) */
export const fetchTransactionsThunk = createAsyncThunk<
  { items: Transaction[]; pagination: PaginationMeta },
  void,
  { rejectValue: SerializedError }
>('transactions/fetch', async (_, { rejectWithValue }) => {
  try {
    const result = await fetchTransactions(1, PAGE_LIMIT);
    return { items: result.items, pagination: result.pagination };
  } catch (error) {
    return rejectWithValue(normalizeError(error));
  }
});

/** Fetch next page (appends to list) */
export const fetchNextPageThunk = createAsyncThunk<
  { items: Transaction[]; pagination: PaginationMeta },
  void,
  { state: RootState; rejectValue: SerializedError }
>('transactions/fetchNextPage', async (_, { getState, rejectWithValue }) => {
  const { transactions } = getState();
  const nextPage = transactions.currentPage + 1;
  try {
    const result = await fetchTransactions(nextPage, PAGE_LIMIT);
    return { items: result.items, pagination: result.pagination };
  } catch (error) {
    return rejectWithValue(normalizeError(error));
  }
}, {
  // Prevent fetch if already loading or no more pages
  condition: (_, { getState }) => {
    const { transactions } = getState() as RootState;
    if (transactions.loadingMore || transactions.loading) return false;
    if (transactions.pagination && !transactions.pagination.hasNext) return false;
    return true;
  },
});

/* ─── Slice ─── */
const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransactions(state) {
      state.items = [];
      state.pagination = null;
      state.error = null;
      state.currentPage = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ─── First Page ─── */
      .addCase(fetchTransactionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
        state.currentPage = 1;
      })
      .addCase(fetchTransactionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? {
          code: 'UNKNOWN_ERROR',
          message: 'Failed to load transactions',
        };
      })

      /* ─── Next Page ─── */
      .addCase(fetchNextPageThunk.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(fetchNextPageThunk.fulfilled, (state, action) => {
        state.loadingMore = false;
        state.items = [...state.items, ...action.payload.items];
        state.pagination = action.payload.pagination;
        state.currentPage = action.payload.pagination.page;
      })
      .addCase(fetchNextPageThunk.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload ?? {
          code: 'UNKNOWN_ERROR',
          message: 'Failed to load more transactions',
        };
      });
  },
});

export const { clearTransactions } = transactionsSlice.actions;

/* ─── Selectors ─── */
export const selectTransactions = (state: RootState) => state.transactions;
export const selectTransactionItems = (state: RootState) => state.transactions.items;
export const selectTransactionsLoading = (state: RootState) => state.transactions.loading;
export const selectTransactionsLoadingMore = (state: RootState) => state.transactions.loadingMore;
export const selectTransactionsError = (state: RootState) => state.transactions.error;
export const selectTransactionsPagination = (state: RootState) => state.transactions.pagination;
export const selectHasNextPage = (state: RootState) =>
  state.transactions.pagination?.hasNext ?? false;

export default transactionsSlice.reducer;
