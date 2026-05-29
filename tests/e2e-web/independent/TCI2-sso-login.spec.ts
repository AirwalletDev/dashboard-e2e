import { test } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage.js';
import { AccountPage } from '@pages/AccountPage.js';
import { HomePage } from '@pages/HomePage.js';
import { LocationPage } from '@pages/LocationPage.js';
import { testUsers } from '@data/testUsers.js';
import { logStep } from '@utils/logger.js';
import { dismissModalIfPresent } from '@utils/helpers.js';

const { email, password } = testUsers.ssoUser;

test('User can log in via SSO, delete account, re-login, and switch between owner accounts', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const accountPage = new AccountPage(page);
    const homePage = new HomePage(page);
    const locationPage = new LocationPage(page);

    await logStep('Given the user is on Sign In page', () => loginPage.givenUserIsOnSignInPage());
    await logStep('When user logs in via SSO', () => loginPage.whenUserPerformsSsoLogin(email, password));
    await logStep('Then user is logged in successfully', () => loginPage.thenUserIsLoggedInSuccessfully());
    await logStep('Dismiss welcome modal if present', () => dismissModalIfPresent(page));

    await logStep('Given user is on Account page', () => accountPage.givenUserIsOnAccountPage());
    await logStep('When user deletes their SSO account', () => accountPage.whenUserDeletesAccount());

    await logStep('Given the user is on Sign In page', () => loginPage.givenUserIsOnSignInPage());
    await logStep('When user logs in via SSO again', () => loginPage.whenUserPerformsSsoLogin(email, password));
    await logStep('Then user is logged in successfully', () => loginPage.thenUserIsLoggedInSuccessfully());
    await logStep('Dismiss welcome modal if present', () => dismissModalIfPresent(page));
    await logStep('When the user clicks burger menu icon', () => homePage.whenUserClicksBurgerMenu());

    await logStep('When user switches owner to testautomation_2', () =>
        homePage.whenUserSwitchesOwnerTo(testUsers.dashboardOwner_2.email)
    );
    await logStep('When user waits for account switch to complete', () => homePage.whenUserWaitsForAccountSwitch());
    // await logStep('When user navigates to locations page', () => locationPage.whenUserNavigatesToLocationsViaNav());
    await logStep('Then location "Nyborgvej - Bosch Washer" is visible', () =>
        locationPage.thenLocationIsVisible('Nyborgvej - Bosch Washer')
    );

    await logStep('When the user clicks burger menu icon', () => homePage.whenUserClicksBurgerMenu());
    await logStep('When user switches owner to testautomation_1', () =>
        homePage.whenUserSwitchesOwnerTo(testUsers.dashboardOwner_1.email)
    );
    await logStep('When user waits for account switch to complete', () => homePage.whenUserWaitsForAccountSwitch());
    //await logStep('When user navigates to locations page', () => locationPage.whenUserNavigatesToLocationsViaNav());
    await logStep('Then location "Munkebjerg Park - Miele washer" is visible', () =>
        locationPage.thenLocationIsVisible('Munkebjerg Park - Miele washer')
    );
    await logStep('Then location "Nyborgvej - Bosch Washer" is not visible', () =>
        locationPage.thenLocationIsNotVisible('Nyborgvej - Bosch Washer')
    );
});
