import type { EquipmentPackRepository } from '../../domain/ports/EquipmentPackRepository';
import type { EquipmentPack, TagSkillBonus, LevelBonus } from '../../domain/models/equipmentPack';
import { fetchApi } from '../http/httpClient';

export class ApiEquipmentPackRepository implements EquipmentPackRepository {
  list(): Promise<EquipmentPack[]> {
    return fetchApi('/equipment-packs');
  }

  get(id: string): Promise<EquipmentPack> {
    return fetchApi(`/equipment-packs/${id}`);
  }

  getForOrigin(originId: string): Promise<EquipmentPack[]> {
    return fetchApi(`/equipment-packs/origin/${originId}`);
  }

  getRobotArms(): Promise<{ id: string; nameKey: string }[]> {
    return fetchApi('/equipment-packs/robot-arms');
  }

  getTagSkillBonuses(): Promise<Record<string, TagSkillBonus[]>> {
    return fetchApi('/equipment-packs/tag-skill-bonuses');
  }

  getTagSkillBonus(skill: string): Promise<TagSkillBonus[]> {
    return fetchApi(`/equipment-packs/tag-skill-bonuses/${skill}`);
  }

  getLevelBonuses(): Promise<LevelBonus[]> {
    return fetchApi('/equipment-packs/level-bonuses');
  }

  getLevelBonus(level: number): Promise<LevelBonus> {
    return fetchApi(`/equipment-packs/level-bonuses/${level}`);
  }
}
