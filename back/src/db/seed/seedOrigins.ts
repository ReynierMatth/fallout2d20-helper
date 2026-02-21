import { db } from '../index';
import { eq } from 'drizzle-orm';
import {
  origins,
  originSpecialModifiers,
  originSpecialMaxOverrides,
  originBonusTagSkills,
  survivorTraits,
} from '../schema/index';

import { ORIGINS, SURVIVOR_TRAITS } from './data/characters';
import type { SpecialAttribute, SkillName } from './data/characters';

export async function seedOrigins() {
  console.log('Seeding origins...');

  for (const origin of ORIGINS) {
    await db
      .insert(origins)
      .values({
        id: origin.id,
        nameKey: origin.nameKey,
        descriptionKey: origin.descriptionKey,
        traitNameKey: origin.trait.nameKey,
        traitDescriptionKey: origin.trait.descriptionKey,
        skillMaxOverride: origin.skillMaxOverride,
        isRobot: origin.isRobot ?? false,
      })
      .onConflictDoUpdate({
        target: origins.id,
        set: {
          nameKey: origin.nameKey,
          descriptionKey: origin.descriptionKey,
          traitNameKey: origin.trait.nameKey,
          traitDescriptionKey: origin.trait.descriptionKey,
          skillMaxOverride: origin.skillMaxOverride,
          isRobot: origin.isRobot ?? false,
        },
      });

    await db.delete(originSpecialModifiers).where(eq(originSpecialModifiers.originId, origin.id));
    if (origin.specialModifiers) {
      const modifierEntries = Object.entries(origin.specialModifiers) as [SpecialAttribute, number][];
      for (const [attribute, modifier] of modifierEntries) {
        await db.insert(originSpecialModifiers).values({ originId: origin.id, attribute, modifier });
      }
    }

    await db.delete(originSpecialMaxOverrides).where(eq(originSpecialMaxOverrides.originId, origin.id));
    if (origin.specialMaxOverrides) {
      const maxOverrideEntries = Object.entries(origin.specialMaxOverrides) as [SpecialAttribute, number][];
      for (const [attribute, maxValue] of maxOverrideEntries) {
        await db.insert(originSpecialMaxOverrides).values({ originId: origin.id, attribute, maxValue });
      }
    }

    await db.delete(originBonusTagSkills).where(eq(originBonusTagSkills.originId, origin.id));
    if (origin.bonusTagSkills) {
      for (const skill of origin.bonusTagSkills) {
        await db.insert(originBonusTagSkills).values({ originId: origin.id, skill });
      }
    }
  }

  console.log(`  Upserted ${ORIGINS.length} origins`);
}

export async function seedSurvivorTraits() {
  console.log('Seeding survivor traits...');

  for (const trait of SURVIVOR_TRAITS) {
    await db
      .insert(survivorTraits)
      .values({
        id: trait.id,
        nameKey: trait.nameKey,
        benefitKey: trait.benefitKey,
        drawbackKey: trait.drawbackKey,
      })
      .onConflictDoUpdate({
        target: survivorTraits.id,
        set: {
          nameKey: trait.nameKey,
          benefitKey: trait.benefitKey,
          drawbackKey: trait.drawbackKey,
        },
      });
  }

  console.log(`  Upserted ${SURVIVOR_TRAITS.length} survivor traits`);
}

export async function seedAllOrigins() {
  await seedOrigins();
  await seedSurvivorTraits();
}
