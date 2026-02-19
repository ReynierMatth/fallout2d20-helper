export type DamageType = 'physical' | 'energy' | 'radiation' | 'poison';
export type BodyLocation = 'head' | 'torso' | 'armLeft' | 'armRight' | 'legLeft' | 'legRight';
export type WeaponRange = 'close' | 'medium' | 'long' | 'extreme';
export type WeaponSkill = 'smallGuns' | 'bigGuns' | 'energyWeapons' | 'meleeWeapons' | 'unarmed' | 'throwing' | 'explosives';
export type AmmoType = '10mm' | '.308' | '.38' | '.44' | '.45' | '.50' | '5mm' | '5.56mm' | '2mmEC' | 'shotgunShell' | 'fusionCell' | 'plasmaCartridge' | 'flamerFuel' | 'fusionCore' | 'gammaRound' | 'missile' | 'miniNuke' | 'railwaySpike' | 'syringerAmmo' | 'flare' | 'cannonball' | 'none';
export type WeaponQuality = 'accurate' | 'blast' | 'breaking' | 'burst' | 'closeQuarters' | 'concealed' | 'debilitating' | 'gatling' | 'inaccurate' | 'mine' | 'nightVision' | 'parry' | 'persistent' | 'piercing' | 'radioactive' | 'reliable' | 'recon' | 'spread' | 'stun' | 'thrown' | 'twoHanded' | 'unreliable' | 'vicious' | 'silent';
export type ItemType = 'weapon' | 'armor' | 'powerArmor' | 'robotArmor' | 'clothing' | 'ammunition' | 'syringerAmmo' | 'chem' | 'food' | 'generalGood' | 'oddity' | 'magazine';
export type RobotLocation = 'all' | 'optic' | 'body' | 'arm' | 'thruster';

export type SpecialAttribute = 'strength' | 'perception' | 'endurance' | 'charisma' | 'intelligence' | 'agility' | 'luck';

export interface WeaponQualityValue {
  quality: WeaponQuality;
  value?: number;
}

export interface DamageResistance {
  physical: number;
  energy: number;
  radiation: number;
  poison?: number;
}

export interface ItemEffect {
  hpHealed?: number;
  radsHealed?: number;
  apBonus?: number;
  specialBonus?: Partial<Record<SpecialAttribute, number>>;
  skillBonus?: Partial<Record<string, number>>;
  drBonus?: { physical?: number; energy?: number; radiation?: number; poison?: number };
  addCondition?: string[];
  removeCondition?: string[];
  radiationImmunity?: boolean;
  radiationDamage?: number;
  hpDamage?: number;
  addictionRisk?: boolean;
  addictionDC?: number;
  duration?: 'instant' | 'brief' | 'lasting' | 'permanent';
  maxHpBonus?: number;
  meleeDamageBonus?: number;
  damageBonus?: number;
  critBonus?: number;
  carryCapacityBonus?: number;
  difficultyReduction?: { skill?: string; amount: number };
  descriptionKey?: string;
}
