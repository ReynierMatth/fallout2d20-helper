# Export / Import de personnages — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un endpoint export JSON par personnage et un endpoint import, exposés via un bouton Export sur chaque CharacterCard et un bouton Import sur la CharactersPage.

**Architecture:** Deux nouveaux endpoints backend (`GET /:id/export`, `POST /import`) avec transformation des données (strip des IDs, résolution des items par nom). Le frontend déclenche le téléchargement côté client via Blob + URL.createObjectURL, et envoie le fichier lu côté client via JSON body.

**Tech Stack:** Express + Drizzle ORM (backend), React + TanStack Query + lucide-react (frontend), i18next pour les labels.

> **Note sur les tests :** Le projet n'a pas de framework de test configuré (ni back ni front). Les étapes de vérification sont donc manuelles (curl + browser).

---

## Structure des fichiers

| Fichier | Action | Responsabilité |
|---------|--------|----------------|
| `back/src/routes/characters.ts` | Modifier | Ajouter `buildExportData`, `GET /:id/export`, `POST /import` |
| `front/src/services/api.ts` | Modifier | Ajouter `ImportWarning`, `ImportCharacterResponse`, méthodes `exportCharacter` et `importCharacter` dans `charactersApi` |
| `front/src/hooks/useCharactersApi.ts` | Modifier | Ajouter `exportCharacter` et `importCharacter` au hook et à l'interface |
| `front/src/ui/components/character/CharacterCard.tsx` | Modifier | Ajouter prop `onExport?` et bouton Export |
| `front/src/ui/pages/CharactersPage.tsx` | Modifier | Ajouter bouton Import, file picker, handlers, feedback inline |
| `front/src/i18n/locales/en.ts` | Modifier | Ajouter clés `export`, `import`, `importSuccess`, `importError`, `importMissingItems` |
| `front/src/i18n/locales/fr.ts` | Modifier | Même clés en français |

---

## Task 1 : Backend — Helper buildExportData + endpoint GET /:id/export

**Files:**
- Modify: `back/src/routes/characters.ts` (après la fonction `getFullCharacter`, vers ligne 282)

- [ ] **Step 1 : Ajouter la fonction `buildExportData` après `getFullCharacter`**

Insérer après la ligne `}` qui ferme `getFullCharacter` (après ligne 282) :

```typescript
function buildExportData(character: NonNullable<Awaited<ReturnType<typeof getFullCharacter>>>) {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    appVersion: 'fallout2d20-helper',
    character: {
      name: character.name,
      type: character.type,
      statBlockType: character.statBlockType,
      level: character.level,
      xp: character.xp,
      maxHp: character.maxHp,
      currentHp: character.currentHp,
      defense: character.defense,
      initiative: character.initiative,
      meleeDamageBonus: character.meleeDamageBonus,
      carryCapacity: character.carryCapacity,
      maxLuckPoints: character.maxLuckPoints,
      currentLuckPoints: character.currentLuckPoints,
      caps: character.caps,
      radiationDamage: character.radiationDamage,
      special: character.special,
      skills: character.skills,
      tagSkills: character.tagSkills,
      survivorTraits: character.survivorTraits,
      perks: character.perks,
      giftedBonusAttributes: character.giftedBonusAttributes,
      exerciseBonuses: character.exerciseBonuses,
      conditions: character.conditions,
      dr: character.dr,
      traits: character.traits.map((t) => ({
        name: t.name,
        description: t.description,
        ...(t.nameKey && { nameKey: t.nameKey }),
        ...(t.descriptionKey && { descriptionKey: t.descriptionKey }),
      })),
      inventory: character.inventory.map((inv) => ({
        quantity: inv.quantity,
        equipped: inv.equipped,
        equippedLocation: inv.equippedLocation ?? null,
        item: {
          name: inv.item.name,
          itemType: inv.item.itemType,
          value: inv.item.value,
          rarity: inv.item.rarity,
          weight: inv.item.weight,
        },
        ...(inv.armorDetails && { armorDetails: inv.armorDetails }),
        ...(inv.powerArmorDetails && { powerArmorDetails: inv.powerArmorDetails }),
        ...(inv.clothingDetails && { clothingDetails: inv.clothingDetails }),
        installedMods: inv.installedMods.map((mod) => ({
          modName: mod.modName,
          slot: mod.slot,
          ...(mod.nameAddKey && { nameAddKey: mod.nameAddKey }),
        })),
      })),
      ...(character.creatureAttributes && { creatureAttributes: character.creatureAttributes }),
      ...(character.creatureSkills && { creatureSkills: character.creatureSkills }),
      ...(character.creatureAttacks && { creatureAttacks: character.creatureAttacks }),
    },
  };
}
```

- [ ] **Step 2 : Ajouter le endpoint `GET /:id/export`**

Insérer après le endpoint `GET /:id` existant (après la route qui retourne un seul personnage, vers ligne ~326) :

```typescript
// Export a character as a portable JSON file
router.get('/:id/export', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const character = await getFullCharacter(id);
    if (!character) return res.status(404).json({ error: 'Character not found' });

    const exportData = buildExportData(character);
    const filename = `${character.name.replace(/[^a-z0-9]/gi, '_')}.json`;

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.json(exportData);
  } catch (error) {
    console.error('Error exporting character:', error);
    res.status(500).json({ error: 'Failed to export character' });
  }
});
```

- [ ] **Step 3 : Vérifier manuellement**

Démarrer le backend :
```bash
cd back && npm run dev
```

Tester avec curl (remplacer `1` par l'ID d'un personnage existant) :
```bash
curl -s http://localhost:3001/api/characters/1/export | head -50
```

Résultat attendu : JSON avec `version`, `exportedAt`, `appVersion`, `character` sans IDs DB.

- [ ] **Step 4 : Commit**

```bash
git add back/src/routes/characters.ts
git commit -m "feat: add character export endpoint (GET /:id/export)"
```

---

## Task 2 : Backend — Endpoint POST /import

**Files:**
- Modify: `back/src/routes/characters.ts` (juste avant `router.post('/:id/duplicate', ...)`, vers ligne 720)

- [ ] **Step 1 : Ajouter le endpoint `POST /import`**

Insérer juste avant la ligne `router.post('/:id/duplicate', async (req, res) => {` :

```typescript
// Import a character from an exported JSON file
router.post('/import', async (req, res) => {
  try {
    const data = req.body;

    if (!data.version || !data.character?.name || !data.character?.type) {
      return res.status(400).json({ error: 'Invalid export file: missing version, character.name, or character.type' });
    }

    const char = data.character;
    const warnings: { itemName: string; reason: string }[] = [];
    let newCharId!: number;

    await db.transaction(async (tx) => {
      // 1. Insert character base record
      const [newChar] = await tx.insert(characters).values({
        name: char.name,
        type: char.type,
        statBlockType: char.statBlockType ?? 'normal',
        level: char.level ?? 1,
        xp: char.xp ?? 0,
        maxHp: char.maxHp ?? 10,
        currentHp: char.currentHp ?? char.maxHp ?? 10,
        defense: char.defense ?? 1,
        initiative: char.initiative ?? 10,
        meleeDamageBonus: char.meleeDamageBonus ?? 0,
        carryCapacity: char.carryCapacity ?? 150,
        maxLuckPoints: char.maxLuckPoints ?? 0,
        currentLuckPoints: char.currentLuckPoints ?? 0,
        caps: char.caps ?? 0,
        radiationDamage: char.radiationDamage ?? 0,
        creatureAttributes: char.creatureAttributes ?? null,
        creatureSkills: char.creatureSkills ?? null,
        creatureAttacks: char.creatureAttacks ?? null,
      }).returning();

      newCharId = newChar.id;

      // 2. SPECIAL
      if (char.special) {
        const specialEntries = Object.entries(char.special);
        if (specialEntries.length > 0) {
          await tx.insert(characterSpecial).values(
            specialEntries.map(([attribute, value]) => ({
              characterId: newCharId,
              attribute: attribute as any,
              value: value as number,
            }))
          );
        }
      }

      // 3. Skills
      if (char.skills) {
        const skillEntries = Object.entries(char.skills).filter(([, rank]) => (rank as number) > 0);
        if (skillEntries.length > 0) {
          await tx.insert(characterSkills).values(
            skillEntries.map(([skill, rank]) => ({
              characterId: newCharId,
              skill: skill as any,
              rank: rank as number,
            }))
          );
        }
      }

      // 4. Tag skills
      if (char.tagSkills?.length > 0) {
        await tx.insert(characterTagSkills).values(
          char.tagSkills.map((skill: string) => ({
            characterId: newCharId,
            skill: skill as any,
          }))
        );
      }

      // 5. Survivor traits
      if (char.survivorTraits?.length > 0) {
        await tx.insert(characterSurvivorTraits).values(
          char.survivorTraits.map((traitId: string) => ({
            characterId: newCharId,
            traitId: traitId as any,
          }))
        );
      }

      // 6. Perks
      if (char.perks?.length > 0) {
        await tx.insert(characterPerks).values(
          char.perks.map((perk: { perkId: string; rank: number }) => ({
            characterId: newCharId,
            perkId: perk.perkId,
            rank: perk.rank,
          }))
        );
      }

      // 7. Gifted bonuses
      if (char.giftedBonusAttributes?.length > 0) {
        await tx.insert(characterGiftedBonuses).values(
          char.giftedBonusAttributes.map((attribute: string) => ({
            characterId: newCharId,
            attribute: attribute as any,
          }))
        );
      }

      // 8. Exercise bonuses
      if (char.exerciseBonuses?.length > 0) {
        await tx.insert(characterExerciseBonuses).values(
          char.exerciseBonuses.map((attribute: string) => ({
            characterId: newCharId,
            attribute: attribute as any,
          }))
        );
      }

      // 9. Conditions
      if (char.conditions?.length > 0) {
        await tx.insert(characterConditions).values(
          char.conditions.map((condition: string) => ({
            characterId: newCharId,
            condition: condition as any,
          }))
        );
      }

      // 10. DR
      if (char.dr?.length > 0) {
        await tx.insert(characterDr).values(
          char.dr.map((d: any) => ({
            characterId: newCharId,
            location: d.location,
            drPhysical: d.drPhysical,
            drEnergy: d.drEnergy,
            drRadiation: d.drRadiation,
            drPoison: d.drPoison,
          }))
        );
      }

      // 11. Custom traits
      if (char.traits?.length > 0) {
        await tx.insert(characterTraits).values(
          char.traits.map((t: any) => ({
            characterId: newCharId,
            name: t.name,
            description: t.description,
            nameKey: t.nameKey ?? null,
            descriptionKey: t.descriptionKey ?? null,
          }))
        );
      }

      // 12. Inventory — resolve items by name, skip + warn if not found
      for (const inv of char.inventory ?? []) {
        const [foundItem] = await tx.select({ id: items.id }).from(items).where(eq(items.name, inv.item.name));
        if (!foundItem) {
          warnings.push({ itemName: inv.item.name, reason: 'item not found' });
          continue;
        }

        const [newInv] = await tx.insert(characterInventory).values({
          characterId: newCharId,
          itemId: foundItem.id,
          quantity: inv.quantity ?? 1,
          equipped: inv.equipped ?? false,
          equippedLocation: inv.equippedLocation ?? null,
        }).returning();

        // Resolve and install mods
        for (const mod of inv.installedMods ?? []) {
          const [foundMod] = await tx.select({ id: items.id }).from(items).where(eq(items.name, mod.modName));
          if (!foundMod) {
            warnings.push({ itemName: mod.modName, reason: 'mod item not found' });
            continue;
          }

          const [modInv] = await tx.insert(characterInventory).values({
            characterId: newCharId,
            itemId: foundMod.id,
            quantity: 1,
            equipped: false,
            equippedLocation: null,
          }).returning();

          await tx.insert(inventoryItemMods).values({
            targetInventoryId: newInv.id,
            modInventoryId: modInv.id,
          });
        }
      }
    });

    const fullCharacter = await getFullCharacter(newCharId);
    res.status(201).json({ character: fullCharacter, warnings });
  } catch (error) {
    console.error('Error importing character:', error);
    res.status(500).json({ error: 'Failed to import character' });
  }
});
```

- [ ] **Step 2 : Vérifier manuellement**

Exporter d'abord un personnage existant, puis l'importer :
```bash
# Exporter (remplacer 1 par un ID valide)
curl -s http://localhost:3001/api/characters/1/export > /tmp/test_char.json

# Importer
curl -s -X POST http://localhost:3001/api/characters/import \
  -H "Content-Type: application/json" \
  -d @/tmp/test_char.json | python3 -m json.tool | head -30
```

Résultat attendu : `{ "character": { "id": <new_id>, "name": "...", ... }, "warnings": [] }`

- [ ] **Step 3 : Tester le cas d'erreur validation**

```bash
curl -s -X POST http://localhost:3001/api/characters/import \
  -H "Content-Type: application/json" \
  -d '{"version": 1}' | python3 -m json.tool
```

Résultat attendu : `{ "error": "Invalid export file: missing version, character.name, or character.type" }`

- [ ] **Step 4 : Commit**

```bash
git add back/src/routes/characters.ts
git commit -m "feat: add character import endpoint (POST /import) with item name resolution"
```

---

## Task 3 : Frontend — API service + hook

**Files:**
- Modify: `front/src/services/api.ts`
- Modify: `front/src/hooks/useCharactersApi.ts`

- [ ] **Step 1 : Ajouter les types et méthodes dans `api.ts`**

Ajouter après l'interface `UpdateInventoryData` (après la ligne `}` qui la ferme, vers ligne ~541) :

```typescript
export interface ImportWarning {
  itemName: string;
  reason: string;
}

export interface ImportCharacterResponse {
  character: CharacterApi;
  warnings: ImportWarning[];
}
```

Dans l'objet `charactersApi`, ajouter après la méthode `duplicate` (après la ligne `}),` qui ferme `duplicate`, vers ligne ~570) :

```typescript
  exportCharacter: (id: number) =>
    fetchApi<Record<string, unknown>>(`/characters/${id}/export`),
  importCharacter: (data: unknown) =>
    fetchApi<ImportCharacterResponse>('/characters/import', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
```

- [ ] **Step 2 : Ajouter les méthodes dans `useCharactersApi.ts`**

Dans l'interface `UseCharactersApiReturn` (fichier `front/src/hooks/useCharactersApi.ts`), ajouter après la ligne `duplicateCharacter: (id: string) => Promise<Character | undefined>;` :

```typescript
  exportCharacter: (character: Character) => Promise<void>;
  importCharacter: (file: File) => Promise<{ character: Character; warnings: ImportWarning[] }>;
```

Ajouter l'import de `ImportWarning` en haut du fichier, dans la ligne d'import de `../services/api` :

```typescript
import { charactersApi, type CharacterApi, type CreateCharacterData, type InventoryItemApi, type AddInventoryData, type UpdateInventoryData, type ImportWarning } from '../services/api';
```

Ajouter les deux méthodes dans le corps du hook, après `duplicateCharacter` (vers ligne 256) :

```typescript
  const exportCharacter = useCallback(
    async (character: Character): Promise<void> => {
      const data = await charactersApi.exportCharacter(Number(character.id));
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${character.name.replace(/[^a-z0-9]/gi, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    []
  );

  const importCharacter = useCallback(
    async (file: File): Promise<{ character: Character; warnings: ImportWarning[] }> => {
      const text = await file.text();
      const json = JSON.parse(text);
      const result = await charactersApi.importCharacter(json);
      const newCharacter = apiToFrontend(result.character);
      queryClient.setQueryData<Character[]>(CHARACTERS_QUERY_KEY, (old) => [...(old ?? []), newCharacter]);
      return { character: newCharacter, warnings: result.warnings };
    },
    [queryClient]
  );
```

Dans le `return` du hook, ajouter `exportCharacter` et `importCharacter` :

```typescript
    exportCharacter,
    importCharacter,
```

Dans l'interface `UseCharactersApiReturn`, ajouter les types (déjà fait au Step 2 — vérifier que le return correspond).

- [ ] **Step 3 : Vérifier TypeScript**

```bash
cd front && npx tsc --noEmit 2>&1 | head -30
```

Résultat attendu : aucune erreur liée aux nouveaux types/méthodes.

- [ ] **Step 4 : Commit**

```bash
git add front/src/services/api.ts front/src/hooks/useCharactersApi.ts
git commit -m "feat: add exportCharacter and importCharacter to API service and hook"
```

---

## Task 4 : Frontend — Bouton Export sur CharacterCard

**Files:**
- Modify: `front/src/ui/components/character/CharacterCard.tsx`

- [ ] **Step 1 : Ajouter l'import de l'icône `Download`**

Modifier la première ligne du fichier pour ajouter `Download` :

```typescript
import { Edit2, Copy, Trash2, Swords, Eye, Heart, Shield, Zap, Sparkles, Package, Download } from 'lucide-react';
```

- [ ] **Step 2 : Ajouter `onExport` à l'interface et au destructuring**

Dans l'interface `CharacterCardProps` (vers ligne 13), ajouter après `onDelete?: () => void;` :

```typescript
  onExport?: () => void;
```

Dans le destructuring du composant `CharacterCard` (vers ligne 24), ajouter `onExport` après `onDelete` :

```typescript
export function CharacterCard({
  character,
  onClick,
  onEdit,
  onDuplicate,
  onDelete,
  onExport,
  selected = false,
```

- [ ] **Step 3 : Ajouter le bouton Export dans la section Actions**

La section Actions commence vers la ligne 231 avec :
```
{(onEdit || onDuplicate || onDelete) && (
```

Remplacer cette condition et ajouter le bouton Export. La section complète doit devenir :

```typescript
        {(onEdit || onDuplicate || onDelete || onExport) && (
          <div className="flex gap-2 pt-2 border-t border-gray-600">
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm text-vault-yellow hover:bg-vault-blue rounded transition-colors"
              >
                <Edit2 size={14} />
                {t('common.edit')}
              </button>
            )}
            {onDuplicate && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate();
                }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm text-vault-yellow hover:bg-vault-blue rounded transition-colors"
              >
                <Copy size={14} />
                {t('common.duplicate')}
              </button>
            )}
            {onExport && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onExport();
                }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm text-vault-yellow hover:bg-vault-blue rounded transition-colors"
              >
                <Download size={14} />
                {t('characters.export')}
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm text-red-400 hover:bg-red-900/30 rounded transition-colors"
              >
                <Trash2 size={14} />
                {t('common.delete')}
              </button>
            )}
          </div>
        )}
```

- [ ] **Step 4 : Vérifier TypeScript**

```bash
cd front && npx tsc --noEmit 2>&1 | head -20
```

Résultat attendu : aucune erreur.

- [ ] **Step 5 : Commit**

```bash
git add front/src/ui/components/character/CharacterCard.tsx
git commit -m "feat: add Export button to CharacterCard"
```

---

## Task 5 : Frontend — Bouton Import sur CharactersPage + handlers

**Files:**
- Modify: `front/src/ui/pages/CharactersPage.tsx`

- [ ] **Step 1 : Mettre à jour les imports**

Remplacer la ligne d'import lucide-react :
```typescript
import { Users, UserPlus, Bot, Search } from 'lucide-react';
```
Par :
```typescript
import { Users, UserPlus, Bot, Search, Upload } from 'lucide-react';
```

Remplacer la ligne d'import `useCharactersApi` pour ajouter `ImportWarning` :
```typescript
import { useCharactersApi } from '../../hooks/useCharactersApi';
import type { ImportWarning } from '../../services/api';
```

- [ ] **Step 2 : Ajouter les méthodes du hook et les états locaux**

Dans le destructuring de `useCharactersApi()` (vers ligne 16), ajouter `exportCharacter` et `importCharacter` :

```typescript
  const {
    characters,
    pcs,
    npcs,
    loading,
    error,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    duplicateCharacter,
    exportCharacter,
    importCharacter,
  } = useCharactersApi();
```

Ajouter les états locaux pour le feedback, après les états existants (après ligne ~33) :

```typescript
  const [importFeedback, setImportFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
    warnings?: ImportWarning[];
  } | null>(null);
```

- [ ] **Step 3 : Ajouter les handlers `handleExport` et `handleImport`**

Ajouter après le handler `handleDuplicate` (après ligne ~103) :

```typescript
  const handleExport = async (character: Character) => {
    try {
      await exportCharacter(character);
    } catch (err) {
      console.error('Failed to export character:', err);
    }
  };

  const handleImportChange = async (e: { target: HTMLInputElement }) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    try {
      const result = await importCharacter(file);
      if (result.warnings.length > 0) {
        setImportFeedback({
          type: 'success',
          message: `characters.importSuccess`,
          warnings: result.warnings,
        });
      } else {
        setImportFeedback({ type: 'success', message: 'characters.importSuccess' });
      }
    } catch (err) {
      setImportFeedback({ type: 'error', message: 'characters.importError' });
    }
    setTimeout(() => setImportFeedback(null), 6000);
  };
```

- [ ] **Step 4 : Ajouter le bouton Import et le file picker dans le JSX**

Dans la section des boutons d'action (vers ligne 111, la `<div className="flex flex-wrap gap-3">`), ajouter le bouton Import et l'input caché après le bouton `createNPC` :

```typescript
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCreatePC}>
              <UserPlus size={18} className="mr-2" />
              {t('characters.createPC')}
            </Button>
            <Button onClick={handleCreateNPC} variant="secondary">
              <Bot size={18} className="mr-2" />
              {t('characters.createNPC')}
            </Button>
            <label>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportChange}
              />
              <Button as="span" variant="secondary">
                <Upload size={18} className="mr-2" />
                {t('characters.import')}
              </Button>
            </label>
          </div>
```

> **Note :** Si le composant `Button` ne supporte pas `as="span"`, utiliser à la place :
> ```typescript
>             <label className="cursor-pointer">
>               <input
>                 type="file"
>                 accept=".json"
>                 className="hidden"
>                 onChange={handleImportChange}
>               />
>               <span className="inline-flex items-center px-4 py-2 text-sm font-bold uppercase border border-vault-yellow text-vault-yellow hover:bg-vault-blue transition-colors rounded cursor-pointer">
>                 <Upload size={18} className="mr-2" />
>                 {t('characters.import')}
>               </span>
>             </label>
> ```

- [ ] **Step 5 : Ajouter le feedback inline**

Dans le JSX, ajouter le bloc de feedback juste avant le bloc `{/* Loading state */}` (vers ligne 162) :

```typescript
      {/* Import feedback */}
      {importFeedback && (
        <div className={`text-center py-3 px-4 rounded border ${
          importFeedback.type === 'success'
            ? 'text-green-400 bg-green-900/20 border-green-600'
            : 'text-red-400 bg-red-900/20 border-red-600'
        }`}>
          <p>{t(importFeedback.message)}</p>
          {importFeedback.warnings && importFeedback.warnings.length > 0 && (
            <p className="text-yellow-400 text-sm mt-1">
              {t('characters.importMissingItems', { items: importFeedback.warnings.map(w => w.itemName).join(', ') })}
            </p>
          )}
        </div>
      )}
```

- [ ] **Step 6 : Passer `onExport` à chaque `CharacterCard`**

Dans la grille de personnages (vers ligne 179), ajouter `onExport` :

```typescript
          {filteredCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onClick={() => navigate(`/characters/${character.id}`)}
              onEdit={() => handleEdit(character)}
              onDuplicate={() => handleDuplicate(character)}
              onExport={() => handleExport(character)}
              onDelete={() => handleDelete(character)}
            />
          ))}
```

- [ ] **Step 7 : Vérifier TypeScript**

```bash
cd front && npx tsc --noEmit 2>&1 | head -20
```

Résultat attendu : aucune erreur.

- [ ] **Step 8 : Commit**

```bash
git add front/src/ui/pages/CharactersPage.tsx
git commit -m "feat: add Import button and export handler to CharactersPage"
```

---

## Task 6 : i18n — Clés de traduction

**Files:**
- Modify: `front/src/i18n/locales/en.ts`
- Modify: `front/src/i18n/locales/fr.ts`

- [ ] **Step 1 : Ajouter les clés en anglais**

Dans `en.ts`, dans la section `characters:` (vers la fin de la section, après la clé `confirmDelete`), ajouter :

```typescript
    export: 'Export',
    import: 'Import',
    importSuccess: 'Character imported successfully.',
    importError: 'Failed to import character. Check that the file is a valid export.',
    importMissingItems: 'Some items were not found and were skipped: {{items}}',
```

- [ ] **Step 2 : Ajouter les clés en français**

Dans `fr.ts`, dans la section `characters:` (même emplacement), ajouter :

```typescript
    export: 'Exporter',
    import: 'Importer',
    importSuccess: 'Personnage importé avec succès.',
    importError: 'Échec de l\'import. Vérifiez que le fichier est un export valide.',
    importMissingItems: 'Certains objets n\'ont pas été trouvés et ont été ignorés : {{items}}',
```

- [ ] **Step 3 : Vérifier TypeScript**

```bash
cd front && npx tsc --noEmit 2>&1 | head -20
```

Résultat attendu : aucune erreur.

- [ ] **Step 4 : Commit**

```bash
git add front/src/i18n/locales/en.ts front/src/i18n/locales/fr.ts
git commit -m "feat: add i18n keys for character export/import"
```

---

## Task 7 : Vérification finale — Test bout en bout

- [ ] **Step 1 : Démarrer les deux serveurs**

```bash
# Terminal 1
cd back && npm run dev

# Terminal 2
cd front && npm run dev
```

- [ ] **Step 2 : Test export**

1. Ouvrir http://localhost:5173/characters dans le navigateur
2. Cliquer "Export" sur une CharacterCard avec inventaire
3. Vérifier que le fichier `.json` se télécharge
4. Ouvrir le fichier et vérifier : pas d'IDs DB, inventory avec `item.name`, `installedMods`

- [ ] **Step 3 : Test import basique**

1. Cliquer "Importer" sur la CharactersPage
2. Sélectionner le fichier exporté à l'étape précédente
3. Vérifier que le personnage apparaît dans la liste avec un nouveau nom identique
4. Vérifier le message de succès vert

- [ ] **Step 4 : Test import avec items manquants**

Modifier manuellement le fichier JSON pour changer le nom d'un item inventory (`"item": { "name": "NOM_INEXISTANT" }`), puis importer.

Résultat attendu : personnage importé + message jaune listant l'item manquant.

- [ ] **Step 5 : Test import fichier invalide**

Créer un fichier `invalid.json` avec `{ "hello": "world" }`, tenter l'import.

Résultat attendu : message d'erreur rouge.

- [ ] **Step 6 : Commit final si ajustements**

```bash
git add -p
git commit -m "fix: <ajustements suite aux tests>"
```
