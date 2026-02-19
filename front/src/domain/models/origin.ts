import type { SpecialAttribute } from './shared';
import type { SkillName, OriginId, SurvivorTraitId } from './character';

export type { OriginId, SurvivorTraitId } from './character';

export interface OriginTrait {
  nameKey: string;
  descriptionKey: string;
}

export interface Origin {
  id: OriginId;
  nameKey: string;
  descriptionKey: string;
  trait: OriginTrait;
  specialModifiers: Partial<Record<SpecialAttribute, number>>;
  specialMaxOverrides: Partial<Record<SpecialAttribute, number>>;
  bonusTagSkills: SkillName[];
  skillMaxOverride?: number;
  isRobot: boolean;
}

export interface SurvivorTrait {
  id: SurvivorTraitId;
  nameKey: string;
  benefitKey: string;
  drawbackKey: string;
}
