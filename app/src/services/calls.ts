import api from './api';
import { Call, CallsResponse } from '@/types/call';

export const fetchCalls = async (
  offset: number = 0,
  limit: number = 10
): Promise<CallsResponse> => {
  const response = await api.get<CallsResponse>('/calls', {
    params: { offset, limit },
  });
  return response.data;
};

export const fetchCallById = async (id: string): Promise<Call | null> => {
  const response = await api.get<Call | null>(`/calls/${id}`);
  return response.data;
};

export const toggleArchiveCall = async (id: string): Promise<Call> => {
  const response = await api.put<Call>(`/calls/${id}/archive`);
  return response.data;
};

export const addNote = async (id: string, content: string): Promise<Call> => {
  const response = await api.post<Call>(`/calls/${id}/note`, {
    content,
  });
  return response.data;
};
