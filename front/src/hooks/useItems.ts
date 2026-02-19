import { useState, useEffect, useCallback } from 'react';
import { itemsApi, type WeaponApi, type ArmorApi, type PowerArmorApi, type RobotArmorApi, type ClothingApi, type AmmunitionApi, type SyringerAmmoApi, type ChemApi, type FoodApi, type GeneralGoodApi, type MagazineApi } from '../services/api';

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
}

export function useItems() {
  const [items, setItems] = useState<ItemsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await itemsApi.getAllItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, error, refetch: fetchItems };
}

export function useWeapons(filters?: { skill?: string; rarity?: number; minRarity?: number; maxRarity?: number }) {
  const [weapons, setWeapons] = useState<WeaponApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeapons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await itemsApi.getWeapons(filters);
      setWeapons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weapons');
    } finally {
      setLoading(false);
    }
  }, [filters?.skill, filters?.rarity, filters?.minRarity, filters?.maxRarity]);

  useEffect(() => {
    fetchWeapons();
  }, [fetchWeapons]);

  return { weapons, loading, error, refetch: fetchWeapons };
}

export function useArmors(filters?: { location?: string; type?: string; set?: string; rarity?: number; minRarity?: number; maxRarity?: number }) {
  const [armors, setArmors] = useState<ArmorApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArmors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await itemsApi.getArmors(filters);
      setArmors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch armors');
    } finally {
      setLoading(false);
    }
  }, [filters?.location, filters?.type, filters?.set, filters?.rarity, filters?.minRarity, filters?.maxRarity]);

  useEffect(() => {
    fetchArmors();
  }, [fetchArmors]);

  return { armors, loading, error, refetch: fetchArmors };
}

export function usePowerArmors(filters?: { set?: string; location?: string; rarity?: number; minRarity?: number; maxRarity?: number }) {
  const [powerArmors, setPowerArmors] = useState<PowerArmorApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPowerArmors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await itemsApi.getPowerArmors(filters);
      setPowerArmors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch power armors');
    } finally {
      setLoading(false);
    }
  }, [filters?.set, filters?.location, filters?.rarity, filters?.minRarity, filters?.maxRarity]);

  useEffect(() => {
    fetchPowerArmors();
  }, [fetchPowerArmors]);

  return { powerArmors, loading, error, refetch: fetchPowerArmors };
}

export function useClothing(filters?: { rarity?: number; minRarity?: number; maxRarity?: number }) {
  const [clothing, setClothing] = useState<ClothingApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClothing = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await itemsApi.getClothing(filters);
      setClothing(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clothing');
    } finally {
      setLoading(false);
    }
  }, [filters?.rarity, filters?.minRarity, filters?.maxRarity]);

  useEffect(() => {
    fetchClothing();
  }, [fetchClothing]);

  return { clothing, loading, error, refetch: fetchClothing };
}

export function useAmmunition(filters?: { rarity?: number; minRarity?: number; maxRarity?: number }) {
  const [ammunition, setAmmunition] = useState<AmmunitionApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAmmunition = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await itemsApi.getAmmunition(filters);
      setAmmunition(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ammunition');
    } finally {
      setLoading(false);
    }
  }, [filters?.rarity, filters?.minRarity, filters?.maxRarity]);

  useEffect(() => {
    fetchAmmunition();
  }, [fetchAmmunition]);

  return { ammunition, loading, error, refetch: fetchAmmunition };
}

export function useChems(filters?: { duration?: string; addictive?: boolean; rarity?: number; minRarity?: number; maxRarity?: number }) {
  const [chems, setChems] = useState<ChemApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await itemsApi.getChems(filters);
      setChems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chems');
    } finally {
      setLoading(false);
    }
  }, [filters?.duration, filters?.addictive, filters?.rarity, filters?.minRarity, filters?.maxRarity]);

  useEffect(() => {
    fetchChems();
  }, [fetchChems]);

  return { chems, loading, error, refetch: fetchChems };
}

export function useFood(filters?: { type?: string; irradiated?: boolean; rarity?: number; minRarity?: number; maxRarity?: number }) {
  const [food, setFood] = useState<FoodApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFood = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await itemsApi.getFood(filters);
      setFood(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch food');
    } finally {
      setLoading(false);
    }
  }, [filters?.type, filters?.irradiated, filters?.rarity, filters?.minRarity, filters?.maxRarity]);

  useEffect(() => {
    fetchFood();
  }, [fetchFood]);

  return { food, loading, error, refetch: fetchFood };
}

export function useGeneralGoods(filters?: { type?: string; rarity?: number; minRarity?: number; maxRarity?: number }) {
  const [generalGoods, setGeneralGoods] = useState<GeneralGoodApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGeneralGoods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await itemsApi.getGeneralGoods(filters);
      setGeneralGoods(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch general goods');
    } finally {
      setLoading(false);
    }
  }, [filters?.type, filters?.rarity, filters?.minRarity, filters?.maxRarity]);

  useEffect(() => {
    fetchGeneralGoods();
  }, [fetchGeneralGoods]);

  return { generalGoods, loading, error, refetch: fetchGeneralGoods };
}
