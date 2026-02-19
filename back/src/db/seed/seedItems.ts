import { db } from '../index';
import {
  items,
  weapons,
  weaponQualities,
  armors,
  powerArmors,
  robotArmors,
  clothing,
  clothingLocations,
  clothingEffects,
  ammunition,
  syringerAmmo,
  chems,
  food,
  generalGoods,
  oddities,
  personalTrinkets,
} from '../schema/index';

// Import data from frontend
import { weapons as weaponsData } from '../../../../front/src/data/weapons';
import { armor as armorData, powerArmor as powerArmorData, robotArmor as robotArmorData } from '../../../../front/src/data/armor';
import { clothing as clothingData } from '../../../../front/src/data/clothing';
import { ammunition as ammunitionData, syringerAmmo as syringerAmmoData } from '../../../../front/src/data/ammunition';
import { chems as chemsData } from '../../../../front/src/data/chems';
import { food as foodData } from '../../../../front/src/data/food';
import { generalGoods as generalGoodsData, oddities as odditiesData } from '../../../../front/src/data/generalGoods';

// Map to store item IDs by name and type for later use (e.g., equipment packs)
export const itemIdMap = new Map<string, number>();

function getItemKey(name: string, type: string): string {
  return `${type}:${name}`;
}

export function getItemIdByNameAndType(name: string, type: string): number | undefined {
  return itemIdMap.get(getItemKey(name, type));
}

export async function seedWeapons() {
  console.log('Seeding weapons...');

  for (const weapon of weaponsData) {
    // 1. Insert into items table first
    const [insertedItem] = await db
      .insert(items)
      .values({
        itemType: 'weapon',
        name: weapon.name,
        nameKey: weapon.nameKey,
        value: weapon.value,
        rarity: weapon.rarity,
        weight: weapon.weight,
      })
      .returning({ id: items.id });

    const itemId = insertedItem.id;
    itemIdMap.set(getItemKey(weapon.name, 'weapon'), itemId);

    // 2. Insert into weapons table with itemId
    await db.insert(weapons).values({
      itemId,
      skill: weapon.skill,
      damage: weapon.damage,
      damageType: weapon.damageType,
      damageBonus: weapon.damageBonus,
      fireRate: weapon.fireRate,
      range: weapon.range,
      ammo: weapon.ammo,
      ammoPerShot: weapon.ammoPerShot,
    });

    // 3. Insert weapon qualities
    if (weapon.qualities && weapon.qualities.length > 0) {
      await db.insert(weaponQualities).values(
        weapon.qualities.map((q) => ({
          itemId,
          quality: q.quality,
          value: q.value,
        }))
      );
    }
  }

  console.log(`  Inserted ${weaponsData.length} weapons`);
}

export async function seedArmors() {
  console.log('Seeding armors...');

  for (const armor of armorData) {
    // 1. Insert into items table first
    const [insertedItem] = await db
      .insert(items)
      .values({
        itemType: 'armor',
        name: armor.name,
        nameKey: armor.nameKey,
        value: armor.value,
        rarity: armor.rarity,
        weight: armor.weight,
      })
      .returning({ id: items.id });

    const itemId = insertedItem.id;
    itemIdMap.set(getItemKey(armor.name, 'armor'), itemId);

    // 2. Insert into armors table with itemId
    await db.insert(armors).values({
      itemId,
      location: armor.location,
      drPhysical: armor.dr.physical,
      drEnergy: armor.dr.energy,
      drRadiation: armor.dr.radiation,
      drPoison: armor.dr.poison,
      type: armor.type,
      set: armor.set,
      hp: armor.hp,
    });
  }

  console.log(`  Inserted ${armorData.length} armors`);
}

export async function seedPowerArmors() {
  console.log('Seeding power armors...');

  for (const pa of powerArmorData) {
    // 1. Insert into items table first
    const [insertedItem] = await db
      .insert(items)
      .values({
        itemType: 'powerArmor',
        name: pa.name,
        nameKey: pa.nameKey,
        value: pa.value,
        rarity: pa.rarity,
        weight: pa.weight,
      })
      .returning({ id: items.id });

    const itemId = insertedItem.id;
    itemIdMap.set(getItemKey(pa.name, 'powerArmor'), itemId);

    // 2. Insert into power_armors table with itemId
    // Map set names to enum values
    const setMap: Record<string, 'frame' | 'raiderPower' | 't45' | 't51' | 't60' | 'x01'> = {
      frame: 'frame',
      raiderPower: 'raiderPower',
      t45: 't45',
      t51: 't51',
      t60: 't60',
      x01: 'x01',
    };

    await db.insert(powerArmors).values({
      itemId,
      set: setMap[pa.set!] || 'frame',
      location: pa.location,
      drPhysical: pa.dr.physical,
      drEnergy: pa.dr.energy,
      drRadiation: pa.dr.radiation,
      hp: pa.hp ?? 0,
    });
  }

  console.log(`  Inserted ${powerArmorData.length} power armors`);
}

export async function seedRobotArmors() {
  console.log('Seeding robot armors...');

  for (const robotArmor of robotArmorData) {
    // 1. Insert into items table first
    const [insertedItem] = await db
      .insert(items)
      .values({
        itemType: 'robotArmor',
        name: robotArmor.name,
        nameKey: robotArmor.nameKey,
        value: robotArmor.value,
        rarity: 0, // Robot armors don't have rarity in source data
        weight: 0, // Robot armors don't have weight in source data
      })
      .returning({ id: items.id });

    const itemId = insertedItem.id;
    itemIdMap.set(getItemKey(robotArmor.name, 'robotArmor'), itemId);

    // 2. Insert into robot_armors table with itemId
    await db.insert(robotArmors).values({
      itemId,
      drPhysical: robotArmor.drPhysical,
      drEnergy: robotArmor.drEnergy,
      isBonus: robotArmor.isBonus,
      location: robotArmor.location,
      carryModifier: robotArmor.carryModifier,
      perkRequired: robotArmor.perkRequired,
      specialEffectKey: robotArmor.specialEffect?.descriptionKey,
      specialEffectDescription: robotArmor.specialEffect?.description,
    });
  }

  console.log(`  Inserted ${robotArmorData.length} robot armors`);
}

export async function seedClothing() {
  console.log('Seeding clothing...');

  for (const item of clothingData) {
    // 1. Insert into items table first
    const [insertedItem] = await db
      .insert(items)
      .values({
        itemType: 'clothing',
        name: item.name,
        nameKey: item.nameKey,
        value: item.value,
        rarity: item.rarity,
        weight: item.weight,
      })
      .returning({ id: items.id });

    const itemId = insertedItem.id;
    itemIdMap.set(getItemKey(item.name, 'clothing'), itemId);

    // 2. Insert into clothing table with itemId
    await db.insert(clothing).values({
      itemId,
      drPhysical: item.dr?.physical,
      drEnergy: item.dr?.energy,
      drRadiation: item.dr?.radiation,
      drPoison: item.dr?.poison,
    });

    // 3. Insert clothing locations
    if (item.locations && item.locations.length > 0) {
      await db.insert(clothingLocations).values(
        item.locations.map((loc) => ({
          itemId,
          location: loc,
        }))
      );
    }

    // 4. Insert clothing effects
    if (item.effects && item.effects.length > 0) {
      await db.insert(clothingEffects).values(
        item.effects.map((effect) => ({
          itemId,
          effectType: effect.type,
          target: effect.target,
          value: effect.value?.toString(),
          descriptionKey: effect.descriptionKey,
        }))
      );
    }
  }

  console.log(`  Inserted ${clothingData.length} clothing items`);
}

export async function seedAmmunition() {
  console.log('Seeding ammunition...');

  for (const ammo of ammunitionData) {
    // 1. Insert into items table first
    const [insertedItem] = await db
      .insert(items)
      .values({
        itemType: 'ammunition',
        name: ammo.name,
        nameKey: ammo.nameKey,
        value: ammo.value,
        rarity: ammo.rarity,
        weight: ammo.weight,
      })
      .returning({ id: items.id });

    const itemId = insertedItem.id;
    itemIdMap.set(getItemKey(ammo.name, 'ammunition'), itemId);

    // 2. Insert into ammunition table with itemId
    await db.insert(ammunition).values({
      itemId,
      flatAmount: ammo.flatAmount,
      randomAmount: ammo.randomAmount,
    });
  }

  console.log(`  Inserted ${ammunitionData.length} ammunition types`);

  // Seed syringer ammo
  console.log('Seeding syringer ammo...');
  for (const ammo of syringerAmmoData) {
    // 1. Insert into items table first
    const [insertedItem] = await db
      .insert(items)
      .values({
        itemType: 'syringerAmmo',
        name: ammo.name,
        nameKey: ammo.nameKey,
        value: ammo.value,
        rarity: 2, // Syringer ammo rarity 2 (same as base syringer ammo)
        weight: 0, // Syringer ammo has no weight
      })
      .returning({ id: items.id });

    const itemId = insertedItem.id;
    itemIdMap.set(getItemKey(ammo.name, 'syringerAmmo'), itemId);

    // 2. Insert into syringer_ammo table with itemId
    await db.insert(syringerAmmo).values({
      itemId,
      effectKey: ammo.effectKey,
    });
  }

  console.log(`  Inserted ${syringerAmmoData.length} syringer ammo types`);
}

export async function seedChems() {
  console.log('Seeding chems...');

  for (const chem of chemsData) {
    // 1. Insert into items table first
    const [insertedItem] = await db
      .insert(items)
      .values({
        itemType: 'chem',
        name: chem.name,
        nameKey: undefined, // Chems don't have nameKey in source
        value: chem.value,
        rarity: chem.rarity,
        weight: chem.weight,
      })
      .returning({ id: items.id });

    const itemId = insertedItem.id;
    itemIdMap.set(getItemKey(chem.name, 'chem'), itemId);

    // 2. Insert into chems table with itemId
    await db.insert(chems).values({
      itemId,
      duration: chem.duration,
      addictive: chem.addictive,
      addictionLevel: chem.addictionLevel,
      effectKey: chem.effectKey,
    });
  }

  console.log(`  Inserted ${chemsData.length} chems`);
}

export async function seedFood() {
  console.log('Seeding food...');

  for (const item of foodData) {
    // 1. Insert into items table first
    const [insertedItem] = await db
      .insert(items)
      .values({
        itemType: 'food',
        name: item.name,
        nameKey: undefined, // Food doesn't have nameKey in source
        value: item.value,
        rarity: item.rarity,
        weight: item.weight,
      })
      .returning({ id: items.id });

    const itemId = insertedItem.id;
    itemIdMap.set(getItemKey(item.name, 'food'), itemId);

    // 2. Insert into food table with itemId
    await db.insert(food).values({
      itemId,
      foodType: item.type,
      hpHealed: item.hpHealed,
      irradiated: item.irradiated,
      effectKey: item.effectKey,
    });
  }

  console.log(`  Inserted ${foodData.length} food items`);
}

export async function seedGeneralGoods() {
  console.log('Seeding general goods...');

  for (const item of generalGoodsData) {
    // 1. Insert into items table first
    const [insertedItem] = await db
      .insert(items)
      .values({
        itemType: 'generalGood',
        name: item.name,
        nameKey: item.nameKey,
        value: item.value,
        rarity: item.rarity,
        weight: item.weight,
      })
      .returning({ id: items.id });

    const itemId = insertedItem.id;
    itemIdMap.set(getItemKey(item.name, 'generalGood'), itemId);

    // 2. Insert into general_goods table with itemId
    await db.insert(generalGoods).values({
      itemId,
      goodType: item.type,
      effectKey: item.effectKey,
    });
  }

  console.log(`  Inserted ${generalGoodsData.length} general goods`);

  // Seed oddities
  console.log('Seeding oddities...');
  for (const item of odditiesData) {
    // 1. Insert into items table first
    const [insertedItem] = await db
      .insert(items)
      .values({
        itemType: 'oddity',
        name: item.name,
        nameKey: item.nameKey,
        value: item.value,
        rarity: item.rarity,
        weight: item.weight,
      })
      .returning({ id: items.id });

    const itemId = insertedItem.id;
    itemIdMap.set(getItemKey(item.name, 'oddity'), itemId);

    // 2. Insert into oddities table with itemId
    await db.insert(oddities).values({
      itemId,
      goodType: item.type,
      effect: item.effect,
    });
  }

  console.log(`  Inserted ${odditiesData.length} oddities`);
}

// Personal trinkets data (from Fallout 2d20 book - d20 table)
const PERSONAL_TRINKETS = [
  { roll: 1, nameKey: 'trinkets.goldPocketWatch' },
  { roll: 2, nameKey: 'trinkets.corruptedHolodisk' },
  { roll: 3, nameKey: 'trinkets.colorfulBandana' },
  { roll: 4, nameKey: 'trinkets.silverMedallion' },
  { roll: 5, nameKey: 'trinkets.medal' },
  { roll: 6, nameKey: 'trinkets.pottedPlant' },
  { roll: 7, nameKey: 'trinkets.preWarEventTickets' },
  { roll: 8, nameKey: 'trinkets.weddingRing' },
  { roll: 9, nameKey: 'trinkets.preWarPartyInvitation' },
  { roll: 10, nameKey: 'trinkets.engravedLighter' },
  { roll: 11, nameKey: 'trinkets.loadedCasinoDie' },
  { roll: 12, nameKey: 'trinkets.idCard' },
  { roll: 13, nameKey: 'trinkets.cosmeticsCase' },
  { roll: 14, nameKey: 'trinkets.musicalInstrument' },
  { roll: 15, nameKey: 'trinkets.brokenGlasses' },
  { roll: 16, nameKey: 'trinkets.junkNecklace' },
  { roll: 17, nameKey: 'trinkets.unfinishedStoryPages' },
  { roll: 18, nameKey: 'trinkets.overdueLibraryBook' },
  { roll: 19, nameKey: 'trinkets.postcardWithAddress' },
  { roll: 20, nameKey: 'trinkets.preWarTie' },
];

export async function seedPersonalTrinkets() {
  console.log('Seeding personal trinkets...');

  for (const trinket of PERSONAL_TRINKETS) {
    await db.insert(personalTrinkets).values({
      roll: trinket.roll,
      nameKey: trinket.nameKey,
      effect: 'Once per quest, outside of combat, you can spend a few moments looking at it and thinking about what it represents to you. You regain 1 Luck Point.',
    });
  }

  console.log(`  Inserted ${PERSONAL_TRINKETS.length} personal trinkets`);
}

export async function seedAllItems() {
  await seedWeapons();
  await seedArmors();
  await seedPowerArmors();
  await seedRobotArmors();
  await seedClothing();
  await seedAmmunition();
  await seedChems();
  await seedFood();
  await seedGeneralGoods();
  await seedPersonalTrinkets();
}
