import os
import sys
import tarfile
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

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ARCHIVE_PATH = os.path.join(os.environ.get("TEMP", "C:/Windows/Temp"), "vcct_backend.tar.gz")

print(f"[*] Packaging backend files from {BACKEND_DIR}...")
EXCLUDE_EXTS = {".xlsx", ".log", ".tmp"}
EXCLUDE_DIRS = {"node_modules", ".git", ".vscode", "__pycache__"}

def tar_filter(tarinfo):
    name = os.path.basename(tarinfo.name)
    if any(tarinfo.name.split("/")[0] == d or f"/{d}/" in f"/{tarinfo.name}/" for d in EXCLUDE_DIRS):
        return None
    _, ext = os.path.splitext(name)
    if ext.lower() in EXCLUDE_EXTS:
        return None
    return tarinfo

with tarfile.open(ARCHIVE_PATH, "w:gz") as tar:
    for item in ["src", "package.json", "package-lock.json", ".env", "deploy"]:
        item_path = os.path.join(BACKEND_DIR, item)
        if os.path.exists(item_path):
            tar.add(item_path, arcname=item, filter=tar_filter)

archive_size_kb = os.path.getsize(ARCHIVE_PATH) / 1024
print(f"[+] Archive created: {ARCHIVE_PATH} ({archive_size_kb:.1f} KB)")

print(f"[*] Connecting to {USERNAME}@{SERVER_IP} via SSH...")
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(SERVER_IP, port=22, username=USERNAME, password=PASSWORD, timeout=15)
print("[+] SSH connection established!")

print("[*] Uploading archive to /tmp/vcct-backend.tar.gz via SFTP...")
sftp = ssh.open_sftp()
sftp.put(ARCHIVE_PATH, "/tmp/vcct-backend.tar.gz")
sftp.close()
print("[+] Archive uploaded successfully!")

deploy_script_cmd = f"""
echo "{PASSWORD}" | sudo -S bash -c '
set -e
echo "=== Starting On-Host Deployment ==="
mkdir -p /tmp/vcct-deploy
tar -xzf /tmp/vcct-backend.tar.gz -C /tmp/vcct-deploy
chmod +x /tmp/vcct-deploy/deploy/deploy.sh
bash /tmp/vcct-deploy/deploy/deploy.sh
'
"""

print("[*] Executing deployment on Ubuntu server...")
stdin, stdout, stderr = ssh.exec_command(deploy_script_cmd, get_pty=True)

for line in iter(stdout.readline, ""):
    sys.stdout.write(line)
    sys.stdout.flush()

exit_status = stdout.channel.recv_exit_status()
print(f"\n[+] Remote execution finished with exit status: {exit_status}")
ssh.close()

if exit_status != 0:
    print(f"\n❌ Deployment exited with error code {exit_status}")
    sys.exit(exit_status)

print("\n[*] Verifying API response directly from workstation...")
time.sleep(3)
try:
    req = urllib.request.Request(f"http://{SERVER_IP}:5000/")
    with urllib.request.urlopen(req, timeout=8) as response:
        body = response.read().decode("utf-8")
        print("[+] HTTP 200 OK! API response:")
        print(json.dumps(json.loads(body), indent=2))
        print("\n✅ VCCT Backend API successfully deployed and accessible over network!")
except Exception as e:
    print(f"[!] Workstation direct check note: {e}")
