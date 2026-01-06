import api from './api';
import { Call, CallsResponse } from '@/types/call';

export const fetchCalls = async (offset: number = 0, limit: number = 10): Promise<CallsResponse> => {
  const response = await api.get<CallsResponse>('/calls', {
    params: { offset, limit },
  });
  return response.data;
};

export const fetchCallById = async (id: string): Promise<Call> => {
  const response = await api.get<Call>(`/calls/${id}`);
  return response.data;
};

export const archiveCall = async (id: string): Promise<Call> => {
  const response = await api.put<Call>(`/calls/${id}/archive`);
  return response.data;
};

export const unarchiveCall = async (id: string): Promise<Call> => {
  const response = await api.put<Call>(`/calls/${id}/archive`, { is_archived: false });
  return response.data;
};

export const addNote = async (id: string, content: string): Promise<Call> => {
  const response = await api.post<Call>(`/calls/${id}/note`, {
    content,
  });
  return response.data;
};