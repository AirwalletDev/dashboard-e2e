import { test } from '@playwright/test';

/**
 * Wraps a test action in a named step for Playwright's reporter.
 *
 * Instead of using console.log (which duplicates output in the terminal),
 * this delegates to test.step() which integrates natively with all reporters —
 * line, github, and HTML. Each step appears exactly once, with proper
 * pass/fail status and timing, and is collapsible in the HTML report.
 *
 * Usage:
 *   await logStep('When user clicks Sign in button', () => loginPage.clickSignIn());
 */
export async function logStep(message: string, action: () => Promise<void>) {
    await test.step(message, action);
}
