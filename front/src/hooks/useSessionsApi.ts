import { useState, useEffect, useCallback } from 'react';
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

export function useSessionsApi() {
  const [sessions, setSessions] = useState<SessionApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all sessions
  const loadSessions = useCallback(async (filters?: { status?: SessionStatus }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sessionsApi.list({ ...filters, full: true });
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Create session
  const createSession = useCallback(async (data: CreateSessionData): Promise<SessionApi> => {
    const newSession = await sessionsApi.create(data);
    // Reload to get full session with participants
    const full = await sessionsApi.get(newSession.id);
    setSessions(prev => [...prev, full]);
    return full;
  }, []);

  // Update session
  const updateSession = useCallback(async (id: number, data: UpdateSessionData): Promise<SessionApi> => {
    const updated = await sessionsApi.update(id, data);
    setSessions(prev => prev.map(s => s.id === id ? updated : s));
    return updated;
  }, []);

  // Delete session
  const deleteSession = useCallback(async (id: number): Promise<void> => {
    await sessionsApi.delete(id);
    setSessions(prev => prev.filter(s => s.id !== id));
  }, []);

  // Get single session
  const getSession = useCallback(async (id: number): Promise<SessionApi> => {
    return sessionsApi.get(id);
  }, []);

  // Refresh single session in list
  const refreshSession = useCallback(async (id: number): Promise<SessionApi> => {
    const updated = await sessionsApi.get(id);
    setSessions(prev => prev.map(s => s.id === id ? updated : s));
    return updated;
  }, []);

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
  const [session, setSession] = useState<SessionApi | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load session
  const loadSession = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await sessionsApi.get(sessionId);
      setSession(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load session');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Update session
  const updateSession = useCallback(async (data: UpdateSessionData): Promise<SessionApi | null> => {
    if (!sessionId) return null;
    try {
      const updated = await sessionsApi.update(sessionId, data);
      setSession(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update session');
      throw err;
    }
  }, [sessionId]);

  // ===== PARTICIPANTS =====

  const addParticipant = useCallback(async (characterId: number): Promise<SessionParticipantApi | null> => {
    if (!sessionId) return null;
    try {
      const participant = await sessionsApi.addParticipant(sessionId, characterId);
      // Refresh session to get updated participants list
      const updated = await sessionsApi.get(sessionId);
      setSession(updated);
      return participant;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add participant');
      throw err;
    }
  }, [sessionId]);

  const addQuickNpc = useCallback(async (data: AddQuickNpcData): Promise<SessionParticipantApi | null> => {
    if (!sessionId) return null;
    try {
      const participant = await sessionsApi.addQuickNpc(sessionId, data);
      const updated = await sessionsApi.get(sessionId);
      setSession(updated);
      return participant;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add quick NPC');
      throw err;
    }
  }, [sessionId]);

  const removeParticipant = useCallback(async (participantId: number): Promise<void> => {
    if (!sessionId) return;
    try {
      await sessionsApi.removeParticipant(sessionId, participantId);
      const updated = await sessionsApi.get(sessionId);
      setSession(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove participant');
      throw err;
    }
  }, [sessionId]);

  const setCombatStatus = useCallback(async (participantId: number, status: CombatantStatus): Promise<void> => {
    if (!sessionId) return;
    try {
      await sessionsApi.setCombatStatus(sessionId, participantId, status);
      const updated = await sessionsApi.get(sessionId);
      setSession(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set combat status');
      throw err;
    }
  }, [sessionId]);

  const setInitiative = useCallback(async (participantId: number, turnOrder: number): Promise<void> => {
    if (!sessionId) return;
    try {
      await sessionsApi.setInitiative(sessionId, participantId, turnOrder);
      const updated = await sessionsApi.get(sessionId);
      setSession(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set initiative');
      throw err;
    }
  }, [sessionId]);

  // ===== COMBAT =====

  const startCombat = useCallback(async (): Promise<SessionApi | null> => {
    if (!sessionId) return null;
    try {
      const updated = await sessionsApi.startCombat(sessionId);
      setSession(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start combat');
      throw err;
    }
  }, [sessionId]);

  const endCombat = useCallback(async (): Promise<SessionApi | null> => {
    if (!sessionId) return null;
    try {
      const updated = await sessionsApi.endCombat(sessionId);
      setSession(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end combat');
      throw err;
    }
  }, [sessionId]);

  const nextTurn = useCallback(async (): Promise<SessionApi | null> => {
    if (!sessionId) return null;
    try {
      const updated = await sessionsApi.nextTurn(sessionId);
      setSession(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to advance turn');
      throw err;
    }
  }, [sessionId]);

  const prevTurn = useCallback(async (): Promise<SessionApi | null> => {
    if (!sessionId) return null;
    try {
      const updated = await sessionsApi.prevTurn(sessionId);
      setSession(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to go to previous turn');
      throw err;
    }
  }, [sessionId]);

  // ===== GROUP AP (Players) =====

  const updateGroupAP = useCallback(async (data: { groupAP?: number; maxGroupAP?: number }): Promise<SessionApi | null> => {
    if (!sessionId) return null;
    try {
      const updated = await sessionsApi.updateGroupAP(sessionId, data);
      setSession(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update AP');
      throw err;
    }
  }, [sessionId]);

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
    try {
      const updated = await sessionsApi.updateGmAP(sessionId, gmAP);
      setSession(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update GM AP');
      throw err;
    }
  }, [sessionId]);

  const spendGmAP = useCallback(async (amount: number): Promise<SessionApi | null> => {
    if (!session) return null;
    const newAP = Math.max(0, session.gmAP - amount);
    return updateGmAP(newAP);
  }, [session, updateGmAP]);

  const gainGmAP = useCallback(async (amount: number): Promise<SessionApi | null> => {
    if (!session) return null;
    // GM AP has no max limit
    const newAP = session.gmAP + amount;
    return updateGmAP(newAP);
  }, [session, updateGmAP]);

  // ===== OPTIMISTIC UPDATES =====

  // Update a participant's character data locally (optimistic update)
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
  }, []);

  // ===== COMPUTED VALUES =====

  // Get sorted participants by initiative (for combat)
  const sortedParticipants = session?.participants
    .filter(p => p.turnOrder !== null)
    .sort((a, b) => (b.turnOrder ?? 0) - (a.turnOrder ?? 0)) ?? [];

  // Get current active participant
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
