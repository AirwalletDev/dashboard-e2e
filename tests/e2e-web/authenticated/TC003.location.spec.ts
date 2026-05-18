import {test} from "@playwright/test";
import {HomePage} from "@pages/HomePage.js";
import {LocationPage} from "@pages/LocationPage.js";
import {dismissModalIfPresent} from "@utils/helpers.js";
import {logStep} from "@utils/logger.js";

test('Location creation workflow', async ({page}) => {

    const homePage = new HomePage(page);
    const locationPage = new LocationPage(page);

    logStep('Given the user is on Home page');
    await homePage.givenUserIsOnHomePage();

    logStep('Dismiss welcome modal if present');
    await dismissModalIfPresent(page);

    logStep('When the user clicks burger menu icon');
    await homePage.whenUserClicksBurgerMenu();

    logStep('When the user clicks menu item Locations');
    await homePage.whenUserClicksMenuItemLocation();

    logStep('Then the user is on Locations page');
    await locationPage.thenTheUserIsOnLocationPage();

    logStep('When the user clicks button New location');
    await locationPage.whenUserClicksButtonNewLocation();
})

