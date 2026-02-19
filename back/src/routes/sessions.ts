import { Router } from 'express';
import { db } from '../db/index';
import { eq, and } from 'drizzle-orm';
import {
  sessions,
  sessionParticipants,
  characters,
  characterSpecial,
  characterSkills,
  characterTagSkills,
  characterConditions,
} from '../db/schema/index';

const router = Router();

// Helper to get participant with character details
async function getParticipantWithCharacter(participantId: number) {
  const [participant] = await db
    .select({
      id: sessionParticipants.id,
      sessionId: sessionParticipants.sessionId,
      characterId: sessionParticipants.characterId,
      turnOrder: sessionParticipants.turnOrder,
      combatStatus: sessionParticipants.combatStatus,
      // Character details
      characterName: characters.name,
      characterType: characters.type,
      characterLevel: characters.level,
      originId: characters.originId,
      maxHp: characters.maxHp,
      currentHp: characters.currentHp,
      defense: characters.defense,
      initiative: characters.initiative,
      radiationDamage: characters.radiationDamage,
      maxLuckPoints: characters.maxLuckPoints,
      currentLuckPoints: characters.currentLuckPoints,
    })
    .from(sessionParticipants)
    .innerJoin(characters, eq(sessionParticipants.characterId, characters.id))
    .where(eq(sessionParticipants.id, participantId));

  if (!participant) return null;

  // Get conditions
  const conditions = await db
    .select({ condition: characterConditions.condition })
    .from(characterConditions)
    .where(eq(characterConditions.characterId, participant.characterId));

  // Get SPECIAL stats
  const specialRows = await db
    .select({ attribute: characterSpecial.attribute, value: characterSpecial.value })
    .from(characterSpecial)
    .where(eq(characterSpecial.characterId, participant.characterId));

  const special: Record<string, number> = {};
  for (const row of specialRows) {
    special[row.attribute] = row.value;
  }

  return {
    id: participant.id,
    sessionId: participant.sessionId,
    characterId: participant.characterId,
    turnOrder: participant.turnOrder,
    combatStatus: participant.combatStatus,
    character: {
      id: participant.characterId,
      name: participant.characterName,
      type: participant.characterType,
      level: participant.characterLevel,
      originId: participant.originId,
      maxHp: participant.maxHp,
      currentHp: participant.currentHp,
      defense: participant.defense,
      initiative: participant.initiative,
      radiationDamage: participant.radiationDamage,
      maxLuckPoints: participant.maxLuckPoints,
      currentLuckPoints: participant.currentLuckPoints,
      special,
      conditions: conditions.map(c => c.condition),
    },
  };
}

// Helper to get full session with participants
async function getFullSession(sessionId: number) {
  const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId));
  if (!session) return null;

  const participantRows = await db
    .select({
      id: sessionParticipants.id,
      sessionId: sessionParticipants.sessionId,
      characterId: sessionParticipants.characterId,
      turnOrder: sessionParticipants.turnOrder,
      combatStatus: sessionParticipants.combatStatus,
      // Character details
      characterName: characters.name,
      characterType: characters.type,
      characterLevel: characters.level,
      originId: characters.originId,
      maxHp: characters.maxHp,
      currentHp: characters.currentHp,
      defense: characters.defense,
      initiative: characters.initiative,
      radiationDamage: characters.radiationDamage,
      maxLuckPoints: characters.maxLuckPoints,
      currentLuckPoints: characters.currentLuckPoints,
    })
    .from(sessionParticipants)
    .innerJoin(characters, eq(sessionParticipants.characterId, characters.id))
    .where(eq(sessionParticipants.sessionId, sessionId));

  // Get conditions and SPECIAL for all characters in this session
  const characterIds = participantRows.map(p => p.characterId);

  // Fetch all conditions for all characters
  const conditionsByCharacter: Record<number, string[]> = {};
  const specialByCharacter: Record<number, Record<string, number>> = {};

  for (const charId of characterIds) {
    // Conditions
    const conditions = await db
      .select({ condition: characterConditions.condition })
      .from(characterConditions)
      .where(eq(characterConditions.characterId, charId));
    conditionsByCharacter[charId] = conditions.map(c => c.condition);

    // SPECIAL
    const specialRows = await db
      .select({ attribute: characterSpecial.attribute, value: characterSpecial.value })
      .from(characterSpecial)
      .where(eq(characterSpecial.characterId, charId));
    specialByCharacter[charId] = {};
    for (const row of specialRows) {
      specialByCharacter[charId][row.attribute] = row.value;
    }
  }

  const participants = participantRows.map(p => ({
    id: p.id,
    sessionId: p.sessionId,
    characterId: p.characterId,
    turnOrder: p.turnOrder,
    combatStatus: p.combatStatus,
    character: {
      id: p.characterId,
      name: p.characterName,
      type: p.characterType,
      level: p.characterLevel,
      originId: p.originId,
      maxHp: p.maxHp,
      currentHp: p.currentHp,
      defense: p.defense,
      initiative: p.initiative,
      radiationDamage: p.radiationDamage,
      maxLuckPoints: p.maxLuckPoints,
      currentLuckPoints: p.currentLuckPoints,
      special: specialByCharacter[p.characterId] || {},
      conditions: conditionsByCharacter[p.characterId] || [],
    },
  }));

  return {
    ...session,
    participants,
  };
}

// ===== SESSION CRUD =====

// GET all sessions
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;

    let results;
    if (status && ['active', 'paused', 'completed'].includes(status as string)) {
      results = await db
        .select()
        .from(sessions)
        .where(eq(sessions.status, status as any));
    } else {
      results = await db.select().from(sessions);
    }

    // Optionally fetch with participants
    if (req.query.full === 'true') {
      const fullSessions = await Promise.all(
        results.map(s => getFullSession(s.id))
      );
      return res.json(fullSessions);
    }

    res.json(results);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// GET single session
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const session = await getFullSession(id);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// POST create session
router.post('/', async (req, res) => {
  try {
    const { name, description, maxGroupAP } = req.body;

    const [newSession] = await db
      .insert(sessions)
      .values({
        name,
        description,
        maxGroupAP: maxGroupAP ?? 6,
      })
      .returning();

    res.status(201).json(newSession);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// PUT update session
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, status, groupAP, maxGroupAP, gmAP } = req.body;

    const [existing] = await db.select().from(sessions).where(eq(sessions.id, id));
    if (!existing) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await db
      .update(sessions)
      .set({
        name: name ?? existing.name,
        description: description ?? existing.description,
        status: status ?? existing.status,
        groupAP: groupAP ?? existing.groupAP,
        maxGroupAP: maxGroupAP ?? existing.maxGroupAP,
        gmAP: gmAP ?? existing.gmAP,
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, id));

    const updated = await getFullSession(id);
    res.json(updated);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// DELETE session
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [existing] = await db.select().from(sessions).where(eq(sessions.id, id));
    if (!existing) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await db.delete(sessions).where(eq(sessions.id, id));
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// ===== PARTICIPANTS =====

// POST add participant (existing character)
router.post('/:id/participants', async (req, res) => {
  try {
    const sessionId = Number(req.params.id);
    const { characterId } = req.body;

    // Check session exists
    const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId));
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check character exists
    const [character] = await db.select().from(characters).where(eq(characters.id, characterId));
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    // Check not already in session
    const [existing] = await db
      .select()
      .from(sessionParticipants)
      .where(
        and(
          eq(sessionParticipants.sessionId, sessionId),
          eq(sessionParticipants.characterId, characterId)
        )
      );
    if (existing) {
      return res.status(400).json({ error: 'Character already in session' });
    }

    const [newParticipant] = await db
      .insert(sessionParticipants)
      .values({
        sessionId,
        characterId,
      })
      .returning();

    const participant = await getParticipantWithCharacter(newParticipant.id);
    res.status(201).json(participant);
  } catch (error) {
    console.error('Error adding participant:', error);
    res.status(500).json({ error: 'Failed to add participant' });
  }
});

// POST add quick NPC (creates character then adds as participant)
router.post('/:id/participants/quick', async (req, res) => {
  try {
    const sessionId = Number(req.params.id);
    const { name, level, maxHp, defense, initiative } = req.body;

    // Check session exists
    const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId));
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Create quick NPC character
    const [newCharacter] = await db
      .insert(characters)
      .values({
        name: name || 'Quick NPC',
        type: 'npc',
        level: level ?? 1,
        xp: 0,
        maxHp: maxHp ?? 10,
        currentHp: maxHp ?? 10,
        defense: defense ?? 1,
        initiative: initiative ?? 0,
        meleeDamageBonus: 0,
        carryCapacity: 100,
        maxLuckPoints: 0,
        currentLuckPoints: 0,
        caps: 0,
        radiationDamage: 0,
      })
      .returning();

    // Add default SPECIAL (all 5s)
    const defaultSpecial = ['strength', 'perception', 'endurance', 'charisma', 'intelligence', 'agility', 'luck'];
    await db.insert(characterSpecial).values(
      defaultSpecial.map(attr => ({
        characterId: newCharacter.id,
        attribute: attr as any,
        value: 5,
      }))
    );

    // Add as participant
    const [newParticipant] = await db
      .insert(sessionParticipants)
      .values({
        sessionId,
        characterId: newCharacter.id,
      })
      .returning();

    const participant = await getParticipantWithCharacter(newParticipant.id);
    res.status(201).json(participant);
  } catch (error) {
    console.error('Error adding quick NPC:', error);
    res.status(500).json({ error: 'Failed to add quick NPC' });
  }
});

// DELETE remove participant
router.delete('/:id/participants/:pid', async (req, res) => {
  try {
    const sessionId = Number(req.params.id);
    const participantId = Number(req.params.pid);

    const [existing] = await db
      .select()
      .from(sessionParticipants)
      .where(
        and(
          eq(sessionParticipants.id, participantId),
          eq(sessionParticipants.sessionId, sessionId)
        )
      );

    if (!existing) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    await db.delete(sessionParticipants).where(eq(sessionParticipants.id, participantId));
    res.status(204).send();
  } catch (error) {
    console.error('Error removing participant:', error);
    res.status(500).json({ error: 'Failed to remove participant' });
  }
});

// PUT update participant combat status
router.put('/:id/participants/:pid/combat-status', async (req, res) => {
  try {
    const sessionId = Number(req.params.id);
    const participantId = Number(req.params.pid);
    const { combatStatus } = req.body;

    const [existing] = await db
      .select()
      .from(sessionParticipants)
      .where(
        and(
          eq(sessionParticipants.id, participantId),
          eq(sessionParticipants.sessionId, sessionId)
        )
      );

    if (!existing) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    await db
      .update(sessionParticipants)
      .set({ combatStatus })
      .where(eq(sessionParticipants.id, participantId));

    const participant = await getParticipantWithCharacter(participantId);
    res.json(participant);
  } catch (error) {
    console.error('Error updating combat status:', error);
    res.status(500).json({ error: 'Failed to update combat status' });
  }
});

// PUT set participant initiative
router.put('/:id/participants/:pid/initiative', async (req, res) => {
  try {
    const sessionId = Number(req.params.id);
    const participantId = Number(req.params.pid);
    const { turnOrder } = req.body;

    const [existing] = await db
      .select()
      .from(sessionParticipants)
      .where(
        and(
          eq(sessionParticipants.id, participantId),
          eq(sessionParticipants.sessionId, sessionId)
        )
      );

    if (!existing) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    await db
      .update(sessionParticipants)
      .set({ turnOrder })
      .where(eq(sessionParticipants.id, participantId));

    const participant = await getParticipantWithCharacter(participantId);
    res.json(participant);
  } catch (error) {
    console.error('Error setting initiative:', error);
    res.status(500).json({ error: 'Failed to set initiative' });
  }
});

// ===== COMBAT MANAGEMENT =====

// POST start combat (rolls initiatives)
router.post('/:id/combat/start', async (req, res) => {
  try {
    const sessionId = Number(req.params.id);

    const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId));
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Get all participants with their initiative stats and character type
    const participantRows = await db
      .select({
        id: sessionParticipants.id,
        characterId: sessionParticipants.characterId,
        initiative: characters.initiative,
        characterType: characters.type,
      })
      .from(sessionParticipants)
      .innerJoin(characters, eq(sessionParticipants.characterId, characters.id))
      .where(eq(sessionParticipants.sessionId, sessionId));

    // Set initiative order directly from character initiative stat (no roll in Fallout 2d20)
    for (const p of participantRows) {
      const turnOrder = p.initiative ?? 0;
      await db
        .update(sessionParticipants)
        .set({ turnOrder, combatStatus: 'active' })
        .where(eq(sessionParticipants.id, p.id));
    }

    // Calculate initial AP = number of PCs (not NPCs), max 6
    const pcCount = participantRows.filter(p => p.characterType === 'pc').length;
    const initialAP = Math.min(pcCount, 6);

    // Update session state
    await db
      .update(sessions)
      .set({
        combatActive: true,
        currentRound: 1,
        currentTurnIndex: 0,
        groupAP: initialAP,
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, sessionId));

    const updated = await getFullSession(sessionId);
    res.json(updated);
  } catch (error) {
    console.error('Error starting combat:', error);
    res.status(500).json({ error: 'Failed to start combat' });
  }
});

// POST end combat
router.post('/:id/combat/end', async (req, res) => {
  try {
    const sessionId = Number(req.params.id);

    const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId));
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Clear combat state
    await db
      .update(sessions)
      .set({
        combatActive: false,
        currentRound: 0,
        currentTurnIndex: 0,
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, sessionId));

    // Clear turn orders
    await db
      .update(sessionParticipants)
      .set({ turnOrder: null })
      .where(eq(sessionParticipants.sessionId, sessionId));

    const updated = await getFullSession(sessionId);
    res.json(updated);
  } catch (error) {
    console.error('Error ending combat:', error);
    res.status(500).json({ error: 'Failed to end combat' });
  }
});

// POST next turn
router.post('/:id/combat/next-turn', async (req, res) => {
  try {
    const sessionId = Number(req.params.id);

    const session = await getFullSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (!session.combatActive) {
      return res.status(400).json({ error: 'Combat not active' });
    }

    // Get active participants sorted by initiative
    const activeParticipants = session.participants
      .filter(p => p.combatStatus === 'active' && p.turnOrder !== null)
      .sort((a, b) => (b.turnOrder ?? 0) - (a.turnOrder ?? 0));

    if (activeParticipants.length === 0) {
      return res.status(400).json({ error: 'No active participants' });
    }

    let nextTurnIndex = session.currentTurnIndex + 1;
    let nextRound = session.currentRound;

    // If we've gone through all participants, start new round
    if (nextTurnIndex >= activeParticipants.length) {
      nextTurnIndex = 0;
      nextRound += 1;
    }

    await db
      .update(sessions)
      .set({
        currentTurnIndex: nextTurnIndex,
        currentRound: nextRound,
        groupAP: nextTurnIndex === 0 ? session.maxGroupAP : session.groupAP, // Reset AP on new round
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, sessionId));

    const updated = await getFullSession(sessionId);
    res.json(updated);
  } catch (error) {
    console.error('Error advancing turn:', error);
    res.status(500).json({ error: 'Failed to advance turn' });
  }
});

// POST previous turn
router.post('/:id/combat/prev-turn', async (req, res) => {
  try {
    const sessionId = Number(req.params.id);

    const session = await getFullSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (!session.combatActive) {
      return res.status(400).json({ error: 'Combat not active' });
    }

    const activeParticipants = session.participants
      .filter(p => p.combatStatus === 'active' && p.turnOrder !== null)
      .sort((a, b) => (b.turnOrder ?? 0) - (a.turnOrder ?? 0));

    if (activeParticipants.length === 0) {
      return res.status(400).json({ error: 'No active participants' });
    }

    let prevTurnIndex = session.currentTurnIndex - 1;
    let prevRound = session.currentRound;

    // If we go before first participant, go to previous round (if > 1)
    if (prevTurnIndex < 0) {
      if (prevRound > 1) {
        prevTurnIndex = activeParticipants.length - 1;
        prevRound -= 1;
      } else {
        prevTurnIndex = 0; // Stay at beginning
      }
    }

    await db
      .update(sessions)
      .set({
        currentTurnIndex: prevTurnIndex,
        currentRound: prevRound,
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, sessionId));

    const updated = await getFullSession(sessionId);
    res.json(updated);
  } catch (error) {
    console.error('Error going to previous turn:', error);
    res.status(500).json({ error: 'Failed to go to previous turn' });
  }
});

// ===== GROUP AP =====

// PUT update group AP (players)
router.put('/:id/ap', async (req, res) => {
  try {
    const sessionId = Number(req.params.id);
    const { groupAP, maxGroupAP } = req.body;

    const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId));
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const updates: Record<string, any> = { updatedAt: new Date() };
    if (groupAP !== undefined) updates.groupAP = groupAP;
    if (maxGroupAP !== undefined) updates.maxGroupAP = maxGroupAP;

    await db
      .update(sessions)
      .set(updates)
      .where(eq(sessions.id, sessionId));

    const updated = await getFullSession(sessionId);
    res.json(updated);
  } catch (error) {
    console.error('Error updating AP:', error);
    res.status(500).json({ error: 'Failed to update AP' });
  }
});

// PUT update GM AP
router.put('/:id/gm-ap', async (req, res) => {
  try {
    const sessionId = Number(req.params.id);
    const { gmAP } = req.body;

    const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId));
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await db
      .update(sessions)
      .set({ gmAP: gmAP ?? 0, updatedAt: new Date() })
      .where(eq(sessions.id, sessionId));

    const updated = await getFullSession(sessionId);
    res.json(updated);
  } catch (error) {
    console.error('Error updating GM AP:', error);
    res.status(500).json({ error: 'Failed to update GM AP' });
  }
});

export default router;
