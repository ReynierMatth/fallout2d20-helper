import type { ItemEffect } from '../../../types/itemEffect';

export type ChemDuration = 'instant' | 'brief' | 'lasting';

export interface Chem {
  name: string;
  value: number;
  rarity: number;
  weight: number;
  duration: ChemDuration;
  addictive: boolean;
  addictionLevel: number;
  effectKey: string;
  effect?: ItemEffect;
}

export const chems: Chem[] = [
  // ===== MEDICAMENTS =====
  {
    name: 'Addictol', value: 125, rarity: 3, weight: 0.5,
    duration: 'instant', addictive: false, addictionLevel: 0,
    effectKey: 'itemEffects.chems.addictol',
    effect: { removeCondition: ['addicted'] },
  },
  {
    name: 'Antibiotics', value: 75, rarity: 3, weight: 0.5,
    duration: 'instant', addictive: false, addictionLevel: 0,
    effectKey: 'itemEffects.chems.antibiotics',
    effect: { removeCondition: ['diseased'] },
  },
  {
    name: 'Healing Salve', value: 20, rarity: 1, weight: 0.5,
    duration: 'instant', addictive: false, addictionLevel: 0,
    effectKey: 'itemEffects.chems.healingSalve',
    effect: { hpHealed: 2 },
  },
  {
    name: 'Skeeto Spit', value: 40, rarity: 2, weight: 0.5,
    duration: 'lasting', addictive: false, addictionLevel: 0,
    effectKey: 'itemEffects.chems.skeetoSpit',
    effect: { maxHpBonus: 2 },
  },
  {
    name: 'Stimpak', value: 50, rarity: 2, weight: 0.5,
    duration: 'instant', addictive: false, addictionLevel: 0,
    effectKey: 'itemEffects.chems.stimpak',
    effect: { hpHealed: 4 },
  },
  {
    name: 'Stimpak (Diluted)', value: 30, rarity: 1, weight: 0.5,
    duration: 'instant', addictive: false, addictionLevel: 0,
    effectKey: 'itemEffects.chems.stimpakDiluted',
    effect: { hpHealed: 2 },
  },
  {
    name: 'Super Stimpak', value: 90, rarity: 4, weight: 0.5,
    duration: 'instant', addictive: false, addictionLevel: 0,
    effectKey: 'itemEffects.chems.superStimpak',
    effect: { hpHealed: 8 },
  },
  {
    name: 'RadAway', value: 80, rarity: 2, weight: 0.5,
    duration: 'instant', addictive: false, addictionLevel: 0,
    effectKey: 'itemEffects.chems.radAway',
    effect: { radsHealed: 4 },
  },
  {
    name: 'RadAway (Diluted)', value: 50, rarity: 1, weight: 0.5,
    duration: 'instant', addictive: false, addictionLevel: 0,
    effectKey: 'itemEffects.chems.radAwayDiluted',
    effect: { radsHealed: 2 },
  },
  {
    name: 'Rad-X', value: 40, rarity: 2, weight: 0.5,
    duration: 'lasting', addictive: false, addictionLevel: 0,
    effectKey: 'itemEffects.chems.radX',
    effect: { drBonus: { radiation: 6 } },
  },
  {
    name: 'Rad-X (Diluted)', value: 25, rarity: 1, weight: 0.5,
    duration: 'lasting', addictive: false, addictionLevel: 0,
    effectKey: 'itemEffects.chems.radXDiluted',
    effect: { drBonus: { radiation: 3 } },
  },

  // ===== DROGUES DE COMBAT =====
  {
    name: 'Buffjet', value: 75, rarity: 4, weight: 0.5,
    duration: 'brief', addictive: true, addictionLevel: 1,
    effectKey: 'itemEffects.chems.buffjet',
    effect: {
      maxHpBonus: 4, apBonus: 3,
      descriptionKey: 'itemEffects.chems.buffjet',
      // FOR/END difficulty -1 (min 0), additional actions cost 1 AP less
    },
  },
  {
    name: 'Buffout', value: 45, rarity: 2, weight: 0.5,
    duration: 'lasting', addictive: true, addictionLevel: 2,
    effectKey: 'itemEffects.chems.buffout',
    effect: {
      maxHpBonus: 3,
      descriptionKey: 'itemEffects.chems.buffout',
      // Reroll 1d20 on all FOR and END tests
    },
  },
  {
    name: 'Bufftats', value: 75, rarity: 4, weight: 0.5,
    duration: 'lasting', addictive: true, addictionLevel: 1,
    effectKey: 'itemEffects.chems.bufftats',
    effect: {
      maxHpBonus: 4,
      descriptionKey: 'itemEffects.chems.bufftats',
      // FOR/PER/END difficulty -1 (min 0)
    },
  },
  {
    name: 'Calmex', value: 100, rarity: 4, weight: 0.5,
    duration: 'lasting', addictive: true, addictionLevel: 1,
    effectKey: 'itemEffects.chems.calmex',
    effect: {
      descriptionKey: 'itemEffects.chems.calmex',
      // Reroll 1d20 on PER and AGI tests, +2 CD sneak attack damage
    },
  },
  {
    name: 'Daddy-O', value: 50, rarity: 2, weight: 0.5,
    duration: 'lasting', addictive: true, addictionLevel: 1,
    effectKey: 'itemEffects.chems.daddyO',
    effect: {
      descriptionKey: 'itemEffects.chems.daddyO',
      // PER/INT difficulty -1 (min 0), CHR difficulty +1
    },
  },
  {
    name: 'Day Tripper', value: 40, rarity: 3, weight: 0.5,
    duration: 'lasting', addictive: true, addictionLevel: 1,
    effectKey: 'itemEffects.chems.dayTripper',
    effect: {
      descriptionKey: 'itemEffects.chems.dayTripper',
      // CHR and CHA(Luck) difficulty -1 (min 0), FOR difficulty +1
    },
  },
  {
    name: 'Fury', value: 30, rarity: 4, weight: 0.5,
    duration: 'lasting', addictive: true, addictionLevel: 1,
    effectKey: 'itemEffects.chems.fury',
    effect: {
      drBonus: { physical: 3 }, meleeDamageBonus: 3,
      descriptionKey: 'itemEffects.chems.fury',
      // PER difficulty +2
    },
  },
  {
    name: 'Jet', value: 50, rarity: 2, weight: 0.5,
    duration: 'brief', addictive: true, addictionLevel: 2,
    effectKey: 'itemEffects.chems.jet',
    effect: {
      descriptionKey: 'itemEffects.chems.jet',
      // Additional actions cost 1 AP less
    },
  },
  {
    name: 'Jet Fuel', value: 60, rarity: 3, weight: 0.5,
    duration: 'lasting', addictive: true, addictionLevel: 1,
    effectKey: 'itemEffects.chems.jetFuel',
    effect: {
      descriptionKey: 'itemEffects.chems.jetFuel',
      // Gain 1 free AP at the start of each turn
    },
  },
  {
    name: 'Med-X', value: 50, rarity: 2, weight: 0.5,
    duration: 'lasting', addictive: true, addictionLevel: 2,
    effectKey: 'itemEffects.chems.medX',
    effect: { drBonus: { physical: 3 } },
  },
  {
    name: 'Mentats', value: 50, rarity: 2, weight: 0.5,
    duration: 'lasting', addictive: true, addictionLevel: 3,
    effectKey: 'itemEffects.chems.mentats',
    effect: {
      descriptionKey: 'itemEffects.chems.mentats',
      // Reroll 1d20 on PER and INT tests
    },
  },
  {
    name: 'Berry Mentats', value: 60, rarity: 3, weight: 0.5,
    duration: 'lasting', addictive: true, addictionLevel: 2,
    effectKey: 'itemEffects.chems.berryMentats',
    effect: {
      descriptionKey: 'itemEffects.chems.berryMentats',
      // INT difficulty -2 (min 0)
    },
  },
  {
    name: 'Orange Mentats', value: 60, rarity: 3, weight: 0.5,
    duration: 'lasting', addictive: true, addictionLevel: 2,
    effectKey: 'itemEffects.chems.orangeMentats',
    effect: {
      descriptionKey: 'itemEffects.chems.orangeMentats',
      // PER difficulty -2 (min 0), aim minor action rerolls 1 extra d20
    },
  },
  {
    name: 'Grape Mentats', value: 60, rarity: 3, weight: 0.5,
    duration: 'lasting', addictive: true, addictionLevel: 2,
    effectKey: 'itemEffects.chems.grapeMentats',
    effect: {
      descriptionKey: 'itemEffects.chems.grapeMentats',
      // CHR difficulty -2 (min 0), reroll 1d20 on Barter tests
    },
  },
  {
    name: 'Overdrive', value: 55, rarity: 3, weight: 0.5,
    duration: 'lasting', addictive: true, addictionLevel: 1,
    effectKey: 'itemEffects.chems.overdrive',
    effect: {
      damageBonus: 3,
      descriptionKey: 'itemEffects.chems.overdrive',
      // Reroll up to 3 CD per damage roll
    },
  },
  {
    name: 'Psycho', value: 50, rarity: 2, weight: 0.5,
    duration: 'lasting', addictive: true, addictionLevel: 2,
    effectKey: 'itemEffects.chems.psycho',
    effect: { damageBonus: 2, drBonus: { physical: 3 } },
  },
  {
    name: 'Psychobuff', value: 70, rarity: 4, weight: 0.5,
    duration: 'lasting', addictive: true, addictionLevel: 1,
    effectKey: 'itemEffects.chems.psychobuff',
    effect: {
      damageBonus: 2, maxHpBonus: 4,
      descriptionKey: 'itemEffects.chems.psychobuff',
      // FOR/END difficulty -1 (min 0)
    },
  },
  {
    name: 'Psycho Jet', value: 70, rarity: 4, weight: 0.5,
    duration: 'brief', addictive: true, addictionLevel: 1,
    effectKey: 'itemEffects.chems.psychoJet',
    effect: { damageBonus: 2, drBonus: { physical: 4 }, apBonus: 4 },
  },
  {
    name: 'Psychotats', value: 70, rarity: 4, weight: 0.5,
    duration: 'lasting', addictive: true, addictionLevel: 1,
    effectKey: 'itemEffects.chems.psychotats',
    effect: {
      damageBonus: 2, drBonus: { physical: 2 },
      descriptionKey: 'itemEffects.chems.psychotats',
      // PER difficulty -1 (min 0)
    },
  },
  {
    name: 'Ultra Jet', value: 67, rarity: 2, weight: 0.5,
    duration: 'brief', addictive: true, addictionLevel: 3,
    effectKey: 'itemEffects.chems.ultraJet',
    effect: {
      apBonus: 6,
      descriptionKey: 'itemEffects.chems.ultraJet',
      // Additional actions cost 1 AP less
    },
  },
  {
    name: 'X-Cell', value: 60, rarity: 4, weight: 0.5,
    duration: 'lasting', addictive: true, addictionLevel: 1,
    effectKey: 'itemEffects.chems.xCell',
    effect: {
      descriptionKey: 'itemEffects.chems.xCell',
      // First purchased d20 on all tests is free
    },
  },
];
