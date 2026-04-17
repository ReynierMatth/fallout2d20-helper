# Crafting System - Design Spec

## Contexte

L'application fallout2d20-helper assiste les joueurs du JDR Fallout 2d20. Elle dispose deja d'un systeme de personnages (perks, competences, inventaire), d'une encyclopedie d'items, et d'un systeme de mods. Il n'existe pas encore de fonctionnalite de craft.

Les regles de fabrication du JDR couvrent : la creation de mods d'armes/armures/robots/armures assistees, la fabrication de drogues/explosifs/munitions (chimie), la cuisine, et la reparation d'objets. Chaque recette a une complexite, des prerequis d'aptitudes, une competence associee, et des materiaux requis.

## Objectif

Creer une page "Atelier" qui permet aux joueurs de consulter les recettes de fabrication en fonction de leur personnage. L'app est un **assistant de consultation** : elle affiche les informations necessaires (difficulte calculee, materiaux requis, regles) mais ne gere pas l'execution (pas de jet de des, pas de deduction automatique de materiaux).

## Utilisateur cible

Les joueurs, via la fiche de leur personnage.

---

## Architecture de la page

### Route

`/craft` - page accessible depuis la navigation principale et via un raccourci depuis la fiche personnage (`/craft?character=:id`).

### En-tete

- Selecteur de personnage (dropdown des PCs disponibles)
- Preselection via query param `character` quand on arrive depuis la fiche perso
- Sans personnage selectionne : toutes les recettes visibles, sans calcul de difficulte ni verification de materiaux/prerequis

### Corps principal - 2 colonnes

**Colonne gauche :**
- Navigation par type d'etabli : armes, armures, chimie, cuisine, armures assistees, robots
- Liste des recettes pour l'etabli selectionne

**Colonne droite :**
- Panneau de detail de la recette selectionnee

### Filtrage et tri des recettes (avec personnage selectionne)

Trois etats possibles pour chaque recette :

1. **Connue et faisable** (affichage normal, selectionnable) : le personnage possede les aptitudes requises ET les materiaux suffisants
2. **Connue mais materiaux manquants** (selectionnable, indicateur visuel) : aptitudes OK mais materiaux insuffisants
3. **Inconnue** (grisee, visible mais non selectionnable) : prerequis d'aptitude non remplis, ou recette rare non apprise

Ordre d'affichage : faisables > connues sans materiaux > inconnues grisees.

Pour determiner si une recette est "connue" :
- **Frequentes** : connues de tous, toujours selectionnables
- **Peu frequentes** : connues si le personnage possede les aptitudes listees dans la recette
- **Rares** : connues uniquement si marquees manuellement comme apprises (table `character_known_recipes`)

---

## Detail d'une recette

Quand le joueur selectionne une recette, le panneau de droite affiche :

### Nom + rarete
Nom de la recette avec badge de rarete (Frequente / Peu frequente / Rare).

### Section "Prerequis"
- Etabli requis
- Aptitudes necessaires avec indicateur vert/rouge selon les perks du personnage
- Competence utilisee (Reparation, Science, Survie, Explosifs)

### Section "Test de fabrication"
- Formule : `INT + [Competence] | Difficulte : [Complexite] - [Rang competence] = [Difficulte finale]`
- Si difficulte finale = 0 : mention "Reussite automatique possible (sans jet)"
- Marge de complication de base (20 dans le systeme 2d20)

### Section "Materiaux requis"

Deux modes selon le type de recette :

- **Recettes generiques** (armes, armures, armures assistees, robots) : materiaux determines par la table de complexite :

| Complexite | Frequents | Peu frequents | Rares |
|------------|-----------|---------------|-------|
| 1          | 2         | 0             | 0     |
| 2          | 3         | 0             | 0     |
| 3          | 4         | 2             | 0     |
| 4          | 5         | 3             | 0     |
| 5          | 6         | 4             | 2     |
| 6          | 7         | 5             | 3     |
| 7+         | 8         | 6             | 4     |

- **Recettes specifiques** (chimie, cuisine) : liste des ingredients nommes tels que definis dans la recette (ex: "Stimpak x3, Eau purifiee x2")

Chaque ligne de materiau affiche : quantite requise vs quantite en inventaire, indicateur vert (suffisant) / rouge (manquant avec le delta).

### Section "Resultat"
- Temps de fabrication : 1h standard, 20min pour cuisine
- Rappel : "2 PA depenses + reussite = temps divise par 2"
- En cas d'echec : "Objet non fabrique"
- Specificite chimie/cuisine : "Tous les ingredients sont perdus en cas d'echec"
- Complications : "+30min par complication (+10min pour cuisine). Possibilite de perte de materiaux supplementaires"

---

## Reparation

La reparation suit les memes principes mais avec sa propre table de materiaux basee sur la rarete de l'objet :

| Rarete objet | Frequents | Peu frequents | Rares |
|--------------|-----------|---------------|-------|
| 0            | 1         | 0             | 0     |
| 1            | 2         | 0             | 0     |
| 2            | 2         | 1             | 0     |
| 3            | 2         | 2             | 0     |
| 4            | 2         | 2             | 1     |
| 5+           | 3         | 3             | 1     |

- Test : INT + Reparation, difficulte = rarete de l'objet
- Marge de complication augmentee de +1 par mod installe sur l'objet
- Temps : 30min (divise par 2 avec 2 PA, +15min par complication)
- Possibilite d'utiliser un objet du meme type comme "pieces detachees" : fournit les materiaux et reduit la difficulte de 1

La reparation est accessible depuis la page Atelier comme une section/onglet dedie, au meme niveau que les types d'etabli.

---

## Donnees et backend

### Nouvelles tables

**`recipes`**
- `id` (PK)
- `name` (string)
- `workbench_type` (enum: weapon, armor, chemistry, cooking, power_armor, robot)
- `complexity` (integer)
- `skill` (enum: reparation, science, survie, explosifs)
- `rarity` (enum: frequente, peu_frequente, rare)
- `result_mod_id` (FK vers `mods`, nullable - pour les recettes qui produisent un mod)
- `result_item_id` (FK vers `items`, nullable - pour les recettes qui produisent un item, ex: chimie/cuisine)

**`recipe_perks`** - prerequis d'aptitudes
- `recipe_id` (FK)
- `perk_id` (FK)
- `min_rank` (integer)

**`recipe_ingredients`** - uniquement pour chimie/cuisine avec ingredients nommes
- `recipe_id` (FK)
- `item_id` (FK)
- `quantity` (integer)

**`character_known_recipes`** - recettes rares apprises en jeu
- `character_id` (FK)
- `recipe_id` (FK)

### Endpoints API

- `GET /api/recipes` - liste des recettes, filtres optionnels : `workbench_type`
- `GET /api/recipes/:id` - detail avec prerequis et ingredients

Pas de nouvel endpoint pour le personnage : on reutilise les endpoints existants (perks, competences, inventaire). Le croisement se fait cote frontend.

### Seed data

Toutes les recettes du PDF (environ 200+) doivent etre inserees en base via un fichier de seed. Cela couvre :
- Mods d'armures (tissu balistique, revetements, materiaux par type d'armure, mods generiques)
- Drogues, explosifs, munitions seringue (chimie)
- Boissons, nourriture (cuisine)
- Mods d'armures assistees (ameliorations, systemes, blindages)
- Mods de robots (armure, mods)
- Mods d'armes legeres, a energie, lourdes, de corps a corps

---

## Raccourci depuis la fiche personnage

- Bouton/lien "Atelier" dans la fiche personnage, a cote des actions existantes
- Au clic : navigation vers `/craft?character=:id`
- Pas de logique metier, juste un lien contextuel

---

## Gestion des recettes rares

- Dans le detail d'une recette rare grisee : bouton "Marquer comme apprise" (visible uniquement avec un personnage selectionne)
- Cree une entree dans `character_known_recipes`
- La recette passe de grisee a selectionnable
- Action reversible : bouton "Oublier" pour retirer la connaissance

---

## i18n

L'app est bilingue (FR/EN). Tous les noms de recettes, materiaux, labels de la page Atelier doivent etre traduits via i18next, suivant le pattern existant.

---

## Hors scope

- Execution automatique du craft (jet de des, deduction de materiaux)
- Systeme de file d'attente de fabrication
- Construction de colonies/settlements
- Creation d'objets from scratch (seuls les mods et les items avec recettes sont couverts)
