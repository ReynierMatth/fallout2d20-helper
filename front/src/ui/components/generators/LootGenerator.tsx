import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, RefreshCw, ChevronRight, ChevronLeft, Check, Plus, Minus, RotateCcw, Loader2 } from 'lucide-react';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Select } from '../../../components/Select';
import { ItemTable } from '../items/ItemTable';
import type { TableItem } from '../items/ItemTable';
import { ItemDetailModal } from '../items/ItemDetailSheet';
import { generatorsApi } from '../../../services/api';
import type { LootResultApi, ItemType, LootCategory } from '../../../services/api';
import {
  areaTypes,
  areaSizes,
  lootCategories,
  scavengingTables,
  DISCOVERY_DEGREES,
  getMaxRarityForLevel,
} from '../../../data/scavengingTables';
import type { AreaType, AreaSize, DiscoveryDegree, LootCategory as FrontLootCategory } from '../../../data/scavengingTables';
import { formatCaps, formatWeight, getRarityLabel } from '../../../generators/utils';

type Step = 'config' | 'ap' | 'results';
const STEPS: Step[] = ['config', 'ap', 'results'];

interface LootGeneratorProps {
  showZoneDescriptions?: boolean;
  compact?: boolean;
}

export function LootGenerator({ showZoneDescriptions = true }: LootGeneratorProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('config');
  const [loading, setLoading] = useState(false);

  // Step 1: Config
  const [areaType, setAreaType] = useState<AreaType>('Residential');
  const [areaSize, setAreaSize] = useState<AreaSize>('Average');
  const [discoveryDegree, setDiscoveryDegree] = useState<DiscoveryDegree>('untouched');
  const [locationLevel, setLocationLevel] = useState(5);

  // Step 2: AP
  const [apSpend, setApSpend] = useState<Record<FrontLootCategory, number>>(() => {
    const initial: Partial<Record<FrontLootCategory, number>> = {};
    lootCategories.forEach(cat => { initial[cat] = 0; });
    return initial as Record<FrontLootCategory, number>;
  });

  // Step 3: Results
  const [result, setResult] = useState<LootResultApi | null>(null);
  const [selectedItem, setSelectedItem] = useState<{ id: number; itemType: ItemType } | null>(null);

  const maxRarity = getMaxRarityForLevel(locationLevel);

  const table = scavengingTables[areaType];

  const totalApSpent = useMemo(() => {
    return Object.values(apSpend).reduce((sum, v) => sum + v, 0);
  }, [apSpend]);

  // Handlers
  const handleApChange = (category: FrontLootCategory, delta: number) => {
    setApSpend(prev => {
      const range = table[category][areaSize];
      const maxBonus = range.max - range.min;
      const newVal = Math.max(0, Math.min(maxBonus, prev[category] + delta));
      return { ...prev, [category]: newVal };
    });
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const loot = await generatorsApi.generateLoot({
        areaType,
        areaSize,
        locationLevel,
        apSpend: apSpend as Partial<Record<LootCategory, number>>,
      });
      setResult(loot);
      setStep('results');
    } catch (error) {
      console.error('Failed to generate loot:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = () => {
    setStep('config');
    setResult(null);
    setApSpend(() => {
      const initial: Partial<Record<FrontLootCategory, number>> = {};
      lootCategories.forEach(cat => { initial[cat] = 0; });
      return initial as Record<FrontLootCategory, number>;
    });
  };

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const loot = await generatorsApi.generateLoot({
        areaType,
        areaSize,
        locationLevel,
        apSpend: apSpend as Partial<Record<LootCategory, number>>,
      });
      setResult(loot);
    } catch (error) {
      console.error('Failed to regenerate loot:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (tableItem: TableItem) => {
    if (tableItem.itemId && tableItem.itemType) {
      setSelectedItem({ id: tableItem.itemId, itemType: tableItem.itemType as ItemType });
    }
  };

  const areaTypeOptions = areaTypes.map(type => ({
    value: type,
    label: t(`loot.zoneTypes.${type}.name`),
  }));

  const areaSizeOptions = areaSizes.map(size => ({
    value: size,
    label: t(`loot.sizes.${size}`),
  }));

  const currentStepIndex = STEPS.indexOf(step);

  // Convert API result items to TableItem format
  const tableItems: TableItem[] = result?.items.map(item => ({
    name: item.name,
    quantity: item.quantity,
    value: item.value,
    weight: item.weight,
    rarity: item.rarity,
    category: item.category,
    itemId: item.itemId,
    itemType: item.itemType,
  })) ?? [];

  // Step indicator
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-1 mb-6">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border-2 transition-colors ${
              i < currentStepIndex
                ? 'bg-vault-yellow text-vault-blue border-vault-yellow'
                : i === currentStepIndex
                ? 'bg-vault-yellow/20 text-vault-yellow border-vault-yellow'
                : 'bg-transparent text-vault-yellow-dark border-vault-yellow-dark'
            }`}
          >
            {i < currentStepIndex ? <Check size={14} /> : i + 1}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-8 h-0.5 mx-1 ${i < currentStepIndex ? 'bg-vault-yellow' : 'bg-vault-yellow-dark'}`} />
          )}
        </div>
      ))}
    </div>
  );

  // Step 1: Configuration
  const renderConfigStep = () => (
    <Card title={t('loot.steps.config')} icon={<Package size={20} />}>
      <div className="grid gap-4 sm:grid-cols-2 mb-4">
        <Select
          label={t('loot.areaType')}
          value={areaType}
          onChange={e => setAreaType(e.target.value as AreaType)}
          options={areaTypeOptions}
        />
        <Select
          label={t('loot.areaSize')}
          value={areaSize}
          onChange={e => setAreaSize(e.target.value as AreaSize)}
          options={areaSizeOptions}
        />
      </div>

      {/* Discovery degree */}
      <div className="mb-4">
        <label className="text-vault-yellow text-sm font-medium uppercase tracking-wide block mb-2">
          {t('loot.discoveryDegree')}
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          {DISCOVERY_DEGREES.map(dd => (
            <button
              key={dd.id}
              onClick={() => setDiscoveryDegree(dd.id)}
              className={`text-left p-3 rounded border-2 transition-colors ${
                discoveryDegree === dd.id
                  ? 'border-vault-yellow bg-vault-yellow/10'
                  : 'border-vault-yellow-dark hover:border-vault-yellow/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-vault-yellow font-bold text-sm">
                  {t(`loot.discoveryDegrees.${dd.id}.name`)}
                </span>
                <span className="text-vault-yellow-dark text-xs">
                  {t('loot.difficulty')}: {dd.difficulty}
                </span>
              </div>
              <p className="text-vault-yellow-dark text-xs mt-1">
                {t(`loot.discoveryDegrees.${dd.id}.description`)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Location level */}
      <div className="mb-6">
        <label className="text-vault-yellow text-sm font-medium uppercase tracking-wide block mb-1">
          {t('loot.locationLevel')}
        </label>
        <p className="text-vault-yellow-dark text-xs mb-2">{t('loot.locationLevelHint')}</p>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={20}
            value={locationLevel}
            onChange={e => setLocationLevel(Number(e.target.value))}
            className="flex-1 accent-vault-yellow"
          />
          <span className="text-vault-yellow font-bold text-lg w-8 text-center">{locationLevel}</span>
        </div>
        <div className="text-vault-yellow-dark text-xs mt-1">
          {t('loot.maxRarity')}: {getRarityLabel(maxRarity)}
        </div>
      </div>

      <Button onClick={() => setStep('ap')} className="w-full sm:w-auto">
        {t('loot.next')}
        <ChevronRight size={16} />
      </Button>
    </Card>
  );

  // Step 2: AP Allocation
  const renderApStep = () => (
    <Card title={t('loot.steps.ap')} icon={<Package size={20} />}>
      <p className="text-vault-yellow-dark text-sm mb-4">{t('loot.apNote')}</p>

      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-vault-yellow-dark text-left border-b border-vault-yellow-dark">
              <th className="pb-2 font-medium">{t('loot.categoryHeader')}</th>
              <th className="pb-2 font-medium text-center">{t('loot.bonusRolls')}</th>
            </tr>
          </thead>
          <tbody>
            {lootCategories.map(category => {
              const range = table[category][areaSize];
              const maxBonus = range.max - range.min;
              return (
                <tr key={category} className="border-b border-vault-gray-light">
                  <td className="py-2 text-vault-yellow font-medium">
                    {t(`lootCategories.${category}`, { defaultValue: category })}
                  </td>
                  <td className="py-2">
                    {maxBonus > 0 ? (
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleApChange(category, -1)}
                          disabled={apSpend[category] === 0}
                          className="w-7 h-7 flex items-center justify-center rounded border border-vault-yellow-dark text-vault-yellow-dark hover:text-vault-yellow hover:border-vault-yellow disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className={`w-8 text-center font-bold ${apSpend[category] > 0 ? 'text-vault-yellow' : 'text-vault-yellow-dark'}`}>
                          {apSpend[category]}
                        </span>
                        <button
                          onClick={() => handleApChange(category, 1)}
                          disabled={apSpend[category] >= maxBonus}
                          className="w-7 h-7 flex items-center justify-center rounded border border-vault-yellow-dark text-vault-yellow-dark hover:text-vault-yellow hover:border-vault-yellow disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-vault-yellow-dark">-</div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* AP total */}
      <div className="bg-vault-blue p-3 rounded mb-4 flex items-center justify-between">
        <span className="text-vault-yellow-dark text-sm uppercase font-medium">{t('loot.apSpent')}</span>
        <span className="text-vault-yellow font-bold text-xl">{totalApSpent}</span>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep('config')}>
          <ChevronLeft size={16} />
          {t('loot.previous')}
        </Button>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          {t('loot.generate')}
        </Button>
      </div>
    </Card>
  );

  // Step 3: Results
  const renderResultsStep = () => {
    if (!result) return null;

    return (
      <div className="bg-vault-gray border-2 border-vault-yellow-dark rounded-lg overflow-hidden">
        {/* Header with buttons */}
        <div className="bg-vault-blue px-4 py-3 border-b-2 border-vault-yellow-dark flex items-center justify-between gap-2">
          <h2 className="text-vault-yellow font-bold text-lg uppercase tracking-wide">
            {t('loot.results')} - {t(`loot.zoneTypes.${result.areaType}.name`)} ({t(`loot.sizes.${result.areaSize}`)})
          </h2>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRegenerate}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold uppercase tracking-wide rounded border-2 border-vault-yellow-dark text-vault-yellow-dark hover:text-vault-yellow hover:border-vault-yellow transition-colors disabled:opacity-50"
              title={t('loot.regenerate')}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
              <span className="hidden sm:inline">{t('loot.regenerate')}</span>
            </button>
            <button
              onClick={handleNewSearch}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold uppercase tracking-wide rounded border-2 border-vault-yellow text-vault-yellow hover:bg-vault-yellow hover:text-vault-blue transition-colors"
              title={t('loot.newSearch')}
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">{t('loot.newSearch')}</span>
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Summary */}
          <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-vault-yellow-dark">
            <div className="bg-vault-blue px-4 py-2 rounded">
              <div className="text-vault-yellow-dark text-xs uppercase">{t('loot.totalValue')}</div>
              <div className="text-vault-yellow font-bold">{formatCaps(result.totalValue)}</div>
            </div>
            <div className="bg-vault-blue px-4 py-2 rounded">
              <div className="text-vault-yellow-dark text-xs uppercase">{t('loot.totalWeight')}</div>
              <div className="text-vault-yellow font-bold">{formatWeight(result.totalWeight)}</div>
            </div>
            <div className="bg-vault-blue px-4 py-2 rounded">
              <div className="text-vault-yellow-dark text-xs uppercase">{t('loot.itemsFound')}</div>
              <div className="text-vault-yellow font-bold">
                {result.items.reduce((sum, item) => sum + item.quantity, 0)}
              </div>
            </div>
            <div className="bg-vault-blue px-4 py-2 rounded">
              <div className="text-vault-yellow-dark text-xs uppercase">{t('loot.maxRarity')}</div>
              <div className="text-vault-yellow font-bold">{getRarityLabel(maxRarity)}</div>
            </div>
          </div>

          {tableItems.length > 0 ? (
            <ItemTable items={tableItems} onItemClick={handleItemClick} />
          ) : (
            <div className="text-center py-8 text-vault-yellow-dark">{t('loot.noItems')}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderStepIndicator()}

      {step === 'config' && renderConfigStep()}
      {step === 'ap' && renderApStep()}
      {step === 'results' && renderResultsStep()}

      {/* Zone descriptions */}
      {showZoneDescriptions && step === 'config' && (
        <Card title={t('loot.zoneTypes.title')}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {areaTypes.map(type => (
              <div key={type}>
                <h4 className="text-vault-yellow font-bold">
                  {t(`loot.zoneTypes.${type}.name`)}
                </h4>
                <p className="text-vault-yellow-dark">
                  {t(`loot.zoneTypes.${type}.description`)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Item Detail Modal */}
      <ItemDetailModal
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        itemId={selectedItem?.id ?? null}
        itemType={selectedItem?.itemType ?? null}
      />
    </div>
  );
}
