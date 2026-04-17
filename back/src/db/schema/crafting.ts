import { pgTable, serial, varchar, integer, primaryKey, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { workbenchTypeEnum, craftingSkillEnum, recipeRarityEnum } from './enums';
import { items } from './items';
import { mods } from './mods';
import { perks } from './perks';
import { characters } from './characters';

export const recipes = pgTable('recipes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  nameKey: varchar('name_key', { length: 255 }),
  workbenchType: workbenchTypeEnum('workbench_type').notNull(),
  complexity: integer('complexity').notNull(),
  skill: craftingSkillEnum('skill').notNull(),
  rarity: recipeRarityEnum('rarity').notNull().default('frequente'),
  resultModId: integer('result_mod_id').references(() => mods.id, { onDelete: 'set null' }),
  resultItemId: integer('result_item_id').references(() => items.id, { onDelete: 'set null' }),
});

export const recipePerkRequirements = pgTable('recipe_perk_requirements', {
  id: serial('id').primaryKey(),
  recipeId: integer('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }).notNull(),
  perkId: varchar('perk_id', { length: 100 }).references(() => perks.id, { onDelete: 'cascade' }).notNull(),
  minRank: integer('min_rank').notNull().default(1),
}, (t) => [unique().on(t.recipeId, t.perkId)]);

export const recipeIngredients = pgTable('recipe_ingredients', {
  id: serial('id').primaryKey(),
  recipeId: integer('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }).notNull(),
  itemId: integer('item_id').references(() => items.id, { onDelete: 'cascade' }).notNull(),
  quantity: integer('quantity').notNull().default(1),
}, (t) => [unique().on(t.recipeId, t.itemId)]);

export const characterKnownRecipes = pgTable('character_known_recipes', {
  characterId: integer('character_id').references(() => characters.id, { onDelete: 'cascade' }).notNull(),
  recipeId: integer('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }).notNull(),
}, (t) => [primaryKey({ columns: [t.characterId, t.recipeId] })]);

// ===== RELATIONS =====

export const recipesRelations = relations(recipes, ({ many }) => ({
  perkRequirements: many(recipePerkRequirements),
  ingredients: many(recipeIngredients),
  knownByCharacters: many(characterKnownRecipes),
}));

export const recipePerkRequirementsRelations = relations(recipePerkRequirements, ({ one }) => ({
  recipe: one(recipes, { fields: [recipePerkRequirements.recipeId], references: [recipes.id] }),
  perk: one(perks, { fields: [recipePerkRequirements.perkId], references: [perks.id] }),
}));

export const recipeIngredientsRelations = relations(recipeIngredients, ({ one }) => ({
  recipe: one(recipes, { fields: [recipeIngredients.recipeId], references: [recipes.id] }),
  item: one(items, { fields: [recipeIngredients.itemId], references: [items.id] }),
}));

export const characterKnownRecipesRelations = relations(characterKnownRecipes, ({ one }) => ({
  character: one(characters, { fields: [characterKnownRecipes.characterId], references: [characters.id] }),
  recipe: one(recipes, { fields: [characterKnownRecipes.recipeId], references: [recipes.id] }),
}));
