import { Router } from 'express';
import { db } from '../db/index';
import { eq } from 'drizzle-orm';
import { diseases } from '../db/schema/index';

const router = Router();

// GET /api/diseases - List all diseases
router.get('/', async (_req, res) => {
  try {
    const results = await db
      .select()
      .from(diseases)
      .orderBy(diseases.d20Roll);

    res.json(results);
  } catch (error) {
    console.error('Error fetching diseases:', error);
    res.status(500).json({ error: 'Failed to fetch diseases' });
  }
});

// GET /api/diseases/:id - Get disease by ID
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [result] = await db
      .select()
      .from(diseases)
      .where(eq(diseases.id, id));

    if (!result) {
      return res.status(404).json({ error: 'Disease not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching disease:', error);
    res.status(500).json({ error: 'Failed to fetch disease' });
  }
});

export default router;
