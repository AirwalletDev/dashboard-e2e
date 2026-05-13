# Airwallet E2E Test Suite

End-to-end tests for the Airwallet dashboard, written in [Playwright](https://playwright.dev/) with TypeScript.

---

## Prerequisites

- Node.js `v18` or higher
- Google Chrome installed
- Access to the Airwallet (sandbox/staging) environment

---

## Setup

**1. Clone the repository and install dependencies**

```bash
git clone <https://github.com/AirwalletDev/dashboard-e2e/tree/main>
cd <dashboard-e2e>
npm install
```

**2. Install Playwright browsers**

```bash
npx playwright install chrome
```

**3. Configure environment variables**

Copy the example file to create your local `.env`:

```bash
cp .env.example .env.local
```

Then open `.env.local` and fill in your real values.

Fill in your local values in `.env.local`. See [Environment Variables](#environment-variables) for details.

---

## Environment Variables

Environment files follow this naming convention:

| File              | Purpose | Committed to Git |
|-------------------|---------|-----------------|
| `.env.local`      | Your local secrets and values | ❌ Never |
| `.env.example`    | Template showing what variables exist | ✅ Always |
| `.env.staging`    | Staging environment values | ⚠️ Usually not |
| `.env.production` | Production values | ❌ Never |

### Available variables

| Variable | Description | Example |
|----------|-------------|---------|
| `BASE_URL` | Base URL of the app under test | `https://sandbox.airwallet.net` |
| `ENV` | Environment to run against | `sandbox`, `staging`, `production` |

### .gitignore

Make sure these are ignored:

```
.env
.env.local
.env.staging
.env.production
tests/.auth/
```

---

## Running Tests

### Run all tests

```bash
npx playwright test
```

### Run against a specific environment

```bash
ENV=staging npx playwright test
ENV=production npx playwright test
```

### Run a specific spec file

```bash
npx playwright test tests/web/home.spec.ts
npx playwright test tests/web/login.spec.ts
```

### Run in headed mode (see the browser)

```bash
npx playwright test --headed
```

### Run in debug mode

```bash
npx playwright test --debug
```

### Open the HTML report after a run

```bash
npx playwright show-report
```

---

## Project Structure

```
├── tests/
│   ├── .auth/                  # Saved auth state (gitignored)
│   │   └── user.json
│   ├── fixtures/
│   │   └── authenticatedTest.ts  # Custom auth fixture
│   ├── pages/                  # Page Object Models
│   │   ├── HomePage.ts
│   │   └── LoginPage.ts
│   ├── utils/
│   │   └── helpers.ts          # Shared utilities and types
│   ├── global.setup.ts         # Runs once before the suite — creates auth state
│   ├── home.spec.ts
│   └── login.spec.ts
├── .env.example
├── playwright.config.ts
└── README.md
```

---

## Authentication

Before the suite runs, `global.setup.ts` signs up a fresh user and saves the browser storage state to `tests/.auth/user.json`. Tests that need auth load this state automatically via a custom fixture.

### Authenticated tests

Import `test` from the custom fixture instead of `@playwright/test`:

```typescript
import { test } from '@fixtures/authenticatedTest';
```

This loads `tests/.auth/user.json` into the browser context automatically — the test starts with user already logged in.

### Unauthenticated tests

Import `test` from `@playwright/test` directly:

```typescript
import { test } from '@playwright/test';
```

The page starts with a clean browser context — no saved session.

---

## Writing Tests

### Page Object Pattern

All interaction logic lives in Page Object classes under `tests/pages/`. Tests should only call page object methods, never interact with selectors directly.

```typescript
// ✅ correct
await loginPage.whenUserFillsInSignInForm(email, password);

// ❌ avoid
await page.locator('#email').fill(email);
```

### Adding a new authenticated test

1. Create your spec file under `tests/`
2. Import from the auth fixture:

```typescript
import { test } from '@fixtures/authenticatedTest';
import { YourPage } from '@pages/YourPage';

test('your test description', async ({ page }) => {
    const yourPage = new YourPage(page);
    // test starts already logged in
});
```

### Adding a new unauthenticated test

1. Create your spec file under `tests/`
2. Import from `@playwright/test`:

```typescript
import { test } from '@playwright/test';
import { YourPage } from '@pages/YourPage';

test('your test description', async ({ page }) => {
    const yourPage = new YourPage(page);
    // test starts with a clean context
});
```

### Naming conventions

| What | Convention | Example |
|------|-----------|---------|
| Spec files | `<feature>.spec.ts` | `home.spec.ts` |
| Page objects | `<Feature>Page.ts` | `HomePage.ts` |
| Test names | Full sentence describing behavior | `'New user can successfully log in and out'` |
| Page methods | `given/when/then` prefix | `givenUserIsOnSignInPage()` |

Page methods follow the **Given / When / Then** pattern from BDD (Behaviour Driven Development):

- **given** — precondition or context (e.g. `givenUserIsOnSignInPage()`)
- **when** — action performed by the user (e.g. `whenUserFillsInSignInForm()`)
- **then** — verification or expected outcome (e.g. `thenTheUserIsOnDashboardPage()`)

## How Tests Are Scheduled

```
Worker 1: [global.setup.ts] → [home.spec.ts]
Worker 2:                      [login.spec.ts]
```

- `global.setup.ts` runs first and must pass before `home.spec.ts` starts
- `login.spec.ts` starts immediately in parallel with setup
- If setup fails, `home.spec.ts` is skipped automatically

This is controlled in `playwright.config.ts` via project dependencies:

```typescript
projects: [
    { name: 'setup', testMatch: '**/global.setup.ts' },
    {
        name: 'chrome',
        use: { ...devices['Desktop Chrome'] },
        dependencies: ['setup'],
    },
],
```

---

## CI/CD -> to be edited

Tests run automatically on pull requests. The pipeline:

1. Installs dependencies and Playwright browsers
2. Runs the full suite headless
3. Uploads the HTML report as a build artifact

To replicate CI behaviour locally:

```bash
CI=true npx playwright test
```

> CI mode uses `2 retries` on failure and `2 workers`.

---

## Reporting

Playwright generates an HTML report after every run.

```bash
npx playwright show-report
```

The report includes:
- Pass/fail status per test
- Screenshots on failure
- Video recordings of every test
- Traces for failed tests (openable in [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer))


Playwright traces - TBD
