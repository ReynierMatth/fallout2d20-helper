import type { Clothing } from './types';

export const clothing: Clothing[] = [
  // ===== VÊTEMENTS =====
  {
    name: 'Harness',
    value: 5, rarity: 0, weight: 0.5,
    locations: ['torso', 'armLeft', 'armRight', 'legLeft', 'legRight'],
    dr: { physical: 0, energy: 0, radiation: 0 },
    effects: [],
  },
  {
    name: 'Brotherhood of Steel Uniform',
    value: 20, rarity: 2, weight: 1,
    locations: ['torso', 'armLeft', 'armRight', 'legLeft', 'legRight'],
    dr: { physical: 1, energy: 1, radiation: 1 },
    effects: [],
  },
  {
    name: 'Casual Clothes',
    value: 20, rarity: 1, weight: 1,
    locations: ['torso', 'armLeft', 'armRight', 'legLeft', 'legRight'],
    dr: { physical: 0, energy: 0, radiation: 0 },
    effects: [],
  },
  {
    name: 'Leather Clothes',
    value: 5, rarity: 1, weight: 0.5,
    locations: ['torso', 'armLeft', 'armRight', 'legLeft', 'legRight'],
    dr: { physical: 1, energy: 1, radiation: 0 },
    effects: [],
  },
  {
    name: 'Sturdy Clothes',
    value: 20, rarity: 1, weight: 1.5,
    locations: ['torso', 'armLeft', 'armRight', 'legLeft', 'legRight'],
    dr: { physical: 1, energy: 1, radiation: 0 },
    effects: [],
  },
  {
    name: 'Military Fatigues',
    value: 12, rarity: 1, weight: 1.5,
    locations: ['torso', 'armLeft', 'armRight', 'legLeft', 'legRight'],
    dr: { physical: 0, energy: 1, radiation: 0 },
    effects: [],
  },
  {
    name: 'Vault Jumpsuit',
    value: 20, rarity: 2, weight: 0.5,
    locations: ['torso', 'armLeft', 'armRight', 'legLeft', 'legRight'],
    dr: { physical: 0, energy: 1, radiation: 2 },
    effects: [],
  },

  // ===== TENUES =====
  {
    name: 'Nomad Outfit',
    value: 35, rarity: 1, weight: 5,
    locations: ['torso', 'armLeft', 'armRight', 'legLeft', 'legRight'],
    dr: { physical: 1, energy: 2, radiation: 0 },
    effects: [],
  },

  // ===== COUVRE-CHEFS & ARMURES LÉGÈRES =====
  {
    name: 'Hides',
    value: 13, rarity: 0, weight: 2,
    locations: ['torso', 'armLeft', 'armRight', 'legLeft', 'legRight'],
    dr: { physical: 1, energy: 0, radiation: 0 },
    effects: [],
  },
  {
    name: 'Cage Armor',
    value: 110, rarity: 3, weight: 16.5,
    locations: ['head', 'torso', 'armLeft', 'armRight', 'legLeft', 'legRight'],
    dr: { physical: 3, energy: 4, radiation: 0 },
    effects: [],
  },
  {
    name: 'Engineer Armor',
    value: 15, rarity: 1, weight: 1,
    locations: ['torso', 'armLeft', 'armRight', 'legLeft', 'legRight'],
    dr: { physical: 1, energy: 1, radiation: 0 },
    effects: [],
  },
  {
    // 1/scene: reroll 1d20 on END skill test
    name: 'Heavy Coat',
    value: 20, rarity: 1, weight: 1,
    locations: ['torso', 'armLeft', 'armRight', 'legLeft', 'legRight'],
    dr: { physical: 1, energy: 1, radiation: 1 },
    effects: [
      { type: 'other', descriptionKey: 'clothing.effects.heavyCoat' },
    ],
  },
  {
    // Ignore difficulty increase from bright light
    name: 'Casual Hat',
    value: 15, rarity: 1, weight: 0.5,
    locations: ['head'],
    dr: { physical: 0, energy: 0, radiation: 0 },
    effects: [
      { type: 'other', descriptionKey: 'clothing.effects.casualHat' },
    ],
  },
  {
    name: 'Military Helmet',
    value: 20, rarity: 1, weight: 1.5,
    locations: ['head'],
    dr: { physical: 2, energy: 0, radiation: 0 },
    effects: [],
  },
  {
    // 1/scene: reroll 1d20 on INT skill test
    name: 'Lab Coat',
    value: 15, rarity: 2, weight: 0.5,
    locations: ['torso', 'armLeft', 'armRight'],
    dr: { physical: 0, energy: 1, radiation: 1 },
    effects: [
      { type: 'other', descriptionKey: 'clothing.effects.labCoat' },
    ],
  },
  {
    // +5 carry capacity
    name: 'Work Coveralls',
    value: 12, rarity: 1, weight: 1,
    locations: ['torso', 'armLeft', 'armRight', 'legLeft', 'legRight'],
    dr: { physical: 2, energy: 0, radiation: 0 },
    effects: [],
    effect: { carryCapacityBonus: 5 },
  },
  {
    name: 'Fancy Clothes',
    value: 30, rarity: 2, weight: 1,
    locations: ['torso', 'armLeft', 'armRight', 'legLeft', 'legRight'],
    dr: { physical: 0, energy: 0, radiation: 0 },
    effects: [],
  },
  {
    name: 'Brotherhood Field Scribe Armor',
    value: 20, rarity: 2, weight: 2,
    locations: ['torso', 'armLeft', 'armRight', 'legLeft', 'legRight'],
    dr: { physical: 1, energy: 2, radiation: 2 },
    effects: [],
  },
  {
    name: 'Brotherhood of Steel Fatigues',
    value: 20, rarity: 3, weight: 2,
    locations: ['torso', 'armLeft', 'armRight', 'legLeft', 'legRight'],
    dr: { physical: 2, energy: 2, radiation: 2 },
    effects: [],
  },
  {
    name: 'Brotherhood Field Scribe Hat',
    value: 8, rarity: 2, weight: 0.5,
    locations: ['head'],
    dr: { physical: 0, energy: 2, radiation: 0 },
    effects: [],
  },
  {
    name: 'Brotherhood of Steel Hood',
    value: 12, rarity: 2, weight: 0.5,
    locations: ['head'],
    dr: { physical: 0, energy: 1, radiation: 0 },
    effects: [],
  },
  {
    // Radiation immunity
    name: 'Hazmat Suit',
    value: 85, rarity: 3, weight: 2.5,
    locations: ['head', 'torso', 'armLeft', 'armRight', 'legLeft', 'legRight'],
    dr: { physical: 0, energy: 0, radiation: 0 },
    effects: [],
    effect: { radiationImmunity: true },
  },
  {
    name: 'Spiked Armor',
    value: 65, rarity: 2, weight: 8.5,
    locations: ['head', 'torso', 'armLeft', 'armRight', 'legLeft', 'legRight'],
    dr: { physical: 2, energy: 2, radiation: 0 },
    effects: [],
  },

  // ===== COUVRE-CHEFS =====
  {
    name: 'Sack Hood',
    value: 5, rarity: 0, weight: 0.5,
    locations: ['head'],
    dr: { physical: 0, energy: 0, radiation: 2 },
    effects: [],
  },
  {
    name: 'Hood',
    value: 5, rarity: 1, weight: 1,
    locations: ['head'],
    dr: { physical: 1, energy: 0, radiation: 1 },
    effects: [],
  },
  {
    name: 'Hard Hat',
    value: 15, rarity: 1, weight: 0.5,
    locations: ['head'],
    dr: { physical: 2, energy: 0, radiation: 0 },
    effects: [],
  },
  {
    name: 'Welding Mask',
    value: 20, rarity: 2, weight: 2,
    locations: ['head'],
    dr: { physical: 2, energy: 2, radiation: 0 },
    effects: [],
  },
  {
    // 1/scene: reroll 1d20 on CHR skill test
    name: 'Fancy Hat',
    value: 15, rarity: 2, weight: 0.5,
    locations: ['head'],
    dr: { physical: 0, energy: 0, radiation: 0 },
    effects: [
      { type: 'other', descriptionKey: 'clothing.effects.fancyHat' },
    ],
  },
  {
    // +3 DR poison, immune to gas/dust effects, +1 difficulty on Speech tests
    name: 'Gas Mask',
    value: 10, rarity: 2, weight: 1.5,
    locations: ['head'],
    dr: { physical: 1, energy: 0, radiation: 3, poison: 3 },
    effects: [
      { type: 'other', descriptionKey: 'clothing.effects.gasMask' },
    ],
    effect: { drBonus: { poison: 3 }, descriptionKey: 'clothing.effects.gasMask' },
  },
];
