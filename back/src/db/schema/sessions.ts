import { pgTable, serial, varchar, integer, boolean, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sessionStatusEnum, combatantStatusEnum } from './enums';
import { characters } from './characters';

// ===== SESSIONS =====
export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  status: sessionStatusEnum('status').notNull().default('active'),
  // Group AP pool (players)
  groupAP: integer('group_ap').notNull().default(0),
  maxGroupAP: integer('max_group_ap').notNull().default(6),
  // GM AP pool (no max limit)
  gmAP: integer('gm_ap').notNull().default(0),
  // Combat state
  combatActive: boolean('combat_active').notNull().default(false),
  currentRound: integer('current_round').notNull().default(0),
  currentTurnIndex: integer('current_turn_index').notNull().default(0),
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ===== SESSION PARTICIPANTS =====
export const sessionParticipants = pgTable('session_participants', {
  id: serial('id').primaryKey(),
  sessionId: integer('session_id').references(() => sessions.id, { onDelete: 'cascade' }).notNull(),
  characterId: integer('character_id').references(() => characters.id).notNull(),
  // Combat-specific data
  turnOrder: integer('turn_order'), // Initiative result (null if not in combat yet)
  combatStatus: combatantStatusEnum('combat_status').notNull().default('active'),
});

// ===== RELATIONS =====

export const sessionsRelations = relations(sessions, ({ many }) => ({
  participants: many(sessionParticipants),
}));

export const sessionParticipantsRelations = relations(sessionParticipants, ({ one }) => ({
  session: one(sessions, {
    fields: [sessionParticipants.sessionId],
    references: [sessions.id],
  }),
  character: one(characters, {
    fields: [sessionParticipants.characterId],
    references: [characters.id],
  }),
}));
