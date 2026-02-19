import { useState, useEffect, useCallback } from 'react';
import { useRepositories } from '../providers/RepositoryProvider';
import type { AllItems, Weapon, Armor, PowerArmor, Clothing, Ammunition, Chem, Food, GeneralGood, Magazine, RobotArmor, SyringerAmmo, Oddity, Disease } from '../../domain/models/item';

export function useItems() {
  const { items } = useRepositories();
  const [data, setData] = useState<AllItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await items.getAll();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }, [items]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  return { data, loading, error, refetch: fetchItems };
}

export function useWeapons(filters?: { skill?: string; rarity?: number }) {
  const { items } = useRepositories();
  const [data, setData] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    items.getWeapons(filters).then((r) => { if (!cancelled) { setData(r); setLoading(false); } }).catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [items, filters?.skill, filters?.rarity]);

  return { data, loading, error };
}

export function useArmors(filters?: { location?: string; type?: string; set?: string }) {
  const { items } = useRepositories();
  const [data, setData] = useState<Armor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    items.getArmors(filters).then((r) => { if (!cancelled) { setData(r); setLoading(false); } }).catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [items, filters?.location, filters?.type, filters?.set]);

  return { data, loading, error };
}

export function usePowerArmors(filters?: { set?: string; location?: string }) {
  const { items } = useRepositories();
  const [data, setData] = useState<PowerArmor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    items.getPowerArmors(filters).then((r) => { if (!cancelled) { setData(r); setLoading(false); } }).catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [items, filters?.set, filters?.location]);

  return { data, loading, error };
}

export function useClothing() {
  const { items } = useRepositories();
  const [data, setData] = useState<Clothing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    items.getClothing().then((r) => { if (!cancelled) { setData(r); setLoading(false); } }).catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [items]);

  return { data, loading, error };
}

export function useAmmunition() {
  const { items } = useRepositories();
  const [data, setData] = useState<Ammunition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    items.getAmmunition().then((r) => { if (!cancelled) { setData(r); setLoading(false); } }).catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [items]);

  return { data, loading, error };
}

export function useChems(filters?: { duration?: string; addictive?: boolean }) {
  const { items } = useRepositories();
  const [data, setData] = useState<Chem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    items.getChems(filters).then((r) => { if (!cancelled) { setData(r); setLoading(false); } }).catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [items, filters?.duration, filters?.addictive]);

  return { data, loading, error };
}

export function useFood(filters?: { type?: string; irradiated?: boolean }) {
  const { items } = useRepositories();
  const [data, setData] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    items.getFood(filters).then((r) => { if (!cancelled) { setData(r); setLoading(false); } }).catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [items, filters?.type, filters?.irradiated]);

  return { data, loading, error };
}

export function useGeneralGoods(filters?: { type?: string }) {
  const { items } = useRepositories();
  const [data, setData] = useState<GeneralGood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    items.getGeneralGoods(filters).then((r) => { if (!cancelled) { setData(r); setLoading(false); } }).catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [items, filters?.type]);

  return { data, loading, error };
}

export function useMagazines() {
  const { items } = useRepositories();
  const [data, setData] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    items.getMagazines().then((r) => { if (!cancelled) { setData(r); setLoading(false); } }).catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [items]);

  return { data, loading, error };
}

export function useDiseases() {
  const { items } = useRepositories();
  const [data, setData] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    items.getDiseases().then((r) => { if (!cancelled) { setData(r); setLoading(false); } }).catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [items]);

  return { data, loading, error };
}
