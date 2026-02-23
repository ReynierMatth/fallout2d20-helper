import { Edit2, Copy, Trash2, Swords, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Character } from '../data/characters';
import { ORIGINS } from '../data/characters';
import { OriginIcon } from './OriginIcon';

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

  const origin = character.origin
    ? ORIGINS.find((o) => o.id === character.origin)
    : null;

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
        <OriginIcon originId={character.origin} type={character.type} size="sm" className="flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-vault-yellow font-bold truncate block">
            {character.name || t('characters.unnamed')}
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
        className="bg-vault-blue px-4 py-3 flex items-center gap-3"
      >
        <OriginIcon originId={character.origin} type={character.type} size="lg" className="flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-vault-yellow font-bold text-lg truncate">
            {character.name || t('characters.unnamed')}
          </h3>
          <p className="text-sm text-gray-300">
            {character.type === 'PC' ? t('characters.pc') : t('characters.npc')} -{' '}
            {t('characters.level')} {character.level}
            {origin && (
              <span className="ml-2 text-vault-yellow-dark">
                ({t(origin.nameKey)})
              </span>
            )}
          </p>
        </div>
        {onClick && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="flex-shrink-0 p-1.5 rounded-full bg-vault-yellow/10 text-vault-yellow hover:bg-vault-yellow hover:text-vault-blue transition-colors cursor-pointer"
          >
            <Eye size={16} />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
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
            const value = character.special[attrs[i]];
            return (
              <div key={letter} className="flex flex-col items-center">
                <span className="text-xs text-vault-yellow font-bold">{letter}</span>
                <span className="text-sm text-white font-mono">{value}</span>
              </div>
            );
          })}
        </div>

        {/* Combat Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-400">{t('characters.hp')}:</span>
            <span className="text-white font-bold">{character.maxHp}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">{t('characters.defense')}:</span>
            <span className="text-white font-bold">{character.defense}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">{t('characters.initiative')}:</span>
            <span className="text-white font-bold">{character.initiative}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">{t('characters.luckPoints')}:</span>
            <span className="text-white font-bold">{character.maxLuckPoints}</span>
          </div>
          <div className="flex items-center gap-1">
            <Swords size={12} className="text-gray-400" />
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
