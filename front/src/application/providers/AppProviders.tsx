import type { ReactNode } from 'react';
import { RepositoryProvider, type Repositories } from './RepositoryProvider';
import { ApiItemRepository } from '../../infrastructure/adapters/ApiItemRepository';
import { ApiCharacterRepository } from '../../infrastructure/adapters/ApiCharacterRepository';
import { ApiPerkRepository } from '../../infrastructure/adapters/ApiPerkRepository';
import { ApiEquipmentPackRepository } from '../../infrastructure/adapters/ApiEquipmentPackRepository';
import { ApiSessionRepository } from '../../infrastructure/adapters/ApiSessionRepository';
import { ApiGeneratorService } from '../../infrastructure/adapters/ApiGeneratorService';

const repositories: Repositories = {
  items: new ApiItemRepository(),
  characters: new ApiCharacterRepository(),
  perks: new ApiPerkRepository(),
  equipmentPacks: new ApiEquipmentPackRepository(),
  sessions: new ApiSessionRepository(),
  generator: new ApiGeneratorService(),
};

export function AppProviders({ children }: { children: ReactNode }) {
  return <RepositoryProvider repositories={repositories}>{children}</RepositoryProvider>;
}
