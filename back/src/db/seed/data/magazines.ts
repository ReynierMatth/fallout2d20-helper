/**
 * Magazines data from the official Fallout 2d20 FR rulebook.
 *
 * All magazines share: value 100, rarity 3, weight 0.1
 *
 * Each numbered issue is a separate item.
 * Single-perk publications (no numbered issues) remain a single item.
 *
 * All perks are temporary (one-time use) unless learned permanently
 * via the Comprehension perk.
 */

export interface MagazineItem {
  name: string;              // Unique item name (series name for single-perk, "Series - Issue" for numbered)
  perkDescriptionKey: string; // i18n key for the perk/effect description
  // d20 range info (only for numbered issues from multi-issue series)
  issue?: {
    d20Min: number;
    d20Max: number;
    issueName: string;        // Original issue name (for magazine_issues table)
    effectDescriptionKey: string; // i18n key (same as perkDescriptionKey for issues)
  };
}

// All magazines: value 100, rarity 3, weight 0.1
export const MAGAZINE_VALUE = 100;
export const MAGAZINE_RARITY = 3;
export const MAGAZINE_WEIGHT = 0.1;

export const magazines: MagazineItem[] = [
  // ===== 1. DUCK AND COVER! (À COUVERT !) =====
  {
    name: 'Duck and Cover!',
    perkDescriptionKey: 'magazines.duckAndCover.perk',
  },

  // ===== 2. GUNS AND BULLETS (ARMES ET MUNITIONS) — 10 issues =====
  {
    name: 'Guns and Bullets - Quel avenir pour la chasse ?',
    perkDescriptionKey: 'magazines.gunsAndBullets.1',
    issue: { d20Min: 1, d20Max: 2, issueName: 'Quel avenir pour la chasse ?', effectDescriptionKey: 'magazines.gunsAndBullets.1' },
  },
  {
    name: "Guns and Bullets - Les lasers et la chasse : carnager c'est OK",
    perkDescriptionKey: 'magazines.gunsAndBullets.2',
    issue: { d20Min: 3, d20Max: 4, issueName: "Les lasers et la chasse : carnager c'est OK", effectDescriptionKey: 'magazines.gunsAndBullets.2' },
  },
  {
    name: 'Guns and Bullets - Petites armes pour petites dames',
    perkDescriptionKey: 'magazines.gunsAndBullets.3',
    issue: { d20Min: 5, d20Max: 6, issueName: 'Petites armes pour petites dames', effectDescriptionKey: 'magazines.gunsAndBullets.3' },
  },
  {
    name: 'Guns and Bullets - Flingues de rue à Détroit',
    perkDescriptionKey: 'magazines.gunsAndBullets.4',
    issue: { d20Min: 7, d20Max: 8, issueName: 'Flingues de rue à Détroit', effectDescriptionKey: 'magazines.gunsAndBullets.4' },
  },
  {
    name: 'Guns and Bullets - Éviter ces satanées lois contre les armes !',
    perkDescriptionKey: 'magazines.gunsAndBullets.5',
    issue: { d20Min: 9, d20Max: 10, issueName: 'Éviter ces satanées lois contre les armes !', effectDescriptionKey: 'magazines.gunsAndBullets.5' },
  },
  {
    name: 'Guns and Bullets - La Lune : appareil de fin du monde communiste ?!',
    perkDescriptionKey: 'magazines.gunsAndBullets.6',
    issue: { d20Min: 11, d20Max: 12, issueName: 'La Lune : appareil de fin du monde communiste ?!', effectDescriptionKey: 'magazines.gunsAndBullets.6' },
  },
  {
    name: "Guns and Bullets - Viser et tirer, comme à l'armée",
    perkDescriptionKey: 'magazines.gunsAndBullets.7',
    issue: { d20Min: 13, d20Max: 14, issueName: "Viser et tirer, comme à l'armée", effectDescriptionKey: 'magazines.gunsAndBullets.7' },
  },
  {
    name: 'Guns and Bullets - Protéger son campement des ours',
    perkDescriptionKey: 'magazines.gunsAndBullets.8',
    issue: { d20Min: 15, d20Max: 16, issueName: 'Protéger son campement des ours', effectDescriptionKey: 'magazines.gunsAndBullets.8' },
  },
  {
    name: "Guns and Bullets - Plasma : l'arme de demain",
    perkDescriptionKey: 'magazines.gunsAndBullets.9',
    issue: { d20Min: 17, d20Max: 18, issueName: "Plasma : l'arme de demain", effectDescriptionKey: 'magazines.gunsAndBullets.9' },
  },
  {
    name: 'Guns and Bullets - Guide de la chasse aux Rouges',
    perkDescriptionKey: 'magazines.gunsAndBullets.10',
    issue: { d20Min: 19, d20Max: 20, issueName: 'Guide de la chasse aux Rouges', effectDescriptionKey: 'magazines.gunsAndBullets.10' },
  },

  // ===== 3. MEETING PEOPLE (FAIRE DES RENCONTRES) =====
  {
    name: 'Meeting People',
    perkDescriptionKey: 'magazines.meetingPeople.perk',
  },

  // ===== 4. ¡LA FANTOMA! (FANTÔMES EN TOUS GENRES) =====
  {
    name: '¡La Fantoma!',
    perkDescriptionKey: 'magazines.laFantoma.perk',
  },

  // ===== 5. TUMBLERS TODAY (GORGES ET PÊNES) — 5 issues =====
  {
    name: 'Tumblers Today - Les mystères du passe-partout révélés !',
    perkDescriptionKey: 'magazines.tumblersToday.1',
    issue: { d20Min: 1, d20Max: 4, issueName: 'Les mystères du passe-partout révélés !', effectDescriptionKey: 'magazines.tumblersToday.1' },
  },
  {
    name: 'Tumblers Today - Les épingles à cheveux : plus efficaces que les outils de crochetage ?',
    perkDescriptionKey: 'magazines.tumblersToday.2',
    issue: { d20Min: 5, d20Max: 8, issueName: 'Les épingles à cheveux : plus efficaces que les outils de crochetage ?', effectDescriptionKey: 'magazines.tumblersToday.2' },
  },
  {
    name: "Tumblers Today - Confessions d'un monte-en-l'air",
    perkDescriptionKey: 'magazines.tumblersToday.3',
    issue: { d20Min: 9, d20Max: 12, issueName: "Confessions d'un monte-en-l'air", effectDescriptionKey: 'magazines.tumblersToday.3' },
  },
  {
    name: 'Tumblers Today - Ouvrez toutes les serrures en 5 secondes chrono',
    perkDescriptionKey: 'magazines.tumblersToday.4',
    issue: { d20Min: 13, d20Max: 16, issueName: 'Ouvrez toutes les serrures en 5 secondes chrono', effectDescriptionKey: 'magazines.tumblersToday.4' },
  },
  {
    name: 'Tumblers Today - Certification de serrurier',
    perkDescriptionKey: 'magazines.tumblersToday.5',
    issue: { d20Min: 17, d20Max: 20, issueName: 'Certification de serrurier – Réussissez haut la main', effectDescriptionKey: 'magazines.tumblersToday.5' },
  },

  // ===== 6. GROGNAK THE BARBARIAN (GROGNAK LE BARBARE) — 10 issues =====
  {
    name: 'Grognak the Barbarian - Du sang sur la harpe',
    perkDescriptionKey: 'magazines.grognak.1',
    issue: { d20Min: 1, d20Max: 2, issueName: 'Du sang sur la harpe', effectDescriptionKey: 'magazines.grognak.1' },
  },
  {
    name: "Grognak the Barbarian - Ainsi s'en vint le Malicieux",
    perkDescriptionKey: 'magazines.grognak.2',
    issue: { d20Min: 3, d20Max: 4, issueName: "Ainsi s'en vint le Malicieux", effectDescriptionKey: 'magazines.grognak.2' },
  },
  {
    name: 'Grognak the Barbarian - La jungle des bébés chauves-souris',
    perkDescriptionKey: 'magazines.grognak.3',
    issue: { d20Min: 5, d20Max: 6, issueName: 'La jungle des bébés chauves-souris', effectDescriptionKey: 'magazines.grognak.3' },
  },
  {
    name: 'Grognak the Barbarian - Les charmes de la reine corsaire Queen',
    perkDescriptionKey: 'magazines.grognak.4',
    issue: { d20Min: 7, d20Max: 8, issueName: 'Les charmes de la reine corsaire Queen', effectDescriptionKey: 'magazines.grognak.4' },
  },
  {
    name: 'Grognak the Barbarian - Esclaves démoniaques, sables démoniaques',
    perkDescriptionKey: 'magazines.grognak.5',
    issue: { d20Min: 9, d20Max: 10, issueName: 'Esclaves démoniaques, sables démoniaques', effectDescriptionKey: 'magazines.grognak.5' },
  },
  {
    name: 'Grognak the Barbarian - Maula : la Vierge guerrière de Mars',
    perkDescriptionKey: 'magazines.grognak.6',
    issue: { d20Min: 11, d20Max: 12, issueName: 'Maula : la Vierge guerrière de Mars', effectDescriptionKey: 'magazines.grognak.6' },
  },
  {
    name: 'Grognak the Barbarian - Sale bâtard sans poils !',
    perkDescriptionKey: 'magazines.grognak.7',
    issue: { d20Min: 13, d20Max: 14, issueName: 'Sale bâtard sans poils !', effectDescriptionKey: 'magazines.grognak.7' },
  },
  {
    name: 'Grognak the Barbarian - Égaré dans les neiges de la luxure',
    perkDescriptionKey: 'magazines.grognak.8',
    issue: { d20Min: 15, d20Max: 16, issueName: 'Égaré dans les neiges de la luxure', effectDescriptionKey: 'magazines.grognak.8' },
  },
  {
    name: "Grognak the Barbarian - L'antre des dévoreurs de vierges",
    perkDescriptionKey: 'magazines.grognak.9',
    issue: { d20Min: 17, d20Max: 18, issueName: "L'antre des dévoreurs de vierges", effectDescriptionKey: 'magazines.grognak.9' },
  },
  {
    name: 'Grognak the Barbarian - Quelle est donc cette sorcellerie ?',
    perkDescriptionKey: 'magazines.grognak.10',
    issue: { d20Min: 19, d20Max: 20, issueName: 'Quelle est donc cette sorcellerie ?', effectDescriptionKey: 'magazines.grognak.10' },
  },

  // ===== 7. WASTELAND SURVIVAL GUIDE (GUIDE DE SURVIE DES TERRES DÉSOLÉES) — 7 issues =====
  {
    name: 'Wasteland Survival Guide - Cultiver dans les Terres désolées',
    perkDescriptionKey: 'magazines.wastelandSurvival.1',
    issue: { d20Min: 1, d20Max: 3, issueName: 'Cultiver dans les Terres désolées', effectDescriptionKey: 'magazines.wastelandSurvival.1' },
  },
  {
    name: 'Wasteland Survival Guide - Numéro spécial insecticides',
    perkDescriptionKey: 'magazines.wastelandSurvival.2',
    issue: { d20Min: 4, d20Max: 6, issueName: 'Numéro spécial insecticides', effectDescriptionKey: 'magazines.wastelandSurvival.2' },
  },
  {
    name: 'Wasteland Survival Guide - Le bon côté de la contamination aux radiations',
    perkDescriptionKey: 'magazines.wastelandSurvival.3',
    issue: { d20Min: 7, d20Max: 9, issueName: 'Le bon côté de la contamination aux radiations', effectDescriptionKey: 'magazines.wastelandSurvival.3' },
  },
  {
    name: 'Wasteland Survival Guide - Spécial coupons',
    perkDescriptionKey: 'magazines.wastelandSurvival.4',
    issue: { d20Min: 10, d20Max: 12, issueName: 'Spécial coupons', effectDescriptionKey: 'magazines.wastelandSurvival.4' },
  },
  {
    name: 'Wasteland Survival Guide - Gymnastique aquatique pour les goules',
    perkDescriptionKey: 'magazines.wastelandSurvival.5',
    issue: { d20Min: 13, d20Max: 15, issueName: 'Gymnastique aquatique pour les goules', effectDescriptionKey: 'magazines.wastelandSurvival.5' },
  },
  {
    name: "Wasteland Survival Guide - Les secrets de l'autodéfense",
    perkDescriptionKey: 'magazines.wastelandSurvival.6',
    issue: { d20Min: 16, d20Max: 18, issueName: "Les secrets de l'autodéfense", effectDescriptionKey: 'magazines.wastelandSurvival.6' },
  },
  {
    name: 'Wasteland Survival Guide - Chasser dans les Terres désolées',
    perkDescriptionKey: 'magazines.wastelandSurvival.7',
    issue: { d20Min: 19, d20Max: 20, issueName: 'Chasser dans les Terres désolées', effectDescriptionKey: 'magazines.wastelandSurvival.7' },
  },

  // ===== 8. ASTOUNDINGLY AWESOME TALES (HISTOIRES À DORMIR DEBOUT) — 10 issues =====
  {
    name: "Astoundingly Awesome Tales - L'assaut des hommes-poisson !",
    perkDescriptionKey: 'magazines.awesomeTales.1',
    issue: { d20Min: 1, d20Max: 2, issueName: "L'assaut des hommes-poisson !", effectDescriptionKey: 'magazines.awesomeTales.1' },
  },
  {
    name: "Astoundingly Awesome Tales - L'ascension des mutants !",
    perkDescriptionKey: 'magazines.awesomeTales.2',
    issue: { d20Min: 3, d20Max: 4, issueName: "L'ascension des mutants !", effectDescriptionKey: 'magazines.awesomeTales.2' },
  },
  {
    name: "Astoundingly Awesome Tales - L'attaque des hommes de métal",
    perkDescriptionKey: 'magazines.awesomeTales.3',
    issue: { d20Min: 5, d20Max: 6, issueName: "L'attaque des hommes de métal", effectDescriptionKey: 'magazines.awesomeTales.3' },
  },
  {
    name: 'Astoundingly Awesome Tales - La vengeance du Russe dément !',
    perkDescriptionKey: 'magazines.awesomeTales.4',
    issue: { d20Min: 7, d20Max: 8, issueName: 'La vengeance du Russe dément !', effectDescriptionKey: 'magazines.awesomeTales.4' },
  },
  {
    name: "Astoundingly Awesome Tales - La starlette tireuse d'élite !",
    perkDescriptionKey: 'magazines.awesomeTales.5',
    issue: { d20Min: 9, d20Max: 10, issueName: "La starlette tireuse d'élite !", effectDescriptionKey: 'magazines.awesomeTales.5' },
  },
  {
    name: 'Astoundingly Awesome Tales - La malédiction des calcinés',
    perkDescriptionKey: 'magazines.awesomeTales.6',
    issue: { d20Min: 11, d20Max: 12, issueName: 'La malédiction des calcinés', effectDescriptionKey: 'magazines.awesomeTales.6' },
  },
  {
    name: "Astoundingly Awesome Tales - L'invasion des insectes géants !",
    perkDescriptionKey: 'magazines.awesomeTales.7',
    issue: { d20Min: 13, d20Max: 14, issueName: "L'invasion des insectes géants !", effectDescriptionKey: 'magazines.awesomeTales.7' },
  },
  {
    name: 'Astoundingly Awesome Tales - Lasers mortels !',
    perkDescriptionKey: 'magazines.awesomeTales.8',
    issue: { d20Min: 15, d20Max: 16, issueName: 'Lasers mortels !', effectDescriptionKey: 'magazines.awesomeTales.8' },
  },
  {
    name: 'Astoundingly Awesome Tales - Science et démence !',
    perkDescriptionKey: 'magazines.awesomeTales.9',
    issue: { d20Min: 17, d20Max: 18, issueName: 'Science et démence !', effectDescriptionKey: 'magazines.awesomeTales.9' },
  },
  {
    name: 'Astoundingly Awesome Tales - Encerclé par les morts !',
    perkDescriptionKey: 'magazines.awesomeTales.10',
    issue: { d20Min: 19, d20Max: 20, issueName: 'Encerclé par les morts !', effectDescriptionKey: 'magazines.awesomeTales.10' },
  },

  // ===== 9. FUTURE WEAPONS TODAY (L'AVENIR DES ARMES EST À VOUS) =====
  {
    name: 'Future Weapons Today',
    perkDescriptionKey: 'magazines.futureWeapons.perk',
  },

  // ===== 10. BACKWOODSMAN (L'HOMME DES BOIS) — 10 issues =====
  {
    name: 'Backwoodsman - Dégage de ma pelouse !',
    perkDescriptionKey: 'magazines.backwoodsman.1',
    issue: { d20Min: 1, d20Max: 2, issueName: 'Dégage de ma pelouse !', effectDescriptionKey: 'magazines.backwoodsman.1' },
  },
  {
    name: 'Backwoodsman - Cuisiner à la maison',
    perkDescriptionKey: 'magazines.backwoodsman.2',
    issue: { d20Min: 3, d20Max: 4, issueName: 'Cuisiner à la maison', effectDescriptionKey: 'magazines.backwoodsman.2' },
  },
  {
    name: "Backwoodsman - L'horreur familiale",
    perkDescriptionKey: 'magazines.backwoodsman.3',
    issue: { d20Min: 5, d20Max: 6, issueName: "L'horreur familiale", effectDescriptionKey: 'magazines.backwoodsman.3' },
  },
  {
    name: 'Backwoodsman - Solide comme Bigfoot',
    perkDescriptionKey: 'magazines.backwoodsman.4',
    issue: { d20Min: 7, d20Max: 8, issueName: 'Solide comme Bigfoot', effectDescriptionKey: 'magazines.backwoodsman.4' },
  },
  {
    name: 'Backwoodsman - Lapins carnivores des Appalaches',
    perkDescriptionKey: 'magazines.backwoodsman.5',
    issue: { d20Min: 9, d20Max: 10, issueName: 'Lapins carnivores des Appalaches', effectDescriptionKey: 'magazines.backwoodsman.5' },
  },
  {
    name: 'Backwoodsman - Le massacre des écureuils des Appalaches',
    perkDescriptionKey: 'magazines.backwoodsman.6',
    issue: { d20Min: 11, d20Max: 12, issueName: 'Le massacre des écureuils des Appalaches', effectDescriptionKey: 'magazines.backwoodsman.6' },
  },
  {
    name: "Backwoodsman - L'art du tomahawk",
    perkDescriptionKey: 'magazines.backwoodsman.7',
    issue: { d20Min: 13, d20Max: 14, issueName: "L'art du tomahawk", effectDescriptionKey: 'magazines.backwoodsman.7' },
  },
  {
    name: "Backwoodsman - L'armurier de Harper's Ferry",
    perkDescriptionKey: 'magazines.backwoodsman.8',
    issue: { d20Min: 15, d20Max: 16, issueName: "L'armurier de Harper's Ferry", effectDescriptionKey: 'magazines.backwoodsman.8' },
  },
  {
    name: "Backwoodsman - L'ermite de la rivière Ohio",
    perkDescriptionKey: 'magazines.backwoodsman.9',
    issue: { d20Min: 17, d20Max: 18, issueName: "L'ermite de la rivière Ohio", effectDescriptionKey: 'magazines.backwoodsman.9' },
  },
  {
    name: 'Backwoodsman - Cauchemar dans le jardin',
    perkDescriptionKey: 'magazines.backwoodsman.10',
    issue: { d20Min: 19, d20Max: 20, issueName: 'Cauchemar dans le jardin', effectDescriptionKey: 'magazines.backwoodsman.10' },
  },

  // ===== 11. BOXING TIMES (LA BOXE POUR LES PASSIONNÉS) =====
  {
    name: 'Boxing Times',
    perkDescriptionKey: 'magazines.boxingTimes.perk',
  },

  // ===== 12. MASSACHUSETTS SURGICAL JOURNAL (LE CHIRURGIEN DU MASSACHUSETTS) =====
  {
    name: 'Massachusetts Surgical Journal',
    perkDescriptionKey: 'magazines.massSurgical.perk',
  },

  // ===== 13. PROGRAMMER'S DIGEST (LE PETIT LIVRE DU PROGRAMMATEUR) =====
  {
    name: "Programmer's Digest",
    perkDescriptionKey: 'magazines.programmersDigest.perk',
  },

  // ===== 14. TALES OF A JUNKTOWN JERKY VENDOR =====
  {
    name: 'Tales of a Junktown Jerky Vendor',
    perkDescriptionKey: 'magazines.jerkyVendor.perk',
  },

  // ===== 15. UNSTOPPABLES (LES INCREVABLES) — 5 issues =====
  {
    name: 'Unstoppables - Dr. Brainwash et son armée de dé-capitalistes !',
    perkDescriptionKey: 'magazines.unstoppables.1',
    issue: { d20Min: 1, d20Max: 4, issueName: 'Dr. Brainwash et son armée de dé-capitalistes !', effectDescriptionKey: 'magazines.unstoppables.1' },
  },
  {
    name: "Unstoppables - Qui peut arrêter l'inarrêtable Grog-Na-Rok ?!",
    perkDescriptionKey: 'magazines.unstoppables.2',
    issue: { d20Min: 5, d20Max: 8, issueName: "Qui peut arrêter l'inarrêtable Grog-Na-Rok ?!", effectDescriptionKey: 'magazines.unstoppables.2' },
  },
  {
    name: 'Unstoppables - Péril Rouge contre Ray Manta',
    perkDescriptionKey: 'magazines.unstoppables.3',
    issue: { d20Min: 9, d20Max: 12, issueName: 'Péril Rouge contre Ray Manta', effectDescriptionKey: 'magazines.unstoppables.3' },
  },
  {
    name: 'Unstoppables - Piégé dans la dimension des ptérreurdactyles !',
    perkDescriptionKey: 'magazines.unstoppables.4',
    issue: { d20Min: 13, d20Max: 16, issueName: 'Piégé dans la dimension des ptérreurdactyles !', effectDescriptionKey: 'magazines.unstoppables.4' },
  },
  {
    name: 'Unstoppables - Visitez la galaxie Ux-Ron !',
    perkDescriptionKey: 'magazines.unstoppables.5',
    issue: { d20Min: 17, d20Max: 20, issueName: 'Visitez la galaxie Ux-Ron !', effectDescriptionKey: 'magazines.unstoppables.5' },
  },

  // ===== 16. U.S. COVERT OPERATIONS MANUAL — 10 issues =====
  {
    name: 'U.S. Covert Operations Manual - Siffloter dans les ténèbres',
    perkDescriptionKey: 'magazines.covertOps.1',
    issue: { d20Min: 1, d20Max: 2, issueName: 'FH 5-01 Siffloter dans les ténèbres', effectDescriptionKey: 'magazines.covertOps.1' },
  },
  {
    name: 'U.S. Covert Operations Manual - Le camouflage urbain',
    perkDescriptionKey: 'magazines.covertOps.2',
    issue: { d20Min: 3, d20Max: 4, issueName: 'FH 5-02 Le camouflage urbain', effectDescriptionKey: 'magazines.covertOps.2' },
  },
  {
    name: 'U.S. Covert Operations Manual - Fondamentaux du camouflage facial',
    perkDescriptionKey: 'magazines.covertOps.3',
    issue: { d20Min: 5, d20Max: 6, issueName: 'FH 5-03 Fondamentaux du camouflage facial', effectDescriptionKey: 'magazines.covertOps.3' },
  },
  {
    name: 'U.S. Covert Operations Manual - Ce ne sont pas les soldats que vous recherchez',
    perkDescriptionKey: 'magazines.covertOps.4',
    issue: { d20Min: 7, d20Max: 8, issueName: 'FH 5-04 Ce ne sont pas les soldats que vous recherchez', effectDescriptionKey: 'magazines.covertOps.4' },
  },
  {
    name: 'U.S. Covert Operations Manual - Qui-va-là ?',
    perkDescriptionKey: 'magazines.covertOps.5',
    issue: { d20Min: 9, d20Max: 10, issueName: 'FH 5-05 Qui-va-là ?', effectDescriptionKey: 'magazines.covertOps.5' },
  },
  {
    name: 'U.S. Covert Operations Manual - Parquet grinçant, mort instantanée',
    perkDescriptionKey: 'magazines.covertOps.6',
    issue: { d20Min: 11, d20Max: 12, issueName: 'FH 5-06 Parquet grinçant, mort instantanée', effectDescriptionKey: 'magazines.covertOps.6' },
  },
  {
    name: 'U.S. Covert Operations Manual - Faire tomber les communistes',
    perkDescriptionKey: 'magazines.covertOps.7',
    issue: { d20Min: 13, d20Max: 14, issueName: 'FH 5-07 Faire tomber les communistes', effectDescriptionKey: 'magazines.covertOps.7' },
  },
  {
    name: 'U.S. Covert Operations Manual - Spécial camouflage',
    perkDescriptionKey: 'magazines.covertOps.8',
    issue: { d20Min: 15, d20Max: 16, issueName: 'FH 5-08 Spécial camouflage : buissons, caisses et ruches', effectDescriptionKey: 'magazines.covertOps.8' },
  },
  {
    name: 'U.S. Covert Operations Manual - Le noir vous va si bien',
    perkDescriptionKey: 'magazines.covertOps.9',
    issue: { d20Min: 17, d20Max: 18, issueName: 'FH 5-09 Le noir vous va si bien', effectDescriptionKey: 'magazines.covertOps.9' },
  },
  {
    name: 'U.S. Covert Operations Manual - Sur la pointe des pieds dans les tulipes',
    perkDescriptionKey: 'magazines.covertOps.10',
    issue: { d20Min: 19, d20Max: 20, issueName: 'FH 5-10 Sur la pointe des pieds dans les tulipes', effectDescriptionKey: 'magazines.covertOps.10' },
  },

  // ===== 17. FIXIN' THINGS (RÉPARER TOUT ET N'IMPORTE QUOI) =====
  {
    name: "Fixin' Things",
    perkDescriptionKey: 'magazines.fixinThings.perk',
  },

  // ===== 18. TESLA SCIENCE MAGAZINE (SCIENCE TESLA) — 10 issues =====
  {
    name: 'Tesla Science Magazine - Les robots dirigeront-ils le monde ?',
    perkDescriptionKey: 'magazines.teslaScience.1',
    issue: { d20Min: 1, d20Max: 2, issueName: 'Les robots dirigeront-ils le monde ?', effectDescriptionKey: 'magazines.teslaScience.1' },
  },
  {
    name: "Tesla Science Magazine - Qu'est-ce que le Plasma, d'abord ?",
    perkDescriptionKey: 'magazines.teslaScience.2',
    issue: { d20Min: 3, d20Max: 4, issueName: "Qu'est-ce que le Plasma, d'abord ?", effectDescriptionKey: 'magazines.teslaScience.2' },
  },
  {
    name: "Tesla Science Magazine - La science, c'est pas sorcier !",
    perkDescriptionKey: 'magazines.teslaScience.3',
    issue: { d20Min: 5, d20Max: 6, issueName: "La science, c'est pas sorcier !", effectDescriptionKey: 'magazines.teslaScience.3' },
  },
  {
    name: "Tesla Science Magazine - Technologie de demain pour supersoldats d'aujourd'hui",
    perkDescriptionKey: 'magazines.teslaScience.4',
    issue: { d20Min: 7, d20Max: 8, issueName: "Technologie de demain pour supersoldats d'aujourd'hui", effectDescriptionKey: 'magazines.teslaScience.4' },
  },
  {
    name: "Tesla Science Magazine - Un flingue n'est jamais assez gros !",
    perkDescriptionKey: 'magazines.teslaScience.5',
    issue: { d20Min: 9, d20Max: 10, issueName: "Un flingue n'est jamais assez gros !", effectDescriptionKey: 'magazines.teslaScience.5' },
  },
  {
    name: 'Tesla Science Magazine - Geckos et radiations gamma',
    perkDescriptionKey: 'magazines.teslaScience.6',
    issue: { d20Min: 11, d20Max: 12, issueName: 'Geckos et radiations gamma', effectDescriptionKey: 'magazines.teslaScience.6' },
  },
  {
    name: "Tesla Science Magazine - L'armée des États-Unis dans l'espace",
    perkDescriptionKey: 'magazines.teslaScience.7',
    issue: { d20Min: 13, d20Max: 14, issueName: "L'armée des États-Unis dans l'espace", effectDescriptionKey: 'magazines.teslaScience.7' },
  },
  {
    name: 'Tesla Science Magazine - 10 hits n°1 !!! Rock-o-bot prend le pays par surprise !',
    perkDescriptionKey: 'magazines.teslaScience.8',
    issue: { d20Min: 15, d20Max: 16, issueName: '10 hits n°1 !!! Rock-o-bot prend le pays par surprise !', effectDescriptionKey: 'magazines.teslaScience.8' },
  },
  {
    name: "Tesla Science Magazine - L'avenir de la guerre ?",
    perkDescriptionKey: 'magazines.teslaScience.9',
    issue: { d20Min: 17, d20Max: 18, issueName: "L'avenir de la guerre ?", effectDescriptionKey: 'magazines.teslaScience.9' },
  },
  {
    name: 'Tesla Science Magazine - Relancez le dé',
    perkDescriptionKey: 'magazines.teslaScience.10',
    issue: { d20Min: 19, d20Max: 20, issueName: 'Relancez le dé', effectDescriptionKey: 'magazines.teslaScience.10' },
  },

  // ===== 19. LIVE & LOVE (VIE ET AMOUR) — 10 issues =====
  {
    name: 'Live & Love - Meilleurs amis pour la vie !',
    perkDescriptionKey: 'magazines.liveAndLove.1',
    issue: { d20Min: 1, d20Max: 2, issueName: 'Meilleurs amis pour la vie !', effectDescriptionKey: 'magazines.liveAndLove.1' },
  },
  {
    name: 'Live & Love - Explose ce gars !',
    perkDescriptionKey: 'magazines.liveAndLove.2',
    issue: { d20Min: 3, d20Max: 4, issueName: 'Explose ce gars !', effectDescriptionKey: 'magazines.liveAndLove.2' },
  },
  {
    name: 'Live & Love - En finir avec le gras !',
    perkDescriptionKey: 'magazines.liveAndLove.3',
    issue: { d20Min: 5, d20Max: 6, issueName: 'En finir avec le gras !', effectDescriptionKey: 'magazines.liveAndLove.3' },
  },
  {
    name: 'Live & Love - Une si charmante secrétaire',
    perkDescriptionKey: 'magazines.liveAndLove.4',
    issue: { d20Min: 7, d20Max: 8, issueName: 'Une si charmante secrétaire', effectDescriptionKey: 'magazines.liveAndLove.4' },
  },
  {
    name: "Live & Love - Lève le coude, mais pas trop !",
    perkDescriptionKey: 'magazines.liveAndLove.5',
    issue: { d20Min: 9, d20Max: 10, issueName: "Lève le coude, mais pas trop !", effectDescriptionKey: 'magazines.liveAndLove.5' },
  },
  {
    name: 'Live & Love - Conseils pour hommes mariés',
    perkDescriptionKey: 'magazines.liveAndLove.6',
    issue: { d20Min: 11, d20Max: 12, issueName: 'Conseils pour hommes mariés', effectDescriptionKey: 'magazines.liveAndLove.6' },
  },
  {
    name: "Live & Love - Méfiez-vous du dresseur d'hommes",
    perkDescriptionKey: 'magazines.liveAndLove.7',
    issue: { d20Min: 13, d20Max: 14, issueName: "Méfiez-vous du dresseur d'hommes", effectDescriptionKey: 'magazines.liveAndLove.7' },
  },
  {
    name: 'Live & Love - Une expérience marquante',
    perkDescriptionKey: 'magazines.liveAndLove.8',
    issue: { d20Min: 15, d20Max: 16, issueName: 'Une expérience marquante', effectDescriptionKey: 'magazines.liveAndLove.8' },
  },
  {
    name: "Live & Love - J'ai épousé un robot",
    perkDescriptionKey: 'magazines.liveAndLove.9',
    issue: { d20Min: 17, d20Max: 18, issueName: "J'ai épousé un robot", effectDescriptionKey: 'magazines.liveAndLove.9' },
  },
  {
    name: 'Live & Love - Relancez le dé',
    perkDescriptionKey: 'magazines.liveAndLove.10',
    issue: { d20Min: 19, d20Max: 20, issueName: 'Relancez le dé', effectDescriptionKey: 'magazines.liveAndLove.10' },
  },

  // ===== 20. TRUE POLICE STORIES (VRAIES HISTOIRES DE POLICE) =====
  {
    name: 'True Police Stories',
    perkDescriptionKey: 'magazines.truePolice.perk',
  },
];
