import paramiko
import sys
import os

SERVER_IP = "192.168.1.46"
USERNAME = "nchadsadmin"
PASSWORD = "admin123"

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(SERVER_IP, port=22, username=USERNAME, password=PASSWORD, timeout=10)

sftp = ssh.open_sftp()
local_sh = os.path.join(os.path.dirname(__file__), "setup_git_sync.sh")
sftp.put(local_sh, "/tmp/setup_git_sync.sh")
sftp.close()

cmd = f"echo '{PASSWORD}' | sudo -S bash /tmp/setup_git_sync.sh"
stdin, stdout, stderr = ssh.exec_command(cmd, get_pty=True)

for line in iter(stdout.readline, ""):
    sys.stdout.write(line)
    sys.stdout.flush()

exit_status = stdout.channel.recv_exit_status()
print(f"\nExit status: {exit_status}")
ssh.close()
