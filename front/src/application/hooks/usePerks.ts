import { useState, useEffect } from 'react';
import { useRepositories } from '../providers/RepositoryProvider';
import type { Perk } from '../../domain/models/perk';
import type { Origin, SurvivorTrait } from '../../domain/models/origin';
import type { AvailablePerkResult } from '../../domain/ports/PerkRepository';

export function usePerks() {
  const { perks } = useRepositories();
  const [data, setData] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    perks.list().then((r) => { if (!cancelled) { setData(r); setLoading(false); } }).catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [perks]);

  return { data, loading, error };
}

export function useAvailablePerks(params: {
  characterLevel: number;
  special: Record<string, number>;
  skills: Record<string, number>;
  currentPerks: { perkId: string; rank: number }[];
  isRobot?: boolean;
} | null) {
  const { perks } = useRepositories();
  const [data, setData] = useState<AvailablePerkResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params) { setData([]); return; }
    let cancelled = false;
    setLoading(true);
    perks.getAvailable(params).then((r) => { if (!cancelled) { setData(r); setLoading(false); } }).catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [perks, params?.characterLevel, params?.isRobot]);

  return { data, loading, error };
}

export function useOrigins() {
  const { perks } = useRepositories();
  const [data, setData] = useState<Origin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    perks.getOrigins().then((r) => { if (!cancelled) { setData(r); setLoading(false); } }).catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [perks]);

  return { data, loading, error };
}

export function useSurvivorTraits() {
  const { perks } = useRepositories();
  const [data, setData] = useState<SurvivorTrait[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    perks.getSurvivorTraits().then((r) => { if (!cancelled) { setData(r); setLoading(false); } }).catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [perks]);

  return { data, loading, error };
}
