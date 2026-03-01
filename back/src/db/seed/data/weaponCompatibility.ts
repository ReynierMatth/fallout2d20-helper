// Weapon-mod compatibility for Small Guns
// weaponName = item name in DB, modNames = mod item names in DB

export interface WeaponModCompatibility {
  weaponName: string;
  modNames: string[];
}

export const SMALL_GUNS_COMPATIBILITY: WeaponModCompatibility[] = [
  {
    weaponName: '10mm Pistol',
    modNames: [
      // Culasse
      'Calibrée', 'Renforcée', 'Automatique', 'Haute sensibilité', 'Puissante', 'Avancée',
      // Canon
      'Canon long', 'Canon à ouvertures',
      // Poignée
      'Poignée confort', 'Poignée de tireur d\'élite',
      // Chargeur
      'Grand chargeur', 'Chargeur à éjection rapide', 'Grand chargeur à éjection rapide',
      // Viseur
      'Viseur laser', 'Lunette de reconnaissance',
      // Bouche
      'Compensateur', 'Silencieux',
    ],
  },
  {
    weaponName: '.44 Pistol',
    modNames: [
      // Culasse
      'Renforcée', 'Puissante', 'Avancée',
      // Canon
      'Canon compact', 'Canon extra-lourd',
      // Poignée
      'Poignée confort',
      // Viseur
      'Lunette courte', 'Viseur laser', 'Lunette de reconnaissance',
    ],
  },
  {
    weaponName: 'Assault Rifle',
    modNames: [
      // Culasse
      'Calibrée', 'Renforcée', 'Automatique', 'Haute sensibilité', 'Puissante', 'Avancée',
      // Canon
      'Canon long', 'Canon à ouvertures', 'Canon ventilé',
      // Crosse
      'Crosse complète', 'Crosse de tireur d\'élite', 'Crosse à compensateur de recul',
      // Chargeur
      'Grand chargeur', 'Chargeur à éjection rapide', 'Grand chargeur à éjection rapide',
      // Viseur
      'Viseur laser', 'Lunette courte', 'Lunette longue',
      'Lunette de vision nocturne courte', 'Lunette de vision nocturne longue',
      'Lunette de reconnaissance',
      // Bouche
      'Compensateur', 'Silencieux',
    ],
  },
  {
    // Carabine de combat
    weaponName: 'Combat Rifle',
    modNames: [
      // Culasse
      'Calibrée', 'Renforcée', 'Automatique', 'Haute sensibilité', 'Puissante', 'Avancée',
      'Culasse .38', 'Culasse .308',
      // Canon
      'Canon long', 'Canon à ouvertures', 'Canon ventilé',
      // Crosse
      'Crosse complète', 'Crosse de tireur d\'élite', 'Crosse à compensateur de recul',
      // Chargeur
      'Grand chargeur', 'Chargeur à éjection rapide', 'Grand chargeur à éjection rapide',
      // Viseur
      'Viseur laser', 'Lunette courte', 'Lunette longue',
      'Lunette de vision nocturne courte', 'Lunette de vision nocturne longue',
      'Lunette de reconnaissance',
      // Bouche
      'Baïonnette', 'Compensateur', 'Silencieux',
    ],
  },
  {
    // Fusil de combat (= Combat Shotgun dans la DB)
    weaponName: 'Combat Shotgun',
    modNames: [
      // Culasse
      'Calibrée', 'Renforcée', 'Automatique', 'Haute sensibilité', 'Puissante', 'Avancée',
      // Canon
      'Canon long', 'Canon à ouvertures',
      // Crosse
      'Crosse complète', 'Crosse de tireur d\'élite', 'Crosse à compensateur de recul',
      // Chargeur
      'Grand chargeur', 'Chargeur à éjection rapide', 'Grand chargeur à éjection rapide',
      // Viseur
      'Viseur laser', 'Lunette courte', 'Lunette longue',
      'Lunette de vision nocturne courte', 'Lunette de vision nocturne longue',
      'Lunette de reconnaissance',
      // Bouche
      'Baïonnette', 'Compensateur', 'Frein de bouche', 'Silencieux',
    ],
  },
  // TODO: Gauss Rifle — nécessite les mods condensateur (à faire avec les armes à énergie)
  {
    // Fusil de chasse
    weaponName: 'Hunting Rifle',
    modNames: [
      // Culasse
      'Culasse optimisée', 'Calibrée', 'Renforcée', 'Puissante', 'Culasse .38', 'Culasse .50',
      // Canon
      'Canon long', 'Canon à ouvertures', 'Canon ventilé',
      // Crosse
      'Crosse complète', 'Crosse de tireur d\'élite',
      // Chargeur
      'Grand chargeur', 'Chargeur à éjection rapide', 'Grand chargeur à éjection rapide',
      // Viseur
      'Viseur laser', 'Lunette courte', 'Lunette longue',
      'Lunette de vision nocturne courte', 'Lunette de vision nocturne longue',
      'Lunette de reconnaissance',
      // Bouche
      'Baïonnette', 'Silencieux',
    ],
  },
  {
    // Mitraillette
    weaponName: 'Submachine Gun',
    modNames: [
      // Culasse
      'Culasse perforante', 'Renforcée', 'Culasse rapide', 'Puissante',
      // Canon
      'Canon court',
      // Crosse
      'Crosse complète', 'Crosse à compensateur de recul',
      // Chargeur
      'Grand chargeur', 'Chargeur à éjection rapide', 'Grand chargeur à éjection rapide',
      // Viseur
      'Viseur laser',
      // Bouche
      'Compensateur', 'Frein de bouche', 'Silencieux',
    ],
  },
  {
    // Arme à verrou de fortune (Pipe Bolt-Action)
    // Note: pas de poignée ET crosse en même temps; mod crosse → "Fusil à verrou de fortune"
    weaponName: 'Pipe Bolt-Action',
    modNames: [
      // Culasse
      'Calibrée', 'Renforcée', 'Puissante', 'Culasse .38', 'Culasse .50',
      // Canon
      'Canon raccourci', 'Canon long', 'Canon à ouvertures', 'Canon à ailettes',
      // Poignée
      'Poignée de tireur d\'élite',
      // Crosse
      'Crosse standard', 'Crosse de tireur d\'élite', 'Crosse à compensateur de recul',
      // Viseur
      'Viseur laser', 'Lunette courte', 'Lunette longue',
      'Lunette de vision nocturne courte', 'Lunette de vision nocturne longue',
      'Lunette de reconnaissance',
      // Bouche
      'Baïonnette', 'Compensateur', 'Frein de bouche', 'Silencieux',
    ],
  },
  {
    // Fusil à double canon
    weaponName: 'Double-Barrel Shotgun',
    modNames: [
      // Culasse
      'Renforcée', 'Haute sensibilité', 'Puissante', 'Avancée',
      // Canon
      'Canon long', 'Canon scié',
      // Crosse
      'Crosse complète',
      // Viseur
      'Viseur laser',
      // Bouche
      'Frein de bouche',
    ],
  },
  {
    // Arme de fortune (Pipe Gun)
    // Note: pas de poignée ET crosse en même temps; mod crosse → "Fusil de fortune"
    weaponName: 'Pipe Gun',
    modNames: [
      // Culasse
      'Calibrée', 'Renforcée', 'Automatique', 'Haute sensibilité', 'Puissante', 'Culasse .45',
      // Canon
      'Canon long', 'Canon à ouvertures', 'Canon à ailettes',
      // Poignée
      'Poignée de tireur d\'élite',
      // Crosse
      'Crosse standard', 'Crosse de tireur d\'élite', 'Crosse à compensateur de recul',
      // Chargeur
      'Grand chargeur', 'Chargeur à éjection rapide', 'Grand chargeur à éjection rapide',
      // Viseur
      'Viseur laser', 'Lunette courte', 'Lunette longue',
      'Lunette de vision nocturne courte', 'Lunette de vision nocturne longue',
      'Lunette de reconnaissance',
      // Bouche
      'Baïonnette', 'Compensateur', 'Frein de bouche', 'Silencieux',
    ],
  },
  {
    // Revolver de fortune (Pipe Revolver)
    // Note: mod crosse → "Fusil de fortune"
    weaponName: 'Pipe Revolver',
    modNames: [
      // Culasse
      'Calibrée', 'Renforcée', 'Puissante', 'Culasse .38', 'Culasse .308',
      // Canon
      'Canon long', 'Canon à ouvertures', 'Canon à ailettes',
      // Poignée
      'Poignée de tireur d\'élite',
      // Crosse
      'Crosse standard', 'Crosse de tireur d\'élite', 'Crosse à compensateur de recul',
      // Viseur
      'Viseur laser', 'Lunette courte', 'Lunette longue',
      'Lunette de vision nocturne courte', 'Lunette de vision nocturne longue',
      'Lunette de reconnaissance',
      // Bouche
      'Baïonnette', 'Compensateur', 'Frein de bouche', 'Silencieux',
    ],
  },
  {
    // Fusil à clous (Railway Rifle)
    weaponName: 'Railway Rifle',
    modNames: [
      // Culasse
      'Culasse automatique à piston',
      // Canon
      'Canon long',
      // Crosse
      'Crosse à compensateur de recul',
      // Viseur
      'Viseur laser', 'Lunette courte', 'Lunette longue',
      'Lunette de vision nocturne courte', 'Lunette de vision nocturne longue',
      'Lunette de reconnaissance',
      // Bouche
      'Baïonnette',
    ],
  },
  {
    // Pistolet à seringues (Syringer)
    weaponName: 'Syringer',
    modNames: [
      // Canon
      'Canon raccourci', 'Canon long',
      // Crosse
      'Crosse de tireur d\'élite', 'Crosse à compensateur de recul',
      // Viseur
      'Viseur laser', 'Lunette courte', 'Lunette longue',
      'Lunette de vision nocturne courte', 'Lunette de vision nocturne longue',
      'Lunette de reconnaissance',
    ],
  },
];


export const ENERGY_WEAPONS_COMPATIBILITY: WeaponModCompatibility[] = [
  {
    // Laser de l'Institut → mod crosse renomme l'arme en "Fusil de l'Institut"
    weaponName: 'Institute Laser',
    modNames: [
      // Condensateur
      'Stimulateur de photons', 'Amplificateur d\'ondes Bêta',
      'Condensateur amélioré', 'Agitateur de photons',
      // Canon
      'Canon long', 'Canon automatique', 'Canon amélioré',
      // Crosse
      'Crosse standard',
      // Viseur
      'Viseur laser', 'Lunette courte', 'Lunette longue',
      'Lunette de vision nocturne courte', 'Lunette de vision nocturne longue',
      'Lunette de reconnaissance',
    ],
  },
  {
    // Arme laser (pistolet par défaut) → mod crosse renomme en "Fusil laser"
    weaponName: 'Laser Pistol',
    modNames: [
      // Condensateur
      'Stimulateur de photons', 'Amplificateur d\'ondes Bêta',
      'Condensateur amélioré', 'Agitateur de photons',
      // Canon
      'Canon long', 'Canon automatique', 'Canon de précision', 'Canon amélioré',
      // Poignée
      'Poignée de tireur d\'élite',
      // Crosse → rename en "Fusil laser"
      'Crosse standard', 'Crosse de tireur d\'élite', 'Crosse à compensateur de recul',
      // Viseur
      'Viseur laser', 'Lunette courte', 'Lunette longue',
      'Lunette de vision nocturne courte', 'Lunette de vision nocturne longue',
      'Lunette de reconnaissance',
      // Bouche
      'Diviseur de rayon', 'Concentrateur de faisceau', 'Lentille à gyrocompensation',
    ],
  },
  {
    // Arme plasma (pistolet par défaut) → mod crosse renomme en "Fusil plasma"
    weaponName: 'Plasma Gun',
    modNames: [
      // Condensateur
      'Stimulateur de photons', 'Amplificateur d\'ondes Bêta',
      'Condensateur amélioré', 'Agitateur de photons',
      // Canon
      'Diviseur', 'Canon automatique', 'Canon de précision',
      'Canon lance-flammes', 'Canon amélioré',
      // Crosse → rename en "Fusil plasma"
      'Crosse standard', 'Crosse de tireur d\'élite', 'Crosse à compensateur de recul',
      // Viseur
      'Viseur laser', 'Lunette courte', 'Lunette longue',
      'Lunette de vision nocturne courte', 'Lunette de vision nocturne longue',
      'Lunette de reconnaissance',
    ],
  },
  {
    // Pistolet Gamma — tous les mods lui sont réservés
    weaponName: 'Gamma Gun',
    modNames: [
      // Parabole
      'Parabole à renfoncement',
      // Bouche
      'Antenne de transmission électrique', 'Répéteur de signal',
    ],
  },
  {
    // Mousquet laser — condensateurs spécifiques + mods partagés
    weaponName: 'Laser Musket',
    modNames: [
      // Condensateur (exclusifs au mousquet laser)
      'Condensateur à trois charges', 'Condensateur à quatre charges',
      'Condensateur à cinq charges', 'Condensateur à six charges',
      // Canon
      'Canon long', 'Canon court à fixation', 'Canon long à fixation',
      // Crosse
      'Crosse complète (énergie)',
      // Viseur
      'Viseur laser', 'Lunette courte', 'Lunette longue',
      'Lunette de vision nocturne courte', 'Lunette de vision nocturne longue',
      'Lunette de reconnaissance',
      // Bouche
      'Diviseur de rayon', 'Concentrateur de faisceau', 'Lentille à gyrocompensation',
    ],
  },
];

export const BIG_GUNS_COMPATIBILITY: WeaponModCompatibility[] = [
  {
    // Lance-flammes
    weaponName: 'Flamer',
    modNames: [
      // Carburant
      'Réservoir à napalm',
      // Canon (version spécifique lance-flammes)
      'Canon long (lance-flammes)',
      // Réservoir à propergol
      'Grand réservoir', 'Réservoir géant',
      // Buse
      'Buse de compression', 'Buse de vaporisation',
    ],
  },
  {
    // Minigun
    weaponName: 'Minigun',
    modNames: [
      // Canon
      'Canon grande vitesse', 'Triple canon (minigun)',
      // Viseur
      'Viseur d\'Artilleur (minigun)',
      // Bouche
      'Broyeur',
    ],
  },
  {
    // Laser Gatling
    weaponName: 'Gatling Laser',
    modNames: [
      // Condensateur
      'Stimulateur de photons (Gatling)', 'Amplificateur d\'ondes Bêta (Gatling)',
      'Condensateur amélioré (Gatling)', 'Agitateur de photons (Gatling)',
      // Canon
      'Canons à chargement',
      // Viseur
      'Viseur laser (Gatling)',
      // Buse
      'Concentrateur de faisceau (Gatling)',
    ],
  },
  {
    // Lance-missiles
    weaponName: 'Missile Launcher',
    modNames: [
      // Canon
      'Triple canon', 'Quadruple canon',
      // Viseur
      'Lunette (lance-missiles)', 'Lunette de vision nocturne (lance-missiles)',
      'Ordinateur de visée',
      // Bouche
      'Baïonnette (lance-missiles)', 'Stabilisateur',
    ],
  },
  {
    // Junk Jet — mods de bouche exclusifs + crosse/canon/viseur propres
    weaponName: 'Junk Jet',
    modNames: [
      // Canon (réutilise le Canon long des armes légères — mêmes stats)
      'Canon long',
      // Crosse (version arme lourde, stats différentes)
      'Crosse à compensateur de recul (lourd)',
      // Viseur
      'Viseur d\'Artilleur',
      // Bouche
      'Module d\'électrification', 'Module de combustion',
    ],
  },
];

export const MELEE_WEAPONS_COMPATIBILITY: WeaponModCompatibility[] = [
  { weaponName: 'Sword', modNames: ['Lame dentelée (épée)', 'Lame électrifiée', 'Lame dentelée électrifiée', 'Module d\'étourdissement'] },
  { weaponName: 'Combat Knife', modNames: ['Lame dentelée (couteau)', 'Lame furtive'] },
  { weaponName: 'Machete', modNames: ['Lame dentelée (machette)'] },
  { weaponName: 'Ripper', modNames: ['Lame courbe', 'Lame rallongée'] },
  { weaponName: 'Shishkebab', modNames: ['Jets de flammes supplémentaires'] },
  { weaponName: 'Switchblade', modNames: ['Lame dentelée (cran)'] },
  {
    weaponName: 'Baseball Bat',
    modNames: ['Barbelé', 'À pointes', 'Affûté', 'À chaînes', 'À lames'],
  },
  {
    weaponName: 'Aluminum Baseball Bat',
    modNames: ['Barbelé', 'À pointes', 'Affûté', 'À chaînes', 'À lames'],
  },
  { weaponName: 'Board', modNames: ['À pointes (planche)', 'Perforant', 'À lames (planche)'] },
  { weaponName: 'Lead Pipe', modNames: ['À pointes (tuyau)', 'Lourd'] },
  { weaponName: 'Pipe Wrench', modNames: ['À crochets', 'Lourd (clé)', 'Perforant (clé)', 'Extralourd'] },
  { weaponName: 'Pool Cue', modNames: ['Barbelé (queue)', 'Affûté (queue)'] },
  { weaponName: 'Rolling Pin', modNames: ['À pointes (rouleau)', 'Affûté (rouleau)'] },
  { weaponName: 'Baton', modNames: ['Électrifié', 'Module d\'étourdissement (matraque)'] },
  { weaponName: 'Sledgehammer', modNames: ['Perforant (masse)', 'Lourd (masse)'] },
  { weaponName: 'Super Sledge', modNames: ['Bobine thermique', 'Module d\'étourdissement (super masse)'] },
  { weaponName: 'Tire Iron', modNames: ['À lames (démonte-pneu)'] },
  { weaponName: 'Walking Cane', modNames: ['Barbelé (canne)', 'À pointes (canne)'] },
  { weaponName: 'Boxing Glove', modNames: ['À pointes (gant)', 'Perforant (gant)', 'Revêtement en plomb'] },
  { weaponName: 'Deathclaw Gauntlet', modNames: ['Griffe supplémentaire'] },
  { weaponName: 'Knuckles', modNames: ['Affûté (poing)', 'À pointes (poing)', 'Perforant (poing)', 'À lames (poing)'] },
  { weaponName: 'Power Fist', modNames: ['Perforant (poing assisté)', 'Bobine thermique (poing assisté)'] },
];

export const ALL_WEAPON_MOD_COMPATIBILITY: WeaponModCompatibility[] = [
  ...SMALL_GUNS_COMPATIBILITY,
  ...ENERGY_WEAPONS_COMPATIBILITY,
  ...BIG_GUNS_COMPATIBILITY,
  ...MELEE_WEAPONS_COMPATIBILITY,
];

