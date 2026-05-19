import {test} from "@playwright/test";
import {HomePage} from "@pages/HomePage.js";
import {LocationPage} from "@pages/LocationPage.js";
import {dismissModalIfPresent} from "@utils/helpers.js";
import {logStep} from "@utils/logger.js";

test('Location creation workflow', async ({page}) => {

    const homePage = new HomePage(page);
    const locationPage = new LocationPage(page);

    await logStep('Given the user is on Home page', () => homePage.givenUserIsOnHomePage());

    await logStep('Dismiss welcome modal if present', () => dismissModalIfPresent(page));

    await logStep('When the user clicks burger menu icon', () => homePage.whenUserClicksBurgerMenu());

    await logStep('When the user clicks menu item Locations', () => homePage.whenUserClicksMenuItemLocation());

    await logStep('Then the user is on Locations page', () => locationPage.thenTheUserIsOnLocationPage());

    await logStep('When the user clicks button New location', () => locationPage.whenUserClicksButtonNewLocation());
})

