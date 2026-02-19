import { pgTable, serial, varchar, integer, boolean, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import {
  specialAttributeEnum,
  skillNameEnum,
  originIdEnum,
  survivorTraitIdEnum,
  characterTypeEnum,
  conditionEnum,
  bodyLocationEnum
} from './enums';
import { items } from './items';

// ===== ORIGINS =====
export const origins = pgTable('origins', {
  id: originIdEnum('id').primaryKey(),
  nameKey: varchar('name_key', { length: 100 }).notNull(),
  descriptionKey: varchar('description_key', { length: 100 }).notNull(),
  traitNameKey: varchar('trait_name_key', { length: 100 }).notNull(),
  traitDescriptionKey: varchar('trait_description_key', { length: 100 }).notNull(),
  skillMaxOverride: integer('skill_max_override'),
  isRobot: boolean('is_robot').default(false),
});

// Origin SPECIAL modifiers (e.g., Super Mutant: STR+2)
export const originSpecialModifiers = pgTable('origin_special_modifiers', {
  id: serial('id').primaryKey(),
  originId: originIdEnum('origin_id').references(() => origins.id).notNull(),
  attribute: specialAttributeEnum('attribute').notNull(),
  modifier: integer('modifier').notNull(),
});

// Origin SPECIAL max overrides (e.g., Super Mutant: INT max 6)
export const originSpecialMaxOverrides = pgTable('origin_special_max_overrides', {
  id: serial('id').primaryKey(),
  originId: originIdEnum('origin_id').references(() => origins.id).notNull(),
  attribute: specialAttributeEnum('attribute').notNull(),
  maxValue: integer('max_value').notNull(),
});

// Origin bonus tag skills (e.g., Ghoul: Survival)
export const originBonusTagSkills = pgTable('origin_bonus_tag_skills', {
  id: serial('id').primaryKey(),
  originId: originIdEnum('origin_id').references(() => origins.id).notNull(),
  skill: skillNameEnum('skill').notNull(),
});

export const originsRelations = relations(origins, ({ many }) => ({
  specialModifiers: many(originSpecialModifiers),
  specialMaxOverrides: many(originSpecialMaxOverrides),
  bonusTagSkills: many(originBonusTagSkills),
}));

export const originSpecialModifiersRelations = relations(originSpecialModifiers, ({ one }) => ({
  origin: one(origins, {
    fields: [originSpecialModifiers.originId],
    references: [origins.id],
  }),
}));

export const originSpecialMaxOverridesRelations = relations(originSpecialMaxOverrides, ({ one }) => ({
  origin: one(origins, {
    fields: [originSpecialMaxOverrides.originId],
    references: [origins.id],
  }),
}));

export const originBonusTagSkillsRelations = relations(originBonusTagSkills, ({ one }) => ({
  origin: one(origins, {
    fields: [originBonusTagSkills.originId],
    references: [origins.id],
  }),
}));

// ===== SURVIVOR TRAITS =====
export const survivorTraits = pgTable('survivor_traits', {
  id: survivorTraitIdEnum('id').primaryKey(),
  nameKey: varchar('name_key', { length: 100 }).notNull(),
  benefitKey: varchar('benefit_key', { length: 100 }).notNull(),
  drawbackKey: varchar('drawback_key', { length: 100 }).notNull(),
});

// ===== CHARACTERS =====
export const characters = pgTable('characters', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  type: characterTypeEnum('type').notNull(),
  level: integer('level').notNull().default(1),
  xp: integer('xp').notNull().default(0),
  originId: originIdEnum('origin_id'),
  // Calculated/derived stats (stored for performance)
  maxHp: integer('max_hp').notNull(),
  currentHp: integer('current_hp').notNull(),
  defense: integer('defense').notNull(),
  initiative: integer('initiative').notNull(),
  meleeDamageBonus: integer('melee_damage_bonus').notNull().default(0),
  carryCapacity: integer('carry_capacity').notNull(),
  maxLuckPoints: integer('max_luck_points').notNull(),
  currentLuckPoints: integer('current_luck_points').notNull(),
  // Caps (moved from equipment)
  caps: integer('caps').notNull().default(0),
  // Radiation damage (reduces effective max HP)
  radiationDamage: integer('radiation_damage').notNull().default(0),
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Character SPECIAL attributes
export const characterSpecial = pgTable('character_special', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').references(() => characters.id, { onDelete: 'cascade' }).notNull(),
  attribute: specialAttributeEnum('attribute').notNull(),
  value: integer('value').notNull(),
});

// Character skills
export const characterSkills = pgTable('character_skills', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').references(() => characters.id, { onDelete: 'cascade' }).notNull(),
  skill: skillNameEnum('skill').notNull(),
  rank: integer('rank').notNull().default(0),
});

// Character tag skills
export const characterTagSkills = pgTable('character_tag_skills', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').references(() => characters.id, { onDelete: 'cascade' }).notNull(),
  skill: skillNameEnum('skill').notNull(),
});

// Character survivor traits
export const characterSurvivorTraits = pgTable('character_survivor_traits', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').references(() => characters.id, { onDelete: 'cascade' }).notNull(),
  traitId: survivorTraitIdEnum('trait_id').notNull(),
});

// Character perks
export const characterPerks = pgTable('character_perks', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').references(() => characters.id, { onDelete: 'cascade' }).notNull(),
  perkId: varchar('perk_id', { length: 50 }).notNull(),
  rank: integer('rank').notNull().default(1),
});

// Character gifted bonus attributes (for the Gifted trait)
export const characterGiftedBonuses = pgTable('character_gifted_bonuses', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').references(() => characters.id, { onDelete: 'cascade' }).notNull(),
  attribute: specialAttributeEnum('attribute').notNull(),
});

// Character exercise bonuses (for the Intense Training perk)
export const characterExerciseBonuses = pgTable('character_exercise_bonuses', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').references(() => characters.id, { onDelete: 'cascade' }).notNull(),
  attribute: specialAttributeEnum('attribute').notNull(),
});

// Character conditions
export const characterConditions = pgTable('character_conditions', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').references(() => characters.id, { onDelete: 'cascade' }).notNull(),
  condition: conditionEnum('condition').notNull(),
});

// ===== CHARACTER INVENTORY =====
// Replaces the old character_equipment JSONB table
export const characterInventory = pgTable('character_inventory', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').references(() => characters.id, { onDelete: 'cascade' }).notNull(),
  itemId: integer('item_id').references(() => items.id).notNull(),
  quantity: integer('quantity').notNull().default(1),
  equipped: boolean('equipped').notNull().default(false),
  equippedLocation: bodyLocationEnum('equipped_location'),
  // For Power Armor pieces: tracks current HP (null = use max HP from armor definition)
  currentHp: integer('current_hp'),
});

// ===== RELATIONS =====

export const charactersRelations = relations(characters, ({ one, many }) => ({
  origin: one(origins, {
    fields: [characters.originId],
    references: [origins.id],
  }),
  special: many(characterSpecial),
  skills: many(characterSkills),
  tagSkills: many(characterTagSkills),
  survivorTraits: many(characterSurvivorTraits),
  perks: many(characterPerks),
  giftedBonuses: many(characterGiftedBonuses),
  exerciseBonuses: many(characterExerciseBonuses),
  conditions: many(characterConditions),
  inventory: many(characterInventory),
}));

export const characterSpecialRelations = relations(characterSpecial, ({ one }) => ({
  character: one(characters, {
    fields: [characterSpecial.characterId],
    references: [characters.id],
  }),
}));

export const characterSkillsRelations = relations(characterSkills, ({ one }) => ({
  character: one(characters, {
    fields: [characterSkills.characterId],
    references: [characters.id],
  }),
}));

export const characterTagSkillsRelations = relations(characterTagSkills, ({ one }) => ({
  character: one(characters, {
    fields: [characterTagSkills.characterId],
    references: [characters.id],
  }),
}));

export const characterSurvivorTraitsRelations = relations(characterSurvivorTraits, ({ one }) => ({
  character: one(characters, {
    fields: [characterSurvivorTraits.characterId],
    references: [characters.id],
  }),
}));

export const characterPerksRelations = relations(characterPerks, ({ one }) => ({
  character: one(characters, {
    fields: [characterPerks.characterId],
    references: [characters.id],
  }),
}));

export const characterGiftedBonusesRelations = relations(characterGiftedBonuses, ({ one }) => ({
  character: one(characters, {
    fields: [characterGiftedBonuses.characterId],
    references: [characters.id],
  }),
}));

export const characterExerciseBonusesRelations = relations(characterExerciseBonuses, ({ one }) => ({
  character: one(characters, {
    fields: [characterExerciseBonuses.characterId],
    references: [characters.id],
  }),
}));

export const characterConditionsRelations = relations(characterConditions, ({ one }) => ({
  character: one(characters, {
    fields: [characterConditions.characterId],
    references: [characters.id],
  }),
}));

export const characterInventoryRelations = relations(characterInventory, ({ one }) => ({
  character: one(characters, {
    fields: [characterInventory.characterId],
    references: [characters.id],
  }),
  item: one(items, {
    fields: [characterInventory.itemId],
    references: [items.id],
  }),
}));
