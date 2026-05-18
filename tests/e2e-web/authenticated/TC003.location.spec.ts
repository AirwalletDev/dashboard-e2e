import {test} from "@playwright/test";
import {HomePage} from "@pages/HomePage.js";
import {LocationPage} from "@pages/LocationPage.js";
import {dismissModalIfPresent} from "@utils/helpers.js";

test('Location creation workflow', async ({page}) => {

    const homePage = new HomePage(page);
    const locationPage = new LocationPage(page);

    await test.step('create location', async () => {
        await homePage.givenUserIsOnHomePage();
        await dismissModalIfPresent(page);
        await homePage.whenUserClicksMenuItemLocation();
        await locationPage.whenTheUserClosesChatButton();
        await locationPage.thenTheUserIsOnLocationPage();
        await locationPage.whenUserClicksButtonNewLocation();
    })
})

