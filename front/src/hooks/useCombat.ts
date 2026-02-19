import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Character, Combatant, Condition } from '../data/characters';
import { characterToCombatant } from '../data/characters';
import { rollInitiative, createCombatState, type CombatState } from '../data/combatRules';

const COMBAT_STATE_KEY = 'f2d20-combat-state';
const COMBATANTS_KEY = 'f2d20-combatants';

export interface UseCombatReturn {
  // State
  combatState: CombatState;
  combatants: Combatant[];
  currentCombatant: Combatant | null;
  isInCombat: boolean;
  isPreparing: boolean;

  // Preparation
  addCombatant: (character: Character) => void;
  addQuickCombatant: (name: string, hp: number, defense?: number, initiative?: number) => void;
  removeCombatant: (characterId: string) => void;
  clearCombatants: () => void;

  // Initiative
  rollAllInitiatives: () => void;
  setInitiative: (characterId: string, value: number) => void;
  sortByInitiative: () => void;

  // Combat flow
  startCombat: () => void;
  endCombat: () => void;
  nextTurn: () => void;
  previousTurn: () => void;

  // Combatant actions
  updateCombatantHp: (characterId: string, newHp: number) => void;
  damageCombatant: (characterId: string, damage: number) => void;
  healCombatant: (characterId: string, healing: number) => void;
  spendAP: (characterId: string, amount: number) => void;
  resetAP: (characterId: string) => void;
  setCombatantStatus: (characterId: string, status: Combatant['status']) => void;
  addCondition: (characterId: string, condition: Condition) => void;
  removeCondition: (characterId: string, condition: Condition) => void;
}

export function useCombat(): UseCombatReturn {
  const [combatState, setCombatState] = useLocalStorage<CombatState>(
    COMBAT_STATE_KEY,
    createCombatState()
  );
  const [combatants, setCombatants] = useLocalStorage<Combatant[]>(COMBATANTS_KEY, []);

  // Derived state
  const isInCombat = combatState.phase === 'active';
  const isPreparing = combatState.phase === 'preparation';

  const currentCombatant = useMemo(() => {
    if (!isInCombat || combatants.length === 0) return null;
    const currentId = combatState.combatantIds[combatState.currentTurnIndex];
    return combatants.find((c) => c.characterId === currentId) || null;
  }, [isInCombat, combatants, combatState.combatantIds, combatState.currentTurnIndex]);

  // ===== PREPARATION =====

  const addCombatant = useCallback(
    (character: Character) => {
      setCombatants((prev) => {
        // Don't add duplicates
        if (prev.some((c) => c.characterId === character.id)) {
          return prev;
        }
        const combatant = characterToCombatant(character);
        return [...prev, combatant];
      });
    },
    [setCombatants]
  );

  const addQuickCombatant = useCallback(
    (name: string, hp: number, defense: number = 1, initiative: number = 10) => {
      const combatant: Combatant = {
        characterId: crypto.randomUUID(),
        name,
        type: 'NPC',
        maxHp: hp,
        currentHp: hp,
        defense,
        initiative,
        meleeDamageBonus: 0,
        turnOrder: 0,
        currentAP: 2,
        maxAP: 2,
        status: 'active',
        conditions: [],
        equippedWeapons: [],
        tagSkills: [],
      };
      setCombatants((prev) => [...prev, combatant]);
    },
    [setCombatants]
  );

  const removeCombatant = useCallback(
    (characterId: string) => {
      setCombatants((prev) => prev.filter((c) => c.characterId !== characterId));
      setCombatState((prev) => ({
        ...prev,
        combatantIds: prev.combatantIds.filter((id) => id !== characterId),
      }));
    },
    [setCombatants, setCombatState]
  );

  const clearCombatants = useCallback(() => {
    setCombatants([]);
    setCombatState(createCombatState());
  }, [setCombatants, setCombatState]);

  // ===== INITIATIVE =====

  const rollAllInitiatives = useCallback(() => {
    setCombatants((prev) =>
      prev.map((c) => ({
        ...c,
        turnOrder: rollInitiative(c.initiative),
      }))
    );
  }, [setCombatants]);

  const setInitiative = useCallback(
    (characterId: string, value: number) => {
      setCombatants((prev) =>
        prev.map((c) =>
          c.characterId === characterId ? { ...c, turnOrder: value } : c
        )
      );
    },
    [setCombatants]
  );

  const sortByInitiative = useCallback(() => {
    const sortedIds = [...combatants]
      .sort((a, b) => b.turnOrder - a.turnOrder)
      .map((c) => c.characterId);

    setCombatState((prev) => ({
      ...prev,
      combatantIds: sortedIds,
    }));
  }, [combatants, setCombatState]);

  // ===== COMBAT FLOW =====

  const startCombat = useCallback(() => {
    // Sort by initiative before starting
    const sortedIds = [...combatants]
      .sort((a, b) => b.turnOrder - a.turnOrder)
      .map((c) => c.characterId);

    setCombatState({
      phase: 'active',
      round: 1,
      currentTurnIndex: 0,
      combatantIds: sortedIds,
    });

    // Reset AP for all combatants
    setCombatants((prev) =>
      prev.map((c) => ({ ...c, currentAP: c.maxAP }))
    );
  }, [combatants, setCombatState, setCombatants]);

  const endCombat = useCallback(() => {
    setCombatState({
      phase: 'ended',
      round: combatState.round,
      currentTurnIndex: 0,
      combatantIds: [],
    });
  }, [combatState.round, setCombatState]);

  const nextTurn = useCallback(() => {
    setCombatState((prev) => {
      const nextIndex = prev.currentTurnIndex + 1;

      // If we've gone through all combatants, start a new round
      if (nextIndex >= prev.combatantIds.length) {
        return {
          ...prev,
          round: prev.round + 1,
          currentTurnIndex: 0,
        };
      }

      return {
        ...prev,
        currentTurnIndex: nextIndex,
      };
    });

    // Reset AP for the next combatant
    setCombatants((prev) => {
      const nextIndex =
        (combatState.currentTurnIndex + 1) % combatState.combatantIds.length;
      const nextId = combatState.combatantIds[nextIndex];

      return prev.map((c) =>
        c.characterId === nextId ? { ...c, currentAP: c.maxAP } : c
      );
    });
  }, [combatState, setCombatState, setCombatants]);

  const previousTurn = useCallback(() => {
    setCombatState((prev) => {
      if (prev.currentTurnIndex === 0) {
        // Go back to previous round if possible
        if (prev.round > 1) {
          return {
            ...prev,
            round: prev.round - 1,
            currentTurnIndex: prev.combatantIds.length - 1,
          };
        }
        return prev;
      }

      return {
        ...prev,
        currentTurnIndex: prev.currentTurnIndex - 1,
      };
    });
  }, [setCombatState]);

  // ===== COMBATANT ACTIONS =====

  const updateCombatantHp = useCallback(
    (characterId: string, newHp: number) => {
      setCombatants((prev) =>
        prev.map((c) => {
          if (c.characterId !== characterId) return c;

          const clampedHp = Math.max(0, Math.min(newHp, c.maxHp));
          const status: Combatant['status'] =
            clampedHp <= 0 ? 'unconscious' : c.status === 'unconscious' ? 'active' : c.status;

          return { ...c, currentHp: clampedHp, status };
        })
      );
    },
    [setCombatants]
  );

  const damageCombatant = useCallback(
    (characterId: string, damage: number) => {
      setCombatants((prev) =>
        prev.map((c) => {
          if (c.characterId !== characterId) return c;

          const newHp = Math.max(0, c.currentHp - damage);
          const status: Combatant['status'] = newHp <= 0 ? 'unconscious' : c.status;

          return { ...c, currentHp: newHp, status };
        })
      );
    },
    [setCombatants]
  );

  const healCombatant = useCallback(
    (characterId: string, healing: number) => {
      setCombatants((prev) =>
        prev.map((c) => {
          if (c.characterId !== characterId) return c;

          const newHp = Math.min(c.maxHp, c.currentHp + healing);
          const status: Combatant['status'] =
            c.status === 'unconscious' && newHp > 0 ? 'active' : c.status;

          return { ...c, currentHp: newHp, status };
        })
      );
    },
    [setCombatants]
  );

  const spendAP = useCallback(
    (characterId: string, amount: number) => {
      setCombatants((prev) =>
        prev.map((c) =>
          c.characterId === characterId
            ? { ...c, currentAP: Math.max(0, c.currentAP - amount) }
            : c
        )
      );
    },
    [setCombatants]
  );

  const resetAP = useCallback(
    (characterId: string) => {
      setCombatants((prev) =>
        prev.map((c) =>
          c.characterId === characterId ? { ...c, currentAP: c.maxAP } : c
        )
      );
    },
    [setCombatants]
  );

  const setCombatantStatus = useCallback(
    (characterId: string, status: Combatant['status']) => {
      setCombatants((prev) =>
        prev.map((c) =>
          c.characterId === characterId ? { ...c, status } : c
        )
      );
    },
    [setCombatants]
  );

  const addCondition = useCallback(
    (characterId: string, condition: Condition) => {
      setCombatants((prev) =>
        prev.map((c) => {
          if (c.characterId !== characterId) return c;
          if (c.conditions.includes(condition)) return c;
          return { ...c, conditions: [...c.conditions, condition] };
        })
      );
    },
    [setCombatants]
  );

  const removeCondition = useCallback(
    (characterId: string, condition: Condition) => {
      setCombatants((prev) =>
        prev.map((c) =>
          c.characterId === characterId
            ? { ...c, conditions: c.conditions.filter((cond) => cond !== condition) }
            : c
        )
      );
    },
    [setCombatants]
  );

  return {
    combatState,
    combatants,
    currentCombatant,
    isInCombat,
    isPreparing,
    addCombatant,
    addQuickCombatant,
    removeCombatant,
    clearCombatants,
    rollAllInitiatives,
    setInitiative,
    sortByInitiative,
    startCombat,
    endCombat,
    nextTurn,
    previousTurn,
    updateCombatantHp,
    damageCombatant,
    healCombatant,
    spendAP,
    resetAP,
    setCombatantStatus,
    addCondition,
    removeCondition,
  };
}
