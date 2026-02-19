import { useState, useEffect, useCallback } from 'react';
import { equipmentPacksApi, type EquipmentPackApi, type TagSkillBonusEntryApi, type LevelBonusApi } from '../services/api';

export function useEquipmentPacks() {
  const [packs, setPacks] = useState<EquipmentPackApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPacks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentPacksApi.list();
      setPacks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch equipment packs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPacks();
  }, [fetchPacks]);

  return { packs, loading, error, refetch: fetchPacks };
}

export function useEquipmentPacksForOrigin(originId: string | undefined) {
  const [packs, setPacks] = useState<EquipmentPackApi[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPacks = useCallback(async () => {
    if (!originId) {
      setPacks([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await equipmentPacksApi.getForOrigin(originId);
      setPacks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch equipment packs');
    } finally {
      setLoading(false);
    }
  }, [originId]);

  useEffect(() => {
    fetchPacks();
  }, [fetchPacks]);

  return { packs, loading, error, refetch: fetchPacks };
}

export function useTagSkillBonuses() {
  const [bonuses, setBonuses] = useState<Record<string, TagSkillBonusEntryApi[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBonuses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentPacksApi.getTagSkillBonuses();
      setBonuses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tag skill bonuses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBonuses();
  }, [fetchBonuses]);

  return { bonuses, loading, error, refetch: fetchBonuses };
}

export function useLevelBonuses() {
  const [bonuses, setBonuses] = useState<LevelBonusApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBonuses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentPacksApi.getLevelBonuses();
      setBonuses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch level bonuses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBonuses();
  }, [fetchBonuses]);

  return { bonuses, loading, error, refetch: fetchBonuses };
}

export function useLevelBonus(level: number) {
  const [bonus, setBonus] = useState<LevelBonusApi | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBonus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentPacksApi.getLevelBonus(level);
      setBonus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch level bonus');
    } finally {
      setLoading(false);
    }
  }, [level]);

  useEffect(() => {
    fetchBonus();
  }, [fetchBonus]);

  return { bonus, loading, error, refetch: fetchBonus };
}
