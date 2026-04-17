import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, Loader2, BookmarkPlus, BookmarkX, Sword, Shield, Shirt, Pill, Apple, Wrench, Settings, Package, Hammer } from 'lucide-react';
import { cn } from '../../../lib/cn';
import type { RecipeDetail as RecipeDetailType } from '../../../domain/models/recipe';
import type { MaterialItemIds } from '../../../application/hooks/useRecipes';
import {
  getMaterialCostByComplexity,
  calcCraftingDifficulty,
  SPECIFIC_INGREDIENT_WORKBENCHES,
} from './craftUtils';
import { ItemDetailModal } from '../../../components/ItemDetailModal';
import type { ItemType } from '../../../services/api';

const itemTypeIcons: Partial<Record<ItemType, React.ElementType>> = {
  weapon: Sword, armor: Shield, robotArmor: Shield, clothing: Shirt,
  ammunition: Package, syringerAmmo: Package, chem: Pill, food: Apple,
  generalGood: Wrench, oddity: Package, powerArmor: Shield, magazine: Package, mod: Settings,
};

const itemTypeColors: Partial<Record<ItemType, string>> = {
  weapon: 'text-red-400', armor: 'text-blue-400', powerArmor: 'text-yellow-500',
  robotArmor: 'text-blue-300', clothing: 'text-purple-400', ammunition: 'text-yellow-400',
  syringerAmmo: 'text-green-400', chem: 'text-pink-400', food: 'text-orange-400',
  generalGood: 'text-gray-400', oddity: 'text-cyan-400', magazine: 'text-teal-400',
  mod: 'text-emerald-400',
};

function ModResultSection({
  mod,
  onItemClick,
}: {
  mod: NonNullable<RecipeDetailType['resultMod']>;
  onItemClick: (id: number, itemType: ItemType) => void;
}) {
  const { t } = useTranslation();
  const modName = mod.item?.nameKey
    ? t(mod.item.nameKey, { defaultValue: mod.item.name ?? '' })
    : (mod.item?.name ?? '');
  const nameAdd = mod.nameAddKey ? t(mod.nameAddKey, { defaultValue: '' }) : '';
  const Icon = itemTypeIcons['mod'] ?? Package;
  return (
    <div className="rounded-lg bg-vault-yellow/5 border border-vault-yellow/10 p-3 space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-emerald-400 shrink-0" />
        {mod.item ? (
          <button
            type="button"
            onClick={() => onItemClick(mod.item!.id, mod.item!.itemType as ItemType)}
            className="text-vault-yellow font-semibold hover:underline text-left"
          >
            {modName}
          </button>
        ) : (
          <span className="text-vault-yellow font-semibold">{modName}</span>
        )}
        {nameAdd && (
          <span className="text-xs text-vault-yellow-dark italic">→ «…{nameAdd}»</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs">
        <span className="text-vault-yellow-dark">{t('itemDetail.mod.slot')}</span>
        <span className="text-vault-yellow">
          {t(`modSlots.${mod.slot}`, { defaultValue: mod.slot })}
        </span>
        <span className="text-vault-yellow-dark">{t('itemDetail.mod.applicableTo')}</span>
        <span className="text-vault-yellow">
          {t(`modApplicableTo.${mod.applicableTo}`, { defaultValue: mod.applicableTo })}
        </span>
        {mod.weightChange !== 0 && (
          <>
            <span className="text-vault-yellow-dark">{t('itemDetail.mod.weightChange')}</span>
            <span className="text-vault-yellow">
              {mod.weightChange > 0 ? '+' : ''}{mod.weightChange} kg
            </span>
          </>
        )}
      </div>
      {mod.effects.length > 0 && (
        <div>
          <p className="text-vault-yellow-dark text-xs font-medium mb-1">
            {t('itemDetail.mod.effects')}
          </p>
          <ul className="space-y-0.5">
            {mod.effects.map((eff) => (
              <li key={eff.id} className="text-xs flex gap-2">
                {eff.effectType === 'special' ? (
                  <span className="text-vault-yellow">
                    {eff.descriptionKey ? t(eff.descriptionKey, { defaultValue: eff.effectType }) : eff.effectType}
                  </span>
                ) : eff.effectType === 'gainQuality' || eff.effectType === 'loseQuality' ? (
                  <>
                    <span className="text-vault-yellow-dark">
                      {t(`itemDetail.mod.${eff.effectType}`, { defaultValue: eff.effectType })}:
                    </span>
                    <span className="text-vault-yellow">
                      {eff.qualityName
                        ? t(`qualities.${eff.qualityName}.name`, { defaultValue: eff.qualityName })
                        : ''}
                      {eff.qualityValue != null ? ` ×${eff.qualityValue}` : ''}
                    </span>
                  </>
                ) : eff.effectType === 'setAmmo' ? (
                  <>
                    <span className="text-vault-yellow-dark">
                      {t('itemDetail.mod.setAmmo', { defaultValue: 'Ammo' })}:
                    </span>
                    <span className="text-vault-yellow">{eff.ammoType ?? ''}</span>
                  </>
                ) : (
                  <>
                    <span className="text-vault-yellow-dark">
                      {t(`itemDetail.mod.${eff.effectType}`, { defaultValue: eff.effectType })}:
                    </span>
                    <span className="text-vault-yellow">
                      {eff.numericValue != null
                        ? `${eff.numericValue > 0 ? '+' : ''}${eff.numericValue}`
                        : ''}
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ItemResultSection({
  item,
  onItemClick,
}: {
  item: NonNullable<RecipeDetailType['resultItem']>;
  onItemClick: (id: number, itemType: ItemType) => void;
}) {
  const { t } = useTranslation();
  const itemName = item.nameKey
    ? t(item.nameKey, { defaultValue: item.name })
    : item.name;
  const Icon = (item.itemType ? itemTypeIcons[item.itemType as ItemType] : null) ?? Package;
  const colorClass = (item.itemType ? itemTypeColors[item.itemType as ItemType] : null) ?? 'text-vault-yellow';
  return (
    <div className="rounded-lg bg-vault-yellow/5 border border-vault-yellow/10 p-3 space-y-1 text-sm">
      <div className="flex items-center gap-2">
        <Icon size={14} className={`shrink-0 ${colorClass}`} />
        <button
          type="button"
          onClick={() => onItemClick(item.id, item.itemType as ItemType)}
          className="text-vault-yellow font-semibold hover:underline text-left"
        >
          {itemName}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs">
        <span className="text-vault-yellow-dark">{t('common.labels.value')}</span>
        <span className="text-vault-yellow">{item.value} ¢</span>
        <span className="text-vault-yellow-dark">{t('common.labels.weight')}</span>
        <span className="text-vault-yellow">{item.weight} kg</span>
      </div>
    </div>
  );
}

interface CharacterInventoryItem {
  id: number;
  itemId: number;
  quantity: number;
  itemName?: string;
  itemNameKey?: string;
}

interface RecipeDetailProps {
  recipe: RecipeDetailType | null;
  loading: boolean;
  character: { perks?: { perkId: string; rank: number }[]; skills?: { skill: string; rank: number }[]; special?: Record<string, number> } | null;
  knownRecipeIds: number[];
  characterInventory: CharacterInventoryItem[];
  materialItemIds?: MaterialItemIds;
  onMarkKnown: () => void;
  onForget: () => void;
  isMarkingKnown: boolean;
  isForgetting: boolean;
  onCraft?: () => void;
  isCrafting?: boolean;
}

export function RecipeDetail({
  recipe,
  loading,
  character,
  knownRecipeIds,
  characterInventory,
  materialItemIds,
  onMarkKnown,
  onForget,
  isMarkingKnown,
  isForgetting,
  onCraft,
  isCrafting = false,
}: RecipeDetailProps) {
  const { t } = useTranslation();
  const [detailItem, setDetailItem] = useState<{ id: number; itemType: ItemType } | null>(null);
  const handleItemClick = (id: number, itemType: ItemType) => setDetailItem({ id, itemType });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="animate-spin text-vault-yellow" size={28} />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-vault-yellow-dark text-sm text-center py-8">
        {t('craft.noRecipeSelected')}
      </div>
    );
  }

  const skillRank = character?.skills?.find((s) => s.skill === recipe.skill)?.rank ?? 0;
  const intValue = character?.special?.intelligence ?? 0;
  const difficulty = calcCraftingDifficulty(recipe.complexity, skillRank);
  const isAutoSuccess = difficulty === 0;

  const missingPerks = character
    ? recipe.perkRequirements.filter((req) => {
        const charPerk = character.perks?.find((p) => p.perkId === req.perkId);
        return !(charPerk && charPerk.rank >= req.minRank);
      })
    : [];
  const perksOk = missingPerks.length === 0;

  const isKnown =
    recipe.rarity === 'frequente' ||
    (recipe.rarity === 'peu_frequente' && perksOk) ||
    (recipe.rarity === 'rare' && knownRecipeIds.includes(recipe.id));

  const isLocked = character && (!isKnown || !perksOk);

  const isSpecific = SPECIFIC_INGREDIENT_WORKBENCHES.has(recipe.workbenchType);
  const materialCost = isSpecific ? null : getMaterialCostByComplexity(recipe.complexity);

  const missingIngredients = character && isSpecific
    ? recipe.ingredients.filter((ing) => {
        const inv = characterInventory.find((i) => i.itemId === ing.itemId);
        return (inv?.quantity ?? 0) < ing.quantity;
      })
    : [];

  const missingGenericMaterials: { label: string; have: number; need: number }[] = [];
  if (character && !isSpecific && materialCost && materialItemIds) {
    const getQtyById = (id: number | null) =>
      id != null ? (characterInventory.find((i) => i.itemId === id)?.quantity ?? 0) : 0;
    const commonHave = getQtyById(materialItemIds.common);
    const uncommonHave = getQtyById(materialItemIds.uncommon);
    const rareHave = getQtyById(materialItemIds.rare);
    if (materialCost.common > 0 && commonHave < materialCost.common)
      missingGenericMaterials.push({ label: t('craft.recipe.materialTypes.common'), have: commonHave, need: materialCost.common });
    if (materialCost.uncommon > 0 && uncommonHave < materialCost.uncommon)
      missingGenericMaterials.push({ label: t('craft.recipe.materialTypes.uncommon'), have: uncommonHave, need: materialCost.uncommon });
    if (materialCost.rare > 0 && rareHave < materialCost.rare)
      missingGenericMaterials.push({ label: t('craft.recipe.materialTypes.rare'), have: rareHave, need: materialCost.rare });
  }

  const isKnownRare = recipe.rarity === 'rare' && knownRecipeIds.includes(recipe.id);
  const isUnknownRare = recipe.rarity === 'rare' && !knownRecipeIds.includes(recipe.id);

  const recipeName = recipe.nameKey ? t(recipe.nameKey, { defaultValue: recipe.name }) : recipe.name;

  return (
    <div className="space-y-4">
      {/* Name + rarity */}
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-vault-yellow font-bold text-base">{recipeName}</h2>
        <span
          className={cn(
            'text-xs px-2 py-0.5 rounded border shrink-0',
            recipe.rarity === 'rare'
              ? 'border-purple-400 text-purple-400'
              : recipe.rarity === 'peu_frequente'
              ? 'border-blue-400 text-blue-400'
              : 'border-vault-yellow-dark text-vault-yellow-dark'
          )}
        >
          {t(`craft.recipe.rarity.${recipe.rarity}`)}
        </span>
      </div>

      {/* Missing prerequisites banner */}
      {isLocked && (
        <div className="border border-red-400/50 rounded-lg p-3 bg-red-400/5 space-y-2 text-xs">
          <p className="text-red-400 font-semibold">{t('craft.recipe.lockedNotice')}</p>
          {isUnknownRare && (
            <p className="text-red-300">— {t('craft.recipe.lockedRareUnknown')}</p>
          )}
          {missingPerks.length > 0 && (
            <div>
              <p className="text-red-300">— {t('craft.recipe.lockedMissingPerks')} :</p>
              <ul className="mt-1 ml-3 space-y-0.5">
                {missingPerks.map((req) => {
                  const label = req.perkNameKey ? t(req.perkNameKey, { defaultValue: req.perkId }) : req.perkId;
                  return (
                    <li key={req.id} className="text-red-300">
                      {label}{req.minRank > 1 ? ` ${t('craft.recipe.perkRank', { rank: req.minRank })}` : ''}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Missing materials banner (non-locked known recipe) */}
      {!isLocked && (missingIngredients.length > 0 || missingGenericMaterials.length > 0) && (
        <div className="border border-yellow-400/50 rounded-lg p-3 bg-yellow-400/5 text-xs">
          <p className="text-yellow-400 font-semibold">{t('craft.recipe.lockedMissingMaterials')} :</p>
          <ul className="mt-1 ml-3 space-y-0.5">
            {missingIngredients.map((ing) => {
              const label = ing.itemNameKey ? t(ing.itemNameKey, { defaultValue: ing.itemName ?? '' }) : ing.itemName ?? '';
              const inv = characterInventory.find((i) => i.itemId === ing.itemId)?.quantity ?? 0;
              return (
                <li key={ing.id} className="text-yellow-300">
                  {label} ({inv}/{ing.quantity})
                </li>
              );
            })}
            {missingGenericMaterials.map((m) => (
              <li key={m.label} className="text-yellow-300">
                {m.label} ({m.have}/{m.need})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mark as known / Forget (rare recipes with character selected) */}
      {character && recipe.rarity === 'rare' && (
        <div>
          {isUnknownRare && (
            <button
              type="button"
              onClick={onMarkKnown}
              disabled={isMarkingKnown}
              className="flex items-center gap-2 px-3 py-1.5 rounded border border-vault-yellow text-vault-yellow text-xs hover:bg-vault-yellow hover:text-vault-blue transition-colors disabled:opacity-50"
            >
              <BookmarkPlus size={14} />
              {t('craft.recipe.markAsKnown')}
            </button>
          )}
          {isKnownRare && (
            <button
              type="button"
              onClick={onForget}
              disabled={isForgetting}
              className="flex items-center gap-2 px-3 py-1.5 rounded border border-red-400 text-red-400 text-xs hover:bg-red-400/10 transition-colors disabled:opacity-50"
            >
              <BookmarkX size={14} />
              {t('craft.recipe.forget')}
            </button>
          )}
        </div>
      )}

      {/* Craft button */}
      {onCraft && character && !isLocked && missingIngredients.length === 0 && missingGenericMaterials.length === 0 && (recipe.resultMod || recipe.resultItemId) && (
        <button
          type="button"
          onClick={onCraft}
          disabled={isCrafting}
          className="flex items-center gap-2 px-4 py-2 rounded border border-vault-yellow bg-vault-yellow/10 text-vault-yellow text-sm font-semibold hover:bg-vault-yellow/20 transition-colors disabled:opacity-50 w-full justify-center"
        >
          {isCrafting ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Hammer size={15} />
          )}
          {t('craft.craftButton')}
        </button>
      )}

      {/* Prerequisites */}
      <section className="border-l-2 border-vault-yellow/30 pl-3">
        <h3 className="text-vault-yellow-dark text-xs font-semibold uppercase tracking-wide mb-2">
          {t('craft.recipe.prerequisites')}
        </h3>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-vault-yellow-dark text-xs">{t('craft.recipe.workbench')} :</span>
            <span className="text-vault-yellow text-xs font-medium">{t(`craft.workbenches.${recipe.workbenchType}`)}</span>
          </div>
          {recipe.perkRequirements.length > 0 && (
            <div>
              <span className="text-vault-yellow-dark">{t('craft.recipe.requiredPerks')}</span>
              <ul className="mt-1 space-y-1">
                {recipe.perkRequirements.map((req) => {
                  const charPerk = character?.perks?.find((p) => p.perkId === req.perkId);
                  const met = charPerk && charPerk.rank >= req.minRank;
                  const perkLabel = req.perkNameKey
                    ? t(req.perkNameKey, { defaultValue: req.perkId })
                    : req.perkId;
                  return (
                    <li key={req.id} className="flex items-center gap-2 pl-2">
                      {character ? (
                        met ? (
                          <CheckCircle size={14} className="text-green-400 shrink-0" />
                        ) : (
                          <XCircle size={14} className="text-red-400 shrink-0" />
                        )
                      ) : null}
                      <span className={cn('text-vault-yellow', !character && 'text-vault-yellow-dark')}>
                        {perkLabel} {req.minRank > 1 ? t('craft.recipe.perkRank', { rank: req.minRank }) : ''}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Crafting test */}
      <section className="border-l-2 border-vault-yellow/30 pl-3">
        <h3 className="text-vault-yellow-dark text-xs font-semibold uppercase tracking-wide mb-2">
          {t('craft.recipe.craftingTest')}
        </h3>
        {character ? (
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-vault-yellow/10 border border-vault-yellow/30 shrink-0">
              {isAutoSuccess ? (
                <CheckCircle size={20} className="text-green-400" />
              ) : (
                <>
                  <span className="text-vault-yellow font-bold text-lg leading-none">{difficulty}</span>
                  <span className="text-vault-yellow-dark text-[9px]">succès</span>
                </>
              )}
            </div>
            <div className="text-xs text-vault-yellow-dark space-y-0.5">
              <p className="text-vault-yellow font-medium">
                {t(`skills.${recipe.skill}`, recipe.skill)} — {t('craft.recipe.complexity', { defaultValue: 'Complexité' })} {recipe.complexity}
              </p>
              <p>INT({intValue}) + {t(`skills.${recipe.skill}`, recipe.skill)}({skillRank})</p>
              {isAutoSuccess && <p className="text-green-400">{t('craft.recipe.automaticSuccess')}</p>}
            </div>
          </div>
        ) : (
          <p className="text-vault-yellow-dark text-sm">
            {t('craft.recipe.formula', { skill: t(`skills.${recipe.skill}`, recipe.skill), complexity: recipe.complexity, rank: '?', difficulty: '?' })}
          </p>
        )}
        <p className="text-vault-yellow-dark text-xs mt-2">{t('craft.recipe.complication')}</p>
      </section>

      {/* Materials */}
      <section className="border-l-2 border-vault-yellow/30 pl-3">
        <h3 className="text-vault-yellow-dark text-xs font-semibold uppercase tracking-wide mb-2">
          {t('craft.recipe.materials')}
        </h3>
        {isSpecific ? (
          <ul className="space-y-0">
            {recipe.ingredients.map((ing) => {
              const invQty = character
                ? characterInventory.find((i) => i.itemId === ing.itemId)?.quantity ?? 0
                : null;
              const itemLabel = ing.itemNameKey
                ? t(ing.itemNameKey, { defaultValue: ing.itemName ?? '' })
                : ing.itemName ?? '';
              const sufficient = invQty === null || invQty >= ing.quantity;
              const Icon = (ing.itemType ? itemTypeIcons[ing.itemType as ItemType] : null) ?? Package;
              const colorClass = (ing.itemType ? itemTypeColors[ing.itemType as ItemType] : null) ?? 'text-vault-yellow-dark';
              return (
                <li key={ing.id} className="flex items-center justify-between gap-2 py-1 border-b border-vault-yellow-dark/10 last:border-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon size={13} className={`shrink-0 ${colorClass}`} />
                    {ing.itemType ? (
                      <button
                        type="button"
                        onClick={() => handleItemClick(ing.itemId, ing.itemType as ItemType)}
                        className="text-vault-yellow text-sm hover:underline text-left truncate"
                      >
                        {itemLabel}
                      </button>
                    ) : (
                      <span className="text-vault-yellow text-sm truncate">{itemLabel}</span>
                    )}
                  </div>
                  <span className={cn(
                    'font-mono text-xs px-2 py-0.5 rounded-full shrink-0',
                    invQty !== null && !sufficient
                      ? 'bg-red-400/10 text-red-400'
                      : invQty !== null
                      ? 'bg-green-400/10 text-green-400'
                      : 'bg-vault-yellow/10 text-vault-yellow'
                  )}>
                    {invQty !== null ? `${invQty}/${ing.quantity}` : `×${ing.quantity}`}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          materialCost && (
            <ul className="space-y-1">
              {materialCost.common > 0 && (
                <li className="flex items-center justify-between py-1 border-b border-vault-yellow-dark/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
                    <span className="text-gray-300 text-sm">{t('craft.recipe.materialTypes.common')}</span>
                  </div>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-gray-400/10 text-gray-300 shrink-0">×{materialCost.common}</span>
                </li>
              )}
              {materialCost.uncommon > 0 && (
                <li className="flex items-center justify-between py-1 border-b border-vault-yellow-dark/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                    <span className="text-green-300 text-sm">{t('craft.recipe.materialTypes.uncommon')}</span>
                  </div>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-green-400/10 text-green-300 shrink-0">×{materialCost.uncommon}</span>
                </li>
              )}
              {materialCost.rare > 0 && (
                <li className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                    <span className="text-blue-300 text-sm">{t('craft.recipe.materialTypes.rare')}</span>
                  </div>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-blue-400/10 text-blue-300 shrink-0">×{materialCost.rare}</span>
                </li>
              )}
            </ul>
          )
        )}
      </section>

      {/* Crafted result details */}
      {(recipe.resultMod || recipe.resultItem) && (
        <section className="border-l-2 border-vault-yellow/30 pl-3">
          <h3 className="text-vault-yellow-dark text-xs font-semibold uppercase tracking-wide mb-2">
            {t('craft.recipe.result')}
          </h3>

          {recipe.resultMod && <ModResultSection mod={recipe.resultMod} onItemClick={handleItemClick} />}
          {recipe.resultItem && <ItemResultSection item={recipe.resultItem} onItemClick={handleItemClick} />}
        </section>
      )}

      {/* Crafting info */}
      <section className="border-l-2 border-vault-yellow/30 pl-3">
        <h3 className="text-vault-yellow-dark text-xs font-semibold uppercase tracking-wide mb-2">
          {t('craft.recipe.craftingInfo')}
        </h3>
        <ul className="space-y-1 text-xs text-vault-yellow-dark">
          <li>{t('craft.recipe.craftingTime')}</li>
          <li>{t('craft.recipe.halfTimeWithAP')}</li>
          <li>{t('craft.recipe.onFailure')}</li>
          {isSpecific && <li className="text-yellow-400">{t('craft.recipe.ingredientsLostOnFailure')}</li>}
          <li>{t('craft.recipe.complications')}</li>
        </ul>
      </section>

      <ItemDetailModal
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        itemId={detailItem?.id ?? null}
        itemType={detailItem?.itemType ?? null}
      />
    </div>
  );
}
