import { Router } from 'express';
import { db } from '../db';
import { items, ammunition, food, weapons, generalGoods } from '../db/schema/items';
import { eq, lte, and, inArray } from 'drizzle-orm';

type ItemType = 'weapon' | 'armor' | 'powerArmor' | 'robotArmor' | 'clothing' | 'ammunition' | 'syringerAmmo' | 'chem' | 'food' | 'generalGood' | 'oddity';

const router = Router();

// ===== Scavenging tables (static data) =====

type AreaType = 'Residential' | 'Commercial' | 'Industrial' | 'Medical' | 'Military/Police' | 'Hideout' | 'Mutant' | 'Vault' | 'Public';
type AreaSize = 'Tiny' | 'Small' | 'Average' | 'Large';
type LootCategory = 'Ammunition' | 'Armor' | 'Clothing' | 'Food' | 'Beverages' | 'Chems' | 'Melee Weapons' | 'Ranged Weapons' | 'Thrown/Explosives' | 'Oddities/Valuables' | 'Junk';
type MerchantCategory = 'Weapons' | 'Ammunition' | 'Armor' | 'Power Armor' | 'Clothing' | 'Chems' | 'Food/Drink' | 'General Goods';

interface LootRange { min: number; max: number; }

const r = (min: number, max: number): LootRange => ({ min, max });

const scavengingTables: Record<AreaType, Record<LootCategory, Record<AreaSize, LootRange>>> = {
  Residential: {
    Ammunition: { Tiny: r(0,1), Small: r(0,1), Average: r(0,1), Large: r(0,3) },
    Armor: { Tiny: r(0,0), Small: r(0,0), Average: r(0,0), Large: r(0,1) },
    Clothing: { Tiny: r(0,0), Small: r(1,2), Average: r(1,2), Large: r(2,4) },
    Food: { Tiny: r(0,0), Small: r(1,3), Average: r(2,4), Large: r(3,6) },
    Beverages: { Tiny: r(0,0), Small: r(1,2), Average: r(1,3), Large: r(2,4) },
    Chems: { Tiny: r(0,1), Small: r(0,1), Average: r(0,1), Large: r(0,2) },
    'Melee Weapons': { Tiny: r(0,0), Small: r(0,0), Average: r(0,0), Large: r(0,1) },
    'Ranged Weapons': { Tiny: r(0,1), Small: r(0,1), Average: r(0,1), Large: r(0,2) },
    'Thrown/Explosives': { Tiny: r(0,0), Small: r(0,0), Average: r(0,0), Large: r(0,1) },
    'Oddities/Valuables': { Tiny: r(0,1), Small: r(0,0), Average: r(0,0), Large: r(1,2) },
    Junk: { Tiny: r(0,2), Small: r(1,4), Average: r(2,6), Large: r(4,9) },
  },
  Commercial: {
    Ammunition: { Tiny: r(0,0), Small: r(0,1), Average: r(0,1), Large: r(0,3) },
    Armor: { Tiny: r(0,0), Small: r(0,0), Average: r(0,0), Large: r(0,1) },
    Clothing: { Tiny: r(0,0), Small: r(0,2), Average: r(1,2), Large: r(1,4) },
    Food: { Tiny: r(0,1), Small: r(0,2), Average: r(1,2), Large: r(1,4) },
    Beverages: { Tiny: r(0,1), Small: r(1,2), Average: r(1,2), Large: r(2,4) },
    Chems: { Tiny: r(0,0), Small: r(0,1), Average: r(0,1), Large: r(0,2) },
    'Melee Weapons': { Tiny: r(0,0), Small: r(0,0), Average: r(0,1), Large: r(0,2) },
    'Ranged Weapons': { Tiny: r(0,1), Small: r(0,1), Average: r(0,2), Large: r(1,4) },
    'Thrown/Explosives': { Tiny: r(0,0), Small: r(0,0), Average: r(0,1), Large: r(0,2) },
    'Oddities/Valuables': { Tiny: r(1,2), Small: r(1,4), Average: r(2,4), Large: r(3,6) },
    Junk: { Tiny: r(1,2), Small: r(2,4), Average: r(3,6), Large: r(5,9) },
  },
  Industrial: {
    Ammunition: { Tiny: r(0,0), Small: r(0,1), Average: r(0,1), Large: r(0,3) },
    Armor: { Tiny: r(0,0), Small: r(0,0), Average: r(0,0), Large: r(0,1) },
    Clothing: { Tiny: r(0,0), Small: r(0,2), Average: r(1,2), Large: r(1,4) },
    Food: { Tiny: r(0,1), Small: r(0,2), Average: r(0,2), Large: r(1,3) },
    Beverages: { Tiny: r(0,1), Small: r(1,2), Average: r(1,2), Large: r(2,4) },
    Chems: { Tiny: r(0,0), Small: r(0,1), Average: r(0,1), Large: r(0,2) },
    'Melee Weapons': { Tiny: r(0,1), Small: r(0,2), Average: r(2,4), Large: r(3,6) },
    'Ranged Weapons': { Tiny: r(0,0), Small: r(0,1), Average: r(0,1), Large: r(0,2) },
    'Thrown/Explosives': { Tiny: r(0,1), Small: r(0,1), Average: r(1,2), Large: r(1,3) },
    'Oddities/Valuables': { Tiny: r(0,1), Small: r(1,2), Average: r(1,4), Large: r(2,4) },
    Junk: { Tiny: r(1,2), Small: r(2,4), Average: r(4,6), Large: r(6,9) },
  },
  Medical: {
    Ammunition: { Tiny: r(0,0), Small: r(0,0), Average: r(0,1), Large: r(0,1) },
    Armor: { Tiny: r(0,0), Small: r(0,0), Average: r(0,0), Large: r(0,1) },
    Clothing: { Tiny: r(0,0), Small: r(1,2), Average: r(2,4), Large: r(3,6) },
    Food: { Tiny: r(0,1), Small: r(0,2), Average: r(1,4), Large: r(2,4) },
    Beverages: { Tiny: r(0,1), Small: r(1,2), Average: r(1,2), Large: r(2,4) },
    Chems: { Tiny: r(1,2), Small: r(2,4), Average: r(3,6), Large: r(4,9) },
    'Melee Weapons': { Tiny: r(0,0), Small: r(0,0), Average: r(0,1), Large: r(0,1) },
    'Ranged Weapons': { Tiny: r(0,0), Small: r(0,0), Average: r(0,1), Large: r(0,1) },
    'Thrown/Explosives': { Tiny: r(0,0), Small: r(0,0), Average: r(0,1), Large: r(0,1) },
    'Oddities/Valuables': { Tiny: r(0,1), Small: r(0,1), Average: r(1,2), Large: r(2,4) },
    Junk: { Tiny: r(0,1), Small: r(2,4), Average: r(3,6), Large: r(4,9) },
  },
  'Military/Police': {
    Ammunition: { Tiny: r(1,2), Small: r(2,4), Average: r(4,6), Large: r(6,9) },
    Armor: { Tiny: r(0,1), Small: r(1,2), Average: r(2,4), Large: r(3,6) },
    Clothing: { Tiny: r(0,1), Small: r(0,2), Average: r(1,2), Large: r(2,4) },
    Food: { Tiny: r(0,1), Small: r(0,2), Average: r(1,2), Large: r(2,4) },
    Beverages: { Tiny: r(0,1), Small: r(1,2), Average: r(1,2), Large: r(2,4) },
    Chems: { Tiny: r(0,1), Small: r(0,2), Average: r(1,2), Large: r(1,4) },
    'Melee Weapons': { Tiny: r(0,1), Small: r(0,2), Average: r(1,3), Large: r(2,4) },
    'Ranged Weapons': { Tiny: r(1,1), Small: r(1,2), Average: r(2,4), Large: r(3,6) },
    'Thrown/Explosives': { Tiny: r(1,1), Small: r(1,2), Average: r(2,4), Large: r(3,6) },
    'Oddities/Valuables': { Tiny: r(0,1), Small: r(0,1), Average: r(1,2), Large: r(2,4) },
    Junk: { Tiny: r(0,1), Small: r(1,4), Average: r(2,4), Large: r(3,6) },
  },
  Hideout: {
    Ammunition: { Tiny: r(0,1), Small: r(1,2), Average: r(2,4), Large: r(3,6) },
    Armor: { Tiny: r(0,1), Small: r(1,2), Average: r(2,4), Large: r(2,6) },
    Clothing: { Tiny: r(0,1), Small: r(0,2), Average: r(1,2), Large: r(2,4) },
    Food: { Tiny: r(0,1), Small: r(1,2), Average: r(2,4), Large: r(3,6) },
    Beverages: { Tiny: r(0,1), Small: r(1,2), Average: r(1,4), Large: r(2,6) },
    Chems: { Tiny: r(0,1), Small: r(0,2), Average: r(1,4), Large: r(2,6) },
    'Melee Weapons': { Tiny: r(0,1), Small: r(1,2), Average: r(2,4), Large: r(2,6) },
    'Ranged Weapons': { Tiny: r(0,1), Small: r(1,2), Average: r(1,4), Large: r(2,4) },
    'Thrown/Explosives': { Tiny: r(0,2), Small: r(0,2), Average: r(1,4), Large: r(2,6) },
    'Oddities/Valuables': { Tiny: r(1,2), Small: r(1,2), Average: r(1,4), Large: r(2,4) },
    Junk: { Tiny: r(0,1), Small: r(1,2), Average: r(2,4), Large: r(2,6) },
  },
  Mutant: {
    Ammunition: { Tiny: r(0,1), Small: r(1,2), Average: r(2,4), Large: r(3,6) },
    Armor: { Tiny: r(0,1), Small: r(1,2), Average: r(2,4), Large: r(2,6) },
    Clothing: { Tiny: r(0,0), Small: r(0,2), Average: r(1,2), Large: r(2,4) },
    Food: { Tiny: r(0,0), Small: r(1,2), Average: r(2,4), Large: r(2,6) },
    Beverages: { Tiny: r(0,0), Small: r(1,2), Average: r(1,4), Large: r(1,4) },
    Chems: { Tiny: r(0,0), Small: r(0,1), Average: r(0,2), Large: r(1,2) },
    'Melee Weapons': { Tiny: r(0,1), Small: r(1,2), Average: r(2,4), Large: r(2,6) },
    'Ranged Weapons': { Tiny: r(0,1), Small: r(1,2), Average: r(1,4), Large: r(2,4) },
    'Thrown/Explosives': { Tiny: r(0,2), Small: r(0,2), Average: r(1,4), Large: r(2,6) },
    'Oddities/Valuables': { Tiny: r(0,0), Small: r(0,1), Average: r(1,2), Large: r(1,4) },
    Junk: { Tiny: r(1,2), Small: r(2,4), Average: r(2,6), Large: r(3,6) },
  },
  Vault: {
    Ammunition: { Tiny: r(1,2), Small: r(1,4), Average: r(2,4), Large: r(2,6) },
    Armor: { Tiny: r(0,0), Small: r(0,0), Average: r(0,0), Large: r(0,1) },
    Clothing: { Tiny: r(0,0), Small: r(1,2), Average: r(1,2), Large: r(2,4) },
    Food: { Tiny: r(0,1), Small: r(1,3), Average: r(2,4), Large: r(3,6) },
    Beverages: { Tiny: r(0,1), Small: r(1,2), Average: r(1,3), Large: r(2,4) },
    Chems: { Tiny: r(0,1), Small: r(0,1), Average: r(0,1), Large: r(1,2) },
    'Melee Weapons': { Tiny: r(0,1), Small: r(0,1), Average: r(1,2), Large: r(1,4) },
    'Ranged Weapons': { Tiny: r(0,1), Small: r(0,1), Average: r(1,2), Large: r(2,4) },
    'Thrown/Explosives': { Tiny: r(0,1), Small: r(0,1), Average: r(1,2), Large: r(2,4) },
    'Oddities/Valuables': { Tiny: r(0,0), Small: r(0,0), Average: r(0,0), Large: r(1,2) },
    Junk: { Tiny: r(0,1), Small: r(0,2), Average: r(1,2), Large: r(2,4) },
  },
  Public: {
    Ammunition: { Tiny: r(0,0), Small: r(0,1), Average: r(0,1), Large: r(0,3) },
    Armor: { Tiny: r(0,0), Small: r(0,0), Average: r(0,0), Large: r(0,1) },
    Clothing: { Tiny: r(0,0), Small: r(0,2), Average: r(1,2), Large: r(1,4) },
    Food: { Tiny: r(0,1), Small: r(0,2), Average: r(1,2), Large: r(1,4) },
    Beverages: { Tiny: r(0,1), Small: r(1,2), Average: r(1,2), Large: r(2,4) },
    Chems: { Tiny: r(0,0), Small: r(0,1), Average: r(0,1), Large: r(0,2) },
    'Melee Weapons': { Tiny: r(0,0), Small: r(0,0), Average: r(0,1), Large: r(0,2) },
    'Ranged Weapons': { Tiny: r(0,0), Small: r(0,0), Average: r(0,1), Large: r(0,2) },
    'Thrown/Explosives': { Tiny: r(0,0), Small: r(0,0), Average: r(0,0), Large: r(0,1) },
    'Oddities/Valuables': { Tiny: r(1,2), Small: r(1,4), Average: r(2,4), Large: r(3,6) },
    Junk: { Tiny: r(1,2), Small: r(2,4), Average: r(3,6), Large: r(5,9) },
  },
};

const areaTypes: AreaType[] = ['Residential','Commercial','Industrial','Medical','Military/Police','Hideout','Mutant','Vault','Public'];
const areaSizes: AreaSize[] = ['Tiny','Small','Average','Large'];
const lootCategories: LootCategory[] = ['Ammunition','Armor','Clothing','Food','Beverages','Chems','Melee Weapons','Ranged Weapons','Thrown/Explosives','Oddities/Valuables','Junk'];
const merchantCategories: MerchantCategory[] = ['Weapons','Ammunition','Armor','Power Armor','Clothing','Chems','Food/Drink','General Goods'];
const merchantCapsByWealth = [20, 50, 150, 400, 1000];

const discoveryDegrees = [
  { id: 'untouched', difficulty: 0 },
  { id: 'partiallySearched', difficulty: 1 },
  { id: 'carefullySearched', difficulty: 2 },
  { id: 'cleanedOut', difficulty: 3 },
];

// ===== Helpers =====

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getMaxRarityForLevel(level: number): number {
  return Math.min(Math.ceil(level / 4), 5);
}

// Map loot categories to item types in DB
const lootCategoryToItemTypes: Record<LootCategory, ItemType[]> = {
  'Ammunition': ['ammunition'],
  'Armor': ['armor'],
  'Clothing': ['clothing'],
  'Food': ['food'],
  'Beverages': ['food'],
  'Chems': ['chem'],
  'Melee Weapons': ['weapon'],
  'Ranged Weapons': ['weapon'],
  'Thrown/Explosives': ['weapon'],
  'Oddities/Valuables': ['oddity'],
  'Junk': ['generalGood'],
};

const merchantCategoryToItemTypes: Record<MerchantCategory, ItemType[]> = {
  'Weapons': ['weapon'],
  'Ammunition': ['ammunition'],
  'Armor': ['armor'],
  'Power Armor': ['powerArmor'],
  'Clothing': ['clothing'],
  'Chems': ['chem'],
  'Food/Drink': ['food'],
  'General Goods': ['generalGood'],
};

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
  foodType?: string | null;
  skill?: string | null;
}

async function getItemsForLootCategory(category: LootCategory, maxRarity: number): Promise<DbItem[]> {
  const itemTypes = lootCategoryToItemTypes[category];

  const baseItems = await db
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
    .where(and(
      inArray(items.itemType, itemTypes),
      lte(items.rarity, maxRarity)
    ));

  // For categories needing sub-filtering, fetch extra data
  if (category === 'Ammunition') {
    const ammoData = await db.select().from(ammunition);
    const ammoMap = new Map(ammoData.map(a => [a.itemId, a]));
    return baseItems.map(item => ({
      ...item,
      flatAmount: ammoMap.get(item.id)?.flatAmount,
      randomAmount: ammoMap.get(item.id)?.randomAmount,
    }));
  }

  if (category === 'Food') {
    const foodData = await db.select().from(food);
    const foodMap = new Map(foodData.map(f => [f.itemId, f]));
    return baseItems.filter(item => foodMap.get(item.id)?.foodType === 'food');
  }

  if (category === 'Beverages') {
    const foodData = await db.select().from(food);
    const foodMap = new Map(foodData.map(f => [f.itemId, f]));
    return baseItems.filter(item => foodMap.get(item.id)?.foodType === 'drink');
  }

  if (category === 'Melee Weapons' || category === 'Ranged Weapons' || category === 'Thrown/Explosives') {
    const weaponData = await db.select().from(weapons);
    const weaponMap = new Map(weaponData.map(w => [w.itemId, w]));
    const meleeSkills = ['meleeWeapons', 'unarmed'];
    const rangedSkills = ['smallGuns', 'bigGuns', 'energyWeapons'];
    const thrownSkills = ['explosives', 'throwing'];

    return baseItems.filter(item => {
      const w = weaponMap.get(item.id);
      if (!w) return false;
      if (category === 'Melee Weapons') return meleeSkills.includes(w.skill);
      if (category === 'Ranged Weapons') return rangedSkills.includes(w.skill);
      return thrownSkills.includes(w.skill);
    });
  }

  if (category === 'Junk') {
    const ggData = await db.select().from(generalGoods);
    const ggMap = new Map(ggData.map(g => [g.itemId, g]));
    return baseItems.filter(item => ggMap.get(item.id)?.goodType === 'Materials');
  }

  return baseItems;
}

async function getItemsForMerchantCategory(category: MerchantCategory, maxRarity: number): Promise<DbItem[]> {
  const itemTypes = merchantCategoryToItemTypes[category];

  const baseItems = await db
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
    .where(and(
      inArray(items.itemType, itemTypes),
      lte(items.rarity, maxRarity)
    ));

  if (category === 'Ammunition') {
    const ammoData = await db.select().from(ammunition);
    const ammoMap = new Map(ammoData.map(a => [a.itemId, a]));
    return baseItems.map(item => ({
      ...item,
      flatAmount: ammoMap.get(item.id)?.flatAmount,
      randomAmount: ammoMap.get(item.id)?.randomAmount,
    }));
  }

  return baseItems;
}

function pickByRarity<T extends { rarity: number }>(items: T[], maxRarity: number): T {
  const weightedPool: T[] = [];
  for (const item of items) {
    const weight = Math.pow(maxRarity - item.rarity + 1, 2);
    for (let i = 0; i < weight; i++) {
      weightedPool.push(item);
    }
  }
  return weightedPool[Math.floor(Math.random() * weightedPool.length)];
}

// ===== Routes =====

router.get('/scavenging-tables', (_req, res) => {
  res.json({
    tables: scavengingTables,
    areaTypes,
    areaSizes,
    lootCategories,
    discoveryDegrees,
    merchantCategories,
    merchantCapsByWealth,
  });
});

router.post('/loot', async (req, res) => {
  try {
    const { areaType, areaSize, locationLevel, apSpend } = req.body as {
      areaType: AreaType;
      areaSize: AreaSize;
      locationLevel: number;
      apSpend: Partial<Record<LootCategory, number>>;
    };

    const table = scavengingTables[areaType];
    if (!table) {
      res.status(400).json({ error: 'Invalid area type' });
      return;
    }

    const maxRarity = getMaxRarityForLevel(locationLevel);
    const resultItems: Array<{
      itemId: number;
      name: string;
      nameKey: string | null;
      itemType: string;
      quantity: number;
      value: number;
      weight: number;
      rarity: number;
      category: LootCategory;
    }> = [];

    for (const category of lootCategories) {
      const range = table[category]?.[areaSize];
      if (!range) continue;

      const totalRolls = range.min + (apSpend[category] || 0);
      if (totalRolls <= 0) continue;

      const categoryItems = await getItemsForLootCategory(category, maxRarity);
      if (categoryItems.length === 0) continue;

      for (let i = 0; i < totalRolls; i++) {
        const item = pickByRarity(categoryItems, maxRarity);

        let quantity = 1;
        if (category === 'Ammunition' && item.flatAmount != null && item.randomAmount != null) {
          quantity = item.flatAmount + randomInt(0, item.randomAmount);
        }

        const existing = resultItems.find(ri => ri.itemId === item.id && ri.category === category);
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

    const totalValue = resultItems.reduce((s, i) => s + i.value * i.quantity, 0);
    const totalWeight = resultItems.reduce((s, i) => s + i.weight * i.quantity, 0);

    res.json({
      areaType,
      areaSize,
      locationLevel,
      maxRarity,
      items: resultItems,
      totalValue,
      totalWeight,
    });
  } catch (err) {
    console.error('Loot generation error:', err);
    res.status(500).json({ error: 'Failed to generate loot' });
  }
});

router.post('/merchant', async (req, res) => {
  try {
    const { wealthRating, isTraveling, categories } = req.body as {
      wealthRating: number;
      isTraveling: boolean;
      categories: MerchantCategory[];
    };

    const maxRarity = Math.min(wealthRating, 5);
    const baseCount = wealthRating * 3;
    const itemCount = isTraveling ? Math.floor(baseCount * 0.6) : baseCount;
    const availableCaps = merchantCapsByWealth[wealthRating - 1] || 20;

    const activeCategories = categories.length > 0 ? categories : merchantCategories;
    const itemsPerCategory = Math.ceil(itemCount / activeCategories.length);

    const resultItems: Array<{
      itemId: number;
      name: string;
      nameKey: string | null;
      itemType: string;
      quantity: number;
      value: number;
      weight: number;
      rarity: number;
      category: MerchantCategory;
    }> = [];

    for (const category of activeCategories) {
      const count = randomInt(1, itemsPerCategory);
      const categoryItems = await getItemsForMerchantCategory(category, maxRarity);
      if (categoryItems.length === 0) continue;

      for (let i = 0; i < count; i++) {
        const item = pickByRarity(categoryItems, maxRarity);

        let quantity = 1;
        if (category === 'Ammunition' && item.flatAmount != null && item.randomAmount != null) {
          quantity = item.flatAmount + randomInt(0, item.randomAmount);
        } else if (['Chems', 'Food/Drink'].includes(category)) {
          quantity = randomInt(1, isTraveling ? 2 : 4);
        }

        const existing = resultItems.find(ri => ri.itemId === item.id && ri.category === category);
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

    const totalValue = resultItems.reduce((s, i) => s + i.value * i.quantity, 0);

    res.json({
      wealthRating,
      isTraveling,
      availableCaps,
      items: resultItems,
      totalValue,
    });
  } catch (err) {
    console.error('Merchant generation error:', err);
    res.status(500).json({ error: 'Failed to generate merchant' });
  }
});

export default router;
