import {test} from '@playwright/test';
import {LoginPage} from "@pages/LoginPage";
import {DashboardUser, dismissModalIfPresent} from "@utils/helpers";
import {HomePage} from "@pages/HomePage";

test('User can successfully log out from Airwallet dashboard', async ({page}) => {
    const loginPage = new LoginPage(page);
    const staticUser: DashboardUser = {
        firstName: '',
        lastName: '',
        email: process.env.TEST_USER_EMAIL ?? '',
        password: process.env.TEST_USER_PASSWORD ?? '',
    };
    await loginPage.givenUserIsOnSignInPage();
    await loginPage.whenUserFillsInSignInForm(staticUser.email, staticUser.password);
    await loginPage.whenTheUserClicksSignInButton();
    await dismissModalIfPresent(page);
    await loginPage.thenTheUserIsOnDashboardPage();
    await loginPage.whenTheUserLogsOutFromDashboard();
    await loginPage.thenTheUserIsOnSignInPage();
})

