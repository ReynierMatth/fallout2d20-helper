import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { Modal } from './Modal';
import { getRarityColor } from '../generators/utils';
import { itemsApi, type ItemType, type ItemEffect, type WeaponApi, type ArmorApi, type PowerArmorApi, type ClothingApi, type ChemApi, type FoodApi, type AmmunitionApi, type GeneralGoodApi, type RobotArmorApi, type SyringerAmmoApi, type MagazineApi, type DiseaseApi, type PerkApi } from '../services/api';
import { EffectDisplay } from './EffectDisplay';

type AnyItemApi = WeaponApi | ArmorApi | PowerArmorApi | RobotArmorApi | ClothingApi | AmmunitionApi | SyringerAmmoApi | ChemApi | FoodApi | GeneralGoodApi | MagazineApi;

// Wrapper type for encyclopedia entries that can be items, diseases, perks, or weapon qualities
export type EncyclopediaEntry =
  | { type: 'item'; itemType: ItemType; id: number; data?: AnyItemApi }
  | { type: 'disease'; data: DiseaseApi }
  | { type: 'perk'; data: PerkApi }
  | { type: 'weapon-quality'; qualityKey: string };

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: number | null;
  itemType: ItemType | null;
  // Alternative: pass a full entry directly (for diseases/perks that don't use itemsApi)
  entry?: EncyclopediaEntry | null;
}

export function ItemDetailModal({ isOpen, onClose, itemId, itemType, entry }: ItemDetailModalProps) {
  const { t } = useTranslation();
  const [item, setItem] = useState<AnyItemApi | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch item data when modal opens (only for item entries, not diseases/perks)
  useEffect(() => {
    if (isOpen && !entry && itemId && itemType) {
      setLoading(true);
      setError(null);

      itemsApi.getItem(itemId)
        .then((data) => {
          setItem(data as AnyItemApi);
        })
        .catch((err) => {
          setError(err.message || 'Failed to load item');
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (!entry) {
      setItem(null);
    }
  }, [isOpen, itemId, itemType, entry]);

  // Get translated item name
  const getTitle = (): string => {
    if (entry) {
      if (entry.type === 'disease') {
        if (entry.data.nameKey) {
          const translated = t(entry.data.nameKey);
          if (translated !== entry.data.nameKey) return translated;
        }
        return entry.data.name;
      }
      if (entry.type === 'perk') {
        return t(entry.data.nameKey);
      }
      if (entry.type === 'weapon-quality') {
        return t(`qualities.${entry.qualityKey}.name`);
      }
      // item entry with preloaded data
      if (entry.type === 'item' && entry.data) {
        return getItemName(entry.data, entry.itemType);
      }
    }
    if (!item) return '';
    return getItemName(item, itemType);
  };

  const getItemName = (itemData: AnyItemApi, type: ItemType | null): string => {
    if (itemData.nameKey) {
      const translated = t(itemData.nameKey);
      if (translated !== itemData.nameKey) return translated;
    }
    const categoryKey = type === 'weapon' ? 'weapons'
      : type === 'armor' ? 'armor'
      : type === 'powerArmor' ? 'armor'
      : type === 'robotArmor' ? 'armor'
      : type === 'clothing' ? 'clothing'
      : type === 'chem' ? 'chems'
      : type === 'food' ? 'food'
      : type === 'ammunition' ? 'ammunition'
      : type === 'syringerAmmo' ? 'ammunition'
      : type === 'magazine' ? 'magazines'
      : 'general';
    const translated = t(`items.${categoryKey}.${itemData.name}`);
    if (translated !== `items.${categoryKey}.${itemData.name}`) return translated;
    return itemData.name;
  };

  if (!isOpen) return null;

  // Render disease detail
  if (entry?.type === 'disease') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
        <DiseaseDetails disease={entry.data} />
      </Modal>
    );
  }

  // Render perk detail
  if (entry?.type === 'perk') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
        <PerkDetails perk={entry.data} />
      </Modal>
    );
  }

  // Render weapon quality detail
  if (entry?.type === 'weapon-quality') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
        <WeaponQualityDetails qualityKey={entry.qualityKey} />
      </Modal>
    );
  }

  const effectiveItemType = entry?.type === 'item' ? entry.itemType : itemType;
  const effectiveItem = entry?.type === 'item' && entry.data ? entry.data : item;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={loading ? t('common.loading') : getTitle()}>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-vault-yellow" />
        </div>
      ) : error ? (
        <div className="text-red-400 text-center py-4">{error}</div>
      ) : effectiveItem ? (
        <div className="space-y-4">
          {/* Base stats */}
          <div className="flex flex-wrap gap-4 text-sm border-b border-vault-yellow-dark pb-4">
            <div>
              <span className="text-vault-yellow-dark">{t('common.labels.value')}: </span>
              <span className="text-vault-yellow">{effectiveItem.value} {t('common.labels.caps')}</span>
            </div>
            <div>
              <span className="text-vault-yellow-dark">{t('common.labels.weight')}: </span>
              <span className="text-vault-yellow">{effectiveItem.weight} {t('common.labels.lbs')}</span>
            </div>
            <div>
              <span className="text-vault-yellow-dark">{t('common.labels.rarity')}: </span>
              <span className={getRarityColor(effectiveItem.rarity)}>{t(`common.rarity.${effectiveItem.rarity}`)}</span>
            </div>
          </div>

          {/* Type-specific details */}
          {effectiveItemType === 'weapon' && <WeaponDetails item={effectiveItem as WeaponApi} />}
          {effectiveItemType === 'armor' && <ArmorDetails item={effectiveItem as ArmorApi} />}
          {effectiveItemType === 'powerArmor' && <PowerArmorDetails item={effectiveItem as PowerArmorApi} />}
          {effectiveItemType === 'robotArmor' && <RobotArmorDetails item={effectiveItem as RobotArmorApi} />}
          {effectiveItemType === 'clothing' && <ClothingDetails item={effectiveItem as ClothingApi} />}
          {effectiveItemType === 'ammunition' && <AmmunitionDetails item={effectiveItem as AmmunitionApi} />}
          {effectiveItemType === 'syringerAmmo' && <SyringerAmmoDetails item={effectiveItem as SyringerAmmoApi} />}
          {effectiveItemType === 'chem' && <ChemDetails item={effectiveItem as ChemApi} />}
          {effectiveItemType === 'food' && <FoodDetails item={effectiveItem as FoodApi} />}
          {(effectiveItemType === 'generalGood' || effectiveItemType === 'oddity') && <GeneralGoodDetails item={effectiveItem as GeneralGoodApi} />}
          {effectiveItemType === 'magazine' && <MagazineDetails item={effectiveItem as MagazineApi} />}
        </div>
      ) : null}
    </Modal>
  );
}

function WeaponDetails({ item }: { item: WeaponApi }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-vault-yellow-dark">{t('itemDetail.damage')}: </span>
          <span className="text-white font-bold">{item.damage} {t('itemDetail.cd')}</span>
          {item.damageBonus && <span className="text-green-400"> +{item.damageBonus}</span>}
          <span className="text-gray-400"> ({t(`damageTypes.${item.damageType}`)})</span>
        </div>
        <div>
          <span className="text-vault-yellow-dark">{t('itemDetail.range')}: </span>
          <span className="text-white">{t(`ranges.${item.range}`)}</span>
        </div>
        <div>
          <span className="text-vault-yellow-dark">{t('itemDetail.fireRate')}: </span>
          <span className="text-white">{item.fireRate}</span>
        </div>
        <div>
          <span className="text-vault-yellow-dark">{t('itemDetail.skill')}: </span>
          <span className="text-white">{t(`skills.${item.skill}`)}</span>
        </div>
        {item.ammo && item.ammo !== '-' && (
          <div>
            <span className="text-vault-yellow-dark">{t('itemDetail.ammo')}: </span>
            <span className="text-white">{item.ammo}</span>
            {item.ammoPerShot && item.ammoPerShot > 1 && (
              <span className="text-gray-400"> (x{item.ammoPerShot})</span>
            )}
          </div>
        )}
      </div>

      {/* Qualities */}
      {item.qualities && item.qualities.length > 0 && (
        <div>
          <h4 className="text-vault-yellow font-bold text-sm mb-2">{t('itemDetail.qualities')}</h4>
          <div className="space-y-1">
            {item.qualities.map((q, i) => (
              <div key={i} className="text-sm">
                <span className="text-vault-yellow">{t(`qualities.${q.quality}.name`)}</span>
                {q.value && <span className="text-white"> ({q.value})</span>}
                <span className="text-gray-400"> - {t(`qualities.${q.quality}.description`, { value: q.value })}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ArmorDetails({ item }: { item: ArmorApi }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-vault-yellow-dark">{t('itemDetail.location')}: </span>
          <span className="text-white">{t(`bodyLocations.${item.location}`)}</span>
        </div>
        {item.set && (
          <div>
            <span className="text-vault-yellow-dark">{t('itemDetail.set')}: </span>
            <span className="text-white">{t(`armorSets.${item.set}`)}</span>
          </div>
        )}
        {item.hp && (
          <div>
            <span className="text-vault-yellow-dark">HP: </span>
            <span className="text-white">{item.hp}</span>
          </div>
        )}
      </div>

      {/* DR */}
      <div>
        <h4 className="text-vault-yellow font-bold text-sm mb-2">{t('itemDetail.dr')}</h4>
        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-gray-400">{t('itemDetail.physical')}: </span>
            <span className="text-white font-bold">{item.drPhysical}</span>
          </div>
          <div>
            <span className="text-gray-400">{t('itemDetail.energy')}: </span>
            <span className="text-blue-400 font-bold">{item.drEnergy}</span>
          </div>
          <div>
            <span className="text-gray-400">{t('itemDetail.radiation')}: </span>
            <span className="text-yellow-400 font-bold">{item.drRadiation}</span>
          </div>
          {item.drPoison !== undefined && item.drPoison > 0 && (
            <div>
              <span className="text-gray-400">{t('itemDetail.poison')}: </span>
              <span className="text-green-400 font-bold">{item.drPoison}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PowerArmorDetails({ item }: { item: PowerArmorApi }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-vault-yellow-dark">{t('itemDetail.location')}: </span>
          <span className="text-white">{t(`bodyLocations.${item.location}`)}</span>
        </div>
        {item.set && (
          <div>
            <span className="text-vault-yellow-dark">{t('itemDetail.set')}: </span>
            <span className="text-white">{t(`armorSets.${item.set}`)}</span>
          </div>
        )}
        <div>
          <span className="text-vault-yellow-dark">HP: </span>
          <span className="text-white font-bold">{item.hp}</span>
        </div>
      </div>

      {/* DR */}
      <div>
        <h4 className="text-vault-yellow font-bold text-sm mb-2">{t('itemDetail.dr')}</h4>
        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-gray-400">{t('itemDetail.physical')}: </span>
            <span className="text-white font-bold">{item.drPhysical}</span>
          </div>
          <div>
            <span className="text-gray-400">{t('itemDetail.energy')}: </span>
            <span className="text-blue-400 font-bold">{item.drEnergy}</span>
          </div>
          <div>
            <span className="text-gray-400">{t('itemDetail.radiation')}: </span>
            <span className="text-yellow-400 font-bold">{item.drRadiation}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RobotArmorDetails({ item }: { item: RobotArmorApi }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-vault-yellow-dark">{t('itemDetail.location')}: </span>
          <span className="text-white">{t(`bodyLocations.${item.location}`)}</span>
        </div>
        {item.isBonus && (
          <div>
            <span className="text-green-400">Bonus</span>
          </div>
        )}
        {item.carryModifier && (
          <div>
            <span className="text-vault-yellow-dark">{t('characters.carryCapacity')}: </span>
            <span className="text-white">+{item.carryModifier}</span>
          </div>
        )}
      </div>

      {/* DR */}
      <div>
        <h4 className="text-vault-yellow font-bold text-sm mb-2">{t('itemDetail.dr')}</h4>
        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-gray-400">{t('itemDetail.physical')}: </span>
            <span className="text-white font-bold">{item.drPhysical}</span>
          </div>
          <div>
            <span className="text-gray-400">{t('itemDetail.energy')}: </span>
            <span className="text-blue-400 font-bold">{item.drEnergy}</span>
          </div>
        </div>
      </div>

      {/* Special effect */}
      {item.specialEffectKey && (
        <div>
          <h4 className="text-vault-yellow font-bold text-sm mb-1">{t('itemDetail.effect')}</h4>
          <p className="text-sm text-gray-300">{t(item.specialEffectKey)}</p>
        </div>
      )}
    </div>
  );
}

function ClothingDetails({ item }: { item: ClothingApi }) {
  const { t } = useTranslation();

  const hasDR = (item.drPhysical ?? 0) > 0 || (item.drEnergy ?? 0) > 0 || (item.drRadiation ?? 0) > 0 || (item.drPoison ?? 0) > 0;

  return (
    <div className="space-y-3">
      {/* Locations */}
      {item.locations && item.locations.length > 0 && (
        <div className="text-sm">
          <span className="text-vault-yellow-dark">{t('itemDetail.locations')}: </span>
          <span className="text-white">
            {item.locations.map(loc => t(`bodyLocations.${loc}`)).join(', ')}
          </span>
        </div>
      )}

      {/* DR if any */}
      {hasDR && (
        <div>
          <h4 className="text-vault-yellow font-bold text-sm mb-2">{t('itemDetail.dr')}</h4>
          <div className="flex gap-4 text-sm">
            {(item.drPhysical ?? 0) > 0 && (
              <div>
                <span className="text-gray-400">{t('itemDetail.physical')}: </span>
                <span className="text-white font-bold">{item.drPhysical}</span>
              </div>
            )}
            {(item.drEnergy ?? 0) > 0 && (
              <div>
                <span className="text-gray-400">{t('itemDetail.energy')}: </span>
                <span className="text-blue-400 font-bold">{item.drEnergy}</span>
              </div>
            )}
            {(item.drRadiation ?? 0) > 0 && (
              <div>
                <span className="text-gray-400">{t('itemDetail.radiation')}: </span>
                <span className="text-yellow-400 font-bold">{item.drRadiation}</span>
              </div>
            )}
            {(item.drPoison ?? 0) > 0 && (
              <div>
                <span className="text-gray-400">{t('itemDetail.poison')}: </span>
                <span className="text-green-400 font-bold">{item.drPoison}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Structured effect */}
      {item.effect && <EffectDisplay effect={item.effect as ItemEffect} />}

      {/* Text-based effects */}
      {item.effects && item.effects.length > 0 && (
        <div>
          {!item.effect && <h4 className="text-vault-yellow font-bold text-sm mb-2">{t('itemDetail.effects')}</h4>}
          <div className="space-y-1">
            {item.effects.map((effect, i) => (
              <div key={i} className="text-sm text-gray-300">
                {t(effect.descriptionKey)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AmmunitionDetails({ item }: { item: AmmunitionApi }) {
  const { t } = useTranslation();

  return (
    <div className="text-sm">
      <div>
        <span className="text-vault-yellow-dark">{t('itemDetail.baseQty')}: </span>
        <span className="text-white">{item.flatAmount}</span>
      </div>
      {item.randomAmount > 0 && (
        <div>
          <span className="text-vault-yellow-dark">{t('itemDetail.bonusQty')}: </span>
          <span className="text-white">+{item.randomAmount} {t('itemDetail.cd')}</span>
        </div>
      )}
    </div>
  );
}

function SyringerAmmoDetails({ item }: { item: SyringerAmmoApi }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2 text-sm">
      {item.effect && <EffectDisplay effect={item.effect as ItemEffect} />}
      {!item.effect && item.effectKey && (
        <div>
          <span className="text-vault-yellow-dark">{t('itemDetail.effect')}: </span>
          <span className="text-gray-300">{t(item.effectKey)}</span>
        </div>
      )}
    </div>
  );
}

function ChemDetails({ item }: { item: ChemApi }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2 text-sm">
      <div>
        <span className="text-vault-yellow-dark">{t('itemDetail.duration')}: </span>
        <span className="text-white">{t(`chemTypes.${item.duration}`)}</span>
      </div>
      <div>
        <span className="text-vault-yellow-dark">{t('itemDetail.addictive')}: </span>
        <span className={item.addictive ? 'text-red-400' : 'text-green-400'}>
          {item.addictive ? t('itemDetail.yes') : t('itemDetail.no')}
          {item.addictive && item.addictionLevel && ` (${item.addictionLevel})`}
        </span>
      </div>
      {item.effect && <EffectDisplay effect={item.effect as ItemEffect} />}
      {!item.effect && item.effectKey && (
        <div>
          <span className="text-vault-yellow-dark">{t('itemDetail.effect')}: </span>
          <span className="text-gray-300">{t(item.effectKey)}</span>
        </div>
      )}
    </div>
  );
}

function FoodDetails({ item }: { item: FoodApi }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2 text-sm">
      <div>
        <span className="text-vault-yellow-dark">{t('itemDetail.type')}: </span>
        <span className="text-white">{t(`foodTypes.${item.foodType}`)}</span>
      </div>
      <div>
        <span className="text-vault-yellow-dark">{t('itemDetail.irradiated')}: </span>
        <span className={item.irradiated ? 'text-yellow-400' : 'text-green-400'}>
          {item.irradiated ? t('itemDetail.yes') : t('itemDetail.no')}
        </span>
      </div>
      {item.effect && <EffectDisplay effect={item.effect as ItemEffect} />}
      {!item.effect && item.effectKey && (
        <div>
          <span className="text-vault-yellow-dark">{t('itemDetail.effect')}: </span>
          <span className="text-gray-300">{t(item.effectKey)}</span>
        </div>
      )}
    </div>
  );
}

function GeneralGoodDetails({ item }: { item: GeneralGoodApi }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2 text-sm">
      <div>
        <span className="text-vault-yellow-dark">{t('itemDetail.type')}: </span>
        <span className="text-white">{t(`generalGoodTypes.${item.goodType}`)}</span>
      </div>
      {item.effect && <EffectDisplay effect={item.effect as ItemEffect} />}
      {!item.effect && item.effectKey && (
        <div>
          <span className="text-vault-yellow-dark">{t('itemDetail.effect')}: </span>
          <span className="text-gray-300">{t(item.effectKey)}</span>
        </div>
      )}
    </div>
  );
}

function MagazineDetails({ item }: { item: MagazineApi }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      {/* Perk description */}
      {item.perkDescriptionKey && (
        <div className="text-sm">
          <h4 className="text-vault-yellow font-bold mb-1">{t('itemDetail.perkBonus')}</h4>
          <p className="text-gray-300">{t(item.perkDescriptionKey)}</p>
        </div>
      )}

      {/* Issues as cards */}
      {item.issues && item.issues.length > 0 && (
        <div>
          <h4 className="text-vault-yellow font-bold text-sm mb-2">{t('itemDetail.issues')}</h4>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {item.issues.map((issue, i) => (
              <div key={i} className="bg-vault-gray-light/20 rounded-lg px-3 py-2 border border-vault-gray-light/30">
                <div className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center bg-vault-yellow text-vault-gray font-bold rounded px-2 py-0.5 min-w-[2.5rem] text-xs shrink-0 mt-0.5">
                    {issue.d20Min === issue.d20Max
                      ? issue.d20Min
                      : `${issue.d20Min}-${issue.d20Max}`}
                  </span>
                  <div className="min-w-0">
                    <span className="text-white text-sm font-medium">
                      {issue.issueNameKey ? t(issue.issueNameKey, { defaultValue: issue.issueName }) : issue.issueName}
                    </span>
                    <p className="text-gray-400 text-xs mt-0.5">{t(issue.effectDescriptionKey)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WeaponQualityDetails({ qualityKey }: { qualityKey: string }) {
  const { t } = useTranslation();

  const description = t(`qualities.${qualityKey}.description`);
  const detailedRule = t(`effects.weaponQualities.${qualityKey}.rules.0`, { defaultValue: '' });

  return (
    <div className="space-y-3">
      <div className="text-sm">
        <h4 className="text-vault-yellow font-bold mb-1">{t('itemDetail.effect')}</h4>
        <p className="text-gray-300">{description}</p>
      </div>
      {detailedRule && (
        <div className="text-sm">
          <h4 className="text-vault-yellow font-bold mb-1">{t('encyclopedia.weaponQuality.detailedRule')}</h4>
          <p className="text-gray-300">{detailedRule}</p>
        </div>
      )}
    </div>
  );
}

function DiseaseDetails({ disease }: { disease: DiseaseApi }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-4 text-sm border-b border-vault-yellow-dark pb-4">
        <div>
          <span className="text-vault-yellow-dark">{t('itemDetail.d20Roll')}: </span>
          <span className="inline-flex items-center justify-center bg-vault-yellow text-vault-gray font-bold rounded px-2 py-0.5 min-w-[2rem]">
            {disease.d20Roll}
          </span>
        </div>
        <div>
          <span className="text-vault-yellow-dark">{t('itemDetail.durationStages')}: </span>
          <span className="text-white">{disease.duration}</span>
        </div>
      </div>

      {/* Effect */}
      {disease.effectKey && (
        <div className="text-sm">
          <h4 className="text-vault-yellow font-bold mb-1">{t('itemDetail.effect')}</h4>
          <p className="text-gray-300">{t(disease.effectKey)}</p>
        </div>
      )}
    </div>
  );
}

function PerkDetails({ perk }: { perk: PerkApi }) {
  const { t } = useTranslation();
  const prereqs = perk.prerequisites;

  return (
    <div className="space-y-3">
      {/* Max ranks */}
      <div className="text-sm">
        <span className="text-vault-yellow-dark">{t('itemDetail.maxRanks')}: </span>
        <span className="text-white font-bold">{perk.maxRanks}</span>
      </div>

      {/* Effect */}
      <div className="text-sm">
        <h4 className="text-vault-yellow font-bold mb-1">{t('itemDetail.effect')}</h4>
        <p className="text-gray-300">{t(perk.effectKey)}</p>
      </div>

      {/* Rank effects */}
      {perk.rankEffects && perk.rankEffects.length > 0 && (
        <div className="text-sm">
          <h4 className="text-vault-yellow font-bold mb-1">{t('itemDetail.ranks')}</h4>
          <div className="space-y-1">
            {perk.rankEffects.map((re, i) => (
              <div key={i} className="text-gray-300">
                <span className="text-vault-yellow">{t('itemDetail.level')} {re.rank}: </span>
                {t(re.effectKey)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prerequisites */}
      {prereqs && (
        <div className="text-sm">
          <h4 className="text-vault-yellow font-bold mb-1">{t('itemDetail.prerequisites')}</h4>
          <div className="space-y-1">
            {prereqs.level && (
              <div>
                <span className="text-vault-yellow-dark">{t('itemDetail.requiredLevel')}: </span>
                <span className="text-white">{prereqs.level}</span>
                {prereqs.levelIncreasePerRank && (
                  <span className="text-gray-400"> (+{prereqs.levelIncreasePerRank}/{t('itemDetail.ranks').toLowerCase()})</span>
                )}
              </div>
            )}
            {prereqs.special && Object.keys(prereqs.special).length > 0 && (
              <div>
                <span className="text-vault-yellow-dark">{t('itemDetail.requiredSpecial')}: </span>
                <span className="text-white">
                  {Object.entries(prereqs.special).map(([attr, val]) => (
                    `${t(`special.${attr}`)} ${val}`
                  )).join(', ')}
                </span>
              </div>
            )}
            {prereqs.skills && Object.keys(prereqs.skills).length > 0 && (
              <div>
                <span className="text-vault-yellow-dark">{t('itemDetail.requiredSkills')}: </span>
                <span className="text-white">
                  {Object.entries(prereqs.skills).map(([skill, val]) => (
                    `${t(`skills.${skill}`)} ${val}`
                  )).join(', ')}
                </span>
              </div>
            )}
            {prereqs.perks && prereqs.perks.length > 0 && (
              <div>
                <span className="text-vault-yellow-dark">{t('itemDetail.requiredPerks')}: </span>
                <span className="text-white">
                  {prereqs.perks.map(p => t(`perks.${p}.name`, p)).join(', ')}
                </span>
              </div>
            )}
            {prereqs.excludedPerks && prereqs.excludedPerks.length > 0 && (
              <div>
                <span className="text-vault-yellow-dark">{t('itemDetail.excludedPerks')}: </span>
                <span className="text-red-400">
                  {prereqs.excludedPerks.map(p => t(`perks.${p}.name`, p)).join(', ')}
                </span>
              </div>
            )}
            {prereqs.notForRobots && (
              <div className="text-red-400">{t('itemDetail.notForRobots')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
