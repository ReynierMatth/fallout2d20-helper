import { db } from '../index';
import { sql, inArray } from 'drizzle-orm';
import {
  origins,
  originSpecialModifiers,
  originSpecialMaxOverrides,
  originBonusTagSkills,
  survivorTraits,
} from '../schema/index';

import { ORIGINS, SURVIVOR_TRAITS } from './data/characters';
import type { SpecialAttribute } from './data/characters';

export async function seedOrigins() {
  console.log('Seeding origins...');

  const originIds = ORIGINS.map(o => o.id);

  // Batch upsert all origins in one query
  await db
    .insert(origins)
    .values(ORIGINS.map(origin => ({
      id: origin.id,
      nameKey: origin.nameKey,
      descriptionKey: origin.descriptionKey,
      traitNameKey: origin.trait.nameKey,
      traitDescriptionKey: origin.trait.descriptionKey,
      skillMaxOverride: origin.skillMaxOverride,
      isRobot: origin.isRobot ?? false,
    })))
    .onConflictDoUpdate({
      target: origins.id,
      set: {
        nameKey: sql`excluded.name_key`,
        descriptionKey: sql`excluded.description_key`,
        traitNameKey: sql`excluded.trait_name_key`,
        traitDescriptionKey: sql`excluded.trait_description_key`,
        skillMaxOverride: sql`excluded.skill_max_override`,
        isRobot: sql`excluded.is_robot`,
      },
    });

  // Batch replace SPECIAL modifiers
  await db.delete(originSpecialModifiers).where(inArray(originSpecialModifiers.originId, originIds));
  const allModifiers = ORIGINS.flatMap(origin => {
    if (!origin.specialModifiers) return [];
    return (Object.entries(origin.specialModifiers) as [SpecialAttribute, number][])
      .map(([attribute, modifier]) => ({ originId: origin.id, attribute, modifier }));
  });
  if (allModifiers.length > 0) await db.insert(originSpecialModifiers).values(allModifiers);

  // Batch replace SPECIAL max overrides
  await db.delete(originSpecialMaxOverrides).where(inArray(originSpecialMaxOverrides.originId, originIds));
  const allMaxOverrides = ORIGINS.flatMap(origin => {
    if (!origin.specialMaxOverrides) return [];
    return (Object.entries(origin.specialMaxOverrides) as [SpecialAttribute, number][])
      .map(([attribute, maxValue]) => ({ originId: origin.id, attribute, maxValue }));
  });
  if (allMaxOverrides.length > 0) await db.insert(originSpecialMaxOverrides).values(allMaxOverrides);

  // Batch replace bonus tag skills
  await db.delete(originBonusTagSkills).where(inArray(originBonusTagSkills.originId, originIds));
  const allBonusTagSkills = ORIGINS.flatMap(origin =>
    (origin.bonusTagSkills ?? []).map(skill => ({ originId: origin.id, skill }))
  );
  if (allBonusTagSkills.length > 0) await db.insert(originBonusTagSkills).values(allBonusTagSkills);

  console.log(`  Upserted ${ORIGINS.length} origins`);
}

export async function seedSurvivorTraits() {
  console.log('Seeding survivor traits...');

  await db
    .insert(survivorTraits)
    .values(SURVIVOR_TRAITS.map(trait => ({
      id: trait.id,
      nameKey: trait.nameKey,
      benefitKey: trait.benefitKey,
      drawbackKey: trait.drawbackKey,
    })))
    .onConflictDoUpdate({
      target: survivorTraits.id,
      set: {
        nameKey: sql`excluded.name_key`,
        benefitKey: sql`excluded.benefit_key`,
        drawbackKey: sql`excluded.drawback_key`,
      },
    });

  console.log(`  Upserted ${SURVIVOR_TRAITS.length} survivor traits`);
}

export async function seedAllOrigins() {
  await seedOrigins();
  await seedSurvivorTraits();
}
