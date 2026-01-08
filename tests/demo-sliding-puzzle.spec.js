const { test, expect } = require('@playwright/test');
const path = require('path');

const SPEED_MULTIPLIER = process.env.DEMO_SPEED ? parseFloat(process.env.DEMO_SPEED) : 1.0;

const DEMO_CONFIG = {
    shortPause: 400 * (1 / SPEED_MULTIPLIER),
    mediumPause: 800 * (1 / SPEED_MULTIPLIER),
    longPause: 1500 * (1 / SPEED_MULTIPLIER),
    veryLongPause: 2500 * (1 / SPEED_MULTIPLIER),
};

const pause = async (page, duration = DEMO_CONFIG.mediumPause) => await page.waitForTimeout(duration);

const slowClick = async (page, selector) => {
    const element = await page.locator(selector);
    await element.scrollIntoViewIfNeeded();
    await pause(page, DEMO_CONFIG.shortPause);
    await element.click();
    await pause(page, DEMO_CONFIG.shortPause);
};

test.describe('Sliding Puzzle Demo', () => {
    test.setTimeout(300000);

    test('Full Walkthrough', async ({ page }) => {
        console.log('🧩 Navigating to Sliding Puzzle...');
        await page.goto(`file://${path.join(__dirname, '../apps/games/Sliding Puzzle 3x3/index.html')}`);
        await page.waitForLoadState('domcontentloaded');
        await pause(page, DEMO_CONFIG.longPause);

        // Show using Hint feature
        console.log('💡 Using Hint feature...');
        await slowClick(page, '#hint-btn');
        await pause(page, DEMO_CONFIG.longPause);

        // Click the suggested tile
        const hintedTile = page.locator('#game-grid .tile.hint-suggested');
        if (await hintedTile.count() > 0) {
            await hintedTile.click();
            await pause(page, DEMO_CONFIG.mediumPause);
        }

        // Open Settings
        console.log('⚙️ Opening Settings...');
        await slowClick(page, '#settings-btn');
        await pause(page, DEMO_CONFIG.mediumPause);

        // Enable stats
        const statsCheckbox = page.locator('#stats-toggle');
        if (await statsCheckbox.isVisible()) {
            if (!(await statsCheckbox.isChecked())) await statsCheckbox.click();
        }
        await pause(page, DEMO_CONFIG.mediumPause);

        // Close settings
        await slowClick(page, '#close-settings');
        await pause(page, DEMO_CONFIG.mediumPause);

        // Advanced Mode
        console.log('🎓 Switching to Advanced Mode...');
        await slowClick(page, '#advanced-btn');
        await pause(page, DEMO_CONFIG.longPause);

        // AI Auto-Solve
        console.log('🤖 Using Play for Me (AI auto-solve)...');
        await slowClick(page, '#solve-btn');
        await pause(page, 8000);

        // Check win
        const winOverlay = page.locator('#win-overlay');
        if (await winOverlay.isVisible()) {
            await pause(page, DEMO_CONFIG.longPause);
            await slowClick(page, '#play-again-btn');
        }
    });
});
