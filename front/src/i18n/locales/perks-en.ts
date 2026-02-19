export default {
  perks: {
    // A
    animalFriend: {
      name: 'Animal Friend',
      effect: 'Rank 1: Mammal, Lizard or Insect creatures roll 1 CD before attacking you. No Effect = they don\'t attack. Rank 2: CHR+Survival test difficulty 2 to befriend an animal.',
    },
    aquaboy: {
      name: 'Aquaboy/Aquagirl',
      effect: 'Rank 1: Immune to radiation damage in irradiated water, hold breath 2x longer. Rank 2: +2 difficulty to spot you underwater.',
    },
    radResistant: {
      name: 'Rad Resistant',
      effect: 'Your radiation damage resistance increases by +1 per rank.',
    },
    armorer: {
      name: 'Armorer',
      effect: 'You can modify armor with mods. Each rank unlocks mods of that rank.',
    },
    // B
    barbarian: {
      name: 'Barbarian',
      effect: 'Your Strength affects your ballistic DR. STR 7-8: +1, STR 9-10: +2, STR 11+: +3. Doesn\'t work in power armor.',
    },
    gunFu: {
      name: 'Gun Fu',
      effect: 'When making a ranged attack, you can target the Torso without increasing difficulty. You can reroll 1d20 of your attack.',
    },
    silverTongue: {
      name: 'Silver Tongue',
      effect: 'You can reroll 1d20 on any Barter or Speech opposed test.',
    },
    blitz: {
      name: 'Blitz',
      effect: 'Rank 1: When you move into reach and make a melee attack, reroll 1d20. Rank 2: +1 CD damage.',
    },
    leadBelly: {
      name: 'Lead Belly',
      effect: 'Rank 1: Reroll radiation CD from irradiated food/drink. Rank 2: Immune to radiation from food/drink.',
    },
    juryRigging: {
      name: 'Jury Rigging',
      effect: 'You can repair an item without spare parts. The repair is temporary: the item breaks on the next complication.',
    },
    // C
    scoundrel: {
      name: 'Scoundrel',
      effect: 'You can ignore the first complication on any CHR+Speech test to convince someone of a lie.',
    },
    dogmeat: {
      name: 'Dogmeat',
      effect: 'You have a dog companion (see Dogmeat profile). Its level increases with yours.',
    },
    hunter: {
      name: 'Hunter',
      effect: 'Your attacks against Mammals, Lizards, Insects and Mutants gain the Brutal effect if they don\'t already have it.',
    },
    chemist: {
      name: 'Chemist',
      effect: 'The effect duration of drugs you create is doubled. You unlock recipes requiring this perk.',
    },
    shotgunSurgeon: {
      name: 'Shotgun Surgeon',
      effect: 'Shotgun attacks gain Piercing 1. If already Piercing, the value increases by 1.',
    },
    movingTarget: {
      name: 'Moving Target',
      effect: 'When you sprint, +1 Defense until the start of your next turn.',
    },
    basher: {
      name: 'Basher',
      effect: 'When you make a melee attack by bashing with your firearm, the attack gains the Brutal effect.',
    },
    laserCommander: {
      name: 'Laser Commander',
      effect: 'With an energy weapon, +1 CD damage per rank.',
    },
    commando: {
      name: 'Commando',
      effect: 'With a weapon with fire rate ≥3 (except heavy weapons), +1 CD damage per rank.',
    },
    comprehension: {
      name: 'Comprehension',
      effect: 'After using a magazine bonus, roll 1 CD. On Effect, use it one more time.',
    },
    canOpener: {
      name: 'Can Opener',
      effect: 'When scavenging a location with food, you find one additional food item for free.',
    },
    betterCriticals: {
      name: 'Better Criticals',
      effect: 'When you deal damage, spend 1 luck point to automatically inflict a critical hit.',
    },
    // D
    quickDraw: {
      name: 'Quick Draw',
      effect: 'Each turn, draw one weapon or item without using a minor action.',
    },
    fortuneFinder: {
      name: 'Fortune Finder',
      effect: 'When you find caps: Rank 1: +3 CD, Rank 2: +6 CD, Rank 3: +10 CD.',
    },
    // E
    solarPowered: {
      name: 'Solar Powered',
      effect: 'You eliminate 1 radiation damage per hour in direct sunlight.',
    },
    entomologist: {
      name: 'Entomologist',
      effect: 'Your attacks against Insects gain Piercing 1. If already Piercing, the value increases by 1.',
    },
    intenseTraining: {
      name: 'Intense Training',
      effect: 'Increase one S.P.E.C.I.A.L. attribute by 1 (max 10).',
    },
    demolitionExpert: {
      name: 'Demolition Expert',
      effect: 'Attacks with Blast gain Brutal. You unlock explosive recipes.',
    },
    roboticsExpert: {
      name: 'Robotics Expert',
      effect: 'Rank 1: Modify robots with rank 1 mods. Rank 2: Rank 2 mods, -1 difficulty robot repair. Rank 3: Rank 3 mods, reprogramming possible.',
    },
    // F
    gunNut: {
      name: 'Gun Nut',
      effect: 'You can modify small guns. Each rank unlocks mods of that rank.',
    },
    capCollector: {
      name: 'Cap Collector',
      effect: 'You can modify buy/sell prices by 10%.',
    },
    ghost: {
      name: 'Ghost',
      effect: 'On AGI+Sneak test in shadow/darkness, the first extra d20 is free.',
    },
    scrounger: {
      name: 'Scrounger',
      effect: 'When you find ammo: Rank 1: +3 CD, Rank 2: +6 CD, Rank 3: +10 CD (same type as found).',
    },
    pharmaFarmer: {
      name: 'Pharma Farmer',
      effect: 'When scavenging a location with medicine/drugs, you find one additional item for free.',
    },
    partyBoy: {
      name: 'Party Boy/Girl',
      effect: 'You cannot become addicted to alcoholic beverages. Each alcoholic drink heals +2 HP.',
    },
    finesse: {
      name: 'Finesse',
      effect: 'Once per combat, reroll all CD of a damage roll without spending a luck point.',
    },
    heavyHitter: {
      name: 'Heavy Hitter',
      effect: 'Two-handed melee attacks gain the Brutal effect.',
    },
    blacksmith: {
      name: 'Blacksmith',
      effect: 'You can modify melee weapons. Each rank unlocks mods of that rank.',
    },
    piercingStrike: {
      name: 'Piercing Strike',
      effect: 'Your unarmed or bladed melee weapon attacks gain Piercing 1. If already Piercing, +1.',
    },
    rifleman: {
      name: 'Rifleman',
      effect: 'With a two-handed weapon with fire rate ≤2 (except heavy weapons), +1 CD per rank. Rank 2: +Piercing 1.',
    },
    meltdown: {
      name: 'Meltdown',
      effect: 'When you kill an enemy with an energy weapon, they explode. Nearby creatures take energy damage.',
    },
    // G
    fastHealer: {
      name: 'Fast Healer',
      effect: 'On END+Survival test to heal yourself, the first extra d20 is free.',
    },
    medic: {
      name: 'Medic',
      effect: 'When you heal with First Aid, +1 HP healed per rank.',
    },
    // H
    heaveHo: {
      name: 'Heave Ho!',
      effect: 'With a thrown ranged attack, spend 1 AP to increase range by one level.',
    },
    actionBoy: {
      name: 'Action Boy/Girl',
      effect: 'When you spend AP for an additional major action, no difficulty increase.',
    },
    // I
    infiltrator: {
      name: 'Infiltrator',
      effect: 'Reroll 1d20 on any Lockpick test for a door or container.',
    },
    nurse: {
      name: 'Nurse',
      effect: 'When you use First Aid to heal, you can reroll 1d20.',
    },
    // L
    sizeMatters: {
      name: 'Size Matters',
      effect: 'With a heavy weapon, +1 CD damage per rank.',
    },
    bullRush: {
      name: 'Bull Rush',
      effect: 'Major action: charge in power armor or as super mutant. STR+Athletics test difficulty 2. Success: unarmed damage + knockdown.',
    },
    // M
    quickHands: {
      name: 'Quick Hands',
      effect: 'Reload faster. On ranged attack, spend 2 AP for +2 fire rate for this attack.',
    },
    masterThief: {
      name: 'Master Thief',
      effect: 'On tests to pick locks or pick pockets, +1 difficulty for others to spot you.',
    },
    sandman: {
      name: 'Sandman',
      effect: 'On sneak attack with silenced weapon, +2 CD damage. Doesn\'t work in power armor.',
    },
    fastMetabolism: {
      name: 'Fast Metabolism',
      effect: 'When you recover HP by means other than rest, +1 HP recovered per rank.',
    },
    mysteriousStranger: {
      name: 'Mysterious Stranger',
      effect: 'At the start of combat, spend 1 luck point. The Mysterious Stranger appears and attacks an enemy.',
    },
    // N
    daringNature: {
      name: 'Daring Nature',
      effect: 'On skill test with 1d20 while granting AP to GM, reroll 1d20. Incompatible with Cautious Nature.',
    },
    cautiousNature: {
      name: 'Cautious Nature',
      effect: 'On skill test with at least 1d20 bought with AP, reroll 1d20. Incompatible with Daring Nature.',
    },
    ninja: {
      name: 'Ninja',
      effect: 'On sneak attack unarmed or melee, +2 CD damage. Doesn\'t work in power armor.',
    },
    nightPerson: {
      name: 'Night Person',
      effect: 'Reduce by 1 the difficulty increase due to darkness.',
    },
    // P
    paralyzingPalm: {
      name: 'Paralyzing Palm',
      effect: 'On unarmed attack targeting a location, the attack gains the Stun effect.',
    },
    nuclearPhysicist: {
      name: 'Nuclear Physicist',
      effect: 'With a radiation weapon or Radioactive, each Effect deals +1 radiation damage. Fusion cores have +3 charges.',
    },
    pickpocket: {
      name: 'Pickpocket',
      effect: 'Rank 1: Ignore first AGI+Sneak complication when stealing. Rank 2: Reroll 1d20 for pickpocketing. Rank 3: -1 difficulty.',
    },
    lightStep: {
      name: 'Light Step',
      effect: 'On AGI test based on complication, ignore one complication per AP. Reroll 1d20 to avoid pressure plate traps.',
    },
    hacker: {
      name: 'Hacker',
      effect: 'Reduce by 1 (min 0) the difficulty of your tests to hack computers.',
    },
    pathfinder: {
      name: 'Pathfinder',
      effect: 'On long distance travel, a successful PER+Survival test halves travel time.',
    },
    gunslinger: {
      name: 'Gunslinger',
      effect: 'With a one-handed weapon with fire rate ≤2, +1 CD per rank. Reroll the location die.',
    },
    ironFist: {
      name: 'Iron Fist',
      effect: 'Rank 1: +1 CD to unarmed attacks. Rank 2: +Brutal effect.',
    },
    adrenalineRush: {
      name: 'Adrenaline Rush',
      effect: 'When your HP is not at maximum, consider STR = 10 for tests and melee attacks.',
    },
    intimidation: {
      name: 'Intimidation',
      effect: 'Rank 1: Reroll 1d20 to threaten/frighten. Rank 2: Major action to threaten, STR+Speech test difficulty 2.',
    },
    pyromaniac: {
      name: 'Pyromaniac',
      effect: 'With a fire-based weapon, +1 CD damage per rank.',
    },
    // R
    nerdRage: {
      name: 'Nerd Rage!',
      effect: 'When below 1/4 max HP, +ballistic and energy DR and +CD damage per rank.',
    },
    snakeater: {
      name: 'Snakeater',
      effect: 'Your poison damage resistance increases by 2.',
    },
    scrapper: {
      name: 'Scrapper',
      effect: 'Rank 1: When scrapping, also get uncommon components. Rank 2: Also get rare components.',
    },
    refractor: {
      name: 'Refractor',
      effect: 'Your energy damage resistance increases by +1 per rank.',
    },
    strongBack: {
      name: 'Strong Back',
      effect: 'Your maximum carry weight increases by 12.5 kg per rank.',
    },
    chemResistant: {
      name: 'Chem Resistant',
      effect: 'Rank 1: Roll 1 fewer CD to determine addiction. Rank 2: Immune to drug addiction.',
    },
    ricochet: {
      name: 'Ricochet',
      effect: 'If an enemy gets a complication attacking you at range, spend 1 luck point to have the ricochet hit them.',
    },
    toughness: {
      name: 'Toughness',
      effect: 'Your ballistic damage resistance increases by +1 per rank.',
    },
    // S
    bloodyMess: {
      name: 'Bloody Mess',
      effect: 'On a critical hit, roll 1 CD. On Effect, inflict an additional injury to a random location.',
    },
    science: {
      name: 'Science!',
      effect: 'You can modify energy weapons and craft certain advanced armor mods. Each rank unlocks mods of that rank.',
    },
    awareness: {
      name: 'Awareness',
      effect: 'When Aiming at a target at short range or less, the next attack gains Piercing 1 (or +1 if already).',
    },
    sniper: {
      name: 'Sniper',
      effect: 'When Aiming with a two-handed Accurate weapon, choose the hit location without increasing difficulty.',
    },
    inspirational: {
      name: 'Inspirational',
      effect: 'The group AP pool can hold 1 additional AP thanks to you.',
    },
    tag: {
      name: 'Tag!',
      effect: 'Choose an additional tag skill. Increase that skill by 2 ranks (max 6) and check the "tag skill" box.',
    },
    adamantiumSkeleton: {
      name: 'Adamantium Skeleton',
      effect: 'The damage required to inflict a critical hit on you increases by your ranks in this perk.',
    },
    educated: {
      name: 'Educated',
      effect: 'Increase two skills by 1 rank, or one skill by 2 ranks (max 6).',
    },
    // T
    concentratedFire: {
      name: 'Concentrated Fire',
      effect: 'On ranged attack with extra ammo, reroll up to 3 damage CD.',
    },
    slacker: {
      name: 'Slacker',
      effect: 'Rank 1: On Defend action, -1 difficulty to test. Rank 2: Improving defense costs only 1 AP.',
    },
    triggerRush: {
      name: 'Trigger Rush',
      effect: 'On successful ranged attack, spend 1 AP and 1 ammo to hit an additional target at short range. +1 target per rank.',
    },
    slayer: {
      name: 'Slayer',
      effect: 'On unarmed or melee attack with at least 1 damage, spend 1 luck point to inflict a critical hit.',
    },
    killer: {
      name: 'Killer',
      effect: 'When you kill an enemy, roll 1 CD. On Effect, +2 AP to group pool.',
    },
    // V
    junktownVendor: {
      name: 'Junktown Vendor',
      effect: 'Reduce by 1 (min 0) the difficulty of any CHR+Barter test to buy or sell.',
    },
    blackWidow: {
      name: 'Black Widow/Lady Killer',
      effect: 'Reroll 1d20 on any CHR test to influence a character of the chosen gender. Your attacks deal +1 CD to them.',
    },
    steadyAim: {
      name: 'Steady Aim',
      effect: 'When Aiming, reroll 2d20 of your first attack this turn OR reroll 1d20 of all your attacks this turn.',
    },
    lifeGiver: {
      name: 'Life Giver',
      effect: 'Add your Endurance value to your maximum hit points.',
    },
  },
};
