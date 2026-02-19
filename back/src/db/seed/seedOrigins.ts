import { db } from '../index';
import {
  origins,
  originSpecialModifiers,
  originSpecialMaxOverrides,
  originBonusTagSkills,
  survivorTraits,
} from '../schema/index';

// Import data from local seed data
import { ORIGINS, SURVIVOR_TRAITS } from './data/characters';
import type { SpecialAttribute, SkillName } from './data/characters';

export async function seedOrigins() {
  console.log('Seeding origins...');

  for (const origin of ORIGINS) {
    // Insert origin
    await db.insert(origins).values({
      id: origin.id,
      nameKey: origin.nameKey,
      descriptionKey: origin.descriptionKey,
      traitNameKey: origin.trait.nameKey,
      traitDescriptionKey: origin.trait.descriptionKey,
      skillMaxOverride: origin.skillMaxOverride,
      isRobot: origin.isRobot ?? false,
    });

    // Insert SPECIAL modifiers
    if (origin.specialModifiers) {
      const modifierEntries = Object.entries(origin.specialModifiers) as [SpecialAttribute, number][];
      for (const [attribute, modifier] of modifierEntries) {
        await db.insert(originSpecialModifiers).values({
          originId: origin.id,
          attribute,
          modifier,
        });
      }
    }

    // Insert SPECIAL max overrides
    if (origin.specialMaxOverrides) {
      const maxOverrideEntries = Object.entries(origin.specialMaxOverrides) as [SpecialAttribute, number][];
      for (const [attribute, maxValue] of maxOverrideEntries) {
        await db.insert(originSpecialMaxOverrides).values({
          originId: origin.id,
          attribute,
          maxValue,
        });
      }
    }

    // Insert bonus tag skills
    if (origin.bonusTagSkills) {
      for (const skill of origin.bonusTagSkills) {
        await db.insert(originBonusTagSkills).values({
          originId: origin.id,
          skill,
        });
      }
    }
  }

  console.log(`  Inserted ${ORIGINS.length} origins`);
}

export async function seedSurvivorTraits() {
  console.log('Seeding survivor traits...');

  for (const trait of SURVIVOR_TRAITS) {
    await db.insert(survivorTraits).values({
      id: trait.id,
      nameKey: trait.nameKey,
      benefitKey: trait.benefitKey,
      drawbackKey: trait.drawbackKey,
    });
  }

  console.log(`  Inserted ${SURVIVOR_TRAITS.length} survivor traits`);
}

export async function seedAllOrigins() {
  await seedOrigins();
  await seedSurvivorTraits();
}
