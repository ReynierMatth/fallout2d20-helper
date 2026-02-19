import type { ItemRepository, WeaponFilters, ArmorFilters, PowerArmorFilters, RarityFilters, ChemFilters, FoodFilters, GeneralGoodFilters } from '../../domain/ports/ItemRepository';
import type { AllItems, Weapon, Armor, PowerArmor, RobotArmor, Clothing, Ammunition, SyringerAmmo, Chem, Food, GeneralGood, Oddity, Magazine, Disease, BaseItem } from '../../domain/models/item';
import { fetchApi, buildQueryString } from '../http/httpClient';

export class ApiItemRepository implements ItemRepository {
  getItem(id: number): Promise<BaseItem & Record<string, any>> {
    return fetchApi(`/items/${id}`);
  }

  getAll(): Promise<AllItems> {
    return fetchApi('/items');
  }

  getWeapons(filters?: WeaponFilters): Promise<Weapon[]> {
    const query = buildQueryString({
      skill: filters?.skill,
      rarity: filters?.rarity,
      minRarity: filters?.minRarity,
      maxRarity: filters?.maxRarity,
    });
    return fetchApi(`/items/weapons${query}`);
  }

  getWeapon(id: number): Promise<Weapon> {
    return fetchApi(`/items/weapons/${id}`);
  }

  getArmors(filters?: ArmorFilters): Promise<Armor[]> {
    const query = buildQueryString({
      location: filters?.location,
      type: filters?.type,
      set: filters?.set,
      rarity: filters?.rarity,
      minRarity: filters?.minRarity,
      maxRarity: filters?.maxRarity,
    });
    return fetchApi(`/items/armors${query}`);
  }

  getArmor(id: number): Promise<Armor> {
    return fetchApi(`/items/armors/${id}`);
  }

  getPowerArmors(filters?: PowerArmorFilters): Promise<PowerArmor[]> {
    const query = buildQueryString({
      set: filters?.set,
      location: filters?.location,
      rarity: filters?.rarity,
      minRarity: filters?.minRarity,
      maxRarity: filters?.maxRarity,
    });
    return fetchApi(`/items/power-armors${query}`);
  }

  getPowerArmor(id: number): Promise<PowerArmor> {
    return fetchApi(`/items/power-armors/${id}`);
  }

  getRobotArmors(): Promise<RobotArmor[]> {
    return fetchApi('/items/robot-armors');
  }

  getClothing(filters?: RarityFilters): Promise<Clothing[]> {
    const query = buildQueryString({
      rarity: filters?.rarity,
      minRarity: filters?.minRarity,
      maxRarity: filters?.maxRarity,
    });
    return fetchApi(`/items/clothing${query}`);
  }

  getClothingItem(id: number): Promise<Clothing> {
    return fetchApi(`/items/clothing/${id}`);
  }

  getAmmunition(filters?: RarityFilters): Promise<Ammunition[]> {
    const query = buildQueryString({
      rarity: filters?.rarity,
      minRarity: filters?.minRarity,
      maxRarity: filters?.maxRarity,
    });
    return fetchApi(`/items/ammunition${query}`);
  }

  getSyringerAmmo(): Promise<SyringerAmmo[]> {
    return fetchApi('/items/syringer-ammo');
  }

  getChems(filters?: ChemFilters): Promise<Chem[]> {
    const query = buildQueryString({
      duration: filters?.duration,
      addictive: filters?.addictive,
      rarity: filters?.rarity,
      minRarity: filters?.minRarity,
      maxRarity: filters?.maxRarity,
    });
    return fetchApi(`/items/chems${query}`);
  }

  getChem(id: number): Promise<Chem> {
    return fetchApi(`/items/chems/${id}`);
  }

  getFood(filters?: FoodFilters): Promise<Food[]> {
    const query = buildQueryString({
      type: filters?.type,
      irradiated: filters?.irradiated,
      rarity: filters?.rarity,
      minRarity: filters?.minRarity,
      maxRarity: filters?.maxRarity,
    });
    return fetchApi(`/items/food${query}`);
  }

  getFoodItem(id: number): Promise<Food> {
    return fetchApi(`/items/food/${id}`);
  }

  getGeneralGoods(filters?: GeneralGoodFilters): Promise<GeneralGood[]> {
    const query = buildQueryString({
      type: filters?.type,
      rarity: filters?.rarity,
      minRarity: filters?.minRarity,
      maxRarity: filters?.maxRarity,
    });
    return fetchApi(`/items/general-goods${query}`);
  }

  getOddities(): Promise<Oddity[]> {
    return fetchApi('/items/oddities');
  }

  getMagazines(): Promise<Magazine[]> {
    return fetchApi('/items/magazines');
  }

  getMagazine(id: number): Promise<Magazine> {
    return fetchApi(`/items/magazines/${id}`);
  }

  getDiseases(): Promise<Disease[]> {
    return fetchApi('/diseases');
  }

  getDisease(id: number): Promise<Disease> {
    return fetchApi(`/diseases/${id}`);
  }
}
