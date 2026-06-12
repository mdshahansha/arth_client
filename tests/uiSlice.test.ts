import { describe, it, expect } from 'vitest';
import uiReducer, { setActiveNav, setGlobalLoading, setLoadingKey } from '../src/features/ui/uiSlice';

describe('uiSlice', () => {
  it('should return initial state', () => {
    const state = uiReducer(undefined, { type: 'unknown' });
    expect(state.activeNav).toBe('Dashboard');
    expect(state.globalLoading).toBe(false);
  });

  it('setActiveNav should update active navigation', () => {
    const state = uiReducer(undefined, setActiveNav('Settings'));
    expect(state.activeNav).toBe('Settings');
  });

  it('setGlobalLoading should toggle global loading', () => {
    const state = uiReducer(undefined, setGlobalLoading(true));
    expect(state.globalLoading).toBe(true);

    const state2 = uiReducer(state, setGlobalLoading(false));
    expect(state2.globalLoading).toBe(false);
  });

  it('setLoadingKey should add/remove loading keys', () => {
    let state = uiReducer(undefined, setLoadingKey({ key: 'dashboard', loading: true }));
    expect(state.loadingKeys['dashboard']).toBe(true);

    state = uiReducer(state, setLoadingKey({ key: 'dashboard', loading: false }));
    expect(state.loadingKeys['dashboard']).toBeUndefined();
  });
});
