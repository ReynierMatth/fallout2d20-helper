import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Wrench } from 'lucide-react';
import { WorkbenchNav } from '../components/craft/WorkbenchNav';
import { RecipeList } from '../components/craft/RecipeList';
import { RecipeDetail } from '../components/craft/RecipeDetail';
import { RepairPanel } from '../components/craft/RepairPanel';
import type { WorkbenchTab } from '../components/craft/WorkbenchNav';
import type { WorkbenchType } from '../../domain/models/recipe';
import { useRecipes, useRecipe, useKnownRecipes, useMarkRecipeKnown, useForgetRecipe } from '../../application/hooks/useRecipes';
import { useCharactersApi } from '../../hooks/useCharactersApi';
import { Select } from '../../components';

export function CraftPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const characterIdParam = searchParams.get('character');
  const [characterId, setCharacterId] = useState<string | null>(characterIdParam);
  const [activeTab, setActiveTab] = useState<WorkbenchTab>('weapon');
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);

  const { characters } = useCharactersApi();
  const pcCharacters = useMemo(() => characters?.filter((c: any) => c.type === 'PC') ?? [], [characters]);
  const character = characterId ? (characters?.find((c: any) => String(c.id) === characterId) ?? null) : null;

  const workbenchType: WorkbenchType | undefined = activeTab !== 'repair' ? activeTab : undefined;
  const { data: recipes = [], isLoading: recipesLoading } = useRecipes(workbenchType);
  const { data: recipeDetail, isLoading: detailLoading } = useRecipe(selectedRecipeId);
  const { data: knownIds = [] } = useKnownRecipes(character ? Number(character.id) : null);

  const markKnown = useMarkRecipeKnown(character ? Number(character.id) : null);
  const forget = useForgetRecipe(character ? Number(character.id) : null);

  const characterInventory = useMemo(
    () => character?.inventory?.map((i: any) => ({ itemId: i.itemId, quantity: i.quantity })) ?? [],
    [character]
  );

  const recipeIngredientMap = useMemo(() => new Map(), []);

  const handleTabChange = (tab: WorkbenchTab) => {
    setActiveTab(tab);
    setSelectedRecipeId(null);
  };

  const handleCharacterChange = (id: string) => {
    setCharacterId(id || null);
    if (id) {
      setSearchParams({ character: id });
    } else {
      setSearchParams({});
    }
  };

  const characterOptions = [
    { value: '', label: t('craft.noCharacterSelected') },
    ...pcCharacters.map((c: any) => ({ value: String(c.id), label: c.name })),
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Wrench className="w-7 h-7 text-vault-yellow" />
          <h1 className="text-2xl font-bold text-vault-yellow">{t('craft.title')}</h1>
        </div>
        <div className="w-56">
          <Select
            label={t('craft.selectCharacter')}
            value={characterId ?? ''}
            onChange={(e) => handleCharacterChange(e.target.value)}
            options={characterOptions}
          />
        </div>
      </div>

      {!character && (
        <p className="text-vault-yellow-dark text-sm italic">{t('craft.noCharacterSelected')}</p>
      )}

      {/* Body: 3 columns on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_1.5fr] gap-4">
        {/* Left: workbench nav */}
        <WorkbenchNav active={activeTab} onChange={handleTabChange} />

        {/* Center: recipe list (hidden for repair tab) */}
        {activeTab !== 'repair' && (
          <div className="border border-vault-yellow-dark/30 rounded-lg p-3 overflow-y-auto max-h-[calc(100vh-200px)]">
            {recipesLoading ? (
              <div className="text-vault-yellow-dark text-sm text-center py-4">{t('common.loading')}</div>
            ) : (
              <RecipeList
                recipes={recipes}
                selectedId={selectedRecipeId}
                character={character}
                knownRecipeIds={knownIds}
                characterInventory={characterInventory}
                recipeIngredientMap={recipeIngredientMap}
                onSelect={setSelectedRecipeId}
              />
            )}
          </div>
        )}

        {/* Right: detail panel */}
        <div className="border border-vault-yellow-dark/30 rounded-lg p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {activeTab === 'repair' ? (
            <RepairPanel character={character} />
          ) : (
            <RecipeDetail
              recipe={recipeDetail ?? null}
              loading={detailLoading && selectedRecipeId !== null}
              character={character}
              knownRecipeIds={knownIds}
              characterInventory={characterInventory}
              onMarkKnown={() => selectedRecipeId && markKnown.mutate(selectedRecipeId)}
              onForget={() => selectedRecipeId && forget.mutate(selectedRecipeId)}
              isMarkingKnown={markKnown.isPending}
              isForgetting={forget.isPending}
            />
          )}
        </div>
      </div>
    </div>
  );
}
