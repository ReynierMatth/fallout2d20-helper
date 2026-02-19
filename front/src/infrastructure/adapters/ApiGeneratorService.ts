import type { GeneratorService, ScavengingTables } from '../../domain/ports/GeneratorService';
import type { LootParams, LootResult, MerchantParams, MerchantResult } from '../../domain/models/generator';
import { fetchApi } from '../http/httpClient';

export class ApiGeneratorService implements GeneratorService {
  generateLoot(params: LootParams): Promise<LootResult> {
    return fetchApi('/generate/loot', { method: 'POST', body: JSON.stringify(params) });
  }

  generateMerchant(params: MerchantParams): Promise<MerchantResult> {
    return fetchApi('/generate/merchant', { method: 'POST', body: JSON.stringify(params) });
  }

  getScavengingTables(): Promise<ScavengingTables> {
    return fetchApi('/generate/scavenging-tables');
  }
}
