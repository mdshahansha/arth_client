import apiClient from './apiClient';
import type { ApiSuccess, Transaction, TransactionsResponse } from '../types';

export async function fetchTransactions(
  page: number,
  limit = 10,
): Promise<TransactionsResponse> {
  const res = await apiClient.get<ApiSuccess<TransactionsResponse>>('/transactions', {
    params: { page, limit },
  });
  return res.data.data;
}

export interface CreateTransactionPayload {
  title: string;
  category: 'food' | 'travel' | 'shopping' | 'bills' | 'entertainment';
  amount: number;
  type: 'debit' | 'credit';
  transaction_date?: string;
}

export async function createTransaction(payload: CreateTransactionPayload): Promise<Transaction> {
  const res = await apiClient.post<ApiSuccess<Transaction>>('/transactions', payload);
  return res.data.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await apiClient.delete(`/transactions/${id}`);
}
