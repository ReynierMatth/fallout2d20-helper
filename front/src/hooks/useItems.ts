import { useQuery } from '@tanstack/react-query';
import { itemsApi, type WeaponApi, type ArmorApi, type PowerArmorApi, type RobotArmorApi, type ClothingApi, type AmmunitionApi, type SyringerAmmoApi, type ChemApi, type FoodApi, type GeneralGoodApi, type MagazineApi, type ModApi } from '../services/api';

export interface ItemsData {
  weapons: WeaponApi[];
  armors: ArmorApi[];
  powerArmors: PowerArmorApi[];
  clothing: ClothingApi[];
  ammunition: AmmunitionApi[];
  chems: ChemApi[];
  food: FoodApi[];
  generalGoods: GeneralGoodApi[];
  magazines: MagazineApi[];
  robotArmors: RobotArmorApi[];
  syringerAmmo: SyringerAmmoApi[];
  oddities: GeneralGoodApi[];
  mods: ModApi[];
}

const ITEMS_STALE_TIME = 5 * 60_000; // Items are reference data, cache longer

export function useItems() {
  const { data: items = null, isLoading: loading, error: queryError } = useQuery({
    queryKey: ['items', 'all'],
    queryFn: () => itemsApi.getAllItems(),
    staleTime: ITEMS_STALE_TIME,
  });

  return { items, loading, error: queryError?.message ?? null, refetch: () => {} };
}

export function useWeapons(filters?: { skill?: string; rarity?: number; minRarity?: number; maxRarity?: number }) {
  const { data: weapons = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['items', 'weapons', filters],
    queryFn: () => itemsApi.getWeapons(filters),
    staleTime: ITEMS_STALE_TIME,
  });

  return { weapons, loading, error: queryError?.message ?? null, refetch: () => {} };
}

export function useArmors(filters?: { location?: string; type?: string; set?: string; rarity?: number; minRarity?: number; maxRarity?: number }) {
  const { data: armors = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['items', 'armors', filters],
    queryFn: () => itemsApi.getArmors(filters),
    staleTime: ITEMS_STALE_TIME,
  });

  return { armors, loading, error: queryError?.message ?? null, refetch: () => {} };
}

export function usePowerArmors(filters?: { set?: string; location?: string; rarity?: number; minRarity?: number; maxRarity?: number }) {
  const { data: powerArmors = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['items', 'powerArmors', filters],
    queryFn: () => itemsApi.getPowerArmors(filters),
    staleTime: ITEMS_STALE_TIME,
  });

  return { powerArmors, loading, error: queryError?.message ?? null, refetch: () => {} };
}

export function useClothing(filters?: { rarity?: number; minRarity?: number; maxRarity?: number }) {
  const { data: clothing = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['items', 'clothing', filters],
    queryFn: () => itemsApi.getClothing(filters),
    staleTime: ITEMS_STALE_TIME,
  });

  return { clothing, loading, error: queryError?.message ?? null, refetch: () => {} };
}

export function useAmmunition(filters?: { rarity?: number; minRarity?: number; maxRarity?: number }) {
  const { data: ammunition = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['items', 'ammunition', filters],
    queryFn: () => itemsApi.getAmmunition(filters),
    staleTime: ITEMS_STALE_TIME,
  });

  return { ammunition, loading, error: queryError?.message ?? null, refetch: () => {} };
}

export function useChems(filters?: { duration?: string; addictive?: boolean; rarity?: number; minRarity?: number; maxRarity?: number }) {
  const { data: chems = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['items', 'chems', filters],
    queryFn: () => itemsApi.getChems(filters),
    staleTime: ITEMS_STALE_TIME,
  });

  return { chems, loading, error: queryError?.message ?? null, refetch: () => {} };
}

export function useFood(filters?: { type?: string; irradiated?: boolean; rarity?: number; minRarity?: number; maxRarity?: number }) {
  const { data: food = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['items', 'food', filters],
    queryFn: () => itemsApi.getFood(filters),
    staleTime: ITEMS_STALE_TIME,
  });

  return { food, loading, error: queryError?.message ?? null, refetch: () => {} };
}

export function useGeneralGoods(filters?: { type?: string; rarity?: number; minRarity?: number; maxRarity?: number }) {
  const { data: generalGoods = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['items', 'generalGoods', filters],
    queryFn: () => itemsApi.getGeneralGoods(filters),
    staleTime: ITEMS_STALE_TIME,
  });

  return { generalGoods, loading, error: queryError?.message ?? null, refetch: () => {} };
}
