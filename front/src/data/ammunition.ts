export interface Ammunition {
  name: string;
  nameKey?: string;
  value: number;
  rarity: number;
  weight: number;
  flatAmount: number;
  randomAmount: number; // Number of CD to roll
}

export interface SyringerAmmo {
  name: string;
  nameKey?: string;
  value: number;
  effectKey: string; // i18n key for effect description
}

export const ammunition: Ammunition[] = [
  // ===== RARITY 0 =====
  { name: '.38 Rounds', value: 1, rarity: 0, weight: 0.1, flatAmount: 10, randomAmount: 5 },
  { name: '10mm Rounds', value: 2, rarity: 0, weight: 0.1, flatAmount: 8, randomAmount: 4 },

  // ===== RARITY 1 =====
  { name: '.308 Rounds', value: 3, rarity: 1, weight: 0.1, flatAmount: 6, randomAmount: 3 },
  { name: 'Flares', value: 1, rarity: 1, weight: 0.1, flatAmount: 2, randomAmount: 1 },
  { name: 'Shotgun Shells', value: 3, rarity: 1, weight: 0.1, flatAmount: 6, randomAmount: 3 },

  // ===== RARITY 2 =====
  { name: '.45 Rounds', value: 3, rarity: 2, weight: 0.1, flatAmount: 8, randomAmount: 4 },
  { name: 'Flamer Fuel', value: 1, rarity: 2, weight: 0.1, flatAmount: 12, randomAmount: 6 },
  { name: 'Fusion Cells', value: 3, rarity: 2, weight: 0.1, flatAmount: 14, randomAmount: 7 },
  { name: 'Gamma Rounds', value: 10, rarity: 2, weight: 0.1, flatAmount: 4, randomAmount: 2 },
  { name: 'Railway Spikes', value: 1, rarity: 2, weight: 0.1, flatAmount: 6, randomAmount: 3 },
  { name: 'Syringer Ammo', value: 0, rarity: 2, weight: 0.1, flatAmount: 4, randomAmount: 2 }, // Value depends on type

  // ===== RARITY 3 =====
  { name: '.44 Magnum Rounds', value: 3, rarity: 3, weight: 0.1, flatAmount: 4, randomAmount: 2 },
  { name: '.50 Rounds', value: 4, rarity: 3, weight: 0.1, flatAmount: 4, randomAmount: 2 },
  { name: '5.56mm Rounds', value: 2, rarity: 3, weight: 0.1, flatAmount: 8, randomAmount: 4 },
  { name: '5mm Rounds', value: 1, rarity: 3, weight: 0.1, flatAmount: 12, randomAmount: 6 },
  { name: 'Fusion Core', value: 200, rarity: 3, weight: 2, flatAmount: 0, randomAmount: 1 },
  { name: 'Missiles', value: 25, rarity: 3, weight: 3.5, flatAmount: 2, randomAmount: 1 },

  // ===== RARITY 4 =====
  { name: 'Plasma Cartridges', value: 5, rarity: 4, weight: 0.1, flatAmount: 10, randomAmount: 5 },

  // ===== RARITY 5 =====
  { name: '2mm EC Rounds', value: 10, rarity: 5, weight: 0.1, flatAmount: 6, randomAmount: 3 },

  // ===== RARITY 6 =====
  { name: 'Mini Nuke', value: 100, rarity: 6, weight: 6, flatAmount: 1, randomAmount: 1 },
];

export const syringerAmmo: SyringerAmmo[] = [
  {
    name: 'Antibloc',
    value: 40,
    effectKey: 'itemEffects.syringerAmmo.antibloc',
  },
  {
    name: 'Dangerol',
    value: 60,
    effectKey: 'itemEffects.syringerAmmo.dangerol',
  },
  {
    name: 'Embrumaze',
    value: 73,
    effectKey: 'itemEffects.syringerAmmo.embrumaze',
  },
  {
    name: 'Yellow Belly',
    value: 55,
    effectKey: 'itemEffects.syringerAmmo.yellowBelly',
  },
  {
    name: 'Berserk',
    value: 50,
    effectKey: 'itemEffects.syringerAmmo.berserk',
  },
  {
    name: 'Bleed-out',
    value: 17,
    effectKey: 'itemEffects.syringerAmmo.bleedout',
  },
  {
    name: 'Bloatfly Larva',
    value: 10,
    effectKey: 'itemEffects.syringerAmmo.bloatflyLarva',
  },
  {
    name: 'Pax',
    value: 39,
    effectKey: 'itemEffects.syringerAmmo.pax',
  },
  {
    name: 'Radscorpion Venom',
    value: 65,
    effectKey: 'itemEffects.syringerAmmo.radscorpionVenom',
  },
];
