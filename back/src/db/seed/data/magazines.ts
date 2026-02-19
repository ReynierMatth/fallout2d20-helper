/**
 * Magazines data from the official Fallout 2d20 FR rulebook.
 *
 * All magazines share: value 100, rarity 3, weight 0.1
 *
 * Some publications have a single perk (no numbered issues).
 * Others have multiple issues determined by a d20 roll, each granting a different perk.
 *
 * All perks are temporary (one-time use) unless learned permanently
 * via the Comprehension perk.
 */

export interface MagazineIssue {
  d20Min: number;
  d20Max: number;
  name: string;
  nameKey?: string;
  effectKey: string; // i18n key for effect description
}

export interface MagazineSeries {
  name: string;
  nameKey?: string;
  perkDescriptionKey: string; // i18n key for general series perk description
  issues: MagazineIssue[];   // Empty if single-perk publication
}

// All magazines: value 100, rarity 3, weight 0.1
export const MAGAZINE_VALUE = 100;
export const MAGAZINE_RARITY = 3;
export const MAGAZINE_WEIGHT = 0.1;

export const magazines: MagazineSeries[] = [
  // ===== 1. DUCK AND COVER! (À COUVERT !) =====
  {
    name: 'Duck and Cover!',
    perkDescriptionKey: 'magazines.duckAndCover.perk',
    // Once, when hit by a blast weapon, choose to fall prone → +3 all DR vs that blast.
    // If learned: use each time, costs 1 AP.
    issues: [],
  },

  // ===== 2. GUNS AND BULLETS (ARMES ET MUNITIONS) =====
  {
    name: 'Guns and Bullets',
    perkDescriptionKey: 'magazines.gunsAndBullets.perk',
    // Per issue number, different perk. Roll d20.
    issues: [
      {
        d20Min: 1, d20Max: 2,
        name: 'Quel avenir pour la chasse ?',
        effectKey: 'magazines.gunsAndBullets.1',
        // Attack vs Robot: +2 CD damage
      },
      {
        d20Min: 3, d20Max: 4,
        name: 'Les lasers et la chasse : carnager c\'est OK',
        effectKey: 'magazines.gunsAndBullets.2',
        // Laser weapon attack gains Vicious if it didn't have it
      },
      {
        d20Min: 5, d20Max: 6,
        name: 'Petites armes pour petites dames',
        effectKey: 'magazines.gunsAndBullets.3',
        // Small Guns weapon attack gains Vicious if it didn't have it
      },
      {
        d20Min: 7, d20Max: 8,
        name: 'Flingues de rue à Détroit',
        effectKey: 'magazines.gunsAndBullets.4',
        // Gain 2 AP after a successful attack, must spend immediately
      },
      {
        d20Min: 9, d20Max: 10,
        name: 'Éviter ces satanées lois contre les armes !',
        effectKey: 'magazines.gunsAndBullets.5',
        // When you recover a weapon, gain 2 AP (only for recovering extra components)
      },
      {
        d20Min: 11, d20Max: 12,
        name: 'La Lune : appareil de fin du monde communiste ?!',
        effectKey: 'magazines.gunsAndBullets.6',
        // +2 DR ballistic or energy vs one attack at night
      },
      {
        d20Min: 13, d20Max: 14,
        name: 'Viser et tirer, comme à l\'armée',
        effectKey: 'magazines.gunsAndBullets.7',
        // Aimed ranged attack with non-Accurate weapon: +2 CD damage
      },
      {
        d20Min: 15, d20Max: 16,
        name: 'Protéger son campement des ours',
        effectKey: 'magazines.gunsAndBullets.8',
        // Attack vs Yao Guai: +3 CD damage
      },
      {
        d20Min: 17, d20Max: 18,
        name: 'Plasma : l\'arme de demain',
        effectKey: 'magazines.gunsAndBullets.9',
        // Plasma weapon attack gains Vicious if it didn't have it
      },
      {
        d20Min: 19, d20Max: 20,
        name: 'Guide de la chasse aux Rouges',
        effectKey: 'magazines.gunsAndBullets.10',
        // Attack vs enemy lower level than you: +2 CD damage
      },
    ],
  },

  // ===== 3. MEETING PEOPLE (FAIRE DES RENCONTRES) =====
  {
    name: 'Meeting People',
    perkDescriptionKey: 'magazines.meetingPeople.perk',
    // Once, ignore complications on a Speech test.
    // If learned: once per scene.
    issues: [],
  },

  // ===== 4. ¡LA FANTOMA! (FANTÔMES EN TOUS GENRES) =====
  {
    name: '¡La Fantoma!',
    perkDescriptionKey: 'magazines.laFantoma.perk',
    // On successful Sneak test, spend 1 AP to create a diversion at medium range.
    // If learned: once per scene.
    issues: [],
  },

  // ===== 5. TUMBLERS TODAY (GORGES ET PÊNES) =====
  {
    name: 'Tumblers Today',
    perkDescriptionKey: 'magazines.tumblersToday.perk',
    issues: [
      {
        d20Min: 1, d20Max: 4,
        name: 'Les mystères du passe-partout révélés !',
        effectKey: 'magazines.tumblersToday.1',
        // Reroll 1d20 on a Lockpick test
      },
      {
        d20Min: 5, d20Max: 8,
        name: 'Les épingles à cheveux : plus efficaces que les outils de crochetages ?',
        effectKey: 'magazines.tumblersToday.2',
        // Bobby pin reduces Lockpick difficulty by 2 instead of 1 (0 min)
      },
      {
        d20Min: 9, d20Max: 12,
        name: 'Confessions d\'un monte-en-l\'air',
        effectKey: 'magazines.tumblersToday.3',
        // When scavenging/looting, spend 1 Luck to find 2 + 2 CD bobby pins
      },
      {
        d20Min: 13, d20Max: 16,
        name: 'Ouvrez toutes les serrures en 5 secondes chrono',
        effectKey: 'magazines.tumblersToday.4',
        // When you pick a lock, use AP "reduce duration" option for free
      },
      {
        d20Min: 17, d20Max: 20,
        name: 'Certification de serrurier – Réussissez haut la main',
        effectKey: 'magazines.tumblersToday.5',
        // Spend 1 Luck to ignore complications on a Lockpick test
      },
    ],
  },

  // ===== 6. GROGNAK THE BARBARIAN (GROGNAK LE BARBARE) =====
  {
    name: 'Grognak the Barbarian',
    perkDescriptionKey: 'magazines.grognak.perk',
    issues: [
      {
        d20Min: 1, d20Max: 2,
        name: 'Du sang sur la harpe',
        effectKey: 'magazines.grognak.1',
        // Successful melee attack: +2 CD damage
      },
      {
        d20Min: 3, d20Max: 4,
        name: 'Ainsi s\'en vint le Malicieux',
        effectKey: 'magazines.grognak.2',
        // +1 difficulty for others to spot you
      },
      {
        d20Min: 5, d20Max: 6,
        name: 'La jungle des bébés chauves-souris',
        effectKey: 'magazines.grognak.3',
        // When taking poison damage, gain +3 DR poison
      },
      {
        d20Min: 7, d20Max: 8,
        name: 'Les charmes de la reine corsaire Queen',
        effectKey: 'magazines.grognak.4',
        // Successful melee attack automatically scores a critical hit
      },
      {
        d20Min: 9, d20Max: 10,
        name: 'Esclaves démoniaques, sables démoniaques',
        effectKey: 'magazines.grognak.5',
        // Attack vs Ghouls: +2 CD damage
      },
      {
        d20Min: 11, d20Max: 12,
        name: 'Maula : la Vierge guerrière de Mars',
        effectKey: 'magazines.grognak.6',
        // Melee attack with two-handed melee weapon gains Piercing 1 (or +1 to existing)
      },
      {
        d20Min: 13, d20Max: 14,
        name: 'Sale bâtard sans poils !',
        effectKey: 'magazines.grognak.7',
        // Ignore one complication on a melee attack
      },
      {
        d20Min: 15, d20Max: 16,
        name: 'Égaré dans les neiges de la luxure',
        effectKey: 'magazines.grognak.8',
        // +2 DR ballistic vs one attack
      },
      {
        d20Min: 17, d20Max: 18,
        name: 'L\'antre des dévoreurs de vierges',
        effectKey: 'magazines.grognak.9',
        // +5 carry capacity for one scene
      },
      {
        d20Min: 19, d20Max: 20,
        name: 'Quelle est donc cette sorcellerie ?',
        effectKey: 'magazines.grognak.10',
        // +2 DR energy vs one attack
      },
    ],
  },

  // ===== 7. WASTELAND SURVIVAL GUIDE (GUIDE DE SURVIE DES TERRES DÉSOLÉES) =====
  {
    name: 'Wasteland Survival Guide',
    perkDescriptionKey: 'magazines.wastelandSurvival.perk',
    issues: [
      {
        d20Min: 1, d20Max: 3,
        name: 'Cultiver dans les Terres désolées',
        effectKey: 'magazines.wastelandSurvival.1',
        // Consuming a fruit or vegetable heals double HP
      },
      {
        d20Min: 4, d20Max: 6,
        name: 'Numéro spécial insecticides',
        effectKey: 'magazines.wastelandSurvival.2',
        // +2 all DR vs an Insect attack
      },
      {
        d20Min: 7, d20Max: 9,
        name: 'Le bon côté de la contamination aux radiations',
        effectKey: 'magazines.wastelandSurvival.3',
        // When consuming irradiated food/drink, heal extra HP equal to CD result
      },
      {
        d20Min: 10, d20Max: 12,
        name: 'Spécial coupons',
        effectKey: 'magazines.wastelandSurvival.4',
        // When buying food/drinks, price altered by 10% in your favor
      },
      {
        d20Min: 13, d20Max: 15,
        name: 'Gymnastique aquatique pour les goules',
        effectKey: 'magazines.wastelandSurvival.5',
        // -1 difficulty Athletics test for swimming (0 min)
      },
      {
        d20Min: 16, d20Max: 18,
        name: 'Les secrets de l\'autodéfense',
        effectKey: 'magazines.wastelandSurvival.6',
        // +1 Defense vs a melee attack
      },
      {
        d20Min: 19, d20Max: 20,
        name: 'Chasser dans les Terres désolées',
        effectKey: 'magazines.wastelandSurvival.7',
        // When butchering a killed animal with AP increase, gain 1 bonus AP for this
      },
    ],
  },

  // ===== 8. ASTOUNDINGLY AWESOME TALES (HISTOIRES À DORMIR DEBOUT) =====
  {
    name: 'Astoundingly Awesome Tales',
    perkDescriptionKey: 'magazines.awesomeTales.perk',
    // Per issue: bonus damage or DR vs specific enemy type / weapon type
    issues: [
      {
        d20Min: 1, d20Max: 2,
        name: 'L\'assaut des hommes-poisson !',
        effectKey: 'magazines.awesomeTales.1',
        // +1 CD vs Mirelurks
      },
      {
        d20Min: 3, d20Max: 4,
        name: 'L\'ascension des mutants !',
        effectKey: 'magazines.awesomeTales.2',
        // +1 CD vs Super Mutants
      },
      {
        d20Min: 5, d20Max: 6,
        name: 'L\'attaque des hommes de métal',
        effectKey: 'magazines.awesomeTales.3',
        // +2 DR ballistic and energy vs Robots
      },
      {
        d20Min: 7, d20Max: 8,
        name: 'La vengeance du Russe dément !',
        effectKey: 'magazines.awesomeTales.4',
        // +2 DR poison
      },
      {
        d20Min: 9, d20Max: 10,
        name: 'La starlette tireuse d\'élite !',
        effectKey: 'magazines.awesomeTales.5',
        // +1 CD with Accurate weapons
      },
      {
        d20Min: 11, d20Max: 12,
        name: 'La malédiction des calcinés',
        effectKey: 'magazines.awesomeTales.6',
        // +1 CD vs Ghouls
      },
      {
        d20Min: 13, d20Max: 14,
        name: 'L\'invasion des insectes géants !',
        effectKey: 'magazines.awesomeTales.7',
        // +2 DR radiation
      },
      {
        d20Min: 15, d20Max: 16,
        name: 'Lasers mortels !',
        effectKey: 'magazines.awesomeTales.8',
        // +1 CD with energy weapons
      },
      {
        d20Min: 17, d20Max: 18,
        name: 'Science et démence !',
        effectKey: 'magazines.awesomeTales.9',
        // +2 DR energy
      },
      {
        d20Min: 19, d20Max: 20,
        name: 'Encerclé par les morts !',
        effectKey: 'magazines.awesomeTales.10',
        // +1 CD when spending extra ammo for bonus damage
      },
    ],
  },

  // ===== 9. FUTURE WEAPONS TODAY (L'AVENIR DES ARMES EST À VOUS) =====
  {
    name: 'Future Weapons Today',
    perkDescriptionKey: 'magazines.futureWeapons.perk',
    // Once, overcharge an energy weapon attack: +2 CD damage, weapon can't attack next turn.
    // If learned: once per scene.
    issues: [],
  },

  // ===== 10. BACKWOODSMAN (L'HOMME DES BOIS) =====
  {
    name: 'Backwoodsman',
    perkDescriptionKey: 'magazines.backwoodsman.perk',
    issues: [
      {
        d20Min: 1, d20Max: 2,
        name: 'Dégage de ma pelouse !',
        effectKey: 'magazines.backwoodsman.1',
        // Find double meat from a butchered creature
      },
      {
        d20Min: 3, d20Max: 4,
        name: 'Cuisiner à la maison',
        effectKey: 'magazines.backwoodsman.2',
        // +2 CD damage on a Throwing weapon attack (not explosives)
      },
      {
        d20Min: 5, d20Max: 6,
        name: 'L\'horreur familiale',
        effectKey: 'magazines.backwoodsman.3',
        // -1 difficulty to craft a weapon (0 min)
      },
      {
        d20Min: 7, d20Max: 8,
        name: 'Solide comme Bigfoot',
        effectKey: 'magazines.backwoodsman.4',
        // When scavenging plants, gain double loot
      },
      {
        d20Min: 9, d20Max: 10,
        name: 'Lapins carnivores des Appalaches',
        effectKey: 'magazines.backwoodsman.5',
        // +2 CD damage vs a Mammal or Lizard
      },
      {
        d20Min: 11, d20Max: 12,
        name: 'Le massacre des écureuils des Appalaches',
        effectKey: 'magazines.backwoodsman.6',
        // Cooked food you prepare and eat heals +3 HP
      },
      {
        d20Min: 13, d20Max: 14,
        name: 'L\'art du tomahawk',
        effectKey: 'magazines.backwoodsman.7',
        // -1 difficulty test to avoid catching a disease (0 min)
      },
      {
        d20Min: 15, d20Max: 16,
        name: 'L\'armurier de Harper\'s Ferry',
        effectKey: 'magazines.backwoodsman.8',
        // When you find ammo, find +2 CD extra
      },
      {
        d20Min: 17, d20Max: 18,
        name: 'L\'ermite de la rivière Ohio',
        effectKey: 'magazines.backwoodsman.9',
        // -1 difficulty to repair a damaged object (0 min)
      },
      {
        d20Min: 19, d20Max: 20,
        name: 'Cauchemar dans le jardin',
        effectKey: 'magazines.backwoodsman.10',
        // Heal +2 HP when consuming an Alcoholic beverage
      },
    ],
  },

  // ===== 11. BOXING TIMES (LA BOXE POUR LES PASSIONNÉS) =====
  {
    name: 'Boxing Times',
    perkDescriptionKey: 'magazines.boxingTimes.perk',
    // Once, on successful Unarmed attack + spend AP for damage, add Stun effect.
    // If learned: on every successful Unarmed attack.
    issues: [],
  },

  // ===== 12. MASSACHUSETTS SURGICAL JOURNAL (LE CHIRURGIEN DU MASSACHUSETTS) =====
  {
    name: 'Massachusetts Surgical Journal',
    perkDescriptionKey: 'magazines.massSurgical.perk',
    // Once, when providing medical care and assisting END+Survival test,
    // consider your assistance die as result 1.
    // If learned: once per game session.
    issues: [],
  },

  // ===== 13. PROGRAMMER'S DIGEST (LE PETIT LIVRE DU PROGRAMMATEUR) =====
  {
    name: 'Programmer\'s Digest',
    perkDescriptionKey: 'magazines.programmersDigest.perk',
    // Once, when failing a Science test to hack a terminal (access blocked),
    // decide access is not blocked, allowing another attempt.
    // If learned: every time access would be blocked.
    issues: [],
  },

  // ===== 14. TALES OF A JUNKTOWN JERKY VENDOR =====
  {
    name: 'Tales of a Junktown Jerky Vendor',
    perkDescriptionKey: 'magazines.jerkyVendor.perk',
    // Once, on Barter test, spend 1 Luck to alter price by 10% in your favor.
    // If learned: any Barter test, +1 Luck cost per additional use per session.
    issues: [],
  },

  // ===== 15. UNSTOPPABLES (LES INCREVABLES) =====
  {
    name: 'Unstoppables',
    perkDescriptionKey: 'magazines.unstoppables.perk',
    // Spend Luck points to avoid damage
    issues: [
      {
        d20Min: 1, d20Max: 4,
        name: 'Dr. Brainwash et son armée de dé-capitalistes !',
        effectKey: 'magazines.unstoppables.1',
        // Spend 3 Luck to avoid all damage from a single attack or hazard
      },
      {
        d20Min: 5, d20Max: 8,
        name: 'Qui peut arrêter l\'inarrêtable Grog-Na-Rok ?!',
        effectKey: 'magazines.unstoppables.2',
        // Spend 2 Luck to avoid all damage from a Mutant Human attack (incl. ghouls/super mutants)
      },
      {
        d20Min: 9, d20Max: 12,
        name: 'Péril Rouge contre Ray Manta',
        effectKey: 'magazines.unstoppables.3',
        // Spend 1 Luck to avoid all damage from a blast weapon attack
      },
      {
        d20Min: 13, d20Max: 16,
        name: 'Piégé dans la dimension des ptérreurdactyles !',
        effectKey: 'magazines.unstoppables.4',
        // Spend 1 Luck to avoid all damage from a single melee attack
      },
      {
        d20Min: 17, d20Max: 20,
        name: 'Visitez la galaxie Ux-Ron !',
        effectKey: 'magazines.unstoppables.5',
        // Spend 1 Luck to avoid all energy damage from a single attack
      },
    ],
  },

  // ===== 16. U.S. COVERT OPERATIONS MANUAL =====
  {
    name: 'U.S. Covert Operations Manual',
    perkDescriptionKey: 'magazines.covertOps.perk',
    issues: [
      {
        d20Min: 1, d20Max: 2,
        name: 'FH 5-01 Siffloter dans les ténèbres',
        effectKey: 'magazines.covertOps.1',
        // If spotted while sneaking, +2 DR ballistic vs first attack after being spotted
      },
      {
        d20Min: 3, d20Max: 4,
        name: 'FH 5-02 Le camouflage urbain',
        effectKey: 'magazines.covertOps.2',
        // +1 difficulty for enemies to spot you (doesn't stack with dim light/darkness)
      },
      {
        d20Min: 5, d20Max: 6,
        name: 'FH 5-03 Fondamentaux du camouflage facial',
        effectKey: 'magazines.covertOps.3',
        // +1 all DR vs NPC character attacks
      },
      {
        d20Min: 7, d20Max: 8,
        name: 'FH 5-04 Ce ne sont pas les soldats que vous recherchez',
        effectKey: 'magazines.covertOps.4',
        // +1 CD damage vs NPC characters
      },
      {
        d20Min: 9, d20Max: 10,
        name: 'FH 5-05 Qui-va-là ?',
        effectKey: 'magazines.covertOps.5',
        // When spending 1 Luck to reroll 1d20 on PER test, consider result as 1 instead of rerolling
      },
      {
        d20Min: 11, d20Max: 12,
        name: 'FH 5-06 Parquet grinçant, mort instantanée',
        effectKey: 'magazines.covertOps.6',
        // Once, ignore complications on a Sneak test
      },
      {
        d20Min: 13, d20Max: 14,
        name: 'FH 5-07 Faire tomber les communistes',
        effectKey: 'magazines.covertOps.7',
        // Once, when enemy aims before attacking you, remove aim benefits
      },
      {
        d20Min: 15, d20Max: 16,
        name: 'FH 5-08 Spécial camouflage : buissons, caisses et ruches',
        effectKey: 'magazines.covertOps.8',
        // +2 CD damage on unarmed or knife attack
      },
      {
        d20Min: 17, d20Max: 18,
        name: 'FH 5-09 Le noir vous va si bien',
        effectKey: 'magazines.covertOps.9',
        // Once, when using a Stealth Boy, it lasts one extra turn
      },
      {
        d20Min: 19, d20Max: 20,
        name: 'FH 5-10 Sur la pointe des pieds dans les tulipes',
        effectKey: 'magazines.covertOps.10',
        // When spending 1 Luck to reroll 1d20 on AGI test, consider result as 1 instead of rerolling
      },
    ],
  },

  // ===== 17. FIXIN' THINGS (RÉPARER TOUT ET N'IMPORTE QUOI) =====
  {
    name: 'Fixin\' Things',
    perkDescriptionKey: 'magazines.fixinThings.perk',
    // Once, when repairing, halve component cost (rounded up).
    // If learned: every time you repair.
    issues: [],
  },

  // ===== 18. TESLA SCIENCE MAGAZINE (SCIENCE TESLA) =====
  {
    name: 'Tesla Science Magazine',
    perkDescriptionKey: 'magazines.teslaScience.perk',
    issues: [
      {
        d20Min: 1, d20Max: 2,
        name: 'Les robots dirigeront-ils le monde ?',
        effectKey: 'magazines.teslaScience.1',
        // +2 DR ballistic and energy vs Robots
      },
      {
        d20Min: 3, d20Max: 4,
        name: 'Qu\'est-ce que le Plasma, d\'abord ?',
        effectKey: 'magazines.teslaScience.2',
        // +2 DR ballistic and energy vs plasma weapons
      },
      {
        d20Min: 5, d20Max: 6,
        name: 'La science, c\'est pas sorcier !',
        effectKey: 'magazines.teslaScience.3',
        // +2 CD damage on a blast weapon attack
      },
      {
        d20Min: 7, d20Max: 8,
        name: 'Technologie de demain pour supersoldats d\'aujourd\'hui',
        effectKey: 'magazines.teslaScience.4',
        // After spending 1 fusion core charge, spend 1 Luck → charge not consumed
      },
      {
        d20Min: 9, d20Max: 10,
        name: 'Un flingue n\'est jamais assez gros !',
        effectKey: 'magazines.teslaScience.5',
        // Once, Gatling weapon consumes ammo at 8x rate instead of 10x
      },
      {
        d20Min: 11, d20Max: 12,
        name: 'Geckos et radiations gamma',
        effectKey: 'magazines.teslaScience.6',
        // +2 CD damage vs a Mutant creature
      },
      {
        d20Min: 13, d20Max: 14,
        name: 'L\'armée des États-Unis dans l\'espace',
        effectKey: 'magazines.teslaScience.7',
        // Energy weapon: crit on 3+ damage after DR (instead of 5+)
      },
      {
        d20Min: 15, d20Max: 16,
        name: '10 hits n°1 !!! Rock-o-bot prend le pays par surprise !',
        effectKey: 'magazines.teslaScience.8',
        // Once, when inflicting a critical hit, increase total damage by +2
      },
      {
        d20Min: 17, d20Max: 18,
        name: 'L\'avenir de la guerre ?',
        effectKey: 'magazines.teslaScience.9',
        // Once, Big Guns melee attack: crit on 3+ damage after DR (instead of 5+)
      },
      {
        d20Min: 19, d20Max: 20,
        name: 'Relancez le dé',
        effectKey: 'magazines.teslaScience.10',
        // Reroll on this table
      },
    ],
  },

  // ===== 19. LIVE & LOVE (VIE ET AMOUR) =====
  {
    name: 'Live & Love',
    perkDescriptionKey: 'magazines.liveAndLove.perk',
    // Per issue, group-wide bonuses for one scene
    issues: [
      {
        d20Min: 1, d20Max: 2,
        name: 'Meilleurs amis pour la vie !',
        effectKey: 'magazines.liveAndLove.1',
        // +1 max HP for all group members for one scene
      },
      {
        d20Min: 3, d20Max: 4,
        name: 'Explose ce gars !',
        effectKey: 'magazines.liveAndLove.2',
        // +1 CD damage on all group members' attacks for one scene
      },
      {
        d20Min: 5, d20Max: 6,
        name: 'En finir avec le gras !',
        effectKey: 'magazines.liveAndLove.3',
        // Heal double HP from eating fruits or vegetables for one scene
      },
      {
        d20Min: 7, d20Max: 8,
        name: 'Une si charmante secrétaire',
        effectKey: 'magazines.liveAndLove.4',
        // At the start of a scene, add +1 AP to group reserve
      },
      {
        d20Min: 9, d20Max: 10,
        name: 'Lève le coude, mais pas trop !',
        effectKey: 'magazines.liveAndLove.5',
        // Gain 1 Luck point (lost at end of scene) when consuming an Alcoholic beverage
      },
      {
        d20Min: 11, d20Max: 12,
        name: 'Conseils pour hommes mariés',
        effectKey: 'magazines.liveAndLove.6',
        // +1 DR ballistic for all group members for one scene
      },
      {
        d20Min: 13, d20Max: 14,
        name: 'Méfiez-vous du dresseur d\'hommes',
        effectKey: 'magazines.liveAndLove.7',
        // Group AP reserve can hold 1 extra AP for one scene
      },
      {
        d20Min: 15, d20Max: 16,
        name: 'Une expérience marquante',
        effectKey: 'magazines.liveAndLove.8',
        // Choose another magazine perk you've used but not learned; it applies now
      },
      {
        d20Min: 17, d20Max: 18,
        name: 'J\'ai épousé un robot',
        effectKey: 'magazines.liveAndLove.9',
        // +2 all DR vs Robots for one scene
      },
      {
        d20Min: 19, d20Max: 20,
        name: 'Relancez le dé',
        effectKey: 'magazines.liveAndLove.10',
        // Reroll on this table
      },
    ],
  },

  // ===== 20. TRUE POLICE STORIES (VRAIES HISTOIRES DE POLICE) =====
  {
    name: 'True Police Stories',
    perkDescriptionKey: 'magazines.truePolice.perk',
    // Once, on damage roll, spend 1 Luck to turn up to 3 CD into any result.
    // If learned: once per scene.
    issues: [],
  },
];
