import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('192.168.1.46', port=22, username='nchadsadmin', password='admin123', timeout=10)

cmds = [
    'ps -fp 31494',
    'curl -sI http://localhost:80',
    'curl -sI http://localhost:3000',
    'cat /etc/os-release',
    'node -v; npm -v',
    'echo admin123 | sudo -S systemctl list-units --type=service --state=running | grep -E "apache|http|node|vcct"'
]

for cmd in cmds:
    print('=' * 40)
    print('CMD:', cmd)
    stdin, stdout, stderr = ssh.exec_command(cmd)
    print(stdout.read().decode())
    err = stderr.read().decode()
    if err and 'password' not in err.lower():
        print('ERR:', err)

ssh.close()
