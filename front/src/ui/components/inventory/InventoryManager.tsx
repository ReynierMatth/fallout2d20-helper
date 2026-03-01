import { useState } from 'react';
import { useTranslation, type TFunction } from 'react-i18next';
import { Plus, Minus, Trash2, Check, X, Package, Coins, AlertTriangle, Sword, Shield, Shirt, Pill, Apple, Wrench, Settings } from 'lucide-react';
import { Button } from '../../../components/Button';
import { ItemSelector } from './ItemSelector';
import { ItemDetailModal } from '../../../components/ItemDetailModal';
import { useCharactersApi } from '../../../hooks/useCharactersApi';
import type { InventoryItemApi, ItemType, UpdateInventoryData } from '../../../services/api';

interface InventoryManagerProps {
  characterId: string;
  inventory: InventoryItemApi[];
  caps: number;
  carryCapacity: number;
  onInventoryChange?: () => void;
  onCapsChange?: (newCaps: number) => void;
}

// Icon mapping for item types
const itemTypeIcons: Record<ItemType, React.ElementType> = {
  weapon: Sword,
  armor: Shield,
  robotArmor: Shield,
  clothing: Shirt,
  ammunition: Package,
  syringerAmmo: Package,
  chem: Pill,
  food: Apple,
  generalGood: Wrench,
  oddity: Package,
  powerArmor: Shield,
  magazine: Package,
  mod: Settings,
};

// Color mapping for item types
const itemTypeColors: Record<ItemType, string> = {
  weapon: 'text-red-400',
  armor: 'text-blue-400',
  powerArmor: 'text-yellow-500',
  robotArmor: 'text-blue-300',
  clothing: 'text-purple-400',
  ammunition: 'text-yellow-400',
  syringerAmmo: 'text-green-400',
  chem: 'text-pink-400',
  food: 'text-orange-400',
  generalGood: 'text-gray-400',
  oddity: 'text-cyan-400',
  magazine: 'text-teal-400',
  mod: 'text-emerald-400',
};

// Body locations for armor equipping
const BODY_LOCATIONS = ['head', 'torso', 'armLeft', 'armRight', 'legLeft', 'legRight'] as const;

// Compute the translated display name for an inventory item, accounting for installed mods
function computeWeaponDisplayName(inv: InventoryItemApi, displayName: string, t: TFunction): string {
  const installedMods = inv.installedMods;
  if (!installedMods || installedMods.length === 0) return displayName;

  let baseName = displayName;

  // If a stock ("crosse") mod is installed, try to find a renamed weapon name
  const crosseMod = installedMods.find(m => m.slot === 'crosse');
  if (crosseMod) {
    const stocked = t(`items.stockedNames.${inv.item.name}`, { defaultValue: '' });
    if (stocked) baseName = stocked;
  }

  // Collect non-empty nameAdd suffixes from all mods
  const suffixes = installedMods
    .map(m => m.nameAddKey ? t(m.nameAddKey, { defaultValue: '' }) : '')
    .filter(Boolean);

  if (suffixes.length > 0) return `${baseName} (${suffixes.join(', ')})`;
  return baseName;
}

export function InventoryManager({
  characterId,
  inventory,
  caps,
  carryCapacity,
  onInventoryChange,
  onCapsChange,
}: InventoryManagerProps) {
  const { t } = useTranslation();
  const { addToInventory, updateInventoryItem, removeFromInventory, installMod, uninstallMod } = useCharactersApi();

  const [isItemSelectorOpen, setIsItemSelectorOpen] = useState(false);
  const [editingCaps, setEditingCaps] = useState(false);
  const [capsInput, setCapsInput] = useState(String(caps));
  const [loading, setLoading] = useState<number | null>(null);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<{ itemId: number; itemType: ItemType } | null>(null);
  // Which weapon inv ID has its mod panel open
  const [modPanelOpenFor, setModPanelOpenFor] = useState<number | null>(null);

  // Calculate total weight
  const totalWeight = inventory.reduce((sum, inv) => {
    return sum + (inv.item.weight * inv.quantity);
  }, 0);

  // Calculate total value
  const totalValue = inventory.reduce((sum, inv) => {
    return sum + (inv.item.value * inv.quantity);
  }, 0);

  const isOverCapacity = totalWeight > carryCapacity;

  // Add item from selector
  const handleAddItem = async (itemId: number, quantity: number) => {
    try {
      setLoading(-1);
      await addToInventory(characterId, { itemId, quantity, equipped: false });
      onInventoryChange?.();
    } catch (err) {
      console.error('Failed to add item:', err);
    } finally {
      setLoading(null);
    }
  };

  // Update quantity
  const handleQuantityChange = async (inv: InventoryItemApi, delta: number) => {
    const newQuantity = inv.quantity + delta;
    if (newQuantity < 1) return;

    try {
      setLoading(inv.id);
      await updateInventoryItem(characterId, inv.id, { quantity: newQuantity });
      onInventoryChange?.();
    } catch (err) {
      console.error('Failed to update quantity:', err);
    } finally {
      setLoading(null);
    }
  };

  // Toggle equipped status
  const handleToggleEquip = async (inv: InventoryItemApi, location?: string) => {
    const update: UpdateInventoryData = {
      equipped: !inv.equipped,
    };

    // For armor, include location
    if (inv.item.itemType === 'armor' && !inv.equipped && location) {
      update.equippedLocation = location;
    } else if (inv.equipped) {
      update.equippedLocation = undefined;
    }

    try {
      setLoading(inv.id);
      await updateInventoryItem(characterId, inv.id, update);
      onInventoryChange?.();
    } catch (err) {
      console.error('Failed to toggle equip:', err);
    } finally {
      setLoading(null);
    }
  };

  // Remove item
  const handleRemove = async (inv: InventoryItemApi) => {
    try {
      setLoading(inv.id);
      await removeFromInventory(characterId, inv.id);
      onInventoryChange?.();
    } catch (err) {
      console.error('Failed to remove item:', err);
    } finally {
      setLoading(null);
    }
  };

  // Install a mod on a weapon
  const handleInstallMod = async (targetInvId: number, modInventoryId: number) => {
    try {
      setLoading(targetInvId);
      await installMod(characterId, targetInvId, modInventoryId);
      setModPanelOpenFor(null);
      onInventoryChange?.();
    } catch (err) {
      console.error('Failed to install mod:', err);
    } finally {
      setLoading(null);
    }
  };

  // Uninstall a mod from a weapon
  const handleUninstallMod = async (targetInvId: number, modInventoryId: number) => {
    try {
      setLoading(targetInvId);
      await uninstallMod(characterId, targetInvId, modInventoryId);
      onInventoryChange?.();
    } catch (err) {
      console.error('Failed to uninstall mod:', err);
    } finally {
      setLoading(null);
    }
  };

  // Save caps
  const handleSaveCaps = () => {
    const newCaps = Math.max(0, parseInt(capsInput) || 0);
    onCapsChange?.(newCaps);
    setEditingCaps(false);
  };

  // Group inventory by item type
  const groupedInventory = inventory.reduce((groups, inv) => {
    const type = inv.item.itemType;
    if (!groups[type]) groups[type] = [];
    groups[type].push(inv);
    return groups;
  }, {} as Record<ItemType, InventoryItemApi[]>);

  // Order for display
  const typeOrder: ItemType[] = ['weapon', 'armor', 'clothing', 'ammunition', 'chem', 'food', 'generalGood', 'robotArmor', 'syringerAmmo', 'oddity', 'mod'];

  return (
    <div className="space-y-4">
      {/* Summary header */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-gray-800 p-3 rounded">
        <div className="flex items-center gap-6">
          {/* Weight */}
          <div className="flex items-center gap-2">
            <Package size={18} className={isOverCapacity ? 'text-red-400' : 'text-gray-400'} />
            <span className={`font-mono ${isOverCapacity ? 'text-red-400' : 'text-white'}`}>
              {totalWeight.toFixed(1)} / {carryCapacity} {t('common.labels.lbs')}
            </span>
            {isOverCapacity && (
              <span className="flex items-center gap-1 text-red-400 text-sm">
                <AlertTriangle size={14} />
                {t('inventory.overCapacity')}
              </span>
            )}
          </div>

          {/* Value */}
          <div className="flex items-center gap-2 text-gray-400">
            <span className="text-sm">{t('inventory.totalValue')}:</span>
            <span className="font-mono text-vault-yellow">{totalValue} {t('common.labels.caps')}</span>
          </div>
        </div>

        {/* Caps */}
        <div className="flex items-center gap-2">
          <Coins size={18} className="text-vault-yellow" />
          {editingCaps ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={capsInput}
                onChange={(e) => setCapsInput(e.target.value)}
                className="w-20 px-2 py-1 bg-gray-700 border border-vault-yellow rounded text-white text-center"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveCaps}
                className="p-1 text-green-400 hover:bg-green-900/30 rounded"
              >
                <Check size={16} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setCapsInput(String(caps));
                  setEditingCaps(false);
                }}
                className="p-1 text-red-400 hover:bg-red-900/30 rounded"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditingCaps(true)}
              className="font-mono text-vault-yellow hover:underline"
            >
              {caps} {t('inventory.caps')}
            </button>
          )}
        </div>
      </div>

      {/* Add item button */}
      <Button type="button" onClick={() => setIsItemSelectorOpen(true)} className="w-full">
        <Plus size={18} className="mr-2" />
        {t('inventory.addItem')}
      </Button>

      {/* Inventory list */}
      {inventory.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          {t('inventory.noItems')}
        </div>
      ) : (
        <div className="space-y-4">
          {typeOrder.map(type => {
            const items = groupedInventory[type];
            if (!items || items.length === 0) return null;

            const Icon = itemTypeIcons[type];
            const iconColor = itemTypeColors[type];

            return (
              <div key={type}>
                <h4 className="text-sm text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Icon size={14} className={iconColor} />
                  {t(`inventory.itemTypes.${type}`)}
                </h4>
                <div className="space-y-1">
                  {items.map(inv => {
                    // Try nameKey first, then items.categoryKey.name, then items.name, then raw name
                    const categoryKey = inv.item.itemType === 'weapon' ? 'weapons'
                      : inv.item.itemType === 'armor' ? 'armor'
                      : inv.item.itemType === 'clothing' ? 'clothing'
                      : inv.item.itemType === 'chem' ? 'chems'
                      : inv.item.itemType === 'food' ? 'food'
                      : inv.item.itemType === 'ammunition' ? 'ammunition'
                      : 'general';

                    let baseName = inv.item.name;
                    // Try nameKey
                    if (inv.item.nameKey) {
                      const translated = t(inv.item.nameKey);
                      if (translated !== inv.item.nameKey) baseName = translated;
                    }
                    // Try items.categoryKey.name
                    if (baseName === inv.item.name) {
                      const translated = t(`items.${categoryKey}.${inv.item.name}`);
                      if (translated !== `items.${categoryKey}.${inv.item.name}`) baseName = translated;
                    }
                    // Try items.name
                    if (baseName === inv.item.name) {
                      const translated = t(`items.${inv.item.name}`);
                      if (translated !== `items.${inv.item.name}`) baseName = translated;
                    }

                    // For weapons, apply mod name transforms
                    const displayName = inv.item.itemType === 'weapon'
                      ? computeWeaponDisplayName(inv, baseName, t)
                      : baseName;

                    const isLoading = loading === inv.id;
                    const isModPanelOpen = modPanelOpenFor === inv.id;

                    // Find compatible mods in inventory (items of type 'mod' not already installed on this weapon)
                    const installedModIds = new Set((inv.installedMods ?? []).map(m => m.modInventoryId));
                    const availableMods = inv.item.itemType === 'weapon'
                      ? inventory.filter(i =>
                          i.item.itemType === 'mod' &&
                          !installedModIds.has(i.id)
                        )
                      : [];

                    return (
                      <div
                        key={inv.id}
                        className={`rounded border ${
                          inv.equipped
                            ? 'border-vault-yellow bg-vault-blue'
                            : 'border-gray-700 bg-gray-800'
                        } ${isLoading ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-center gap-2 p-2">
                        {/* Item name & info */}
                        <div className="flex-1 min-w-0">
                          <button
                            type="button"
                            onClick={() => setSelectedItemForDetail({ itemId: inv.itemId, itemType: inv.item.itemType })}
                            className={`block truncate text-left hover:underline ${inv.equipped ? 'text-vault-yellow font-bold' : 'text-white'}`}
                          >
                            {displayName}
                          </button>
                          <span className="text-xs text-gray-500">
                            {inv.item.weight} {t('common.labels.lbs')} | {inv.item.value} {t('common.labels.caps')}
                            {inv.equipped && inv.equippedLocation && (
                              <> | {t(`bodyLocations.${inv.equippedLocation}`)}</>
                            )}
                          </span>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(inv, -1)}
                            disabled={inv.quantity <= 1 || isLoading}
                            className="p-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm font-mono">{inv.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(inv, 1)}
                            disabled={isLoading}
                            className="p-1 bg-gray-700 rounded hover:bg-gray-600"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Equip button */}
                        {(inv.item.itemType === 'weapon' || inv.item.itemType === 'armor' || inv.item.itemType === 'clothing') && (
                          inv.item.itemType === 'armor' && !inv.equipped ? (
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleToggleEquip(inv, e.target.value);
                                }
                              }}
                              disabled={isLoading}
                              className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs text-white"
                              defaultValue=""
                            >
                              <option value="" disabled>{t('inventory.equip')}</option>
                              {BODY_LOCATIONS.map(loc => (
                                <option key={loc} value={loc}>{t(`bodyLocations.${loc}`)}</option>
                              ))}
                            </select>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleEquip(inv)}
                              disabled={isLoading}
                              className={`px-2 py-1 text-xs rounded ${
                                inv.equipped
                                  ? 'bg-vault-yellow text-vault-blue'
                                  : 'bg-gray-700 text-white hover:bg-gray-600'
                              }`}
                            >
                              {inv.equipped ? t('inventory.unequip') : t('inventory.equip')}
                            </button>
                          )
                        )}

                        {/* Mod install button (weapons only) */}
                        {inv.item.itemType === 'weapon' && (
                          <button
                            type="button"
                            onClick={() => setModPanelOpenFor(isModPanelOpen ? null : inv.id)}
                            disabled={isLoading}
                            className={`p-1 rounded ${isModPanelOpen ? 'text-vault-yellow bg-vault-blue' : 'text-gray-400 hover:bg-gray-700'}`}
                            title={t('mods.installMod')}
                          >
                            <Settings size={14} />
                          </button>
                        )}

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => handleRemove(inv)}
                          disabled={isLoading}
                          className="p-1 text-red-400 hover:bg-red-900/30 rounded"
                          title={t('inventory.removeItem')}
                        >
                          <Trash2 size={14} />
                        </button>
                        </div>{/* end flex row */}

                        {/* Installed mods + mod install panel */}
                        {inv.item.itemType === 'weapon' && (
                          <>
                            {/* Installed mods badges */}
                            {(inv.installedMods ?? []).length > 0 && (
                              <div className="flex flex-wrap gap-1 px-2 pb-1">
                                {(inv.installedMods ?? []).map(mod => (
                                  <span
                                    key={mod.modInventoryId}
                                    className="flex items-center gap-1 px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300"
                                  >
                                    {mod.modName}
                                    <button
                                      type="button"
                                      onClick={() => handleUninstallMod(inv.id, mod.modInventoryId)}
                                      disabled={isLoading}
                                      className="text-red-400 hover:text-red-300"
                                      title={t('common.remove')}
                                    >
                                      <X size={10} />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Mod install panel */}
                            {isModPanelOpen && (
                              <div className="border-t border-gray-700 px-2 py-2">
                                <p className="text-xs text-gray-400 mb-1">{t('mods.installMod')} :</p>
                                {availableMods.length === 0 ? (
                                  <p className="text-xs text-gray-500 italic">{t('mods.noCompatibleMods')}</p>
                                ) : (
                                  <div className="flex flex-wrap gap-1">
                                    {availableMods.map(modInv => (
                                      <button
                                        key={modInv.id}
                                        type="button"
                                        onClick={() => handleInstallMod(inv.id, modInv.id)}
                                        disabled={isLoading}
                                        className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white"
                                      >
                                        {modInv.item.name}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Item selector modal */}
      <ItemSelector
        isOpen={isItemSelectorOpen}
        onClose={() => setIsItemSelectorOpen(false)}
        onSelect={handleAddItem}
      />

      {/* Item detail modal */}
      <ItemDetailModal
        isOpen={!!selectedItemForDetail}
        onClose={() => setSelectedItemForDetail(null)}
        itemId={selectedItemForDetail?.itemId ?? null}
        itemType={selectedItemForDetail?.itemType ?? null}
      />
    </div>
  );
}
