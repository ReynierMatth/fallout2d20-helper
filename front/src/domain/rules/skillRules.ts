import type { SpecialAttribute, SkillName } from '../models/character';

export const SKILL_ATTRIBUTES: Record<SkillName, SpecialAttribute> = {
  energyWeapons: 'perception',
  meleeWeapons: 'strength',
  smallGuns: 'agility',
  bigGuns: 'endurance',
  athletics: 'strength',
  lockpick: 'perception',
  speech: 'charisma',
  sneak: 'agility',
  explosives: 'perception',
  unarmed: 'strength',
  medicine: 'intelligence',
  pilot: 'perception',
  throwing: 'agility',
  repair: 'intelligence',
  science: 'intelligence',
  survival: 'endurance',
  barter: 'charisma',
};

export function getSkillTargetNumber(
  special: Record<SpecialAttribute, number>,
  skills: Record<SkillName, number>,
  skill: SkillName
): number {
  const attribute = SKILL_ATTRIBUTES[skill];
  return special[attribute] + (skills[skill] || 0);
}

export function getSkillAttribute(skill: SkillName): SpecialAttribute {
  return SKILL_ATTRIBUTES[skill];
}
