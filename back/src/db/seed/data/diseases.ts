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
    nameKey: 'diseases.names.needles',
    effectKey: 'diseases.needles',
    duration: 1,
  },
  {
    d20Roll: 2,
    name: 'Lock Joint',
    nameKey: 'diseases.names.lockJoint',
    effectKey: 'diseases.lockJoint',
    duration: 1,
  },
  {
    d20Roll: 3,
    name: 'Heat Flashes',
    nameKey: 'diseases.names.heatFlashes',
    effectKey: 'diseases.heatFlashes',
    duration: 3,
  },
  {
    d20Roll: 4,
    name: 'Headache',
    nameKey: 'diseases.names.headache',
    effectKey: 'diseases.headache',
    duration: 4,
  },
  {
    d20Roll: 5,
    name: 'Swamp Itch',
    nameKey: 'diseases.names.swampItch',
    effectKey: 'diseases.swampItch',
    duration: 1,
  },
  {
    d20Roll: 6,
    name: 'Wobbly Skins',
    nameKey: 'diseases.names.wobblySkins',
    effectKey: 'diseases.wobblySkins',
    duration: 1,
  },
  {
    d20Roll: 7,
    name: 'Dysentery',
    nameKey: 'diseases.names.dysentery',
    effectKey: 'diseases.dysentery',
    duration: 1,
  },
  {
    d20Roll: 8,
    name: 'Flatulence',
    nameKey: 'diseases.names.flatulence',
    effectKey: 'diseases.flatulence',
    duration: 1,
  },
  {
    d20Roll: 9,
    name: 'Swamp Gas',
    nameKey: 'diseases.names.swampGas',
    effectKey: 'diseases.swampGas',
    duration: 1,
  },
  {
    d20Roll: 10,
    name: 'Weeping Sores',
    nameKey: 'diseases.names.weepingSores',
    effectKey: 'diseases.weepingSores',
    duration: 3,
  },
  {
    d20Roll: 11,
    name: 'Shaking Hands',
    nameKey: 'diseases.names.shakingHands',
    effectKey: 'diseases.shakingHands',
    duration: 1,
  },
  {
    d20Roll: 12,
    name: 'Jittery Limb',
    nameKey: 'diseases.names.jitteryLimb',
    effectKey: 'diseases.jitteryLimb',
    duration: 4,
  },
  {
    d20Roll: 13,
    name: 'Dripping Ear',
    nameKey: 'diseases.names.drippingEar',
    effectKey: 'diseases.drippingEar',
    duration: 1,
  },
  {
    d20Roll: 14,
    name: 'Parasites',
    nameKey: 'diseases.names.parasites',
    effectKey: 'diseases.parasites',
    duration: 1,
  },
  {
    d20Roll: 15,
    name: 'Tarry Lungs',
    nameKey: 'diseases.names.tarryLungs',
    effectKey: 'diseases.tarryLungs',
    duration: 4,
  },
  {
    d20Roll: 16,
    name: 'Shell Shock',
    nameKey: 'diseases.names.shellShock',
    effectKey: 'diseases.shellShock',
    duration: 3,
  },
  {
    d20Roll: 17,
    name: 'Glowing Pustules',
    nameKey: 'diseases.names.glowingPustules',
    effectKey: 'diseases.glowingPustules',
    duration: 1,
  },
  {
    d20Roll: 18,
    name: 'Rad Worms',
    nameKey: 'diseases.names.radWorms',
    effectKey: 'diseases.radWorms',
    duration: 1,
  },
  {
    d20Roll: 19,
    name: 'Bone Worms',
    nameKey: 'diseases.names.boneWorms',
    effectKey: 'diseases.boneWorms',
    duration: 1,
  },
  {
    d20Roll: 20,
    name: 'Blood Worms',
    nameKey: 'diseases.names.bloodWorms',
    effectKey: 'diseases.bloodWorms',
    duration: 1,
  },
];
