import { useTranslation } from 'react-i18next';
import { CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { cn } from '../../../lib/cn';
import type { Recipe, RecipeState, RecipePerkRequirement } from '../../../domain/models/recipe';
import { SPECIFIC_INGREDIENT_WORKBENCHES, getMaterialCostByComplexity } from './craftUtils';
import type { RecipeIngredient } from '../../../domain/models/recipe';
import type { MaterialItemIds } from '../../../application/hooks/useRecipes';

interface CharacterInventoryItem {
  itemId: number;
  quantity: number;
  itemName?: string;
  itemNameKey?: string;
}

interface RecipeListProps {
  recipes: Recipe[];
  selectedId: number | null;
  character: { perks?: { perkId: string; rank: number }[]; skills?: { skill: string; rank: number }[] } | null;
  knownRecipeIds: number[];
  characterInventory: CharacterInventoryItem[];
  recipeIngredientMap: Map<number, RecipeIngredient[]>;
  materialItemIds?: MaterialItemIds;
  onSelect: (id: number) => void;
}

function hasRequiredPerks(
  recipe: Recipe,
  character: RecipeListProps['character']
): boolean {
  if (!recipe.perkRequirements?.length) return true;
  if (!character) return true;
  return recipe.perkRequirements.every((req: RecipePerkRequirement) => {
    const charPerk = character.perks?.find((p) => p.perkId === req.perkId);
    return charPerk && charPerk.rank >= req.minRank;
  });
}

function getRecipeState(
  recipe: Recipe,
  character: RecipeListProps['character'],
  knownRecipeIds: number[],
  characterInventory: CharacterInventoryItem[],
  recipeIngredientMap: Map<number, RecipeIngredient[]>,
  materialItemIds?: MaterialItemIds
): RecipeState {
  if (!character) return 'craftable';

  const perksOk = hasRequiredPerks(recipe, character);

  const isKnown =
    recipe.rarity === 'frequente' ||
    (recipe.rarity === 'peu_frequente' && perksOk) ||
    (recipe.rarity === 'rare' && knownRecipeIds.includes(recipe.id));

  if (!isKnown || !perksOk) return 'unknown';

  if (SPECIFIC_INGREDIENT_WORKBENCHES.has(recipe.workbenchType)) {
    const ingredients = recipeIngredientMap.get(recipe.id) ?? [];
    const hasMaterials = ingredients.every((ing) => {
      const inv = characterInventory.find((i) => i.itemId === ing.itemId);
      return (inv?.quantity ?? 0) >= ing.quantity;
    });
    return hasMaterials ? 'craftable' : 'known_missing_materials';
  }

  const cost = getMaterialCostByComplexity(recipe.complexity);
  const getQtyById = (id: number | null | undefined) =>
    id != null ? (characterInventory.find((i) => i.itemId === id)?.quantity ?? 0) : 0;
  const hasMaterials =
    getQtyById(materialItemIds?.common) >= cost.common &&
    getQtyById(materialItemIds?.uncommon) >= cost.uncommon &&
    getQtyById(materialItemIds?.rare) >= cost.rare;
  return hasMaterials ? 'craftable' : 'known_missing_materials';
}

const STATE_ORDER: Record<RecipeState, number> = {
  craftable: 0,
  known_missing_materials: 1,
  unknown: 2,
};

export function RecipeList({
  recipes,
  selectedId,
  character,
  knownRecipeIds,
  characterInventory,
  recipeIngredientMap,
  materialItemIds,
  onSelect,
}: RecipeListProps) {
  const { t } = useTranslation();

  const withState = recipes
    .map((r) => ({
      recipe: r,
      state: getRecipeState(r, character, knownRecipeIds, characterInventory, recipeIngredientMap, materialItemIds),
    }))
    .sort((a, b) => STATE_ORDER[a.state] - STATE_ORDER[b.state]);

  return (
    <ul className="space-y-1">
      {withState.map(({ recipe, state }) => {
        const isUnknown = state === 'unknown';
        const name = recipe.nameKey ? t(recipe.nameKey, { defaultValue: recipe.name }) : recipe.name;
        return (
          <li key={recipe.id}>
            <button
              type="button"
              onClick={() => onSelect(recipe.id)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-left transition-colors cursor-pointer',
                isUnknown
                  ? selectedId === recipe.id
                    ? 'bg-vault-yellow/20 text-vault-yellow-dark font-semibold'
                    : 'text-vault-yellow-dark/50 hover:bg-vault-blue-light/50'
                  : selectedId === recipe.id
                  ? 'bg-vault-yellow text-vault-blue font-semibold'
                  : 'text-vault-yellow hover:bg-vault-blue-light'
              )}
            >
              {state === 'craftable' && <CheckCircle size={14} className="text-green-400 shrink-0" />}
              {state === 'known_missing_materials' && <AlertCircle size={14} className="text-yellow-400 shrink-0" />}
              {state === 'unknown' && <Lock size={14} className="shrink-0" />}
              <span className="truncate">{name}</span>
            </button>
          </li>
        );
      })}
      {recipes.length === 0 && (
        <li className="text-vault-yellow-dark text-sm px-3 py-4 text-center">
          {t('common.noResults')}
        </li>
      )}
    </ul>
  );
}
