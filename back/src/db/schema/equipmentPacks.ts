import { pgTable, serial, varchar, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { originIdEnum, locationChoiceEnum, skillNameEnum } from './enums';
import { items } from './items';

// ===== EQUIPMENT PACKS =====
export const equipmentPacks = pgTable('equipment_packs', {
  id: varchar('id', { length: 50 }).primaryKey(),
  nameKey: varchar('name_key', { length: 100 }).notNull(),
  descriptionKey: varchar('description_key', { length: 100 }).notNull(),
});

// Link origins to their available equipment packs
export const originEquipmentPacks = pgTable('origin_equipment_packs', {
  id: serial('id').primaryKey(),
  originId: originIdEnum('origin_id').notNull(),
  packId: varchar('pack_id', { length: 50 }).references(() => equipmentPacks.id).notNull(),
  sortOrder: integer('sort_order').default(0),
});

// Equipment pack items (direct items or choice groups)
export const equipmentPackItems = pgTable('equipment_pack_items', {
  id: serial('id').primaryKey(),
  packId: varchar('pack_id', { length: 50 }).references(() => equipmentPacks.id).notNull(),
  sortOrder: integer('sort_order').default(0),
  // If this is a direct item (not a choice) - now references items table
  itemId: integer('item_id').references(() => items.id),
  quantity: integer('quantity').default(1),
  quantityCD: integer('quantity_cd'), // Combat Dice bonus to roll for quantity
  location: locationChoiceEnum('location'),
  // If this is a choice group (isChoiceGroup is true)
  isChoiceGroup: boolean('is_choice_group').default(false),
  choiceCount: integer('choice_count').default(1), // How many options to pick
});

// Choice options within a choice group
export const equipmentPackChoiceOptions = pgTable('equipment_pack_choice_options', {
  id: serial('id').primaryKey(),
  parentItemId: integer('parent_item_id').references(() => equipmentPackItems.id).notNull(),
  // Now references items table directly
  itemId: integer('item_id').references(() => items.id).notNull(),
  quantity: integer('quantity').default(1),
  quantityCD: integer('quantity_cd'),
  location: locationChoiceEnum('location'),
});

// Robot arm attachments
export const robotArmAttachments = pgTable('robot_arm_attachments', {
  id: varchar('id', { length: 50 }).primaryKey(),
  nameKey: varchar('name_key', { length: 100 }).notNull(),
});

// Tag skill bonus items
export const tagSkillBonusItems = pgTable('tag_skill_bonus_items', {
  id: serial('id').primaryKey(),
  skill: skillNameEnum('skill').notNull(),
  // Now references items table directly
  itemId: integer('item_id').references(() => items.id).notNull(),
  quantity: integer('quantity').default(1),
  quantityCD: integer('quantity_cd'),
  // Items with same skill + same non-null choiceGroup = pick one from that group
  // Items with null choiceGroup = always given directly
  choiceGroup: integer('choice_group'),
});

// Level bonus caps
export const levelBonusCaps = pgTable('level_bonus_caps', {
  id: serial('id').primaryKey(),
  minLevel: integer('min_level').notNull(),
  maxLevel: integer('max_level').notNull(),
  baseCaps: integer('base_caps').notNull(),
  bonusCapsCD: integer('bonus_caps_cd').notNull(),
  maxRarity: integer('max_rarity').notNull(),
});

// Relations
export const equipmentPacksRelations = relations(equipmentPacks, ({ many }) => ({
  items: many(equipmentPackItems),
  originPacks: many(originEquipmentPacks),
}));

export const originEquipmentPacksRelations = relations(originEquipmentPacks, ({ one }) => ({
  pack: one(equipmentPacks, {
    fields: [originEquipmentPacks.packId],
    references: [equipmentPacks.id],
  }),
}));

export const equipmentPackItemsRelations = relations(equipmentPackItems, ({ one, many }) => ({
  pack: one(equipmentPacks, {
    fields: [equipmentPackItems.packId],
    references: [equipmentPacks.id],
  }),
  item: one(items, {
    fields: [equipmentPackItems.itemId],
    references: [items.id],
  }),
  choiceOptions: many(equipmentPackChoiceOptions),
}));

export const equipmentPackChoiceOptionsRelations = relations(equipmentPackChoiceOptions, ({ one }) => ({
  parentItem: one(equipmentPackItems, {
    fields: [equipmentPackChoiceOptions.parentItemId],
    references: [equipmentPackItems.id],
  }),
  item: one(items, {
    fields: [equipmentPackChoiceOptions.itemId],
    references: [items.id],
  }),
}));

export const tagSkillBonusItemsRelations = relations(tagSkillBonusItems, ({ one }) => ({
  item: one(items, {
    fields: [tagSkillBonusItems.itemId],
    references: [items.id],
  }),
}));
