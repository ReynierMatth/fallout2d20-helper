import { useQuery } from '@tanstack/react-query';
import { perksApi, type PerkApi, type OriginApi, type SurvivorTraitApi } from '../services/api';

const REFERENCE_STALE_TIME = 5 * 60_000;

export function usePerks() {
  const { data: perks = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['perks'],
    queryFn: () => perksApi.list(),
    staleTime: REFERENCE_STALE_TIME,
  });

  return { perks, loading, error: queryError?.message ?? null, refetch: () => {} };
}

export function useAvailablePerks(params: {
  characterLevel: number;
  special: Record<string, number>;
  skills: Record<string, number>;
  currentPerks: { perkId: string; rank: number }[];
  isRobot?: boolean;
  enabled?: boolean;
}) {
  const { data: availablePerks = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['perks', 'available', params.characterLevel, params.special, params.skills, params.currentPerks, params.isRobot],
    queryFn: () => perksApi.getAvailable({
      characterLevel: params.characterLevel,
      special: params.special,
      skills: params.skills,
      currentPerks: params.currentPerks,
      isRobot: params.isRobot,
    }),
    enabled: params.enabled !== false,
    staleTime: 10_000,
  });

  return { availablePerks, loading, error: queryError?.message ?? null, refetch: () => {} };
}

export function useOrigins() {
  const { data: origins = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['origins'],
    queryFn: () => perksApi.getOrigins(),
    staleTime: REFERENCE_STALE_TIME,
  });

  return { origins, loading, error: queryError?.message ?? null, refetch: () => {} };
}

export function useSurvivorTraits() {
  const { data: survivorTraits = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['survivorTraits'],
    queryFn: () => perksApi.getSurvivorTraits(),
    staleTime: REFERENCE_STALE_TIME,
  });

  return { survivorTraits, loading, error: queryError?.message ?? null, refetch: () => {} };
}
