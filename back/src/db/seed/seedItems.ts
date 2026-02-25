import { db } from '../index';
import { sql, inArray } from 'drizzle-orm';
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
  magazines,
  magazineIssues,
  diseases,
  personalTrinkets,
} from '../schema/index';

// Import data from local seed data
import { weapons as weaponsData } from './data/weapons';
import { armor as armorData, powerArmor as powerArmorData, robotArmor as robotArmorData } from './data/armor';
import { clothing as clothingData } from './data/clothing';
import { ammunition as ammunitionData, syringerAmmo as syringerAmmoData } from './data/ammunition';
import { chems as chemsData } from './data/chems';
import { food as foodData } from './data/food';
import { generalGoods as generalGoodsData, oddities as odditiesData } from './data/generalGoods';
import { magazines as magazinesData, MAGAZINE_VALUE, MAGAZINE_RARITY, MAGAZINE_WEIGHT } from './data/magazines';
import { diseases as diseasesData } from './data/diseases';

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

  // Batch upsert all items
  const insertedItems = await db
    .insert(items)
    .values(weaponsData.map(w => ({
      itemType: 'weapon' as const,
      name: w.name,
      nameKey: w.nameKey,
      value: w.value,
      rarity: w.rarity,
      weight: w.weight,
    })))
    .onConflictDoUpdate({
      target: items.name,
      set: {
        nameKey: sql`excluded.name_key`,
        value: sql`excluded.value`,
        rarity: sql`excluded.rarity`,
        weight: sql`excluded.weight`,
      },
    })
    .returning({ id: items.id, name: items.name });

  const nameToId = new Map(insertedItems.map(i => [i.name, i.id]));
  for (const item of insertedItems) {
    itemIdMap.set(getItemKey(item.name, 'weapon'), item.id);
  }

  // Batch upsert all weapons
  await db
    .insert(weapons)
    .values(weaponsData.map(w => ({
      itemId: nameToId.get(w.name)!,
      skill: w.skill,
      damage: w.damage,
      damageType: w.damageType,
      damageBonus: w.damageBonus,
      fireRate: w.fireRate,
      range: w.range,
      ammo: w.ammo,
      ammoPerShot: w.ammoPerShot,
    })))
    .onConflictDoUpdate({
      target: weapons.itemId,
      set: {
        skill: sql`excluded.skill`,
        damage: sql`excluded.damage`,
        damageType: sql`excluded.damage_type`,
        damageBonus: sql`excluded.damage_bonus`,
        fireRate: sql`excluded.fire_rate`,
        range: sql`excluded.range`,
        ammo: sql`excluded.ammo`,
        ammoPerShot: sql`excluded.ammo_per_shot`,
      },
    });

  // Batch replace weapon qualities
  const allItemIds = insertedItems.map(i => i.id);
  await db.delete(weaponQualities).where(inArray(weaponQualities.itemId, allItemIds));
  const allQualities = weaponsData.flatMap(w =>
    (w.qualities ?? []).map(q => ({
      itemId: nameToId.get(w.name)!,
      quality: q.quality,
      value: q.value,
    }))
  );
  if (allQualities.length > 0) await db.insert(weaponQualities).values(allQualities);

  console.log(`  Upserted ${weaponsData.length} weapons`);
}

export async function seedArmors() {
  console.log('Seeding armors...');

  const insertedItems = await db
    .insert(items)
    .values(armorData.map(a => ({
      itemType: 'armor' as const,
      name: a.name,
      nameKey: a.nameKey,
      value: a.value,
      rarity: a.rarity,
      weight: a.weight,
    })))
    .onConflictDoUpdate({
      target: items.name,
      set: {
        nameKey: sql`excluded.name_key`,
        value: sql`excluded.value`,
        rarity: sql`excluded.rarity`,
        weight: sql`excluded.weight`,
      },
    })
    .returning({ id: items.id, name: items.name });

  const nameToId = new Map(insertedItems.map(i => [i.name, i.id]));
  for (const item of insertedItems) {
    itemIdMap.set(getItemKey(item.name, 'armor'), item.id);
  }

  await db
    .insert(armors)
    .values(armorData.map(a => ({
      itemId: nameToId.get(a.name)!,
      location: a.location,
      drPhysical: a.dr.physical,
      drEnergy: a.dr.energy,
      drRadiation: a.dr.radiation,
      drPoison: a.dr.poison,
      type: a.type,
      set: a.set,
      hp: a.hp,
    })))
    .onConflictDoUpdate({
      target: armors.itemId,
      set: {
        location: sql`excluded.location`,
        drPhysical: sql`excluded.dr_physical`,
        drEnergy: sql`excluded.dr_energy`,
        drRadiation: sql`excluded.dr_radiation`,
        drPoison: sql`excluded.dr_poison`,
        type: sql`excluded.type`,
        set: sql`excluded.set`,
        hp: sql`excluded.hp`,
      },
    });

  console.log(`  Upserted ${armorData.length} armors`);
}

export async function seedPowerArmors() {
  console.log('Seeding power armors...');

  const setMap: Record<string, 'frame' | 'raiderPower' | 't45' | 't51' | 't60' | 'x01'> = {
    frame: 'frame',
    raiderPower: 'raiderPower',
    t45: 't45',
    t51: 't51',
    t60: 't60',
    x01: 'x01',
  };

  const insertedItems = await db
    .insert(items)
    .values(powerArmorData.map(pa => ({
      itemType: 'powerArmor' as const,
      name: pa.name,
      nameKey: pa.nameKey,
      value: pa.value,
      rarity: pa.rarity,
      weight: pa.weight,
    })))
    .onConflictDoUpdate({
      target: items.name,
      set: {
        nameKey: sql`excluded.name_key`,
        value: sql`excluded.value`,
        rarity: sql`excluded.rarity`,
        weight: sql`excluded.weight`,
      },
    })
    .returning({ id: items.id, name: items.name });

  const nameToId = new Map(insertedItems.map(i => [i.name, i.id]));
  for (const item of insertedItems) {
    itemIdMap.set(getItemKey(item.name, 'powerArmor'), item.id);
  }

  await db
    .insert(powerArmors)
    .values(powerArmorData.map(pa => ({
      itemId: nameToId.get(pa.name)!,
      set: setMap[pa.set!] || 'frame',
      location: pa.location,
      drPhysical: pa.dr.physical,
      drEnergy: pa.dr.energy,
      drRadiation: pa.dr.radiation,
      hp: pa.hp ?? 0,
    })))
    .onConflictDoUpdate({
      target: powerArmors.itemId,
      set: {
        set: sql`excluded.set`,
        location: sql`excluded.location`,
        drPhysical: sql`excluded.dr_physical`,
        drEnergy: sql`excluded.dr_energy`,
        drRadiation: sql`excluded.dr_radiation`,
        hp: sql`excluded.hp`,
      },
    });

  console.log(`  Upserted ${powerArmorData.length} power armors`);
}

export async function seedRobotArmors() {
  console.log('Seeding robot armors...');

  const insertedItems = await db
    .insert(items)
    .values(robotArmorData.map(ra => ({
      itemType: 'robotArmor' as const,
      name: ra.name,
      nameKey: ra.nameKey,
      value: ra.value,
      rarity: 0,
      weight: 0,
    })))
    .onConflictDoUpdate({
      target: items.name,
      set: {
        nameKey: sql`excluded.name_key`,
        value: sql`excluded.value`,
      },
    })
    .returning({ id: items.id, name: items.name });

  const nameToId = new Map(insertedItems.map(i => [i.name, i.id]));
  for (const item of insertedItems) {
    itemIdMap.set(getItemKey(item.name, 'robotArmor'), item.id);
  }

  await db
    .insert(robotArmors)
    .values(robotArmorData.map(ra => ({
      itemId: nameToId.get(ra.name)!,
      drPhysical: ra.drPhysical,
      drEnergy: ra.drEnergy,
      isBonus: ra.isBonus,
      location: ra.location,
      carryModifier: ra.carryModifier,
      perkRequired: ra.perkRequired,
      specialEffectKey: ra.specialEffect?.descriptionKey,
      specialEffectDescription: ra.specialEffect?.description,
    })))
    .onConflictDoUpdate({
      target: robotArmors.itemId,
      set: {
        drPhysical: sql`excluded.dr_physical`,
        drEnergy: sql`excluded.dr_energy`,
        isBonus: sql`excluded.is_bonus`,
        location: sql`excluded.location`,
        carryModifier: sql`excluded.carry_modifier`,
        perkRequired: sql`excluded.perk_required`,
        specialEffectKey: sql`excluded.special_effect_key`,
        specialEffectDescription: sql`excluded.special_effect_description`,
      },
    });

  console.log(`  Upserted ${robotArmorData.length} robot armors`);
}

export async function seedClothing() {
  console.log('Seeding clothing...');

  const insertedItems = await db
    .insert(items)
    .values(clothingData.map(c => ({
      itemType: 'clothing' as const,
      name: c.name,
      nameKey: c.nameKey,
      value: c.value,
      rarity: c.rarity,
      weight: c.weight,
    })))
    .onConflictDoUpdate({
      target: items.name,
      set: {
        nameKey: sql`excluded.name_key`,
        value: sql`excluded.value`,
        rarity: sql`excluded.rarity`,
        weight: sql`excluded.weight`,
      },
    })
    .returning({ id: items.id, name: items.name });

  const nameToId = new Map(insertedItems.map(i => [i.name, i.id]));
  for (const item of insertedItems) {
    itemIdMap.set(getItemKey(item.name, 'clothing'), item.id);
  }

  await db
    .insert(clothing)
    .values(clothingData.map(c => ({
      itemId: nameToId.get(c.name)!,
      drPhysical: c.dr?.physical,
      drEnergy: c.dr?.energy,
      drRadiation: c.dr?.radiation,
      drPoison: c.dr?.poison,
      effect: c.effect,
    })))
    .onConflictDoUpdate({
      target: clothing.itemId,
      set: {
        drPhysical: sql`excluded.dr_physical`,
        drEnergy: sql`excluded.dr_energy`,
        drRadiation: sql`excluded.dr_radiation`,
        drPoison: sql`excluded.dr_poison`,
        effect: sql`excluded.effect`,
      },
    });

  // Batch replace locations and effects
  const allItemIds = insertedItems.map(i => i.id);
  await db.delete(clothingLocations).where(inArray(clothingLocations.itemId, allItemIds));
  const allLocations = clothingData.flatMap(c =>
    (c.locations ?? []).map(location => ({ itemId: nameToId.get(c.name)!, location }))
  );
  if (allLocations.length > 0) await db.insert(clothingLocations).values(allLocations);

  await db.delete(clothingEffects).where(inArray(clothingEffects.itemId, allItemIds));
  const allEffects = clothingData.flatMap(c =>
    (c.effects ?? []).map(effect => ({
      itemId: nameToId.get(c.name)!,
      effectType: effect.type,
      target: effect.target,
      value: effect.value?.toString(),
      descriptionKey: effect.descriptionKey,
    }))
  );
  if (allEffects.length > 0) await db.insert(clothingEffects).values(allEffects);

  console.log(`  Upserted ${clothingData.length} clothing items`);
}

export async function seedAmmunition() {
  console.log('Seeding ammunition...');

  const insertedItems = await db
    .insert(items)
    .values(ammunitionData.map(a => ({
      itemType: 'ammunition' as const,
      name: a.name,
      nameKey: a.nameKey,
      value: a.value,
      rarity: a.rarity,
      weight: a.weight,
    })))
    .onConflictDoUpdate({
      target: items.name,
      set: {
        nameKey: sql`excluded.name_key`,
        value: sql`excluded.value`,
        rarity: sql`excluded.rarity`,
        weight: sql`excluded.weight`,
      },
    })
    .returning({ id: items.id, name: items.name });

  const nameToId = new Map(insertedItems.map(i => [i.name, i.id]));
  for (const item of insertedItems) {
    itemIdMap.set(getItemKey(item.name, 'ammunition'), item.id);
  }

  await db
    .insert(ammunition)
    .values(ammunitionData.map(a => ({
      itemId: nameToId.get(a.name)!,
      flatAmount: a.flatAmount,
      randomAmount: a.randomAmount,
    })))
    .onConflictDoUpdate({
      target: ammunition.itemId,
      set: {
        flatAmount: sql`excluded.flat_amount`,
        randomAmount: sql`excluded.random_amount`,
      },
    });

  console.log(`  Upserted ${ammunitionData.length} ammunition types`);

  console.log('Seeding syringer ammo...');

  const insertedSyringer = await db
    .insert(items)
    .values(syringerAmmoData.map(a => ({
      itemType: 'syringerAmmo' as const,
      name: a.name,
      nameKey: a.nameKey,
      value: a.value,
      rarity: 2,
      weight: 0,
    })))
    .onConflictDoUpdate({
      target: items.name,
      set: {
        nameKey: sql`excluded.name_key`,
        value: sql`excluded.value`,
      },
    })
    .returning({ id: items.id, name: items.name });

  const syringerNameToId = new Map(insertedSyringer.map(i => [i.name, i.id]));
  for (const item of insertedSyringer) {
    itemIdMap.set(getItemKey(item.name, 'syringerAmmo'), item.id);
  }

  await db
    .insert(syringerAmmo)
    .values(syringerAmmoData.map(a => ({
      itemId: syringerNameToId.get(a.name)!,
      effectKey: a.effectKey,
      effect: a.effect ?? null,
    })))
    .onConflictDoUpdate({
      target: syringerAmmo.itemId,
      set: {
        effectKey: sql`excluded.effect_key`,
        effect: sql`excluded.effect`,
      },
    });

  console.log(`  Upserted ${syringerAmmoData.length} syringer ammo types`);
}

export async function seedChems() {
  console.log('Seeding chems...');

  const insertedItems = await db
    .insert(items)
    .values(chemsData.map(c => ({
      itemType: 'chem' as const,
      name: c.name,
      nameKey: undefined,
      value: c.value,
      rarity: c.rarity,
      weight: c.weight,
    })))
    .onConflictDoUpdate({
      target: items.name,
      set: {
        value: sql`excluded.value`,
        rarity: sql`excluded.rarity`,
        weight: sql`excluded.weight`,
      },
    })
    .returning({ id: items.id, name: items.name });

  const nameToId = new Map(insertedItems.map(i => [i.name, i.id]));
  for (const item of insertedItems) {
    itemIdMap.set(getItemKey(item.name, 'chem'), item.id);
  }

  await db
    .insert(chems)
    .values(chemsData.map(c => ({
      itemId: nameToId.get(c.name)!,
      duration: c.duration,
      addictive: c.addictive,
      addictionLevel: c.addictionLevel,
      effectKey: c.effectKey,
      effect: c.effect ?? null,
    })))
    .onConflictDoUpdate({
      target: chems.itemId,
      set: {
        duration: sql`excluded.duration`,
        addictive: sql`excluded.addictive`,
        addictionLevel: sql`excluded.addiction_level`,
        effectKey: sql`excluded.effect_key`,
        effect: sql`excluded.effect`,
      },
    });

  console.log(`  Upserted ${chemsData.length} chems`);
}

export async function seedFood() {
  console.log('Seeding food...');

  const insertedItems = await db
    .insert(items)
    .values(foodData.map(f => ({
      itemType: 'food' as const,
      name: f.name,
      nameKey: undefined,
      value: f.value,
      rarity: f.rarity,
      weight: f.weight,
    })))
    .onConflictDoUpdate({
      target: items.name,
      set: {
        value: sql`excluded.value`,
        rarity: sql`excluded.rarity`,
        weight: sql`excluded.weight`,
      },
    })
    .returning({ id: items.id, name: items.name });

  const nameToId = new Map(insertedItems.map(i => [i.name, i.id]));
  for (const item of insertedItems) {
    itemIdMap.set(getItemKey(item.name, 'food'), item.id);
  }

  await db
    .insert(food)
    .values(foodData.map(f => ({
      itemId: nameToId.get(f.name)!,
      foodType: f.type,
      irradiated: f.irradiated,
      effectKey: f.effectKey,
      effect: f.effect,
    })))
    .onConflictDoUpdate({
      target: food.itemId,
      set: {
        foodType: sql`excluded.food_type`,
        irradiated: sql`excluded.irradiated`,
        effectKey: sql`excluded.effect_key`,
        effect: sql`excluded.effect`,
      },
    });

  console.log(`  Upserted ${foodData.length} food items`);
}

export async function seedGeneralGoods() {
  console.log('Seeding general goods...');

  const insertedItems = await db
    .insert(items)
    .values(generalGoodsData.map(g => ({
      itemType: 'generalGood' as const,
      name: g.name,
      nameKey: g.nameKey,
      value: g.value,
      rarity: g.rarity,
      weight: g.weight,
    })))
    .onConflictDoUpdate({
      target: items.name,
      set: {
        nameKey: sql`excluded.name_key`,
        value: sql`excluded.value`,
        rarity: sql`excluded.rarity`,
        weight: sql`excluded.weight`,
      },
    })
    .returning({ id: items.id, name: items.name });

  const nameToId = new Map(insertedItems.map(i => [i.name, i.id]));
  for (const item of insertedItems) {
    itemIdMap.set(getItemKey(item.name, 'generalGood'), item.id);
  }

  await db
    .insert(generalGoods)
    .values(generalGoodsData.map(g => ({
      itemId: nameToId.get(g.name)!,
      goodType: g.type,
      effectKey: g.effectKey,
      effect: g.effect ?? null,
    })))
    .onConflictDoUpdate({
      target: generalGoods.itemId,
      set: {
        goodType: sql`excluded.good_type`,
        effectKey: sql`excluded.effect_key`,
        effect: sql`excluded.effect`,
      },
    });

  console.log(`  Upserted ${generalGoodsData.length} general goods`);

  console.log('Seeding oddities...');

  const insertedOddities = await db
    .insert(items)
    .values(odditiesData.map(o => ({
      itemType: 'oddity' as const,
      name: o.name,
      nameKey: o.nameKey,
      value: o.value,
      rarity: o.rarity,
      weight: o.weight,
    })))
    .onConflictDoUpdate({
      target: items.name,
      set: {
        nameKey: sql`excluded.name_key`,
        value: sql`excluded.value`,
        rarity: sql`excluded.rarity`,
        weight: sql`excluded.weight`,
      },
    })
    .returning({ id: items.id, name: items.name });

  const oddityNameToId = new Map(insertedOddities.map(i => [i.name, i.id]));
  for (const item of insertedOddities) {
    itemIdMap.set(getItemKey(item.name, 'oddity'), item.id);
  }

  await db
    .insert(oddities)
    .values(odditiesData.map(o => ({
      itemId: oddityNameToId.get(o.name)!,
      goodType: o.type,
      effect: o.effectKey,
    })))
    .onConflictDoUpdate({
      target: oddities.itemId,
      set: {
        goodType: sql`excluded.good_type`,
        effect: sql`excluded.effect`,
      },
    });

  console.log(`  Upserted ${odditiesData.length} oddities`);
}

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

const TRINKET_EFFECT = 'Once per quest, outside of combat, you can spend a few moments looking at it and thinking about what it represents to you. You regain 1 Luck Point.';

export async function seedPersonalTrinkets() {
  console.log('Seeding personal trinkets...');

  await db
    .insert(personalTrinkets)
    .values(PERSONAL_TRINKETS.map(t => ({
      roll: t.roll,
      nameKey: t.nameKey,
      effect: TRINKET_EFFECT,
    })))
    .onConflictDoUpdate({
      target: personalTrinkets.roll,
      set: {
        nameKey: sql`excluded.name_key`,
        effect: sql`excluded.effect`,
      },
    });

  console.log(`  Upserted ${PERSONAL_TRINKETS.length} personal trinkets`);
}

export async function seedMagazines() {
  console.log('Seeding magazines...');

  const insertedItems = await db
    .insert(items)
    .values(magazinesData.map(m => ({
      itemType: 'magazine' as const,
      name: m.name,
      nameKey: m.nameKey,
      value: MAGAZINE_VALUE,
      rarity: MAGAZINE_RARITY,
      weight: MAGAZINE_WEIGHT,
    })))
    .onConflictDoUpdate({
      target: items.name,
      set: {
        nameKey: sql`excluded.name_key`,
        value: sql`excluded.value`,
        rarity: sql`excluded.rarity`,
        weight: sql`excluded.weight`,
      },
    })
    .returning({ id: items.id, name: items.name });

  const nameToId = new Map(insertedItems.map(i => [i.name, i.id]));
  for (const item of insertedItems) {
    itemIdMap.set(getItemKey(item.name, 'magazine'), item.id);
  }

  await db
    .insert(magazines)
    .values(magazinesData.map(m => ({
      itemId: nameToId.get(m.name)!,
      perkDescriptionKey: m.perkDescriptionKey,
    })))
    .onConflictDoUpdate({
      target: magazines.itemId,
      set: { perkDescriptionKey: sql`excluded.perk_description_key` },
    });

  // Batch replace magazine issues
  const allItemIds = insertedItems.map(i => i.id);
  await db.delete(magazineIssues).where(inArray(magazineIssues.magazineId, allItemIds));
  const allIssues = magazinesData.flatMap(m =>
    m.issues.map(issue => ({
      magazineId: nameToId.get(m.name)!,
      d20Min: issue.d20Min,
      d20Max: issue.d20Max,
      issueName: issue.name,
      issueNameKey: issue.nameKey,
      effectDescriptionKey: issue.effectKey,
    }))
  );
  if (allIssues.length > 0) await db.insert(magazineIssues).values(allIssues);

  console.log(`  Upserted ${magazinesData.length} magazine series`);
}

export async function seedDiseases() {
  console.log('Seeding diseases...');

  await db
    .insert(diseases)
    .values(diseasesData.map(d => ({
      d20Roll: d.d20Roll,
      name: d.name,
      nameKey: d.nameKey,
      effectKey: d.effectKey,
      duration: d.duration,
    })))
    .onConflictDoUpdate({
      target: diseases.d20Roll,
      set: {
        name: sql`excluded.name`,
        nameKey: sql`excluded.name_key`,
        effectKey: sql`excluded.effect_key`,
        duration: sql`excluded.duration`,
      },
    });

  console.log(`  Upserted ${diseasesData.length} diseases`);
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
  await seedMagazines();
  await seedDiseases();
  await seedPersonalTrinkets();
}
