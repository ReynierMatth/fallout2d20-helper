import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, AlertTriangle } from 'lucide-react';
import type { InventoryItemApi } from '../../../services/api';

type BodyLocation = 'head' | 'torso' | 'armLeft' | 'armRight' | 'legLeft' | 'legRight';

interface LocationDR {
  physical: number;
  energy: number;
  radiation: number;
  poison: number;
  // Power Armor piece info
  paCurrentHp?: number;
  paMaxHp?: number;
  paDamaged?: boolean;
  paInventoryId?: number; // To update HP
  paPieceName?: string;
}

interface BodyResistanceMapProps {
  inventory: InventoryItemApi[];
  showPoison?: boolean;
  originId?: string;
  onPieceHpChange?: (inventoryId: number, newHp: number) => void;
}

// Hit location ranges for reference
const HIT_LOCATIONS: Record<BodyLocation, string> = {
  head: '1-2',
  torso: '3-8',
  armLeft: '9-11',
  armRight: '12-14',
  legLeft: '15-17',
  legRight: '18-20',
};

export function BodyResistanceMap({ inventory, showPoison = false, originId, onPieceHpChange }: BodyResistanceMapProps) {
  const { t } = useTranslation();
  const isMisterHandy = originId === 'misterHandy';

  // Calculate DR for each body location based on equipped items
  const locationDR = useMemo(() => {
    const dr: Record<BodyLocation, LocationDR> = {
      head: { physical: 0, energy: 0, radiation: 0, poison: 0 },
      torso: { physical: 0, energy: 0, radiation: 0, poison: 0 },
      armLeft: { physical: 0, energy: 0, radiation: 0, poison: 0 },
      armRight: { physical: 0, energy: 0, radiation: 0, poison: 0 },
      legLeft: { physical: 0, energy: 0, radiation: 0, poison: 0 },
      legRight: { physical: 0, energy: 0, radiation: 0, poison: 0 },
    };

    // Process equipped items
    for (const inv of inventory) {
      if (!inv.equipped) continue;

      // Power Armor piece - separate type with powerArmorDetails
      if (inv.item.itemType === 'powerArmor' && inv.powerArmorDetails) {
        const location = inv.equippedLocation || inv.powerArmorDetails.location;
        if (location && location in dr) {
          const loc = location as BodyLocation;
          const maxHp = inv.maxHp ?? inv.powerArmorDetails.hp;
          const currentHp = inv.currentHp ?? maxHp; // If null, piece is at full HP
          const isDamaged = currentHp <= 0;

          dr[loc].paMaxHp = maxHp;
          dr[loc].paCurrentHp = currentHp;
          dr[loc].paDamaged = isDamaged;
          dr[loc].paInventoryId = inv.id;
          dr[loc].paPieceName = inv.item.name;

          // Only add DR if piece is not damaged
          if (!isDamaged) {
            dr[loc].physical += inv.powerArmorDetails.drPhysical;
            dr[loc].energy += inv.powerArmorDetails.drEnergy;
            dr[loc].radiation += inv.powerArmorDetails.drRadiation;
          }
        }
      }

      // Armor piece - applies to specific location
      if (inv.item.itemType === 'armor' && inv.armorDetails) {
        const location = inv.equippedLocation || inv.armorDetails.location;
        if (location && location in dr) {
          const loc = location as BodyLocation;

          // Check if this is a Power Armor piece (has HP) - legacy support
          const maxHp = inv.maxHp ?? inv.armorDetails.hp;
          if (maxHp) {
            // Power Armor piece stored in armor table
            const currentHp = inv.currentHp ?? maxHp; // If null, piece is at full HP
            const isDamaged = currentHp <= 0;

            dr[loc].paMaxHp = maxHp;
            dr[loc].paCurrentHp = currentHp;
            dr[loc].paDamaged = isDamaged;
            dr[loc].paInventoryId = inv.id;
            dr[loc].paPieceName = inv.item.name;

            // Only add DR if piece is not damaged
            if (!isDamaged) {
              dr[loc].physical += inv.armorDetails.drPhysical;
              dr[loc].energy += inv.armorDetails.drEnergy;
              dr[loc].radiation += inv.armorDetails.drRadiation;
              dr[loc].poison += inv.armorDetails.drPoison ?? 0;
            }
          } else {
            // Regular armor piece
            dr[loc].physical += inv.armorDetails.drPhysical;
            dr[loc].energy += inv.armorDetails.drEnergy;
            dr[loc].radiation += inv.armorDetails.drRadiation;
            dr[loc].poison += inv.armorDetails.drPoison ?? 0;
          }
        }
      }

      // Clothing - can cover multiple locations
      if (inv.item.itemType === 'clothing' && inv.clothingDetails) {
        const locations = inv.clothingDetails.locations;
        for (const location of locations) {
          if (location in dr) {
            const loc = location as BodyLocation;
            dr[loc].physical += inv.clothingDetails.drPhysical;
            dr[loc].energy += inv.clothingDetails.drEnergy;
            dr[loc].radiation += inv.clothingDetails.drRadiation;
            dr[loc].poison += inv.clothingDetails.drPoison ?? 0;
          }
        }
      }
    }

    return dr;
  }, [inventory]);

  // Handle HP change for power armor pieces
  const handleHpChange = (inventoryId: number, currentHp: number, maxHp: number, delta: number) => {
    if (!onPieceHpChange) return;
    const newHp = Math.max(0, Math.min(maxHp, currentHp + delta));
    onPieceHpChange(inventoryId, newHp);
  };

  const getLabel = (location: BodyLocation): string => {
    if (isMisterHandy) {
      return t(`bodyLocations.misterHandy.${location}`);
    }
    return t(`bodyLocations.${location}`);
  };

  // Render a single location box
  const LocationBox = ({ location }: { location: BodyLocation }) => {
    const data = locationDR[location];
    const hasValues = data.physical > 0 || data.energy > 0 || data.radiation > 0;
    const hasPowerArmor = data.paMaxHp !== undefined;
    const isDamaged = data.paDamaged;

    return (
      <div className={`bg-vault-gray border rounded-lg overflow-hidden ${
        isDamaged ? 'border-red-600 opacity-60' :
        hasValues ? 'border-vault-yellow-dark' : 'border-gray-700'
      }`}>
        {/* Header */}
        <div className={`px-2 py-1 text-center ${isDamaged ? 'bg-red-900' : 'bg-vault-blue'}`}>
          <span className={`text-xs font-bold uppercase ${isDamaged ? 'text-red-400' : 'text-vault-yellow'}`}>
            {getLabel(location)}
          </span>
          <span className={`text-xs ml-1 ${isDamaged ? 'text-red-600' : 'text-vault-yellow-dark'}`}>
            ({HIT_LOCATIONS[location]})
          </span>
        </div>

        {/* DR Grid */}
        <div className="p-2 grid grid-cols-2 gap-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">{t('bodyResistance.drPhysical')}</span>
            <span className={`font-mono font-bold ${
              isDamaged ? 'text-gray-600 line-through' :
              data.physical > 0 ? 'text-vault-yellow' : 'text-gray-600'
            }`}>
              {data.physical}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{t('bodyResistance.drRadiation')}</span>
            <span className={`font-mono font-bold ${
              isDamaged ? 'text-gray-600 line-through' :
              data.radiation > 0 ? 'text-yellow-400' : 'text-gray-600'
            }`}>
              {data.radiation}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{t('bodyResistance.drEnergy')}</span>
            <span className={`font-mono font-bold ${
              isDamaged ? 'text-gray-600 line-through' :
              data.energy > 0 ? 'text-blue-400' : 'text-gray-600'
            }`}>
              {data.energy}
            </span>
          </div>

          {/* Power Armor HP or Poison DR */}
          {hasPowerArmor ? (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{t('bodyResistance.hp')}</span>
              <span className={`font-mono font-bold ${
                isDamaged ? 'text-red-500' :
                (data.paCurrentHp ?? 0) < (data.paMaxHp ?? 0) ? 'text-orange-400' : 'text-green-400'
              }`}>
                {data.paCurrentHp ?? data.paMaxHp}/{data.paMaxHp}
              </span>
            </div>
          ) : showPoison ? (
            <div className="flex justify-between">
              <span className="text-gray-400">{t('bodyResistance.drPoison')}</span>
              <span className={`font-mono font-bold ${data.poison > 0 ? 'text-green-400' : 'text-gray-600'}`}>
                {data.poison}
              </span>
            </div>
          ) : (
            <div />
          )}
        </div>

        {/* Power Armor HP Controls */}
        {hasPowerArmor && onPieceHpChange && data.paInventoryId && (
          <div className="px-2 pb-2 flex items-center justify-center gap-1 border-t border-gray-700 pt-2">
            {isDamaged && (
              <AlertTriangle size={14} className="text-red-500 mr-1" />
            )}
            <button
              type="button"
              onClick={() => handleHpChange(data.paInventoryId!, data.paCurrentHp ?? data.paMaxHp!, data.paMaxHp!, -1)}
              disabled={data.paCurrentHp === 0}
              className="p-1 text-red-400 hover:bg-red-900/30 active:bg-red-900/50 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Minus size={14} />
            </button>
            <button
              type="button"
              onClick={() => handleHpChange(data.paInventoryId!, data.paCurrentHp ?? data.paMaxHp!, data.paMaxHp!, 1)}
              disabled={(data.paCurrentHp ?? data.paMaxHp) === data.paMaxHp}
              className="p-1 text-green-400 hover:bg-green-900/30 active:bg-green-900/50 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus size={14} />
            </button>
          </div>
        )}

        {/* Damaged indicator */}
        {isDamaged && (
          <div className="bg-red-900/50 px-2 py-1 text-center">
            <span className="text-red-400 text-xs font-bold uppercase">
              {t('bodyResistance.damaged')}
            </span>
          </div>
        )}
      </div>
    );
  };

  if (isMisterHandy) {
    return (
      <div className="space-y-3">
        {/* Optique - centered top */}
        <div className="flex justify-center">
          <div className="w-48">
            <LocationBox location="head" />
          </div>
        </div>

        {/* Bras 1 | Bras 2 */}
        <div className="grid grid-cols-2 gap-2">
          <LocationBox location="armLeft" />
          <LocationBox location="armRight" />
        </div>

        {/* Corps - centered */}
        <div className="flex justify-center">
          <div className="w-48">
            <LocationBox location="torso" />
          </div>
        </div>

        {/* Bras 3 | Propulseur */}
        <div className="grid grid-cols-2 gap-2">
          <LocationBox location="legLeft" />
          <LocationBox location="legRight" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Head - centered */}
      <div className="flex justify-center">
        <div className="w-32">
          <LocationBox location="head" />
        </div>
      </div>

      {/* Arms and Torso row */}
      <div className="grid grid-cols-3 gap-2">
        <LocationBox location="armLeft" />
        <LocationBox location="torso" />
        <LocationBox location="armRight" />
      </div>

      {/* Legs row */}
      <div className="grid grid-cols-3 gap-2">
        <LocationBox location="legLeft" />
        <div /> {/* Empty center */}
        <LocationBox location="legRight" />
      </div>
    </div>
  );
}
