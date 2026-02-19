export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function pickByRarity<T extends { rarity: number }>(
  items: T[],
  maxRarity: number = 6
): T {
  const weightedPool: T[] = [];
  items.forEach(item => {
    const weight = Math.pow(maxRarity - item.rarity + 1, 2);
    for (let i = 0; i < weight; i++) {
      weightedPool.push(item);
    }
  });
  return pickRandom(weightedPool);
}

export function filterByMaxRarity<T extends { rarity: number }>(
  items: T[],
  maxRarity: number
): T[] {
  return items.filter(item => item.rarity <= maxRarity);
}
