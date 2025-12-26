# Neon Addressing Tool - Guidelines

### Documentation & Références

Pour garantir l'utilisation des dernières API et des meilleures pratiques :

- Utilise **Context7** (`resolve-library-id` et `get-library-docs`) pour consulter la documentation officielle de **Vue 3**, **Vitest**, **Playwright**, et toute autre bibliothèque tiers.
- Pour l'UX et les composants UI, utilise exclusivement le serveur MCP de **Vuetify** : https://mcp.vuetifyjs.com/

## Développement

- **Framework** : Tu utilises **Vue 3**.
- **Syntaxe** : Utilise exclusivement la **Composition API** avec la syntaxe `<script setup lang="ts">`. L'utilisation de l'Options API est interdite.
- **État & Logique** :
  - Extrais la logique métier complexe dans des **composables** (fichiers `.ts`) pour garder les composants `.vue` focalisés sur la vue.
- **Typage des Composants** :
  - Utilise les définitions de types génériques pour les props et les emits (ex: `defineProps<{ myProp: string }>()`).
  - Évite les types `any` dans les templates.

### TypeScript

L'utilisation du mot-clé `as` pour l'assertion de type est **interdite**. C'est une mauvaise pratique qui contourne la sécurité du typage.

- **Alternative** : Utiliser `satisfies` pour vérifier qu'une valeur correspond à un type sans perdre la précision du type, ou utiliser des **type guards** pour valider les types à l'exécution.
- **Portée** : Tous les fichiers TypeScript du projet.
- **Raison** : Garantir une sécurité de typage maximale et éviter les erreurs à l'exécution.

Il faut éviter au maximum l'utilisation de `undefined`. Il est préférable d'utiliser un type qui a du sens dans le contexte métier (ex: un symbole) ou d'utiliser la classe `Optional` (fournie dans `common/domain/Optional.ts`).

### Test Driven Development (TDD)

Il est **impératif** de respecter le cycle TDD pour tout nouveau développement de fonctionnalité :

1.  🔴 **Red** : Écrire un test unitaire qui échoue pour définir le comportement.

2.  🟢 **Green** : Écrire le code minimal nécessaire pour faire passer le test.

3.  🔵 **Refactor** : Améliorer la qualité du code tout en gardant les tests au vert.

À la fin de chaque fonctionnalité, un passage de **refactorisation** est obligatoire sur le code écrit. Il faut privilégier l'**extraction de méthodes** (Extract Method) pour rendre le code expressif et faciliter sa compréhension immédiate.
Toute condition `if` un peu complexe doit être extraite dans une méthode nommée (ex: `isEligible(...)`) pour clarifier l'intention métier.

Le code de **test** doit être structuré selon le pattern **Given-When-Then**. Cette structure doit être rendue explicite par l'extraction de méthodes dont le nom commence par `given`, `when` ou `then` (ex: `givenMockedDownload`, `whenClickingOnDownload`, `thenFileIsDownloaded`).

Les tests doivent **écrire une histoire**. Les noms des tests (le contenu du `it` ou `test`) doivent représenter un **cas d'usage** ou un **comportement** métier, et non une simple vérification technique (ex: `Should download the CSV template when the user requests it`).

Il ne faut **jamais** écrire du code de production (méthodes, attributs publics) uniquement pour faciliter les tests. Le code de production doit refléter les besoins du domaine.

**Tests CSS** : On ne cherche pas à tester le CSS. On teste le CSS uniquement si cela a une vraie valeur métier, sinon on l'évite car c'est fragile et coûteux à maintenir.

## Architecture

Le projet suit une architecture hexagonale et applique les principes du **Domain-Driven Design (DDD)** ainsi que les principes **SOLID**, même dans le frontend.

La logique métier doit être encapsulée dans le domaine et isolée du framework (Vue.js). Les objets du domaine doivent être placés dans un dossier `domain` à la racine de chaque module (ex: `src/main/webapp/app/home/domain`).

Le domaine doit être le plus **immuable** possible. On privilégie les types primitifs et les structures de données immuables, en minimisant les effets de bord. Les entités et value objects doivent être conçus pour ne pas être modifiés après leur création. Toute opération de transformation (ex: `resize`) doit renvoyer une nouvelle instance de l'objet plutôt que de modifier l'instance existante.

Il est interdit de déplacer du code dans un dossier **shared** ou **common** tant qu'il n'est pas effectivement utilisé par au moins deux contextes différents. On privilégie la duplication ou la localisation dans le contexte initial jusqu'à ce qu'un besoin de partage réel émerge.

### Initialisation des Objets du Domaine

Chaque classe du domaine (Entité ou Value Object) doit être initialisée via **une seule interface** passée au constructeur, regroupant toutes ses propriétés. Cela remplace les longues listes d'arguments.

**Exemple :**

```typescript
// 1. Définir l'interface des propriétés
interface ControllerProps {
  universe: number;
  outputs: readonly LedOutput[];
  startX: number;
}

// 2. Utiliser l'interface dans le constructeur
export class Controller {
  private constructor(private readonly props: ControllerProps) {}

  // Factory method utilisant l'interface (ou des arguments nommés si pertinent pour l'API publique)
  static of(props: ControllerProps): Controller {
    return new Controller(props);
  }

  // Accesseurs
  get universe(): number {
    return this.props.universe;
  }
}
```

## Development Workflow

1. **End-to-End (E2E) Test**: Write Playwright tests only when necessary, adhering to TDD principles. Focus on verifying critical user journeys and global application stability, rather than granular feature testing.
2. **Unit Tests**: Drill down to the unit level (whenever possible and relevant) to implement business logic and components.
3. **Implementation**: Write the minimum amount of code to make the tests pass.
4. **Refactoring**: Improve code quality while keeping tests green.
5. **Compilation Check**: Verify that the entire project compiles correctly (e.g. run `npm run build:tsc`).
6. **Commit**: Commit the changes at the end of each task.
