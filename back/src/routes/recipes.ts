import { Router } from 'express';
import { db } from '../db/index';
import { eq, and, inArray } from 'drizzle-orm';
import {
  recipes,
  recipePerkRequirements,
  recipeIngredients,
  characterKnownRecipes,
  perks,
  items,
} from '../db/schema/index';

const router = Router();

async function getFullRecipe(recipeId: number) {
  const [recipe] = await db.select().from(recipes).where(eq(recipes.id, recipeId));
  if (!recipe) return null;

  const [perkReqs, ingredients] = await Promise.all([
    db
      .select({
        id: recipePerkRequirements.id,
        perkId: recipePerkRequirements.perkId,
        minRank: recipePerkRequirements.minRank,
        perkNameKey: perks.nameKey,
      })
      .from(recipePerkRequirements)
      .leftJoin(perks, eq(recipePerkRequirements.perkId, perks.id))
      .where(eq(recipePerkRequirements.recipeId, recipeId)),
    db
      .select({
        id: recipeIngredients.id,
        itemId: recipeIngredients.itemId,
        quantity: recipeIngredients.quantity,
        itemName: items.name,
        itemNameKey: items.nameKey,
      })
      .from(recipeIngredients)
      .leftJoin(items, eq(recipeIngredients.itemId, items.id))
      .where(eq(recipeIngredients.recipeId, recipeId)),
  ]);

  return { ...recipe, perkRequirements: perkReqs, ingredients };
}

// GET /api/recipes — list with perk requirements included (needed for client-side filtering)
// optional ?workbench_type=weapon
router.get('/', async (req, res) => {
  try {
    const { workbench_type } = req.query;

    const allRecipes = workbench_type
      ? await db.select().from(recipes).where(eq(recipes.workbenchType, workbench_type as any))
      : await db.select().from(recipes);

    if (allRecipes.length === 0) {
      return res.json([]);
    }

    const recipeIds = allRecipes.map((r) => r.id);
    const allPerkReqs = await db
      .select()
      .from(recipePerkRequirements)
      .where(inArray(recipePerkRequirements.recipeId, recipeIds));

    const perkReqMap = new Map<number, typeof allPerkReqs>();
    for (const req of allPerkReqs) {
      if (!perkReqMap.has(req.recipeId)) perkReqMap.set(req.recipeId, []);
      perkReqMap.get(req.recipeId)!.push(req);
    }

    const result = allRecipes.map((r) => ({
      ...r,
      perkRequirements: perkReqMap.get(r.id) ?? [],
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// GET /api/recipes/known/:characterId — list known recipe IDs for a character
// IMPORTANT: this route must be BEFORE /:id to avoid "known" being matched as an id
router.get('/known/:characterId', async (req, res) => {
  try {
    const characterId = parseInt(req.params.characterId);
    if (isNaN(characterId)) return res.status(400).json({ error: 'Invalid characterId' });
    const rows = await db
      .select({ recipeId: characterKnownRecipes.recipeId })
      .from(characterKnownRecipes)
      .where(eq(characterKnownRecipes.characterId, characterId));
    res.json(rows.map((r) => r.recipeId));
  } catch (error) {
    console.error('Error fetching known recipes:', error);
    res.status(500).json({ error: 'Failed to fetch known recipes' });
  }
});

// GET /api/recipes/:id — single recipe with perk requirements and ingredients
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
    const recipe = await getFullRecipe(id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

// POST /api/recipes/known/:characterId/:recipeId — mark recipe as known
router.post('/known/:characterId/:recipeId', async (req, res) => {
  try {
    const characterId = parseInt(req.params.characterId);
    const recipeId = parseInt(req.params.recipeId);
    if (isNaN(characterId) || isNaN(recipeId)) return res.status(400).json({ error: 'Invalid ids' });
    await db
      .insert(characterKnownRecipes)
      .values({ characterId, recipeId })
      .onConflictDoNothing();
    res.status(201).json({ characterId, recipeId });
  } catch (error) {
    console.error('Error marking recipe as known:', error);
    res.status(500).json({ error: 'Failed to mark recipe as known' });
  }
});

// DELETE /api/recipes/known/:characterId/:recipeId — forget recipe
router.delete('/known/:characterId/:recipeId', async (req, res) => {
  try {
    const characterId = parseInt(req.params.characterId);
    const recipeId = parseInt(req.params.recipeId);
    if (isNaN(characterId) || isNaN(recipeId)) return res.status(400).json({ error: 'Invalid ids' });
    await db
      .delete(characterKnownRecipes)
      .where(
        and(
          eq(characterKnownRecipes.characterId, characterId),
          eq(characterKnownRecipes.recipeId, recipeId)
        )
      );
    res.status(204).send();
  } catch (error) {
    console.error('Error forgetting recipe:', error);
    res.status(500).json({ error: 'Failed to forget recipe' });
  }
});

export default router;
