import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X, Plus, Minus, Sword, Shield, Shirt, Pill, Apple, Wrench, Package } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useItems } from '../hooks/useItems';
import type { ItemType, BaseItemApi } from '../services/api';

interface ItemSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (itemId: number, quantity: number) => void;
}

// Combined item type for display
interface DisplayItem extends BaseItemApi {
  itemType: ItemType;
}

// Icon mapping for item types
const itemTypeIcons: Record<ItemType, React.ElementType> = {
  weapon: Sword,
  armor: Shield,
  powerArmor: Shield,
  robotArmor: Shield,
  clothing: Shirt,
  ammunition: Package,
  syringerAmmo: Package,
  chem: Pill,
  food: Apple,
  generalGood: Wrench,
  oddity: Package,
  magazine: Package,
};

// Color mapping for item types
const itemTypeColors: Record<ItemType, string> = {
  weapon: 'text-red-400',
  armor: 'text-blue-400',
  powerArmor: 'text-yellow-500',
  robotArmor: 'text-blue-300',
  clothing: 'text-purple-400',
  ammunition: 'text-yellow-400',
  syringerAmmo: 'text-green-400',
  chem: 'text-pink-400',
  food: 'text-orange-400',
  generalGood: 'text-gray-400',
  oddity: 'text-cyan-400',
  magazine: 'text-teal-400',
};

// Rarity colors
const rarityColors: Record<number, string> = {
  0: 'text-gray-400',
  1: 'text-green-400',
  2: 'text-blue-400',
  3: 'text-purple-400',
  4: 'text-yellow-400',
  5: 'text-orange-400',
  6: 'text-red-400',
};

export function ItemSelector({ isOpen, onClose, onSelect }: ItemSelectorProps) {
  const { t } = useTranslation();
  const { items, loading, error } = useItems();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ItemType | 'all'>('all');
  const [rarityFilter, setRarityFilter] = useState<number | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<DisplayItem | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Combine all items into a single list
  const allItems = useMemo<DisplayItem[]>(() => {
    if (!items) return [];

    const combined: DisplayItem[] = [];

    items.weapons.forEach(w => combined.push({ ...w, itemType: 'weapon' }));
    items.armors.forEach(a => combined.push({ ...a, itemType: 'armor' }));
    items.powerArmors?.forEach(pa => combined.push({ ...pa, itemType: 'powerArmor' }));
    items.clothing.forEach(c => combined.push({ ...c, itemType: 'clothing' }));
    items.ammunition.forEach(a => combined.push({ ...a, itemType: 'ammunition' }));
    items.chems.forEach(c => combined.push({ ...c, itemType: 'chem' }));
    items.food.forEach(f => combined.push({ ...f, itemType: 'food' }));
    items.generalGoods.forEach(g => combined.push({ ...g, itemType: 'generalGood' }));

    return combined;
  }, [items]);

  // Map item type to translation category key
  const getCategoryKey = (itemType: ItemType): string => {
    switch (itemType) {
      case 'weapon': return 'weapons';
      case 'armor': return 'armor';
      case 'powerArmor': return 'armor';
      case 'robotArmor': return 'armor';
      case 'clothing': return 'clothing';
      case 'ammunition': return 'ammunition';
      case 'syringerAmmo': return 'ammunition';
      case 'chem': return 'chems';
      case 'food': return 'food';
      case 'generalGood': return 'general';
      case 'oddity': return 'general';
      default: return '';
    }
  };

  // Get translated name for an item
  const getTranslatedName = (item: DisplayItem): string => {
    const categoryKey = getCategoryKey(item.itemType);
    // Try items.categoryKey.name first
    const translated = t(`items.${categoryKey}.${item.name}`);
    if (translated !== `items.${categoryKey}.${item.name}`) return translated;
    // Fallback to raw name
    return item.name;
  };

  // Filter items
  const filteredItems = useMemo(() => {
    let filtered = allItems;

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.itemType === typeFilter);
    }

    // Rarity filter
    if (rarityFilter !== 'all') {
      filtered = filtered.filter(item => item.rarity === rarityFilter);
    }

    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(item => {
        // Search by English name
        if (item.name.toLowerCase().includes(searchLower)) return true;
        // Search by translated name
        const translatedName = getTranslatedName(item);
        if (translatedName !== item.name && translatedName.toLowerCase().includes(searchLower)) {
          return true;
        }
        return false;
      });
    }

    // Sort by translated name
    return filtered.sort((a, b) => {
      const nameA = getTranslatedName(a);
      const nameB = getTranslatedName(b);
      return nameA.localeCompare(nameB);
    });
  }, [allItems, typeFilter, rarityFilter, search, t]);

  const handleSelect = () => {
    if (selectedItem) {
      onSelect(selectedItem.id, quantity);
      handleClose();
    }
  };

  const handleClose = () => {
    setSearch('');
    setTypeFilter('all');
    setRarityFilter('all');
    setSelectedItem(null);
    setQuantity(1);
    onClose();
  };

  const itemTypes: (ItemType | 'all')[] = ['all', 'weapon', 'armor', 'powerArmor', 'clothing', 'ammunition', 'chem', 'food', 'generalGood'];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('inventory.addItem')}>
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('inventory.searchItems')}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-vault-yellow-dark rounded text-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as ItemType | 'all')}
            className="px-3 py-1.5 bg-gray-800 border border-vault-yellow-dark rounded text-white text-sm"
          >
            {itemTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? t('inventory.itemTypes.all') : t(`inventory.itemTypes.${type}`)}
              </option>
            ))}
          </select>

          {/* Rarity filter */}
          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-1.5 bg-gray-800 border border-vault-yellow-dark rounded text-white text-sm"
          >
            <option value="all">{t('encyclopedia.allRarities')}</option>
            {[0, 1, 2, 3, 4, 5, 6].map(r => (
              <option key={r} value={r}>{t(`common.rarity.${r}`)}</option>
            ))}
          </select>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-8 text-gray-400">{t('common.loading')}</div>
        ) : error ? (
          <div className="text-center py-8 text-red-400">{error}</div>
        ) : (
          <div className="max-h-60 overflow-y-auto border border-gray-700 rounded">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8 text-gray-400">{t('common.noResults')}</div>
            ) : (
              <div className="divide-y divide-gray-700">
                {filteredItems.slice(0, 50).map(item => {
                  const Icon = itemTypeIcons[item.itemType];
                  const iconColor = itemTypeColors[item.itemType];
                  const displayName = getTranslatedName(item);
                  const isSelected = selectedItem?.id === item.id;

                  return (
                    <button
                      key={`${item.itemType}-${item.id}`}
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className={`w-full flex items-center gap-3 p-2 text-left transition-colors ${
                        isSelected ? 'bg-vault-blue' : 'hover:bg-gray-800'
                      }`}
                    >
                      <Icon size={16} className={iconColor} />
                      <div className="flex-1 min-w-0">
                        <span className={`block truncate ${isSelected ? 'text-vault-yellow' : 'text-white'}`}>
                          {displayName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {t(`inventory.itemTypes.${item.itemType}`)}
                        </span>
                      </div>
                      <span className={`text-xs ${rarityColors[item.rarity]}`}>
                        {t(`common.rarity.${item.rarity}`)}
                      </span>
                      <span className="text-xs text-gray-400 w-16 text-right">
                        {item.weight} {t('common.labels.lbs')}
                      </span>
                      <span className="text-xs text-vault-yellow w-16 text-right">
                        {item.value} {t('common.labels.caps')}
                      </span>
                    </button>
                  );
                })}
                {filteredItems.length > 50 && (
                  <div className="text-center py-2 text-gray-400 text-sm">
                    +{filteredItems.length - 50} {t('inventory.moreItems')}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Selected item & quantity */}
        {selectedItem && (
          <div className="p-3 bg-vault-blue border border-vault-yellow rounded">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = itemTypeIcons[selectedItem.itemType];
                  return <Icon size={18} className={itemTypeColors[selectedItem.itemType]} />;
                })()}
                <span className="text-vault-yellow font-bold">
                  {getTranslatedName(selectedItem)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">{t('inventory.quantity')}:</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 bg-gray-700 rounded hover:bg-gray-600"
                >
                  <Minus size={14} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min={1}
                  className="w-16 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-center"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 bg-gray-700 rounded hover:bg-gray-600"
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="text-sm text-gray-400">
                {(selectedItem.weight * quantity).toFixed(1)} {t('common.labels.lbs')} / {selectedItem.value * quantity} {t('common.labels.caps')}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
          <Button type="button" variant="secondary" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button type="button" onClick={handleSelect} disabled={!selectedItem}>
            {t('common.add')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
