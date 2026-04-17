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
  ingredients?: RecipeIngredient[]; // included only for chemistry/cooking list responses
}

export interface RecipeDetail extends Recipe {
  ingredients: RecipeIngredient[];
}

export type RecipeState = 'craftable' | 'known_missing_materials' | 'unknown';
