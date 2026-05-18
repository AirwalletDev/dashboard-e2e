import {test} from "@playwright/test";
import fs from 'node:fs';
import {dismissModalIfPresent, generateUser} from "@utils/helpers.js";
import {LoginPage} from "@pages/LoginPage.js";
import {HomePage} from "@pages/HomePage.js";
import {logStep, logSuccess} from "@utils/logger.js";

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
test('Create authenticated Airwallet dashboard user', async ({page}) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    logStep('Create auth state directory');
    fs.mkdirSync(setupUserDir, {recursive: true});

    logStep('Given the user is on Sign Up page');
    await loginPage.givenUserIsOnSignUpPage();

    logStep('When user selects Denmark as country');
    await loginPage.whenUserEntersThisCountry('Denmark');

    logStep('When user selects Individual account type');
    await loginPage.whenTheUserChecksIndividualType();

    logStep(`When user fills in Sign Up form with email: ${user.email}`);
    await loginPage.whenUserFillsInSignUpForm(
        user.email,
        user.password
    );

    logStep('When user clicks Sign Up button');
    await loginPage.whenTheUserClicksButtonSignUp();

    logStep('Then user is redirected to Sign In page');
    await loginPage.thenTheUserIsOnSignInPage();

    logStep(`When user signs in as ${user.email}`);
    await loginPage.whenUserFillsInSignInForm(
        user.email,
        user.password
    );

    await loginPage.whenTheUserClicksSignInButton();

    logStep('Dismiss welcome modal if present');
    await dismissModalIfPresent(page);

    logStep('Then user is on Dashboard page');
    await loginPage.thenTheUserIsOnDashboardPage();

    logSuccess('Then welcome message is shown');
    await homePage.thenTheWelcomeMessagesIsShown(
        'Welcome to Airwallet!'
    );

    logStep('Save authenticated storage state');
    await page.context().storageState({
        path: setupUserAuth,
    });
});