import { useState, useEffect, useCallback } from 'react';
import { useRepositories } from '../providers/RepositoryProvider';
import type { Session, CreateSessionData, UpdateSessionData } from '../../domain/models/session';

export function useSessions(filters?: { status?: string }) {
  const { sessions } = useRepositories();
  const [data, setData] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await sessions.list({ ...filters, full: true });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  }, [sessions, filters?.status]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const createSession = useCallback(async (sessionData: CreateSessionData): Promise<Session> => {
    const created = await sessions.create(sessionData);
    await fetchSessions();
    return created;
  }, [sessions, fetchSessions]);

  const updateSession = useCallback(async (id: number, sessionData: UpdateSessionData): Promise<Session> => {
    const updated = await sessions.update(id, sessionData);
    await fetchSessions();
    return updated;
  }, [sessions, fetchSessions]);

  const deleteSession = useCallback(async (id: number): Promise<void> => {
    await sessions.delete(id);
    await fetchSessions();
  }, [sessions, fetchSessions]);

  return { data, loading, error, refetch: fetchSessions, createSession, updateSession, deleteSession };
}
