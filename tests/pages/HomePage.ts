import { expect, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage.js';

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
        return this.page.locator('.topbar').getByRole('img', { name: 'Burger Icon' });
    }

    private get ownerSelector() {
        return this.page.locator('[data-testid="nav-sidebar-owner-selector"] button');
    }

    private get optionsPanel() {
        return this.page.locator('.options-panel');
    }

    // -- Actions -----------------------------------------------------------------

    async givenUserIsOnHomePage() {
        await this.navigate('/home');
    }

    async thenTheWelcomeMessageIsShown(message: string) {
        const actualText = await this.textMessage.textContent();
        expect(actualText).toBe(message);
    }

    async whenUserClicksMenuItemLocation() {
        await this.menuItemLocation.click();
    }

    async whenUserClicksBurgerMenu() {
        await expect(this.burgerMenu).toBeAttached();
        await this.burgerMenu.click();
    }

    async whenUserSwitchesOwnerTo(ownerEmail: string) {
        await expect(this.ownerSelector).toBeVisible();
        await this.ownerSelector.click();
        await this.optionsPanel.waitFor({ state: 'visible' });
        const option = this.optionsPanel.locator('.option').filter({ hasText: ownerEmail }).first();
        await expect(option).toBeVisible();
        await option.scrollIntoViewIfNeeded();
        await option.click();
    }

    async whenUserWaitsForAccountSwitch() {
        await this.page.waitForURL('**/locations'); // wait for the redirect to finish
    }
}
