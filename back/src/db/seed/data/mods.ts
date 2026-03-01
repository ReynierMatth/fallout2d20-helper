export type ModSlot =
  | 'culasse' | 'canon' | 'chargeur' | 'poignee' | 'crosse' | 'viseur' | 'bouche'
  | 'condensateur'
  | 'material' | 'functionality'
  | 'improvement'
  | 'modification'
  | 'internal';

export type ModApplicableTo =
  | 'smallGuns' | 'energyWeapons' | 'bigGuns' | 'meleeWeapons' | 'unarmed'
  | 'armor' | 'clothing' | 'robot';

export type ModEffectType =
  | 'damageBonus' | 'fireRateBonus' | 'rangeChange'
  | 'gainQuality' | 'loseQuality'
  | 'setDamage' | 'setAmmo' | 'setFireRate'
  | 'special';

export interface ModEffectEntry {
  effectType: ModEffectType;
  numericValue?: number;
  qualityName?: string;
  qualityValue?: number;
  ammoType?: string;
  descriptionKey?: string;
}

export interface ModEntry {
  name: string;
  nameKey?: string;
  slot: ModSlot;
  applicableTo: ModApplicableTo;
  /** Text appended to the item name when installed (null = no name change) */
  nameAddKey?: string;
  /** Weight delta on the target item when installed (can be negative) */
  weightChange: number;
  /** Cost of this mod as an item */
  cost: number;
  requiredPerk?: string;
  requiredPerkRank?: number;
  effects: ModEffectEntry[];
}

// ===== MODS DES ARMES LÉGÈRES (Small Guns) =====
// All small guns mods use the Réparation skill + optional perk to install.

export const SMALL_GUNS_MODS: ModEntry[] = [

  // ----- MODS DE CULASSE -----
  {
    name: 'Renforcée', slot: 'culasse', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.culasse.renforcee.nameAdd',
    weightChange: 0, cost: 20,
    effects: [{ effectType: 'damageBonus', numericValue: 1 }],
  },
  {
    name: 'Puissante', slot: 'culasse', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.culasse.puissante.nameAdd',
    weightChange: 0.5, cost: 25, requiredPerk: 'gunNut', requiredPerkRank: 1,
    effects: [{ effectType: 'damageBonus', numericValue: 2 }],
  },
  {
    name: 'Avancée', slot: 'culasse', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.culasse.avancee.nameAdd',
    weightChange: 1, cost: 35, requiredPerk: 'gunNut', requiredPerkRank: 2,
    effects: [
      { effectType: 'damageBonus', numericValue: 3 },
      { effectType: 'fireRateBonus', numericValue: 1 },
    ],
  },
  {
    name: 'Calibrée', slot: 'culasse', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.culasse.calibree.nameAdd',
    weightChange: 0, cost: 25,
    effects: [{ effectType: 'gainQuality', qualityName: 'vicious' }],
  },
  {
    name: 'Automatique', slot: 'culasse', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.culasse.automatique.nameAdd',
    weightChange: 0.5, cost: 30, requiredPerk: 'gunNut', requiredPerkRank: 1,
    effects: [
      { effectType: 'damageBonus', numericValue: -1 },
      { effectType: 'fireRateBonus', numericValue: 2 },
      { effectType: 'gainQuality', qualityName: 'burst' },
      { effectType: 'gainQuality', qualityName: 'inaccurate' },
    ],
  },
  {
    name: 'Haute sensibilité', slot: 'culasse', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.culasse.hauteSensibilite.nameAdd',
    weightChange: 0, cost: 20, requiredPerk: 'gunNut', requiredPerkRank: 2,
    effects: [{ effectType: 'fireRateBonus', numericValue: 1 }],
  },
  {
    name: 'Culasse .38', slot: 'culasse', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.culasse.culasse38.nameAdd',
    weightChange: 1.5, cost: 20, requiredPerk: 'gunNut', requiredPerkRank: 4,
    effects: [
      { effectType: 'setDamage', numericValue: 4 },
      { effectType: 'setAmmo', ammoType: '.38' },
    ],
  },
  {
    name: 'Culasse .308', slot: 'culasse', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.culasse.culasse308.nameAdd',
    weightChange: 2, cost: 40, requiredPerk: 'gunNut', requiredPerkRank: 4,
    effects: [
      { effectType: 'setDamage', numericValue: 7 },
      { effectType: 'setAmmo', ammoType: '.308' },
    ],
  },
  {
    name: 'Culasse .45', slot: 'culasse', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.culasse.culasse45.nameAdd',
    weightChange: 1, cost: 19, requiredPerk: 'gunNut', requiredPerkRank: 2,
    effects: [
      { effectType: 'setDamage', numericValue: 4 },
      { effectType: 'fireRateBonus', numericValue: 1 },
      { effectType: 'setAmmo', ammoType: '.45' },
    ],
  },
  {
    name: 'Culasse .50', slot: 'culasse', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.culasse.culasse50.nameAdd',
    weightChange: 2, cost: 30, requiredPerk: 'gunNut', requiredPerkRank: 4,
    effects: [
      { effectType: 'setDamage', numericValue: 8 },
      { effectType: 'gainQuality', qualityName: 'vicious' },
      { effectType: 'setAmmo', ammoType: '.50' },
    ],
  },
  {
    name: 'Culasse perforante', slot: 'culasse', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.culasse.culassePerforante.nameAdd',
    weightChange: 0.5, cost: 25, requiredPerk: 'gunNut', requiredPerkRank: 1,
    effects: [{ effectType: 'gainQuality', qualityName: 'piercing', qualityValue: 1 }],
  },
  {
    name: 'Culasse rapide', slot: 'culasse', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.culasse.culasseRapide.nameAdd',
    weightChange: 0, cost: 15, requiredPerk: 'gunNut', requiredPerkRank: 1,
    effects: [{ effectType: 'fireRateBonus', numericValue: 1 }],
  },
  {
    name: 'Culasse optimisée', slot: 'culasse', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.culasse.culasseOptimisee.nameAdd',
    weightChange: 0, cost: 20,
    effects: [{ effectType: 'fireRateBonus', numericValue: 1 }],
  },
  {
    name: 'Culasse automatique à piston', slot: 'culasse', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.culasse.culasseAutoPiston.nameAdd',
    weightChange: 1, cost: 75, requiredPerk: 'gunNut', requiredPerkRank: 2,
    effects: [
      { effectType: 'fireRateBonus', numericValue: 2 },
      { effectType: 'rangeChange', numericValue: -1 },
    ],
  },

  // ----- MODS DE CANON -----
  {
    name: 'Canon compact', slot: 'canon', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.canon.canonCompact.nameAdd',
    weightChange: -0.5, cost: 0,
    effects: [{ effectType: 'gainQuality', qualityName: 'inaccurate' }],
  },
  {
    name: 'Canon extra-lourd', slot: 'canon', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.canon.canonExtraLourd.nameAdd',
    weightChange: 0, cost: 10, requiredPerk: 'gunNut', requiredPerkRank: 3,
    effects: [{ effectType: 'gainQuality', qualityName: 'reliable' }],
  },
  {
    name: 'Canon long', slot: 'canon', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.canon.canonLong.nameAdd',
    weightChange: 0.5, cost: 20, requiredPerk: 'gunNut', requiredPerkRank: 1,
    effects: [{ effectType: 'rangeChange', numericValue: 1 }],
  },
  {
    name: 'Canon à ouvertures', slot: 'canon', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.canon.canonOuvertures.nameAdd',
    weightChange: 0.5, cost: 35, requiredPerk: 'gunNut', requiredPerkRank: 4,
    effects: [
      { effectType: 'rangeChange', numericValue: 1 },
      { effectType: 'fireRateBonus', numericValue: 1 },
    ],
  },
  {
    name: 'Canon ventilé', slot: 'canon', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.canon.canonVentile.nameAdd',
    weightChange: 0.5, cost: 36, requiredPerk: 'gunNut', requiredPerkRank: 4,
    effects: [
      { effectType: 'rangeChange', numericValue: 1 },
      { effectType: 'fireRateBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'reliable' },
    ],
  },
  {
    name: 'Canon scié', slot: 'canon', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.canon.canonScie.nameAdd',
    weightChange: -1, cost: 3,
    effects: [
      { effectType: 'loseQuality', qualityName: 'twoHanded' },
      { effectType: 'gainQuality', qualityName: 'closeQuarters' },
    ],
  },
  {
    name: 'Canon protégé', slot: 'canon', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.canon.canonProtege.nameAdd',
    weightChange: 0, cost: 37, requiredPerk: 'gunNut', requiredPerkRank: 3,
    effects: [{ effectType: 'damageBonus', numericValue: 1 }],
  },
  {
    name: 'Canon court', slot: 'canon', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.canon.canonCourt.nameAdd',
    weightChange: -0.5, cost: 5,
    effects: [{ effectType: 'rangeChange', numericValue: -1 }],
  },
  {
    name: 'Canon raccourci', slot: 'canon', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.canon.canonRaccourci.nameAdd',
    weightChange: -0.5, cost: 3,
    effects: [
      { effectType: 'loseQuality', qualityName: 'twoHanded' },
      { effectType: 'gainQuality', qualityName: 'closeQuarters' },
    ],
  },
  {
    name: 'Canon à ailettes', slot: 'canon', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.canon.canonAilettes.nameAdd',
    weightChange: 1, cost: 15, requiredPerk: 'gunNut', requiredPerkRank: 2,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'rangeChange', numericValue: 1 },
    ],
  },

  // ----- MODS DE CHARGEUR -----
  {
    name: 'Grand chargeur', slot: 'chargeur', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.chargeur.grandChargeur.nameAdd',
    weightChange: 0.5, cost: 0, requiredPerk: 'gunNut', requiredPerkRank: 2,
    effects: [
      { effectType: 'fireRateBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'unreliable' },
    ],
  },
  {
    name: 'Chargeur à éjection rapide', slot: 'chargeur', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.chargeur.chargeurEjectionRapide.nameAdd',
    weightChange: 0, cost: 8, requiredPerk: 'gunNut', requiredPerkRank: 1,
    effects: [{ effectType: 'gainQuality', qualityName: 'reliable' }],
  },
  {
    name: 'Grand chargeur à éjection rapide', slot: 'chargeur', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.chargeur.grandChargeurEjectionRapide.nameAdd',
    weightChange: 0.5, cost: 23, requiredPerk: 'gunNut', requiredPerkRank: 2,
    effects: [{ effectType: 'fireRateBonus', numericValue: 1 }],
  },

  // ----- MODS DE POIGNÉE -----
  {
    name: 'Poignée confort', slot: 'poignee', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.poignee.poigneeConfort.nameAdd',
    weightChange: 0, cost: 6,
    effects: [{ effectType: 'loseQuality', qualityName: 'inaccurate' }],
  },
  {
    name: 'Poignée de tireur d\'élite', slot: 'poignee', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.poignee.poigneeTireurElite.nameAdd',
    weightChange: 0, cost: 10, requiredPerk: 'gunNut', requiredPerkRank: 1,
    effects: [
      { effectType: 'loseQuality', qualityName: 'inaccurate' },
      { effectType: 'gainQuality', qualityName: 'piercing', qualityValue: 1 },
    ],
  },

  // ----- MODS DE CROSSE -----
  {
    name: 'Crosse standard', slot: 'crosse', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.crosse.crosseStandard.nameAdd',
    weightChange: 0.5, cost: 5,
    effects: [{ effectType: 'gainQuality', qualityName: 'twoHanded' }],
  },
  {
    name: 'Crosse complète', slot: 'crosse', applicableTo: 'smallGuns',
    weightChange: 0.5, cost: 10,
    effects: [
      { effectType: 'gainQuality', qualityName: 'twoHanded' },
      { effectType: 'loseQuality', qualityName: 'inaccurate' },
    ],
  },
  {
    name: 'Crosse de tireur d\'élite', slot: 'crosse', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.crosse.crosseTireurElite.nameAdd',
    weightChange: 1, cost: 20, requiredPerk: 'gunNut', requiredPerkRank: 2,
    effects: [
      { effectType: 'gainQuality', qualityName: 'twoHanded' },
      { effectType: 'loseQuality', qualityName: 'inaccurate' },
      { effectType: 'gainQuality', qualityName: 'accurate' },
    ],
  },
  {
    name: 'Crosse à compensateur de recul', slot: 'crosse', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.crosse.crosseCompensateur.nameAdd',
    weightChange: 1, cost: 3, requiredPerk: 'gunNut', requiredPerkRank: 3,
    effects: [
      { effectType: 'gainQuality', qualityName: 'twoHanded' },
      { effectType: 'loseQuality', qualityName: 'inaccurate' },
      { effectType: 'fireRateBonus', numericValue: 1 },
    ],
  },

  // ----- MODS DE VISEUR -----
  {
    name: 'Viseur laser', slot: 'viseur', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.viseur.viseurLaser.nameAdd',
    weightChange: 0, cost: 14,
    effects: [{ effectType: 'special', descriptionKey: 'mods.effects.rerollLocationDie' }],
  },
  {
    name: 'Lunette courte', slot: 'viseur', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.viseur.lunetteCourte.nameAdd',
    weightChange: 0.5, cost: 11,
    effects: [{ effectType: 'gainQuality', qualityName: 'accurate' }],
  },
  {
    name: 'Lunette longue', slot: 'viseur', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.viseur.lunetteLongue.nameAdd',
    weightChange: 0.5, cost: 29, requiredPerk: 'science', requiredPerkRank: 2,
    effects: [
      { effectType: 'gainQuality', qualityName: 'accurate' },
      { effectType: 'rangeChange', numericValue: 1 },
    ],
  },
  {
    name: 'Lunette de vision nocturne courte', slot: 'viseur', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.viseur.lunetteNocturne.nameAdd',
    weightChange: 0.5, cost: 38, requiredPerk: 'science', requiredPerkRank: 2,
    effects: [
      { effectType: 'gainQuality', qualityName: 'accurate' },
      { effectType: 'gainQuality', qualityName: 'nightVision' },
    ],
  },
  {
    name: 'Lunette de vision nocturne longue', slot: 'viseur', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.viseur.lunetteNocturneLongue.nameAdd',
    weightChange: 0.5, cost: 50, requiredPerk: 'science', requiredPerkRank: 3,
    effects: [
      { effectType: 'gainQuality', qualityName: 'accurate' },
      { effectType: 'gainQuality', qualityName: 'nightVision' },
      { effectType: 'rangeChange', numericValue: 1 },
    ],
  },
  {
    name: 'Lunette de reconnaissance', slot: 'viseur', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.viseur.lunetteReconnaissance.nameAdd',
    weightChange: 0.5, cost: 59, requiredPerk: 'science', requiredPerkRank: 3,
    effects: [
      { effectType: 'gainQuality', qualityName: 'accurate' },
      { effectType: 'gainQuality', qualityName: 'recon' },
    ],
  },

  // ----- MODS DE BOUCHE -----
  {
    name: 'Baïonnette', slot: 'bouche', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.bouche.baionnette.nameAdd',
    weightChange: 1, cost: 10,
    effects: [{ effectType: 'special', descriptionKey: 'mods.effects.bayonet' }],
  },
  {
    name: 'Compensateur', slot: 'bouche', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.bouche.compensateur.nameAdd',
    weightChange: 0.5, cost: 15, requiredPerk: 'gunNut', requiredPerkRank: 1,
    effects: [{ effectType: 'loseQuality', qualityName: 'inaccurate' }],
  },
  {
    name: 'Frein de bouche', slot: 'bouche', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.bouche.freinDeBouche.nameAdd',
    weightChange: 0.5, cost: 30, requiredPerk: 'gunNut', requiredPerkRank: 1,
    effects: [
      { effectType: 'loseQuality', qualityName: 'inaccurate' },
      { effectType: 'fireRateBonus', numericValue: 1 },
    ],
  },
  {
    name: 'Silencieux', slot: 'bouche', applicableTo: 'smallGuns',
    nameAddKey: 'mods.smallGuns.bouche.silencieux.nameAdd',
    weightChange: 1, cost: 45, requiredPerk: 'gunNut', requiredPerkRank: 2,
    effects: [{ effectType: 'gainQuality', qualityName: 'silent' }],
  },
];

// All mods combined (will grow as other categories are added)
export const ALL_MODS: ModEntry[] = [
  ...SMALL_GUNS_MODS,
];
