import apiClient from './apiClient';
import type { ApiSuccess, TransactionsResponse } from '../types';

export async function fetchTransactions(
  page: number,
  limit = 10,
): Promise<TransactionsResponse> {
  const res = await apiClient.get<ApiSuccess<TransactionsResponse>>('/transactions', {
    params: { page, limit },
  });
  return res.data.data;
}
