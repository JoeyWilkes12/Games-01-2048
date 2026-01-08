#!/bin/bash
#
# Game Hub - Test Runner Script
# Runs all Playwright tests and generates a consolidated report
#
# Usage: ./run-all-tests.sh [options]
#
# Options:
#   --demo     Run only the demo recording (main sequential file)
#   --split    Run split demo tests (parallel capable)
#   --tests    Run only unit/seeded tests
#   --all      Run everything (default)
#   --report   Open the report after tests complete
#   --headed   Run tests in headed mode (visible browser)
#   --speed    Set demo speed multiplier (e.g. 2.0 for 2x faster, 0.5 for slower)
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
RUN_DEMO=false
RUN_SPLIT=false
RUN_TESTS=false
OPEN_REPORT=false
HEADED_FLAG=""
DEMO_SPEED_ENV=""

for arg in "$@"; do
    case $arg in
        --demo)
            RUN_DEMO=true
            ;;
        --split)
            RUN_SPLIT=true
            ;;
        --tests)
            RUN_TESTS=true
            ;;
        --all)
            RUN_DEMO=true
            RUN_TESTS=true
            RUN_SPLIT=true
            ;;
        --report)
            OPEN_REPORT=true
            ;;
        --headed)
            HEADED_FLAG="--headed"
            export HEADLESS=false
            ;;
        --speed=*)
            SPEED="${arg#*=}"
            DEMO_SPEED_ENV="DEMO_SPEED=$SPEED"
            export DEMO_SPEED=$SPEED
            ;;
        *)
            ;;
    esac
done

# Default to running all tests if no specific option given (excluding full demo if split is run, or vice versa if desired, but let's default to tests + split)
if [ "$RUN_DEMO" = false ] && [ "$RUN_TESTS" = false ] && [ "$RUN_SPLIT" = false ]; then
    RUN_TESTS=true
    RUN_SPLIT=true
fi

echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   Game Hub - Automated Test Runner${NC}"
echo -e "${BLUE}================================================${NC}"
if [ -n "$DEMO_SPEED_ENV" ]; then
    echo -e "Speed Multiplier: ${YELLOW}$DEMO_SPEED${NC}"
fi
echo ""

# Track results
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Function to run a test and track results
run_test() {
    local name=$1
    local command=$2
    
    ((TOTAL_TESTS++))
    echo -e "${YELLOW}▶ Running: ${name}${NC}"
    echo "  Command: $command"
    echo ""
    
    if eval "$command"; then
        echo -e "${GREEN}✓ PASSED: ${name}${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAILED: ${name}${NC}"
        ((TESTS_FAILED++))
    fi
    echo ""
}

# Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    echo ""
fi

# Run unit/seeded tests
if [ "$RUN_TESTS" = true ]; then
    echo -e "${BLUE}--- Unit & Seeded Tests ---${NC}"
    echo ""
    
    # Random Event Dice seeded tests
    run_test "Random Event Dice - Seeded Tests" \
        "npx playwright test apps/games/Random\\ Event\\ Dice/seeded-tests.spec.js --project=tests --reporter=list $HEADED_FLAG"
fi

# Run Split Demo Tests
if [ "$RUN_SPLIT" = true ]; then
    echo -e "${BLUE}--- Split Demo Tests (Parallel) ---${NC}"
    echo ""
    
    run_test "Split Game Demos" \
        "$DEMO_SPEED_ENV npx playwright test tests/ --project=demo --reporter=list $HEADED_FLAG"
fi

# Run Full Link Demo Recording
if [ "$RUN_DEMO" = true ]; then
    echo -e "${BLUE}--- Full Demo Recording ---${NC}"
    echo ""
    
    run_test "Full Demo Recording" \
        "$DEMO_SPEED_ENV npx playwright test demo-recording.spec.js --project=demo --reporter=list $HEADED_FLAG"
fi

# Summary
echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   Test Summary${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo -e "Total:  ${TOTAL_TESTS}"
echo -e "${GREEN}Passed: ${TESTS_PASSED}${NC}"
if [ "$TESTS_FAILED" -gt 0 ]; then
    echo -e "${RED}Failed: ${TESTS_FAILED}${NC}"
else
    echo -e "Failed: ${TESTS_FAILED}"
fi
echo ""

# Open report if requested or available
if [ "$OPEN_REPORT" = true ] || [ "$TESTS_FAILED" -gt 0 ]; then
    echo -e "${YELLOW}Opening test report...${NC}"
    npx playwright show-report &
fi

# Final status
echo ""
if [ "$TESTS_FAILED" -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Review the report for details.${NC}"
    exit 1
fi

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
RUN_DEMO=false
RUN_TESTS=false
OPEN_REPORT=false

for arg in "$@"; do
    case $arg in
        --demo)
            RUN_DEMO=true
            ;;
        --tests)
            RUN_TESTS=true
            ;;
        --all)
            RUN_DEMO=true
            RUN_TESTS=true
            ;;
        --report)
            OPEN_REPORT=true
            ;;
        *)
            ;;
    esac
done

# Default to running all tests if no specific option given
if [ "$RUN_DEMO" = false ] && [ "$RUN_TESTS" = false ]; then
    RUN_DEMO=true
    RUN_TESTS=true
fi

echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   Game Hub - Automated Test Runner${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Track results
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Function to run a test and track results
run_test() {
    local name=$1
    local command=$2
    
    ((TOTAL_TESTS++))
    echo -e "${YELLOW}▶ Running: ${name}${NC}"
    echo "  Command: $command"
    echo ""
    
    if eval "$command"; then
        echo -e "${GREEN}✓ PASSED: ${name}${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAILED: ${name}${NC}"
        ((TESTS_FAILED++))
    fi
    echo ""
}

# Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    echo ""
fi

# Run unit/seeded tests
if [ "$RUN_TESTS" = true ]; then
    echo -e "${BLUE}--- Unit & Seeded Tests ---${NC}"
    echo ""
    
    # Random Event Dice seeded tests
    run_test "Random Event Dice - Seeded Tests" \
        "npx playwright test apps/games/Random\\ Event\\ Dice/seeded-tests.spec.js --project=tests --reporter=list"
fi

# Run demo recording
if [ "$RUN_DEMO" = true ]; then
    echo -e "${BLUE}--- Demo Recording ---${NC}"
    echo ""
    
    run_test "Demo Recording" \
        "npx playwright test --project=demo --reporter=list"
fi

# Summary
echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   Test Summary${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo -e "Total:  ${TOTAL_TESTS}"
echo -e "${GREEN}Passed: ${TESTS_PASSED}${NC}"
if [ "$TESTS_FAILED" -gt 0 ]; then
    echo -e "${RED}Failed: ${TESTS_FAILED}${NC}"
else
    echo -e "Failed: ${TESTS_FAILED}"
fi
echo ""

# Open report if requested or available
if [ "$OPEN_REPORT" = true ] || [ "$TESTS_FAILED" -gt 0 ]; then
    echo -e "${YELLOW}Opening test report...${NC}"
    npx playwright show-report &
fi

# Final status
echo ""
if [ "$TESTS_FAILED" -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    echo "View detailed report: npx playwright show-report"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Review the report for details.${NC}"
    echo ""
    echo "View detailed report: npx playwright show-report"
    exit 1
fi
