import {faker} from '@faker-js/faker';
import {Page} from "@playwright/test";

export interface DashboardUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export function generateUser(): DashboardUser {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
        firstName,
        lastName,
        email: `${firstName}.${lastName}.${Date.now()}@testmail.com`.toLowerCase(),
        password: 'Airwallet2026!',
    };
}


// --- Helper to dismiss the modal via the specific button ID ---
export async function dismissModalIfPresent(page: Page): Promise<void> {
    try {
        console.log('Checking for welcome modal(s) to dismiss...');

        // 1. Wait for at least one visible button to appear
        await page.waitForSelector('#dismiss_modal:visible', {timeout: 2000});

        // 2. Get ALL visible buttons
        const buttons = await page.locator('#dismiss_modal:visible').all();
        console.log(`Found ${buttons.length} modal button(s).`);

        // 3. Loop through and click each one
        for (const button of buttons) {
            // Re-check visibility before clicking, in case clicking the previous one closed this one too
            if (await button.isVisible()) {
                await button.click({force: true});
                console.log('Clicked a dismiss button.');

                // Small pause to let UI react (optional but helpful if animations are overlapping)
                await page.waitForTimeout(200);
            }
        }

        // 4. Final Verification: Ensure NO visible buttons remain
        // We use a locator that finds visible buttons and expect the count to be 0
        await page.locator('#dismiss_modal:visible').waitFor({state: 'detached', timeout: 2000});

        console.log('All welcome modals are gone.');
    } catch (e) {
        // If waitForSelector times out, it means 0 modals appeared. This is good.
        console.log('No welcome modal present (or cleared successfully).');
    }
}
