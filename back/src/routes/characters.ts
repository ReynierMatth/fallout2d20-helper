import { Router } from 'express';
import { db } from '../db/index';
import { eq } from 'drizzle-orm';
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
  items,
  armors,
  powerArmors,
  clothing,
  clothingLocations,
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

  // Get armor details
  const armorDetails: Record<number, { location: string; drPhysical: number; drEnergy: number; drRadiation: number; drPoison: number | null; hp: number | null }> = {};
  if (armorItemIds.length > 0) {
    for (const itemId of armorItemIds) {
      const [armor] = await db.select().from(armors).where(eq(armors.itemId, itemId));
      if (armor) {
        armorDetails[itemId] = {
          location: armor.location,
          drPhysical: armor.drPhysical,
          drEnergy: armor.drEnergy,
          drRadiation: armor.drRadiation,
          drPoison: armor.drPoison,
          hp: armor.hp,
        };
      }
    }
  }

  // Get power armor details
  const powerArmorDetails: Record<number, { set: string; location: string; drPhysical: number; drEnergy: number; drRadiation: number; hp: number }> = {};
  if (powerArmorItemIds.length > 0) {
    for (const itemId of powerArmorItemIds) {
      const [pa] = await db.select().from(powerArmors).where(eq(powerArmors.itemId, itemId));
      if (pa) {
        powerArmorDetails[itemId] = {
          set: pa.set,
          location: pa.location,
          drPhysical: pa.drPhysical,
          drEnergy: pa.drEnergy,
          drRadiation: pa.drRadiation,
          hp: pa.hp,
        };
      }
    }
  }

  // Get clothing details with locations
  const clothingDetails: Record<number, { locations: string[]; drPhysical: number; drEnergy: number; drRadiation: number; drPoison: number | null }> = {};
  if (clothingItemIds.length > 0) {
    for (const itemId of clothingItemIds) {
      const [cloth] = await db.select().from(clothing).where(eq(clothing.itemId, itemId));
      const locations = await db.select().from(clothingLocations).where(eq(clothingLocations.itemId, itemId));
      if (cloth) {
        clothingDetails[itemId] = {
          locations: locations.map(l => l.location),
          drPhysical: cloth.drPhysical ?? 0,
          drEnergy: cloth.drEnergy ?? 0,
          drRadiation: cloth.drRadiation ?? 0,
          drPoison: cloth.drPoison,
        };
      }
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
    };
  });
}

// Helper to get full character with relations
async function getFullCharacter(characterId: number) {
  const [character] = await db.select().from(characters).where(eq(characters.id, characterId));
  if (!character) return null;

  const [special, skills, tagSkills, survivorTraits, perks, giftedBonuses, exerciseBonuses, conditions] =
    await Promise.all([
      db.select().from(characterSpecial).where(eq(characterSpecial.characterId, characterId)),
      db.select().from(characterSkills).where(eq(characterSkills.characterId, characterId)),
      db.select().from(characterTagSkills).where(eq(characterTagSkills.characterId, characterId)),
      db.select().from(characterSurvivorTraits).where(eq(characterSurvivorTraits.characterId, characterId)),
      db.select().from(characterPerks).where(eq(characterPerks.characterId, characterId)),
      db.select().from(characterGiftedBonuses).where(eq(characterGiftedBonuses.characterId, characterId)),
      db.select().from(characterExerciseBonuses).where(eq(characterExerciseBonuses.characterId, characterId)),
      db.select().from(characterConditions).where(eq(characterConditions.characterId, characterId)),
    ]);

  const inventory = await getCharacterInventory(characterId);

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

    // Delete character (cascade will handle related tables)
    await db.delete(characters).where(eq(characters.id, id));

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting character:', error);
    res.status(500).json({ error: 'Failed to delete character' });
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

export default router;
