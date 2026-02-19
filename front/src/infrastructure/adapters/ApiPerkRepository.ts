import type { PerkRepository, AvailablePerksParams, AvailablePerkResult } from '../../domain/ports/PerkRepository';
import type { Perk } from '../../domain/models/perk';
import type { Origin, SurvivorTrait } from '../../domain/models/origin';
import { fetchApi } from '../http/httpClient';

export class ApiPerkRepository implements PerkRepository {
  list(): Promise<Perk[]> {
    return fetchApi('/perks');
  }

  get(id: string): Promise<Perk> {
    return fetchApi(`/perks/${id}`);
  }

  getAvailable(params: AvailablePerksParams): Promise<AvailablePerkResult[]> {
    const queryParams = new URLSearchParams({
      available: 'true',
      characterLevel: String(params.characterLevel),
      special: JSON.stringify(params.special),
      skills: JSON.stringify(params.skills),
      currentPerks: JSON.stringify(params.currentPerks),
      ...(params.isRobot ? { isRobot: 'true' } : {}),
    });
    return fetchApi(`/perks?${queryParams}`);
  }

  getOrigins(): Promise<Origin[]> {
    return fetchApi('/perks/origins');
  }

  getOrigin(id: string): Promise<Origin> {
    return fetchApi(`/perks/origins/${id}`);
  }

  getSurvivorTraits(): Promise<SurvivorTrait[]> {
    return fetchApi('/perks/survivor-traits');
  }

  getSurvivorTrait(id: string): Promise<SurvivorTrait> {
    return fetchApi(`/perks/survivor-traits/${id}`);
  }
}
