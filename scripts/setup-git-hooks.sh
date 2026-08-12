#!/usr/bin/env bash
# One-time: route git hooks through repo .githooks/ (strips tool Co-authored-by trailers).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
chmod +x "$ROOT/.githooks/commit-msg"
git -C "$ROOT" config core.hooksPath .githooks
echo "Git hooks enabled: $ROOT/.githooks"
