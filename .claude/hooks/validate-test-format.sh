#!/usr/bin/env bash
set -euo pipefail
node "$(cd "$(dirname "$0")/../.." && pwd)/.claude/hooks/validate-test-format.mjs"
