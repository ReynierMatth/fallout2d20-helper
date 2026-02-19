import { useState, useEffect, useCallback } from 'react';
import { perksApi, type PerkApi, type OriginApi, type SurvivorTraitApi } from '../services/api';

export function usePerks() {
  const [perks, setPerks] = useState<PerkApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPerks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await perksApi.list();
      setPerks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch perks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPerks();
  }, [fetchPerks]);

  return { perks, loading, error, refetch: fetchPerks };
}

export function useAvailablePerks(params: {
  characterLevel: number;
  special: Record<string, number>;
  skills: Record<string, number>;
  currentPerks: { perkId: string; rank: number }[];
  isRobot?: boolean;
  enabled?: boolean;
}) {
  const [availablePerks, setAvailablePerks] = useState<{ perk: PerkApi; availableRank: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailablePerks = useCallback(async () => {
    if (params.enabled === false) return;

    try {
      setLoading(true);
      setError(null);
      const data = await perksApi.getAvailable({
        characterLevel: params.characterLevel,
        special: params.special,
        skills: params.skills,
        currentPerks: params.currentPerks,
        isRobot: params.isRobot,
      });
      setAvailablePerks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch available perks');
    } finally {
      setLoading(false);
    }
  }, [params.characterLevel, JSON.stringify(params.special), JSON.stringify(params.skills), JSON.stringify(params.currentPerks), params.isRobot, params.enabled]);

  useEffect(() => {
    fetchAvailablePerks();
  }, [fetchAvailablePerks]);

  return { availablePerks, loading, error, refetch: fetchAvailablePerks };
}

export function useOrigins() {
  const [origins, setOrigins] = useState<OriginApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrigins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await perksApi.getOrigins();
      setOrigins(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch origins');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrigins();
  }, [fetchOrigins]);

  return { origins, loading, error, refetch: fetchOrigins };
}

export function useSurvivorTraits() {
  const [survivorTraits, setSurvivorTraits] = useState<SurvivorTraitApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSurvivorTraits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await perksApi.getSurvivorTraits();
      setSurvivorTraits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch survivor traits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSurvivorTraits();
  }, [fetchSurvivorTraits]);

  return { survivorTraits, loading, error, refetch: fetchSurvivorTraits };
}
