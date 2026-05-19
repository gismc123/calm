#!/bin/bash
set -e

export BUILD_DATE=$(date +%Y.%m.%d-%H%M%S)

echo "Deploying calm-down-v1.0-${BUILD_DATE}..."

git pull
docker compose build --no-cache
docker compose up -d

echo "Done. Deployed calm-down-${BUILD_DATE}"
