import { User, Bot, Skull, AlertCircle, Minus, Plus, Swords } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Combatant } from '../../../domain/models/character';
import { HPBar } from '../character/HPBar';
import { APTracker } from './APTracker';

interface CombatantRowProps {
  combatant: Combatant;
  isActive: boolean;
  onDamage?: (amount: number) => void;
  onHeal?: (amount: number) => void;
  onSpendAP?: (amount: number) => void;
  onResetAP?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function CombatantRow({
  combatant,
  isActive,
  onDamage,
  onHeal,
  onSpendAP,
  onResetAP,
  onRemove,
  className = '',
}: CombatantRowProps) {
  const { t } = useTranslation();

  const Icon = combatant.type === 'PC' ? User : Bot;
  const StatusIcon = combatant.status === 'dead' ? Skull :
                     combatant.status === 'unconscious' ? AlertCircle : null;

  const statusColors: Record<string, string> = {
    active: '',
    unconscious: 'opacity-60',
    dead: 'opacity-40 grayscale',
    fled: 'opacity-40',
  };

  return (
    <div
      className={`flex items-center gap-4 p-3 rounded-lg border-2 transition-all ${
        isActive
          ? 'border-vault-yellow bg-vault-blue'
          : 'border-vault-yellow-dark bg-vault-gray'
      } ${statusColors[combatant.status]} ${className}`}
    >
      {/* Turn order & Icon */}
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-vault-blue border border-vault-yellow-dark text-vault-yellow font-bold">
          {combatant.turnOrder}
        </span>
        <div className="relative">
          <Icon size={24} className="text-vault-yellow" />
          {StatusIcon && (
            <StatusIcon
              size={14}
              className="absolute -top-1 -right-1 text-red-500"
            />
          )}
        </div>
      </div>

      {/* Name & Type */}
      <div className="flex-1 min-w-0">
        <h4 className="text-vault-yellow font-bold truncate">{combatant.name}</h4>
        <p className="text-xs text-gray-400">
          {combatant.type === 'PC' ? t('characters.pc') : t('characters.npc')}
          {combatant.conditions.length > 0 && (
            <span className="ml-2 text-orange-400">
              {combatant.conditions.map((c) => t(`conditions.${c}`)).join(', ')}
            </span>
          )}
        </p>
      </div>

      {/* HP */}
      <div className="w-40">
        <HPBar
          current={combatant.currentHp}
          max={combatant.maxHp}
          size="sm"
        />
        {(onDamage || onHeal) && combatant.status !== 'dead' && (
          <div className="flex gap-1 mt-1">
            {onDamage && (
              <button
                type="button"
                onClick={() => onDamage(1)}
                className="flex-1 flex items-center justify-center gap-1 py-0.5 text-xs text-red-400 hover:bg-red-900/30 rounded"
              >
                <Minus size={12} />
                1
              </button>
            )}
            {onHeal && (
              <button
                type="button"
                onClick={() => onHeal(1)}
                className="flex-1 flex items-center justify-center gap-1 py-0.5 text-xs text-green-400 hover:bg-green-900/30 rounded"
              >
                <Plus size={12} />
                1
              </button>
            )}
          </div>
        )}
      </div>

      {/* AP (only show for active combatant in active combat) */}
      {isActive && combatant.status === 'active' && (
        <APTracker
          current={combatant.currentAP}
          max={combatant.maxAP}
          onSpend={onSpendAP}
          onReset={onResetAP}
          interactive
        />
      )}

      {/* Defense */}
      <div className="text-center">
        <span className="text-xs text-gray-400 block">{t('characters.defense')}</span>
        <span className="text-vault-yellow font-bold">{combatant.defense}</span>
      </div>

      {/* Melee Damage Bonus */}
      {combatant.meleeDamageBonus > 0 && (
        <div className="text-center" title={t('characters.meleeDamageBonus')}>
          <Swords size={14} className="text-gray-400 mx-auto" />
          <span className="text-vault-yellow font-bold text-sm">+{combatant.meleeDamageBonus}</span>
        </div>
      )}

      {/* Remove button */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
          title={t('common.remove')}
        >
          <Skull size={18} />
        </button>
      )}
    </div>
  );
}
