import { useState, useEffect, useCallback } from 'react';
import { Notification } from '../utils/priorityScore';

const API_BASE = '';

interface FetchParams {
  limit?: number;
  page?: number;
  notification_type?: string;
}

export function useNotifications(params: FetchParams = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams();
      if (params.limit) query.append('limit', String(params.limit));
      if (params.page) query.append('page', String(params.page));
      if (params.notification_type)
        query.append('notification_type', params.notification_type);

      const url = `/api/notifications${
        query.toString() ? '?' + query.toString() : ''
      }`;

      const res = await fetch(url);

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();

      const merged = data.notifications.map((n: Notification) => ({
        ...n,
        viewed: viewedIds.has(n.ID),
      }));

      setNotifications(merged);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [params.limit, params.page, params.notification_type]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  function markViewed(id: string) {
    setViewedIds(prev => new Set([...prev, id]));
    setNotifications(prev =>
      prev.map(n => (n.ID === id ? { ...n, viewed: true } : n))
    );
  }

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications,
    markViewed,
  };
}