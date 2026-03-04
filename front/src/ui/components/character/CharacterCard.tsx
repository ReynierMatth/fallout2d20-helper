import { Edit2, Copy, Trash2, Swords, Eye, Heart, Shield, Zap, Sparkles, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Character } from '../../../domain/models/character';
import { ORIGINS } from '../../../domain/rules/originRules';
import { SPECIAL_COLORS } from '../../../data/specialColors';
import { OriginIcon } from './OriginIcon';

const CREATURE_ATTR_COLORS: Record<string, string> = {
  body: 'var(--color-special-strength)',
  mind: 'var(--color-special-intelligence)',
};

interface CharacterCardProps {
  character: Character;
  onClick?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  selected?: boolean;
  compact?: boolean;
  className?: string;
}

export function CharacterCard({
  character,
  onClick,
  onEdit,
  onDuplicate,
  onDelete,
  selected = false,
  compact = false,
  className = '',
}: CharacterCardProps) {
  const { t } = useTranslation();

  const isCreature = character.statBlockType === 'creature';

  // Handle both Character types: domain/models has originId, data/characters has origin
  const charOriginId = character.originId ?? (character as any).origin;

  const origin = charOriginId
    ? ORIGINS.find((o) => o.id === charOriginId)
    : null;

  // Resolve name through i18n for creatures (name may be a translation key)
  const displayName = (() => {
    if (character.name) {
      const translated = t(character.name);
      if (translated !== character.name) return translated;
    }
    return character.name || t('characters.unnamed');
  })();

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`flex items-center gap-3 p-2 rounded border-2 transition-all ${
          selected
            ? 'border-vault-yellow bg-vault-blue'
            : 'border-vault-yellow-dark bg-vault-gray hover:bg-vault-blue/50'
        } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <OriginIcon originId={charOriginId} emoji={character.emoji} type={character.type} size="sm" className="flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-vault-yellow font-bold truncate block">
            {displayName}
          </span>
        </div>
        <span className="text-sm text-gray-400">
          {character.type} Lv.{character.level}
        </span>
        <span className="text-sm font-mono text-vault-yellow">
          HP {character.maxHp}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`bg-vault-gray border-2 rounded-lg overflow-hidden transition-all ${
        selected ? 'border-vault-yellow' : 'border-vault-yellow-dark'
      } ${onClick ? 'cursor-pointer hover:border-vault-yellow' : ''} ${className}`}
    >
      {/* Header */}
      <div
        onClick={onClick}
        className="bg-vault-blue px-3 py-2 flex items-center gap-2"
      >
        <OriginIcon originId={charOriginId} emoji={character.emoji} type={character.type} size="md" className="flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-vault-yellow font-bold text-sm truncate">
            {displayName}
          </h3>
          <p className="text-xs text-gray-300">
            {character.type === 'PC' ? t('characters.pc') : t('characters.npc')} Nv.{character.level}
            {origin && (
              <span className="ml-1 text-vault-yellow-dark">
                ({t(origin.nameKey)})
              </span>
            )}
          </p>
        </div>
        {onClick && (
          <Eye size={16} className="text-vault-yellow-dark flex-shrink-0" />
        )}
      </div>

      {/* Body */}
      <div className="px-3 py-2 space-y-2">
        {isCreature ? (
          <>
            {/* Creature attributes (Body / Mind) */}
            {character.creatureAttributes && (
              <div className="flex gap-3">
                {Object.entries(character.creatureAttributes).map(([key, val]) => {
                  const color = CREATURE_ATTR_COLORS[key] ?? '#4DBDB8';
                  return (
                    <div key={key} className="flex flex-col items-center min-w-[48px]" style={{ borderBottom: `2px solid ${color}` }}>
                      <span className="text-[10px] font-bold" style={{ color }}>{t(`bestiary.creatureAttributes.${key}`)}</span>
                      <span className="text-sm text-white font-mono font-bold">{val}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Creature combat stats */}
            <div className="grid grid-cols-2 gap-1.5 text-sm">
              <div className="flex items-center gap-1">
                <Heart size={12} style={{ color: 'var(--color-special-endurance)' }} />
                <span className="text-gray-400">{t('characters.hp')}:</span>
                <span className="text-white font-bold">{character.maxHp}</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield size={12} style={{ color: 'var(--color-special-agility)' }} />
                <span className="text-gray-400">{t('characters.defense')}:</span>
                <span className="text-white font-bold">{character.defense}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap size={12} style={{ color: 'var(--color-special-perception)' }} />
                <span className="text-gray-400">{t('characters.initiative')}:</span>
                <span className="text-white font-bold">{character.initiative}</span>
              </div>
              {character.meleeDamageBonus > 0 && (
                <div className="flex items-center gap-1">
                  <Swords size={12} style={{ color: 'var(--color-special-strength)' }} />
                  <span className="text-gray-400">{t('characters.meleeShort')}:</span>
                  <span className="text-white font-bold">+{character.meleeDamageBonus} CD</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* SPECIAL summary */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {(['S', 'P', 'E', 'C', 'I', 'A', 'L'] as const).map((letter, i) => {
                const attrs = [
                  'strength',
                  'perception',
                  'endurance',
                  'charisma',
                  'intelligence',
                  'agility',
                  'luck',
                ] as const;
                const attr = attrs[i];
                const value = character.special[attr];
                const color = SPECIAL_COLORS[attr];
                return (
                  <div key={letter} className="flex flex-col items-center" style={{ borderBottom: `2px solid ${color}` }}>
                    <span className="text-xs font-bold" style={{ color }}>{letter}</span>
                    <span className="text-sm text-white font-mono">{value}</span>
                  </div>
                );
              })}
            </div>

            {/* Combat Stats */}
            <div className="grid grid-cols-2 gap-1.5 text-sm">
              <div className="flex items-center gap-1">
                <Heart size={12} style={{ color: 'var(--color-special-endurance)' }} />
                <span className="text-gray-400">{t('characters.hp')}:</span>
                <span className="text-white font-bold">{character.maxHp}</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield size={12} style={{ color: 'var(--color-special-agility)' }} />
                <span className="text-gray-400">{t('characters.defense')}:</span>
                <span className="text-white font-bold">{character.defense}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap size={12} style={{ color: 'var(--color-special-perception)' }} />
                <span className="text-gray-400">{t('characters.initiative')}:</span>
                <span className="text-white font-bold">{character.initiative}</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles size={12} style={{ color: 'var(--color-special-luck)' }} />
                <span className="text-gray-400">{t('characters.luckPoints')}:</span>
                <span className="text-white font-bold">{character.maxLuckPoints}</span>
              </div>
              <div className="flex items-center gap-1">
                <Swords size={12} style={{ color: 'var(--color-special-strength)' }} />
                <span className="text-gray-400">{t('characters.meleeShort')}:</span>
                <span className="text-white font-bold">+{character.meleeDamageBonus} CD</span>
              </div>
            </div>

            {/* Tag Skills */}
            {character.tagSkills && character.tagSkills.length > 0 && (
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wide block mb-1">
                  {t('characters.tagSkills')}
                </span>
                <div className="flex flex-wrap gap-1">
                  {character.tagSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 bg-vault-yellow text-vault-blue text-xs font-bold rounded"
                    >
                      {t(`skills.${skill}`)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Actions */}
        {(onEdit || onDuplicate || onDelete) && (
          <div className="flex gap-2 pt-2 border-t border-gray-600">
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm text-vault-yellow hover:bg-vault-blue rounded transition-colors"
              >
                <Edit2 size={14} />
                {t('common.edit')}
              </button>
            )}
            {onDuplicate && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate();
                }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm text-vault-yellow hover:bg-vault-blue rounded transition-colors"
              >
                <Copy size={14} />
                {t('common.duplicate')}
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm text-red-400 hover:bg-red-900/30 rounded transition-colors"
              >
                <Trash2 size={14} />
                {t('common.delete')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
