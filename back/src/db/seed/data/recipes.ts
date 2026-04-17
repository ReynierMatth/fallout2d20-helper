export type WorkbenchType = 'weapon' | 'armor' | 'chemistry' | 'cooking' | 'power_armor' | 'robot';
export type CraftingSkill = 'repair' | 'science' | 'survival' | 'explosives';
export type RecipeRarity = 'frequente' | 'peu_frequente' | 'rare';

export interface RecipePerkReq {
  perkId: string;
  minRank: number;
}

export interface RecipeIngredient {
  itemName: string; // must match exact name in items table
  quantity: number;
}

export interface RecipeData {
  name: string;
  nameKey?: string;
  workbenchType: WorkbenchType;
  complexity: number;
  skill: CraftingSkill;
  rarity: RecipeRarity;
  resultModName?: string;  // must match exact name in items table (for mod recipes)
  resultItemName?: string; // must match exact name in items table (for item recipes)
  perkRequirements?: RecipePerkReq[];
  ingredients?: RecipeIngredient[]; // only for chemistry/cooking
}

// ── Weapon mod recipes ──────────────────────────────────────────────────────

// Mods armes légères — culasse
const SMALL_GUN_BOLT_MODS: RecipeData[] = [
  { name: 'Culasse renforcée', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'frequente', resultModName: 'Renforcée' },
  { name: 'Culasse puissante', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 1 }], resultModName: 'Puissante' },
  { name: 'Culasse avancée', workbenchType: 'weapon', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 2 }], resultModName: 'Avancée' },
  { name: 'Culasse calibrée', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'frequente', resultModName: 'Calibrée' },
  { name: 'Culasse automatique', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 1 }], resultModName: 'Automatique' },
  { name: 'Culasse haute sensibilité', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 2 }], resultModName: 'Haute sensibilité' },
];

// Mods armes légères — canon
const SMALL_GUN_BARREL_MODS: RecipeData[] = [
  { name: 'Canon .38', workbenchType: 'weapon', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 4 }], resultModName: 'Culasse .38' },
  { name: 'Canon .308', workbenchType: 'weapon', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 4 }], resultModName: 'Culasse .308' },
  { name: 'Canon .45', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 2 }], resultModName: 'Culasse .45' },
  { name: 'Canon .50', workbenchType: 'weapon', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 4 }], resultModName: 'Culasse .50' },
  { name: 'Culasse automatique à piston', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 2 }], resultModName: 'Culasse automatique à piston' },
  { name: 'Canon compact', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'frequente', resultModName: 'Canon compact' },
  { name: 'Canon extra-lourd', workbenchType: 'weapon', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 3 }], resultModName: 'Canon extra-lourd' },
  { name: 'Canon long (arme légère)', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 1 }], resultModName: 'Canon long' },
  { name: 'Canon ventilé', workbenchType: 'weapon', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 4 }], resultModName: 'Canon ventilé' },
  { name: 'Canon à ouvertures', workbenchType: 'weapon', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 4 }], resultModName: 'Canon à ouvertures' },
  { name: 'Canon scié', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'frequente', resultModName: 'Canon scié' },
  { name: 'Canon protégé', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 3 }], resultModName: 'Canon protégé' },
  { name: 'Canon à ailettes', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 2 }], resultModName: 'Canon à ailettes' },
];

// Mods armes légères — chargeur
const SMALL_GUN_MAGAZINE_MODS: RecipeData[] = [
  { name: 'Grand chargeur (arme légère)', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 2 }], resultModName: 'Grand chargeur' },
  { name: 'Chargeur à éjection rapide', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 1 }], resultModName: 'Chargeur à éjection rapide' },
  { name: 'Grand chargeur à éjection rapide', workbenchType: 'weapon', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 2 }], resultModName: 'Grand chargeur à éjection rapide' },
];

// Mods armes légères — poignée
const SMALL_GUN_GRIP_MODS: RecipeData[] = [
  { name: 'Poignée confort', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'frequente', resultModName: 'Poignée confort' },
  { name: 'Poignée de tireur d\'élite (arme légère)', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 1 }], resultModName: 'Poignée de tireur d\'élite' },
];

// Mods armes légères — crosse
const SMALL_GUN_STOCK_MODS: RecipeData[] = [
  { name: 'Crosse complète (arme légère)', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'frequente', resultModName: 'Crosse complète' },
  { name: 'Crosse de tireur d\'élite (arme légère)', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 2 }], resultModName: 'Crosse de tireur d\'élite' },
  { name: 'Crosse à compensateur de recul (arme légère)', workbenchType: 'weapon', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 3 }], resultModName: 'Crosse à compensateur de recul' },
];

// Mods armes légères — viseur
const SMALL_GUN_SIGHT_MODS: RecipeData[] = [
  { name: 'Viseur laser (arme légère)', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'frequente', resultModName: 'Viseur laser' },
  { name: 'Lunette courte (arme légère)', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'frequente', resultModName: 'Lunette courte' },
  { name: 'Lunette longue (arme légère)', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 2 }], resultModName: 'Lunette longue' },
  { name: 'Lunette de vision nocturne courte (arme légère)', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 2 }], resultModName: 'Lunette de vision nocturne courte' },
  { name: 'Lunette de vision nocturne longue (arme légère)', workbenchType: 'weapon', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 3 }], resultModName: 'Lunette de vision nocturne longue' },
  { name: 'Lunette de reconnaissance (arme légère)', workbenchType: 'weapon', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 3 }], resultModName: 'Lunette de reconnaissance' },
];

// Mods armes légères — bouche
const SMALL_GUN_MUZZLE_MODS: RecipeData[] = [
  { name: 'Baïonnette (arme légère)', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'frequente', resultModName: 'Baïonnette' },
  { name: 'Compensateur (arme légère)', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 1 }], resultModName: 'Compensateur' },
  { name: 'Frein de bouche', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 1 }], resultModName: 'Frein de bouche' },
  { name: 'Silencieux (arme légère)', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 2 }], resultModName: 'Silencieux' },
];

// Mods armes à énergie — condensateur
const ENERGY_CAPACITOR_MODS: RecipeData[] = [
  { name: 'Amplificateur ondes bêta', workbenchType: 'weapon', complexity: 2, skill: 'science', rarity: 'frequente', resultModName: 'Amplificateur d\'ondes Bêta' },
  { name: 'Condensateur amélioré (arme à énergie)', workbenchType: 'weapon', complexity: 2, skill: 'science', rarity: 'frequente', resultModName: 'Condensateur amélioré' },
  { name: 'Stimulateur de photons', workbenchType: 'weapon', complexity: 3, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 1 }], resultModName: 'Stimulateur de photons' },
  { name: 'Agitateur de photons (arme à énergie)', workbenchType: 'weapon', complexity: 4, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 2 }], resultModName: 'Agitateur de photons' },
  { name: 'Condensateur à Trois Charges', workbenchType: 'weapon', complexity: 2, skill: 'science', rarity: 'frequente', resultModName: 'Condensateur à trois charges' },
  { name: 'Condensateur à Quatre Charges', workbenchType: 'weapon', complexity: 3, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 1 }], resultModName: 'Condensateur à quatre charges' },
  { name: 'Condensateur à Cinq Charges', workbenchType: 'weapon', complexity: 4, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 2 }], resultModName: 'Condensateur à cinq charges' },
  { name: 'Condensateur à Six Charges', workbenchType: 'weapon', complexity: 5, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 3 }], resultModName: 'Condensateur à six charges' },
];

// Mods armes à énergie — canon
const ENERGY_BARREL_MODS: RecipeData[] = [
  { name: 'Canon court à fixation', workbenchType: 'weapon', complexity: 3, skill: 'science', rarity: 'frequente', resultModName: 'Canon court à fixation' },
  { name: 'Canon long (arme à énergie)', workbenchType: 'weapon', complexity: 3, skill: 'science', rarity: 'frequente', resultModName: 'Canon long' },
  { name: 'Diviseur', workbenchType: 'weapon', complexity: 3, skill: 'science', rarity: 'frequente', resultModName: 'Diviseur' },
  { name: 'Canon automatique (arme à énergie)', workbenchType: 'weapon', complexity: 4, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 1 }], resultModName: 'Canon automatique' },
  { name: 'Canon long à fixation', workbenchType: 'weapon', complexity: 4, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 1 }], resultModName: 'Canon long à fixation' },
  { name: 'Canon amélioré (arme à énergie)', workbenchType: 'weapon', complexity: 4, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 1 }], resultModName: 'Canon amélioré' },
  { name: 'Canon de précision (arme à énergie)', workbenchType: 'weapon', complexity: 4, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 1 }], resultModName: 'Canon de précision' },
  { name: 'Canon Lance-Flammes', workbenchType: 'weapon', complexity: 5, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 2 }], resultModName: 'Canon lance-flammes' },
];

// Mods armes à énergie — poignée, crosse, viseur, bouche
const ENERGY_OTHER_MODS: RecipeData[] = [
  { name: 'Poignée de tireur d\'élite (arme à énergie)', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 1 }], resultModName: 'Poignée de tireur d\'élite' },
  { name: 'Crosse standard (arme à énergie)', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'frequente', resultModName: 'Crosse standard' },
  { name: 'Crosse complète (arme à énergie)', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'frequente', resultModName: 'Crosse complète (énergie)' },
  { name: 'Crosse de tireur d\'élite (arme à énergie)', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 1 }], resultModName: 'Crosse de tireur d\'élite' },
  { name: 'Crosse à compensateur de recul (arme à énergie)', workbenchType: 'weapon', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 3 }], resultModName: 'Crosse à compensateur de recul' },
  { name: 'Viseur laser (arme à énergie)', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'frequente', resultModName: 'Viseur laser' },
  { name: 'Lunette courte (arme à énergie)', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'frequente', resultModName: 'Lunette courte' },
  { name: 'Lunette longue (arme à énergie)', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 2 }], resultModName: 'Lunette longue' },
  { name: 'Lunette de vision nocturne courte (arme à énergie)', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 2 }], resultModName: 'Lunette de vision nocturne courte' },
  { name: 'Lunette de vision nocturne longue (arme à énergie)', workbenchType: 'weapon', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 3 }], resultModName: 'Lunette de vision nocturne longue' },
  { name: 'Lunette de reconnaissance (arme à énergie)', workbenchType: 'weapon', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 3 }], resultModName: 'Lunette de reconnaissance' },
  { name: 'Diviseur de rayon', workbenchType: 'weapon', complexity: 4, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 1 }], resultModName: 'Diviseur de rayon' },
  { name: 'Concentrateur de faisceau', workbenchType: 'weapon', complexity: 4, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 1 }], resultModName: 'Concentrateur de faisceau' },
  { name: 'Lentille à gyrocompensation', workbenchType: 'weapon', complexity: 4, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 1 }], resultModName: 'Lentille à gyrocompensation' },
];

// Mods armes lourdes — lance-flammes
const FLAMETHROWER_MODS: RecipeData[] = [
  { name: 'Réservoir à napalm', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'frequente', resultModName: 'Réservoir à napalm' },
  { name: 'Canon long (lance-flammes)', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'frequente', resultModName: 'Canon long (lance-flammes)' },
  { name: 'Grand réservoir', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'frequente', resultModName: 'Grand réservoir' },
  { name: 'Réservoir géant', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'frequente', resultModName: 'Réservoir géant' },
  { name: 'Buse de compression', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'frequente', resultModName: 'Buse de compression' },
  { name: 'Buse de vaporisation', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'frequente', resultModName: 'Buse de vaporisation' },
];

// Mods armes lourdes — pistolet gamma
const GAMMA_GUN_MODS: RecipeData[] = [
  { name: 'Parabole à renforcement', workbenchType: 'weapon', complexity: 6, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 4 }], resultModName: 'Parabole à renfoncement' },
  { name: 'Antenne de transmission électrique', workbenchType: 'weapon', complexity: 5, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 3 }], resultModName: 'Antenne de transmission électrique' },
  { name: 'Répéteur de signal', workbenchType: 'weapon', complexity: 6, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 4 }], resultModName: 'Répéteur de signal' },
  { name: 'Stimulateur de photons (arme lourde)', workbenchType: 'weapon', complexity: 6, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 3 }] },
];

// Mods armes lourdes — gatling laser
const GATLING_LASER_MODS: RecipeData[] = [
  { name: 'Amplificateur d\'ondes bêta (gatling)', workbenchType: 'weapon', complexity: 4, skill: 'science', rarity: 'frequente', resultModName: 'Amplificateur d\'ondes Bêta (Gatling)' },
  { name: 'Condensateur amélioré (gatling)', workbenchType: 'weapon', complexity: 4, skill: 'science', rarity: 'frequente', resultModName: 'Condensateur amélioré (Gatling)' },
  { name: 'Agitateur de photons (gatling)', workbenchType: 'weapon', complexity: 6, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 3 }], resultModName: 'Agitateur de photons (Gatling)' },
  { name: 'Canons à chargement', workbenchType: 'weapon', complexity: 7, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 4 }], resultModName: 'Canons à chargement' },
  { name: 'Viseur laser (gatling)', workbenchType: 'weapon', complexity: 7, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 4 }], resultModName: 'Viseur laser (Gatling)' },
  { name: 'Concentrateur de faisceau (gatling)', workbenchType: 'weapon', complexity: 4, skill: 'science', rarity: 'frequente', resultModName: 'Concentrateur de faisceau (Gatling)' },
];

// Mods armes lourdes — junk jet
const JUNK_JET_MODS: RecipeData[] = [
  { name: 'Canon long (junk jet)', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 1 }], resultModName: 'Canon long' },
  { name: 'Crosse à compensateur de recul (junk jet)', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'frequente', resultModName: 'Crosse à compensateur de recul (lourd)' },
  { name: 'Viseur d\'artilleur (junk jet)', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'frequente', resultModName: 'Viseur d\'Artilleur' },
  { name: 'Module d\'électrification', workbenchType: 'weapon', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 2 }, { perkId: 'science', minRank: 1 }], resultModName: 'Module d\'électrification' },
  { name: 'Module de combustion', workbenchType: 'weapon', complexity: 7, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 3 }, { perkId: 'science', minRank: 1 }], resultModName: 'Module de combustion' },
];

// Mods armes lourdes — minigun
const MINIGUN_MODS: RecipeData[] = [
  { name: 'Canon grande vitesse', workbenchType: 'weapon', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 3 }], resultModName: 'Canon grande vitesse' },
  { name: 'Triple canon (minigun)', workbenchType: 'weapon', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 4 }], resultModName: 'Triple canon (minigun)' },
];

// Mods armes lourdes — lance-missiles
const MISSILE_LAUNCHER_MODS: RecipeData[] = [
  { name: 'Viseur d\'artilleur (lance-missiles)', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'frequente' },
  { name: 'Broyeur', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 2 }], resultModName: 'Broyeur' },
  { name: 'Triple Canon (lance-missiles)', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 2 }], resultModName: 'Triple canon' },
  { name: 'Quadruple canon', workbenchType: 'weapon', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 3 }], resultModName: 'Quadruple canon' },
  { name: 'Lunette (lance-missiles)', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 2 }], resultModName: 'Lunette (lance-missiles)' },
  { name: 'Lunette de vision nocturne (lance-missiles)', workbenchType: 'weapon', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 4 }, { perkId: 'science', minRank: 1 }], resultModName: 'Lunette de vision nocturne (lance-missiles)' },
  { name: 'Ordinateur de visée', workbenchType: 'weapon', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 2 }, { perkId: 'science', minRank: 2 }], resultModName: 'Ordinateur de visée' },
  { name: 'Baïonnette (lance-missiles)', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'frequente', resultModName: 'Baïonnette (lance-missiles)' },
  { name: 'Stabilisateur', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'gunNut', minRank: 2 }], resultModName: 'Stabilisateur' },
];

// Mods armes de corps à corps
const MELEE_MODS: RecipeData[] = [
  // Épée
  { name: 'Lame dentelée (épée)', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 2 }], resultModName: 'Lame dentelée (épée)' },
  { name: 'Lame électrifiée', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 2 }, { perkId: 'science', minRank: 1 }], resultModName: 'Lame électrifiée' },
  { name: 'Lame dentelée électrifiée', workbenchType: 'weapon', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 3 }, { perkId: 'science', minRank: 1 }], resultModName: 'Lame dentelée électrifiée' },
  { name: 'Module d\'étourdissement (épée)', workbenchType: 'weapon', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 3 }, { perkId: 'science', minRank: 1 }], resultModName: 'Module d\'étourdissement' },
  // Couteau de combat
  { name: 'Lame dentelée (couteau)', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 1 }], resultModName: 'Lame dentelée (couteau)' },
  { name: 'Lame furtive', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 2 }], resultModName: 'Lame furtive' },
  // Machette (commentaire incorrect — ces mods appartiennent à l'Éventreur/Ripper dans mods.ts)
  { name: 'Lame courbe', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'frequente', resultModName: 'Lame courbe' },
  { name: 'Lame rallongée', workbenchType: 'weapon', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 3 }], resultModName: 'Lame rallongée' },
  // Éventreur
  { name: 'Lame dentelée (éventreur)', workbenchType: 'weapon', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 3 }] },
  // Flambeur
  { name: 'Jets de flammes supplémentaires', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 1 }], resultModName: 'Jets de flammes supplémentaires' },
  // Cran d'arrêt
  { name: 'Lame dentelée (cran d\'arrêt)', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 3 }], resultModName: 'Lame dentelée (cran)' },
  // Batte de baseball
  { name: 'Batte barbelée', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente', resultModName: 'Barbelé' },
  { name: 'Batte à pointes', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'frequente', resultModName: 'À pointes' },
  { name: 'Batte affûtée', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'frequente', resultModName: 'Affûté' },
  // Planche
  { name: 'Planche à chaînes', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 1 }], resultModName: 'À chaînes' },
  { name: 'Planche à lames', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 2 }], resultModName: 'À lames (planche)' },
  // Tuyau de plomb
  { name: 'Tuyau à pointes', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente' },
  { name: 'Tuyau perforant', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 1 }] },
  { name: 'Tuyau à lames', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 1 }] },
  // Clé serre-tube
  { name: 'Clé à pointes', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente' },
  { name: 'Clé lourde', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 2 }] },
  // Queue de billard
  { name: 'Billard crochet', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente' },
  { name: 'Billard lourde', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 1 }] },
  { name: 'Billard perforante', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 1 }] },
  // Rouleau à pâtisserie
  { name: 'Rouleau extralourde', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 2 }] },
  // Matraque
  { name: 'Matraque barbelée', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente' },
  { name: 'Matraque affûtée', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente' },
  { name: 'Matraque à pointes', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente' },
  // Masse
  { name: 'Masse affûtée', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente' },
  { name: 'Masse électrifiée', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 2 }, { perkId: 'science', minRank: 1 }] },
  { name: 'Module d\'étourdissement (masse)', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 2 }, { perkId: 'science', minRank: 1 }] },
  { name: 'Masse perforante', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 2 }] },
  { name: 'Masse lourde', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 2 }] },
  { name: 'Masse bobine thermique', workbenchType: 'weapon', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 2 }] },
  { name: 'Module d\'étourdissement (super masse)', workbenchType: 'weapon', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 3 }, { perkId: 'science', minRank: 1 }] },
  // Démonte-pneu
  { name: 'Démonte-pneu à lames', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 1 }] },
  // Canne
  { name: 'Canne barbelée', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente' },
  { name: 'Canne à pointes', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente' },
  // Poing américain
  { name: 'Poing américain à pointes', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente' },
  { name: 'Poing américain perforant', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 1 }] },
  { name: 'Poing américain revêtement en plomb', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 1 }] },
  // Gant de boxe
  { name: 'Gant de boxe affûté', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente' },
  { name: 'Gant de boxe à pointes', workbenchType: 'weapon', complexity: 1, skill: 'repair', rarity: 'frequente' },
  // Poing assisté
  { name: 'Poing assisté à lames', workbenchType: 'weapon', complexity: 2, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 1 }] },
  { name: 'Poing assisté perforant', workbenchType: 'weapon', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 2 }] },
  { name: 'Poing assisté bobine thermique', workbenchType: 'weapon', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 3 }] },
];

export const WEAPON_MOD_RECIPES: RecipeData[] = [
  ...SMALL_GUN_BOLT_MODS,
  ...SMALL_GUN_BARREL_MODS,
  ...SMALL_GUN_MAGAZINE_MODS,
  ...SMALL_GUN_GRIP_MODS,
  ...SMALL_GUN_STOCK_MODS,
  ...SMALL_GUN_SIGHT_MODS,
  ...SMALL_GUN_MUZZLE_MODS,
  ...ENERGY_CAPACITOR_MODS,
  ...ENERGY_BARREL_MODS,
  ...ENERGY_OTHER_MODS,
  ...FLAMETHROWER_MODS,
  ...GAMMA_GUN_MODS,
  ...GATLING_LASER_MODS,
  ...JUNK_JET_MODS,
  ...MINIGUN_MODS,
  ...MISSILE_LAUNCHER_MODS,
  ...MELEE_MODS,
];

// ── Armor mod recipes ────────────────────────────────────────────────────────

// Tissu balistique (ballistic weave)
const BALLISTIC_WEAVE_MODS: RecipeData[] = [
  { name: 'Tissu balistique', workbenchType: 'armor', complexity: 3, skill: 'repair', rarity: 'rare' },
  { name: 'Tissu balistique Mk II', workbenchType: 'armor', complexity: 3, skill: 'repair', rarity: 'rare', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'Tissu balistique Mk III', workbenchType: 'armor', complexity: 3, skill: 'repair', rarity: 'rare', perkRequirements: [{ perkId: 'armorer', minRank: 2 }] },
  { name: 'Tissu balistique Mk IV', workbenchType: 'armor', complexity: 3, skill: 'repair', rarity: 'rare', perkRequirements: [{ perkId: 'armorer', minRank: 3 }] },
  { name: 'Tissu balistique Mk V', workbenchType: 'armor', complexity: 3, skill: 'repair', rarity: 'rare', perkRequirements: [{ perkId: 'armorer', minRank: 4 }] },
];

// Revêtements combinaison d'abri
const VAULT_SUIT_MODS: RecipeData[] = [
  { name: 'Revêtement isolant', workbenchType: 'armor', complexity: 2, skill: 'repair', rarity: 'frequente' },
  { name: 'Revêtement traité', workbenchType: 'armor', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 2 }] },
  { name: 'Revêtement résistant', workbenchType: 'armor', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 3 }] },
  { name: 'Revêtement protecteur', workbenchType: 'armor', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 4 }, { perkId: 'science', minRank: 2 }] },
  { name: 'Revêtement blindé', workbenchType: 'armor', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 4 }, { perkId: 'science', minRank: 4 }] },
];

// Matériaux armure de pillard
const RAIDER_ARMOR_MODS: RecipeData[] = [
  { name: 'Armure pillard soudée', workbenchType: 'armor', complexity: 2, skill: 'repair', rarity: 'frequente' },
  { name: 'Armure pillard trempée', workbenchType: 'armor', complexity: 3, skill: 'repair', rarity: 'frequente' },
  { name: 'Armure pillard renforcée', workbenchType: 'armor', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'Armure pillard étayée', workbenchType: 'armor', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
];

// Matériaux armure de cuir
const LEATHER_ARMOR_MODS: RecipeData[] = [
  { name: 'Armure cuir bouilli Mk I', workbenchType: 'armor', complexity: 2, skill: 'repair', rarity: 'frequente' },
  { name: 'Armure cuir armée', workbenchType: 'armor', complexity: 3, skill: 'repair', rarity: 'frequente' },
  { name: 'Armure cuir traitée', workbenchType: 'armor', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'Armure cuir ombrée', workbenchType: 'armor', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'Armure cuir bouilli Mk II', workbenchType: 'armor', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
];

// Matériaux armure de métal
const METAL_ARMOR_MODS: RecipeData[] = [
  { name: 'Armure métal peinte', workbenchType: 'armor', complexity: 2, skill: 'repair', rarity: 'frequente' },
  { name: 'Armure métal émaillée', workbenchType: 'armor', complexity: 3, skill: 'repair', rarity: 'frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'Armure métal ombrée', workbenchType: 'armor', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'Armure métal alliée', workbenchType: 'armor', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'Armure métal polie', workbenchType: 'armor', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 2 }] },
];

// Matériaux armure de combat
const COMBAT_ARMOR_MODS: RecipeData[] = [
  { name: 'Armure combat renforcée', workbenchType: 'armor', complexity: 3, skill: 'repair', rarity: 'frequente' },
  { name: 'Armure combat ombrée', workbenchType: 'armor', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'Armure combat fibre de verre', workbenchType: 'armor', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'Armure combat polymère', workbenchType: 'armor', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
];

// Matériaux armure synthétique
const SYNTH_ARMOR_MODS: RecipeData[] = [
  { name: 'Armure synthétique stratifiée', workbenchType: 'armor', complexity: 4, skill: 'repair', rarity: 'frequente' },
  { name: 'Armure synthétique résineuse', workbenchType: 'armor', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'Armure synthétique microfibre de carbone', workbenchType: 'armor', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'Armure synthétique nanofilament', workbenchType: 'armor', complexity: 7, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
];

// Mods génériques d'armure
const GENERIC_ARMOR_MODS: RecipeData[] = [
  { name: 'Structure légère', workbenchType: 'armor', complexity: 2, skill: 'repair', rarity: 'frequente' },
  { name: 'Poches', workbenchType: 'armor', complexity: 2, skill: 'repair', rarity: 'peu_frequente' },
  { name: 'Larges poches', workbenchType: 'armor', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 2 }] },
  { name: 'Revêtement en plomb', workbenchType: 'armor', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 2 }, { perkId: 'science', minRank: 1 }] },
  { name: 'Structure ultra légère', workbenchType: 'armor', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 3 }] },
  { name: 'Rembourrage (torse)', workbenchType: 'armor', complexity: 3, skill: 'repair', rarity: 'frequente' },
  { name: 'Revêtement amianté (torse)', workbenchType: 'armor', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'Densifié (torse)', workbenchType: 'armor', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 3 }] },
  { name: 'BioCommMesh (torse)', workbenchType: 'armor', complexity: 7, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 4 }, { perkId: 'science', minRank: 2 }] },
  { name: 'Pneumatique (torse)', workbenchType: 'armor', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 4 }] },
  { name: 'Bagarreur (bras)', workbenchType: 'armor', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'Renforcé (bras)', workbenchType: 'armor', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'Stabilisé (bras)', workbenchType: 'armor', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 2 }] },
  { name: 'Aérodynamique (bras)', workbenchType: 'armor', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 3 }] },
  { name: 'Alourdie (bras)', workbenchType: 'armor', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 4 }] },
  { name: 'Amorti (jambes)', workbenchType: 'armor', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'Silencieux (jambes)', workbenchType: 'armor', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 2 }] },
];

export const ARMOR_MOD_RECIPES: RecipeData[] = [
  ...BALLISTIC_WEAVE_MODS,
  ...VAULT_SUIT_MODS,
  ...RAIDER_ARMOR_MODS,
  ...LEATHER_ARMOR_MODS,
  ...METAL_ARMOR_MODS,
  ...COMBAT_ARMOR_MODS,
  ...SYNTH_ARMOR_MODS,
  ...GENERIC_ARMOR_MODS,
];

// ── Power armor mod recipes ──────────────────────────────────────────────────

// Améliorations d'armures assistées (upgrades par modèle)
const POWER_ARMOR_UPGRADE_MODS: RecipeData[] = [
  { name: 'AA Pillard II', workbenchType: 'power_armor', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'AA T-45b', workbenchType: 'power_armor', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'AA T-45c', workbenchType: 'power_armor', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 2 }] },
  { name: 'AA T-45d', workbenchType: 'power_armor', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 2 }, { perkId: 'science', minRank: 1 }] },
  { name: 'AA T-45e', workbenchType: 'power_armor', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 3 }, { perkId: 'science', minRank: 1 }] },
  { name: 'AA T-45f', workbenchType: 'power_armor', complexity: 7, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 3 }, { perkId: 'science', minRank: 2 }] },
  { name: 'AA T-51b', workbenchType: 'power_armor', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'AA T-51c', workbenchType: 'power_armor', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 2 }] },
  { name: 'AA T-51d', workbenchType: 'power_armor', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 2 }, { perkId: 'science', minRank: 1 }] },
  { name: 'AA T-51e', workbenchType: 'power_armor', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 3 }, { perkId: 'science', minRank: 1 }] },
  { name: 'AA T-51f', workbenchType: 'power_armor', complexity: 7, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 3 }, { perkId: 'science', minRank: 2 }] },
  { name: 'AA T-60b', workbenchType: 'power_armor', complexity: 3, skill: 'repair', rarity: 'frequente' },
  { name: 'AA T-60c', workbenchType: 'power_armor', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }, { perkId: 'science', minRank: 1 }] },
  { name: 'AA T-60d', workbenchType: 'power_armor', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 2 }, { perkId: 'science', minRank: 2 }] },
  { name: 'AA T-60e', workbenchType: 'power_armor', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 3 }, { perkId: 'science', minRank: 1 }] },
  { name: 'AA T-60f', workbenchType: 'power_armor', complexity: 7, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 3 }, { perkId: 'science', minRank: 2 }] },
  { name: 'AA X-01 Mk II', workbenchType: 'power_armor', complexity: 3, skill: 'repair', rarity: 'frequente' },
  { name: 'AA X-01 Mk III', workbenchType: 'power_armor', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }, { perkId: 'science', minRank: 1 }] },
  { name: 'AA X-01 Mk IV', workbenchType: 'power_armor', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 2 }, { perkId: 'science', minRank: 2 }] },
  { name: 'AA X-01 Mk V', workbenchType: 'power_armor', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 3 }, { perkId: 'science', minRank: 1 }] },
  { name: 'AA X-01 Mk VI', workbenchType: 'power_armor', complexity: 7, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 3 }, { perkId: 'science', minRank: 2 }] },
];

// Systèmes d'armures assistées
const POWER_ARMOR_SYSTEM_MODS: RecipeData[] = [
  { name: 'AA Épurateur de radiations', workbenchType: 'power_armor', complexity: 4, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 2 }] },
  { name: 'AA Détecteur', workbenchType: 'power_armor', complexity: 5, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 3 }] },
  { name: 'AA ATH de visée', workbenchType: 'power_armor', complexity: 5, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 3 }] },
  { name: 'AA Base de données interne', workbenchType: 'power_armor', complexity: 5, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 3 }] },
  { name: 'AA Barre d\'armature soudée', workbenchType: 'power_armor', complexity: 2, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'AA Noyau de réacteur', workbenchType: 'power_armor', complexity: 5, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 3 }] },
  { name: 'AA Purificateur sanguin', workbenchType: 'power_armor', complexity: 4, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 1 }] },
  { name: 'AA Protocoles d\'urgence', workbenchType: 'power_armor', complexity: 6, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 4 }] },
  { name: 'AA Servomoteurs de déplacement assistés', workbenchType: 'power_armor', complexity: 5, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 3 }] },
  { name: 'AA Dynamo cinétique', workbenchType: 'power_armor', complexity: 6, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 4 }] },
  { name: 'AA Pompe médicale', workbenchType: 'power_armor', complexity: 6, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 4 }] },
  { name: 'AA Plaques réactives', workbenchType: 'power_armor', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 4 }] },
  { name: 'AA Bobines Tesla', workbenchType: 'power_armor', complexity: 5, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 3 }] },
  { name: 'AA Stealth Boy', workbenchType: 'power_armor', complexity: 6, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 4 }] },
  { name: 'AA Jetpack', workbenchType: 'power_armor', complexity: 7, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 4 }, { perkId: 'science', minRank: 4 }] },
];

// Blindages d'armures assistées
const POWER_ARMOR_ARMOR_MODS: RecipeData[] = [
  { name: 'AA Poing rouillé', workbenchType: 'power_armor', complexity: 2, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 1 }] },
  { name: 'AA Bracelets hydrauliques', workbenchType: 'power_armor', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 3 }] },
  { name: 'AA Bracelets optimisés', workbenchType: 'power_armor', complexity: 2, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 1 }] },
  { name: 'AA Bracelets Tesla', workbenchType: 'power_armor', complexity: 6, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'blacksmith', minRank: 3 }, { perkId: 'science', minRank: 1 }] },
  { name: 'AA Amortisseurs calibrés', workbenchType: 'power_armor', complexity: 4, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 2 }] },
  { name: 'AA Évent d\'explosion', workbenchType: 'power_armor', complexity: 5, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 3 }] },
  { name: 'AA Servomoteurs à vitesse surmultipliée', workbenchType: 'power_armor', complexity: 5, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 3 }] },
  { name: 'AA Blindage en titane', workbenchType: 'power_armor', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 3 }] },
  { name: 'AA Blindage en plomb', workbenchType: 'power_armor', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'AA Revêtement photovoltaïque', workbenchType: 'power_armor', complexity: 5, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 3 }] },
  { name: 'AA Revêtement antigel', workbenchType: 'power_armor', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'AA Blindage prismatique', workbenchType: 'power_armor', complexity: 4, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 2 }] },
  { name: 'AA Blindage anti-explosion', workbenchType: 'power_armor', complexity: 3, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'science', minRank: 1 }] },
  { name: 'AA Protection IEM (X-01)', workbenchType: 'power_armor', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
];

export const POWER_ARMOR_MOD_RECIPES: RecipeData[] = [
  ...POWER_ARMOR_UPGRADE_MODS,
  ...POWER_ARMOR_SYSTEM_MODS,
  ...POWER_ARMOR_ARMOR_MODS,
];

// ── Robot mod recipes ────────────────────────────────────────────────────────

const ROBOT_ARMOR_MODS: RecipeData[] = [
  { name: 'Armure robot d\'usine', workbenchType: 'robot', complexity: 2, skill: 'repair', rarity: 'frequente' },
  { name: 'Armure robot de stockage d\'usine', workbenchType: 'robot', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'Armure robot plaque de base', workbenchType: 'robot', complexity: 2, skill: 'repair', rarity: 'frequente' },
  { name: 'Armure robot plaque dentelée', workbenchType: 'robot', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'Armure robot plaque néfaste', workbenchType: 'robot', complexity: 3, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 1 }] },
  { name: 'Armure robot plaque toxique', workbenchType: 'robot', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 3 }] },
  { name: 'Armure robot châssis actif', workbenchType: 'robot', complexity: 2, skill: 'repair', rarity: 'frequente' },
  { name: 'Armure robot châssis voltaïque', workbenchType: 'robot', complexity: 4, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 2 }] },
  { name: 'Armure robot châssis hydraulique', workbenchType: 'robot', complexity: 5, skill: 'repair', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'armorer', minRank: 3 }] },
];

const ROBOT_MOD_MODS: RecipeData[] = [
  { name: 'Mod robot bobines de radiation', workbenchType: 'robot', complexity: 5, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'roboticsExpert', minRank: 1 }] },
  { name: 'Mod robot bobines Tesla', workbenchType: 'robot', complexity: 5, skill: 'science', rarity: 'rare', perkRequirements: [{ perkId: 'roboticsExpert', minRank: 2 }, { perkId: 'science', minRank: 1 }] },
  { name: 'Mod robot capteurs de reconnaissance', workbenchType: 'robot', complexity: 5, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'roboticsExpert', minRank: 1 }] },
  { name: 'Mod robot détecteur', workbenchType: 'robot', complexity: 4, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'roboticsExpert', minRank: 1 }] },
  { name: 'Mod robot module de crochetage', workbenchType: 'robot', complexity: 5, skill: 'science', rarity: 'frequente' },
  { name: 'Mod robot module de furtivité', workbenchType: 'robot', complexity: 5, skill: 'science', rarity: 'rare', perkRequirements: [{ perkId: 'roboticsExpert', minRank: 1 }] },
  { name: 'Mod robot module de piratage informatique', workbenchType: 'robot', complexity: 5, skill: 'science', rarity: 'frequente' },
  { name: 'Mod robot module de régénération', workbenchType: 'robot', complexity: 4, skill: 'science', rarity: 'rare', perkRequirements: [{ perkId: 'roboticsExpert', minRank: 2 }, { perkId: 'science', minRank: 2 }] },
  { name: 'Mod robot champ de résistance', workbenchType: 'robot', complexity: 4, skill: 'science', rarity: 'peu_frequente', perkRequirements: [{ perkId: 'roboticsExpert', minRank: 1 }, { perkId: 'science', minRank: 1 }] },
];

export const ROBOT_MOD_RECIPES: RecipeData[] = [
  ...ROBOT_ARMOR_MODS,
  ...ROBOT_MOD_MODS,
];

// ── Chemistry recipes (drugs, explosives, syringe ammo) ─────────────────────

const DRUG_RECIPES: RecipeData[] = [
  {
    name: 'Antibiotiques',
    workbenchType: 'chemistry', complexity: 4, skill: 'science', rarity: 'peu_frequente',
    perkRequirements: [{ perkId: 'chemist', minRank: 1 }],
    resultItemName: 'Antibiotics',
    ingredients: [
      { itemName: 'Rare Materials', quantity: 2 },
      { itemName: 'Brain Fungus', quantity: 3 },
      { itemName: 'Purified Water', quantity: 2 },
      { itemName: 'Stimpak', quantity: 3 },
    ],
  },
  {
    name: 'Bave de Scrito',
    workbenchType: 'chemistry', complexity: 4, skill: 'science', rarity: 'frequente',
    resultItemName: 'Skeeto Spit',
    ingredients: [
      { itemName: 'Blood Pack', quantity: 1 },
      { itemName: 'Bloodleaf', quantity: 1 },
      { itemName: 'Uncommon Materials', quantity: 1 },
      { itemName: 'Common Materials', quantity: 1 },
    ],
  },
  {
    name: 'Boisson rafraichissante',
    workbenchType: 'chemistry', complexity: 5, skill: 'science', rarity: 'frequente',
    resultItemName: 'Refreshing Beverage',
    ingredients: [
      { itemName: 'Rare Materials', quantity: 3 },
      { itemName: 'Blood Pack', quantity: 1 },
      { itemName: 'Purified Water', quantity: 2 },
      { itemName: 'RadAway', quantity: 2 },
      { itemName: 'Stimpak', quantity: 1 },
    ],
  },
  {
    name: 'Buffjet',
    workbenchType: 'chemistry', complexity: 2, skill: 'science', rarity: 'frequente',
    resultItemName: 'Buffjet',
    ingredients: [
      { itemName: 'Buffout', quantity: 1 },
      { itemName: 'Jet', quantity: 1 },
    ],
  },
  {
    name: 'Bufftats',
    workbenchType: 'chemistry', complexity: 2, skill: 'science', rarity: 'frequente',
    resultItemName: 'Bufftats',
    ingredients: [
      { itemName: 'Buffout', quantity: 1 },
      { itemName: 'Mentats', quantity: 1 },
    ],
  },
  {
    name: 'Fureur',
    workbenchType: 'chemistry', complexity: 2, skill: 'science', rarity: 'peu_frequente',
    perkRequirements: [{ perkId: 'chemist', minRank: 1 }],
    resultItemName: 'Fury',
    ingredients: [
      { itemName: 'Berserk', quantity: 1 },
      { itemName: 'Buffout', quantity: 1 },
    ],
  },
  {
    name: 'Jet',
    workbenchType: 'chemistry', complexity: 2, skill: 'science', rarity: 'frequente',
    resultItemName: 'Jet',
    ingredients: [
      { itemName: 'Uncommon Materials', quantity: 2 },
      { itemName: 'Common Materials', quantity: 1 },
    ],
  },
  {
    name: 'Jet Fuel',
    workbenchType: 'chemistry', complexity: 2, skill: 'science', rarity: 'peu_frequente',
    perkRequirements: [{ perkId: 'chemist', minRank: 1 }],
    resultItemName: 'Jet Fuel',
    ingredients: [
      { itemName: 'Flamer Fuel', quantity: 5 },
      { itemName: 'Jet', quantity: 1 },
    ],
  },
  {
    name: 'Kit de réparation de robot',
    workbenchType: 'chemistry', complexity: 4, skill: 'science', rarity: 'frequente',
    resultItemName: 'Robot Repair Kit',
    ingredients: [
      { itemName: 'Rare Materials', quantity: 2 },
      { itemName: 'Fusion Cells', quantity: 4 },
      { itemName: 'Uncommon Materials', quantity: 2 },
      { itemName: 'Common Materials', quantity: 1 },
    ],
  },
  {
    name: 'Mentats',
    workbenchType: 'chemistry', complexity: 3, skill: 'science', rarity: 'frequente',
    resultItemName: 'Mentats',
    ingredients: [
      { itemName: 'Abraxo Cleaner', quantity: 1 },
      { itemName: 'Brain Fungus', quantity: 2 },
      { itemName: 'Uncommon Materials', quantity: 1 },
    ],
  },
  {
    name: 'Mentats Fruits Rouges',
    workbenchType: 'chemistry', complexity: 3, skill: 'science', rarity: 'frequente',
    resultItemName: 'Berry Mentats',
    ingredients: [
      { itemName: 'Rare Materials', quantity: 1 },
      { itemName: 'Mentats', quantity: 1 },
      { itemName: 'Tarberry', quantity: 2 },
    ],
  },
  {
    name: 'Mentats Orange',
    workbenchType: 'chemistry', complexity: 3, skill: 'science', rarity: 'frequente',
    resultItemName: 'Orange Mentats',
    ingredients: [
      { itemName: 'Uncommon Materials', quantity: 1 },
      { itemName: 'Carrot', quantity: 3 },
      { itemName: 'Mentats', quantity: 1 },
    ],
  },
  {
    name: 'Mentats raisin',
    workbenchType: 'chemistry', complexity: 3, skill: 'science', rarity: 'frequente',
    resultItemName: 'Grape Mentats',
    ingredients: [
      { itemName: 'Hubflower', quantity: 2 },
      { itemName: 'Mentats', quantity: 1 },
      { itemName: 'Whiskey', quantity: 1 },
    ],
  },
  {
    name: 'Overdrive',
    workbenchType: 'chemistry', complexity: 3, skill: 'science', rarity: 'peu_frequente',
    perkRequirements: [{ perkId: 'chemist', minRank: 1 }],
    resultItemName: 'Overdrive',
    ingredients: [
      { itemName: 'Rare Materials', quantity: 2 },
      { itemName: 'Nuka-Cola', quantity: 1 },
      { itemName: 'Psycho', quantity: 1 },
    ],
  },
  {
    name: 'Poche de sang luminescent',
    workbenchType: 'chemistry', complexity: 3, skill: 'science', rarity: 'frequente',
    resultItemName: 'Glowing Blood Pack',
    ingredients: [
      { itemName: 'Rare Materials', quantity: 1 },
      { itemName: 'Blood Pack', quantity: 1 },
      { itemName: 'Irradiated Blood', quantity: 1 },
    ],
  },
  {
    name: 'Psycho',
    workbenchType: 'chemistry', complexity: 4, skill: 'science', rarity: 'frequente',
    resultItemName: 'Psycho',
    ingredients: [
      { itemName: 'Rare Materials', quantity: 2 },
      { itemName: 'Hubflower', quantity: 2 },
      { itemName: 'Stimpak', quantity: 1 },
    ],
  },
  {
    name: 'Psychobuff',
    workbenchType: 'chemistry', complexity: 2, skill: 'science', rarity: 'frequente',
    resultItemName: 'Psychobuff',
    ingredients: [
      { itemName: 'Buffout', quantity: 1 },
      { itemName: 'Psycho', quantity: 1 },
    ],
  },
  {
    name: 'Psycho Jet',
    workbenchType: 'chemistry', complexity: 2, skill: 'science', rarity: 'frequente',
    resultItemName: 'Psycho Jet',
    ingredients: [
      { itemName: 'Jet', quantity: 1 },
      { itemName: 'Psycho', quantity: 1 },
    ],
  },
  {
    name: 'RadAway',
    workbenchType: 'chemistry', complexity: 4, skill: 'science', rarity: 'frequente',
    resultItemName: 'RadAway',
    ingredients: [
      { itemName: 'Rare Materials', quantity: 2 },
      { itemName: 'Brain Fungus', quantity: 3 },
      { itemName: 'Common Materials', quantity: 1 },
      { itemName: 'Purified Water', quantity: 1 },
    ],
  },
  {
    name: 'RadAway Dilué',
    workbenchType: 'chemistry', complexity: 2, skill: 'science', rarity: 'frequente',
    resultItemName: 'RadAway (Diluted)',
    ingredients: [
      { itemName: 'RadAway', quantity: 1 },
      { itemName: 'Purified Water', quantity: 1 },
    ],
  },
  {
    name: 'Rad-X Dilué',
    workbenchType: 'chemistry', complexity: 2, skill: 'science', rarity: 'frequente',
    resultItemName: 'Rad-X (Diluted)',
    ingredients: [
      { itemName: 'Rad-X', quantity: 1 },
      { itemName: 'Purified Water', quantity: 1 },
    ],
  },
  {
    name: 'Stimpak',
    workbenchType: 'chemistry', complexity: 3, skill: 'science', rarity: 'frequente',
    resultItemName: 'Stimpak',
    ingredients: [
      { itemName: 'Antiseptic', quantity: 2 },
      { itemName: 'Blood Pack', quantity: 1 },
      { itemName: 'Common Materials', quantity: 1 },
    ],
  },
  {
    name: 'Stimpak Dilué',
    workbenchType: 'chemistry', complexity: 2, skill: 'science', rarity: 'frequente',
    resultItemName: 'Stimpak (Diluted)',
    ingredients: [
      { itemName: 'Stimpak', quantity: 1 },
      { itemName: 'Purified Water', quantity: 1 },
    ],
  },
  {
    name: 'Ultra Jet',
    workbenchType: 'chemistry', complexity: 4, skill: 'science', rarity: 'peu_frequente',
    perkRequirements: [{ perkId: 'chemist', minRank: 1 }],
    resultItemName: 'Ultra Jet',
    ingredients: [
      { itemName: 'Bloodleaf', quantity: 1 },
      { itemName: 'Uncommon Materials', quantity: 1 },
      { itemName: 'Jet', quantity: 1 },
      { itemName: 'Common Materials', quantity: 2 },
    ],
  },
];

const SYRINGE_AMMO_RECIPES: RecipeData[] = [
  {
    name: 'Artibloc',
    workbenchType: 'chemistry', complexity: 5, skill: 'science', rarity: 'frequente',
    resultItemName: 'Antibloc',
    ingredients: [
      { itemName: 'Dirty Water', quantity: 1 },
      { itemName: 'Uncommon Materials', quantity: 2 },
      { itemName: 'Common Materials', quantity: 1 },
      { itemName: 'Stingwing Barb', quantity: 1 },
      { itemName: 'Tarberry', quantity: 2 },
    ],
  },
  {
    name: 'Dangerol',
    workbenchType: 'chemistry', complexity: 4, skill: 'science', rarity: 'frequente',
    resultItemName: 'Dangerol',
    ingredients: [
      { itemName: 'Uncommon Materials', quantity: 3 },
      { itemName: 'Med-X', quantity: 1 },
    ],
  },
  {
    name: 'Embrumaze',
    workbenchType: 'chemistry', complexity: 4, skill: 'science', rarity: 'frequente',
    resultItemName: 'Embrumaze',
    ingredients: [
      { itemName: 'Abraxo Cleaner', quantity: 1 },
      { itemName: 'Asbestos', quantity: 2 },
      { itemName: 'Uncommon Materials', quantity: 1 },
      { itemName: 'Purified Water', quantity: 1 },
    ],
  },
  {
    name: 'Escampoudréine',
    workbenchType: 'chemistry', complexity: 4, skill: 'science', rarity: 'frequente',
    resultItemName: 'Yellow Belly',
    ingredients: [
      { itemName: 'Uncommon Materials', quantity: 5 },
    ],
  },
  {
    name: 'Folie furieuse',
    workbenchType: 'chemistry', complexity: 4, skill: 'science', rarity: 'frequente',
    resultItemName: 'Berserk',
    ingredients: [
      { itemName: 'Uncommon Materials', quantity: 1 },
      { itemName: 'Bloodbug Blood', quantity: 1 },
      { itemName: 'Dirty Water', quantity: 1 },
      { itemName: 'Common Materials', quantity: 1 },
    ],
  },
  {
    name: 'Hémorragie',
    workbenchType: 'chemistry', complexity: 3, skill: 'science', rarity: 'frequente',
    resultItemName: 'Bleed-out',
    ingredients: [
      { itemName: 'Uncommon Materials', quantity: 2 },
      { itemName: 'Common Materials', quantity: 1 },
    ],
  },
  {
    name: 'Larve de mouche bouffie',
    workbenchType: 'chemistry', complexity: 3, skill: 'science', rarity: 'frequente',
    resultItemName: 'Bloatfly Larva',
    ingredients: [
      { itemName: 'Bloatfly Gland', quantity: 1 },
      { itemName: 'Uncommon Materials', quantity: 1 },
      { itemName: 'Psycho', quantity: 1 },
    ],
  },
  {
    name: 'Pax',
    workbenchType: 'chemistry', complexity: 3, skill: 'science', rarity: 'frequente',
    resultItemName: 'Pax',
    ingredients: [
      { itemName: 'Mutfruit', quantity: 2 },
      { itemName: 'Nuka-Cola', quantity: 1 },
      { itemName: 'Common Materials', quantity: 1 },
    ],
  },
  {
    name: 'Venin de radscorpion',
    workbenchType: 'chemistry', complexity: 3, skill: 'science', rarity: 'frequente',
    resultItemName: 'Radscorpion Venom',
    ingredients: [
      { itemName: 'Uncommon Materials', quantity: 1 },
      { itemName: 'Radscorpion Venom', quantity: 1 },
      { itemName: 'Common Materials', quantity: 1 },
    ],
  },
];

const EXPLOSIVE_RECIPES: RecipeData[] = [
  {
    name: 'Cocktail Molotov',
    workbenchType: 'chemistry', complexity: 4, skill: 'explosives', rarity: 'frequente',
    resultItemName: 'Molotov Cocktail',
    ingredients: [
      { itemName: 'Common Materials', quantity: 3 },
      { itemName: 'Uncommon Materials', quantity: 2 },
    ],
  },
  {
    name: 'Grenade à fragmentation',
    workbenchType: 'chemistry', complexity: 5, skill: 'explosives', rarity: 'peu_frequente',
    perkRequirements: [{ perkId: 'demolitionExpert', minRank: 1 }],
    resultItemName: 'Frag Grenade',
    ingredients: [
      { itemName: 'Common Materials', quantity: 2 },
      { itemName: 'Uncommon Materials', quantity: 3 },
    ],
  },
  {
    name: 'Grenade à impulsion',
    workbenchType: 'chemistry', complexity: 5, skill: 'explosives', rarity: 'peu_frequente',
    perkRequirements: [{ perkId: 'demolitionExpert', minRank: 1 }, { perkId: 'science', minRank: 2 }],
    resultItemName: 'Pulse Grenade',
    ingredients: [
      { itemName: 'Uncommon Materials', quantity: 3 },
      { itemName: 'Rare Materials', quantity: 2 },
    ],
  },
  {
    name: 'Grenade à plasma',
    workbenchType: 'chemistry', complexity: 5, skill: 'explosives', rarity: 'peu_frequente',
    perkRequirements: [{ perkId: 'demolitionExpert', minRank: 1 }, { perkId: 'science', minRank: 3 }],
    resultItemName: 'Plasma Grenade',
    ingredients: [
      { itemName: 'Uncommon Materials', quantity: 3 },
      { itemName: 'Rare Materials', quantity: 2 },
    ],
  },
  {
    name: 'Grenade ronde',
    workbenchType: 'chemistry', complexity: 5, skill: 'explosives', rarity: 'peu_frequente',
    perkRequirements: [{ perkId: 'demolitionExpert', minRank: 1 }],
    resultItemName: 'Baseball Grenade',
    ingredients: [
      { itemName: 'Common Materials', quantity: 3 },
      { itemName: 'Uncommon Materials', quantity: 2 },
    ],
  },
  {
    name: 'Mine à capsules',
    workbenchType: 'chemistry', complexity: 5, skill: 'explosives', rarity: 'peu_frequente',
    perkRequirements: [{ perkId: 'demolitionExpert', minRank: 1 }],
    resultItemName: 'Bottlecap Mine',
    ingredients: [
      { itemName: 'Common Materials', quantity: 4 },
      { itemName: 'Uncommon Materials', quantity: 1 },
    ],
  },
  {
    name: 'Mine à fragmentation',
    workbenchType: 'chemistry', complexity: 5, skill: 'explosives', rarity: 'peu_frequente',
    perkRequirements: [{ perkId: 'demolitionExpert', minRank: 1 }],
    resultItemName: 'Frag Mine',
    ingredients: [
      { itemName: 'Common Materials', quantity: 2 },
      { itemName: 'Uncommon Materials', quantity: 3 },
    ],
  },
  {
    name: 'Mine à impulsion',
    workbenchType: 'chemistry', complexity: 5, skill: 'explosives', rarity: 'peu_frequente',
    perkRequirements: [{ perkId: 'demolitionExpert', minRank: 1 }, { perkId: 'science', minRank: 2 }],
    resultItemName: 'Pulse Mine',
    ingredients: [
      { itemName: 'Uncommon Materials', quantity: 3 },
      { itemName: 'Rare Materials', quantity: 2 },
    ],
  },
  {
    name: 'Mine à plasma',
    workbenchType: 'chemistry', complexity: 5, skill: 'explosives', rarity: 'peu_frequente',
    perkRequirements: [{ perkId: 'demolitionExpert', minRank: 1 }, { perkId: 'science', minRank: 3 }],
    resultItemName: 'Plasma Mine',
    ingredients: [
      { itemName: 'Uncommon Materials', quantity: 3 },
      { itemName: 'Rare Materials', quantity: 2 },
    ],
  },
];

export const CHEMISTRY_RECIPES: RecipeData[] = [
  ...DRUG_RECIPES,
  ...SYRINGE_AMMO_RECIPES,
  ...EXPLOSIVE_RECIPES,
];

// ── Cooking recipes ──────────────────────────────────────────────────────────

const DRINK_RECIPES: RecipeData[] = [
  {
    name: 'Purified Water',
    workbenchType: 'cooking', complexity: 1, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Purified Water',
    ingredients: [{ itemName: 'Dirty Water', quantity: 3 }],
  },
  {
    name: 'Jus de fruit mutant',
    workbenchType: 'cooking', complexity: 2, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Mutfruit Juice',
    ingredients: [{ itemName: 'Purified Water', quantity: 1 }, { itemName: 'Mutfruit', quantity: 1 }],
  },
  {
    name: 'Jus de goudrelle',
    workbenchType: 'cooking', complexity: 2, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Tarberry Juice',
    ingredients: [{ itemName: 'Purified Water', quantity: 1 }, { itemName: 'Tarberry', quantity: 1 }],
  },
  {
    name: 'Jus de melon',
    workbenchType: 'cooking', complexity: 2, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Melon Juice',
    ingredients: [{ itemName: 'Purified Water', quantity: 1 }, { itemName: 'Melon', quantity: 1 }],
  },
  {
    name: 'Jus de pomate',
    workbenchType: 'cooking', complexity: 2, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Potato Juice',
    ingredients: [{ itemName: 'Purified Water', quantity: 1 }, { itemName: 'Potato', quantity: 1 }],
  },
  {
    name: 'Gnôle des Terres Désolées',
    workbenchType: 'cooking', complexity: 3, skill: 'survival', rarity: 'rare',
    resultItemName: 'Dirty Wastelander',
    ingredients: [
      { itemName: 'Mutfruit', quantity: 1 },
      { itemName: 'Nuka-Cola', quantity: 1 },
      { itemName: 'Whiskey', quantity: 2 },
    ],
  },
];

// Note: the cooking table has an unnamed first entry (complexity 2, –, Survie, Fréquente)
// that precedes Eau purifiée. This appears to be the "Poste de cuisine" (cooking station) recipe.
const COOKING_STATION_RECIPE: RecipeData = {
  name: 'Poste de cuisine',
  workbenchType: 'cooking', complexity: 2, skill: 'survival', rarity: 'frequente',
};

const FOOD_RECIPES: RecipeData[] = [
  {
    name: 'Bol de nouilles',
    workbenchType: 'cooking', complexity: 2, skill: 'survival', rarity: 'rare',
    resultItemName: 'Noodle Cup',
    ingredients: [{ itemName: 'Dirty Water', quantity: 1 }, { itemName: 'Corn', quantity: 1 }],
  },
  {
    name: 'Brochette d\'écureuil',
    workbenchType: 'cooking', complexity: 2, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Squirrel on a Stick',
    ingredients: [{ itemName: 'Squirrel Bits', quantity: 1 }, { itemName: 'Common Materials', quantity: 1 }],
  },
  {
    name: 'Bouchées d\'écureuil croustillantes',
    workbenchType: 'cooking', complexity: 1, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Crispy Squirrel Bits',
    ingredients: [{ itemName: 'Squirrel Bits', quantity: 1 }],
  },
  {
    name: 'Brochette d\'iguane',
    workbenchType: 'cooking', complexity: 2, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Iguana on a Stick',
    ingredients: [{ itemName: 'Iguana on a Stick', quantity: 1 }, { itemName: 'Common Materials', quantity: 1 }],
  },
  {
    name: 'Côtes de chien',
    workbenchType: 'cooking', complexity: 1, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Dog Ribs',
    ingredients: [{ itemName: 'Stray Dog Meat', quantity: 1 }],
  },
  {
    name: 'Côtes de molosse mutant',
    workbenchType: 'cooking', complexity: 1, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Mutant Hound Ribs',
    ingredients: [{ itemName: 'Mutant Hound Meat', quantity: 1 }],
  },
  {
    name: 'Côtes de yao guai',
    workbenchType: 'cooking', complexity: 1, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Yao Guai Ribs',
    ingredients: [{ itemName: 'Yao Guai Meat', quantity: 1 }],
  },
  {
    name: 'Faux-filet',
    workbenchType: 'cooking', complexity: 1, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Ribeye Steak',
    ingredients: [{ itemName: 'Brahmin Meat', quantity: 1 }],
  },
  {
    name: 'Filet de darillon',
    workbenchType: 'cooking', complexity: 1, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Grilled Radroach',
    ingredients: [{ itemName: 'Radroach Meat', quantity: 1 }],
  },
  {
    name: 'Mouche bouffie grillée',
    workbenchType: 'cooking', complexity: 1, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Grilled Bloatfly',
    ingredients: [{ itemName: 'Bloatfly Meat', quantity: 2 }],
  },
  {
    name: 'Omelette d\'œufs d\'écorcheur',
    workbenchType: 'cooking', complexity: 2, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Deathclaw Omelette',
    ingredients: [{ itemName: 'Blood Pack', quantity: 1 }, { itemName: 'Deathclaw Egg', quantity: 1 }],
  },
  {
    name: 'Omelette d\'œufs de fangeux',
    workbenchType: 'cooking', complexity: 2, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Mirelurk Egg Omelette',
    ingredients: [{ itemName: 'Dirty Water', quantity: 1 }, { itemName: 'Mirelurk Egg', quantity: 1 }],
  },
  {
    name: 'Omelette d\'œufs de radscorpion',
    workbenchType: 'cooking', complexity: 2, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Radscorpion Egg Omelette',
    ingredients: [{ itemName: 'Purified Water', quantity: 1 }, { itemName: 'Radscorpion Egg', quantity: 1 }],
  },
  {
    name: 'Pâté de fangeux',
    workbenchType: 'cooking', complexity: 4, skill: 'survival', rarity: 'rare',
    resultItemName: 'Mirelurk Paste',
    ingredients: [
      { itemName: 'Mirelurk Egg', quantity: 1 },
      { itemName: 'Mirelurk Meat', quantity: 1 },
      { itemName: 'Uncommon Materials', quantity: 1 },
      { itemName: 'Corn', quantity: 1 },
    ],
  },
  {
    name: 'Radcafard grillé',
    workbenchType: 'cooking', complexity: 1, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Grilled Radroach',
    ingredients: [{ itemName: 'Radroach Meat', quantity: 3 }],
  },
  {
    name: 'Radcerf grillé',
    workbenchType: 'cooking', complexity: 1, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Grilled Radstag',
    ingredients: [{ itemName: 'Radstag Meat', quantity: 1 }],
  },
  {
    name: 'Ragoût de radcerf',
    workbenchType: 'cooking', complexity: 4, skill: 'survival', rarity: 'rare',
    resultItemName: 'Radstag Stew',
    ingredients: [
      { itemName: 'Gourd', quantity: 1 },
      { itemName: 'Radstag Meat', quantity: 1 },
      { itemName: 'Silt Bean', quantity: 1 },
      { itemName: 'Vodka', quantity: 1 },
    ],
  },
  {
    name: 'Ragoût d\'iguane',
    workbenchType: 'cooking', complexity: 3, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Iguana Stew',
    ingredients: [
      { itemName: 'Carrot', quantity: 1 },
      { itemName: 'Dirty Water', quantity: 1 },
      { itemName: 'Iguana on a Stick', quantity: 3 },
    ],
  },
  {
    name: 'Rôti de yao guai',
    workbenchType: 'cooking', complexity: 3, skill: 'survival', rarity: 'rare',
    resultItemName: 'Yao Guai Roast',
    ingredients: [
      { itemName: 'Carrot', quantity: 1 },
      { itemName: 'Potato', quantity: 1 },
      { itemName: 'Yao Guai Meat', quantity: 1 },
    ],
  },
  {
    name: 'Soupe de légumes',
    workbenchType: 'cooking', complexity: 3, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Vegetable Soup',
    ingredients: [
      { itemName: 'Carrot', quantity: 1 },
      { itemName: 'Dirty Water', quantity: 1 },
      { itemName: 'Potato', quantity: 1 },
    ],
  },
  {
    name: 'Steak d\'écorcheur',
    workbenchType: 'cooking', complexity: 1, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Stingwing Steak',
    ingredients: [{ itemName: 'Stingwing Meat', quantity: 1 }],
  },
  {
    name: 'Steak de radscorpion',
    workbenchType: 'cooking', complexity: 1, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Radscorpion Steak',
    ingredients: [{ itemName: 'Radscorpion Meat', quantity: 1 }],
  },
  {
    name: 'Steak de rataupe',
    workbenchType: 'cooking', complexity: 1, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Mole Rat Steak',
    ingredients: [{ itemName: 'Mole Rat Meat', quantity: 2 }],
  },
  {
    name: 'Steak de reine des fangeux',
    workbenchType: 'cooking', complexity: 1, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Mirelurk Queen Steak',
    ingredients: [{ itemName: 'Queen Mirelurk Meat', quantity: 1 }],
  },
  {
    name: 'Steak de tique',
    workbenchType: 'cooking', complexity: 1, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Bloodbug Steak',
    ingredients: [{ itemName: 'Bloodbug Meat', quantity: 1 }],
  },
  {
    name: 'Viande de fangeux grillée',
    workbenchType: 'cooking', complexity: 1, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Grilled Mirelurk Meat',
    ingredients: [{ itemName: 'Softshell Mirelurk Meat', quantity: 2 }],
  },
  {
    name: 'Viande de fangeux rôtie',
    workbenchType: 'cooking', complexity: 1, skill: 'survival', rarity: 'frequente',
    resultItemName: 'Roasted Mirelurk Meat',
    ingredients: [{ itemName: 'Mirelurk Meat', quantity: 2 }],
  },
];

export const COOKING_RECIPES: RecipeData[] = [
  COOKING_STATION_RECIPE,
  ...DRINK_RECIPES,
  ...FOOD_RECIPES,
];

export const ALL_RECIPES: RecipeData[] = [
  ...WEAPON_MOD_RECIPES,
  ...ARMOR_MOD_RECIPES,
  ...POWER_ARMOR_MOD_RECIPES,
  ...ROBOT_MOD_RECIPES,
  ...CHEMISTRY_RECIPES,
  ...COOKING_RECIPES,
];
