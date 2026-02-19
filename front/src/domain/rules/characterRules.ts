import type { SpecialAttribute, SkillName } from '../models/character';

export const SPECIAL_ATTRIBUTES: SpecialAttribute[] = [
  'strength', 'perception', 'endurance', 'charisma', 'intelligence', 'agility', 'luck',
];

export const SKILL_NAMES: SkillName[] = [
  'athletics', 'barter', 'bigGuns', 'energyWeapons', 'explosives',
  'lockpick', 'medicine', 'meleeWeapons', 'pilot', 'repair',
  'science', 'smallGuns', 'sneak', 'speech', 'survival', 'throwing', 'unarmed',
];

export const CONDITIONS = [
  'poisoned', 'irradiated', 'stunned', 'prone', 'blinded',
  'deafened', 'fatigued', 'hungry', 'thirsty', 'addicted',
] as const;

export function calculateMaxHp(endurance: number, luck: number, level: number): number {
  const baseHp = endurance + luck;
  const levelBonus = Math.max(0, level - 1);
  return baseHp + levelBonus;
}

export function calculateInitiative(perception: number, agility: number): number {
  return perception + agility;
}

export function calculateDefense(agility: number): number {
  return agility >= 9 ? 2 : 1;
}

export function calculateMeleeDamageBonus(strength: number): number {
  if (strength >= 11) return 3;
  if (strength >= 9) return 2;
  if (strength >= 7) return 1;
  return 0;
}

export function calculateMaxLuckPoints(luck: number, hasGiftedTrait: boolean = false): number {
  return hasGiftedTrait ? Math.max(0, luck - 1) : luck;
}

export function calculateCarryCapacity(strength: number, hasSmallFrame: boolean = false): number {
  const multiplier = hasSmallFrame ? 2.5 : 5;
  return 75 + multiplier * strength;
}

export function calculateSkillPoints(intelligence: number): number {
  return 9 + intelligence;
}

export function createDefaultSkills(): Record<SkillName, number> {
  return {
    athletics: 0, barter: 0, bigGuns: 0, energyWeapons: 0, explosives: 0,
    lockpick: 0, medicine: 0, meleeWeapons: 0, pilot: 0, repair: 0,
    science: 0, smallGuns: 0, sneak: 0, speech: 0, survival: 0, throwing: 0, unarmed: 0,
  };
}

export function createDefaultSpecial(): Record<SpecialAttribute, number> {
  return {
    strength: 5, perception: 5, endurance: 5, charisma: 5,
    intelligence: 5, agility: 5, luck: 5,
  };
}
