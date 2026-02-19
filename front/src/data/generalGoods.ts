export interface GeneralGood {
  name: string;
  nameKey?: string;
  value: number;
  rarity: number;
  weight: number;
  type: 'Tool/Utility' | 'Materials';
  effectKey?: string; // i18n key for effect description
}

export const generalGoods: GeneralGood[] = [
  // ===== TOOLS & UTILITIES =====

  // Rarity 0
  {
    name: 'Bobby Pin',
    value: 1,
    rarity: 0,
    weight: 0.1,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.bobbyPin',
  },

  // Rarity 1
  {
    name: 'Backpack, Small',
    value: 30,
    rarity: 1,
    weight: 0,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.backpackSmall',
  },
  {
    name: 'Signal Flare',
    value: 10,
    rarity: 1,
    weight: 0.1,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.signalFlare',
  },
  {
    name: 'Torch',
    value: 10,
    rarity: 1,
    weight: 0.5,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.torch',
  },
  {
    name: 'Common Materials',
    value: 1,
    rarity: 1,
    weight: 1,
    type: 'Materials',
  },

  // Rarity 2
  {
    name: 'Backpack, Large',
    value: 60,
    rarity: 2,
    weight: 0,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.backpackLarge',
  },
  {
    name: 'First Aid Kit',
    value: 200,
    rarity: 2,
    weight: 2,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.firstAidKit',
  },
  {
    name: 'Holotags',
    value: 5,
    rarity: 2,
    weight: 0.1,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.holotags',
  },
  {
    name: 'Holotape Player',
    value: 250,
    rarity: 2,
    weight: 1.5,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.holotapePlayer',
  },
  {
    name: 'Lantern',
    value: 15,
    rarity: 2,
    weight: 1.5,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.lantern',
  },
  {
    name: 'Lock Pick Set',
    value: 150,
    rarity: 2,
    weight: 1,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.lockPickSet',
  },
  {
    name: 'Multi-Tool',
    value: 100,
    rarity: 2,
    weight: 0.5,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.multiTool',
  },
  {
    name: 'Radio',
    value: 75,
    rarity: 2,
    weight: 1,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.radio',
  },
  {
    name: 'Uncommon Materials',
    value: 3,
    rarity: 2,
    weight: 1,
    type: 'Materials',
  },

  // Rarity 3
  {
    name: 'Deluxe Toolkit',
    value: 150,
    rarity: 3,
    weight: 10,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.deluxeToolkit',
  },
  {
    name: 'Doctor\'s Bag',
    value: 300,
    rarity: 3,
    weight: 5,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.doctorsBag',
  },
  {
    name: 'Flashlight',
    value: 100,
    rarity: 3,
    weight: 1,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.flashlight',
  },
  {
    name: 'Geiger Counter',
    value: 325,
    rarity: 3,
    weight: 4,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.geigerCounter',
  },
  {
    name: 'Pack Brahmin',
    value: 200,
    rarity: 3,
    weight: 0,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.packBrahmin',
  },
  {
    name: 'Rare Materials',
    value: 5,
    rarity: 3,
    weight: 1,
    type: 'Materials',
  },

  // Rarity 4
  {
    name: 'Electronic Lockpicker',
    value: 375,
    rarity: 4,
    weight: 2,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.electronicLockpicker',
  },

  // Rarity 5
  {
    name: 'Pip-Boy',
    value: 500,
    rarity: 5,
    weight: 2,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.generalGoods.pipBoy',
  },

  // ===== ROBOT EQUIPMENT =====

  // Robot Arms (Mister Handy variants)
  {
    name: 'Robot Arm - Pincer',
    value: 20,
    rarity: 2,
    weight: 2,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.armPincer',
  },
  {
    name: 'Robot Arm - Flamer',
    value: 50,
    rarity: 3,
    weight: 3,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.armFlamer',
  },
  {
    name: 'Robot Arm - Circular Saw',
    value: 35,
    rarity: 2,
    weight: 2.5,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.armCircularSaw',
  },
  {
    name: 'Robot Arm - Emitter',
    value: 30,
    rarity: 2,
    weight: 2,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.armEmitter',
  },
  {
    name: 'Robot Arm - 10mm Auto Pistol',
    value: 60,
    rarity: 3,
    weight: 3,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.arm10mmPistol',
  },
  {
    name: 'Robot Arm - Laser Emitter',
    value: 75,
    rarity: 3,
    weight: 3,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.armLaserEmitter',
  },

  // Robot Modules
  {
    name: 'Behavioral Analysis Module',
    value: 100,
    rarity: 3,
    weight: 1,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.behavioralAnalysis',
  },
  {
    name: 'Threat Detection Module',
    value: 100,
    rarity: 3,
    weight: 1,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.threatDetection',
  },
  {
    name: 'Recon Sensor Module',
    value: 120,
    rarity: 3,
    weight: 1,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.reconSensor',
  },
  {
    name: 'Diagnostic Module',
    value: 80,
    rarity: 3,
    weight: 1,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.diagnostic',
  },
  {
    name: 'Built-in Kettle Module',
    value: 25,
    rarity: 2,
    weight: 0.5,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.builtInKettle',
  },

  // Other Robot Items
  {
    name: 'Robot Repair Kit',
    value: 150,
    rarity: 3,
    weight: 3,
    type: 'Tool/Utility',
    effectKey: 'itemEffects.robotEquipment.repairKit',
  },
  {
    name: 'Fertilizer Bag',
    value: 15,
    rarity: 1,
    weight: 5,
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
