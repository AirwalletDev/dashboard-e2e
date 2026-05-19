import { test } from '@playwright/test';
import { DashboardUser, dismissModalIfPresent } from '@utils/helpers.js';
import { LoginPage } from '@pages/LoginPage.js';
import { testUsers } from '@data/testUsers.js';
import { logStep } from '@utils/logger.js';
import { HomePage } from '@pages/HomePage.js';

test('User can successfully log out from Airwallet dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    const staticUser: DashboardUser = {
        firstName: '',
        lastName: '',
        email: testUsers.user.email,
        password: testUsers.user.password,
    };

    await logStep('Given the user is on Sign In page', () => loginPage.givenUserIsOnSignInPage());
    await logStep(`When user signs in as ${staticUser.email}`, () =>
        loginPage.whenUserFillsInSignInForm(staticUser.email, staticUser.password)
    );
    await logStep(`When user clicks Sign in button`, () => loginPage.whenTheUserClicksSignInButton());
    await logStep('Then the user is on Home page', () => loginPage.thenTheUserIsOnHomePage());
    await logStep('Dismiss welcome modal if present', () => dismissModalIfPresent(page));
    await logStep('When the user clicks burger menu icon', () => homePage.whenUserClicksBurgerMenu());
    await logStep('When the user logs out from dashboard', () => loginPage.whenTheUserLogsOutFromDashboard());
    await logStep('Then the user is on Sign In page', () => loginPage.thenTheUserIsOnSignInPage());
});
