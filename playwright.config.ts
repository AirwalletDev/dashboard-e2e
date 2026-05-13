import {defineConfig, devices} from '@playwright/test';

require('dotenv').config({path: `.env.${process.env.ENV ?? 'sandbox'}`});

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: '50%',
    reporter: [['html'], ['list']],

    use: {
        channel: 'chrome',
        baseURL: process.env.BASE_URL,
        trace: 'retain-on-failure',
        screenshot: 'on',
        video: 'on',
        headless: false,

        //maximise browser
        viewport: null,
        launchOptions: {
            args: ['--start-maximized'],
        },
    },

    projects: [
        {name: 'setup', testMatch: '**/global.setup.ts'},
        {
            name: 'e2e-chrome-tests',
            use: {
                ...devices['Desktop Chrome'],
            },
            dependencies: ['setup'],
        },
    ],
});