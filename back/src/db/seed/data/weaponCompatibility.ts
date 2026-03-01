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


export const ALL_WEAPON_MOD_COMPATIBILITY: WeaponModCompatibility[] = [
  ...SMALL_GUNS_COMPATIBILITY,
];
