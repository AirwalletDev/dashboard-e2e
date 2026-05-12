// import path from 'path';
//
// export function getTracePath(testInfo: any) {
//     const fileName = path.basename(testInfo.file, '.spec.ts');
//
//     const safeTitle = testInfo.title
//         .replace(/\s+/g, '-')
//         .replace(/[^\w-]/g, '')
//         .toLowerCase();
//
//     return `test-results/traces/${fileName}/${safeTitle}-${testInfo.project.name}-retry${testInfo.retry}.zip`;
// }