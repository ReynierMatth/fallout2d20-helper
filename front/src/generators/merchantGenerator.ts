import { weapons } from '../data/weapons';
import { ammunition } from '../data/ammunition';
import { armor, powerArmor } from '../data/armor';
import { chems } from '../data/chems';
import { food } from '../data/food';
import { clothing } from '../data/clothing';
import { generalGoods } from '../data/generalGoods';
import { randomInt, filterByMaxRarity, pickByRarity } from './utils';

export type MerchantCategory =
  | 'Weapons'
  | 'Ammunition'
  | 'Armor'
  | 'Power Armor'
  | 'Clothing'
  | 'Chems'
  | 'Food/Drink'
  | 'General Goods';

export interface MerchantItem {
  name: string;
  quantity: number;
  value: number;
  weight: number;
  rarity: number;
  category: MerchantCategory;
}

export interface MerchantInventory {
  name: string;
  wealthRating: number;
  isTraveling: boolean;
  availableCaps: number;
  items: MerchantItem[];
  totalValue: number;
}

const wealthDescriptions: Record<number, string> = {
  1: 'Leader of a small homestead',
  2: 'Traveling trader',
  3: 'Small settlement merchant',
  4: 'Established trader',
  5: 'Wealthy caravan master',
};

function getMaxRarityForWealth(wealthRating: number): number {
  // Wealth 1 = max rarity 1, Wealth 5 = max rarity 5
  return Math.min(wealthRating, 5);
}

function getItemCountForWealth(wealthRating: number, isTraveling: boolean): number {
  const base = wealthRating * 3;
  return isTraveling ? Math.floor(base * 0.6) : base;
}

function getCapsForWealth(wealthRating: number): number {
  const baseCaps = [20, 50, 150, 400, 1000];
  return baseCaps[wealthRating - 1] || 20;
}

export function generateMerchant(
  wealthRating: number = 1,
  isTraveling: boolean = false,
  categories: MerchantCategory[] = []
): MerchantInventory {
  const maxRarity = getMaxRarityForWealth(wealthRating);
  const itemCount = getItemCountForWealth(wealthRating, isTraveling);
  const availableCaps = getCapsForWealth(wealthRating);

  const items: MerchantItem[] = [];

  // If no categories specified, use all
  const activeCategories = categories.length > 0
    ? categories
    : ['Weapons', 'Ammunition', 'Armor', 'Power Armor', 'Clothing', 'Chems', 'Food/Drink', 'General Goods'] as MerchantCategory[];

  // Distribute items across categories
  const itemsPerCategory = Math.ceil(itemCount / activeCategories.length);

  activeCategories.forEach(category => {
    const count = randomInt(1, itemsPerCategory);

    for (let i = 0; i < count; i++) {
      const item = generateMerchantItem(category, maxRarity, isTraveling);
      if (item) {
        // Check if we already have this item
        const existingItem = items.find(
          it => it.name === item.name && it.category === category
        );

        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          items.push(item);
        }
      }
    }
  });

  const totalValue = items.reduce((sum, item) => sum + item.value * item.quantity, 0);

  return {
    name: wealthDescriptions[wealthRating] || 'Mysterious trader',
    wealthRating,
    isTraveling,
    availableCaps,
    items,
    totalValue,
  };
}

function generateMerchantItem(
  category: MerchantCategory,
  maxRarity: number,
  isTraveling: boolean
): MerchantItem | null {
  let sourceItems: Array<{ name: string; value: number; rarity: number; weight: number }> = [];

  switch (category) {
    case 'Weapons':
      sourceItems = filterByMaxRarity(weapons, maxRarity);
      break;
    case 'Ammunition':
      sourceItems = filterByMaxRarity(ammunition, maxRarity);
      break;
    case 'Armor':
      sourceItems = filterByMaxRarity(armor, maxRarity);
      break;
    case 'Power Armor':
      sourceItems = filterByMaxRarity(powerArmor, maxRarity);
      break;
    case 'Clothing':
      sourceItems = filterByMaxRarity(clothing, maxRarity);
      break;
    case 'Chems':
      sourceItems = filterByMaxRarity(chems, maxRarity);
      break;
    case 'Food/Drink':
      sourceItems = filterByMaxRarity(food, maxRarity);
      break;
    case 'General Goods':
      sourceItems = filterByMaxRarity(generalGoods, maxRarity);
      break;
  }

  if (sourceItems.length === 0) return null;

  const item = pickByRarity(sourceItems, maxRarity);

  // Determine quantity
  let quantity = 1;
  if (category === 'Ammunition') {
    const ammoItem = item as typeof ammunition[0];
    if ('flatAmount' in ammoItem) {
      quantity = ammoItem.flatAmount + randomInt(0, ammoItem.randomAmount || 0);
    }
  } else if (['Chems', 'Food/Drink'].includes(category)) {
    quantity = randomInt(1, isTraveling ? 2 : 4);
  }

  return {
    name: item.name,
    quantity,
    value: item.value,
    weight: item.weight,
    rarity: item.rarity,
    category,
  };
}

export const merchantCategories: MerchantCategory[] = [
  'Weapons',
  'Ammunition',
  'Armor',
  'Power Armor',
  'Clothing',
  'Chems',
  'Food/Drink',
  'General Goods',
];
