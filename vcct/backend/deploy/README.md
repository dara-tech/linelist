# VCCT Backend Deployment & Auto-Deploy Guide

**Target Server:** `192.168.1.46` (Ubuntu 26.04 LTS on VMware ESXi)  
**API URL:** `http://192.168.1.46:5000/`  
**Database:** `mpi.nchads.gov.kh:3306` (`main_dbs`)  

---

## 🚀 1. Continuous Auto-Deployment (Git Pull on Server)

The server is configured with a background systemd timer:
- **Timer:** `vcct-git-sync.timer`
- **Schedule:** Checks every **2 minutes**.
- **Action:** Runs `git fetch origin main`. When new commits are detected on `https://github.com/dara-tech/linelist.git`, it automatically:
  1. Pulls the latest code (`git reset --hard origin/main`).
  2. Copies `vcct/backend/src` and `package.json` to `/opt/vcct-backend`.
  3. Runs `npm install --omit=dev`.
  4. Restarts `vcct-backend.service`.

> **Workflow:** Simply `git push origin main` from your computer. Within 2 minutes, your changes will be running live on the server!

---

## ⚡ 2. Local-to-Remote Auto-Deploy (Live Development)

From `vcct/backend` on your Windows workstation:

### Option A: Watch Mode (Auto-deploys on every file save)
```bash
npm run deploy:watch
```
- Watches your local `src/` directory and `.env`.
- Any time you save a file in VS Code, it SFTP-syncs only the changed file and restarts the server service in **~1 second**.

### Option B: Quick Sync (Single command)
```bash
npm run deploy:sync
```
- Instantly uploads your local `src/` files and restarts `vcct-backend`.

### Option C: Full Clean Deploy
```bash
npm run deploy
```
- Re-packages everything into an archive, uploads, and runs the full deployment setup.

---

## 🛠️ 3. Service Management on Server

SSH into the server:
```bash
ssh nchadsadmin@192.168.1.46
# Password: admin123
```

Useful commands:
```bash
# Check Backend API status
sudo systemctl status vcct-backend

# View live API logs
sudo journalctl -u vcct-backend -f

# Restart API
sudo systemctl restart vcct-backend

# Check Git auto-sync timer status & logs
sudo systemctl status vcct-git-sync.timer
sudo journalctl -u vcct-git-sync.service -n 50
```
