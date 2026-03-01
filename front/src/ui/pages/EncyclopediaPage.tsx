import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Book, Filter, Search, Loader2, AlertCircle, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Card, ItemDetailModal, Select } from '../../components';
import { useItems } from '../../hooks/useItems';
import { formatCaps, formatWeight, getRarityColor } from '../../generators/utils';
import type { ItemType, DiseaseApi, PerkApi } from '../../services/api';
import { diseasesApi, perksApi } from '../../services/api';
import type { EncyclopediaEntry } from '../../components/ItemDetailModal';

// Helper to get translation key from item name
function getItemNameKey(categoryKey: string, name: string): string {
  return `items.${categoryKey}.${name}`;
}

type ItemCategory =
  | 'all'
  | 'weapons'
  | 'ammunition'
  | 'armor'
  | 'power-armor'
  | 'chems'
  | 'food'
  | 'clothing'
  | 'general'
  | 'robot-armor'
  | 'syringer-ammo'
  | 'magazines'
  | 'oddities'
  | 'mods'
  | 'diseases'
  | 'perks'
  | 'weapon-qualities';

type SortField = 'name' | 'subType' | 'value' | 'weight' | 'rarity' | 'info';
type SortDirection = 'asc' | 'desc' | null;

interface DisplayItem {
  id: number | string;
  itemType: ItemType | 'disease' | 'perk';
  name: string;
  value?: number;
  rarity?: number;
  weight?: number;
  categoryKey: string;
  subType?: string;
  extra?: Record<string, string | number | boolean>;
  diseaseData?: DiseaseApi;
  perkData?: PerkApi;
}

// Sortable column header component
function SortableHeader({
  label,
  field,
  currentField,
  currentDirection,
  onClick,
  className = '',
}: {
  label: string;
  field: SortField;
  currentField: SortField | null;
  currentDirection: SortDirection;
  onClick: (field: SortField) => void;
  className?: string;
}) {
  const isActive = currentField === field;

  return (
    <th
      className={`pb-2 font-medium cursor-pointer select-none hover:text-vault-yellow transition-colors ${className}`}
      onClick={() => onClick(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive && currentDirection === 'asc' && <ChevronUp size={14} />}
        {isActive && currentDirection === 'desc' && <ChevronDown size={14} />}
        {!isActive && <ChevronsUpDown size={12} className="opacity-40" />}
      </span>
    </th>
  );
}

export function EncyclopediaPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ItemCategory>('all');
  const [rarity, setRarity] = useState(-1);
  const [selectedItem, setSelectedItem] = useState<{ id: number; itemType: ItemType } | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<EncyclopediaEntry | null>(null);

  // Per-group sort state: { [categoryKey]: { field, direction } }
  const [groupSorts, setGroupSorts] = useState<Record<string, { field: SortField; direction: SortDirection }>>({});

  // Fetch items from API
  const { items, loading, error } = useItems();

  // Fetch diseases separately
  const [diseases, setDiseases] = useState<DiseaseApi[]>([]);
  const [diseasesLoading, setDiseasesLoading] = useState(true);
  useEffect(() => {
    diseasesApi.list()
      .then(setDiseases)
      .catch(() => {})
      .finally(() => setDiseasesLoading(false));
  }, []);

  // Fetch perks separately
  const [perks, setPerks] = useState<PerkApi[]>([]);
  const [perksLoading, setPerksLoading] = useState(true);
  useEffect(() => {
    perksApi.list()
      .then(setPerks)
      .catch(() => {})
      .finally(() => setPerksLoading(false));
  }, []);

  // Convert API items to display items
  const allItems = useMemo(() => {
    const displayItems: DisplayItem[] = [];

    if (items) {
      items.weapons.forEach(w => {
        displayItems.push({
          id: w.id, itemType: 'weapon', name: w.name,
          value: w.value, rarity: w.rarity, weight: w.weight,
          categoryKey: 'weapons', subType: w.skill,
        });
      });

      items.ammunition.forEach(a => {
        displayItems.push({
          id: a.id, itemType: 'ammunition', name: a.name,
          value: a.value, rarity: a.rarity, weight: a.weight,
          categoryKey: 'ammunition',
          extra: { baseQty: a.flatAmount, bonusQty: `+${a.randomAmount}` },
        });
      });

      items.armors.forEach(a => {
        displayItems.push({
          id: a.id, itemType: 'armor', name: a.name,
          value: a.value, rarity: a.rarity, weight: a.weight,
          categoryKey: 'armor', subType: a.type,
        });
      });

      items.powerArmors?.forEach(pa => {
        displayItems.push({
          id: pa.id, itemType: 'powerArmor', name: pa.name,
          value: pa.value, rarity: pa.rarity, weight: pa.weight,
          categoryKey: 'power-armor', subType: pa.set,
        });
      });

      items.chems.forEach(c => {
        displayItems.push({
          id: c.id, itemType: 'chem', name: c.name,
          value: c.value, rarity: c.rarity, weight: c.weight,
          categoryKey: 'chems', subType: c.duration,
          extra: { addictive: c.addictive ? (c.addictionLevel ?? 1) : 0 },
        });
      });

      items.food.forEach(f => {
        displayItems.push({
          id: f.id, itemType: 'food', name: f.name,
          value: f.value, rarity: f.rarity, weight: f.weight,
          categoryKey: 'food', subType: f.foodType,
          extra: { irradiated: f.irradiated },
        });
      });

      items.clothing.forEach(c => {
        displayItems.push({
          id: c.id, itemType: 'clothing', name: c.name,
          value: c.value, rarity: c.rarity, weight: c.weight,
          categoryKey: 'clothing',
        });
      });

      items.generalGoods.forEach(g => {
        displayItems.push({
          id: g.id, itemType: 'generalGood', name: g.name,
          value: g.value, rarity: g.rarity, weight: g.weight,
          categoryKey: 'general', subType: g.goodType,
        });
      });

      items.magazines?.forEach(m => {
        displayItems.push({
          id: m.id, itemType: 'magazine', name: m.name,
          value: m.value, rarity: m.rarity, weight: m.weight,
          categoryKey: 'magazines',
          extra: { issues: m.issues?.length ?? 0 },
        });
      });

      items.robotArmors?.forEach(ra => {
        displayItems.push({
          id: ra.id, itemType: 'robotArmor', name: ra.name,
          value: ra.value, rarity: ra.rarity, weight: ra.weight,
          categoryKey: 'robot-armor', subType: ra.location,
        });
      });

      items.syringerAmmo?.forEach(sa => {
        displayItems.push({
          id: sa.id, itemType: 'syringerAmmo', name: sa.name,
          value: sa.value, rarity: sa.rarity, weight: sa.weight,
          categoryKey: 'syringer-ammo',
        });
      });

      items.oddities?.forEach(o => {
        displayItems.push({
          id: o.id, itemType: 'oddity', name: o.name,
          value: o.value, rarity: o.rarity, weight: o.weight,
          categoryKey: 'oddities', subType: o.goodType,
        });
      });

      items.mods?.forEach(m => {
        displayItems.push({
          id: m.id, itemType: 'mod', name: m.name,
          value: m.value, rarity: m.rarity, weight: m.weight,
          categoryKey: 'mods', subType: m.slot,
        });
      });
    }

    diseases.forEach(d => {
      displayItems.push({
        id: `disease-${d.id}`, itemType: 'disease', name: d.name,
        categoryKey: 'diseases',
        extra: { d20Roll: d.d20Roll, duration: d.duration },
        diseaseData: d,
      });
    });

    perks.forEach(p => {
      displayItems.push({
        id: `perk-${p.id}`, itemType: 'perk', name: t(p.nameKey),
        categoryKey: 'perks',
        extra: { maxRanks: p.maxRanks, level: p.prerequisites?.level ?? 0 },
        perkData: p,
      });
    });

    // Weapon qualities (static data from translations)
    const qualityKeys = [
      'accurate', 'blast', 'breaking', 'burst', 'closeQuarters', 'concealed', 'debilitating',
      'gatling', 'inaccurate', 'mine', 'nightVision', 'parry', 'persistent',
      'piercing', 'radioactive', 'reliable', 'recon', 'spread', 'stun',
      'thrown', 'twoHanded', 'unreliable', 'vicious', 'silent',
    ];
    qualityKeys.forEach(key => {
      displayItems.push({
        id: `quality-${key}`,
        itemType: 'weapon-quality' as any,
        name: t(`qualities.${key}.name`),
        categoryKey: 'weapon-qualities',
        extra: { qualityKey: key },
        subType: t(`qualities.${key}.description`),
      });
    });

    return displayItems;
  }, [items, diseases, perks, t]);

  const categoryOptions = [
    { value: 'all', label: t('encyclopedia.allCategories') },
    { value: 'weapons', label: t('encyclopedia.categories.weapons') },
    { value: 'ammunition', label: t('encyclopedia.categories.ammunition') },
    { value: 'armor', label: t('encyclopedia.categories.armor') },
    { value: 'power-armor', label: t('encyclopedia.categories.power-armor') },
    { value: 'chems', label: t('encyclopedia.categories.chems') },
    { value: 'food', label: t('encyclopedia.categories.food') },
    { value: 'clothing', label: t('encyclopedia.categories.clothing') },
    { value: 'general', label: t('encyclopedia.categories.general') },
    { value: 'robot-armor', label: t('encyclopedia.categories.robot-armor') },
    { value: 'syringer-ammo', label: t('encyclopedia.categories.syringer-ammo') },
    { value: 'magazines', label: t('encyclopedia.categories.magazines') },
    { value: 'oddities', label: t('encyclopedia.categories.oddities') },
    { value: 'mods', label: t('encyclopedia.categories.mods') },
    { value: 'diseases', label: t('encyclopedia.categories.diseases') },
    { value: 'perks', label: t('encyclopedia.categories.perks') },
    { value: 'weapon-qualities', label: t('encyclopedia.categories.weapon-qualities') },
  ];

  const rarityOptions = [
    { value: '-1', label: t('encyclopedia.allRarities') },
    { value: '0', label: t('common.rarity.0') },
    { value: '1', label: t('common.rarity.1') },
    { value: '2', label: t('common.rarity.2') },
    { value: '3', label: t('common.rarity.3') },
    { value: '4', label: t('common.rarity.4') },
    { value: '5', label: t('common.rarity.5') },
    { value: '6', label: t('common.rarity.6') },
  ];

  // Helper function to get translated item name
  const getItemName = useCallback((item: DisplayItem): string => {
    if (item.diseaseData?.nameKey) {
      const translated = t(item.diseaseData.nameKey);
      if (translated !== item.diseaseData.nameKey) return translated;
    }
    if (item.itemType === 'perk') return item.name;
    const key = getItemNameKey(item.categoryKey, item.name);
    return t(key, { defaultValue: item.name });
  }, [t]);

  // Filter items (no sorting at this level - sorting is per-group)
  const filteredItems = useMemo(() => {
    let result = [...allItems];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(item => {
        const translatedName = getItemName(item);
        return item.name.toLowerCase().includes(searchLower) ||
          translatedName.toLowerCase().includes(searchLower) ||
          item.subType?.toLowerCase().includes(searchLower);
      });
    }

    if (category !== 'all') {
      result = result.filter(item => item.categoryKey === category);
    }

    if (rarity >= 0) {
      result = result.filter(item => item.rarity === rarity);
    }

    return result;
  }, [allItems, search, category, rarity, getItemName]);

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, DisplayItem[]> = {};
    filteredItems.forEach(item => {
      if (!groups[item.categoryKey]) {
        groups[item.categoryKey] = [];
      }
      groups[item.categoryKey].push(item);
    });
    return groups;
  }, [filteredItems]);

  // Sort a group of items
  const sortGroup = useCallback((items: DisplayItem[], categoryKey: string): DisplayItem[] => {
    const sortState = groupSorts[categoryKey];
    if (!sortState || !sortState.direction) {
      // Default sort: name asc
      return [...items].sort((a, b) => getItemName(a).localeCompare(getItemName(b)));
    }

    const { field, direction } = sortState;
    const mult = direction === 'asc' ? 1 : -1;

    return [...items].sort((a, b) => {
      switch (field) {
        case 'name':
          return mult * getItemName(a).localeCompare(getItemName(b));
        case 'subType': {
          const aType = a.subType ? t(`skills.${a.subType}`, a.subType) : '';
          const bType = b.subType ? t(`skills.${b.subType}`, b.subType) : '';
          return mult * aType.localeCompare(bType);
        }
        case 'value':
          return mult * ((a.value ?? 0) - (b.value ?? 0));
        case 'weight':
          return mult * ((a.weight ?? 0) - (b.weight ?? 0));
        case 'rarity':
          return mult * ((a.rarity ?? 0) - (b.rarity ?? 0));
        default:
          return 0;
      }
    });
  }, [groupSorts, getItemName, t]);

  // Handle column header click for a specific group
  const handleColumnSort = useCallback((categoryKey: string, field: SortField) => {
    setGroupSorts(prev => {
      const current = prev[categoryKey];
      let newDirection: SortDirection;
      if (!current || current.field !== field || current.direction === null) {
        newDirection = 'asc';
      } else if (current.direction === 'asc') {
        newDirection = 'desc';
      } else {
        newDirection = null; // Reset to default
      }
      return {
        ...prev,
        [categoryKey]: { field, direction: newDirection },
      };
    });
  }, []);

  const formatExtraInfo = (item: DisplayItem): string => {
    if (!item.extra) return '';
    const parts: string[] = [];

    if ('baseQty' in item.extra) {
      parts.push(`${t('encyclopedia.extraInfo.baseQty')}: ${item.extra.baseQty}`);
      parts.push(`${t('encyclopedia.extraInfo.bonusQty')}: ${item.extra.bonusQty}`);
    }
    if ('addictive' in item.extra) {
      const addictive = item.extra.addictive as number;
      parts.push(`${t('encyclopedia.extraInfo.addictive')}: ${addictive > 0 ? `${t('encyclopedia.extraInfo.level')} ${addictive}` : t('encyclopedia.extraInfo.notAddictive')}`);
    }
    if ('irradiated' in item.extra) {
      parts.push(`${t('encyclopedia.extraInfo.irradiated')}: ${item.extra.irradiated ? t('encyclopedia.extraInfo.yes') : t('encyclopedia.extraInfo.no')}`);
    }
    if ('d20Roll' in item.extra) {
      parts.push(`D20: ${item.extra.d20Roll}`);
      parts.push(`${t('itemDetail.durationStages')}: ${item.extra.duration}`);
    }
    if ('maxRanks' in item.extra) {
      parts.push(`${t('itemDetail.maxRanks')}: ${item.extra.maxRanks}`);
      if (item.extra.level && (item.extra.level as number) > 0) {
        parts.push(`${t('itemDetail.level')}: ${item.extra.level}`);
      }
    }
    if ('issues' in item.extra && item.extra.issues) {
      parts.push(`${t('itemDetail.issues')}: ${item.extra.issues}`);
    }
    if ('qualityKey' in item.extra) {
      parts.push(t(`qualities.${item.extra.qualityKey}.description`));
    }
    return parts.join(' | ');
  };

  const handleItemClick = (item: DisplayItem) => {
    if (item.itemType === 'disease' && item.diseaseData) {
      setSelectedEntry({ type: 'disease', data: item.diseaseData });
      setSelectedItem(null);
    } else if (item.itemType === 'perk' && item.perkData) {
      setSelectedEntry({ type: 'perk', data: item.perkData });
      setSelectedItem(null);
    } else if (item.itemType === 'weapon-quality' as any && item.extra?.qualityKey) {
      setSelectedEntry({ type: 'weapon-quality', qualityKey: item.extra.qualityKey as string });
      setSelectedItem(null);
    } else {
      setSelectedItem({ id: item.id as number, itemType: item.itemType as ItemType });
      setSelectedEntry(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setSelectedEntry(null);
  };

  const isItemCategory = (categoryKey: string): boolean => {
    return categoryKey !== 'diseases' && categoryKey !== 'perks' && categoryKey !== 'weapon-qualities';
  };

  // Loading state
  if (loading && diseasesLoading && perksLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-vault-yellow animate-spin" />
          <p className="text-vault-yellow">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card>
          <div className="flex flex-col items-center gap-4 p-8">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <p className="text-red-500 font-medium">{t('common.error')}</p>
            <p className="text-vault-yellow-dark text-sm">{error}</p>
            <p className="text-vault-yellow-dark text-xs">
              Assurez-vous que le backend est démarré sur http://localhost:3001
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Book className="w-8 h-8 text-vault-yellow" />
        <h1 className="text-2xl font-bold text-vault-yellow">
          {t('encyclopedia.title')}
        </h1>
        <span className="text-xs text-vault-yellow-dark bg-vault-gray-light px-2 py-1 rounded">
          API
        </span>
      </div>

      {/* Filters */}
      <Card title={t('encyclopedia.filters')} icon={<Filter size={20} />}>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-vault-yellow-dark" />
            <input
              type="text"
              placeholder={t('encyclopedia.searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-vault-gray-light text-vault-yellow border-2 border-vault-yellow-dark rounded pl-10 pr-4 py-2 focus:outline-none focus:border-vault-yellow placeholder:text-vault-yellow-dark/50"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label={t('common.labels.category')}
              value={category}
              onChange={e => setCategory(e.target.value as ItemCategory)}
              options={categoryOptions}
            />
            <Select
              label={t('common.labels.rarity')}
              value={rarity.toString()}
              onChange={e => setRarity(parseInt(e.target.value))}
              options={rarityOptions}
            />
          </div>

          {/* Results count */}
          <div className="text-vault-yellow-dark text-sm">
            {filteredItems.length} item{filteredItems.length > 1 ? 's' : ''} {filteredItems.length > 1 ? t('encyclopedia.itemsFound_plural', { count: filteredItems.length }).split(' ').slice(1).join(' ') : t('encyclopedia.itemsFound', { count: filteredItems.length }).split(' ').slice(1).join(' ')}
          </div>
        </div>
      </Card>

      {/* Results */}
      {Object.entries(groupedItems).map(([categoryKey, groupItems]) => {
        const sortState = groupSorts[categoryKey];
        const sortedItems = sortGroup(groupItems, categoryKey);
        const hasItemColumns = isItemCategory(categoryKey);

        return (
          <Card key={categoryKey} title={`${t(`encyclopedia.categories.${categoryKey}`)} (${groupItems.length})`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-vault-yellow-dark text-left border-b border-vault-yellow-dark">
                    <SortableHeader
                      label={t('common.labels.name')}
                      field="name"
                      currentField={sortState?.direction ? sortState.field : null}
                      currentDirection={sortState?.direction ?? null}
                      onClick={(f) => handleColumnSort(categoryKey, f)}
                    />
                    <SortableHeader
                      label={t('common.labels.type')}
                      field="subType"
                      currentField={sortState?.direction ? sortState.field : null}
                      currentDirection={sortState?.direction ?? null}
                      onClick={(f) => handleColumnSort(categoryKey, f)}
                      className="hidden sm:table-cell"
                    />
                    {hasItemColumns && (
                      <>
                        <SortableHeader
                          label={t('common.labels.value')}
                          field="value"
                          currentField={sortState?.direction ? sortState.field : null}
                          currentDirection={sortState?.direction ?? null}
                          onClick={(f) => handleColumnSort(categoryKey, f)}
                          className="text-right"
                        />
                        <SortableHeader
                          label={t('common.labels.weight')}
                          field="weight"
                          currentField={sortState?.direction ? sortState.field : null}
                          currentDirection={sortState?.direction ?? null}
                          onClick={(f) => handleColumnSort(categoryKey, f)}
                          className="text-right hidden md:table-cell"
                        />
                        <SortableHeader
                          label={t('common.labels.rarity')}
                          field="rarity"
                          currentField={sortState?.direction ? sortState.field : null}
                          currentDirection={sortState?.direction ?? null}
                          onClick={(f) => handleColumnSort(categoryKey, f)}
                          className="text-right"
                        />
                      </>
                    )}
                    <th className="pb-2 font-medium text-right hidden lg:table-cell">{t('common.labels.info')}</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map((item, index) => (
                    <tr
                      key={`${item.id}-${index}`}
                      className="border-b border-vault-gray-light hover:bg-vault-gray-light/50 cursor-pointer transition-colors"
                      onClick={() => handleItemClick(item)}
                    >
                      <td className={`py-2 ${item.rarity !== undefined ? getRarityColor(item.rarity) : 'text-vault-yellow'}`}>
                        {getItemName(item)}
                      </td>
                      <td className="py-2 text-vault-yellow-dark hidden sm:table-cell">
                        {item.subType ? t(`skills.${item.subType}`, item.subType) : '-'}
                      </td>
                      {hasItemColumns && (
                        <>
                          <td className="py-2 text-right text-vault-yellow">
                            {item.value !== undefined ? formatCaps(item.value) : '-'}
                          </td>
                          <td className="py-2 text-right text-vault-yellow-dark hidden md:table-cell">
                            {item.weight !== undefined ? formatWeight(item.weight) : '-'}
                          </td>
                          <td className={`py-2 text-right ${item.rarity !== undefined ? getRarityColor(item.rarity) : ''}`}>
                            {item.rarity !== undefined ? (
                              <>
                                <span className="hidden sm:inline">{t(`common.rarity.${item.rarity}`)}</span>
                                <span className="sm:hidden">{item.rarity}</span>
                              </>
                            ) : '-'}
                          </td>
                        </>
                      )}
                      <td className="py-2 text-right text-vault-yellow-dark text-xs hidden lg:table-cell">
                        {formatExtraInfo(item)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        );
      })}

      {filteredItems.length === 0 && (
        <Card>
          <div className="text-center py-8 text-vault-yellow-dark">
            {t('encyclopedia.noResults')}
          </div>
        </Card>
      )}

      {/* Item Detail Modal */}
      <ItemDetailModal
        isOpen={selectedItem !== null || selectedEntry !== null}
        onClose={handleCloseModal}
        itemId={selectedItem?.id ?? null}
        itemType={selectedItem?.itemType ?? null}
        entry={selectedEntry}
      />
    </div>
  );
}
