import apiClient from './apiClient';
import type { ApiSuccess, WalletsData } from '../types';

export async function fetchWallets(): Promise<WalletsData> {
  const res = await apiClient.get<ApiSuccess<WalletsData>>('/wallets');
  return res.data.data;
}
