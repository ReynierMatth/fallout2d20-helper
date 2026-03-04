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
    xpReward: 7,
    hp: 4,
    defense: 1,
    initiative: 6,
    attributes: {
      body: 4,
      mind: 4,
    },
    skills: [
      { skill: 'melee', rank: 2 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 1 },
    ],
    dr: [
      { location: 'all', drPhysical: 0, drEnergy: 0, drRadiation: 2, drPoison: 0 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.bite',
        skill: 'melee',
        damage: 2,
        damageType: 'physical',
        range: 'close',
        qualities: [],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.radResistant.name',
        descriptionKey: 'bestiary.abilities.radResistant.description',
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
    level: 15,
    xpReward: 99,
    hp: 25,
    defense: 2,
    initiative: 15,
    meleeDamageBonus: 3,
    attributes: {
      body: 12,
      mind: 5,
    },
    skills: [
      { skill: 'melee', rank: 5 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 3 },
    ],
    dr: [
      { location: 'all', drPhysical: 4, drEnergy: 3, drRadiation: 0, drPoison: 0 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.claws',
        skill: 'melee',
        damage: 6,
        damageType: 'physical',
        range: 'close',
        qualities: [{ quality: 'piercing', value: 2 }, { quality: 'vicious' }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.terrifying.name',
        descriptionKey: 'bestiary.abilities.terrifying.description',
      },
      {
        nameKey: 'bestiary.abilities.fast.name',
        descriptionKey: 'bestiary.abilities.fast.description',
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
    xpReward: 16,
    hp: 8,
    defense: 1,
    initiative: 10,
    attributes: {
      body: 7,
      mind: 3,
    },
    skills: [
      { skill: 'melee', rank: 3 },
      { skill: 'ranged', rank: 0 },
      { skill: 'other', rank: 1 },
    ],
    dr: [
      { location: 'all', drPhysical: 0, drEnergy: 0, drRadiation: 0, drPoison: 0 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.claws',
        skill: 'melee',
        damage: 3,
        damageType: 'physical',
        range: 'close',
        qualities: [{ quality: 'vicious' }],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.feral.name',
        descriptionKey: 'bestiary.abilities.feral.description',
      },
      {
        nameKey: 'bestiary.abilities.radResistant.name',
        descriptionKey: 'bestiary.abilities.radResistant.description',
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
    slug: 'superMutant',
    nameKey: 'bestiary.creatures.superMutant.name',
    descriptionKey: 'bestiary.creatures.superMutant.description',
    emoji: '💪',
    statBlockType: 'normal',
    category: 'superMutant',
    bodyType: 'humanoid',
    level: 10,
    xpReward: 59,
    hp: 18,
    defense: 1,
    initiative: 10,
    meleeDamageBonus: 2,
    carryCapacity: 200,
    maxLuckPoints: 0,
    attributes: {
      strength: 9,
      perception: 5,
      endurance: 9,
      charisma: 3,
      intelligence: 3,
      agility: 5,
      luck: 5,
    },
    skills: [
      { skill: 'bigGuns', rank: 2, isTagSkill: true },
      { skill: 'meleeWeapons', rank: 3, isTagSkill: true },
      { skill: 'smallGuns', rank: 2 },
      { skill: 'throwing', rank: 2 },
      { skill: 'athletics', rank: 2 },
      { skill: 'survival', rank: 2 },
    ],
    dr: [
      { location: 'head', drPhysical: 1, drEnergy: 1, drRadiation: 2, drPoison: 0 },
      { location: 'torso', drPhysical: 2, drEnergy: 1, drRadiation: 2, drPoison: 0 },
      { location: 'armLeft', drPhysical: 2, drEnergy: 1, drRadiation: 2, drPoison: 0 },
      { location: 'armRight', drPhysical: 2, drEnergy: 1, drRadiation: 2, drPoison: 0 },
      { location: 'legLeft', drPhysical: 2, drEnergy: 1, drRadiation: 2, drPoison: 0 },
      { location: 'legRight', drPhysical: 2, drEnergy: 1, drRadiation: 2, drPoison: 0 },
    ],
    attacks: [
      {
        nameKey: 'bestiary.attacks.superSledge',
        skill: 'meleeWeapons',
        damage: 5,
        damageType: 'physical',
        range: 'close',
        itemName: 'Super Sledge',
        twoHanded: true,
        qualities: [],
      },
      {
        nameKey: 'bestiary.attacks.unarmed',
        skill: 'unarmed',
        damage: 4,
        damageType: 'physical',
        range: 'close',
        qualities: [],
      },
    ],
    abilities: [
      {
        nameKey: 'bestiary.abilities.mutantBrute.name',
        descriptionKey: 'bestiary.abilities.mutantBrute.description',
      },
    ],
    inventory: [
      { itemName: 'Super Sledge', quantity: 1, equipped: true },
    ],
  },
];
