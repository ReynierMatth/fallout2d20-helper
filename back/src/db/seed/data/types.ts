// ===== COMMON TYPES =====

export type DamageType = 'physical' | 'energy' | 'radiation' | 'poison';

export type BodyLocation = 'head' | 'torso' | 'armLeft' | 'armRight' | 'legLeft' | 'legRight';

export type WeaponRange = 'close' | 'medium' | 'long' | 'extreme';

export type WeaponSkill = 'smallGuns' | 'bigGuns' | 'energyWeapons' | 'meleeWeapons' | 'unarmed' | 'throwing' | 'explosives';

export type AmmoType =
  | '10mm'
  | '.308'
  | '.38'
  | '.44'
  | '.45'
  | '.50'
  | '5mm'
  | '5.56mm'
  | '2mmEC'
  | 'shotgunShell'
  | 'fusionCell'
  | 'plasmaCartridge'
  | 'flamerFuel'
  | 'fusionCore'
  | 'gammaRound'
  | 'missile'
  | 'miniNuke'
  | 'railwaySpike'
  | 'syringerAmmo'
  | 'flare'
  | 'cannonball'
  | 'none'; // For melee weapons

export type WeaponQuality =
  | 'accurate'
  | 'blast'
  | 'breaking'
  | 'burst'
  | 'closeQuarters'
  | 'concealed'
  | 'debilitating'
  | 'freezing'
  | 'gatling'
  | 'inaccurate'
  | 'mine'
  | 'nightVision'
  | 'parry'
  | 'persistent'
  | 'piercing'
  | 'radioactive'
  | 'reliable'
  | 'recon'
  | 'spread'
  | 'stun'
  | 'suppressed'
  | 'thrown'
  | 'twoHanded'
  | 'unreliable'
  | 'vicious'
  | 'silent';

export interface WeaponQualityValue {
  quality: WeaponQuality;
  value?: number; // For qualities like Piercing 1, Burst 2, etc.
}

// ===== DAMAGE RESISTANCE =====

export interface DamageResistance {
  physical: number;
  energy: number;
  radiation: number;
  poison?: number;
}

// ===== ARMOR =====

export interface Armor {
  name: string;
  nameKey?: string; // i18n key
  value: number;
  rarity: number;
  weight: number;
  location: BodyLocation | 'all'; // 'all' for Power Armor Frame
  dr: DamageResistance;
  type: 'armor' | 'powerArmor';
  set?: string; // e.g., "leather", "combat", "metal", "synth", "raider"
  hp?: number; // Hit Points for Power Armor pieces
}

// ===== CLOTHING =====

export interface ClothingEffect {
  type: 'skill' | 'special' | 'dr' | 'other';
  target?: string; // skill name or SPECIAL stat
  value?: number | string;
  descriptionKey: string; // i18n key for description
}

export interface Clothing {
  name: string;
  nameKey?: string;
  value: number;
  rarity: number;
  weight: number;
  locations: BodyLocation[]; // Which body parts it covers
  dr?: Partial<DamageResistance>; // Some clothing provides minor DR
  effects: ClothingEffect[];
  effect?: import('../../../types/itemEffect').ItemEffect; // Structured effect (JSONB)
}

// ===== ROBOT ARMOR =====

export type RobotLocation = 'all' | 'optic' | 'body' | 'arm' | 'thruster';

export interface RobotArmorEffect {
  descriptionKey: string; // i18n key for the effect description
  description?: string; // Fallback description in English
}

export interface RobotArmor {
  name: string;
  nameKey?: string;
  drPhysical: number; // Can be absolute (2) or bonus (+1)
  drEnergy: number;
  isBonus: boolean; // true if DR values are bonuses (+1), false if absolute (2)
  location: RobotLocation;
  carryModifier?: number; // Modifier to carry capacity
  value: number;
  perkRequired?: string; // e.g., "Armorer 1", "Armorer 2", "Armorer 3"
  specialEffect?: RobotArmorEffect; // Special ability of the armor
}

// ===== WEAPONS =====

export interface Weapon {
  name: string;
  nameKey?: string;
  value: number;
  rarity: number;
  weight: number;
  skill: WeaponSkill;
  damage: number; // Number of Combat Dice (CD)
  damageType: DamageType;
  damageBonus?: number; // Flat bonus added to damage
  fireRate: number;
  range: WeaponRange;
  qualities: WeaponQualityValue[];
  ammo: AmmoType;
  ammoPerShot?: number; // Default is 1
}

// ===== SPECIAL & SKILLS =====

export type SpecialAttribute =
  | 'strength'
  | 'perception'
  | 'endurance'
  | 'charisma'
  | 'intelligence'
  | 'agility'
  | 'luck';

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
