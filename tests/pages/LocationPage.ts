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
        await this.waitForPageLoad()
        await this.waitForUrl('**/locations')
        expect(await this.getTitle()).toContain('Locations');
    }

    async whenUserClicksButtonNewLocation() {
        await this.newLocationButton.click();
    }

}