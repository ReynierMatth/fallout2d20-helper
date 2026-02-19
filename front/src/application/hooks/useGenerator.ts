import { useState, useEffect, useCallback } from 'react';
import { useRepositories } from '../providers/RepositoryProvider';
import type { LootParams, LootResult, MerchantParams, MerchantResult } from '../../domain/models/generator';
import type { ScavengingTables } from '../../domain/ports/GeneratorService';

export function useGenerator() {
  const { generator } = useRepositories();

  const [lootResult, setLootResult] = useState<LootResult | null>(null);
  const [merchantResult, setMerchantResult] = useState<MerchantResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateLoot = useCallback(async (params: LootParams) => {
    try {
      setLoading(true);
      setError(null);
      const result = await generator.generateLoot(params);
      setLootResult(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate loot');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [generator]);

  const generateMerchant = useCallback(async (params: MerchantParams) => {
    try {
      setLoading(true);
      setError(null);
      const result = await generator.generateMerchant(params);
      setMerchantResult(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate merchant');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [generator]);

  return { lootResult, merchantResult, loading, error, generateLoot, generateMerchant };
}

export function useScavengingTables() {
  const { generator } = useRepositories();
  const [data, setData] = useState<ScavengingTables | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    generator.getScavengingTables().then((r) => { if (!cancelled) { setData(r); setLoading(false); } }).catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [generator]);

  return { data, loading, error };
}
