# Game Hub - Testing Documentation

This document describes how to run all tests for the Game Hub application.

## Prerequisites

1. **Node.js** (v18+)
2. **Install dependencies**: `npm install`
3. **Install Playwright browsers**: `npx playwright install chromium`

## Test Categories

### 1. Unit & Seeded Tests
Fast, deterministic tests that verify game logic using seeded configurations.

```bash
# Run all seeded tests
./run-all-tests.sh --tests

# Run specific test file
npx playwright test apps/games/Random\ Event\ Dice/seeded-tests.spec.js --project=tests
```

Tests include:
- Configuration file validation
- Seeded RNG determinism
- Analytics tracker accuracy
- Skip to End functionality
- Event definition logic

### Random Event Dice - Basic E2E Tests
```bash
npx playwright test apps/games/Random\ Event\ Dice/playwright.test.js
```

Tests include:
- Page load verification
- Start/Pause/Resume functionality
- Analytics panel visibility
- Settings panel toggle
- Timer countdown

### Bank - Seeded Tests
Comprehensive tests for the Bank dice game mechanics.

```bash
npx playwright test apps/games/Bank/seeded-tests.spec.js --project=tests
```

Tests include:
- Core game mechanics (rolling, UI state)
- First-3-roll protection (7 = 70 pts)
- Doubles behavior (face value vs doubled)
- Banking functionality
- Round progression
- Game over logic
- Settings and new game

---

### 2. Split Demo Tests (Parallel)
Individual game demos that run in parallel for faster execution.

```bash
# Run parallel demos
./run-all-tests.sh --split

# With speed modifier (2x faster)
./run-all-tests.sh --split --speed=2.0

# With visible browser (headed mode)
./run-all-tests.sh --split --headed
```

### 3. Full Demo Recording
A complete sequential walkthrough of the entire application.

```bash
# Run full demo (slower, sequential)
./run-all-tests.sh --demo

# With speed modifier
./run-all-tests.sh --demo --speed=2.0
```

---

## HTML-Based Tests

These tests run directly in the browser.

### Sliding Puzzle 3x3
```bash
open apps/games/Sliding\ Puzzle\ 3x3/tests.html
# Or navigate to: file:///path/to/Games 01/apps/games/Sliding Puzzle 3x3/tests.html
```

Tests include:
- Solver algorithm (A*)
- Move validation
- Win condition detection

### 2048
```bash
open apps/games/2048/tests.html
```

Tests include:
- Grid operations
- Merge logic
- Score calculation
- Expectimax AI validation

---

## Command-Line Options

| Option | Description |
|--------|-------------|
| `--tests` | Run unit/seeded tests only |
| `--split` | Run split demo tests (parallel) |
| `--demo` | Run full demo recording (sequential) |
| `--all` | Run all tests (tests + split + demo) |
| `--headed` | Run in visible browser mode |
| `--speed=N` | Speed multiplier (e.g., `--speed=2.0` for 2x faster) |
| `--report` | Open HTML report after tests |

## Speed Control

The `--speed` parameter controls how fast demos navigate:

- `--speed=0.5` - Half speed (slower, better for debugging)
- `--speed=1.0` - Normal speed (default)
- `--speed=2.0` - Double speed (faster)
- `--speed=4.0` - Quadruple speed (fastest, may miss visual details)

## View Test Report

After running Playwright tests, view the HTML report:

```bash
npx playwright show-report
```

This opens an interactive report in your browser showing:
- Test pass/fail status
- Screenshots on failure
- Video recordings (if enabled)
- Trace files for debugging

---

## Examples

```bash
# Quick verification (default: tests + split)
./run-all-tests.sh

# Full verification with visible browser
./run-all-tests.sh --all --headed

# Fast parallel demos
./run-all-tests.sh --split --speed=2.0

# Debug a specific game demo
DEMO_SPEED=0.5 npx playwright test tests/demo-red.spec.js --project=split-demos --headed
```

## Test File Structure

```
interstellar-zodiac/
├── demo-recording.spec.js          # Full sequential demo
├── tests/                          # Split parallel demos
│   ├── demo-red.spec.js            # Random Event Dice demo
│   ├── demo-2048.spec.js           # 2048 demo
│   └── demo-sliding-puzzle.spec.js # Sliding Puzzle demo
├── apps/games/
│   ├── Random Event Dice/
│   │   ├── seeded-tests.spec.js    # Core game logic tests
│   │   └── new-seeded-tests.spec.js # UI enhancement tests
│   └── Bank/
│       └── seeded-tests.spec.js    # Bank game logic tests
└── playwright.config.js            # Playwright configuration
```

## Test File Locations

| Game | Test File(s) |
|------|-------------|
| Random Event Dice | `apps/games/Random Event Dice/seeded-tests.spec.js`, `playwright.test.js`, `new-seeded-tests.spec.js` |
| Bank | `apps/games/Bank/seeded-tests.spec.js` |
| 2048 | `apps/games/2048/tests.html` |
| Sliding Puzzle | `apps/games/Sliding Puzzle 3x3/tests.html`, `test_logic.js` |
| Demo Recording | `demo-recording.spec.js` |

## Playwright Parallelism

The `split-demos` project is configured for parallel execution:

```javascript
// playwright.config.js
{
  name: 'split-demos',
  testDir: './tests',
  fullyParallel: true,
  workers: 3,  // Run 3 game demos simultaneously
  // ...
}
```

See [Playwright Parallelism Docs](https://playwright.dev/docs/test-parallel) for more details.

## Troubleshooting

### "No tests found" Error
Ensure you're using the correct project name:
```bash
npx playwright test tests/ --project=split-demos
```

### Timeout Errors
Reduce demo speed or increase timeout:
```bash
DEMO_SPEED=0.5 npx playwright test tests/demo-red.spec.js --project=split-demos
```

### "Too many arguments" Error
Ensure `page.evaluate()` calls wrap arguments in an object:
```javascript
// ❌ Wrong
await page.evaluate((y, selector) => { ... }, pos, container);

// ✅ Correct
await page.evaluate(({ y, selector }) => { ... }, { y: pos, selector: container });
```

---

## CI/CD Integration

For continuous integration, use:

```bash
npx playwright test --project=tests --reporter=junit
```

This outputs JUnit-compatible XML for CI systems like GitHub Actions.
