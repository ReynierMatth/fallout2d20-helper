import { db } from '../index';
import { sql, eq } from 'drizzle-orm';
import { recipes, recipePerkRequirements, recipeIngredients, items, mods } from '../schema/index';
import { ALL_RECIPES } from './data/recipes';

export async function seedRecipes() {
  console.log('Seeding recipes...');
  let count = 0;

  for (const recipe of ALL_RECIPES) {
    // Resolve result mod ID
    let resultModId: number | null = null;
    if (recipe.resultModName) {
      const [modItem] = await db
        .select({ id: items.id })
        .from(items)
        .where(eq(items.name, recipe.resultModName));
      if (!modItem) {
        console.warn(`  ⚠ result mod item not found: "${recipe.resultModName}" (recipe: ${recipe.name})`);
      } else {
        const [mod] = await db.select({ id: mods.id }).from(mods).where(eq(mods.itemId, modItem.id));
        if (!mod) {
          console.warn(`  ⚠ mod row not found for item: "${recipe.resultModName}" (recipe: ${recipe.name})`);
        }
        resultModId = mod?.id ?? null;
      }
    }

    // Resolve result item ID
    let resultItemId: number | null = null;
    if (recipe.resultItemName) {
      const [item] = await db
        .select({ id: items.id })
        .from(items)
        .where(eq(items.name, recipe.resultItemName));
      if (!item) {
        console.warn(`  ⚠ result item not found: "${recipe.resultItemName}" (recipe: ${recipe.name})`);
      } else {
        resultItemId = item.id;
      }
    }

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

    // Upsert recipe
    const [inserted] = await db
      .insert(recipes)
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
      .onConflictDoUpdate({
        target: recipes.name,
        set: {
          workbenchType: sql`excluded.workbench_type`,
          complexity: sql`excluded.complexity`,
          skill: sql`excluded.skill`,
          rarity: sql`excluded.rarity`,
          resultModId: sql`excluded.result_mod_id`,
          resultItemId: sql`excluded.result_item_id`,
          requiredBaseItemId: sql`excluded.required_base_item_id`,
        },
      })
      .returning({ id: recipes.id });

    const recipeId = inserted.id;

    // Replace perk requirements
    await db.delete(recipePerkRequirements).where(eq(recipePerkRequirements.recipeId, recipeId));
    if (recipe.perkRequirements?.length) {
      await db.insert(recipePerkRequirements).values(
        recipe.perkRequirements.map((p) => ({
          recipeId,
          perkId: p.perkId,
          minRank: p.minRank,
        }))
      );
    }

    // Replace ingredients
    await db.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, recipeId));
    if (recipe.ingredients?.length) {
      for (const ing of recipe.ingredients) {
        const [item] = await db
          .select({ id: items.id })
          .from(items)
          .where(eq(items.name, ing.itemName));
        if (!item) {
          console.warn(`  ⚠ ingredient not found: "${ing.itemName}" (recipe: ${recipe.name})`);
          continue;
        }
        await db.insert(recipeIngredients).values({ recipeId, itemId: item.id, quantity: ing.quantity });
      }
    }

    count++;
  }

  console.log(`  ✓ ${count} recipes seeded`);
}
