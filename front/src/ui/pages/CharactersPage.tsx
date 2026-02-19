import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, UserPlus, Bot, Search, Loader2 } from 'lucide-react';
import { Card, Button, CharacterCard, CharacterForm } from '../../components';
import { useCharactersApi } from '../../hooks/useCharactersApi';
import type { Character } from '../../data/characters';

type FilterType = 'all' | 'PC' | 'NPC';

export function CharactersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    characters,
    pcs,
    npcs,
    loading,
    error,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    duplicateCharacter,
  } = useCharactersApi();

  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | undefined>();
  const [defaultType, setDefaultType] = useState<'PC' | 'NPC'>('PC');

  // Filtered characters
  const filteredCharacters = (() => {
    let list = characters;

    // Filter by type
    if (filter === 'PC') list = pcs;
    else if (filter === 'NPC') list = npcs;

    // Filter by search
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(searchLower));
    }

    // Sort by name
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  })();

  const handleCreatePC = () => {
    setEditingCharacter(undefined);
    setDefaultType('PC');
    setIsFormOpen(true);
  };

  const handleCreateNPC = () => {
    setEditingCharacter(undefined);
    setDefaultType('NPC');
    setIsFormOpen(true);
  };

  const handleEdit = (character: Character) => {
    setEditingCharacter(character);
    setDefaultType(character.type);
    setIsFormOpen(true);
  };

  const handleSave = async (characterData: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingCharacter) {
        await updateCharacter(editingCharacter.id, characterData);
      } else {
        await addCharacter(characterData);
      }
    } catch (err) {
      console.error('Failed to save character:', err);
    }
  };

  const handleDelete = async (character: Character) => {
    if (window.confirm(t('characters.confirmDelete', { name: character.name }))) {
      try {
        await deleteCharacter(character.id);
      } catch (err) {
        console.error('Failed to delete character:', err);
      }
    }
  };

  const handleDuplicate = async (character: Character) => {
    try {
      await duplicateCharacter(character.id);
    } catch (err) {
      console.error('Failed to duplicate character:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card title={t('characters.title')} icon={<Users />}>
        <div className="space-y-4">
          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCreatePC}>
              <UserPlus size={18} className="mr-2" />
              {t('characters.createPC')}
            </Button>
            <Button onClick={handleCreateNPC} variant="secondary">
              <Bot size={18} className="mr-2" />
              {t('characters.createNPC')}
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Type filter */}
            <div className="flex rounded overflow-hidden border border-vault-yellow-dark">
              {(['all', 'PC', 'NPC'] as FilterType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 text-sm font-bold uppercase transition-colors ${
                    filter === type
                      ? 'bg-vault-yellow text-vault-blue'
                      : 'bg-vault-gray text-vault-yellow hover:bg-vault-blue'
                  }`}
                >
                  {type === 'all' ? t('common.all') : t(`characters.${type.toLowerCase()}`)}
                  <span className="ml-2 text-xs">
                    ({type === 'all' ? characters.length : type === 'PC' ? pcs.length : npcs.length})
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('characters.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-vault-yellow-dark rounded text-white"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="animate-spin text-vault-yellow" />
          <span className="ml-3 text-gray-400">{t('common.loading')}</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-8 text-red-400 bg-red-900/20 rounded border border-red-600">
          {t('common.error')}: {error}
        </div>
      )}

      {/* Character list */}
      {!loading && !error && filteredCharacters.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {search ? t('characters.noResults') : t('characters.noCharacters')}
        </div>
      ) : !loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onClick={() => navigate(`/characters/${character.id}`, { state: { from: '/characters' } })}
              onEdit={() => handleEdit(character)}
              onDuplicate={() => handleDuplicate(character)}
              onDelete={() => handleDelete(character)}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <CharacterForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        character={editingCharacter}
        onSave={handleSave}
        defaultType={defaultType}
      />
    </div>
  );
}
