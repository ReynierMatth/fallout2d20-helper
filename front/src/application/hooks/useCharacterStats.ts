import { useMemo } from 'react';
import type { Character, SkillName } from '../../domain/models/character';
import type { SpecialAttribute } from '../../domain/models/shared';
import {
  calculateMaxHp,
  calculateInitiative,
  calculateDefense,
  calculateMeleeDamageBonus,
  calculateMaxLuckPoints,
  calculateCarryCapacity,
} from '../../domain/rules/characterRules';
import { SKILL_ATTRIBUTES } from '../../domain/rules/skillRules';
import {
  getPerkHPBonus,
  getPerkDRBonuses,
  getPerkCarryCapacityBonus,
  hasPerk,
  PERK_EFFECTS,
  SURVIVOR_TRAIT_EFFECTS,
} from '../../domain/rules/effectRules';

export interface CharacterDerivedStats {
  maxHp: number;
  defense: number;
  initiative: number;
  meleeDamageBonus: number;
  maxLuckPoints: number;
  carryCapacity: number;
  drPhysical: number;
  drEnergy: number;
  drRadiation: number;
  breakdown: {
    hp: { base: number; perkBonus: number; total: number };
    dr: {
      physical: { base: number; perkBonus: number; total: number };
      energy: { base: number; perkBonus: number; total: number };
      radiation: { base: number; perkBonus: number; total: number };
    };
    carryCapacity: { base: number; perkBonus: number; total: number };
  };
  activeEffects: { perkId: string; rank: number; description: string }[];
}

export function useCharacterStats(character: Character | null): CharacterDerivedStats | null {
  return useMemo(() => {
    if (!character) return null;

    const { special, perks = [], survivorTraits = [] } = character;

    const hasGifted = survivorTraits.includes('gifted');
    const hasSmallFrame = survivorTraits.includes('smallFrame');
    const hasHeavyHanded = survivorTraits.includes('heavyHanded');

    const baseMaxHp = calculateMaxHp(special.endurance, special.luck, character.level);
    const baseDefense = calculateDefense(special.agility);
    const baseInitiative = calculateInitiative(special.perception, special.agility);
    const baseMeleeDamageBonus = calculateMeleeDamageBonus(special.strength);
    const baseMaxLuckPoints = calculateMaxLuckPoints(special.luck, hasGifted);
    const baseCarryCapacity = calculateCarryCapacity(special.strength, hasSmallFrame);

    const perkHPBonus = getPerkHPBonus(perks);
    const perkDRBonuses = getPerkDRBonuses(perks);
    const perkCarryBonus = getPerkCarryCapacityBonus(perks);

    const traitMeleeBonus = hasHeavyHanded ? 1 : 0;

    const maxHp = baseMaxHp + perkHPBonus;
    const defense = baseDefense;
    const initiative = baseInitiative;
    const meleeDamageBonus = baseMeleeDamageBonus + traitMeleeBonus;
    const maxLuckPoints = baseMaxLuckPoints;
    const carryCapacity = baseCarryCapacity + perkCarryBonus;

    const drPhysical = perkDRBonuses.physical;
    const drEnergy = perkDRBonuses.energy;
    const drRadiation = perkDRBonuses.radiation;

    const activeEffects: CharacterDerivedStats['activeEffects'] = [];
    for (const { perkId, rank } of perks) {
      const effect = PERK_EFFECTS[perkId];
      if (!effect) continue;
      if (effect.perRank) {
        const effects: string[] = [];
        if (effect.perRank.hp) effects.push(`+${effect.perRank.hp * rank} HP`);
        if (effect.perRank.drPhysical) effects.push(`+${effect.perRank.drPhysical * rank} DR Physical`);
        if (effect.perRank.drEnergy) effects.push(`+${effect.perRank.drEnergy * rank} DR Energy`);
        if (effect.perRank.drRadiation) effects.push(`+${effect.perRank.drRadiation * rank} DR Radiation`);
        if (effect.perRank.carryCapacity) effects.push(`+${effect.perRank.carryCapacity * rank} Carry`);
        if (effects.length > 0) activeEffects.push({ perkId, rank, description: effects.join(', ') });
      }
      if (effect.combat) {
        const combatEffects: string[] = [];
        if (effect.combat.meleeDamageBonus) combatEffects.push(`+${effect.combat.meleeDamageBonus} CD melee`);
        if (effect.combat.rangedDamageBonus) combatEffects.push(`+${effect.combat.rangedDamageBonus} CD ranged`);
        if (effect.combat.critDamageBonus) combatEffects.push(`+${effect.combat.critDamageBonus} CD on crit`);
        if (combatEffects.length > 0) activeEffects.push({ perkId, rank, description: combatEffects.join(', ') });
      }
    }

    return {
      maxHp, defense, initiative, meleeDamageBonus, maxLuckPoints, carryCapacity,
      drPhysical, drEnergy, drRadiation,
      breakdown: {
        hp: { base: baseMaxHp, perkBonus: perkHPBonus, total: maxHp },
        dr: {
          physical: { base: 0, perkBonus: perkDRBonuses.physical, total: drPhysical },
          energy: { base: 0, perkBonus: perkDRBonuses.energy, total: drEnergy },
          radiation: { base: 0, perkBonus: perkDRBonuses.radiation, total: drRadiation },
        },
        carryCapacity: { base: baseCarryCapacity, perkBonus: perkCarryBonus, total: carryCapacity },
      },
      activeEffects,
    };
  }, [character]);
}

export function calculateSkillTarget(
  character: Character,
  skill: SkillName,
  attributeOverride?: SpecialAttribute
): { target: number; critRange: number; attribute: SpecialAttribute; skillRank: number } {
  const attribute = attributeOverride ?? SKILL_ATTRIBUTES[skill];
  const attributeValue = character.special[attribute];
  const skillRank = character.skills[skill] ?? 0;

  let critRange = skillRank;
  if (hasPerk(character.perks ?? [], 'finesse')) {
    critRange += 1;
  }

  return {
    target: attributeValue + skillRank,
    critRange: Math.min(critRange, 5),
    attribute,
    skillRank,
  };
}
