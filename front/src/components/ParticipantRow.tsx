import { Skull, AlertCircle, LogOut, Eye, Minus, Plus, Trash2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { SessionParticipantApi, CombatantStatus } from '../services/api';
import { HPBar } from './HPBar';
import { OriginIcon } from './OriginIcon';

interface ParticipantRowProps {
  participant: SessionParticipantApi;
  isActive?: boolean;
  showCombatControls?: boolean;
  onDamage?: (amount: number) => void;
  onHeal?: (amount: number) => void;
  onRadiation?: (amount: number) => void;
  onLuckChange?: (amount: number) => void;
  onRemove?: () => void;
  onViewSheet?: () => void;
  onCombatStatusChange?: (status: CombatantStatus) => void;
  onInitiativeChange?: (value: number) => void;
  className?: string;
}

export function ParticipantRow({
  participant,
  isActive = false,
  showCombatControls = false,
  onDamage,
  onHeal,
  onRadiation,
  onLuckChange,
  onRemove,
  onViewSheet,
  onCombatStatusChange,
  onInitiativeChange,
  className = '',
}: ParticipantRowProps) {
  const { t } = useTranslation();

  const { character, combatStatus, turnOrder } = participant;

  const statusIcons: Record<CombatantStatus, React.ElementType | null> = {
    active: null,
    unconscious: AlertCircle,
    dead: Skull,
    fled: LogOut,
  };

  const statusColors: Record<CombatantStatus, string> = {
    active: '',
    unconscious: 'opacity-60',
    dead: 'opacity-40 grayscale',
    fled: 'opacity-50',
  };

  const StatusIcon = statusIcons[combatStatus];

  // SPECIAL letters
  const specialLetters = ['S', 'P', 'E', 'C', 'I', 'A', 'L'];
  const specialKeys = ['strength', 'perception', 'endurance', 'charisma', 'intelligence', 'agility', 'luck'];

  return (
    <div
      className={`bg-vault-gray border-2 rounded-lg overflow-hidden transition-all ${
        isActive
          ? 'border-vault-yellow shadow-lg shadow-vault-yellow/20'
          : 'border-vault-yellow-dark'
      } ${statusColors[combatStatus]} ${className}`}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 p-3">
        {/* Turn order (in combat) */}
        {showCombatControls && turnOrder !== null && (
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-vault-blue border border-vault-yellow-dark">
            <span className="text-vault-yellow font-bold text-sm">{turnOrder}</span>
          </div>
        )}

        {/* Icon with status indicator */}
        <div className="relative flex-shrink-0">
          <OriginIcon originId={character.originId} type={character.type} size="md" />
          {StatusIcon && (
            <StatusIcon
              size={14}
              className="absolute -top-1 -right-1 text-red-500"
            />
          )}
        </div>

        {/* Name and type */}
        <div className="flex-1 min-w-0">
          <h4 className="text-vault-yellow font-bold truncate">{character.name}</h4>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{character.type === 'pc' ? t('characters.pc') : t('characters.npc')}</span>
            <span>Nv. {character.level}</span>
            {character.conditions.length > 0 && (
              <span className="text-orange-400">
                {character.conditions.map((c) => t(`conditions.${c}`)).join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* SPECIAL mini summary */}
        <div className="hidden md:flex gap-1">
          {specialLetters.map((letter, i) => (
            <div key={letter} className="text-center w-5">
              <span className="text-[10px] text-vault-yellow-dark block">{letter}</span>
              <span className="text-xs text-white font-mono">{character.special?.[specialKeys[i]] ?? 5}</span>
            </div>
          ))}
        </div>

        {/* HP Bar */}
        <div className="w-28">
          <HPBar
            current={character.currentHp}
            max={character.maxHp}
            radiation={character.radiationDamage}
            size="sm"
          />
        </div>

        {/* Key stats */}
        <div className="flex gap-2 text-center">
          <div className="px-1">
            <span className="text-[10px] text-gray-400 block">{t('characters.defenseShort')}</span>
            <span className="text-vault-yellow font-bold text-sm">{character.defense}</span>
          </div>
          <div className="px-1">
            <span className="text-[10px] text-gray-400 block">Init</span>
            <span className="text-vault-yellow font-bold text-sm">{character.initiative}</span>
          </div>
          {/* Luck points for PCs */}
          {character.type === 'pc' && (
            <div className="px-1">
              <span className="text-[10px] text-purple-400 block flex items-center justify-center gap-0.5">
                <Sparkles size={8} />
              </span>
              <span className="text-purple-400 font-bold text-sm">
                {character.currentLuckPoints}/{character.maxLuckPoints}
              </span>
            </div>
          )}
        </div>

        {/* View sheet button */}
        {onViewSheet && (
          <button
            type="button"
            onClick={onViewSheet}
            className="p-2 text-vault-yellow-dark hover:text-vault-yellow active:text-vault-yellow transition-colors cursor-pointer"
            title={t('sessions.participants.viewSheet')}
          >
            <Eye size={20} />
          </button>
        )}
      </div>

      {/* Controls row - larger touch targets for tablet */}
      <div className="px-3 pb-3 flex flex-wrap items-center gap-3 border-t border-gray-700 pt-3">
        {/* HP Controls */}
        {(onDamage || onHeal) && combatStatus !== 'dead' && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 w-8">PV</span>
            <div className="flex rounded-lg overflow-hidden border border-gray-600">
              {onDamage && (
                <>
                  <button
                    type="button"
                    onClick={() => onDamage(5)}
                    className="px-3 py-2 text-sm font-bold text-red-400 bg-red-900/30 hover:bg-red-900/50 active:bg-red-900/70 border-r border-gray-600 cursor-pointer min-w-[44px]"
                  >
                    -5
                  </button>
                  <button
                    type="button"
                    onClick={() => onDamage(1)}
                    className="px-3 py-2 text-sm font-bold text-red-400 bg-red-900/30 hover:bg-red-900/50 active:bg-red-900/70 border-r border-gray-600 cursor-pointer min-w-[44px]"
                  >
                    -1
                  </button>
                </>
              )}
              {onHeal && (
                <>
                  <button
                    type="button"
                    onClick={() => onHeal(1)}
                    className="px-3 py-2 text-sm font-bold text-green-400 bg-green-900/30 hover:bg-green-900/50 active:bg-green-900/70 border-r border-gray-600 cursor-pointer min-w-[44px]"
                  >
                    +1
                  </button>
                  <button
                    type="button"
                    onClick={() => onHeal(5)}
                    className="px-3 py-2 text-sm font-bold text-green-400 bg-green-900/30 hover:bg-green-900/50 active:bg-green-900/70 cursor-pointer min-w-[44px]"
                  >
                    +5
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Radiation Controls */}
        {onRadiation && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-yellow-500 w-8">RAD</span>
            <div className="flex rounded-lg overflow-hidden border border-gray-600">
              <button
                type="button"
                onClick={() => onRadiation(-1)}
                disabled={character.radiationDamage <= 0}
                className="px-3 py-2 text-sm font-bold text-blue-400 bg-blue-900/30 hover:bg-blue-900/50 active:bg-blue-900/70 border-r border-gray-600 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed min-w-[44px]"
              >
                -1
              </button>
              <button
                type="button"
                onClick={() => onRadiation(1)}
                disabled={character.radiationDamage >= character.maxHp - 1}
                className="px-3 py-2 text-sm font-bold text-yellow-400 bg-yellow-900/30 hover:bg-yellow-900/50 active:bg-yellow-900/70 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed min-w-[44px]"
              >
                +1
              </button>
            </div>
            <span className="text-sm text-yellow-400 font-mono">{character.radiationDamage}</span>
          </div>
        )}

        {/* Luck points for PCs */}
        {character.type === 'pc' && onLuckChange && (
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-purple-400" />
            <div className="flex rounded-lg overflow-hidden border border-gray-600">
              <button
                type="button"
                onClick={() => onLuckChange(-1)}
                disabled={character.currentLuckPoints <= 0}
                className="px-3 py-2 text-sm font-bold text-purple-400 bg-purple-900/30 hover:bg-purple-900/50 active:bg-purple-900/70 border-r border-gray-600 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed min-w-[44px]"
              >
                -1
              </button>
              <button
                type="button"
                onClick={() => onLuckChange(1)}
                disabled={character.currentLuckPoints >= character.maxLuckPoints}
                className="px-3 py-2 text-sm font-bold text-purple-400 bg-purple-900/30 hover:bg-purple-900/50 active:bg-purple-900/70 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed min-w-[44px]"
              >
                +1
              </button>
            </div>
          </div>
        )}

        {/* Combat Status buttons (in combat) */}
        {showCombatControls && onCombatStatusChange && (
          <div className="flex items-center gap-1 ml-auto flex-wrap">
            {(['active', 'unconscious', 'dead', 'fled'] as CombatantStatus[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onCombatStatusChange(status)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                  combatStatus === status
                    ? 'bg-vault-yellow text-vault-blue font-bold'
                    : 'bg-vault-blue border border-vault-yellow-dark text-vault-yellow-dark hover:text-vault-yellow hover:border-vault-yellow'
                }`}
              >
                {t(`sessions.combat.combatStatus.${status}`)}
              </button>
            ))}
          </div>
        )}

        {/* Remove button */}
        {onRemove && !showCombatControls && (
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 border border-red-900 hover:bg-red-900/30 active:bg-red-900/50 rounded-lg transition-colors ml-auto cursor-pointer"
          >
            <Trash2 size={16} />
            {t('common.remove')}
          </button>
        )}
      </div>
    </div>
  );
}
