import type { SessionRepository } from '../../domain/ports/SessionRepository';
import type { Session, CreateSessionData, UpdateSessionData, Participant, AddQuickNpcData } from '../../domain/models/session';
import type { CombatantStatus } from '../../domain/models/character';
import { fetchApi } from '../http/httpClient';

export class ApiSessionRepository implements SessionRepository {
  list(filters?: { status?: string; full?: boolean }): Promise<Session[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.full) params.set('full', 'true');
    const query = params.toString();
    return fetchApi(`/sessions${query ? `?${query}` : ''}`);
  }

  get(id: number): Promise<Session> {
    return fetchApi(`/sessions/${id}`);
  }

  create(data: CreateSessionData): Promise<Session> {
    return fetchApi('/sessions', { method: 'POST', body: JSON.stringify(data) });
  }

  update(id: number, data: UpdateSessionData): Promise<Session> {
    return fetchApi(`/sessions/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async delete(id: number): Promise<void> {
    await fetchApi<null>(`/sessions/${id}`, { method: 'DELETE' });
  }

  addParticipant(sessionId: number, characterId: number): Promise<Participant> {
    return fetchApi(`/sessions/${sessionId}/participants`, { method: 'POST', body: JSON.stringify({ characterId }) });
  }

  addQuickNpc(sessionId: number, data: AddQuickNpcData): Promise<Participant> {
    return fetchApi(`/sessions/${sessionId}/participants/quick`, { method: 'POST', body: JSON.stringify(data) });
  }

  async removeParticipant(sessionId: number, participantId: number): Promise<void> {
    await fetchApi<null>(`/sessions/${sessionId}/participants/${participantId}`, { method: 'DELETE' });
  }

  setCombatStatus(sessionId: number, participantId: number, status: CombatantStatus): Promise<Participant> {
    return fetchApi(`/sessions/${sessionId}/participants/${participantId}/combat-status`, { method: 'PUT', body: JSON.stringify({ combatStatus: status }) });
  }

  setInitiative(sessionId: number, participantId: number, turnOrder: number): Promise<Participant> {
    return fetchApi(`/sessions/${sessionId}/participants/${participantId}/initiative`, { method: 'PUT', body: JSON.stringify({ turnOrder }) });
  }

  startCombat(sessionId: number): Promise<Session> {
    return fetchApi(`/sessions/${sessionId}/combat/start`, { method: 'POST' });
  }

  endCombat(sessionId: number): Promise<Session> {
    return fetchApi(`/sessions/${sessionId}/combat/end`, { method: 'POST' });
  }

  nextTurn(sessionId: number): Promise<Session> {
    return fetchApi(`/sessions/${sessionId}/combat/next-turn`, { method: 'POST' });
  }

  prevTurn(sessionId: number): Promise<Session> {
    return fetchApi(`/sessions/${sessionId}/combat/prev-turn`, { method: 'POST' });
  }

  updateGroupAP(sessionId: number, data: { groupAP?: number; maxGroupAP?: number }): Promise<Session> {
    return fetchApi(`/sessions/${sessionId}/ap`, { method: 'PUT', body: JSON.stringify(data) });
  }

  updateGmAP(sessionId: number, gmAP: number): Promise<Session> {
    return fetchApi(`/sessions/${sessionId}/gm-ap`, { method: 'PUT', body: JSON.stringify({ gmAP }) });
  }
}
