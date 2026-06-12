import { describe, it, expect } from 'vitest';
import transactionsReducer, { clearTransactions } from '../src/features/transactions/transactionsSlice';
import type { Transaction, PaginationMeta } from '../src/types';

const initialState = {
  items: [] as Transaction[],
  pagination: null as PaginationMeta | null,
  loading: false,
  loadingMore: false,
  error: null,
  currentPage: 0,
};

const mockTxn: Transaction = {
  id: 'tx-1',
  user_id: 'u-1',
  title: 'Grocery',
  category: 'food',
  amount: '45000',
  type: 'debit',
  transaction_date: '2026-06-12T14:30:00.000Z',
  created_at: '2026-06-12T14:30:00.000Z',
  updated_at: '2026-06-12T14:30:00.000Z',
};

const mockPagination: PaginationMeta = {
  page: 1,
  limit: 10,
  totalItems: 25,
  totalPages: 3,
  hasNext: true,
  hasPrev: false,
};

describe('transactionsSlice', () => {
  it('should return initial state', () => {
    const state = transactionsReducer(undefined, { type: 'unknown' });
    expect(state.items).toEqual([]);
    expect(state.loading).toBe(false);
  });

  it('clearTransactions should reset state', () => {
    const prev = { ...initialState, items: [mockTxn], currentPage: 2 };
    const state = transactionsReducer(prev, clearTransactions());
    expect(state.items).toEqual([]);
    expect(state.currentPage).toBe(0);
  });

  it('fetch pending sets loading', () => {
    const state = transactionsReducer(initialState, { type: 'transactions/fetch/pending' });
    expect(state.loading).toBe(true);
  });

  it('fetch fulfilled replaces items', () => {
    const state = transactionsReducer(initialState, {
      type: 'transactions/fetch/fulfilled',
      payload: { items: [mockTxn], pagination: mockPagination },
    });
    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(1);
    expect(state.currentPage).toBe(1);
    expect(state.pagination?.hasNext).toBe(true);
  });

  it('fetchNextPage pending sets loadingMore', () => {
    const state = transactionsReducer(initialState, { type: 'transactions/fetchNextPage/pending' });
    expect(state.loadingMore).toBe(true);
  });

  it('fetchNextPage fulfilled appends items', () => {
    const prev = { ...initialState, items: [mockTxn], currentPage: 1 };
    const newTxn = { ...mockTxn, id: 'tx-2', title: 'Coffee' };
    const page2 = { ...mockPagination, page: 2, hasPrev: true };

    const state = transactionsReducer(prev, {
      type: 'transactions/fetchNextPage/fulfilled',
      payload: { items: [newTxn], pagination: page2 },
    });
    expect(state.loadingMore).toBe(false);
    expect(state.items).toHaveLength(2);
    expect(state.currentPage).toBe(2);
  });

  it('fetch rejected sets error', () => {
    const error = { code: 'NETWORK_ERROR', message: 'Fail' };
    const state = transactionsReducer(initialState, {
      type: 'transactions/fetch/rejected',
      payload: error,
    });
    expect(state.loading).toBe(false);
    expect(state.error).toEqual(error);
  });
});
