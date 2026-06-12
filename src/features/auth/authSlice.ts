import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { loginApi, registerApi, logoutApi } from '../../api/auth.api';
import { normalizeError } from '../../api/apiClient';
import { StorageKeys } from '../../constants/api';
import type { User, SerializedError, LoginPayload, RegisterInput } from '../../types';
import type { RootState } from '../../app/store';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
  sessionExpired: boolean;
  loginLoading: boolean;
  loginError: SerializedError | null;
  registerLoading: boolean;
  registerError: SerializedError | null;
  registerSuccess: boolean;
  logoutLoading: boolean;
  showWelcomeSplash: boolean;
  welcomeName: string;
}

function loadUserFromStorage(): User | null {
  try {
    const stored = localStorage.getItem(StorageKeys.USER);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

const initialToken = localStorage.getItem(StorageKeys.TOKEN);
const initialUser = loadUserFromStorage();

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialToken,
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

export const loginThunk = createAsyncThunk<
  { user: User; token: string },
  LoginPayload,
  { rejectValue: SerializedError }
>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const result = await loginApi(payload.email, payload.password);
    // Persist to localStorage
    localStorage.setItem(StorageKeys.TOKEN, result.token);
    localStorage.setItem(StorageKeys.USER, JSON.stringify(result.user));
    return { user: result.user, token: result.token };
  } catch (error) {
    return rejectWithValue(normalizeError(error));
  }
});

export const registerThunk = createAsyncThunk<
  { user: User; token: string },
  RegisterInput,
  { rejectValue: SerializedError }
>('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const result = await registerApi(payload);
    return { user: result.user, token: result.token };
  } catch (error) {
    return rejectWithValue(normalizeError(error));
  }
});

export const logoutThunk = createAsyncThunk<void, void, { rejectValue: SerializedError }>(
  'auth/logout',
  async () => {
    try {
      await logoutApi();
    } catch {
      /* Ignore — clear local state regardless */
    }
    localStorage.removeItem(StorageKeys.TOKEN);
    localStorage.removeItem(StorageKeys.USER);
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    openLoginModal(state) {
      state.isRegisterModalOpen = false;
      state.isLoginModalOpen = true;
      state.loginError = null;
    },
    closeLoginModal(state) {
      state.isLoginModalOpen = false;
      state.sessionExpired = false;
      state.loginError = null;
    },
    openRegisterModal(state) {
      state.isLoginModalOpen = false;
      state.isRegisterModalOpen = true;
      state.registerError = null;
      state.registerSuccess = false;
    },
    closeRegisterModal(state) {
      state.isRegisterModalOpen = false;
      state.registerError = null;
      state.registerSuccess = false;
    },
    sessionExpired(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.sessionExpired = true;
      state.isLoginModalOpen = true;
    },
    clearRegisterSuccess(state) {
      state.registerSuccess = false;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      localStorage.setItem(StorageKeys.USER, JSON.stringify(action.payload));
    },
    dismissWelcomeSplash(state) {
      state.showWelcomeSplash = false;
      state.welcomeName = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoginModalOpen = false;
        state.isRegisterModalOpen = false;
        state.sessionExpired = false;
        state.loginError = null;
        state.showWelcomeSplash = true;
        state.welcomeName = action.payload.user.name.split(' ')[0];
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.payload ?? {
          code: 'UNKNOWN_ERROR',
          message: 'Login failed',
        };
      })

      .addCase(registerThunk.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
        state.registerSuccess = false;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.registerLoading = false;
        state.registerSuccess = true;
        state.registerError = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.registerLoading = false;
        state.registerError = action.payload ?? {
          code: 'UNKNOWN_ERROR',
          message: 'Registration failed',
        };
      })

      .addCase(logoutThunk.pending, (state) => {
        state.logoutLoading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.logoutLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.logoutLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const {
  openLoginModal,
  closeLoginModal,
  openRegisterModal,
  closeRegisterModal,
  sessionExpired: sessionExpiredAction,
  clearRegisterSuccess,
  setUser,
  dismissWelcomeSplash,
} = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectLoginLoading = (state: RootState) => state.auth.loginLoading;
export const selectLoginError = (state: RootState) => state.auth.loginError;
export const selectRegisterLoading = (state: RootState) => state.auth.registerLoading;
export const selectRegisterError = (state: RootState) => state.auth.registerError;
export const selectRegisterSuccess = (state: RootState) => state.auth.registerSuccess;
export const selectIsLoginModalOpen = (state: RootState) => state.auth.isLoginModalOpen;
export const selectIsRegisterModalOpen = (state: RootState) => state.auth.isRegisterModalOpen;
export const selectSessionExpired = (state: RootState) => state.auth.sessionExpired;
export const selectShowWelcomeSplash = (state: RootState) => state.auth.showWelcomeSplash;
export const selectWelcomeName = (state: RootState) => state.auth.welcomeName;

export default authSlice.reducer;
