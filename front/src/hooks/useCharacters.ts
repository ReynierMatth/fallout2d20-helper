import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Character } from '../data/characters';
import {
  createDefaultCharacter,
  createQuickNPC,
  recalculateCharacterStats,
} from '../data/characters';

const STORAGE_KEY = 'f2d20-characters';

export interface UseCharactersReturn {
  characters: Character[];
  pcs: Character[];
  npcs: Character[];
  addCharacter: (character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => Character;
  createPC: (name?: string) => Character;
  createNPC: (name?: string) => Character;
  createQuickNPC: (name: string, hp: number, defense?: number, initiative?: number) => Character;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  getCharacter: (id: string) => Character | undefined;
  duplicateCharacter: (id: string) => Character | undefined;
  recalculateStats: (id: string) => void;
}

/**
 * Hook for managing characters with localStorage persistence
 */
export function useCharacters(): UseCharactersReturn {
  const [characters, setCharacters] = useLocalStorage<Character[]>(STORAGE_KEY, []);

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
    (characterData: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>): Character => {
      const newCharacter: Character = {
        ...characterData,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setCharacters((prev) => [...prev, newCharacter]);
      return newCharacter;
    },
    [setCharacters]
  );

  // Create a new PC with default values
  const createPC = useCallback(
    (name: string = ''): Character => {
      const newCharacter = createDefaultCharacter('PC', name);
      setCharacters((prev) => [...prev, newCharacter]);
      return newCharacter;
    },
    [setCharacters]
  );

  // Create a new NPC with default values
  const createNPC = useCallback(
    (name: string = ''): Character => {
      const newCharacter = createDefaultCharacter('NPC', name);
      setCharacters((prev) => [...prev, newCharacter]);
      return newCharacter;
    },
    [setCharacters]
  );

  // Create a quick NPC (minimal stats for combat)
  const createQuickNPCChar = useCallback(
    (name: string, hp: number, defense: number = 1, initiative: number = 10): Character => {
      const newCharacter = createQuickNPC(name, hp, defense, initiative);
      setCharacters((prev) => [...prev, newCharacter]);
      return newCharacter;
    },
    [setCharacters]
  );

  // Update an existing character
  const updateCharacter = useCallback(
    (id: string, updates: Partial<Character>): void => {
      setCharacters((prev) =>
        prev.map((char) =>
          char.id === id
            ? { ...char, ...updates, updatedAt: Date.now() }
            : char
        )
      );
    },
    [setCharacters]
  );

  // Delete a character
  const deleteCharacter = useCallback(
    (id: string): void => {
      setCharacters((prev) => prev.filter((char) => char.id !== id));
    },
    [setCharacters]
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
    (id: string): Character | undefined => {
      const original = characters.find((char) => char.id === id);
      if (!original) return undefined;

      const duplicate: Character = {
        ...original,
        id: crypto.randomUUID(),
        name: `${original.name} (copie)`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setCharacters((prev) => [...prev, duplicate]);
      return duplicate;
    },
    [characters, setCharacters]
  );

  // Recalculate derived stats using the official rules
  const recalculateStats = useCallback(
    (id: string): void => {
      setCharacters((prev) =>
        prev.map((char) => {
          if (char.id !== id) return char;

          const updatedStats = recalculateCharacterStats(char);

          return {
            ...char,
            ...updatedStats,
            updatedAt: Date.now(),
          };
        })
      );
    },
    [setCharacters]
  );

  return {
    characters,
    pcs,
    npcs,
    addCharacter,
    createPC,
    createNPC,
    createQuickNPC: createQuickNPCChar,
    updateCharacter,
    deleteCharacter,
    getCharacter,
    duplicateCharacter,
    recalculateStats,
  };
}
