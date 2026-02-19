import { useState, useEffect, useCallback } from 'react';
import { useRepositories } from '../providers/RepositoryProvider';
import type { Character, CreateCharacterData } from '../../domain/models/character';

export function useCharacters(filters?: { type?: 'pc' | 'npc' }) {
  const { characters } = useRepositories();
  const [data, setData] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await characters.list({ ...filters, full: true });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch characters');
    } finally {
      setLoading(false);
    }
  }, [characters, filters?.type]);

  useEffect(() => { fetchCharacters(); }, [fetchCharacters]);

  const createCharacter = useCallback(async (characterData: CreateCharacterData): Promise<Character> => {
    const created = await characters.create(characterData);
    await fetchCharacters();
    return created;
  }, [characters, fetchCharacters]);

  const updateCharacter = useCallback(async (id: number, characterData: Partial<CreateCharacterData>): Promise<Character> => {
    const updated = await characters.update(id, characterData);
    await fetchCharacters();
    return updated;
  }, [characters, fetchCharacters]);

  const deleteCharacter = useCallback(async (id: number): Promise<void> => {
    await characters.delete(id);
    await fetchCharacters();
  }, [characters, fetchCharacters]);

  const duplicateCharacter = useCallback(async (id: number, name?: string): Promise<Character> => {
    const duplicated = await characters.duplicate(id, name);
    await fetchCharacters();
    return duplicated;
  }, [characters, fetchCharacters]);

  return {
    data,
    loading,
    error,
    refetch: fetchCharacters,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    duplicateCharacter,
    pcs: data.filter((c) => c.type === 'pc'),
    npcs: data.filter((c) => c.type === 'npc'),
  };
}
