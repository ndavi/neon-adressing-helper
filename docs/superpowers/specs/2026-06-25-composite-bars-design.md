# Barres composées (Composite Bars)

Permettre à l'utilisateur de définir des barres "composées" (ex: `2M+1M+2M`) dans un catalogue persisté en localStorage, puis de les utiliser dans ses outputs. Une barre composée apparaît comme **une seule ligne** dans le CSV exporté.

## Contexte

Aujourd'hui, une `Bar` est un value object atomique (`1M` ou `2M`) avec des propriétés fixes (channelCount, pixelCount, length). Chaque barre d'un `LedOutput` génère une ligne CSV séparée.

L'utilisateur a besoin de barres physiques composées de plusieurs segments soudés ensemble, qui doivent être traitées comme une unité dans l'adressage DMX.

---

## 1. Modèle de domaine

### `OutputBar` (remplace `Bar` dans `LedOutput`)

Concept unifié : un élément d'un output qui peut être atomique (1 segment) ou composé (N segments).

- `segments: readonly Bar[]` — les segments atomiques qui composent la barre
- `name: string` — auto-généré à partir des segments : `"2M"`, `"1M"`, ou `"2M+1M+2M"`
- `channelCount: number` — somme des channels de tous les segments
- `pixelCount: number` — somme des pixels de tous les segments
- `length: number` — somme des longueurs de tous les segments

Une barre atomique est simplement un `OutputBar` avec un seul segment.

### `CompositeBar` (catalogue)

Value object stocké dans le catalogue. Identique à `OutputBar` mais avec la contrainte d'avoir ≥ 2 segments (un seul segment = barre atomique, pas besoin de cataloguer).

### `BarCatalog`

Agrégat : collection de `CompositeBar` persistée.

- `bars: readonly CompositeBar[]`
- `add(bar: CompositeBar): BarCatalog`
- `remove(index: number): BarCatalog`
- Validation : pas de doublon (même séquence de segments)

### Impact sur `LedOutput`

- `LedOutput.bars` passe de `readonly Bar[]` à `readonly OutputBar[]`
- `addBar()` ajoute toujours un `OutputBar` atomique 2M par défaut
- `toggleBar(index)` est remplacé par `replaceBar(index, newBar: OutputBar)`
- Les calculs de `channelCount` et `pixelCount` restent identiques (somme des éléments)

### Impact sur le CSV (`CsvController`)

`generateOutputLines` itère sur chaque `OutputBar` et crée **une seule ligne CSV** :

- `fixtureDefinitionName`: `"BARRE NEON - 2M+1M+2M"`
- `channelCount`: somme des channels de tous les segments de l'`OutputBar`
- `pixelCount`: somme des pixels
- `length` (pour startY/endY): somme des longueurs

Le calcul des univers/channels reste identique : on avance le `currentGlobalChannel` du channelCount total de l'`OutputBar`.

---

## 2. Nouveau contexte : `bar-catalog`

### Structure hexagonale

```
src/main/webapp/app/bar-catalog/
  ├── domain/
  │   ├── CompositeBar.ts          # Value Object (≥ 2 segments)
  │   ├── BarCatalog.ts            # Agrégat
  │   └── BarCatalogRepository.ts  # Port (interface)
  ├── application/
  │   └── BarCatalogRouter.ts      # Route /bar-catalog
  └── infrastructure/
      ├── secondary/
      │   └── LocalStorageBarCatalogRepository.ts
      └── primary/
          └── BarCatalogPage.vue
```

### Persistance localStorage

- Clé : `"neon-bar-catalog"`
- Format : tableau de tableaux de `BarType` (ex: `[["2M","1M","2M"], ["1M","1M"]]`)
- Le `BarCatalogRepository` (port) expose `load(): BarCatalog` et `save(catalog: BarCatalog): void`

---

## 3. UI — Page catalogue (`/bar-catalog`)

### Navigation

- Nouvelle route : `/bar-catalog`
- Bouton d'accès dans la page principale (header ou footer)
- Bouton retour sur la page catalogue

### Constructeur visuel (partie haute)

- Aperçu en temps réel des segments assemblés (rectangles colorés : cyan pour 2M, violet pour 1M)
- Boutons `+ 2M` et `+ 1M` pour ajouter un segment
- Bouton `Retirer le dernier` (actif si ≥ 1 segment)
- Label auto-généré : `"2M+1M+2M"`
- Stats calculées : pixels, channels, longueur totale
- Bouton `Sauvegarder` (actif si ≥ 2 segments)

### Liste des barres custom (partie basse)

- Chaque `CompositeBar` sauvegardée affiche :
  - Aperçu visuel des segments
  - Nom (`2M+1M+2M`)
  - Stats (pixels, channels)
  - Bouton supprimer

### Validation

- Minimum 2 segments pour sauvegarder
- Pas de doublon (même séquence de segments)

---

## 4. UI — Intégration dans les outputs

### Sélection de barre (remplace le toggle)

- Clic sur une barre → ouvre un `v-menu` Vuetify avec :
  - `1M` (atomique)
  - `2M` (atomique)
  - Séparateur
  - Liste des barres du catalogue (`2M+1M+2M`, `1M+1M`, etc.)
- La barre sélectionnée remplace l'actuelle à cet index

### Rendu visuel (`LedOutputCard`)

- Barre atomique 2M → rectangle cyan (inchangé)
- Barre atomique 1M → rectangle violet (inchangé)
- Barre composée → groupe de rectangles collés (ex: cyan + violet + cyan pour 2M+1M+2M), entourés d'une bordure commune

---

## 5. Stratégie de test (TDD, comportement, pas de détails d'implémentation)

### Principes

- TDD strict : Red → Green → Refactor
- Tests comportementaux : on teste des cas d'usage, pas des détails d'implémentation
- Given-When-Then explicite via extraction de méthodes
- Pas de tests CSS sauf valeur métier

### Tests unitaires — Nouveau contexte `bar-catalog`

#### `CompositeBar.spec.ts`

- Should compute the name from its segments (ex: `2M+1M+2M`)
- Should compute total channel count from all segments
- Should compute total pixel count from all segments
- Should compute total length from all segments

#### `BarCatalog.spec.ts`

- Should add a composite bar to the catalog
- Should remove a composite bar from the catalog
- Should reject a duplicate composite bar

#### `LocalStorageBarCatalogRepository.spec.ts`

- Should persist and retrieve the catalog
- Should return an empty catalog when localStorage is empty

### Tests unitaires — Module `home` modifié

#### `OutputBar.spec.ts` (nouveau, remplace la partie `Bar` de `LedOutput.spec.ts`)

- Should create an atomic bar with a single segment
- Should create a composite bar with multiple segments
- Should compute total channels as the sum of all segments
- Should compute total pixels as the sum of all segments
- Should compute total length as the sum of all segments

#### `LedOutput.spec.ts` (adapté)

- Les tests existants doivent continuer à passer (comportement identique pour les barres atomiques)
- Should replace a bar at a given index with a composite bar

#### `CsvController.spec.ts` (enrichi)

- Test existant inchangé pour les barres atomiques
- Should generate a single CSV line for a composite bar with the combined name and summed values

#### `CsvExporter.spec.ts`

- Tests existants inchangés (rétrocompatibilité)

#### `Controller.spec.ts`

- Tests existants inchangés

### Test E2E (Playwright)

#### `CompositeBarExport.spec.ts`

- Should export a composite bar as a single CSV line
  1. Naviguer vers `/bar-catalog`
  2. Construire une barre composée `2M+1M+2M` via le constructeur visuel
  3. Sauvegarder
  4. Revenir à `/`
  5. Cliquer sur une barre → sélectionner `2M+1M+2M` dans le menu
  6. Télécharger le CSV
  7. Vérifier que le CSV contient une ligne `BARRE NEON - 2M+1M+2M` avec les valeurs sommées

### Rétrocompatibilité

- Les barres atomiques (1M, 2M) restent intégrées nativement comme `OutputBar` à 1 segment
- Le comportement par défaut (`+` ajoute une 2M) ne change pas
- Le CSV pour des barres atomiques est identique à avant

### Commandes de vérification

```bash
pnpm test
npm run build:tsc
pnpm exec playwright test --config src/test/webapp/e2e/playwright.config.ts
```
