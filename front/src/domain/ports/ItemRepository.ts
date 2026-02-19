import type { AllItems, Weapon, Armor, PowerArmor, RobotArmor, Clothing, Ammunition, SyringerAmmo, Chem, Food, GeneralGood, Oddity, Magazine, Disease, BaseItem } from '../models/item';

export interface WeaponFilters {
  skill?: string;
  rarity?: number;
  minRarity?: number;
  maxRarity?: number;
}

export interface ArmorFilters {
  location?: string;
  type?: string;
  set?: string;
  rarity?: number;
  minRarity?: number;
  maxRarity?: number;
}

export interface PowerArmorFilters {
  set?: string;
  location?: string;
  rarity?: number;
  minRarity?: number;
  maxRarity?: number;
}

export interface RarityFilters {
  rarity?: number;
  minRarity?: number;
  maxRarity?: number;
}

export interface ChemFilters extends RarityFilters {
  duration?: string;
  addictive?: boolean;
}

export interface FoodFilters extends RarityFilters {
  type?: string;
  irradiated?: boolean;
}

export interface GeneralGoodFilters extends RarityFilters {
  type?: string;
}

export interface ItemRepository {
  getItem(id: number): Promise<BaseItem & Record<string, any>>;
  getAll(): Promise<AllItems>;
  getWeapons(filters?: WeaponFilters): Promise<Weapon[]>;
  getWeapon(id: number): Promise<Weapon>;
  getArmors(filters?: ArmorFilters): Promise<Armor[]>;
  getArmor(id: number): Promise<Armor>;
  getPowerArmors(filters?: PowerArmorFilters): Promise<PowerArmor[]>;
  getPowerArmor(id: number): Promise<PowerArmor>;
  getRobotArmors(): Promise<RobotArmor[]>;
  getClothing(filters?: RarityFilters): Promise<Clothing[]>;
  getClothingItem(id: number): Promise<Clothing>;
  getAmmunition(filters?: RarityFilters): Promise<Ammunition[]>;
  getSyringerAmmo(): Promise<SyringerAmmo[]>;
  getChems(filters?: ChemFilters): Promise<Chem[]>;
  getChem(id: number): Promise<Chem>;
  getFood(filters?: FoodFilters): Promise<Food[]>;
  getFoodItem(id: number): Promise<Food>;
  getGeneralGoods(filters?: GeneralGoodFilters): Promise<GeneralGood[]>;
  getOddities(): Promise<Oddity[]>;
  getMagazines(): Promise<Magazine[]>;
  getMagazine(id: number): Promise<Magazine>;
  getDiseases(): Promise<Disease[]>;
  getDisease(id: number): Promise<Disease>;
}
