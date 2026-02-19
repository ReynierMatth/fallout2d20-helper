import type { DamageType, WeaponRange, WeaponSkill, WeaponQualityValue, AmmoType, BodyLocation, RobotLocation, ItemType, ItemEffect } from './shared';

export interface BaseItem {
  id: number;
  name: string;
  nameKey?: string;
  value: number;
  rarity: number;
  weight: number;
  itemType: ItemType;
}

export interface Weapon extends BaseItem {
  itemType: 'weapon';
  skill: WeaponSkill;
  damage: number;
  damageType: DamageType;
  damageBonus?: number;
  fireRate: number;
  range: WeaponRange;
  ammo: AmmoType;
  ammoPerShot?: number;
  qualities: WeaponQualityValue[];
}

export interface Armor extends BaseItem {
  itemType: 'armor';
  location: BodyLocation | 'all';
  drPhysical: number;
  drEnergy: number;
  drRadiation: number;
  drPoison?: number;
  type: string;
  set?: string;
  hp?: number;
}

export interface PowerArmor extends BaseItem {
  itemType: 'powerArmor';
  set: string;
  location: BodyLocation;
  drPhysical: number;
  drEnergy: number;
  drRadiation: number;
  hp: number;
}

export interface RobotArmor extends BaseItem {
  itemType: 'robotArmor';
  drPhysical: number;
  drEnergy: number;
  isBonus: boolean;
  location: RobotLocation;
  carryModifier?: number;
  perkRequired?: string;
  specialEffectKey?: string;
  specialEffectDescription?: string;
}

export interface ClothingEffect {
  type: string;
  target?: string;
  value?: string;
  descriptionKey: string;
}

export interface Clothing extends BaseItem {
  itemType: 'clothing';
  drPhysical?: number;
  drEnergy?: number;
  drRadiation?: number;
  drPoison?: number;
  locations: string[];
  effects: ClothingEffect[];
  effect?: ItemEffect;
}

export interface Ammunition extends BaseItem {
  itemType: 'ammunition';
  flatAmount: number;
  randomAmount: number;
}

export interface SyringerAmmo extends BaseItem {
  itemType: 'syringerAmmo';
  effectKey: string;
  effect?: ItemEffect;
}

export interface Chem extends BaseItem {
  itemType: 'chem';
  duration: string;
  addictive: boolean;
  addictionLevel?: number;
  effectKey: string;
  effect?: ItemEffect;
}

export interface Food extends BaseItem {
  itemType: 'food';
  foodType: string;
  irradiated: boolean;
  effectKey?: string;
  effect?: ItemEffect;
}

export interface GeneralGood extends BaseItem {
  itemType: 'generalGood';
  goodType: string;
  effectKey?: string;
  effect?: ItemEffect;
}

export interface Oddity extends BaseItem {
  itemType: 'oddity';
  goodType: string;
  effect?: string;
}

export interface MagazineIssue {
  id: number;
  magazineId: number;
  d20Min: number;
  d20Max: number;
  issueName: string;
  issueNameKey?: string;
  effectDescriptionKey: string;
}

export interface Magazine extends BaseItem {
  itemType: 'magazine';
  perkDescriptionKey: string;
  issues: MagazineIssue[];
}

export interface Disease {
  id: number;
  d20Roll: number;
  name: string;
  nameKey?: string;
  effectKey: string;
  duration: number;
}

export type AnyItem = Weapon | Armor | PowerArmor | RobotArmor | Clothing | Ammunition | SyringerAmmo | Chem | Food | GeneralGood | Oddity | Magazine;

export interface AllItems {
  weapons: Weapon[];
  armors: Armor[];
  powerArmors: PowerArmor[];
  clothing: Clothing[];
  ammunition: Ammunition[];
  chems: Chem[];
  food: Food[];
  generalGoods: GeneralGood[];
  magazines: Magazine[];
  robotArmors: RobotArmor[];
  syringerAmmo: SyringerAmmo[];
  oddities: Oddity[];
}
