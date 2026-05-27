import { test } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage.js';
import { logStep } from '@utils/logger.js';

test('User can successfully log in via SSO', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await logStep('Given the user is on Sign In page', () => loginPage.givenUserIsOnSignInPage());
    // Set up the listener for the popup BEFORE clicking the button.
    const popupPromise = page.waitForEvent('popup');
    await logStep('When the user clicks SSO login button', () => loginPage.whenTheUserClicksSamlSSOButton());

    const popup = await popupPromise;
    await popup.waitForLoadState();
});
