'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Call, CallFilter } from '@/types/call';
import { fetchCalls } from '@/services/calls';
import Pusher from 'pusher-js';

const PUSHER_KEY = 'd44e3d910d38a928e0be';
const PUSHER_CLUSTER = 'eu';

export const useCalls = () => {
  const [allCalls, setAllCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [filter, setFilter] = useState<CallFilter>('all');

  const limit = 10;

  const loadAllCalls = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchCalls(0, 10000);
      setAllCalls(res.nodes);
      setError(null);
    } catch {
      setError('Failed to fetch calls');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllCalls();
  }, [loadAllCalls]);

  // Reset page on filter change
  useEffect(() => {
    setOffset(0);
  }, [filter]);

  const filteredCalls = useMemo(() => {
    switch (filter) {
      case 'archived':
        return allCalls.filter(c => c.is_archived);
      case 'unarchived':
        return allCalls.filter(c => !c.is_archived);
      case 'missed':
        return allCalls.filter(c => c.call_type === 'missed');
      case 'answered':
        return allCalls.filter(c => c.call_type === 'answered');
      case 'voicemail':
        return allCalls.filter(c => c.call_type === 'voicemail');
      default:
        return allCalls;
    }
  }, [allCalls, filter]);

  const calls = filteredCalls.slice(offset, offset + limit);
  const totalCount = filteredCalls.length;
  const totalPages = Math.ceil(totalCount / limit);

  const loadPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setOffset((page - 1) * limit);
  };

  const updateCall = (updatedCall: Call) => {
    setAllCalls(prev =>
      prev.map(c => (c.id === updatedCall.id ? updatedCall : c))
    );
  };

  // Pusher
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      authEndpoint: 'https://frontend-test-api.aircall.dev/pusher/auth',
      auth: { headers: { Authorization: `Bearer ${token}` } },
    });

    const channel = pusher.subscribe('private-aircall');
    channel.bind('update-call', updateCall);

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  return {
    calls,
    loading,
    error,
    offset,
    limit,
    totalCount,
    totalPages,
    loadPage,
    updateCall,
    filter,
    setFilter,
  };
};
