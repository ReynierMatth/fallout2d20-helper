import { useState } from 'react';
import { UserPlus, Zap, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AddQuickNpcData } from '../services/api';
import { useCharactersApi } from '../hooks/useCharactersApi';
import { Button } from './Button';
import { OriginIcon } from './OriginIcon';

interface AddParticipantSectionProps {
  currentParticipantIds: number[];
  onAddParticipant: (characterId: number) => Promise<void>;
  onAddQuickNpc?: (data: AddQuickNpcData) => Promise<void>;
  filterType?: 'pc' | 'npc' | 'all';
}

export function AddParticipantSection({
  currentParticipantIds,
  onAddParticipant,
  onAddQuickNpc,
  filterType = 'all',
}: AddParticipantSectionProps) {
  const { t } = useTranslation();
  const { characters, loading, refetch } = useCharactersApi();

  const [activeTab, setActiveTab] = useState<'existing' | 'quick'>('existing');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Quick NPC form state
  const [npcName, setNpcName] = useState('');
  const [npcLevel, setNpcLevel] = useState(1);
  const [npcHp, setNpcHp] = useState(10);
  const [npcDefense, setNpcDefense] = useState(1);
  const [npcInitiative, setNpcInitiative] = useState(6);

  // Show quick NPC tab only if handler is provided
  const showQuickNpc = !!onAddQuickNpc;

  // Filter available characters (not already in session)
  // Note: character.id is string, currentParticipantIds are numbers
  const availableCharacters = characters.filter((c) => {
    // Exclude those already in session
    if (currentParticipantIds.includes(Number(c.id))) return false;
    // Filter by type if specified
    if (filterType === 'pc') return c.type === 'PC';
    if (filterType === 'npc') return c.type === 'NPC';
    return true;
  });

  // Filter by search term
  const filteredCharacters = availableCharacters.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCharacter = async (characterId: number) => {
    setIsAdding(true);
    try {
      await onAddParticipant(characterId);
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddQuickNpc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!npcName.trim()) return;

    setIsAdding(true);
    try {
      await onAddQuickNpc!({
        name: npcName.trim(),
        level: npcLevel,
        maxHp: npcHp,
        defense: npcDefense,
        initiative: npcInitiative,
      });
      // Refresh character list to include the new NPC
      await refetch();
      // Reset form
      setNpcName('');
      setNpcLevel(1);
      setNpcHp(10);
      setNpcDefense(1);
      setNpcInitiative(6);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div>
      {/* Tabs - only show if quick NPC is available */}
      {showQuickNpc && (
        <div className="flex border-b border-vault-yellow-dark">
          <button
            type="button"
            onClick={() => setActiveTab('existing')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'existing'
                ? 'bg-vault-blue text-vault-yellow'
                : 'text-vault-yellow-dark hover:text-vault-yellow hover:bg-vault-blue/50'
            }`}
          >
            <UserPlus size={16} />
            {t('sessions.participants.addFromCharacters')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'quick'
                ? 'bg-vault-blue text-vault-yellow'
                : 'text-vault-yellow-dark hover:text-vault-yellow hover:bg-vault-blue/50'
            }`}
          >
            <Zap size={16} />
            {t('sessions.participants.addQuickNpc')}
          </button>
        </div>
      )}

      {/* Content */}
      <div className="p-3">
        {(activeTab === 'existing' || !showQuickNpc) ? (
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('sessions.participants.selectCharacter')}
                className="w-full pl-10 pr-3 py-2 bg-vault-gray border border-vault-yellow-dark rounded text-white placeholder-gray-500 focus:outline-none focus:border-vault-yellow"
              />
            </div>

            {/* Characters list */}
            <div className="max-h-48 overflow-y-auto space-y-1.5">
              {loading ? (
                <div className="text-center text-gray-400 py-4">
                  {t('common.loading')}
                </div>
              ) : filteredCharacters.length === 0 ? (
                <div className="text-center text-gray-400 py-4">
                  {availableCharacters.length === 0
                    ? t('sessions.participants.characterAlreadyInSession')
                    : t('common.noResults')}
                </div>
              ) : (
                filteredCharacters.map((character) => (
                  <button
                    key={character.id}
                    type="button"
                    onClick={() => handleAddCharacter(Number(character.id))}
                    disabled={isAdding}
                    className="w-full flex items-center gap-3 p-2 bg-vault-gray border border-vault-yellow-dark rounded hover:border-vault-yellow transition-colors text-left disabled:opacity-50"
                  >
                    <OriginIcon originId={character.origin} type={character.type} size="sm" className="flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-vault-yellow font-medium truncate">
                        {character.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {character.type === 'PC' ? t('characters.pc') : t('characters.npc')} - Nv. {character.level}
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      {character.currentHp}/{character.maxHp} PV
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleAddQuickNpc} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="npc-name" className="block text-sm font-medium text-vault-yellow mb-1">
                {t('sessions.participants.npcName')} *
              </label>
              <input
                id="npc-name"
                type="text"
                value={npcName}
                onChange={(e) => setNpcName(e.target.value)}
                placeholder="Raider, Super Mutant..."
                className="w-full px-3 py-2 bg-vault-gray border border-vault-yellow-dark rounded text-white placeholder-gray-500 focus:outline-none focus:border-vault-yellow"
                required
              />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="npc-level" className="block text-sm font-medium text-vault-yellow mb-1">
                  {t('sessions.participants.npcLevel')}
                </label>
                <input
                  id="npc-level"
                  type="number"
                  value={npcLevel}
                  onChange={(e) => setNpcLevel(Math.max(1, parseInt(e.target.value) || 1))}
                  min={1}
                  className="w-full px-3 py-2 bg-vault-gray border border-vault-yellow-dark rounded text-white focus:outline-none focus:border-vault-yellow"
                />
              </div>
              <div>
                <label htmlFor="npc-hp" className="block text-sm font-medium text-vault-yellow mb-1">
                  {t('sessions.participants.npcHp')}
                </label>
                <input
                  id="npc-hp"
                  type="number"
                  value={npcHp}
                  onChange={(e) => setNpcHp(Math.max(1, parseInt(e.target.value) || 1))}
                  min={1}
                  className="w-full px-3 py-2 bg-vault-gray border border-vault-yellow-dark rounded text-white focus:outline-none focus:border-vault-yellow"
                />
              </div>
              <div>
                <label htmlFor="npc-defense" className="block text-sm font-medium text-vault-yellow mb-1">
                  {t('sessions.participants.npcDefense')}
                </label>
                <input
                  id="npc-defense"
                  type="number"
                  value={npcDefense}
                  onChange={(e) => setNpcDefense(Math.max(1, parseInt(e.target.value) || 1))}
                  min={1}
                  className="w-full px-3 py-2 bg-vault-gray border border-vault-yellow-dark rounded text-white focus:outline-none focus:border-vault-yellow"
                />
              </div>
              <div>
                <label htmlFor="npc-init" className="block text-sm font-medium text-vault-yellow mb-1">
                  {t('sessions.participants.npcInitiative')}
                </label>
                <input
                  id="npc-init"
                  type="number"
                  value={npcInitiative}
                  onChange={(e) => setNpcInitiative(Math.max(1, parseInt(e.target.value) || 1))}
                  min={1}
                  className="w-full px-3 py-2 bg-vault-gray border border-vault-yellow-dark rounded text-white focus:outline-none focus:border-vault-yellow"
                />
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isAdding || !npcName.trim()}>
              {isAdding ? t('common.loading') : t('sessions.participants.addQuickNpc')}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
