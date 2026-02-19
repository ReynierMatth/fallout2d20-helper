import { eq, lte, and, inArray } from 'drizzle-orm';
import { db } from '../db/index';
import { items, weapons, food, generalGoods, ammunition, oddities } from '../db/schema/items';
import type { AreaType, AreaSize, LootCategory } from '../data/scavengingTables';
import { scavengingTables, getMaxRarityForLevel } from '../data/scavengingTables';
import { randomInt, pickByRarity } from './utils';

export interface GeneratedLootItem {
  itemId: number;
  name: string;
  nameKey: string | null;
  itemType: string;
  quantity: number;
  value: number;
  weight: number;
  rarity: number;
  category: LootCategory;
  flatAmount?: number;
  randomAmount?: number;
}

export interface LootResult {
  areaType: AreaType;
  areaSize: AreaSize;
  locationLevel: number;
  maxRarity: number;
  items: GeneratedLootItem[];
  totalValue: number;
  totalWeight: number;
}

export interface GenerateLootParams {
  areaType: AreaType;
  areaSize: AreaSize;
  locationLevel: number;
  apSpend: Partial<Record<LootCategory, number>>;
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

async function getItemsForCategory(category: LootCategory, maxRarity: number): Promise<DbItem[]> {
  switch (category) {
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

    case 'Food': {
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
        .innerJoin(food, eq(items.id, food.itemId))
        .where(and(eq(items.itemType, 'food'), eq(food.foodType, 'food'), lte(items.rarity, maxRarity)));
      return rows;
    }

    case 'Beverages': {
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
        .innerJoin(food, eq(items.id, food.itemId))
        .where(and(eq(items.itemType, 'food'), eq(food.foodType, 'drink'), lte(items.rarity, maxRarity)));
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

    case 'Melee Weapons': {
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
        .innerJoin(weapons, eq(items.id, weapons.itemId))
        .where(and(
          eq(items.itemType, 'weapon'),
          inArray(weapons.skill, ['meleeWeapons', 'unarmed']),
          lte(items.rarity, maxRarity),
        ));
      return rows;
    }

    case 'Ranged Weapons': {
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
        .innerJoin(weapons, eq(items.id, weapons.itemId))
        .where(and(
          eq(items.itemType, 'weapon'),
          inArray(weapons.skill, ['smallGuns', 'energyWeapons', 'bigGuns']),
          lte(items.rarity, maxRarity),
        ));
      return rows;
    }

    case 'Thrown/Explosives': {
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
        .innerJoin(weapons, eq(items.id, weapons.itemId))
        .where(and(
          eq(items.itemType, 'weapon'),
          inArray(weapons.skill, ['throwing', 'explosives']),
          lte(items.rarity, maxRarity),
        ));
      return rows;
    }

    case 'Oddities/Valuables': {
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
        .where(and(eq(items.itemType, 'oddity'), lte(items.rarity, maxRarity)));
      return rows;
    }

    case 'Junk': {
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
        .innerJoin(generalGoods, eq(items.id, generalGoods.itemId))
        .where(and(eq(items.itemType, 'generalGood'), eq(generalGoods.goodType, 'Materials'), lte(items.rarity, maxRarity)));
      return rows;
    }

    default:
      return [];
  }
}

export async function generateLoot(params: GenerateLootParams): Promise<LootResult> {
  const { areaType, areaSize, locationLevel, apSpend } = params;
  const table = scavengingTables[areaType];
  const maxRarity = getMaxRarityForLevel(locationLevel);
  const resultItems: GeneratedLootItem[] = [];

  const categories = Object.keys(table) as LootCategory[];

  for (const category of categories) {
    const range = table[category][areaSize];
    const totalRolls = range.min + (apSpend[category] || 0);
    if (totalRolls <= 0) continue;

    const categoryItems = await getItemsForCategory(category, maxRarity);
    if (categoryItems.length === 0) continue;

    for (let i = 0; i < totalRolls; i++) {
      const item = pickByRarity(categoryItems, maxRarity);

      let quantity = 1;
      if (category === 'Ammunition' && item.flatAmount != null && item.randomAmount != null) {
        quantity = item.flatAmount + randomInt(0, item.randomAmount);
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
  const totalWeight = resultItems.reduce((sum, item) => sum + item.weight * item.quantity, 0);

  return {
    areaType,
    areaSize,
    locationLevel,
    maxRarity,
    items: resultItems,
    totalValue,
    totalWeight,
  };
}
