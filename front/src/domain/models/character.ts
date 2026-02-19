import type { BodyLocation, ItemType, SpecialAttribute } from './shared';

export type { SpecialAttribute } from './shared';

export type SkillName =
  | 'athletics' | 'barter' | 'bigGuns' | 'energyWeapons' | 'explosives'
  | 'lockpick' | 'medicine' | 'meleeWeapons' | 'pilot' | 'repair'
  | 'science' | 'smallGuns' | 'sneak' | 'speech' | 'survival'
  | 'throwing' | 'unarmed';

export type Condition =
  | 'poisoned' | 'irradiated' | 'stunned' | 'prone' | 'blinded'
  | 'deafened' | 'fatigued' | 'hungry' | 'thirsty' | 'addicted';

export type CombatantStatus = 'active' | 'unconscious' | 'dead' | 'fled';

export type OriginId = 'brotherhood' | 'ghoul' | 'superMutant' | 'misterHandy' | 'survivor' | 'vaultDweller';

export type SurvivorTraitId = 'gifted' | 'educated' | 'smallFrame' | 'heavyHanded' | 'fastShot';

export interface InventoryArmorDetails {
  location: string;
  drPhysical: number;
  drEnergy: number;
  drRadiation: number;
  drPoison?: number | null;
  hp?: number | null;
}

export interface InventoryPowerArmorDetails {
  set: string;
  location: string;
  drPhysical: number;
  drEnergy: number;
  drRadiation: number;
  hp: number;
}

export interface InventoryClothingDetails {
  locations: string[];
  drPhysical: number;
  drEnergy: number;
  drRadiation: number;
  drPoison?: number | null;
}

export interface InventoryItem {
  id: number;
  itemId: number;
  quantity: number;
  equipped: boolean;
  equippedLocation?: string;
  currentHp?: number | null;
  maxHp?: number | null;
  item: {
    id: number;
    name: string;
    itemType: ItemType;
    nameKey?: string;
    value: number;
    rarity: number;
    weight: number;
  };
  armorDetails?: InventoryArmorDetails | null;
  powerArmorDetails?: InventoryPowerArmorDetails | null;
  clothingDetails?: InventoryClothingDetails | null;
}

export interface Character {
  id: number;
  name: string;
  type: 'pc' | 'npc';
  level: number;
  xp: number;
  originId?: string;
  maxHp: number;
  currentHp: number;
  defense: number;
  initiative: number;
  meleeDamageBonus: number;
  carryCapacity: number;
  maxLuckPoints: number;
  currentLuckPoints: number;
  caps: number;
  radiationDamage: number;
  createdAt: string;
  updatedAt: string;
  special: Record<SpecialAttribute, number>;
  skills: Record<SkillName, number>;
  tagSkills: SkillName[];
  survivorTraits: SurvivorTraitId[];
  perks: { perkId: string; rank: number }[];
  giftedBonusAttributes: SpecialAttribute[];
  exerciseBonuses: SpecialAttribute[];
  conditions: Condition[];
  inventory: InventoryItem[];
  notes?: string;
}

export interface CreateCharacterData {
  name: string;
  type: 'pc' | 'npc';
  level?: number;
  xp?: number;
  originId?: string;
  maxHp: number;
  currentHp?: number;
  defense: number;
  initiative: number;
  meleeDamageBonus?: number;
  carryCapacity: number;
  maxLuckPoints: number;
  currentLuckPoints?: number;
  caps?: number;
  radiationDamage?: number;
  special: Record<string, number>;
  skills?: Record<string, number>;
  tagSkills?: string[];
  survivorTraits?: string[];
  perks?: { perkId: string; rank: number }[];
  giftedBonusAttributes?: string[];
  exerciseBonuses?: string[];
  inventory?: { itemId: number; quantity?: number; equipped?: boolean; equippedLocation?: string }[];
}

export interface AddInventoryData {
  itemId: number;
  quantity?: number;
  equipped?: boolean;
  equippedLocation?: string;
}

export interface UpdateInventoryData {
  quantity?: number;
  equipped?: boolean;
  equippedLocation?: string;
  currentHp?: number;
}

export interface Combatant {
  characterId: string;
  name: string;
  type: 'PC' | 'NPC';
  maxHp: number;
  currentHp: number;
  defense: number;
  initiative: number;
  meleeDamageBonus: number;
  turnOrder: number;
  currentAP: number;
  maxAP: number;
  status: CombatantStatus;
  conditions: Condition[];
  equippedWeapons: string[];
  tagSkills: SkillName[];
}
