import {test as setup} from "@playwright/test";
import path from 'path';
import fs from 'fs';
import {dismissModalIfPresent, generateUser} from "@utils/helpers";
import {LoginPage} from "@pages/LoginPage";

const authDir = path.join(__dirname, ".auth");
const authFile = path.join(__dirname, '.auth/user.json')

let user: ReturnType<typeof generateUser>
setup.beforeAll(() => {
    user = generateUser()
})

// -- global setup for the default shared user across the tests
// -- storageState holds pre-created user
// -- this user is signed up once before the entire suite, and its auth state is saved to a storageState file
// -- exceptions are JLA specific tests (todo -define JLA users as a separate set of tests with SSO login)
// -----------------------------------------------------------------
setup('Create authenticated Airwallet dashboard user', async ({page}) => {

        const loginPage = new LoginPage(page);

        // create .auth directory if missing
        fs.mkdirSync(authDir, {recursive: true});

        await loginPage.givenUserIsOnSignUpPage();
        await loginPage.whenUserEntersThisCountry('Denmark');
        await loginPage.whenTheUserChecksIndividualType();
        await loginPage.whenUserFillsInSignUpForm(user.email, user.password);
        await loginPage.whenTheUserClicksButtonSignUp();
        await loginPage.thenTheUserIsOnSignInPage();
        await loginPage.whenUserFillsInSignInForm(user.email, user.password);
        await loginPage.whenTheUserClicksSignInButton();
        await dismissModalIfPresent(page);
        await loginPage.thenTheUserIsOnDashboardPage();

        // save cookies + localStorage to disk
        await page.context().storageState({path: authFile})

    }
)
