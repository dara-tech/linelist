import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('192.168.1.46', port=22, username='nchadsadmin', password='admin123', timeout=10)

cmds = [
    "echo admin123 | sudo -S git config --system --add safe.directory '*'",
    "echo admin123 | sudo -S systemctl restart vcct-git-sync.service",
    "systemctl status vcct-git-sync.service --no-pager",
    "systemctl status vcct-frontend.service --no-pager",
    "systemctl status vcct-backend.service --no-pager",
]

for cmd in cmds:
    print("=" * 40)
    print("RUN:", cmd)
    stdin, stdout, stderr = ssh.exec_command(cmd)
    print(stdout.read().decode())
    err = stderr.read().decode()
    if err and "password" not in err.lower():
        print("ERR:", err)

ssh.close()
