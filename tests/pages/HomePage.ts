import {BasePage} from "@pages/BasePage"
import {expect, Page} from "@playwright/test";

export class HomePage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // -- Locators -----------------------------------------------------------------

    private get textMessage() {
        return this.page.locator('h1.welcome-title');
    }

    // -- Actions -----------------------------------------------------------------

    async thenTheUserIsOnDashboardPage() {
        await this.waitForPageLoad()
        await this.waitForUrl('**/home')
    }

    async givenUserIsOnHomePage() {
        await this.navigate('/home')
    }

    async thenTheWelcomeMessagesIsShown(message: string) {
        const actualText = await this.textMessage.textContent()
        expect(actualText).toBe(message);
    }

}
