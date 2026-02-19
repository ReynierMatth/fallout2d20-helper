/**
 * Diseases data from the official Fallout 2d20 FR rulebook.
 *
 * Diseases are random conditions contracted in the wasteland.
 * Roll d20 to determine which disease is caught.
 * Duration is in "stages" - each stage the disease can worsen or be cured.
 */

export interface Disease {
  d20Roll: number;
  name: string;
  nameKey?: string;
  effectKey: string;    // i18n key for effect description
  duration: number;     // Duration in stages
}

export const diseases: Disease[] = [
  {
    d20Roll: 1,
    name: 'Needles',
    effectKey: 'diseases.needles',
    duration: 1,
    // -10 carry capacity
  },
  {
    d20Roll: 2,
    name: 'Lock Joint',
    effectKey: 'diseases.lockJoint',
    duration: 1,
    // Must spend 1 AP to perform a melee attack
  },
  {
    d20Roll: 3,
    name: 'Heat Flashes',
    effectKey: 'diseases.heatFlashes',
    duration: 3,
    // END tests gain +1 difficulty
  },
  {
    d20Roll: 4,
    name: 'Headache',
    effectKey: 'diseases.headache',
    duration: 4,
    // INT tests gain +1 difficulty
  },
  {
    d20Roll: 5,
    name: 'Swamp Itch',
    effectKey: 'diseases.swampItch',
    duration: 1,
    // AGI tests gain +1 difficulty
  },
  {
    d20Roll: 6,
    name: 'Wobbly Skins',
    effectKey: 'diseases.wobblySkins',
    duration: 1,
    // Must spend 1 AP to perform a ranged attack
  },
  {
    d20Roll: 7,
    name: 'Dysentery',
    effectKey: 'diseases.dysentery',
    duration: 1,
    // Halves hours between thirst stat stages
  },
  {
    d20Roll: 8,
    name: 'Flatulence',
    effectKey: 'diseases.flatulence',
    duration: 1,
    // Must spend twice as many Luck points to get an Effect
  },
  {
    d20Roll: 9,
    name: 'Swamp Gas',
    effectKey: 'diseases.swampGas',
    duration: 1,
    // CHA tests gain +1 difficulty
  },
  {
    d20Roll: 10,
    name: 'Weeping Sores',
    effectKey: 'diseases.weepingSores',
    duration: 3,
    // When taking physical damage, take +1 physical damage at start of next turn. Ignore DR.
  },
  {
    d20Roll: 11,
    name: 'Shaking Hands',
    effectKey: 'diseases.shakingHands',
    duration: 1,
    // Ranged attacks deal 2 CD less damage
  },
  {
    d20Roll: 12,
    name: 'Jittery Limb',
    effectKey: 'diseases.jitteryLimb',
    duration: 4,
    // STR tests gain +1 difficulty
  },
  {
    d20Roll: 13,
    name: 'Dripping Ear',
    effectKey: 'diseases.drippingEar',
    duration: 1,
    // PER tests gain +1 difficulty
  },
  {
    d20Roll: 14,
    name: 'Parasites',
    effectKey: 'diseases.parasites',
    duration: 1,
    // Halves hours between hunger stat stages
  },
  {
    d20Roll: 15,
    name: 'Tarry Lungs',
    effectKey: 'diseases.tarryLungs',
    duration: 4,
    // Take 1 Fatigue. Cannot donate AP to group reserve unless it has 3 or fewer.
  },
  {
    d20Roll: 16,
    name: 'Shell Shock',
    effectKey: 'diseases.shellShock',
    duration: 3,
    // When taking an injury, lose 1 AP from group reserve (if possible)
  },
  {
    d20Roll: 17,
    name: 'Glowing Pustules',
    effectKey: 'diseases.glowingPustules',
    duration: 1,
    // When you take an injury, everyone at Close range takes 1 CD radiation damage
  },
  {
    d20Roll: 18,
    name: 'Rad Worms',
    effectKey: 'diseases.radWorms',
    duration: 1,
    // When taking radiation damage, add +2 to the total
  },
  {
    d20Roll: 19,
    name: 'Bone Worms',
    effectKey: 'diseases.boneWorms',
    duration: 1,
    // Attacks targeting your arms or legs deal +4 CD damage
  },
  {
    d20Roll: 20,
    name: 'Blood Worms',
    effectKey: 'diseases.bloodWorms',
    duration: 1,
    // Attacks targeting you deal +2 CD damage
  },
];
