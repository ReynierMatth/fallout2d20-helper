const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Generic fetch helper with error handling
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

// ===== ITEMS API =====

export type ItemType = 'weapon' | 'armor' | 'powerArmor' | 'robotArmor' | 'clothing' | 'ammunition' | 'syringerAmmo' | 'chem' | 'food' | 'generalGood' | 'oddity' | 'magazine';

// Structured effect for consumable items (food, chems, general goods, syringer ammo)
export interface ItemEffect {
  hpHealed?: number;
  radsHealed?: number;
  apBonus?: number;
  specialBonus?: Partial<Record<'strength' | 'perception' | 'endurance' | 'charisma' | 'intelligence' | 'agility' | 'luck', number>>;
  skillBonus?: Partial<Record<string, number>>;
  drBonus?: { physical?: number; energy?: number; radiation?: number; poison?: number };
  addCondition?: string[];
  removeCondition?: string[];
  radiationImmunity?: boolean;
  radiationDamage?: number;
  hpDamage?: number;
  addictionRisk?: boolean;
  addictionDC?: number;
  duration?: 'instant' | 'brief' | 'lasting' | 'permanent';
  maxHpBonus?: number;
  meleeDamageBonus?: number;
  damageBonus?: number;
  critBonus?: number;
  carryCapacityBonus?: number;
  difficultyReduction?: { skill?: string; amount: number };
  descriptionKey?: string;
}

// Base item interface (common properties in central items table)
export interface BaseItemApi {
  id: number; // Universal item ID
  name: string;
  nameKey?: string;
  value: number;
  rarity: number;
  weight: number;
  itemType?: ItemType;
}

export interface WeaponQuality {
  quality: string;
  value?: number;
}

export interface WeaponApi extends BaseItemApi {
  skill: string;
  damage: number;
  damageType: string;
  damageBonus?: number;
  fireRate: number;
  range: string;
  ammo: string;
  ammoPerShot?: number;
  qualities: WeaponQuality[];
}

export interface ArmorApi extends BaseItemApi {
  location: string;
  drPhysical: number;
  drEnergy: number;
  drRadiation: number;
  drPoison?: number;
  type: string;
  set?: string;
  hp?: number;
}

export interface PowerArmorApi extends BaseItemApi {
  set: string;
  location: string;
  drPhysical: number;
  drEnergy: number;
  drRadiation: number;
  hp: number;
}

export interface RobotArmorApi extends BaseItemApi {
  drPhysical: number;
  drEnergy: number;
  isBonus: boolean;
  location: string;
  carryModifier?: number;
  perkRequired?: string;
  specialEffectKey?: string;
  specialEffectDescription?: string;
}

export interface ClothingApi extends BaseItemApi {
  drPhysical?: number;
  drEnergy?: number;
  drRadiation?: number;
  drPoison?: number;
  locations: string[];
  effects: {
    type: string;
    target?: string;
    value?: string;
    descriptionKey: string;
  }[];
  effect?: ItemEffect;
}

export interface AmmunitionApi extends BaseItemApi {
  flatAmount: number;
  randomAmount: number;
}

export interface SyringerAmmoApi extends BaseItemApi {
  effectKey: string;
  effect?: ItemEffect;
}

export interface ChemApi extends BaseItemApi {
  duration: string;
  addictive: boolean;
  addictionLevel?: number;
  effectKey: string;
  effect?: ItemEffect;
}

export interface FoodApi extends BaseItemApi {
  foodType: string;
  irradiated: boolean;
  effectKey?: string;
  effect?: ItemEffect;
}

export interface GeneralGoodApi extends BaseItemApi {
  goodType: string;
  effectKey?: string;
  effect?: ItemEffect;
}

export interface MagazineIssueApi {
  id: number;
  magazineId: number;
  d20Min: number;
  d20Max: number;
  issueName: string;
  issueNameKey?: string;
  effectDescriptionKey: string;
}

export interface MagazineApi extends BaseItemApi {
  perkDescriptionKey: string;
  issues: MagazineIssueApi[];
}

// ===== DISEASES (not items - standalone conditions) =====

export interface DiseaseApi {
  id: number;
  d20Roll: number;
  name: string;
  nameKey?: string;
  effectKey: string;
  duration: number; // Duration in stages
}

export const diseasesApi = {
  list: () => fetchApi<DiseaseApi[]>('/diseases'),
  get: (id: number) => fetchApi<DiseaseApi>(`/diseases/${id}`),
};

export const itemsApi = {
  // Get any item by universal ID
  getItem: (id: number) => fetchApi<BaseItemApi & Record<string, any>>(`/items/${id}`),

  // Weapons
  getWeapons: (filters?: { skill?: string; rarity?: number; minRarity?: number; maxRarity?: number }) => {
    const params = new URLSearchParams();
    if (filters?.skill) params.set('skill', filters.skill);
    if (filters?.rarity !== undefined) params.set('rarity', String(filters.rarity));
    if (filters?.minRarity !== undefined) params.set('minRarity', String(filters.minRarity));
    if (filters?.maxRarity !== undefined) params.set('maxRarity', String(filters.maxRarity));
    const query = params.toString();
    return fetchApi<WeaponApi[]>(`/items/weapons${query ? `?${query}` : ''}`);
  },
  getWeapon: (id: number) => fetchApi<WeaponApi>(`/items/weapons/${id}`),

  // Armors
  getArmors: (filters?: { location?: string; type?: string; set?: string; rarity?: number; minRarity?: number; maxRarity?: number }) => {
    const params = new URLSearchParams();
    if (filters?.location) params.set('location', filters.location);
    if (filters?.type) params.set('type', filters.type);
    if (filters?.set) params.set('set', filters.set);
    if (filters?.rarity !== undefined) params.set('rarity', String(filters.rarity));
    if (filters?.minRarity !== undefined) params.set('minRarity', String(filters.minRarity));
    if (filters?.maxRarity !== undefined) params.set('maxRarity', String(filters.maxRarity));
    const query = params.toString();
    return fetchApi<ArmorApi[]>(`/items/armors${query ? `?${query}` : ''}`);
  },
  getArmor: (id: number) => fetchApi<ArmorApi>(`/items/armors/${id}`),

  // Power Armors
  getPowerArmors: (filters?: { set?: string; location?: string; rarity?: number; minRarity?: number; maxRarity?: number }) => {
    const params = new URLSearchParams();
    if (filters?.set) params.set('set', filters.set);
    if (filters?.location) params.set('location', filters.location);
    if (filters?.rarity !== undefined) params.set('rarity', String(filters.rarity));
    if (filters?.minRarity !== undefined) params.set('minRarity', String(filters.minRarity));
    if (filters?.maxRarity !== undefined) params.set('maxRarity', String(filters.maxRarity));
    const query = params.toString();
    return fetchApi<PowerArmorApi[]>(`/items/power-armors${query ? `?${query}` : ''}`);
  },
  getPowerArmor: (id: number) => fetchApi<PowerArmorApi>(`/items/power-armors/${id}`),

  // Robot Armors
  getRobotArmors: () => fetchApi<RobotArmorApi[]>('/items/robot-armors'),

  // Clothing
  getClothing: (filters?: { rarity?: number; minRarity?: number; maxRarity?: number }) => {
    const params = new URLSearchParams();
    if (filters?.rarity !== undefined) params.set('rarity', String(filters.rarity));
    if (filters?.minRarity !== undefined) params.set('minRarity', String(filters.minRarity));
    if (filters?.maxRarity !== undefined) params.set('maxRarity', String(filters.maxRarity));
    const query = params.toString();
    return fetchApi<ClothingApi[]>(`/items/clothing${query ? `?${query}` : ''}`);
  },
  getClothingItem: (id: number) => fetchApi<ClothingApi>(`/items/clothing/${id}`),

  // Ammunition
  getAmmunition: (filters?: { rarity?: number; minRarity?: number; maxRarity?: number }) => {
    const params = new URLSearchParams();
    if (filters?.rarity !== undefined) params.set('rarity', String(filters.rarity));
    if (filters?.minRarity !== undefined) params.set('minRarity', String(filters.minRarity));
    if (filters?.maxRarity !== undefined) params.set('maxRarity', String(filters.maxRarity));
    const query = params.toString();
    return fetchApi<AmmunitionApi[]>(`/items/ammunition${query ? `?${query}` : ''}`);
  },
  getSyringerAmmo: () => fetchApi<SyringerAmmoApi[]>('/items/syringer-ammo'),

  // Chems
  getChems: (filters?: { duration?: string; addictive?: boolean; rarity?: number; minRarity?: number; maxRarity?: number }) => {
    const params = new URLSearchParams();
    if (filters?.duration) params.set('duration', filters.duration);
    if (filters?.addictive !== undefined) params.set('addictive', String(filters.addictive));
    if (filters?.rarity !== undefined) params.set('rarity', String(filters.rarity));
    if (filters?.minRarity !== undefined) params.set('minRarity', String(filters.minRarity));
    if (filters?.maxRarity !== undefined) params.set('maxRarity', String(filters.maxRarity));
    const query = params.toString();
    return fetchApi<ChemApi[]>(`/items/chems${query ? `?${query}` : ''}`);
  },
  getChem: (id: number) => fetchApi<ChemApi>(`/items/chems/${id}`),

  // Food
  getFood: (filters?: { type?: string; irradiated?: boolean; rarity?: number; minRarity?: number; maxRarity?: number }) => {
    const params = new URLSearchParams();
    if (filters?.type) params.set('type', filters.type);
    if (filters?.irradiated !== undefined) params.set('irradiated', String(filters.irradiated));
    if (filters?.rarity !== undefined) params.set('rarity', String(filters.rarity));
    if (filters?.minRarity !== undefined) params.set('minRarity', String(filters.minRarity));
    if (filters?.maxRarity !== undefined) params.set('maxRarity', String(filters.maxRarity));
    const query = params.toString();
    return fetchApi<FoodApi[]>(`/items/food${query ? `?${query}` : ''}`);
  },
  getFoodItem: (id: number) => fetchApi<FoodApi>(`/items/food/${id}`),

  // General Goods
  getGeneralGoods: (filters?: { type?: string; rarity?: number; minRarity?: number; maxRarity?: number }) => {
    const params = new URLSearchParams();
    if (filters?.type) params.set('type', filters.type);
    if (filters?.rarity !== undefined) params.set('rarity', String(filters.rarity));
    if (filters?.minRarity !== undefined) params.set('minRarity', String(filters.minRarity));
    if (filters?.maxRarity !== undefined) params.set('maxRarity', String(filters.maxRarity));
    const query = params.toString();
    return fetchApi<GeneralGoodApi[]>(`/items/general-goods${query ? `?${query}` : ''}`);
  },
  getOddities: () => fetchApi<GeneralGoodApi[]>('/items/oddities'),

  // Magazines
  getMagazines: () => fetchApi<MagazineApi[]>('/items/magazines'),
  getMagazine: (id: number) => fetchApi<MagazineApi>(`/items/magazines/${id}`),

  // All items
  getAllItems: () => fetchApi<{
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
  }>('/items'),
};

// ===== CHARACTERS API =====

// Armor details for inventory items
export interface InventoryArmorDetails {
  location: string;
  drPhysical: number;
  drEnergy: number;
  drRadiation: number;
  drPoison?: number | null;
  hp?: number | null;
}

// Power Armor details for inventory items
export interface InventoryPowerArmorDetails {
  set: string;
  location: string;
  drPhysical: number;
  drEnergy: number;
  drRadiation: number;
  hp: number;
}

// Clothing details for inventory items
export interface InventoryClothingDetails {
  locations: string[];
  drPhysical: number;
  drEnergy: number;
  drRadiation: number;
  drPoison?: number | null;
}

// Inventory item as returned by API
export interface InventoryItemApi {
  id: number; // Inventory entry ID
  itemId: number; // Universal item ID
  quantity: number;
  equipped: boolean;
  equippedLocation?: string;
  // For Power Armor pieces: current HP (null = full HP)
  currentHp?: number | null;
  // Max HP from armor definition (for Power Armor)
  maxHp?: number | null;
  item: {
    id: number;
    name: string;
    itemType: ItemType;
    nameKey?: string;
    value: number;
    rarity: number;
    weight: number;
  };
  // Armor/clothing/power armor details if applicable
  armorDetails?: InventoryArmorDetails | null;
  powerArmorDetails?: InventoryPowerArmorDetails | null;
  clothingDetails?: InventoryClothingDetails | null;
}

export interface CharacterApi {
  id: number;
  name: string;
  type: 'pc' | 'npc';
  level: number;
  xp: number;
  originId?: string;
  maxHp: number;
  currentHp: number;
  defense: number;
  initiative: number;
  meleeDamageBonus: number;
  carryCapacity: number;
  maxLuckPoints: number;
  currentLuckPoints: number;
  caps: number;
  radiationDamage: number;
  createdAt: string;
  updatedAt: string;
  // Relations
  special: Record<string, number>;
  skills: Record<string, number>;
  tagSkills: string[];
  survivorTraits: string[];
  perks: { perkId: string; rank: number }[];
  giftedBonusAttributes: string[];
  exerciseBonuses: string[];
  conditions: string[];
  inventory: InventoryItemApi[];
}

export interface CreateCharacterData {
  name: string;
  type: 'pc' | 'npc';
  level?: number;
  xp?: number;
  originId?: string;
  maxHp: number;
  currentHp?: number;
  defense: number;
  initiative: number;
  meleeDamageBonus?: number;
  carryCapacity: number;
  maxLuckPoints: number;
  currentLuckPoints?: number;
  caps?: number;
  radiationDamage?: number;
  special: Record<string, number>;
  skills?: Record<string, number>;
  tagSkills?: string[];
  survivorTraits?: string[];
  perks?: { perkId: string; rank: number }[];
  giftedBonusAttributes?: string[];
  exerciseBonuses?: string[];
  inventory?: { itemId: number; quantity?: number; equipped?: boolean; equippedLocation?: string }[];
}

export interface AddInventoryData {
  itemId: number;
  quantity?: number;
  equipped?: boolean;
  equippedLocation?: string;
}

export interface UpdateInventoryData {
  quantity?: number;
  equipped?: boolean;
  equippedLocation?: string;
  currentHp?: number; // For Power Armor pieces
}

export const charactersApi = {
  list: (filters?: { type?: 'pc' | 'npc'; full?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.type) params.set('type', filters.type);
    if (filters?.full) params.set('full', 'true');
    const query = params.toString();
    return fetchApi<CharacterApi[]>(`/characters${query ? `?${query}` : ''}`);
  },
  get: (id: number) => fetchApi<CharacterApi>(`/characters/${id}`),
  create: (data: CreateCharacterData) =>
    fetchApi<CharacterApi>('/characters', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<CreateCharacterData>) =>
    fetchApi<CharacterApi>(`/characters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchApi<null>(`/characters/${id}`, {
      method: 'DELETE',
    }),
  duplicate: (id: number, name?: string) =>
    fetchApi<CharacterApi>(`/characters/${id}/duplicate`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  // Inventory management
  getInventory: (characterId: number) =>
    fetchApi<InventoryItemApi[]>(`/characters/${characterId}/inventory`),
  addToInventory: (characterId: number, data: AddInventoryData) =>
    fetchApi<InventoryItemApi>(`/characters/${characterId}/inventory`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateInventoryItem: (characterId: number, inventoryId: number, data: UpdateInventoryData) =>
    fetchApi<InventoryItemApi>(`/characters/${characterId}/inventory/${inventoryId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  removeFromInventory: (characterId: number, inventoryId: number) =>
    fetchApi<null>(`/characters/${characterId}/inventory/${inventoryId}`, {
      method: 'DELETE',
    }),
};

// ===== PERKS API =====

export interface PerkApi {
  id: string;
  nameKey: string;
  effectKey: string;
  maxRanks: number;
  prerequisites: {
    special?: Record<string, number>;
    skills?: Record<string, number>;
    level?: number;
    levelIncreasePerRank?: number;
    perks?: string[];
    excludedPerks?: string[];
    notForRobots?: boolean;
  };
  rankEffects?: { rank: number; effectKey: string }[];
}

export interface OriginApi {
  id: string;
  nameKey: string;
  descriptionKey: string;
  traitNameKey: string;
  traitDescriptionKey: string;
  skillMaxOverride?: number;
  isRobot: boolean;
  specialModifiers: Record<string, number>;
  specialMaxOverrides: Record<string, number>;
  bonusTagSkills: string[];
  trait: {
    nameKey: string;
    descriptionKey: string;
  };
}

export interface SurvivorTraitApi {
  id: string;
  nameKey: string;
  benefitKey: string;
  drawbackKey: string;
}

export const perksApi = {
  list: () => fetchApi<PerkApi[]>('/perks'),
  get: (id: string) => fetchApi<PerkApi>(`/perks/${id}`),
  getAvailable: (params: {
    characterLevel: number;
    special: Record<string, number>;
    skills: Record<string, number>;
    currentPerks: { perkId: string; rank: number }[];
    isRobot?: boolean;
  }) => {
    const queryParams = new URLSearchParams({
      available: 'true',
      characterLevel: String(params.characterLevel),
      special: JSON.stringify(params.special),
      skills: JSON.stringify(params.skills),
      currentPerks: JSON.stringify(params.currentPerks),
      ...(params.isRobot ? { isRobot: 'true' } : {}),
    });
    return fetchApi<{ perk: PerkApi; availableRank: number }[]>(`/perks?${queryParams}`);
  },

  // Origins
  getOrigins: () => fetchApi<OriginApi[]>('/perks/origins'),
  getOrigin: (id: string) => fetchApi<OriginApi>(`/perks/origins/${id}`),

  // Survivor Traits
  getSurvivorTraits: () => fetchApi<SurvivorTraitApi[]>('/perks/survivor-traits'),
  getSurvivorTrait: (id: string) => fetchApi<SurvivorTraitApi>(`/perks/survivor-traits/${id}`),
};

// ===== EQUIPMENT PACKS API =====

export interface EquipmentPackItemApi {
  // For direct items
  itemId?: number;
  itemName?: string;
  itemType?: ItemType;
  itemNameKey?: string;
  quantity?: number;
  quantityCD?: number;
  location?: string;
  ammoType?: string;
  // For choice groups
  isChoice?: boolean;
  options?: {
    itemId: number;
    itemName: string;
    itemType: ItemType;
    itemNameKey?: string;
    quantity?: number;
    quantityCD?: number;
    location?: string;
    ammoType?: string;
  }[];
  choiceCount?: number;
}

export interface EquipmentPackApi {
  id: string;
  nameKey: string;
  descriptionKey: string;
  items: EquipmentPackItemApi[];
}

export interface TagSkillBonusDirectApi {
  itemId: number;
  itemName: string;
  itemType: ItemType;
  itemNameKey?: string;
  quantity?: number;
  quantityCD?: number;
}

export type TagSkillBonusEntryApi = TagSkillBonusDirectApi | {
  isChoice: true;
  options: TagSkillBonusDirectApi[];
};

export interface LevelBonusApi {
  minLevel: number;
  maxLevel: number;
  baseCaps: number;
  bonusCapsCD: number;
  maxRarity: number;
}

export const equipmentPacksApi = {
  list: () => fetchApi<EquipmentPackApi[]>('/equipment-packs'),
  get: (id: string) => fetchApi<EquipmentPackApi>(`/equipment-packs/${id}`),
  getForOrigin: (originId: string) => fetchApi<EquipmentPackApi[]>(`/equipment-packs/origin/${originId}`),

  // Robot arms
  getRobotArms: () => fetchApi<{ id: string; nameKey: string }[]>('/equipment-packs/robot-arms'),

  // Tag skill bonuses
  getTagSkillBonuses: () => fetchApi<Record<string, TagSkillBonusEntryApi[]>>('/equipment-packs/tag-skill-bonuses'),
  getTagSkillBonus: (skill: string) => fetchApi<TagSkillBonusEntryApi[]>(`/equipment-packs/tag-skill-bonuses/${skill}`),

  // Level bonuses
  getLevelBonuses: () => fetchApi<LevelBonusApi[]>('/equipment-packs/level-bonuses'),
  getLevelBonus: (level: number) => fetchApi<LevelBonusApi>(`/equipment-packs/level-bonuses/${level}`),
};

// ===== SESSIONS API =====

export type SessionStatus = 'active' | 'paused' | 'completed';
export type CombatantStatus = 'active' | 'unconscious' | 'dead' | 'fled';

export interface SessionParticipantCharacter {
  id: number;
  name: string;
  type: 'pc' | 'npc';
  level: number;
  originId?: string;
  maxHp: number;
  currentHp: number;
  defense: number;
  initiative: number;
  radiationDamage: number;
  maxLuckPoints: number;
  currentLuckPoints: number;
  special: Record<string, number>;
  conditions: string[];
}

export interface SessionParticipantApi {
  id: number;
  sessionId: number;
  characterId: number;
  turnOrder: number | null;
  combatStatus: CombatantStatus;
  character: SessionParticipantCharacter;
}

export interface SessionApi {
  id: number;
  name: string;
  description?: string;
  status: SessionStatus;
  groupAP: number;
  maxGroupAP: number;
  gmAP: number;
  combatActive: boolean;
  currentRound: number;
  currentTurnIndex: number;
  createdAt: string;
  updatedAt: string;
  participants: SessionParticipantApi[];
}

export interface CreateSessionData {
  name: string;
  description?: string;
  maxGroupAP?: number;
}

export interface UpdateSessionData {
  name?: string;
  description?: string;
  status?: SessionStatus;
  groupAP?: number;
  maxGroupAP?: number;
}

export interface AddQuickNpcData {
  name?: string;
  level?: number;
  maxHp?: number;
  defense?: number;
  initiative?: number;
}

export const sessionsApi = {
  // Session CRUD
  list: (filters?: { status?: SessionStatus; full?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.full) params.set('full', 'true');
    const query = params.toString();
    return fetchApi<SessionApi[]>(`/sessions${query ? `?${query}` : ''}`);
  },
  get: (id: number) => fetchApi<SessionApi>(`/sessions/${id}`),
  create: (data: CreateSessionData) =>
    fetchApi<SessionApi>('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: UpdateSessionData) =>
    fetchApi<SessionApi>(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchApi<null>(`/sessions/${id}`, {
      method: 'DELETE',
    }),

  // Participants
  addParticipant: (sessionId: number, characterId: number) =>
    fetchApi<SessionParticipantApi>(`/sessions/${sessionId}/participants`, {
      method: 'POST',
      body: JSON.stringify({ characterId }),
    }),
  addQuickNpc: (sessionId: number, data: AddQuickNpcData) =>
    fetchApi<SessionParticipantApi>(`/sessions/${sessionId}/participants/quick`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  removeParticipant: (sessionId: number, participantId: number) =>
    fetchApi<null>(`/sessions/${sessionId}/participants/${participantId}`, {
      method: 'DELETE',
    }),
  setCombatStatus: (sessionId: number, participantId: number, combatStatus: CombatantStatus) =>
    fetchApi<SessionParticipantApi>(`/sessions/${sessionId}/participants/${participantId}/combat-status`, {
      method: 'PUT',
      body: JSON.stringify({ combatStatus }),
    }),
  setInitiative: (sessionId: number, participantId: number, turnOrder: number) =>
    fetchApi<SessionParticipantApi>(`/sessions/${sessionId}/participants/${participantId}/initiative`, {
      method: 'PUT',
      body: JSON.stringify({ turnOrder }),
    }),

  // Combat
  startCombat: (sessionId: number) =>
    fetchApi<SessionApi>(`/sessions/${sessionId}/combat/start`, {
      method: 'POST',
    }),
  endCombat: (sessionId: number) =>
    fetchApi<SessionApi>(`/sessions/${sessionId}/combat/end`, {
      method: 'POST',
    }),
  nextTurn: (sessionId: number) =>
    fetchApi<SessionApi>(`/sessions/${sessionId}/combat/next-turn`, {
      method: 'POST',
    }),
  prevTurn: (sessionId: number) =>
    fetchApi<SessionApi>(`/sessions/${sessionId}/combat/prev-turn`, {
      method: 'POST',
    }),

  // Group AP (players)
  updateGroupAP: (sessionId: number, data: { groupAP?: number; maxGroupAP?: number }) =>
    fetchApi<SessionApi>(`/sessions/${sessionId}/ap`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // GM AP
  updateGmAP: (sessionId: number, gmAP: number) =>
    fetchApi<SessionApi>(`/sessions/${sessionId}/gm-ap`, {
      method: 'PUT',
      body: JSON.stringify({ gmAP }),
    }),
};

// ===== GENERATORS API =====

export type LootCategory =
  | 'Ammunition' | 'Armor' | 'Clothing' | 'Food' | 'Beverages'
  | 'Chems' | 'Melee Weapons' | 'Ranged Weapons' | 'Thrown/Explosives'
  | 'Oddities/Valuables' | 'Junk';

export type MerchantCategory =
  | 'Weapons' | 'Ammunition' | 'Armor' | 'Power Armor'
  | 'Clothing' | 'Chems' | 'Food/Drink' | 'General Goods';

export interface GeneratedLootItem {
  itemId: number;
  name: string;
  nameKey: string | null;
  itemType: string;
  quantity: number;
  value: number;
  weight: number;
  rarity: number;
  category: LootCategory;
}

export interface LootResultApi {
  areaType: string;
  areaSize: string;
  locationLevel: number;
  maxRarity: number;
  items: GeneratedLootItem[];
  totalValue: number;
  totalWeight: number;
}

export interface GeneratedMerchantItem {
  itemId: number;
  name: string;
  nameKey: string | null;
  itemType: string;
  quantity: number;
  value: number;
  weight: number;
  rarity: number;
  category: MerchantCategory;
}

export interface MerchantResultApi {
  wealthRating: number;
  isTraveling: boolean;
  availableCaps: number;
  items: GeneratedMerchantItem[];
  totalValue: number;
}

export const generatorsApi = {
  generateLoot: (params: {
    areaType: string;
    areaSize: string;
    locationLevel: number;
    apSpend: Partial<Record<LootCategory, number>>;
  }) =>
    fetchApi<LootResultApi>('/generate/loot', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  generateMerchant: (params: {
    wealthRating: number;
    isTraveling: boolean;
    categories: MerchantCategory[];
  }) =>
    fetchApi<MerchantResultApi>('/generate/merchant', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  getScavengingTables: () =>
    fetchApi<{
      tables: Record<string, Record<string, Record<string, { min: number; max: number }>>>;
      areaTypes: string[];
      areaSizes: string[];
      lootCategories: string[];
      discoveryDegrees: { id: string; difficulty: number }[];
      merchantCategories: string[];
      merchantCapsByWealth: number[];
    }>('/generate/scavenging-tables'),
};

// ===== HEALTH CHECK =====

export const healthApi = {
  check: () => fetchApi<{ status: string; timestamp: string }>('/health'),
};
