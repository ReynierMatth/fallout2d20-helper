import { Router } from 'express';
import { generateLoot } from '../generators/lootGenerator';
import { generateMerchant } from '../generators/merchantGenerator';
import {
  scavengingTables,
  areaTypes,
  areaSizes,
  lootCategories,
  DISCOVERY_DEGREES,
  merchantCategories,
  MERCHANT_CAPS_BY_WEALTH,
} from '../data/scavengingTables';
import type { AreaType, AreaSize, LootCategory, MerchantCategory } from '../data/scavengingTables';

const router = Router();

// POST /api/generate/loot
router.post('/loot', async (req, res) => {
  try {
    const { areaType, areaSize, locationLevel, apSpend } = req.body;

    if (!areaType || !areaTypes.includes(areaType)) {
      return res.status(400).json({ error: `Invalid areaType. Must be one of: ${areaTypes.join(', ')}` });
    }
    if (!areaSize || !areaSizes.includes(areaSize)) {
      return res.status(400).json({ error: `Invalid areaSize. Must be one of: ${areaSizes.join(', ')}` });
    }
    if (locationLevel == null || locationLevel < 1 || locationLevel > 20) {
      return res.status(400).json({ error: 'locationLevel must be between 1 and 20' });
    }

    const result = await generateLoot({
      areaType: areaType as AreaType,
      areaSize: areaSize as AreaSize,
      locationLevel: Number(locationLevel),
      apSpend: apSpend || {},
    });

    res.json(result);
  } catch (error) {
    console.error('Error generating loot:', error);
    res.status(500).json({ error: 'Failed to generate loot' });
  }
});

// POST /api/generate/merchant
router.post('/merchant', async (req, res) => {
  try {
    const { wealthRating, isTraveling, categories } = req.body;

    if (wealthRating == null || wealthRating < 1 || wealthRating > 5) {
      return res.status(400).json({ error: 'wealthRating must be between 1 and 5' });
    }

    // Validate categories if provided
    const cats: MerchantCategory[] = categories || [];
    for (const cat of cats) {
      if (!merchantCategories.includes(cat)) {
        return res.status(400).json({ error: `Invalid category: ${cat}. Must be one of: ${merchantCategories.join(', ')}` });
      }
    }

    const result = await generateMerchant({
      wealthRating: Number(wealthRating),
      isTraveling: Boolean(isTraveling),
      categories: cats,
    });

    res.json(result);
  } catch (error) {
    console.error('Error generating merchant:', error);
    res.status(500).json({ error: 'Failed to generate merchant' });
  }
});

// GET /api/generate/scavenging-tables
router.get('/scavenging-tables', (_req, res) => {
  res.json({
    tables: scavengingTables,
    areaTypes,
    areaSizes,
    lootCategories,
    discoveryDegrees: DISCOVERY_DEGREES,
    merchantCategories,
    merchantCapsByWealth: MERCHANT_CAPS_BY_WEALTH,
  });
});

export default router;
