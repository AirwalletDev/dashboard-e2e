import {test} from "@playwright/test";
import {dismissModalIfPresent, generateUser} from "@utils/helpers";
import {LoginPage} from "@pages/LoginPage";
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import {HomePage} from "@pages/HomePage";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupUserDir = path.join(__dirname, ".state");
const setupUserAuth = path.join(__dirname, '.state/user.json')

let user: ReturnType<typeof generateUser>
test.beforeAll(() => {
    user = generateUser()
})

// -- user signup setup for the default shared auth across the tests
// -- storageState holds pre-created user auth
// -- this user is signed up once as first executed test, and its auth state is saved to a storageState file from where it can be reused in other test classes
// -- exceptions are JLA specific tests (todo -define JLA users as a separate set of tests with SSO login)
// -----------------------------------------------------------------
test('Create authenticated Airwallet dashboard user', async ({page}) => {
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);

        // create .auth directory if missing
        fs.mkdirSync(setupUserDir, {recursive: true});

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
        await homePage.thenTheWelcomeMessagesIsShown('Welcome to Airwallet!')

        //api call to append role = operator

        // save cookies + localStorage to disk
        await page.context().storageState({path: setupUserAuth});

    }
)







