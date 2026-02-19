import { useTranslation } from 'react-i18next';
import type { SpecialAttribute } from '../data/characters';
import { SPECIAL_ATTRIBUTES } from '../data/characters';

interface StickyCharacterHeaderProps {
  name: string;
  special: Record<SpecialAttribute, number>;
}

const SPECIAL_SHORT: Record<SpecialAttribute, string> = {
  strength: 'S',
  perception: 'P',
  endurance: 'E',
  charisma: 'C',
  intelligence: 'I',
  agility: 'A',
  luck: 'L',
};

export function StickyCharacterHeader({ name, special }: StickyCharacterHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-10 bg-vault-gray/95 backdrop-blur-sm border-b border-vault-yellow-dark px-3 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-1">
        {/* Character name */}
        <span className="text-vault-yellow font-bold truncate text-sm md:text-base">
          {name || t('characters.newCharacter')}
        </span>

        {/* SPECIAL pills */}
        <div className="flex gap-1 flex-wrap">
          {SPECIAL_ATTRIBUTES.map((attr) => (
            <span
              key={attr}
              className="text-xs px-1.5 py-0.5 rounded bg-vault-blue border border-vault-yellow-dark/50 text-vault-yellow font-mono"
              title={t(`special.${attr}`)}
            >
              {SPECIAL_SHORT[attr]}:{special[attr]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
