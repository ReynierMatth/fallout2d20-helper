import type { Recipe, RecipeDetail, WorkbenchType } from '../models/recipe';

export interface RecipeFilters {
  workbenchType?: WorkbenchType;
  weaponId?: number;
}

export interface RecipeRepository {
  list(filters?: RecipeFilters): Promise<Recipe[]>;
  get(id: number): Promise<RecipeDetail>;
  getKnownRecipeIds(characterId: number): Promise<number[]>;
  markAsKnown(characterId: number, recipeId: number): Promise<void>;
  forgetRecipe(characterId: number, recipeId: number): Promise<void>;
}
