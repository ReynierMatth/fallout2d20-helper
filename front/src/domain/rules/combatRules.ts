export type ActionType = 'major' | 'minor' | 'free';

export interface CombatAction {
  id: string;
  nameKey: string;
  type: ActionType;
  apCost: number;
  descriptionKey: string;
  requiresWeapon?: boolean;
  requiresTarget?: boolean;
}

export const COMBAT_ACTIONS: CombatAction[] = [
  // MAJOR ACTIONS (2 AP)
  { id: 'attack', nameKey: 'combat.actions.attack', type: 'major', apCost: 2, descriptionKey: 'combat.actions.attackDesc', requiresWeapon: true, requiresTarget: true },
  { id: 'sprint', nameKey: 'combat.actions.sprint', type: 'major', apCost: 2, descriptionKey: 'combat.actions.sprintDesc' },
  { id: 'defend', nameKey: 'combat.actions.defend', type: 'major', apCost: 2, descriptionKey: 'combat.actions.defendDesc' },
  { id: 'firstAid', nameKey: 'combat.actions.firstAid', type: 'major', apCost: 2, descriptionKey: 'combat.actions.firstAidDesc', requiresTarget: true },
  { id: 'rally', nameKey: 'combat.actions.rally', type: 'major', apCost: 2, descriptionKey: 'combat.actions.rallyDesc' },
  { id: 'commandRobot', nameKey: 'combat.actions.commandRobot', type: 'major', apCost: 2, descriptionKey: 'combat.actions.commandRobotDesc' },
  { id: 'passItem', nameKey: 'combat.actions.passItem', type: 'major', apCost: 2, descriptionKey: 'combat.actions.passItemDesc', requiresTarget: true },
  // MINOR ACTIONS (1 AP)
  { id: 'aim', nameKey: 'combat.actions.aim', type: 'minor', apCost: 1, descriptionKey: 'combat.actions.aimDesc' },
  { id: 'move', nameKey: 'combat.actions.move', type: 'minor', apCost: 1, descriptionKey: 'combat.actions.moveDesc' },
  { id: 'reload', nameKey: 'combat.actions.reload', type: 'minor', apCost: 1, descriptionKey: 'combat.actions.reloadDesc', requiresWeapon: true },
  { id: 'drawWeapon', nameKey: 'combat.actions.drawWeapon', type: 'minor', apCost: 1, descriptionKey: 'combat.actions.drawWeaponDesc' },
  { id: 'interact', nameKey: 'combat.actions.interact', type: 'minor', apCost: 1, descriptionKey: 'combat.actions.interactDesc' },
  { id: 'standUp', nameKey: 'combat.actions.standUp', type: 'minor', apCost: 1, descriptionKey: 'combat.actions.standUpDesc' },
  { id: 'crouch', nameKey: 'combat.actions.crouch', type: 'minor', apCost: 1, descriptionKey: 'combat.actions.crouchDesc' },
  // FREE ACTIONS (0 AP)
  { id: 'dropItem', nameKey: 'combat.actions.dropItem', type: 'free', apCost: 0, descriptionKey: 'combat.actions.dropItemDesc' },
  { id: 'speak', nameKey: 'combat.actions.speak', type: 'free', apCost: 0, descriptionKey: 'combat.actions.speakDesc' },
  { id: 'dropProne', nameKey: 'combat.actions.dropProne', type: 'free', apCost: 0, descriptionKey: 'combat.actions.dropProneDesc' },
];

export type CombatPhase = 'preparation' | 'active' | 'ended';

export interface CombatState {
  phase: CombatPhase;
  round: number;
  currentTurnIndex: number;
  combatantIds: string[];
}

export function getActionsByType(type: ActionType): CombatAction[] {
  return COMBAT_ACTIONS.filter((action) => action.type === type);
}

export function getMajorActions(): CombatAction[] {
  return getActionsByType('major');
}

export function getMinorActions(): CombatAction[] {
  return getActionsByType('minor');
}

export function getFreeActions(): CombatAction[] {
  return getActionsByType('free');
}

export function canPerformAction(action: CombatAction, currentAP: number): boolean {
  return currentAP >= action.apCost;
}

export function rollInitiative(modifier: number = 0): number {
  const roll = Math.floor(Math.random() * 20) + 1;
  return roll + modifier;
}

export function createCombatState(): CombatState {
  return { phase: 'preparation', round: 0, currentTurnIndex: 0, combatantIds: [] };
}
