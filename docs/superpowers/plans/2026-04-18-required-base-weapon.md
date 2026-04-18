# Required Base Weapon for Weapon Mod Recipes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a disabled craft button with an inventory warning when a weapon-specific mod recipe requires a base weapon the character doesn't own, and fix the 13 recipes whose `resultModName` was missing.

**Architecture:** Add `requiredBaseItemId` (nullable FK → items) to the `recipes` DB table. Seed the value from `requiredBaseItemName` in recipe data. Surface it through the existing `getFullRecipe` API path. In `RecipeDetail.tsx`, compute `hasRequiredBaseItem` from `characterInventory` and render the craft button as disabled with a message when the check fails.

**Tech Stack:** Drizzle ORM (schema + migration), TypeScript, React, i18next

---

## Confirmed Recipe Mappings

Only recipes whose mod appears in `itemModCompatibility.ts` are fixed. The rest remain without a craft button (out of scope).

| Line in recipes.ts | Recipe name | resultModName | requiredBaseItemName |
|--------------------|-------------|---------------|----------------------|
| 220 | Tuyau à pointes | `'À pointes (tuyau)'` | `'Lead Pipe'` |
| 225 | Clé lourde | `'Lourd (clé)'` | `'Pipe Wrench'` |
| 240 | Masse perforante | `'Perforant (masse)'` | `'Sledgehammer'` |
| 241 | Masse lourde | `'Lourd (masse)'` | `'Sledgehammer'` |
| 243 | Module d'étourdissement (super masse) | `"Module d'étourdissement (super masse)"` | `'Super Sledge'` |
| 245 | Démonte-pneu à lames | `'À lames (démonte-pneu)'` | `'Tire Iron'` |
| 247 | Canne barbelée | `'Barbelé (canne)'` | `'Walking Cane'` |
| 248 | Canne à pointes | `'À pointes (canne)'` | `'Walking Cane'` |
| 250 | Poing américain à pointes | `'À pointes (poing)'` | `'Knuckles'` |
| 251 | Poing américain perforant | `'Perforant (poing)'` | `'Knuckles'` |
| 255 | Gant de boxe à pointes | `'À pointes (gant)'` | `'Boxing Glove'` |
| 258 | Poing assisté perforant | `'Perforant (poing assisté)'` | `'Power Fist'` |
| 259 | Poing assisté bobine thermique | `'Bobine thermique (poing assisté)'` | `'Power Fist'` |

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `back/src/db/schema/crafting.ts` | Modify | Add `requiredBaseItemId` nullable FK column |
| `back/drizzle/0025_*.sql` | Generate | Migration adding the new column |
| `back/src/db/seed/data/recipes.ts` | Modify | Add `requiredBaseItemName?` to `RecipeData`; fill 13 recipes |
| `back/src/db/seed/seedRecipes.ts` | Modify | Resolve `requiredBaseItemName` → item ID; include in upsert |
| `back/src/routes/recipes.ts` | Modify | Fetch and return `requiredBaseItem` in `getFullRecipe` |
| `front/src/domain/models/recipe.ts` | Modify | Add `requiredBaseItem` to `RecipeDetail` |
| `front/src/ui/components/craft/RecipeDetail.tsx` | Modify | Compute `hasRequiredBaseItem`; disable button with message |

---

### Task 1: Add `requiredBaseItemId` column to DB schema

**Files:**
- Modify: `back/src/db/schema/crafting.ts`

- [ ] **Step 1: Add the column to the schema**

In `back/src/db/schema/crafting.ts`, update the `recipes` table definition. Add after `resultItemId`:

```ts
requiredBaseItemId: integer('required_base_item_id').references(() => items.id, { onDelete: 'set null' }),
```

Full updated table (lines 9-19):
```ts
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
  requiredBaseItemId: integer('required_base_item_id').references(() => items.id, { onDelete: 'set null' }),
});
```

- [ ] **Step 2: Generate the migration**

Run from `back/`:
```bash
cd back && npm run db:generate
```

Expected: a new file `back/drizzle/0025_*.sql` is created containing:
```sql
ALTER TABLE "recipes" ADD COLUMN "required_base_item_id" integer;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_required_base_item_id_items_id_fk" FOREIGN KEY ("required_base_item_id") REFERENCES "public"."items"("id") ON DELETE set null ON UPDATE no action;
```

- [ ] **Step 3: Apply the migration**

```bash
npm run db:migrate
```

Expected: `✓ Migration applied`

- [ ] **Step 4: Commit**

```bash
git add back/src/db/schema/crafting.ts back/drizzle/
git commit -m "feat: add required_base_item_id column to recipes table"
```

---

### Task 2: Update seed data — `RecipeData` interface and recipe entries

**Files:**
- Modify: `back/src/db/seed/data/recipes.ts`

- [ ] **Step 1: Add `requiredBaseItemName` to `RecipeData` interface**

Update lines 15-26 of `back/src/db/seed/data/recipes.ts`:

```ts
export interface RecipeData {
  name: string;
  nameKey?: string;
  workbenchType: WorkbenchType;
  complexity: number;
  skill: CraftingSkill;
  rarity: RecipeRarity;
  resultModName?: string;  // must match exact name in items table (for mod recipes)
  resultItemName?: string; // must match exact name in items table (for item recipes)
  requiredBaseItemName?: string; // must match exact name in items table (base weapon required in inventory)
  perkRequirements?: RecipePerkReq[];
  ingredients?: RecipeIngredient[]; // only for chemistry/cooking
}
```

- [ ] **Step 2: Fix the 13 recipe entries**

In `back/src/db/seed/data/recipes.ts`, replace these entries in the `MELEE_MODS` array:

**Line 220** — replace:
```ts
{ name: 'Tuyau à pointes', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente' },
```
with:
```ts
{ name: 'Tuyau à pointes', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente', resultModName: 'À pointes (tuyau)', requiredBaseItemName: 'Lead Pipe' },
```

**Line 225** — replace:
```ts
{ name: 'Clé lourde', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 2 }] },
```
with:
```ts
{ name: 'Clé lourde', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 2 }], resultModName: 'Lourd (clé)', requiredBaseItemName: 'Pipe Wrench' },
```

**Line 240** — replace:
```ts
{ name: 'Masse perforante', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 2 }] },
```
with:
```ts
{ name: 'Masse perforante', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 2 }], resultModName: 'Perforant (masse)', requiredBaseItemName: 'Sledgehammer' },
```

**Line 241** — replace:
```ts
{ name: 'Masse lourde', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 2 }] },
```
with:
```ts
{ name: 'Masse lourde', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 2 }], resultModName: 'Lourd (masse)', requiredBaseItemName: 'Sledgehammer' },
```

**Line 243** — replace:
```ts
{ name: 'Module d\'étourdissement (super masse)', workbenchType: 'weapon', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 3 }, { perkId: 'science', minRank: 1 }] },
```
with:
```ts
{ name: 'Module d\'étourdissement (super masse)', workbenchType: 'weapon', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 3 }, { perkId: 'science', minRank: 1 }], resultModName: 'Module d\'étourdissement (super masse)', requiredBaseItemName: 'Super Sledge' },
```

**Line 245** — replace:
```ts
{ name: 'Démonte-pneu à lames', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 1 }] },
```
with:
```ts
{ name: 'Démonte-pneu à lames', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 1 }], resultModName: 'À lames (démonte-pneu)', requiredBaseItemName: 'Tire Iron' },
```

**Line 247** — replace:
```ts
{ name: 'Canne barbelée', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente' },
```
with:
```ts
{ name: 'Canne barbelée', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente', resultModName: 'Barbelé (canne)', requiredBaseItemName: 'Walking Cane' },
```

**Line 248** — replace:
```ts
{ name: 'Canne à pointes', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente' },
```
with:
```ts
{ name: 'Canne à pointes', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente', resultModName: 'À pointes (canne)', requiredBaseItemName: 'Walking Cane' },
```

**Line 250** — replace:
```ts
{ name: 'Poing américain à pointes', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente' },
```
with:
```ts
{ name: 'Poing américain à pointes', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente', resultModName: 'À pointes (poing)', requiredBaseItemName: 'Knuckles' },
```

**Line 251** — replace:
```ts
{ name: 'Poing américain perforant', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 1 }] },
```
with:
```ts
{ name: 'Poing américain perforant', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 1 }], resultModName: 'Perforant (poing)', requiredBaseItemName: 'Knuckles' },
```

**Line 255** — replace:
```ts
{ name: 'Gant de boxe à pointes', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente' },
```
with:
```ts
{ name: 'Gant de boxe à pointes', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente', resultModName: 'À pointes (gant)', requiredBaseItemName: 'Boxing Glove' },
```

**Line 258** — replace:
```ts
{ name: 'Poing assisté perforant', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 2 }] },
```
with:
```ts
{ name: 'Poing assisté perforant', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 2 }], resultModName: 'Perforant (poing assisté)', requiredBaseItemName: 'Power Fist' },
```

**Line 259** — replace:
```ts
{ name: 'Poing assisté bobine thermique', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 3 }] },
```
with:
```ts
{ name: 'Poing assisté bobine thermique', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 3 }], resultModName: 'Bobine thermique (poing assisté)', requiredBaseItemName: 'Power Fist' },
```

- [ ] **Step 3: Commit**

```bash
git add back/src/db/seed/data/recipes.ts
git commit -m "feat: add resultModName and requiredBaseItemName to 13 weapon mod recipes"
```

---

### Task 3: Update `seedRecipes.ts` to resolve and store `requiredBaseItemId`

**Files:**
- Modify: `back/src/db/seed/seedRecipes.ts`

- [ ] **Step 1: Add resolution of `requiredBaseItemName`**

After the `resultItemId` resolution block (after line 41), add:

```ts
// Resolve required base item ID
let requiredBaseItemId: number | null = null;
if (recipe.requiredBaseItemName) {
  const [baseItem] = await db
    .select({ id: items.id })
    .from(items)
    .where(eq(items.name, recipe.requiredBaseItemName));
  if (!baseItem) {
    console.warn(`  ⚠ required base item not found: "${recipe.requiredBaseItemName}" (recipe: ${recipe.name})`);
  } else {
    requiredBaseItemId = baseItem.id;
  }
}
```

- [ ] **Step 2: Include `requiredBaseItemId` in the upsert**

In the `.values({...})` block (around line 46), add `requiredBaseItemId`:

```ts
.values({
  name: recipe.name,
  nameKey: recipe.nameKey,
  workbenchType: recipe.workbenchType as any,
  complexity: recipe.complexity,
  skill: recipe.skill as any,
  rarity: recipe.rarity as any,
  resultModId,
  resultItemId,
  requiredBaseItemId,
})
```

In the `.onConflictDoUpdate({ set: {...} })` block, add:

```ts
requiredBaseItemId: sql`excluded.required_base_item_id`,
```

- [ ] **Step 3: Run the seed to verify**

```bash
cd back && npm run db:seed
```

Expected: no `⚠ required base item not found` warnings for the 13 recipes. Should see `✓ N recipes seeded`.

- [ ] **Step 4: Commit**

```bash
git add back/src/db/seed/seedRecipes.ts
git commit -m "feat: resolve and persist requiredBaseItemId in recipe seed"
```

---

### Task 4: Expose `requiredBaseItem` in the recipe API

**Files:**
- Modify: `back/src/routes/recipes.ts`

- [ ] **Step 1: Fetch `requiredBaseItem` in `getFullRecipe`**

In `back/src/routes/recipes.ts`, update the `getFullRecipe` function. After the `const [recipe]` select (line 37), fetch the base item alongside the existing parallel fetches:

Replace lines 65-70:
```ts
const [resultMod, resultItem] = await Promise.all([
  recipe.resultModId !== null ? fetchResultMod(recipe.resultModId) : null,
  recipe.resultItemId !== null ? fetchResultItem(recipe.resultItemId) : null,
]);

return { ...recipe, perkRequirements: perkReqs, ingredients, resultMod, resultItem };
```

with:
```ts
const [resultMod, resultItem, requiredBaseItem] = await Promise.all([
  recipe.resultModId !== null ? fetchResultMod(recipe.resultModId) : null,
  recipe.resultItemId !== null ? fetchResultItem(recipe.resultItemId) : null,
  recipe.requiredBaseItemId !== null ? fetchResultItem(recipe.requiredBaseItemId) : null,
]);

return { ...recipe, perkRequirements: perkReqs, ingredients, resultMod, resultItem, requiredBaseItem };
```

Note: `fetchResultItem` already returns `{ id, name, nameKey, ... }` which is sufficient.

- [ ] **Step 2: Verify the API response**

Start the backend (`npm run dev`) and test:
```bash
curl http://localhost:3000/api/recipes/<id-of-Tuyau-a-pointes>
```

Expected: response includes `"requiredBaseItem": { "id": <n>, "name": "Lead Pipe", ... }`.

- [ ] **Step 3: Commit**

```bash
git add back/src/routes/recipes.ts
git commit -m "feat: include requiredBaseItem in recipe detail API response"
```

---

### Task 5: Update frontend recipe model

**Files:**
- Modify: `front/src/domain/models/recipe.ts`

- [ ] **Step 1: Add `requiredBaseItem` to `RecipeDetail`**

In `front/src/domain/models/recipe.ts`, update the `RecipeDetail` interface (lines 70-74):

```ts
export interface RecipeDetail extends Recipe {
  ingredients: RecipeIngredient[];
  resultMod: ResultMod | null;
  resultItem: RecipeResultItem | null;
  requiredBaseItem: { id: number; name: string; nameKey: string | null } | null;
}
```

- [ ] **Step 2: Commit**

```bash
git add front/src/domain/models/recipe.ts
git commit -m "feat: add requiredBaseItem to RecipeDetail model"
```

---

### Task 6: Update `RecipeDetail.tsx` — disabled button with inventory warning

**Files:**
- Modify: `front/src/ui/components/craft/RecipeDetail.tsx`

- [ ] **Step 1: Compute `hasRequiredBaseItem`**

In `front/src/ui/components/craft/RecipeDetail.tsx`, inside the `RecipeDetail` function body, after the `detailItem` state (around line 204), add:

```ts
const hasRequiredBaseItem = !recipe.requiredBaseItem ||
  characterInventory.some((inv) => inv.itemId === recipe.requiredBaseItem!.id);
```

- [ ] **Step 2: Update the craft button block**

Replace the craft button block (lines 368-383):

```tsx
{/* Craft button */}
{onCraft && character && !isLocked && missingIngredients.length === 0 && missingGenericMaterials.length === 0 && (recipe.resultMod || recipe.resultItemId) && (
  <button
    type="button"
    onClick={onCraft}
    disabled={isCrafting}
    className="flex items-center gap-2 px-4 py-2 rounded border border-vault-yellow bg-vault-yellow/10 text-vault-yellow text-sm font-semibold hover:bg-vault-yellow/20 transition-colors disabled:opacity-50 w-full justify-center"
  >
    {isCrafting ? (
      <Loader2 size={15} className="animate-spin" />
    ) : (
      <Hammer size={15} />
    )}
    {t('craft.craftButton')}
  </button>
)}
```

with:

```tsx
{/* Craft button */}
{onCraft && character && !isLocked && missingIngredients.length === 0 && missingGenericMaterials.length === 0 && (recipe.resultMod || recipe.resultItemId) && (
  <div className="space-y-1">
    <button
      type="button"
      onClick={onCraft}
      disabled={isCrafting || !hasRequiredBaseItem}
      className="flex items-center gap-2 px-4 py-2 rounded border border-vault-yellow bg-vault-yellow/10 text-vault-yellow text-sm font-semibold hover:bg-vault-yellow/20 transition-colors disabled:opacity-50 w-full justify-center"
    >
      {isCrafting ? (
        <Loader2 size={15} className="animate-spin" />
      ) : (
        <Hammer size={15} />
      )}
      {t('craft.craftButton')}
    </button>
    {!hasRequiredBaseItem && recipe.requiredBaseItem && (
      <p className="text-xs text-red-400 text-center">
        {t('craft.requiresBaseItem', {
          item: recipe.requiredBaseItem.nameKey
            ? t(recipe.requiredBaseItem.nameKey, { defaultValue: recipe.requiredBaseItem.name })
            : recipe.requiredBaseItem.name,
          defaultValue: `Requiert : {{item}} dans l'inventaire`,
        })}
      </p>
    )}
  </div>
)}
```

- [ ] **Step 3: Verify the UI**

Start the dev server. Navigate to the craft page, select a character who does NOT own a "Lead Pipe". Select the "Tuyau à pointes" recipe. Verify:
- Craft button is visible but greyed out
- Message "Requiert : Lead Pipe dans l'inventaire" appears below (or the translated name if `nameKey` is set)

Then add a Lead Pipe to the character's inventory and re-check — the button should become active.

- [ ] **Step 4: Commit**

```bash
git add front/src/ui/components/craft/RecipeDetail.tsx
git commit -m "feat: disable craft button with warning when required base weapon is missing"
```

---

## Self-Review

**Spec coverage:**
- ✅ `requiredBaseItemName` in seed interface
- ✅ 13 recipes fixed (resultModName + requiredBaseItemName)
- ✅ DB schema column + migration
- ✅ Seed resolution
- ✅ API includes `requiredBaseItem`
- ✅ Frontend model updated
- ✅ Button always shown when `resultMod || resultItemId`, disabled with message when base item missing

**Placeholder scan:** None found.

**Type consistency:** `requiredBaseItem` is `{ id, name, nameKey } | null` throughout. `fetchResultItem` already returns this shape. `hasRequiredBaseItem` uses `recipe.requiredBaseItem.id` which matches the model.
