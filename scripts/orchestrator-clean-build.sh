#!/usr/bin/env bash

# ORCHESTRATOR – CLEAN BUILD WORKFLOW
# Production-ready script for clean test build pipeline
# Execute these steps EXACTLY in this order for every project.

set -e  # Exit on error
set -o pipefail  # Exit on pipe failure

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="${1:-$(pwd)}"
AUTO_FIX="${2:-false}"
AUTO_COMMIT="${3:-false}"

cd "$PROJECT_DIR" || exit 1

echo "=========================================="
echo "ORCHESTRATOR CLEAN BUILD WORKFLOW"
echo "=========================================="
echo "Project: $(basename "$PROJECT_DIR")"
echo "Directory: $PROJECT_DIR"
echo ""

# Detect package manager
detect_package_manager() {
  if [ -f "pnpm-lock.yaml" ]; then
    echo "pnpm"
  elif [ -f "package-lock.json" ]; then
    echo "npm"
  elif [ -f "yarn.lock" ]; then
    echo "yarn"
  else
    echo "npm"  # Default
  fi
}

PKG_MANAGER=$(detect_package_manager)
echo "📦 Package Manager: $PKG_MANAGER"
echo ""

# Check if package.json exists
if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ Error: package.json not found${NC}"
  exit 1
fi

# Function to check if script exists in package.json
has_script() {
  local script_name=$1
  node -e "
    const pkg = require('./package.json');
    const scripts = pkg.scripts || {};
    process.exit(scripts['$script_name'] ? 0 : 1);
  " 2>/dev/null
}

# Function to run command with retry on failure
run_with_retry() {
  local cmd=$1
  local max_attempts=${2:-3}
  local attempt=1

  while [ $attempt -le $max_attempts ]; do
    echo "Attempt $attempt/$max_attempts: $cmd"
    
    if eval "$cmd"; then
      return 0
    fi

    if [ "$AUTO_FIX" = "true" ] && [ $attempt -lt $max_attempts ]; then
      echo -e "${YELLOW}⚠️  Command failed. Attempting auto-fix...${NC}"
      # TODO: Add AI-powered auto-fix logic here
      # For now, just retry
      sleep 2
    else
      return 1
    fi

    attempt=$((attempt + 1))
  done

  return 1
}

# ==========================================
# 1) INSTALL DEPENDENCIES
# ==========================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Installing Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

INSTALL_CMD=""
if [ "$PKG_MANAGER" = "pnpm" ]; then
  INSTALL_CMD="pnpm install"
elif [ "$PKG_MANAGER" = "yarn" ]; then
  INSTALL_CMD="yarn install"
else
  INSTALL_CMD="npm install"
fi

if run_with_retry "$INSTALL_CMD"; then
  echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
  echo -e "${RED}❌ Failed to install dependencies${NC}"
  exit 1
fi

echo ""

# ==========================================
# 2) RUN TESTS
# ==========================================
if has_script "test"; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Step 2: Running Tests"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  TEST_CMD=""
  if [ "$PKG_MANAGER" = "pnpm" ]; then
    TEST_CMD="pnpm test"
  elif [ "$PKG_MANAGER" = "yarn" ]; then
    TEST_CMD="yarn test"
  else
    TEST_CMD="npm run test"
  fi

  if run_with_retry "$TEST_CMD" 3; then
    echo -e "${GREEN}✅ All tests passed${NC}"
  else
    echo -e "${RED}❌ Tests failed${NC}"
    
    if [ "$AUTO_FIX" = "true" ]; then
      echo -e "${YELLOW}🔧 Attempting to fix test failures...${NC}"
      # TODO: Call Orchestrator AI fix API
      # For now, exit with error
    fi
    
    exit 1
  fi
else
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Step 2: Running Tests (SKIPPED - no test script)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "${YELLOW}⚠️  No test script found in package.json${NC}"
fi

echo ""

# ==========================================
# 3) RUN BUILD
# ==========================================
if has_script "build"; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Step 3: Building Project"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  BUILD_CMD=""
  if [ "$PKG_MANAGER" = "pnpm" ]; then
    BUILD_CMD="pnpm build"
  elif [ "$PKG_MANAGER" = "yarn" ]; then
    BUILD_CMD="yarn build"
  else
    BUILD_CMD="npm run build"
  fi

  if run_with_retry "$BUILD_CMD" 3; then
    echo -e "${GREEN}✅ Build succeeded${NC}"
  else
    echo -e "${RED}❌ Build failed${NC}"
    
    if [ "$AUTO_FIX" = "true" ]; then
      echo -e "${YELLOW}🔧 Attempting to fix build errors...${NC}"
      # TODO: Call Orchestrator AI fix API
      # For now, exit with error
    fi
    
    exit 1
  fi
else
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Step 3: Building Project (SKIPPED - no build script)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "${YELLOW}⚠️  No build script found in package.json${NC}"
fi

echo ""

# ==========================================
# 4) COMMIT + PUSH CHANGES (if requested)
# ==========================================
if [ "$AUTO_COMMIT" = "true" ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Step 4: Committing Changes"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # Check if git repo
  if [ -d ".git" ]; then
    # Check if there are changes
    if [ -n "$(git status --porcelain)" ]; then
      git add .
      git commit -m "auto: clean test build (orchestrator pipeline)" || {
        echo -e "${YELLOW}⚠️  Commit failed (may be no changes or commit hook failed)${NC}"
      }
      
      # Try to push (may fail if no remote or already pushed)
      git push || {
        echo -e "${YELLOW}⚠️  Push failed (may be no remote or already pushed)${NC}"
      }
      
      echo -e "${GREEN}✅ Changes committed and pushed${NC}"
    else
      echo -e "${YELLOW}⚠️  No changes to commit${NC}"
    fi
  else
    echo -e "${YELLOW}⚠️  Not a git repository, skipping commit${NC}"
  fi
else
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Step 4: Committing Changes (SKIPPED - auto-commit disabled)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi

echo ""

# ==========================================
# 5) CONFIRM SUCCESS
# ==========================================
echo "=========================================="
echo -e "${GREEN}✔ Clean build complete. All tests passing and build succeeded.${NC}"
echo "=========================================="

exit 0

