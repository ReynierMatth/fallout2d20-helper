import { Router } from 'express';
import { db } from '../db/index';
import { eq } from 'drizzle-orm';
import {
  perks,
  perkSpecialPrerequisites,
  perkSkillPrerequisites,
  perkRequiredPerks,
  perkExcludedPerks,
  perkRankEffects,
  origins,
  originSpecialModifiers,
  originSpecialMaxOverrides,
  originBonusTagSkills,
  survivorTraits,
} from '../db/schema/index';

const router = Router();

// Helper to get full perk with relations
async function getFullPerk(perkId: string) {
  const [perk] = await db.select().from(perks).where(eq(perks.id, perkId));
  if (!perk) return null;

  const [specialPrereqs, skillPrereqs, requiredPerks, excludedPerks, rankEffects] = await Promise.all([
    db.select().from(perkSpecialPrerequisites).where(eq(perkSpecialPrerequisites.perkId, perkId)),
    db.select().from(perkSkillPrerequisites).where(eq(perkSkillPrerequisites.perkId, perkId)),
    db.select().from(perkRequiredPerks).where(eq(perkRequiredPerks.perkId, perkId)),
    db.select().from(perkExcludedPerks).where(eq(perkExcludedPerks.perkId, perkId)),
    db.select().from(perkRankEffects).where(eq(perkRankEffects.perkId, perkId)),
  ]);

  return {
    ...perk,
    prerequisites: {
      special: Object.fromEntries(specialPrereqs.map((p) => [p.attribute, p.minValue])),
      skills: Object.fromEntries(skillPrereqs.map((p) => [p.skill, p.minRank])),
      level: perk.levelRequired,
      levelIncreasePerRank: perk.levelIncreasePerRank,
      perks: requiredPerks.map((p) => p.requiredPerkId),
      excludedPerks: excludedPerks.map((p) => p.excludedPerkId),
      notForRobots: perk.notForRobots,
    },
    rankEffects: rankEffects.map((r) => ({ rank: r.rank, effectKey: r.effectKey })),
  };
}

// GET all perks
router.get('/', async (req, res) => {
  try {
    const { level, available } = req.query;

    const allPerks = await db.select().from(perks);

    // If requesting available perks, we need character info
    if (available === 'true') {
      const characterLevel = Number(req.query.characterLevel) || 1;
      const special = req.query.special ? JSON.parse(req.query.special as string) : {};
      const skills = req.query.skills ? JSON.parse(req.query.skills as string) : {};
      const currentPerks = req.query.currentPerks ? JSON.parse(req.query.currentPerks as string) : [];
      const isRobot = req.query.isRobot === 'true';

      const availablePerks = [];

      for (const perk of allPerks) {
        const fullPerk = await getFullPerk(perk.id);
        if (!fullPerk) continue;

        // Check if perk is available
        const currentRank = currentPerks.find((p: any) => p.perkId === perk.id)?.rank ?? 0;
        const nextRank = currentRank + 1;

        if (nextRank > perk.maxRanks) continue;

        // Check robot restriction
        if (fullPerk.prerequisites.notForRobots && isRobot) continue;

        // Check excluded perks
        const currentPerkIds = currentPerks.map((p: any) => p.perkId);
        if (fullPerk.prerequisites.excludedPerks?.some((ep: string) => currentPerkIds.includes(ep))) continue;

        // Check SPECIAL requirements
        let meetsSpecial = true;
        for (const [attr, minValue] of Object.entries(fullPerk.prerequisites.special || {})) {
          if ((special[attr] || 0) < (minValue as number)) {
            meetsSpecial = false;
            break;
          }
        }
        if (!meetsSpecial) continue;

        // Check level requirement
        let requiredLevel = fullPerk.prerequisites.level ?? 1;
        if (nextRank > 1 && fullPerk.prerequisites.levelIncreasePerRank) {
          requiredLevel += (nextRank - 1) * fullPerk.prerequisites.levelIncreasePerRank;
        }
        if (characterLevel < requiredLevel) continue;

        // Check required perks
        if (fullPerk.prerequisites.perks?.some((rp: string) => !currentPerkIds.includes(rp))) continue;

        availablePerks.push({ perk: fullPerk, availableRank: nextRank });
      }

      return res.json(availablePerks);
    }

    // Return all perks with full details
    const fullPerks = await Promise.all(allPerks.map((p) => getFullPerk(p.id)));
    res.json(fullPerks.filter(Boolean));
  } catch (error) {
    console.error('Error fetching perks:', error);
    res.status(500).json({ error: 'Failed to fetch perks' });
  }
});

// GET single perk
router.get('/:id', async (req, res) => {
  try {
    const perkId = req.params.id;
    const perk = await getFullPerk(perkId);

    if (!perk) {
      return res.status(404).json({ error: 'Perk not found' });
    }

    res.json(perk);
  } catch (error) {
    console.error('Error fetching perk:', error);
    res.status(500).json({ error: 'Failed to fetch perk' });
  }
});

// ===== ORIGINS =====

// Helper to get full origin with relations
async function getFullOrigin(originId: string) {
  const [origin] = await db.select().from(origins).where(eq(origins.id, originId as any));
  if (!origin) return null;

  const [specialModifiers, specialMaxOverrides, bonusTagSkills] = await Promise.all([
    db.select().from(originSpecialModifiers).where(eq(originSpecialModifiers.originId, originId as any)),
    db.select().from(originSpecialMaxOverrides).where(eq(originSpecialMaxOverrides.originId, originId as any)),
    db.select().from(originBonusTagSkills).where(eq(originBonusTagSkills.originId, originId as any)),
  ]);

  return {
    ...origin,
    specialModifiers: Object.fromEntries(specialModifiers.map((m) => [m.attribute, m.modifier])),
    specialMaxOverrides: Object.fromEntries(specialMaxOverrides.map((m) => [m.attribute, m.maxValue])),
    bonusTagSkills: bonusTagSkills.map((b) => b.skill),
    trait: {
      nameKey: origin.traitNameKey,
      descriptionKey: origin.traitDescriptionKey,
    },
  };
}

// GET all origins
router.get('/origins', async (_req, res) => {
  try {
    const allOrigins = await db.select().from(origins);
    const fullOrigins = await Promise.all(allOrigins.map((o) => getFullOrigin(o.id)));
    res.json(fullOrigins.filter(Boolean));
  } catch (error) {
    console.error('Error fetching origins:', error);
    res.status(500).json({ error: 'Failed to fetch origins' });
  }
});

// GET single origin
router.get('/origins/:id', async (req, res) => {
  try {
    const originId = req.params.id;
    const origin = await getFullOrigin(originId);

    if (!origin) {
      return res.status(404).json({ error: 'Origin not found' });
    }

    res.json(origin);
  } catch (error) {
    console.error('Error fetching origin:', error);
    res.status(500).json({ error: 'Failed to fetch origin' });
  }
});

// ===== SURVIVOR TRAITS =====

// GET all survivor traits
router.get('/survivor-traits', async (_req, res) => {
  try {
    const traits = await db.select().from(survivorTraits);
    res.json(traits);
  } catch (error) {
    console.error('Error fetching survivor traits:', error);
    res.status(500).json({ error: 'Failed to fetch survivor traits' });
  }
});

// GET single survivor trait
router.get('/survivor-traits/:id', async (req, res) => {
  try {
    const traitId = req.params.id;
    const [trait] = await db.select().from(survivorTraits).where(eq(survivorTraits.id, traitId as any));

    if (!trait) {
      return res.status(404).json({ error: 'Survivor trait not found' });
    }

    res.json(trait);
  } catch (error) {
    console.error('Error fetching survivor trait:', error);
    res.status(500).json({ error: 'Failed to fetch survivor trait' });
  }
});

export default router;
