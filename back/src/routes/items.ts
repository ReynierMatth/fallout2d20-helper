import { Router } from 'express';
import { db } from '../db/index';
import { eq, and, gte, lte } from 'drizzle-orm';
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
} from '../db/schema/index';

const router = Router();

// ===== GET ITEM BY ID (Universal) =====

router.get('/:id(\\d+)', async (req: any, res) => {
  try {
    const id = Number(req.params.id);
    const [item] = await db.select().from(items).where(eq(items.id, id));

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Fetch type-specific details
    let details: any = null;
    switch (item.itemType) {
      case 'weapon': {
        const [weaponDetails] = await db.select().from(weapons).where(eq(weapons.itemId, id));
        const qualities = await db.select().from(weaponQualities).where(eq(weaponQualities.itemId, id));
        details = {
          ...weaponDetails,
          qualities: qualities.map((q) => ({ quality: q.quality, value: q.value })),
        };
        break;
      }
      case 'armor': {
        const [armorDetails] = await db.select().from(armors).where(eq(armors.itemId, id));
        details = armorDetails;
        break;
      }
      case 'powerArmor': {
        const [powerArmorDetails] = await db.select().from(powerArmors).where(eq(powerArmors.itemId, id));
        details = powerArmorDetails;
        break;
      }
      case 'robotArmor': {
        const [robotArmorDetails] = await db.select().from(robotArmors).where(eq(robotArmors.itemId, id));
        details = robotArmorDetails;
        break;
      }
      case 'clothing': {
        const [clothingDetails] = await db.select().from(clothing).where(eq(clothing.itemId, id));
        const locations = await db.select().from(clothingLocations).where(eq(clothingLocations.itemId, id));
        const effects = await db.select().from(clothingEffects).where(eq(clothingEffects.itemId, id));
        details = {
          ...clothingDetails,
          locations: locations.map((l) => l.location),
          effects: effects.map((e) => ({
            type: e.effectType,
            target: e.target,
            value: e.value,
            descriptionKey: e.descriptionKey,
          })),
        };
        break;
      }
      case 'ammunition': {
        const [ammoDetails] = await db.select().from(ammunition).where(eq(ammunition.itemId, id));
        details = ammoDetails;
        break;
      }
      case 'syringerAmmo': {
        const [syringerDetails] = await db.select().from(syringerAmmo).where(eq(syringerAmmo.itemId, id));
        details = syringerDetails;
        break;
      }
      case 'chem': {
        const [chemDetails] = await db.select().from(chems).where(eq(chems.itemId, id));
        details = chemDetails;
        break;
      }
      case 'food': {
        const [foodDetails] = await db.select().from(food).where(eq(food.itemId, id));
        details = foodDetails;
        break;
      }
      case 'generalGood': {
        const [generalGoodDetails] = await db.select().from(generalGoods).where(eq(generalGoods.itemId, id));
        details = generalGoodDetails;
        break;
      }
      case 'oddity': {
        const [oddityDetails] = await db.select().from(oddities).where(eq(oddities.itemId, id));
        details = oddityDetails;
        break;
      }
      case 'magazine': {
        const [magazineDetails] = await db.select().from(magazines).where(eq(magazines.itemId, id));
        const issues = await db.select().from(magazineIssues).where(eq(magazineIssues.magazineId, id));
        details = {
          ...magazineDetails,
          issues,
        };
        break;
      }
    }

    // Remove itemId from details to avoid duplication
    if (details && 'itemId' in details) {
      delete details.itemId;
    }

    res.json({
      ...item,
      ...details,
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// ===== WEAPONS =====

router.get('/weapons', async (req, res) => {
  try {
    const { skill, rarity, minRarity, maxRarity } = req.query;

    // Build conditions for items table
    const itemConditions = [eq(items.itemType, 'weapon')];
    if (rarity !== undefined) {
      itemConditions.push(eq(items.rarity, Number(rarity)));
    }
    if (minRarity !== undefined) {
      itemConditions.push(gte(items.rarity, Number(minRarity)));
    }
    if (maxRarity !== undefined) {
      itemConditions.push(lte(items.rarity, Number(maxRarity)));
    }

    // Build conditions for weapons table
    const weaponConditions: any[] = [];
    if (skill) {
      weaponConditions.push(eq(weapons.skill, skill as any));
    }

    // Join items with weapons
    const results = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        skill: weapons.skill,
        damage: weapons.damage,
        damageType: weapons.damageType,
        damageBonus: weapons.damageBonus,
        fireRate: weapons.fireRate,
        range: weapons.range,
        ammo: weapons.ammo,
        ammoPerShot: weapons.ammoPerShot,
      })
      .from(items)
      .innerJoin(weapons, eq(items.id, weapons.itemId))
      .where(
        weaponConditions.length > 0
          ? and(...itemConditions, ...weaponConditions)
          : and(...itemConditions)
      );

    // Fetch qualities for each weapon
    const weaponsWithQualities = await Promise.all(
      results.map(async (weapon) => {
        const qualities = await db
          .select()
          .from(weaponQualities)
          .where(eq(weaponQualities.itemId, weapon.id));
        return {
          ...weapon,
          qualities: qualities.map((q) => ({
            quality: q.quality,
            value: q.value,
          })),
        };
      })
    );

    res.json(weaponsWithQualities);
  } catch (error) {
    console.error('Error fetching weapons:', error);
    res.status(500).json({ error: 'Failed to fetch weapons' });
  }
});

router.get('/weapons/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [result] = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        skill: weapons.skill,
        damage: weapons.damage,
        damageType: weapons.damageType,
        damageBonus: weapons.damageBonus,
        fireRate: weapons.fireRate,
        range: weapons.range,
        ammo: weapons.ammo,
        ammoPerShot: weapons.ammoPerShot,
      })
      .from(items)
      .innerJoin(weapons, eq(items.id, weapons.itemId))
      .where(eq(items.id, id));

    if (!result) {
      return res.status(404).json({ error: 'Weapon not found' });
    }

    const qualities = await db
      .select()
      .from(weaponQualities)
      .where(eq(weaponQualities.itemId, id));

    res.json({
      ...result,
      qualities: qualities.map((q) => ({
        quality: q.quality,
        value: q.value,
      })),
    });
  } catch (error) {
    console.error('Error fetching weapon:', error);
    res.status(500).json({ error: 'Failed to fetch weapon' });
  }
});

// ===== ARMORS =====

router.get('/armors', async (req, res) => {
  try {
    const { location, type, set, rarity, minRarity, maxRarity } = req.query;

    const itemConditions = [eq(items.itemType, 'armor')];
    if (rarity !== undefined) {
      itemConditions.push(eq(items.rarity, Number(rarity)));
    }
    if (minRarity !== undefined) {
      itemConditions.push(gte(items.rarity, Number(minRarity)));
    }
    if (maxRarity !== undefined) {
      itemConditions.push(lte(items.rarity, Number(maxRarity)));
    }

    const armorConditions: any[] = [];
    if (location) {
      armorConditions.push(eq(armors.location, location as any));
    }
    if (type) {
      armorConditions.push(eq(armors.type, type as any));
    }
    if (set) {
      armorConditions.push(eq(armors.set, set as string));
    }

    const results = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        location: armors.location,
        drPhysical: armors.drPhysical,
        drEnergy: armors.drEnergy,
        drRadiation: armors.drRadiation,
        drPoison: armors.drPoison,
        type: armors.type,
        set: armors.set,
        hp: armors.hp,
      })
      .from(items)
      .innerJoin(armors, eq(items.id, armors.itemId))
      .where(
        armorConditions.length > 0
          ? and(...itemConditions, ...armorConditions)
          : and(...itemConditions)
      );

    res.json(results);
  } catch (error) {
    console.error('Error fetching armors:', error);
    res.status(500).json({ error: 'Failed to fetch armors' });
  }
});

router.get('/armors/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [result] = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        location: armors.location,
        drPhysical: armors.drPhysical,
        drEnergy: armors.drEnergy,
        drRadiation: armors.drRadiation,
        drPoison: armors.drPoison,
        type: armors.type,
        set: armors.set,
        hp: armors.hp,
      })
      .from(items)
      .innerJoin(armors, eq(items.id, armors.itemId))
      .where(eq(items.id, id));

    if (!result) {
      return res.status(404).json({ error: 'Armor not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching armor:', error);
    res.status(500).json({ error: 'Failed to fetch armor' });
  }
});

// ===== POWER ARMORS =====

router.get('/power-armors', async (req, res) => {
  try {
    const { set, location, rarity, minRarity, maxRarity } = req.query;

    const itemConditions = [eq(items.itemType, 'powerArmor')];
    if (rarity !== undefined) {
      itemConditions.push(eq(items.rarity, Number(rarity)));
    }
    if (minRarity !== undefined) {
      itemConditions.push(gte(items.rarity, Number(minRarity)));
    }
    if (maxRarity !== undefined) {
      itemConditions.push(lte(items.rarity, Number(maxRarity)));
    }

    const powerArmorConditions: any[] = [];
    if (set) {
      powerArmorConditions.push(eq(powerArmors.set, set as any));
    }
    if (location) {
      powerArmorConditions.push(eq(powerArmors.location, location as any));
    }

    const results = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        set: powerArmors.set,
        location: powerArmors.location,
        drPhysical: powerArmors.drPhysical,
        drEnergy: powerArmors.drEnergy,
        drRadiation: powerArmors.drRadiation,
        hp: powerArmors.hp,
      })
      .from(items)
      .innerJoin(powerArmors, eq(items.id, powerArmors.itemId))
      .where(
        powerArmorConditions.length > 0
          ? and(...itemConditions, ...powerArmorConditions)
          : and(...itemConditions)
      );

    res.json(results);
  } catch (error) {
    console.error('Error fetching power armors:', error);
    res.status(500).json({ error: 'Failed to fetch power armors' });
  }
});

router.get('/power-armors/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [result] = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        set: powerArmors.set,
        location: powerArmors.location,
        drPhysical: powerArmors.drPhysical,
        drEnergy: powerArmors.drEnergy,
        drRadiation: powerArmors.drRadiation,
        hp: powerArmors.hp,
      })
      .from(items)
      .innerJoin(powerArmors, eq(items.id, powerArmors.itemId))
      .where(eq(items.id, id));

    if (!result) {
      return res.status(404).json({ error: 'Power armor not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching power armor:', error);
    res.status(500).json({ error: 'Failed to fetch power armor' });
  }
});

// ===== ROBOT ARMORS =====

router.get('/robot-armors', async (_req, res) => {
  try {
    const results = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        drPhysical: robotArmors.drPhysical,
        drEnergy: robotArmors.drEnergy,
        isBonus: robotArmors.isBonus,
        location: robotArmors.location,
        carryModifier: robotArmors.carryModifier,
        perkRequired: robotArmors.perkRequired,
        specialEffectKey: robotArmors.specialEffectKey,
        specialEffectDescription: robotArmors.specialEffectDescription,
      })
      .from(items)
      .innerJoin(robotArmors, eq(items.id, robotArmors.itemId));

    res.json(results);
  } catch (error) {
    console.error('Error fetching robot armors:', error);
    res.status(500).json({ error: 'Failed to fetch robot armors' });
  }
});

// ===== CLOTHING =====

router.get('/clothing', async (req, res) => {
  try {
    const { rarity, minRarity, maxRarity } = req.query;

    const conditions = [eq(items.itemType, 'clothing')];
    if (rarity !== undefined) {
      conditions.push(eq(items.rarity, Number(rarity)));
    }
    if (minRarity !== undefined) {
      conditions.push(gte(items.rarity, Number(minRarity)));
    }
    if (maxRarity !== undefined) {
      conditions.push(lte(items.rarity, Number(maxRarity)));
    }

    const results = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        drPhysical: clothing.drPhysical,
        drEnergy: clothing.drEnergy,
        drRadiation: clothing.drRadiation,
        drPoison: clothing.drPoison,
        effect: clothing.effect,
      })
      .from(items)
      .innerJoin(clothing, eq(items.id, clothing.itemId))
      .where(and(...conditions));

    // Fetch locations and effects for each clothing item
    const clothingWithDetails = await Promise.all(
      results.map(async (item) => {
        const locations = await db
          .select()
          .from(clothingLocations)
          .where(eq(clothingLocations.itemId, item.id));
        const effects = await db
          .select()
          .from(clothingEffects)
          .where(eq(clothingEffects.itemId, item.id));

        return {
          ...item,
          locations: locations.map((l) => l.location),
          effects: effects.map((e) => ({
            type: e.effectType,
            target: e.target,
            value: e.value,
            descriptionKey: e.descriptionKey,
          })),
        };
      })
    );

    res.json(clothingWithDetails);
  } catch (error) {
    console.error('Error fetching clothing:', error);
    res.status(500).json({ error: 'Failed to fetch clothing' });
  }
});

router.get('/clothing/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [result] = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        drPhysical: clothing.drPhysical,
        drEnergy: clothing.drEnergy,
        drRadiation: clothing.drRadiation,
        drPoison: clothing.drPoison,
        effect: clothing.effect,
      })
      .from(items)
      .innerJoin(clothing, eq(items.id, clothing.itemId))
      .where(eq(items.id, id));

    if (!result) {
      return res.status(404).json({ error: 'Clothing not found' });
    }

    const locations = await db
      .select()
      .from(clothingLocations)
      .where(eq(clothingLocations.itemId, id));
    const effects = await db
      .select()
      .from(clothingEffects)
      .where(eq(clothingEffects.itemId, id));

    res.json({
      ...result,
      locations: locations.map((l) => l.location),
      effects: effects.map((e) => ({
        type: e.effectType,
        target: e.target,
        value: e.value,
        descriptionKey: e.descriptionKey,
      })),
    });
  } catch (error) {
    console.error('Error fetching clothing:', error);
    res.status(500).json({ error: 'Failed to fetch clothing' });
  }
});

// ===== AMMUNITION =====

router.get('/ammunition', async (req, res) => {
  try {
    const { rarity, minRarity, maxRarity } = req.query;

    const conditions = [eq(items.itemType, 'ammunition')];
    if (rarity !== undefined) {
      conditions.push(eq(items.rarity, Number(rarity)));
    }
    if (minRarity !== undefined) {
      conditions.push(gte(items.rarity, Number(minRarity)));
    }
    if (maxRarity !== undefined) {
      conditions.push(lte(items.rarity, Number(maxRarity)));
    }

    const results = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        flatAmount: ammunition.flatAmount,
        randomAmount: ammunition.randomAmount,
      })
      .from(items)
      .innerJoin(ammunition, eq(items.id, ammunition.itemId))
      .where(and(...conditions));

    res.json(results);
  } catch (error) {
    console.error('Error fetching ammunition:', error);
    res.status(500).json({ error: 'Failed to fetch ammunition' });
  }
});

router.get('/syringer-ammo', async (_req, res) => {
  try {
    const results = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        effectKey: syringerAmmo.effectKey,
        effect: syringerAmmo.effect,
      })
      .from(items)
      .innerJoin(syringerAmmo, eq(items.id, syringerAmmo.itemId));

    res.json(results);
  } catch (error) {
    console.error('Error fetching syringer ammo:', error);
    res.status(500).json({ error: 'Failed to fetch syringer ammo' });
  }
});

// ===== CHEMS =====

router.get('/chems', async (req, res) => {
  try {
    const { duration, addictive, rarity, minRarity, maxRarity } = req.query;

    const itemConditions = [eq(items.itemType, 'chem')];
    if (rarity !== undefined) {
      itemConditions.push(eq(items.rarity, Number(rarity)));
    }
    if (minRarity !== undefined) {
      itemConditions.push(gte(items.rarity, Number(minRarity)));
    }
    if (maxRarity !== undefined) {
      itemConditions.push(lte(items.rarity, Number(maxRarity)));
    }

    const chemConditions: any[] = [];
    if (duration) {
      chemConditions.push(eq(chems.duration, duration as any));
    }
    if (addictive !== undefined) {
      chemConditions.push(eq(chems.addictive, addictive === 'true'));
    }

    const results = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        duration: chems.duration,
        addictive: chems.addictive,
        addictionLevel: chems.addictionLevel,
        effectKey: chems.effectKey,
        effect: chems.effect,
      })
      .from(items)
      .innerJoin(chems, eq(items.id, chems.itemId))
      .where(
        chemConditions.length > 0
          ? and(...itemConditions, ...chemConditions)
          : and(...itemConditions)
      );

    res.json(results);
  } catch (error) {
    console.error('Error fetching chems:', error);
    res.status(500).json({ error: 'Failed to fetch chems' });
  }
});

router.get('/chems/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [result] = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        duration: chems.duration,
        addictive: chems.addictive,
        addictionLevel: chems.addictionLevel,
        effectKey: chems.effectKey,
        effect: chems.effect,
      })
      .from(items)
      .innerJoin(chems, eq(items.id, chems.itemId))
      .where(eq(items.id, id));

    if (!result) {
      return res.status(404).json({ error: 'Chem not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching chem:', error);
    res.status(500).json({ error: 'Failed to fetch chem' });
  }
});

// ===== FOOD =====

router.get('/food', async (req, res) => {
  try {
    const { type, irradiated, rarity, minRarity, maxRarity } = req.query;

    const itemConditions = [eq(items.itemType, 'food')];
    if (rarity !== undefined) {
      itemConditions.push(eq(items.rarity, Number(rarity)));
    }
    if (minRarity !== undefined) {
      itemConditions.push(gte(items.rarity, Number(minRarity)));
    }
    if (maxRarity !== undefined) {
      itemConditions.push(lte(items.rarity, Number(maxRarity)));
    }

    const foodConditions: any[] = [];
    if (type) {
      foodConditions.push(eq(food.foodType, type as any));
    }
    if (irradiated !== undefined) {
      foodConditions.push(eq(food.irradiated, irradiated === 'true'));
    }

    const results = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        foodType: food.foodType,
        irradiated: food.irradiated,
        effectKey: food.effectKey,
        effect: food.effect,
      })
      .from(items)
      .innerJoin(food, eq(items.id, food.itemId))
      .where(
        foodConditions.length > 0
          ? and(...itemConditions, ...foodConditions)
          : and(...itemConditions)
      );

    res.json(results);
  } catch (error) {
    console.error('Error fetching food:', error);
    res.status(500).json({ error: 'Failed to fetch food' });
  }
});

router.get('/food/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [result] = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        foodType: food.foodType,
        irradiated: food.irradiated,
        effectKey: food.effectKey,
        effect: food.effect,
      })
      .from(items)
      .innerJoin(food, eq(items.id, food.itemId))
      .where(eq(items.id, id));

    if (!result) {
      return res.status(404).json({ error: 'Food not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching food:', error);
    res.status(500).json({ error: 'Failed to fetch food' });
  }
});

// ===== GENERAL GOODS =====

router.get('/general-goods', async (req, res) => {
  try {
    const { type, rarity, minRarity, maxRarity } = req.query;

    const itemConditions = [eq(items.itemType, 'generalGood')];
    if (rarity !== undefined) {
      itemConditions.push(eq(items.rarity, Number(rarity)));
    }
    if (minRarity !== undefined) {
      itemConditions.push(gte(items.rarity, Number(minRarity)));
    }
    if (maxRarity !== undefined) {
      itemConditions.push(lte(items.rarity, Number(maxRarity)));
    }

    const goodConditions: any[] = [];
    if (type) {
      goodConditions.push(eq(generalGoods.goodType, type as any));
    }

    const results = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        goodType: generalGoods.goodType,
        effectKey: generalGoods.effectKey,
        effect: generalGoods.effect,
      })
      .from(items)
      .innerJoin(generalGoods, eq(items.id, generalGoods.itemId))
      .where(
        goodConditions.length > 0
          ? and(...itemConditions, ...goodConditions)
          : and(...itemConditions)
      );

    res.json(results);
  } catch (error) {
    console.error('Error fetching general goods:', error);
    res.status(500).json({ error: 'Failed to fetch general goods' });
  }
});

router.get('/oddities', async (_req, res) => {
  try {
    const results = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        goodType: oddities.goodType,
        effect: oddities.effect,
      })
      .from(items)
      .innerJoin(oddities, eq(items.id, oddities.itemId));

    res.json(results);
  } catch (error) {
    console.error('Error fetching oddities:', error);
    res.status(500).json({ error: 'Failed to fetch oddities' });
  }
});

// ===== COMBINED ITEMS ENDPOINT =====

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    // If category specified, return only that category
    if (category) {
      switch (category) {
        case 'weapons':
          return res.redirect('/api/items/weapons');
        case 'armors':
          return res.redirect('/api/items/armors');
        case 'clothing':
          return res.redirect('/api/items/clothing');
        case 'ammunition':
          return res.redirect('/api/items/ammunition');
        case 'chems':
          return res.redirect('/api/items/chems');
        case 'food':
          return res.redirect('/api/items/food');
        case 'generalGoods':
          return res.redirect('/api/items/general-goods');
        default:
          return res.status(400).json({ error: 'Invalid category' });
      }
    }

    // Return all items grouped by category
    // Weapons
    const weaponsResults = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        skill: weapons.skill,
        damage: weapons.damage,
        damageType: weapons.damageType,
        damageBonus: weapons.damageBonus,
        fireRate: weapons.fireRate,
        range: weapons.range,
        ammo: weapons.ammo,
        ammoPerShot: weapons.ammoPerShot,
      })
      .from(items)
      .innerJoin(weapons, eq(items.id, weapons.itemId));

    const weaponsData = await Promise.all(
      weaponsResults.map(async (weapon) => {
        const qualities = await db
          .select()
          .from(weaponQualities)
          .where(eq(weaponQualities.itemId, weapon.id));
        return {
          ...weapon,
          qualities: qualities.map((q) => ({
            quality: q.quality,
            value: q.value,
          })),
        };
      })
    );

    // Armors
    const armorsData = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        location: armors.location,
        drPhysical: armors.drPhysical,
        drEnergy: armors.drEnergy,
        drRadiation: armors.drRadiation,
        drPoison: armors.drPoison,
        type: armors.type,
        set: armors.set,
        hp: armors.hp,
      })
      .from(items)
      .innerJoin(armors, eq(items.id, armors.itemId));

    // Power Armors
    const powerArmorsData = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        set: powerArmors.set,
        location: powerArmors.location,
        drPhysical: powerArmors.drPhysical,
        drEnergy: powerArmors.drEnergy,
        drRadiation: powerArmors.drRadiation,
        hp: powerArmors.hp,
      })
      .from(items)
      .innerJoin(powerArmors, eq(items.id, powerArmors.itemId));

    // Clothing
    const clothingResults = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        drPhysical: clothing.drPhysical,
        drEnergy: clothing.drEnergy,
        drRadiation: clothing.drRadiation,
        drPoison: clothing.drPoison,
        effect: clothing.effect,
      })
      .from(items)
      .innerJoin(clothing, eq(items.id, clothing.itemId));

    const clothingData = await Promise.all(
      clothingResults.map(async (item) => {
        const locations = await db
          .select()
          .from(clothingLocations)
          .where(eq(clothingLocations.itemId, item.id));
        const effects = await db
          .select()
          .from(clothingEffects)
          .where(eq(clothingEffects.itemId, item.id));
        return {
          ...item,
          locations: locations.map((l) => l.location),
          effects: effects.map((e) => ({
            type: e.effectType,
            target: e.target,
            value: e.value,
            descriptionKey: e.descriptionKey,
          })),
        };
      })
    );

    // Ammunition
    const ammunitionData = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        flatAmount: ammunition.flatAmount,
        randomAmount: ammunition.randomAmount,
      })
      .from(items)
      .innerJoin(ammunition, eq(items.id, ammunition.itemId));

    // Chems
    const chemsData = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        duration: chems.duration,
        addictive: chems.addictive,
        addictionLevel: chems.addictionLevel,
        effectKey: chems.effectKey,
        effect: chems.effect,
      })
      .from(items)
      .innerJoin(chems, eq(items.id, chems.itemId));

    // Food
    const foodData = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        foodType: food.foodType,
        irradiated: food.irradiated,
        effectKey: food.effectKey,
        effect: food.effect,
      })
      .from(items)
      .innerJoin(food, eq(items.id, food.itemId));

    // General Goods
    const generalGoodsData = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        goodType: generalGoods.goodType,
        effectKey: generalGoods.effectKey,
        effect: generalGoods.effect,
      })
      .from(items)
      .innerJoin(generalGoods, eq(items.id, generalGoods.itemId));

    // Magazines
    const magazinesResults = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        perkDescriptionKey: magazines.perkDescriptionKey,
      })
      .from(items)
      .innerJoin(magazines, eq(items.id, magazines.itemId));

    const magazinesWithIssues = await Promise.all(
      magazinesResults.map(async (mag) => {
        const issues = await db
          .select()
          .from(magazineIssues)
          .where(eq(magazineIssues.magazineId, mag.id));
        return { ...mag, issues };
      })
    );

    // Robot Armors
    const robotArmorsData = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        drPhysical: robotArmors.drPhysical,
        drEnergy: robotArmors.drEnergy,
        isBonus: robotArmors.isBonus,
        location: robotArmors.location,
        carryModifier: robotArmors.carryModifier,
        perkRequired: robotArmors.perkRequired,
        specialEffectKey: robotArmors.specialEffectKey,
        specialEffectDescription: robotArmors.specialEffectDescription,
      })
      .from(items)
      .innerJoin(robotArmors, eq(items.id, robotArmors.itemId));

    // Syringer Ammo
    const syringerAmmoData = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        effectKey: syringerAmmo.effectKey,
        effect: syringerAmmo.effect,
      })
      .from(items)
      .innerJoin(syringerAmmo, eq(items.id, syringerAmmo.itemId));

    // Oddities
    const odditiesData = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        goodType: oddities.goodType,
        effect: oddities.effect,
      })
      .from(items)
      .innerJoin(oddities, eq(items.id, oddities.itemId));

    res.json({
      weapons: weaponsData,
      armors: armorsData,
      powerArmors: powerArmorsData,
      clothing: clothingData,
      ammunition: ammunitionData,
      chems: chemsData,
      food: foodData,
      generalGoods: generalGoodsData,
      magazines: magazinesWithIssues,
      robotArmors: robotArmorsData,
      syringerAmmo: syringerAmmoData,
      oddities: odditiesData,
    });
  } catch (error) {
    console.error('Error fetching all items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// ===== MAGAZINES =====
router.get('/magazines', async (_req, res) => {
  try {
    const results = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        perkDescriptionKey: magazines.perkDescriptionKey,
      })
      .from(items)
      .innerJoin(magazines, eq(items.id, magazines.itemId));

    const magazinesWithIssues = await Promise.all(
      results.map(async (mag) => {
        const issues = await db
          .select()
          .from(magazineIssues)
          .where(eq(magazineIssues.magazineId, mag.id));
        return { ...mag, issues };
      })
    );

    res.json(magazinesWithIssues);
  } catch (error) {
    console.error('Error fetching magazines:', error);
    res.status(500).json({ error: 'Failed to fetch magazines' });
  }
});

router.get('/magazines/:id(\\d+)', async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const [result] = await db
      .select({
        id: items.id,
        name: items.name,
        nameKey: items.nameKey,
        value: items.value,
        rarity: items.rarity,
        weight: items.weight,
        perkDescriptionKey: magazines.perkDescriptionKey,
      })
      .from(items)
      .innerJoin(magazines, eq(items.id, magazines.itemId))
      .where(eq(items.id, id));

    if (!result) {
      return res.status(404).json({ error: 'Magazine not found' });
    }

    const issues = await db
      .select()
      .from(magazineIssues)
      .where(eq(magazineIssues.magazineId, id));

    res.json({ ...result, issues });
  } catch (error) {
    console.error('Error fetching magazine:', error);
    res.status(500).json({ error: 'Failed to fetch magazine' });
  }
});

export default router;
