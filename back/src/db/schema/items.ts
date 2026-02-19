import { pgTable, serial, varchar, integer, real, boolean, text, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import {
  itemTypeEnum,
  damageTypeEnum,
  weaponRangeEnum,
  weaponSkillEnum,
  weaponQualityEnum,
  ammoTypeEnum,
  bodyLocationEnum,
  armorTypeEnum,
  powerArmorSetEnum,
  robotLocationEnum,
  foodTypeEnum,
  chemDurationEnum,
  generalGoodTypeEnum
} from './enums';

// ===== CENTRAL ITEMS TABLE =====
// Universal item registry with common properties
export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  itemType: itemTypeEnum('item_type').notNull(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  nameKey: varchar('name_key', { length: 100 }),
  value: integer('value').notNull(),
  rarity: integer('rarity').notNull().default(0),
  weight: real('weight').notNull().default(0),
});

// ===== WEAPONS =====
export const weapons = pgTable('weapons', {
  itemId: integer('item_id').primaryKey().references(() => items.id, { onDelete: 'cascade' }),
  skill: weaponSkillEnum('skill').notNull(),
  damage: integer('damage').notNull(),
  damageType: damageTypeEnum('damage_type').notNull(),
  damageBonus: integer('damage_bonus'),
  fireRate: integer('fire_rate').notNull(),
  range: weaponRangeEnum('range').notNull(),
  ammo: ammoTypeEnum('ammo').notNull(),
  ammoPerShot: integer('ammo_per_shot').default(1),
});

// Weapon qualities
export const weaponQualities = pgTable('weapon_qualities', {
  id: serial('id').primaryKey(),
  itemId: integer('item_id').references(() => items.id, { onDelete: 'cascade' }).notNull(),
  quality: weaponQualityEnum('quality').notNull(),
  value: integer('value'),
});

// ===== ARMOR =====
export const armors = pgTable('armors', {
  itemId: integer('item_id').primaryKey().references(() => items.id, { onDelete: 'cascade' }),
  location: bodyLocationEnum('location').notNull(),
  drPhysical: integer('dr_physical').notNull(),
  drEnergy: integer('dr_energy').notNull(),
  drRadiation: integer('dr_radiation').notNull(),
  drPoison: integer('dr_poison'),
  type: armorTypeEnum('type').notNull(),
  set: varchar('set', { length: 50 }),
  hp: integer('hp'),
});

// ===== POWER ARMOR =====
export const powerArmors = pgTable('power_armors', {
  itemId: integer('item_id').primaryKey().references(() => items.id, { onDelete: 'cascade' }),
  set: powerArmorSetEnum('set').notNull(),
  location: bodyLocationEnum('location').notNull(),
  drPhysical: integer('dr_physical').notNull(),
  drEnergy: integer('dr_energy').notNull(),
  drRadiation: integer('dr_radiation').notNull(),
  hp: integer('hp').notNull(),
});

// ===== ROBOT ARMOR =====
export const robotArmors = pgTable('robot_armors', {
  itemId: integer('item_id').primaryKey().references(() => items.id, { onDelete: 'cascade' }),
  drPhysical: integer('dr_physical').notNull(),
  drEnergy: integer('dr_energy').notNull(),
  isBonus: boolean('is_bonus').notNull().default(false),
  location: robotLocationEnum('location').notNull(),
  carryModifier: real('carry_modifier'),
  perkRequired: varchar('perk_required', { length: 50 }),
  specialEffectKey: varchar('special_effect_key', { length: 100 }),
  specialEffectDescription: text('special_effect_description'),
});

// ===== CLOTHING =====
export const clothing = pgTable('clothing', {
  itemId: integer('item_id').primaryKey().references(() => items.id, { onDelete: 'cascade' }),
  drPhysical: integer('dr_physical').default(0),
  drEnergy: integer('dr_energy').default(0),
  drRadiation: integer('dr_radiation').default(0),
  drPoison: integer('dr_poison'),
  effect: jsonb('effect'), // Structured ItemEffect
});

// Clothing locations
export const clothingLocations = pgTable('clothing_locations', {
  id: serial('id').primaryKey(),
  itemId: integer('item_id').references(() => items.id, { onDelete: 'cascade' }).notNull(),
  location: bodyLocationEnum('location').notNull(),
});

// Clothing effects
export const clothingEffects = pgTable('clothing_effects', {
  id: serial('id').primaryKey(),
  itemId: integer('item_id').references(() => items.id, { onDelete: 'cascade' }).notNull(),
  effectType: varchar('effect_type', { length: 20 }).notNull(), // 'skill' | 'special' | 'dr' | 'other'
  target: varchar('target', { length: 50 }),
  value: varchar('value', { length: 50 }),
  descriptionKey: varchar('description_key', { length: 100 }).notNull(),
});

// ===== AMMUNITION =====
export const ammunition = pgTable('ammunition', {
  itemId: integer('item_id').primaryKey().references(() => items.id, { onDelete: 'cascade' }),
  flatAmount: integer('flat_amount').notNull(),
  randomAmount: integer('random_amount').notNull(),
});

export const syringerAmmo = pgTable('syringer_ammo', {
  itemId: integer('item_id').primaryKey().references(() => items.id, { onDelete: 'cascade' }),
  effectKey: varchar('effect_key', { length: 100 }).notNull(),
  effect: jsonb('effect'), // Structured ItemEffect
});

// ===== CHEMS =====
export const chems = pgTable('chems', {
  itemId: integer('item_id').primaryKey().references(() => items.id, { onDelete: 'cascade' }),
  duration: chemDurationEnum('duration').notNull(),
  addictive: boolean('addictive').notNull(),
  addictionLevel: integer('addiction_level'),
  effectKey: varchar('effect_key', { length: 100 }).notNull(),
  effect: jsonb('effect'), // Structured ItemEffect
});

// ===== FOOD =====
export const food = pgTable('food', {
  itemId: integer('item_id').primaryKey().references(() => items.id, { onDelete: 'cascade' }),
  foodType: foodTypeEnum('food_type').notNull(),
  irradiated: boolean('irradiated').notNull(),
  effectKey: varchar('effect_key', { length: 100 }),
  effect: jsonb('effect'), // Structured ItemEffect (includes hpHealed)
});

// ===== GENERAL GOODS =====
export const generalGoods = pgTable('general_goods', {
  itemId: integer('item_id').primaryKey().references(() => items.id, { onDelete: 'cascade' }),
  goodType: generalGoodTypeEnum('good_type').notNull(),
  effectKey: varchar('effect_key', { length: 100 }),
  effect: jsonb('effect'), // Structured ItemEffect
});

// ===== ODDITIES =====
export const oddities = pgTable('oddities', {
  itemId: integer('item_id').primaryKey().references(() => items.id, { onDelete: 'cascade' }),
  goodType: generalGoodTypeEnum('good_type').notNull(),
  effect: text('effect'),
});

// ===== MAGAZINES =====
export const magazines = pgTable('magazines', {
  itemId: integer('item_id').primaryKey().references(() => items.id, { onDelete: 'cascade' }),
  perkDescriptionKey: varchar('perk_description_key', { length: 200 }).notNull(),
});

export const magazineIssues = pgTable('magazine_issues', {
  id: serial('id').primaryKey(),
  magazineId: integer('magazine_id').references(() => items.id, { onDelete: 'cascade' }).notNull(),
  d20Min: integer('d20_min').notNull(),
  d20Max: integer('d20_max').notNull(),
  issueName: varchar('issue_name', { length: 200 }).notNull(),
  issueNameKey: varchar('issue_name_key', { length: 200 }),
  effectDescriptionKey: varchar('effect_description_key', { length: 200 }).notNull(),
});

// ===== RELATIONS =====

// Items relations to specialized tables
export const itemsRelations = relations(items, ({ one, many }) => ({
  weapon: one(weapons, {
    fields: [items.id],
    references: [weapons.itemId],
  }),
  armor: one(armors, {
    fields: [items.id],
    references: [armors.itemId],
  }),
  powerArmor: one(powerArmors, {
    fields: [items.id],
    references: [powerArmors.itemId],
  }),
  robotArmor: one(robotArmors, {
    fields: [items.id],
    references: [robotArmors.itemId],
  }),
  clothingDetails: one(clothing, {
    fields: [items.id],
    references: [clothing.itemId],
  }),
  ammunitionDetails: one(ammunition, {
    fields: [items.id],
    references: [ammunition.itemId],
  }),
  syringerAmmoDetails: one(syringerAmmo, {
    fields: [items.id],
    references: [syringerAmmo.itemId],
  }),
  chem: one(chems, {
    fields: [items.id],
    references: [chems.itemId],
  }),
  foodDetails: one(food, {
    fields: [items.id],
    references: [food.itemId],
  }),
  generalGood: one(generalGoods, {
    fields: [items.id],
    references: [generalGoods.itemId],
  }),
  oddity: one(oddities, {
    fields: [items.id],
    references: [oddities.itemId],
  }),
  magazine: one(magazines, {
    fields: [items.id],
    references: [magazines.itemId],
  }),
  // Child tables that have multiple rows
  weaponQualities: many(weaponQualities),
  clothingLocations: many(clothingLocations),
  clothingEffects: many(clothingEffects),
}));

// Weapons relations
export const weaponsRelations = relations(weapons, ({ one, many }) => ({
  item: one(items, {
    fields: [weapons.itemId],
    references: [items.id],
  }),
  qualities: many(weaponQualities),
}));

export const weaponQualitiesRelations = relations(weaponQualities, ({ one }) => ({
  item: one(items, {
    fields: [weaponQualities.itemId],
    references: [items.id],
  }),
}));

// Armor relations
export const armorsRelations = relations(armors, ({ one }) => ({
  item: one(items, {
    fields: [armors.itemId],
    references: [items.id],
  }),
}));

// Power armor relations
export const powerArmorsRelations = relations(powerArmors, ({ one }) => ({
  item: one(items, {
    fields: [powerArmors.itemId],
    references: [items.id],
  }),
}));

// Robot armor relations
export const robotArmorsRelations = relations(robotArmors, ({ one }) => ({
  item: one(items, {
    fields: [robotArmors.itemId],
    references: [items.id],
  }),
}));

// Clothing relations
export const clothingRelations = relations(clothing, ({ one, many }) => ({
  item: one(items, {
    fields: [clothing.itemId],
    references: [items.id],
  }),
  locations: many(clothingLocations),
  effects: many(clothingEffects),
}));

export const clothingLocationsRelations = relations(clothingLocations, ({ one }) => ({
  item: one(items, {
    fields: [clothingLocations.itemId],
    references: [items.id],
  }),
}));

export const clothingEffectsRelations = relations(clothingEffects, ({ one }) => ({
  item: one(items, {
    fields: [clothingEffects.itemId],
    references: [items.id],
  }),
}));

// Ammunition relations
export const ammunitionRelations = relations(ammunition, ({ one }) => ({
  item: one(items, {
    fields: [ammunition.itemId],
    references: [items.id],
  }),
}));

export const syringerAmmoRelations = relations(syringerAmmo, ({ one }) => ({
  item: one(items, {
    fields: [syringerAmmo.itemId],
    references: [items.id],
  }),
}));

// Chems relations
export const chemsRelations = relations(chems, ({ one }) => ({
  item: one(items, {
    fields: [chems.itemId],
    references: [items.id],
  }),
}));

// Food relations
export const foodRelations = relations(food, ({ one }) => ({
  item: one(items, {
    fields: [food.itemId],
    references: [items.id],
  }),
}));

// General goods relations
export const generalGoodsRelations = relations(generalGoods, ({ one }) => ({
  item: one(items, {
    fields: [generalGoods.itemId],
    references: [items.id],
  }),
}));

// Oddities relations
export const odditiesRelations = relations(oddities, ({ one }) => ({
  item: one(items, {
    fields: [oddities.itemId],
    references: [items.id],
  }),
}));

// Magazine relations
export const magazinesRelations = relations(magazines, ({ one, many }) => ({
  item: one(items, { fields: [magazines.itemId], references: [items.id] }),
  issues: many(magazineIssues),
}));

export const magazineIssuesRelations = relations(magazineIssues, ({ one }) => ({
  magazine: one(magazines, { fields: [magazineIssues.magazineId], references: [magazines.itemId] }),
}));

// ===== DISEASES =====
// Diseases are NOT items - they are conditions/afflictions
export const diseases = pgTable('diseases', {
  id: serial('id').primaryKey(),
  d20Roll: integer('d20_roll').notNull().unique(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  nameKey: varchar('name_key', { length: 100 }),
  effectKey: varchar('effect_key', { length: 100 }).notNull(),
  duration: integer('duration').notNull(), // Duration in stages
});

// ===== PERSONAL TRINKETS =====
// Table for random personal trinkets (roll d20)
export const personalTrinkets = pgTable('personal_trinkets', {
  id: serial('id').primaryKey(),
  roll: integer('roll').notNull().unique(), // 1-20
  nameKey: varchar('name_key', { length: 100 }).notNull(),
  effect: text('effect'), // Most trinkets just have sentimental value
});
