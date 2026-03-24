import { useState, useMemo } from 'react';
import { X, Search, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCharactersApi } from '../../../hooks/useCharactersApi';
import { OriginIcon } from '../character/OriginIcon';

interface CharacterPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (characterId: string) => void;
  title?: string;
}

export function CharacterPickerModal({
  isOpen,
  onClose,
  onSelect,
  title,
}: CharacterPickerModalProps) {
  const { t } = useTranslation();
  const { characters, loading } = useCharactersApi();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCharacters = useMemo(() => {
    if (!searchTerm.trim()) return characters;
    const lower = searchTerm.toLowerCase();
    return characters.filter((c) => {
      const translated = t(c.name);
      return c.name.toLowerCase().includes(lower) || translated.toLowerCase().includes(lower);
    });
  }, [characters, searchTerm, t]);

  const handleSelect = (id: string) => {
    onSelect(id);
    setSearchTerm('');
    onClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-vault-gray border-2 border-vault-yellow rounded-lg w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-vault-yellow-dark">
          <h2 className="text-lg font-bold text-vault-yellow">
            {title ?? t('inventory.pickCharacter')}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-vault-yellow-dark">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('sessions.participants.searchCharacter')}
              className="w-full pl-11 pr-4 py-3 bg-vault-blue border border-vault-yellow-dark rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-vault-yellow text-base"
            />
          </div>
        </div>

        {/* Characters list */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center text-gray-400 py-8">{t('common.loading')}</div>
          ) : filteredCharacters.length === 0 ? (
            <div className="text-center text-gray-400 py-8">{t('common.noResults')}</div>
          ) : (
            <div className="space-y-2">
              {filteredCharacters.map((character) => (
                <button
                  key={character.id}
                  type="button"
                  onClick={() => handleSelect(character.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border-2 bg-vault-blue border-vault-yellow-dark hover:border-vault-yellow transition-colors text-left cursor-pointer"
                >
                  <OriginIcon originId={character.origin} emoji={character.emoji} type={character.type} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-vault-yellow font-medium truncate text-base">
                      {(() => { const tr = t(character.name); return tr !== character.name ? tr : character.name; })()}
                    </div>
                    <div className="text-sm text-gray-400">
                      {character.type === 'PC' ? t('characters.pc') : t('characters.npc')} · Nv. {character.level}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
