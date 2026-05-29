import { expect, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage.js';

export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // -- Locators -----------------------------------------------------------------
    private get country() {
        return this.page.locator('[data-testid="sign-up-form-country-select"] input');
    }

    get individualTypeCheckbox() {
        return this.page.locator('[data-testid="sign-up-form-business-type-individual-radio"] input');
    }

    private get emailInput() {
        return this.page.getByLabel('Email');
    }

    private get passwordInput() {
        return this.page.locator('[name="password"]');
    }

    private get signInButton() {
        return this.page.getByRole('button', { name: 'Sign in' });
    }

    private get loader() {
        return this.page.locator('.app-loading-indicator');
    }

    private get signUpButton() {
        return this.page.locator('[data-testid="auth-submit-button"]');
    }

    private get repeatPasswordInput() {
        return this.page.locator('[data-testid="sign-up-form-repeat-password-input"]');
    }

    private get needAccountButton() {
        return this.page.getByRole('button', { name: 'Need an account?' });
    }

    private get termsAndConditionsCheckbox() {
        return this.page.locator('[data-testid="sign-up-form-terms-checkbox"]');
    }

    private get GDPRCheckbox() {
        return this.page.locator('[data-testid="sign-up-form-gdpr-checkbox"]');
    }

    private get logOutButton() {
        return this.page.locator('.log-out');
    }

    private get ssoButton() {
        return this.page.locator('[data-testid="auth-page-saml-sso-button"]');
    }

    // -- Actions -----------------------------------------------------------------

    async givenUserIsOnSignUpPage() {
        await this.goto('/sign-in');
        await this.needAccountButton.click();
        await expect(this.page).toHaveTitle('Sign up');
    }

    async whenUserEntersThisCountry(country: string) {
        await this.country.fill(country);
        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter');
    }

    async whenTheUserChecksIndividualType() {
        await this.individualTypeCheckbox.click();
    }

    //when the user fills in its data and accepts conditions and GDPR
    async whenUserFillsInSignUpForm(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.repeatPasswordInput.fill(password);
        await this.termsAndConditionsCheckbox.click();
        await this.GDPRCheckbox.click();
    }

    async whenTheUserClicksButtonSignUp() {
        await this.signUpButton.waitFor();
        await this.signUpButton.click({ force: true });
        await this.loader.waitFor({ state: 'hidden' });
    }

    async thenTheUserIsOnHomePage() {
        await this.waitForPageLoad();
        await this.waitForUrl('**/home');
    }

    async givenUserIsOnSignInPage() {
        await this.navigate('/sign-in');
        await expect(this.page).toHaveTitle('Sign in');
    }

    async whenUserFillsInSignInForm(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
    }

    async whenTheUserClicksSignInButton() {
        await this.signInButton.click();
        await this.loader.waitFor({ state: 'hidden' });
    }

    async whenTheUserLogsOutFromDashboard() {
        await this.logOutButton.click();
    }

    async thenTheUserIsOnSignInPage() {
        await this.page.waitForURL('**/sign-in');
        await expect(this.page).toHaveTitle('Sign in');
    }

    async whenUserPerformsSsoLogin(email: string, password: string) {
        const popupPromise = this.page.waitForEvent('popup');

        await this.ssoButton.waitFor({ state: 'visible' });
        await this.ssoButton.click();
        console.log('Found and clicked SSO button, waiting for popup...');

        const popup = await popupPromise;
        await popup.waitForLoadState();

        await popup.locator('input[type="email"]').waitFor({ state: 'visible', timeout: 10000 });
        await popup.locator('input[type="email"]').fill(email);
        await popup.locator('input[type="submit"], button:has-text("Next")').click({ timeout: 10000 });

        await popup.locator('input[type="password"]').waitFor({ state: 'visible', timeout: 10000 });
        await popup.locator('input[type="password"]').fill(password);
        await popup.locator('input[type="submit"], button:has-text("Sign in")').click({ timeout: 10000 });

        try {
            await popup.locator('#idBtn_Back, button:has-text("No")').click({ timeout: 5000 });
        } catch {
            // KMSI prompt did not appear
        }
        await this.page.waitForResponse(/.*owners/);
    }

    async thenUserIsLoggedInSuccessfully() {
        await expect(this.page).toHaveURL(/.*\/(home|locations)/);
    }
}
