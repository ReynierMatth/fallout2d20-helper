import { useState, useCallback, useMemo, useEffect } from 'react';
import { charactersApi, type CharacterApi, type CreateCharacterData, type InventoryItemApi, type AddInventoryData, type UpdateInventoryData } from '../services/api';
import type { Character, SkillName, SpecialAttribute } from '../data/characters';
import {
  createDefaultCharacter,
  createQuickNPC as createQuickNPCFn,
  recalculateCharacterStats,
} from '../data/characters';

// Convert API character to frontend Character type
function apiToFrontend(apiChar: CharacterApi): Character {
  return {
    id: String(apiChar.id),
    name: apiChar.name,
    type: apiChar.type.toUpperCase() as 'PC' | 'NPC',
    level: apiChar.level,
    origin: apiChar.originId as any,
    survivorTraits: apiChar.survivorTraits as any[],
    giftedBonusAttributes: apiChar.giftedBonusAttributes as SpecialAttribute[],
    exerciseBonuses: apiChar.exerciseBonuses as SpecialAttribute[],
    special: apiChar.special as Record<SpecialAttribute, number>,
    skills: apiChar.skills as Record<SkillName, number>,
    tagSkills: apiChar.tagSkills as SkillName[],
    maxHp: apiChar.maxHp,
    currentHp: apiChar.currentHp,
    defense: apiChar.defense,
    initiative: apiChar.initiative,
    meleeDamageBonus: apiChar.meleeDamageBonus,
    maxLuckPoints: apiChar.maxLuckPoints,
    currentLuckPoints: apiChar.currentLuckPoints,
    carryCapacity: apiChar.carryCapacity,
    caps: apiChar.caps,
    // Convert inventory to equipped items for backwards compatibility
    equippedWeapons: apiChar.inventory
      ?.filter((inv) => inv.equipped && inv.item.itemType === 'weapon')
      .map((inv) => inv.item) ?? [],
    equippedArmor: apiChar.inventory
      ?.filter((inv) => inv.equipped && inv.item.itemType === 'armor')
      .reduce((acc, inv) => {
        if (inv.equippedLocation) {
          acc[inv.equippedLocation] = inv.item;
        }
        return acc;
      }, {} as Record<string, any>) ?? {},
    equippedClothing: apiChar.inventory
      ?.filter((inv) => inv.equipped && inv.item.itemType === 'clothing')
      .map((inv) => inv.item) ?? [],
    // Store full inventory data
    inventory: apiChar.inventory ?? [],
    perks: apiChar.perks,
    notes: '',
    createdAt: new Date(apiChar.createdAt).getTime(),
    updatedAt: new Date(apiChar.updatedAt).getTime(),
  };
}

// Convert frontend Character to API create data
function frontendToApi(char: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>): CreateCharacterData {
  return {
    name: char.name,
    type: char.type.toLowerCase() as 'pc' | 'npc',
    level: char.level,
    originId: char.origin,
    maxHp: char.maxHp,
    currentHp: char.currentHp,
    defense: char.defense,
    initiative: char.initiative,
    meleeDamageBonus: char.meleeDamageBonus,
    carryCapacity: char.carryCapacity,
    maxLuckPoints: char.maxLuckPoints,
    currentLuckPoints: char.currentLuckPoints,
    caps: char.caps ?? 0,
    special: char.special,
    skills: char.skills,
    tagSkills: char.tagSkills,
    survivorTraits: char.survivorTraits,
    perks: char.perks,
    giftedBonusAttributes: char.giftedBonusAttributes,
    exerciseBonuses: char.exerciseBonuses,
    // Convert inventory if present
    inventory: char.inventory?.map((inv: InventoryItemApi) => ({
      itemId: inv.itemId,
      quantity: inv.quantity,
      equipped: inv.equipped,
      equippedLocation: inv.equippedLocation,
    })),
  };
}

export interface UseCharactersApiReturn {
  characters: Character[];
  pcs: Character[];
  npcs: Character[];
  loading: boolean;
  error: string | null;
  addCharacter: (character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Character>;
  createPC: (name?: string) => Promise<Character>;
  createNPC: (name?: string) => Promise<Character>;
  createQuickNPC: (name: string, hp: number, defense?: number, initiative?: number) => Promise<Character>;
  updateCharacter: (id: string, updates: Partial<Character>) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
  getCharacter: (id: string) => Character | undefined;
  duplicateCharacter: (id: string) => Promise<Character | undefined>;
  recalculateStats: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
  // Inventory management
  getInventory: (characterId: string) => Promise<InventoryItemApi[]>;
  addToInventory: (characterId: string, data: AddInventoryData) => Promise<InventoryItemApi>;
  updateInventoryItem: (characterId: string, inventoryId: number, data: UpdateInventoryData) => Promise<InventoryItemApi>;
  removeFromInventory: (characterId: string, inventoryId: number) => Promise<void>;
}

/**
 * Hook for managing characters with API persistence
 */
export function useCharactersApi(): UseCharactersApiReturn {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all characters
  const fetchCharacters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await charactersApi.list({ full: true });
      setCharacters(data.map(apiToFrontend));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch characters');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  // Filtered lists
  const pcs = useMemo(
    () => characters.filter((c) => c.type === 'PC'),
    [characters]
  );

  const npcs = useMemo(
    () => characters.filter((c) => c.type === 'NPC'),
    [characters]
  );

  // Add a new character
  const addCharacter = useCallback(
    async (characterData: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>): Promise<Character> => {
      const apiData = frontendToApi(characterData);
      const created = await charactersApi.create(apiData);
      const newCharacter = apiToFrontend(created);
      setCharacters((prev) => [...prev, newCharacter]);
      return newCharacter;
    },
    []
  );

  // Create a new PC with default values
  const createPC = useCallback(
    async (name: string = ''): Promise<Character> => {
      const defaultChar = createDefaultCharacter('PC', name);
      const { id, createdAt, updatedAt, ...charData } = defaultChar;
      return addCharacter(charData);
    },
    [addCharacter]
  );

  // Create a new NPC with default values
  const createNPC = useCallback(
    async (name: string = ''): Promise<Character> => {
      const defaultChar = createDefaultCharacter('NPC', name);
      const { id, createdAt, updatedAt, ...charData } = defaultChar;
      return addCharacter(charData);
    },
    [addCharacter]
  );

  // Create a quick NPC (minimal stats for combat)
  const createQuickNPCChar = useCallback(
    async (name: string, hp: number, defense: number = 1, initiative: number = 10): Promise<Character> => {
      const quickChar = createQuickNPCFn(name, hp, defense, initiative);
      const { id, createdAt, updatedAt, ...charData } = quickChar;
      return addCharacter(charData);
    },
    [addCharacter]
  );

  // Update an existing character
  const updateCharacter = useCallback(
    async (id: string, updates: Partial<Character>): Promise<void> => {
      const numericId = Number(id);
      const currentChar = characters.find((c) => c.id === id);
      if (!currentChar) return;

      const updatedChar = { ...currentChar, ...updates };
      const apiData = frontendToApi(updatedChar as any);

      await charactersApi.update(numericId, apiData);
      setCharacters((prev) =>
        prev.map((char) =>
          char.id === id
            ? { ...char, ...updates, updatedAt: Date.now() }
            : char
        )
      );
    },
    [characters]
  );

  // Delete a character
  const deleteCharacter = useCallback(
    async (id: string): Promise<void> => {
      const numericId = Number(id);
      await charactersApi.delete(numericId);
      setCharacters((prev) => prev.filter((char) => char.id !== id));
    },
    []
  );

  // Get a character by ID
  const getCharacter = useCallback(
    (id: string): Character | undefined => {
      return characters.find((char) => char.id === id);
    },
    [characters]
  );

  // Duplicate a character
  const duplicateCharacter = useCallback(
    async (id: string): Promise<Character | undefined> => {
      const numericId = Number(id);
      const original = characters.find((char) => char.id === id);
      if (!original) return undefined;

      const duplicated = await charactersApi.duplicate(numericId, `${original.name} (copie)`);
      const newChar = apiToFrontend(duplicated);
      setCharacters((prev) => [...prev, newChar]);
      return newChar;
    },
    [characters]
  );

  // Recalculate derived stats using the official rules
  const recalculateStats = useCallback(
    async (id: string): Promise<void> => {
      const char = characters.find((c) => c.id === id);
      if (!char) return;

      const updatedStats = recalculateCharacterStats(char);
      await updateCharacter(id, updatedStats);
    },
    [characters, updateCharacter]
  );

  // ===== INVENTORY MANAGEMENT =====

  // Get character inventory
  const getInventory = useCallback(
    async (characterId: string): Promise<InventoryItemApi[]> => {
      const numericId = Number(characterId);
      return charactersApi.getInventory(numericId);
    },
    []
  );

  // Add item to inventory
  const addToInventory = useCallback(
    async (characterId: string, data: AddInventoryData): Promise<InventoryItemApi> => {
      const numericId = Number(characterId);
      const result = await charactersApi.addToInventory(numericId, data);

      // Update local state
      setCharacters((prev) =>
        prev.map((char) => {
          if (char.id === characterId) {
            return {
              ...char,
              inventory: [...(char.inventory ?? []), result],
              updatedAt: Date.now(),
            };
          }
          return char;
        })
      );

      return result;
    },
    []
  );

  // Update inventory item
  const updateInventoryItem = useCallback(
    async (characterId: string, inventoryId: number, data: UpdateInventoryData): Promise<InventoryItemApi> => {
      const numericId = Number(characterId);
      const result = await charactersApi.updateInventoryItem(numericId, inventoryId, data);

      // Update local state
      setCharacters((prev) =>
        prev.map((char) => {
          if (char.id === characterId) {
            return {
              ...char,
              inventory: (char.inventory ?? []).map((inv: InventoryItemApi) =>
                inv.id === inventoryId ? result : inv
              ),
              updatedAt: Date.now(),
            };
          }
          return char;
        })
      );

      return result;
    },
    []
  );

  // Remove item from inventory
  const removeFromInventory = useCallback(
    async (characterId: string, inventoryId: number): Promise<void> => {
      const numericId = Number(characterId);
      await charactersApi.removeFromInventory(numericId, inventoryId);

      // Update local state
      setCharacters((prev) =>
        prev.map((char) => {
          if (char.id === characterId) {
            return {
              ...char,
              inventory: (char.inventory ?? []).filter((inv: InventoryItemApi) => inv.id !== inventoryId),
              updatedAt: Date.now(),
            };
          }
          return char;
        })
      );
    },
    []
  );

  return {
    characters,
    pcs,
    npcs,
    loading,
    error,
    addCharacter,
    createPC,
    createNPC,
    createQuickNPC: createQuickNPCChar,
    updateCharacter,
    deleteCharacter,
    getCharacter,
    duplicateCharacter,
    recalculateStats,
    refetch: fetchCharacters,
    // Inventory
    getInventory,
    addToInventory,
    updateInventoryItem,
    removeFromInventory,
  };
}
