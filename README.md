# Airwallet E2E Test Suite

End-to-end tests for the Airwallet dashboard, written in [Playwright](https://playwright.dev/) with TypeScript. Covers web UI flows with a clean separation between authenticated and independent test scenarios.

---

## Prerequisites

- Node.js `v24` or higher
- Google Chrome installed
- Access to an Airwallet environment (sandbox / staging)
- `@types/node` installed (included in `npm install`)

---

## Setup

**1. Clone and install**

```bash
git clone <https://github.com/AirwalletDev/dashboard-e2e>
cd dashboard-e2e
npm install
```

**2. Install Playwright browsers**

```bash
npx playwright install chrome
```

**3. Configure environment variables**

```bash
cp .env.example .env.sandbox
```

Open `.env.sandbox` and fill in your values. See [Environment Variables](#environment-variables) for details.

---

## Environment Variables

Environment files follow this naming convention:

| File           | Purpose                               | Committed to Git |
| -------------- | ------------------------------------- | ---------------- |
| `.env.example` | Template showing what variables exist | ✅ Always        |
| `.env.sandbox` | Sandbox environment values            | ⚠️ Usually not   |

### Available variables

| Variable   | Description                    | Example                         |
| ---------- | ------------------------------ | ------------------------------- |
| `BASE_URL` | Base URL of the app under test | `https://sandbox.airwallet.net` |
| `ENV`      | Environment to run against     | `sandbox`, `staging`            |

### `.gitignore`

Make sure these are ignored:

```
.env.sandbox
tests/setup/.state/
```

---

## Running Tests

```bash
# Run all tests (sandbox by default)
npx playwright test

# Run against a specific environment
ENV=staging npx playwright test

# Run only authenticated tests
npx playwright test --project=e2e-chrome-tests

# Run only independent tests
npx playwright test --project=independent-tests

# Run a specific spec file
npx playwright test tests/e2e-web/authenticated/TCA1-location.spec.ts

# Run headed (see the browser)
npx playwright test --headed

# Debug mode
npx playwright test --debug

# Open HTML report
npx playwright show-report
```

---

## Project Structure

```
dashboard-e2e/
├── tests/
│   ├── api/                           # API-level tests (coming soon)
│   ├── data/                          # Shared test data
│   ├── e2e-web/
│   │   ├── authenticated/             # Tests requiring a logged-in user
│   │   │   └── TCA1-location.spec.ts
│   │   └── independent/               # Tests that manage their own auth
│   │       └── TCI1-logout.spec.ts
│   ├── pages/                         # Page Object Model classes
│   │   ├── BasePage.ts
│   │   ├── HomePage.ts
│   │   ├── LocationPage.ts
│   │   └── LoginPage.ts
│   ├── setup/
│   │   ├── .state/
│   │   │   └── user.json              # Saved auth state (git-ignored)
│   │   └── TCS1-signup.spec.ts       # Signup + auth state generation
│   └── utils/
│       └── helpers.ts                 # Shared utility functions
├── .env.example
├── .env.sandbox
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

---

## Test Projects

The suite is split into three Playwright projects:

### `setup`

Runs first. Signs up a freshly generated user, completes login, and saves browser auth state (cookies + localStorage) to `tests/setup/.state/user.json`.

### `e2e-chrome-tests`

Authenticated tests under `e2e-web/authenticated/`. Depends on `setup` and automatically receives the saved storageState via the project-level `use.storageState` config — no re-login or boilerplate needed in individual spec files.

### `independent-tests`

Tests under `e2e-web/independent/`. Does not depend on `setup`. Each test manages its own login using a static pre-existing user kept under `data/testUsers` — useful for flows like logout where you need full control over the auth flow.

---

## Auth Strategy

The suite uses a **shared auth state** pattern to avoid repeating login steps across tests:

1. `TCS1-signup.spec.ts` runs once as the setup step
2. It signs up a generated user, logs in, then persists the session to `tests/setup/.state/user.json`
3. The `e2e-chrome-tests` project injects that state automatically at the project level via `playwright.config.ts`

Adding a new authenticated test is as simple as creating a spec file under `e2e-web/authenticated/` — no auth setup required.

Independent tests bypass this entirely and log in directly using a static user defined per test.

---

## Writing Tests

### Page Object Pattern

All interaction logic lives in page classes under `tests/pages/`. Specs call page methods — never raw selectors.

```typescript
// ✅ correct
await loginPage.whenUserFillsInSignInForm(email, password);

// ❌ avoid
await page.locator('#email').fill(email);
```

### Step logging

Wrap every test action in `logStep()` instead of using `console.log`. It delegates to Playwright's native `test.step()`, so each step appears once in all reporters with proper **pass/fail** status and timing.

```typescript
import { test } from '@playwright/test';
import { logStep } from '@utils/helpers';
import { HomePage } from '@pages/HomePage';
import { LocationPage } from '@pages/LocationPage';

test('Location creation workflow', async ({ page }) => {
    const homePage = new HomePage(page);
    const locationPage = new LocationPage(page);

    await logStep('Given the user is on Home page', () => homePage.givenUserIsOnHomePage());
    await logStep('When the user clicks burger menu icon', () => homePage.whenUserClicksBurgerMenu());
    await logStep('Then the user is on Locations page', () => locationPage.thenTheUserIsOnLocationPage());
});
```

### Adding a new spec/test

```typescript
import { test } from '@playwright/test';
import { logStep } from '@utils/helpers';
import { YourPage } from '@pages/YourPage';

test('Your test description', async ({ page }) => {
    const yourPage = new YourPage(page);

    await logStep('Given user is on your page', () => yourPage.givenUserIsOnYourPage());
    await logStep('When user takes some action', () => yourPage.whenUserTakesSomeAction());
    await logStep('Then something is visible', () => yourPage.thenSomethingIsVisible());
});
```

### Naming conventions

| What         | Convention                              | Example                           |
| ------------ | --------------------------------------- |-----------------------------------|
| Spec files   | `TC{project}{number}-{feature}.spec.ts` | `TCI1-location.spec.ts`           |
| Page classes | `{Feature}Page.ts`                      | `LocationPage.ts`                 |
| Test names   | Full sentence describing behaviour      | `'User can successfully log out'` |
| Page methods | `given / when / then` prefix            | `givenUserIsOnSignInPage()`       |

Page methods follow the **Given / When / Then** pattern:

- `given...` — navigation and preconditions
- `when...` — user actions
- `then...` — assertions

### Method naming conventions
Method names use strict camelCase. Treat acronyms as words: `User`, not `USer`; `Url`, not `URL`. Keep nouns singular when they refer to a single thing: `thenTheWelcomeMessageIsShown`, not `thenTheWelcomeMessagesIsShown`.

### TC labels

| Label | Project             |
|-------| ------------------- |
| TCS   | Setup               |
| TCA   | Authenticated tests |
| TCI   | Independent tests   |

---

## Code Style

This project uses [Prettier](https://prettier.io/) for code formatting. Formatting is enforced in CI — pull requests will fail if code is not formatted.

Before pushing, run:

```bash
npm run format
```

## CI/CD

To replicate CI behaviour locally:

```bash
CI=true npx playwright test
```

In CI mode: `forbidOnly` is enabled, retries are set to `1`, and artifacts (screenshots, video, traces) are retained on failure.

---

## Reporting

Playwright generates an HTML report after every run:

```bash
npx playwright show-report
```

The report includes pass/fail per test, screenshots on failure, video recordings, and traces openable in [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer).
