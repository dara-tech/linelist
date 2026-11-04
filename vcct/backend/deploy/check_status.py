import paramiko
import sys

SERVER_IP = "192.168.1.46"
USERNAME = "nchadsadmin"
PASSWORD = "admin123"

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(SERVER_IP, port=22, username=USERNAME, password=PASSWORD, timeout=10)

commands = [
    "ps aux | grep -E 'node|deploy|apt' | grep -v grep",
    "sudo systemctl status vcct-backend --no-pager || true",
    "curl -s http://127.0.0.1:5000/ || true"
]

for cmd in commands:
    print(f"\n--- Running: {cmd} ---")
    stdin, stdout, stderr = ssh.exec_command(f"echo {PASSWORD} | sudo -S bash -c \"{cmd}\"")
    print(stdout.read().decode('utf-8', errors='replace'))

ssh.close()

