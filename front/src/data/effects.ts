/**
 * Fallout 2d20 - Effects System
 *
 * This file contains the mechanical effects for perks, traits, and weapon qualities.
 * Effects are defined here (not in DB) because:
 * - Rules are immutable (from the official book)
 * - Effects are complex and often conditional
 * - TypeScript typing ensures consistency
 * - No DB queries needed for rules
 *
 * All text descriptions use i18n keys (effects.{category}.{id}.rules.{index})
 */

import type { SpecialAttribute, SkillName } from './characters';

// ===== PERK EFFECTS =====

export interface PerkEffect {
  id: string;
  // Permanent bonuses (applied to derived stats)
  perRank?: {
    hp?: number;
    drPhysical?: number;
    drEnergy?: number;
    drRadiation?: number;
    carryCapacity?: number;
    initiative?: number;
    defense?: number;
    actionPoints?: number;
    luckPoints?: number;
    healingRate?: number;
    skillBonus?: Partial<Record<SkillName, number>>;
    specialBonus?: Partial<Record<SpecialAttribute, number>>;
  };
  flat?: {
    hp?: number;
    drPhysical?: number;
    drEnergy?: number;
  };
  combat?: {
    meleeDamageBonus?: number;
    rangedDamageBonus?: number;
    critDamageBonus?: number;
    rerollDamage?: boolean;
    ignoreArmorPiercing?: number;
    reduceTargetDR?: number;
    causesCondition?: string;
  };
  // i18n keys for special rules
  specialRuleKeys?: string[];
}

/**
 * Perk effects indexed by perk ID
 * Based on Fallout 2d20 Core Rulebook
 */
export const PERK_EFFECTS: Record<string, PerkEffect> = {
  // === A ===
  animalFriend: {
    id: 'animalFriend',
    specialRuleKeys: [
      'effects.perks.animalFriend.rules.0',
      'effects.perks.animalFriend.rules.1',
    ],
  },
  aquaboy: {
    id: 'aquaboy',
    specialRuleKeys: [
      'effects.perks.aquaboy.rules.0',
      'effects.perks.aquaboy.rules.1',
    ],
  },
  armorer: {
    id: 'armorer',
    specialRuleKeys: [
      'effects.perks.armorer.rules.0',
      'effects.perks.armorer.rules.1',
      'effects.perks.armorer.rules.2',
      'effects.perks.armorer.rules.3',
    ],
  },

  // === B ===
  basher: {
    id: 'basher',
    combat: {
      meleeDamageBonus: 1,
    },
    specialRuleKeys: [
      'effects.perks.basher.rules.0',
      'effects.perks.basher.rules.1',
    ],
  },
  betterCriticals: {
    id: 'betterCriticals',
    combat: {
      critDamageBonus: 1,
    },
    specialRuleKeys: ['effects.perks.betterCriticals.rules.0'],
  },
  blacksmith: {
    id: 'blacksmith',
    specialRuleKeys: [
      'effects.perks.blacksmith.rules.0',
      'effects.perks.blacksmith.rules.1',
      'effects.perks.blacksmith.rules.2',
    ],
  },
  bloodyMess: {
    id: 'bloodyMess',
    combat: {
      meleeDamageBonus: 1,
      rangedDamageBonus: 1,
    },
    specialRuleKeys: ['effects.perks.bloodyMess.rules.0'],
  },

  // === C ===
  cannibal: {
    id: 'cannibal',
    specialRuleKeys: [
      'effects.perks.cannibal.rules.0',
      'effects.perks.cannibal.rules.1',
    ],
  },
  chemist: {
    id: 'chemist',
    specialRuleKeys: [
      'effects.perks.chemist.rules.0',
      'effects.perks.chemist.rules.1',
    ],
  },
  commando: {
    id: 'commando',
    combat: {
      rangedDamageBonus: 1,
    },
    specialRuleKeys: [
      'effects.perks.commando.rules.0',
      'effects.perks.commando.rules.1',
      'effects.perks.commando.rules.2',
    ],
  },
  criticalBanker: {
    id: 'criticalBanker',
    specialRuleKeys: [
      'effects.perks.criticalBanker.rules.0',
      'effects.perks.criticalBanker.rules.1',
      'effects.perks.criticalBanker.rules.2',
    ],
  },

  // === D ===
  demolitionExpert: {
    id: 'demolitionExpert',
    specialRuleKeys: [
      'effects.perks.demolitionExpert.rules.0',
      'effects.perks.demolitionExpert.rules.1',
      'effects.perks.demolitionExpert.rules.2',
    ],
  },

  // === E ===
  educated: {
    id: 'educated',
    specialRuleKeys: ['effects.perks.educated.rules.0'],
  },
  entomologist: {
    id: 'entomologist',
    specialRuleKeys: ['effects.perks.entomologist.rules.0'],
  },

  // === F ===
  fastMetabolism: {
    id: 'fastMetabolism',
    perRank: {
      healingRate: 2,
    },
    specialRuleKeys: ['effects.perks.fastMetabolism.rules.0'],
  },
  finesse: {
    id: 'finesse',
    specialRuleKeys: ['effects.perks.finesse.rules.0'],
  },
  fortuneFinder: {
    id: 'fortuneFinder',
    specialRuleKeys: [
      'effects.perks.fortuneFinder.rules.0',
      'effects.perks.fortuneFinder.rules.1',
      'effects.perks.fortuneFinder.rules.2',
    ],
  },

  // === G ===
  ghoulish: {
    id: 'ghoulish',
    specialRuleKeys: [
      'effects.perks.ghoulish.rules.0',
      'effects.perks.ghoulish.rules.1',
    ],
  },
  gunNut: {
    id: 'gunNut',
    specialRuleKeys: [
      'effects.perks.gunNut.rules.0',
      'effects.perks.gunNut.rules.1',
      'effects.perks.gunNut.rules.2',
      'effects.perks.gunNut.rules.3',
    ],
  },
  gunslinger: {
    id: 'gunslinger',
    combat: {
      rangedDamageBonus: 1,
    },
    specialRuleKeys: [
      'effects.perks.gunslinger.rules.0',
      'effects.perks.gunslinger.rules.1',
      'effects.perks.gunslinger.rules.2',
    ],
  },

  // === H ===
  heavyGunner: {
    id: 'heavyGunner',
    combat: {
      rangedDamageBonus: 1,
    },
    specialRuleKeys: [
      'effects.perks.heavyGunner.rules.0',
      'effects.perks.heavyGunner.rules.1',
      'effects.perks.heavyGunner.rules.2',
    ],
  },

  // === I ===
  inspirational: {
    id: 'inspirational',
    specialRuleKeys: [
      'effects.perks.inspirational.rules.0',
      'effects.perks.inspirational.rules.1',
      'effects.perks.inspirational.rules.2',
    ],
  },
  intensiveTraining: {
    id: 'intensiveTraining',
    specialRuleKeys: ['effects.perks.intensiveTraining.rules.0'],
  },
  ironFist: {
    id: 'ironFist',
    combat: {
      meleeDamageBonus: 1,
    },
    specialRuleKeys: [
      'effects.perks.ironFist.rules.0',
      'effects.perks.ironFist.rules.1',
      'effects.perks.ironFist.rules.2',
      'effects.perks.ironFist.rules.3',
      'effects.perks.ironFist.rules.4',
    ],
  },

  // === L ===
  leadBelly: {
    id: 'leadBelly',
    specialRuleKeys: [
      'effects.perks.leadBelly.rules.0',
      'effects.perks.leadBelly.rules.1',
    ],
  },
  lifeGiver: {
    id: 'lifeGiver',
    perRank: {
      hp: 4,
    },
    specialRuleKeys: ['effects.perks.lifeGiver.rules.0'],
  },
  localLeader: {
    id: 'localLeader',
    specialRuleKeys: [
      'effects.perks.localLeader.rules.0',
      'effects.perks.localLeader.rules.1',
    ],
  },
  locksmith: {
    id: 'locksmith',
    specialRuleKeys: [
      'effects.perks.locksmith.rules.0',
      'effects.perks.locksmith.rules.1',
      'effects.perks.locksmith.rules.2',
    ],
  },

  // === M ===
  medic: {
    id: 'medic',
    specialRuleKeys: [
      'effects.perks.medic.rules.0',
      'effects.perks.medic.rules.1',
      'effects.perks.medic.rules.2',
      'effects.perks.medic.rules.3',
    ],
  },
  misterSandman: {
    id: 'misterSandman',
    specialRuleKeys: [
      'effects.perks.misterSandman.rules.0',
      'effects.perks.misterSandman.rules.1',
      'effects.perks.misterSandman.rules.2',
    ],
  },
  movingTarget: {
    id: 'movingTarget',
    perRank: {
      defense: 1,
    },
    specialRuleKeys: ['effects.perks.movingTarget.rules.0'],
  },

  // === N ===
  nightPerson: {
    id: 'nightPerson',
    specialRuleKeys: [
      'effects.perks.nightPerson.rules.0',
      'effects.perks.nightPerson.rules.1',
    ],
  },
  ninja: {
    id: 'ninja',
    combat: {
      meleeDamageBonus: 1,
    },
    specialRuleKeys: [
      'effects.perks.ninja.rules.0',
      'effects.perks.ninja.rules.1',
      'effects.perks.ninja.rules.2',
    ],
  },
  nuclearPhysicist: {
    id: 'nuclearPhysicist',
    specialRuleKeys: [
      'effects.perks.nuclearPhysicist.rules.0',
      'effects.perks.nuclearPhysicist.rules.1',
      'effects.perks.nuclearPhysicist.rules.2',
    ],
  },

  // === P ===
  painTrain: {
    id: 'painTrain',
    specialRuleKeys: [
      'effects.perks.painTrain.rules.0',
      'effects.perks.painTrain.rules.1',
      'effects.perks.painTrain.rules.2',
    ],
  },
  penetrator: {
    id: 'penetrator',
    combat: {
      ignoreArmorPiercing: 1,
    },
    specialRuleKeys: [
      'effects.perks.penetrator.rules.0',
      'effects.perks.penetrator.rules.1',
    ],
  },
  pickpocket: {
    id: 'pickpocket',
    specialRuleKeys: [
      'effects.perks.pickpocket.rules.0',
      'effects.perks.pickpocket.rules.1',
      'effects.perks.pickpocket.rules.2',
    ],
  },

  // === Q ===
  quickHands: {
    id: 'quickHands',
    specialRuleKeys: ['effects.perks.quickHands.rules.0'],
  },

  // === R ===
  radResistant: {
    id: 'radResistant',
    perRank: {
      drRadiation: 2,
    },
    specialRuleKeys: ['effects.perks.radResistant.rules.0'],
  },
  refractor: {
    id: 'refractor',
    perRank: {
      drEnergy: 2,
    },
    specialRuleKeys: ['effects.perks.refractor.rules.0'],
  },
  rifleman: {
    id: 'rifleman',
    combat: {
      rangedDamageBonus: 1,
    },
    specialRuleKeys: [
      'effects.perks.rifleman.rules.0',
      'effects.perks.rifleman.rules.1',
      'effects.perks.rifleman.rules.2',
      'effects.perks.rifleman.rules.3',
      'effects.perks.rifleman.rules.4',
    ],
  },
  robotExpert: {
    id: 'robotExpert',
    specialRuleKeys: [
      'effects.perks.robotExpert.rules.0',
      'effects.perks.robotExpert.rules.1',
      'effects.perks.robotExpert.rules.2',
    ],
  },
  rooted: {
    id: 'rooted',
    perRank: {
      drPhysical: 2,
      drEnergy: 2,
    },
    combat: {
      meleeDamageBonus: 1,
    },
    specialRuleKeys: ['effects.perks.rooted.rules.0'],
  },

  // === S ===
  science: {
    id: 'science',
    specialRuleKeys: [
      'effects.perks.science.rules.0',
      'effects.perks.science.rules.1',
      'effects.perks.science.rules.2',
      'effects.perks.science.rules.3',
    ],
  },
  scrapper: {
    id: 'scrapper',
    specialRuleKeys: [
      'effects.perks.scrapper.rules.0',
      'effects.perks.scrapper.rules.1',
    ],
  },
  scrounger: {
    id: 'scrounger',
    specialRuleKeys: [
      'effects.perks.scrounger.rules.0',
      'effects.perks.scrounger.rules.1',
      'effects.perks.scrounger.rules.2',
    ],
  },
  sniper: {
    id: 'sniper',
    specialRuleKeys: [
      'effects.perks.sniper.rules.0',
      'effects.perks.sniper.rules.1',
      'effects.perks.sniper.rules.2',
    ],
  },
  solarPowered: {
    id: 'solarPowered',
    specialRuleKeys: [
      'effects.perks.solarPowered.rules.0',
      'effects.perks.solarPowered.rules.1',
      'effects.perks.solarPowered.rules.2',
    ],
  },
  steadyAim: {
    id: 'steadyAim',
    specialRuleKeys: ['effects.perks.steadyAim.rules.0'],
  },
  strongBack: {
    id: 'strongBack',
    perRank: {
      carryCapacity: 25,
    },
    specialRuleKeys: [
      'effects.perks.strongBack.rules.0',
      'effects.perks.strongBack.rules.1',
      'effects.perks.strongBack.rules.2',
      'effects.perks.strongBack.rules.3',
    ],
  },

  // === T ===
  toughness: {
    id: 'toughness',
    perRank: {
      hp: 1,
      drPhysical: 1,
    },
    specialRuleKeys: ['effects.perks.toughness.rules.0'],
  },

  // === W ===
  wastelandWhisperer: {
    id: 'wastelandWhisperer',
    specialRuleKeys: [
      'effects.perks.wastelandWhisperer.rules.0',
      'effects.perks.wastelandWhisperer.rules.1',
      'effects.perks.wastelandWhisperer.rules.2',
    ],
  },
};

// ===== SURVIVOR TRAIT EFFECTS =====

export interface SurvivorTraitEffect {
  id: string;
  bonus?: {
    specialBonus?: Partial<Record<SpecialAttribute, number>>;
    skillPoints?: number;
    tagSkills?: number;
    luckPoints?: number;
  };
  penalty?: {
    skillPoints?: number;
    carryCapacityMultiplier?: number;
  };
  requiresChoice?: boolean;
  specialRuleKeys?: string[];
}

export const SURVIVOR_TRAIT_EFFECTS: Record<string, SurvivorTraitEffect> = {
  gifted: {
    id: 'gifted',
    bonus: {
      luckPoints: 1,
    },
    penalty: {
      skillPoints: -5,
    },
    requiresChoice: true,
    specialRuleKeys: [
      'effects.survivorTraits.gifted.rules.0',
      'effects.survivorTraits.gifted.rules.1',
      'effects.survivorTraits.gifted.rules.2',
    ],
  },
  educated: {
    id: 'educated',
    bonus: {
      tagSkills: 1,
    },
    specialRuleKeys: ['effects.survivorTraits.educated.rules.0'],
  },
  smallFrame: {
    id: 'smallFrame',
    bonus: {
      specialBonus: { agility: 1 },
    },
    penalty: {
      carryCapacityMultiplier: 0.5,
    },
    specialRuleKeys: [
      'effects.survivorTraits.smallFrame.rules.0',
      'effects.survivorTraits.smallFrame.rules.1',
    ],
  },
  heavyHanded: {
    id: 'heavyHanded',
    specialRuleKeys: ['effects.survivorTraits.heavyHanded.rules.0'],
  },
  fastShot: {
    id: 'fastShot',
    specialRuleKeys: [
      'effects.survivorTraits.fastShot.rules.0',
      'effects.survivorTraits.fastShot.rules.1',
    ],
  },
};

// ===== WEAPON QUALITY EFFECTS =====

export interface WeaponQualityEffect {
  id: string;
  usesValue?: boolean;
  accuracy?: {
    ignoresCoverDifficulty?: number;
    closeQuartersBonus?: number;
    longRangeBonus?: number;
    inaccurate?: number;
  };
  damage?: {
    bonusCD?: number;
    bonusCDOnCrit?: number;
    rerollDamage?: number;
    persistent?: string;
  };
  ammo?: {
    burstExtraAmmo?: number;
    burstBonusCD?: number;
  };
  effects?: {
    causesCondition?: string;
    ignoresArmor?: boolean;
    areaEffect?: boolean;
    canParry?: boolean;
    concealed?: boolean;
    twoHanded?: boolean;
    thrown?: boolean;
    isReliable?: boolean;
    isUnreliable?: boolean;
  };
  specialRuleKeys?: string[];
}

export const WEAPON_QUALITY_EFFECTS: Record<string, WeaponQualityEffect> = {
  accurate: {
    id: 'accurate',
    accuracy: {
      ignoresCoverDifficulty: 1,
    },
    specialRuleKeys: ['effects.weaponQualities.accurate.rules.0'],
  },
  blast: {
    id: 'blast',
    usesValue: true,
    effects: {
      areaEffect: true,
    },
    specialRuleKeys: ['effects.weaponQualities.blast.rules.0'],
  },
  breaking: {
    id: 'breaking',
    usesValue: true,
    specialRuleKeys: ['effects.weaponQualities.breaking.rules.0'],
  },
  burst: {
    id: 'burst',
    ammo: {
      burstExtraAmmo: 1,
      burstBonusCD: 1,
    },
    specialRuleKeys: ['effects.weaponQualities.burst.rules.0'],
  },
  closeQuarters: {
    id: 'closeQuarters',
    accuracy: {
      closeQuartersBonus: 1,
    },
    specialRuleKeys: ['effects.weaponQualities.closeQuarters.rules.0'],
  },
  concealed: {
    id: 'concealed',
    effects: {
      concealed: true,
    },
    specialRuleKeys: ['effects.weaponQualities.concealed.rules.0'],
  },
  debilitating: {
    id: 'debilitating',
    specialRuleKeys: ['effects.weaponQualities.debilitating.rules.0'],
  },
  gatling: {
    id: 'gatling',
    specialRuleKeys: ['effects.weaponQualities.gatling.rules.0'],
  },
  inaccurate: {
    id: 'inaccurate',
    accuracy: {
      inaccurate: 1,
    },
    specialRuleKeys: ['effects.weaponQualities.inaccurate.rules.0'],
  },
  mine: {
    id: 'mine',
    specialRuleKeys: ['effects.weaponQualities.mine.rules.0'],
  },
  nightVision: {
    id: 'nightVision',
    specialRuleKeys: ['effects.weaponQualities.nightVision.rules.0'],
  },
  parry: {
    id: 'parry',
    effects: {
      canParry: true,
    },
    specialRuleKeys: ['effects.weaponQualities.parry.rules.0'],
  },
  persistent: {
    id: 'persistent',
    usesValue: true,
    damage: {
      persistent: 'physical',
    },
    specialRuleKeys: ['effects.weaponQualities.persistent.rules.0'],
  },
  piercing: {
    id: 'piercing',
    usesValue: true,
    effects: {
      ignoresArmor: true,
    },
    specialRuleKeys: ['effects.weaponQualities.piercing.rules.0'],
  },
  radioactive: {
    id: 'radioactive',
    usesValue: true,
    damage: {
      persistent: 'radiation',
    },
    specialRuleKeys: ['effects.weaponQualities.radioactive.rules.0'],
  },
  reliable: {
    id: 'reliable',
    effects: {
      isReliable: true,
    },
    specialRuleKeys: ['effects.weaponQualities.reliable.rules.0'],
  },
  recon: {
    id: 'recon',
    specialRuleKeys: ['effects.weaponQualities.recon.rules.0'],
  },
  spread: {
    id: 'spread',
    specialRuleKeys: ['effects.weaponQualities.spread.rules.0'],
  },
  stun: {
    id: 'stun',
    effects: {
      causesCondition: 'stunned',
    },
    specialRuleKeys: ['effects.weaponQualities.stun.rules.0'],
  },
  thrown: {
    id: 'thrown',
    effects: {
      thrown: true,
    },
    specialRuleKeys: ['effects.weaponQualities.thrown.rules.0'],
  },
  twoHanded: {
    id: 'twoHanded',
    effects: {
      twoHanded: true,
    },
    specialRuleKeys: ['effects.weaponQualities.twoHanded.rules.0'],
  },
  unreliable: {
    id: 'unreliable',
    effects: {
      isUnreliable: true,
    },
    specialRuleKeys: ['effects.weaponQualities.unreliable.rules.0'],
  },
  vicious: {
    id: 'vicious',
    usesValue: true,
    damage: {
      bonusCDOnCrit: 1,
    },
    specialRuleKeys: ['effects.weaponQualities.vicious.rules.0'],
  },
  silent: {
    id: 'silent',
    specialRuleKeys: ['effects.weaponQualities.silent.rules.0'],
  },
};

// ===== ORIGIN EFFECTS =====

export const ORIGIN_EFFECTS: Record<string, {
  traitKey: string;
  bonusTagSkills?: string[];
  specialModifiers?: Partial<Record<SpecialAttribute, number>>;
  specialMaxOverrides?: Partial<Record<SpecialAttribute, number>>;
  skillMaxOverride?: number;
  negativesKeys?: string[];
  isRobot?: boolean;
  bonusTraits?: number;
  bonusSkillPoints?: number;
}> = {
  brotherhood: {
    traitKey: 'effects.origins.brotherhood.trait',
    bonusTagSkills: ['energyWeapons'],
  },
  ghoul: {
    traitKey: 'effects.origins.ghoul.trait',
    specialModifiers: { endurance: 1 },
    negativesKeys: ['effects.origins.ghoul.negatives.0'],
  },
  superMutant: {
    traitKey: 'effects.origins.superMutant.trait',
    specialModifiers: { strength: 2, endurance: 2 },
    specialMaxOverrides: { intelligence: 6, charisma: 6 },
    skillMaxOverride: 4,
    negativesKeys: ['effects.origins.superMutant.negatives.0'],
  },
  misterHandy: {
    traitKey: 'effects.origins.misterHandy.trait',
    isRobot: true,
    negativesKeys: [
      'effects.origins.misterHandy.negatives.0',
      'effects.origins.misterHandy.negatives.1',
    ],
  },
  survivor: {
    traitKey: 'effects.origins.survivor.trait',
    bonusTraits: 2,
  },
  vaultDweller: {
    traitKey: 'effects.origins.vaultDweller.trait',
    bonusSkillPoints: 2,
  },
};

// ===== HELPER FUNCTIONS =====

export function getPerkHPBonus(perks: { perkId: string; rank: number }[]): number {
  let bonus = 0;
  for (const { perkId, rank } of perks) {
    const effect = PERK_EFFECTS[perkId];
    if (effect?.perRank?.hp) {
      bonus += effect.perRank.hp * rank;
    }
  }
  return bonus;
}

export function getPerkDRBonuses(perks: { perkId: string; rank: number }[]): {
  physical: number;
  energy: number;
  radiation: number;
} {
  const bonuses = { physical: 0, energy: 0, radiation: 0 };
  for (const { perkId, rank } of perks) {
    const effect = PERK_EFFECTS[perkId];
    if (effect?.perRank?.drPhysical) {
      bonuses.physical += effect.perRank.drPhysical * rank;
    }
    if (effect?.perRank?.drEnergy) {
      bonuses.energy += effect.perRank.drEnergy * rank;
    }
    if (effect?.perRank?.drRadiation) {
      bonuses.radiation += effect.perRank.drRadiation * rank;
    }
  }
  return bonuses;
}

export function getPerkCarryCapacityBonus(perks: { perkId: string; rank: number }[]): number {
  let bonus = 0;
  for (const { perkId, rank } of perks) {
    const effect = PERK_EFFECTS[perkId];
    if (effect?.perRank?.carryCapacity) {
      bonus += effect.perRank.carryCapacity * rank;
    }
  }
  return bonus;
}

export function hasPerk(perks: { perkId: string; rank: number }[], perkId: string): boolean {
  return perks.some((p) => p.perkId === perkId);
}

export function getPerkRank(perks: { perkId: string; rank: number }[], perkId: string): number {
  const perk = perks.find((p) => p.perkId === perkId);
  return perk?.rank ?? 0;
}

export function getWeaponQualityEffect(quality: string): WeaponQualityEffect | undefined {
  return WEAPON_QUALITY_EFFECTS[quality];
}

export function getWeaponQualityRuleKeys(qualities: { quality: string; value?: number }[]): string[] {
  const ruleKeys: string[] = [];
  for (const { quality } of qualities) {
    const effect = WEAPON_QUALITY_EFFECTS[quality];
    if (effect?.specialRuleKeys) {
      ruleKeys.push(...effect.specialRuleKeys);
    }
  }
  return ruleKeys;
}
