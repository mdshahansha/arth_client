import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import transactionsReducer from '../features/transactions/transactionsSlice';
import uiReducer from '../features/ui/uiSlice';
import walletsReducer from '../features/wallets/walletsSlice';
import tipsReducer from '../features/tips/tipsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  transactions: transactionsReducer,
  ui: uiReducer,
  wallets: walletsReducer,
  tips: tipsReducer,
});

export default rootReducer;
