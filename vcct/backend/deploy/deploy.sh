#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  Deploying NCHADS VCCT Line List Backend API"
echo "=========================================================="

APP_DIR="/opt/vcct-backend"
SERVICE_NAME="vcct-backend"
CURRENT_USER="${SUDO_USER:-$USER}"

echo "[1/7] Updating system packages..."
# Wait for any background apt lock to release
while fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1 || fuser /var/lib/apt/lists/lock >/dev/null 2>&1 ; do
    echo "Waiting for automatic system update / apt lock to release..."
    sleep 3
done

sudo apt-get update -y
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y curl ufw ca-certificates gnupg

echo "[2/7] Checking Node.js installation..."
if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
    echo "Installing Node.js and npm..."
    sudo DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs npm
fi
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

echo "[3/7] Setting up application directory: ${APP_DIR}..."
sudo mkdir -p "${APP_DIR}"
sudo chown -R "${CURRENT_USER}:${CURRENT_USER}" "${APP_DIR}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "[4/7] Copying backend source files..."
if [ -d "${PARENT_DIR}/src" ]; then
    cp -r "${PARENT_DIR}/src" "${APP_DIR}/"
    cp "${PARENT_DIR}/package.json" "${APP_DIR}/"
    [ -f "${PARENT_DIR}/package-lock.json" ] && cp "${PARENT_DIR}/package-lock.json" "${APP_DIR}/"
    [ -f "${PARENT_DIR}/.env" ] && cp "${PARENT_DIR}/.env" "${APP_DIR}/"
elif [ -d "${SCRIPT_DIR}/src" ]; then
    cp -r "${SCRIPT_DIR}/src" "${APP_DIR}/"
    cp "${SCRIPT_DIR}/package.json" "${APP_DIR}/"
    [ -f "${SCRIPT_DIR}/package-lock.json" ] && cp "${SCRIPT_DIR}/package-lock.json" "${APP_DIR}/"
    [ -f "${SCRIPT_DIR}/.env" ] && cp "${SCRIPT_DIR}/.env" "${APP_DIR}/"
fi

# Ensure .env exists
if [ ! -f "${APP_DIR}/.env" ]; then
    cat << 'EOF' > "${APP_DIR}/.env"
PORT=5000
DB_HOST=mpi.nchads.gov.kh
DB_PORT=3306
DB_USER=root_dmu
DB_PASSWORD=deV@0926mp!*
DB_DATABASE=main_dbs
CORS_ORIGIN=*
EOF
fi

echo "[5/7] Installing Node.js dependencies..."
cd "${APP_DIR}"
npm install --omit=dev

echo "[6/7] Configuring systemd service..."
NODE_BIN=$(which node)
sudo tee "/etc/systemd/system/${SERVICE_NAME}.service" > /dev/null << EOF
[Unit]
Description=NCHADS VCCT Line List Backend API
After=network.target

[Service]
Type=simple
User=${CURRENT_USER}
WorkingDirectory=${APP_DIR}
ExecStart=${NODE_BIN} src/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable "${SERVICE_NAME}"
sudo systemctl restart "${SERVICE_NAME}"

echo "[7/7] Configuring firewall..."
sudo ufw allow 22/tcp || true
sudo ufw allow 5000/tcp || true
sudo ufw --force enable || true

sleep 3
echo "=========================================================="
echo "Checking service status..."
sudo systemctl status "${SERVICE_NAME}" --no-pager || true

echo ""
echo "Testing API endpoint locally..."
curl -s http://127.0.0.1:5000/ || echo "Server is starting up..."
echo ""
echo "=========================================================="
HOST_IP=$(hostname -I | awk '{print $1}')
echo " Deployment Complete!"
echo " Backend is running on: http://${HOST_IP}:5000/"
echo " Test via browser or curl: http://${HOST_IP}:5000/api/health"
echo " Service management:"
echo "   sudo systemctl status ${SERVICE_NAME}"
echo "   sudo systemctl restart ${SERVICE_NAME}"
echo "   sudo journalctl -u ${SERVICE_NAME} -f"
echo "=========================================================="
