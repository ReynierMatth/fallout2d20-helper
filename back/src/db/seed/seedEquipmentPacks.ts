import { db } from '../index';
import { eq, and } from 'drizzle-orm';
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

// Import data from frontend
import {
  EQUIPMENT_PACKS,
  WASTELAND_PACKS,
  ROBOT_ARM_ATTACHMENTS,
  TAG_SKILL_BONUS_ITEMS,
  LEVEL_BONUS_CAPS,
  isEquipmentChoice,
} from '../../../../front/src/data/equipmentPacks';
import type { EquipmentPack, EquipmentEntry, OriginId, TagSkillBonusItemEntry } from '../../../../front/src/data/equipmentPacks';

// Map category from equipment packs to item_type enum
function categoryToItemType(category: string): string | null {
  switch (category) {
    case 'weapon':
      return 'weapon';
    case 'armor':
      return 'armor';
    case 'robotArmor':
      return 'robotArmor';
    case 'clothing':
      return 'clothing';
    case 'ammo':
      return 'ammunition';
    case 'chem':
      return 'chem';
    case 'food':
      return 'food';
    case 'misc':
      return 'generalGood';
    case 'caps':
      return null; // Caps are not items
    default:
      return null;
  }
}

// Helper to lookup item ID by name and category
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

  // First, insert all packs (including wasteland packs)
  const allPacks: EquipmentPack[] = [...WASTELAND_PACKS];

  // Collect packs from each origin
  for (const originPacks of EQUIPMENT_PACKS) {
    for (const pack of originPacks.packs) {
      allPacks.push(pack);
    }
  }

  // Insert unique packs
  const insertedPackIds = new Set<string>();
  for (const pack of allPacks) {
    if (insertedPackIds.has(pack.id)) continue;
    insertedPackIds.add(pack.id);

    await db.insert(equipmentPacks).values({
      id: pack.id,
      nameKey: pack.nameKey,
      descriptionKey: pack.descriptionKey,
    });

    // Insert pack items
    let sortOrder = 0;
    for (const entry of pack.items) {
      await insertEquipmentEntry(pack.id, entry, sortOrder++);
    }
  }

  console.log(`  Inserted ${insertedPackIds.size} equipment packs`);

  // Link origins to packs
  let linkCount = 0;
  for (const originPacks of EQUIPMENT_PACKS) {
    const originId = originPacks.originId as OriginId;
    const packsToLink = originPacks.packs.length > 0 ? originPacks.packs : WASTELAND_PACKS;

    let sortOrder = 0;
    for (const pack of packsToLink) {
      await db.insert(originEquipmentPacks).values({
        originId,
        packId: pack.id,
        sortOrder: sortOrder++,
      });
      linkCount++;
    }
  }

  console.log(`  Created ${linkCount} origin-pack links`);
}

async function insertEquipmentEntry(packId: string, entry: EquipmentEntry, sortOrder: number) {
  if (isEquipmentChoice(entry)) {
    // Insert as choice group
    const [choiceGroup] = await db
      .insert(equipmentPackItems)
      .values({
        packId,
        sortOrder,
        isChoiceGroup: true,
        choiceCount: entry.choiceCount ?? 1,
      })
      .returning({ id: equipmentPackItems.id });

    // Insert choice options
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
    // Insert as direct item
    // Skip caps entries as they're not items
    if (entry.category === 'caps') {
      return;
    }

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
    await db.insert(robotArmAttachments).values({
      id: attachment.id,
      nameKey: attachment.nameKey,
    });
  }

  console.log(`  Inserted ${ROBOT_ARM_ATTACHMENTS.length} robot arm attachments`);
}

export async function seedTagSkillBonusItems() {
  console.log('Seeding tag skill bonus items...');

  let count = 0;
  for (const bonus of TAG_SKILL_BONUS_ITEMS) {
    for (const entry of bonus.items) {
      const itemId = await getItemIdByNameAndCategory(entry.itemName, entry.category);

      if (itemId) {
        await db.insert(tagSkillBonusItems).values({
          skill: bonus.skill,
          itemId,
          quantity: entry.quantity ?? 1,
          quantityCD: entry.quantityCD,
          choiceGroup: entry.choiceGroup ?? null,
        });
        count++;
      } else {
        console.warn(`  Warning: Item not found for tag skill bonus: ${entry.itemName} (${entry.category})`);
      }
    }
  }

  console.log(`  Inserted ${count} tag skill bonus items`);
}

export async function seedLevelBonusCaps() {
  console.log('Seeding level bonus caps...');

  for (const bonus of LEVEL_BONUS_CAPS) {
    await db.insert(levelBonusCaps).values({
      minLevel: bonus.level,
      maxLevel: bonus.level,
      baseCaps: bonus.caps,
      bonusCapsCD: 0,
      maxRarity: bonus.maxRarity,
    });
  }

  console.log(`  Inserted ${LEVEL_BONUS_CAPS.length} level bonus caps entries`);
}

export async function seedAllEquipmentPacks() {
  await seedEquipmentPacks();
  await seedRobotArmAttachments();
  await seedTagSkillBonusItems();
  await seedLevelBonusCaps();
}
