import {expect, Page} from "@playwright/test";
import {BasePage} from "@pages/BasePage.js";

export class HomePage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // -- Locators -----------------------------------------------------------------

    private get textMessage() {
        return this.page.locator('h1.welcome-title');
    }

    private get menuItemLocation() {
        return this.page.getByRole('button', {name: 'locations icon Locations'});
    }

    // -- Actions -----------------------------------------------------------------

    async givenUserIsOnHomePage() {
        console.log('Given the user is on the Home page');
        await this.navigate('/home')
    }

    async thenTheWelcomeMessagesIsShown(message: string) {
        console.log(`Then the message shown: ${message}`);
        const actualText = await this.textMessage.textContent()
        expect(actualText).toBe(message);
    }

    async whenUserClicksMenuItemLocation() {
        console.log('When user click menu item Locations');
        await this.menuItemLocation.click()
    }
}
