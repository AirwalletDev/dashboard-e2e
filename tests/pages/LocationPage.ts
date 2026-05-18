import {expect, Page} from "@playwright/test";
import {BasePage} from "@pages/BasePage.js";

export class LocationPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    /// -- Locators -----------------------------------------------------------------

    private get newLocationButton() {
        return this.page.locator('#create-location-btn');
    }

    private get closeChatButton() {
        return this.page.getByRole('button', {name: `Close chat`});
    }

    /// -- Actions -----------------------------------------------------------------

    async thenTheUserIsOnLocationPage() {
        console.log('Expecting the user is on the Locations page');
        await this.waitForPageLoad()
        await this.waitForUrl('**/locations')
        expect(await this.getTitle()).toContain('Locations');
    }

    async whenUserClicksButtonNewLocation() {
        console.log('When user clicks button to create new location');
        await this.newLocationButton.click();
    }

    async whenTheUserClosesChatButton() {
        try {
            console.log('When user clicks button to close chat');
            await this.closeChatButton.click();
        } catch (e) {
            console.log('No open chat at the moment.');
        }

    }
}