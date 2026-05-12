import {Page} from "@playwright/test";

export abstract class BasePage {
    constructor(protected page: Page) {
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('domcontentloaded')
    }

    //browser tab title
    async getTitle(): Promise<string> {
        return this.page.title();
    }

    async waitForUrl(url: string): Promise<void> {
        return this.page.waitForURL(url)
    }

    async goto(path: string) {
        await this.navigate(path);
    }

    async navigate(path: string) {
        await this.page.goto(path);
        await this.waitForPageLoad();
    }
}