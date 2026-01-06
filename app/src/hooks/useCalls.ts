'use client';

import { useState, useEffect, useCallback } from 'react';
import { Call, CallFilter } from '@/types/call';
import { fetchCalls } from '@/services/calls';
import Pusher from 'pusher-js';

const PUSHER_KEY = 'd44e3d910d38a928e0be';
const PUSHER_CLUSTER = 'eu';

export const useCalls = () => {
  const [allCalls, setAllCalls] = useState<Call[]>([]); // store all calls
  const [calls, setCalls] = useState<Call[]>([]); // filtered + paginated
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [filter, setFilter] = useState<CallFilter>('all');

  const limit = 10; // results per page

  // Fetch all calls from API
  const loadAllCalls = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchCalls(0, 10000); // fetch all calls, adjust max if needed
      setAllCalls(response.nodes);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch calls');
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply filter + pagination whenever filter or offset changes
  const applyFilterAndPagination = useCallback(() => {
    let filtered = allCalls;

    switch (filter) {
    case 'archived':
      filtered = filtered.filter(c => c.is_archived);
      break;
    case 'unarchived':          
      filtered = filtered.filter(c => !c.is_archived);
      break;
    case 'missed':
      filtered = filtered.filter(c => c.call_type === 'missed');
      break;
    case 'answered':
      filtered = filtered.filter(c => c.call_type === 'answered');
      break;
    case 'voicemail':
      filtered = filtered.filter(c => c.call_type === 'voicemail');
      break;
    case 'all':
    default:
      filtered = filtered;    
      break;
  }


    setCalls(filtered.slice(offset, offset + limit));
  }, [allCalls, filter, offset, limit]);

  useEffect(() => {
    loadAllCalls();
  }, [loadAllCalls]);

  useEffect(() => {
    applyFilterAndPagination();
  }, [applyFilterAndPagination]);

  // Pagination functions
  const totalCount = (() => {
    switch (filter) {
      case 'archived':
        return allCalls.filter(c => c.is_archived).length;
      case 'unarchived':
        return allCalls.filter(c => !c.is_archived).length;
      case 'missed':
        return allCalls.filter(c => c.call_type === 'missed').length;
      case 'answered':
        return allCalls.filter(c => c.call_type === 'answered').length;
      case 'voicemail':
        return allCalls.filter(c => c.call_type === 'voicemail').length;
      case 'all':
      default:
        return allCalls.length;
    }
  })();

  const totalPages = Math.ceil(totalCount / limit);

  const loadPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setOffset((page - 1) * limit);
  };

  const nextPage = () => {
    if (offset + limit < totalCount) setOffset(offset + limit);
  };

  const prevPage = () => {
    if (offset > 0) setOffset(Math.max(0, offset - limit));
  };

  const refresh = () => {
    loadAllCalls();
    setOffset(0);
  };

  const updateCall = (updatedCall: Call) => {
    setAllCalls(prev =>
      prev.map(c => (c.id === updatedCall.id ? updatedCall : c))
    );
  };

  // Real-time updates via Pusher
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      authEndpoint: 'https://frontend-test-api.aircall.dev/pusher/auth',
      auth: { headers: { Authorization: `Bearer ${token}` } },
    });

    const channel = pusher.subscribe('private-aircall');

    channel.bind('update-call', (data: Call) => {
      updateCall(data);
    });

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
    hasNextPage: offset + limit < totalCount,
    hasPrevPage: offset > 0,
    nextPage,
    prevPage,
    loadPage,
    refresh,
    updateCall,
    filter,
    setFilter,
  };
};
