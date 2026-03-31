import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { bestiaryApi } from '../services/api';
import type {
  BestiarySummaryApi,
  BestiaryEntryApi,
  CreateBestiaryEntryData,
  CreatureCategory,
  StatBlockType,
} from '../services/api';

const BESTIARY_KEY = ['bestiary'] as const;

export function useBestiary() {
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: BESTIARY_KEY,
    queryFn: () => bestiaryApi.list(),
    staleTime: 30_000,
  });

  const loadEntries = useCallback(async (filters?: { category?: CreatureCategory; statBlockType?: StatBlockType }) => {
    // Refetch with filters by invalidating and letting the query refetch
    await queryClient.invalidateQueries({ queryKey: BESTIARY_KEY });
  }, [queryClient]);

  const getEntry = useCallback(async (id: number): Promise<BestiaryEntryApi> => {
    return bestiaryApi.get(id);
  }, []);

  const instantiate = useCallback(async (id: number, data: { sessionId?: number; name?: string }) => {
    return bestiaryApi.instantiate(id, data);
  }, []);

  const createEntry = useCallback(async (data: CreateBestiaryEntryData) => {
    const result = await bestiaryApi.create(data);
    await queryClient.invalidateQueries({ queryKey: BESTIARY_KEY });
    return result;
  }, [queryClient]);

  const updateEntry = useCallback(async (id: number, data: CreateBestiaryEntryData) => {
    const result = await bestiaryApi.update(id, data);
    await queryClient.invalidateQueries({ queryKey: BESTIARY_KEY });
    return result;
  }, [queryClient]);

  const deleteEntry = useCallback(async (id: number) => {
    await bestiaryApi.delete(id);
    await queryClient.invalidateQueries({ queryKey: BESTIARY_KEY });
  }, [queryClient]);

  return {
    entries,
    loading,
    error: queryError?.message ?? null,
    loadEntries,
    getEntry,
    instantiate,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}
