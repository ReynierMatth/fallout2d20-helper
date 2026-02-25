import { useTranslation } from 'react-i18next';
import type { SpecialAttribute } from '../data/characters';
import { SPECIAL_ATTRIBUTES } from '../data/characters';
import { SPECIAL_COLORS } from '../data/specialColors';

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
              className="text-xs px-1.5 py-0.5 rounded font-mono font-bold border"
              title={t(`special.${attr}`)}
              style={{
                color: SPECIAL_COLORS[attr],
                borderColor: `${SPECIAL_COLORS[attr]}55`,
                backgroundColor: `${SPECIAL_COLORS[attr]}18`,
              }}
            >
              {SPECIAL_SHORT[attr]}:{special[attr]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
