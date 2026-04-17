import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRepositories } from '../providers/RepositoryProvider';
import type { WorkbenchType } from '../../domain/models/recipe';

export function useRecipes(workbenchType?: WorkbenchType) {
  const { recipes } = useRepositories();
  return useQuery({
    queryKey: ['recipes', workbenchType ?? 'all'],
    queryFn: () => recipes.list(workbenchType ? { workbenchType } : undefined),
  });
}

export function useRecipe(id: number | null) {
  const { recipes } = useRepositories();
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => recipes.get(id!),
    enabled: id !== null,
  });
}

export function useKnownRecipes(characterId: number | null) {
  const { recipes } = useRepositories();
  return useQuery({
    queryKey: ['knownRecipes', characterId],
    queryFn: () => recipes.getKnownRecipeIds(characterId!),
    enabled: characterId !== null,
  });
}

export function useMarkRecipeKnown(characterId: number | null) {
  const { recipes } = useRepositories();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recipeId: number) => recipes.markAsKnown(characterId!, recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knownRecipes', characterId] });
    },
  });
}

export function useForgetRecipe(characterId: number | null) {
  const { recipes } = useRepositories();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recipeId: number) => recipes.forgetRecipe(characterId!, recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knownRecipes', characterId] });
    },
  });
}
