import {test} from '@playwright/test';
import {HomePage} from "@pages/HomePage";

test.use({storageState: 'tests/.auth/user.json'});//todo implement this as fixture
test('Home page loads and shows correctly logged user name', async ({page}) => {
    const homePage = new HomePage(page);

    await homePage.givenUserIsOnHomePage();
    await homePage.thenTheUserIsOnDashboardPage();
    await homePage.thenTheWelcomeMessagesIsShown('Welcome to Airwallet!');
})

