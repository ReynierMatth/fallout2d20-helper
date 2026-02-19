import { useState, useMemo } from 'react';
import { X, Search, UserPlus, Zap, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AddQuickNpcData } from '../../../services/api';
import { useCharactersApi } from '../../../hooks/useCharactersApi';
import { Button } from '../../../components/Button';
import { OriginIcon } from '../character/OriginIcon';

interface AddParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentParticipantIds: number[];
  onAddParticipants: (characterIds: number[]) => Promise<void>;
  onAddQuickNpc?: (data: AddQuickNpcData) => Promise<void>;
  filterType: 'pc' | 'npc';
}

export function AddParticipantsModal({
  isOpen,
  onClose,
  currentParticipantIds,
  onAddParticipants,
  onAddQuickNpc,
  filterType,
}: AddParticipantsModalProps) {
  const { t } = useTranslation();
  const { characters, loading, refetch } = useCharactersApi();

  const [activeTab, setActiveTab] = useState<'existing' | 'quick'>('existing');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // Quick NPC form state
  const [npcName, setNpcName] = useState('');
  const [npcLevel, setNpcLevel] = useState(1);
  const [npcHp, setNpcHp] = useState(10);
  const [npcDefense, setNpcDefense] = useState(1);
  const [npcInitiative, setNpcInitiative] = useState(6);

  const showQuickNpc = filterType === 'npc' && !!onAddQuickNpc;

  // Filter available characters
  const availableCharacters = useMemo(() => {
    return characters.filter((c) => {
      if (currentParticipantIds.includes(Number(c.id))) return false;
      if (filterType === 'pc') return c.type === 'PC';
      if (filterType === 'npc') return c.type === 'NPC';
      return true;
    });
  }, [characters, currentParticipantIds, filterType]);

  // Filter by search term
  const filteredCharacters = useMemo(() => {
    return availableCharacters.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableCharacters, searchTerm]);

  const toggleSelection = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAddSelected = async () => {
    if (selectedIds.length === 0) return;
    setIsAdding(true);
    try {
      await onAddParticipants(selectedIds);
      setSelectedIds([]);
      onClose();
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddQuickNpc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!npcName.trim() || !onAddQuickNpc) return;

    setIsAdding(true);
    try {
      await onAddQuickNpc({
        name: npcName.trim(),
        level: npcLevel,
        maxHp: npcHp,
        defense: npcDefense,
        initiative: npcInitiative,
      });
      await refetch();
      // Reset form
      setNpcName('');
      setNpcLevel(1);
      setNpcHp(10);
      setNpcDefense(1);
      setNpcInitiative(6);
      onClose();
    } finally {
      setIsAdding(false);
    }
  };

  const handleClose = () => {
    setSelectedIds([]);
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
            {filterType === 'pc' ? t('sessions.participants.addPCs') : t('sessions.participants.addNPCs')}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs (only for NPCs) */}
        {showQuickNpc && (
          <div className="flex border-b border-vault-yellow-dark">
            <button
              type="button"
              onClick={() => setActiveTab('existing')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'existing'
                  ? 'bg-vault-blue text-vault-yellow'
                  : 'text-vault-yellow-dark hover:text-vault-yellow'
              }`}
            >
              <UserPlus size={18} />
              {t('sessions.participants.addFromCharacters')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quick')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'quick'
                  ? 'bg-vault-blue text-vault-yellow'
                  : 'text-vault-yellow-dark hover:text-vault-yellow'
              }`}
            >
              <Zap size={18} />
              {t('sessions.participants.addQuickNpc')}
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {(activeTab === 'existing' || !showQuickNpc) ? (
            <>
              {/* Search */}
              <div className="p-4 border-b border-vault-yellow-dark">
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
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
                  <div className="text-center text-gray-400 py-8">
                    {t('common.loading')}
                  </div>
                ) : filteredCharacters.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    {availableCharacters.length === 0
                      ? t('sessions.participants.allCharactersAdded')
                      : t('common.noResults')}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredCharacters.map((character) => {
                      const isSelected = selectedIds.includes(Number(character.id));
                      return (
                        <button
                          key={character.id}
                          type="button"
                          onClick={() => toggleSelection(Number(character.id))}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors text-left cursor-pointer ${
                            isSelected
                              ? 'bg-vault-yellow/20 border-vault-yellow'
                              : 'bg-vault-blue border-vault-yellow-dark hover:border-vault-yellow'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? 'bg-vault-yellow border-vault-yellow'
                              : 'border-vault-yellow-dark'
                          }`}>
                            {isSelected && <Check size={16} className="text-vault-blue" />}
                          </div>
                          <OriginIcon originId={character.origin} type={character.type} size="sm" />
                          <div className="flex-1 min-w-0">
                            <div className="text-vault-yellow font-medium truncate text-base">
                              {character.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              Nv. {character.level} - {character.currentHp}/{character.maxHp} PV
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer with add button */}
              <div className="p-4 border-t border-vault-yellow-dark">
                <Button
                  onClick={handleAddSelected}
                  disabled={selectedIds.length === 0 || isAdding}
                  className="w-full py-3 text-base"
                >
                  {isAdding
                    ? t('common.loading')
                    : t('sessions.participants.addSelected', { count: selectedIds.length })}
                </Button>
              </div>
            </>
          ) : (
            /* Quick NPC Form */
            <form onSubmit={handleAddQuickNpc} className="p-4 space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="npc-name" className="block text-sm font-medium text-vault-yellow mb-2">
                  {t('sessions.participants.npcName')} *
                </label>
                <input
                  id="npc-name"
                  type="text"
                  value={npcName}
                  onChange={(e) => setNpcName(e.target.value)}
                  placeholder="Raider, Super Mutant..."
                  className="w-full px-4 py-3 bg-vault-blue border border-vault-yellow-dark rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-vault-yellow text-base"
                  required
                />
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="npc-level" className="block text-sm font-medium text-vault-yellow mb-2">
                    {t('sessions.participants.npcLevel')}
                  </label>
                  <input
                    id="npc-level"
                    type="number"
                    value={npcLevel}
                    onChange={(e) => setNpcLevel(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    className="w-full px-4 py-3 bg-vault-blue border border-vault-yellow-dark rounded-lg text-white focus:outline-none focus:border-vault-yellow text-base"
                  />
                </div>
                <div>
                  <label htmlFor="npc-hp" className="block text-sm font-medium text-vault-yellow mb-2">
                    {t('sessions.participants.npcHp')}
                  </label>
                  <input
                    id="npc-hp"
                    type="number"
                    value={npcHp}
                    onChange={(e) => setNpcHp(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    className="w-full px-4 py-3 bg-vault-blue border border-vault-yellow-dark rounded-lg text-white focus:outline-none focus:border-vault-yellow text-base"
                  />
                </div>
                <div>
                  <label htmlFor="npc-defense" className="block text-sm font-medium text-vault-yellow mb-2">
                    {t('sessions.participants.npcDefense')}
                  </label>
                  <input
                    id="npc-defense"
                    type="number"
                    value={npcDefense}
                    onChange={(e) => setNpcDefense(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    className="w-full px-4 py-3 bg-vault-blue border border-vault-yellow-dark rounded-lg text-white focus:outline-none focus:border-vault-yellow text-base"
                  />
                </div>
                <div>
                  <label htmlFor="npc-init" className="block text-sm font-medium text-vault-yellow mb-2">
                    {t('sessions.participants.npcInitiative')}
                  </label>
                  <input
                    id="npc-init"
                    type="number"
                    value={npcInitiative}
                    onChange={(e) => setNpcInitiative(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    className="w-full px-4 py-3 bg-vault-blue border border-vault-yellow-dark rounded-lg text-white focus:outline-none focus:border-vault-yellow text-base"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full py-3 text-base" disabled={isAdding || !npcName.trim()}>
                {isAdding ? t('common.loading') : t('sessions.participants.addQuickNpc')}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
