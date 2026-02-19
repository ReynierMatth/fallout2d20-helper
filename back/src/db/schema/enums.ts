import { pgEnum } from 'drizzle-orm/pg-core';

// ===== DAMAGE & COMBAT =====
export const damageTypeEnum = pgEnum('damage_type', ['physical', 'energy', 'radiation', 'poison']);

export const weaponRangeEnum = pgEnum('weapon_range', ['close', 'medium', 'long', 'extreme']);

export const weaponSkillEnum = pgEnum('weapon_skill', [
  'smallGuns', 'bigGuns', 'energyWeapons', 'meleeWeapons', 'unarmed', 'throwing', 'explosives'
]);

export const weaponQualityEnum = pgEnum('weapon_quality', [
  'accurate', 'blast', 'breaking', 'burst', 'closeQuarters', 'concealed', 'debilitating',
  'gatling', 'inaccurate', 'mine', 'nightVision', 'parry', 'persistent',
  'piercing', 'radioactive', 'reliable', 'recon', 'spread', 'stun',
  'thrown', 'twoHanded', 'unreliable', 'vicious', 'silent'
]);

export const ammoTypeEnum = pgEnum('ammo_type', [
  '10mm', '.308', '.38', '.44', '.45', '.50', '5mm', '5.56mm', '2mmEC',
  'shotgunShell', 'fusionCell', 'plasmaCartridge', 'flamerFuel', 'fusionCore',
  'gammaRound', 'missile', 'miniNuke', 'railwaySpike', 'syringerAmmo', 'flare', 'cannonball', 'none'
]);

// ===== BODY & EQUIPMENT =====
export const bodyLocationEnum = pgEnum('body_location', [
  'head', 'torso', 'armLeft', 'armRight', 'legLeft', 'legRight', 'all'
]);

export const armorTypeEnum = pgEnum('armor_type', ['armor', 'powerArmor']);

export const powerArmorSetEnum = pgEnum('power_armor_set', [
  'frame', 'raiderPower', 't45', 't51', 't60', 'x01'
]);

export const robotLocationEnum = pgEnum('robot_location', ['all', 'optic', 'body', 'arm', 'thruster']);

// ===== ITEMS =====
export const itemTypeEnum = pgEnum('item_type', [
  'weapon', 'armor', 'powerArmor', 'robotArmor', 'clothing',
  'ammunition', 'syringerAmmo', 'chem', 'food',
  'generalGood', 'oddity', 'magazine'
]);

export const foodTypeEnum = pgEnum('food_type', ['food', 'drink']);

export const chemDurationEnum = pgEnum('chem_duration', ['instant', 'brief', 'lasting']);

export const generalGoodTypeEnum = pgEnum('general_good_type', ['Tool/Utility', 'Materials']);

// ===== CHARACTERS =====
export const specialAttributeEnum = pgEnum('special_attribute', [
  'strength', 'perception', 'endurance', 'charisma', 'intelligence', 'agility', 'luck'
]);

export const skillNameEnum = pgEnum('skill_name', [
  'athletics', 'barter', 'bigGuns', 'energyWeapons', 'explosives', 'lockpick',
  'medicine', 'meleeWeapons', 'pilot', 'repair', 'science', 'smallGuns',
  'sneak', 'speech', 'survival', 'throwing', 'unarmed'
]);

export const originIdEnum = pgEnum('origin_id', [
  'brotherhood', 'ghoul', 'superMutant', 'misterHandy', 'survivor', 'vaultDweller'
]);

export const survivorTraitIdEnum = pgEnum('survivor_trait_id', [
  'gifted', 'educated', 'smallFrame', 'heavyHanded', 'fastShot'
]);

export const characterTypeEnum = pgEnum('character_type', ['pc', 'npc']);

export const combatantStatusEnum = pgEnum('combatant_status', ['active', 'unconscious', 'dead', 'fled']);

export const conditionEnum = pgEnum('condition_type', [
  'stunned', 'prone', 'blinded', 'deafened', 'poisoned', 'irradiated',
  'fatigued', 'crippled', 'addicted', 'unconscious'
]);

// ===== EQUIPMENT =====
export const equipmentCategoryEnum = pgEnum('equipment_category', [
  'weapon', 'armor', 'clothing', 'ammo', 'chem', 'food', 'misc', 'caps'
]);

export const locationChoiceEnum = pgEnum('location_choice', ['left', 'right', 'choice']);

// ===== SESSIONS =====
export const sessionStatusEnum = pgEnum('session_status', ['active', 'paused', 'completed']);
