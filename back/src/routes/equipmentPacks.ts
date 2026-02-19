import { Router } from 'express';
import { db } from '../db/index';
import { eq } from 'drizzle-orm';
import {
  items,
  weapons,
  equipmentPacks,
  originEquipmentPacks,
  equipmentPackItems,
  equipmentPackChoiceOptions,
  robotArmAttachments,
  tagSkillBonusItems,
  levelBonusCaps,
} from '../db/schema/index';

const router = Router();

// Helper to get full pack with items
async function getFullPack(packId: string) {
  const [pack] = await db.select().from(equipmentPacks).where(eq(equipmentPacks.id, packId));
  if (!pack) return null;

  const packItems = await db
    .select()
    .from(equipmentPackItems)
    .where(eq(equipmentPackItems.packId, packId))
    .orderBy(equipmentPackItems.sortOrder);

  // Get choice options and item details for each item
  const itemsWithOptions = await Promise.all(
    packItems.map(async (item) => {
      if (item.isChoiceGroup) {
        const options = await db
          .select({
            id: equipmentPackChoiceOptions.id,
            itemId: equipmentPackChoiceOptions.itemId,
            quantity: equipmentPackChoiceOptions.quantity,
            quantityCD: equipmentPackChoiceOptions.quantityCD,
            location: equipmentPackChoiceOptions.location,
            // Item details
            itemName: items.name,
            itemType: items.itemType,
            itemNameKey: items.nameKey,
          })
          .from(equipmentPackChoiceOptions)
          .innerJoin(items, eq(equipmentPackChoiceOptions.itemId, items.id))
          .where(eq(equipmentPackChoiceOptions.parentItemId, item.id));

        return {
          isChoice: true,
          options: options.map((opt) => ({
            itemId: opt.itemId,
            itemName: opt.itemName,
            itemType: opt.itemType,
            itemNameKey: opt.itemNameKey,
            quantity: opt.quantity,
            quantityCD: opt.quantityCD,
            location: opt.location,
          })),
          choiceCount: item.choiceCount,
        };
      }

      // Direct item - get item details
      if (item.itemId) {
        const [itemDetails] = await db
          .select()
          .from(items)
          .where(eq(items.id, item.itemId));

        // If it's a weapon, get the ammo type
        let ammoType: string | undefined;
        if (itemDetails?.itemType === 'weapon') {
          const [weaponDetails] = await db
            .select({ ammo: weapons.ammo })
            .from(weapons)
            .where(eq(weapons.itemId, item.itemId));
          if (weaponDetails?.ammo && weaponDetails.ammo !== 'none') {
            ammoType = weaponDetails.ammo;
          }
        }

        return {
          itemId: item.itemId,
          itemName: itemDetails?.name,
          itemType: itemDetails?.itemType,
          itemNameKey: itemDetails?.nameKey,
          quantity: item.quantity,
          quantityCD: item.quantityCD,
          location: item.location,
          ...(ammoType ? { ammoType } : {}),
        };
      }

      // Shouldn't happen but return empty object
      return {};
    })
  );

  return {
    ...pack,
    items: itemsWithOptions.filter((item) => Object.keys(item).length > 0),
  };
}

// GET all equipment packs
router.get('/', async (_req, res) => {
  try {
    const packs = await db.select().from(equipmentPacks);
    const fullPacks = await Promise.all(packs.map((p) => getFullPack(p.id)));
    res.json(fullPacks.filter(Boolean));
  } catch (error) {
    console.error('Error fetching equipment packs:', error);
    res.status(500).json({ error: 'Failed to fetch equipment packs' });
  }
});

// GET equipment packs for a specific origin
router.get('/origin/:originId', async (req, res) => {
  try {
    const originId = req.params.originId;

    const originPacks = await db
      .select()
      .from(originEquipmentPacks)
      .where(eq(originEquipmentPacks.originId, originId as any))
      .orderBy(originEquipmentPacks.sortOrder);

    const packs = await Promise.all(
      originPacks.map((op) => getFullPack(op.packId))
    );

    res.json(packs.filter(Boolean));
  } catch (error) {
    console.error('Error fetching origin equipment packs:', error);
    res.status(500).json({ error: 'Failed to fetch equipment packs for origin' });
  }
});

// ===== ROBOT ARM ATTACHMENTS =====

router.get('/robot-arms', async (_req, res) => {
  try {
    const attachments = await db.select().from(robotArmAttachments);
    res.json(attachments);
  } catch (error) {
    console.error('Error fetching robot arm attachments:', error);
    res.status(500).json({ error: 'Failed to fetch robot arm attachments' });
  }
});

// ===== TAG SKILL BONUS ITEMS =====

router.get('/tag-skill-bonuses', async (_req, res) => {
  try {
    const bonuses = await db
      .select({
        id: tagSkillBonusItems.id,
        skill: tagSkillBonusItems.skill,
        itemId: tagSkillBonusItems.itemId,
        quantity: tagSkillBonusItems.quantity,
        quantityCD: tagSkillBonusItems.quantityCD,
        choiceGroup: tagSkillBonusItems.choiceGroup,
        // Item details
        itemName: items.name,
        itemType: items.itemType,
        itemNameKey: items.nameKey,
      })
      .from(tagSkillBonusItems)
      .innerJoin(items, eq(tagSkillBonusItems.itemId, items.id));

    // Group by skill, then handle choice groups
    const bySkill: Record<string, typeof bonuses> = {};
    for (const bonus of bonuses) {
      if (!bySkill[bonus.skill]) {
        bySkill[bonus.skill] = [];
      }
      bySkill[bonus.skill].push(bonus);
    }

    const grouped: Record<string, any[]> = {};
    for (const [skill, skillBonuses] of Object.entries(bySkill)) {
      const entries: any[] = [];
      const choiceGroups: Record<number, typeof bonuses> = {};

      for (const bonus of skillBonuses) {
        if (bonus.choiceGroup != null) {
          if (!choiceGroups[bonus.choiceGroup]) {
            choiceGroups[bonus.choiceGroup] = [];
          }
          choiceGroups[bonus.choiceGroup].push(bonus);
        } else {
          // Direct item
          entries.push({
            itemId: bonus.itemId,
            itemName: bonus.itemName,
            itemType: bonus.itemType,
            itemNameKey: bonus.itemNameKey,
            quantity: bonus.quantity,
            quantityCD: bonus.quantityCD,
          });
        }
      }

      // Convert choice groups to isChoice entries
      for (const groupItems of Object.values(choiceGroups)) {
        entries.push({
          isChoice: true,
          options: groupItems.map((item) => ({
            itemId: item.itemId,
            itemName: item.itemName,
            itemType: item.itemType,
            itemNameKey: item.itemNameKey,
            quantity: item.quantity,
            quantityCD: item.quantityCD,
          })),
        });
      }

      grouped[skill] = entries;
    }

    res.json(grouped);
  } catch (error) {
    console.error('Error fetching tag skill bonuses:', error);
    res.status(500).json({ error: 'Failed to fetch tag skill bonuses' });
  }
});

router.get('/tag-skill-bonuses/:skill', async (req, res) => {
  try {
    const skill = req.params.skill;
    const bonuses = await db
      .select({
        itemId: tagSkillBonusItems.itemId,
        quantity: tagSkillBonusItems.quantity,
        quantityCD: tagSkillBonusItems.quantityCD,
        // Item details
        itemName: items.name,
        itemType: items.itemType,
        itemNameKey: items.nameKey,
      })
      .from(tagSkillBonusItems)
      .innerJoin(items, eq(tagSkillBonusItems.itemId, items.id))
      .where(eq(tagSkillBonusItems.skill, skill as any));

    res.json(bonuses);
  } catch (error) {
    console.error('Error fetching tag skill bonus:', error);
    res.status(500).json({ error: 'Failed to fetch tag skill bonus' });
  }
});

// ===== LEVEL BONUS CAPS =====

router.get('/level-bonuses', async (_req, res) => {
  try {
    const bonuses = await db.select().from(levelBonusCaps).orderBy(levelBonusCaps.minLevel);
    res.json(bonuses);
  } catch (error) {
    console.error('Error fetching level bonuses:', error);
    res.status(500).json({ error: 'Failed to fetch level bonuses' });
  }
});

router.get('/level-bonuses/:level', async (req, res) => {
  try {
    const level = Number(req.params.level);

    if (level <= 1) {
      return res.json({ level: 1, baseCaps: 0, bonusCapsCD: 0, maxRarity: 0 });
    }

    if (level >= 21) {
      return res.json({ level, baseCaps: level * 50, bonusCapsCD: 0, maxRarity: 6 });
    }

    const [bonus] = await db
      .select()
      .from(levelBonusCaps)
      .where(eq(levelBonusCaps.minLevel, level));

    if (!bonus) {
      return res.status(404).json({ error: 'Level bonus not found' });
    }

    res.json(bonus);
  } catch (error) {
    console.error('Error fetching level bonus:', error);
    res.status(500).json({ error: 'Failed to fetch level bonus' });
  }
});

// GET single equipment pack — MUST be last (/:id would catch named routes like /tag-skill-bonuses)
router.get('/:id', async (req, res) => {
  try {
    const packId = req.params.id;
    const pack = await getFullPack(packId);

    if (!pack) {
      return res.status(404).json({ error: 'Equipment pack not found' });
    }

    res.json(pack);
  } catch (error) {
    console.error('Error fetching equipment pack:', error);
    res.status(500).json({ error: 'Failed to fetch equipment pack' });
  }
});

export default router;
