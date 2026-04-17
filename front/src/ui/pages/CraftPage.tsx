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
import { useRecipes, useRecipe, useKnownRecipes, useMarkRecipeKnown, useForgetRecipe, useMaterialItemIds, useWeapons } from '../../application/hooks/useRecipes';
import type { MaterialItemIds } from '../../application/hooks/useRecipes';
import type { RecipeIngredient } from '../../domain/models/recipe';
import { useCharactersApi } from '../../hooks/useCharactersApi';
import { Select } from '../../components';

export function CraftPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const characterIdParam = searchParams.get('character');
  const [characterId, setCharacterId] = useState<string | null>(characterIdParam);
  const [activeTab, setActiveTab] = useState<WorkbenchTab>('weapon');
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeaponId, setSelectedWeaponId] = useState<number | null>(null);

  const { characters } = useCharactersApi();
  const pcCharacters = useMemo(() => characters?.filter((c: any) => c.type === 'PC') ?? [], [characters]);
  const rawCharacter = characterId ? (characters?.find((c: any) => String(c.id) === characterId) ?? null) : null;

  // Normalize Character (Record<SkillName, number> skills) into the shape expected by craft components
  const character = useMemo(() => {
    if (!rawCharacter) return null;
    return {
      ...rawCharacter,
      skills: Object.entries(rawCharacter.skills ?? {}).map(([skill, rank]) => ({ skill, rank: rank as number })),
    };
  }, [rawCharacter]);

  const { data: weapons = [] } = useWeapons();

  const workbenchType: WorkbenchType | undefined = activeTab !== 'repair' ? activeTab : undefined;
  const { data: recipes = [], isLoading: recipesLoading } = useRecipes(workbenchType, selectedWeaponId);
  const { data: recipeDetail, isLoading: detailLoading } = useRecipe(selectedRecipeId);
  const { data: knownIds = [] } = useKnownRecipes(character ? Number(character.id) : null);

  const markKnown = useMarkRecipeKnown(character ? Number(character.id) : null);
  const forget = useForgetRecipe(character ? Number(character.id) : null);
  const { data: materialItemIds } = useMaterialItemIds();

  const characterInventory = useMemo(
    () => character?.inventory?.map((i: any) => ({
      itemId: i.itemId,
      quantity: i.quantity,
      itemName: i.item?.name ?? '',
      itemNameKey: i.item?.nameKey ?? '',
    })) ?? [],
    [character]
  );

  const recipeIngredientMap = useMemo(() => {
    const map = new Map<number, RecipeIngredient[]>();
    for (const r of recipes) {
      if (r.ingredients) map.set(r.id, r.ingredients);
    }
    return map;
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) return recipes;
    const q = searchQuery.toLowerCase();
    return recipes.filter((r) => {
      const name = r.nameKey ? t(r.nameKey, { defaultValue: r.name }) : r.name;
      return name.toLowerCase().includes(q);
    });
  }, [recipes, searchQuery, t]);

  const handleTabChange = (tab: WorkbenchTab) => {
    setActiveTab(tab);
    setSelectedRecipeId(null);
    setSearchQuery('');
    setSelectedWeaponId(null);
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
          <div className="flex flex-col border border-vault-yellow-dark/30 rounded-lg overflow-hidden max-h-[calc(100vh-200px)]">
            <div className="p-2 space-y-2 border-b border-vault-yellow-dark/30">
              {activeTab === 'weapon' && (
                <select
                  value={selectedWeaponId ?? ''}
                  onChange={(e) => {
                    setSelectedWeaponId(e.target.value ? Number(e.target.value) : null);
                    setSelectedRecipeId(null);
                    setSearchQuery('');
                  }}
                  className="w-full bg-vault-blue-dark text-vault-yellow text-sm px-3 py-1.5 rounded border border-vault-yellow-dark/40 focus:outline-none focus:border-vault-yellow/60"
                >
                  <option value="">{t('craft.allWeaponMods')}</option>
                  {weapons.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.nameKey ? t(w.nameKey, { defaultValue: w.name }) : w.name}
                    </option>
                  ))}
                </select>
              )}
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('craft.searchRecipe')}
                className="w-full bg-vault-blue-dark text-vault-yellow placeholder-vault-yellow-dark/50 text-sm px-3 py-1.5 rounded border border-vault-yellow-dark/40 focus:outline-none focus:border-vault-yellow/60"
              />
            </div>
            <div className="p-3 overflow-y-auto flex-1">
            {recipesLoading ? (
              <div className="text-vault-yellow-dark text-sm text-center py-4">{t('common.loading')}</div>
            ) : (
              <RecipeList
                recipes={filteredRecipes}
                selectedId={selectedRecipeId}
                character={character}
                knownRecipeIds={knownIds}
                characterInventory={characterInventory}
                recipeIngredientMap={recipeIngredientMap}
                materialItemIds={materialItemIds}
                onSelect={setSelectedRecipeId}
              />
            )}
            </div>
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
              materialItemIds={materialItemIds}
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
