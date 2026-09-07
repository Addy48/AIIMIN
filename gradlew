#!/usr/bin/env bash
# Forwarder for root execution. Native Android project is app/.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT/app"
exec ./gradlew "$@"
