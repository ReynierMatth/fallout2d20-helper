import type { ItemEffect } from '../../../types/itemEffect';

export interface GeneralGood {
  name: string;
  nameKey?: string;
  value: number;
  rarity: number;
  weight: number;
  type: 'Tool/Utility' | 'Materials';
  effectKey?: string;      // i18n key for effect description
  effect?: ItemEffect;     // Structured effect (JSONB)
}

export const generalGoods: GeneralGood[] = [
  // ===== OUTILS ET OBJETS UTILITAIRES =====

  // Rarity 0
  {
    // -1 diff Crochetage (1 minimum), 1 épingle se brise par complication
    name: 'Bobby Pin',
    value: 1, rarity: 0, weight: 0.1,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.bobbyPin',
    effect: { difficultyReduction: { skill: 'lockpick', amount: 1 }, descriptionKey: 'itemEffects.generalGoods.bobbyPin' },
  },

  // Rarity 1
  {
    // +2.5 × FOR à la charge maximale
    name: 'Backpack, Small',
    value: 30, rarity: 1, weight: 0,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.backpackSmall',
  },
  {
    // Lumière vive portée courte, usage unique
    name: 'Signal Flare',
    value: 10, rarity: 1, weight: 0.1,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.signalFlare',
  },
  {
    // Lumière vive portée courte, test INT+Survie diff 1, +1 par utilisation précédente
    name: 'Torch',
    value: 10, rarity: 1, weight: 0.5,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.torch',
  },
  {
    name: 'Common Materials',
    value: 1, rarity: 1, weight: 1,
    type: 'Materials',
  },

  // Rarity 2
  {
    // +5 × FOR à la charge maximale
    name: 'Backpack, Large',
    value: 60, rarity: 2, weight: 0,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.backpackLarge',
  },
  {
    // +2 PV quand réussite action porter secours
    name: 'First Aid Kit',
    value: 200, rarity: 2, weight: 2,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.firstAidKit',
    effect: { hpHealed: 2, descriptionKey: 'itemEffects.generalGoods.firstAidKit' },
  },
  {
    // Identifient le défunt
    name: 'Holotags',
    value: 5, rarity: 2, weight: 0.1,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.holotags',
  },
  {
    // Permet de lire les holobandes audio
    name: 'Holotape Player',
    value: 250, rarity: 2, weight: 1.5,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.holotapePlayer',
  },
  {
    // Lumière vive portée courte + lumière faible portée moyenne
    name: 'Lantern',
    value: 15, rarity: 2, weight: 1.5,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.lantern',
  },
  {
    // -1 diff Crochetage (0 minimum), se brise après 3 complications
    name: 'Lock Pick Set',
    value: 150, rarity: 2, weight: 1,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.lockPickSet',
    effect: { difficultyReduction: { skill: 'lockpick', amount: 1 }, descriptionKey: 'itemEffects.generalGoods.lockPickSet' },
  },
  {
    // -1 diff Réparation (0 minimum)
    name: 'Multi-Tool',
    value: 100, rarity: 2, weight: 0.5,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.multiTool',
    effect: { difficultyReduction: { skill: 'repair', amount: 1 } },
  },
  {
    // Capte et diffuse les transmissions radio
    name: 'Radio',
    value: 75, rarity: 2, weight: 1,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.radio',
  },
  {
    name: 'Uncommon Materials',
    value: 3, rarity: 2, weight: 1,
    type: 'Materials',
  },

  // Rarity 3
  {
    // -1 diff Réparation (0 min), peut tenter Réparation sans établi avec +1 diff
    name: 'Deluxe Toolkit',
    value: 150, rarity: 3, weight: 10,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.deluxeToolkit',
    effect: { difficultyReduction: { skill: 'repair', amount: 1 }, descriptionKey: 'itemEffects.generalGoods.deluxeToolkit' },
  },
  {
    // -1 diff Médecine (0 min), soins long terme: +2 patients supplémentaires
    name: 'Doctor\'s Bag',
    value: 300, rarity: 3, weight: 5,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.doctorsBag',
    effect: { difficultyReduction: { skill: 'medicine', amount: 1 }, descriptionKey: 'itemEffects.generalGoods.doctorsBag' },
  },
  {
    // Lumière vive dans une seule zone portée moyenne, l'utilisateur choisit la zone
    name: 'Flashlight',
    value: 100, rarity: 3, weight: 1,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.flashlight',
  },
  {
    // Test PER + Survie, diff 1, pour déterminer si une zone est irradiée
    name: 'Geiger Counter',
    value: 325, rarity: 3, weight: 4,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.geigerCounter',
  },
  {
    // Transporte de lourdes charges et produit du lait et de l'engrais
    name: 'Pack Brahmin',
    value: 200, rarity: 3, weight: 0,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.packBrahmin',
  },
  {
    name: 'Rare Materials',
    value: 5, rarity: 3, weight: 1,
    type: 'Materials',
  },

  // Rarity 4
  {
    // -2 diff Crochetage (0 min), ignore 1ère complication, brise si 2+ complications sur même jet
    name: 'Electronic Lockpicker',
    value: 375, rarity: 4, weight: 2,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.electronicLockpicker',
    effect: { difficultyReduction: { skill: 'lockpick', amount: 2 }, descriptionKey: 'itemEffects.generalGoods.electronicLockpicker' },
  },

  // Rarity 5
  {
    // Voir description (item spécial)
    name: 'Pip-Boy',
    value: 500, rarity: 5, weight: 2,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.pipBoy',
  },

  // ===== ÉQUIPEMENT ROBOT =====

  // Bras de robot
  {
    name: 'Robot Arm - Pincer',
    value: 20, rarity: 2, weight: 2,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.armPincer',
  },
  {
    name: 'Robot Arm - Flamer',
    value: 50, rarity: 3, weight: 3,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.armFlamer',
  },
  {
    name: 'Robot Arm - Circular Saw',
    value: 35, rarity: 2, weight: 2.5,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.armCircularSaw',
  },
  {
    name: 'Robot Arm - Emitter',
    value: 30, rarity: 2, weight: 2,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.armEmitter',
  },
  {
    name: 'Robot Arm - 10mm Auto Pistol',
    value: 60, rarity: 3, weight: 3,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.arm10mmPistol',
  },
  {
    name: 'Robot Arm - Laser Emitter',
    value: 75, rarity: 3, weight: 3,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.armLaserEmitter',
  },

  // Modules robot
  {
    name: 'Behavioral Analysis Module',
    value: 100, rarity: 3, weight: 1,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.behavioralAnalysis',
  },
  {
    name: 'Threat Detection Module',
    value: 100, rarity: 3, weight: 1,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.threatDetection',
  },
  {
    name: 'Recon Sensor Module',
    value: 120, rarity: 3, weight: 1,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.reconSensor',
  },
  {
    name: 'Diagnostic Module',
    value: 80, rarity: 3, weight: 1,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.diagnostic',
  },
  {
    name: 'Built-in Kettle Module',
    value: 25, rarity: 2, weight: 0.5,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.builtInKettle',
  },

  // Autres équipements robot
  {
    name: 'Robot Repair Kit',
    value: 150, rarity: 3, weight: 3,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.repairKit',
  },
  {
    name: 'Fertilizer Bag',
    value: 15, rarity: 1, weight: 5,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.fertilizerBag',
  },

];

export const oddities: GeneralGood[] = [
  { name: 'Pre-war Money (50 caps)', value: 50, rarity: 3, weight: 0.1, type: 'Tool/Utility' },
  { name: 'Caps (random 10-60)', value: 35, rarity: 2, weight: 0, type: 'Tool/Utility' },
  { name: 'Holotape', value: 15, rarity: 2, weight: 0.1, type: 'Tool/Utility' },
  { name: 'Container', value: 0, rarity: 2, weight: 0, type: 'Tool/Utility' },
  { name: 'Key', value: 0, rarity: 2, weight: 0.1, type: 'Tool/Utility' },
  { name: 'Locked Container', value: 0, rarity: 3, weight: 0, type: 'Tool/Utility' },
];
