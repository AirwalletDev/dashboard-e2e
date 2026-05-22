import { test } from '@playwright/test';
import { HomePage } from '@pages/HomePage.js';
import { LocationPage } from '@pages/LocationPage.js';
import { closeChat, dismissModalIfPresent } from '@utils/helpers.js';
import { logStep } from '@utils/logger.js';

const locationTypes = ['Hospitality', 'Student Housing'];
test.describe('Location creation workflow', () => {
    for (const locationType of locationTypes) {
        test(`Create location with different location types ${locationType}`, async ({ page }) => {
            const homePage = new HomePage(page);
            const locationPage = new LocationPage(page);

            await logStep('Given the user is on Home page', () => homePage.givenUserIsOnHomePage());
            await logStep('Dismiss welcome modal if present', () => dismissModalIfPresent(page));
            await closeChat(page);
            await logStep('When the user clicks burger menu icon', () => homePage.whenUserClicksBurgerMenu());
            await logStep('When the user clicks menu item Locations', () => homePage.whenUserClicksMenuItemLocation());
            await logStep('Then the user is on Locations page', () => locationPage.thenTheUserIsOnLocationPage());
            await logStep('When the user clicks button New location', () =>
                locationPage.whenUserClicksButtonNewLocation()
            );
            await logStep('When the user enters location name', () => locationPage.whenTheUserEntersLocationName());
            await logStep('When the user selects location type', () =>
                locationPage.whenTheUserSelectsThisLocationType(locationType)
            );
            await logStep('When the user enters number of users', () =>
                locationPage.whenTheUserEntersNumberOfUsers('10')
            );
            await logStep('When the user enters address', () =>
                locationPage.whenTheUserEntersAddress('Pakhusgården 28')
            );
            await logStep('When the user enters city', () => locationPage.whenTheUserEntersCity('Odense'));
            await logStep('When the user enters postal code', () => locationPage.whenTheUserEntersPostalCode('5000'));
            await logStep('When the user clicks button to Create Location', () =>
                locationPage.whenTheUserClicksButtonCreateLocation()
            );
            await logStep('Then the user is on Locations page', () => locationPage.thenTheUserIsOnLocationPage());
            await logStep('Then the user can see correct location name', () =>
                locationPage.thenTheUserCanSeeThisLocationName()
            );
        });
    }
});
