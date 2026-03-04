import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bug, Search, Plus } from 'lucide-react';
import { Card } from '../../components/Card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../primitives/Select';
import { useBestiary } from '../../hooks/useBestiary';
import { BestiaryDetailModal } from '../components/bestiary/BestiaryDetailModal';
import { BestiaryCreateModal } from '../components/bestiary/BestiaryCreateModal';
import { InstantiateCreatureModal } from '../components/bestiary/InstantiateCreatureModal';
import type { BestiarySummaryApi, BestiaryEntryApi, CreateBestiaryEntryData, CreatureCategory, StatBlockType } from '../../services/api';

const CATEGORIES: (CreatureCategory | 'all')[] = ['all', 'human', 'ghoul', 'superMutant', 'synth', 'robot', 'animal', 'abomination', 'insect', 'alien'];
const STAT_BLOCK_TYPES: (StatBlockType | 'all')[] = ['all', 'normal', 'creature'];

export function BestiaryPage() {
  const { t } = useTranslation();
  const { entries, loading, error, loadEntries, getEntry, instantiate, createEntry, updateEntry, deleteEntry } = useBestiary();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CreatureCategory | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<StatBlockType | 'all'>('all');

  // Modal state
  const [selectedEntry, setSelectedEntry] = useState<BestiaryEntryApi | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [instantiateEntry, setInstantiateEntry] = useState<BestiaryEntryApi | null>(null);
  const [instantiateOpen, setInstantiateOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<BestiaryEntryApi | null>(null);

  // Apply filters
  useEffect(() => {
    const filters: { category?: CreatureCategory; search?: string; statBlockType?: StatBlockType } = {};
    if (categoryFilter !== 'all') filters.category = categoryFilter;
    if (typeFilter !== 'all') filters.statBlockType = typeFilter;
    if (search.trim()) filters.search = search.trim();
    loadEntries(Object.keys(filters).length > 0 ? filters : undefined);
  }, [categoryFilter, typeFilter, search, loadEntries]);

  const handleEntryClick = async (entry: BestiarySummaryApi) => {
    try {
      const full = await getEntry(entry.id);
      setSelectedEntry(full);
      setDetailOpen(true);
    } catch (err) {
      console.error('Failed to load entry:', err);
    }
  };

  const handleInstantiateRequest = (entry: BestiaryEntryApi) => {
    setDetailOpen(false);
    setInstantiateEntry(entry);
    setInstantiateOpen(true);
  };

  const handleInstantiateConfirm = async (entry: BestiaryEntryApi, sessionId: number, name?: string) => {
    await instantiate(entry.id, { sessionId, name });
  };

  const handleCreateSave = async (data: CreateBestiaryEntryData) => {
    await createEntry(data);
  };

  const handleEditSave = async (data: CreateBestiaryEntryData) => {
    if (editEntry) {
      await updateEntry(editEntry.id, data);
    }
  };

  const handleEditRequest = (entry: BestiaryEntryApi) => {
    setDetailOpen(false);
    setEditEntry(entry);
    setCreateOpen(true);
  };

  const handleDeleteRequest = async (entry: BestiaryEntryApi) => {
    setDetailOpen(false);
    await deleteEntry(entry.id);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <div className="flex items-center gap-3">
            <Bug className="text-vault-yellow" size={32} />
            <h1 className="text-2xl font-bold text-vault-yellow flex-1">
              {t('bestiary.title')}
            </h1>
            <button
              type="button"
              onClick={() => { setEditEntry(null); setCreateOpen(true); }}
              className="flex items-center gap-1 px-3 py-1.5 bg-vault-yellow text-vault-blue font-bold rounded hover:bg-vault-yellow-light transition-colors text-sm"
            >
              <Plus size={16} />
              {t('bestiary.form.custom')}
            </button>
          </div>
        </Card>

        {/* Search + Filters */}
        <Card>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-vault-yellow-dark" size={18} />
              <input
                type="text"
                className="w-full bg-vault-blue border border-vault-yellow-dark text-vault-yellow rounded pl-10 pr-4 py-2 placeholder:text-vault-yellow-dark/60"
                placeholder={t('bestiary.searchPlaceholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-vault-yellow text-sm font-medium mb-1 block">{t('common.labels.category')}</label>
                <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as CreatureCategory | 'all')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {t(`bestiary.categories.${cat}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-vault-yellow text-sm font-medium mb-1 block">{t('common.labels.type')}</label>
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as StatBlockType | 'all')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAT_BLOCK_TYPES.map(typ => (
                      <SelectItem key={typ} value={typ}>
                        {t(`bestiary.statBlockTypes.${typ}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Content */}
        {loading ? (
          <Card>
            <div className="text-center text-gray-400 py-12">
              {t('common.loading')}
            </div>
          </Card>
        ) : error ? (
          <Card>
            <div className="text-center text-red-400 py-12">
              {t('common.error')}: {error}
            </div>
          </Card>
        ) : entries.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Bug size={48} className="mx-auto text-vault-yellow-dark mb-4" />
              <p className="text-gray-400">{t('bestiary.noEntries')}</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {entries.map(entry => (
              <BestiaryCard
                key={entry.id}
                entry={entry}
                onClick={() => handleEntryClick(entry)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <BestiaryDetailModal
        entry={selectedEntry}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        onInstantiate={handleInstantiateRequest}
        onEdit={handleEditRequest}
        onDelete={handleDeleteRequest}
      />

      {/* Create/Edit Modal */}
      <BestiaryCreateModal
        isOpen={createOpen}
        onClose={() => { setCreateOpen(false); setEditEntry(null); }}
        onSave={editEntry ? handleEditSave : handleCreateSave}
        editEntry={editEntry}
      />

      {/* Instantiate Modal */}
      <InstantiateCreatureModal
        entry={instantiateEntry}
        isOpen={instantiateOpen}
        onClose={() => setInstantiateOpen(false)}
        onConfirm={handleInstantiateConfirm}
      />
    </>
  );
}

function BestiaryCard({ entry, onClick }: { entry: BestiarySummaryApi; onClick: () => void }) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-vault-gray border-2 border-vault-yellow-dark rounded-lg p-4 text-left hover:border-vault-yellow transition-colors w-full"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-vault-yellow font-bold">
          {entry.emoji && <span className="mr-1">{entry.emoji}</span>}
          {t(entry.nameKey)}
        </h3>
        <span className="text-xs bg-vault-blue px-2 py-0.5 rounded text-vault-yellow-dark shrink-0 ml-2">
          {t(`bestiary.statBlockTypes.${entry.statBlockType}`)}
        </span>
      </div>
      <div className="flex gap-2 flex-wrap mb-2">
        <span className="text-xs bg-vault-blue/70 px-2 py-0.5 rounded text-gray-300">
          {t(`bestiary.categories.${entry.category}`)}
        </span>
        <span className="text-xs bg-vault-blue/70 px-2 py-0.5 rounded text-gray-300">
          {t('bestiary.level')} {entry.level}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="text-center">
          <div className="text-vault-yellow-dark text-xs">{t('bestiary.hp')}</div>
          <div className="text-vault-yellow font-bold">{entry.hp}</div>
        </div>
        <div className="text-center">
          <div className="text-vault-yellow-dark text-xs">{t('bestiary.defense')}</div>
          <div className="text-vault-yellow font-bold">{entry.defense}</div>
        </div>
        <div className="text-center">
          <div className="text-vault-yellow-dark text-xs">{t('bestiary.initiative')}</div>
          <div className="text-vault-yellow font-bold">{entry.initiative}</div>
        </div>
      </div>
    </button>
  );
}
