import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { errorMiddleware } from '../middleware/errorMiddleware';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Allow date timestamps in state
        ignoredPaths: ['dashboard.lastFetched'],
      },
    }).concat(errorMiddleware),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
