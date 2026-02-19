import type { ItemType } from './shared';

export interface EquipmentPackChoiceOption {
  itemId: number;
  itemName: string;
  itemType: ItemType;
  itemNameKey?: string;
  quantity?: number;
  quantityCD?: number;
  location?: string;
}

export interface EquipmentPackItem {
  itemId?: number;
  itemName?: string;
  itemType?: ItemType;
  itemNameKey?: string;
  quantity?: number;
  quantityCD?: number;
  location?: string;
  isChoice?: boolean;
  options?: EquipmentPackChoiceOption[];
  choiceCount?: number;
}

export interface EquipmentPack {
  id: string;
  nameKey: string;
  descriptionKey: string;
  items: EquipmentPackItem[];
}

export interface TagSkillBonusDirect {
  itemId: number;
  itemName: string;
  itemType: ItemType;
  itemNameKey?: string;
  quantity?: number;
  quantityCD?: number;
}

export type TagSkillBonus = TagSkillBonusDirect | {
  isChoice: true;
  options: TagSkillBonusDirect[];
};

export interface LevelBonus {
  minLevel: number;
  maxLevel: number;
  baseCaps: number;
  bonusCapsCD: number;
  maxRarity: number;
}
