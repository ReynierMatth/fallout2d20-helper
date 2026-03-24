import { useQuery } from '@tanstack/react-query';
import { equipmentPacksApi, type EquipmentPackApi, type TagSkillBonusEntryApi, type LevelBonusApi } from '../services/api';

const REFERENCE_STALE_TIME = 5 * 60_000;

export function useEquipmentPacks() {
  const { data: packs = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['equipmentPacks'],
    queryFn: () => equipmentPacksApi.list(),
    staleTime: REFERENCE_STALE_TIME,
  });

  return { packs, loading, error: queryError?.message ?? null, refetch: () => {} };
}

export function useEquipmentPacksForOrigin(originId: string | undefined) {
  const { data: packs = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['equipmentPacks', 'origin', originId],
    queryFn: () => equipmentPacksApi.getForOrigin(originId!),
    enabled: !!originId,
    staleTime: REFERENCE_STALE_TIME,
  });

  return { packs, loading, error: queryError?.message ?? null, refetch: () => {} };
}

export function useTagSkillBonuses() {
  const { data: bonuses = {}, isLoading: loading, error: queryError } = useQuery({
    queryKey: ['tagSkillBonuses'],
    queryFn: () => equipmentPacksApi.getTagSkillBonuses(),
    staleTime: REFERENCE_STALE_TIME,
  });

  return { bonuses, loading, error: queryError?.message ?? null, refetch: () => {} };
}

export function useLevelBonuses() {
  const { data: bonuses = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['levelBonuses'],
    queryFn: () => equipmentPacksApi.getLevelBonuses(),
    staleTime: REFERENCE_STALE_TIME,
  });

  return { bonuses, loading, error: queryError?.message ?? null, refetch: () => {} };
}

export function useLevelBonus(level: number) {
  const { data: bonus = null, isLoading: loading, error: queryError } = useQuery({
    queryKey: ['levelBonuses', level],
    queryFn: () => equipmentPacksApi.getLevelBonus(level),
    staleTime: REFERENCE_STALE_TIME,
  });

  return { bonus, loading, error: queryError?.message ?? null, refetch: () => {} };
}
