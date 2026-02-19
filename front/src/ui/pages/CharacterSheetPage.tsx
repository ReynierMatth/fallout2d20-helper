import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Edit2, Loader2, Star, Swords, Shield, Heart, Zap, Package, Sparkles, Dumbbell } from 'lucide-react';
import { Card, Button, CharacterForm, InventoryManager, OriginIcon, BodyResistanceMap } from '../../components';
import { useCharactersApi } from '../../hooks/useCharactersApi';
import type { Character } from '../../data/characters';
import { SPECIAL_ATTRIBUTES, SKILL_NAMES, SKILL_ATTRIBUTES, ORIGINS, SURVIVOR_TRAITS } from '../../data/characters';
import { PERKS } from '../../data/perks';
import type { InventoryItemApi } from '../../services/api';

interface LocationState {
  from?: string;
  fromTab?: string;
}

export function CharacterSheetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { getCharacter, updateCharacter, updateInventoryItem, refetch, characters, loading, error } = useCharactersApi();

  const [character, setCharacter] = useState<Character | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Get the "from" location from state, or default to characters list
  const locationState = location.state as LocationState;
  const fromPath = locationState?.from || '/characters';
  const fromTab = locationState?.fromTab;

  // Handle back navigation
  const handleBack = useCallback(() => {
    // Pass the tab back so the session page returns to the correct tab
    if (fromTab) {
      navigate(fromPath, { state: { tab: fromTab } });
    } else {
      navigate(fromPath);
    }
  }, [navigate, fromPath, fromTab]);

  // Load character when ID or characters list changes
  useEffect(() => {
    if (id && !loading) {
      const found = getCharacter(id);
      setCharacter(found ?? null);
    }
  }, [id, characters, loading, getCharacter]);

  // Get origin data
  const origin = useMemo(() => {
    if (!character?.origin) return null;
    return ORIGINS.find(o => o.id === character.origin);
  }, [character?.origin]);

  // Get active survivor traits
  const activeSurvivorTraits = useMemo(() => {
    if (!character?.survivorTraits) return [];
    return SURVIVOR_TRAITS.filter(t => character.survivorTraits!.includes(t.id));
  }, [character?.survivorTraits]);

  // Handle edit save
  const handleSave = async (data: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!id) return;
    await updateCharacter(id, data);
    await refetch();
    setIsFormOpen(false);
  };

  // Handle inventory change
  const handleInventoryChange = async () => {
    await refetch();
  };

  // Handle caps change
  const handleCapsChange = async (newCaps: number) => {
    if (!id) return;
    await updateCharacter(id, { caps: newCaps });
  };

  // Handle Power Armor piece HP change
  const handlePieceHpChange = useCallback(async (inventoryId: number, newHp: number) => {
    if (!id) return;
    await updateInventoryItem(id, inventoryId, { currentHp: newHp });
    await refetch();
  }, [id, updateInventoryItem, refetch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-vault-yellow" />
        <span className="ml-3 text-gray-400">{t('common.loading')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400 bg-red-900/20 rounded border border-red-600">
        {t('common.error')}: {error}
      </div>
    );
  }

  if (!character) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">{t('characters.notFound')}</p>
        <Button onClick={handleBack}>{t('characterSheet.backToList')}</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 text-vault-yellow hover:bg-vault-blue rounded transition-colors cursor-pointer"
            >
              <ArrowLeft size={24} />
            </button>
            <OriginIcon originId={character.origin} type={character.type} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-vault-yellow">
                {character.name || t('characters.unnamed')}
              </h1>
              <p className="text-gray-400">
                {character.type === 'PC' ? t('characters.pc') : t('characters.npc')} - {t('characters.level')} {character.level}
                {origin && (
                  <span className="ml-2 text-vault-yellow-dark">({t(origin.nameKey)})</span>
                )}
              </p>
            </div>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Edit2 size={18} className="mr-2" />
            {t('characterSheet.editCharacter')}
          </Button>
        </div>
      </Card>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* S.P.E.C.I.A.L. */}
          <Card title={t('characterSheet.special')}>
            <div className="grid grid-cols-7 gap-2 text-center">
              {SPECIAL_ATTRIBUTES.map((attr, i) => {
                const letter = ['S', 'P', 'E', 'C', 'I', 'A', 'L'][i];
                const value = character.special[attr];
                const hasGiftedBonus = character.giftedBonusAttributes?.includes(attr);
                const exerciseCount = character.exerciseBonuses?.filter(a => a === attr).length ?? 0;

                return (
                  <div key={attr} className="flex flex-col items-center p-2 bg-gray-800 rounded">
                    <span className="text-xs text-vault-yellow font-bold">{letter}</span>
                    <span className="text-2xl text-white font-mono font-bold">{value}</span>
                    <span className="text-xs text-gray-500">{t(`special.${attr}`)}</span>
                    <div className="flex gap-0.5 mt-1">
                      {hasGiftedBonus && <Sparkles size={10} className="text-green-400" />}
                      {exerciseCount > 0 && <Dumbbell size={10} className="text-blue-400" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Derived Stats */}
          <Card title={t('characterSheet.derivedStats')}>
            <div className="grid grid-cols-2 gap-4">
              <StatDisplay icon={Heart} label={t('characters.hp')} value={`${character.currentHp}/${character.maxHp}`} color="text-red-400" />
              <StatDisplay icon={Shield} label={t('characters.defense')} value={character.defense} color="text-blue-400" />
              <StatDisplay icon={Zap} label={t('characters.initiative')} value={character.initiative} color="text-yellow-400" />
              <StatDisplay icon={Sparkles} label={t('characters.luckPoints')} value={`${character.currentLuckPoints}/${character.maxLuckPoints}`} color="text-purple-400" />
              <StatDisplay icon={Swords} label={t('characters.meleeDamageBonus')} value={`+${character.meleeDamageBonus} CD`} color="text-orange-400" />
              <StatDisplay icon={Package} label={t('characters.carryCapacity')} value={`${character.carryCapacity} ${t('common.labels.lbs')}`} color="text-gray-400" />
            </div>
          </Card>

          {/* Body Resistance Map */}
          <Card title={t('bodyResistance.title')}>
            <BodyResistanceMap
              inventory={(character.inventory ?? []) as InventoryItemApi[]}
              onPieceHpChange={handlePieceHpChange}
            />
          </Card>

          {/* Skills */}
          <Card title={t('characterSheet.skillsList')}>
            <div className="grid grid-cols-2 gap-2">
              {SKILL_NAMES.map(skill => {
                const rank = character.skills[skill] ?? 0;
                const linkedAttr = SKILL_ATTRIBUTES[skill];
                const attrValue = character.special[linkedAttr];
                const tn = attrValue + rank;
                const isTag = character.tagSkills?.includes(skill);

                return (
                  <div
                    key={skill}
                    className={`flex items-center gap-2 p-2 rounded ${
                      isTag ? 'bg-vault-blue border border-vault-yellow-dark' : 'bg-gray-800'
                    }`}
                  >
                    {isTag && <Star size={12} className="text-vault-yellow flex-shrink-0" fill="currentColor" />}
                    <span className={`flex-1 text-sm ${isTag ? 'text-vault-yellow font-bold' : 'text-white'}`}>
                      {t(`skills.${skill}`)}
                    </span>
                    <span className="text-xs text-gray-500 w-6 text-center">{rank}</span>
                    <span className="text-xs text-gray-400">/</span>
                    <span className="text-sm text-vault-yellow font-mono w-6 text-center">{tn}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Traits & Perks */}
          <Card title={t('characterSheet.traitsAndPerks')}>
            <div className="space-y-4">
              {/* Origin trait */}
              {origin && (
                <div>
                  <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">{t('characters.originTrait')}</h4>
                  <div className="p-3 bg-vault-blue rounded border border-vault-yellow-dark">
                    <span className="text-vault-yellow font-bold">{t(origin.trait.nameKey)}</span>
                    <p className="text-xs text-gray-300 mt-1">{t(origin.trait.descriptionKey)}</p>
                  </div>
                </div>
              )}

              {/* Survivor traits */}
              {activeSurvivorTraits.length > 0 && (
                <div>
                  <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">{t('characters.activeSurvivorTraits')}</h4>
                  <div className="space-y-2">
                    {activeSurvivorTraits.map(trait => (
                      <div key={trait.id} className="p-3 bg-vault-blue rounded border border-vault-yellow-dark">
                        <span className="text-vault-yellow font-bold">{t(trait.nameKey)}</span>
                        <p className="text-xs text-green-400 mt-1">+ {t(trait.benefitKey)}</p>
                        <p className="text-xs text-red-400">- {t(trait.drawbackKey)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Perks */}
              {character.perks && character.perks.length > 0 && (
                <div>
                  <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">{t('characters.perks')}</h4>
                  <div className="space-y-2">
                    {character.perks.map(perkData => {
                      const perk = PERKS.find(p => p.id === perkData.perkId);
                      if (!perk) return null;

                      return (
                        <div key={perkData.perkId} className="p-2 bg-gray-800 rounded">
                          <span className="text-vault-yellow font-bold text-sm">
                            {t(perk.nameKey)}
                            {perk.maxRanks > 1 && (
                              <span className="ml-1 text-gray-400 font-normal">
                                ({t('characters.rank')} {perkData.rank}/{perk.maxRanks})
                              </span>
                            )}
                          </span>
                          <p className="text-xs text-gray-400 mt-1">{t(perk.effectKey)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {!origin && activeSurvivorTraits.length === 0 && (!character.perks || character.perks.length === 0) && (
                <p className="text-gray-400 text-sm italic">{t('characters.noPerks')}</p>
              )}
            </div>
          </Card>

          {/* Inventory */}
          <Card title={t('inventory.title')}>
            <InventoryManager
              characterId={character.id}
              inventory={(character.inventory ?? []) as InventoryItemApi[]}
              caps={character.caps ?? 0}
              carryCapacity={character.carryCapacity}
              onInventoryChange={handleInventoryChange}
              onCapsChange={handleCapsChange}
            />
          </Card>

          {/* Notes */}
          {character.notes && (
            <Card title={t('characterSheet.notes')}>
              <p className="text-gray-300 whitespace-pre-wrap">{character.notes}</p>
            </Card>
          )}
        </div>
      </div>

      {/* Edit form modal */}
      <CharacterForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        character={character}
        onSave={handleSave}
        defaultType={character.type}
      />
    </div>
  );
}

// Helper component for stat display
interface StatDisplayProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}

function StatDisplay({ icon: Icon, label, value, color }: StatDisplayProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-800 rounded">
      <Icon size={20} className={color} />
      <div>
        <span className="text-xs text-gray-400 block">{label}</span>
        <span className="text-white font-bold">{value}</span>
      </div>
    </div>
  );
}
