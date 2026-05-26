# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Airwallet E2E Test Suite** is an end-to-end testing framework for the Airwallet dashboard written in Playwright with TypeScript. The suite covers web UI flows with a clean separation between authenticated tests (requiring login) and independent tests (managing their own auth).

## Commands

### Common Commands

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chrome

# Run all tests (uses .env.sandbox by default)
npm test

# Run tests against a specific environment
ENV=staging npm test

# Run a specific test file
npx playwright test tests/e2e-web/authenticated/TCA1-location.spec.ts

# Run a single test by name pattern
npx playwright test -g "Create location with different location types"

# Run tests in headed mode (see the browser)
npm run test:headed

# Debug mode (opens Playwright Inspector)
npm run test:debug

# Run tests in UI mode (interactive)
npm run test:ui

# View HTML test report
npm run report

# Format code
npm run format

# Check formatting without writing
npm run format:check

# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Run only authenticated tests
npx playwright test --project=e2e-chrome-tests

# Run only independent tests
npx playwright test --project=independent-tests

# Replicate CI behavior locally
CI=true npm test
```

## Environment Setup

1. **Create environment file:**

    ```bash
    cp .env.example .env.sandbox
    ```

2. **Fill in `.env.sandbox`:**
    - `BASE_URL` — Base URL of the app under test (e.g., `https://sandbox.airwallet.net`)
    - `ENV` — Environment name (e.g., `sandbox`, `staging`)
    - `TEST_USER_EMAIL` — Email for static test users (used in independent tests)
    - `TEST_USER_PASSWORD` — Password for static test users

3. **Note:** `.env.sandbox` and test state files (`tests/setup/.state/user.json`) are git-ignored.

## Architecture

### Test Projects (Playwright Configuration)

The suite splits tests into three projects defined in `playwright.config.ts`:

1. **`setup`** (runs first)
    - File: `tests/setup/TCS1-signup.spec.ts`
    - Creates a fresh user using `generateUser()` (faker-js)
    - Completes signup and login flow
    - Saves browser auth state (cookies + localStorage) to `tests/setup/.state/user.json`
    - Other projects depend on this

2. **`e2e-chrome-tests`** (authenticated tests)
    - Pattern: `tests/e2e-web/authenticated/**`
    - Depends on `setup` project
    - Automatically receives saved storageState via project-level config
    - No re-login needed; just create a spec file and start testing
    - Label convention: `TCA{number}-{feature}.spec.ts`

3. **`independent-tests`** (self-contained tests)
    - Pattern: `tests/e2e-web/independent/**`
    - No dependencies; manages its own login
    - Uses static pre-existing test users from `tests/data/testUsers.ts`
    - Useful for logout flows or tests requiring full auth control
    - Label convention: `TCI{number}-{feature}.spec.ts`

### Code Organization

```
tests/
├── setup/                     # Setup project (user signup + auth state generation)
│   ├── .state/user.json       # Saved auth state (generated, git-ignored)
│   └── TCS1-signup.spec.ts
├── e2e-web/
│   ├── authenticated/         # Tests using shared auth state
│   │   └── TCA1-location.spec.ts
│   └── independent/           # Tests managing their own auth
│       └── TCI1-logout.spec.ts
├── pages/                     # Page Object Model classes
│   ├── BasePage.ts            # Abstract base with navigation helpers
│   ├── HomePage.ts
│   ├── LocationPage.ts
│   └── LoginPage.ts
├── utils/
│   ├── helpers.ts             # Utilities: generateUser, dismissModalIfPresent, closeChat
│   └── logger.ts              # logStep wrapper around test.step()
└── data/
    ├── testUsers.ts           # Static test users for independent tests
    └── devices.ts
```

### Page Object Model (POM)

All UI interaction logic lives in page classes (`tests/pages/*.ts`). Specs call page methods, never raw selectors.

**Method naming conventions:**

- `given...()` — navigation and preconditions (e.g., `givenUserIsOnHomePage()`)
- `when...()` — user actions (e.g., `whenUserClicksBurgerMenu()`)
- `then...()` — assertions (e.g., `thenTheUserIsOnLocationPage()`)

All methods use strict camelCase. Treat acronyms as words: `User`, not `USer`; `Url`, not `URL`.

### Step Logging

Use `logStep()` instead of `console.log()`. It wraps Playwright's `test.step()`, so each step appears once in all reporters with proper pass/fail status and timing.

```typescript
import { logStep } from '@utils/logger';

await logStep('When user clicks sign in', () => loginPage.whenUserClicksSignIn());
```

### User Management

- **Authenticated tests:** Use `generateUser()` from `tests/utils/helpers.ts` in the setup phase. User data is saved to `tests/setup/.state/user.json` and reused automatically.
- **Independent tests:** Use static users from `tests/data/testUsers.ts` (e.g., `testUsers.logoutUser`).

## Configuration Files

- **`playwright.config.ts`** — Defines projects, reporters, timeouts, and storage state locations
    - `actionTimeout: 20s` per action
    - `navigationTimeout: 25s` for page navigation
    - `fullyParallel: true` (run tests in parallel)
    - Workers: 50% of available CPUs
    - Reporters: `list` (with steps), `html`, and `github` (in CI)

- **`tsconfig.json`** — TypeScript configuration
    - Path aliases: `@pages`, `@utils`, `@data`, `@setup` for imports
    - Strict mode enabled
    - Target: ESNext

- **`eslint.config.js`** — Linting rules
    - TypeScript recommended rules
    - Strict camelCase for functions/variables/parameters
    - StrictPascalCase for types
    - Unused variable warnings (allow leading underscore)

- **`.env.example`** — Template for environment variables (committed)

## Writing New Tests

1. **For authenticated workflows:**
    - Create a spec file in `tests/e2e-web/authenticated/TCA{number}-{feature}.spec.ts`
    - Import page objects and `logStep` from utilities
    - Write Given/When/Then steps; auth is automatic via `storageState`

2. **For independent/self-auth workflows:**
    - Create a spec file in `tests/e2e-web/independent/TCI{number}-{feature}.spec.ts`
    - Log in using a static user from `testUsers.ts`
    - Auth state is not shared; each test is self-contained

3. **Example authenticated test:**

    ```typescript
    import { test } from '@playwright/test';
    import { logStep } from '@utils/logger';
    import { HomePage } from '@pages/HomePage';

    test('User can navigate to locations', async ({ page }) => {
        const homePage = new HomePage(page);

        await logStep('Given user is on home page', () => homePage.givenUserIsOnHomePage());
        await logStep('When user clicks menu', () => homePage.whenUserClicksMenu());
        await logStep('Then user sees locations link', () => homePage.thenLocationsLinkIsVisible());
    });
    ```

## CI/CD Integration

- Playwright reporters output to `test-results/` and `playwright-report/`
- In CI mode (`CI=true`), tests retry once and artifacts (screenshots, video, traces) are kept on failure
- GitHub Actions integration: `reporter: ['github']` posts results directly to pull requests

## Common Patterns

### Dismissing Modal/Chat

```typescript
import { dismissModalIfPresent, closeChat } from '@utils/helpers';

await dismissModalIfPresent(page); // Closes all welcome modals
await closeChat(page); // Closes chat widget
```

### Generating Test Data

```typescript
import { generateUser } from '@utils/helpers';

const user = generateUser();
// { firstName, lastName, email, password }
```

### Waiting and Navigation

Page classes extend `BasePage` which provides these methods (call on page object instances, not Playwright's `page` fixture):

```typescript
await homePage.waitForPageLoad(); // Wait for DOM content
await homePage.navigate(path); // Navigate and wait for load
await homePage.waitForUrl(url); // Wait for URL match
```
