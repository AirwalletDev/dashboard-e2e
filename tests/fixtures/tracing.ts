// import { test as base } from '@playwright/test';
// import fs from 'fs';
// import path from 'path';
//
// import { getTracePath } from '@utils/trace';
//
// export const test = base.extend({});
//
// test.beforeEach(async ({ context }) => {
//     await context.tracing.start({
//         screenshots: true,
//         snapshots: true,
//         sources: true,
//     });
// });
//
// test.afterEach(async ({ context }, testInfo) => {
//     const tracePath = getTracePath(testInfo);
//
//     fs.mkdirSync(path.dirname(tracePath), { recursive: true });
//
//     await context.tracing.stop({
//         path: tracePath,
//     });
//
//     await testInfo.attach('trace', {
//         path: tracePath,
//         contentType: 'application/zip',
//     });
// });
//
// export { expect } from '@playwright/test';