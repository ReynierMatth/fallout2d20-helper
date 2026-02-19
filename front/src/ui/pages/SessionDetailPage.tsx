import { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Users, Bot, Swords, Search, ShoppingBag, Play, StopCircle, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Button,
  DualAPTracker,
  ParticipantRow,
  AddParticipantsModal,
  CombatActionReference,
  LootGenerator,
  MerchantGenerator
} from '../../components';
import { useSession } from '../../hooks/useSessionsApi';
import { charactersApi } from '../../services/api';
import type { SessionParticipantApi } from '../../services/api';

type TabId = 'pcs' | 'npcs' | 'combat' | 'loot' | 'merchant';

const tabs: { id: TabId; icon: React.ElementType }[] = [
  { id: 'pcs', icon: Users },
  { id: 'npcs', icon: Bot },
  { id: 'combat', icon: Swords },
  { id: 'loot', icon: Search },
  { id: 'merchant', icon: ShoppingBag },
];

interface LocationState {
  tab?: TabId;
}

export function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const sessionId = id ? parseInt(id, 10) : null;

  // Get initial tab from location state if returning from character sheet
  const initialTab = (location.state as LocationState)?.tab || 'pcs';
  const {
    session,
    loading,
    error,
    loadSession: _loadSession,
    updateSession: _updateSession,
    addParticipant,
    addQuickNpc,
    removeParticipant,
    setCombatStatus,
    setInitiative,
    updateParticipantCharacter,
    startCombat,
    endCombat,
    nextTurn,
    prevTurn,
    updateGroupAP: _updateGroupAP,
    spendGroupAP,
    gainGroupAP,
    spendGmAP,
    gainGmAP,
    sortedParticipants,
    currentParticipant,
  } = useSession(sessionId);

  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [showActionsRef, setShowActionsRef] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Update tab if location state changes (when returning from character sheet)
  useEffect(() => {
    if ((location.state as LocationState)?.tab) {
      setActiveTab((location.state as LocationState).tab!);
    }
  }, [location.state]);

  // Split participants by type
  const { pcs, npcs } = useMemo(() => {
    if (!session) return { pcs: [], npcs: [] };
    const sorted = [...session.participants].sort((a, b) =>
      a.character.name.localeCompare(b.character.name)
    );
    return {
      pcs: sorted.filter(p => p.character.type === 'pc'),
      npcs: sorted.filter(p => p.character.type === 'npc'),
    };
  }, [session]);

  // Handle character HP/radiation updates (modifies original character)
  // Uses optimistic updates for instant UI feedback
  const handleDamage = useCallback(async (participant: SessionParticipantApi, amount: number) => {
    const char = participant.character;
    const effectiveMax = char.maxHp - char.radiationDamage;
    const newHp = Math.max(0, Math.min(effectiveMax, char.currentHp - amount));
    // Optimistic update
    updateParticipantCharacter(char.id, { currentHp: newHp });
    // Sync with server (no await needed)
    charactersApi.update(char.id, { currentHp: newHp });
  }, [updateParticipantCharacter]);

  const handleHeal = useCallback(async (participant: SessionParticipantApi, amount: number) => {
    const char = participant.character;
    const effectiveMax = char.maxHp - char.radiationDamage;
    const newHp = Math.min(effectiveMax, char.currentHp + amount);
    // Optimistic update
    updateParticipantCharacter(char.id, { currentHp: newHp });
    // Sync with server
    charactersApi.update(char.id, { currentHp: newHp });
  }, [updateParticipantCharacter]);

  const handleRadiation = useCallback(async (participant: SessionParticipantApi, amount: number) => {
    const char = participant.character;
    const newRad = Math.max(0, Math.min(char.maxHp - 1, char.radiationDamage + amount));
    const newEffectiveMax = char.maxHp - newRad;
    // Reduce current HP if it exceeds new effective max
    const newHp = Math.min(char.currentHp, newEffectiveMax);
    // Optimistic update
    updateParticipantCharacter(char.id, { radiationDamage: newRad, currentHp: newHp });
    // Sync with server
    charactersApi.update(char.id, { radiationDamage: newRad, currentHp: newHp });
  }, [updateParticipantCharacter]);

  const handleLuckChange = useCallback(async (participant: SessionParticipantApi, amount: number) => {
    const char = participant.character;
    const newLuck = Math.max(0, Math.min(char.maxLuckPoints, char.currentLuckPoints + amount));
    // Optimistic update
    updateParticipantCharacter(char.id, { currentLuckPoints: newLuck });
    // Sync with server
    charactersApi.update(char.id, { currentLuckPoints: newLuck });
  }, [updateParticipantCharacter]);

  const handleViewSheet = useCallback((characterId: number) => {
    navigate(`/characters/${characterId}`, {
      state: { from: `/sessions/${sessionId}`, fromTab: activeTab }
    });
  }, [navigate, sessionId, activeTab]);

  // Add multiple participants at once
  const handleAddParticipants = useCallback(async (characterIds: number[]) => {
    for (const charId of characterIds) {
      await addParticipant(charId);
    }
  }, [addParticipant]);

  // Get current participant IDs for the add section
  const currentParticipantIds = session?.participants.map((p) => p.characterId) ?? [];

  if (loading) {
    return (
      <>
        <div className="max-w-6xl mx-auto">
          <Card>
            <div className="text-center text-gray-400 py-12">
              {t('common.loading')}
            </div>
          </Card>
        </div>
      </>
    );
  }

  if (error || !session) {
    return (
      <>
        <div className="max-w-6xl mx-auto">
          <Card>
            <div className="text-center text-red-400 py-12">
              {error || t('common.error')}
            </div>
            <div className="text-center">
              <Button variant="outline" onClick={() => navigate('/sessions')}>
                <ArrowLeft size={18} />
                {t('sessions.backToSessions')}
              </Button>
            </div>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Compact Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/sessions')}
              className="p-2 text-vault-yellow-dark hover:text-vault-yellow transition-colors cursor-pointer"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-vault-yellow">{session.name}</h1>
              {session.description && (
                <p className="text-xs text-gray-400 max-w-md truncate">{session.description}</p>
              )}
            </div>
          </div>
          <DualAPTracker
            playerAP={session.groupAP}
            maxPlayerAP={session.maxGroupAP}
            onPlayerSpend={spendGroupAP}
            onPlayerGain={gainGroupAP}
            gmAP={session.gmAP}
            onGmSpend={spendGmAP}
            onGmGain={gainGmAP}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(({ id, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === id
                  ? 'bg-vault-yellow text-vault-blue'
                  : 'bg-vault-gray border border-vault-yellow-dark text-vault-yellow-dark hover:border-vault-yellow hover:text-vault-yellow'
              }`}
            >
              <Icon size={18} />
              {t(`sessions.tabs.${id}`)}
            </button>
          ))}
          {/* Add button for PCs/NPCs tabs */}
          {(activeTab === 'pcs' || activeTab === 'npcs') && (
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-vault-yellow text-vault-blue hover:bg-vault-yellow-dark transition-colors cursor-pointer ml-auto"
              title={t('sessions.participants.addParticipant')}
            >
              <Plus size={24} />
            </button>
          )}
        </div>

        {/* Tab Content */}
        {(activeTab === 'pcs' || activeTab === 'npcs') && (
          <div className="space-y-3">
            {/* PCs List */}
            {activeTab === 'pcs' && (
              pcs.length === 0 ? (
                <Card>
                  <div className="text-center text-gray-400 py-8">
                    {t('sessions.participants.noPCs')}
                  </div>
                </Card>
              ) : (
                <div className="space-y-3">
                  {pcs.map((participant) => (
                    <ParticipantRow
                      key={participant.id}
                      participant={participant}
                      onDamage={(amt) => handleDamage(participant, amt)}
                      onHeal={(amt) => handleHeal(participant, amt)}
                      onRadiation={(amt) => handleRadiation(participant, amt)}
                      onLuckChange={(amt) => handleLuckChange(participant, amt)}
                      onRemove={() => removeParticipant(participant.id)}
                      onViewSheet={() => handleViewSheet(participant.characterId)}
                    />
                  ))}
                </div>
              )
            )}

            {/* NPCs List */}
            {activeTab === 'npcs' && (
              npcs.length === 0 ? (
                <Card>
                  <div className="text-center text-gray-400 py-8">
                    {t('sessions.participants.noNPCs')}
                  </div>
                </Card>
              ) : (
                <div className="space-y-3">
                  {npcs.map((participant) => (
                    <ParticipantRow
                      key={participant.id}
                      participant={participant}
                      onDamage={(amt) => handleDamage(participant, amt)}
                      onHeal={(amt) => handleHeal(participant, amt)}
                      onRadiation={(amt) => handleRadiation(participant, amt)}
                      onRemove={() => removeParticipant(participant.id)}
                      onViewSheet={() => handleViewSheet(participant.characterId)}
                    />
                  ))}
                </div>
              )
            )}
          </div>
        )}

        {/* Add Participants Modal */}
        <AddParticipantsModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          currentParticipantIds={currentParticipantIds}
          filterType={activeTab === 'pcs' ? 'pc' : 'npc'}
          onAddParticipants={handleAddParticipants}
          onAddQuickNpc={activeTab === 'npcs' ? async (data) => { await addQuickNpc?.(data); } : undefined}
        />

        {activeTab === 'combat' && (
          <div className="space-y-4">
            {/* Combat Controls */}
            {!session.combatActive ? (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-vault-yellow font-bold">
                    {t('sessions.combat.prepareCombat')}
                  </h3>
                  <Button
                    onClick={() => startCombat()}
                    disabled={session.participants.length === 0}
                  >
                    <Play size={18} />
                    {t('sessions.combat.startCombat')}
                  </Button>
                </div>

                {/* Initiative Preview - sorted by character initiative stat */}
                {session.participants.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-vault-yellow-dark">
                      {t('sessions.combat.initiativeOrder')}:
                    </h4>
                    <div className="space-y-1">
                      {[...session.participants]
                        .sort((a, b) => (b.character.initiative ?? 0) - (a.character.initiative ?? 0))
                        .map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center gap-3 px-3 py-2 bg-vault-blue rounded"
                          >
                            <span className="w-8 text-center font-bold text-vault-yellow">
                              {p.character.initiative}
                            </span>
                            <span className="text-white">{p.character.name}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                      {t('sessions.combat.combatInProgress')}
                    </span>
                    <span className="ml-3 text-vault-yellow font-bold">
                      {t('sessions.combat.round', { number: session.currentRound })}
                    </span>
                  </div>
                  <Button variant="danger" onClick={() => endCombat()}>
                    <StopCircle size={18} />
                    {t('sessions.combat.endCombat')}
                  </Button>
                </div>

                {/* Current Turn */}
                {currentParticipant && (
                  <div className="mb-4 p-3 bg-vault-yellow/10 border border-vault-yellow rounded-lg">
                    <div className="text-sm text-vault-yellow-dark mb-1">
                      {t('sessions.combat.currentTurn')}:
                    </div>
                    <div className="text-xl font-bold text-vault-yellow">
                      {currentParticipant.character.name}
                    </div>
                  </div>
                )}

                {/* Turn Navigation */}
                <div className="flex justify-center gap-4 mb-4">
                  <Button variant="outline" onClick={() => prevTurn()}>
                    <ChevronLeft size={18} />
                    {t('sessions.combat.prevTurn')}
                  </Button>
                  <Button onClick={() => nextTurn()}>
                    {t('sessions.combat.nextTurn')}
                    <ChevronRight size={18} />
                  </Button>
                </div>

                {/* Initiative Order with current highlight */}
                <div className="space-y-2">
                  {sortedParticipants.map((participant, index) => (
                    <ParticipantRow
                      key={participant.id}
                      participant={participant}
                      isActive={index === session.currentTurnIndex}
                      showCombatControls
                      onDamage={(amt) => handleDamage(participant, amt)}
                      onHeal={(amt) => handleHeal(participant, amt)}
                      onRadiation={(amt) => handleRadiation(participant, amt)}
                      onLuckChange={(amt) => handleLuckChange(participant, amt)}
                      onCombatStatusChange={(status) => setCombatStatus(participant.id, status)}
                      onInitiativeChange={(value) => setInitiative(participant.id, value)}
                      onViewSheet={() => handleViewSheet(participant.characterId)}
                    />
                  ))}
                </div>
              </Card>
            )}

            {/* Actions Reference */}
            <CombatActionReference
              collapsed={!showActionsRef}
              onToggle={() => setShowActionsRef(!showActionsRef)}
            />
          </div>
        )}

        {activeTab === 'loot' && (
          <LootGenerator showZoneDescriptions={false} compact />
        )}

        {activeTab === 'merchant' && (
          <MerchantGenerator showWealthDescriptions={false} compact />
        )}
      </div>
    </>
  );
}
