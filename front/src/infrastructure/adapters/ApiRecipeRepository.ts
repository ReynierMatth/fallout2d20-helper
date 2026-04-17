import type { RecipeRepository, RecipeFilters } from '../../domain/ports/RecipeRepository';
import type { Recipe, RecipeDetail } from '../../domain/models/recipe';
import { fetchApi, buildQueryString } from '../http/httpClient';

export class ApiRecipeRepository implements RecipeRepository {
  list(filters?: RecipeFilters): Promise<Recipe[]> {
    const query = buildQueryString({ workbench_type: filters?.workbenchType });
    return fetchApi(`/recipes${query}`);
  }

  get(id: number): Promise<RecipeDetail> {
    return fetchApi(`/recipes/${id}`);
  }

  getKnownRecipeIds(characterId: number): Promise<number[]> {
    return fetchApi(`/recipes/known/${characterId}`);
  }

  markAsKnown(characterId: number, recipeId: number): Promise<void> {
    return fetchApi(`/recipes/known/${characterId}/${recipeId}`, { method: 'POST' });
  }

  forgetRecipe(characterId: number, recipeId: number): Promise<void> {
    return fetchApi(`/recipes/known/${characterId}/${recipeId}`, { method: 'DELETE' });
  }
}
