import { Router } from 'express';
import { db } from '../db/index';
import { eq, and, inArray } from 'drizzle-orm';
import {
  characters,
  characterSpecial,
  characterSkills,
  characterTagSkills,
  characterSurvivorTraits,
  characterPerks,
  characterGiftedBonuses,
  characterExerciseBonuses,
  characterConditions,
  characterInventory,
  characterDr,
  characterTraits,
  items,
  armors,
  powerArmors,
  clothing,
  clothingLocations,
  inventoryItemMods,
  itemCompatibleMods,
  mods,
  modEffects,
  bestiaryAttributes,
  sessionParticipants,
} from '../db/schema/index';

const router = Router();

// Helper to get inventory items with full item details including armor/clothing stats
async function getCharacterInventory(characterId: number) {
  const inventoryRows = await db
    .select({
      id: characterInventory.id,
      itemId: characterInventory.itemId,
      quantity: characterInventory.quantity,
      equipped: characterInventory.equipped,
      equippedLocation: characterInventory.equippedLocation,
      currentHp: characterInventory.currentHp,
      // Item details
      itemName: items.name,
      itemType: items.itemType,
      itemNameKey: items.nameKey,
      itemValue: items.value,
      itemRarity: items.rarity,
      itemWeight: items.weight,
    })
    .from(characterInventory)
    .innerJoin(items, eq(characterInventory.itemId, items.id))
    .where(eq(characterInventory.characterId, characterId));

  // Fetch armor, power armor, and clothing details for equipped items
  const armorItemIds = inventoryRows
    .filter(r => r.itemType === 'armor')
    .map(r => r.itemId);
  const powerArmorItemIds = inventoryRows
    .filter(r => r.itemType === 'powerArmor')
    .map(r => r.itemId);
  const clothingItemIds = inventoryRows
    .filter(r => r.itemType === 'clothing')
    .map(r => r.itemId);

  // Batch fetch armor details (single query instead of N queries)
  const armorDetails: Record<number, { location: string; drPhysical: number; drEnergy: number; drRadiation: number; drPoison: number | null; hp: number | null }> = {};
  if (armorItemIds.length > 0) {
    const armorRows = await db.select().from(armors).where(inArray(armors.itemId, armorItemIds));
    for (const armor of armorRows) {
      armorDetails[armor.itemId] = {
        location: armor.location,
        drPhysical: armor.drPhysical,
        drEnergy: armor.drEnergy,
        drRadiation: armor.drRadiation,
        drPoison: armor.drPoison,
        hp: armor.hp,
      };
    }
  }

  // Batch fetch power armor details
  const powerArmorDetails: Record<number, { set: string; location: string; drPhysical: number; drEnergy: number; drRadiation: number; hp: number }> = {};
  if (powerArmorItemIds.length > 0) {
    const paRows = await db.select().from(powerArmors).where(inArray(powerArmors.itemId, powerArmorItemIds));
    for (const pa of paRows) {
      powerArmorDetails[pa.itemId] = {
        set: pa.set,
        location: pa.location,
        drPhysical: pa.drPhysical,
        drEnergy: pa.drEnergy,
        drRadiation: pa.drRadiation,
        hp: pa.hp,
      };
    }
  }

  // Batch fetch clothing details + locations (2 queries instead of 2*N)
  const clothingDetails: Record<number, { locations: string[]; drPhysical: number; drEnergy: number; drRadiation: number; drPoison: number | null }> = {};
  if (clothingItemIds.length > 0) {
    const [clothRows, locRows] = await Promise.all([
      db.select().from(clothing).where(inArray(clothing.itemId, clothingItemIds)),
      db.select().from(clothingLocations).where(inArray(clothingLocations.itemId, clothingItemIds)),
    ]);
    const locsByItemId: Record<number, string[]> = {};
    for (const loc of locRows) {
      (locsByItemId[loc.itemId] ??= []).push(loc.location);
    }
    for (const cloth of clothRows) {
      clothingDetails[cloth.itemId] = {
        locations: locsByItemId[cloth.itemId] ?? [],
        drPhysical: cloth.drPhysical ?? 0,
        drEnergy: cloth.drEnergy ?? 0,
        drRadiation: cloth.drRadiation ?? 0,
        drPoison: cloth.drPoison,
      };
    }
  }

  // Batch fetch installed mods for ALL inventory items (2 queries instead of N*M)
  const allInventoryIds = inventoryRows.map(r => r.id);
  const installedModsMap: Record<number, { modInventoryId: number; modItemId: number; modName: string; slot: string; nameAddKey?: string; effects: { effectType: string; numericValue: number | null; qualityName: string | null; qualityValue: number | null; ammoType: string | null; descriptionKey: string | null }[] }[]> = {};

  if (allInventoryIds.length > 0) {
    const allModRows = await db
      .select({
        targetInventoryId: inventoryItemMods.targetInventoryId,
        modInventoryId: inventoryItemMods.modInventoryId,
        modItemId: characterInventory.itemId,
        modName: items.name,
        slot: mods.slot,
        nameAddKey: mods.nameAddKey,
        modTableId: mods.id,
      })
      .from(inventoryItemMods)
      .innerJoin(characterInventory, eq(inventoryItemMods.modInventoryId, characterInventory.id))
      .innerJoin(items, eq(characterInventory.itemId, items.id))
      .innerJoin(mods, eq(mods.itemId, characterInventory.itemId))
      .where(inArray(inventoryItemMods.targetInventoryId, allInventoryIds));

    if (allModRows.length > 0) {
      // Batch fetch all mod effects in a single query
      const allModTableIds = [...new Set(allModRows.map(r => r.modTableId))];
      const allEffectRows = await db.select().from(modEffects).where(inArray(modEffects.modId, allModTableIds));
      const effectsByModId: Record<number, typeof allEffectRows> = {};
      for (const e of allEffectRows) {
        (effectsByModId[e.modId] ??= []).push(e);
      }

      // Group mods by target inventory ID
      for (const r of allModRows) {
        const effects = (effectsByModId[r.modTableId] ?? []).map(e => ({
          effectType: e.effectType,
          numericValue: e.numericValue,
          qualityName: e.qualityName,
          qualityValue: e.qualityValue,
          ammoType: e.ammoType,
          descriptionKey: e.descriptionKey,
        }));
        (installedModsMap[r.targetInventoryId] ??= []).push({
          modInventoryId: r.modInventoryId,
          modItemId: r.modItemId,
          modName: r.modName,
          slot: r.slot,
          nameAddKey: r.nameAddKey ?? undefined,
          effects,
        });
      }
    }
  }

  // Batch fetch compatible mod item IDs (1 query instead of N)
  const moddableTypes = ['weapon', 'armor', 'powerArmor', 'clothing'];
  const moddableItemIds = [...new Set(inventoryRows.filter(r => moddableTypes.includes(r.itemType)).map(r => r.itemId))];
  const compatibleModsMap: Record<number, number[]> = {};

  if (moddableItemIds.length > 0) {
    const compatRows = await db
      .select({ targetItemId: itemCompatibleMods.targetItemId, modItemId: itemCompatibleMods.modItemId })
      .from(itemCompatibleMods)
      .where(inArray(itemCompatibleMods.targetItemId, moddableItemIds));
    for (const row of compatRows) {
      (compatibleModsMap[row.targetItemId] ??= []).push(row.modItemId);
    }
  }

  return inventoryRows.map((row) => {
    const armor = armorDetails[row.itemId];
    const powerArmor = powerArmorDetails[row.itemId];
    return {
      id: row.id,
      itemId: row.itemId,
      quantity: row.quantity,
      equipped: row.equipped,
      equippedLocation: row.equippedLocation,
      // For power armor: currentHp tracks piece HP, null means full HP
      currentHp: row.currentHp,
      // Calculate effective max HP from armor or power armor details
      maxHp: armor?.hp ?? powerArmor?.hp ?? null,
      item: {
        id: row.itemId,
        name: row.itemName,
        itemType: row.itemType,
        nameKey: row.itemNameKey,
        value: row.itemValue,
        rarity: row.itemRarity,
        weight: row.itemWeight,
      },
      // Include armor/power armor/clothing details if applicable
      armorDetails: armor || null,
      powerArmorDetails: powerArmor || null,
      clothingDetails: clothingDetails[row.itemId] || null,
      // Include installed mods if any
      installedMods: installedModsMap[row.id] || [],
      // Compatible mod item IDs for moddable items
      compatibleModItemIds: compatibleModsMap[row.itemId] || [],
    };
  });
}

// Helper to get full character with relations
async function getFullCharacter(characterId: number) {
  const [character] = await db.select().from(characters).where(eq(characters.id, characterId));
  if (!character) return null;

  const [special, skills, tagSkills, survivorTraits, perks, giftedBonuses, exerciseBonuses, conditions, drRows, traitRows] =
    await Promise.all([
      db.select().from(characterSpecial).where(eq(characterSpecial.characterId, characterId)),
      db.select().from(characterSkills).where(eq(characterSkills.characterId, characterId)),
      db.select().from(characterTagSkills).where(eq(characterTagSkills.characterId, characterId)),
      db.select().from(characterSurvivorTraits).where(eq(characterSurvivorTraits.characterId, characterId)),
      db.select().from(characterPerks).where(eq(characterPerks.characterId, characterId)),
      db.select().from(characterGiftedBonuses).where(eq(characterGiftedBonuses.characterId, characterId)),
      db.select().from(characterExerciseBonuses).where(eq(characterExerciseBonuses.characterId, characterId)),
      db.select().from(characterConditions).where(eq(characterConditions.characterId, characterId)),
      db.select().from(characterDr).where(eq(characterDr.characterId, characterId)),
      db.select().from(characterTraits).where(eq(characterTraits.characterId, characterId)),
    ]);

  const inventory = await getCharacterInventory(characterId);

  // Creature attributes: prefer character's own data, fall back to bestiary
  let creatureAttributes: Record<string, number> | undefined = character.creatureAttributes ?? undefined;
  let creatureSkills: Record<string, number> | undefined = character.creatureSkills ?? undefined;
  if (!creatureAttributes && character.statBlockType === 'creature' && character.bestiaryEntryId) {
    const attrRows = await db
      .select({ attribute: bestiaryAttributes.attribute, value: bestiaryAttributes.value })
      .from(bestiaryAttributes)
      .where(eq(bestiaryAttributes.bestiaryEntryId, character.bestiaryEntryId));
    creatureAttributes = Object.fromEntries(attrRows.map((a) => [a.attribute, a.value]));
  }

  return {
    ...character,
    special: Object.fromEntries(special.map((s) => [s.attribute, s.value])),
    skills: Object.fromEntries(skills.map((s) => [s.skill, s.rank])),
    tagSkills: tagSkills.map((t) => t.skill),
    survivorTraits: survivorTraits.map((t) => t.traitId),
    perks: perks.map((p) => ({ perkId: p.perkId, rank: p.rank })),
    giftedBonusAttributes: giftedBonuses.map((b) => b.attribute),
    exerciseBonuses: exerciseBonuses.map((b) => b.attribute),
    conditions: conditions.map((c) => c.condition),
    inventory,
    radiationDamage: character.radiationDamage ?? 0,
    creatureAttributes,
    creatureSkills,
    creatureAttacks: character.creatureAttacks ?? undefined,
    dr: drRows.map((d) => ({
      location: d.location,
      drPhysical: d.drPhysical,
      drEnergy: d.drEnergy,
      drRadiation: d.drRadiation,
      drPoison: d.drPoison,
    })),
    traits: traitRows.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      nameKey: t.nameKey,
      descriptionKey: t.descriptionKey,
    })),
  };
}

function buildExportData(character: NonNullable<Awaited<ReturnType<typeof getFullCharacter>>>) {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    appVersion: 'fallout2d20-helper',
    character: {
      name: character.name,
      type: character.type,
      statBlockType: character.statBlockType,
      level: character.level,
      xp: character.xp,
      maxHp: character.maxHp,
      currentHp: character.currentHp,
      defense: character.defense,
      initiative: character.initiative,
      meleeDamageBonus: character.meleeDamageBonus,
      carryCapacity: character.carryCapacity,
      maxLuckPoints: character.maxLuckPoints,
      currentLuckPoints: character.currentLuckPoints,
      caps: character.caps,
      radiationDamage: character.radiationDamage,
      special: character.special,
      skills: character.skills,
      tagSkills: character.tagSkills,
      survivorTraits: character.survivorTraits,
      perks: character.perks,
      giftedBonusAttributes: character.giftedBonusAttributes,
      exerciseBonuses: character.exerciseBonuses,
      conditions: character.conditions,
      dr: character.dr,
      traits: character.traits.map((t) => ({
        name: t.name,
        description: t.description,
        ...(t.nameKey && { nameKey: t.nameKey }),
        ...(t.descriptionKey && { descriptionKey: t.descriptionKey }),
      })),
      inventory: character.inventory.map((inv) => ({
        quantity: inv.quantity,
        equipped: inv.equipped,
        equippedLocation: inv.equippedLocation ?? null,
        item: {
          name: inv.item.name,
          itemType: inv.item.itemType,
          value: inv.item.value,
          rarity: inv.item.rarity,
          weight: inv.item.weight,
        },
        ...(inv.armorDetails && { armorDetails: inv.armorDetails }),
        ...(inv.powerArmorDetails && { powerArmorDetails: inv.powerArmorDetails }),
        ...(inv.clothingDetails && { clothingDetails: inv.clothingDetails }),
        installedMods: inv.installedMods.map((mod) => ({
          modName: mod.modName,
          slot: mod.slot,
          ...(mod.nameAddKey && { nameAddKey: mod.nameAddKey }),
        })),
      })),
      ...(character.creatureAttributes && { creatureAttributes: character.creatureAttributes }),
      ...(character.creatureSkills && { creatureSkills: character.creatureSkills }),
      ...(character.creatureAttacks && { creatureAttacks: character.creatureAttacks }),
    },
  };
}

// GET all characters
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;

    let query = db.select().from(characters);
    if (type && (type === 'pc' || type === 'npc')) {
      query = db.select().from(characters).where(eq(characters.type, type)) as any;
    }

    const results = await query;

    // Optionally fetch full details for each
    if (req.query.full === 'true') {
      const fullCharacters = await Promise.all(
        results.map((c) => getFullCharacter(c.id))
      );
      return res.json(fullCharacters);
    }

    res.json(results);
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

// Export a character as a portable JSON file
router.get('/:id/export', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const character = await getFullCharacter(id);
    if (!character) return res.status(404).json({ error: 'Character not found' });

    const exportData = buildExportData(character);
    const filename = `${character.name.replace(/[^a-z0-9]/gi, '_')}.json`;

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.json(exportData);
  } catch (error) {
    console.error('Error exporting character:', error);
    res.status(500).json({ error: 'Failed to export character' });
  }
});

// GET single character
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const character = await getFullCharacter(id);

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    res.json(character);
  } catch (error) {
    console.error('Error fetching character:', error);
    res.status(500).json({ error: 'Failed to fetch character' });
  }
});

// POST create character
router.post('/', async (req, res) => {
  try {
    const data = req.body;

    // Insert main character record
    const [newCharacter] = await db
      .insert(characters)
      .values({
        name: data.name,
        type: data.type,
        level: data.level ?? 1,
        xp: data.xp ?? 0,
        originId: data.originId,
        maxHp: data.maxHp,
        currentHp: data.currentHp ?? data.maxHp,
        defense: data.defense,
        initiative: data.initiative,
        meleeDamageBonus: data.meleeDamageBonus ?? 0,
        carryCapacity: data.carryCapacity,
        maxLuckPoints: data.maxLuckPoints,
        currentLuckPoints: data.currentLuckPoints ?? data.maxLuckPoints,
        caps: data.caps ?? 0,
        radiationDamage: data.radiationDamage ?? 0,
        statBlockType: data.statBlockType ?? 'normal',
        creatureAttributes: data.creatureAttributes ?? null,
        creatureSkills: data.creatureSkills ?? null,
        creatureAttacks: data.creatureAttacks ?? null,
      })
      .returning();

    const characterId = newCharacter.id;

    // Insert SPECIAL attributes
    if (data.special) {
      const specialEntries = Object.entries(data.special);
      if (specialEntries.length > 0) {
        await db.insert(characterSpecial).values(
          specialEntries.map(([attribute, value]) => ({
            characterId,
            attribute: attribute as any,
            value: value as number,
          }))
        );
      }
    }

    // Insert skills
    if (data.skills) {
      const skillEntries = Object.entries(data.skills).filter(([, rank]) => (rank as number) > 0);
      if (skillEntries.length > 0) {
        await db.insert(characterSkills).values(
          skillEntries.map(([skill, rank]) => ({
            characterId,
            skill: skill as any,
            rank: rank as number,
          }))
        );
      }
    }

    // Insert tag skills
    if (data.tagSkills && data.tagSkills.length > 0) {
      await db.insert(characterTagSkills).values(
        data.tagSkills.map((skill: string) => ({
          characterId,
          skill: skill as any,
        }))
      );
    }

    // Insert survivor traits
    if (data.survivorTraits && data.survivorTraits.length > 0) {
      await db.insert(characterSurvivorTraits).values(
        data.survivorTraits.map((traitId: string) => ({
          characterId,
          traitId: traitId as any,
        }))
      );
    }

    // Insert perks
    if (data.perks && data.perks.length > 0) {
      await db.insert(characterPerks).values(
        data.perks.map((perk: { perkId: string; rank: number }) => ({
          characterId,
          perkId: perk.perkId,
          rank: perk.rank,
        }))
      );
    }

    // Insert gifted bonuses
    if (data.giftedBonusAttributes && data.giftedBonusAttributes.length > 0) {
      await db.insert(characterGiftedBonuses).values(
        data.giftedBonusAttributes.map((attribute: string) => ({
          characterId,
          attribute: attribute as any,
        }))
      );
    }

    // Insert exercise bonuses
    if (data.exerciseBonuses && data.exerciseBonuses.length > 0) {
      await db.insert(characterExerciseBonuses).values(
        data.exerciseBonuses.map((attribute: string) => ({
          characterId,
          attribute: attribute as any,
        }))
      );
    }

    // Insert inventory items
    if (data.inventory && data.inventory.length > 0) {
      await db.insert(characterInventory).values(
        data.inventory.map((inv: { itemId: number; quantity?: number; equipped?: boolean; equippedLocation?: string }) => ({
          characterId,
          itemId: inv.itemId,
          quantity: inv.quantity ?? 1,
          equipped: inv.equipped ?? false,
          equippedLocation: inv.equippedLocation as any,
        }))
      );
    }

    // Insert fixed DR entries
    if (data.dr && data.dr.length > 0) {
      await db.insert(characterDr).values(
        data.dr.map((d: { location: string; drPhysical: number; drEnergy: number; drRadiation: number; drPoison: number }) => ({
          characterId,
          location: d.location,
          drPhysical: d.drPhysical,
          drEnergy: d.drEnergy,
          drRadiation: d.drRadiation,
          drPoison: d.drPoison,
        }))
      );
    }

    // Insert character traits
    if (data.traits && data.traits.length > 0) {
      await db.insert(characterTraits).values(
        data.traits.map((t: { name: string; description: string; nameKey?: string; descriptionKey?: string }) => ({
          characterId,
          name: t.name,
          description: t.description,
          nameKey: t.nameKey ?? null,
          descriptionKey: t.descriptionKey ?? null,
        }))
      );
    }

    // Return full character
    const fullCharacter = await getFullCharacter(characterId);
    res.status(201).json(fullCharacter);
  } catch (error) {
    console.error('Error creating character:', error);
    res.status(500).json({ error: 'Failed to create character' });
  }
});

// PUT update character
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    // Check if character exists
    const [existing] = await db.select().from(characters).where(eq(characters.id, id));
    if (!existing) {
      return res.status(404).json({ error: 'Character not found' });
    }

    // Update main character record
    await db
      .update(characters)
      .set({
        name: data.name,
        type: data.type,
        level: data.level,
        xp: data.xp,
        originId: data.originId,
        maxHp: data.maxHp,
        currentHp: data.currentHp,
        defense: data.defense,
        initiative: data.initiative,
        meleeDamageBonus: data.meleeDamageBonus,
        carryCapacity: data.carryCapacity,
        maxLuckPoints: data.maxLuckPoints,
        currentLuckPoints: data.currentLuckPoints,
        caps: data.caps,
        radiationDamage: data.radiationDamage,
        statBlockType: data.statBlockType,
        creatureAttributes: data.creatureAttributes !== undefined ? data.creatureAttributes : undefined,
        creatureSkills: data.creatureSkills !== undefined ? data.creatureSkills : undefined,
        creatureAttacks: data.creatureAttacks !== undefined ? data.creatureAttacks : undefined,
        updatedAt: new Date(),
      })
      .where(eq(characters.id, id));

    // Update SPECIAL (delete and re-insert)
    if (data.special) {
      await db.delete(characterSpecial).where(eq(characterSpecial.characterId, id));
      const specialEntries = Object.entries(data.special);
      if (specialEntries.length > 0) {
        await db.insert(characterSpecial).values(
          specialEntries.map(([attribute, value]) => ({
            characterId: id,
            attribute: attribute as any,
            value: value as number,
          }))
        );
      }
    }

    // Update skills
    if (data.skills) {
      await db.delete(characterSkills).where(eq(characterSkills.characterId, id));
      const skillEntries = Object.entries(data.skills).filter(([, rank]) => (rank as number) > 0);
      if (skillEntries.length > 0) {
        await db.insert(characterSkills).values(
          skillEntries.map(([skill, rank]) => ({
            characterId: id,
            skill: skill as any,
            rank: rank as number,
          }))
        );
      }
    }

    // Update tag skills
    if (data.tagSkills !== undefined) {
      await db.delete(characterTagSkills).where(eq(characterTagSkills.characterId, id));
      if (data.tagSkills.length > 0) {
        await db.insert(characterTagSkills).values(
          data.tagSkills.map((skill: string) => ({
            characterId: id,
            skill: skill as any,
          }))
        );
      }
    }

    // Update survivor traits
    if (data.survivorTraits !== undefined) {
      await db.delete(characterSurvivorTraits).where(eq(characterSurvivorTraits.characterId, id));
      if (data.survivorTraits.length > 0) {
        await db.insert(characterSurvivorTraits).values(
          data.survivorTraits.map((traitId: string) => ({
            characterId: id,
            traitId: traitId as any,
          }))
        );
      }
    }

    // Update perks
    if (data.perks !== undefined) {
      await db.delete(characterPerks).where(eq(characterPerks.characterId, id));
      if (data.perks.length > 0) {
        await db.insert(characterPerks).values(
          data.perks.map((perk: { perkId: string; rank: number }) => ({
            characterId: id,
            perkId: perk.perkId,
            rank: perk.rank,
          }))
        );
      }
    }

    // Update gifted bonuses
    if (data.giftedBonusAttributes !== undefined) {
      await db.delete(characterGiftedBonuses).where(eq(characterGiftedBonuses.characterId, id));
      if (data.giftedBonusAttributes.length > 0) {
        await db.insert(characterGiftedBonuses).values(
          data.giftedBonusAttributes.map((attribute: string) => ({
            characterId: id,
            attribute: attribute as any,
          }))
        );
      }
    }

    // Update exercise bonuses
    if (data.exerciseBonuses !== undefined) {
      await db.delete(characterExerciseBonuses).where(eq(characterExerciseBonuses.characterId, id));
      if (data.exerciseBonuses.length > 0) {
        await db.insert(characterExerciseBonuses).values(
          data.exerciseBonuses.map((attribute: string) => ({
            characterId: id,
            attribute: attribute as any,
          }))
        );
      }
    }

    // Update conditions
    if (data.conditions !== undefined) {
      await db.delete(characterConditions).where(eq(characterConditions.characterId, id));
      if (data.conditions.length > 0) {
        await db.insert(characterConditions).values(
          data.conditions.map((condition: string) => ({
            characterId: id,
            condition: condition as any,
          }))
        );
      }
    }

    // Update inventory (full replacement if provided)
    if (data.inventory !== undefined) {
      await db.delete(characterInventory).where(eq(characterInventory.characterId, id));
      if (data.inventory.length > 0) {
        await db.insert(characterInventory).values(
          data.inventory.map((inv: { itemId: number; quantity?: number; equipped?: boolean; equippedLocation?: string }) => ({
            characterId: id,
            itemId: inv.itemId,
            quantity: inv.quantity ?? 1,
            equipped: inv.equipped ?? false,
            equippedLocation: inv.equippedLocation as any,
          }))
        );
      }
    }

    // Update fixed DR (delete + re-insert)
    if (data.dr !== undefined) {
      await db.delete(characterDr).where(eq(characterDr.characterId, id));
      if (data.dr.length > 0) {
        await db.insert(characterDr).values(
          data.dr.map((d: { location: string; drPhysical: number; drEnergy: number; drRadiation: number; drPoison: number }) => ({
            characterId: id,
            location: d.location,
            drPhysical: d.drPhysical,
            drEnergy: d.drEnergy,
            drRadiation: d.drRadiation,
            drPoison: d.drPoison,
          }))
        );
      }
    }

    // Update character traits (delete + re-insert)
    if (data.traits !== undefined) {
      await db.delete(characterTraits).where(eq(characterTraits.characterId, id));
      if (data.traits.length > 0) {
        await db.insert(characterTraits).values(
          data.traits.map((t: { name: string; description: string; nameKey?: string; descriptionKey?: string }) => ({
            characterId: id,
            name: t.name,
            description: t.description,
            nameKey: t.nameKey ?? null,
            descriptionKey: t.descriptionKey ?? null,
          }))
        );
      }
    }

    // Return updated character
    const fullCharacter = await getFullCharacter(id);
    res.json(fullCharacter);
  } catch (error) {
    console.error('Error updating character:', error);
    res.status(500).json({ error: 'Failed to update character' });
  }
});

// DELETE character
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Check if character exists
    const [existing] = await db.select().from(characters).where(eq(characters.id, id));
    if (!existing) {
      return res.status(404).json({ error: 'Character not found' });
    }

    // Remove from any sessions first (no cascade on this FK)
    await db.delete(sessionParticipants).where(eq(sessionParticipants.characterId, id));

    // Delete character (cascade will handle related tables)
    await db.delete(characters).where(eq(characters.id, id));

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting character:', error);
    res.status(500).json({ error: 'Failed to delete character' });
  }
});

// Import a character from an exported JSON file
router.post('/import', async (req, res) => {
  try {
    const data = req.body;

    if (!data.version || !data.character?.name || !data.character?.type) {
      return res.status(400).json({ error: 'Invalid export file: missing version, character.name, or character.type' });
    }

    const char = data.character;

    const { newCharId, warnings } = await db.transaction(async (tx) => {
      const warnings: { itemName: string; reason: string }[] = [];

      // 1. Insert character base record
      const [newChar] = await tx.insert(characters).values({
        name: char.name,
        type: char.type,
        statBlockType: char.statBlockType ?? 'normal',
        level: char.level ?? 1,
        xp: char.xp ?? 0,
        maxHp: char.maxHp ?? 10,
        currentHp: char.currentHp ?? char.maxHp ?? 10,
        defense: char.defense ?? 1,
        initiative: char.initiative ?? 10,
        meleeDamageBonus: char.meleeDamageBonus ?? 0,
        carryCapacity: char.carryCapacity ?? 150,
        maxLuckPoints: char.maxLuckPoints ?? 0,
        currentLuckPoints: char.currentLuckPoints ?? 0,
        caps: char.caps ?? 0,
        radiationDamage: char.radiationDamage ?? 0,
        creatureAttributes: char.creatureAttributes ?? null,
        creatureSkills: char.creatureSkills ?? null,
        creatureAttacks: char.creatureAttacks ?? null,
      }).returning();

      if (!newChar) throw new Error('Character insert returned no rows');
      const newCharId = newChar.id;

      // 2. SPECIAL
      if (char.special) {
        const specialEntries = Object.entries(char.special);
        if (specialEntries.length > 0) {
          await tx.insert(characterSpecial).values(
            specialEntries.map(([attribute, value]) => ({
              characterId: newCharId,
              attribute: attribute as any,
              value: value as number,
            }))
          );
        }
      }

      // 3. Skills
      if (char.skills) {
        const skillEntries = Object.entries(char.skills).filter(([, rank]) => (rank as number) > 0);
        if (skillEntries.length > 0) {
          await tx.insert(characterSkills).values(
            skillEntries.map(([skill, rank]) => ({
              characterId: newCharId,
              skill: skill as any,
              rank: rank as number,
            }))
          );
        }
      }

      // 4. Tag skills
      if (char.tagSkills?.length > 0) {
        await tx.insert(characterTagSkills).values(
          char.tagSkills.map((skill: string) => ({
            characterId: newCharId,
            skill: skill as any,
          }))
        );
      }

      // 5. Survivor traits
      if (char.survivorTraits?.length > 0) {
        await tx.insert(characterSurvivorTraits).values(
          char.survivorTraits.map((traitId: string) => ({
            characterId: newCharId,
            traitId: traitId as any,
          }))
        );
      }

      // 6. Perks
      if (char.perks?.length > 0) {
        await tx.insert(characterPerks).values(
          char.perks.map((perk: { perkId: string; rank: number }) => ({
            characterId: newCharId,
            perkId: perk.perkId,
            rank: perk.rank,
          }))
        );
      }

      // 7. Gifted bonuses
      if (char.giftedBonusAttributes?.length > 0) {
        await tx.insert(characterGiftedBonuses).values(
          char.giftedBonusAttributes.map((attribute: string) => ({
            characterId: newCharId,
            attribute: attribute as any,
          }))
        );
      }

      // 8. Exercise bonuses
      if (char.exerciseBonuses?.length > 0) {
        await tx.insert(characterExerciseBonuses).values(
          char.exerciseBonuses.map((attribute: string) => ({
            characterId: newCharId,
            attribute: attribute as any,
          }))
        );
      }

      // 9. Conditions
      if (char.conditions?.length > 0) {
        await tx.insert(characterConditions).values(
          char.conditions.map((condition: string) => ({
            characterId: newCharId,
            condition: condition as any,
          }))
        );
      }

      // 10. DR
      if (char.dr?.length > 0) {
        await tx.insert(characterDr).values(
          char.dr.map((d: any) => ({
            characterId: newCharId,
            location: d.location,
            drPhysical: d.drPhysical,
            drEnergy: d.drEnergy,
            drRadiation: d.drRadiation,
            drPoison: d.drPoison,
          }))
        );
      }

      // 11. Custom traits
      if (char.traits?.length > 0) {
        await tx.insert(characterTraits).values(
          char.traits.map((t: any) => ({
            characterId: newCharId,
            name: t.name,
            description: t.description,
            nameKey: t.nameKey ?? null,
            descriptionKey: t.descriptionKey ?? null,
          }))
        );
      }

      // 12. Inventory — resolve items by name, skip + warn if not found
      for (const inv of char.inventory ?? []) {
        if (!inv.item?.name) {
          warnings.push({ itemName: '(unknown)', reason: 'missing item data' });
          continue;
        }
        const [foundItem] = await tx.select({ id: items.id }).from(items).where(eq(items.name, inv.item.name));
        if (!foundItem) {
          warnings.push({ itemName: inv.item.name, reason: 'item not found' });
          continue;
        }

        const [newInv] = await tx.insert(characterInventory).values({
          characterId: newCharId,
          itemId: foundItem.id,
          quantity: inv.quantity ?? 1,
          equipped: inv.equipped ?? false,
          equippedLocation: inv.equippedLocation ?? null,
        }).returning();
        if (!newInv) throw new Error('Inventory insert returned no rows');

        // Resolve and install mods
        for (const mod of inv.installedMods ?? []) {
          const [foundMod] = await tx.select({ id: items.id }).from(items).where(eq(items.name, mod.modName));
          if (!foundMod) {
            warnings.push({ itemName: mod.modName, reason: 'mod item not found' });
            continue;
          }

          const [modInv] = await tx.insert(characterInventory).values({
            characterId: newCharId,
            itemId: foundMod.id,
            quantity: 1,
            equipped: false,
            equippedLocation: null,
          }).returning();
          if (!modInv) throw new Error('Mod inventory insert returned no rows');

          await tx.insert(inventoryItemMods).values({
            targetInventoryId: newInv.id,
            modInventoryId: modInv.id,
          });
        }
      }

      return { newCharId, warnings };
    });

    const fullCharacter = await getFullCharacter(newCharId);
    res.status(201).json({ character: fullCharacter, warnings });
  } catch (error) {
    console.error('Error importing character:', error);
    res.status(500).json({ error: 'Failed to import character' });
  }
});

// POST duplicate character
router.post('/:id/duplicate', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const character = await getFullCharacter(id);

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    // Create new character with same data but new name
    const newName = req.body.name ?? `${character.name} (Copy)`;

    const [newCharacter] = await db
      .insert(characters)
      .values({
        name: newName,
        type: character.type,
        level: character.level,
        xp: character.xp,
        originId: character.originId,
        maxHp: character.maxHp,
        currentHp: character.currentHp,
        defense: character.defense,
        initiative: character.initiative,
        meleeDamageBonus: character.meleeDamageBonus,
        carryCapacity: character.carryCapacity,
        maxLuckPoints: character.maxLuckPoints,
        currentLuckPoints: character.currentLuckPoints,
        caps: character.caps,
        statBlockType: character.statBlockType,
        bestiaryEntryId: character.bestiaryEntryId,
        creatureAttributes: character.creatureAttributes,
        creatureSkills: character.creatureSkills,
        creatureAttacks: character.creatureAttacks,
      })
      .returning();

    const newId = newCharacter.id;

    // Copy all related data
    if (character.special) {
      const specialEntries = Object.entries(character.special);
      if (specialEntries.length > 0) {
        await db.insert(characterSpecial).values(
          specialEntries.map(([attribute, value]) => ({
            characterId: newId,
            attribute: attribute as any,
            value: value as number,
          }))
        );
      }
    }

    if (character.skills) {
      const skillEntries = Object.entries(character.skills).filter(([, rank]) => (rank as number) > 0);
      if (skillEntries.length > 0) {
        await db.insert(characterSkills).values(
          skillEntries.map(([skill, rank]) => ({
            characterId: newId,
            skill: skill as any,
            rank: rank as number,
          }))
        );
      }
    }

    if (character.tagSkills && character.tagSkills.length > 0) {
      await db.insert(characterTagSkills).values(
        character.tagSkills.map((skill: string) => ({
          characterId: newId,
          skill: skill as any,
        }))
      );
    }

    if (character.survivorTraits && character.survivorTraits.length > 0) {
      await db.insert(characterSurvivorTraits).values(
        character.survivorTraits.map((traitId: string) => ({
          characterId: newId,
          traitId: traitId as any,
        }))
      );
    }

    if (character.perks && character.perks.length > 0) {
      await db.insert(characterPerks).values(
        character.perks.map((perk: { perkId: string; rank: number }) => ({
          characterId: newId,
          perkId: perk.perkId,
          rank: perk.rank,
        }))
      );
    }

    if (character.giftedBonusAttributes && character.giftedBonusAttributes.length > 0) {
      await db.insert(characterGiftedBonuses).values(
        character.giftedBonusAttributes.map((attribute: string) => ({
          characterId: newId,
          attribute: attribute as any,
        }))
      );
    }

    if (character.exerciseBonuses && character.exerciseBonuses.length > 0) {
      await db.insert(characterExerciseBonuses).values(
        character.exerciseBonuses.map((attribute: string) => ({
          characterId: newId,
          attribute: attribute as any,
        }))
      );
    }

    // Copy inventory
    if (character.inventory && character.inventory.length > 0) {
      await db.insert(characterInventory).values(
        character.inventory.map((inv) => ({
          characterId: newId,
          itemId: inv.itemId,
          quantity: inv.quantity,
          equipped: inv.equipped,
          equippedLocation: inv.equippedLocation as any,
        }))
      );
    }

    // Copy fixed DR
    if (character.dr && character.dr.length > 0) {
      await db.insert(characterDr).values(
        character.dr.map((d) => ({
          characterId: newId,
          location: d.location,
          drPhysical: d.drPhysical,
          drEnergy: d.drEnergy,
          drRadiation: d.drRadiation,
          drPoison: d.drPoison,
        }))
      );
    }

    // Copy character traits
    if (character.traits && character.traits.length > 0) {
      await db.insert(characterTraits).values(
        character.traits.map((t) => ({
          characterId: newId,
          name: t.name,
          description: t.description,
          nameKey: t.nameKey ?? null,
          descriptionKey: t.descriptionKey ?? null,
        }))
      );
    }

    const fullCharacter = await getFullCharacter(newId);
    res.status(201).json(fullCharacter);
  } catch (error) {
    console.error('Error duplicating character:', error);
    res.status(500).json({ error: 'Failed to duplicate character' });
  }
});

// ===== INVENTORY ENDPOINTS =====

// GET character inventory
router.get('/:id/inventory', async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Check if character exists
    const [existing] = await db.select().from(characters).where(eq(characters.id, id));
    if (!existing) {
      return res.status(404).json({ error: 'Character not found' });
    }

    const inventory = await getCharacterInventory(id);
    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// POST add item to inventory
router.post('/:id/inventory', async (req, res) => {
  try {
    const characterId = Number(req.params.id);
    const { itemId, quantity, equipped, equippedLocation } = req.body;

    // Check if character exists
    const [existingCharacter] = await db.select().from(characters).where(eq(characters.id, characterId));
    if (!existingCharacter) {
      return res.status(404).json({ error: 'Character not found' });
    }

    // Check if item exists
    const [existingItem] = await db.select().from(items).where(eq(items.id, itemId));
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Insert inventory entry
    const [newEntry] = await db
      .insert(characterInventory)
      .values({
        characterId,
        itemId,
        quantity: quantity ?? 1,
        equipped: equipped ?? false,
        equippedLocation: equippedLocation as any,
      })
      .returning();

    // Return full inventory entry with item details
    const inventory = await getCharacterInventory(characterId);
    const addedEntry = inventory.find((inv) => inv.id === newEntry.id);

    res.status(201).json(addedEntry);
  } catch (error) {
    console.error('Error adding to inventory:', error);
    res.status(500).json({ error: 'Failed to add to inventory' });
  }
});

// PUT update inventory entry
router.put('/:id/inventory/:invId', async (req, res) => {
  try {
    const characterId = Number(req.params.id);
    const invId = Number(req.params.invId);
    const { quantity, equipped, equippedLocation, currentHp } = req.body;

    // Check if inventory entry exists and belongs to character
    const [existing] = await db
      .select()
      .from(characterInventory)
      .where(eq(characterInventory.id, invId));

    if (!existing || existing.characterId !== characterId) {
      return res.status(404).json({ error: 'Inventory entry not found' });
    }

    // Build update object
    const updateData: Record<string, any> = {
      quantity: quantity ?? existing.quantity,
      equipped: equipped ?? existing.equipped,
      equippedLocation: (equippedLocation ?? existing.equippedLocation) as any,
    };

    // Handle currentHp for power armor pieces
    if (currentHp !== undefined) {
      updateData.currentHp = currentHp;
    }

    // Update
    await db
      .update(characterInventory)
      .set(updateData)
      .where(eq(characterInventory.id, invId));

    // Return updated entry
    const inventory = await getCharacterInventory(characterId);
    const updatedEntry = inventory.find((inv) => inv.id === invId);

    res.json(updatedEntry);
  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

// DELETE remove item from inventory
router.delete('/:id/inventory/:invId', async (req, res) => {
  try {
    const characterId = Number(req.params.id);
    const invId = Number(req.params.invId);

    // Check if inventory entry exists and belongs to character
    const [existing] = await db
      .select()
      .from(characterInventory)
      .where(eq(characterInventory.id, invId));

    if (!existing || existing.characterId !== characterId) {
      return res.status(404).json({ error: 'Inventory entry not found' });
    }

    await db.delete(characterInventory).where(eq(characterInventory.id, invId));

    res.status(204).send();
  } catch (error) {
    console.error('Error removing from inventory:', error);
    res.status(500).json({ error: 'Failed to remove from inventory' });
  }
});

// ===== MOD INSTALL/UNINSTALL ENDPOINTS =====

// POST install a mod on an inventory item
router.post('/:id/inventory/:invId/mods', async (req, res) => {
  try {
    const characterId = Number(req.params.id);
    const invId = Number(req.params.invId);
    const { modInventoryId } = req.body;

    if (!modInventoryId) {
      return res.status(400).json({ error: 'modInventoryId is required' });
    }

    // Check target inventory entry belongs to character
    const [targetInv] = await db
      .select()
      .from(characterInventory)
      .where(eq(characterInventory.id, invId));

    if (!targetInv || targetInv.characterId !== characterId) {
      return res.status(404).json({ error: 'Target inventory entry not found' });
    }

    // Check mod inventory entry belongs to character
    const [modInv] = await db
      .select()
      .from(characterInventory)
      .where(eq(characterInventory.id, modInventoryId));

    if (!modInv || modInv.characterId !== characterId) {
      return res.status(404).json({ error: 'Mod inventory entry not found' });
    }

    // Check mod is compatible with target item
    const [compat] = await db
      .select()
      .from(itemCompatibleMods)
      .where(
        and(
          eq(itemCompatibleMods.targetItemId, targetInv.itemId),
          eq(itemCompatibleMods.modItemId, modInv.itemId)
        )
      );

    if (!compat) {
      return res.status(400).json({ error: 'Mod is not compatible with this item' });
    }

    // Insert the mod installation record
    await db.insert(inventoryItemMods).values({
      targetInventoryId: invId,
      modInventoryId: Number(modInventoryId),
    });

    // Return updated inventory item
    const inventory = await getCharacterInventory(characterId);
    const updatedEntry = inventory.find((inv) => inv.id === invId);

    res.status(201).json(updatedEntry);
  } catch (error) {
    console.error('Error installing mod:', error);
    res.status(500).json({ error: 'Failed to install mod' });
  }
});

// DELETE uninstall a mod from an inventory item
router.delete('/:id/inventory/:invId/mods/:modInvId', async (req, res) => {
  try {
    const characterId = Number(req.params.id);
    const invId = Number(req.params.invId);
    const modInvId = Number(req.params.modInvId);

    // Check target inventory entry belongs to character
    const [targetInv] = await db
      .select()
      .from(characterInventory)
      .where(eq(characterInventory.id, invId));

    if (!targetInv || targetInv.characterId !== characterId) {
      return res.status(404).json({ error: 'Target inventory entry not found' });
    }

    // Delete the installation record
    await db
      .delete(inventoryItemMods)
      .where(
        and(
          eq(inventoryItemMods.targetInventoryId, invId),
          eq(inventoryItemMods.modInventoryId, modInvId)
        )
      );

    // Return updated inventory item
    const inventory = await getCharacterInventory(characterId);
    const updatedEntry = inventory.find((inv) => inv.id === invId);

    res.json(updatedEntry);
  } catch (error) {
    console.error('Error uninstalling mod:', error);
    res.status(500).json({ error: 'Failed to uninstall mod' });
  }
});

export default router;
