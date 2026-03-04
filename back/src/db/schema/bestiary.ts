import { pgTable, serial, varchar, integer, boolean, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import {
  statBlockTypeEnum,
  creatureCategoryEnum,
  bodyTypeEnum,
  damageTypeEnum,
  weaponRangeEnum,
} from './enums';
import { items } from './items';

// ===== BESTIARY ENTRIES =====
export const bestiaryEntries = pgTable('bestiary_entries', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  nameKey: varchar('name_key', { length: 200 }).notNull(),
  descriptionKey: varchar('description_key', { length: 200 }),
  statBlockType: statBlockTypeEnum('stat_block_type').notNull(),
  category: creatureCategoryEnum('category').notNull(),
  bodyType: bodyTypeEnum('body_type').notNull(),
  level: integer('level').notNull(),
  xpReward: integer('xp_reward').notNull(),
  hp: integer('hp').notNull(),
  defense: integer('defense').notNull(),
  initiative: integer('initiative').notNull(),
  meleeDamageBonus: integer('melee_damage_bonus').notNull().default(0),
  carryCapacity: integer('carry_capacity').notNull().default(0),
  maxLuckPoints: integer('max_luck_points').notNull().default(0),
  wealth: integer('wealth'),
  source: varchar('source', { length: 50 }).notNull().default('core'),
  emoji: varchar('emoji', { length: 10 }),
});

// ===== BESTIARY ATTRIBUTES =====
// For 'normal': strength, perception, endurance, charisma, intelligence, agility, luck
// For 'creature': body, mind
export const bestiaryAttributes = pgTable('bestiary_attributes', {
  id: serial('id').primaryKey(),
  bestiaryEntryId: integer('bestiary_entry_id').references(() => bestiaryEntries.id, { onDelete: 'cascade' }).notNull(),
  attribute: varchar('attribute', { length: 50 }).notNull(),
  value: integer('value').notNull(),
});

// ===== BESTIARY SKILLS =====
// For 'normal': standard 17 skills (smallGuns, energyWeapons, etc.)
// For 'creature': melee, ranged, other
export const bestiarySkills = pgTable('bestiary_skills', {
  id: serial('id').primaryKey(),
  bestiaryEntryId: integer('bestiary_entry_id').references(() => bestiaryEntries.id, { onDelete: 'cascade' }).notNull(),
  skill: varchar('skill', { length: 50 }).notNull(),
  rank: integer('rank').notNull().default(0),
  isTagSkill: boolean('is_tag_skill').notNull().default(false),
});

// ===== BESTIARY DR =====
// For 'creature' with uniform DR: location='all'
// For 'normal': one row per location (head, torso, armLeft, etc.)
export const bestiaryDr = pgTable('bestiary_dr', {
  id: serial('id').primaryKey(),
  bestiaryEntryId: integer('bestiary_entry_id').references(() => bestiaryEntries.id, { onDelete: 'cascade' }).notNull(),
  location: varchar('location', { length: 50 }).notNull(),
  drPhysical: integer('dr_physical').notNull().default(0),
  drEnergy: integer('dr_energy').notNull().default(0),
  drRadiation: integer('dr_radiation').notNull().default(0),
  drPoison: integer('dr_poison').notNull().default(0),
});

// ===== BESTIARY ATTACKS =====
export const bestiaryAttacks = pgTable('bestiary_attacks', {
  id: serial('id').primaryKey(),
  bestiaryEntryId: integer('bestiary_entry_id').references(() => bestiaryEntries.id, { onDelete: 'cascade' }).notNull(),
  nameKey: varchar('name_key', { length: 200 }).notNull(),
  skill: varchar('skill', { length: 50 }).notNull(),
  damage: integer('damage').notNull(),
  damageType: damageTypeEnum('damage_type').notNull(),
  damageBonus: integer('damage_bonus'),
  fireRate: integer('fire_rate'),
  range: weaponRangeEnum('range').notNull(),
  itemId: integer('item_id').references(() => items.id),
  twoHanded: boolean('two_handed').notNull().default(false),
});

// ===== BESTIARY ATTACK QUALITIES =====
export const bestiaryAttackQualities = pgTable('bestiary_attack_qualities', {
  id: serial('id').primaryKey(),
  attackId: integer('attack_id').references(() => bestiaryAttacks.id, { onDelete: 'cascade' }).notNull(),
  quality: varchar('quality', { length: 50 }).notNull(),
  value: integer('value'),
});

// ===== BESTIARY ABILITIES =====
export const bestiaryAbilities = pgTable('bestiary_abilities', {
  id: serial('id').primaryKey(),
  bestiaryEntryId: integer('bestiary_entry_id').references(() => bestiaryEntries.id, { onDelete: 'cascade' }).notNull(),
  nameKey: varchar('name_key', { length: 200 }).notNull(),
  descriptionKey: varchar('description_key', { length: 200 }).notNull(),
});

// ===== BESTIARY INVENTORY =====
export const bestiaryInventory = pgTable('bestiary_inventory', {
  id: serial('id').primaryKey(),
  bestiaryEntryId: integer('bestiary_entry_id').references(() => bestiaryEntries.id, { onDelete: 'cascade' }).notNull(),
  itemId: integer('item_id').references(() => items.id).notNull(),
  quantity: integer('quantity').notNull().default(1),
  equipped: boolean('equipped').notNull().default(false),
});

// ===== BESTIARY INVENTORY MODS =====
// Links a mod (item) to a bestiary inventory weapon entry — pre-installed mods
export const bestiaryInventoryMods = pgTable('bestiary_inventory_mods', {
  id: serial('id').primaryKey(),
  bestiaryInventoryId: integer('bestiary_inventory_id').references(() => bestiaryInventory.id, { onDelete: 'cascade' }).notNull(),
  modItemId: integer('mod_item_id').references(() => items.id).notNull(),
});

// ===== RELATIONS =====

export const bestiaryEntriesRelations = relations(bestiaryEntries, ({ many }) => ({
  attributes: many(bestiaryAttributes),
  skills: many(bestiarySkills),
  dr: many(bestiaryDr),
  attacks: many(bestiaryAttacks),
  abilities: many(bestiaryAbilities),
  inventory: many(bestiaryInventory),
}));

export const bestiaryAttributesRelations = relations(bestiaryAttributes, ({ one }) => ({
  entry: one(bestiaryEntries, {
    fields: [bestiaryAttributes.bestiaryEntryId],
    references: [bestiaryEntries.id],
  }),
}));

export const bestiarySkillsRelations = relations(bestiarySkills, ({ one }) => ({
  entry: one(bestiaryEntries, {
    fields: [bestiarySkills.bestiaryEntryId],
    references: [bestiaryEntries.id],
  }),
}));

export const bestiaryDrRelations = relations(bestiaryDr, ({ one }) => ({
  entry: one(bestiaryEntries, {
    fields: [bestiaryDr.bestiaryEntryId],
    references: [bestiaryEntries.id],
  }),
}));

export const bestiaryAttacksRelations = relations(bestiaryAttacks, ({ one, many }) => ({
  entry: one(bestiaryEntries, {
    fields: [bestiaryAttacks.bestiaryEntryId],
    references: [bestiaryEntries.id],
  }),
  item: one(items, {
    fields: [bestiaryAttacks.itemId],
    references: [items.id],
  }),
  qualities: many(bestiaryAttackQualities),
}));

export const bestiaryAttackQualitiesRelations = relations(bestiaryAttackQualities, ({ one }) => ({
  attack: one(bestiaryAttacks, {
    fields: [bestiaryAttackQualities.attackId],
    references: [bestiaryAttacks.id],
  }),
}));

export const bestiaryAbilitiesRelations = relations(bestiaryAbilities, ({ one }) => ({
  entry: one(bestiaryEntries, {
    fields: [bestiaryAbilities.bestiaryEntryId],
    references: [bestiaryEntries.id],
  }),
}));

export const bestiaryInventoryRelations = relations(bestiaryInventory, ({ one, many }) => ({
  entry: one(bestiaryEntries, {
    fields: [bestiaryInventory.bestiaryEntryId],
    references: [bestiaryEntries.id],
  }),
  item: one(items, {
    fields: [bestiaryInventory.itemId],
    references: [items.id],
  }),
  installedMods: many(bestiaryInventoryMods),
}));

export const bestiaryInventoryModsRelations = relations(bestiaryInventoryMods, ({ one }) => ({
  bestiaryInventory: one(bestiaryInventory, {
    fields: [bestiaryInventoryMods.bestiaryInventoryId],
    references: [bestiaryInventory.id],
  }),
  modItem: one(items, {
    fields: [bestiaryInventoryMods.modItemId],
    references: [items.id],
  }),
}));
