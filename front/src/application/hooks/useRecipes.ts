import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRepositories } from '../providers/RepositoryProvider';
import { fetchApi } from '../../infrastructure/http/httpClient';
import type { WorkbenchType } from '../../domain/models/recipe';

export interface MaterialItemIds {
  common: number | null;
  uncommon: number | null;
  rare: number | null;
}

async function fetchMaterialItemIds(): Promise<MaterialItemIds> {
  const res = await fetch('/api/items/materials');
  const data: Record<string, number> = await res.json();
  return {
    common: data['items.materials.common'] ?? null,
    uncommon: data['items.materials.uncommon'] ?? null,
    rare: data['items.materials.rare'] ?? null,
  };
}

export function useMaterialItemIds() {
  return useQuery<MaterialItemIds>({
    queryKey: ['materialItemIds'],
    queryFn: fetchMaterialItemIds,
    staleTime: Infinity,
  });
}

export interface WeaponOption {
  id: number;
  name: string;
  nameKey: string | null;
}

export function useWeapons() {
  return useQuery<WeaponOption[]>({
    queryKey: ['weapons'],
    queryFn: () => fetchApi('/items/weapons'),
    staleTime: Infinity,
  });
}

export function useRecipes(workbenchType?: WorkbenchType, weaponId?: number | null) {
  const { recipes } = useRepositories();
  return useQuery({
    queryKey: ['recipes', workbenchType ?? 'all', weaponId ?? null],
    queryFn: () => recipes.list({
      ...(workbenchType && { workbenchType }),
      ...(weaponId != null && { weaponId }),
    }),
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
