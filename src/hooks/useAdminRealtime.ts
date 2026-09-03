import { useEffect, useRef, useState, useCallback } from 'react';
import { safeApiRequest } from '../utils/apiClient';

export interface StudentRegistration {
  id?: number;
  ref_id: string;
  name: string;
  sic_no: string;
  branch: string;
  tenth_percentage: number;
  twelfth_percentage: number;
  interested_subject: string;
  declaration_accepted: number;
  created_at: string;
}

export interface StatsData {
  total: number;
  todayCount: number;
  branchCounts: Record<string, number>;
  subjectCounts: Record<string, number>;
  recentCount: number;
}

export type RealtimeStatus = 'connecting' | 'connected' | 'reconnecting' | 'offline';

interface UseAdminRealtimeOptions {
  token: string | null;
  enabled: boolean;
  onNewRegistration: (record: StudentRegistration) => void;
  onStatsUpdate?: (stats: StatsData) => void;
  onReconcileRequired: () => Promise<void>;
}

export function useAdminRealtime({
  token,
  enabled,
  onNewRegistration,
  onStatsUpdate,
  onReconcileRequired
}: UseAdminRealtimeOptions) {
  const [status, setStatus] = useState<RealtimeStatus>('connecting');
  const [lastHeartbeat, setLastHeartbeat] = useState<Date | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const lastSyncTimeRef = useRef<string>(new Date().toISOString());
  const reconnectTimeoutRef = useRef<any>(null);
  const pollIntervalRef = useRef<any>(null);
  const isMountedRef = useRef<boolean>(true);

  // Authoritative catch-up delta sync
  const performDeltaSync = useCallback(async () => {
    if (!token || !enabled) return;
    try {
      const since = encodeURIComponent(lastSyncTimeRef.current);
      const res = await safeApiRequest(`/api/admin/events?since=${since}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok && res.data?.success) {
        if (res.data.serverTime) {
          lastSyncTimeRef.current = res.data.serverTime;
        }
        if (Array.isArray(res.data.events) && res.data.events.length > 0) {
          for (const ev of res.data.events) {
            if (ev.record && ev.record.ref_id) {
              onNewRegistration(ev.record);
            }
          }
        }
        if (res.data.stats && onStatsUpdate) {
          onStatsUpdate(res.data.stats);
        }
      }
    } catch (err) {
      console.warn('[Realtime] Delta sync check failed:', err);
    }
  }, [token, enabled, onNewRegistration, onStatsUpdate]);

  // Connect SSE
  const connectSSE = useCallback(() => {
    if (!token || !enabled || !isMountedRef.current) return;

    if (eventSourceRef.current) {
      try { eventSourceRef.current.close(); } catch {}
      eventSourceRef.current = null;
    }

    if (typeof window === 'undefined' || !window.EventSource) {
      // Fallback: poll mode
      setStatus('connected');
      return;
    }

    setStatus((prev) => (prev === 'connecting' ? 'connecting' : 'reconnecting'));

    const sinceParam = encodeURIComponent(lastSyncTimeRef.current);
    const sseUrl = `/api/admin/events?token=${encodeURIComponent(token)}&stream=true&since=${sinceParam}`;
    const es = new EventSource(sseUrl);
    eventSourceRef.current = es;

    es.addEventListener('open', () => {
      if (!isMountedRef.current) return;
      setStatus('connected');
      setLastHeartbeat(new Date());
    });

    es.addEventListener('connected', (e: MessageEvent) => {
      if (!isMountedRef.current) return;
      setStatus('connected');
      setLastHeartbeat(new Date());
      try {
        const payload = JSON.parse(e.data);
        if (payload.serverTime) lastSyncTimeRef.current = payload.serverTime;
      } catch {}
    });

    es.addEventListener('registration', (e: MessageEvent) => {
      if (!isMountedRef.current) return;
      setLastHeartbeat(new Date());
      try {
        const payload = JSON.parse(e.data);
        if (payload.record && payload.record.ref_id) {
          onNewRegistration(payload.record);
          if (payload.timestamp) {
            lastSyncTimeRef.current = payload.timestamp;
          }
        }
      } catch (err) {
        console.error('[Realtime] Failed to parse registration event:', err);
      }
    });

    es.onerror = () => {
      if (!isMountedRef.current) return;
      setStatus('reconnecting');
      try { es.close(); } catch {}
      eventSourceRef.current = null;

      // On disconnect: trigger delta sync and schedule reconnect
      performDeltaSync();

      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current && enabled && token) {
          connectSSE();
        }
      }, 3000);
    };
  }, [token, enabled, onNewRegistration, performDeltaSync]);

  // Main lifecycle
  useEffect(() => {
    isMountedRef.current = true;

    if (enabled && token) {
      connectSSE();

      // Adaptive delta synchronizer (runs every 3 seconds as a safety net)
      pollIntervalRef.current = setInterval(() => {
        performDeltaSync();
      }, 3000);
    } else {
      if (eventSourceRef.current) {
        try { eventSourceRef.current.close(); } catch {}
        eventSourceRef.current = null;
      }
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    }

    // Network online/offline recovery
    const handleOnline = () => {
      setStatus('reconnecting');
      onReconcileRequired().finally(() => {
        connectSSE();
      });
    };

    const handleOffline = () => {
      setStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      isMountedRef.current = false;
      if (eventSourceRef.current) {
        try { eventSourceRef.current.close(); } catch {}
        eventSourceRef.current = null;
      }
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [token, enabled, connectSSE, performDeltaSync, onReconcileRequired]);

  return {
    status,
    lastHeartbeat,
    reconnect: connectSSE,
    syncNow: performDeltaSync
  };
}
