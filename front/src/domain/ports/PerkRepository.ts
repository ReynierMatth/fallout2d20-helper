import type { Perk } from '../models/perk';
import type { Origin, SurvivorTrait } from '../models/origin';

export interface AvailablePerksParams {
  characterLevel: number;
  special: Record<string, number>;
  skills: Record<string, number>;
  currentPerks: { perkId: string; rank: number }[];
  isRobot?: boolean;
}

export interface AvailablePerkResult {
  perk: Perk;
  availableRank: number;
}

export interface PerkRepository {
  list(): Promise<Perk[]>;
  get(id: string): Promise<Perk>;
  getAvailable(params: AvailablePerksParams): Promise<AvailablePerkResult[]>;
  getOrigins(): Promise<Origin[]>;
  getOrigin(id: string): Promise<Origin>;
  getSurvivorTraits(): Promise<SurvivorTrait[]>;
  getSurvivorTrait(id: string): Promise<SurvivorTrait>;
}
