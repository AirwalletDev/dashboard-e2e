import {test} from '@playwright/test';
import {LoginPage} from "@pages/LoginPage";
import {DashboardUser, dismissModalIfPresent} from "@utils/helpers";
import {HomePage} from "@pages/HomePage";

test('User can successfully log out from Airwallet dashboard', async ({page}) => {
    const loginPage = new LoginPage(page);
    const staticUser: DashboardUser = {
        firstName: '',
        lastName: '',
        email: 'zinajda+44@airwallet.net',
        password: 'Airwallet2026!'
    };//todo move this to .env.sandbox
    await loginPage.givenUserIsOnSignInPage();
    await loginPage.whenUserFillsInSignInForm(staticUser.email, staticUser.password);
    await loginPage.whenTheUserClicksSignInButton();
    await dismissModalIfPresent(page);
    await loginPage.thenTheUserIsOnDashboardPage();
    await loginPage.whenTheUserLogsOutFromDashboard();
    await loginPage.thenTheUserIsOnSignInPage();
})

