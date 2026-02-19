import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Store, RefreshCw, Coins, Loader2 } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { Select } from './Select';
import { Checkbox } from './Checkbox';
import { ItemTable } from './ItemTable';
import type { TableItem } from './ItemTable';
import { ItemDetailModal } from './ItemDetailModal';
import { generatorsApi } from '../services/api';
import type { MerchantResultApi, MerchantCategory, ItemType } from '../services/api';
import { formatCaps } from '../generators/utils';

const merchantCategories: MerchantCategory[] = [
  'Weapons', 'Ammunition', 'Armor', 'Power Armor',
  'Clothing', 'Chems', 'Food/Drink', 'General Goods',
];

interface MerchantGeneratorProps {
  showWealthDescriptions?: boolean;
  compact?: boolean;
}

export function MerchantGenerator({ showWealthDescriptions = true, compact = false }: MerchantGeneratorProps) {
  const { t } = useTranslation();
  const [wealthRating, setWealthRating] = useState(2);
  const [isTraveling, setIsTraveling] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<MerchantCategory[]>([]);
  const [result, setResult] = useState<MerchantResultApi | null>(null);
  const [selectedItem, setSelectedItem] = useState<{ id: number; itemType: ItemType } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCategoryToggle = (category: MerchantCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const merchant = await generatorsApi.generateMerchant({
        wealthRating,
        isTraveling,
        categories: selectedCategories,
      });
      setResult(merchant);
    } catch (error) {
      console.error('Failed to generate merchant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (tableItem: TableItem) => {
    if (tableItem.itemId && tableItem.itemType) {
      setSelectedItem({ id: tableItem.itemId, itemType: tableItem.itemType as ItemType });
    }
  };

  const wealthOptions = [1, 2, 3, 4, 5].map(level => ({
    value: level.toString(),
    label: `${level} - ${t(`merchant.wealthLevels.${level}.name`)}`,
  }));

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

  return (
    <div className="space-y-4">
      {/* Configuration */}
      <Card title={compact ? undefined : t('merchant.config')} icon={compact ? undefined : <Store size={20} />}>
        <div className="space-y-4">
          <div className={`grid gap-4 ${compact ? 'grid-cols-2' : 'sm:grid-cols-2'}`}>
            <Select
              label={t('merchant.wealthRating')}
              value={wealthRating.toString()}
              onChange={e => setWealthRating(parseInt(e.target.value))}
              options={wealthOptions}
            />
            <div className="flex items-end">
              <Checkbox
                label={t('merchant.traveling')}
                checked={isTraveling}
                onChange={e => setIsTraveling(e.target.checked)}
              />
            </div>
          </div>

          <div>
            <label className="text-vault-yellow text-sm font-medium uppercase tracking-wide block mb-2">
              {t('merchant.categories')}
            </label>
            <div className={`grid gap-2 ${compact ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
              {merchantCategories.map(category => (
                <Checkbox
                  key={category}
                  label={t(`merchant.categoryNames.${category}`)}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                />
              ))}
            </div>
          </div>

          <Button onClick={handleGenerate} className="w-full sm:w-auto" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 inline mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 inline mr-2" />}
            {t('merchant.generate')}
          </Button>
        </div>
      </Card>

      {/* Results */}
      {result && (
        <Card title={t(`merchant.wealthLevels.${result.wealthRating}.name`)}>
          {/* Merchant Info */}
          <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-vault-yellow-dark">
            <div className="bg-vault-blue px-4 py-2 rounded flex items-center gap-2">
              <Coins className="w-5 h-5 text-vault-yellow" />
              <div>
                <div className="text-vault-yellow-dark text-xs uppercase">
                  {t('merchant.availableCaps')}
                </div>
                <div className="text-vault-yellow font-bold">
                  {formatCaps(result.availableCaps)}
                </div>
              </div>
            </div>
            <div className="bg-vault-blue px-4 py-2 rounded">
              <div className="text-vault-yellow-dark text-xs uppercase">
                {t('merchant.stockValue')}
              </div>
              <div className="text-vault-yellow font-bold">
                {formatCaps(result.totalValue)}
              </div>
            </div>
            <div className="bg-vault-blue px-4 py-2 rounded">
              <div className="text-vault-yellow-dark text-xs uppercase">
                {t('merchant.wealth')}
              </div>
              <div className="text-vault-yellow font-bold">
                {t('merchant.level')} {result.wealthRating}
              </div>
            </div>
            {result.isTraveling && (
              <div className="bg-vault-blue px-4 py-2 rounded">
                <div className="text-vault-yellow font-bold text-sm">
                  {t('merchant.travelingLabel')}
                </div>
              </div>
            )}
          </div>

          {/* Inventory */}
          <h3 className="text-vault-yellow font-bold mb-4">{t('merchant.inventory')}</h3>
          <ItemTable items={tableItems} onItemClick={handleItemClick} />
        </Card>
      )}

      {/* Wealth descriptions */}
      {showWealthDescriptions && (
        <Card title={t('merchant.wealthLevels.title')}>
          <div className="space-y-3 text-sm">
            {[1, 2, 3, 4, 5].map(level => (
              <div key={level} className="flex gap-4">
                <span className="text-vault-yellow font-bold w-8">{level}</span>
                <div>
                  <span className="text-vault-yellow">{t(`merchant.wealthLevels.${level}.name`)}</span>
                  <span className="text-vault-yellow-dark"> - {t(`merchant.wealthLevels.${level}.description`)}</span>
                </div>
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
