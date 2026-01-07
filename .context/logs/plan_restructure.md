# Implementation Plan - Monorepo Restructure

I will restructure the repository to follow the `gemini.md` standards, establishing a clean monorepo architecture.

## User Review Required

> [!NOTE]
> I am moving existing game folders (e.g., `2048`, `Risk`) into `apps/games/` to treat them as independent logical units while cleaning up the root.

## Proposed Changes

### Directory Structure
*   [NEW] `.context/logs/` - For agent plans and summaries.
*   [NEW] `apps/games/` - Container for independent game projects.
*   [NEW] `apps/web/` - Placeholder for Next.js admin dashboard.
*   [NEW] `apps/mobile/` - Placeholder for Expo app.
*   [NEW] `backend/` - Python/FastAPI services.
*   [NEW] `packages/` - Shared logic.
*   [NEW] `quality/` - Playwright harness.

### File Moves
*   Move `2048/` -> `apps/games/2048/`
*   Move `Acquire/` -> `apps/games/Acquire/`
*   Move `Mastermind/` -> `apps/games/Mastermind/`
*   Move `Queens/` -> `apps/games/Queens/`
*   Move `Random Event Poisson/` -> `apps/games/Random Event Poisson/`
*   Move `Risk/` -> `apps/games/Risk/`
*   Move `Sliding Block Puzzle - Rubiks/` -> `apps/games/Sliding Block Puzzle - Rubiks/`
*   Move `Wordle/` -> `apps/games/Wordle/`

### New Files
*   [NEW] `TASKS.md` - The master feature list (Source of Truth).
*   [NEW] `.context/logs/plan_<timestamp>.md` - This implementation plan logged for persistence.

## Verification Plan
*   `list_dir` on root to verify clean structure.
*   `list_dir` on `apps/games` to verify games are present.
