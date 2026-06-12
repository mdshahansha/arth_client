import apiClient from './apiClient';
import type { ApiSuccess, DashboardData } from '../types';

export async function fetchDashboard(): Promise<DashboardData> {
  const res = await apiClient.get<ApiSuccess<DashboardData>>('/dashboard');
  return res.data.data;
}
