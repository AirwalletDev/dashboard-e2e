import {test} from "@playwright/test";
import {HomePage} from "@pages/HomePage";
import {LocationPage} from "@pages/LocationPage";
import {dismissModalIfPresent} from "@utils/helpers";

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

