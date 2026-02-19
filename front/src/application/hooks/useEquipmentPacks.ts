import { useState, useEffect } from 'react';
import { useRepositories } from '../providers/RepositoryProvider';
import type { EquipmentPack, TagSkillBonus, LevelBonus } from '../../domain/models/equipmentPack';

export function useEquipmentPacks() {
  const { equipmentPacks } = useRepositories();
  const [data, setData] = useState<EquipmentPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    equipmentPacks.list().then((r) => { if (!cancelled) { setData(r); setLoading(false); } }).catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [equipmentPacks]);

  return { data, loading, error };
}

export function useEquipmentPacksForOrigin(originId: string | undefined) {
  const { equipmentPacks } = useRepositories();
  const [data, setData] = useState<EquipmentPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!originId) { setData([]); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    equipmentPacks.getForOrigin(originId).then((r) => { if (!cancelled) { setData(r); setLoading(false); } }).catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [equipmentPacks, originId]);

  return { data, loading, error };
}

export function useTagSkillBonuses() {
  const { equipmentPacks } = useRepositories();
  const [data, setData] = useState<Record<string, TagSkillBonus[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    equipmentPacks.getTagSkillBonuses().then((r) => { if (!cancelled) { setData(r); setLoading(false); } }).catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [equipmentPacks]);

  return { data, loading, error };
}

export function useLevelBonuses() {
  const { equipmentPacks } = useRepositories();
  const [data, setData] = useState<LevelBonus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    equipmentPacks.getLevelBonuses().then((r) => { if (!cancelled) { setData(r); setLoading(false); } }).catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [equipmentPacks]);

  return { data, loading, error };
}

export function useLevelBonus(level: number) {
  const { equipmentPacks } = useRepositories();
  const [data, setData] = useState<LevelBonus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    equipmentPacks.getLevelBonus(level).then((r) => { if (!cancelled) { setData(r); setLoading(false); } }).catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [equipmentPacks, level]);

  return { data, loading, error };
}
