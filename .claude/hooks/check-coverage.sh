#!/usr/bin/env bash
set -euo pipefail
node "$(cd "$(dirname "$0")/../.." && pwd)/.claude/hooks/check-coverage.mjs"
