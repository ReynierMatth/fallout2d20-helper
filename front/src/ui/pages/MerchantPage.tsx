import { useTranslation } from 'react-i18next';
import { Store } from 'lucide-react';
import { MerchantGenerator } from '../../components';

export function MerchantPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Store className="w-8 h-8 text-vault-yellow" />
        <h1 className="text-2xl font-bold text-vault-yellow">
          {t('merchant.title')}
        </h1>
      </div>

      <MerchantGenerator showWealthDescriptions />
    </div>
  );
}
