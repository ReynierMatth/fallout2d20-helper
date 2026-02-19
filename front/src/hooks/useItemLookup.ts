import { useMemo } from 'react';
import { useItems } from './useItems';
import type { ItemType } from '../services/api';

export interface ItemLookupResult {
  id: number;
  itemType: ItemType;
  name: string;
  nameKey?: string;
}

// Map loot/merchant category names to itemType
function categoryToItemType(category: string): ItemType | null {
  switch (category) {
    case 'Ammunition':
      return 'ammunition';
    case 'Armor':
      return 'armor';
    case 'Power Armor':
      return 'powerArmor';
    case 'Clothing':
      return 'clothing';
    case 'Food':
    case 'Beverages':
    case 'Food/Drink':
      return 'food';
    case 'Chems':
      return 'chem';
    case 'Melee Weapons':
    case 'Ranged Weapons':
    case 'Thrown/Explosives':
    case 'Weapons':
      return 'weapon';
    case 'Oddities/Valuables':
      return 'oddity';
    case 'Junk':
    case 'General Goods':
      return 'generalGood';
    default:
      return null;
  }
}

export function useItemLookup() {
  const { items, loading, error } = useItems();

  // Build a lookup map: name -> { id, itemType }
  const lookupMap = useMemo(() => {
    if (!items) return new Map<string, ItemLookupResult>();

    const map = new Map<string, ItemLookupResult>();

    // Weapons
    items.weapons.forEach(w => {
      map.set(w.name.toLowerCase(), { id: w.id, itemType: 'weapon', name: w.name, nameKey: w.nameKey ?? undefined });
    });

    // Ammunition
    items.ammunition.forEach(a => {
      map.set(a.name.toLowerCase(), { id: a.id, itemType: 'ammunition', name: a.name, nameKey: a.nameKey ?? undefined });
    });

    // Armors
    items.armors.forEach(a => {
      map.set(a.name.toLowerCase(), { id: a.id, itemType: 'armor', name: a.name, nameKey: a.nameKey ?? undefined });
    });

    // Power Armors
    items.powerArmors?.forEach(pa => {
      map.set(pa.name.toLowerCase(), { id: pa.id, itemType: 'powerArmor', name: pa.name, nameKey: pa.nameKey ?? undefined });
    });

    // Clothing
    items.clothing.forEach(c => {
      map.set(c.name.toLowerCase(), { id: c.id, itemType: 'clothing', name: c.name, nameKey: c.nameKey ?? undefined });
    });

    // Chems
    items.chems.forEach(c => {
      map.set(c.name.toLowerCase(), { id: c.id, itemType: 'chem', name: c.name, nameKey: c.nameKey ?? undefined });
    });

    // Food
    items.food.forEach(f => {
      map.set(f.name.toLowerCase(), { id: f.id, itemType: 'food', name: f.name, nameKey: f.nameKey ?? undefined });
    });

    // General Goods
    items.generalGoods.forEach(g => {
      map.set(g.name.toLowerCase(), { id: g.id, itemType: 'generalGood', name: g.name, nameKey: g.nameKey ?? undefined });
    });

    return map;
  }, [items]);

  // Find item by name (case insensitive)
  const findByName = (name: string): ItemLookupResult | null => {
    return lookupMap.get(name.toLowerCase()) ?? null;
  };

  // Find item by name and category hint (for loot/merchant results)
  const findByNameAndCategory = (name: string, category: string): ItemLookupResult | null => {
    // First try exact match
    const result = findByName(name);
    if (result) return result;

    // If not found by name alone, no luck
    return null;
  };

  return {
    findByName,
    findByNameAndCategory,
    loading,
    error,
    ready: !loading && !error && items !== null,
  };
}
