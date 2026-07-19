#!/usr/bin/env bash
# AIIMIN repo verification gate — run before claiming "shipped".
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'
FAIL=0

pass() { echo -e "${GREEN}✓${NC} $1"; }
fail() { echo -e "${RED}✗${NC} $1"; FAIL=1; }

echo "=== AIIMIN verify-repo ==="
echo ""

# 1. Git hygiene — no secrets staged
if git diff --cached --name-only 2>/dev/null | grep -qE '\.env$|\.pem$|keystore'; then
  fail "Staged files may contain secrets"
else
  pass "No obvious secrets staged"
fi

# 2. Frontend build
echo "Building frontend..."
if (cd frontend && npm run build >/tmp/aiimin-verify-build.log 2>&1); then
  pass "frontend npm run build"
else
  fail "frontend build failed (see /tmp/aiimin-verify-build.log)"
fi

# 3. Native debug assemble (skip if no JDK 17)
if [ -d native-android ]; then
  NATIVE_JAVA=""
  if [ -d /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home ]; then
    NATIVE_JAVA="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
  elif /usr/libexec/java_home -v 17 >/dev/null 2>&1; then
    NATIVE_JAVA="$(/usr/libexec/java_home -v 17)"
  elif [ -n "${JAVA_HOME:-}" ]; then
    NATIVE_JAVA="$JAVA_HOME"
  fi
  if [ -n "$NATIVE_JAVA" ]; then
    echo "Building native-android debug (JDK 17)..."
    if (cd native-android && JAVA_HOME="$NATIVE_JAVA" ./gradlew :app:assembleDebug -q >/tmp/aiimin-verify-native.log 2>&1); then
      pass "native-android assembleDebug"
    else
      fail "native-android build failed (see /tmp/aiimin-verify-native.log)"
    fi
  else
    echo "… skipping native (JDK 17 not found — brew install openjdk@17)"
  fi
fi

# 4. API health (optional network)
if curl -sf --max-time 10 https://api.aiimin.in/api/health >/dev/null 2>&1; then
  pass "api.aiimin.in/api/health"
else
  echo "… api health skip (offline or blocked)"
fi

if curl -sf --max-time 10 https://api.aiimin.in/api/mobile/health >/dev/null 2>&1; then
  pass "api.aiimin.in/api/mobile/health"
else
  echo "… mobile health skip"
fi

# 5. Tracked build artifacts check
if git ls-files 'native-android/**/build/**' 'frontend/android/**/build/**' 2>/dev/null | grep -q .; then
  fail "Build artifacts still tracked in git"
else
  pass "No tracked android build/ dirs"
fi

# 6. Required docs
for f in README.md CONTRIBUTING.md docs/knowledge/02_ARCHITECTURE/Monorepo.md; do
  if [ -f "$f" ]; then
    pass "doc exists: $f"
  else
    fail "missing doc: $f"
  fi
done

echo ""
if [ "$FAIL" -eq 0 ]; then
  echo -e "${GREEN}VERIFY PASSED${NC}"
  exit 0
else
  echo -e "${RED}VERIFY FAILED${NC}"
  exit 1
fi
