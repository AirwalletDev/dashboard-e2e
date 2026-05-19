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
        return this.page.locator('.sidebar-section').locator('#nav-locations');
    }

    private get burgerMenu() {
        return this.page.locator('.topbar').getByRole('img', {name: 'Burger Icon'})
    }

    // -- Actions -----------------------------------------------------------------

    async givenUserIsOnHomePage() {
        await this.navigate('/home')
    }

    async thenTheWelcomeMessagesIsShown(message: string) {
        const actualText = await this.textMessage.textContent()
        expect(actualText).toBe(message);
    }

    async whenUserClicksMenuItemLocation() {
        await this.menuItemLocation.click()
    }

    async whenUserClicksBurgerMenu() {
        await expect(this.burgerMenu).toBeAttached()
        await this.burgerMenu.click()
    }
}
