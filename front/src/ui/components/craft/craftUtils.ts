export interface MaterialCost {
  common: number;
  uncommon: number;
  rare: number;
}

const COMPLEXITY_MATERIAL_TABLE: Record<number, MaterialCost> = {
  1: { common: 2, uncommon: 0, rare: 0 },
  2: { common: 3, uncommon: 0, rare: 0 },
  3: { common: 4, uncommon: 2, rare: 0 },
  4: { common: 5, uncommon: 3, rare: 0 },
  5: { common: 6, uncommon: 4, rare: 2 },
  6: { common: 7, uncommon: 5, rare: 3 },
};

export function getMaterialCostByComplexity(complexity: number): MaterialCost {
  if (complexity >= 7) return { common: 8, uncommon: 6, rare: 4 };
  return COMPLEXITY_MATERIAL_TABLE[complexity] ?? { common: 2, uncommon: 0, rare: 0 };
}

const REPAIR_MATERIAL_TABLE: Record<number, MaterialCost> = {
  0: { common: 1, uncommon: 0, rare: 0 },
  1: { common: 2, uncommon: 0, rare: 0 },
  2: { common: 2, uncommon: 1, rare: 0 },
  3: { common: 2, uncommon: 2, rare: 0 },
  4: { common: 2, uncommon: 2, rare: 1 },
};

export function getRepairMaterialCostByRarity(rarity: number): MaterialCost {
  if (rarity >= 5) return { common: 3, uncommon: 3, rare: 1 };
  return REPAIR_MATERIAL_TABLE[rarity] ?? { common: 1, uncommon: 0, rare: 0 };
}

export function calcCraftingDifficulty(complexity: number, skillRank: number): number {
  return Math.max(0, complexity - skillRank);
}

export const SPECIFIC_INGREDIENT_WORKBENCHES = new Set(['chemistry', 'cooking']);
