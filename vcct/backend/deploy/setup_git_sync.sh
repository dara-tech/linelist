#!/usr/bin/env bash
set -e

echo "[*] Setting up /opt/vcct-repo for Git auto-sync..."
mkdir -p /opt/vcct-repo
chown -R nchadsadmin:nchadsadmin /opt/vcct-repo

if [ ! -d "/opt/vcct-repo/.git" ]; then
    echo "Cloning repository..."
    git clone https://github.com/dara-tech/linelist.git /opt/vcct-repo
else
    echo "Updating existing clone..."
    cd /opt/vcct-repo && git fetch origin main && git reset --hard origin/main
fi

mkdir -p /opt/vcct-backend/deploy

cat << 'EOF' > /opt/vcct-backend/deploy/git-sync.sh
#!/usr/bin/env bash
set -e
REPO_DIR="/opt/vcct-repo"
BACKEND_DIR="/opt/vcct-backend"
FRONTEND_DIR="/opt/vcct-frontend"

cd "${REPO_DIR}"
git fetch origin main >/dev/null 2>&1

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "${LOCAL}" != "${REMOTE}" ]; then
    echo "[$(date)] New commits detected in Git (${LOCAL:0:7} -> ${REMOTE:0:7}). Auto-deploying..."
    git reset --hard origin/main
    
    # 1. Update Backend
    cp -r "${REPO_DIR}/vcct/backend/src" "${BACKEND_DIR}/"
    cp "${REPO_DIR}/vcct/backend/package.json" "${BACKEND_DIR}/"
    [ -f "${REPO_DIR}/vcct/backend/package-lock.json" ] && cp "${REPO_DIR}/vcct/backend/package-lock.json" "${BACKEND_DIR}/"

    cd "${BACKEND_DIR}"
    npm install --omit=dev

    # 2. Build and Update Frontend if frontend files exist
    if [ -d "${REPO_DIR}/vcct/frontend" ]; then
        echo "[$(date)] Re-building frontend..."
        cd "${REPO_DIR}/vcct/frontend"
        npm install
        npm run build
        
        # Deploy to both standalone frontend and backend public
        mkdir -p "${BACKEND_DIR}/public"
        cp -r dist/* "${BACKEND_DIR}/public/"
        mkdir -p "${FRONTEND_DIR}/dist"
        cp -r dist/* "${FRONTEND_DIR}/dist/"
    fi

    # 3. Restart systemd services
    systemctl restart vcct-backend
    systemctl restart vcct-frontend
    echo "[$(date)] Successfully auto-deployed commit: $(git rev-parse --short HEAD)"
fi
EOF

chmod +x /opt/vcct-backend/deploy/git-sync.sh
chown -R nchadsadmin:nchadsadmin /opt/vcct-backend/deploy

echo "[*] Creating systemd service and timer for Git auto-deploy..."

cat << 'EOF' > /etc/systemd/system/vcct-git-sync.service
[Unit]
Description=VCCT Backend and Frontend Git Auto-Deploy Sync
After=network.target

[Service]
Type=oneshot
User=root
ExecStart=/opt/vcct-backend/deploy/git-sync.sh
EOF

cat << 'EOF' > /etc/systemd/system/vcct-git-sync.timer
[Unit]
Description=Run VCCT Git Sync every 2 minutes
After=network.target

[Timer]
OnBootSec=1min
OnUnitActiveSec=2min
Persistent=true

[Install]
WantedBy=timers.target
EOF

systemctl daemon-reload
systemctl enable --now vcct-git-sync.timer
systemctl start vcct-git-sync.service || true

echo "✅ Git auto-sync configured successfully! Timer status:"
systemctl status vcct-git-sync.timer --no-pager
