import type { EquipmentPack, TagSkillBonus, LevelBonus } from '../models/equipmentPack';

export interface EquipmentPackRepository {
  list(): Promise<EquipmentPack[]>;
  get(id: string): Promise<EquipmentPack>;
  getForOrigin(originId: string): Promise<EquipmentPack[]>;
  getRobotArms(): Promise<{ id: string; nameKey: string }[]>;
  getTagSkillBonuses(): Promise<Record<string, TagSkillBonus[]>>;
  getTagSkillBonus(skill: string): Promise<TagSkillBonus[]>;
  getLevelBonuses(): Promise<LevelBonus[]>;
  getLevelBonus(level: number): Promise<LevelBonus>;
}
