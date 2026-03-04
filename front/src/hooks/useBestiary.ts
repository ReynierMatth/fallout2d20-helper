import { useState, useEffect, useCallback, useRef } from 'react';
import { bestiaryApi } from '../services/api';
import type {
  BestiarySummaryApi,
  BestiaryEntryApi,
  CreateBestiaryEntryData,
  CreatureCategory,
  StatBlockType,
} from '../services/api';

export function useBestiary() {
  const [entries, setEntries] = useState<BestiarySummaryApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastFiltersRef = useRef<{ category?: CreatureCategory; statBlockType?: StatBlockType } | undefined>(undefined);

  const loadEntries = useCallback(async (filters?: { category?: CreatureCategory; statBlockType?: StatBlockType }) => {
    lastFiltersRef.current = filters;
    setLoading(true);
    setError(null);
    try {
      const data = await bestiaryApi.list(filters);
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bestiary');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const getEntry = useCallback(async (id: number): Promise<BestiaryEntryApi> => {
    return bestiaryApi.get(id);
  }, []);

  const instantiate = useCallback(async (id: number, data: { sessionId?: number; name?: string }) => {
    return bestiaryApi.instantiate(id, data);
  }, []);

  const createEntry = useCallback(async (data: CreateBestiaryEntryData) => {
    const result = await bestiaryApi.create(data);
    await loadEntries(lastFiltersRef.current);
    return result;
  }, [loadEntries]);

  const updateEntry = useCallback(async (id: number, data: CreateBestiaryEntryData) => {
    const result = await bestiaryApi.update(id, data);
    await loadEntries(lastFiltersRef.current);
    return result;
  }, [loadEntries]);

  const deleteEntry = useCallback(async (id: number) => {
    await bestiaryApi.delete(id);
    await loadEntries(lastFiltersRef.current);
  }, [loadEntries]);

  return {
    entries,
    loading,
    error,
    loadEntries,
    getEntry,
    instantiate,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}
