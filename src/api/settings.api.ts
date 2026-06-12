import apiClient from './apiClient';
import type { ApiSuccess, User } from '../types';

export async function updateProfile(data: { name?: string; email?: string; profile_image_url?: string }): Promise<User> {
  const res = await apiClient.put<ApiSuccess<User>>('/settings/profile', data);
  return res.data.data;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiClient.put('/settings/password', { currentPassword, newPassword });
}
