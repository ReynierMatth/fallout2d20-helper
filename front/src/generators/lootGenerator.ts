import type {
  AreaType,
  AreaSize,
  LootCategory,
} from '../data/scavengingTables';
import { scavengingTables, getMaxRarityForLevel } from '../data/scavengingTables';
import { rangedWeapons, meleeWeapons, explosives } from '../data/weapons';
import { ammunition } from '../data/ammunition';
import { armor } from '../data/armor';
import { chems } from '../data/chems';
import { food } from '../data/food';
import { clothing } from '../data/clothing';
import { generalGoods, oddities } from '../data/generalGoods';
import { randomInt, pickByRarity, filterByMaxRarity } from './utils';

export interface LootItem {
  name: string;
  quantity: number;
  value: number;
  weight: number;
  rarity: number;
  category: LootCategory;
}

export interface ScavengingResult {
  areaType: AreaType;
  areaSize: AreaSize;
  items: LootItem[];
  totalValue: number;
  totalWeight: number;
  locationLevel: number;
}

interface BaseItem {
  name: string;
  value: number;
  weight: number;
  rarity: number;
}

function getItemsForCategory(category: LootCategory): BaseItem[] {
  switch (category) {
    case 'Ammunition':
      return ammunition;
    case 'Armor':
      return armor;
    case 'Clothing':
      return clothing;
    case 'Food':
      return food.filter(f => f.type === 'food');
    case 'Beverages':
      return food.filter(f => f.type === 'drink');
    case 'Chems':
      return chems;
    case 'Melee Weapons':
      return meleeWeapons;
    case 'Ranged Weapons':
      return rangedWeapons;
    case 'Thrown/Explosives':
      return explosives;
    case 'Oddities/Valuables':
      return oddities;
    case 'Junk':
      return generalGoods.filter(g => g.type === 'Materials');
    default:
      return [];
  }
}

export interface GenerateLootParams {
  areaType: AreaType;
  areaSize: AreaSize;
  locationLevel: number;
  apSpend: Partial<Record<LootCategory, number>>;
}

export function generateLoot(params: GenerateLootParams): ScavengingResult {
  const { areaType, areaSize, locationLevel, apSpend } = params;

  const table = scavengingTables[areaType];
  const maxRarity = getMaxRarityForLevel(locationLevel);
  const items: LootItem[] = [];

  (Object.keys(table) as LootCategory[]).forEach(category => {
    const range = table[category][areaSize];
    // Base rolls (min) + AP bonus rolls
    const totalRolls = range.min + (apSpend[category] || 0);

    if (totalRolls <= 0) return;

    const categoryItems = getItemsForCategory(category);
    if (categoryItems.length === 0) return;

    // Filter by location level rarity
    const filteredItems = filterByMaxRarity(categoryItems, maxRarity);
    if (filteredItems.length === 0) return;

    for (let i = 0; i < totalRolls; i++) {
      const item = pickByRarity(filteredItems, maxRarity);

      // For ammunition, use the flatAmount/randomAmount if available
      let quantity = 1;
      if (category === 'Ammunition') {
        const ammoItem = item as unknown as typeof ammunition[0];
        if ('flatAmount' in ammoItem && 'randomAmount' in ammoItem) {
          quantity = ammoItem.flatAmount + randomInt(0, ammoItem.randomAmount);
        }
      }

      // Check if we already have this item
      const existingItem = items.find(
        i => i.name === item.name && i.category === category
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        items.push({
          name: item.name,
          quantity,
          value: item.value,
          weight: item.weight,
          rarity: item.rarity,
          category,
        });
      }
    }
  });

  const totalValue = items.reduce((sum, item) => sum + item.value * item.quantity, 0);
  const totalWeight = items.reduce((sum, item) => sum + item.weight * item.quantity, 0);

  return {
    areaType,
    areaSize,
    items,
    totalValue,
    totalWeight,
    locationLevel,
  };
}
