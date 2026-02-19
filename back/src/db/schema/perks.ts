import { pgTable, serial, varchar, integer, boolean, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { specialAttributeEnum, skillNameEnum } from './enums';

// ===== PERKS =====
export const perks = pgTable('perks', {
  id: varchar('id', { length: 50 }).primaryKey(),
  nameKey: varchar('name_key', { length: 100 }).notNull(),
  effectKey: varchar('effect_key', { length: 100 }).notNull(),
  maxRanks: integer('max_ranks').notNull().default(1),
  // Base prerequisites
  levelRequired: integer('level_required'),
  levelIncreasePerRank: integer('level_increase_per_rank'),
  notForRobots: boolean('not_for_robots').default(false),
});

// Perk SPECIAL prerequisites
export const perkSpecialPrerequisites = pgTable('perk_special_prerequisites', {
  id: serial('id').primaryKey(),
  perkId: varchar('perk_id', { length: 50 }).references(() => perks.id).notNull(),
  attribute: specialAttributeEnum('attribute').notNull(),
  minValue: integer('min_value').notNull(),
});

// Perk skill prerequisites
export const perkSkillPrerequisites = pgTable('perk_skill_prerequisites', {
  id: serial('id').primaryKey(),
  perkId: varchar('perk_id', { length: 50 }).references(() => perks.id).notNull(),
  skill: skillNameEnum('skill').notNull(),
  minRank: integer('min_rank').notNull(),
});

// Perk required perks (other perks that must be taken first)
export const perkRequiredPerks = pgTable('perk_required_perks', {
  id: serial('id').primaryKey(),
  perkId: varchar('perk_id', { length: 50 }).references(() => perks.id).notNull(),
  requiredPerkId: varchar('required_perk_id', { length: 50 }).notNull(),
});

// Perk excluded perks (perks that cannot be taken together)
export const perkExcludedPerks = pgTable('perk_excluded_perks', {
  id: serial('id').primaryKey(),
  perkId: varchar('perk_id', { length: 50 }).references(() => perks.id).notNull(),
  excludedPerkId: varchar('excluded_perk_id', { length: 50 }).notNull(),
});

// Perk rank effects (for perks with different effects per rank)
export const perkRankEffects = pgTable('perk_rank_effects', {
  id: serial('id').primaryKey(),
  perkId: varchar('perk_id', { length: 50 }).references(() => perks.id).notNull(),
  rank: integer('rank').notNull(),
  effectKey: varchar('effect_key', { length: 100 }).notNull(),
});

// Relations
export const perksRelations = relations(perks, ({ many }) => ({
  specialPrerequisites: many(perkSpecialPrerequisites),
  skillPrerequisites: many(perkSkillPrerequisites),
  requiredPerks: many(perkRequiredPerks),
  excludedPerks: many(perkExcludedPerks),
  rankEffects: many(perkRankEffects),
}));

export const perkSpecialPrerequisitesRelations = relations(perkSpecialPrerequisites, ({ one }) => ({
  perk: one(perks, {
    fields: [perkSpecialPrerequisites.perkId],
    references: [perks.id],
  }),
}));

export const perkSkillPrerequisitesRelations = relations(perkSkillPrerequisites, ({ one }) => ({
  perk: one(perks, {
    fields: [perkSkillPrerequisites.perkId],
    references: [perks.id],
  }),
}));

export const perkRequiredPerksRelations = relations(perkRequiredPerks, ({ one }) => ({
  perk: one(perks, {
    fields: [perkRequiredPerks.perkId],
    references: [perks.id],
  }),
}));

export const perkExcludedPerksRelations = relations(perkExcludedPerks, ({ one }) => ({
  perk: one(perks, {
    fields: [perkExcludedPerks.perkId],
    references: [perks.id],
  }),
}));

export const perkRankEffectsRelations = relations(perkRankEffects, ({ one }) => ({
  perk: one(perks, {
    fields: [perkRankEffects.perkId],
    references: [perks.id],
  }),
}));
