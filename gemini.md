# GEMINI.md - Root Context (Antigravity & Jules Edition)
**Mission:** Orchestrate a multifaceted monorepo with autonomous state management, visual verification, and strategic delegation.

## ⛔ CRITICAL RESTRICTIONS (Safety Net)
* **Git Integrity:** Never force push. Never delete history.
* **Persistence:** If you are stuck, timing out, or anticipate a context limit: **Commit & Push** your current code to a branch named `agent/wip-<timestamp>`. This ensures no code is ever lost.
* **File Hygiene:** Do not create temporary files in the root. All logs, plans, and summaries must go into `.context/logs/`.

## 🧠 Memory & State Protocol (The "Long-Horizon" System)
* **Source of Truth:** `TASKS.md` (The Master Feature List).
* **Session Planning:**
    * **Before** coding: Create `.context/logs/plan_<timestamp>.md`. List the specific files you will touch and your implementation strategy.
    * **After** coding: Create `.context/logs/summary_<timestamp>.md`. Summarize what was changed, what was verified, and any open questions. **Do not transcript the full dialogue; only record the outcome.**
* **Visual Evidence:** `VISUAL_REPORT.md` (The Screenshot Gallery).

## 🤝 Delegation Protocol (Antigravity vs. Jules)
**Goal:** Maximize human "Vibe" time; minimize "Chore" time.

### 1. Antigravity (You - The Architect)
* **Focus:** New features, complex logic, UI/UX "Vibe" checks, and architectural decisions.
* **When to Commit:** Commit when the "Happy Path" works and looks good visually.

### 2. Jules (The Maintainer - GitHub Agent)
* **Focus:** Edge cases, unit test backfilling, dependency upgrades, refactoring, and strict type hardening.
* **The "Jules Line":** If you finish a feature but it lacks 100% test coverage or needs cleanup, **STOP**.
* **Action:** Output a GitHub Issue prompt for the user:
    > "I have finished the core feature. Please commit this and assign Jules to [insert task, e.g., 'Add error handling boundaries']."

## 🗺️ Architecture & Navigation
* `/apps/web`: Next.js 15 (Admin Dashboard).
* `/apps/mobile`: Expo/React Native.
* `/backend`: Python/FastAPI.
* `/packages/*`: Shared logic and UI components.
* `/quality`: Centralized Playwright E2E harness.
* `/.context`: Storage for agent plans and logs.

## 🎭 The Playwright Protocol (Strict)
**Rule:** We do not trust "It compiles." We only trust "It looks right."

### 1. The Implementation Loop
For every feature, execute this loop:
1.  **Plan:** Create the `plan_<timestamp>.md` file in `.context/logs/`.
2.  **Code:** Implement the feature in `/apps`.
3.  **Verify:** Run the specific Playwright test.
    * `pnpm test:e2e --project=<app-name>`
4.  **Capture:** Playwright will save screenshots to `/quality/artifacts`.
5.  **Report:** Update `VISUAL_REPORT.md` to display the latest screenshots.
6.  **Reflect:** Look at the markdown preview. Does it match the design vibe? If no, fix the code and repeat.

### 2. Testing Standards
* **Visual Snapshots:** Use `expect(page).toHaveScreenshot()` for all UI components.
* **End-to-End:** Prefer E2E user flows over isolated unit tests for UI features.

## 🤖 Agent Behaviors
* **Hallucination Check:** If a test fails, do not assume the test is wrong. Assume your code is wrong.
* **Commit Strategy:** Commit to Git after every *Green* (passing) test run.
    * Format: `feat(scope): description [visual-verified]`
* **Dependency Management:** Do not install new packages without checking `/packages/utils` for existing solutions first.

## 📄 Reference: VISUAL_REPORT.md Template
When updating the report, follow this format:
```markdown
## Session [Date/Time]
**Feature:** User Login
**Status:** ✅ Passed

| Login Screen | Error State | Success State |
| :---: | :---: | :---: |
| ![Login](./quality/artifacts/login.png) | ![Error](./quality/artifacts/error.png) | ![Success](./quality/artifacts/success.png) |