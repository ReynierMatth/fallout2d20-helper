export type WorkbenchType = 'weapon' | 'armor' | 'chemistry' | 'cooking' | 'power_armor' | 'robot';
export type CraftingSkill = 'repair' | 'science' | 'survival' | 'explosives';
export type RecipeRarity = 'frequente' | 'peu_frequente' | 'rare';

export interface RecipePerkRequirement {
  id: number;
  perkId: string;
  minRank: number;
  perkNameKey: string | null;
}

export interface RecipeIngredient {
  id: number;
  itemId: number;
  quantity: number;
  itemName: string | null;
  itemNameKey: string | null;
}

export interface ResultModEffect {
  id: number;
  effectType: string;
  numericValue: number | null;
  qualityName: string | null;
  qualityValue: number | null;
  ammoType: string | null;
  descriptionKey: string | null;
}

export interface ResultModItem {
  id: number;
  name: string;
  nameKey: string | null;
  value: number;
  rarity: number;
  weight: number;
  itemType: string;
}

export interface ResultMod {
  id: number;
  itemId: number;
  slot: string;
  applicableTo: string;
  nameAddKey: string | null;
  requiredPerk: string | null;
  requiredPerkRank: number | null;
  requiredPerk2: string | null;
  requiredPerkRank2: number | null;
  weightChange: number;
  item: ResultModItem | null;
  effects: ResultModEffect[];
}

export interface ResultItem {
  id: number;
  name: string;
  nameKey: string | null;
  value: number;
  rarity: number;
  weight: number;
  itemType: string;
}

export interface Recipe {
  id: number;
  name: string;
  nameKey: string | null;
  workbenchType: WorkbenchType;
  complexity: number;
  skill: CraftingSkill;
  rarity: RecipeRarity;
  resultModId: number | null;
  resultItemId: number | null;
  perkRequirements: RecipePerkRequirement[];
  ingredients?: RecipeIngredient[];
}

export interface RecipeDetail extends Recipe {
  ingredients: RecipeIngredient[];
  resultMod?: ResultMod | null;
  resultItem?: ResultItem | null;
}

export type RecipeState = 'craftable' | 'known_missing_materials' | 'unknown';
