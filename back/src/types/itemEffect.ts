/**
 * Structured effect for items (food, chems, general goods, syringer ammo).
 * Stored as JSONB in the database.
 * Replaces free-text effectKey with machine-readable data for automatic stat calculation.
 */
export interface ItemEffect {
  // === Healing ===
  /** HP healed (instant) */
  hpHealed?: number;
  /** Radiation damage healed */
  radsHealed?: number;

  // === Action Points ===
  /** Bonus AP for this encounter/scene */
  apBonus?: number;

  // === Temporary SPECIAL bonuses ===
  specialBonus?: {
    strength?: number;
    perception?: number;
    endurance?: number;
    charisma?: number;
    intelligence?: number;
    agility?: number;
    luck?: number;
  };

  // === Temporary skill bonuses ===
  skillBonus?: {
    athletics?: number;
    barter?: number;
    bigGuns?: number;
    energyWeapons?: number;
    explosives?: number;
    lockpick?: number;
    medicine?: number;
    meleeWeapons?: number;
    pilot?: number;
    repair?: number;
    science?: number;
    smallGuns?: number;
    sneak?: number;
    speech?: number;
    survival?: number;
    throwing?: number;
    unarmed?: number;
  };

  // === Damage Resistance bonuses ===
  drBonus?: {
    physical?: number;
    energy?: number;
    radiation?: number;
    poison?: number;
  };

  // === Conditions ===
  /** Conditions added to target */
  addCondition?: string[];
  /** Conditions removed from user */
  removeCondition?: string[];

  // === Immunities ===
  /** Grants radiation immunity */
  radiationImmunity?: boolean;

  // === Damage / Malus ===
  /** Radiation damage inflicted on user */
  radiationDamage?: number;
  /** HP damage inflicted on user */
  hpDamage?: number;

  // === Addiction ===
  /** Has addiction risk */
  addictionRisk?: boolean;
  /** Difficulty of addiction check */
  addictionDC?: number;

  // === Duration ===
  duration?: 'instant' | 'brief' | 'lasting' | 'permanent';

  // === Combat bonuses ===
  /** Bonus Combat Dice to melee damage */
  meleeDamageBonus?: number;
  /** Bonus Combat Dice to all damage */
  damageBonus?: number;
  /** Bonus to critical hit range (lowers threshold) */
  critBonus?: number;

  // === Max HP bonus ===
  /** Temporary max HP bonus */
  maxHpBonus?: number;

  // === Carry capacity ===
  /** Bonus to carry capacity */
  carryCapacityBonus?: number;

  // === Difficulty modifiers ===
  /** Reduce difficulty of a specific skill check */
  difficultyReduction?: {
    skill?: string;
    amount: number;
  };

  // === Free text ===
  /** i18n key for complementary text description (for effects not fully modelable) */
  descriptionKey?: string;
}
