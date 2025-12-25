# Neon Addressing Tool - Guidelines

## Développement

### Test Driven Development (TDD)

Il est **impératif** de respecter le cycle TDD pour tout nouveau développement de fonctionnalité :

1.  🔴 **Red** : Écrire un test unitaire qui échoue pour définir le comportement.
2.  🟢 **Green** : Écrire le code minimal nécessaire pour faire passer le test.
3.  🔵 **Refactor** : Améliorer la qualité du code tout en gardant les tests au vert.

## Architecture

Le projet suit une architecture hexagonale.

## Development Workflow

1. **End-to-End (E2E) Test**: Start with a Playwright test to define the expected behavior from the user's perspective.
2. **Unit Tests**: Drill down to the unit level (whenever possible and relevant) to implement business logic and components.
3. **Implementation**: Write the minimum amount of code to make the tests pass.
4. **Refactoring**: Improve code quality while keeping tests green.
