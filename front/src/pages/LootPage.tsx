import { useTranslation } from 'react-i18next';
import { Package } from 'lucide-react';
import { LootGenerator } from '../components';

export function LootPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Package className="w-8 h-8 text-vault-yellow" />
        <h1 className="text-2xl font-bold text-vault-yellow">
          {t('loot.title')}
        </h1>
      </div>

      <LootGenerator showZoneDescriptions />
    </div>
  );
}
