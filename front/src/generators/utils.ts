/**
 * Generate a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Roll a d20
 */
export function rollD20(): number {
  return randomInt(1, 20);
}

/**
 * Roll multiple d20s and return results
 */
export function rollMultipleD20(count: number): number[] {
  return Array.from({ length: count }, () => rollD20());
}

/**
 * Pick a random item from an array
 */
export function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Pick multiple random items from an array (with potential duplicates)
 */
export function pickMultipleRandom<T>(array: T[], count: number): T[] {
  return Array.from({ length: count }, () => pickRandom(array));
}

/**
 * Weighted random selection based on rarity
 * Lower rarity = more common = higher chance
 */
export function pickByRarity<T extends { rarity: number }>(
  items: T[],
  maxRarity: number = 6
): T {
  // Create weighted pool - items with lower rarity appear more often
  const weightedPool: T[] = [];

  items.forEach(item => {
    // Weight = maxRarity - rarity + 1
    // Rarity 0 -> weight 7, Rarity 5 -> weight 2
    const weight = Math.pow(maxRarity - item.rarity + 1, 2);
    for (let i = 0; i < weight; i++) {
      weightedPool.push(item);
    }
  });

  return pickRandom(weightedPool);
}

/**
 * Filter items by maximum rarity (based on wealth/luck)
 */
export function filterByMaxRarity<T extends { rarity: number }>(
  items: T[],
  maxRarity: number
): T[] {
  return items.filter(item => item.rarity <= maxRarity);
}

/**
 * Calculate 2d20 success count
 */
export interface DiceResult {
  rolls: number[];
  successes: number;
  complications: number;
  criticalSuccess: boolean;
}

export function roll2d20(
  targetNumber: number,
  critRange: number = 1,
  complicationRange: number = 20
): DiceResult {
  const rolls = rollMultipleD20(2);

  let successes = 0;
  let complications = 0;
  let criticalSuccess = false;

  rolls.forEach(roll => {
    if (roll <= critRange) {
      successes += 2;
      criticalSuccess = true;
    } else if (roll <= targetNumber) {
      successes += 1;
    }

    if (roll >= complicationRange) {
      complications += 1;
    }
  });

  return { rolls, successes, complications, criticalSuccess };
}

/**
 * Format caps value with icon
 */
export function formatCaps(value: number): string {
  return `${value} caps`;
}

/**
 * Format weight
 */
export function formatWeight(weight: number): string {
  if (weight === 0) return '-';
  return `${weight} lbs`;
}

/**
 * Get rarity label
 */
export function getRarityLabel(rarity: number): string {
  const labels = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary', 'Unique', 'Mythic'];
  return labels[rarity] || 'Unknown';
}

/**
 * Get rarity color class
 */
export function getRarityColor(rarity: number): string {
  const colors = [
    'text-gray-400',      // 0 - Common
    'text-green-400',     // 1 - Uncommon
    'text-blue-400',      // 2 - Rare
    'text-purple-400',    // 3 - Very Rare
    'text-yellow-400',    // 4 - Legendary
    'text-orange-400',    // 5 - Unique
    'text-red-400',       // 6 - Mythic
  ];
  return colors[rarity] || 'text-white';
}
