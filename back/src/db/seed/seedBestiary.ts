import { db } from '../index';
import { eq, sql } from 'drizzle-orm';
import {
  bestiaryEntries,
  bestiaryAttributes,
  bestiarySkills,
  bestiaryDr,
  bestiaryAttacks,
  bestiaryAttackQualities,
  bestiaryAbilities,
  bestiaryInventory,
  bestiaryInventoryMods,
  items,
} from '../schema/index';
import { BESTIARY_ENTRIES } from './data/bestiary';

export async function seedBestiary() {
  console.log('Seeding bestiary...');

  let count = 0;

  for (const entry of BESTIARY_ENTRIES) {
    // 1. Upsert the bestiary entry
    const [inserted] = await db
      .insert(bestiaryEntries)
      .values({
        slug: entry.slug,
        nameKey: entry.nameKey,
        descriptionKey: entry.descriptionKey,
        statBlockType: entry.statBlockType as any,
        category: entry.category as any,
        bodyType: entry.bodyType as any,
        level: entry.level,
        xpReward: entry.xpReward,
        hp: entry.hp,
        defense: entry.defense,
        initiative: entry.initiative,
        meleeDamageBonus: entry.meleeDamageBonus ?? 0,
        carryCapacity: entry.carryCapacity ?? 0,
        maxLuckPoints: entry.maxLuckPoints ?? 0,
        wealth: entry.wealth,
        source: entry.source ?? 'core',
        emoji: entry.emoji,
      })
      .onConflictDoUpdate({
        target: bestiaryEntries.slug,
        set: {
          nameKey: sql`excluded.name_key`,
          descriptionKey: sql`excluded.description_key`,
          statBlockType: sql`excluded.stat_block_type`,
          category: sql`excluded.category`,
          bodyType: sql`excluded.body_type`,
          level: sql`excluded.level`,
          xpReward: sql`excluded.xp_reward`,
          hp: sql`excluded.hp`,
          defense: sql`excluded.defense`,
          initiative: sql`excluded.initiative`,
          meleeDamageBonus: sql`excluded.melee_damage_bonus`,
          carryCapacity: sql`excluded.carry_capacity`,
          maxLuckPoints: sql`excluded.max_luck_points`,
          wealth: sql`excluded.wealth`,
          source: sql`excluded.source`,
          emoji: sql`excluded.emoji`,
        },
      })
      .returning({ id: bestiaryEntries.id });

    const entryId = inserted.id;

    // 2. Clear and re-insert child data
    await db.delete(bestiaryAttributes).where(eq(bestiaryAttributes.bestiaryEntryId, entryId));
    await db.delete(bestiarySkills).where(eq(bestiarySkills.bestiaryEntryId, entryId));
    await db.delete(bestiaryDr).where(eq(bestiaryDr.bestiaryEntryId, entryId));
    await db.delete(bestiaryAbilities).where(eq(bestiaryAbilities.bestiaryEntryId, entryId));
    // Delete inventory mods first (FK on inventory)
    const invRows = await db.select({ id: bestiaryInventory.id }).from(bestiaryInventory).where(eq(bestiaryInventory.bestiaryEntryId, entryId));
    for (const inv of invRows) {
      await db.delete(bestiaryInventoryMods).where(eq(bestiaryInventoryMods.bestiaryInventoryId, inv.id));
    }
    await db.delete(bestiaryInventory).where(eq(bestiaryInventory.bestiaryEntryId, entryId));

    // Delete attacks (and their qualities via cascade)
    await db.delete(bestiaryAttacks).where(eq(bestiaryAttacks.bestiaryEntryId, entryId));

    // 3. Insert attributes
    const attrValues = Object.entries(entry.attributes).map(([attribute, value]) => ({
      bestiaryEntryId: entryId,
      attribute,
      value,
    }));
    if (attrValues.length > 0) {
      await db.insert(bestiaryAttributes).values(attrValues);
    }

    // 4. Insert skills
    if (entry.skills.length > 0) {
      await db.insert(bestiarySkills).values(
        entry.skills.map(s => ({
          bestiaryEntryId: entryId,
          skill: s.skill,
          rank: s.rank,
          isTagSkill: s.isTagSkill ?? false,
        }))
      );
    }

    // 5. Insert DR
    if (entry.dr.length > 0) {
      await db.insert(bestiaryDr).values(
        entry.dr.map(d => ({
          bestiaryEntryId: entryId,
          location: d.location,
          drPhysical: d.drPhysical,
          drEnergy: d.drEnergy,
          drRadiation: d.drRadiation,
          drPoison: d.drPoison,
        }))
      );
    }

    // 6. Insert attacks + qualities
    for (const attack of entry.attacks) {
      // Resolve itemId from item name
      let itemId: number | undefined;
      if (attack.itemName) {
        const [found] = await db
          .select({ id: items.id })
          .from(items)
          .where(eq(items.name, attack.itemName));
        if (found) {
          itemId = found.id;
        }
      }

      const [insertedAttack] = await db
        .insert(bestiaryAttacks)
        .values({
          bestiaryEntryId: entryId,
          nameKey: attack.nameKey,
          skill: attack.skill,
          damage: attack.damage,
          damageType: attack.damageType as any,
          damageBonus: attack.damageBonus,
          fireRate: attack.fireRate,
          range: attack.range as any,
          itemId: itemId,
          twoHanded: attack.twoHanded ?? false,
        })
        .returning({ id: bestiaryAttacks.id });

      // Insert attack qualities
      if (attack.qualities.length > 0) {
        await db.insert(bestiaryAttackQualities).values(
          attack.qualities.map(q => ({
            attackId: insertedAttack.id,
            quality: q.quality,
            value: q.value,
          }))
        );
      }
    }

    // 7. Insert abilities
    if (entry.abilities.length > 0) {
      await db.insert(bestiaryAbilities).values(
        entry.abilities.map(a => ({
          bestiaryEntryId: entryId,
          nameKey: a.nameKey,
          descriptionKey: a.descriptionKey,
        }))
      );
    }

    // 8. Insert inventory (with optional installed mods)
    for (const inv of entry.inventory) {
      const [found] = await db
        .select({ id: items.id })
        .from(items)
        .where(eq(items.name, inv.itemName));
      if (found) {
        const [insertedInv] = await db.insert(bestiaryInventory).values({
          bestiaryEntryId: entryId,
          itemId: found.id,
          quantity: inv.quantity,
          equipped: inv.equipped,
        }).returning({ id: bestiaryInventory.id });

        // Insert pre-installed mods for this inventory item
        if (inv.installedMods && inv.installedMods.length > 0) {
          for (const modName of inv.installedMods) {
            const [modItem] = await db
              .select({ id: items.id })
              .from(items)
              .where(eq(items.name, modName));
            if (modItem) {
              await db.insert(bestiaryInventoryMods).values({
                bestiaryInventoryId: insertedInv.id,
                modItemId: modItem.id,
              });
            } else {
              console.warn(`  ⚠ Mod item not found: "${modName}" for ${entry.slug}`);
            }
          }
        }
      }
    }

    count++;
  }

  console.log(`  Upserted ${count} bestiary entries`);
}
