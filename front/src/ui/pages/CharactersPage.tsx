import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, UserPlus, Bot, Search, Upload } from 'lucide-react';
import { CharacterListSkeleton } from '../components/shared/Skeleton';
import { Card, Button, CharacterCard, CharacterForm } from '../../components';
import { ConfirmModal } from '../components/ConfirmModal';
import { useCharactersApi } from '../../hooks/useCharactersApi';
import type { ImportWarning } from '../../services/api';
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
    exportCharacter,
    importCharacter,
  } = useCharactersApi();

  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | undefined>();
  const [defaultType, setDefaultType] = useState<'PC' | 'NPC'>('PC');
  const [deleteTarget, setDeleteTarget] = useState<Character | null>(null);
  const [importFeedback, setImportFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
    warnings?: ImportWarning[];
  } | null>(null);

  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

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

  const handleDelete = (character: Character) => {
    setDeleteTarget(character);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCharacter(deleteTarget.id);
    } catch (err) {
      console.error('Failed to delete character:', err);
    }
    setDeleteTarget(null);
  };

  const handleDuplicate = async (character: Character) => {
    try {
      await duplicateCharacter(character.id);
    } catch (err) {
      console.error('Failed to duplicate character:', err);
    }
  };

  const handleExport = async (character: Character) => {
    try {
      await exportCharacter(character);
    } catch (err) {
      console.error('Failed to export character:', err);
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = setTimeout(() => setImportFeedback(null), 6000);
      setImportFeedback({ type: 'error', message: 'characters.exportError' });
    }
  };

  const handleImportChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    try {
      const result = await importCharacter(file);
      setImportFeedback({
        type: 'success',
        message: 'characters.importSuccess',
        warnings: result.warnings.length > 0 ? result.warnings : undefined,
      });
    } catch (err) {
      setImportFeedback({ type: 'error', message: 'characters.importError' });
    }
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => setImportFeedback(null), 6000);
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
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportChange}
              />
              <span className="inline-flex items-center px-4 py-2 text-sm font-bold uppercase border-2 border-vault-yellow text-vault-yellow hover:bg-vault-blue transition-colors rounded cursor-pointer">
                <Upload size={18} className="mr-2" />
                {t('characters.import')}
              </span>
            </label>
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

      {/* Import feedback */}
      {importFeedback && (
        <div className={`text-center py-3 px-4 rounded border ${
          importFeedback.type === 'success'
            ? 'text-green-400 bg-green-900/20 border-green-600'
            : 'text-red-400 bg-red-900/20 border-red-600'
        }`}>
          <p>{t(importFeedback.message)}</p>
          {importFeedback.warnings && importFeedback.warnings.length > 0 && (
            <p className="text-yellow-400 text-sm mt-1">
              {t('characters.importMissingItems', { items: importFeedback.warnings.map(w => w.itemName).join(', ') })}
            </p>
          )}
        </div>
      )}

      {/* Loading state */}
      {loading && <CharacterListSkeleton />}

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onClick={() => navigate(`/characters/${character.id}`, { state: { from: '/characters' } })}
              onEdit={() => handleEdit(character)}
              onDuplicate={() => handleDuplicate(character)}
              onExport={() => handleExport(character)}
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

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={t('common.confirmDelete')}
        description={t('characters.confirmDelete', { name: deleteTarget?.name ?? '' })}
        confirmLabel={t('common.delete')}
        variant="danger"
      />
    </div>
  );
}
