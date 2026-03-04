import { Router } from 'express';
import { db } from '../db/index';
import { eq, ilike, and, or, sql } from 'drizzle-orm';
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
  mods,
  inventoryItemMods,
  characters,
  characterSpecial,
  characterSkills,
  characterTagSkills,
  characterInventory,
  characterDr,
  characterTraits,
  sessionParticipants,
} from '../db/schema/index';

const router = Router();

const ALL_BODY_LOCATIONS = ['head', 'torso', 'armLeft', 'armRight', 'legLeft', 'legRight'] as const;

// Helper: copy bestiary DR to character DR, expanding 'all' → 6 locations
async function copyBestiaryDrToCharacter(
  characterId: number,
  drEntries: { location: string; drPhysical: number; drEnergy: number; drRadiation: number; drPoison: number }[]
) {
  if (drEntries.length === 0) return;

  const rows: { characterId: number; location: string; drPhysical: number; drEnergy: number; drRadiation: number; drPoison: number }[] = [];

  for (const dr of drEntries) {
    if (dr.location === 'all') {
      for (const loc of ALL_BODY_LOCATIONS) {
        rows.push({
          characterId,
          location: loc,
          drPhysical: dr.drPhysical,
          drEnergy: dr.drEnergy,
          drRadiation: dr.drRadiation,
          drPoison: dr.drPoison,
        });
      }
    } else {
      rows.push({
        characterId,
        location: dr.location,
        drPhysical: dr.drPhysical,
        drEnergy: dr.drEnergy,
        drRadiation: dr.drRadiation,
        drPoison: dr.drPoison,
      });
    }
  }

  if (rows.length > 0) {
    await db.insert(characterDr).values(rows);
  }
}

// Helper: copy bestiary abilities → character traits
async function copyBestiaryAbilitiesToTraits(
  characterId: number,
  abilities: { nameKey: string; descriptionKey: string }[]
) {
  if (abilities.length === 0) return;

  await db.insert(characterTraits).values(
    abilities.map(a => ({
      characterId,
      name: a.nameKey,
      description: a.descriptionKey,
      nameKey: a.nameKey,
      descriptionKey: a.descriptionKey,
    }))
  );
}

// Helper to get full bestiary entry details
async function getFullBestiaryEntry(entryId: number) {
  const [entry] = await db
    .select()
    .from(bestiaryEntries)
    .where(eq(bestiaryEntries.id, entryId));

  if (!entry) return null;

  // Get all related data in parallel
  const [attributes, skills, dr, attacks, abilities, inventory] = await Promise.all([
    db.select().from(bestiaryAttributes).where(eq(bestiaryAttributes.bestiaryEntryId, entryId)),
    db.select().from(bestiarySkills).where(eq(bestiarySkills.bestiaryEntryId, entryId)),
    db.select().from(bestiaryDr).where(eq(bestiaryDr.bestiaryEntryId, entryId)),
    db.select({
      id: bestiaryAttacks.id,
      nameKey: bestiaryAttacks.nameKey,
      skill: bestiaryAttacks.skill,
      damage: bestiaryAttacks.damage,
      damageType: bestiaryAttacks.damageType,
      damageBonus: bestiaryAttacks.damageBonus,
      fireRate: bestiaryAttacks.fireRate,
      range: bestiaryAttacks.range,
      itemId: bestiaryAttacks.itemId,
      twoHanded: bestiaryAttacks.twoHanded,
      itemName: items.name,
      itemNameKey: items.nameKey,
      itemType: items.itemType,
    })
      .from(bestiaryAttacks)
      .leftJoin(items, eq(bestiaryAttacks.itemId, items.id))
      .where(eq(bestiaryAttacks.bestiaryEntryId, entryId)),
    db.select().from(bestiaryAbilities).where(eq(bestiaryAbilities.bestiaryEntryId, entryId)),
    db.select({
      id: bestiaryInventory.id,
      itemId: bestiaryInventory.itemId,
      quantity: bestiaryInventory.quantity,
      equipped: bestiaryInventory.equipped,
      itemName: items.name,
      itemNameKey: items.nameKey,
      itemType: items.itemType,
    })
      .from(bestiaryInventory)
      .innerJoin(items, eq(bestiaryInventory.itemId, items.id))
      .where(eq(bestiaryInventory.bestiaryEntryId, entryId)),
  ]);

  // Get attack qualities for each attack
  const attacksWithQualities = await Promise.all(
    attacks.map(async (attack) => {
      const qualities = await db
        .select({ quality: bestiaryAttackQualities.quality, value: bestiaryAttackQualities.value })
        .from(bestiaryAttackQualities)
        .where(eq(bestiaryAttackQualities.attackId, attack.id));
      return { ...attack, qualities };
    })
  );

  // Format attributes as Record
  const attributesMap: Record<string, number> = {};
  for (const attr of attributes) {
    attributesMap[attr.attribute] = attr.value;
  }

  return {
    ...entry,
    attributes: attributesMap,
    skills: skills.map(s => ({
      skill: s.skill,
      rank: s.rank,
      isTagSkill: s.isTagSkill,
    })),
    dr: dr.map(d => ({
      location: d.location,
      drPhysical: d.drPhysical,
      drEnergy: d.drEnergy,
      drRadiation: d.drRadiation,
      drPoison: d.drPoison,
    })),
    attacks: attacksWithQualities.map(a => ({
      id: a.id,
      nameKey: a.nameKey,
      skill: a.skill,
      damage: a.damage,
      damageType: a.damageType,
      damageBonus: a.damageBonus,
      fireRate: a.fireRate,
      range: a.range,
      itemId: a.itemId,
      twoHanded: a.twoHanded,
      qualities: a.qualities,
      item: a.itemId ? {
        id: a.itemId,
        name: a.itemName!,
        nameKey: a.itemNameKey,
        itemType: a.itemType!,
      } : null,
    })),
    abilities: abilities.map(a => ({
      nameKey: a.nameKey,
      descriptionKey: a.descriptionKey,
    })),
    inventory: await Promise.all(inventory.map(async (i) => {
      // Get installed mods for this inventory entry
      const invMods = await db
        .select({
          modItemId: bestiaryInventoryMods.modItemId,
          modItemName: items.name,
          modItemNameKey: items.nameKey,
        })
        .from(bestiaryInventoryMods)
        .innerJoin(items, eq(bestiaryInventoryMods.modItemId, items.id))
        .where(eq(bestiaryInventoryMods.bestiaryInventoryId, i.id));

      return {
        itemId: i.itemId,
        quantity: i.quantity,
        equipped: i.equipped,
        item: {
          id: i.itemId,
          name: i.itemName,
          nameKey: i.itemNameKey,
          itemType: i.itemType,
        },
        installedMods: invMods.map(m => ({
          modItemId: m.modItemId,
          modItemName: m.modItemName,
          modItemNameKey: m.modItemNameKey,
        })),
      };
    })),
  };
}

// GET /api/bestiary — List all entries (summary)
router.get('/', async (req, res) => {
  try {
    const { category, search, statBlockType } = req.query;

    const conditions = [];

    if (category && typeof category === 'string') {
      conditions.push(eq(bestiaryEntries.category, category as any));
    }

    if (statBlockType && typeof statBlockType === 'string') {
      conditions.push(eq(bestiaryEntries.statBlockType, statBlockType as any));
    }

    if (search && typeof search === 'string') {
      conditions.push(
        or(
          ilike(bestiaryEntries.slug, `%${search}%`),
          ilike(bestiaryEntries.nameKey, `%${search}%`),
        )!
      );
    }

    const entries = await db
      .select({
        id: bestiaryEntries.id,
        slug: bestiaryEntries.slug,
        nameKey: bestiaryEntries.nameKey,
        statBlockType: bestiaryEntries.statBlockType,
        category: bestiaryEntries.category,
        bodyType: bestiaryEntries.bodyType,
        level: bestiaryEntries.level,
        xpReward: bestiaryEntries.xpReward,
        hp: bestiaryEntries.hp,
        defense: bestiaryEntries.defense,
        initiative: bestiaryEntries.initiative,
        source: bestiaryEntries.source,
        emoji: bestiaryEntries.emoji,
      })
      .from(bestiaryEntries)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(bestiaryEntries.level, bestiaryEntries.slug);

    res.json(entries);
  } catch (error) {
    console.error('Error listing bestiary entries:', error);
    res.status(500).json({ error: 'Failed to list bestiary entries' });
  }
});

// GET /api/bestiary/:id — Full entry detail
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const entry = await getFullBestiaryEntry(id);
    if (!entry) {
      return res.status(404).json({ error: 'Bestiary entry not found' });
    }

    res.json(entry);
  } catch (error) {
    console.error('Error getting bestiary entry:', error);
    res.status(500).json({ error: 'Failed to get bestiary entry' });
  }
});

// POST /api/bestiary/:id/instantiate — Create character from bestiary entry
router.post('/:id/instantiate', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const { sessionId, name } = req.body;

    const entry = await getFullBestiaryEntry(id);
    if (!entry) {
      return res.status(404).json({ error: 'Bestiary entry not found' });
    }

    // Create character based on entry type
    const characterName = name || entry.nameKey; // i18n key, frontend will resolve

    if (entry.statBlockType === 'normal') {
      // Full character creation with SPECIAL + skills
      const specialMap = entry.attributes;
      const endurance = specialMap['endurance'] ?? 5;
      const agility = specialMap['agility'] ?? 5;
      const luck = specialMap['luck'] ?? 5;

      const [newChar] = await db.insert(characters).values({
        name: characterName,
        type: 'npc',
        level: entry.level,
        maxHp: entry.hp,
        currentHp: entry.hp,
        defense: entry.defense,
        initiative: entry.initiative,
        meleeDamageBonus: entry.meleeDamageBonus,
        carryCapacity: entry.carryCapacity,
        maxLuckPoints: entry.maxLuckPoints,
        currentLuckPoints: entry.maxLuckPoints,
        statBlockType: entry.statBlockType,
        bestiaryEntryId: entry.id,
        emoji: entry.emoji,
      }).returning();

      // Insert SPECIAL attributes
      const specialEntries = Object.entries(specialMap).map(([attribute, value]) => ({
        characterId: newChar.id,
        attribute: attribute as any,
        value,
      }));
      if (specialEntries.length > 0) {
        await db.insert(characterSpecial).values(specialEntries);
      }

      // Insert skills
      for (const skill of entry.skills) {
        await db.insert(characterSkills).values({
          characterId: newChar.id,
          skill: skill.skill as any,
          rank: skill.rank,
        });
        if (skill.isTagSkill) {
          await db.insert(characterTagSkills).values({
            characterId: newChar.id,
            skill: skill.skill as any,
          });
        }
      }

      // Insert inventory (with pre-installed mods)
      for (const inv of entry.inventory) {
        const [insertedInv] = await db.insert(characterInventory).values({
          characterId: newChar.id,
          itemId: inv.itemId,
          quantity: inv.quantity,
          equipped: inv.equipped,
        }).returning({ id: characterInventory.id });

        // If this item has pre-installed mods, create mod inventory entries and link them
        if (inv.installedMods && inv.installedMods.length > 0) {
          for (const mod of inv.installedMods) {
            const [modInv] = await db.insert(characterInventory).values({
              characterId: newChar.id,
              itemId: mod.modItemId,
              quantity: 1,
              equipped: true,
            }).returning({ id: characterInventory.id });

            await db.insert(inventoryItemMods).values({
              targetInventoryId: insertedInv.id,
              modInventoryId: modInv.id,
            });
          }
        }
      }

      // Copy DR from bestiary
      await copyBestiaryDrToCharacter(newChar.id, entry.dr);

      // Copy abilities as character traits
      await copyBestiaryAbilitiesToTraits(newChar.id, entry.abilities);

      // Add to session if requested
      if (sessionId) {
        await db.insert(sessionParticipants).values({
          sessionId: parseInt(sessionId, 10),
          characterId: newChar.id,
        });
      }

      res.status(201).json({ characterId: newChar.id, bestiaryEntryId: entry.id });

    } else {
      // Creature — minimal character (just hp/defense/initiative + inventory)
      // Store creature attributes and skills directly on character
      // entry.attributes is already a Record<string, number> from getFullBestiaryEntry
      const creatureAttributes = entry.attributes as Record<string, number>;
      const creatureSkills = Object.fromEntries(
        entry.skills.map((s) => [s.skill, s.rank])
      );
      const creatureAttacks = entry.attacks.map((a: any) => ({
        name: a.item?.name ?? a.nameKey,
        nameKey: a.item?.nameKey ?? a.nameKey,
        skill: a.skill,
        damage: a.damage,
        damageType: a.damageType,
        damageBonus: a.damageBonus ?? undefined,
        fireRate: a.fireRate,
        range: a.range,
        qualities: a.qualities.map((q: any) => ({ quality: q.quality, value: q.value ?? undefined })),
      }));

      const [newChar] = await db.insert(characters).values({
        name: characterName,
        type: 'npc',
        level: entry.level,
        maxHp: entry.hp,
        currentHp: entry.hp,
        defense: entry.defense,
        initiative: entry.initiative,
        meleeDamageBonus: entry.meleeDamageBonus,
        carryCapacity: entry.carryCapacity,
        maxLuckPoints: entry.maxLuckPoints,
        currentLuckPoints: entry.maxLuckPoints,
        statBlockType: entry.statBlockType,
        bestiaryEntryId: entry.id,
        emoji: entry.emoji,
        creatureAttributes,
        creatureSkills,
        creatureAttacks,
      }).returning();

      // Creatures need minimal SPECIAL to avoid errors (set defaults)
      const defaultSpecial = ['strength', 'perception', 'endurance', 'charisma', 'intelligence', 'agility', 'luck'];
      await db.insert(characterSpecial).values(
        defaultSpecial.map(attr => ({
          characterId: newChar.id,
          attribute: attr as any,
          value: 5,
        }))
      );

      // Insert inventory (with pre-installed mods)
      for (const inv of entry.inventory) {
        const [insertedInv] = await db.insert(characterInventory).values({
          characterId: newChar.id,
          itemId: inv.itemId,
          quantity: inv.quantity,
          equipped: inv.equipped,
        }).returning({ id: characterInventory.id });

        if (inv.installedMods && inv.installedMods.length > 0) {
          for (const mod of inv.installedMods) {
            const [modInv] = await db.insert(characterInventory).values({
              characterId: newChar.id,
              itemId: mod.modItemId,
              quantity: 1,
              equipped: true,
            }).returning({ id: characterInventory.id });

            await db.insert(inventoryItemMods).values({
              targetInventoryId: insertedInv.id,
              modInventoryId: modInv.id,
            });
          }
        }
      }

      // Copy DR from bestiary
      await copyBestiaryDrToCharacter(newChar.id, entry.dr);

      // Copy abilities as character traits
      await copyBestiaryAbilitiesToTraits(newChar.id, entry.abilities);

      // Add to session if requested
      if (sessionId) {
        await db.insert(sessionParticipants).values({
          sessionId: parseInt(sessionId, 10),
          characterId: newChar.id,
        });
      }

      res.status(201).json({ characterId: newChar.id, bestiaryEntryId: entry.id });
    }
  } catch (error) {
    console.error('Error instantiating bestiary entry:', error);
    res.status(500).json({ error: 'Failed to instantiate bestiary entry' });
  }
});

// ===== CUSTOM BESTIARY CRUD =====

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100);
}

// Helper to insert all related bestiary data for a custom entry
async function insertBestiaryRelatedData(
  entryId: number,
  body: {
    attributes?: Record<string, number>;
    skills?: { skill: string; rank: number; isTagSkill?: boolean }[];
    dr?: { location: string; drPhysical: number; drEnergy: number; drRadiation: number; drPoison: number }[];
    attacks?: {
      name: string;
      skill: string;
      damage: number;
      damageType: string;
      damageBonus?: number;
      fireRate?: number;
      range: string;
      twoHanded?: boolean;
      qualities?: { quality: string; value?: number }[];
    }[];
    abilities?: { name: string; description: string }[];
    inventory?: { itemId: number; quantity: number; equipped: boolean }[];
  }
) {
  // Attributes
  if (body.attributes && Object.keys(body.attributes).length > 0) {
    await db.insert(bestiaryAttributes).values(
      Object.entries(body.attributes).map(([attribute, value]) => ({
        bestiaryEntryId: entryId,
        attribute,
        value,
      }))
    );
  }

  // Skills
  if (body.skills && body.skills.length > 0) {
    await db.insert(bestiarySkills).values(
      body.skills.map(s => ({
        bestiaryEntryId: entryId,
        skill: s.skill,
        rank: s.rank,
        isTagSkill: s.isTagSkill ?? false,
      }))
    );
  }

  // DR
  if (body.dr && body.dr.length > 0) {
    await db.insert(bestiaryDr).values(
      body.dr.map(d => ({
        bestiaryEntryId: entryId,
        location: d.location,
        drPhysical: d.drPhysical,
        drEnergy: d.drEnergy,
        drRadiation: d.drRadiation,
        drPoison: d.drPoison,
      }))
    );
  }

  // Attacks + qualities
  if (body.attacks && body.attacks.length > 0) {
    for (const attack of body.attacks) {
      const [inserted] = await db.insert(bestiaryAttacks).values({
        bestiaryEntryId: entryId,
        nameKey: attack.name,
        skill: attack.skill,
        damage: attack.damage,
        damageType: attack.damageType as any,
        damageBonus: attack.damageBonus ?? null,
        fireRate: attack.fireRate ?? null,
        range: attack.range as any,
        twoHanded: attack.twoHanded ?? false,
      }).returning();

      if (attack.qualities && attack.qualities.length > 0) {
        await db.insert(bestiaryAttackQualities).values(
          attack.qualities.map(q => ({
            attackId: inserted.id,
            quality: q.quality,
            value: q.value ?? null,
          }))
        );
      }
    }
  }

  // Abilities
  if (body.abilities && body.abilities.length > 0) {
    await db.insert(bestiaryAbilities).values(
      body.abilities.map(a => ({
        bestiaryEntryId: entryId,
        nameKey: a.name,
        descriptionKey: a.description,
      }))
    );
  }

  // Inventory
  if (body.inventory && body.inventory.length > 0) {
    await db.insert(bestiaryInventory).values(
      body.inventory.map(inv => ({
        bestiaryEntryId: entryId,
        itemId: inv.itemId,
        quantity: inv.quantity,
        equipped: inv.equipped,
      }))
    );
  }
}

// Helper to delete all related bestiary data
async function deleteBestiaryRelatedData(entryId: number) {
  // Delete attack qualities first (FK on attacks)
  const attackRows = await db.select({ id: bestiaryAttacks.id }).from(bestiaryAttacks).where(eq(bestiaryAttacks.bestiaryEntryId, entryId));
  for (const a of attackRows) {
    await db.delete(bestiaryAttackQualities).where(eq(bestiaryAttackQualities.attackId, a.id));
  }
  await db.delete(bestiaryAttacks).where(eq(bestiaryAttacks.bestiaryEntryId, entryId));
  await db.delete(bestiaryAttributes).where(eq(bestiaryAttributes.bestiaryEntryId, entryId));
  await db.delete(bestiarySkills).where(eq(bestiarySkills.bestiaryEntryId, entryId));
  await db.delete(bestiaryDr).where(eq(bestiaryDr.bestiaryEntryId, entryId));
  await db.delete(bestiaryAbilities).where(eq(bestiaryAbilities.bestiaryEntryId, entryId));
  await db.delete(bestiaryInventory).where(eq(bestiaryInventory.bestiaryEntryId, entryId));
}

// POST /api/bestiary — Create a custom bestiary entry
router.post('/', async (req, res) => {
  try {
    const body = req.body;

    if (!body.name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const slug = slugify(body.name) + '-custom-' + Date.now();

    const [newEntry] = await db.insert(bestiaryEntries).values({
      slug,
      nameKey: body.name,
      descriptionKey: body.description || null,
      statBlockType: body.statBlockType || 'creature',
      category: body.category || 'human',
      bodyType: body.bodyType || 'humanoid',
      level: body.level ?? 1,
      xpReward: body.xpReward ?? 0,
      hp: body.hp ?? 10,
      defense: body.defense ?? 1,
      initiative: body.initiative ?? 0,
      meleeDamageBonus: body.meleeDamageBonus ?? 0,
      carryCapacity: body.carryCapacity ?? 0,
      maxLuckPoints: body.maxLuckPoints ?? 0,
      wealth: body.wealth ?? null,
      source: 'custom',
      emoji: body.emoji || null,
    }).returning();

    await insertBestiaryRelatedData(newEntry.id, body);

    const fullEntry = await getFullBestiaryEntry(newEntry.id);
    res.status(201).json(fullEntry);
  } catch (error) {
    console.error('Error creating custom bestiary entry:', error);
    res.status(500).json({ error: 'Failed to create bestiary entry' });
  }
});

// PUT /api/bestiary/:id — Update a custom bestiary entry
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const [existing] = await db.select().from(bestiaryEntries).where(eq(bestiaryEntries.id, id));
    if (!existing) {
      return res.status(404).json({ error: 'Bestiary entry not found' });
    }
    if (existing.source !== 'custom') {
      return res.status(403).json({ error: 'Cannot modify core bestiary entries' });
    }

    const body = req.body;

    await db.update(bestiaryEntries).set({
      nameKey: body.name ?? existing.nameKey,
      descriptionKey: body.description !== undefined ? (body.description || null) : existing.descriptionKey,
      statBlockType: body.statBlockType ?? existing.statBlockType,
      category: body.category ?? existing.category,
      bodyType: body.bodyType ?? existing.bodyType,
      level: body.level ?? existing.level,
      xpReward: body.xpReward ?? existing.xpReward,
      hp: body.hp ?? existing.hp,
      defense: body.defense ?? existing.defense,
      initiative: body.initiative ?? existing.initiative,
      meleeDamageBonus: body.meleeDamageBonus ?? existing.meleeDamageBonus,
      carryCapacity: body.carryCapacity ?? existing.carryCapacity,
      maxLuckPoints: body.maxLuckPoints ?? existing.maxLuckPoints,
      wealth: body.wealth !== undefined ? body.wealth : existing.wealth,
      emoji: body.emoji !== undefined ? (body.emoji || null) : existing.emoji,
    }).where(eq(bestiaryEntries.id, id));

    // Replace all related data
    await deleteBestiaryRelatedData(id);
    await insertBestiaryRelatedData(id, body);

    const fullEntry = await getFullBestiaryEntry(id);
    res.json(fullEntry);
  } catch (error) {
    console.error('Error updating custom bestiary entry:', error);
    res.status(500).json({ error: 'Failed to update bestiary entry' });
  }
});

// DELETE /api/bestiary/:id — Delete a custom bestiary entry
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const [existing] = await db.select().from(bestiaryEntries).where(eq(bestiaryEntries.id, id));
    if (!existing) {
      return res.status(404).json({ error: 'Bestiary entry not found' });
    }
    if (existing.source !== 'custom') {
      return res.status(403).json({ error: 'Cannot delete core bestiary entries' });
    }

    await deleteBestiaryRelatedData(id);
    await db.delete(bestiaryEntries).where(eq(bestiaryEntries.id, id));

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting custom bestiary entry:', error);
    res.status(500).json({ error: 'Failed to delete bestiary entry' });
  }
});

export default router;
