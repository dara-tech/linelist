#!/usr/bin/env bash
set -e

REPO_DIR="/opt/vcct-repo"
APP_DIR="/opt/vcct-backend"

if [ ! -d "${REPO_DIR}/.git" ]; then
    echo "Cloning repository to ${REPO_DIR}..."
    git clone https://github.com/dara-tech/linelist.git "${REPO_DIR}"
fi

cd "${REPO_DIR}"
git fetch origin main

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "${LOCAL}" != "${REMOTE}" ]; then
    echo "[$(date)] New commits detected! Updating backend..."
    git reset --hard origin/main
    
    # Sync backend files
    cp -r "${REPO_DIR}/vcct/backend/src" "${APP_DIR}/"
    cp "${REPO_DIR}/vcct/backend/package.json" "${APP_DIR}/"
    [ -f "${REPO_DIR}/vcct/backend/package-lock.json" ] && cp "${REPO_DIR}/vcct/backend/package-lock.json" "${APP_DIR}/"

    # Install dependencies
    cd "${APP_DIR}"
    npm install --omit=dev

    # Restart service
    sudo systemctl restart vcct-backend
    echo "[$(date)] VCCT Backend updated to $(git rev-parse --short HEAD) and restarted successfully!"
else
    echo "[$(date)] VCCT Backend is up to date (${LOCAL:0:7})."
fi

