import type { ItemEffect } from '../../../types/itemEffect';

export interface FoodItem {
  name: string;
  value: number;
  rarity: number;
  weight: number;
  type: 'food' | 'drink';
  irradiated: boolean;
  effectKey?: string;
  effect: ItemEffect;
}

export const food: FoodItem[] = [
  // ===== NOURRITURE =====
  { name: 'Fancy Lads Snack Cakes', value: 18, rarity: 0, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 3 } },
  { name: 'Silt Bean', value: 5, rarity: 1, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 3 } },
  { name: 'Noodle Cup', value: 20, rarity: 2, weight: 0.5, type: 'food', irradiated: false, effect: { hpHealed: 6 } },
  {
    name: 'Sugar Bombs', value: 11, rarity: 0, weight: 0.5, type: 'food', irradiated: true,
    effectKey: 'itemEffects.food.sugarBombs',
    effect: { hpHealed: 4, apBonus: 1 },
  },
  { name: 'Squirrel Bits', value: 4, rarity: 1, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 4 } },
  { name: 'Crispy Squirrel Bits', value: 6, rarity: 2, weight: 0.5, type: 'food', irradiated: false, effect: { hpHealed: 6 } },
  { name: 'Gum Drops', value: 5, rarity: 0, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 3 } },
  { name: 'Squirrel on a Stick', value: 15, rarity: 2, weight: 0.5, type: 'food', irradiated: false, effect: { hpHealed: 7 } },
  { name: 'Iguana on a Stick', value: 33, rarity: 2, weight: 0.5, type: 'food', irradiated: false, effect: { hpHealed: 6 } },
  { name: 'Carrot', value: 3, rarity: 1, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 3 } },
  { name: 'Radroach Meat', value: 3, rarity: 0, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 4 } },
  { name: 'Potato Crisps', value: 7, rarity: 0, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 3 } },
  {
    name: 'Yao Guai Ribs', value: 90, rarity: 4, weight: 0.5, type: 'food', irradiated: false,
    effectKey: 'itemEffects.food.yaoGuaiRibs',
    effect: { hpHealed: 13, drBonus: { physical: 2 }, duration: 'lasting' },
  },
  { name: 'Dog Ribs', value: 12, rarity: 1, weight: 0.5, type: 'food', irradiated: false, effect: { hpHealed: 6 } },
  {
    name: 'Mutant Hound Ribs', value: 12, rarity: 3, weight: 0.5, type: 'food', irradiated: false,
    effectKey: 'itemEffects.food.mutantHoundRibs',
    effect: { hpHealed: 8, radsHealed: 2 },
  },
  { name: 'Gourd', value: 6, rarity: 1, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 3 } },
  { name: 'Cram', value: 25, rarity: 1, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 5 } },
  { name: 'Corn', value: 6, rarity: 1, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 3 } },
  { name: 'Brain Fungus', value: 6, rarity: 1, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 3 } },
  { name: 'Ribeye Steak', value: 40, rarity: 2, weight: 0.5, type: 'food', irradiated: false, effect: { hpHealed: 10 } },
  {
    name: 'Deathclaw Filet', value: 35, rarity: 2, weight: 0.5, type: 'food', irradiated: false,
    effectKey: 'itemEffects.food.deathclawFilet',
    effect: { hpHealed: 11, descriptionKey: 'itemEffects.food.deathclawFilet', duration: 'lasting' },
    // Reroll 1d20 on PER tests until end of next scene
  },
  { name: 'Mutfruit', value: 8, rarity: 0, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 3 } },
  { name: 'Tarberry', value: 5, rarity: 3, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 3 } },
  { name: 'Canned Bean', value: 6, rarity: 1, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 3 } },
  { name: 'BlamCo Mac and Cheese', value: 10, rarity: 1, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 4 } },
  { name: 'Melon', value: 6, rarity: 1, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 3 } },
  {
    name: 'Grilled Bloatfly', value: 15, rarity: 1, weight: 0.5, type: 'food', irradiated: false,
    effectKey: 'itemEffects.food.grilledBloatfly',
    effect: { hpHealed: 6, drBonus: { radiation: 2 }, duration: 'lasting' },
  },
  { name: 'Deathclaw Egg', value: 69, rarity: 3, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 7 } },
  { name: 'Mirelurk Egg', value: 0, rarity: 2, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 3 } },
  { name: 'Radscorpion Egg', value: 48, rarity: 3, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 6 } },
  { name: 'Yum Yum Deviled Eggs', value: 20, rarity: 0, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 4 } },
  {
    name: 'Deathclaw Omelette', value: 80, rarity: 4, weight: 0.5, type: 'food', irradiated: false,
    effectKey: 'itemEffects.food.deathclawOmelette',
    effect: { hpHealed: 11, descriptionKey: 'itemEffects.food.deathclawOmelette', duration: 'lasting' },
    // If next scene is combat, regain 1 HP at start of each turn
  },
  {
    name: 'Mirelurk Egg Omelette', value: 30, rarity: 3, weight: 0.5, type: 'food', irradiated: false,
    effectKey: 'itemEffects.food.mirelurkEggOmelette',
    effect: { hpHealed: 7, apBonus: 2, duration: 'instant' },
  },
  {
    name: 'Radscorpion Egg Omelette', value: 65, rarity: 4, weight: 0.5, type: 'food', irradiated: false,
    effectKey: 'itemEffects.food.radscorpionEggOmelette',
    effect: { hpHealed: 9, removeCondition: ['addicted'] },
  },
  { name: 'Institute Food Packet', value: 10, rarity: 2, weight: 0.5, type: 'food', irradiated: false, effect: { hpHealed: 5 } },
  { name: 'Sweet Roll', value: 9, rarity: 1, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 4 } },
  {
    name: 'Food Paste', value: 0, rarity: 2, weight: 0.5, type: 'food', irradiated: false,
    effectKey: 'itemEffects.food.foodPaste',
    effect: { hpHealed: 7, descriptionKey: 'itemEffects.food.foodPaste', duration: 'lasting' },
    // Reroll 1d20 on END tests until end of scene
  },
  {
    name: 'Mirelurk Paste', value: 35, rarity: 3, weight: 0.5, type: 'food', irradiated: false,
    effectKey: 'itemEffects.food.mirelurkPaste',
    effect: { hpHealed: 12, descriptionKey: 'itemEffects.food.mirelurkPaste', duration: 'lasting' },
    // Can breathe underwater until end of next scene
  },
  { name: 'Dog Food', value: 6, rarity: 0, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 3 } },
  { name: 'Potato', value: 7, rarity: 1, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 3 } },
  { name: 'Dandy Boy Apples', value: 7, rarity: 0, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 3 } },
  { name: 'Pork n Beans', value: 10, rarity: 0, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 4 } },
  { name: 'InstaMash', value: 20, rarity: 0, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 4 } },
  { name: 'Grilled Radroach', value: 7, rarity: 1, weight: 0.5, type: 'food', irradiated: false, effect: { hpHealed: 5 } },
  {
    name: 'Grilled Radstag', value: 60, rarity: 2, weight: 0.5, type: 'food', irradiated: false,
    effectKey: 'itemEffects.food.grilledRadstag',
    effect: { hpHealed: 11, carryCapacityBonus: 12.5, duration: 'lasting' },
  },
  { name: 'Squirrel Stew', value: 24, rarity: 2, weight: 0.5, type: 'food', irradiated: false, effect: { hpHealed: 10 } },
  {
    name: 'Radstag Stew', value: 60, rarity: 3, weight: 0.5, type: 'food', irradiated: false,
    effectKey: 'itemEffects.food.radstag_Stew',
    effect: { hpHealed: 12, drBonus: { energy: 3 }, duration: 'lasting' },
  },
  { name: 'Iguana Stew', value: 8, rarity: 1, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 4 } },
  {
    name: 'Yao Guai Roast', value: 110, rarity: 4, weight: 0.5, type: 'food', irradiated: false,
    effectKey: 'itemEffects.food.yaoGuaiRoast',
    effect: { hpHealed: 14, meleeDamageBonus: 2, duration: 'lasting' },
  },
  {
    name: 'Vegetable Soup', value: 13, rarity: 2, weight: 0.5, type: 'food', irradiated: false,
    effectKey: 'itemEffects.food.vegetableSoup',
    effect: { hpHealed: 7, drBonus: { radiation: 2 }, duration: 'lasting' },
  },
  { name: 'Iguana Soup', value: 21, rarity: 3, weight: 0.5, type: 'food', irradiated: false, effect: { hpHealed: 10 } },
  {
    name: 'Deathclaw Steak', value: 130, rarity: 4, weight: 0.5, type: 'food', irradiated: false,
    effectKey: 'itemEffects.food.deathclawSteak',
    effect: { hpHealed: 14, descriptionKey: 'itemEffects.food.deathclawSteak', duration: 'lasting' },
    // Reroll 1d20 on FOR tests until end of next scene
  },
  {
    name: 'Radscorpion Steak', value: 65, rarity: 3, weight: 0.5, type: 'food', irradiated: false,
    effectKey: 'itemEffects.food.radscorpionSteak',
    effect: { hpHealed: 12, drBonus: { energy: 2 }, duration: 'lasting' },
  },
  {
    name: 'Mole Rat Steak', value: 8, rarity: 1, weight: 0.5, type: 'food', irradiated: false,
    effectKey: 'itemEffects.food.moleRatSteak',
    effect: { hpHealed: 7, descriptionKey: 'itemEffects.food.moleRatSteak', duration: 'lasting' },
    // +1 max AP in group reserve until end of scene
  },
  {
    name: 'Mirelurk Queen Steak', value: 130, rarity: 5, weight: 0.5, type: 'food', irradiated: false,
    effectKey: 'itemEffects.food.mirelurkQueenSteak',
    effect: { hpHealed: 14, descriptionKey: 'itemEffects.food.mirelurkQueenSteak', duration: 'lasting' },
    // END difficulty -1 until end of scene
  },
  {
    name: 'Stingwing Steak', value: 18, rarity: 2, weight: 0.5, type: 'food', irradiated: false,
    effectKey: 'itemEffects.food.stingwingSteak',
    effect: { hpHealed: 10, maxHpBonus: 3, duration: 'lasting' },
  },
  { name: 'Salisbury Steak', value: 20, rarity: 0, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 5 } },
  { name: 'Perfectly Preserved Pie', value: 20, rarity: 3, weight: 0.5, type: 'food', irradiated: false, effect: { hpHealed: 5 } },

  // ===== VIANDES CRUES =====
  { name: 'Brahmin Meat', value: 28, rarity: 1, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 3 } },
  { name: 'Stray Dog Meat', value: 8, rarity: 0, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 4 } },
  { name: 'Deathclaw Meat', value: 30, rarity: 1, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 8 } },
  { name: 'Deathclaw Meat Large', value: 110, rarity: 3, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 9 } },
  { name: 'Mirelurk Meat', value: 18, rarity: 1, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 6 } },
  { name: 'Softshell Mirelurk Meat', value: 22, rarity: 2, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 6 } },
  {
    name: 'Grilled Mirelurk Meat', value: 40, rarity: 3, weight: 0.5, type: 'food', irradiated: false,
    effectKey: 'itemEffects.food.grilledMirelurkMeat',
    effect: { hpHealed: 9, apBonus: 1 },
  },
  {
    name: 'Roasted Mirelurk Meat', value: 40, rarity: 2, weight: 0.5, type: 'food', irradiated: false,
    effectKey: 'itemEffects.food.roastedMirelurkMeat',
    effect: { hpHealed: 8, apBonus: 1 },
  },
  { name: 'Mutant Hound Meat', value: 8, rarity: 2, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 5 } },
  { name: 'Bloatfly Meat', value: 8, rarity: 0, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 2 } },
  { name: 'Radstag Meat', value: 50, rarity: 1, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 8 } },
  { name: 'Radscorpion Meat', value: 55, rarity: 2, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 9 } },
  { name: 'Mole Rat Meat', value: 5, rarity: 0, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 5 } },
  {
    name: 'Queen Mirelurk Meat', value: 22, rarity: 4, weight: 0.5, type: 'food', irradiated: true,
    effectKey: 'itemEffects.food.queenMirelurkMeat',
    effect: { hpHealed: 10, descriptionKey: 'itemEffects.food.queenMirelurkMeat', duration: 'lasting' },
    // Reroll 1d20 on END tests until end of scene
  },
  { name: 'Stingwing Meat', value: 8, rarity: 1, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 7 } },
  { name: 'Yao Guai Meat', value: 85, rarity: 3, weight: 0.5, type: 'food', irradiated: true, effect: { hpHealed: 9 } },
  {
    name: 'Canned Meat', value: 25, rarity: 0, weight: 0.5, type: 'food', irradiated: true,
    effectKey: 'itemEffects.food.cannedMeat',
    effect: { hpHealed: 6, descriptionKey: 'itemEffects.food.cannedMeat' },
    // Roll 2 CD instead of 1 for radiation damage when consumed
  },

  // ===== BOISSONS =====
  {
    name: 'Beer', value: 5, rarity: 1, weight: 0.5, type: 'drink', irradiated: false,
    effectKey: 'itemEffects.drinks.beer',
    effect: { descriptionKey: 'itemEffects.drinks.beer' },
    // Alcoholic
  },
  {
    name: 'Refreshing Beverage', value: 110, rarity: 5, weight: 0.5, type: 'drink', irradiated: false,
    effectKey: 'itemEffects.drinks.refreshingBeverage',
    effect: { hpHealed: 11, radsHealed: 10, removeCondition: ['addicted'] },
  },
  {
    name: 'Bourbon', value: 7, rarity: 2, weight: 0.5, type: 'drink', irradiated: false,
    effectKey: 'itemEffects.drinks.bourbon',
    effect: { descriptionKey: 'itemEffects.drinks.bourbon' },
    // Alcoholic, reroll 1d20 on END tests
  },
  {
    name: 'Moonshine', value: 30, rarity: 3, weight: 0.5, type: 'drink', irradiated: false,
    effectKey: 'itemEffects.drinks.moonshine',
    effect: { maxHpBonus: 2, descriptionKey: 'itemEffects.drinks.moonshine' },
    // Alcoholic, +2 HP max
  },
  { name: 'Purified Water', value: 20, rarity: 1, weight: 0.5, type: 'drink', irradiated: false, effect: { hpHealed: 3 } },
  { name: 'Dirty Water', value: 5, rarity: 0, weight: 0.5, type: 'drink', irradiated: true, effect: { hpHealed: 2 } },
  {
    name: 'Dirty Wastelander', value: 10, rarity: 3, weight: 0.5, type: 'drink', irradiated: false,
    effectKey: 'itemEffects.drinks.dirtyWastelander',
    effect: { descriptionKey: 'itemEffects.drinks.dirtyWastelander' },
    // Alcoholic, FOR difficulty -1, INT difficulty +2
  },
  {
    name: 'Mutfruit Juice', value: 8, rarity: 2, weight: 0.5, type: 'drink', irradiated: false,
    effectKey: 'itemEffects.drinks.mutfruitJuice',
    effect: { hpHealed: 3, descriptionKey: 'itemEffects.drinks.mutfruitJuice', duration: 'lasting' },
    // Reroll 1d20 on AGI tests
  },
  {
    name: 'Tarberry Juice', value: 5, rarity: 4, weight: 0.5, type: 'drink', irradiated: false,
    effectKey: 'itemEffects.drinks.tarberryJuice',
    effect: { hpHealed: 3, apBonus: 6 },
  },
  {
    name: 'Melon Juice', value: 6, rarity: 2, weight: 0.5, type: 'drink', irradiated: false,
    effectKey: 'itemEffects.drinks.melonJuice',
    effect: { hpHealed: 3, descriptionKey: 'itemEffects.drinks.melonJuice', duration: 'lasting' },
    // Heal 1 HP at start of each turn
  },
  {
    name: 'Potato Juice', value: 7, rarity: 3, weight: 0.5, type: 'drink', irradiated: false,
    effectKey: 'itemEffects.drinks.potatoJuice',
    effect: { hpHealed: 3, descriptionKey: 'itemEffects.drinks.potatoJuice', duration: 'lasting' },
    // Group AP pool can hold 1 more AP than normal
  },
  {
    name: 'Brahmin Milk', value: 15, rarity: 2, weight: 0.5, type: 'drink', irradiated: false,
    effectKey: 'itemEffects.drinks.brahminMilk',
    effect: { hpHealed: 1, radsHealed: 2 },
  },
  {
    name: 'Nuka-Cherry', value: 40, rarity: 3, weight: 0.5, type: 'drink', irradiated: true,
    effectKey: 'itemEffects.drinks.nukaCherry',
    effect: { hpHealed: 3, apBonus: 2 },
  },
  {
    name: 'Nuka-Cola', value: 20, rarity: 2, weight: 0.5, type: 'drink', irradiated: true,
    effectKey: 'itemEffects.drinks.nukaCola',
    effect: { hpHealed: 2, apBonus: 1 },
  },
  {
    name: 'Nuka-Cola Quantum', value: 50, rarity: 5, weight: 0.5, type: 'drink', irradiated: true,
    effectKey: 'itemEffects.drinks.nukaColaQuantum',
    effect: { hpHealed: 10, apBonus: 5 },
  },
  { name: 'Blood Pack', value: 10, rarity: 2, weight: 0.5, type: 'drink', irradiated: false, effect: { hpHealed: 3 } },
  {
    name: 'Glowing Blood Pack', value: 30, rarity: 3, weight: 0.5, type: 'drink', irradiated: false,
    effectKey: 'itemEffects.drinks.glowingBloodPack',
    effect: { hpHealed: 4, drBonus: { radiation: 5 } },
  },
  {
    name: 'Rum', value: 8, rarity: 2, weight: 0.5, type: 'drink', irradiated: false,
    effectKey: 'itemEffects.drinks.rum',
    effect: { descriptionKey: 'itemEffects.drinks.rum' },
    // Alcoholic, reroll 1d20 on AGI tests
  },
  {
    name: 'Irradiated Blood', value: 50, rarity: 2, weight: 0.5, type: 'drink', irradiated: true,
    effectKey: 'itemEffects.drinks.irradiatedBlood',
    effect: { hpHealed: 3, descriptionKey: 'itemEffects.drinks.irradiatedBlood' },
    // Roll 2 CD instead of 1 for radiation damage when consumed
  },
  {
    name: 'Wine', value: 5, rarity: 3, weight: 0.5, type: 'drink', irradiated: false,
    effectKey: 'itemEffects.drinks.wine',
    effect: { apBonus: 1, descriptionKey: 'itemEffects.drinks.wine' },
    // Alcoholic, gain +1 AP immediately
  },
  {
    name: 'Vodka', value: 5, rarity: 3, weight: 0.5, type: 'drink', irradiated: false,
    effectKey: 'itemEffects.drinks.vodka',
    effect: { hpHealed: 2, descriptionKey: 'itemEffects.drinks.vodka' },
    // Alcoholic
  },
  {
    name: 'Whiskey', value: 5, rarity: 3, weight: 0.5, type: 'drink', irradiated: false,
    effectKey: 'itemEffects.drinks.whiskey',
    effect: { descriptionKey: 'itemEffects.drinks.whiskey' },
    // Alcoholic, reroll up to 2d20 (total) on FOR tests
  },
];
