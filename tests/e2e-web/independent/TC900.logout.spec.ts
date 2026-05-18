import {test} from '@playwright/test';
import {DashboardUser, dismissModalIfPresent} from "@utils/helpers.js";
import {LoginPage} from "@pages/LoginPage.js";
import {testUsers} from "@data/testUsers.js";

test('User can successfully log out from Airwallet dashboard', async ({page}) => {
    const loginPage = new LoginPage(page);
    const staticUser: DashboardUser = {
        firstName: '',
        lastName: '',
        email: testUsers.user.email,
        password: testUsers.user.password,
    };
    console.log(process.env.TEST_USER_EMAIL)
    console.log(process.env.TEST_USER_PASSWORD);
    console.log('BASE_URL:', process.env.BASE_URL);
    await loginPage.givenUserIsOnSignInPage();
    await loginPage.whenUserFillsInSignInForm(staticUser.email, staticUser.password);
    await loginPage.whenTheUserClicksSignInButton();
    await dismissModalIfPresent(page);
    await loginPage.thenTheUserIsOnDashboardPage();
    await loginPage.whenTheUserLogsOutFromDashboard();
    await loginPage.thenTheUserIsOnSignInPage();
})

