import type { OriginId, SkillName } from './characters';

// ===== TYPES =====

export type EquipmentCategory =
  | 'weapon'
  | 'armor'
  | 'robotArmor'
  | 'clothing'
  | 'ammo'
  | 'chem'
  | 'food'
  | 'misc'
  | 'caps';

export interface EquipmentItem {
  /** Item name (matches name in weapons.ts, armor.ts, etc.) */
  itemName: string;
  category: EquipmentCategory;
  /** Base quantity */
  quantity?: number;
  /** Combat Dice bonus to add to quantity (rolled when generating) */
  quantityCD?: number;
  /** For items that cover a location (left/right arm/leg) */
  location?: 'left' | 'right' | 'choice';
}

export interface EquipmentChoice {
  /** Multiple items to choose from */
  options: EquipmentItem[];
  /** Number of items to choose (default 1) */
  choiceCount?: number;
}

export type EquipmentEntry = EquipmentItem | EquipmentChoice;

export function isEquipmentChoice(entry: EquipmentEntry): entry is EquipmentChoice {
  return 'options' in entry;
}

export interface EquipmentPack {
  id: string;
  nameKey: string;
  descriptionKey: string;
  items: EquipmentEntry[];
}

export interface OriginEquipmentPacks {
  originId: OriginId;
  packs: EquipmentPack[];
}

// Robot arm attachments (for Mister Handy variants)
export interface RobotArmAttachment {
  id: string;
  nameKey: string;
}

export const ROBOT_ARM_ATTACHMENTS: RobotArmAttachment[] = [
  { id: 'pincer', nameKey: 'equipment.robotArms.pincer' },
  { id: 'flamer', nameKey: 'equipment.robotArms.flamer' },
  { id: 'circularSaw', nameKey: 'equipment.robotArms.circularSaw' },
  { id: 'emitter', nameKey: 'equipment.robotArms.emitter' },
  { id: 'laserEmitter', nameKey: 'equipment.robotArms.laserEmitter' },
  { id: '10mmPistol', nameKey: 'equipment.robotArms.10mmPistol' },
];

// ===== EQUIPMENT PACKS BY ORIGIN =====

export const EQUIPMENT_PACKS: OriginEquipmentPacks[] = [
  // ===== CONFRÉRIE DE L'ACIER =====
  {
    originId: 'brotherhood',
    packs: [
      {
        id: 'brotherhood_initiate',
        nameKey: 'equipment.packs.brotherhood_initiate',
        descriptionKey: 'equipment.packs.brotherhood_initiate_desc',
        items: [
          { itemName: 'Brotherhood of Steel Uniform', category: 'clothing' },
          { itemName: 'Brotherhood of Steel Hood', category: 'clothing' },
          { itemName: 'Combat Knife', category: 'weapon' },
          {
            options: [
              { itemName: 'Laser Pistol', category: 'weapon' },
              { itemName: '10mm Pistol', category: 'weapon' },
            ],
          },
          {
            options: [
              { itemName: 'Fusion Cells', category: 'ammo', quantity: 10, quantityCD: 5 },
              { itemName: '10mm Rounds', category: 'ammo', quantity: 10, quantityCD: 5 },
            ],
          },
          { itemName: 'Holotags', category: 'misc' },
        ],
      },
      {
        id: 'brotherhood_scribe',
        nameKey: 'equipment.packs.brotherhood_scribe',
        descriptionKey: 'equipment.packs.brotherhood_scribe_desc',
        items: [
          { itemName: 'Brotherhood Field Scribe Armor', category: 'clothing' },
          { itemName: 'Brotherhood Field Scribe Hat', category: 'clothing' },
          { itemName: 'Combat Knife', category: 'weapon' },
          {
            options: [
              { itemName: 'Laser Pistol', category: 'weapon' },
              { itemName: '10mm Pistol', category: 'weapon' },
            ],
          },
          {
            options: [
              { itemName: 'Fusion Cells', category: 'ammo', quantity: 6, quantityCD: 3 },
              { itemName: '10mm Rounds', category: 'ammo', quantity: 6, quantityCD: 3 },
            ],
          },
          { itemName: 'Holotags', category: 'misc' },
        ],
      },
    ],
  },

  // ===== MISTER HANDY =====
  {
    originId: 'misterHandy',
    packs: [
      {
        id: 'miss_nanny',
        nameKey: 'equipment.packs.miss_nanny',
        descriptionKey: 'equipment.packs.miss_nanny_desc',
        items: [
          // 3 robot arms: pincer, flamer, and one choice
          { itemName: 'Robot Arm - Pincer', category: 'misc' },
          { itemName: 'Robot Arm - Flamer', category: 'misc' },
          {
            options: [
              { itemName: 'Robot Arm - Circular Saw', category: 'misc' },
              { itemName: 'Robot Arm - Emitter', category: 'misc' },
            ],
          },
          { itemName: 'Standard Plating', category: 'robotArmor' },
          { itemName: 'Behavioral Analysis Module', category: 'misc' },
          { itemName: 'Threat Detection Module', category: 'misc' },
          { itemName: 'Caps', category: 'caps', quantity: 10 },
        ],
      },
      {
        id: 'mister_farmhand',
        nameKey: 'equipment.packs.mister_farmhand',
        descriptionKey: 'equipment.packs.mister_farmhand_desc',
        items: [
          { itemName: 'Robot Arm - Pincer', category: 'misc' },
          { itemName: 'Robot Arm - Circular Saw', category: 'misc' },
          { itemName: 'Robot Arm - Emitter', category: 'misc' },
          { itemName: 'Standard Plating', category: 'robotArmor' },
          { itemName: 'Fertilizer Bag', category: 'misc' },
          { itemName: 'Mutfruit', category: 'food', quantity: 2 },
          { itemName: 'Caps', category: 'caps', quantity: 25 },
        ],
      },
      {
        id: 'mister_gutsy',
        nameKey: 'equipment.packs.mister_gutsy',
        descriptionKey: 'equipment.packs.mister_gutsy_desc',
        items: [
          { itemName: 'Robot Arm - 10mm Auto Pistol', category: 'misc' },
          { itemName: 'Robot Arm - Circular Saw', category: 'misc' },
          { itemName: 'Robot Arm - Laser Emitter', category: 'misc' },
          { itemName: 'Mister Gutsy Plating', category: 'robotArmor' },
          { itemName: 'Recon Sensor Module', category: 'misc' },
          { itemName: 'Caps', category: 'caps', quantity: 10 },
        ],
      },
      {
        id: 'mister_handy',
        nameKey: 'equipment.packs.mister_handy',
        descriptionKey: 'equipment.packs.mister_handy_desc',
        items: [
          { itemName: 'Robot Arm - Pincer', category: 'misc' },
          { itemName: 'Robot Arm - Flamer', category: 'misc' },
          { itemName: 'Robot Arm - Circular Saw', category: 'misc' },
          { itemName: 'Standard Plating', category: 'robotArmor' },
          { itemName: 'Robot Repair Kit', category: 'misc' },
          { itemName: 'Built-in Kettle Module', category: 'misc' },
          { itemName: 'Caps', category: 'caps', quantity: 10 },
        ],
      },
      {
        id: 'nurse_handy',
        nameKey: 'equipment.packs.nurse_handy',
        descriptionKey: 'equipment.packs.nurse_handy_desc',
        items: [
          {
            options: [
              { itemName: 'Robot Arm - Pincer', category: 'misc' },
              { itemName: 'Robot Arm - Circular Saw', category: 'misc' },
            ],
          },
          { itemName: 'Robot Arm - Circular Saw', category: 'misc' },
          {
            options: [
              { itemName: 'Robot Arm - Pincer', category: 'misc' },
              { itemName: 'Robot Arm - Circular Saw', category: 'misc' },
              { itemName: 'Robot Arm - Emitter', category: 'misc' },
            ],
          },
          { itemName: 'Standard Plating', category: 'robotArmor' },
          { itemName: 'Stimpak', category: 'chem' },
          { itemName: 'Diagnostic Module', category: 'misc' },
          { itemName: 'Caps', category: 'caps', quantity: 10 },
        ],
      },
    ],
  },

  // ===== SUPER MUTANT =====
  {
    originId: 'superMutant',
    packs: [
      {
        id: 'skirmisher',
        nameKey: 'equipment.packs.skirmisher',
        descriptionKey: 'equipment.packs.skirmisher_desc',
        items: [
          { itemName: 'Raider Chest Piece', category: 'armor' },
          {
            options: [
              { itemName: 'Raider Leg', category: 'armor', location: 'choice' },
              { itemName: 'Raider Arm', category: 'armor', location: 'choice' },
            ],
          },
          { itemName: 'Pipe Bolt-Action', category: 'weapon' },
          { itemName: '.308 Rounds', category: 'ammo', quantity: 8, quantityCD: 4 },
          { itemName: 'Board', category: 'weapon' },
          { itemName: 'Caps', category: 'caps', quantity: 5 },
        ],
      },
      {
        id: 'bruiser',
        nameKey: 'equipment.packs.bruiser',
        descriptionKey: 'equipment.packs.bruiser_desc',
        items: [
          { itemName: 'Raider Chest Piece', category: 'armor' },
          {
            options: [
              { itemName: 'Raider Leg', category: 'armor', location: 'choice' },
              { itemName: 'Raider Arm', category: 'armor', location: 'choice' },
            ],
          },
          { itemName: 'Pipe Gun', category: 'weapon' },
          { itemName: '.38 Rounds', category: 'ammo', quantity: 6, quantityCD: 3 },
          {
            options: [
              { itemName: 'Baseball Bat', category: 'weapon' },
              { itemName: 'Machete', category: 'weapon' },
            ],
          },
          { itemName: 'Caps', category: 'caps', quantity: 5 },
        ],
      },
    ],
  },

  // ===== HABITANT DE L'ABRI =====
  {
    originId: 'vaultDweller',
    packs: [
      {
        id: 'vault_security',
        nameKey: 'equipment.packs.vault_security',
        descriptionKey: 'equipment.packs.vault_security_desc',
        items: [
          { itemName: 'Vault Jumpsuit', category: 'clothing' },
          { itemName: 'Vault-Tec Security Armor', category: 'armor' },
          { itemName: 'Vault-Tec Security Helmet', category: 'armor' },
          { itemName: 'Purified Water', category: 'food' },
          { itemName: 'Pip-Boy', category: 'misc' },
          { itemName: 'Baton', category: 'weapon' },
          { itemName: '10mm Pistol', category: 'weapon' },
          { itemName: '10mm Rounds', category: 'ammo', quantity: 8, quantityCD: 4 },
          { itemName: 'Stimpak', category: 'chem' },
        ],
      },
      {
        id: 'vault_resident',
        nameKey: 'equipment.packs.vault_resident',
        descriptionKey: 'equipment.packs.vault_resident_desc',
        items: [
          { itemName: 'Vault Jumpsuit', category: 'clothing' },
          { itemName: 'Purified Water', category: 'food' },
          { itemName: 'Pip-Boy', category: 'misc' },
          { itemName: 'Switchblade', category: 'weapon' },
          { itemName: '10mm Pistol', category: 'weapon' },
          { itemName: '10mm Rounds', category: 'ammo', quantity: 6, quantityCD: 3 },
          { itemName: 'Stimpak', category: 'chem', quantity: 2 },
          { itemName: 'Caps', category: 'caps', quantity: 10 },
        ],
      },
    ],
  },

  // ===== GOULE (utilise les mêmes packs que Survivant) =====
  {
    originId: 'ghoul',
    packs: [], // Will reference wasteland packs
  },

  // ===== SURVIVANT (Habitant des Terres Désolées) =====
  {
    originId: 'survivor',
    packs: [], // Will reference wasteland packs
  },
];

// Packs communs pour Goule et Survivant (Habitant des Terres Désolées)
export const WASTELAND_PACKS: EquipmentPack[] = [
  {
    id: 'settler',
    nameKey: 'equipment.packs.settler',
    descriptionKey: 'equipment.packs.settler_desc',
    items: [
      { itemName: 'Sturdy Clothes', category: 'clothing' },
      {
        options: [
          { itemName: 'Switchblade', category: 'weapon' },
          { itemName: 'Pipe Wrench', category: 'weapon' },
          { itemName: 'Rolling Pin', category: 'weapon' },
          { itemName: 'Knuckles', category: 'weapon' },
        ],
      },
      { itemName: 'Pipe Gun', category: 'weapon' },
      { itemName: '.38 Rounds', category: 'ammo', quantity: 6, quantityCD: 3 },
      { itemName: 'Caps', category: 'caps', quantity: 45 },
    ],
  },
  {
    id: 'merchant',
    nameKey: 'equipment.packs.merchant',
    descriptionKey: 'equipment.packs.merchant_desc',
    items: [
      { itemName: 'Sturdy Clothes', category: 'clothing' },
      { itemName: 'Leather Chest Piece', category: 'armor' },
      {
        options: [
          { itemName: 'Leather Arm', category: 'armor', location: 'left' },
          { itemName: 'Leather Leg', category: 'armor', location: 'left' },
        ],
        choiceCount: 2, // Choose arm OR leg+leg, interpreted as 2 pieces
      },
      { itemName: 'Pipe Gun', category: 'weapon' },
      { itemName: '.38 Rounds', category: 'ammo', quantity: 8, quantityCD: 4 },
      { itemName: 'Pack Brahmin', category: 'misc', quantity: 2 },
      { itemName: 'Caps', category: 'caps', quantity: 50 },
    ],
  },
  {
    id: 'mercenary',
    nameKey: 'equipment.packs.mercenary',
    descriptionKey: 'equipment.packs.mercenary_desc',
    items: [
      { itemName: 'Sturdy Clothes', category: 'clothing' },
      { itemName: 'Leather Chest Piece', category: 'armor' },
      {
        options: [
          { itemName: 'Leather Arm', category: 'armor', location: 'left' },
          { itemName: 'Leather Leg', category: 'armor', location: 'left' },
        ],
        choiceCount: 2,
      },
      {
        options: [
          { itemName: 'Machete', category: 'weapon' },
          { itemName: 'Baseball Bat', category: 'weapon' },
          { itemName: 'Tire Iron', category: 'weapon' },
        ],
      },
      {
        options: [
          { itemName: '10mm Pistol', category: 'weapon' },
          { itemName: '.44 Pistol', category: 'weapon' },
          { itemName: 'Hunting Rifle', category: 'weapon' },
          { itemName: 'Pipe Bolt-Action', category: 'weapon' },
        ],
      },
      { itemName: 'Caps', category: 'caps', quantity: 15 },
    ],
  },
  {
    id: 'raider',
    nameKey: 'equipment.packs.raider',
    descriptionKey: 'equipment.packs.raider_desc',
    items: [
      { itemName: 'Harness', category: 'clothing' },
      { itemName: 'Raider Chest Piece', category: 'armor' },
      { itemName: 'Raider Arm', category: 'armor', location: 'choice' },
      {
        options: [
          { itemName: 'Lead Pipe', category: 'weapon' },
          { itemName: 'Pool Cue', category: 'weapon' },
          { itemName: 'Tire Iron', category: 'weapon' },
        ],
      },
      { itemName: 'Pipe Gun', category: 'weapon' },
      { itemName: '.38 Rounds', category: 'ammo', quantity: 10, quantityCD: 5 },
      {
        options: [
          { itemName: 'Jet', category: 'chem' },
          { itemName: 'RadAway', category: 'chem' },
        ],
      },
      {
        options: [
          { itemName: 'Molotov Cocktail', category: 'weapon' },
          { itemName: 'Stimpak', category: 'chem' },
        ],
      },
      { itemName: 'Caps', category: 'caps', quantity: 15 },
    ],
  },
  {
    id: 'wanderer',
    nameKey: 'equipment.packs.wanderer',
    descriptionKey: 'equipment.packs.wanderer_desc',
    items: [
      { itemName: 'Nomad Outfit', category: 'clothing' },
      {
        options: [
          { itemName: 'Switchblade', category: 'weapon' },
          { itemName: 'Pipe Wrench', category: 'weapon' },
          { itemName: 'Rolling Pin', category: 'weapon' },
          { itemName: 'Knuckles', category: 'weapon' },
        ],
      },
      { itemName: 'Pipe Gun', category: 'weapon' },
      { itemName: '.38 Rounds', category: 'ammo', quantity: 8, quantityCD: 4 },
      {
        options: [
          { itemName: 'Jet', category: 'chem' },
          { itemName: 'RadAway', category: 'chem' },
        ],
      },
      { itemName: 'Caps', category: 'caps', quantity: 30 },
    ],
  },
];

// ===== TAG SKILL BONUS ITEMS =====

export interface TagSkillBonusItemEntry {
  itemName: string;
  category: EquipmentCategory;
  quantity?: number;
  quantityCD?: number;
  /** Items sharing the same choiceGroup number within a skill form a "pick one" group */
  choiceGroup?: number;
}

export interface TagSkillBonusItem {
  skill: SkillName;
  items: TagSkillBonusItemEntry[];
}

export const TAG_SKILL_BONUS_ITEMS: TagSkillBonusItem[] = [
  {
    skill: 'energyWeapons',
    items: [{ itemName: 'Fusion Cells', category: 'ammo', quantity: 6, quantityCD: 3 }],
  },
  {
    skill: 'meleeWeapons',
    items: [
      // choiceGroup 1: pick one melee weapon
      { itemName: 'Machete', category: 'weapon', choiceGroup: 1 },
      { itemName: 'Baseball Bat', category: 'weapon', choiceGroup: 1 },
    ],
  },
  {
    skill: 'smallGuns',
    items: [
      // choiceGroup 1: pick one ammo type (matching weapon from pack)
      { itemName: '.38 Rounds', category: 'ammo', quantity: 6, quantityCD: 3, choiceGroup: 1 },
      { itemName: '10mm Rounds', category: 'ammo', quantity: 6, quantityCD: 3, choiceGroup: 1 },
      { itemName: '.308 Rounds', category: 'ammo', quantity: 6, quantityCD: 3, choiceGroup: 1 },
      { itemName: '.45 Rounds', category: 'ammo', quantity: 6, quantityCD: 3, choiceGroup: 1 },
      { itemName: 'Shotgun Shells', category: 'ammo', quantity: 6, quantityCD: 3, choiceGroup: 1 },
    ],
  },
  {
    skill: 'bigGuns',
    items: [{ itemName: 'Flamer Fuel', category: 'ammo', quantity: 4, quantityCD: 2 }],
  },
  {
    skill: 'athletics',
    items: [
      { itemName: 'Casual Clothes', category: 'clothing' },
      { itemName: 'Buffout', category: 'chem' },
    ],
  },
  {
    skill: 'lockpick',
    items: [{ itemName: 'Bobby Pin', category: 'misc', quantity: 4, quantityCD: 2 }],
  },
  {
    skill: 'speech',
    items: [
      { itemName: 'Fancy Clothes', category: 'clothing' },
      { itemName: 'Fancy Hat', category: 'clothing' },
    ],
  },
  {
    skill: 'sneak',
    items: [{ itemName: 'Calmex', category: 'chem' }],
  },
  {
    skill: 'explosives',
    items: [
      // choiceGroup 1: pick one explosive type
      { itemName: 'Molotov Cocktail', category: 'weapon', quantity: 2, choiceGroup: 1 },
      { itemName: 'Frag Grenade', category: 'weapon', quantity: 2, choiceGroup: 1 },
    ],
  },
  {
    skill: 'unarmed',
    items: [{ itemName: 'Knuckles', category: 'weapon' }],
  },
  {
    skill: 'medicine',
    items: [
      { itemName: 'First Aid Kit', category: 'misc' },
      { itemName: 'Stimpak', category: 'chem' },
    ],
  },
  {
    skill: 'pilot',
    items: [
      // Mechanical parts = 5 common scrap
      { itemName: 'Common Materials', category: 'misc', quantity: 5 },
    ],
  },
  {
    skill: 'throwing',
    items: [
      // choiceGroup 1: pick one thrown weapon
      { itemName: 'Throwing Knife', category: 'weapon', quantity: 4, quantityCD: 2, choiceGroup: 1 },
      { itemName: 'Tomahawk', category: 'weapon', quantity: 2, quantityCD: 1, choiceGroup: 1 },
    ],
  },
  {
    skill: 'repair',
    items: [{ itemName: 'Multi-Tool', category: 'misc' }],
  },
  {
    skill: 'science',
    items: [
      { itemName: 'Lab Coat', category: 'clothing' },
      { itemName: 'Mentats', category: 'chem' },
    ],
  },
  {
    skill: 'survival',
    items: [
      { itemName: 'Purified Water', category: 'food', quantity: 2 },
      { itemName: 'Iguana on a Stick', category: 'food' },
    ],
  },
  // barter: 2d20 extra caps - handled in frontend (not DB items)
];

// ===== HIGHER LEVEL STARTING CAPS =====

export interface LevelBonusCaps {
  level: number;
  caps: number;
  maxRarity: number;
}

export const LEVEL_BONUS_CAPS: LevelBonusCaps[] = [
  { level: 2, caps: 100, maxRarity: 1 },
  { level: 3, caps: 250, maxRarity: 1 },
  { level: 4, caps: 450, maxRarity: 1 },
  { level: 5, caps: 700, maxRarity: 2 },
  { level: 6, caps: 1000, maxRarity: 2 },
  { level: 7, caps: 1350, maxRarity: 2 },
  { level: 8, caps: 1750, maxRarity: 2 },
  { level: 9, caps: 2200, maxRarity: 3 },
  { level: 10, caps: 2700, maxRarity: 3 },
  { level: 11, caps: 3250, maxRarity: 3 },
  { level: 12, caps: 3850, maxRarity: 3 },
  { level: 13, caps: 4500, maxRarity: 4 },
  { level: 14, caps: 5200, maxRarity: 4 },
  { level: 15, caps: 5950, maxRarity: 4 },
  { level: 16, caps: 6750, maxRarity: 4 },
  { level: 17, caps: 7600, maxRarity: 5 },
  { level: 18, caps: 8500, maxRarity: 5 },
  { level: 19, caps: 9450, maxRarity: 5 },
  { level: 20, caps: 10450, maxRarity: 5 },
  // Level 21+: level * 50, all rarities
];

export function getLevelBonusCaps(level: number): LevelBonusCaps {
  if (level <= 1) {
    return { level: 1, caps: 0, maxRarity: 0 };
  }
  if (level >= 21) {
    return { level, caps: level * 50, maxRarity: 6 };
  }
  return LEVEL_BONUS_CAPS.find((b) => b.level === level) ?? { level, caps: 0, maxRarity: 0 };
}

// ===== HELPER FUNCTIONS =====

/**
 * Get equipment packs for an origin
 */
export function getPacksForOrigin(originId: OriginId): EquipmentPack[] {
  // Ghoul and Survivor use wasteland packs
  if (originId === 'ghoul' || originId === 'survivor') {
    return WASTELAND_PACKS;
  }

  const originPacks = EQUIPMENT_PACKS.find((op) => op.originId === originId);
  return originPacks?.packs ?? [];
}

/**
 * Get tag skill bonus items for a skill
 */
export function getTagSkillBonusItems(skill: SkillName): TagSkillBonusItemEntry[] {
  const bonus = TAG_SKILL_BONUS_ITEMS.find((b) => b.skill === skill);
  return bonus?.items ?? [];
}

/**
 * Roll Combat Dice for quantity
 * Returns base quantity + number of effects rolled (1-2 on each d6)
 */
export function rollQuantityCD(base: number, cdCount: number): number {
  let total = base;
  for (let i = 0; i < cdCount; i++) {
    const roll = Math.floor(Math.random() * 6) + 1;
    if (roll <= 2) {
      total += 1;
    }
  }
  return total;
}

// ===== PERSONAL TRINKETS TABLE =====

export const PERSONAL_TRINKETS: string[] = [
  'Gold Pocket Watch',
  'Corrupted Holodisk',
  'Colorful Bandana',
  'Silver Medallion',
  'Medal',
  'Potted Plant',
  'Pre-War Event Tickets',
  'Wedding Ring',
  'Pre-War Party Invitation',
  'Engraved Lighter',
  'Loaded Casino Die',
  'ID Card',
  'Cosmetics Case',
  'Musical Instrument',
  'Broken Glasses',
  'Junk Necklace',
  'Unfinished Story Pages',
  'Overdue Library Book',
  'Postcard with Address',
  'Pre-War Tie',
];

export function rollPersonalTrinket(): string {
  const roll = Math.floor(Math.random() * 20);
  return PERSONAL_TRINKETS[roll];
}
