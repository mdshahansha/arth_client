/* ─── API Response Envelope ─── */
export interface ApiSuccess<T> {
  success: true;
  data: T;
  message: string;
}

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorResponse;

/* ─── Serialized Error (Redux-safe, no class instances) ─── */
export interface SerializedError {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
  statusCode?: number;
}

/* ─── Generic Async State ─── */
export interface AsyncState {
  loading: boolean;
  error: SerializedError | null;
}

/* ─── Auth ─── */
export interface User {
  id: string;
  name: string;
  email: string;
  profile_image_url: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  profileImageUrl?: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

/* ─── Dashboard ─── */
export interface MonthlyBreakdown {
  month: string;
  debit: number;
  credit: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
}

export interface DashboardData {
  user: User;
  totalSpend: number;
  totalIncome: number;
  monthlyBreakdown: MonthlyBreakdown[];
  categoryBreakdown: CategoryBreakdown[];
}

/* ─── Transactions ─── */
export type TransactionCategory = 'food' | 'travel' | 'shopping' | 'bills' | 'entertainment';
export type TransactionType = 'debit' | 'credit';

export interface Transaction {
  id: string;
  user_id: string;
  title: string;
  category: TransactionCategory;
  amount: string | number;
  type: TransactionType;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface TransactionsResponse {
  items: Transaction[];
  pagination: PaginationMeta;
}

/* ─── Notification ─── */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}
