import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { sessionsApi } from '../services/api';
import type {
  SessionApi,
  SessionParticipantApi,
  CreateSessionData,
  UpdateSessionData,
  AddQuickNpcData,
  SessionStatus,
  CombatantStatus,
} from '../services/api';

const SESSIONS_KEY = ['sessions'] as const;
const sessionKey = (id: number) => ['sessions', id] as const;

export function useSessionsApi() {
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: SESSIONS_KEY,
    queryFn: () => sessionsApi.list(),
    staleTime: 30_000,
  });

  const error = queryError?.message ?? null;

  const loadSessions = useCallback(async (filters?: { status?: SessionStatus }) => {
    await queryClient.invalidateQueries({ queryKey: SESSIONS_KEY });
  }, [queryClient]);

  const createSession = useCallback(async (data: CreateSessionData): Promise<SessionApi> => {
    const newSession = await sessionsApi.create(data);
    const full = await sessionsApi.get(newSession.id);
    queryClient.setQueryData<SessionApi[]>(SESSIONS_KEY, (old) => [...(old ?? []), full]);
    return full;
  }, [queryClient]);

  const updateSession = useCallback(async (id: number, data: UpdateSessionData): Promise<SessionApi> => {
    const updated = await sessionsApi.update(id, data);
    queryClient.setQueryData<SessionApi[]>(SESSIONS_KEY, (old) =>
      old?.map(s => s.id === id ? updated : s)
    );
    return updated;
  }, [queryClient]);

  const deleteSession = useCallback(async (id: number): Promise<void> => {
    await sessionsApi.delete(id);
    queryClient.setQueryData<SessionApi[]>(SESSIONS_KEY, (old) =>
      old?.filter(s => s.id !== id)
    );
  }, [queryClient]);

  const getSession = useCallback(async (id: number): Promise<SessionApi> => {
    return sessionsApi.get(id);
  }, []);

  const refreshSession = useCallback(async (id: number): Promise<SessionApi> => {
    const updated = await sessionsApi.get(id);
    queryClient.setQueryData<SessionApi[]>(SESSIONS_KEY, (old) =>
      old?.map(s => s.id === id ? updated : s)
    );
    return updated;
  }, [queryClient]);

  return {
    sessions,
    loading,
    error,
    loadSessions,
    createSession,
    updateSession,
    deleteSession,
    getSession,
    refreshSession,
  };
}

// Hook for working with a single session
export function useSession(sessionId: number | null) {
  const queryClient = useQueryClient();

  const { data: session = null, isLoading: loading, error: queryError } = useQuery({
    queryKey: sessionId ? sessionKey(sessionId) : ['sessions', 'none'],
    queryFn: () => sessionId ? sessionsApi.get(sessionId) : null,
    enabled: !!sessionId,
    staleTime: 10_000,
  });

  const error = queryError?.message ?? null;

  // Helper to update session in cache
  const setSession = useCallback((updater: (prev: SessionApi | null) => SessionApi | null) => {
    if (!sessionId) return;
    queryClient.setQueryData<SessionApi | null>(sessionKey(sessionId), (old) => updater(old ?? null));
  }, [sessionId, queryClient]);

  // Helper to refresh session from server
  const refreshAndSet = useCallback(async (): Promise<SessionApi | null> => {
    if (!sessionId) return null;
    const updated = await sessionsApi.get(sessionId);
    queryClient.setQueryData(sessionKey(sessionId), updated);
    return updated;
  }, [sessionId, queryClient]);

  const loadSession = useCallback(async () => {
    if (!sessionId) return;
    await queryClient.invalidateQueries({ queryKey: sessionKey(sessionId) });
  }, [sessionId, queryClient]);

  const updateSession = useCallback(async (data: UpdateSessionData): Promise<SessionApi | null> => {
    if (!sessionId) return null;
    const updated = await sessionsApi.update(sessionId, data);
    queryClient.setQueryData(sessionKey(sessionId), updated);
    return updated;
  }, [sessionId, queryClient]);

  // ===== PARTICIPANTS =====

  const addParticipant = useCallback(async (characterId: number): Promise<SessionParticipantApi | null> => {
    if (!sessionId) return null;
    const participant = await sessionsApi.addParticipant(sessionId, characterId);
    await refreshAndSet();
    return participant;
  }, [sessionId, refreshAndSet]);

  const addQuickNpc = useCallback(async (data: AddQuickNpcData): Promise<SessionParticipantApi | null> => {
    if (!sessionId) return null;
    const participant = await sessionsApi.addQuickNpc(sessionId, data);
    await refreshAndSet();
    return participant;
  }, [sessionId, refreshAndSet]);

  const removeParticipant = useCallback(async (participantId: number): Promise<void> => {
    if (!sessionId) return;
    await sessionsApi.removeParticipant(sessionId, participantId);
    await refreshAndSet();
  }, [sessionId, refreshAndSet]);

  const setCombatStatus = useCallback(async (participantId: number, status: CombatantStatus): Promise<void> => {
    if (!sessionId) return;
    await sessionsApi.setCombatStatus(sessionId, participantId, status);
    await refreshAndSet();
  }, [sessionId, refreshAndSet]);

  const setInitiative = useCallback(async (participantId: number, turnOrder: number): Promise<void> => {
    if (!sessionId) return;
    await sessionsApi.setInitiative(sessionId, participantId, turnOrder);
    await refreshAndSet();
  }, [sessionId, refreshAndSet]);

  // ===== COMBAT =====

  const startCombat = useCallback(async (participantIds?: number[]): Promise<SessionApi | null> => {
    if (!sessionId) return null;
    const updated = await sessionsApi.startCombat(sessionId, participantIds);
    queryClient.setQueryData(sessionKey(sessionId), updated);
    return updated;
  }, [sessionId, queryClient]);

  const endCombat = useCallback(async (): Promise<SessionApi | null> => {
    if (!sessionId) return null;
    const updated = await sessionsApi.endCombat(sessionId);
    queryClient.setQueryData(sessionKey(sessionId), updated);
    return updated;
  }, [sessionId, queryClient]);

  const nextTurn = useCallback(async (): Promise<SessionApi | null> => {
    if (!sessionId) return null;
    const updated = await sessionsApi.nextTurn(sessionId);
    queryClient.setQueryData(sessionKey(sessionId), updated);
    return updated;
  }, [sessionId, queryClient]);

  const prevTurn = useCallback(async (): Promise<SessionApi | null> => {
    if (!sessionId) return null;
    const updated = await sessionsApi.prevTurn(sessionId);
    queryClient.setQueryData(sessionKey(sessionId), updated);
    return updated;
  }, [sessionId, queryClient]);

  // ===== GROUP AP (Players) =====

  const updateGroupAP = useCallback(async (data: { groupAP?: number; maxGroupAP?: number }): Promise<SessionApi | null> => {
    if (!sessionId) return null;
    const updated = await sessionsApi.updateGroupAP(sessionId, data);
    queryClient.setQueryData(sessionKey(sessionId), updated);
    return updated;
  }, [sessionId, queryClient]);

  const spendGroupAP = useCallback(async (amount: number): Promise<SessionApi | null> => {
    if (!session) return null;
    const newAP = Math.max(0, session.groupAP - amount);
    return updateGroupAP({ groupAP: newAP });
  }, [session, updateGroupAP]);

  const gainGroupAP = useCallback(async (amount: number): Promise<SessionApi | null> => {
    if (!session) return null;
    const newAP = Math.min(session.maxGroupAP, session.groupAP + amount);
    return updateGroupAP({ groupAP: newAP });
  }, [session, updateGroupAP]);

  // ===== GM AP =====

  const updateGmAP = useCallback(async (gmAP: number): Promise<SessionApi | null> => {
    if (!sessionId) return null;
    const updated = await sessionsApi.updateGmAP(sessionId, gmAP);
    queryClient.setQueryData(sessionKey(sessionId), updated);
    return updated;
  }, [sessionId, queryClient]);

  const spendGmAP = useCallback(async (amount: number): Promise<SessionApi | null> => {
    if (!session) return null;
    const newAP = Math.max(0, session.gmAP - amount);
    return updateGmAP(newAP);
  }, [session, updateGmAP]);

  const gainGmAP = useCallback(async (amount: number): Promise<SessionApi | null> => {
    if (!session) return null;
    const newAP = session.gmAP + amount;
    return updateGmAP(newAP);
  }, [session, updateGmAP]);

  // ===== OPTIMISTIC UPDATES =====

  const updateParticipantCharacter = useCallback((
    characterId: number,
    updates: Partial<SessionParticipantApi['character']>
  ) => {
    setSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        participants: prev.participants.map(p =>
          p.characterId === characterId
            ? { ...p, character: { ...p.character, ...updates } }
            : p
        ),
      };
    });
  }, [setSession]);

  // ===== COMPUTED VALUES =====

  const sortedParticipants = useMemo(() =>
    session?.participants
      .filter(p => p.turnOrder !== null)
      .sort((a, b) => (b.turnOrder ?? 0) - (a.turnOrder ?? 0)) ?? []
  , [session?.participants]);

  const currentParticipant = session?.combatActive && sortedParticipants.length > 0
    ? sortedParticipants[session.currentTurnIndex] ?? null
    : null;

  return {
    session,
    loading,
    error,
    loadSession,
    updateSession,
    // Participants
    addParticipant,
    addQuickNpc,
    removeParticipant,
    setCombatStatus,
    setInitiative,
    updateParticipantCharacter,
    // Combat
    startCombat,
    endCombat,
    nextTurn,
    prevTurn,
    // Group AP (Players)
    updateGroupAP,
    spendGroupAP,
    gainGroupAP,
    // GM AP
    updateGmAP,
    spendGmAP,
    gainGmAP,
    // Computed
    sortedParticipants,
    currentParticipant,
  };
}
