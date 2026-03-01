import { db } from '../index';
import { sql } from 'drizzle-orm';
import { items, weaponCompatibleMods } from '../schema/index';
import { ALL_WEAPON_MOD_COMPATIBILITY } from './data/weaponCompatibility';

export async function seedWeaponCompatibility() {
  console.log('Seeding weapon-mod compatibility...');

  // Build a name → id map for all items
  const allItems = await db.select({ id: items.id, name: items.name }).from(items);
  const itemIdMap = new Map<string, number>(allItems.map((i) => [i.name, i.id]));

  let pairsInserted = 0;
  let warnings = 0;

  for (const entry of ALL_WEAPON_MOD_COMPATIBILITY) {
    const weaponItemId = itemIdMap.get(entry.weaponName);
    if (!weaponItemId) {
      console.warn(`  [SKIP] Weapon not found in DB: "${entry.weaponName}"`);
      warnings++;
      continue;
    }

    for (const modName of entry.modNames) {
      const modItemId = itemIdMap.get(modName);
      if (!modItemId) {
        console.warn(`  [SKIP] Mod not found in DB: "${modName}" (for ${entry.weaponName})`);
        warnings++;
        continue;
      }

      await db
        .insert(weaponCompatibleMods)
        .values({ weaponItemId, modItemId })
        .onConflictDoNothing({ target: [weaponCompatibleMods.weaponItemId, weaponCompatibleMods.modItemId] });

      pairsInserted++;
    }
  }

  console.log(`  Inserted ${pairsInserted} weapon-mod compatibility pairs`);
  if (warnings > 0) {
    console.log(`  ${warnings} warning(s) — see above`);
  }
}
