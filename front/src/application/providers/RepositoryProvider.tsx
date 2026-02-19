import { createContext, useContext, type ReactNode } from 'react';
import type { CharacterRepository } from '../../domain/ports/CharacterRepository';
import type { ItemRepository } from '../../domain/ports/ItemRepository';
import type { PerkRepository } from '../../domain/ports/PerkRepository';
import type { EquipmentPackRepository } from '../../domain/ports/EquipmentPackRepository';
import type { SessionRepository } from '../../domain/ports/SessionRepository';
import type { GeneratorService } from '../../domain/ports/GeneratorService';

export interface Repositories {
  characters: CharacterRepository;
  items: ItemRepository;
  perks: PerkRepository;
  equipmentPacks: EquipmentPackRepository;
  sessions: SessionRepository;
  generator: GeneratorService;
}

const RepositoryContext = createContext<Repositories | null>(null);

export function useRepositories(): Repositories {
  const ctx = useContext(RepositoryContext);
  if (!ctx) throw new Error('useRepositories must be used within RepositoryProvider');
  return ctx;
}

export function RepositoryProvider({ repositories, children }: { repositories: Repositories; children: ReactNode }) {
  return <RepositoryContext.Provider value={repositories}>{children}</RepositoryContext.Provider>;
}
