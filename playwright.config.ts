import { defineConfig } from '@playwright/test';
import { config } from 'dotenv';

config({ path: `.env.${process.env.ENV ?? 'sandbox'}`, quiet: true });

if (!process.env.BASE_URL) {
    throw new Error('BASE_URL environment variable is missing');
}

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: '50%',
    reporter: process.env.CI
        ? [['github'], ['html'], ['list', { printSteps: true }]]
        : [['list', { printSteps: true }], ['html']],
    use: {
        channel: 'chrome',
        baseURL: process.env.BASE_URL,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        headless: true,
    },

    projects: [
        { name: 'setup', testMatch: 'setup/TC001.signup.spec.ts' },
        {
            name: 'independent-tests',
            testMatch: '/e2e-web/independent/**',
            // no dependencies, no storageState — uses its own static user
        },

        {
            name: 'e2e-chrome-tests',
            testMatch: '/e2e-web/authenticated/**',
            dependencies: ['setup'],
            use: { storageState: 'tests/setup/.state/user.json' },
            //authentication dependency, use storageState to obtain token
        },
    ],
});
