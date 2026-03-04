import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../../components/Modal';
import { ConfirmModal } from '../ConfirmModal';
import { ItemDetailModal } from '../../../components/ItemDetailModal';
import { Shield, Swords, Sparkles, Package, Heart, Zap, Star, Dice6, Edit2, Trash2 } from 'lucide-react';
import { SPECIAL_COLORS } from '../../../data/specialColors';
import { SKILL_ATTRIBUTES } from '../../../data/characters';
import type { BestiaryEntryApi, ItemType } from '../../../services/api';

// Re-use the canonical skill→attribute mapping
const SKILL_TO_SPECIAL: Record<string, string> = SKILL_ATTRIBUTES;

interface BestiaryDetailModalProps {
  entry: BestiaryEntryApi | null;
  isOpen: boolean;
  onClose: () => void;
  onInstantiate?: (entry: BestiaryEntryApi) => void;
  onEdit?: (entry: BestiaryEntryApi) => void;
  onDelete?: (entry: BestiaryEntryApi) => void;
}

const SPECIAL_ORDER = ['strength', 'perception', 'endurance', 'charisma', 'intelligence', 'agility', 'luck'];
const SPECIAL_LETTERS: Record<string, string> = { strength: 'S', perception: 'P', endurance: 'E', charisma: 'C', intelligence: 'I', agility: 'A', luck: 'L' };


function getCategoryKey(itemType: string): string {
  switch (itemType) {
    case 'weapon': return 'weapons';
    case 'armor': return 'armor';
    case 'clothing': return 'clothing';
    case 'chem': return 'chems';
    case 'food': return 'food';
    case 'ammunition': return 'ammunition';
    default: return 'general';
  }
}

export function BestiaryDetailModal({ entry, isOpen, onClose, onInstantiate, onEdit, onDelete }: BestiaryDetailModalProps) {
  const { t } = useTranslation();

  // Item detail modal state
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<ItemType | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  if (!entry) return null;

  const isCreature = entry.statBlockType === 'creature';

  // Same fallback chain as InventoryManager
  const resolveItemName = (item: { name: string; nameKey: string | null; itemType: string }) => {
    if (item.nameKey) {
      const translated = t(item.nameKey);
      if (translated !== item.nameKey) return translated;
    }
    const catKey = getCategoryKey(item.itemType);
    const byCat = t(`items.${catKey}.${item.name}`);
    if (byCat !== `items.${catKey}.${item.name}`) return byCat;
    const byName = t(`items.${item.name}`);
    if (byName !== `items.${item.name}`) return byName;
    return item.name;
  };

  // -1 = immune
  const drCell = (val: number) => val < 0 ? t('bestiary.immune') : val;

  const openItemDetail = (itemId: number, itemType: string) => {
    setSelectedItemId(itemId);
    setSelectedItemType(itemType as ItemType);
    setItemModalOpen(true);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={`${entry.emoji ? entry.emoji + ' ' : ''}${t(entry.nameKey)}`}>
        <div className="space-y-6">
          {/* Description */}
          {entry.descriptionKey && (
            <p className="text-gray-300 italic text-sm">{t(entry.descriptionKey)}</p>
          )}

          {/* Derived Stats — colored icons like CharacterSheet */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatIcon icon={Heart} label={t('bestiary.hp')} value={entry.hp} color="text-red-400" />
            <StatIcon icon={Shield} label={t('bestiary.defense')} value={entry.defense} color="text-blue-400" />
            <StatIcon icon={Zap} label={t('bestiary.initiative')} value={entry.initiative} color="text-yellow-400" />
            {entry.meleeDamageBonus > 0 && (
              <StatIcon icon={Swords} label={t('bestiary.meleeDamageBonus')} value={`+${entry.meleeDamageBonus} CD`} color="text-orange-400" />
            )}
            {entry.wealth !== null && entry.wealth !== undefined && (
              <StatIcon icon={Package} label={t('bestiary.wealth')} value={entry.wealth} color="text-gray-400" />
            )}
          </div>

          <div className="flex gap-3 text-xs">
            <span className="bg-vault-blue px-2 py-1 rounded text-gray-300">
              {t('bestiary.level')} <span className="text-vault-yellow font-bold">{entry.level}</span>
            </span>
            <span className="bg-vault-blue px-2 py-1 rounded text-gray-300">
              {t('bestiary.xpReward')} <span className="text-vault-yellow font-bold">{entry.xpReward}</span>
            </span>
          </div>

          {/* Attributes — colored like CharacterSheet */}
          <Section title={t('bestiary.attributes')}>
            {isCreature ? (
              <div className="flex gap-4">
                {Object.entries(entry.attributes).map(([key, val]) => (
                  <div key={key} className="flex flex-col items-center p-2 bg-gray-800 rounded min-w-[64px]" style={{ borderBottom: '2px solid #4DBDB8' }}>
                    <span className="text-xs font-bold" style={{ color: '#4DBDB8' }}>{t(`bestiary.creatureAttributes.${key}`)}</span>
                    <span className="text-2xl text-white font-mono font-bold">{val}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-2 text-center">
                {SPECIAL_ORDER.map(attr => {
                  const color = SPECIAL_COLORS[attr];
                  return (
                    <div key={attr} className="flex flex-col items-center p-2 bg-gray-800 rounded" style={{ borderBottom: `2px solid ${color}` }}>
                      <span className="text-xs font-bold" style={{ color }}>{SPECIAL_LETTERS[attr]}</span>
                      <span className="text-2xl text-white font-mono font-bold">{entry.attributes[attr] ?? 0}</span>
                      <span className="text-[10px] text-gray-500">{t(`special.${attr}`)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>

          {/* Skills — colored like CharacterSheet */}
          <Section title={t('bestiary.skills')}>
            {isCreature ? (
              <div className="flex gap-3 flex-wrap">
                {entry.skills.map(s => (
                  <div key={s.skill} className="flex flex-col items-center p-2 bg-gray-800 rounded min-w-[64px]" style={{ borderBottom: '2px solid #E8706A' }}>
                    <span className="text-xs font-bold" style={{ color: '#E8706A' }}>{t(`bestiary.creatureSkills.${s.skill}`)}</span>
                    <span className="text-2xl text-white font-mono font-bold">{s.rank}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1.5">
                {entry.skills.map(s => {
                  const linkedAttr = SKILL_TO_SPECIAL[s.skill] ?? 'perception';
                  const color = SPECIAL_COLORS[linkedAttr] ?? '#6b7280';
                  const attrValue = entry.attributes[linkedAttr] ?? 0;
                  const tn = attrValue + s.rank;

                  return (
                    <div
                      key={s.skill}
                      className={`flex items-center gap-2 p-1.5 rounded ${
                        s.isTagSkill ? 'bg-vault-blue border border-vault-yellow-dark' : 'bg-gray-800'
                      }`}
                    >
                      {s.isTagSkill && <Star size={11} className="text-vault-yellow flex-shrink-0" fill="currentColor" />}
                      <span className={`flex-1 text-xs ${s.isTagSkill ? 'text-vault-yellow font-bold' : 'text-white'}`}>
                        {t(`skills.${s.skill}`)}
                      </span>
                      <span
                        className="text-[10px] font-bold font-mono uppercase w-6 text-center flex-shrink-0 rounded px-0.5"
                        style={{ color, backgroundColor: `${color}22` }}
                      >
                        {linkedAttr.substring(0, 3)}
                      </span>
                      <span className="text-[10px] text-gray-500 w-3 text-center flex-shrink-0">{s.rank}</span>
                      <Dice6 size={10} className="text-gray-500 flex-shrink-0" />
                      <span className="text-xs text-vault-yellow font-mono w-5 text-center flex-shrink-0 font-bold">{tn}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>

          {/* Damage Resistance */}
          <Section title={t('bestiary.damageResistance')} icon={<Shield size={18} />}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-vault-yellow-dark border-b border-vault-yellow-dark">
                    <th className="text-left py-1 px-2"></th>
                    <th className="text-center py-1 px-2">{t('bestiary.physical')}</th>
                    <th className="text-center py-1 px-2">{t('bestiary.energy')}</th>
                    <th className="text-center py-1 px-2">{t('bestiary.radiation')}</th>
                    <th className="text-center py-1 px-2">{t('bestiary.poison')}</th>
                  </tr>
                </thead>
                <tbody>
                  {entry.dr.map(d => (
                    <tr key={d.location} className="border-b border-vault-gray-light/20">
                      <td className="text-gray-300 py-1 px-2">{t(`bestiary.bodyLocations.${d.location}`)}</td>
                      <td className="text-center text-vault-yellow py-1 px-2">{drCell(d.drPhysical)}</td>
                      <td className="text-center text-vault-yellow py-1 px-2">{drCell(d.drEnergy)}</td>
                      <td className="text-center text-vault-yellow py-1 px-2">{drCell(d.drRadiation)}</td>
                      <td className="text-center text-vault-yellow py-1 px-2">{drCell(d.drPoison)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Attacks — creatures only (normal NPCs use clickable inventory instead) */}
          {isCreature && entry.attacks.length > 0 && (
            <Section title={t('bestiary.attacksTitle')} icon={<Swords size={18} />}>
              <div className="space-y-2">
                {entry.attacks.map(attack => {
                  const attackName = attack.item ? resolveItemName(attack.item) : t(attack.nameKey);
                  // Creature TN: body attr + skill rank
                  const bodyAttr = entry.attributes['body'] ?? 0;
                  const skillData = entry.skills.find(s => s.skill === attack.skill);
                  const tn = bodyAttr + (skillData?.rank ?? 0);
                  // Linked attribute label (always "Corps" for creature melee/ranged)
                  const attrLabel = attack.skill === 'melee' || attack.skill === 'other'
                    ? t('bestiary.creatureAttributes.body')
                    : t('bestiary.creatureAttributes.body');
                  const skillLabel = t(`bestiary.creatureSkills.${attack.skill}`);

                  // Build qualities string
                  const qualitiesParts = attack.qualities.map(q => {
                    const name = t(`qualities.${q.quality}.name`);
                    return q.value ? `${name} ${q.value}` : name;
                  });

                  return (
                    <div key={attack.id} className="bg-vault-blue/50 rounded p-3">
                      <div className="text-sm">
                        <span className="text-vault-yellow font-bold uppercase">{attackName}</span>
                        <span className="text-gray-400"> : </span>
                        <span className="text-white font-bold">{attrLabel}</span>
                        <span className="text-gray-400"> + </span>
                        <span className="text-white">{skillLabel}</span>
                        <span className="text-gray-400"> (</span>
                        <span className="text-vault-yellow-dark">{t('bestiary.targetNumber')} {tn}</span>
                        <span className="text-gray-400">), </span>
                        <span className="text-white">{attack.damage} </span>
                        <Dice6 size={12} className="inline text-vault-yellow" />
                        <span className="text-gray-400"> {t(`bestiary.damageTypeShort.${attack.damageType}`)}</span>
                        {attack.fireRate !== null && attack.fireRate !== undefined && (
                          <span className="text-gray-400">, {t('bestiary.fireRateShort')} {attack.fireRate}</span>
                        )}
                        <span className="text-gray-400">, {t(`ranges.${attack.range}`)}</span>
                        {qualitiesParts.length > 0 && (
                          <span className="text-gray-400">, {qualitiesParts.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* Abilities */}
          {entry.abilities.length > 0 && (
            <Section title={t('bestiary.abilitiesTitle')} icon={<Sparkles size={18} />}>
              <div className="space-y-2">
                {entry.abilities.map((ability, i) => (
                  <div key={i} className="bg-vault-blue/50 rounded p-3">
                    <div className="text-vault-yellow font-bold text-sm">{t(ability.nameKey)}</div>
                    <div className="text-gray-300 text-sm mt-1">{t(ability.descriptionKey)}</div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Inventory — clickable items */}
          {entry.inventory.length > 0 && (
            <Section title={t('bestiary.inventory')} icon={<Package size={18} />}>
              <div className="space-y-1">
                {entry.inventory.map((inv, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => openItemDetail(inv.item.id, inv.item.itemType)}
                    className="flex items-center justify-between text-sm bg-vault-blue/30 rounded px-3 py-2 w-full text-left hover:bg-vault-blue/60 transition-colors cursor-pointer"
                  >
                    <span className="text-gray-200 hover:text-vault-yellow transition-colors">
                      {resolveItemName(inv.item)}
                    </span>
                    <div className="flex items-center gap-2">
                      {inv.quantity > 1 && (
                        <span className="text-vault-yellow-dark">x{inv.quantity}</span>
                      )}
                      {inv.equipped && (
                        <span className="text-xs bg-vault-yellow/20 text-vault-yellow px-1.5 py-0.5 rounded">E</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Section>
          )}

          {/* Action buttons */}
          <div className="pt-2 border-t border-vault-yellow-dark space-y-2">
            {entry.source === 'custom' && (onEdit || onDelete) && (
              <div className="flex gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(entry)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded border border-vault-yellow-dark text-vault-yellow hover:bg-vault-blue transition-colors text-sm"
                  >
                    <Edit2 size={14} />
                    {t('bestiary.form.edit')}
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => setConfirmDeleteOpen(true)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded border border-red-600 text-red-400 hover:bg-red-900/30 transition-colors text-sm"
                  >
                    <Trash2 size={14} />
                    {t('bestiary.form.delete')}
                  </button>
                )}
              </div>
            )}
            {onInstantiate && (
              <button
                onClick={() => onInstantiate(entry)}
                className="w-full bg-vault-yellow text-vault-blue font-bold py-2 rounded hover:bg-vault-yellow-light transition-colors"
              >
                {t('bestiary.addToSession')}
              </button>
            )}
          </div>
        </div>
      </Modal>

      {/* Item Detail Modal */}
      <ItemDetailModal
        isOpen={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        itemId={selectedItemId}
        itemType={selectedItemType}
      />

      {/* Delete Confirm Modal */}
      {onDelete && (
        <ConfirmModal
          isOpen={confirmDeleteOpen}
          onClose={() => setConfirmDeleteOpen(false)}
          onConfirm={() => onDelete(entry)}
          title={t('common.confirmDelete')}
          description={t('bestiary.form.confirmDelete')}
          confirmLabel={t('common.delete')}
          variant="danger"
        />
      )}
    </>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-vault-yellow font-bold text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

function StatIcon({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-800 rounded">
      <Icon size={20} className={color} />
      <div>
        <span className="text-xs text-gray-400 block">{label}</span>
        <span className="text-white font-bold">{value}</span>
      </div>
    </div>
  );
}
