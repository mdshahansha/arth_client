import { describe, it, expect } from 'vitest';
import authReducer, {
  openLoginModal,
  closeLoginModal,
  openRegisterModal,
  closeRegisterModal,
  sessionExpiredAction,
  clearRegisterSuccess,
  setUser,
  dismissWelcomeSplash,
} from '../src/features/auth/authSlice';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoginModalOpen: false,
  isRegisterModalOpen: false,
  sessionExpired: false,
  loginLoading: false,
  loginError: null,
  registerLoading: false,
  registerError: null,
  registerSuccess: false,
  logoutLoading: false,
  showWelcomeSplash: false,
  welcomeName: '',
};

describe('authSlice reducers', () => {
  it('should return initial state', () => {
    const state = authReducer(undefined, { type: 'unknown' });
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('openLoginModal should open login and close register', () => {
    const prev = { ...initialState, isRegisterModalOpen: true };
    const state = authReducer(prev, openLoginModal());
    expect(state.isLoginModalOpen).toBe(true);
    expect(state.isRegisterModalOpen).toBe(false);
  });

  it('closeLoginModal should close modal and clear sessionExpired', () => {
    const prev = { ...initialState, isLoginModalOpen: true, sessionExpired: true };
    const state = authReducer(prev, closeLoginModal());
    expect(state.isLoginModalOpen).toBe(false);
    expect(state.sessionExpired).toBe(false);
  });

  it('openRegisterModal should open register and close login', () => {
    const prev = { ...initialState, isLoginModalOpen: true };
    const state = authReducer(prev, openRegisterModal());
    expect(state.isRegisterModalOpen).toBe(true);
    expect(state.isLoginModalOpen).toBe(false);
  });

  it('closeRegisterModal should close register and clear errors', () => {
    const prev = { ...initialState, isRegisterModalOpen: true, registerError: { code: 'ERR', message: 'err' } };
    const state = authReducer(prev, closeRegisterModal());
    expect(state.isRegisterModalOpen).toBe(false);
    expect(state.registerError).toBeNull();
  });

  it('sessionExpired should clear auth and open login', () => {
    const prev = {
      ...initialState,
      user: { id: '1', name: 'Test', email: 'test@test.com', profile_image_url: null },
      token: 'abc',
      isAuthenticated: true,
    };
    const state = authReducer(prev, sessionExpiredAction());
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.sessionExpired).toBe(true);
    expect(state.isLoginModalOpen).toBe(true);
  });

  it('clearRegisterSuccess should reset registerSuccess', () => {
    const prev = { ...initialState, registerSuccess: true };
    const state = authReducer(prev, clearRegisterSuccess());
    expect(state.registerSuccess).toBe(false);
  });

  it('setUser should update user', () => {
    const user = { id: '1', name: 'John', email: 'john@test.com', profile_image_url: null };
    const state = authReducer(initialState, setUser(user));
    expect(state.user).toEqual(user);
  });

  it('dismissWelcomeSplash should hide splash and clear name', () => {
    const prev = { ...initialState, showWelcomeSplash: true, welcomeName: 'Rahul' };
    const state = authReducer(prev, dismissWelcomeSplash());
    expect(state.showWelcomeSplash).toBe(false);
    expect(state.welcomeName).toBe('');
  });
});

describe('authSlice async thunk reducers', () => {
  it('login pending sets loading', () => {
    const state = authReducer(initialState, { type: 'auth/login/pending' });
    expect(state.loginLoading).toBe(true);
    expect(state.loginError).toBeNull();
  });

  it('login fulfilled sets user + token + splash', () => {
    const user = { id: '1', name: 'Rahul Sharma', email: 't@t.com', profile_image_url: null };
    const state = authReducer(initialState, {
      type: 'auth/login/fulfilled',
      payload: { user, token: 'tok123' },
    });
    expect(state.loginLoading).toBe(false);
    expect(state.user).toEqual(user);
    expect(state.token).toBe('tok123');
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoginModalOpen).toBe(false);
    expect(state.showWelcomeSplash).toBe(true);
    expect(state.welcomeName).toBe('Rahul');
  });

  it('login rejected sets error', () => {
    const error = { code: 'INVALID_CREDENTIALS', message: 'Bad password' };
    const state = authReducer(initialState, {
      type: 'auth/login/rejected',
      payload: error,
    });
    expect(state.loginLoading).toBe(false);
    expect(state.loginError).toEqual(error);
  });

  it('register fulfilled sets registerSuccess', () => {
    const state = authReducer(initialState, {
      type: 'auth/register/fulfilled',
      payload: { user: { id: '1', name: 'A', email: 'a@a.com', profile_image_url: null }, token: 't' },
    });
    expect(state.registerLoading).toBe(false);
    expect(state.registerSuccess).toBe(true);
  });

  it('logout fulfilled clears auth', () => {
    const prev = {
      ...initialState,
      user: { id: '1', name: 'A', email: 'a@a.com', profile_image_url: null },
      token: 'tok',
      isAuthenticated: true,
    };
    const state = authReducer(prev, { type: 'auth/logout/fulfilled' });
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
