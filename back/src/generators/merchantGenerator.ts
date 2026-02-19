import { eq, lte, and, inArray } from 'drizzle-orm';
import { db } from '../db/index';
import { items, weapons, food, ammunition } from '../db/schema/items';
import type { MerchantCategory } from '../data/scavengingTables';
import { MERCHANT_CAPS_BY_WEALTH } from '../data/scavengingTables';
import { randomInt, pickByRarity, filterByMaxRarity } from './utils';

export interface GeneratedMerchantItem {
  itemId: number;
  name: string;
  nameKey: string | null;
  itemType: string;
  quantity: number;
  value: number;
  weight: number;
  rarity: number;
  category: MerchantCategory;
}

export interface MerchantResult {
  wealthRating: number;
  isTraveling: boolean;
  availableCaps: number;
  items: GeneratedMerchantItem[];
  totalValue: number;
}

export interface GenerateMerchantParams {
  wealthRating: number;
  isTraveling: boolean;
  categories: MerchantCategory[];
}

interface DbItem {
  id: number;
  name: string;
  nameKey: string | null;
  itemType: string;
  value: number;
  weight: number;
  rarity: number;
  flatAmount?: number | null;
  randomAmount?: number | null;
}

async function getMerchantItemsForCategory(category: MerchantCategory, maxRarity: number): Promise<DbItem[]> {
  switch (category) {
    case 'Weapons': {
      const rows = await db
        .select({
          id: items.id,
          name: items.name,
          nameKey: items.nameKey,
          itemType: items.itemType,
          value: items.value,
          weight: items.weight,
          rarity: items.rarity,
        })
        .from(items)
        .where(and(eq(items.itemType, 'weapon'), lte(items.rarity, maxRarity)));
      return rows;
    }

    case 'Ammunition': {
      const rows = await db
        .select({
          id: items.id,
          name: items.name,
          nameKey: items.nameKey,
          itemType: items.itemType,
          value: items.value,
          weight: items.weight,
          rarity: items.rarity,
          flatAmount: ammunition.flatAmount,
          randomAmount: ammunition.randomAmount,
        })
        .from(items)
        .innerJoin(ammunition, eq(items.id, ammunition.itemId))
        .where(and(eq(items.itemType, 'ammunition'), lte(items.rarity, maxRarity)));
      return rows;
    }

    case 'Armor': {
      const rows = await db
        .select({
          id: items.id,
          name: items.name,
          nameKey: items.nameKey,
          itemType: items.itemType,
          value: items.value,
          weight: items.weight,
          rarity: items.rarity,
        })
        .from(items)
        .where(and(eq(items.itemType, 'armor'), lte(items.rarity, maxRarity)));
      return rows;
    }

    case 'Power Armor': {
      const rows = await db
        .select({
          id: items.id,
          name: items.name,
          nameKey: items.nameKey,
          itemType: items.itemType,
          value: items.value,
          weight: items.weight,
          rarity: items.rarity,
        })
        .from(items)
        .where(and(eq(items.itemType, 'powerArmor'), lte(items.rarity, maxRarity)));
      return rows;
    }

    case 'Clothing': {
      const rows = await db
        .select({
          id: items.id,
          name: items.name,
          nameKey: items.nameKey,
          itemType: items.itemType,
          value: items.value,
          weight: items.weight,
          rarity: items.rarity,
        })
        .from(items)
        .where(and(eq(items.itemType, 'clothing'), lte(items.rarity, maxRarity)));
      return rows;
    }

    case 'Chems': {
      const rows = await db
        .select({
          id: items.id,
          name: items.name,
          nameKey: items.nameKey,
          itemType: items.itemType,
          value: items.value,
          weight: items.weight,
          rarity: items.rarity,
        })
        .from(items)
        .where(and(eq(items.itemType, 'chem'), lte(items.rarity, maxRarity)));
      return rows;
    }

    case 'Food/Drink': {
      const rows = await db
        .select({
          id: items.id,
          name: items.name,
          nameKey: items.nameKey,
          itemType: items.itemType,
          value: items.value,
          weight: items.weight,
          rarity: items.rarity,
        })
        .from(items)
        .where(and(eq(items.itemType, 'food'), lte(items.rarity, maxRarity)));
      return rows;
    }

    case 'General Goods': {
      const rows = await db
        .select({
          id: items.id,
          name: items.name,
          nameKey: items.nameKey,
          itemType: items.itemType,
          value: items.value,
          weight: items.weight,
          rarity: items.rarity,
        })
        .from(items)
        .where(and(eq(items.itemType, 'generalGood'), lte(items.rarity, maxRarity)));
      return rows;
    }

    default:
      return [];
  }
}

function getMaxRarityForWealth(wealthRating: number): number {
  return Math.min(wealthRating, 5);
}

function getItemCountForWealth(wealthRating: number, isTraveling: boolean): number {
  const base = wealthRating * 3;
  return isTraveling ? Math.floor(base * 0.6) : base;
}

function getCapsForWealth(wealthRating: number): number {
  return MERCHANT_CAPS_BY_WEALTH[wealthRating - 1] || 20;
}

export async function generateMerchant(params: GenerateMerchantParams): Promise<MerchantResult> {
  const { wealthRating, isTraveling, categories } = params;
  const maxRarity = getMaxRarityForWealth(wealthRating);
  const itemCount = getItemCountForWealth(wealthRating, isTraveling);
  const availableCaps = getCapsForWealth(wealthRating);

  const allCategories: MerchantCategory[] = [
    'Weapons', 'Ammunition', 'Armor', 'Power Armor',
    'Clothing', 'Chems', 'Food/Drink', 'General Goods',
  ];
  const activeCategories = categories.length > 0 ? categories : allCategories;
  const itemsPerCategory = Math.ceil(itemCount / activeCategories.length);

  const resultItems: GeneratedMerchantItem[] = [];

  for (const category of activeCategories) {
    const count = randomInt(1, itemsPerCategory);
    const categoryItems = await getMerchantItemsForCategory(category, maxRarity);
    if (categoryItems.length === 0) continue;

    for (let i = 0; i < count; i++) {
      const item = pickByRarity(categoryItems, maxRarity);

      let quantity = 1;
      if (category === 'Ammunition' && item.flatAmount != null && item.randomAmount != null) {
        quantity = item.flatAmount + randomInt(0, item.randomAmount || 0);
      } else if (['Chems', 'Food/Drink'].includes(category)) {
        quantity = randomInt(1, isTraveling ? 2 : 4);
      }

      const existing = resultItems.find(
        ri => ri.itemId === item.id && ri.category === category
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        resultItems.push({
          itemId: item.id,
          name: item.name,
          nameKey: item.nameKey,
          itemType: item.itemType,
          quantity,
          value: item.value,
          weight: item.weight,
          rarity: item.rarity,
          category,
        });
      }
    }
  }

  const totalValue = resultItems.reduce((sum, item) => sum + item.value * item.quantity, 0);

  return {
    wealthRating,
    isTraveling,
    availableCaps,
    items: resultItems,
    totalValue,
  };
}
