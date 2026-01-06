import axios from 'axios';
import { AuthResponse } from '@/types/call';

const BASE_URL = 'https://frontend-test-api.aircall.dev';

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${BASE_URL}/auth/login`, {
    username,
    password,
  });

  const { access_token, refresh_token } = response.data;
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('refresh_token', refresh_token);

  return response.data;
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};

export const refreshToken = async (): Promise<string> => {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) {
    throw new Error('No refresh token available');
  }

  const response = await axios.post<{ access_token: string }>(
    `${BASE_URL}/auth/refresh-token`,
    { refresh_token: refresh }
  );

  const { access_token } = response.data;
  localStorage.setItem('access_token', access_token);

  return access_token;
};