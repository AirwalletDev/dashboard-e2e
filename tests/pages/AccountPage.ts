import { Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage.js';

export class AccountPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // -- Locators -----------------------------------------------------------------
    private get deleteAccountButton() {
        return this.page.locator('[data-testid="account-page-delete-card-delete-account-button"]');
    }

    private get confirmDeleteButton() {
        return this.page.locator('#confirm-delete');
    }

    // -- Actions -----------------------------------------------------------------

    async givenUserIsOnAccountPage() {
        try {
            await this.navigate('/account');
        } catch {
            await this.page.waitForLoadState('domcontentloaded');
        }
        await this.deleteAccountButton.waitFor({ state: 'visible' });
    }

    async whenUserDeletesAccount() {
        await this.deleteAccountButton.click();
        await this.confirmDeleteButton.click();
        await this.page.waitForResponse(/.*delete_account/);
        await this.page.waitForURL(/.*sign-in/, { timeout: 10000 });
        await this.page.waitForLoadState('networkidle');
        await this.page.context().clearCookies();
    }
}
