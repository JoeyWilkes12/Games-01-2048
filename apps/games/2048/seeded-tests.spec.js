const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

/**
 * 2048 Game - Seeded Playwright Tests
 * 
 * These tests verify:
 * 1. Configuration loading from JSON files
 * 2. Seeded RNG determinism
 * 3. AI algorithm consistency
 * 4. Core game mechanics via the Game2048 API
 */

const GAME_URL = `file://${path.join(__dirname, 'index.html')}`;
const TESTS_URL = `file://${path.join(__dirname, 'tests.html')}`;

// ============================================
// Group 1: Configuration Loading Tests
// ============================================

test.describe('2048 Configuration Loading', () => {
    test('should load default configuration', async ({ page }) => {
        await page.goto(GAME_URL);
        await page.waitForLoadState('domcontentloaded');

        const config = await page.evaluate(() => {
            return {
                hasGame2048: typeof Game2048 !== 'undefined',
                gridSize: typeof GRID_SIZE !== 'undefined' ? GRID_SIZE : null,
                prob4: typeof CONF !== 'undefined' ? CONF.prob4 : null,
                winScore: typeof CONF !== 'undefined' ? CONF.winScore : null
            };
        });

        expect(config.hasGame2048).toBe(true);
        expect(config.gridSize).toBe(4);
        expect(config.prob4).toBe(0.1);
        expect(config.winScore).toBe(2048);
    });

    test('should load custom configuration via API', async ({ page }) => {
        await page.goto(GAME_URL);
        await page.waitForLoadState('domcontentloaded');

        const result = await page.evaluate(() => {
            const config = {
                settings: {
                    seed: 12345,
                    prob4: 0.2,
                    winScore: 4096
                }
            };
            return Game2048.loadConfig(config);
        });

        expect(result).toBe(true);

        // Verify winScore was applied
        const winCheck = await page.evaluate(() => {
            Game2048.setGrid([
                [2048, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]);
            return Game2048.checkWin();
        });

        expect(winCheck).toBe(false); // 2048 should NOT win when winScore is 4096
    });

    test('should load configuration from sample JSON file', async ({ page }) => {
        await page.goto(GAME_URL);
        await page.waitForLoadState('domcontentloaded');

        // Load the sample config file
        const configPath = path.join(__dirname, 'sample configuration files', 'seeded-test-42.json');

        // Check if config file exists
        const configExists = fs.existsSync(configPath);
        if (!configExists) {
            console.log('Sample config file not found, skipping file-based test');
            return;
        }

        const configContent = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(configContent);

        const result = await page.evaluate((cfg) => {
            return Game2048.loadConfig(cfg);
        }, config);

        expect(result).toBe(true);
    });
});

// ============================================
// Group 2: Seeded RNG Determinism Tests
// ============================================

test.describe('2048 Seeded Determinism', () => {
    test('same seed produces identical simulations', async ({ page }) => {
        await page.goto(GAME_URL);
        await page.waitForLoadState('domcontentloaded');

        const results = await page.evaluate(() => {
            const moves = [3, 0, 1, 2, 3, 0]; // Left, Up, Right, Down, Left, Up

            // First simulation with seed 42
            const sim1 = Game2048.runSeededSimulation(42, moves);

            // Second simulation with same seed
            const sim2 = Game2048.runSeededSimulation(42, moves);

            return {
                sim1: JSON.stringify(sim1),
                sim2: JSON.stringify(sim2),
                areEqual: JSON.stringify(sim1) === JSON.stringify(sim2)
            };
        });

        expect(results.areEqual).toBe(true);
    });

    test('different seeds produce different simulations', async ({ page }) => {
        await page.goto(GAME_URL);
        await page.waitForLoadState('domcontentloaded');

        const results = await page.evaluate(() => {
            const moves = [3, 0, 1, 2];

            const sim1 = Game2048.runSeededSimulation(42, moves);
            const sim2 = Game2048.runSeededSimulation(12345, moves);

            return {
                areDifferent: JSON.stringify(sim1) !== JSON.stringify(sim2)
            };
        });

        expect(results.areDifferent).toBe(true);
    });

    test('seeded simulation maintains score consistency', async ({ page }) => {
        await page.goto(GAME_URL);
        await page.waitForLoadState('domcontentloaded');

        const results = await page.evaluate(() => {
            // Run same simulation 3 times
            const scores = [];
            for (let i = 0; i < 3; i++) {
                const sim = Game2048.runSeededSimulation(99999, [3, 3, 3, 0, 0, 0, 1, 1, 1, 2, 2, 2]);
                const finalScore = sim[sim.length - 1].score;
                scores.push(finalScore);
            }
            return {
                scores: scores,
                allEqual: scores.every(s => s === scores[0])
            };
        });

        expect(results.allEqual).toBe(true);
    });
});

// ============================================
// Group 3: Algorithm Selection Tests
// ============================================

test.describe('2048 Algorithm Selection', () => {
    test('algorithm config exists and has correct structure', async ({ page }) => {
        await page.goto(GAME_URL);
        await page.waitForLoadState('domcontentloaded');

        const config = await page.evaluate(() => {
            if (typeof ALGORITHM_CONFIG === 'undefined') return null;
            return {
                current: ALGORITHM_CONFIG.current,
                hasExpectimax: 'expectimax' in ALGORITHM_CONFIG,
                hasMcts: 'mcts' in ALGORITHM_CONFIG,
                hasWeights: 'weights' in ALGORITHM_CONFIG
            };
        });

        expect(config).not.toBeNull();
        expect(config.current).toBe('expectimax');
        expect(config.hasExpectimax).toBe(true);
        expect(config.hasMcts).toBe(true);
        expect(config.hasWeights).toBe(true);
    });

    test('can switch algorithms via UI', async ({ page }) => {
        await page.goto(GAME_URL);
        await page.waitForLoadState('domcontentloaded');

        // Open settings
        await page.click('#settings-btn');
        await page.waitForTimeout(300);

        // Select MCTS algorithm
        await page.selectOption('#algo-picker', 'mcts');
        await page.waitForTimeout(100);

        // Verify algorithm changed
        const currentAlgo = await page.evaluate(() => ALGORITHM_CONFIG.current);
        expect(currentAlgo).toBe('mcts');

        // Switch to Greedy
        await page.selectOption('#algo-picker', 'greedy');
        const greedyAlgo = await page.evaluate(() => ALGORITHM_CONFIG.current);
        expect(greedyAlgo).toBe('greedy');
    });

    test('getBestMoveUnified returns valid moves', async ({ page }) => {
        await page.goto(GAME_URL);
        await page.waitForLoadState('domcontentloaded');

        const results = await page.evaluate(() => {
            // Set up a simple board
            Game2048.setGrid([
                [2, 2, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]);

            const board = Game2048.getGrid();
            const move = getBestMoveUnified(board);

            return {
                move: move,
                isValid: move >= 0 && move <= 3
            };
        });

        expect(results.isValid).toBe(true);
    });
});

// ============================================
// Group 4: Core Game Mechanics Tests
// ============================================

test.describe('2048 Game Mechanics', () => {
    test('move left merges tiles correctly', async ({ page }) => {
        await page.goto(GAME_URL);
        await page.waitForLoadState('domcontentloaded');

        const result = await page.evaluate(() => {
            Game2048.init(null);
            Game2048.setGrid([
                [2, 2, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]);
            Game2048.moveLeft();
            const grid = Game2048.getGrid();
            return {
                merged: grid[0][0] === 4,
                score: Game2048.getScore()
            };
        });

        expect(result.merged).toBe(true);
        expect(result.score).toBe(4);
    });

    test('board validation detects invalid tiles', async ({ page }) => {
        await page.goto(GAME_URL);
        await page.waitForLoadState('domcontentloaded');

        const result = await page.evaluate(() => {
            Game2048.setGrid([
                [3, 0, 0, 0],  // 3 is invalid (not power of 2)
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]);
            const errors = Game2048.validateBoardState();
            return { hasErrors: errors.length > 0 };
        });

        expect(result.hasErrors).toBe(true);
    });

    test('win condition detected correctly', async ({ page }) => {
        await page.goto(GAME_URL);
        await page.waitForLoadState('domcontentloaded');

        const result = await page.evaluate(() => {
            // Reset to default winScore
            Game2048.loadConfig({ settings: { winScore: 2048 } });

            Game2048.setGrid([
                [1024, 1024, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]);
            Game2048.moveLeft();
            return Game2048.checkWin();
        });

        expect(result).toBe(true);
    });

    test('game over detected when no moves available', async ({ page }) => {
        await page.goto(GAME_URL);
        await page.waitForLoadState('domcontentloaded');

        const result = await page.evaluate(() => {
            Game2048.setGrid([
                [2, 4, 2, 4],
                [4, 2, 4, 2],
                [2, 4, 2, 4],
                [4, 2, 4, 2]
            ]);
            return Game2048.checkLose();
        });

        expect(result).toBe(true);
    });
});

// ============================================
// Group 5: Heuristic Function Tests
// ============================================

test.describe('2048 Heuristics', () => {
    test('evaluateGrid returns higher score for better positions', async ({ page }) => {
        await page.goto(GAME_URL);
        await page.waitForLoadState('domcontentloaded');

        const result = await page.evaluate(() => {
            // Good position: tiles arranged in corner
            const goodGrid = [
                [512, 256, 128, 64],
                [32, 16, 8, 4],
                [2, 0, 0, 0],
                [0, 0, 0, 0]
            ];

            // Bad position: tiles scattered
            const badGrid = [
                [2, 512, 2, 4],
                [16, 0, 256, 0],
                [8, 128, 0, 64],
                [32, 0, 4, 0]
            ];

            const goodScore = evaluateGrid(goodGrid);
            const badScore = evaluateGrid(badGrid);

            return {
                goodScore: goodScore,
                badScore: badScore,
                goodIsBetter: goodScore > badScore
            };
        });

        expect(result.goodIsBetter).toBe(true);
    });

    test('monotonicity function works correctly', async ({ page }) => {
        await page.goto(GAME_URL);
        await page.waitForLoadState('domcontentloaded');

        const result = await page.evaluate(() => {
            // Perfectly monotonic grid
            const monotonicGrid = [
                [16, 8, 4, 2],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];

            // Non-monotonic grid
            const nonMonotonicGrid = [
                [2, 16, 4, 8],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];

            const monoScore = monotonicity(monotonicGrid);
            const nonMonoScore = monotonicity(nonMonotonicGrid);

            return {
                monoScore: monoScore,
                nonMonoScore: nonMonoScore,
                // Monotonic should have less penalty (closer to 0)
                monotonicIsBetter: monoScore >= nonMonoScore
            };
        });

        expect(result.monotonicIsBetter).toBe(true);
    });

    test('emptyCellsScore correctly counts empty cells', async ({ page }) => {
        await page.goto(GAME_URL);
        await page.waitForLoadState('domcontentloaded');

        const result = await page.evaluate(() => {
            const gridWith10Empty = [
                [2, 4, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 8, 16],
                [0, 0, 0, 0]
            ];

            const count = emptyCellsScore(gridWith10Empty);
            return { count: count };
        });

        expect(result.count).toBe(12); // 16 cells - 4 filled = 12 empty
    });
});

// ============================================
// Group 6: Browser Unit Test Integration
// ============================================

test.describe('2048 Browser Unit Tests', () => {
    test('all browser unit tests pass', async ({ page }) => {
        await page.goto(TESTS_URL);
        await page.waitForLoadState('domcontentloaded');

        // Wait for tests to complete
        await page.waitForTimeout(2000);

        // Check results
        const results = await page.evaluate(() => {
            const summary = document.querySelector('.summary');
            if (!summary) return { found: false };

            const hasFail = summary.classList.contains('has-fail');
            const hasPass = summary.classList.contains('all-pass');
            const text = summary.innerText;

            return {
                found: true,
                passed: hasPass,
                failed: hasFail,
                summary: text
            };
        });

        expect(results.found).toBe(true);
        expect(results.passed).toBe(true);
        expect(results.failed).toBe(false);
    });
});
