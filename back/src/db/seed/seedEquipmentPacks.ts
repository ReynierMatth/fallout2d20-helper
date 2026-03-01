import { db } from '../index';
import { eq, and, inArray } from 'drizzle-orm';
import {
  items,
  equipmentPacks,
  originEquipmentPacks,
  equipmentPackItems,
  equipmentPackChoiceOptions,
  robotArmAttachments,
  tagSkillBonusItems,
  levelBonusCaps,
} from '../schema/index';

import {
  EQUIPMENT_PACKS,
  WASTELAND_PACKS,
  ROBOT_ARM_ATTACHMENTS,
  TAG_SKILL_BONUS_ITEMS,
  LEVEL_BONUS_CAPS,
  isEquipmentChoice,
} from './data/equipmentPacks';
import type { EquipmentPack, EquipmentEntry } from './data/equipmentPacks';
import type { OriginId } from './data/characters';

function categoryToItemType(category: string): string | null {
  switch (category) {
    case 'weapon': return 'weapon';
    case 'armor': return 'armor';
    case 'robotArmor': return 'robotArmor';
    case 'clothing': return 'clothing';
    case 'ammo': return 'ammunition';
    case 'chem': return 'chem';
    case 'food': return 'food';
    case 'misc': return 'generalGood';
    case 'caps': return null;
    default: return null;
  }
}

async function getItemIdByNameAndCategory(itemName: string, category: string): Promise<number | null> {
  const itemType = categoryToItemType(category);
  if (!itemType) return null;

  const [item] = await db
    .select({ id: items.id })
    .from(items)
    .where(and(eq(items.name, itemName), eq(items.itemType, itemType as any)));

  return item?.id ?? null;
}

export async function seedEquipmentPacks() {
  console.log('Seeding equipment packs...');

  const allPacks: EquipmentPack[] = [...WASTELAND_PACKS];
  for (const originPacks of EQUIPMENT_PACKS) {
    for (const pack of originPacks.packs) {
      allPacks.push(pack);
    }
  }

  const insertedPackIds = new Set<string>();
  for (const pack of allPacks) {
    if (insertedPackIds.has(pack.id)) continue;
    insertedPackIds.add(pack.id);

    await db
      .insert(equipmentPacks)
      .values({ id: pack.id, nameKey: pack.nameKey, descriptionKey: pack.descriptionKey })
      .onConflictDoUpdate({
        target: equipmentPacks.id,
        set: { nameKey: pack.nameKey, descriptionKey: pack.descriptionKey },
      });

    // Delete existing pack items (choice options cascade manually since no DB cascade)
    const existingItems = await db
      .select({ id: equipmentPackItems.id })
      .from(equipmentPackItems)
      .where(eq(equipmentPackItems.packId, pack.id));

    if (existingItems.length > 0) {
      const existingItemIds = existingItems.map((i) => i.id);
      await db.delete(equipmentPackChoiceOptions).where(inArray(equipmentPackChoiceOptions.parentItemId, existingItemIds));
      await db.delete(equipmentPackItems).where(eq(equipmentPackItems.packId, pack.id));
    }

    let sortOrder = 0;
    for (const entry of pack.items) {
      await insertEquipmentEntry(pack.id, entry, sortOrder++);
    }
  }

  console.log(`  Upserted ${insertedPackIds.size} equipment packs`);

  // Re-link origins to packs
  let linkCount = 0;
  for (const originPacks of EQUIPMENT_PACKS) {
    const originId = originPacks.originId as OriginId;
    const packsToLink = originPacks.packs.length > 0 ? originPacks.packs : WASTELAND_PACKS;

    await db.delete(originEquipmentPacks).where(eq(originEquipmentPacks.originId, originId as any));

    let sortOrder = 0;
    for (const pack of packsToLink) {
      await db.insert(originEquipmentPacks).values({ originId, packId: pack.id, sortOrder: sortOrder++ });
      linkCount++;
    }
  }

  console.log(`  Created ${linkCount} origin-pack links`);
}

async function insertEquipmentEntry(packId: string, entry: EquipmentEntry, sortOrder: number) {
  if (isEquipmentChoice(entry)) {
    const [choiceGroup] = await db
      .insert(equipmentPackItems)
      .values({ packId, sortOrder, isChoiceGroup: true, choiceCount: entry.choiceCount ?? 1 })
      .returning({ id: equipmentPackItems.id });

    for (const option of entry.options) {
      const itemId = await getItemIdByNameAndCategory(option.itemName, option.category);
      if (itemId) {
        await db.insert(equipmentPackChoiceOptions).values({
          parentItemId: choiceGroup.id,
          itemId,
          quantity: option.quantity ?? 1,
          quantityCD: option.quantityCD,
          location: option.location,
        });
      } else {
        console.warn(`  Warning: Item not found for choice option: ${option.itemName} (${option.category})`);
      }
    }
  } else {
    if (entry.category === 'caps') return;

    const itemId = await getItemIdByNameAndCategory(entry.itemName, entry.category);
    if (itemId) {
      await db.insert(equipmentPackItems).values({
        packId,
        sortOrder,
        itemId,
        quantity: entry.quantity ?? 1,
        quantityCD: entry.quantityCD,
        location: entry.location,
        isChoiceGroup: false,
      });
    } else {
      console.warn(`  Warning: Item not found: ${entry.itemName} (${entry.category})`);
    }
  }
}

export async function seedRobotArmAttachments() {
  console.log('Seeding robot arm attachments...');

  for (const attachment of ROBOT_ARM_ATTACHMENTS) {
    await db
      .insert(robotArmAttachments)
      .values({ id: attachment.id, nameKey: attachment.nameKey })
      .onConflictDoUpdate({
        target: robotArmAttachments.id,
        set: { nameKey: attachment.nameKey },
      });
  }

  console.log(`  Upserted ${ROBOT_ARM_ATTACHMENTS.length} robot arm attachments`);
}

export async function seedTagSkillBonusItems() {
  console.log('Seeding tag skill bonus items...');

  // Delete all and re-insert (no natural unique key per entry)
  await db.delete(tagSkillBonusItems);

  let count = 0;
  for (const bonus of TAG_SKILL_BONUS_ITEMS) {
    let choiceGroupCounter = 0;
    for (const entry of bonus.items) {
      if (isEquipmentChoice(entry)) {
        choiceGroupCounter++;
        const currentChoiceGroup = choiceGroupCounter;
        for (const option of entry.options) {
          const itemId = await getItemIdByNameAndCategory(option.itemName, option.category);
          if (itemId) {
            await db.insert(tagSkillBonusItems).values({
              skill: bonus.skill,
              itemId,
              quantity: option.quantity ?? 1,
              quantityCD: option.quantityCD,
              choiceGroup: currentChoiceGroup,
            });
            count++;
          } else {
            console.warn(`  Warning: Item not found for tag skill bonus: ${option.itemName} (${option.category})`);
          }
        }
      } else {
        const itemId = await getItemIdByNameAndCategory(entry.itemName, entry.category);
        if (itemId) {
          await db.insert(tagSkillBonusItems).values({
            skill: bonus.skill,
            itemId,
            quantity: entry.quantity ?? 1,
            quantityCD: entry.quantityCD,
          });
          count++;
        } else {
          console.warn(`  Warning: Item not found for tag skill bonus: ${entry.itemName} (${entry.category})`);
        }
      }
    }
  }

  console.log(`  Upserted ${count} tag skill bonus items`);
}

export async function seedLevelBonusCaps() {
  console.log('Seeding level bonus caps...');

  // Delete all and re-insert (no unique constraint on minLevel)
  await db.delete(levelBonusCaps);

  for (const bonus of LEVEL_BONUS_CAPS) {
    await db.insert(levelBonusCaps).values({
      minLevel: bonus.level,
      maxLevel: bonus.level,
      baseCaps: bonus.caps,
      bonusCapsCD: 0,
      maxRarity: bonus.maxRarity,
    });
  }

  console.log(`  Upserted ${LEVEL_BONUS_CAPS.length} level bonus caps entries`);
}

export async function seedAllEquipmentPacks() {
  await seedEquipmentPacks();
  await seedRobotArmAttachments();
  await seedTagSkillBonusItems();
  await seedLevelBonusCaps();
}
