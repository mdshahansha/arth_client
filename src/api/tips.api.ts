import apiClient from './apiClient';
import type { ApiSuccess, TipsData } from '../types';

export async function fetchTips(): Promise<TipsData> {
  const res = await apiClient.get<ApiSuccess<TipsData>>('/tips');
  return res.data.data;
}

export async function toggleSaveTip(tipId: string): Promise<{ tipId: string; saved: boolean }> {
  const res = await apiClient.post<ApiSuccess<{ tipId: string; saved: boolean }>>(`/tips/${tipId}/save`);
  return res.data.data;
}
