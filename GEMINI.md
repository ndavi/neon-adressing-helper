# Neon Addressing Tool - Guidelines

## Développement

### Test Driven Development (TDD)

Il est **impératif** de respecter le cycle TDD pour tout nouveau développement de fonctionnalité :

1.  🔴 **Red** : Écrire un test unitaire qui échoue pour définir le comportement.

2.  🟢 **Green** : Écrire le code minimal nécessaire pour faire passer le test.

3.  🔵 **Refactor** : Améliorer la qualité du code tout en gardant les tests au vert.

À la fin de chaque fonctionnalité, un passage de **refactorisation** est obligatoire sur le code écrit. Il faut privilégier l'**extraction de méthodes** (Extract Method) pour rendre le code expressif et faciliter sa compréhension immédiate.

Le code de **test** doit être structuré selon le pattern **Given-When-Then**. Cette structure doit être rendue explicite par l'extraction de méthodes dont le nom commence par `given`, `when` ou `then` (ex: `givenMockedDownload`, `whenClickingOnDownload`, `thenFileIsDownloaded`).

Les tests doivent **écrire une histoire**. Les noms des tests (le contenu du `it` ou `test`) doivent représenter un **cas d'usage** ou un **comportement** métier, et non une simple vérification technique (ex: `Should download the CSV template when the user requests it`).

## Architecture

Le projet suit une architecture hexagonale et applique les principes du **Domain-Driven Design (DDD)**, même dans le frontend.

La logique métier doit être encapsulée dans le domaine et isolée du framework (Vue.js).

## Development Workflow

1. **End-to-End (E2E) Test**: Start with a Playwright test to define the expected behavior from the user's perspective.
2. **Unit Tests**: Drill down to the unit level (whenever possible and relevant) to implement business logic and components.
3. **Implementation**: Write the minimum amount of code to make the tests pass.
4. **Refactoring**: Improve code quality while keeping tests green.
