import apiClient from './apiClient';
import type { ApiSuccess, LoginResponse, RegisterResponse, RegisterInput } from '../types';

export async function loginApi(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const res = await apiClient.post<ApiSuccess<LoginResponse>>('/auth/login', {
    email,
    password,
  });
  return res.data.data;
}

export async function registerApi(input: RegisterInput): Promise<RegisterResponse> {
  const res = await apiClient.post<ApiSuccess<RegisterResponse>>('/auth/register', input);
  return res.data.data;
}

export async function logoutApi(): Promise<void> {
  await apiClient.post('/auth/logout');
}
