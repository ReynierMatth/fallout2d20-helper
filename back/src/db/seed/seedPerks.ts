import { db } from '../index';
import { eq } from 'drizzle-orm';
import {
  perks,
  perkSpecialPrerequisites,
  perkSkillPrerequisites,
  perkRequiredPerks,
  perkExcludedPerks,
  perkRankEffects,
} from '../schema/index';

import { PERKS } from './data/perks';
import type { SpecialAttribute, SkillName } from './data/characters';

export async function seedPerks() {
  console.log('Seeding perks...');

  for (const perk of PERKS) {
    await db
      .insert(perks)
      .values({
        id: perk.id,
        nameKey: perk.nameKey,
        effectKey: perk.effectKey,
        maxRanks: perk.maxRanks,
        levelRequired: perk.prerequisites.level,
        levelIncreasePerRank: perk.prerequisites.levelIncreasePerRank,
        notForRobots: perk.prerequisites.notForRobots ?? false,
      })
      .onConflictDoUpdate({
        target: perks.id,
        set: {
          nameKey: perk.nameKey,
          effectKey: perk.effectKey,
          maxRanks: perk.maxRanks,
          levelRequired: perk.prerequisites.level,
          levelIncreasePerRank: perk.prerequisites.levelIncreasePerRank,
          notForRobots: perk.prerequisites.notForRobots ?? false,
        },
      });

    // Delete and re-insert child rows
    await db.delete(perkSpecialPrerequisites).where(eq(perkSpecialPrerequisites.perkId, perk.id));
    if (perk.prerequisites.special) {
      const specialEntries = Object.entries(perk.prerequisites.special) as [SpecialAttribute, number][];
      for (const [attribute, minValue] of specialEntries) {
        await db.insert(perkSpecialPrerequisites).values({ perkId: perk.id, attribute, minValue });
      }
    }

    await db.delete(perkSkillPrerequisites).where(eq(perkSkillPrerequisites.perkId, perk.id));
    if (perk.prerequisites.skills) {
      const skillEntries = Object.entries(perk.prerequisites.skills) as [SkillName, number][];
      for (const [skill, minRank] of skillEntries) {
        await db.insert(perkSkillPrerequisites).values({ perkId: perk.id, skill, minRank });
      }
    }

    await db.delete(perkRequiredPerks).where(eq(perkRequiredPerks.perkId, perk.id));
    if (perk.prerequisites.perks) {
      for (const requiredPerkId of perk.prerequisites.perks) {
        await db.insert(perkRequiredPerks).values({ perkId: perk.id, requiredPerkId });
      }
    }

    await db.delete(perkExcludedPerks).where(eq(perkExcludedPerks.perkId, perk.id));
    if (perk.prerequisites.excludedPerks) {
      for (const excludedPerkId of perk.prerequisites.excludedPerks) {
        await db.insert(perkExcludedPerks).values({ perkId: perk.id, excludedPerkId });
      }
    }

    await db.delete(perkRankEffects).where(eq(perkRankEffects.perkId, perk.id));
    if (perk.rankEffects) {
      for (const rankEffect of perk.rankEffects) {
        await db.insert(perkRankEffects).values({ perkId: perk.id, rank: rankEffect.rank, effectKey: rankEffect.effect });
      }
    }
  }

  console.log(`  Upserted ${PERKS.length} perks`);
}

export async function seedAllPerks() {
  await seedPerks();
}
