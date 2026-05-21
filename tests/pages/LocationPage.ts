import { expect, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage.js';
import { faker } from '@faker-js/faker';

export class LocationPage extends BasePage {
    private readonly locationName: string;
    constructor(page: Page) {
        super(page);
        this.locationName = faker.company.name().trim().slice(0, 30);
    }

    /// -- Locators -----------------------------------------------------------------

    private get newLocationButton() {
        return this.page.locator('#create-location-btn');
    }

    private get createLocationButton() {
        return this.page.locator('#create-location-modal-btn');
    }

    private get inputFieldName() {
        return this.page.locator('input[name="name"]');
    }

    private get locationType() {
        return this.page.locator('[formcontrolname="location_type"]');
    }

    private get inputFieldNumberOfUsers() {
        return this.page.locator('input[name="number_of_users"]');
    }

    private get inputFieldStreetAddress() {
        return this.page.locator('input[name="line1"]');
    }

    private get inputFieldCity() {
        return this.page.locator('input[name="city"]');
    }

    private get inputFieldPostalCode() {
        return this.page.locator('input[name="postal_code"]');
    }

    /// -- Actions -----------------------------------------------------------------

    async thenTheUserIsOnLocationPage() {
        await this.waitForPageLoad();
        await this.waitForUrl('**/locations');
        expect(await this.getTitle()).toContain('Locations');
    }

    async whenUserClicksButtonNewLocation() {
        await this.newLocationButton.click();
    }

    async whenTheUserEntersLocationName() {
        await this.inputFieldName.fill(this.locationName);
    }

    async whenTheUserSelectsThisLocationType(type: string) {
        await this.locationType.click();
        await this.page.getByRole('option', { name: type }).click();
    }

    async whenTheUserEntersNumberOfUsers(numberOfUsers: string) {
        await this.inputFieldNumberOfUsers.fill(numberOfUsers);
    }

    async whenTheUserEntersAddress(address: string) {
        await this.inputFieldStreetAddress.fill(address);
    }

    async whenTheUserEntersCity(city: string) {
        await this.inputFieldCity.fill(city);
    }

    async whenTheUserEntersPostalCode(postCode: string) {
        await this.inputFieldPostalCode.fill(postCode);
    }

    async whenTheUserClicksButtonCreateLocation() {
        await this.createLocationButton.click();
    }

    async thenTheUserCanSeeThisLocationName() {
        const row = this.page.locator('row', { hasText: this.locationName });
        await expect(row).toBeVisible();
    }
}
