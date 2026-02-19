import type { Armor, RobotArmor } from './types';

export const armor: Armor[] = [
  // ===== ARMURE DE PILLARD (Raider Armor) =====
  // Standard
  {
    name: 'Raider Chest Piece',
    value: 18, rarity: 0, weight: 3.5,
    location: 'torso',
    dr: { physical: 1, energy: 1, radiation: 0 },
    type: 'armor', set: 'raider',
  },
  {
    name: 'Raider Leg',
    value: 8, rarity: 0, weight: 1.5,
    location: 'legLeft',
    dr: { physical: 1, energy: 1, radiation: 0 },
    type: 'armor', set: 'raider',
  },
  {
    name: 'Raider Arm',
    value: 6, rarity: 0, weight: 1.5,
    location: 'armLeft',
    dr: { physical: 1, energy: 1, radiation: 0 },
    type: 'armor', set: 'raider',
  },
  // Sturdy Raider
  {
    name: 'Sturdy Raider Chest Piece',
    value: 33, rarity: 1, weight: 6,
    location: 'torso',
    dr: { physical: 2, energy: 2, radiation: 0 },
    type: 'armor', set: 'raider',
  },
  {
    name: 'Sturdy Raider Leg',
    value: 13, rarity: 1, weight: 3.5,
    location: 'legLeft',
    dr: { physical: 2, energy: 2, radiation: 0 },
    type: 'armor', set: 'raider',
  },
  {
    name: 'Sturdy Raider Arm',
    value: 8, rarity: 1, weight: 3.5,
    location: 'armLeft',
    dr: { physical: 2, energy: 2, radiation: 0 },
    type: 'armor', set: 'raider',
  },
  // Heavy Raider
  {
    name: 'Heavy Raider Chest Piece',
    value: 48, rarity: 2, weight: 8.5,
    location: 'torso',
    dr: { physical: 3, energy: 3, radiation: 0 },
    type: 'armor', set: 'raider',
  },
  {
    name: 'Heavy Raider Leg',
    value: 18, rarity: 2, weight: 5,
    location: 'legLeft',
    dr: { physical: 3, energy: 3, radiation: 0 },
    type: 'armor', set: 'raider',
  },
  {
    name: 'Heavy Raider Arm',
    value: 15, rarity: 2, weight: 5,
    location: 'armLeft',
    dr: { physical: 3, energy: 3, radiation: 0 },
    type: 'armor', set: 'raider',
  },

  // ===== ARMURE EN CUIR (Leather Armor) =====
  // Standard
  {
    name: 'Leather Chest Piece',
    value: 25, rarity: 1, weight: 2.5,
    location: 'torso',
    dr: { physical: 1, energy: 2, radiation: 0 },
    type: 'armor', set: 'leather',
  },
  {
    name: 'Leather Leg',
    value: 10, rarity: 1, weight: 1,
    location: 'legLeft',
    dr: { physical: 1, energy: 2, radiation: 0 },
    type: 'armor', set: 'leather',
  },
  {
    name: 'Leather Arm',
    value: 8, rarity: 1, weight: 1,
    location: 'armLeft',
    dr: { physical: 1, energy: 2, radiation: 0 },
    type: 'armor', set: 'leather',
  },
  // Sturdy Leather
  {
    name: 'Sturdy Leather Chest Piece',
    value: 50, rarity: 2, weight: 5,
    location: 'torso',
    dr: { physical: 2, energy: 3, radiation: 0 },
    type: 'armor', set: 'leather',
  },
  {
    name: 'Sturdy Leather Leg',
    value: 20, rarity: 2, weight: 2.5,
    location: 'legLeft',
    dr: { physical: 2, energy: 3, radiation: 0 },
    type: 'armor', set: 'leather',
  },
  {
    name: 'Sturdy Leather Arm',
    value: 18, rarity: 2, weight: 2.5,
    location: 'armLeft',
    dr: { physical: 2, energy: 3, radiation: 0 },
    type: 'armor', set: 'leather',
  },
  // Heavy Leather
  {
    name: 'Heavy Leather Chest Piece',
    value: 75, rarity: 3, weight: 7.5,
    location: 'torso',
    dr: { physical: 3, energy: 4, radiation: 0 },
    type: 'armor', set: 'leather',
  },
  {
    name: 'Heavy Leather Leg',
    value: 30, rarity: 3, weight: 3.5,
    location: 'legLeft',
    dr: { physical: 3, energy: 4, radiation: 0 },
    type: 'armor', set: 'leather',
  },
  {
    name: 'Heavy Leather Arm',
    value: 28, rarity: 3, weight: 3.5,
    location: 'armLeft',
    dr: { physical: 3, energy: 4, radiation: 0 },
    type: 'armor', set: 'leather',
  },

  // ===== ARMURE DE MÉTAL (Metal Armor) =====
  {
    name: 'Metal Helmet',
    value: 15, rarity: 1, weight: 1.5,
    location: 'head',
    dr: { physical: 2, energy: 1, radiation: 0 },
    type: 'armor', set: 'metal',
  },
  {
    name: 'Metal Chest Piece',
    value: 40, rarity: 1, weight: 3,
    location: 'torso',
    dr: { physical: 2, energy: 1, radiation: 0 },
    type: 'armor', set: 'metal',
  },
  {
    name: 'Metal Leg',
    value: 15, rarity: 1, weight: 1.5,
    location: 'legLeft',
    dr: { physical: 2, energy: 1, radiation: 0 },
    type: 'armor', set: 'metal',
  },
  {
    name: 'Metal Arm',
    value: 15, rarity: 1, weight: 1.5,
    location: 'armLeft',
    dr: { physical: 2, energy: 1, radiation: 0 },
    type: 'armor', set: 'metal',
  },
  // Sturdy Metal
  {
    name: 'Sturdy Metal Helmet',
    value: 65, rarity: 2, weight: 4,
    location: 'head',
    dr: { physical: 3, energy: 2, radiation: 0 },
    type: 'armor', set: 'metal',
  },
  {
    name: 'Sturdy Metal Chest Piece',
    value: 115, rarity: 2, weight: 8,
    location: 'torso',
    dr: { physical: 3, energy: 2, radiation: 0 },
    type: 'armor', set: 'metal',
  },
  {
    name: 'Sturdy Metal Leg',
    value: 65, rarity: 2, weight: 4,
    location: 'legLeft',
    dr: { physical: 3, energy: 2, radiation: 0 },
    type: 'armor', set: 'metal',
  },
  {
    name: 'Sturdy Metal Arm',
    value: 65, rarity: 2, weight: 4,
    location: 'armLeft',
    dr: { physical: 3, energy: 2, radiation: 0 },
    type: 'armor', set: 'metal',
  },
  // Heavy Metal
  {
    name: 'Heavy Metal Helmet',
    value: 115, rarity: 3, weight: 6,
    location: 'head',
    dr: { physical: 4, energy: 3, radiation: 0 },
    type: 'armor', set: 'metal',
  },
  {
    name: 'Heavy Metal Chest Piece',
    value: 190, rarity: 3, weight: 11.5,
    location: 'torso',
    dr: { physical: 4, energy: 3, radiation: 0 },
    type: 'armor', set: 'metal',
  },
  {
    name: 'Heavy Metal Leg',
    value: 115, rarity: 3, weight: 6,
    location: 'legLeft',
    dr: { physical: 4, energy: 3, radiation: 0 },
    type: 'armor', set: 'metal',
  },
  {
    name: 'Heavy Metal Arm',
    value: 115, rarity: 3, weight: 6,
    location: 'armLeft',
    dr: { physical: 4, energy: 3, radiation: 0 },
    type: 'armor', set: 'metal',
  },

  // ===== ARMURE DE COMBAT (Combat Armor) =====
  {
    name: 'Combat Armor Helmet',
    value: 25, rarity: 2, weight: 2,
    location: 'head',
    dr: { physical: 2, energy: 2, radiation: 0 },
    type: 'armor', set: 'combat',
  },
  {
    name: 'Combat Armor Chest Piece',
    value: 60, rarity: 2, weight: 4,
    location: 'torso',
    dr: { physical: 2, energy: 2, radiation: 0 },
    type: 'armor', set: 'combat',
  },
  {
    name: 'Combat Armor Leg',
    value: 25, rarity: 2, weight: 1,
    location: 'legLeft',
    dr: { physical: 2, energy: 2, radiation: 0 },
    type: 'armor', set: 'combat',
  },
  {
    name: 'Combat Armor Arm',
    value: 25, rarity: 2, weight: 1,
    location: 'armLeft',
    dr: { physical: 2, energy: 2, radiation: 0 },
    type: 'armor', set: 'combat',
  },
  // Sturdy Combat
  {
    name: 'Sturdy Combat Armor Helmet',
    value: 105, rarity: 3, weight: 2.5,
    location: 'head',
    dr: { physical: 3, energy: 3, radiation: 0 },
    type: 'armor', set: 'combat',
  },
  {
    name: 'Sturdy Combat Armor Chest Piece',
    value: 140, rarity: 3, weight: 6,
    location: 'torso',
    dr: { physical: 3, energy: 3, radiation: 0 },
    type: 'armor', set: 'combat',
  },
  {
    name: 'Sturdy Combat Armor Leg',
    value: 105, rarity: 3, weight: 2.5,
    location: 'legLeft',
    dr: { physical: 3, energy: 3, radiation: 0 },
    type: 'armor', set: 'combat',
  },
  {
    name: 'Sturdy Combat Armor Arm',
    value: 105, rarity: 3, weight: 2.5,
    location: 'armLeft',
    dr: { physical: 3, energy: 3, radiation: 0 },
    type: 'armor', set: 'combat',
  },
  // Heavy Combat
  {
    name: 'Heavy Combat Armor Helmet',
    value: 185, rarity: 4, weight: 3.5,
    location: 'head',
    dr: { physical: 4, energy: 4, radiation: 0 },
    type: 'armor', set: 'combat',
  },
  {
    name: 'Heavy Combat Armor Chest Piece',
    value: 220, rarity: 4, weight: 8,
    location: 'torso',
    dr: { physical: 4, energy: 4, radiation: 0 },
    type: 'armor', set: 'combat',
  },
  {
    name: 'Heavy Combat Armor Leg',
    value: 185, rarity: 4, weight: 3.5,
    location: 'legLeft',
    dr: { physical: 4, energy: 4, radiation: 0 },
    type: 'armor', set: 'combat',
  },
  {
    name: 'Heavy Combat Armor Arm',
    value: 145, rarity: 4, weight: 3.5,
    location: 'armLeft',
    dr: { physical: 4, energy: 4, radiation: 0 },
    type: 'armor', set: 'combat',
  },

  // ===== ARMURE DE SYNTHÉTIQUE (Synth Armor) =====
  {
    name: 'Synth Helmet',
    value: 33, rarity: 3, weight: 1.5,
    location: 'head',
    dr: { physical: 2, energy: 3, radiation: 0 },
    type: 'armor', set: 'synth',
  },
  {
    name: 'Synth Chest Piece',
    value: 75, rarity: 3, weight: 3.5,
    location: 'torso',
    dr: { physical: 2, energy: 3, radiation: 0 },
    type: 'armor', set: 'synth',
  },
  {
    name: 'Synth Leg',
    value: 30, rarity: 3, weight: 1.5,
    location: 'legLeft',
    dr: { physical: 2, energy: 3, radiation: 0 },
    type: 'armor', set: 'synth',
  },
  {
    name: 'Synth Arm',
    value: 30, rarity: 3, weight: 1.5,
    location: 'armLeft',
    dr: { physical: 2, energy: 3, radiation: 0 },
    type: 'armor', set: 'synth',
  },
  // Sturdy Synth
  {
    name: 'Sturdy Synth Helmet',
    value: 70, rarity: 4, weight: 3.5,
    location: 'head',
    dr: { physical: 3, energy: 4, radiation: 0 },
    type: 'armor', set: 'synth',
  },
  {
    name: 'Sturdy Synth Chest Piece',
    value: 125, rarity: 4, weight: 6,
    location: 'torso',
    dr: { physical: 3, energy: 4, radiation: 0 },
    type: 'armor', set: 'synth',
  },
  {
    name: 'Sturdy Synth Leg',
    value: 80, rarity: 4, weight: 3.5,
    location: 'legLeft',
    dr: { physical: 3, energy: 4, radiation: 0 },
    type: 'armor', set: 'synth',
  },
  {
    name: 'Sturdy Synth Arm',
    value: 70, rarity: 4, weight: 3.5,
    location: 'armLeft',
    dr: { physical: 3, energy: 4, radiation: 0 },
    type: 'armor', set: 'synth',
  },
  // Heavy Synth
  {
    name: 'Heavy Synth Helmet',
    value: 110, rarity: 5, weight: 5,
    location: 'head',
    dr: { physical: 4, energy: 5, radiation: 0 },
    type: 'armor', set: 'synth',
  },
  {
    name: 'Heavy Synth Chest Piece',
    value: 175, rarity: 5, weight: 8.5,
    location: 'torso',
    dr: { physical: 4, energy: 5, radiation: 0 },
    type: 'armor', set: 'synth',
  },
  {
    name: 'Heavy Synth Leg',
    value: 130, rarity: 5, weight: 5,
    location: 'legLeft',
    dr: { physical: 4, energy: 5, radiation: 0 },
    type: 'armor', set: 'synth',
  },
  {
    name: 'Heavy Synth Arm',
    value: 110, rarity: 5, weight: 5,
    location: 'armLeft',
    dr: { physical: 4, energy: 5, radiation: 0 },
    type: 'armor', set: 'synth',
  },

  // ===== ARMURE DE SÉCURITÉ VAULT-TEC =====
  {
    name: 'Vault-Tec Security Helmet',
    value: 20, rarity: 1, weight: 1,
    location: 'head',
    dr: { physical: 2, energy: 0, radiation: 0 },
    type: 'armor', set: 'vaultTec',
  },
  {
    // Covers torso, arms, and legs (single piece)
    name: 'Vault-Tec Security Armor',
    value: 16, rarity: 1, weight: 4,
    location: 'torso',
    dr: { physical: 2, energy: 0, radiation: 2 },
    type: 'armor', set: 'vaultTec',
  },
];

// ===== ARMURE ASSISTÉE (Power Armor) =====
export const powerArmor: Armor[] = [
  // Châssis d'armure (Power Armor Frame)
  {
    name: 'Power Armor Frame',
    value: 75, rarity: 4, weight: 4500,
    location: 'all',
    dr: { physical: 0, energy: 0, radiation: 0 },
    type: 'powerArmor', set: 'frame',
  },

  // Raider Power Armor
  {
    name: 'Raider Power Armor Helmet',
    value: 50, rarity: 2, weight: 7,
    location: 'head',
    dr: { physical: 6, energy: 4, radiation: 7 },
    type: 'powerArmor', set: 'raiderPower', hp: 7,
  },
  {
    name: 'Raider Power Armor Chest Piece',
    value: 100, rarity: 2, weight: 11,
    location: 'torso',
    dr: { physical: 8, energy: 6, radiation: 9 },
    type: 'powerArmor', set: 'raiderPower', hp: 10,
  },
  {
    name: 'Raider Power Armor Arm',
    value: 75, rarity: 2, weight: 8,
    location: 'armLeft',
    dr: { physical: 4, energy: 3, radiation: 7 },
    type: 'powerArmor', set: 'raiderPower', hp: 7,
  },
  {
    name: 'Raider Power Armor Leg',
    value: 75, rarity: 2, weight: 8.5,
    location: 'legLeft',
    dr: { physical: 4, energy: 3, radiation: 7 },
    type: 'powerArmor', set: 'raiderPower', hp: 7,
  },

  // T-45 Power Armor
  {
    name: 'T-45 Helmet',
    value: 60, rarity: 2, weight: 6,
    location: 'head',
    dr: { physical: 6, energy: 4, radiation: 7 },
    type: 'powerArmor', set: 't45', hp: 7,
  },
  {
    name: 'T-45 Chest Piece',
    value: 140, rarity: 2, weight: 10,
    location: 'torso',
    dr: { physical: 8, energy: 7, radiation: 9 },
    type: 'powerArmor', set: 't45', hp: 14,
  },
  {
    name: 'T-45 Arm',
    value: 100, rarity: 2, weight: 7.5,
    location: 'armLeft',
    dr: { physical: 4, energy: 3, radiation: 7 },
    type: 'powerArmor', set: 't45', hp: 7,
  },
  {
    name: 'T-45 Leg',
    value: 100, rarity: 2, weight: 7.5,
    location: 'legLeft',
    dr: { physical: 4, energy: 3, radiation: 7 },
    type: 'powerArmor', set: 't45', hp: 7,
  },

  // T-51 Power Armor
  {
    name: 'T-51 Helmet',
    value: 80, rarity: 3, weight: 6,
    location: 'head',
    dr: { physical: 6, energy: 5, radiation: 7 },
    type: 'powerArmor', set: 't51', hp: 9,
  },
  {
    name: 'T-51 Chest Piece',
    value: 180, rarity: 3, weight: 10,
    location: 'torso',
    dr: { physical: 8, energy: 7, radiation: 9 },
    type: 'powerArmor', set: 't51', hp: 18,
  },
  {
    name: 'T-51 Arm',
    value: 130, rarity: 3, weight: 7.5,
    location: 'armLeft',
    dr: { physical: 5, energy: 4, radiation: 7 },
    type: 'powerArmor', set: 't51', hp: 9,
  },
  {
    name: 'T-51 Leg',
    value: 130, rarity: 3, weight: 7.5,
    location: 'legLeft',
    dr: { physical: 5, energy: 4, radiation: 7 },
    type: 'powerArmor', set: 't51', hp: 9,
  },

  // T-60 Power Armor
  {
    name: 'T-60 Helmet',
    value: 650, rarity: 4, weight: 6,
    location: 'head',
    dr: { physical: 7, energy: 6, radiation: 7 },
    type: 'powerArmor', set: 't60', hp: 10,
  },
  {
    name: 'T-60 Chest Piece',
    value: 750, rarity: 4, weight: 10,
    location: 'torso',
    dr: { physical: 9, energy: 8, radiation: 9 },
    type: 'powerArmor', set: 't60', hp: 21,
  },
  {
    name: 'T-60 Arm',
    value: 700, rarity: 4, weight: 7.5,
    location: 'armLeft',
    dr: { physical: 6, energy: 5, radiation: 7 },
    type: 'powerArmor', set: 't60', hp: 10,
  },
  {
    name: 'T-60 Leg',
    value: 700, rarity: 4, weight: 7.5,
    location: 'legLeft',
    dr: { physical: 6, energy: 5, radiation: 7 },
    type: 'powerArmor', set: 't60', hp: 10,
  },

  // X-01 Power Armor
  {
    name: 'X-01 Helmet',
    value: 60, rarity: 5, weight: 6,
    location: 'head',
    dr: { physical: 8, energy: 7, radiation: 7 },
    type: 'powerArmor', set: 'x01', hp: 12,
  },
  {
    name: 'X-01 Chest Piece',
    value: 140, rarity: 5, weight: 10,
    location: 'torso',
    dr: { physical: 10, energy: 8, radiation: 9 },
    type: 'powerArmor', set: 'x01', hp: 24,
  },
  {
    name: 'X-01 Arm',
    value: 130, rarity: 5, weight: 7.5,
    location: 'armLeft',
    dr: { physical: 7, energy: 6, radiation: 7 },
    type: 'powerArmor', set: 'x01', hp: 12,
  },
  {
    name: 'X-01 Leg',
    value: 100, rarity: 5, weight: 7.5,
    location: 'legLeft',
    dr: { physical: 7, energy: 6, radiation: 7 },
    type: 'powerArmor', set: 'x01', hp: 12,
  },
];

// ===== ARMURES DE ROBOT =====
export const robotArmor: RobotArmor[] = [
  // Blindages de base
  {
    name: 'Standard Plating',
    drPhysical: 2, drEnergy: 0, isBonus: false,
    location: 'all', value: 0,
  },
  {
    name: 'Mister Gutsy Plating',
    drPhysical: 2, drEnergy: 2, isBonus: false,
    location: 'all', carryModifier: -10, value: 0,
  },

  // Armure d'usine (Factory Armor)
  {
    name: 'Factory Armor - Optic',
    drPhysical: 1, drEnergy: 1, isBonus: true,
    location: 'optic', value: 10,
  },
  {
    name: 'Factory Armor - Body',
    drPhysical: 1, drEnergy: 1, isBonus: true,
    location: 'body', value: 20,
  },
  {
    name: 'Factory Armor - Arm',
    drPhysical: 1, drEnergy: 1, isBonus: true,
    location: 'arm', value: 10,
  },
  {
    name: 'Factory Armor - Thruster',
    drPhysical: 1, drEnergy: 1, isBonus: true,
    location: 'thruster', value: 10,
  },

  // Armure de stockage d'usine
  {
    name: 'Factory Storage Armor - Body',
    drPhysical: 1, drEnergy: 1, isBonus: true,
    location: 'body', carryModifier: 10, value: 25,
    perkRequired: 'Armorer 1',
  },

  // Plaque de base (Base Plating)
  {
    name: 'Base Plating - Optic',
    drPhysical: 2, drEnergy: 0, isBonus: true,
    location: 'optic', carryModifier: -5, value: 10,
  },
  {
    name: 'Base Plating - Body',
    drPhysical: 2, drEnergy: 0, isBonus: true,
    location: 'body', carryModifier: -10, value: 20,
  },
  {
    name: 'Base Plating - Arm',
    drPhysical: 2, drEnergy: 0, isBonus: true,
    location: 'arm', carryModifier: -5, value: 10,
  },
  {
    name: 'Base Plating - Thruster',
    drPhysical: 2, drEnergy: 0, isBonus: true,
    location: 'thruster', carryModifier: -5, value: 10,
  },

  // Plaque dentelée (Serrated Plating)
  {
    name: 'Serrated Plating - Optic',
    drPhysical: 2, drEnergy: 0, isBonus: true,
    location: 'optic', carryModifier: -5, value: 15,
    perkRequired: 'Armorer 1',
    specialEffect: {
      descriptionKey: 'robotArmor.serrated.effect',
      description: 'On complication when hit in melee, attacker takes 2 CD Persistent damage (physical).',
    },
  },
  {
    name: 'Serrated Plating - Body',
    drPhysical: 2, drEnergy: 0, isBonus: true,
    location: 'body', carryModifier: -10, value: 30,
    perkRequired: 'Armorer 1',
    specialEffect: {
      descriptionKey: 'robotArmor.serrated.effect',
      description: 'On complication when hit in melee, attacker takes 2 CD Persistent damage (physical).',
    },
  },
  {
    name: 'Serrated Plating - Arm',
    drPhysical: 2, drEnergy: 0, isBonus: true,
    location: 'arm', carryModifier: -5, value: 15,
    perkRequired: 'Armorer 1',
    specialEffect: {
      descriptionKey: 'robotArmor.serrated.armEffect',
      description: 'Melee attacks with this arm gain Persistent damage effect (physical).',
    },
  },
  {
    name: 'Serrated Plating - Thruster',
    drPhysical: 2, drEnergy: 0, isBonus: true,
    location: 'thruster', carryModifier: -5, value: 15,
    perkRequired: 'Armorer 1',
    specialEffect: {
      descriptionKey: 'robotArmor.serrated.effect',
      description: 'On complication when hit in melee, attacker takes 2 CD Persistent damage (physical).',
    },
  },

  // Plaque néfaste (Sinister Plating)
  {
    name: 'Sinister Plating - Optic',
    drPhysical: 2, drEnergy: 0, isBonus: true,
    location: 'optic', carryModifier: -5, value: 15,
    perkRequired: 'Armorer 1',
    specialEffect: {
      descriptionKey: 'robotArmor.sinister.effect',
      description: 'On complication when hit in melee, attacker takes 2 CD Persistent damage (poison).',
    },
  },
  {
    name: 'Sinister Plating - Body',
    drPhysical: 2, drEnergy: 0, isBonus: true,
    location: 'body', carryModifier: -10, value: 30,
    perkRequired: 'Armorer 1',
    specialEffect: {
      descriptionKey: 'robotArmor.sinister.effect',
      description: 'On complication when hit in melee, attacker takes 2 CD Persistent damage (poison).',
    },
  },
  {
    name: 'Sinister Plating - Arm',
    drPhysical: 2, drEnergy: 0, isBonus: true,
    location: 'arm', carryModifier: -5, value: 15,
    perkRequired: 'Armorer 1',
    specialEffect: {
      descriptionKey: 'robotArmor.sinister.armEffect',
      description: 'Melee attacks with this arm gain Persistent damage effect (poison).',
    },
  },
  {
    name: 'Sinister Plating - Thruster',
    drPhysical: 2, drEnergy: 0, isBonus: true,
    location: 'thruster', carryModifier: -5, value: 15,
    perkRequired: 'Armorer 1',
    specialEffect: {
      descriptionKey: 'robotArmor.sinister.effect',
      description: 'On complication when hit in melee, attacker takes 2 CD Persistent damage (poison).',
    },
  },

  // Plaque toxique (Toxic Plating)
  {
    name: 'Toxic Plating - Optic',
    drPhysical: 2, drEnergy: 0, isBonus: true,
    location: 'optic', carryModifier: -5, value: 15,
    perkRequired: 'Armorer 3',
    specialEffect: {
      descriptionKey: 'robotArmor.toxic.effect',
      description: 'On complication when hit in melee, attacker takes 2 CD radiation damage.',
    },
  },
  {
    name: 'Toxic Plating - Body',
    drPhysical: 2, drEnergy: 0, isBonus: true,
    location: 'body', carryModifier: -10, value: 30,
    perkRequired: 'Armorer 3',
    specialEffect: {
      descriptionKey: 'robotArmor.toxic.effect',
      description: 'On complication when hit in melee, attacker takes 2 CD radiation damage.',
    },
  },
  {
    name: 'Toxic Plating - Arm',
    drPhysical: 2, drEnergy: 0, isBonus: true,
    location: 'arm', carryModifier: -5, value: 15,
    perkRequired: 'Armorer 3',
    specialEffect: {
      descriptionKey: 'robotArmor.toxic.armEffect',
      description: 'Melee attacks with this arm gain Radioactive damage effect.',
    },
  },
  {
    name: 'Toxic Plating - Thruster',
    drPhysical: 2, drEnergy: 0, isBonus: true,
    location: 'thruster', carryModifier: -5, value: 15,
    perkRequired: 'Armorer 3',
    specialEffect: {
      descriptionKey: 'robotArmor.toxic.effect',
      description: 'On complication when hit in melee, attacker takes 2 CD radiation damage.',
    },
  },

  // Châssis actif (Active Chassis)
  {
    name: 'Active Chassis - Optic',
    drPhysical: 1, drEnergy: 1, isBonus: true,
    location: 'optic', carryModifier: 5, value: 15,
  },
  {
    name: 'Active Chassis - Body',
    drPhysical: 1, drEnergy: 1, isBonus: true,
    location: 'body', carryModifier: 10, value: 30,
  },
  {
    name: 'Active Chassis - Arm',
    drPhysical: 1, drEnergy: 1, isBonus: true,
    location: 'arm', carryModifier: 5, value: 15,
    specialEffect: {
      descriptionKey: 'robotArmor.active.armEffect',
      description: 'Melee attacks with this arm deal +1 CD damage.',
    },
  },
  {
    name: 'Active Chassis - Thruster',
    drPhysical: 1, drEnergy: 1, isBonus: true,
    location: 'thruster', carryModifier: 5, value: 15,
    specialEffect: {
      descriptionKey: 'robotArmor.active.thrusterEffect',
      description: 'Can perform both Move (minor) and Sprint (major) actions in the same turn.',
    },
  },

  // Châssis voltaïque (Voltaic Chassis)
  {
    name: 'Voltaic Chassis - Optic',
    drPhysical: 2, drEnergy: 2, isBonus: true,
    location: 'optic', carryModifier: 5, value: 20,
    perkRequired: 'Armorer 2',
    specialEffect: {
      descriptionKey: 'robotArmor.voltaic.effect',
      description: 'Energy attacks deal +1 CD with 1 piece, +2 CD with 3 pieces, +3 CD with 5+ pieces.',
    },
  },
  {
    name: 'Voltaic Chassis - Body',
    drPhysical: 2, drEnergy: 2, isBonus: true,
    location: 'body', carryModifier: 10, value: 40,
    perkRequired: 'Armorer 2',
    specialEffect: {
      descriptionKey: 'robotArmor.voltaic.effect',
      description: 'Energy attacks deal +1 CD with 1 piece, +2 CD with 3 pieces, +3 CD with 5+ pieces.',
    },
  },
  {
    name: 'Voltaic Chassis - Arm',
    drPhysical: 2, drEnergy: 2, isBonus: true,
    location: 'arm', carryModifier: 5, value: 20,
    perkRequired: 'Armorer 2',
    specialEffect: {
      descriptionKey: 'robotArmor.voltaic.effect',
      description: 'Energy attacks deal +1 CD with 1 piece, +2 CD with 3 pieces, +3 CD with 5+ pieces.',
    },
  },
  {
    name: 'Voltaic Chassis - Thruster',
    drPhysical: 2, drEnergy: 2, isBonus: true,
    location: 'thruster', carryModifier: 5, value: 20,
    perkRequired: 'Armorer 2',
    specialEffect: {
      descriptionKey: 'robotArmor.voltaic.effect',
      description: 'Energy attacks deal +1 CD with 1 piece, +2 CD with 3 pieces, +3 CD with 5+ pieces.',
    },
  },

  // Châssis hydraulique (Hydraulic Chassis)
  {
    name: 'Hydraulic Chassis - Optic',
    drPhysical: 3, drEnergy: 3, isBonus: true,
    location: 'optic', carryModifier: 2.5, value: 30,
    perkRequired: 'Armorer 3',
  },
  {
    name: 'Hydraulic Chassis - Body',
    drPhysical: 3, drEnergy: 3, isBonus: true,
    location: 'body', carryModifier: 5, value: 60,
    perkRequired: 'Armorer 3',
  },
  {
    name: 'Hydraulic Chassis - Arm',
    drPhysical: 3, drEnergy: 3, isBonus: true,
    location: 'arm', carryModifier: 2.5, value: 30,
    perkRequired: 'Armorer 3',
    specialEffect: {
      descriptionKey: 'robotArmor.hydraulic.armEffect',
      description: 'Melee attacks with this arm deal +1 CD damage and gain the Stun damage effect.',
    },
  },
  {
    name: 'Hydraulic Chassis - Thruster',
    drPhysical: 3, drEnergy: 3, isBonus: true,
    location: 'thruster', carryModifier: 2.5, value: 30,
    perkRequired: 'Armorer 3',
  },
];
