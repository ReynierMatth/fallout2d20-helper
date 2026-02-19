import type { Character, CreateCharacterData, InventoryItem, AddInventoryData, UpdateInventoryData } from '../models/character';

export interface CharacterRepository {
  list(filters?: { type?: 'pc' | 'npc'; full?: boolean }): Promise<Character[]>;
  get(id: number): Promise<Character>;
  create(data: CreateCharacterData): Promise<Character>;
  update(id: number, data: Partial<CreateCharacterData>): Promise<Character>;
  delete(id: number): Promise<void>;
  duplicate(id: number, name?: string): Promise<Character>;
  getInventory(characterId: number): Promise<InventoryItem[]>;
  addToInventory(characterId: number, data: AddInventoryData): Promise<InventoryItem>;
  updateInventoryItem(characterId: number, inventoryId: number, data: UpdateInventoryData): Promise<InventoryItem>;
  removeFromInventory(characterId: number, inventoryId: number): Promise<void>;
}
