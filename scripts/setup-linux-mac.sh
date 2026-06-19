#!/usr/bin/env bash
set -euo pipefail
[ -f .env ] || cp .env.example .env
echo "Created .env from .env.example. Edit it before production deployment."
echo "Next: docker compose up --build"
