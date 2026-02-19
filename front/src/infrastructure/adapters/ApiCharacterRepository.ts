import type { CharacterRepository } from '../../domain/ports/CharacterRepository';
import type { Character, CreateCharacterData, InventoryItem, AddInventoryData, UpdateInventoryData } from '../../domain/models/character';
import { fetchApi } from '../http/httpClient';

export class ApiCharacterRepository implements CharacterRepository {
  list(filters?: { type?: 'pc' | 'npc'; full?: boolean }): Promise<Character[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.set('type', filters.type);
    if (filters?.full) params.set('full', 'true');
    const query = params.toString();
    return fetchApi(`/characters${query ? `?${query}` : ''}`);
  }

  get(id: number): Promise<Character> {
    return fetchApi(`/characters/${id}`);
  }

  create(data: CreateCharacterData): Promise<Character> {
    return fetchApi('/characters', { method: 'POST', body: JSON.stringify(data) });
  }

  update(id: number, data: Partial<CreateCharacterData>): Promise<Character> {
    return fetchApi(`/characters/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async delete(id: number): Promise<void> {
    await fetchApi<null>(`/characters/${id}`, { method: 'DELETE' });
  }

  duplicate(id: number, name?: string): Promise<Character> {
    return fetchApi(`/characters/${id}/duplicate`, { method: 'POST', body: JSON.stringify({ name }) });
  }

  getInventory(characterId: number): Promise<InventoryItem[]> {
    return fetchApi(`/characters/${characterId}/inventory`);
  }

  addToInventory(characterId: number, data: AddInventoryData): Promise<InventoryItem> {
    return fetchApi(`/characters/${characterId}/inventory`, { method: 'POST', body: JSON.stringify(data) });
  }

  updateInventoryItem(characterId: number, inventoryId: number, data: UpdateInventoryData): Promise<InventoryItem> {
    return fetchApi(`/characters/${characterId}/inventory/${inventoryId}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async removeFromInventory(characterId: number, inventoryId: number): Promise<void> {
    await fetchApi<null>(`/characters/${characterId}/inventory/${inventoryId}`, { method: 'DELETE' });
  }
}
