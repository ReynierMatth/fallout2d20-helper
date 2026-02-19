import type { LootParams, LootResult, MerchantParams, MerchantResult } from '../models/generator';

export interface ScavengingTables {
  tables: Record<string, Record<string, Record<string, { min: number; max: number }>>>;
  areaTypes: string[];
  areaSizes: string[];
  lootCategories: string[];
  discoveryDegrees: { id: string; difficulty: number }[];
  merchantCategories: string[];
  merchantCapsByWealth: number[];
}

export interface GeneratorService {
  generateLoot(params: LootParams): Promise<LootResult>;
  generateMerchant(params: MerchantParams): Promise<MerchantResult>;
  getScavengingTables(): Promise<ScavengingTables>;
}
