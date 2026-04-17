import { useTranslation } from 'react-i18next';
import { getRepairMaterialCostByRarity, calcCraftingDifficulty } from './craftUtils';

interface RepairPanelProps {
  character: { skills?: { skill: string; rank: number }[] } | null;
}

export function RepairPanel({ character }: RepairPanelProps) {
  const { t } = useTranslation();

  const repairRank = character?.skills?.find((s) => s.skill === 'repair')?.rank ?? 0;

  return (
    <div className="space-y-4">
      <h2 className="text-vault-yellow font-bold text-base">{t('craft.repair.title')}</h2>
      <p className="text-vault-yellow-dark text-sm">{t('craft.repair.description')}</p>

      <section>
        <h3 className="text-vault-yellow-dark text-xs font-semibold uppercase tracking-wide mb-2">
          Test
        </h3>
        <p className="text-vault-yellow text-sm font-mono">{t('craft.repair.test')}</p>
        <p className="text-vault-yellow-dark text-xs mt-1">{t('craft.repair.complicationBonus')}</p>
      </section>

      <section>
        <h3 className="text-vault-yellow-dark text-xs font-semibold uppercase tracking-wide mb-2">
          {t('craft.repair.materials')}
        </h3>
        <table className="w-full text-xs text-vault-yellow-dark">
          <thead>
            <tr className="border-b border-vault-yellow-dark/30">
              <th className="text-left pb-1">{t('common.labels.rarity')}</th>
              <th className="text-center pb-1">{t('craft.recipe.materialTypes.common')}</th>
              <th className="text-center pb-1">{t('craft.recipe.materialTypes.uncommon')}</th>
              <th className="text-center pb-1">{t('craft.recipe.materialTypes.rare')}</th>
              {character && <th className="text-right pb-1">Diff.</th>}
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3, 4, 5].map((rarity) => {
              const cost = getRepairMaterialCostByRarity(rarity);
              const diff = character ? calcCraftingDifficulty(rarity, repairRank) : null;
              return (
                <tr key={rarity} className="border-b border-vault-yellow-dark/20">
                  <td className="py-1 text-vault-yellow">{t(`common.rarity.${rarity}`)}</td>
                  <td className="py-1 text-center">{cost.common}</td>
                  <td className="py-1 text-center">{cost.uncommon}</td>
                  <td className="py-1 text-center">{cost.rare}</td>
                  {character && (
                    <td className={`py-1 text-right ${diff === 0 ? 'text-green-400' : 'text-vault-yellow'}`}>
                      {diff === 0 ? '✓' : diff}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section>
        <p className="text-vault-yellow-dark text-xs">{t('craft.repair.time')}</p>
        <p className="text-vault-yellow-dark text-xs mt-1">{t('craft.repair.spareParts')}</p>
      </section>
    </div>
  );
}
