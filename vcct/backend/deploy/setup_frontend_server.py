import paramiko
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('192.168.1.46', port=22, username='nchadsadmin', password='admin123', timeout=10)

commands = [
    "echo admin123 | sudo -S mkdir -p /opt/vcct-frontend",
    "echo admin123 | sudo -S chown -R nchadsadmin:nchadsadmin /opt/vcct-frontend",
    "cp -r /opt/vcct-repo/vcct/frontend/dist /opt/vcct-frontend/",
    "echo admin123 | sudo -S ufw allow 8000/tcp",
]

for cmd in commands:
    print(f"Running: {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    stdout.channel.recv_exit_status()

# Write server.js via SFTP
sftp = ssh.open_sftp()

server_js = """import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;
const distPath = path.resolve(__dirname, 'dist');

app.use(express.json());

// Reverse proxy /api to backend port 5000
app.all('/api*', async (req, res) => {
  const targetUrl = 'http://127.0.0.1:5000' + req.originalUrl;
  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        'Accept': req.headers['accept'] || '*/*',
        'User-Agent': req.headers['user-agent'] || 'VCCT-Frontend-Proxy',
      },
    };
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body && Object.keys(req.body).length > 0) {
      fetchOptions.headers['Content-Type'] = 'application/json';
      fetchOptions.body = JSON.stringify(req.body);
    }
    const fetchRes = await fetch(targetUrl, fetchOptions);
    res.status(fetchRes.status);
    fetchRes.headers.forEach((val, key) => {
      if (!['transfer-encoding', 'connection'].includes(key.toLowerCase())) {
        res.setHeader(key, val);
      }
    });
    const buf = await fetchRes.arrayBuffer();
    res.send(Buffer.from(buf));
  } catch (err) {
    res.status(502).json({ error: 'Backend unreachable', details: err.message });
  }
});

// Serve static frontend assets
app.use(express.static(distPath));

// SPA Fallback for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Standalone VCCT Frontend running on http://0.0.0.0:${PORT}`);
});
"""

with sftp.file('/opt/vcct-frontend/server.js', 'w') as f:
    f.write(server_js)

package_json = """{
  "name": "vcct-frontend-server",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "express": "^4.19.2"
  }
}
"""

with sftp.file('/opt/vcct-frontend/package.json', 'w') as f:
    f.write(package_json)

service_file = """[Unit]
Description=NCHADS VCCT Line List Frontend Web App
After=network.target vcct-backend.service

[Service]
Type=simple
User=nchadsadmin
WorkingDirectory=/opt/vcct-frontend
ExecStart=/usr/bin/node /opt/vcct-frontend/server.js
Restart=always
RestartSec=3
Environment=NODE_ENV=production
Environment=PORT=8000

[Install]
WantedBy=multi-user.target
"""

with sftp.file('/tmp/vcct-frontend.service', 'w') as f:
    f.write(service_file)

sftp.close()

# Install express in /opt/vcct-frontend
print("Installing express in /opt/vcct-frontend...")
stdin, stdout, stderr = ssh.exec_command("cd /opt/vcct-frontend && npm install --omit=dev")
stdout.channel.recv_exit_status()
print(stdout.read().decode())

stdin, stdout, stderr = ssh.exec_command("echo admin123 | sudo -S cp /tmp/vcct-frontend.service /etc/systemd/system/vcct-frontend.service")
stdout.channel.recv_exit_status()

# Enable and start service
print("Starting vcct-frontend.service...")
stdin, stdout, stderr = ssh.exec_command("echo admin123 | sudo -S systemctl daemon-reload && echo admin123 | sudo -S systemctl enable vcct-frontend.service && echo admin123 | sudo -S systemctl restart vcct-frontend.service")
stdout.channel.recv_exit_status()

import time
time.sleep(1.5)

# Check service status
stdin, stdout, stderr = ssh.exec_command("systemctl is-active vcct-frontend.service")
print("vcct-frontend service status:", stdout.read().decode().strip())

# Check port 8000 response
stdin, stdout, stderr = ssh.exec_command("curl -sI http://localhost:8000")
print("Curl port 8000:\n", stdout.read().decode())

ssh.close()
print("Done!")
