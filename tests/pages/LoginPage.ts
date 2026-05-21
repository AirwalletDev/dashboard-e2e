import { expect } from '@playwright/test';
import { BasePage } from '@pages/BasePage.js';

export class LoginPage extends BasePage {
    // -- Locators -----------------------------------------------------------------
    private get country() {
        return this.page.getByRole('combobox');
    }

    get individualTypeCheckbox() {
        return this.page.getByText('Individual person');
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

    // private get signInButton() {
    //     return this.page.getByTestId('auth-submit-button');
    // }

    private get loader() {
        return this.page.locator('.app-loading-indicator');
    }

    private get signUpButton() {
        return this.page.getByRole('button', { name: 'Sign up' });
    }

    private get repeatPasswordButton() {
        return this.page.locator('#repeatPassword');
    }

    private get needAccountButton() {
        return this.page.getByRole('button', { name: 'Need an account?' });
    }

    private get termsAndConditionsCheckbox() {
        return this.page.locator('#terms_check');
    }

    private get GDPRCheckbox() {
        return this.page.locator('#gdpr_check');
    }

    private get logOutButton() {
        return this.page.locator('.log-out');
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
        await this.repeatPasswordButton.fill(password);
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
        await this.navigate("'/sign-in'");
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
}
