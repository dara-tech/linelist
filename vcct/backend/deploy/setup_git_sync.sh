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
APP_DIR="/opt/vcct-backend"

cd "${REPO_DIR}"
git fetch origin main >/dev/null 2>&1

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "${LOCAL}" != "${REMOTE}" ]; then
    echo "[$(date)] New commits detected in Git (${LOCAL:0:7} -> ${REMOTE:0:7}). Auto-deploying..."
    git reset --hard origin/main
    
    cp -r "${REPO_DIR}/vcct/backend/src" "${APP_DIR}/"
    cp "${REPO_DIR}/vcct/backend/package.json" "${APP_DIR}/"
    [ -f "${REPO_DIR}/vcct/backend/package-lock.json" ] && cp "${REPO_DIR}/vcct/backend/package-lock.json" "${APP_DIR}/"

    cd "${APP_DIR}"
    npm install --omit=dev

    systemctl restart vcct-backend
    echo "[$(date)] Successfully auto-deployed commit: $(git rev-parse --short HEAD)"
fi
EOF

chmod +x /opt/vcct-backend/deploy/git-sync.sh
chown -R nchadsadmin:nchadsadmin /opt/vcct-backend/deploy

echo "[*] Creating systemd service and timer for Git auto-deploy..."

cat << 'EOF' > /etc/systemd/system/vcct-git-sync.service
[Unit]
Description=VCCT Backend Git Auto-Deploy Sync
After=network.target

[Service]
Type=oneshot
User=root
ExecStart=/opt/vcct-backend/deploy/git-sync.sh
EOF

cat << 'EOF' > /etc/systemd/system/vcct-git-sync.timer
[Unit]
Description=Run VCCT Backend Git Auto-Deploy every 2 minutes

[Timer]
OnBootSec=1min
OnUnitActiveSec=2min
Unit=vcct-git-sync.service

[Install]
WantedBy=timers.target
EOF

systemctl daemon-reload
systemctl enable --now vcct-git-sync.timer

echo "[*] Testing manual run of git-sync.sh..."
/opt/vcct-backend/deploy/git-sync.sh || true

echo "[*] Checking timer status..."
systemctl status vcct-git-sync.timer --no-pager

