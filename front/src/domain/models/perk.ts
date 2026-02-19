import type { SpecialAttribute } from './shared';
import type { SkillName } from './character';

export interface PerkPrerequisite {
  special?: Partial<Record<SpecialAttribute, number>>;
  level?: number;
  skills?: Partial<Record<SkillName, number>>;
  perks?: string[];
  excludedPerks?: string[];
  notForRobots?: boolean;
  levelIncreasePerRank?: number;
}

export interface PerkRankEffect {
  rank: number;
  effectKey: string;
}

export interface Perk {
  id: string;
  nameKey: string;
  effectKey: string;
  maxRanks: number;
  prerequisites: PerkPrerequisite;
  rankEffects?: PerkRankEffect[];
}
