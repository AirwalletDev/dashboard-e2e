import {expect} from "@playwright/test";
import {BasePage} from "@pages/BasePage.js";

export class LoginPage extends BasePage {

    // -- Locators -----------------------------------------------------------------
    private get country() {
        return this.page.getByRole('combobox')
    }

    get individualTypeCheckbox() {
        return this.page.getByText('Individual person')
    }

    private get emailInput() {
        return this.page.getByLabel('Email');
    }

    private get passwordInput() {
        return this.page.locator('[name="password"]');
    }

    private get signInButton() {
        return this.page.getByRole('button', {name: 'Sign in'});
    }

    private get signUpButton() {
        return this.page.getByRole('button', {name: 'Sign up'});
    }

    private get repeatPasswordButton() {
        return this.page.locator('#repeatPassword');
    }

    private get needAccountButton() {
        return this.page.getByRole('button', {name: 'Need an account?'})
    }

    private get termsAndConditionsCheckbox() {
        return this.page.locator('#terms_check')
    }

    private get GDPRCheckbox() {
        return this.page.locator('#gdpr_check')
    }

    private get logOutButton() {
        return this.page.locator('.log-out')
    }

    // -- Actions -----------------------------------------------------------------

    async givenUserIsOnSignUpPage() {
        console.log('Given the user is on Sign up page');
        await this.goto('/sign-in')
        await this.needAccountButton.click()
        await expect(this.page).toHaveTitle('Sign up');
    }

    async whenUserEntersThisCountry(country: string) {
        console.log(`When user enters this country for country: ${country}`);
        await this.country.fill(country)
        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter');
    }

    async whenTheUserChecksIndividualType() {
        console.log('When user click button to check individual type');
        await this.individualTypeCheckbox.click()
    }

    //when the user fills in its data and accepts conditions and GDPR
    async whenUserFillsInSignUpForm(email: string, password: string) {
        console.log(`When user fills in signup for email: ${email} and password: ${password}`);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.repeatPasswordButton.fill(password)
        await this.termsAndConditionsCheckbox.click()
        await this.GDPRCheckbox.click()
    }

    async whenTheUserClicksButtonSignUp() {
        console.log('When user clicks Sign up button');
        await this.signUpButton.click()
    }

    async thenTheUserIsOnDashboardPage() {
        console.log('Then the user is on dashboard');
        await this.waitForPageLoad()
        await this.waitForUrl('**/home')
    }

    async givenUserIsOnSignInPage() {
        console.log('Given the user is on Sign in page');
        await this.navigate("'/sign-in'")
        await expect(this.page).toHaveTitle("Sign in")
    }

    async whenUserFillsInSignInForm(email: string, password: string) {
        console.log(`When user fills in sign in form with email: ${email} and password: ${password}`);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
    }

    async whenTheUserClicksSignInButton() {
        console.log('When user clicks Sign in button');
        await this.signInButton.click()
    }

    async whenTheUserLogsOutFromDashboard() {
        console.log('When user clicks Log out button');
        await this.logOutButton.click()
    }

    async thenTheUserIsOnSignInPage() {
        console.log('Then the user is on Sign in page');
        await this.page.waitForURL('**/sign-in');
        await expect(this.page).toHaveTitle('Sign in');
    }
}