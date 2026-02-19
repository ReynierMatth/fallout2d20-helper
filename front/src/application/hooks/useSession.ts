import { useState, useEffect, useCallback } from 'react';
import { useRepositories } from '../providers/RepositoryProvider';
import type { Session, AddQuickNpcData } from '../../domain/models/session';
import type { CombatantStatus } from '../../domain/models/character';

export function useSession(id: number | null) {
  const { sessions } = useRepositories();
  const [data, setData] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    if (id === null) { setData(null); setLoading(false); return; }
    try {
      setLoading(true);
      setError(null);
      const result = await sessions.get(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch session');
    } finally {
      setLoading(false);
    }
  }, [sessions, id]);

  useEffect(() => { fetchSession(); }, [fetchSession]);

  const addParticipant = useCallback(async (characterId: number) => {
    if (!id) throw new Error('No session ID');
    await sessions.addParticipant(id, characterId);
    await fetchSession();
  }, [sessions, id, fetchSession]);

  const addQuickNpc = useCallback(async (npcData: AddQuickNpcData) => {
    if (!id) throw new Error('No session ID');
    await sessions.addQuickNpc(id, npcData);
    await fetchSession();
  }, [sessions, id, fetchSession]);

  const removeParticipant = useCallback(async (participantId: number) => {
    if (!id) throw new Error('No session ID');
    await sessions.removeParticipant(id, participantId);
    await fetchSession();
  }, [sessions, id, fetchSession]);

  const setCombatStatus = useCallback(async (participantId: number, status: CombatantStatus) => {
    if (!id) throw new Error('No session ID');
    await sessions.setCombatStatus(id, participantId, status);
    await fetchSession();
  }, [sessions, id, fetchSession]);

  const setInitiative = useCallback(async (participantId: number, turnOrder: number) => {
    if (!id) throw new Error('No session ID');
    await sessions.setInitiative(id, participantId, turnOrder);
    await fetchSession();
  }, [sessions, id, fetchSession]);

  const startCombat = useCallback(async () => {
    if (!id) throw new Error('No session ID');
    const updated = await sessions.startCombat(id);
    setData(updated);
  }, [sessions, id]);

  const endCombat = useCallback(async () => {
    if (!id) throw new Error('No session ID');
    const updated = await sessions.endCombat(id);
    setData(updated);
  }, [sessions, id]);

  const nextTurn = useCallback(async () => {
    if (!id) throw new Error('No session ID');
    const updated = await sessions.nextTurn(id);
    setData(updated);
  }, [sessions, id]);

  const prevTurn = useCallback(async () => {
    if (!id) throw new Error('No session ID');
    const updated = await sessions.prevTurn(id);
    setData(updated);
  }, [sessions, id]);

  const updateGroupAP = useCallback(async (apData: { groupAP?: number; maxGroupAP?: number }) => {
    if (!id) throw new Error('No session ID');
    const updated = await sessions.updateGroupAP(id, apData);
    setData(updated);
  }, [sessions, id]);

  const updateGmAP = useCallback(async (gmAP: number) => {
    if (!id) throw new Error('No session ID');
    const updated = await sessions.updateGmAP(id, gmAP);
    setData(updated);
  }, [sessions, id]);

  return {
    data, loading, error, refetch: fetchSession,
    addParticipant, addQuickNpc, removeParticipant,
    setCombatStatus, setInitiative,
    startCombat, endCombat, nextTurn, prevTurn,
    updateGroupAP, updateGmAP,
  };
}
