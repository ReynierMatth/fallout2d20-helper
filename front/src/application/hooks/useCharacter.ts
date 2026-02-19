import { useState, useEffect, useCallback } from 'react';
import { useRepositories } from '../providers/RepositoryProvider';
import type { Character, CreateCharacterData, AddInventoryData, UpdateInventoryData, InventoryItem } from '../../domain/models/character';

export function useCharacter(id: number | null) {
  const { characters } = useRepositories();
  const [data, setData] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacter = useCallback(async () => {
    if (id === null) { setData(null); setLoading(false); return; }
    try {
      setLoading(true);
      setError(null);
      const result = await characters.get(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch character');
    } finally {
      setLoading(false);
    }
  }, [characters, id]);

  useEffect(() => { fetchCharacter(); }, [fetchCharacter]);

  const updateCharacter = useCallback(async (characterData: Partial<CreateCharacterData>): Promise<Character> => {
    if (!id) throw new Error('No character ID');
    const updated = await characters.update(id, characterData);
    setData(updated);
    return updated;
  }, [characters, id]);

  const addToInventory = useCallback(async (itemData: AddInventoryData): Promise<InventoryItem> => {
    if (!id) throw new Error('No character ID');
    const item = await characters.addToInventory(id, itemData);
    await fetchCharacter();
    return item;
  }, [characters, id, fetchCharacter]);

  const updateInventoryItem = useCallback(async (inventoryId: number, itemData: UpdateInventoryData): Promise<InventoryItem> => {
    if (!id) throw new Error('No character ID');
    const item = await characters.updateInventoryItem(id, inventoryId, itemData);
    await fetchCharacter();
    return item;
  }, [characters, id, fetchCharacter]);

  const removeFromInventory = useCallback(async (inventoryId: number): Promise<void> => {
    if (!id) throw new Error('No character ID');
    await characters.removeFromInventory(id, inventoryId);
    await fetchCharacter();
  }, [characters, id, fetchCharacter]);

  return {
    data,
    loading,
    error,
    refetch: fetchCharacter,
    updateCharacter,
    addToInventory,
    updateInventoryItem,
    removeFromInventory,
  };
}
