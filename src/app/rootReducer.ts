import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import transactionsReducer from '../features/transactions/transactionsSlice';
import uiReducer from '../features/ui/uiSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  transactions: transactionsReducer,
  ui: uiReducer,
});

export default rootReducer;
