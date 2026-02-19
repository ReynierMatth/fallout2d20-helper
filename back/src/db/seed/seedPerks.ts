import { db } from '../index';
import {
  perks,
  perkSpecialPrerequisites,
  perkSkillPrerequisites,
  perkRequiredPerks,
  perkExcludedPerks,
  perkRankEffects,
} from '../schema/index';

// Import data from local seed data
import { PERKS } from './data/perks';
import type { SpecialAttribute, SkillName } from './data/characters';

export async function seedPerks() {
  console.log('Seeding perks...');

  for (const perk of PERKS) {
    // Insert perk
    await db.insert(perks).values({
      id: perk.id,
      nameKey: perk.nameKey,
      effectKey: perk.effectKey,
      maxRanks: perk.maxRanks,
      levelRequired: perk.prerequisites.level,
      levelIncreasePerRank: perk.prerequisites.levelIncreasePerRank,
      notForRobots: perk.prerequisites.notForRobots ?? false,
    });

    // Insert SPECIAL prerequisites
    if (perk.prerequisites.special) {
      const specialEntries = Object.entries(perk.prerequisites.special) as [SpecialAttribute, number][];
      for (const [attribute, minValue] of specialEntries) {
        await db.insert(perkSpecialPrerequisites).values({
          perkId: perk.id,
          attribute,
          minValue,
        });
      }
    }

    // Insert skill prerequisites
    if (perk.prerequisites.skills) {
      const skillEntries = Object.entries(perk.prerequisites.skills) as [SkillName, number][];
      for (const [skill, minRank] of skillEntries) {
        await db.insert(perkSkillPrerequisites).values({
          perkId: perk.id,
          skill,
          minRank,
        });
      }
    }

    // Insert required perks
    if (perk.prerequisites.perks) {
      for (const requiredPerkId of perk.prerequisites.perks) {
        await db.insert(perkRequiredPerks).values({
          perkId: perk.id,
          requiredPerkId,
        });
      }
    }

    // Insert excluded perks
    if (perk.prerequisites.excludedPerks) {
      for (const excludedPerkId of perk.prerequisites.excludedPerks) {
        await db.insert(perkExcludedPerks).values({
          perkId: perk.id,
          excludedPerkId,
        });
      }
    }

    // Insert rank effects
    if (perk.rankEffects) {
      for (const rankEffect of perk.rankEffects) {
        await db.insert(perkRankEffects).values({
          perkId: perk.id,
          rank: rankEffect.rank,
          effectKey: rankEffect.effect,
        });
      }
    }
  }

  console.log(`  Inserted ${PERKS.length} perks`);
}

export async function seedAllPerks() {
  await seedPerks();
}
