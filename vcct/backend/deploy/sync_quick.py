import os
import sys
import paramiko
import time
import urllib.request
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

SERVER_IP = "192.168.1.46"
USERNAME = "nchadsadmin"
PASSWORD = "admin123"
REMOTE_APP_DIR = "/opt/vcct-backend"

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def quick_sync():
    print(f"[*] Quick syncing backend code to {USERNAME}@{SERVER_IP}...")
    start_time = time.time()

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(SERVER_IP, port=22, username=USERNAME, password=PASSWORD, timeout=10)
    sftp = ssh.open_sftp()

    def sync_dir(local_path, remote_path):
        try:
            sftp.stat(remote_path)
        except IOError:
            sftp.mkdir(remote_path)

        for item in os.listdir(local_path):
            if item in ["node_modules", ".git", "__pycache__", ".vscode"]:
                continue
            if item.endswith((".xlsx", ".log", ".tmp")):
                continue

            l_item = os.path.join(local_path, item)
            r_item = f"{remote_path}/{item}"

            if os.path.isdir(l_item):
                sync_dir(l_item, r_item)
            else:
                # Compare mtime or upload directly
                sftp.put(l_item, r_item)

    # Sync src directory
    local_src = os.path.join(BACKEND_DIR, "src")
    remote_src = f"{REMOTE_APP_DIR}/src"
    sync_dir(local_src, remote_src)

    # Sync package.json and .env if present
    for fname in ["package.json", ".env"]:
        l_file = os.path.join(BACKEND_DIR, fname)
        if os.path.exists(l_file):
            sftp.put(l_file, f"{REMOTE_APP_DIR}/{fname}")

    sftp.close()

    # Restart service
    print("[*] Restarting vcct-backend systemd service...")
    cmd = f"echo '{PASSWORD}' | sudo -S systemctl restart vcct-backend"
    stdin, stdout, stderr = ssh.exec_command(cmd)
    stdout.channel.recv_exit_status()
    ssh.close()

    elapsed = time.time() - start_time
    print(f"[+] Synced and restarted in {elapsed:.1f}s!")

    # Verify endpoint
    try:
        req = urllib.request.Request(f"http://{SERVER_IP}:5000/", headers={"User-Agent": "QuickSync"})
        with urllib.request.urlopen(req, timeout=3) as res:
            if res.status == 200:
                print("✅ API is LIVE and responding at http://192.168.1.46:5000/")
    except Exception as e:
        print(f"[!] Warning checking health: {e}")

if __name__ == "__main__":
    quick_sync()

