/**
 * Hook to calculate final character stats with all effects applied
 *
 * This hook takes a character and returns all derived stats
 * with perk bonuses, trait effects, and other modifiers applied.
 */

import { useMemo } from 'react';
import type { Character, SpecialAttribute } from '../data/characters';
import {
  calculateMaxHp,
  calculateInitiative,
  calculateDefense,
  calculateMeleeDamageBonus,
  calculateMaxLuckPoints,
  calculateCarryCapacity,
} from '../data/characters';
import {
  getPerkHPBonus,
  getPerkDRBonuses,
  getPerkCarryCapacityBonus,
  hasPerk,
  PERK_EFFECTS,
  SURVIVOR_TRAIT_EFFECTS,
} from '../data/effects';

export interface CharacterDerivedStats {
  // Core stats (with perk bonuses)
  maxHp: number;
  defense: number;
  initiative: number;
  meleeDamageBonus: number;
  maxLuckPoints: number;
  carryCapacity: number;

  // Damage Resistance (from perks)
  drPhysical: number;
  drEnergy: number;
  drRadiation: number;

  // Breakdown for UI
  breakdown: {
    hp: {
      base: number;
      perkBonus: number;
      total: number;
    };
    dr: {
      physical: { base: number; perkBonus: number; total: number };
      energy: { base: number; perkBonus: number; total: number };
      radiation: { base: number; perkBonus: number; total: number };
    };
    carryCapacity: {
      base: number;
      perkBonus: number;
      total: number;
    };
  };

  // Active effects (for display)
  activeEffects: {
    perkId: string;
    rank: number;
    description: string;
  }[];
}

/**
 * Calculate all derived stats for a character
 */
export function useCharacterStats(character: Character | null): CharacterDerivedStats | null {
  return useMemo(() => {
    if (!character) return null;

    const { special, perks = [], survivorTraits = [] } = character;

    // Check for relevant traits
    const hasGifted = survivorTraits.includes('gifted');
    const hasSmallFrame = survivorTraits.includes('smallFrame');
    const hasHeavyHanded = survivorTraits.includes('heavyHanded');

    // === BASE STATS ===
    const baseMaxHp = calculateMaxHp(special.endurance, special.luck, character.level);
    const baseDefense = calculateDefense(special.agility);
    const baseInitiative = calculateInitiative(special.perception, special.agility);
    const baseMeleeDamageBonus = calculateMeleeDamageBonus(special.strength);
    const baseMaxLuckPoints = calculateMaxLuckPoints(special.luck, hasGifted);
    const baseCarryCapacity = calculateCarryCapacity(special.strength, hasSmallFrame);

    // === PERK BONUSES ===
    const perkHPBonus = getPerkHPBonus(perks);
    const perkDRBonuses = getPerkDRBonuses(perks);
    const perkCarryBonus = getPerkCarryCapacityBonus(perks);

    // === TRAIT BONUSES ===
    const traitMeleeBonus = hasHeavyHanded ? 1 : 0;

    // === FINAL STATS ===
    const maxHp = baseMaxHp + perkHPBonus;
    const defense = baseDefense; // Defense from perks is usually contextual (e.g., Moving Target)
    const initiative = baseInitiative;
    const meleeDamageBonus = baseMeleeDamageBonus + traitMeleeBonus;
    const maxLuckPoints = baseMaxLuckPoints;
    const carryCapacity = baseCarryCapacity + perkCarryBonus;

    // DR starts at 0, only comes from armor and perks
    const drPhysical = perkDRBonuses.physical;
    const drEnergy = perkDRBonuses.energy;
    const drRadiation = perkDRBonuses.radiation;

    // === ACTIVE EFFECTS (for display) ===
    const activeEffects: CharacterDerivedStats['activeEffects'] = [];

    for (const { perkId, rank } of perks) {
      const effect = PERK_EFFECTS[perkId];
      if (effect) {
        // Show perks with permanent effects
        if (effect.perRank) {
          const effects: string[] = [];
          if (effect.perRank.hp) effects.push(`+${effect.perRank.hp * rank} HP`);
          if (effect.perRank.drPhysical) effects.push(`+${effect.perRank.drPhysical * rank} DR Physical`);
          if (effect.perRank.drEnergy) effects.push(`+${effect.perRank.drEnergy * rank} DR Energy`);
          if (effect.perRank.drRadiation) effects.push(`+${effect.perRank.drRadiation * rank} DR Radiation`);
          if (effect.perRank.carryCapacity) effects.push(`+${effect.perRank.carryCapacity * rank} Carry`);

          if (effects.length > 0) {
            activeEffects.push({
              perkId,
              rank,
              description: effects.join(', '),
            });
          }
        }

        // Show combat effects
        if (effect.combat) {
          const combatEffects: string[] = [];
          if (effect.combat.meleeDamageBonus) combatEffects.push(`+${effect.combat.meleeDamageBonus} CD melee`);
          if (effect.combat.rangedDamageBonus) combatEffects.push(`+${effect.combat.rangedDamageBonus} CD ranged`);
          if (effect.combat.critDamageBonus) combatEffects.push(`+${effect.combat.critDamageBonus} CD on crit`);

          if (combatEffects.length > 0) {
            activeEffects.push({
              perkId,
              rank,
              description: combatEffects.join(', '),
            });
          }
        }
      }
    }

    return {
      maxHp,
      defense,
      initiative,
      meleeDamageBonus,
      maxLuckPoints,
      carryCapacity,
      drPhysical,
      drEnergy,
      drRadiation,
      breakdown: {
        hp: {
          base: baseMaxHp,
          perkBonus: perkHPBonus,
          total: maxHp,
        },
        dr: {
          physical: { base: 0, perkBonus: perkDRBonuses.physical, total: drPhysical },
          energy: { base: 0, perkBonus: perkDRBonuses.energy, total: drEnergy },
          radiation: { base: 0, perkBonus: perkDRBonuses.radiation, total: drRadiation },
        },
        carryCapacity: {
          base: baseCarryCapacity,
          perkBonus: perkCarryBonus,
          total: carryCapacity,
        },
      },
      activeEffects,
    };
  }, [character]);
}

/**
 * Get a summary of all active effects for a character
 * Useful for displaying in character sheets
 */
export function getCharacterEffectsSummary(character: Character): {
  permanentBonuses: string[];
  combatBonuses: string[];
  specialRules: string[];
} {
  const permanentBonuses: string[] = [];
  const combatBonuses: string[] = [];
  const specialRules: string[] = [];

  const { perks = [], survivorTraits = [] } = character;

  // Perk effects
  for (const { perkId, rank } of perks) {
    const effect = PERK_EFFECTS[perkId];
    if (!effect) continue;

    // Permanent bonuses
    if (effect.perRank) {
      if (effect.perRank.hp) permanentBonuses.push(`+${effect.perRank.hp * rank} HP (${perkId})`);
      if (effect.perRank.drPhysical) permanentBonuses.push(`+${effect.perRank.drPhysical * rank} DR Physical (${perkId})`);
      if (effect.perRank.drEnergy) permanentBonuses.push(`+${effect.perRank.drEnergy * rank} DR Energy (${perkId})`);
      if (effect.perRank.drRadiation) permanentBonuses.push(`+${effect.perRank.drRadiation * rank} DR Radiation (${perkId})`);
      if (effect.perRank.carryCapacity) permanentBonuses.push(`+${effect.perRank.carryCapacity * rank} Carry Capacity (${perkId})`);
    }

    // Combat bonuses
    if (effect.combat) {
      if (effect.combat.meleeDamageBonus) combatBonuses.push(`+${effect.combat.meleeDamageBonus} CD melee (${perkId})`);
      if (effect.combat.rangedDamageBonus) combatBonuses.push(`+${effect.combat.rangedDamageBonus} CD ranged (${perkId})`);
      if (effect.combat.critDamageBonus) combatBonuses.push(`+${effect.combat.critDamageBonus} CD on crit (${perkId})`);
    }

    // Special rules
    if (effect.specialRuleKeys) {
      // Get rank-specific rule if available
      if (rank <= effect.specialRuleKeys.length) {
        specialRules.push(`${perkId}: ${effect.specialRuleKeys[rank - 1]}`);
      } else {
        specialRules.push(`${perkId}: ${effect.specialRuleKeys[effect.specialRuleKeys.length - 1]}`);
      }
    }
  }

  // Trait effects
  for (const traitId of survivorTraits) {
    const effect = SURVIVOR_TRAIT_EFFECTS[traitId];
    if (!effect) continue;

    if (effect.specialRuleKeys) {
      for (const rule of effect.specialRuleKeys) {
        specialRules.push(`${traitId}: ${rule}`);
      }
    }
  }

  return { permanentBonuses, combatBonuses, specialRules };
}

/**
 * Calculate skill test target number
 * In Fallout 2d20: Target = Attribute + Skill
 * Critical success if roll <= Skill rank
 */
export function calculateSkillTarget(
  character: Character,
  skill: keyof typeof character.skills,
  attributeOverride?: SpecialAttribute
): {
  target: number;
  critRange: number;
  attribute: SpecialAttribute;
  skillRank: number;
} {
  const SKILL_ATTRIBUTES: Record<string, SpecialAttribute> = {
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

  const attribute = attributeOverride ?? SKILL_ATTRIBUTES[skill];
  const attributeValue = character.special[attribute];
  const skillRank = character.skills[skill] ?? 0;

  // Tag skills give critical on rank (normal is just rank)
  const isTagSkill = character.tagSkills?.includes(skill);
  let critRange = skillRank;

  // Finesse perk: crit on 1 less
  if (hasPerk(character.perks ?? [], 'finesse')) {
    critRange += 1;
  }

  return {
    target: attributeValue + skillRank,
    critRange: Math.min(critRange, 5), // Max crit range is 5
    attribute,
    skillRank,
  };
}
