import type { SpecialAttribute, SkillName } from './characters';

// ===== PERK TYPES =====

export interface PerkPrerequisite {
  // SPECIAL attribute requirements
  special?: Partial<Record<SpecialAttribute, number>>;
  // Minimum level requirement
  level?: number;
  // Skill requirements (skill name -> minimum rank)
  skills?: Partial<Record<SkillName, number>>;
  // Other perk requirements (perk id)
  perks?: string[];
  // Excluded perks (cannot have this perk if you have one of these)
  excludedPerks?: string[];
  // Origin restrictions
  notForRobots?: boolean;
  // Level increase per rank taken
  levelIncreasePerRank?: number;
}

export interface PerkRankEffect {
  rank: number;
  effect: string;
}

export interface Perk {
  id: string;
  nameKey: string;
  maxRanks: number;
  prerequisites: PerkPrerequisite;
  effectKey: string;
  // If the perk has different effects per rank
  rankEffects?: PerkRankEffect[];
}

// ===== PERKS LIST =====

export const PERKS: Perk[] = [
  // A
  {
    id: 'animalFriend',
    nameKey: 'perks.animalFriend.name',
    maxRanks: 2,
    prerequisites: {
      special: { charisma: 6 },
      level: 1,
      levelIncreasePerRank: 5,
    },
    effectKey: 'perks.animalFriend.effect',
  },
  {
    id: 'aquaboy',
    nameKey: 'perks.aquaboy.name',
    maxRanks: 2,
    prerequisites: {
      special: { endurance: 5 },
      level: 1,
      levelIncreasePerRank: 3,
    },
    effectKey: 'perks.aquaboy.effect',
  },
  {
    id: 'radResistant',
    nameKey: 'perks.radResistant.name',
    maxRanks: 2,
    prerequisites: {
      special: { endurance: 8 },
      level: 1,
      levelIncreasePerRank: 4,
    },
    effectKey: 'perks.radResistant.effect',
  },
  {
    id: 'armorer',
    nameKey: 'perks.armorer.name',
    maxRanks: 4,
    prerequisites: {
      special: { strength: 5, intelligence: 6 },
      levelIncreasePerRank: 4,
    },
    effectKey: 'perks.armorer.effect',
  },
  // B
  {
    id: 'barbarian',
    nameKey: 'perks.barbarian.name',
    maxRanks: 1,
    prerequisites: {
      special: { strength: 7 },
      level: 4,
      notForRobots: true,
    },
    effectKey: 'perks.barbarian.effect',
  },
  {
    id: 'gunFu',
    nameKey: 'perks.gunFu.name',
    maxRanks: 1,
    prerequisites: {
      special: { agility: 7 },
    },
    effectKey: 'perks.gunFu.effect',
  },
  {
    id: 'silverTongue',
    nameKey: 'perks.silverTongue.name',
    maxRanks: 1,
    prerequisites: {
      special: { charisma: 6 },
    },
    effectKey: 'perks.silverTongue.effect',
  },
  {
    id: 'blitz',
    nameKey: 'perks.blitz.name',
    maxRanks: 2,
    prerequisites: {
      special: { agility: 9 },
      level: 1,
      levelIncreasePerRank: 3,
    },
    effectKey: 'perks.blitz.effect',
  },
  {
    id: 'leadBelly',
    nameKey: 'perks.leadBelly.name',
    maxRanks: 2,
    prerequisites: {
      special: { endurance: 6 },
      level: 1,
      levelIncreasePerRank: 4,
    },
    effectKey: 'perks.leadBelly.effect',
  },
  {
    id: 'juryRigging',
    nameKey: 'perks.juryRigging.name',
    maxRanks: 1,
    prerequisites: {},
    effectKey: 'perks.juryRigging.effect',
  },
  // C
  {
    id: 'scoundrel',
    nameKey: 'perks.scoundrel.name',
    maxRanks: 1,
    prerequisites: {
      special: { charisma: 7 },
    },
    effectKey: 'perks.scoundrel.effect',
  },
  {
    id: 'dogmeat',
    nameKey: 'perks.dogmeat.name',
    maxRanks: 1,
    prerequisites: {
      special: { charisma: 5 },
    },
    effectKey: 'perks.dogmeat.effect',
  },
  {
    id: 'hunter',
    nameKey: 'perks.hunter.name',
    maxRanks: 1,
    prerequisites: {
      special: { endurance: 6 },
    },
    effectKey: 'perks.hunter.effect',
  },
  {
    id: 'chemist',
    nameKey: 'perks.chemist.name',
    maxRanks: 1,
    prerequisites: {
      special: { intelligence: 7 },
    },
    effectKey: 'perks.chemist.effect',
  },
  {
    id: 'shotgunSurgeon',
    nameKey: 'perks.shotgunSurgeon.name',
    maxRanks: 1,
    prerequisites: {
      special: { strength: 5, agility: 7 },
    },
    effectKey: 'perks.shotgunSurgeon.effect',
  },
  {
    id: 'movingTarget',
    nameKey: 'perks.movingTarget.name',
    maxRanks: 1,
    prerequisites: {
      special: { agility: 6 },
    },
    effectKey: 'perks.movingTarget.effect',
  },
  {
    id: 'basher',
    nameKey: 'perks.basher.name',
    maxRanks: 1,
    prerequisites: {
      special: { strength: 6 },
    },
    effectKey: 'perks.basher.effect',
  },
  {
    id: 'laserCommander',
    nameKey: 'perks.laserCommander.name',
    maxRanks: 2,
    prerequisites: {
      special: { perception: 8 },
      level: 2,
      levelIncreasePerRank: 4,
    },
    effectKey: 'perks.laserCommander.effect',
  },
  {
    id: 'commando',
    nameKey: 'perks.commando.name',
    maxRanks: 2,
    prerequisites: {
      special: { agility: 8 },
      level: 2,
      levelIncreasePerRank: 3,
    },
    effectKey: 'perks.commando.effect',
  },
  {
    id: 'comprehension',
    nameKey: 'perks.comprehension.name',
    maxRanks: 1,
    prerequisites: {
      special: { intelligence: 6 },
    },
    effectKey: 'perks.comprehension.effect',
  },
  {
    id: 'canOpener',
    nameKey: 'perks.canOpener.name',
    maxRanks: 1,
    prerequisites: {
      special: { charisma: 5 },
    },
    effectKey: 'perks.canOpener.effect',
  },
  {
    id: 'betterCriticals',
    nameKey: 'perks.betterCriticals.name',
    maxRanks: 1,
    prerequisites: {
      special: { charisma: 9 },
    },
    effectKey: 'perks.betterCriticals.effect',
  },
  // D
  {
    id: 'quickDraw',
    nameKey: 'perks.quickDraw.name',
    maxRanks: 1,
    prerequisites: {
      special: { agility: 6 },
    },
    effectKey: 'perks.quickDraw.effect',
  },
  {
    id: 'fortuneFinder',
    nameKey: 'perks.fortuneFinder.name',
    maxRanks: 3,
    prerequisites: {
      special: { charisma: 5 },
      level: 2,
      levelIncreasePerRank: 4,
    },
    effectKey: 'perks.fortuneFinder.effect',
  },
  // E
  {
    id: 'solarPowered',
    nameKey: 'perks.solarPowered.name',
    maxRanks: 1,
    prerequisites: {
      special: { endurance: 7 },
    },
    effectKey: 'perks.solarPowered.effect',
  },
  {
    id: 'entomologist',
    nameKey: 'perks.entomologist.name',
    maxRanks: 1,
    prerequisites: {
      special: { intelligence: 7 },
    },
    effectKey: 'perks.entomologist.effect',
  },
  {
    id: 'intenseTraining',
    nameKey: 'perks.intenseTraining.name',
    maxRanks: 10,
    prerequisites: {
      level: 2,
      levelIncreasePerRank: 2,
    },
    effectKey: 'perks.intenseTraining.effect',
  },
  {
    id: 'demolitionExpert',
    nameKey: 'perks.demolitionExpert.name',
    maxRanks: 1,
    prerequisites: {
      special: { perception: 6, charisma: 6 },
    },
    effectKey: 'perks.demolitionExpert.effect',
  },
  {
    id: 'roboticsExpert',
    nameKey: 'perks.roboticsExpert.name',
    maxRanks: 3,
    prerequisites: {
      special: { intelligence: 8 },
      level: 2,
      levelIncreasePerRank: 4,
    },
    effectKey: 'perks.roboticsExpert.effect',
  },
  // F
  {
    id: 'gunNut',
    nameKey: 'perks.gunNut.name',
    maxRanks: 4,
    prerequisites: {
      special: { intelligence: 6 },
      level: 2,
      levelIncreasePerRank: 4,
    },
    effectKey: 'perks.gunNut.effect',
  },
  {
    id: 'capCollector',
    nameKey: 'perks.capCollector.name',
    maxRanks: 1,
    prerequisites: {
      special: { charisma: 5 },
    },
    effectKey: 'perks.capCollector.effect',
  },
  {
    id: 'ghost',
    nameKey: 'perks.ghost.name',
    maxRanks: 1,
    prerequisites: {
      special: { perception: 5, agility: 6 },
    },
    effectKey: 'perks.ghost.effect',
  },
  {
    id: 'scrounger',
    nameKey: 'perks.scrounger.name',
    maxRanks: 3,
    prerequisites: {
      special: { charisma: 6 },
      level: 1,
      levelIncreasePerRank: 5,
    },
    effectKey: 'perks.scrounger.effect',
  },
  {
    id: 'pharmaFarmer',
    nameKey: 'perks.pharmaFarmer.name',
    maxRanks: 1,
    prerequisites: {
      special: { charisma: 6 },
    },
    effectKey: 'perks.pharmaFarmer.effect',
  },
  {
    id: 'partyBoy',
    nameKey: 'perks.partyBoy.name',
    maxRanks: 1,
    prerequisites: {
      special: { endurance: 6, charisma: 7 },
    },
    effectKey: 'perks.partyBoy.effect',
  },
  {
    id: 'finesse',
    nameKey: 'perks.finesse.name',
    maxRanks: 1,
    prerequisites: {
      special: { agility: 9 },
    },
    effectKey: 'perks.finesse.effect',
  },
  {
    id: 'heavyHitter',
    nameKey: 'perks.heavyHitter.name',
    maxRanks: 1,
    prerequisites: {
      special: { strength: 8 },
    },
    effectKey: 'perks.heavyHitter.effect',
  },
  {
    id: 'blacksmith',
    nameKey: 'perks.blacksmith.name',
    maxRanks: 3,
    prerequisites: {
      special: { strength: 6 },
      level: 2,
      levelIncreasePerRank: 4,
    },
    effectKey: 'perks.blacksmith.effect',
  },
  {
    id: 'piercingStrike',
    nameKey: 'perks.piercingStrike.name',
    maxRanks: 1,
    prerequisites: {
      special: { strength: 7 },
    },
    effectKey: 'perks.piercingStrike.effect',
  },
  {
    id: 'rifleman',
    nameKey: 'perks.rifleman.name',
    maxRanks: 2,
    prerequisites: {
      special: { agility: 7 },
      level: 2,
      levelIncreasePerRank: 4,
    },
    effectKey: 'perks.rifleman.effect',
  },
  {
    id: 'meltdown',
    nameKey: 'perks.meltdown.name',
    maxRanks: 1,
    prerequisites: {
      special: { perception: 10 },
    },
    effectKey: 'perks.meltdown.effect',
  },
  // G
  {
    id: 'fastHealer',
    nameKey: 'perks.fastHealer.name',
    maxRanks: 1,
    prerequisites: {
      special: { endurance: 6 },
      notForRobots: true,
    },
    effectKey: 'perks.fastHealer.effect',
  },
  {
    id: 'medic',
    nameKey: 'perks.medic.name',
    maxRanks: 3,
    prerequisites: {
      special: { intelligence: 7 },
      level: 1,
      levelIncreasePerRank: 5,
    },
    effectKey: 'perks.medic.effect',
  },
  // H
  {
    id: 'heaveHo',
    nameKey: 'perks.heaveHo.name',
    maxRanks: 1,
    prerequisites: {
      special: { strength: 8 },
    },
    effectKey: 'perks.heaveHo.effect',
  },
  {
    id: 'actionBoy',
    nameKey: 'perks.actionBoy.name',
    maxRanks: 1,
    prerequisites: {},
    effectKey: 'perks.actionBoy.effect',
  },
  // I
  {
    id: 'infiltrator',
    nameKey: 'perks.infiltrator.name',
    maxRanks: 1,
    prerequisites: {
      special: { perception: 8 },
    },
    effectKey: 'perks.infiltrator.effect',
  },
  {
    id: 'nurse',
    nameKey: 'perks.nurse.name',
    maxRanks: 1,
    prerequisites: {
      special: { intelligence: 8 },
    },
    effectKey: 'perks.nurse.effect',
  },
  // L
  {
    id: 'sizeMatters',
    nameKey: 'perks.sizeMatters.name',
    maxRanks: 3,
    prerequisites: {
      special: { endurance: 7, agility: 6 },
      levelIncreasePerRank: 4,
    },
    effectKey: 'perks.sizeMatters.effect',
  },
  {
    id: 'bullRush',
    nameKey: 'perks.bullRush.name',
    maxRanks: 2,
    prerequisites: {
      special: { strength: 9, endurance: 7 },
      level: 1,
      levelIncreasePerRank: 5,
    },
    effectKey: 'perks.bullRush.effect',
  },
  // M
  {
    id: 'quickHands',
    nameKey: 'perks.quickHands.name',
    maxRanks: 1,
    prerequisites: {
      special: { agility: 8 },
    },
    effectKey: 'perks.quickHands.effect',
  },
  {
    id: 'masterThief',
    nameKey: 'perks.masterThief.name',
    maxRanks: 1,
    prerequisites: {
      special: { perception: 8, agility: 9 },
    },
    effectKey: 'perks.masterThief.effect',
  },
  {
    id: 'sandman',
    nameKey: 'perks.sandman.name',
    maxRanks: 1,
    prerequisites: {
      special: { agility: 9 },
    },
    effectKey: 'perks.sandman.effect',
  },
  {
    id: 'fastMetabolism',
    nameKey: 'perks.fastMetabolism.name',
    maxRanks: 3,
    prerequisites: {
      special: { endurance: 6 },
      level: 1,
      notForRobots: true,
      levelIncreasePerRank: 3,
    },
    effectKey: 'perks.fastMetabolism.effect',
  },
  {
    id: 'mysteriousStranger',
    nameKey: 'perks.mysteriousStranger.name',
    maxRanks: 1,
    prerequisites: {
      special: { charisma: 7 },
    },
    effectKey: 'perks.mysteriousStranger.effect',
  },
  // N
  {
    id: 'daringNature',
    nameKey: 'perks.daringNature.name',
    maxRanks: 1,
    prerequisites: {
      special: { charisma: 7 },
      excludedPerks: ['cautiousNature'],
    },
    effectKey: 'perks.daringNature.effect',
  },
  {
    id: 'cautiousNature',
    nameKey: 'perks.cautiousNature.name',
    maxRanks: 1,
    prerequisites: {
      special: { perception: 7 },
      excludedPerks: ['daringNature'],
    },
    effectKey: 'perks.cautiousNature.effect',
  },
  {
    id: 'ninja',
    nameKey: 'perks.ninja.name',
    maxRanks: 1,
    prerequisites: {
      special: { agility: 8 },
    },
    effectKey: 'perks.ninja.effect',
  },
  {
    id: 'nightPerson',
    nameKey: 'perks.nightPerson.name',
    maxRanks: 1,
    prerequisites: {
      special: { perception: 7 },
    },
    effectKey: 'perks.nightPerson.effect',
  },
  // P
  {
    id: 'paralyzingPalm',
    nameKey: 'perks.paralyzingPalm.name',
    maxRanks: 1,
    prerequisites: {
      special: { strength: 8 },
    },
    effectKey: 'perks.paralyzingPalm.effect',
  },
  {
    id: 'nuclearPhysicist',
    nameKey: 'perks.nuclearPhysicist.name',
    maxRanks: 1,
    prerequisites: {
      special: { intelligence: 9 },
    },
    effectKey: 'perks.nuclearPhysicist.effect',
  },
  {
    id: 'pickpocket',
    nameKey: 'perks.pickpocket.name',
    maxRanks: 3,
    prerequisites: {
      special: { perception: 8, agility: 8 },
      level: 1,
      levelIncreasePerRank: 3,
    },
    effectKey: 'perks.pickpocket.effect',
  },
  {
    id: 'lightStep',
    nameKey: 'perks.lightStep.name',
    maxRanks: 1,
    prerequisites: {},
    effectKey: 'perks.lightStep.effect',
  },
  {
    id: 'hacker',
    nameKey: 'perks.hacker.name',
    maxRanks: 1,
    prerequisites: {
      special: { intelligence: 8 },
    },
    effectKey: 'perks.hacker.effect',
  },
  {
    id: 'pathfinder',
    nameKey: 'perks.pathfinder.name',
    maxRanks: 1,
    prerequisites: {
      special: { perception: 6, endurance: 6 },
    },
    effectKey: 'perks.pathfinder.effect',
  },
  {
    id: 'gunslinger',
    nameKey: 'perks.gunslinger.name',
    maxRanks: 2,
    prerequisites: {
      special: { agility: 7 },
      level: 2,
      levelIncreasePerRank: 4,
    },
    effectKey: 'perks.gunslinger.effect',
  },
  {
    id: 'ironFist',
    nameKey: 'perks.ironFist.name',
    maxRanks: 2,
    prerequisites: {
      special: { strength: 6 },
      level: 1,
      levelIncreasePerRank: 5,
    },
    effectKey: 'perks.ironFist.effect',
  },
  {
    id: 'adrenalineRush',
    nameKey: 'perks.adrenalineRush.name',
    maxRanks: 1,
    prerequisites: {
      special: { strength: 7 },
    },
    effectKey: 'perks.adrenalineRush.effect',
  },
  {
    id: 'intimidation',
    nameKey: 'perks.intimidation.name',
    maxRanks: 2,
    prerequisites: {
      special: { strength: 6, charisma: 8 },
      level: 3,
      levelIncreasePerRank: 5,
    },
    effectKey: 'perks.intimidation.effect',
  },
  {
    id: 'pyromaniac',
    nameKey: 'perks.pyromaniac.name',
    maxRanks: 3,
    prerequisites: {
      special: { endurance: 6 },
      level: 2,
      levelIncreasePerRank: 4,
    },
    effectKey: 'perks.pyromaniac.effect',
  },
  // R
  {
    id: 'nerdRage',
    nameKey: 'perks.nerdRage.name',
    maxRanks: 3,
    prerequisites: {
      special: { intelligence: 8 },
      level: 2,
      levelIncreasePerRank: 5,
    },
    effectKey: 'perks.nerdRage.effect',
  },
  {
    id: 'snakeater',
    nameKey: 'perks.snakeater.name',
    maxRanks: 1,
    prerequisites: {
      special: { endurance: 7 },
    },
    effectKey: 'perks.snakeater.effect',
  },
  {
    id: 'scrapper',
    nameKey: 'perks.scrapper.name',
    maxRanks: 2,
    prerequisites: {
      level: 3,
      levelIncreasePerRank: 5,
    },
    effectKey: 'perks.scrapper.effect',
  },
  {
    id: 'refractor',
    nameKey: 'perks.refractor.name',
    maxRanks: 2,
    prerequisites: {
      special: { perception: 6, charisma: 7 },
      level: 1,
      levelIncreasePerRank: 4,
    },
    effectKey: 'perks.refractor.effect',
  },
  {
    id: 'strongBack',
    nameKey: 'perks.strongBack.name',
    maxRanks: 3,
    prerequisites: {
      special: { strength: 5 },
      level: 1,
      levelIncreasePerRank: 2,
    },
    effectKey: 'perks.strongBack.effect',
  },
  {
    id: 'chemResistant',
    nameKey: 'perks.chemResistant.name',
    maxRanks: 2,
    prerequisites: {
      special: { endurance: 7 },
      level: 1,
      levelIncreasePerRank: 4,
    },
    effectKey: 'perks.chemResistant.effect',
  },
  {
    id: 'ricochet',
    nameKey: 'perks.ricochet.name',
    maxRanks: 1,
    prerequisites: {
      special: { charisma: 10 },
      level: 5,
    },
    effectKey: 'perks.ricochet.effect',
  },
  {
    id: 'toughness',
    nameKey: 'perks.toughness.name',
    maxRanks: 2,
    prerequisites: {
      special: { endurance: 6, charisma: 6 },
      level: 1,
      levelIncreasePerRank: 4,
    },
    effectKey: 'perks.toughness.effect',
  },
  // S
  {
    id: 'bloodyMess',
    nameKey: 'perks.bloodyMess.name',
    maxRanks: 1,
    prerequisites: {
      special: { charisma: 6 },
    },
    effectKey: 'perks.bloodyMess.effect',
  },
  {
    id: 'science',
    nameKey: 'perks.science.name',
    maxRanks: 4,
    prerequisites: {
      special: { intelligence: 6 },
      level: 2,
      levelIncreasePerRank: 4,
    },
    effectKey: 'perks.science.effect',
  },
  {
    id: 'awareness',
    nameKey: 'perks.awareness.name',
    maxRanks: 1,
    prerequisites: {
      special: { perception: 7 },
    },
    effectKey: 'perks.awareness.effect',
  },
  {
    id: 'sniper',
    nameKey: 'perks.sniper.name',
    maxRanks: 1,
    prerequisites: {
      special: { perception: 8, agility: 6 },
    },
    effectKey: 'perks.sniper.effect',
  },
  {
    id: 'inspirational',
    nameKey: 'perks.inspirational.name',
    maxRanks: 1,
    prerequisites: {
      special: { charisma: 8 },
    },
    effectKey: 'perks.inspirational.effect',
  },
  {
    id: 'tag',
    nameKey: 'perks.tag.name',
    maxRanks: 1,
    prerequisites: {
      level: 5,
    },
    effectKey: 'perks.tag.effect',
  },
  {
    id: 'adamantiumSkeleton',
    nameKey: 'perks.adamantiumSkeleton.name',
    maxRanks: 3,
    prerequisites: {
      special: { endurance: 7 },
      level: 1,
      levelIncreasePerRank: 3,
    },
    effectKey: 'perks.adamantiumSkeleton.effect',
  },
  {
    id: 'educated',
    nameKey: 'perks.educated.name',
    maxRanks: 10,
    prerequisites: {
      level: 3,
      levelIncreasePerRank: 3,
    },
    effectKey: 'perks.educated.effect',
  },
  // T
  {
    id: 'concentratedFire',
    nameKey: 'perks.concentratedFire.name',
    maxRanks: 1,
    prerequisites: {
      special: { perception: 8, agility: 6 },
    },
    effectKey: 'perks.concentratedFire.effect',
  },
  {
    id: 'slacker',
    nameKey: 'perks.slacker.name',
    maxRanks: 2,
    prerequisites: {
      special: { agility: 6 },
      level: 4,
      levelIncreasePerRank: 6,
    },
    effectKey: 'perks.slacker.effect',
  },
  {
    id: 'triggerRush',
    nameKey: 'perks.triggerRush.name',
    maxRanks: 3,
    prerequisites: {
      special: { agility: 10 },
      level: 1,
      levelIncreasePerRank: 5,
    },
    effectKey: 'perks.triggerRush.effect',
  },
  {
    id: 'slayer',
    nameKey: 'perks.slayer.name',
    maxRanks: 1,
    prerequisites: {
      special: { strength: 8 },
    },
    effectKey: 'perks.slayer.effect',
  },
  {
    id: 'killer',
    nameKey: 'perks.killer.name',
    maxRanks: 1,
    prerequisites: {
      special: { charisma: 8 },
    },
    effectKey: 'perks.killer.effect',
  },
  // V
  {
    id: 'junktownVendor',
    nameKey: 'perks.junktownVendor.name',
    maxRanks: 1,
    prerequisites: {
      special: { charisma: 8 },
    },
    effectKey: 'perks.junktownVendor.effect',
  },
  {
    id: 'blackWidow',
    nameKey: 'perks.blackWidow.name',
    maxRanks: 1,
    prerequisites: {
      special: { charisma: 6 },
    },
    effectKey: 'perks.blackWidow.effect',
  },
  {
    id: 'steadyAim',
    nameKey: 'perks.steadyAim.name',
    maxRanks: 1,
    prerequisites: {
      special: { strength: 8, agility: 7 },
    },
    effectKey: 'perks.steadyAim.effect',
  },
  {
    id: 'lifeGiver',
    nameKey: 'perks.lifeGiver.name',
    maxRanks: 5,
    prerequisites: {
      level: 5,
      levelIncreasePerRank: 5,
    },
    effectKey: 'perks.lifeGiver.effect',
  },
];

// ===== HELPER FUNCTIONS =====

/**
 * Check if a character meets the prerequisites for a perk at a specific rank
 */
export function meetsPrerequisites(
  perk: Perk,
  rank: number,
  characterLevel: number,
  special: Record<SpecialAttribute, number>,
  _skills: Record<SkillName, number>,
  currentPerks: string[],
  isRobot: boolean = false
): boolean {
  const prereqs = perk.prerequisites;

  // Check robot restriction
  if (prereqs.notForRobots && isRobot) {
    return false;
  }

  // Check excluded perks
  if (prereqs.excludedPerks) {
    for (const excludedPerk of prereqs.excludedPerks) {
      if (currentPerks.includes(excludedPerk)) {
        return false;
      }
    }
  }

  // Check SPECIAL requirements
  if (prereqs.special) {
    for (const [attr, minValue] of Object.entries(prereqs.special)) {
      if (special[attr as SpecialAttribute] < minValue) {
        return false;
      }
    }
  }

  // Calculate required level for this rank
  let requiredLevel = prereqs.level ?? 1;
  if (rank > 1 && prereqs.levelIncreasePerRank) {
    requiredLevel += (rank - 1) * prereqs.levelIncreasePerRank;
  }

  if (characterLevel < requiredLevel) {
    return false;
  }

  // Check required perks
  if (prereqs.perks) {
    for (const requiredPerk of prereqs.perks) {
      if (!currentPerks.includes(requiredPerk)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Get all available perks for a character
 */
export function getAvailablePerks(
  characterLevel: number,
  special: Record<SpecialAttribute, number>,
  skills: Record<SkillName, number>,
  currentPerks: { perkId: string; rank: number }[],
  isRobot: boolean = false
): { perk: Perk; availableRank: number }[] {
  const available: { perk: Perk; availableRank: number }[] = [];
  const currentPerkIds = currentPerks.map((p) => p.perkId);

  for (const perk of PERKS) {
    const currentRank = currentPerks.find((p) => p.perkId === perk.id)?.rank ?? 0;
    const nextRank = currentRank + 1;

    // Check if there's a next rank available
    if (nextRank > perk.maxRanks) {
      continue;
    }

    // Check prerequisites for the next rank
    if (meetsPrerequisites(perk, nextRank, characterLevel, special, skills, currentPerkIds, isRobot)) {
      available.push({ perk, availableRank: nextRank });
    }
  }

  return available;
}

/**
 * Calculate the required level for a specific rank of a perk
 */
export function getRequiredLevelForRank(perk: Perk, rank: number): number {
  let requiredLevel = perk.prerequisites.level ?? 1;
  if (rank > 1 && perk.prerequisites.levelIncreasePerRank) {
    requiredLevel += (rank - 1) * perk.prerequisites.levelIncreasePerRank;
  }
  return requiredLevel;
}
