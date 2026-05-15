import {test} from "@playwright/test";
import {HomePage} from "@pages/HomePage";
import {LocationPage} from "@pages/LocationPage";
import {dismissModalIfPresent} from "@utils/helpers";

const setupUserAuth = "tests/setup/.state/user.json";

//Load the auth state saved by setup in state
test.use({storageState: setupUserAuth});
test('Location creation workflow', async ({page}) => {

    const homePage = new HomePage(page);
    const locationPage = new LocationPage(page);

    await test.step('create location', async () => {
        await homePage.givenUserIsOnHomePage();
        await dismissModalIfPresent(page);
        await homePage.whenUserClicksMenuItemLocation();
        await locationPage.thenTheUserIsOnLocationPage();
        await locationPage.whenUserClicksButtonNewLocation();
    })
})

