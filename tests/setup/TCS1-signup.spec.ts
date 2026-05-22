import { test } from '@playwright/test';
import fs from 'node:fs';
import { dismissModalIfPresent, generateUser } from '@utils/helpers.js';
import { LoginPage } from '@pages/LoginPage.js';
import { HomePage } from '@pages/HomePage.js';
import { logStep } from '@utils/logger.js';

const setupUserDir = 'tests/setup/.state';
const setupUserAuth = 'tests/setup/.state/user.json';

let user: ReturnType<typeof generateUser>;

test.beforeAll(() => {
    user = generateUser();
});

// -- user signup setup for the default shared auth across the tests
// -- storageState holds pre-created user auth
// -- this user is signed up once as first executed test, and its auth state is saved to a storageState file from where it can be reused in other test classes
// -- exceptions are JLA specific tests (todo -define JLA users as a separate set of tests with SSO login)
// -----------------------------------------------------------------
test('Create authenticated Airwallet dashboard user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await logStep('Create auth state directory', async () => {
        fs.mkdirSync(setupUserDir, { recursive: true });
    });
    await logStep('Given the user is on Sign Up page', () => loginPage.givenUserIsOnSignUpPage());
    await logStep('When user selects Denmark as country', () => loginPage.whenUserEntersThisCountry('Denmark'));
    await logStep('When user selects Individual account type', () => loginPage.whenTheUserChecksIndividualType());
    await logStep(`When user fills in Sign Up form with user with this email: ${user.email}`, () =>
        loginPage.whenUserFillsInSignUpForm(user.email, user.password)
    );
    await logStep('When user clicks Sign Up button', () => loginPage.whenTheUserClicksButtonSignUp());
    await logStep('Then user is redirected to Sign In page', () => loginPage.thenTheUserIsOnSignInPage());
    await logStep(`When user signs in as ${user.email}`, () =>
        loginPage.whenUserFillsInSignInForm(user.email, user.password)
    );
    await logStep('When the user clicks Sign in button', () => loginPage.whenTheUserClicksSignInButton());
    await logStep('Dismiss welcome modal if present', () => dismissModalIfPresent(page));
    await logStep('Then user is on Home page', () => loginPage.thenTheUserIsOnHomePage());
    await logStep('Then welcome message is shown', () =>
        homePage.thenTheWelcomeMessageIsShown('Welcome to Airwallet!')
    );
    await logStep('Save authenticated storage state', async () => {
        await page.context().storageState({ path: setupUserAuth });
    });
});
