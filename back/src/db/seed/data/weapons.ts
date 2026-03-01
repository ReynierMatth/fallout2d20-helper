import type { Weapon } from './types';

export const weapons: Weapon[] = [
  // ===== ARMES LÉGÈRES (Small Guns) =====
  {
    name: '.44 Pistol', skill: 'smallGuns',
    damage: 6, damageType: 'physical', fireRate: 1, range: 'close',
    qualities: [{ quality: 'vicious' }, { quality: 'closeQuarters' }],
    ammo: '.44', weight: 2, value: 99, rarity: 2,
  },
  {
    name: '10mm Pistol', skill: 'smallGuns',
    damage: 4, damageType: 'physical', fireRate: 2, range: 'close',
    qualities: [{ quality: 'closeQuarters' }, { quality: 'reliable' }],
    ammo: '10mm', weight: 2, value: 50, rarity: 1,
  },
  {
    name: 'Flare Gun', skill: 'smallGuns',
    damage: 3, damageType: 'physical', fireRate: 0, range: 'medium',
    qualities: [{ quality: 'reliable' }],
    ammo: 'flare', weight: 1, value: 50, rarity: 1,
  },
  {
    name: 'Assault Rifle', skill: 'smallGuns',
    damage: 5, damageType: 'physical', fireRate: 2, range: 'medium',
    qualities: [{ quality: 'twoHanded' }],
    ammo: '5.56mm', weight: 6.5, value: 144, rarity: 2,
  },
  {
    name: 'Combat Rifle', skill: 'smallGuns',
    damage: 5, damageType: 'physical', fireRate: 2, range: 'medium',
    qualities: [{ quality: 'twoHanded' }],
    ammo: '.45', weight: 5.5, value: 117, rarity: 2,
  },
  {
    name: 'Gauss Rifle', skill: 'smallGuns',
    damage: 10, damageType: 'physical', fireRate: 1, range: 'long',
    qualities: [{ quality: 'piercing', value: 1 }, { quality: 'twoHanded' }],
    ammo: '2mmEC', weight: 8, value: 228, rarity: 4,
  },
  {
    name: 'Hunting Rifle', skill: 'smallGuns',
    damage: 6, damageType: 'physical', fireRate: 0, range: 'medium',
    qualities: [{ quality: 'piercing', value: 1 }, { quality: 'twoHanded' }],
    ammo: '.308', weight: 5, value: 55, rarity: 2,
  },
  {
    name: 'Submachine Gun', skill: 'smallGuns',
    damage: 3, damageType: 'physical', fireRate: 3, range: 'close',
    qualities: [{ quality: 'burst' }, { quality: 'twoHanded' }, { quality: 'inaccurate' }],
    ammo: '.45', weight: 6, value: 109, rarity: 1,
  },
  {
    name: 'Combat Shotgun', skill: 'smallGuns',
    damage: 5, damageType: 'physical', fireRate: 2, range: 'close',
    qualities: [{ quality: 'spread' }, { quality: 'twoHanded' }, { quality: 'inaccurate' }],
    ammo: 'shotgunShell', weight: 5.5, value: 87, rarity: 2,
  },
  {
    name: 'Double-Barrel Shotgun', skill: 'smallGuns',
    damage: 5, damageType: 'physical', fireRate: 1, range: 'close',
    qualities: [{ quality: 'vicious' }, { quality: 'spread' }, { quality: 'twoHanded' }, { quality: 'inaccurate' }],
    ammo: 'shotgunShell', weight: 4.5, value: 39, rarity: 1,
  },
  {
    name: 'Pipe Bolt-Action', skill: 'smallGuns',
    damage: 5, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'piercing', value: 1 }, { quality: 'unreliable' }],
    ammo: '.38', weight: 1.5, value: 30, rarity: 0,
  },
  {
    name: 'Pipe Gun', skill: 'smallGuns',
    damage: 3, damageType: 'physical', fireRate: 2, range: 'close',
    qualities: [{ quality: 'closeQuarters' }, { quality: 'unreliable' }],
    ammo: '.38', weight: 1, value: 30, rarity: 0,
  },
  {
    name: 'Pipe Revolver', skill: 'smallGuns',
    damage: 4, damageType: 'physical', fireRate: 1, range: 'close',
    qualities: [{ quality: 'closeQuarters' }, { quality: 'unreliable' }],
    ammo: '.38', weight: 2, value: 25, rarity: 0,
  },
  {
    name: 'Railway Rifle', skill: 'smallGuns',
    damage: 10, damageType: 'physical', fireRate: 0, range: 'medium',
    qualities: [{ quality: 'breaking' }, { quality: 'twoHanded' }, { quality: 'unreliable' }, { quality: 'debilitating' }],
    ammo: 'railwaySpike', weight: 7, value: 290, rarity: 4,
  },
  {
    name: 'Syringer', skill: 'smallGuns',
    damage: 3, damageType: 'physical', fireRate: 0, range: 'medium',
    qualities: [{ quality: 'twoHanded' }],
    ammo: 'syringerAmmo', weight: 3, value: 132, rarity: 2,
  },

  // ===== ARMES À ÉNERGIE (Energy Weapons) =====
  {
    name: 'Institute Laser', skill: 'energyWeapons',
    damage: 3, damageType: 'energy', fireRate: 3, range: 'close',
    qualities: [{ quality: 'burst' }, { quality: 'closeQuarters' }, { quality: 'inaccurate' }],
    ammo: 'fusionCell', weight: 2, value: 50, rarity: 2,
  },
  {
    name: 'Laser Musket', skill: 'energyWeapons',
    damage: 5, damageType: 'energy', fireRate: 0, range: 'medium',
    qualities: [{ quality: 'piercing', value: 1 }, { quality: 'twoHanded' }],
    ammo: 'fusionCell', weight: 6.5, value: 57, rarity: 1,
  },
  {
    name: 'Laser Pistol', skill: 'energyWeapons',
    damage: 4, damageType: 'energy', fireRate: 2, range: 'close',
    qualities: [{ quality: 'piercing', value: 1 }, { quality: 'closeQuarters' }],
    ammo: 'fusionCell', weight: 2, value: 69, rarity: 2,
  },
  {
    name: 'Plasma Gun', skill: 'energyWeapons',
    damage: 6, damageType: 'energy', fireRate: 1, range: 'close',
    // Damage type is actually Physical/Energy (dual), modeled as energy
    qualities: [{ quality: 'closeQuarters' }],
    ammo: 'plasmaCartridge', weight: 2, value: 123, rarity: 3,
  },
  {
    name: 'Gamma Gun', skill: 'energyWeapons',
    damage: 3, damageType: 'radiation', fireRate: 1, range: 'medium',
    qualities: [{ quality: 'stun' }, { quality: 'piercing', value: 1 }, { quality: 'inaccurate' }, { quality: 'blast' }],
    ammo: 'gammaRound', weight: 1.5, value: 156, rarity: 5,
  },

  // ===== ARMES LOURDES (Big Guns) =====
  {
    name: 'Fat Man', skill: 'bigGuns',
    damage: 21, damageType: 'physical', fireRate: 0, range: 'medium',
    qualities: [{ quality: 'vicious' }, { quality: 'breaking' }, { quality: 'radioactive' }, { quality: 'twoHanded' }, { quality: 'inaccurate' }, { quality: 'blast' }],
    ammo: 'miniNuke', weight: 15.5, value: 512, rarity: 4,
  },
  {
    name: 'Heavy Incinerator', skill: 'bigGuns',
    damage: 5, damageType: 'energy', fireRate: 3, range: 'medium',
    qualities: [{ quality: 'spread' }, { quality: 'burst' }, { quality: 'persistent' }, { quality: 'twoHanded' }, { quality: 'debilitating' }],
    ammo: 'flamerFuel', weight: 10, value: 350, rarity: 4,
  },
  {
    name: 'Junk Jet', skill: 'bigGuns',
    damage: 6, damageType: 'physical', fireRate: 1, range: 'medium',
    qualities: [{ quality: 'twoHanded' }],
    ammo: 'none', weight: 15, value: 285, rarity: 3,
  },
  {
    name: 'Flamer', skill: 'bigGuns',
    damage: 3, damageType: 'energy', fireRate: 4, range: 'close',
    qualities: [{ quality: 'spread' }, { quality: 'burst' }, { quality: 'persistent' }, { quality: 'twoHanded' }, { quality: 'inaccurate' }, { quality: 'debilitating' }],
    ammo: 'flamerFuel', weight: 8.5, value: 137, rarity: 3,
  },
  {
    name: 'Missile Launcher', skill: 'bigGuns',
    damage: 11, damageType: 'physical', fireRate: 0, range: 'long',
    qualities: [{ quality: 'twoHanded' }, { quality: 'blast' }],
    ammo: 'missile', weight: 10.5, value: 314, rarity: 4,
  },
  {
    name: 'Laser Gatling', skill: 'bigGuns',
    damage: 3, damageType: 'energy', fireRate: 6, range: 'medium',
    qualities: [{ quality: 'burst' }, { quality: 'piercing', value: 1 }, { quality: 'twoHanded' }, { quality: 'gatling' }, { quality: 'inaccurate' }],
    ammo: 'fusionCore', weight: 9.5, value: 804, rarity: 3,
  },
  {
    name: 'Minigun', skill: 'bigGuns',
    damage: 3, damageType: 'physical', fireRate: 5, range: 'medium',
    qualities: [{ quality: 'spread' }, { quality: 'burst' }, { quality: 'twoHanded' }, { quality: 'gatling' }, { quality: 'inaccurate' }],
    ammo: '5mm', weight: 13.5, value: 382, rarity: 2,
  },

  // ===== ARMES DE CORPS À CORPS (Melee) =====
  {
    name: 'Unarmed Attack', skill: 'unarmed',
    damage: 2, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [],
    ammo: 'none', weight: 0, value: 0, rarity: 0,
  },
  {
    name: 'Rock', skill: 'unarmed',
    damage: 2, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'vicious' }, { quality: 'thrown' }],
    ammo: 'none', weight: 0.5, value: 0, rarity: 0,
  },
  {
    name: 'Gun Bash (1H)', skill: 'meleeWeapons',
    damage: 2, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'stun' }],
    // Same weight/value/rarity as the ranged weapon
    ammo: 'none', weight: 0, value: 0, rarity: 0,
  },
  {
    name: 'Gun Bash (2H)', skill: 'meleeWeapons',
    damage: 3, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'stun' }, { quality: 'twoHanded' }],
    // Same weight/value/rarity as the two-handed ranged weapon
    ammo: 'none', weight: 0, value: 0, rarity: 0,
  },
  {
    name: 'Sword', skill: 'meleeWeapons',
    damage: 4, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'piercing', value: 1 }, { quality: 'parry' }],
    ammo: 'none', weight: 1.5, value: 50, rarity: 2,
  },
  {
    name: 'Combat Knife', skill: 'meleeWeapons',
    damage: 3, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'piercing', value: 1 }],
    ammo: 'none', weight: 0.5, value: 25, rarity: 1,
  },
  {
    name: 'Machete', skill: 'meleeWeapons',
    damage: 3, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'piercing', value: 1 }],
    ammo: 'none', weight: 1, value: 25, rarity: 1,
  },
  {
    name: 'Ripper', skill: 'meleeWeapons',
    damage: 4, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'vicious' }],
    ammo: 'none', weight: 3, value: 50, rarity: 2,
  },
  {
    name: 'Shishkebab', skill: 'meleeWeapons',
    damage: 5, damageType: 'energy', fireRate: 0, range: 'close',
    qualities: [{ quality: 'piercing', value: 1 }, { quality: 'parry' }],
    ammo: 'none', weight: 1.5, value: 200, rarity: 3,
  },
  {
    name: 'Switchblade', skill: 'meleeWeapons',
    damage: 2, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'piercing', value: 1 }, { quality: 'concealed' }],
    ammo: 'none', weight: 0.5, value: 20, rarity: 0,
  },
  {
    name: 'Baseball Bat', skill: 'meleeWeapons',
    damage: 4, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'twoHanded' }],
    ammo: 'none', weight: 1.5, value: 25, rarity: 1,
  },
  {
    name: 'Aluminum Baseball Bat', skill: 'meleeWeapons',
    damage: 5, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'twoHanded' }],
    ammo: 'none', weight: 1, value: 32, rarity: 2,
  },
  {
    name: 'Board', skill: 'meleeWeapons',
    damage: 4, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'twoHanded' }],
    ammo: 'none', weight: 1.5, value: 20, rarity: 0,
  },
  {
    name: 'Lead Pipe', skill: 'meleeWeapons',
    damage: 3, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [],
    ammo: 'none', weight: 1.5, value: 15, rarity: 0,
  },
  {
    name: 'Pipe Wrench', skill: 'meleeWeapons',
    damage: 3, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [],
    ammo: 'none', weight: 1, value: 30, rarity: 1,
  },
  {
    name: 'Pool Cue', skill: 'meleeWeapons',
    damage: 3, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'twoHanded' }],
    ammo: 'none', weight: 0.5, value: 10, rarity: 0,
  },
  {
    name: 'Rolling Pin', skill: 'meleeWeapons',
    damage: 3, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [],
    ammo: 'none', weight: 0.5, value: 10, rarity: 0,
  },
  {
    name: 'Baton', skill: 'meleeWeapons',
    damage: 3, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [],
    ammo: 'none', weight: 0.5, value: 10, rarity: 0,
  },
  {
    name: 'Sledgehammer', skill: 'meleeWeapons',
    damage: 5, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [],
    ammo: 'none', weight: 6, value: 40, rarity: 2,
  },
  {
    name: 'Super Sledge', skill: 'meleeWeapons',
    damage: 6, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'breaking' }, { quality: 'twoHanded' }],
    ammo: 'none', weight: 10, value: 180, rarity: 3,
  },
  {
    name: 'Tire Iron', skill: 'meleeWeapons',
    damage: 3, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [],
    ammo: 'none', weight: 1, value: 25, rarity: 1,
  },
  {
    name: 'Walking Cane', skill: 'meleeWeapons',
    damage: 3, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [],
    ammo: 'none', weight: 1, value: 10, rarity: 0,
  },

  // ===== MAINS NUES (Unarmed) =====
  {
    name: 'Boxing Glove', skill: 'unarmed',
    damage: 3, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'stun' }],
    ammo: 'none', weight: 0.5, value: 10, rarity: 1,
  },
  {
    name: 'Deathclaw Gauntlet', skill: 'unarmed',
    damage: 5, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'piercing', value: 1 }],
    ammo: 'none', weight: 5, value: 75, rarity: 3,
  },
  {
    name: 'Knuckles', skill: 'unarmed',
    damage: 3, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'concealed' }],
    ammo: 'none', weight: 0.5, value: 10, rarity: 1,
  },
  {
    name: 'Power Fist', skill: 'unarmed',
    damage: 4, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'stun' }],
    ammo: 'none', weight: 2, value: 100, rarity: 2,
  },

  // ===== PROJECTILES (Throwing) =====
  {
    name: 'Throwing Knife', skill: 'throwing',
    damage: 3, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'piercing', value: 1 }, { quality: 'concealed' }, { quality: 'thrown' }, { quality: 'silent' }],
    ammo: 'none', weight: 0.5, value: 10, rarity: 1,
  },
  {
    name: 'Tomahawk', skill: 'throwing',
    damage: 4, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'piercing', value: 1 }, { quality: 'thrown' }, { quality: 'silent' }],
    ammo: 'none', weight: 0.5, value: 15, rarity: 2,
  },
  {
    name: 'Javelin', skill: 'throwing',
    damage: 4, damageType: 'physical', fireRate: 0, range: 'medium',
    qualities: [{ quality: 'piercing', value: 1 }, { quality: 'thrown' }, { quality: 'silent' }],
    ammo: 'none', weight: 2, value: 10, rarity: 1,
  },

  // ===== EXPLOSIFS (Explosives) =====
  {
    name: 'Molotov Cocktail', skill: 'explosives',
    damage: 4, damageType: 'energy', fireRate: 0, range: 'medium',
    qualities: [{ quality: 'persistent' }, { quality: 'thrown' }, { quality: 'blast' }],
    ammo: 'none', weight: 0.5, value: 20, rarity: 1,
  },
  {
    name: 'Frag Grenade', skill: 'explosives',
    damage: 6, damageType: 'physical', fireRate: 0, range: 'medium',
    qualities: [{ quality: 'thrown' }, { quality: 'blast' }],
    ammo: 'none', weight: 0.5, value: 50, rarity: 2,
  },
  {
    name: 'Pulse Grenade', skill: 'explosives',
    damage: 6, damageType: 'energy', fireRate: 0, range: 'medium',
    qualities: [{ quality: 'stun' }, { quality: 'thrown' }, { quality: 'blast' }],
    ammo: 'none', weight: 0.5, value: 100, rarity: 3,
  },
  {
    name: 'Plasma Grenade', skill: 'explosives',
    damage: 9, damageType: 'energy', fireRate: 0, range: 'medium',
    qualities: [{ quality: 'thrown' }, { quality: 'blast' }],
    ammo: 'none', weight: 0.5, value: 135, rarity: 3,
  },
  {
    name: 'Nuka Grenade', skill: 'explosives',
    damage: 9, damageType: 'energy', fireRate: 0, range: 'medium',
    qualities: [{ quality: 'vicious' }, { quality: 'breaking' }, { quality: 'radioactive' }, { quality: 'thrown' }, { quality: 'blast' }],
    ammo: 'none', weight: 0.5, value: 100, rarity: 4,
  },
  {
    name: 'Baseball Grenade', skill: 'explosives',
    damage: 5, damageType: 'physical', fireRate: 0, range: 'medium',
    qualities: [{ quality: 'thrown' }, { quality: 'blast' }],
    ammo: 'none', weight: 0.5, value: 40, rarity: 1,
  },

  // ===== MINES =====
  {
    name: 'Bottlecap Mine', skill: 'explosives',
    damage: 6, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'mine' }, { quality: 'blast' }],
    ammo: 'none', weight: 0.5, value: 75, rarity: 2,
  },
  {
    name: 'Frag Mine', skill: 'explosives',
    damage: 6, damageType: 'physical', fireRate: 0, range: 'close',
    qualities: [{ quality: 'mine' }, { quality: 'blast' }],
    ammo: 'none', weight: 0.5, value: 50, rarity: 2,
  },
  {
    name: 'Pulse Mine', skill: 'explosives',
    damage: 9, damageType: 'energy', fireRate: 0, range: 'medium',
    qualities: [{ quality: 'thrown' }, { quality: 'blast' }],
    ammo: 'none', weight: 0.5, value: 135, rarity: 3,
  },
  {
    name: 'Plasma Mine', skill: 'explosives',
    damage: 9, damageType: 'energy', fireRate: 0, range: 'medium',
    qualities: [{ quality: 'thrown' }, { quality: 'blast' }],
    ammo: 'none', weight: 0.5, value: 135, rarity: 3,
  },
  {
    name: 'Nuke Mine', skill: 'explosives',
    damage: 9, damageType: 'energy', fireRate: 0, range: 'medium',
    qualities: [{ quality: 'vicious' }, { quality: 'breaking' }, { quality: 'radioactive' }, { quality: 'thrown' }, { quality: 'blast' }],
    ammo: 'none', weight: 0.5, value: 100, rarity: 4,
  },
];
