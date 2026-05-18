import {test} from '@playwright/test';
import {DashboardUser, dismissModalIfPresent} from "@utils/helpers.js";
import {LoginPage} from "@pages/LoginPage.js";
import {testUsers} from "@data/testUsers.js";
import {logStep, logSuccess} from "@utils/logger.js";
import {HomePage} from "@pages/HomePage.js";

test('User can successfully log out from Airwallet dashboard', async ({page}) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    const staticUser: DashboardUser = {
        firstName: '',
        lastName: '',
        email: testUsers.user.email,
        password: testUsers.user.password,
    };

    logStep('Given the user is on Sign In page')
    await loginPage.givenUserIsOnSignInPage();

    logStep(`When user signs in as ${staticUser.email}`)
    await loginPage.whenUserFillsInSignInForm(
        staticUser.email,
        staticUser.password
    );

    logStep(`When user clicks Sign in button`)
    await loginPage.whenTheUserClicksSignInButton();

    logStep('Then the user is on Dashboard page')
    await loginPage.thenTheUserIsOnDashboardPage();

    logStep('Dismiss welcome modal if present')
    await dismissModalIfPresent(page);

    logStep('When the user clicks burger menu icon')
    await homePage.whenUserClicksBurgerMenu();

    logStep('When the user logs out from dashboard')
    await loginPage.whenTheUserLogsOutFromDashboard();

    logSuccess('Then the user is on Sign In page')
    await loginPage.thenTheUserIsOnSignInPage();

});