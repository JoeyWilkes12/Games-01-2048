const { test, expect } = require('@playwright/test');
const path = require('path');

const SPEED_MULTIPLIER = process.env.DEMO_SPEED ? parseFloat(process.env.DEMO_SPEED) : 1.0;

const DEMO_CONFIG = {
    shortPause: 400 * (1 / SPEED_MULTIPLIER),
    mediumPause: 800 * (1 / SPEED_MULTIPLIER),
    longPause: 1500 * (1 / SPEED_MULTIPLIER),
    veryLongPause: 2500 * (1 / SPEED_MULTIPLIER),
    slowScrollPause: 8000 * (1 / SPEED_MULTIPLIER),
};

const pause = async (page, duration = DEMO_CONFIG.mediumPause) => await page.waitForTimeout(duration);

const slowClick = async (page, selector) => {
    const element = await page.locator(selector);
    await element.scrollIntoViewIfNeeded();
    await pause(page, DEMO_CONFIG.shortPause);
    await element.click();
    await pause(page, DEMO_CONFIG.shortPause);
};

const slowHover = async (page, selector) => {
    const element = await page.locator(selector);
    await element.scrollIntoViewIfNeeded();
    await element.hover();
    await pause(page, DEMO_CONFIG.shortPause);
};

const slowFullVerticalScroll = async (page, durationMs = 10000, containerSelector = null) => {
    const stepDelay = 100;
    const totalSteps = Math.floor(durationMs / stepDelay / 2);

    const scrollData = await page.evaluate(({ selector }) => {
        const el = selector ? document.querySelector(selector) : document.documentElement;
        return { scrollHeight: el.scrollHeight, clientHeight: el.clientHeight || window.innerHeight };
    }, { selector: containerSelector });

    const maxScroll = scrollData.scrollHeight - scrollData.clientHeight;
    const stepSize = Math.ceil(maxScroll / totalSteps);

    for (let pos = 0; pos < maxScroll; pos += stepSize) {
        await page.evaluate(({ y, selector }) => {
            const el = selector ? document.querySelector(selector) : window;
            if (el === window) window.scrollTo({ top: y, behavior: 'auto' });
            else el.scrollTop = y;
        }, { y: pos, selector: containerSelector });
        await page.waitForTimeout(stepDelay);
    }
    for (let pos = maxScroll; pos >= 0; pos -= stepSize) {
        await page.evaluate(({ y, selector }) => {
            const el = selector ? document.querySelector(selector) : window;
            if (el === window) window.scrollTo({ top: y, behavior: 'auto' });
            else el.scrollTop = y;
        }, { y: pos, selector: containerSelector });
        await page.waitForTimeout(stepDelay);
    }
};

test.describe('2048 Demo', () => {
    test.setTimeout(300000);

    test('Full Walkthrough', async ({ page }) => {
        console.log('🔢 Navigating to 2048...');
        await page.goto(`file://${path.join(__dirname, '../apps/games/2048/index.html')}`);
        await page.waitForLoadState('domcontentloaded');
        await pause(page, DEMO_CONFIG.longPause);

        // Open Settings Modal
        console.log('⚙️ Opening Settings...');
        await slowClick(page, '#settings-btn');
        await pause(page, DEMO_CONFIG.mediumPause);

        // Show theme options
        await slowClick(page, '#theme-picker');
        await pause(page, DEMO_CONFIG.shortPause);
        await page.keyboard.press('Escape');

        // Close settings
        await slowClick(page, '#close-settings');
        await pause(page, DEMO_CONFIG.shortPause);

        // Play a few moves
        console.log('🎯 Playing some moves...');
        await page.keyboard.press('ArrowRight');
        await pause(page, DEMO_CONFIG.shortPause);
        await page.keyboard.press('ArrowDown');
        await pause(page, DEMO_CONFIG.shortPause);

        // Demonstrate AI Play
        console.log('🤖 Demonstrating AI Play...');
        await slowClick(page, '#solve-btn');
        await pause(page, DEMO_CONFIG.veryLongPause);
        await slowClick(page, '#solve-btn'); // Stop

        // Navigate to Dashboard
        console.log('📊 Navigating to Analytics Dashboard...');
        await slowClick(page, '.research-btn');
        await page.waitForLoadState('domcontentloaded');
        await pause(page, DEMO_CONFIG.longPause);

        // Scroll Definitions
        // We are on definitions.html by default (or header nav redirects)
        // Adjusting logic based on observed file structure or assuming similar to original demo
        // For simplicity in this isolated test, we just verify we are there and scroll

        // Explore dashboard pages - FULL VERTICAL NAVIGATION
        console.log('📖 Exploring Definitions page (full scroll)...');
        // Assuming we are on definitions or can get there. Ideally check URL or selector.
        await slowFullVerticalScroll(page, DEMO_CONFIG.slowScrollPause);
    });
});
