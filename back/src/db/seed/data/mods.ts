export type ModSlot =
  | 'culasse' | 'canon' | 'chargeur' | 'poignee' | 'crosse' | 'viseur' | 'bouche'
  | 'condensateur' | 'parabole'
  | 'carburant' | 'reservoir' | 'buse'
  | 'lame'
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
    weightChange: 1, cost: 20,
    effects: [
      { effectType: 'loseQuality', qualityName: 'closeQuarters' },
      { effectType: 'rangeChange', numericValue: 1 },
    ],
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
    weightChange: 0.5, cost: 10,
    effects: [
      { effectType: 'gainQuality', qualityName: 'twoHanded' },
      { effectType: 'loseQuality', qualityName: 'inaccurate' },
      { effectType: 'loseQuality', qualityName: 'closeQuarters' },
    ],
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
      { effectType: 'loseQuality', qualityName: 'closeQuarters' },
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
      { effectType: 'loseQuality', qualityName: 'closeQuarters' },
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

// ===== MODS DES ARMES À ÉNERGIE (Energy Weapons) =====
// All energy weapons mods use the Sciences skill + optional perk to install.

export const ENERGY_WEAPONS_MODS: ModEntry[] = [

  // ----- MODS DE CONDENSATEUR -----
  {
    name: 'Amplificateur d\'ondes Bêta', slot: 'condensateur', applicableTo: 'energyWeapons',
    nameAddKey: 'mods.energyWeapons.condensateur.amplificateurOndes.nameAdd',
    weightChange: 0, cost: 30,
    effects: [{ effectType: 'gainQuality', qualityName: 'persistent' }],
  },
  {
    name: 'Condensateur amélioré', slot: 'condensateur', applicableTo: 'energyWeapons',
    nameAddKey: 'mods.energyWeapons.condensateur.condensateurAmeliore.nameAdd',
    weightChange: 0, cost: 35,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'fireRateBonus', numericValue: -1 },
    ],
  },
  {
    name: 'Stimulateur de photons', slot: 'condensateur', applicableTo: 'energyWeapons',
    nameAddKey: 'mods.energyWeapons.condensateur.stimulateurPhotons.nameAdd',
    weightChange: 0, cost: 30, requiredPerk: 'science', requiredPerkRank: 1,
    effects: [{ effectType: 'gainQuality', qualityName: 'vicious' }],
  },
  {
    name: 'Agitateur de photons', slot: 'condensateur', applicableTo: 'energyWeapons',
    nameAddKey: 'mods.energyWeapons.condensateur.agitateurPhotons.nameAdd',
    weightChange: 0.5, cost: 35, requiredPerk: 'science', requiredPerkRank: 2,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'vicious' },
    ],
  },

  // ----- MODS DE CANON -----
  {
    name: 'Canon court à fixation', slot: 'canon', applicableTo: 'energyWeapons',
    weightChange: 0, cost: 6,
    effects: [{ effectType: 'special', descriptionKey: 'mods.effects.acceptsMouthMod' }],
  },
  {
    name: 'Diviseur', slot: 'canon', applicableTo: 'energyWeapons',
    nameAddKey: 'mods.energyWeapons.canon.diviseur.nameAdd',
    weightChange: 0.5, cost: 31,
    effects: [
      { effectType: 'damageBonus', numericValue: -1 },
      { effectType: 'gainQuality', qualityName: 'blast' },
      { effectType: 'gainQuality', qualityName: 'inaccurate' },
    ],
  },
  {
    name: 'Canon automatique', slot: 'canon', applicableTo: 'energyWeapons',
    nameAddKey: 'mods.energyWeapons.canon.canonAutomatique.nameAdd',
    weightChange: 0.5, cost: 24, requiredPerk: 'science', requiredPerkRank: 1,
    effects: [
      { effectType: 'damageBonus', numericValue: -1 },
      { effectType: 'loseQuality', qualityName: 'closeQuarters' },
      { effectType: 'rangeChange', numericValue: 1 },
      { effectType: 'fireRateBonus', numericValue: 1 },
    ],
  },
  {
    name: 'Canon long à fixation', slot: 'canon', applicableTo: 'energyWeapons',
    weightChange: 1, cost: 25, requiredPerk: 'science', requiredPerkRank: 1,
    effects: [
      { effectType: 'loseQuality', qualityName: 'closeQuarters' },
      { effectType: 'rangeChange', numericValue: 1 },
      { effectType: 'special', descriptionKey: 'mods.effects.acceptsMouthMod' },
    ],
  },
  {
    name: 'Canon amélioré', slot: 'canon', applicableTo: 'energyWeapons',
    nameAddKey: 'mods.energyWeapons.canon.canonAmeliore.nameAdd',
    weightChange: 0.5, cost: 26, requiredPerk: 'science', requiredPerkRank: 1,
    effects: [{ effectType: 'damageBonus', numericValue: 1 }],
  },
  {
    name: 'Canon de précision', slot: 'canon', applicableTo: 'energyWeapons',
    nameAddKey: 'mods.energyWeapons.canon.canonPrecision.nameAdd',
    weightChange: 1, cost: 30, requiredPerk: 'science', requiredPerkRank: 1,
    effects: [
      { effectType: 'damageBonus', numericValue: 2 },
      { effectType: 'loseQuality', qualityName: 'closeQuarters' },
      { effectType: 'rangeChange', numericValue: 1 },
      { effectType: 'fireRateBonus', numericValue: -1 },
    ],
  },
  {
    name: 'Canon lance-flammes', slot: 'canon', applicableTo: 'energyWeapons',
    nameAddKey: 'mods.energyWeapons.canon.canonLanceFlammes.nameAdd',
    weightChange: 0.5, cost: 35, requiredPerk: 'science', requiredPerkRank: 2,
    effects: [
      { effectType: 'damageBonus', numericValue: -2 },
      { effectType: 'fireRateBonus', numericValue: 2 },
      { effectType: 'gainQuality', qualityName: 'blast' },
      { effectType: 'gainQuality', qualityName: 'burst' },
      { effectType: 'rangeChange', numericValue: -1 },
      { effectType: 'gainQuality', qualityName: 'inaccurate' },
    ],
  },

  // ----- MODS DE CROSSE (energy weapon version — also removes closeQuarters) -----
  // Note: 'Crosse standard', 'Crosse de tireur d\'élite', 'Crosse à compensateur de recul'
  //       are shared with small guns (updated above to include loseCloseQuarters).
  // 'Crosse complète' has fundamentally different effects for energy weapons:
  {
    name: 'Crosse complète (énergie)', slot: 'crosse', applicableTo: 'energyWeapons',
    weightChange: 0.5, cost: 15,
    effects: [
      { effectType: 'gainQuality', qualityName: 'piercing', qualityValue: 1 },
      { effectType: 'loseQuality', qualityName: 'closeQuarters' },
    ],
  },

  // ----- MODS DE BOUCHE -----
  {
    name: 'Diviseur de rayon', slot: 'bouche', applicableTo: 'energyWeapons',
    nameAddKey: 'mods.energyWeapons.bouche.diviseurRayon.nameAdd',
    weightChange: 0.5, cost: 15, requiredPerk: 'science', requiredPerkRank: 1,
    effects: [
      { effectType: 'damageBonus', numericValue: -1 },
      { effectType: 'gainQuality', qualityName: 'blast' },
      { effectType: 'fireRateBonus', numericValue: -1 },
      { effectType: 'gainQuality', qualityName: 'inaccurate' },
      { effectType: 'rangeChange', numericValue: -1 },
    ],
  },
  {
    name: 'Concentrateur de faisceau', slot: 'bouche', applicableTo: 'energyWeapons',
    nameAddKey: 'mods.energyWeapons.bouche.concentrateurFaisceau.nameAdd',
    weightChange: 0.5, cost: 20, requiredPerk: 'science', requiredPerkRank: 1,
    effects: [{ effectType: 'rangeChange', numericValue: 1 }],
  },
  {
    name: 'Lentille à gyrocompensation', slot: 'bouche', applicableTo: 'energyWeapons',
    nameAddKey: 'mods.energyWeapons.bouche.lentilleGyrocompensation.nameAdd',
    weightChange: 0.5, cost: 25, requiredPerk: 'science', requiredPerkRank: 1,
    effects: [
      { effectType: 'fireRateBonus', numericValue: 1 },
      { effectType: 'loseQuality', qualityName: 'inaccurate' },
    ],
  },

  // ----- MODS DE CONDENSATEUR RÉSERVÉS AU MOUSQUET LASER -----
  {
    name: 'Condensateur à trois charges', slot: 'condensateur', applicableTo: 'energyWeapons',
    nameAddKey: 'mods.energyWeapons.condensateur.troisCharges.nameAdd',
    weightChange: 0, cost: 4,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'special', descriptionKey: 'mods.effects.laserMusket3charges' },
    ],
  },
  {
    name: 'Condensateur à quatre charges', slot: 'condensateur', applicableTo: 'energyWeapons',
    nameAddKey: 'mods.energyWeapons.condensateur.quatreCharges.nameAdd',
    weightChange: 0.5, cost: 8, requiredPerk: 'science', requiredPerkRank: 1,
    effects: [
      { effectType: 'damageBonus', numericValue: 2 },
      { effectType: 'special', descriptionKey: 'mods.effects.laserMusket4charges' },
    ],
  },
  {
    name: 'Condensateur à cinq charges', slot: 'condensateur', applicableTo: 'energyWeapons',
    nameAddKey: 'mods.energyWeapons.condensateur.cinqCharges.nameAdd',
    weightChange: 0.5, cost: 12, requiredPerk: 'science', requiredPerkRank: 2,
    effects: [
      { effectType: 'damageBonus', numericValue: 3 },
      { effectType: 'special', descriptionKey: 'mods.effects.laserMusket5charges' },
    ],
  },
  {
    name: 'Condensateur à six charges', slot: 'condensateur', applicableTo: 'energyWeapons',
    nameAddKey: 'mods.energyWeapons.condensateur.sixCharges.nameAdd',
    weightChange: 1, cost: 16, requiredPerk: 'science', requiredPerkRank: 3,
    effects: [
      { effectType: 'damageBonus', numericValue: 4 },
      { effectType: 'special', descriptionKey: 'mods.effects.laserMusket6charges' },
    ],
  },

  // ----- MODS DE PARABOLE (Pistolet Gamma uniquement) -----
  {
    name: 'Parabole à renfoncement', slot: 'parabole', applicableTo: 'energyWeapons',
    nameAddKey: 'mods.energyWeapons.parabole.parabolaRenfoncement.nameAdd',
    weightChange: 1, cost: 72, requiredPerk: 'science', requiredPerkRank: 4,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'rangeChange', numericValue: 1 },
    ],
  },

  // ----- MODS DE BOUCHE PISTOLET GAMMA -----
  {
    name: 'Antenne de transmission électrique', slot: 'bouche', applicableTo: 'energyWeapons',
    nameAddKey: 'mods.energyWeapons.bouche.antenneTransmission.nameAdd',
    weightChange: 0, cost: 30, requiredPerk: 'science', requiredPerkRank: 3,
    effects: [
      { effectType: 'setDamage', numericValue: 7 },
      { effectType: 'special', descriptionKey: 'mods.effects.changeDamageTypeToEnergy' },
      { effectType: 'gainQuality', qualityName: 'radioactive' },
    ],
  },
  {
    name: 'Répéteur de signal', slot: 'bouche', applicableTo: 'energyWeapons',
    nameAddKey: 'mods.energyWeapons.bouche.repeteurSignal.nameAdd',
    weightChange: 0, cost: 60, requiredPerk: 'science', requiredPerkRank: 4,
    effects: [
      { effectType: 'fireRateBonus', numericValue: 2 },
      { effectType: 'gainQuality', qualityName: 'burst' },
      { effectType: 'loseQuality', qualityName: 'blast' },
    ],
  },
];

// ===== MODS DES ARMES LOURDES (Big Guns) =====
// All big guns mods use the Réparation skill + optional perk to install.

export const BIG_GUNS_MODS: ModEntry[] = [

  // ===== MODS DU LANCE-FLAMMES =====

  // ----- MOD DE CARBURANT -----
  {
    name: 'Réservoir à napalm', slot: 'carburant', applicableTo: 'bigGuns',
    nameAddKey: 'mods.bigGuns.carburant.reservoirNapalm.nameAdd',
    weightChange: 3.5, cost: 59, requiredPerk: 'gunNut', requiredPerkRank: 1,
    effects: [{ effectType: 'damageBonus', numericValue: 1 }],
  },

  // ----- MOD DE CANON -----
  // "Canon long" pour le lance-flammes a des effets différents du Canon long armes légères
  {
    name: 'Canon long (lance-flammes)', slot: 'canon', applicableTo: 'bigGuns',
    nameAddKey: 'mods.bigGuns.canon.canonLong.nameAdd',
    weightChange: 1, cost: 28, requiredPerk: 'gunNut', requiredPerkRank: 1,
    effects: [{ effectType: 'loseQuality', qualityName: 'inaccurate' }],
  },

  // ----- MODS DE RÉSERVOIR À PROPERGOL -----
  {
    name: 'Grand réservoir', slot: 'reservoir', applicableTo: 'bigGuns',
    nameAddKey: 'mods.bigGuns.reservoir.grandReservoir.nameAdd',
    weightChange: 1.5, cost: 28, requiredPerk: 'gunNut', requiredPerkRank: 1,
    effects: [{ effectType: 'fireRateBonus', numericValue: 1 }],
  },
  {
    name: 'Réservoir géant', slot: 'reservoir', applicableTo: 'bigGuns',
    nameAddKey: 'mods.bigGuns.reservoir.reservoirGeant.nameAdd',
    weightChange: 3, cost: 34, requiredPerk: 'gunNut', requiredPerkRank: 2,
    effects: [{ effectType: 'fireRateBonus', numericValue: 2 }],
  },

  // ----- MODS DE BUSE -----
  {
    name: 'Buse de compression', slot: 'buse', applicableTo: 'bigGuns',
    nameAddKey: 'mods.bigGuns.buse.buseCompression.nameAdd',
    weightChange: 0, cost: 22, requiredPerk: 'gunNut', requiredPerkRank: 1,
    effects: [{ effectType: 'damageBonus', numericValue: 1 }],
  },
  {
    name: 'Buse de vaporisation', slot: 'buse', applicableTo: 'bigGuns',
    nameAddKey: 'mods.bigGuns.buse.buseVaporisation.nameAdd',
    weightChange: 0, cost: 47, requiredPerk: 'gunNut', requiredPerkRank: 2,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'vicious' },
    ],
  },

  // ----- MODS DE CROSSE -----
  // "Crosse à compensateur de recul" for big guns has different cost/effects than the smallGuns version
  {
    name: 'Crosse à compensateur de recul (lourd)', slot: 'crosse', applicableTo: 'bigGuns',
    nameAddKey: 'mods.bigGuns.crosse.crosseCompensateur.nameAdd',
    weightChange: 1, cost: 40,
    effects: [{ effectType: 'fireRateBonus', numericValue: 1 }],
  },

  // ----- MODS DE VISEUR -----
  {
    name: 'Viseur d\'Artilleur', slot: 'viseur', applicableTo: 'bigGuns',
    nameAddKey: 'mods.bigGuns.viseur.viseurArtilleur.nameAdd',
    weightChange: 0.5, cost: 5,
    effects: [{ effectType: 'special', descriptionKey: 'mods.effects.rerollLocationDie' }],
  },

  // ----- MODS DE BOUCHE -----
  {
    name: 'Module d\'électrification', slot: 'bouche', applicableTo: 'bigGuns',
    nameAddKey: 'mods.bigGuns.bouche.moduleElectrification.nameAdd',
    weightChange: 0.5, cost: 70, requiredPerk: 'gunNut', requiredPerkRank: 2,
    effects: [
      { effectType: 'gainQuality', qualityName: 'vicious' },
      { effectType: 'special', descriptionKey: 'mods.effects.changeDamageTypeToEnergy' },
    ],
  },
  {
    name: 'Module de combustion', slot: 'bouche', applicableTo: 'bigGuns',
    nameAddKey: 'mods.bigGuns.bouche.moduleCombustion.nameAdd',
    weightChange: 0.5, cost: 130, requiredPerk: 'gunNut', requiredPerkRank: 3,
    effects: [{ effectType: 'gainQuality', qualityName: 'persistent' }],
  },

  // ===== MODS DU LASER GATLING =====
  // Ces mods s'installent avec la compétence Sciences.
  // Leurs noms ressemblent aux mods d'armes à énergie mais stats distinctes → suffixe (Gatling)

  // ----- MODS DE CONDENSATEUR -----
  {
    name: 'Stimulateur de photons (Gatling)', slot: 'condensateur', applicableTo: 'bigGuns',
    nameAddKey: 'mods.energyWeapons.condensateur.stimulateurPhotons.nameAdd',
    weightChange: 0.5, cost: 19, requiredPerk: 'science', requiredPerkRank: 3,
    effects: [{ effectType: 'gainQuality', qualityName: 'vicious' }],
  },
  {
    name: 'Amplificateur d\'ondes Bêta (Gatling)', slot: 'condensateur', applicableTo: 'bigGuns',
    nameAddKey: 'mods.energyWeapons.condensateur.amplificateurOndes.nameAdd',
    weightChange: 0.5, cost: 57,
    effects: [{ effectType: 'gainQuality', qualityName: 'persistent' }],
  },
  {
    name: 'Condensateur amélioré (Gatling)', slot: 'condensateur', applicableTo: 'bigGuns',
    nameAddKey: 'mods.energyWeapons.condensateur.condensateurAmeliore.nameAdd',
    weightChange: 0.5, cost: 94,
    effects: [{ effectType: 'damageBonus', numericValue: 1 }],
  },
  {
    name: 'Agitateur de photons (Gatling)', slot: 'condensateur', applicableTo: 'bigGuns',
    nameAddKey: 'mods.energyWeapons.condensateur.agitateurPhotons.nameAdd',
    weightChange: 1.5, cost: 132, requiredPerk: 'science', requiredPerkRank: 3,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'vicious' },
    ],
  },

  // ----- MOD DE CANON -----
  {
    name: 'Canons à chargement', slot: 'canon', applicableTo: 'bigGuns',
    nameAddKey: 'mods.bigGuns.canon.canonsChargement.nameAdd',
    weightChange: 5, cost: 357, requiredPerk: 'science', requiredPerkRank: 4,
    effects: [
      { effectType: 'damageBonus', numericValue: 4 },
      { effectType: 'fireRateBonus', numericValue: -3 },
      { effectType: 'rangeChange', numericValue: 1 },
    ],
  },

  // ----- MOD DE VISEUR -----
  {
    name: 'Viseur laser (Gatling)', slot: 'viseur', applicableTo: 'bigGuns',
    nameAddKey: 'mods.smallGuns.viseur.viseurLaser.nameAdd',
    weightChange: 0.5, cost: 169, requiredPerk: 'science', requiredPerkRank: 4,
    effects: [{ effectType: 'loseQuality', qualityName: 'inaccurate' }],
  },

  // ----- MOD DE BUSE -----
  {
    name: 'Concentrateur de faisceau (Gatling)', slot: 'buse', applicableTo: 'bigGuns',
    nameAddKey: 'mods.energyWeapons.bouche.concentrateurFaisceau.nameAdd',
    weightChange: 0, cost: 22,
    effects: [
      { effectType: 'gainQuality', qualityName: 'piercing', qualityValue: 1 },
      { effectType: 'rangeChange', numericValue: 1 },
    ],
  },

  // ===== MODS DU MINIGUN =====

  // ----- MODS DE CANON -----
  {
    name: 'Canon grande vitesse', slot: 'canon', applicableTo: 'bigGuns',
    nameAddKey: 'mods.bigGuns.canon.canonGrandeVitesse.nameAdd',
    weightChange: 2.5, cost: 45, requiredPerk: 'gunNut', requiredPerkRank: 3,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'fireRateBonus', numericValue: 1 },
      { effectType: 'rangeChange', numericValue: -1 },
    ],
  },
  {
    // Distinct du "Triple canon" du Lance-missiles (effets différents)
    name: 'Triple canon (minigun)', slot: 'canon', applicableTo: 'bigGuns',
    nameAddKey: 'mods.bigGuns.canon.tripleCanonMinigun.nameAdd',
    weightChange: 1.5, cost: 75, requiredPerk: 'gunNut', requiredPerkRank: 4,
    effects: [
      { effectType: 'damageBonus', numericValue: 2 },
      { effectType: 'fireRateBonus', numericValue: -2 },
    ],
  },

  // ----- MOD DE VISEUR -----
  {
    // Distinct du "Viseur d'Artilleur" du Junk Jet (perd Imprécis vs relance dé de loc)
    name: 'Viseur d\'Artilleur (minigun)', slot: 'viseur', applicableTo: 'bigGuns',
    nameAddKey: 'mods.smallGuns.viseur.viseurLaser.nameAdd',
    weightChange: 0.5, cost: 68,
    effects: [{ effectType: 'loseQuality', qualityName: 'inaccurate' }],
  },

  // ----- MOD DE BOUCHE -----
  {
    name: 'Broyeur', slot: 'bouche', applicableTo: 'bigGuns',
    nameAddKey: 'mods.bigGuns.bouche.baionnette.nameAdd',
    weightChange: 2.5, cost: 5, requiredPerk: 'gunNut', requiredPerkRank: 2,
    effects: [{ effectType: 'special', descriptionKey: 'mods.effects.minigunGrinder' }],
  },

  // ===== MODS DU LANCE-MISSILES =====

  // ----- MODS DE CANON -----
  {
    name: 'Triple canon', slot: 'canon', applicableTo: 'bigGuns',
    nameAddKey: 'mods.bigGuns.canon.tripleCanon.nameAdd',
    weightChange: 8, cost: 143, requiredPerk: 'gunNut', requiredPerkRank: 2,
    effects: [{ effectType: 'fireRateBonus', numericValue: 1 }],
  },
  {
    name: 'Quadruple canon', slot: 'canon', applicableTo: 'bigGuns',
    nameAddKey: 'mods.bigGuns.canon.quadrupleCanon.nameAdd',
    weightChange: 10, cost: 218, requiredPerk: 'gunNut', requiredPerkRank: 3,
    effects: [{ effectType: 'fireRateBonus', numericValue: 2 }],
  },

  // ----- MODS DE VISEUR -----
  {
    name: 'Lunette (lance-missiles)', slot: 'viseur', applicableTo: 'bigGuns',
    nameAddKey: 'mods.bigGuns.viseur.lunette.nameAdd',
    weightChange: 3, cost: 143, requiredPerk: 'gunNut', requiredPerkRank: 2,
    effects: [{ effectType: 'gainQuality', qualityName: 'accurate' }],
  },
  {
    name: 'Lunette de vision nocturne (lance-missiles)', slot: 'viseur', applicableTo: 'bigGuns',
    nameAddKey: 'mods.bigGuns.viseur.lunetteVisionNocturne.nameAdd',
    weightChange: 3, cost: 248, requiredPerk: 'gunNut', requiredPerkRank: 4,
    effects: [
      { effectType: 'gainQuality', qualityName: 'accurate' },
      { effectType: 'gainQuality', qualityName: 'nightVision' },
    ],
  },
  {
    name: 'Ordinateur de visée', slot: 'viseur', applicableTo: 'bigGuns',
    nameAddKey: 'mods.bigGuns.viseur.ordinateurVisee.nameAdd',
    weightChange: 3.5, cost: 293, requiredPerk: 'gunNut', requiredPerkRank: 2,
    effects: [{ effectType: 'special', descriptionKey: 'mods.effects.aimingComputer' }],
  },

  // ----- MODS DE BOUCHE -----
  {
    // Différente de la Baïonnette armes légères (stats et effets distincts)
    name: 'Baïonnette (lance-missiles)', slot: 'bouche', applicableTo: 'bigGuns',
    nameAddKey: 'mods.bigGuns.bouche.baionnette.nameAdd',
    weightChange: 0.5, cost: 30,
    effects: [{ effectType: 'special', descriptionKey: 'mods.effects.bayonetLauncher' }],
  },
  {
    name: 'Stabilisateur', slot: 'bouche', applicableTo: 'bigGuns',
    nameAddKey: 'mods.bigGuns.bouche.stabilisateur.nameAdd',
    weightChange: 1, cost: 60, requiredPerk: 'gunNut', requiredPerkRank: 2,
    effects: [{ effectType: 'gainQuality', qualityName: 'piercing', qualityValue: 1 }],
  },
];

// ===== MODS DES ARMES DE MÊLÉE (Melee Weapons) =====
// All melee weapon mods use the Réparation skill + optional perk to install.

export const MELEE_WEAPONS_MODS: ModEntry[] = [

  // ===== MODS DE L'ÉPÉE =====
  {
    name: 'Lame dentelée (épée)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.lameDentelee.nameAdd',
    weightChange: 0, cost: 25, requiredPerk: 'blacksmith', requiredPerkRank: 2,
    effects: [{ effectType: 'gainQuality', qualityName: 'persistent' }],
  },
  {
    name: 'Lame électrifiée', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.lameElectrifiee.nameAdd',
    weightChange: 0, cost: 50, requiredPerk: 'blacksmith', requiredPerkRank: 2,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'special', descriptionKey: 'mods.effects.changeDamageTypeToEnergy' },
    ],
  },
  {
    name: 'Lame dentelée électrifiée', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.lameDenteleeElectrifiee.nameAdd',
    weightChange: 0, cost: 75, requiredPerk: 'blacksmith', requiredPerkRank: 3,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'special', descriptionKey: 'mods.effects.changeDamageTypeToEnergy' },
      { effectType: 'gainQuality', qualityName: 'persistent' },
    ],
  },
  {
    name: 'Module d\'étourdissement', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.moduleEtourdissement.nameAdd',
    weightChange: 0, cost: 100, requiredPerk: 'blacksmith', requiredPerkRank: 3,
    effects: [
      { effectType: 'damageBonus', numericValue: 2 },
      { effectType: 'special', descriptionKey: 'mods.effects.changeDamageTypeToEnergy' },
      { effectType: 'gainQuality', qualityName: 'stun' },
    ],
  },

  // ===== MODS DU COUTEAU DE COMBAT =====
  {
    // Distinct de la Lame dentelée (épée) — effets et coût différents
    name: 'Lame dentelée (couteau)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.lameDentelee.nameAdd',
    weightChange: 0, cost: 12, requiredPerk: 'blacksmith', requiredPerkRank: 1,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'persistent' },
    ],
  },
  {
    name: 'Lame furtive', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.lameFurtive.nameAdd',
    weightChange: 0, cost: 18, requiredPerk: 'blacksmith', requiredPerkRank: 2,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'persistent' },
      { effectType: 'special', descriptionKey: 'mods.effects.stealthBonus2' },
    ],
  },

  // ===== MODS DE LA MACHETTE =====
  {
    // Distinct des autres Lame dentelée — +2 dégâts, coût différent
    name: 'Lame dentelée (machette)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.lameDentelee.nameAdd',
    weightChange: 0, cost: 12, requiredPerk: 'blacksmith', requiredPerkRank: 2,
    effects: [
      { effectType: 'damageBonus', numericValue: 2 },
      { effectType: 'gainQuality', qualityName: 'persistent' },
    ],
  },

  // ===== MODS DE L'ÉVENTREUR =====
  {
    name: 'Lame courbe', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.lameCourbe.nameAdd',
    weightChange: 0.5, cost: 15,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'special', descriptionKey: 'mods.effects.disarm2AP' },
    ],
  },
  {
    name: 'Lame rallongée', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.lameRallongee.nameAdd',
    weightChange: 1.5, cost: 25, requiredPerk: 'blacksmith', requiredPerkRank: 3,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'persistent' },
    ],
  },

  // ===== MOD DU FLAMBEUR =====
  {
    name: 'Jets de flammes supplémentaires', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.jetsFlammesSupplementaires.nameAdd',
    weightChange: 0.5, cost: 100, requiredPerk: 'blacksmith', requiredPerkRank: 3,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'persistent' },
    ],
  },

  // ===== MOD DU CRAN D'ARRÊT =====
  {
    // Distinct des autres Lame dentelée — coût 10, Forgeron 1
    name: 'Lame dentelée (cran)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.lameDentelee.nameAdd',
    weightChange: 0, cost: 10, requiredPerk: 'blacksmith', requiredPerkRank: 1,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'persistent' },
    ],
  },

  // ===== MODS DE LA BATTE DE BASEBALL =====
  {
    name: 'Barbelé', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.barbele.nameAdd',
    weightChange: 0, cost: 5,
    effects: [{ effectType: 'gainQuality', qualityName: 'piercing', qualityValue: 1 }],
  },
  {
    name: 'À pointes', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.aPointes.nameAdd',
    weightChange: 0.5, cost: 7,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'piercing', qualityValue: 1 },
    ],
  },
  {
    name: 'Affûté', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.affute.nameAdd',
    weightChange: 0.5, cost: 7,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'persistent' },
    ],
  },
  {
    name: 'À chaînes', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.aChaines.nameAdd',
    weightChange: 0.5, cost: 10, requiredPerk: 'blacksmith', requiredPerkRank: 1,
    effects: [{ effectType: 'damageBonus', numericValue: 2 }],
  },
  {
    name: 'À lames', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.aLames.nameAdd',
    weightChange: 1, cost: 12, requiredPerk: 'blacksmith', requiredPerkRank: 2,
    effects: [
      { effectType: 'damageBonus', numericValue: 2 },
      { effectType: 'gainQuality', qualityName: 'persistent' },
    ],
  },

  // ===== MODS DE LA PLANCHE =====
  {
    name: 'À pointes (planche)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.aPointes.nameAdd',
    weightChange: 0.5, cost: 6,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'piercing', qualityValue: 1 },
    ],
  },
  {
    name: 'Perforant', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.perforant.nameAdd',
    weightChange: 0.5, cost: 9, requiredPerk: 'blacksmith', requiredPerkRank: 1,
    effects: [{ effectType: 'damageBonus', numericValue: 2 }],
  },
  {
    name: 'À lames (planche)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.aLames.nameAdd',
    weightChange: 1, cost: 10, requiredPerk: 'blacksmith', requiredPerkRank: 1,
    effects: [
      { effectType: 'damageBonus', numericValue: 2 },
      { effectType: 'gainQuality', qualityName: 'persistent' },
    ],
  },

  // ===== MODS DU TUYAU DE PLOMB =====
  {
    name: 'À pointes (tuyau)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.aPointes.nameAdd',
    weightChange: 0.5, cost: 4,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'piercing', qualityValue: 1 },
    ],
  },
  {
    name: 'Lourd', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.lourd.nameAdd',
    weightChange: 1, cost: 11, requiredPerk: 'blacksmith', requiredPerkRank: 2,
    effects: [{ effectType: 'damageBonus', numericValue: 2 }],
  },

  // ===== MODS DE LA CLÉ SERRE-TUBE =====
  {
    name: 'À crochets', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.aCrochets.nameAdd',
    weightChange: 0, cost: 9,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'special', descriptionKey: 'mods.effects.disarm2AP' },
    ],
  },
  {
    // Distinct de Lourd (tuyau) — poids +3,5, nameAdd "Alourdissement"
    name: 'Lourd (clé)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.alourdissement.nameAdd',
    weightChange: 3.5, cost: 12, requiredPerk: 'blacksmith', requiredPerkRank: 1,
    effects: [{ effectType: 'damageBonus', numericValue: 2 }],
  },
  {
    // Distinct de Perforant (planche) — ajoute aussi Perforant 1
    name: 'Perforant (clé)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.perforant.nameAdd',
    weightChange: 0.5, cost: 13, requiredPerk: 'blacksmith', requiredPerkRank: 1,
    effects: [
      { effectType: 'damageBonus', numericValue: 2 },
      { effectType: 'gainQuality', qualityName: 'piercing', qualityValue: 1 },
    ],
  },
  {
    // nameAdd "Poids" — réutilise la clé de Lourd (tuyau)
    name: 'Extralourd', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.lourd.nameAdd',
    weightChange: 1, cost: 22, requiredPerk: 'blacksmith', requiredPerkRank: 2,
    effects: [{ effectType: 'damageBonus', numericValue: 3 }],
  },

  // ===== MODS DE LA QUEUE DE BILLARD =====
  {
    name: 'Barbelé (queue)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.barbele.nameAdd',
    weightChange: 0, cost: 2,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'piercing', qualityValue: 1 },
    ],
  },
  {
    name: 'Affûté (queue)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.affute.nameAdd',
    weightChange: 0, cost: 3,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'persistent' },
    ],
  },

  // ===== MODS DU ROULEAU À PÂTISSERIE =====
  {
    name: 'À pointes (rouleau)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.aPointes.nameAdd',
    weightChange: 0, cost: 3,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'piercing', qualityValue: 1 },
    ],
  },
  {
    name: 'Affûté (rouleau)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.affute.nameAdd',
    weightChange: 0, cost: 3,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'persistent' },
    ],
  },

  // ===== MODS DE LA MATRAQUE =====
  {
    name: 'Électrifié', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.electrifie.nameAdd',
    weightChange: 0, cost: 15, requiredPerk: 'blacksmith', requiredPerkRank: 2,
    effects: [
      { effectType: 'damageBonus', numericValue: 2 },
      { effectType: 'special', descriptionKey: 'mods.effects.changeDamageTypeToEnergy' },
    ],
  },
  {
    // nameAdd "KO" — distinct du Module d'étourdissement (épée)
    name: 'Module d\'étourdissement (matraque)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.ko.nameAdd',
    weightChange: 0, cost: 30, requiredPerk: 'blacksmith', requiredPerkRank: 2,
    effects: [
      { effectType: 'damageBonus', numericValue: 3 },
      { effectType: 'special', descriptionKey: 'mods.effects.changeDamageTypeToEnergy' },
    ],
  },

  // ===== MODS DE LA MASSE =====
  {
    name: 'Perforant (masse)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.perforant.nameAdd',
    weightChange: 2.5, cost: 18, requiredPerk: 'blacksmith', requiredPerkRank: 2,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'piercing', qualityValue: 1 },
    ],
  },
  {
    name: 'Lourd (masse)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.lourd.nameAdd',
    weightChange: 4.5, cost: 30, requiredPerk: 'blacksmith', requiredPerkRank: 2,
    effects: [{ effectType: 'damageBonus', numericValue: 2 }],
  },

  // ===== MODS DE LA SUPER MASSE =====
  {
    name: 'Bobine thermique', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.bobineThermique.nameAdd',
    weightChange: 0, cost: 180, requiredPerk: 'blacksmith', requiredPerkRank: 2,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'special', descriptionKey: 'mods.effects.changeDamageTypeToEnergy' },
    ],
  },
  {
    // Mêmes effets que Module d'étourdissement (épée) mais coût différent
    name: 'Module d\'étourdissement (super masse)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.moduleEtourdissement.nameAdd',
    weightChange: 0, cost: 360, requiredPerk: 'blacksmith', requiredPerkRank: 3,
    effects: [
      { effectType: 'damageBonus', numericValue: 2 },
      { effectType: 'gainQuality', qualityName: 'stun' },
      { effectType: 'special', descriptionKey: 'mods.effects.changeDamageTypeToEnergy' },
    ],
  },

  // ===== MOD DU DÉMONTE-PNEU =====
  {
    name: 'À lames (démonte-pneu)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.aLames.nameAdd',
    weightChange: 0.5, cost: 12, requiredPerk: 'blacksmith', requiredPerkRank: 2,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'persistent' },
    ],
  },

  // ===== MODS DE LA CANNE =====
  {
    name: 'Barbelé (canne)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.barbele.nameAdd',
    weightChange: 0, cost: 3,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'piercing', qualityValue: 1 },
    ],
  },
  {
    name: 'À pointes (canne)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.aPointes.nameAdd',
    weightChange: 0, cost: 3,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'piercing', qualityValue: 1 },
    ],
  },

  // ===== MODS DU GANT DE BOXE =====
  {
    // Pas de damageBonus — seulement Perforant 1
    name: 'À pointes (gant)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.aPointes.nameAdd',
    weightChange: 0, cost: 3,
    effects: [{ effectType: 'gainQuality', qualityName: 'piercing', qualityValue: 1 }],
  },
  {
    name: 'Perforant (gant)', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.perforant.nameAdd',
    weightChange: 0, cost: 4, requiredPerk: 'blacksmith', requiredPerkRank: 1,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'piercing', qualityValue: 1 },
    ],
  },
  {
    name: 'Revêtement en plomb', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.revetementPlomb.nameAdd',
    weightChange: 0.5, cost: 7, requiredPerk: 'blacksmith', requiredPerkRank: 1,
    effects: [{ effectType: 'damageBonus', numericValue: 2 }],
  },

  // ===== MOD DU GANTELET D'ÉCORCHEUR =====
  {
    name: 'Griffe supplémentaire', slot: 'lame', applicableTo: 'meleeWeapons',
    nameAddKey: 'mods.meleeWeapons.lame.griffeSupplementaire.nameAdd',
    weightChange: 1, cost: 22,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'special', descriptionKey: 'mods.effects.disarm2AP' },
    ],
  },

  // ===== MODS DU POING AMÉRICAIN =====
  {
    name: 'Affûté (poing)', slot: 'lame', applicableTo: 'unarmed',
    nameAddKey: 'mods.meleeWeapons.lame.affute.nameAdd',
    weightChange: 0, cost: 3,
    effects: [{ effectType: 'gainQuality', qualityName: 'persistent' }],
  },
  {
    name: 'À pointes (poing)', slot: 'lame', applicableTo: 'unarmed',
    nameAddKey: 'mods.meleeWeapons.lame.aPointes.nameAdd',
    weightChange: 0, cost: 3,
    effects: [{ effectType: 'gainQuality', qualityName: 'piercing', qualityValue: 1 }],
  },
  {
    name: 'Perforant (poing)', slot: 'lame', applicableTo: 'unarmed',
    nameAddKey: 'mods.meleeWeapons.lame.perforant.nameAdd',
    weightChange: 0, cost: 4, requiredPerk: 'blacksmith', requiredPerkRank: 1,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'piercing', qualityValue: 1 },
    ],
  },
  {
    name: 'À lames (poing)', slot: 'lame', applicableTo: 'unarmed',
    nameAddKey: 'mods.meleeWeapons.lame.aLames.nameAdd',
    weightChange: 0, cost: 5, requiredPerk: 'blacksmith', requiredPerkRank: 1,
    effects: [
      { effectType: 'damageBonus', numericValue: 1 },
      { effectType: 'gainQuality', qualityName: 'persistent' },
    ],
  },

  // ===== MODS DU POING ASSISTÉ =====
  {
    name: 'Perforant (poing assisté)', slot: 'lame', applicableTo: 'unarmed',
    nameAddKey: 'mods.meleeWeapons.lame.perforant.nameAdd',
    weightChange: 0.5, cost: 45, requiredPerk: 'blacksmith', requiredPerkRank: 2,
    effects: [
      { effectType: 'damageBonus', numericValue: 2 },
      { effectType: 'gainQuality', qualityName: 'piercing', qualityValue: 1 },
    ],
  },
  {
    name: 'Bobine thermique (poing assisté)', slot: 'lame', applicableTo: 'unarmed',
    nameAddKey: 'mods.meleeWeapons.lame.bobineThermique.nameAdd',
    weightChange: 0, cost: 100, requiredPerk: 'blacksmith', requiredPerkRank: 3,
    effects: [
      { effectType: 'damageBonus', numericValue: 2 },
      { effectType: 'special', descriptionKey: 'mods.effects.changeDamageTypeToEnergy' },
    ],
  },
];

// All mods combined (will grow as other categories are added)
export const ALL_MODS: ModEntry[] = [
  ...SMALL_GUNS_MODS,
  ...ENERGY_WEAPONS_MODS,
  ...BIG_GUNS_MODS,
  ...MELEE_WEAPONS_MODS,
];
