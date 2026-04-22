# Design : Export / Import de personnages

**Date :** 2026-04-19
**Branche :** export-import

---

## Contexte & objectifs

Permettre aux utilisateurs d'exporter un personnage complet en fichier JSON portable, et d'importer ce fichier sur n'importe quelle instance de l'application. Les cas d'usage couverts : partage entre joueurs/MJ, backup local, migration d'instance.

L'export inclut un snapshot complet de l'état du personnage (SPECIAL, skills, perks, inventaire avec mods, HP courant, conditions, caps, etc.).

---

## Format du fichier export

```json
{
  "version": 1,
  "exportedAt": "<ISO 8601 timestamp>",
  "appVersion": "fallout2d20-helper",
  "character": {
    "name": "string",
    "type": "pc | npc",
    "statBlockType": "normal | creature",
    "level": 0,
    "xp": 0,
    "maxHp": 0,
    "currentHp": 0,
    "defense": 0,
    "initiative": 0,
    "meleeDamageBonus": 0,
    "carryCapacity": 0,
    "maxLuckPoints": 0,
    "currentLuckPoints": 0,
    "caps": 0,
    "radiationDamage": 0,
    "special": { "<attribute>": 0 },
    "skills": { "<skill>": 0 },
    "tagSkills": ["string"],
    "survivorTraits": ["string"],
    "perks": [{ "perkId": "string", "rank": 0 }],
    "giftedBonusAttributes": ["string"],
    "exerciseBonuses": ["string"],
    "conditions": ["string"],
    "traits": [{ "name": "string", "description": "string" }],
    "dr": [{ "location": "string", "drPhysical": 0, "drEnergy": 0, "drRadiation": 0, "drPoison": 0 }],
    "inventory": [
      {
        "quantity": 0,
        "equipped": false,
        "equippedLocation": "string | null",
        "item": {
          "name": "string",
          "itemType": "string",
          "value": 0,
          "rarity": 0,
          "weight": 0
        },
        "armorDetails": { "location": "string", "drPhysical": 0, "drEnergy": 0, "drRadiation": 0, "drPoison": 0, "hp": 0 },
        "powerArmorDetails": { "set": "string", "location": "string", "drPhysical": 0, "drEnergy": 0, "drRadiation": 0, "hp": 0 },
        "clothingDetails": { "locations": ["string"], "drPhysical": 0, "drEnergy": 0, "drRadiation": 0, "drPoison": 0 },
        "installedMods": [
          {
            "modName": "string",
            "slot": "string",
            "nameAddKey": "string | null",
            "effects": []
          }
        ]
      }
    ],
    "creatureAttributes": { "<attr>": 0 },
    "creatureSkills": { "<skill>": 0 },
    "creatureAttacks": [
      {
        "name": "string",
        "skill": "string",
        "damage": "string",
        "damageType": "string",
        "damageBonus": 0,
        "fireRate": 0,
        "range": "string",
        "qualities": [{ "quality": "string", "value": 0 }]
      }
    ]
  }
}
```

**Règles :**
- Tous les IDs internes DB sont retirés du fichier.
- Les champs nullable/optionnels (ex. `armorDetails`, `creatureAttributes`) sont omis si non pertinents.
- `originId` est omis (trop couplé à la DB locale) — l'origine n'est pas restaurée à l'import.

---

## Backend

### `GET /api/characters/:id/export`

- Récupère le personnage complet (même logique que `GET /:id` avec toutes les relations).
- Transforme la réponse : retire les IDs internes, embarque les données complètes des items et mods.
- Retourne le JSON avec headers :
  - `Content-Type: application/json`
  - `Content-Disposition: attachment; filename="<name>.json"`

### `POST /api/characters/import`

- Accepte un body JSON correspondant au format ci-dessus.
- **Validation :** vérifie la présence de `version`, `character.name`, `character.type`. Retourne 400 si invalide.
- **Résolution des items :** pour chaque entrée d'inventaire, cherche dans la table `items` par `name` exact (correspondance stricte, sensible à la casse). Si trouvé → utilise l'`itemId`. Si non trouvé → item ignoré, ajouté à la liste de warnings. Les mods installés (`installedMods`) sont résolus de la même façon : chaque mod est un item de type `mod` dans la DB, matché par `modName`.
- **Création :** insère le personnage et toutes ses relations dans une **transaction DB unique** (rollback complet en cas d'erreur).
- **Réponse succès (201) :**
  ```json
  {
    "character": { ...personnage créé... },
    "warnings": [
      { "itemName": "string", "reason": "item not found" }
    ]
  }
  ```
- **Réponse erreur (400/500) :** message d'erreur descriptif.

---

## Frontend

### Composants modifiés

**`CharactersPage.tsx`**
- Ajout d'un bouton "Importer" dans le header (à côté du bouton "Créer").
- Au clic : déclenche un `<input type="file" accept=".json">` caché.
- Après sélection du fichier : lit le contenu, envoie à `POST /api/characters/import`.
- Succès : rafraîchit la liste de personnages + toast de confirmation.
- Warnings : toast secondaire listant les items non trouvés.
- Erreur : toast d'erreur avec le message reçu.

**`CharacterCard.tsx`**
- Ajout d'un bouton/icône "Exporter" dans le menu d'actions de la carte.
- Au clic : appelle `GET /api/characters/:id/export`, déclenche le téléchargement via un `<a href="..." download>` temporaire créé côté client.

### Hook API

Ajout dans `useCharactersApi()` :
- `exportCharacter(id: string): Promise<void>` — appelle l'endpoint export et déclenche le download.
- `importCharacter(file: File): Promise<{ character: Character; warnings: ImportWarning[] }>` — lit le fichier et appelle l'endpoint import.

---

## Gestion d'erreurs

| Cas | Comportement |
|-----|-------------|
| Fichier JSON invalide (parse error) | Toast erreur : "Fichier invalide" |
| Structure manquante (`version`, `name`, `type`) | Toast erreur : message du serveur |
| Items non trouvés à l'import | Toast warning listant les noms manquants |
| Erreur serveur (500) | Toast erreur générique |
| Personnage non trouvé à l'export (404) | Toast erreur |

---

## Ce qui n'est pas couvert

- L'`originId` n'est pas restauré à l'import (dépendance DB locale).
- Pas d'import en masse (plusieurs fichiers à la fois).
- Pas de preview du personnage avant import.
