import type { SkillName, OriginId, SurvivorTraitId } from '../models/character';
import type { Origin, SurvivorTrait } from '../models/origin';

export const ORIGINS: Origin[] = [
  {
    id: 'brotherhood',
    nameKey: 'origins.brotherhood.name',
    descriptionKey: 'origins.brotherhood.description',
    trait: { nameKey: 'origins.brotherhood.trait.name', descriptionKey: 'origins.brotherhood.trait.description' },
    specialModifiers: {},
    specialMaxOverrides: {},
    bonusTagSkills: [],
    isRobot: false,
  },
  {
    id: 'ghoul',
    nameKey: 'origins.ghoul.name',
    descriptionKey: 'origins.ghoul.description',
    trait: { nameKey: 'origins.ghoul.trait.name', descriptionKey: 'origins.ghoul.trait.description' },
    specialModifiers: {},
    specialMaxOverrides: {},
    bonusTagSkills: ['survival'],
    isRobot: false,
  },
  {
    id: 'superMutant',
    nameKey: 'origins.superMutant.name',
    descriptionKey: 'origins.superMutant.description',
    trait: { nameKey: 'origins.superMutant.trait.name', descriptionKey: 'origins.superMutant.trait.description' },
    specialModifiers: { strength: 2, endurance: 2 },
    specialMaxOverrides: { strength: 12, endurance: 12, intelligence: 6, charisma: 6 },
    bonusTagSkills: [],
    skillMaxOverride: 4,
    isRobot: false,
  },
  {
    id: 'misterHandy',
    nameKey: 'origins.misterHandy.name',
    descriptionKey: 'origins.misterHandy.description',
    trait: { nameKey: 'origins.misterHandy.trait.name', descriptionKey: 'origins.misterHandy.trait.description' },
    specialModifiers: {},
    specialMaxOverrides: {},
    bonusTagSkills: [],
    isRobot: true,
  },
  {
    id: 'survivor',
    nameKey: 'origins.survivor.name',
    descriptionKey: 'origins.survivor.description',
    trait: { nameKey: 'origins.survivor.trait.name', descriptionKey: 'origins.survivor.trait.description' },
    specialModifiers: {},
    specialMaxOverrides: {},
    bonusTagSkills: [],
    isRobot: false,
  },
  {
    id: 'vaultDweller',
    nameKey: 'origins.vaultDweller.name',
    descriptionKey: 'origins.vaultDweller.description',
    trait: { nameKey: 'origins.vaultDweller.trait.name', descriptionKey: 'origins.vaultDweller.trait.description' },
    specialModifiers: {},
    specialMaxOverrides: {},
    bonusTagSkills: [],
    isRobot: false,
  },
];

export const SURVIVOR_TRAITS: SurvivorTrait[] = [
  { id: 'gifted', nameKey: 'survivorTraits.gifted.name', benefitKey: 'survivorTraits.gifted.benefit', drawbackKey: 'survivorTraits.gifted.drawback' },
  { id: 'educated', nameKey: 'survivorTraits.educated.name', benefitKey: 'survivorTraits.educated.benefit', drawbackKey: 'survivorTraits.educated.drawback' },
  { id: 'smallFrame', nameKey: 'survivorTraits.smallFrame.name', benefitKey: 'survivorTraits.smallFrame.benefit', drawbackKey: 'survivorTraits.smallFrame.drawback' },
  { id: 'heavyHanded', nameKey: 'survivorTraits.heavyHanded.name', benefitKey: 'survivorTraits.heavyHanded.benefit', drawbackKey: 'survivorTraits.heavyHanded.drawback' },
  { id: 'fastShot', nameKey: 'survivorTraits.fastShot.name', benefitKey: 'survivorTraits.fastShot.benefit', drawbackKey: 'survivorTraits.fastShot.drawback' },
];

export function getOriginById(id: OriginId): Origin | undefined {
  return ORIGINS.find((o) => o.id === id);
}

export function getSurvivorTraitById(id: SurvivorTraitId): SurvivorTrait | undefined {
  return SURVIVOR_TRAITS.find((t) => t.id === id);
}
