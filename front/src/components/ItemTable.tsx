import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus, Loader2, Check } from 'lucide-react';
import { getRarityColor, formatCaps, formatWeight } from '../generators/utils';

export interface TableItem {
  name: string;
  quantity: number;
  value: number;
  weight: number;
  rarity: number;
  category: string;
  itemId?: number;
  itemType?: string;
}

export interface PcOption {
  id: string;
  name: string;
}

interface ItemTableProps {
  items: TableItem[];
  showCategory?: boolean;
  onItemClick?: (item: TableItem) => void;
  pcs?: PcOption[];
  onAddToCharacter?: (characterId: string, item: TableItem) => Promise<void>;
}

// Map category to i18n category key for item names
function getCategoryKey(category: string): string {
  switch (category) {
    case 'Ammunition':
      return 'ammunition';
    case 'Armor':
      return 'armor';
    case 'Clothing':
      return 'clothing';
    case 'Food':
    case 'Beverages':
      return 'food';
    case 'Chems':
      return 'chems';
    case 'Melee Weapons':
    case 'Ranged Weapons':
    case 'Thrown/Explosives':
      return 'weapons';
    case 'Oddities/Valuables':
    case 'Junk':
      return 'general';
    case 'Weapons':
      return 'weapons';
    case 'Power Armor':
      return 'power-armor';
    case 'Food/Drink':
      return 'food';
    case 'General Goods':
      return 'general';
    default:
      return 'general';
  }
}

export function ItemTable({ items, showCategory = true, onItemClick, pcs, onAddToCharacter }: ItemTableProps) {
  const { t } = useTranslation();
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [loadingRow, setLoadingRow] = useState<string | null>(null);
  const [successRow, setSuccessRow] = useState<string | null>(null);

  const handleAddToCharacter = async (characterId: string, item: TableItem, rowKey: string) => {
    if (!onAddToCharacter) return;
    setOpenRow(null);
    setLoadingRow(rowKey);
    try {
      await onAddToCharacter(characterId, item);
      setSuccessRow(rowKey);
      setTimeout(() => setSuccessRow(null), 2000);
    } finally {
      setLoadingRow(null);
    }
  };

  const showInventoryColumn = !!pcs && pcs.length > 0 && !!onAddToCharacter;

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-vault-yellow-dark">
        {t('loot.noItems')}
      </div>
    );
  }

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, TableItem[]>);

  const getItemName = (item: TableItem): string => {
    const categoryKey = getCategoryKey(item.category);
    return t(`items.${categoryKey}.${item.name}`, { defaultValue: item.name });
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category}>
          {showCategory && (
            <h3 className="text-vault-yellow font-bold text-sm uppercase tracking-wide mb-2 border-b border-vault-yellow-dark pb-1">
              {t(`lootCategories.${category}`, { defaultValue: category })}
            </h3>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-vault-yellow-dark text-left">
                  <th className="pb-2 font-medium">{t('common.labels.name')}</th>
                  <th className="pb-2 font-medium text-center">{t('common.labels.quantity')}</th>
                  <th className="pb-2 font-medium text-right">{t('common.labels.value')}</th>
                  <th className="pb-2 font-medium text-right hidden sm:table-cell">{t('common.labels.weight')}</th>
                  <th className="pb-2 font-medium text-right hidden md:table-cell">{t('common.labels.rarity')}</th>
                  {showInventoryColumn && <th className="pb-2 w-8" />}
                </tr>
              </thead>
              <tbody>
                {categoryItems.map((item, index) => {
                  const rowKey = `${item.name}-${index}`;
                  return (
                    <tr
                      key={rowKey}
                      className={`border-b border-vault-gray-light hover:bg-vault-gray-light/50 ${onItemClick ? 'cursor-pointer' : ''}`}
                      onClick={() => onItemClick?.(item)}
                    >
                      <td className={`py-2 ${getRarityColor(item.rarity)}`}>
                        {getItemName(item)}
                      </td>
                      <td className="py-2 text-center text-vault-yellow">
                        {item.quantity}
                      </td>
                      <td className="py-2 text-right text-vault-yellow">
                        {formatCaps(item.value * item.quantity)}
                      </td>
                      <td className="py-2 text-right text-vault-yellow-dark hidden sm:table-cell">
                        {formatWeight(item.weight * item.quantity)}
                      </td>
                      <td className={`py-2 text-right hidden md:table-cell ${getRarityColor(item.rarity)}`}>
                        {t(`common.rarity.${item.rarity}`)}
                      </td>
                      {showInventoryColumn && (
                        <td className="py-2 pl-2 text-right" onClick={e => e.stopPropagation()}>
                          {successRow === rowKey ? (
                            <Check size={14} className="text-green-400 inline" />
                          ) : loadingRow === rowKey ? (
                            <Loader2 size={14} className="animate-spin text-vault-yellow inline" />
                          ) : openRow === rowKey ? (
                            <select
                              autoFocus
                              defaultValue=""
                              onChange={e => e.target.value && handleAddToCharacter(e.target.value, item, rowKey)}
                              onBlur={() => setOpenRow(null)}
                              className="bg-vault-blue border border-vault-yellow text-vault-yellow text-xs rounded px-1 py-0.5 max-w-[120px]"
                            >
                              <option value="" disabled>{t('common.selectPc')}</option>
                              {pcs!.map(pc => (
                                <option key={pc.id} value={pc.id}>{pc.name}</option>
                              ))}
                            </select>
                          ) : (
                            <button
                              onClick={() => setOpenRow(rowKey)}
                              className="text-vault-yellow-dark hover:text-vault-yellow transition-colors"
                              title={t('common.addToInventory')}
                            >
                              <UserPlus size={14} />
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
