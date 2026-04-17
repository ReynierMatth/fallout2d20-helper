export type WorkbenchType = 'weapon' | 'armor' | 'chemistry' | 'cooking' | 'power_armor' | 'robot';
export type CraftingSkill = 'repair' | 'science' | 'survival' | 'explosives';
export type RecipeRarity = 'frequente' | 'peu_frequente' | 'rare';

export interface RecipePerkReq {
  perkId: string;
  minRank: number;
}

export interface RecipeIngredient {
  itemName: string; // must match exact name in items table
  quantity: number;
}

export interface RecipeData {
  name: string;
  nameKey?: string;
  workbenchType: WorkbenchType;
  complexity: number;
  skill: CraftingSkill;
  rarity: RecipeRarity;
  resultModName?: string;  // must match exact name in items table (for mod recipes)
  resultItemName?: string; // must match exact name in items table (for item recipes)
  perkRequirements?: RecipePerkReq[];
  ingredients?: RecipeIngredient[]; // only for chemistry/cooking
}

// ── Weapon mod recipes ──────────────────────────────────────────────────────
export const WEAPON_MOD_RECIPES: RecipeData[] = [
  // Example — fill from fabricationfalloud2D20.pdf, section "Armes"
  {
    name: 'Fabriquer : Renfort plaqué (arme de mêlée)',
    workbenchType: 'weapon',
    complexity: 2,
    skill: 'repair',
    rarity: 'frequente',
    perkRequirements: [{ perkId: 'blacksmith', minRank: 1 }],
    resultModName: 'Renfort plaqué',
  },
];

// ── Armor mod recipes ────────────────────────────────────────────────────────
export const ARMOR_MOD_RECIPES: RecipeData[] = [
  {
    name: 'Fabriquer : Tissu balistique',
    workbenchType: 'armor',
    complexity: 3,
    skill: 'repair',
    rarity: 'frequente',
    perkRequirements: [{ perkId: 'armorer', minRank: 1 }],
    resultModName: 'Tissu balistique',
  },
];

// ── Power armor mod recipes ──────────────────────────────────────────────────
export const POWER_ARMOR_MOD_RECIPES: RecipeData[] = [];

// ── Robot mod recipes ────────────────────────────────────────────────────────
export const ROBOT_MOD_RECIPES: RecipeData[] = [];

// ── Chemistry recipes (drugs, explosives, syringe ammo) ─────────────────────
export const CHEMISTRY_RECIPES: RecipeData[] = [
  {
    name: 'Fabriquer : Stimpak',
    workbenchType: 'chemistry',
    complexity: 2,
    skill: 'science',
    rarity: 'frequente',
    resultItemName: 'Stimpak',
    ingredients: [
      { itemName: 'Plante médicinale', quantity: 2 },
      { itemName: 'Eau purifiée', quantity: 1 },
    ],
  },
];

// ── Cooking recipes ──────────────────────────────────────────────────────────
export const COOKING_RECIPES: RecipeData[] = [
  {
    name: 'Cuisiner : Viande de radscorpion',
    workbenchType: 'cooking',
    complexity: 1,
    skill: 'survival',
    rarity: 'frequente',
    resultItemName: 'Viande de radscorpion cuite',
    ingredients: [
      { itemName: 'Viande de radscorpion', quantity: 1 },
    ],
  },
];

export const ALL_RECIPES: RecipeData[] = [
  ...WEAPON_MOD_RECIPES,
  ...ARMOR_MOD_RECIPES,
  ...POWER_ARMOR_MOD_RECIPES,
  ...ROBOT_MOD_RECIPES,
  ...CHEMISTRY_RECIPES,
  ...COOKING_RECIPES,
];
