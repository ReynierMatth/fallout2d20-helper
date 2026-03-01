import { db } from '../index';
import { sql } from 'drizzle-orm';
import { items, mods, modEffects } from '../schema/index';
import { ALL_MODS } from './data/mods';
import type { ModEntry } from './data/mods';

export async function seedMods() {
  console.log('Seeding mods...');

  let count = 0;

  for (const mod of ALL_MODS) {
    // 1. Upsert the item entry (name unique constraint)
    const [insertedItem] = await db
      .insert(items)
      .values({
        itemType: 'mod',
        name: mod.name,
        nameKey: mod.nameKey,
        value: mod.cost,
        rarity: 1,
        weight: Math.max(0, mod.weightChange),
      })
      .onConflictDoUpdate({
        target: items.name,
        set: {
          nameKey: sql`excluded.name_key`,
          value: sql`excluded.value`,
          weight: sql`excluded.weight`,
        },
      })
      .returning({ id: items.id });

    const itemId = insertedItem.id;

    // 2. Upsert the mod entry
    const [insertedMod] = await db
      .insert(mods)
      .values({
        itemId,
        slot: mod.slot as any,
        applicableTo: mod.applicableTo as any,
        nameAddKey: mod.nameAddKey,
        weightChange: mod.weightChange,
        requiredPerk: mod.requiredPerk,
        requiredPerkRank: mod.requiredPerkRank,
      })
      .onConflictDoUpdate({
        target: mods.itemId,
        set: {
          slot: sql`excluded.slot`,
          applicableTo: sql`excluded.applicable_to`,
          nameAddKey: sql`excluded.name_add_key`,
          weightChange: sql`excluded.weight_change`,
          requiredPerk: sql`excluded.required_perk`,
          requiredPerkRank: sql`excluded.required_perk_rank`,
        },
      })
      .returning({ id: mods.id });

    const modId = insertedMod.id;

    // 3. Replace effects (delete + re-insert)
    await db.delete(modEffects).where(sql`${modEffects.modId} = ${modId}`);

    if (mod.effects.length > 0) {
      await db.insert(modEffects).values(
        mod.effects.map((e) => ({
          modId,
          effectType: e.effectType as any,
          numericValue: e.numericValue,
          qualityName: e.qualityName as any,
          qualityValue: e.qualityValue,
          ammoType: e.ammoType as any,
          descriptionKey: e.descriptionKey,
        }))
      );
    }

    count++;
  }

  console.log(`  Upserted ${count} mods`);
}
