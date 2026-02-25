import { db } from '../index';
import { sql, inArray } from 'drizzle-orm';
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

  const perkIds = PERKS.map(p => p.id);

  // Batch upsert all perks in one query
  await db
    .insert(perks)
    .values(PERKS.map(perk => ({
      id: perk.id,
      nameKey: perk.nameKey,
      effectKey: perk.effectKey,
      maxRanks: perk.maxRanks,
      levelRequired: perk.prerequisites.level,
      levelIncreasePerRank: perk.prerequisites.levelIncreasePerRank,
      notForRobots: perk.prerequisites.notForRobots ?? false,
    })))
    .onConflictDoUpdate({
      target: perks.id,
      set: {
        nameKey: sql`excluded.name_key`,
        effectKey: sql`excluded.effect_key`,
        maxRanks: sql`excluded.max_ranks`,
        levelRequired: sql`excluded.level_required`,
        levelIncreasePerRank: sql`excluded.level_increase_per_rank`,
        notForRobots: sql`excluded.not_for_robots`,
      },
    });

  // Batch replace SPECIAL prerequisites
  await db.delete(perkSpecialPrerequisites).where(inArray(perkSpecialPrerequisites.perkId, perkIds));
  const allSpecial = PERKS.flatMap(perk => {
    if (!perk.prerequisites.special) return [];
    return (Object.entries(perk.prerequisites.special) as [SpecialAttribute, number][])
      .map(([attribute, minValue]) => ({ perkId: perk.id, attribute, minValue }));
  });
  if (allSpecial.length > 0) await db.insert(perkSpecialPrerequisites).values(allSpecial);

  // Batch replace skill prerequisites
  await db.delete(perkSkillPrerequisites).where(inArray(perkSkillPrerequisites.perkId, perkIds));
  const allSkills = PERKS.flatMap(perk => {
    if (!perk.prerequisites.skills) return [];
    return (Object.entries(perk.prerequisites.skills) as [SkillName, number][])
      .map(([skill, minRank]) => ({ perkId: perk.id, skill, minRank }));
  });
  if (allSkills.length > 0) await db.insert(perkSkillPrerequisites).values(allSkills);

  // Batch replace required perks
  await db.delete(perkRequiredPerks).where(inArray(perkRequiredPerks.perkId, perkIds));
  const allRequired = PERKS.flatMap(perk =>
    (perk.prerequisites.perks ?? []).map(requiredPerkId => ({ perkId: perk.id, requiredPerkId }))
  );
  if (allRequired.length > 0) await db.insert(perkRequiredPerks).values(allRequired);

  // Batch replace excluded perks
  await db.delete(perkExcludedPerks).where(inArray(perkExcludedPerks.perkId, perkIds));
  const allExcluded = PERKS.flatMap(perk =>
    (perk.prerequisites.excludedPerks ?? []).map(excludedPerkId => ({ perkId: perk.id, excludedPerkId }))
  );
  if (allExcluded.length > 0) await db.insert(perkExcludedPerks).values(allExcluded);

  // Batch replace rank effects
  await db.delete(perkRankEffects).where(inArray(perkRankEffects.perkId, perkIds));
  const allRankEffects = PERKS.flatMap(perk =>
    (perk.rankEffects ?? []).map(re => ({ perkId: perk.id, rank: re.rank, effectKey: re.effect }))
  );
  if (allRankEffects.length > 0) await db.insert(perkRankEffects).values(allRankEffects);

  console.log(`  Upserted ${PERKS.length} perks`);
}

export async function seedAllPerks() {
  await seedPerks();
}
