export interface BestiaryEntryData {
  slug: string;
  nameKey: string;
  descriptionKey?: string;
  statBlockType: 'normal' | 'creature';
  category: 'animal' | 'abomination' | 'insect' | 'ghoul' | 'superMutant' | 'robot' | 'human' | 'synth' | 'alien';
  bodyType: 'humanoid' | 'quadruped' | 'insect' | 'serpentine' | 'robot';
  level: number;
  xpReward: number;
  hp: number;
  defense: number;
  initiative: number;
  meleeDamageBonus?: number;
  carryCapacity?: number;
  maxLuckPoints?: number;
  wealth?: number;
  emoji?: string;
  source?: string;
  attributes: Record<string, number>;
  skills: { skill: string; rank: number; isTagSkill?: boolean }[];
  dr: { location: string; drPhysical: number; drEnergy: number; drRadiation: number; drPoison: number }[];
  attacks: {
    nameKey: string;
    skill: string;
    damage: number;
    damageType: 'physical' | 'energy' | 'radiation' | 'poison';
    damageBonus?: number;
    fireRate?: number;
    range: 'close' | 'medium' | 'long' | 'extreme';
    itemName?: string;
    twoHanded?: boolean;
    qualities: { quality: string; value?: number }[];
  }[];
  abilities: { nameKey: string; descriptionKey: string }[];
  inventory: { itemName: string; quantity: number; equipped: boolean }[];
}

export const BESTIARY_ENTRIES: BestiaryEntryData[] = [
  // ===== NORMAL (Humanoid NPC) =====
  {
    slug: 'railroadAgent',
    nameKey: 'bestiary.creatures.railroadAgent.name',
    descriptionKey: 'bestiary.creatures.railroadAgent.description',
    emoji: '🕵️',
    statBlockType: 'normal',
    category: 'human',
    bodyType: 'humanoid',
    level: 7,
    xpReward: 39,
    hp: 13,
    defense: 1,
    initiative: 12,
    meleeDamageBonus: 0,
    carryCapacity: 110,
    maxLuckPoints: 0,
    wealth: 2,
    attributes: {
      strength: 5,
      perception: 7,
      endurance: 6,
      charisma: 6,
      intelligence: 6,
      agility: 5,
      luck: 4,
    },
    skills: [
      { skill: 'smallGuns', rank: 2, isTagSkill: true },
      { skill: 'sneak', rank: 3, isTagSkill: true },
      { skill: 'energyWeapons', rank: 1 },
      { skill: 'meleeWeapons', rank: 1 },
      { skill: 'lockpick', rank: 2 },
      { skill: 'speech', rank: 1 },
      { skill: 'medicine', rank: 1 },
      { skill: 'repair', rank: 1 },
      { skill: 'science', rank: 2 },
      { skill: 'survival', rank: 2 },
      { skill: 'barter', rank: 1 },
    ],
    dr: [
      { location: 'head', drPhysical: 0, drEnergy: 0, drRadiation: 0, drPoison: 0 },
      { location: 'torso', drPhysical: 1, drEnergy: 1, drRadiation: 0, drPoison: 0 },
      { location: 'armLeft', drPhysical: 1, drEnergy: 1, drRadiation: 0, drPoison: 0 },
      { location: 'armRight', drPhysical: 1, drEnergy: 1, drRadiation: 0, drPoison: 0 },
      { location: 'legLeft', drPhysical: 1, drEnergy: 1, drRadiation: 0, drPoison: 0 },
      { location: 'legRight', drPhysical: 1, drEnergy: 1, drRadiation: 0, drPoison: 0 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.unarmed',
        skill: 'unarmed',
        damage: 2,
        damageType: 'physical',
        range: 'close',
        qualities: [],
      },
      {
        nameKey: 'bestiary.attacks.huntingRifle',
        skill: 'smallGuns',
        damage: 6,
        damageType: 'physical',
        range: 'medium',
        itemName: 'Hunting Rifle',
        twoHanded: true,
        fireRate: 0,
        qualities: [{ quality: 'piercing', value: 1 }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.railroadAgent.name',
        descriptionKey: 'bestiary.abilities.railroadAgent.description',
      },
    ],
    inventory: [
      { itemName: 'Sturdy Clothes', quantity: 1, equipped: true },
      { itemName: 'Hunting Rifle', quantity: 1, equipped: true },
    ],
  },

  // ===== CREATURE =====
  {
    slug: 'zetan',
    nameKey: 'bestiary.creatures.zetan.name',
    descriptionKey: 'bestiary.creatures.zetan.description',
    emoji: '👽',
    statBlockType: 'creature',
    category: 'alien',
    bodyType: 'humanoid',
    level: 8,
    xpReward: 38,
    hp: 14,
    defense: 1,
    initiative: 12,
    meleeDamageBonus: 0,
    carryCapacity: 0,
    maxLuckPoints: 0,
    attributes: {
      body: 7,
      mind: 5,
    },
    skills: [
      { skill: 'melee', rank: 0 },
      { skill: 'ranged', rank: 4 },
      { skill: 'other', rank: 2 },
    ],
    dr: [
      { location: 'all', drPhysical: 1, drEnergy: 3, drRadiation: 0, drPoison: 0 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.alienBlasterPistol',
        skill: 'ranged',
        damage: 5,
        damageType: 'energy',
        range: 'close',
        fireRate: 2,
        itemName: 'Alien Blaster Pistol',
        qualities: [{ quality: 'reliable' }, { quality: 'blast' }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.alien.name',
        descriptionKey: 'bestiary.abilities.alien.description',
      },
    ],
    inventory: [
      { itemName: 'Alien Blaster Pistol', quantity: 1, equipped: true },
    ],
  },

  // ===== MORE CREATURES =====
  {
    slug: 'radroach',
    nameKey: 'bestiary.creatures.radroach.name',
    descriptionKey: 'bestiary.creatures.radroach.description',
    emoji: '🪳',
    statBlockType: 'creature',
    category: 'insect',
    bodyType: 'insect',
    level: 1,
    xpReward: 10,
    hp: 6,
    defense: 2,
    initiative: 9,
    attributes: {
      body: 5,
      mind: 4,
    },
    skills: [
      { skill: 'melee', rank: 1 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 2 },
    ],
    dr: [
      { location: 'all', drPhysical: 0, drEnergy: 0, drRadiation: -1, drPoison: -1 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.bite',
        skill: 'melee',
        damage: 1,
        damageType: 'physical',
        range: 'close',
        qualities: [{ quality: 'radioactive' }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.poisonImmune.name',
        descriptionKey: 'bestiary.abilities.poisonImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.small.name',
        descriptionKey: 'bestiary.abilities.small.description',
      },
      {
        nameKey: 'bestiary.abilities.stealthy.name',
        descriptionKey: 'bestiary.abilities.stealthy.description',
      },
      {
        nameKey: 'bestiary.abilities.butcheringRadroach.name',
        descriptionKey: 'bestiary.abilities.butcheringRadroach.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'deathclaw',
    nameKey: 'bestiary.creatures.deathclaw.name',
    descriptionKey: 'bestiary.creatures.deathclaw.description',
    emoji: '🦎',
    statBlockType: 'creature',
    category: 'abomination',
    bodyType: 'humanoid',
    level: 11,
    xpReward: 81,
    hp: 31,
    defense: 1,
    initiative: 14,
    attributes: {
      body: 9,
      mind: 5,
    },
    skills: [
      { skill: 'melee', rank: 5 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 3 },
    ],
    dr: [
      { location: 'all', drPhysical: 6, drEnergy: 9, drRadiation: -1, drPoison: 9 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.claws',
        skill: 'melee',
        damage: 6,
        damageType: 'physical',
        range: 'close',
        qualities: [{ quality: 'piercing', value: 1 }],
      },
      {
        nameKey: 'bestiary.attacks.rush',
        skill: 'melee',
        damage: 4,
        damageType: 'physical',
        range: 'close',
        qualities: [{ quality: 'stun' }],
      },
      {
        nameKey: 'bestiary.attacks.heavyObject',
        skill: 'ranged',
        damage: 4,
        damageType: 'physical',
        range: 'medium',
        qualities: [{ quality: 'stun' }, { quality: 'thrown' }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.large.name',
        descriptionKey: 'bestiary.abilities.large.description',
      },
      {
        nameKey: 'bestiary.abilities.keenSenses.name',
        descriptionKey: 'bestiary.abilities.keenSenses.description',
      },
      {
        nameKey: 'bestiary.abilities.shredding.name',
        descriptionKey: 'bestiary.abilities.shredding.description',
      },
      {
        nameKey: 'bestiary.abilities.weakPoint.name',
        descriptionKey: 'bestiary.abilities.weakPoint.description',
      },
      {
        nameKey: 'bestiary.abilities.extraordinaryStrength.name',
        descriptionKey: 'bestiary.abilities.extraordinaryStrength.description',
      },
      {
        nameKey: 'bestiary.abilities.butcheringDeathclaw.name',
        descriptionKey: 'bestiary.abilities.butcheringDeathclaw.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'feralGhoul',
    nameKey: 'bestiary.creatures.feralGhoul.name',
    descriptionKey: 'bestiary.creatures.feralGhoul.description',
    emoji: '🧟',
    statBlockType: 'creature',
    category: 'ghoul',
    bodyType: 'humanoid',
    level: 3,
    xpReward: 10,
    hp: 8,
    defense: 1,
    initiative: 10,
    attributes: {
      body: 5,
      mind: 5,
    },
    skills: [
      { skill: 'melee', rank: 3 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 2 },
    ],
    dr: [
      { location: 'all', drPhysical: 0, drEnergy: 0, drRadiation: -1, drPoison: -1 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.unarmed',
        skill: 'melee',
        damage: 3,
        damageType: 'physical',
        range: 'close',
        qualities: [{ quality: 'radioactive' }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.poisonImmune.name',
        descriptionKey: 'bestiary.abilities.poisonImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.feral.name',
        descriptionKey: 'bestiary.abilities.feral.description',
      },
      {
        nameKey: 'bestiary.abilities.ghoul.name',
        descriptionKey: 'bestiary.abilities.ghoul.description',
      },
      {
        nameKey: 'bestiary.abilities.playingDead.name',
        descriptionKey: 'bestiary.abilities.playingDead.description',
      },
      {
        nameKey: 'bestiary.abilities.lootFeralGhoul.name',
        descriptionKey: 'bestiary.abilities.lootFeralGhoul.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'glowingOne',
    nameKey: 'bestiary.creatures.glowingOne.name',
    descriptionKey: 'bestiary.creatures.glowingOne.description',
    emoji: '☢️',
    statBlockType: 'creature',
    category: 'ghoul',
    bodyType: 'humanoid',
    level: 9,
    xpReward: 67,
    hp: 21,
    defense: 1,
    initiative: 12,
    attributes: {
      body: 8,
      mind: 5,
    },
    skills: [
      { skill: 'melee', rank: 5 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 3 },
    ],
    dr: [
      { location: 'all', drPhysical: 4, drEnergy: 3, drRadiation: -1, drPoison: -1 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.unarmed',
        skill: 'melee',
        damage: 7,
        damageType: 'physical',
        range: 'close',
        qualities: [{ quality: 'radioactive' }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.radiationPulse.name',
        descriptionKey: 'bestiary.abilities.radiationPulse.description',
      },
      {
        nameKey: 'bestiary.abilities.luminescence.name',
        descriptionKey: 'bestiary.abilities.luminescence.description',
      },
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.poisonImmune.name',
        descriptionKey: 'bestiary.abilities.poisonImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.feral.name',
        descriptionKey: 'bestiary.abilities.feral.description',
      },
      {
        nameKey: 'bestiary.abilities.ghoul.name',
        descriptionKey: 'bestiary.abilities.ghoul.description',
      },
      {
        nameKey: 'bestiary.abilities.playingDead.name',
        descriptionKey: 'bestiary.abilities.playingDead.description',
      },
      {
        nameKey: 'bestiary.abilities.lootGlowingOne.name',
        descriptionKey: 'bestiary.abilities.lootGlowingOne.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'yaoGuai',
    nameKey: 'bestiary.creatures.yaoGuai.name',
    descriptionKey: 'bestiary.creatures.yaoGuai.description',
    emoji: '🐻',
    statBlockType: 'creature',
    category: 'animal',
    bodyType: 'quadruped',
    level: 14,
    xpReward: 102,
    hp: 37,
    defense: 1,
    initiative: 15,
    meleeDamageBonus: 0,
    attributes: {
      body: 9,
      mind: 6,
    },
    skills: [
      { skill: 'melee', rank: 5 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 4 },
    ],
    dr: [
      { location: 'all', drPhysical: 2, drEnergy: 1, drRadiation: -1, drPoison: 2 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.bite',
        skill: 'melee',
        damage: 10,
        damageType: 'physical',
        range: 'close',
        qualities: [{ quality: 'piercing', value: 1 }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.large.name',
        descriptionKey: 'bestiary.abilities.large.description',
      },
      {
        nameKey: 'bestiary.abilities.aggressive.name',
        descriptionKey: 'bestiary.abilities.aggressive.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'dogmeat',
    nameKey: 'bestiary.creatures.dogmeat.name',
    descriptionKey: 'bestiary.creatures.dogmeat.description',
    emoji: '🐕',
    statBlockType: 'creature',
    category: 'animal',
    bodyType: 'quadruped',
    level: 1,
    xpReward: 0,
    hp: 6,
    defense: 1,
    initiative: 0,
    carryCapacity: 25,
    attributes: {
      body: 5,
      mind: 4,
    },
    skills: [
      { skill: 'melee', rank: 2 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 1 },
    ],
    dr: [
      { location: 'all', drPhysical: 0, drEnergy: 0, drRadiation: 0, drPoison: 0 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.bite',
        skill: 'melee',
        damage: 2,
        damageType: 'physical',
        range: 'close',
        qualities: [{ quality: 'vicious' }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.keenSenses.name',
        descriptionKey: 'bestiary.abilities.keenSenses.description',
      },
      {
        nameKey: 'bestiary.abilities.attackDog.name',
        descriptionKey: 'bestiary.abilities.attackDog.description',
      },
      {
        nameKey: 'bestiary.abilities.companion.name',
        descriptionKey: 'bestiary.abilities.companion.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'dog',
    nameKey: 'bestiary.creatures.dog.name',
    descriptionKey: 'bestiary.creatures.dog.description',
    emoji: '🐕‍🦺',
    statBlockType: 'creature',
    category: 'animal',
    bodyType: 'quadruped',
    level: 3,
    xpReward: 24,
    hp: 8,
    defense: 1,
    initiative: 10,
    attributes: {
      body: 5,
      mind: 5,
    },
    skills: [
      { skill: 'melee', rank: 3 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 2 },
    ],
    dr: [
      { location: 'all', drPhysical: 0, drEnergy: 0, drRadiation: 0, drPoison: 0 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.bite',
        skill: 'melee',
        damage: 4,
        damageType: 'physical',
        range: 'close',
        qualities: [],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.keenSenses.name',
        descriptionKey: 'bestiary.abilities.keenSenses.description',
      },
      {
        nameKey: 'bestiary.abilities.butcheringDog.name',
        descriptionKey: 'bestiary.abilities.butcheringDog.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'mongrel',
    nameKey: 'bestiary.creatures.mongrel.name',
    descriptionKey: 'bestiary.creatures.mongrel.description',
    emoji: '🐕‍🦺',
    statBlockType: 'creature',
    category: 'abomination',
    bodyType: 'quadruped',
    level: 3,
    xpReward: 24,
    hp: 8,
    defense: 1,
    initiative: 10,
    attributes: {
      body: 6,
      mind: 4,
    },
    skills: [
      { skill: 'melee', rank: 3 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 2 },
    ],
    dr: [
      { location: 'all', drPhysical: 0, drEnergy: 0, drRadiation: 0, drPoison: 0 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.bite',
        skill: 'melee',
        damage: 4,
        damageType: 'physical',
        range: 'close',
        qualities: [],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.keenSenses.name',
        descriptionKey: 'bestiary.abilities.keenSenses.description',
      },
      {
        nameKey: 'bestiary.abilities.feral.name',
        descriptionKey: 'bestiary.abilities.feral.description',
      },
      {
        nameKey: 'bestiary.abilities.aggressive.name',
        descriptionKey: 'bestiary.abilities.aggressive.description',
      },
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.butcheringDog.name',
        descriptionKey: 'bestiary.abilities.butcheringDog.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'misterHandy',
    nameKey: 'bestiary.creatures.misterHandy.name',
    descriptionKey: 'bestiary.creatures.misterHandy.description',
    emoji: '🔧',
    statBlockType: 'normal',
    category: 'robot',
    bodyType: 'robot',
    level: 6,
    xpReward: 90,
    hp: 15,
    defense: 1,
    initiative: 17,
    meleeDamageBonus: 0,
    carryCapacity: 75,
    maxLuckPoints: 2,
    attributes: {
      strength: 6,
      perception: 7,
      endurance: 5,
      charisma: 5,
      intelligence: 7,
      agility: 6,
      luck: 4,
    },
    skills: [
      { skill: 'energyWeapons', rank: 3, isTagSkill: true },
      { skill: 'meleeWeapons', rank: 3, isTagSkill: true },
      { skill: 'speech', rank: 3, isTagSkill: true },
      { skill: 'smallGuns', rank: 1 },
      { skill: 'medicine', rank: 1 },
      { skill: 'repair', rank: 2 },
    ],
    dr: [
      { location: 'head', drPhysical: 1, drEnergy: 1, drRadiation: -1, drPoison: -1 },
      { location: 'torso', drPhysical: 1, drEnergy: 1, drRadiation: -1, drPoison: -1 },
      { location: 'armLeft', drPhysical: 1, drEnergy: 1, drRadiation: -1, drPoison: -1 },
      { location: 'armRight', drPhysical: 1, drEnergy: 1, drRadiation: -1, drPoison: -1 },
      { location: 'legLeft', drPhysical: 1, drEnergy: 1, drRadiation: -1, drPoison: -1 },
      { location: 'legRight', drPhysical: 1, drEnergy: 1, drRadiation: -1, drPoison: -1 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.pincers',
        skill: 'meleeWeapons',
        damage: 3,
        damageType: 'physical',
        range: 'close',
        qualities: [],
      },
      {
        nameKey: 'bestiary.attacks.circularSaw',
        skill: 'meleeWeapons',
        damage: 3,
        damageType: 'physical',
        range: 'close',
        qualities: [{ quality: 'piercing', value: 1 }],
      },
      {
        nameKey: 'bestiary.attacks.flamethrower',
        skill: 'energyWeapons',
        damage: 3,
        damageType: 'energy',
        range: 'close',
        fireRate: 1,
        qualities: [{ quality: 'persistent' }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.robotMisterHandy.name',
        descriptionKey: 'bestiary.abilities.robotMisterHandy.description',
      },
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.poisonImmune.name',
        descriptionKey: 'bestiary.abilities.poisonImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.diseaseImmune.name',
        descriptionKey: 'bestiary.abilities.diseaseImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.misterHandyAbility.name',
        descriptionKey: 'bestiary.abilities.misterHandyAbility.description',
      },
      {
        nameKey: 'bestiary.abilities.salvageMisterHandy.name',
        descriptionKey: 'bestiary.abilities.salvageMisterHandy.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'sentryBot',
    nameKey: 'bestiary.creatures.sentryBot.name',
    descriptionKey: 'bestiary.creatures.sentryBot.description',
    emoji: '🏋️',
    statBlockType: 'creature',
    category: 'robot',
    bodyType: 'robot',
    level: 15,
    xpReward: 109,
    hp: 40,
    defense: 1,
    initiative: 16,
    attributes: {
      body: 10,
      mind: 6,
    },
    skills: [
      { skill: 'melee', rank: 4 },
      { skill: 'ranged', rank: 5 },
      { skill: 'other', rank: 4 },
    ],
    dr: [
      { location: 'all', drPhysical: 6, drEnergy: 5, drRadiation: -1, drPoison: -1 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.machineGun',
        skill: 'ranged',
        damage: 5,
        damageType: 'physical',
        range: 'medium',
        fireRate: 5,
        qualities: [{ quality: 'burst' }, { quality: 'gatling' }],
      },
      {
        nameKey: 'bestiary.attacks.unarmed',
        skill: 'melee',
        damage: 8,
        damageType: 'physical',
        range: 'close',
        qualities: [{ quality: 'vicious' }],
      },
      {
        nameKey: 'bestiary.attacks.missileLauncher',
        skill: 'ranged',
        damage: 11,
        damageType: 'physical',
        range: 'long',
        qualities: [{ quality: 'blast' }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.robotSentryBot.name',
        descriptionKey: 'bestiary.abilities.robotSentryBot.description',
      },
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.poisonImmune.name',
        descriptionKey: 'bestiary.abilities.poisonImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.diseaseImmune.name',
        descriptionKey: 'bestiary.abilities.diseaseImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.keenSenses.name',
        descriptionKey: 'bestiary.abilities.keenSenses.description',
      },
      {
        nameKey: 'bestiary.abilities.aggressive.name',
        descriptionKey: 'bestiary.abilities.aggressive.description',
      },
      {
        nameKey: 'bestiary.abilities.selfDestructSentryBot.name',
        descriptionKey: 'bestiary.abilities.selfDestructSentryBot.description',
      },
      {
        nameKey: 'bestiary.abilities.salvageSentryBot.name',
        descriptionKey: 'bestiary.abilities.salvageSentryBot.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'protectron',
    nameKey: 'bestiary.creatures.protectron.name',
    descriptionKey: 'bestiary.creatures.protectron.description',
    emoji: '🤖',
    statBlockType: 'creature',
    category: 'robot',
    bodyType: 'robot',
    level: 3,
    xpReward: 24,
    hp: 8,
    defense: 1,
    initiative: 10,
    attributes: {
      body: 5,
      mind: 5,
    },
    skills: [
      { skill: 'melee', rank: 2 },
      { skill: 'ranged', rank: 2 },
      { skill: 'other', rank: 2 },
    ],
    dr: [
      { location: 'all', drPhysical: 4, drEnergy: 3, drRadiation: -1, drPoison: -1 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.pincers',
        skill: 'melee',
        damage: 3,
        damageType: 'physical',
        range: 'close',
        qualities: [],
      },
      {
        nameKey: 'bestiary.attacks.armLasers',
        skill: 'ranged',
        damage: 3,
        damageType: 'energy',
        range: 'close',
        fireRate: 4,
        qualities: [{ quality: 'burst' }, { quality: 'piercing', value: 1 }],
      },
      {
        nameKey: 'bestiary.attacks.selfDestruct',
        skill: 'ranged',
        damage: 6,
        damageType: 'physical',
        range: 'close',
        qualities: [{ quality: 'blast' }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.robotProtectron.name',
        descriptionKey: 'bestiary.abilities.robotProtectron.description',
      },
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.poisonImmune.name',
        descriptionKey: 'bestiary.abilities.poisonImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.diseaseImmune.name',
        descriptionKey: 'bestiary.abilities.diseaseImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.armLasersAbility.name',
        descriptionKey: 'bestiary.abilities.armLasersAbility.description',
      },
      {
        nameKey: 'bestiary.abilities.letLoose.name',
        descriptionKey: 'bestiary.abilities.letLoose.description',
      },
      {
        nameKey: 'bestiary.abilities.selfDestructProtectron.name',
        descriptionKey: 'bestiary.abilities.selfDestructProtectron.description',
      },
      {
        nameKey: 'bestiary.abilities.salvageProtectron.name',
        descriptionKey: 'bestiary.abilities.salvageProtectron.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'misterGutsy',
    nameKey: 'bestiary.creatures.misterGutsy.name',
    descriptionKey: 'bestiary.creatures.misterGutsy.description',
    emoji: '🎖️',
    statBlockType: 'normal',
    category: 'robot',
    bodyType: 'robot',
    level: 7,
    xpReward: 104,
    hp: 15,
    defense: 1,
    initiative: 18,
    meleeDamageBonus: 0,
    carryCapacity: 75,
    maxLuckPoints: 2,
    attributes: {
      strength: 6,
      perception: 7,
      endurance: 5,
      charisma: 4,
      intelligence: 7,
      agility: 7,
      luck: 4,
    },
    skills: [
      { skill: 'energyWeapons', rank: 4, isTagSkill: true },
      { skill: 'meleeWeapons', rank: 3, isTagSkill: true },
      { skill: 'smallGuns', rank: 4, isTagSkill: true },
      { skill: 'speech', rank: 1 },
      { skill: 'repair', rank: 1 },
    ],
    dr: [
      { location: 'head', drPhysical: 2, drEnergy: 2, drRadiation: -1, drPoison: -1 },
      { location: 'torso', drPhysical: 2, drEnergy: 2, drRadiation: -1, drPoison: -1 },
      { location: 'armLeft', drPhysical: 2, drEnergy: 2, drRadiation: -1, drPoison: -1 },
      { location: 'armRight', drPhysical: 2, drEnergy: 2, drRadiation: -1, drPoison: -1 },
      { location: 'legLeft', drPhysical: 2, drEnergy: 2, drRadiation: -1, drPoison: -1 },
      { location: 'legRight', drPhysical: 2, drEnergy: 2, drRadiation: -1, drPoison: -1 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.pincers',
        skill: 'meleeWeapons',
        damage: 4,
        damageType: 'physical',
        range: 'close',
        qualities: [],
      },
      {
        nameKey: 'bestiary.attacks.autoPistol10mm',
        skill: 'smallGuns',
        damage: 5,
        damageType: 'physical',
        range: 'close',
        fireRate: 4,
        qualities: [{ quality: 'burst' }, { quality: 'closeQuarters' }, { quality: 'reliable' }],
      },
      {
        nameKey: 'bestiary.attacks.flamethrower',
        skill: 'energyWeapons',
        damage: 3,
        damageType: 'energy',
        range: 'close',
        fireRate: 1,
        qualities: [{ quality: 'persistent' }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.robotMisterGutsy.name',
        descriptionKey: 'bestiary.abilities.robotMisterGutsy.description',
      },
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.poisonImmune.name',
        descriptionKey: 'bestiary.abilities.poisonImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.diseaseImmune.name',
        descriptionKey: 'bestiary.abilities.diseaseImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.misterHandyAbility.name',
        descriptionKey: 'bestiary.abilities.misterHandyAbility.description',
      },
      {
        nameKey: 'bestiary.abilities.misterGutsyAbility.name',
        descriptionKey: 'bestiary.abilities.misterGutsyAbility.description',
      },
      {
        nameKey: 'bestiary.abilities.salvageMisterGutsy.name',
        descriptionKey: 'bestiary.abilities.salvageMisterGutsy.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'missNanny',
    nameKey: 'bestiary.creatures.missNanny.name',
    descriptionKey: 'bestiary.creatures.missNanny.description',
    emoji: '👩‍⚕️',
    statBlockType: 'normal',
    category: 'robot',
    bodyType: 'robot',
    level: 6,
    xpReward: 90,
    hp: 15,
    defense: 1,
    initiative: 17,
    meleeDamageBonus: 0,
    carryCapacity: 75,
    maxLuckPoints: 2,
    attributes: {
      strength: 6,
      perception: 7,
      endurance: 5,
      charisma: 5,
      intelligence: 7,
      agility: 6,
      luck: 4,
    },
    skills: [
      { skill: 'energyWeapons', rank: 3, isTagSkill: true },
      { skill: 'meleeWeapons', rank: 3, isTagSkill: true },
      { skill: 'medicine', rank: 2, isTagSkill: true },
      { skill: 'smallGuns', rank: 1 },
      { skill: 'speech', rank: 3 },
      { skill: 'repair', rank: 1 },
    ],
    dr: [
      { location: 'head', drPhysical: 1, drEnergy: 1, drRadiation: -1, drPoison: -1 },
      { location: 'torso', drPhysical: 1, drEnergy: 1, drRadiation: -1, drPoison: -1 },
      { location: 'armLeft', drPhysical: 1, drEnergy: 1, drRadiation: -1, drPoison: -1 },
      { location: 'armRight', drPhysical: 1, drEnergy: 1, drRadiation: -1, drPoison: -1 },
      { location: 'legLeft', drPhysical: 1, drEnergy: 1, drRadiation: -1, drPoison: -1 },
      { location: 'legRight', drPhysical: 1, drEnergy: 1, drRadiation: -1, drPoison: -1 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.pincers',
        skill: 'meleeWeapons',
        damage: 3,
        damageType: 'physical',
        range: 'close',
        qualities: [],
      },
      {
        nameKey: 'bestiary.attacks.circularSaw',
        skill: 'meleeWeapons',
        damage: 3,
        damageType: 'physical',
        range: 'close',
        qualities: [{ quality: 'piercing', value: 1 }],
      },
      {
        nameKey: 'bestiary.attacks.flamethrower',
        skill: 'energyWeapons',
        damage: 3,
        damageType: 'energy',
        range: 'close',
        fireRate: 1,
        qualities: [{ quality: 'persistent' }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.robotMisterHandy.name',
        descriptionKey: 'bestiary.abilities.robotMisterHandy.description',
      },
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.poisonImmune.name',
        descriptionKey: 'bestiary.abilities.poisonImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.diseaseImmune.name',
        descriptionKey: 'bestiary.abilities.diseaseImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.misterHandyAbility.name',
        descriptionKey: 'bestiary.abilities.misterHandyAbility.description',
      },
      {
        nameKey: 'bestiary.abilities.salvageMisterHandy.name',
        descriptionKey: 'bestiary.abilities.salvageMisterHandy.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'assaultron',
    nameKey: 'bestiary.creatures.assaultron.name',
    descriptionKey: 'bestiary.creatures.assaultron.description',
    emoji: '🦿',
    statBlockType: 'creature',
    category: 'robot',
    bodyType: 'robot',
    level: 13,
    xpReward: 95,
    hp: 22,
    defense: 1,
    initiative: 15,
    attributes: {
      body: 9,
      mind: 6,
    },
    skills: [
      { skill: 'melee', rank: 5 },
      { skill: 'ranged', rank: 5 },
      { skill: 'other', rank: 4 },
    ],
    dr: [
      { location: 'all', drPhysical: 3, drEnergy: 3, drRadiation: -1, drPoison: -1 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.unarmed',
        skill: 'melee',
        damage: 9,
        damageType: 'physical',
        range: 'close',
        qualities: [],
      },
      {
        nameKey: 'bestiary.attacks.laser',
        skill: 'ranged',
        damage: 9,
        damageType: 'energy',
        range: 'long',
        qualities: [{ quality: 'vicious' }],
      },
      {
        nameKey: 'bestiary.attacks.selfDestruct',
        skill: 'ranged',
        damage: 6,
        damageType: 'physical',
        range: 'close',
        qualities: [{ quality: 'blast' }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.robotAssaultron.name',
        descriptionKey: 'bestiary.abilities.robotAssaultron.description',
      },
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.poisonImmune.name',
        descriptionKey: 'bestiary.abilities.poisonImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.diseaseImmune.name',
        descriptionKey: 'bestiary.abilities.diseaseImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.keenSenses.name',
        descriptionKey: 'bestiary.abilities.keenSenses.description',
      },
      {
        nameKey: 'bestiary.abilities.selfDestructAbility.name',
        descriptionKey: 'bestiary.abilities.selfDestructAbility.description',
      },
      {
        nameKey: 'bestiary.abilities.nightVision.name',
        descriptionKey: 'bestiary.abilities.nightVision.description',
      },
      {
        nameKey: 'bestiary.abilities.salvageAssaultron.name',
        descriptionKey: 'bestiary.abilities.salvageAssaultron.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'eyebot',
    nameKey: 'bestiary.creatures.eyebot.name',
    descriptionKey: 'bestiary.creatures.eyebot.description',
    emoji: '🤖',
    statBlockType: 'creature',
    category: 'robot',
    bodyType: 'robot',
    level: 2,
    xpReward: 17,
    hp: 5,
    defense: 2,
    initiative: 9,
    attributes: {
      body: 5,
      mind: 4,
    },
    skills: [
      { skill: 'melee', rank: 0 },
      { skill: 'ranged', rank: 3 },
      { skill: 'other', rank: 1 },
    ],
    dr: [
      { location: 'all', drPhysical: 2, drEnergy: 2, drRadiation: -1, drPoison: -1 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.laser',
        skill: 'ranged',
        damage: 4,
        damageType: 'energy',
        range: 'medium',
        qualities: [],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.robot.name',
        descriptionKey: 'bestiary.abilities.robot.description',
      },
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.poisonImmune.name',
        descriptionKey: 'bestiary.abilities.poisonImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.diseaseImmune.name',
        descriptionKey: 'bestiary.abilities.diseaseImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.small.name',
        descriptionKey: 'bestiary.abilities.small.description',
      },
      {
        nameKey: 'bestiary.abilities.radioTransmission.name',
        descriptionKey: 'bestiary.abilities.radioTransmission.description',
      },
      {
        nameKey: 'bestiary.abilities.salvageEyebot.name',
        descriptionKey: 'bestiary.abilities.salvageEyebot.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'bloodyBug',
    nameKey: 'bestiary.creatures.bloodyBug.name',
    descriptionKey: 'bestiary.creatures.bloodyBug.description',
    emoji: '🦟',
    statBlockType: 'creature',
    category: 'insect',
    bodyType: 'insect',
    level: 5,
    xpReward: 38,
    hp: 9,
    defense: 2,
    initiative: 11,
    attributes: {
      body: 6,
      mind: 5,
    },
    skills: [
      { skill: 'melee', rank: 1 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 2 },
    ],
    dr: [
      { location: 'all', drPhysical: 0, drEnergy: 0, drRadiation: -1, drPoison: -1 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.proboscis',
        skill: 'melee',
        damage: 5,
        damageType: 'physical',
        range: 'close',
        qualities: [],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.flight.name',
        descriptionKey: 'bestiary.abilities.flight.description',
      },
      {
        nameKey: 'bestiary.abilities.small.name',
        descriptionKey: 'bestiary.abilities.small.description',
      },
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.butcheringBloodyBug.name',
        descriptionKey: 'bestiary.abilities.butcheringBloodyBug.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'radstag',
    nameKey: 'bestiary.creatures.radstag.name',
    descriptionKey: 'bestiary.creatures.radstag.description',
    emoji: '🦌',
    statBlockType: 'creature',
    category: 'animal',
    bodyType: 'quadruped',
    level: 5,
    xpReward: 38,
    hp: 10,
    defense: 1,
    initiative: 10,
    attributes: {
      body: 5,
      mind: 5,
    },
    skills: [
      { skill: 'melee', rank: 3 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 2 },
    ],
    dr: [
      { location: 'all', drPhysical: 1, drEnergy: 0, drRadiation: -1, drPoison: 0 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.antlers',
        skill: 'melee',
        damage: 5,
        damageType: 'physical',
        range: 'close',
        qualities: [{ quality: 'piercing', value: 1 }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.butcheringRadstag.name',
        descriptionKey: 'bestiary.abilities.butcheringRadstag.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'radscorpion',
    nameKey: 'bestiary.creatures.radscorpion.name',
    descriptionKey: 'bestiary.creatures.radscorpion.description',
    emoji: '🦂',
    statBlockType: 'creature',
    category: 'insect',
    bodyType: 'insect',
    level: 7,
    xpReward: 74,
    hp: 21,
    defense: 1,
    initiative: 12,
    attributes: {
      body: 7,
      mind: 5,
    },
    skills: [
      { skill: 'melee', rank: 5 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 3 },
    ],
    dr: [
      { location: 'all', drPhysical: 4, drEnergy: 3, drRadiation: -1, drPoison: -1 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.pincers',
        skill: 'melee',
        damage: 4,
        damageType: 'physical',
        range: 'close',
        qualities: [{ quality: 'vicious' }],
      },
      {
        nameKey: 'bestiary.attacks.stinger',
        skill: 'melee',
        damage: 3,
        damageType: 'poison',
        range: 'close',
        qualities: [{ quality: 'persistent' }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.poisonImmune.name',
        descriptionKey: 'bestiary.abilities.poisonImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.large.name',
        descriptionKey: 'bestiary.abilities.large.description',
      },
      {
        nameKey: 'bestiary.abilities.burrowingRadscorpion.name',
        descriptionKey: 'bestiary.abilities.burrowingRadscorpion.description',
      },
      {
        nameKey: 'bestiary.abilities.weakPointHead.name',
        descriptionKey: 'bestiary.abilities.weakPointHead.description',
      },
      {
        nameKey: 'bestiary.abilities.butcheringRadscorpion.name',
        descriptionKey: 'bestiary.abilities.butcheringRadscorpion.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'moleRat',
    nameKey: 'bestiary.creatures.moleRat.name',
    descriptionKey: 'bestiary.creatures.moleRat.description',
    emoji: '🐀',
    statBlockType: 'creature',
    category: 'animal',
    bodyType: 'quadruped',
    level: 2,
    xpReward: 17,
    hp: 7,
    defense: 1,
    initiative: 9,
    attributes: {
      body: 5,
      mind: 4,
    },
    skills: [
      { skill: 'melee', rank: 2 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 2 },
    ],
    dr: [
      { location: 'all', drPhysical: 1, drEnergy: 0, drRadiation: -1, drPoison: 0 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.bite',
        skill: 'melee',
        damage: 4,
        damageType: 'physical',
        range: 'close',
        qualities: [{ quality: 'piercing', value: 1 }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.burrowingMoleRat.name',
        descriptionKey: 'bestiary.abilities.burrowingMoleRat.description',
      },
      {
        nameKey: 'bestiary.abilities.keenSenses.name',
        descriptionKey: 'bestiary.abilities.keenSenses.description',
      },
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.butcheringMoleRat.name',
        descriptionKey: 'bestiary.abilities.butcheringMoleRat.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'mutantHound',
    nameKey: 'bestiary.creatures.mutantHound.name',
    descriptionKey: 'bestiary.creatures.mutantHound.description',
    emoji: '🐕',
    statBlockType: 'creature',
    category: 'superMutant',
    bodyType: 'quadruped',
    level: 4,
    xpReward: 31,
    hp: 10,
    defense: 1,
    initiative: 10,
    attributes: {
      body: 9,
      mind: 5,
    },
    skills: [
      { skill: 'melee', rank: 3 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 1 },
    ],
    dr: [
      { location: 'all', drPhysical: 1, drEnergy: 1, drRadiation: -1, drPoison: -1 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.bite',
        skill: 'melee',
        damage: 3,
        damageType: 'physical',
        range: 'close',
        qualities: [],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.poisonImmune.name',
        descriptionKey: 'bestiary.abilities.poisonImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.keenSenses.name',
        descriptionKey: 'bestiary.abilities.keenSenses.description',
      },
      {
        nameKey: 'bestiary.abilities.alertBark.name',
        descriptionKey: 'bestiary.abilities.alertBark.description',
      },
      {
        nameKey: 'bestiary.abilities.butcheringMutantHound.name',
        descriptionKey: 'bestiary.abilities.butcheringMutantHound.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'mirelurkSpawn',
    nameKey: 'bestiary.creatures.mirelurkSpawn.name',
    descriptionKey: 'bestiary.creatures.mirelurkSpawn.description',
    emoji: '🦀',
    statBlockType: 'creature',
    category: 'abomination',
    bodyType: 'insect',
    level: 1,
    xpReward: 10,
    hp: 5,
    defense: 2,
    initiative: 8,
    attributes: {
      body: 4,
      mind: 4,
    },
    skills: [
      { skill: 'melee', rank: 1 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 1 },
    ],
    dr: [
      { location: 'all', drPhysical: 0, drEnergy: 0, drRadiation: -1, drPoison: 0 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.pincers',
        skill: 'melee',
        damage: 3,
        damageType: 'physical',
        range: 'close',
        qualities: [],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.small.name',
        descriptionKey: 'bestiary.abilities.small.description',
      },
      {
        nameKey: 'bestiary.abilities.aquatic.name',
        descriptionKey: 'bestiary.abilities.aquatic.description',
      },
      {
        nameKey: 'bestiary.abilities.butcheringMirelurk.name',
        descriptionKey: 'bestiary.abilities.butcheringMirelurk.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'mirelurk',
    nameKey: 'bestiary.creatures.mirelurk.name',
    descriptionKey: 'bestiary.creatures.mirelurk.description',
    emoji: '🦀',
    statBlockType: 'creature',
    category: 'abomination',
    bodyType: 'insect',
    level: 7,
    xpReward: 45,
    hp: 14,
    defense: 1,
    initiative: 12,
    attributes: {
      body: 7,
      mind: 5,
    },
    skills: [
      { skill: 'melee', rank: 4 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 3 },
    ],
    dr: [
      { location: 'torso', drPhysical: 4, drEnergy: 2, drRadiation: -1, drPoison: 4 },
      { location: 'armLeft', drPhysical: 4, drEnergy: 2, drRadiation: -1, drPoison: 4 },
      { location: 'armRight', drPhysical: 4, drEnergy: 2, drRadiation: -1, drPoison: 4 },
      { location: 'legLeft', drPhysical: 4, drEnergy: 2, drRadiation: -1, drPoison: 4 },
      { location: 'legRight', drPhysical: 4, drEnergy: 2, drRadiation: -1, drPoison: 4 },
      { location: 'head', drPhysical: 1, drEnergy: 2, drRadiation: -1, drPoison: 2 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.pincers',
        skill: 'melee',
        damage: 6,
        damageType: 'physical',
        range: 'close',
        qualities: [],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.tinyWeakPoint.name',
        descriptionKey: 'bestiary.abilities.tinyWeakPoint.description',
      },
      {
        nameKey: 'bestiary.abilities.aquatic.name',
        descriptionKey: 'bestiary.abilities.aquatic.description',
      },
      {
        nameKey: 'bestiary.abilities.butcheringMirelurkAdult.name',
        descriptionKey: 'bestiary.abilities.butcheringMirelurkAdult.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'mirelurkHunter',
    nameKey: 'bestiary.creatures.mirelurkHunter.name',
    descriptionKey: 'bestiary.creatures.mirelurkHunter.description',
    emoji: '🦞',
    statBlockType: 'creature',
    category: 'abomination',
    bodyType: 'insect',
    level: 12,
    xpReward: 88,
    hp: 20,
    defense: 1,
    initiative: 14,
    attributes: {
      body: 8,
      mind: 6,
    },
    skills: [
      { skill: 'melee', rank: 5 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 4 },
    ],
    dr: [
      { location: 'torso', drPhysical: 4, drEnergy: 2, drRadiation: -1, drPoison: 4 },
      { location: 'armLeft', drPhysical: 4, drEnergy: 2, drRadiation: -1, drPoison: 4 },
      { location: 'armRight', drPhysical: 4, drEnergy: 2, drRadiation: -1, drPoison: 4 },
      { location: 'legLeft', drPhysical: 4, drEnergy: 2, drRadiation: -1, drPoison: 4 },
      { location: 'legRight', drPhysical: 4, drEnergy: 2, drRadiation: -1, drPoison: 4 },
      { location: 'head', drPhysical: 1, drEnergy: 2, drRadiation: -1, drPoison: 2 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.pincers',
        skill: 'melee',
        damage: 9,
        damageType: 'physical',
        range: 'close',
        qualities: [],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.tinyWeakPoint.name',
        descriptionKey: 'bestiary.abilities.tinyWeakPoint.description',
      },
      {
        nameKey: 'bestiary.abilities.aquatic.name',
        descriptionKey: 'bestiary.abilities.aquatic.description',
      },
      {
        nameKey: 'bestiary.abilities.butcheringMirelurkAdult.name',
        descriptionKey: 'bestiary.abilities.butcheringMirelurkAdult.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'mirelurkQueen',
    nameKey: 'bestiary.creatures.mirelurkQueen.name',
    descriptionKey: 'bestiary.creatures.mirelurkQueen.description',
    emoji: '👑🦀',
    statBlockType: 'creature',
    category: 'abomination',
    bodyType: 'insect',
    level: 19,
    xpReward: 137,
    hp: 50,
    defense: 1,
    initiative: 18,
    attributes: {
      body: 12,
      mind: 6,
    },
    skills: [
      { skill: 'melee', rank: 5 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 4 },
    ],
    dr: [
      { location: 'torso', drPhysical: 10, drEnergy: 7, drRadiation: -1, drPoison: 9 },
      { location: 'armLeft', drPhysical: 10, drEnergy: 7, drRadiation: -1, drPoison: 9 },
      { location: 'armRight', drPhysical: 10, drEnergy: 7, drRadiation: -1, drPoison: 9 },
      { location: 'legLeft', drPhysical: 10, drEnergy: 7, drRadiation: -1, drPoison: 9 },
      { location: 'legRight', drPhysical: 10, drEnergy: 7, drRadiation: -1, drPoison: 9 },
      { location: 'head', drPhysical: 5, drEnergy: 7, drRadiation: -1, drPoison: 9 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.pincers',
        skill: 'melee',
        damage: 12,
        damageType: 'physical',
        range: 'close',
        qualities: [{ quality: 'vicious' }],
      },
      {
        nameKey: 'bestiary.attacks.acidSpray',
        skill: 'melee',
        damage: 10,
        damageType: 'radiation',
        range: 'close',
        qualities: [{ quality: 'piercing', value: 1 }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.mirelurkBrood.name',
        descriptionKey: 'bestiary.abilities.mirelurkBrood.description',
      },
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.fearImmune.name',
        descriptionKey: 'bestiary.abilities.fearImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.tinyWeakPoint.name',
        descriptionKey: 'bestiary.abilities.tinyWeakPoint.description',
      },
      {
        nameKey: 'bestiary.abilities.aquatic.name',
        descriptionKey: 'bestiary.abilities.aquatic.description',
      },
      {
        nameKey: 'bestiary.abilities.large.name',
        descriptionKey: 'bestiary.abilities.large.description',
      },
      {
        nameKey: 'bestiary.abilities.aggressive.name',
        descriptionKey: 'bestiary.abilities.aggressive.description',
      },
      {
        nameKey: 'bestiary.abilities.lootMirelurkQueen.name',
        descriptionKey: 'bestiary.abilities.lootMirelurkQueen.description',
      },
      {
        nameKey: 'bestiary.abilities.butcheringMirelurkQueen.name',
        descriptionKey: 'bestiary.abilities.butcheringMirelurkQueen.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'bloatfly',
    nameKey: 'bestiary.creatures.bloatfly.name',
    descriptionKey: 'bestiary.creatures.bloatfly.description',
    emoji: '🪰',
    statBlockType: 'creature',
    category: 'insect',
    bodyType: 'insect',
    level: 5,
    xpReward: 38,
    hp: 9,
    defense: 3,
    initiative: 1,
    attributes: {
      body: 6,
      mind: 5,
    },
    skills: [
      { skill: 'melee', rank: 3 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 2 },
    ],
    dr: [
      { location: 'all', drPhysical: 0, drEnergy: 0, drRadiation: -1, drPoison: -1 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.sharpStinger',
        skill: 'melee',
        damage: 2,
        damageType: 'poison',
        range: 'close',
        qualities: [{ quality: 'persistent' }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.poisonImmune.name',
        descriptionKey: 'bestiary.abilities.poisonImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.small.name',
        descriptionKey: 'bestiary.abilities.small.description',
      },
      {
        nameKey: 'bestiary.abilities.flight.name',
        descriptionKey: 'bestiary.abilities.flight.description',
      },
      {
        nameKey: 'bestiary.abilities.diveAttack.name',
        descriptionKey: 'bestiary.abilities.diveAttack.description',
      },
      {
        nameKey: 'bestiary.abilities.butcheringBloatfly.name',
        descriptionKey: 'bestiary.abilities.butcheringBloatfly.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'brahmin',
    nameKey: 'bestiary.creatures.brahmin.name',
    descriptionKey: 'bestiary.creatures.brahmin.description',
    emoji: '🐄',
    statBlockType: 'creature',
    category: 'animal',
    bodyType: 'quadruped',
    level: 3,
    xpReward: 24,
    hp: 9,
    defense: 1,
    initiative: 10,
    attributes: {
      body: 6,
      mind: 4,
    },
    skills: [
      { skill: 'melee', rank: 1 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 2 },
    ],
    dr: [
      { location: 'all', drPhysical: 1, drEnergy: 0, drRadiation: -1, drPoison: 0 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.headbutt',
        skill: 'melee',
        damage: 4,
        damageType: 'physical',
        range: 'close',
        qualities: [],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.butchering.name',
        descriptionKey: 'bestiary.abilities.butchering.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'superMutantBehemoth',
    nameKey: 'bestiary.creatures.superMutantBehemoth.name',
    descriptionKey: 'bestiary.creatures.superMutantBehemoth.description',
    emoji: '🦍',
    statBlockType: 'creature',
    category: 'superMutant',
    bodyType: 'humanoid',
    level: 18,
    xpReward: 130,
    hp: 48,
    defense: 1,
    initiative: 17,
    attributes: {
      body: 12,
      mind: 5,
    },
    skills: [
      { skill: 'melee', rank: 5 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 4 },
    ],
    dr: [
      { location: 'all', drPhysical: 8, drEnergy: 5, drRadiation: -1, drPoison: 8 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.fireHydrantBat',
        skill: 'melee',
        damage: 11,
        damageType: 'physical',
        range: 'close',
        qualities: [{ quality: 'vicious' }, { quality: 'destructive' }],
      },
      {
        nameKey: 'bestiary.attacks.boulderThrow',
        skill: 'ranged',
        damage: 8,
        damageType: 'physical',
        range: 'medium',
        qualities: [{ quality: 'vicious' }, { quality: 'stun' }, { quality: 'thrown' }],
      },
      {
        nameKey: 'bestiary.attacks.missileLauncher',
        skill: 'ranged',
        damage: 11,
        damageType: 'physical',
        range: 'long',
        qualities: [{ quality: 'blast' }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.fearImmune.name',
        descriptionKey: 'bestiary.abilities.fearImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.large.name',
        descriptionKey: 'bestiary.abilities.large.description',
      },
      {
        nameKey: 'bestiary.abilities.aggressive.name',
        descriptionKey: 'bestiary.abilities.aggressive.description',
      },
      {
        nameKey: 'bestiary.abilities.lootBehemoth.name',
        descriptionKey: 'bestiary.abilities.lootBehemoth.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'superMutantSuicider',
    nameKey: 'bestiary.creatures.superMutantSuicider.name',
    descriptionKey: 'bestiary.creatures.superMutantSuicider.description',
    emoji: '💣',
    statBlockType: 'normal',
    category: 'superMutant',
    bodyType: 'humanoid',
    level: 6,
    xpReward: 45,
    hp: 12,
    defense: 1,
    initiative: 12,
    meleeDamageBonus: 1,
    carryCapacity: 65,
    maxLuckPoints: 0,
    wealth: 1,
    attributes: {
      strength: 8,
      perception: 5,
      endurance: 6,
      charisma: 4,
      intelligence: 4,
      agility: 7,
      luck: 4,
    },
    skills: [
      { skill: 'explosives', rank: 5, isTagSkill: true },
      { skill: 'athletics', rank: 4, isTagSkill: true },
      { skill: 'smallGuns', rank: 2 },
      { skill: 'sneak', rank: 1 },
      { skill: 'unarmed', rank: 2 },
      { skill: 'survival', rank: 1 },
    ],
    dr: [
      { location: 'head', drPhysical: 3, drEnergy: 4, drRadiation: -1, drPoison: -1 },
      { location: 'torso', drPhysical: 3, drEnergy: 4, drRadiation: -1, drPoison: -1 },
      { location: 'armLeft', drPhysical: 2, drEnergy: 2, drRadiation: -1, drPoison: -1 },
      { location: 'armRight', drPhysical: 2, drEnergy: 2, drRadiation: -1, drPoison: -1 },
      { location: 'legLeft', drPhysical: 2, drEnergy: 2, drRadiation: -1, drPoison: -1 },
      { location: 'legRight', drPhysical: 2, drEnergy: 2, drRadiation: -1, drPoison: -1 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.unarmed',
        skill: 'unarmed',
        damage: 4,
        damageType: 'physical',
        range: 'close',
        qualities: [],
      },
      {
        nameKey: 'bestiary.attacks.modifiedMiniNuke',
        skill: 'explosives',
        damage: 21,
        damageType: 'physical',
        range: 'close',
        qualities: [{ quality: 'vicious' }, { quality: 'destructive' }, { quality: 'radioactive' }, { quality: 'blast' }],
      },
      {
        nameKey: 'bestiary.attacks.pipeBoltAction',
        skill: 'smallGuns',
        damage: 5,
        damageType: 'physical',
        range: 'medium',
        fireRate: 0,
        itemName: 'Pipe Bolt-Action',
        twoHanded: true,
        qualities: [{ quality: 'piercing', value: 1 }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.barbaric.name',
        descriptionKey: 'bestiary.abilities.barbaric.description',
      },
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.poisonImmune.name',
        descriptionKey: 'bestiary.abilities.poisonImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.modifiedMiniNukeAbility.name',
        descriptionKey: 'bestiary.abilities.modifiedMiniNukeAbility.description',
      },
    ],
    inventory: [
      { itemName: 'Pipe Bolt-Action', quantity: 1, equipped: true },
    ],
  },

  {
    slug: 'superMutantMaster',
    nameKey: 'bestiary.creatures.superMutantMaster.name',
    descriptionKey: 'bestiary.creatures.superMutantMaster.description',
    emoji: '🦹',
    statBlockType: 'normal',
    category: 'superMutant',
    bodyType: 'humanoid',
    level: 10,
    xpReward: 148,
    hp: 23,
    defense: 1,
    initiative: 15,
    meleeDamageBonus: 2,
    carryCapacity: 125,
    maxLuckPoints: 0,
    wealth: 1,
    attributes: {
      strength: 10,
      perception: 8,
      endurance: 8,
      charisma: 5,
      intelligence: 6,
      agility: 5,
      luck: 5,
    },
    skills: [
      { skill: 'meleeWeapons', rank: 4, isTagSkill: true },
      { skill: 'survival', rank: 3, isTagSkill: true },
      { skill: 'smallGuns', rank: 3 },
      { skill: 'bigGuns', rank: 1 },
      { skill: 'unarmed', rank: 2 },
    ],
    dr: [
      { location: 'head', drPhysical: 4, drEnergy: 2, drRadiation: -1, drPoison: -1 },
      { location: 'torso', drPhysical: 4, drEnergy: 4, drRadiation: -1, drPoison: -1 },
      { location: 'armLeft', drPhysical: 3, drEnergy: 3, drRadiation: -1, drPoison: -1 },
      { location: 'armRight', drPhysical: 3, drEnergy: 3, drRadiation: -1, drPoison: -1 },
      { location: 'legLeft', drPhysical: 4, drEnergy: 4, drRadiation: -1, drPoison: -1 },
      { location: 'legRight', drPhysical: 4, drEnergy: 4, drRadiation: -1, drPoison: -1 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.unarmed',
        skill: 'unarmed',
        damage: 4,
        damageType: 'physical',
        range: 'close',
        qualities: [],
      },
      {
        nameKey: 'bestiary.attacks.minigun',
        skill: 'bigGuns',
        damage: 3,
        damageType: 'physical',
        range: 'medium',
        fireRate: 5,
        twoHanded: true,
        qualities: [{ quality: 'burst' }, { quality: 'gatling' }, { quality: 'inaccurate' }],
      },
      {
        nameKey: 'bestiary.attacks.missileLauncher',
        skill: 'bigGuns',
        damage: 11,
        damageType: 'physical',
        range: 'long',
        twoHanded: true,
        qualities: [{ quality: 'blast' }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.barbaric.name',
        descriptionKey: 'bestiary.abilities.barbaric.description',
      },
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.poisonImmune.name',
        descriptionKey: 'bestiary.abilities.poisonImmune.description',
      },
    ],
    inventory: [],
  },

  {
    slug: 'superMutantBrute',
    nameKey: 'bestiary.creatures.superMutantBrute.name',
    descriptionKey: 'bestiary.creatures.superMutantBrute.description',
    emoji: '👊',
    statBlockType: 'normal',
    category: 'superMutant',
    bodyType: 'humanoid',
    level: 7,
    xpReward: 52,
    hp: 14,
    defense: 1,
    initiative: 10,
    meleeDamageBonus: 2,
    carryCapacity: 120,
    maxLuckPoints: 0,
    wealth: 1,
    attributes: {
      strength: 9,
      perception: 5,
      endurance: 7,
      charisma: 4,
      intelligence: 5,
      agility: 5,
      luck: 4,
    },
    skills: [
      { skill: 'meleeWeapons', rank: 4, isTagSkill: true },
      { skill: 'smallGuns', rank: 4 },
      { skill: 'bigGuns', rank: 2 },
      { skill: 'unarmed', rank: 2 },
      { skill: 'throwing', rank: 1 },
      { skill: 'athletics', rank: 1 },
      { skill: 'survival', rank: 2 },
    ],
    dr: [
      { location: 'head', drPhysical: 4, drEnergy: 3, drRadiation: -1, drPoison: -1 },
      { location: 'torso', drPhysical: 2, drEnergy: 2, drRadiation: -1, drPoison: -1 },
      { location: 'armLeft', drPhysical: 2, drEnergy: 2, drRadiation: -1, drPoison: -1 },
      { location: 'armRight', drPhysical: 2, drEnergy: 2, drRadiation: -1, drPoison: -1 },
      { location: 'legLeft', drPhysical: 3, drEnergy: 3, drRadiation: -1, drPoison: -1 },
      { location: 'legRight', drPhysical: 3, drEnergy: 3, drRadiation: -1, drPoison: -1 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.unarmed',
        skill: 'unarmed',
        damage: 4,
        damageType: 'physical',
        range: 'close',
        qualities: [],
      },
      {
        nameKey: 'bestiary.attacks.board',
        skill: 'meleeWeapons',
        damage: 6,
        damageType: 'physical',
        range: 'close',
        itemName: 'Board',
        twoHanded: true,
        qualities: [],
      },
      {
        nameKey: 'bestiary.attacks.pipeBoltAction',
        skill: 'smallGuns',
        damage: 5,
        damageType: 'physical',
        range: 'medium',
        fireRate: 0,
        itemName: 'Pipe Bolt-Action',
        twoHanded: true,
        qualities: [{ quality: 'piercing', value: 1 }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.barbaric.name',
        descriptionKey: 'bestiary.abilities.barbaric.description',
      },
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.poisonImmune.name',
        descriptionKey: 'bestiary.abilities.poisonImmune.description',
      },
    ],
    inventory: [
      { itemName: 'Board', quantity: 1, equipped: true },
      { itemName: 'Pipe Bolt-Action', quantity: 1, equipped: true },
    ],
  },

  {
    slug: 'superMutant',
    nameKey: 'bestiary.creatures.superMutant.name',
    descriptionKey: 'bestiary.creatures.superMutant.description',
    emoji: '💪',
    statBlockType: 'normal',
    category: 'superMutant',
    bodyType: 'humanoid',
    level: 5,
    xpReward: 38,
    hp: 12,
    defense: 1,
    initiative: 10,
    meleeDamageBonus: 2,
    carryCapacity: 120,
    maxLuckPoints: 0,
    attributes: {
      strength: 9,
      perception: 5,
      endurance: 7,
      charisma: 4,
      intelligence: 4,
      agility: 5,
      luck: 4,
    },
    skills: [
      { skill: 'meleeWeapons', rank: 4, isTagSkill: true },
      { skill: 'survival', rank: 3, isTagSkill: true },
      { skill: 'smallGuns', rank: 3 },
      { skill: 'bigGuns', rank: 1 },
      { skill: 'unarmed', rank: 2 },
    ],
    dr: [
      { location: 'head', drPhysical: 2, drEnergy: 2, drRadiation: 0, drPoison: 0 },
      { location: 'torso', drPhysical: 2, drEnergy: 2, drRadiation: 0, drPoison: 0 },
      { location: 'armLeft', drPhysical: 2, drEnergy: 2, drRadiation: 0, drPoison: 0 },
      { location: 'armRight', drPhysical: 2, drEnergy: 2, drRadiation: 0, drPoison: 0 },
      { location: 'legLeft', drPhysical: 2, drEnergy: 2, drRadiation: 0, drPoison: 0 },
      { location: 'legRight', drPhysical: 2, drEnergy: 2, drRadiation: 0, drPoison: 0 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.unarmed',
        skill: 'unarmed',
        damage: 4,
        damageType: 'physical',
        range: 'close',
        qualities: [],
      },
      {
        nameKey: 'bestiary.attacks.board',
        skill: 'meleeWeapons',
        damage: 6,
        damageType: 'physical',
        range: 'close',
        itemName: 'Board',
        twoHanded: true,
        qualities: [],
      },
      {
        nameKey: 'bestiary.attacks.pipeBoltAction',
        skill: 'smallGuns',
        damage: 5,
        damageType: 'physical',
        range: 'medium',
        fireRate: 0,
        itemName: 'Pipe Bolt-Action',
        twoHanded: true,
        qualities: [{ quality: 'piercing', value: 1 }],
      },
    ],
    wealth: 1,
    abilities: [
      {
        nameKey: 'bestiary.abilities.barbaric.name',
        descriptionKey: 'bestiary.abilities.barbaric.description',
      },
      {
        nameKey: 'bestiary.abilities.radImmune.name',
        descriptionKey: 'bestiary.abilities.radImmune.description',
      },
      {
        nameKey: 'bestiary.abilities.poisonImmune.name',
        descriptionKey: 'bestiary.abilities.poisonImmune.description',
      },
    ],
    inventory: [
      { itemName: 'Board', quantity: 1, equipped: true },
      { itemName: 'Pipe Bolt-Action', quantity: 1, equipped: true },
    ],
  },
];
