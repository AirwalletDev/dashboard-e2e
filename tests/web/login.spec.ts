import {test} from '@playwright/test';
import {LoginPage} from "@pages/LoginPage";
import {DashboardUser} from "@utils/helpers";

test('New user can successfully log in and out from Airwallet dashboard', async ({page}) => {
    const loginPage = new LoginPage(page);
    const staticUser: DashboardUser = {
        firstName: '',
        lastName: '',
        email: 'zinajda+44@airwallet.net',
        password: 'Airwallet2026!'
    };
    await loginPage.givenUserIsOnSignInPage();
    await loginPage.whenUserFillsInSignInForm(staticUser.email, staticUser.password);
    await loginPage.thenTheUserIsOnDashboardPage();
    await loginPage.whenTheUserLogsOutFromDashboard();
    await loginPage.thenTheUserIsOnSignInPage();
})


