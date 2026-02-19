import type { Session, CreateSessionData, UpdateSessionData, Participant, AddQuickNpcData } from '../models/session';
import type { CombatantStatus } from '../models/character';

export interface SessionRepository {
  list(filters?: { status?: string; full?: boolean }): Promise<Session[]>;
  get(id: number): Promise<Session>;
  create(data: CreateSessionData): Promise<Session>;
  update(id: number, data: UpdateSessionData): Promise<Session>;
  delete(id: number): Promise<void>;
  addParticipant(sessionId: number, characterId: number): Promise<Participant>;
  addQuickNpc(sessionId: number, data: AddQuickNpcData): Promise<Participant>;
  removeParticipant(sessionId: number, participantId: number): Promise<void>;
  setCombatStatus(sessionId: number, participantId: number, status: CombatantStatus): Promise<Participant>;
  setInitiative(sessionId: number, participantId: number, turnOrder: number): Promise<Participant>;
  startCombat(sessionId: number): Promise<Session>;
  endCombat(sessionId: number): Promise<Session>;
  nextTurn(sessionId: number): Promise<Session>;
  prevTurn(sessionId: number): Promise<Session>;
  updateGroupAP(sessionId: number, data: { groupAP?: number; maxGroupAP?: number }): Promise<Session>;
  updateGmAP(sessionId: number, gmAP: number): Promise<Session>;
}
