# Required Base Weapon for Weapon Mod Recipes

**Date:** 2026-04-18  
**Branch:** craft  
**Scope:** Option 1 — only recipes whose mod already exists in seed data

## Problem

Some weapon mod recipes (e.g. "Matraque à pointes") have no `resultModName` and no craft button. These are weapon-specific mods: the character must own the base weapon. Two issues:
1. `resultModName` missing → craft button never renders
2. No "required base weapon" concept in the system

## Design

### Seed Data (`recipes.ts`)

Add `requiredBaseItemName?: string` to `RecipeData` interface.

For each affected recipe (where the mod exists in mods.ts), populate both:
- `resultModName` — exact mod item name from mods.ts
- `requiredBaseItemName` — exact base weapon item name from items seed data

Only fix recipes where the corresponding mod already exists in `mods.ts`. Leave others unchanged (no button remains — acceptable for now).

### DB Schema (`crafting.ts`)

Add nullable column to `recipes` table:
```ts
requiredBaseItemId: integer('required_base_item_id').references(() => items.id, { onDelete: 'set null' })
```

Generate and apply Drizzle migration.

### Seeding (`seedRecipes.ts`)

Resolve `requiredBaseItemName` → item ID at seed time. Insert into `requiredBaseItemId`.

### API (`routes/recipes.ts`)

Include in recipe detail response:
```ts
requiredBaseItem: { id: number; name: string } | null
```

### Frontend Model (`recipe.ts`)

```ts
requiredBaseItem: { id: number; name: string } | null
```

### UI (`RecipeDetail.tsx`)

The craft button is always rendered when `resultMod || resultItemId` is truthy. Add a `hasRequiredBaseItem` check:
- `true` or no requirement → button enabled (existing behavior)
- `false` → button disabled + message: `"Requiert : <nom arme> dans l'inventaire"`

`hasRequiredBaseItem` = character inventory contains at least one item matching `requiredBaseItem.id`.

## Out of Scope

- Creating missing mods in mods.ts (deferred to a future task)
- Approach B (consuming the base weapon during craft)
