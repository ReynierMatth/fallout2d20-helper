import { pgTable, serial, varchar, integer, real, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import {
  modSlotEnum,
  modApplicableToEnum,
  modEffectTypeEnum,
  weaponQualityEnum,
  ammoTypeEnum,
} from './enums';
import { items } from './items';
import { characterInventory } from './characters';

// ===== MODS =====

// Mod definition (linked to an item in the items table)
export const mods = pgTable('mods', {
  id: serial('id').primaryKey(),
  // The item entry in the items table (name, weight, cost, rarity)
  itemId: integer('item_id').references(() => items.id, { onDelete: 'cascade' }).notNull().unique(),
  // Which slot this mod occupies on the target item
  slot: modSlotEnum('slot').notNull(),
  // What type of item this mod can be installed on
  applicableTo: modApplicableToEnum('applicable_to').notNull(),
  // i18n key for the text appended to the item name when installed (e.g. "Renfort")
  nameAddKey: varchar('name_add_key', { length: 100 }),
  // Perk required to install this mod (e.g. 'gunNut'), null = no perk needed
  requiredPerk: varchar('required_perk', { length: 50 }),
  // Rank of the required perk (1-4)
  requiredPerkRank: integer('required_perk_rank'),
  // Optional second perk required (e.g. some armor mods need armorer + science)
  requiredPerk2: varchar('required_perk_2', { length: 50 }),
  requiredPerkRank2: integer('required_perk_rank_2'),
  // Weight delta applied to the target item when this mod is installed (can be negative)
  weightChange: real('weight_change').notNull().default(0),
});

// Individual effects of a mod
export const modEffects = pgTable('mod_effects', {
  id: serial('id').primaryKey(),
  modId: integer('mod_id').references(() => mods.id, { onDelete: 'cascade' }).notNull(),
  effectType: modEffectTypeEnum('effect_type').notNull(),
  // Numeric value for damageBonus, fireRateBonus, rangeChange, setDamage, setFireRate
  numericValue: integer('numeric_value'),
  // Quality name for gainQuality / loseQuality
  qualityName: weaponQualityEnum('quality_name'),
  // Quality value (e.g. Piercing X → value = X)
  qualityValue: integer('quality_value'),
  // Ammo type for setAmmo effects
  ammoType: ammoTypeEnum('ammo_type'),
  // Free-text description key for 'special' effects
  descriptionKey: varchar('description_key', { length: 100 }),
});

// Which specific mods a given item (weapon, armor, clothing) can accept
export const itemCompatibleMods = pgTable('item_compatible_mods', {
  id: serial('id').primaryKey(),
  // The target item (weapon, armor piece, clothing)
  targetItemId: integer('target_item_id').references(() => items.id, { onDelete: 'cascade' }).notNull(),
  // The mod item that is compatible
  modItemId: integer('mod_item_id').references(() => items.id, { onDelete: 'cascade' }).notNull(),
}, (t) => [unique().on(t.targetItemId, t.modItemId)]);

// Tracks which mod inventory entries are installed on which item inventory entries
export const inventoryItemMods = pgTable('inventory_item_mods', {
  id: serial('id').primaryKey(),
  // The weapon/armor inventory entry being modded
  targetInventoryId: integer('target_inventory_id')
    .references(() => characterInventory.id, { onDelete: 'cascade' })
    .notNull(),
  // The mod inventory entry (removed from "loose" inventory when installed)
  modInventoryId: integer('mod_inventory_id')
    .references(() => characterInventory.id, { onDelete: 'cascade' })
    .notNull(),
});

// ===== RELATIONS =====

export const modsRelations = relations(mods, ({ one, many }) => ({
  item: one(items, {
    fields: [mods.itemId],
    references: [items.id],
  }),
  effects: many(modEffects),
}));

export const modEffectsRelations = relations(modEffects, ({ one }) => ({
  mod: one(mods, {
    fields: [modEffects.modId],
    references: [mods.id],
  }),
}));

export const itemCompatibleModsRelations = relations(itemCompatibleMods, ({ one }) => ({
  targetItem: one(items, {
    fields: [itemCompatibleMods.targetItemId],
    references: [items.id],
    relationName: 'itemCompatibleMods',
  }),
  mod: one(items, {
    fields: [itemCompatibleMods.modItemId],
    references: [items.id],
    relationName: 'modCompatibleItems',
  }),
}));

export const inventoryItemModsRelations = relations(inventoryItemMods, ({ one }) => ({
  targetInventory: one(characterInventory, {
    fields: [inventoryItemMods.targetInventoryId],
    references: [characterInventory.id],
    relationName: 'installedOn',
  }),
  modInventory: one(characterInventory, {
    fields: [inventoryItemMods.modInventoryId],
    references: [characterInventory.id],
    relationName: 'installedMod',
  }),
}));
