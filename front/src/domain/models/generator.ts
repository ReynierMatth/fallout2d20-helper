export type LootCategory =
  | 'Ammunition' | 'Armor' | 'Clothing' | 'Food' | 'Beverages'
  | 'Chems' | 'Melee Weapons' | 'Ranged Weapons' | 'Thrown/Explosives'
  | 'Oddities/Valuables' | 'Junk';

export type MerchantCategory =
  | 'Weapons' | 'Ammunition' | 'Armor' | 'Power Armor'
  | 'Clothing' | 'Chems' | 'Food/Drink' | 'General Goods';

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
}

export interface LootResult {
  areaType: string;
  areaSize: string;
  locationLevel: number;
  maxRarity: number;
  items: GeneratedLootItem[];
  totalValue: number;
  totalWeight: number;
}

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

export interface LootParams {
  areaType: string;
  areaSize: string;
  locationLevel: number;
  apSpend: Partial<Record<LootCategory, number>>;
}

export interface MerchantParams {
  wealthRating: number;
  isTraveling: boolean;
  categories: MerchantCategory[];
}
