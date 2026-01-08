const { test, expect } = require('@playwright/test');
const path = require('path');

// Configuration with environment variable overrides
const SPEED_MULTIPLIER = process.env.DEMO_SPEED ? parseFloat(process.env.DEMO_SPEED) : 1.0;

const DEMO_CONFIG = {
    shortPause: 400 * (1 / SPEED_MULTIPLIER),
    mediumPause: 800 * (1 / SPEED_MULTIPLIER),
    longPause: 1500 * (1 / SPEED_MULTIPLIER),
    veryLongPause: 2500 * (1 / SPEED_MULTIPLIER),
    gameRunPause: 5000 * (1 / SPEED_MULTIPLIER),
    slowScrollPause: 10000 * (1 / SPEED_MULTIPLIER),
    finalScrollPause: 5000 * (1 / SPEED_MULTIPLIER),
};

// Base URL
const getBaseUrl = () => `file://${path.join(__dirname, '../index.html')}`;

// Helpers
const pause = async (page, duration = DEMO_CONFIG.mediumPause) => await page.waitForTimeout(duration);

const slowClick = async (page, selector) => {
    const element = await page.locator(selector);
    await element.scrollIntoViewIfNeeded();
    await pause(page, DEMO_CONFIG.shortPause);
    await element.click();
    await pause(page, DEMO_CONFIG.shortPause);
};

const hideAnalyticsPanel = async (page) => {
    const analyticsPanel = page.locator('#analytics-panel');
    const isVisible = await analyticsPanel.evaluate(el => !el.classList.contains('hidden'));
    if (isVisible) await slowClick(page, '#toggle-analytics');
};

const showAnalyticsPanel = async (page) => {
    const analyticsPanel = page.locator('#analytics-panel');
    const isHidden = await analyticsPanel.evaluate(el => el.classList.contains('hidden'));
    if (isHidden) await slowClick(page, '#show-analytics-btn');
};

const expandSettingsPanel = async (page) => {
    const settingsContent = page.locator('#settings-content');
    const isCollapsed = await settingsContent.evaluate(el => el.classList.contains('collapsed'));
    if (isCollapsed) await slowClick(page, '#toggle-settings');
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

    // Down
    for (let pos = 0; pos < maxScroll; pos += stepSize) {
        await page.evaluate(({ y, selector }) => {
            const el = selector ? document.querySelector(selector) : window;
            if (el === window) window.scrollTo({ top: y, behavior: 'auto' });
            else el.scrollTop = y;
        }, { y: pos, selector: containerSelector });
        await page.waitForTimeout(stepDelay);
    }
    // Up
    for (let pos = maxScroll; pos >= 0; pos -= stepSize) {
        await page.evaluate(({ y, selector }) => {
            const el = selector ? document.querySelector(selector) : window;
            if (el === window) window.scrollTo({ top: y, behavior: 'auto' });
            else el.scrollTop = y;
        }, { y: pos, selector: containerSelector });
        await page.waitForTimeout(stepDelay);
    }
};

test.describe('Random Event Dice Demo', () => {
    test.setTimeout(300000); // 5 minutes

    test('Full Walkthrough', async ({ page }) => {
        console.log('🎲 Navigating to Random Event Dice...');
        // Correct path since we are in tests/
        await page.goto(`file://${path.join(__dirname, '../apps/games/Random Event Dice/index.html')}`);
        await page.waitForLoadState('domcontentloaded');
        await pause(page, DEMO_CONFIG.longPause);

        // Hide analytics panel initially to show Settings
        console.log('📊 Hiding Analytics to show Settings...');
        await hideAnalyticsPanel(page);
        await pause(page, DEMO_CONFIG.shortPause);

        // Show Settings Panel
        console.log('⚙️ Exploring Settings...');
        await expandSettingsPanel(page);
        await pause(page, DEMO_CONFIG.mediumPause);

        // Check new Timer toggle
        console.log('⏱️ Toggling Timer visibility...');
        await slowClick(page, '#toggle-timer-visibility');
        await pause(page, DEMO_CONFIG.mediumPause);
        await slowClick(page, '#toggle-timer-visibility'); // Show again
        await pause(page, DEMO_CONFIG.shortPause);

        // Configure faster settings for demo (0.1s interval, 1ms reset)
        console.log('⚡ Configuring fast roll settings...');
        await page.fill('#interval-input', '0.1');
        await pause(page, DEMO_CONFIG.shortPause);
        await page.fill('#reset-duration-input', '1');
        await pause(page, DEMO_CONFIG.shortPause);

        // Select a seed for determinism
        await page.selectOption('#seed-select', '12345');
        await pause(page, DEMO_CONFIG.shortPause);

        // Scroll to show Advanced Settings button
        await page.locator('#advanced-settings-btn').scrollIntoViewIfNeeded();
        await pause(page, DEMO_CONFIG.shortPause);

        // Open Advanced Event Settings Modal
        console.log('🛠️ Opening Advanced Event Settings...');
        await slowClick(page, '#advanced-settings-btn');
        await pause(page, DEMO_CONFIG.longPause);

        // Close modal
        await slowClick(page, '#close-modal');
        await pause(page, DEMO_CONFIG.shortPause);

        // Start the game
        console.log('▶️ Starting game...');
        await slowClick(page, '#start-btn');

        // Let game run for 5 seconds UNINTERRUPTED
        console.log('🎲 Watching dice rolls for 5 seconds (uninterrupted)...');
        await pause(page, DEMO_CONFIG.gameRunPause);

        // WHILE GAME IS STILL RUNNING - Open Analytics Dashboard and scroll slowly
        console.log('📊 Opening Analytics Dashboard while game is running...');
        await showAnalyticsPanel(page);
        await pause(page, DEMO_CONFIG.mediumPause);

        // Slow scroll up and down in the analytics panel
        console.log('📊 Slowly scrolling through analytics...');
        await slowFullVerticalScroll(page, DEMO_CONFIG.slowScrollPause, '#analytics-panel');

        // Skip to End
        console.log('⏩ Skip to End demonstration...');
        await page.locator('#skip-to-end-btn').scrollIntoViewIfNeeded();
        await slowClick(page, '#skip-to-end-btn');
        await pause(page, DEMO_CONFIG.longPause);

        // After Skip to End - scroll slowly through final results
        console.log('📊 Slowly scrolling through final results...');
        await slowFullVerticalScroll(page, DEMO_CONFIG.finalScrollPause, '#analytics-panel');

        // Show final leaderboard
        await page.locator('#leaderboard').scrollIntoViewIfNeeded();
        await pause(page, DEMO_CONFIG.longPause);
    });
});
