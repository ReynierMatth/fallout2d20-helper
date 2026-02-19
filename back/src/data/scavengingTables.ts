export type AreaType =
  | 'Residential'
  | 'Commercial'
  | 'Industrial'
  | 'Medical'
  | 'Military/Police'
  | 'Hideout'
  | 'Mutant'
  | 'Vault'
  | 'Public';

export type AreaSize = 'Tiny' | 'Small' | 'Average' | 'Large';

export type LootCategory =
  | 'Ammunition'
  | 'Armor'
  | 'Clothing'
  | 'Food'
  | 'Beverages'
  | 'Chems'
  | 'Melee Weapons'
  | 'Ranged Weapons'
  | 'Thrown/Explosives'
  | 'Oddities/Valuables'
  | 'Junk';

export interface LootRange {
  min: number;
  max: number;
}

export type MerchantCategory =
  | 'Weapons'
  | 'Ammunition'
  | 'Armor'
  | 'Power Armor'
  | 'Clothing'
  | 'Chems'
  | 'Food/Drink'
  | 'General Goods';

export const merchantCategories: MerchantCategory[] = [
  'Weapons',
  'Ammunition',
  'Armor',
  'Power Armor',
  'Clothing',
  'Chems',
  'Food/Drink',
  'General Goods',
];

export const MERCHANT_CAPS_BY_WEALTH = [20, 50, 150, 400, 1000];

const parseRange = (range: string): LootRange => {
  const [min, max] = range.split('-').map(Number);
  return { min, max };
};

export const scavengingTables: Record<AreaType, Record<LootCategory, Record<AreaSize, LootRange>>> = {
  Residential: {
    Ammunition: { Tiny: parseRange('0-1'), Small: parseRange('0-1'), Average: parseRange('0-1'), Large: parseRange('0-3') },
    Armor: { Tiny: parseRange('0-0'), Small: parseRange('0-0'), Average: parseRange('0-0'), Large: parseRange('0-1') },
    Clothing: { Tiny: parseRange('0-0'), Small: parseRange('1-2'), Average: parseRange('1-2'), Large: parseRange('2-4') },
    Food: { Tiny: parseRange('0-0'), Small: parseRange('1-3'), Average: parseRange('2-4'), Large: parseRange('3-6') },
    Beverages: { Tiny: parseRange('0-0'), Small: parseRange('1-2'), Average: parseRange('1-3'), Large: parseRange('2-4') },
    Chems: { Tiny: parseRange('0-1'), Small: parseRange('0-1'), Average: parseRange('0-1'), Large: parseRange('0-2') },
    'Melee Weapons': { Tiny: parseRange('0-0'), Small: parseRange('0-0'), Average: parseRange('0-0'), Large: parseRange('0-1') },
    'Ranged Weapons': { Tiny: parseRange('0-1'), Small: parseRange('0-1'), Average: parseRange('0-1'), Large: parseRange('0-2') },
    'Thrown/Explosives': { Tiny: parseRange('0-0'), Small: parseRange('0-0'), Average: parseRange('0-0'), Large: parseRange('0-1') },
    'Oddities/Valuables': { Tiny: parseRange('0-1'), Small: parseRange('0-0'), Average: parseRange('0-0'), Large: parseRange('1-2') },
    Junk: { Tiny: parseRange('0-2'), Small: parseRange('1-4'), Average: parseRange('2-6'), Large: parseRange('4-9') },
  },
  Commercial: {
    Ammunition: { Tiny: parseRange('0-0'), Small: parseRange('0-1'), Average: parseRange('0-1'), Large: parseRange('0-3') },
    Armor: { Tiny: parseRange('0-0'), Small: parseRange('0-0'), Average: parseRange('0-0'), Large: parseRange('0-1') },
    Clothing: { Tiny: parseRange('0-0'), Small: parseRange('0-2'), Average: parseRange('1-2'), Large: parseRange('1-4') },
    Food: { Tiny: parseRange('0-1'), Small: parseRange('0-2'), Average: parseRange('1-2'), Large: parseRange('1-4') },
    Beverages: { Tiny: parseRange('0-1'), Small: parseRange('1-2'), Average: parseRange('1-2'), Large: parseRange('2-4') },
    Chems: { Tiny: parseRange('0-0'), Small: parseRange('0-1'), Average: parseRange('0-1'), Large: parseRange('0-2') },
    'Melee Weapons': { Tiny: parseRange('0-0'), Small: parseRange('0-0'), Average: parseRange('0-1'), Large: parseRange('0-2') },
    'Ranged Weapons': { Tiny: parseRange('0-1'), Small: parseRange('0-1'), Average: parseRange('0-2'), Large: parseRange('1-4') },
    'Thrown/Explosives': { Tiny: parseRange('0-0'), Small: parseRange('0-0'), Average: parseRange('0-1'), Large: parseRange('0-2') },
    'Oddities/Valuables': { Tiny: parseRange('1-2'), Small: parseRange('1-4'), Average: parseRange('2-4'), Large: parseRange('3-6') },
    Junk: { Tiny: parseRange('1-2'), Small: parseRange('2-4'), Average: parseRange('3-6'), Large: parseRange('5-9') },
  },
  Industrial: {
    Ammunition: { Tiny: parseRange('0-0'), Small: parseRange('0-1'), Average: parseRange('0-1'), Large: parseRange('0-3') },
    Armor: { Tiny: parseRange('0-0'), Small: parseRange('0-0'), Average: parseRange('0-0'), Large: parseRange('0-1') },
    Clothing: { Tiny: parseRange('0-0'), Small: parseRange('0-2'), Average: parseRange('1-2'), Large: parseRange('1-4') },
    Food: { Tiny: parseRange('0-1'), Small: parseRange('0-2'), Average: parseRange('0-2'), Large: parseRange('1-3') },
    Beverages: { Tiny: parseRange('0-1'), Small: parseRange('1-2'), Average: parseRange('1-2'), Large: parseRange('2-4') },
    Chems: { Tiny: parseRange('0-0'), Small: parseRange('0-1'), Average: parseRange('0-1'), Large: parseRange('0-2') },
    'Melee Weapons': { Tiny: parseRange('0-1'), Small: parseRange('0-2'), Average: parseRange('2-4'), Large: parseRange('3-6') },
    'Ranged Weapons': { Tiny: parseRange('0-0'), Small: parseRange('0-1'), Average: parseRange('0-1'), Large: parseRange('0-2') },
    'Thrown/Explosives': { Tiny: parseRange('0-1'), Small: parseRange('0-1'), Average: parseRange('1-2'), Large: parseRange('1-3') },
    'Oddities/Valuables': { Tiny: parseRange('0-1'), Small: parseRange('1-2'), Average: parseRange('1-4'), Large: parseRange('2-4') },
    Junk: { Tiny: parseRange('1-2'), Small: parseRange('2-4'), Average: parseRange('4-6'), Large: parseRange('6-9') },
  },
  Medical: {
    Ammunition: { Tiny: parseRange('0-0'), Small: parseRange('0-0'), Average: parseRange('0-1'), Large: parseRange('0-1') },
    Armor: { Tiny: parseRange('0-0'), Small: parseRange('0-0'), Average: parseRange('0-0'), Large: parseRange('0-1') },
    Clothing: { Tiny: parseRange('0-0'), Small: parseRange('1-2'), Average: parseRange('2-4'), Large: parseRange('3-6') },
    Food: { Tiny: parseRange('0-1'), Small: parseRange('0-2'), Average: parseRange('1-4'), Large: parseRange('2-4') },
    Beverages: { Tiny: parseRange('0-1'), Small: parseRange('1-2'), Average: parseRange('1-2'), Large: parseRange('2-4') },
    Chems: { Tiny: parseRange('1-2'), Small: parseRange('2-4'), Average: parseRange('3-6'), Large: parseRange('4-9') },
    'Melee Weapons': { Tiny: parseRange('0-0'), Small: parseRange('0-0'), Average: parseRange('0-1'), Large: parseRange('0-1') },
    'Ranged Weapons': { Tiny: parseRange('0-0'), Small: parseRange('0-0'), Average: parseRange('0-1'), Large: parseRange('0-1') },
    'Thrown/Explosives': { Tiny: parseRange('0-0'), Small: parseRange('0-0'), Average: parseRange('0-1'), Large: parseRange('0-1') },
    'Oddities/Valuables': { Tiny: parseRange('0-1'), Small: parseRange('0-1'), Average: parseRange('1-2'), Large: parseRange('2-4') },
    Junk: { Tiny: parseRange('0-1'), Small: parseRange('2-4'), Average: parseRange('3-6'), Large: parseRange('4-9') },
  },
  'Military/Police': {
    Ammunition: { Tiny: parseRange('1-2'), Small: parseRange('2-4'), Average: parseRange('4-6'), Large: parseRange('6-9') },
    Armor: { Tiny: parseRange('0-1'), Small: parseRange('1-2'), Average: parseRange('2-4'), Large: parseRange('3-6') },
    Clothing: { Tiny: parseRange('0-1'), Small: parseRange('0-2'), Average: parseRange('1-2'), Large: parseRange('2-4') },
    Food: { Tiny: parseRange('0-1'), Small: parseRange('0-2'), Average: parseRange('1-2'), Large: parseRange('2-4') },
    Beverages: { Tiny: parseRange('0-1'), Small: parseRange('1-2'), Average: parseRange('1-2'), Large: parseRange('2-4') },
    Chems: { Tiny: parseRange('0-1'), Small: parseRange('0-2'), Average: parseRange('1-2'), Large: parseRange('1-4') },
    'Melee Weapons': { Tiny: parseRange('0-1'), Small: parseRange('0-2'), Average: parseRange('1-3'), Large: parseRange('2-4') },
    'Ranged Weapons': { Tiny: parseRange('1-1'), Small: parseRange('1-2'), Average: parseRange('2-4'), Large: parseRange('3-6') },
    'Thrown/Explosives': { Tiny: parseRange('1-1'), Small: parseRange('1-2'), Average: parseRange('2-4'), Large: parseRange('3-6') },
    'Oddities/Valuables': { Tiny: parseRange('0-1'), Small: parseRange('0-1'), Average: parseRange('1-2'), Large: parseRange('2-4') },
    Junk: { Tiny: parseRange('0-1'), Small: parseRange('1-4'), Average: parseRange('2-4'), Large: parseRange('3-6') },
  },
  Hideout: {
    Ammunition: { Tiny: parseRange('0-1'), Small: parseRange('1-2'), Average: parseRange('2-4'), Large: parseRange('3-6') },
    Armor: { Tiny: parseRange('0-1'), Small: parseRange('1-2'), Average: parseRange('2-4'), Large: parseRange('2-6') },
    Clothing: { Tiny: parseRange('0-1'), Small: parseRange('0-2'), Average: parseRange('1-2'), Large: parseRange('2-4') },
    Food: { Tiny: parseRange('0-1'), Small: parseRange('1-2'), Average: parseRange('2-4'), Large: parseRange('3-6') },
    Beverages: { Tiny: parseRange('0-1'), Small: parseRange('1-2'), Average: parseRange('1-4'), Large: parseRange('2-6') },
    Chems: { Tiny: parseRange('0-1'), Small: parseRange('0-2'), Average: parseRange('1-4'), Large: parseRange('2-6') },
    'Melee Weapons': { Tiny: parseRange('0-1'), Small: parseRange('1-2'), Average: parseRange('2-4'), Large: parseRange('2-6') },
    'Ranged Weapons': { Tiny: parseRange('0-1'), Small: parseRange('1-2'), Average: parseRange('1-4'), Large: parseRange('2-4') },
    'Thrown/Explosives': { Tiny: parseRange('0-2'), Small: parseRange('0-2'), Average: parseRange('1-4'), Large: parseRange('2-6') },
    'Oddities/Valuables': { Tiny: parseRange('1-2'), Small: parseRange('1-2'), Average: parseRange('1-4'), Large: parseRange('2-4') },
    Junk: { Tiny: parseRange('0-1'), Small: parseRange('1-2'), Average: parseRange('2-4'), Large: parseRange('2-6') },
  },
  Mutant: {
    Ammunition: { Tiny: parseRange('0-1'), Small: parseRange('1-2'), Average: parseRange('2-4'), Large: parseRange('3-6') },
    Armor: { Tiny: parseRange('0-1'), Small: parseRange('1-2'), Average: parseRange('2-4'), Large: parseRange('2-6') },
    Clothing: { Tiny: parseRange('0-0'), Small: parseRange('0-2'), Average: parseRange('1-2'), Large: parseRange('2-4') },
    Food: { Tiny: parseRange('0-0'), Small: parseRange('1-2'), Average: parseRange('2-4'), Large: parseRange('2-6') },
    Beverages: { Tiny: parseRange('0-0'), Small: parseRange('1-2'), Average: parseRange('1-4'), Large: parseRange('1-4') },
    Chems: { Tiny: parseRange('0-0'), Small: parseRange('0-1'), Average: parseRange('0-2'), Large: parseRange('1-2') },
    'Melee Weapons': { Tiny: parseRange('0-1'), Small: parseRange('1-2'), Average: parseRange('2-4'), Large: parseRange('2-6') },
    'Ranged Weapons': { Tiny: parseRange('0-1'), Small: parseRange('1-2'), Average: parseRange('1-4'), Large: parseRange('2-4') },
    'Thrown/Explosives': { Tiny: parseRange('0-2'), Small: parseRange('0-2'), Average: parseRange('1-4'), Large: parseRange('2-6') },
    'Oddities/Valuables': { Tiny: parseRange('0-0'), Small: parseRange('0-1'), Average: parseRange('1-2'), Large: parseRange('1-4') },
    Junk: { Tiny: parseRange('1-2'), Small: parseRange('2-4'), Average: parseRange('2-6'), Large: parseRange('3-6') },
  },
  Vault: {
    Ammunition: { Tiny: parseRange('1-2'), Small: parseRange('1-4'), Average: parseRange('2-4'), Large: parseRange('2-6') },
    Armor: { Tiny: parseRange('0-0'), Small: parseRange('0-0'), Average: parseRange('0-0'), Large: parseRange('0-1') },
    Clothing: { Tiny: parseRange('0-0'), Small: parseRange('1-2'), Average: parseRange('1-2'), Large: parseRange('2-4') },
    Food: { Tiny: parseRange('0-1'), Small: parseRange('1-3'), Average: parseRange('2-4'), Large: parseRange('3-6') },
    Beverages: { Tiny: parseRange('0-1'), Small: parseRange('1-2'), Average: parseRange('1-3'), Large: parseRange('2-4') },
    Chems: { Tiny: parseRange('0-1'), Small: parseRange('0-1'), Average: parseRange('0-1'), Large: parseRange('1-2') },
    'Melee Weapons': { Tiny: parseRange('0-1'), Small: parseRange('0-1'), Average: parseRange('1-2'), Large: parseRange('1-4') },
    'Ranged Weapons': { Tiny: parseRange('0-1'), Small: parseRange('0-1'), Average: parseRange('1-2'), Large: parseRange('2-4') },
    'Thrown/Explosives': { Tiny: parseRange('0-1'), Small: parseRange('0-1'), Average: parseRange('1-2'), Large: parseRange('2-4') },
    'Oddities/Valuables': { Tiny: parseRange('0-0'), Small: parseRange('0-0'), Average: parseRange('0-0'), Large: parseRange('1-2') },
    Junk: { Tiny: parseRange('0-1'), Small: parseRange('0-2'), Average: parseRange('1-2'), Large: parseRange('2-4') },
  },
  Public: {
    Ammunition: { Tiny: parseRange('0-0'), Small: parseRange('0-1'), Average: parseRange('0-1'), Large: parseRange('0-3') },
    Armor: { Tiny: parseRange('0-0'), Small: parseRange('0-0'), Average: parseRange('0-0'), Large: parseRange('0-1') },
    Clothing: { Tiny: parseRange('0-0'), Small: parseRange('0-2'), Average: parseRange('1-2'), Large: parseRange('1-4') },
    Food: { Tiny: parseRange('0-1'), Small: parseRange('0-2'), Average: parseRange('1-2'), Large: parseRange('1-4') },
    Beverages: { Tiny: parseRange('0-1'), Small: parseRange('1-2'), Average: parseRange('1-2'), Large: parseRange('2-4') },
    Chems: { Tiny: parseRange('0-0'), Small: parseRange('0-1'), Average: parseRange('0-1'), Large: parseRange('0-2') },
    'Melee Weapons': { Tiny: parseRange('0-0'), Small: parseRange('0-0'), Average: parseRange('0-1'), Large: parseRange('0-2') },
    'Ranged Weapons': { Tiny: parseRange('0-0'), Small: parseRange('0-0'), Average: parseRange('0-1'), Large: parseRange('0-2') },
    'Thrown/Explosives': { Tiny: parseRange('0-0'), Small: parseRange('0-0'), Average: parseRange('0-0'), Large: parseRange('0-1') },
    'Oddities/Valuables': { Tiny: parseRange('1-2'), Small: parseRange('1-4'), Average: parseRange('2-4'), Large: parseRange('3-6') },
    Junk: { Tiny: parseRange('1-2'), Small: parseRange('2-4'), Average: parseRange('3-6'), Large: parseRange('5-9') },
  },
};

export const areaTypes: AreaType[] = [
  'Residential', 'Commercial', 'Industrial', 'Medical',
  'Military/Police', 'Hideout', 'Mutant', 'Vault', 'Public',
];

export const areaSizes: AreaSize[] = ['Tiny', 'Small', 'Average', 'Large'];

export const lootCategories: LootCategory[] = [
  'Ammunition', 'Armor', 'Clothing', 'Food', 'Beverages',
  'Chems', 'Melee Weapons', 'Ranged Weapons', 'Thrown/Explosives',
  'Oddities/Valuables', 'Junk',
];

export type DiscoveryDegree = 'untouched' | 'partiallySearched' | 'carefullySearched' | 'cleanedOut';

export interface DiscoveryDegreeInfo {
  id: DiscoveryDegree;
  difficulty: number;
}

export const DISCOVERY_DEGREES: DiscoveryDegreeInfo[] = [
  { id: 'untouched', difficulty: 0 },
  { id: 'partiallySearched', difficulty: 1 },
  { id: 'carefullySearched', difficulty: 2 },
  { id: 'cleanedOut', difficulty: 3 },
];

export function getMaxRarityForLevel(locationLevel: number): number {
  return Math.min(Math.ceil(locationLevel / 4), 5);
}
