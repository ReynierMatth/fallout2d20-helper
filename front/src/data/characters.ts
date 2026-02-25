import type { BodyLocation } from './types';

// ===== SPECIAL ATTRIBUTES =====

export type SpecialAttribute =
  | 'strength'
  | 'perception'
  | 'endurance'
  | 'charisma'
  | 'intelligence'
  | 'agility'
  | 'luck';

export const SPECIAL_ATTRIBUTES: SpecialAttribute[] = [
  'strength',
  'perception',
  'endurance',
  'charisma',
  'intelligence',
  'agility',
  'luck',
];

// ===== SKILLS =====

export type SkillName =
  | 'athletics'
  | 'barter'
  | 'bigGuns'
  | 'energyWeapons'
  | 'explosives'
  | 'lockpick'
  | 'medicine'
  | 'meleeWeapons'
  | 'pilot'
  | 'repair'
  | 'science'
  | 'smallGuns'
  | 'sneak'
  | 'speech'
  | 'survival'
  | 'throwing'
  | 'unarmed';

export const SKILL_NAMES: SkillName[] = [
  'athletics',
  'barter',
  'bigGuns',
  'energyWeapons',
  'explosives',
  'lockpick',
  'medicine',
  'meleeWeapons',
  'pilot',
  'repair',
  'science',
  'smallGuns',
  'sneak',
  'speech',
  'survival',
  'throwing',
  'unarmed',
];

// Mapping skill -> SPECIAL attribute (from official rules)
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

// ===== ORIGINS =====

export type OriginId =
  | 'brotherhood'
  | 'ghoul'
  | 'superMutant'
  | 'misterHandy'
  | 'survivor'
  | 'vaultDweller';

export interface OriginTrait {
  nameKey: string;
  descriptionKey: string;
}

export interface Origin {
  id: OriginId;
  nameKey: string;
  descriptionKey: string;
  trait: OriginTrait;
  // Modifications to SPECIAL (e.g., Super Mutant: STR+2, END+2, INT max 6, CHR max 6)
  specialModifiers?: Partial<Record<SpecialAttribute, number>>;
  specialMaxOverrides?: Partial<Record<SpecialAttribute, number>>;
  // Skills that become tag skills at rank 2
  bonusTagSkills?: SkillName[];
  // Skill rank limits (e.g., Super Mutant max 4)
  skillMaxOverride?: number;
  // Is this a robot? (different damage locations)
  isRobot?: boolean;
}

export const ORIGINS: Origin[] = [
  {
    id: 'brotherhood',
    nameKey: 'origins.brotherhood.name',
    descriptionKey: 'origins.brotherhood.description',
    trait: {
      nameKey: 'origins.brotherhood.trait.name',
      descriptionKey: 'origins.brotherhood.trait.description',
    },
    // Chain of Cohesion: One bonus tag skill at rank 2 (Energy Weapons, Science, or Repair)
  },
  {
    id: 'ghoul',
    nameKey: 'origins.ghoul.name',
    descriptionKey: 'origins.ghoul.description',
    trait: {
      nameKey: 'origins.ghoul.trait.name',
      descriptionKey: 'origins.ghoul.trait.description',
    },
    // Post-human necrotic: Immune to radiation, heal 1 HP per 3 rad damage, Survival becomes tag skill +2 ranks
    bonusTagSkills: ['survival'],
  },
  {
    id: 'superMutant',
    nameKey: 'origins.superMutant.name',
    descriptionKey: 'origins.superMutant.description',
    trait: {
      nameKey: 'origins.superMutant.trait.name',
      descriptionKey: 'origins.superMutant.trait.description',
    },
    // Forced evolution: STR+2, END+2, max 12 for both; INT and CHR max 6; skills max 4; immune to radiation and poison
    specialModifiers: { strength: 2, endurance: 2 },
    specialMaxOverrides: { strength: 12, endurance: 12, intelligence: 6, charisma: 6 },
    skillMaxOverride: 4,
  },
  {
    id: 'misterHandy',
    nameKey: 'origins.misterHandy.name',
    descriptionKey: 'origins.misterHandy.description',
    trait: {
      nameKey: 'origins.misterHandy.trait.name',
      descriptionKey: 'origins.misterHandy.trait.description',
    },
    isRobot: true,
    // Robot: different damage locations, arm accessories
  },
  {
    id: 'survivor',
    nameKey: 'origins.survivor.name',
    descriptionKey: 'origins.survivor.description',
    trait: {
      nameKey: 'origins.survivor.trait.name',
      descriptionKey: 'origins.survivor.trait.description',
    },
    // Can choose 2 traits or 1 trait + 1 perk
  },
  {
    id: 'vaultDweller',
    nameKey: 'origins.vaultDweller.name',
    descriptionKey: 'origins.vaultDweller.description',
    trait: {
      nameKey: 'origins.vaultDweller.trait.name',
      descriptionKey: 'origins.vaultDweller.trait.description',
    },
    // Born in the Vault: -1 difficulty to END tests vs disease, +1 bonus tag skill at rank 2
  },
];

// ===== SURVIVOR TRAITS =====

export type SurvivorTraitId = 'gifted' | 'educated' | 'smallFrame' | 'heavyHanded' | 'fastShot';

export interface SurvivorTrait {
  id: SurvivorTraitId;
  nameKey: string;
  benefitKey: string;
  drawbackKey: string;
}

export const SURVIVOR_TRAITS: SurvivorTrait[] = [
  {
    id: 'gifted',
    nameKey: 'survivorTraits.gifted.name',
    benefitKey: 'survivorTraits.gifted.benefit',
    drawbackKey: 'survivorTraits.gifted.drawback',
    // Benefit: +1 to two SPECIAL attributes
    // Drawback: Max luck points = LCK - 1
  },
  {
    id: 'educated',
    nameKey: 'survivorTraits.educated.name',
    benefitKey: 'survivorTraits.educated.benefit',
    drawbackKey: 'survivorTraits.educated.drawback',
    // Benefit: +1 bonus tag skill
    // Drawback: When failing a non-tag skill test, GM gains 1 AP
  },
  {
    id: 'smallFrame',
    nameKey: 'survivorTraits.smallFrame.name',
    benefitKey: 'survivorTraits.smallFrame.benefit',
    drawbackKey: 'survivorTraits.smallFrame.drawback',
    // Benefit: Reroll 1d20 on AGI tests for balance/contortions
    // Drawback: Carry capacity = 75 + (2.5 x STR) instead of 75 + (5 x STR)
  },
  {
    id: 'heavyHanded',
    nameKey: 'survivorTraits.heavyHanded.name',
    benefitKey: 'survivorTraits.heavyHanded.benefit',
    drawbackKey: 'survivorTraits.heavyHanded.drawback',
    // Benefit: Melee damage bonus +1 CD
    // Drawback: Unarmed and melee attacks cause complication on 19 or 20
  },
  {
    id: 'fastShot',
    nameKey: 'survivorTraits.fastShot.name',
    benefitKey: 'survivorTraits.fastShot.benefit',
    drawbackKey: 'survivorTraits.fastShot.drawback',
    // Benefit: Second major action for ranged attack costs 1 AP instead of 2
    // Drawback: Cannot benefit from Aim minor action
  },
];

// ===== CONDITIONS =====

export type Condition =
  | 'poisoned'
  | 'irradiated'
  | 'stunned'
  | 'prone'
  | 'blinded'
  | 'deafened'
  | 'fatigued'
  | 'hungry'
  | 'thirsty'
  | 'addicted';

export const CONDITIONS: Condition[] = [
  'poisoned',
  'irradiated',
  'stunned',
  'prone',
  'blinded',
  'deafened',
  'fatigued',
  'hungry',
  'thirsty',
  'addicted',
];

// ===== CHARACTER =====

export interface Character {
  id: string;
  name: string;
  type: 'PC' | 'NPC';
  level: number;

  // Origin (for PCs)
  origin?: OriginId;
  survivorTraits?: SurvivorTraitId[]; // Only for Survivor origin (max 2, or 1 + perk)

  // Trait bonuses (persisted for editing)
  giftedBonusAttributes?: SpecialAttribute[]; // Gifted trait: +1 to two chosen SPECIAL
  exerciseBonuses?: SpecialAttribute[]; // Intense Training perk: +1 per rank to chosen SPECIAL

  // SPECIAL (4-10 for humans, can vary by origin)
  special: Record<SpecialAttribute, number>;

  // Skills (0-6 ranks, or limited by origin)
  skills: Record<SkillName, number>;

  // Tag Skills (Atouts personnels) - 3 skills that give critical on rolls ≤ rank
  tagSkills: SkillName[];

  // Health
  maxHp: number;
  currentHp: number;

  // Defense (based on AGI: 1 if AGI 1-8, 2 if AGI 9+)
  defense: number;

  // Initiative (PER + AGI)
  initiative: number;

  // Melee Damage Bonus (based on STR: 7-8: +1, 9-10: +2, 11+: +3)
  meleeDamageBonus: number;

  // Luck Points (for PCs, equals LCK attribute, can be modified by traits)
  maxLuckPoints: number;
  currentLuckPoints: number;

  // Carry Capacity (75 + 5 x STR, can be modified by traits)
  carryCapacity: number;

  // Equipment (legacy - references by name for backwards compatibility)
  equippedWeapons: any[];
  equippedArmor: Partial<Record<BodyLocation, any>>;
  equippedClothing: any[];

  // Inventory (new - using universal item IDs)
  inventory?: any[];

  // Currency
  caps?: number;

  // Perks/Aptitudes (perkId -> rank)
  perks: { perkId: string; rank: number }[];

  // Notes
  notes: string;

  // Timestamps
  createdAt: number;
  updatedAt: number;
}

// ===== COMBATANT (Character in combat) =====

export type CombatantStatus = 'active' | 'unconscious' | 'dead';

export interface Combatant {
  characterId: string;
  name: string;
  type: 'PC' | 'NPC';

  // Combat stats
  maxHp: number;
  currentHp: number;
  defense: number;
  initiative: number;
  meleeDamageBonus: number;

  // Turn tracking
  turnOrder: number;
  currentAP: number;
  maxAP: number;

  // Status
  status: CombatantStatus;
  conditions: Condition[];

  // Quick reference to equipped weapons and tag skills
  equippedWeapons: string[];
  tagSkills: SkillName[];
}

// ===== CALCULATION HELPERS =====

/**
 * Calculate max HP based on Fallout 2d20 rules
 * Base HP = Endurance + Luck
 * Each level after 1 adds +1 HP
 */
export function calculateMaxHp(endurance: number, luck: number, level: number): number {
  const baseHp = endurance + luck;
  const levelBonus = Math.max(0, level - 1); // +1 HP per level after level 1
  return baseHp + levelBonus;
}

/**
 * Calculate initiative based on Fallout 2d20 rules
 * Initiative = Perception + Agility
 */
export function calculateInitiative(perception: number, agility: number): number {
  return perception + agility;
}

/**
 * Calculate defense based on Fallout 2d20 rules
 * Defense = 1 if AGI 1-8, 2 if AGI 9+
 */
export function calculateDefense(agility: number): number {
  return agility >= 9 ? 2 : 1;
}

/**
 * Calculate melee damage bonus based on Fallout 2d20 rules
 * STR 7-8: +1 CD, STR 9-10: +2 CD, STR 11+: +3 CD
 */
export function calculateMeleeDamageBonus(strength: number): number {
  if (strength >= 11) return 3;
  if (strength >= 9) return 2;
  if (strength >= 7) return 1;
  return 0;
}

/**
 * Calculate max luck points (equal to Luck attribute)
 * Can be reduced by traits (e.g., Gifted: LCK - 1)
 */
export function calculateMaxLuckPoints(luck: number, hasGiftedTrait: boolean = false): number {
  return hasGiftedTrait ? Math.max(0, luck - 1) : luck;
}

/**
 * Calculate carry capacity based on Fallout 2d20 rules
 * Normal: 75 + (5 x STR) kg
 * Small Frame trait: 75 + (2.5 x STR) kg
 */
export function calculateCarryCapacity(strength: number, hasSmallFrame: boolean = false): number {
  const multiplier = hasSmallFrame ? 2.5 : 5;
  return 75 + multiplier * strength;
}

/**
 * Calculate available skill points at character creation
 * Skill Points = 9 + Intelligence
 */
export function calculateSkillPoints(intelligence: number, level: number = 1): number {
  return 9 + intelligence + Math.max(0, level - 1);
}

/**
 * Get the target number for a skill test
 * TN = SPECIAL attribute + Skill rank
 */
export function getSkillTargetNumber(
  special: Record<SpecialAttribute, number>,
  skills: Record<SkillName, number>,
  skill: SkillName
): number {
  const attribute = SKILL_ATTRIBUTES[skill];
  return special[attribute] + (skills[skill] || 0);
}

// ===== DEFAULT SKILLS =====

function createDefaultSkills(): Record<SkillName, number> {
  return {
    athletics: 0,
    barter: 0,
    bigGuns: 0,
    energyWeapons: 0,
    explosives: 0,
    lockpick: 0,
    medicine: 0,
    meleeWeapons: 0,
    pilot: 0,
    repair: 0,
    science: 0,
    smallGuns: 0,
    sneak: 0,
    speech: 0,
    survival: 0,
    throwing: 0,
    unarmed: 0,
  };
}

// ===== CHARACTER FACTORY =====

/**
 * Create a new character with default values
 * SPECIAL: all start at 5 (player has 5 points to distribute)
 */
export function createDefaultCharacter(type: 'PC' | 'NPC', name: string = ''): Character {
  const defaultSpecial: Record<SpecialAttribute, number> = {
    strength: 5,
    perception: 5,
    endurance: 5,
    charisma: 5,
    intelligence: 5,
    agility: 5,
    luck: 5,
  };

  const maxHp = calculateMaxHp(defaultSpecial.endurance, defaultSpecial.luck, 1);
  const initiative = calculateInitiative(defaultSpecial.perception, defaultSpecial.agility);
  const defense = calculateDefense(defaultSpecial.agility);
  const meleeDamageBonus = calculateMeleeDamageBonus(defaultSpecial.strength);
  const carryCapacity = calculateCarryCapacity(defaultSpecial.strength);

  return {
    id: crypto.randomUUID(),
    name,
    type,
    level: 1,
    origin: type === 'PC' ? 'survivor' : undefined,
    survivorTraits: [],
    giftedBonusAttributes: [],
    exerciseBonuses: [],
    special: defaultSpecial,
    skills: createDefaultSkills(),
    tagSkills: [],
    maxHp,
    currentHp: maxHp,
    defense,
    initiative,
    meleeDamageBonus,
    maxLuckPoints: defaultSpecial.luck,
    currentLuckPoints: defaultSpecial.luck,
    carryCapacity,
    equippedWeapons: [],
    equippedArmor: {},
    equippedClothing: [],
    perks: [],
    notes: '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Create a quick NPC for combat (minimal stats)
 */
export function createQuickNPC(
  name: string,
  hp: number,
  defense: number = 1,
  initiative: number = 10
): Character {
  return {
    id: crypto.randomUUID(),
    name,
    type: 'NPC',
    level: 1,
    special: {
      strength: 5,
      perception: 5,
      endurance: 5,
      charisma: 5,
      intelligence: 5,
      agility: 5,
      luck: 5,
    },
    skills: createDefaultSkills(),
    tagSkills: [],
    maxHp: hp,
    currentHp: hp,
    defense,
    initiative,
    meleeDamageBonus: 0,
    maxLuckPoints: 0,
    currentLuckPoints: 0,
    carryCapacity: 100,
    equippedWeapons: [],
    equippedArmor: {},
    equippedClothing: [],
    perks: [],
    notes: '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Convert a Character to a Combatant for combat tracking
 */
export function characterToCombatant(character: Character, turnOrder: number = 0): Combatant {
  return {
    characterId: character.id,
    name: character.name,
    type: character.type,
    maxHp: character.maxHp,
    currentHp: character.currentHp,
    defense: character.defense,
    initiative: character.initiative,
    meleeDamageBonus: character.meleeDamageBonus,
    turnOrder,
    currentAP: 2,
    maxAP: 2,
    status: 'active',
    conditions: [],
    equippedWeapons: character.equippedWeapons,
    tagSkills: character.tagSkills,
  };
}

/**
 * Recalculate all derived stats for a character
 */
export function recalculateCharacterStats(character: Character): Partial<Character> {
  const hasGifted = character.survivorTraits?.includes('gifted') ?? false;
  const hasSmallFrame = character.survivorTraits?.includes('smallFrame') ?? false;

  const maxHp = calculateMaxHp(character.special.endurance, character.special.luck, character.level);
  const initiative = calculateInitiative(character.special.perception, character.special.agility);
  const defense = calculateDefense(character.special.agility);
  const meleeDamageBonus = calculateMeleeDamageBonus(character.special.strength);
  const maxLuckPoints = calculateMaxLuckPoints(character.special.luck, hasGifted);
  const carryCapacity = calculateCarryCapacity(character.special.strength, hasSmallFrame);

  return {
    maxHp,
    currentHp: Math.min(character.currentHp, maxHp),
    initiative,
    defense,
    meleeDamageBonus,
    maxLuckPoints,
    currentLuckPoints: Math.min(character.currentLuckPoints, maxLuckPoints),
    carryCapacity,
  };
}
