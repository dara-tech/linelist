param (
    [Parameter(Mandatory = $true, HelpMessage = "Ubuntu VM IP address (e.g., 192.168.0.x)")]
    [string]$ServerIP,

    [string]$User = "nchadsadmin",
    [int]$Port = 22
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " NCHADS VCCT Backend - Automated Remote Deployment" -ForegroundColor Cyan
Write-Host " Target: ${User}@${ServerIP}:${Port}" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$BackendDir = Split-Path -Parent $PSScriptRoot
$ArchiveFile = Join-Path $env:TEMP "vcct-backend-deploy.tar.gz"

Write-Host "`n[1/4] Packaging backend files (excluding node_modules)..." -ForegroundColor Yellow
if (Test-Path $ArchiveFile) { Remove-Item $ArchiveFile -Force }

# Use tar to archive
Push-Location $BackendDir
try {
    tar -czf $ArchiveFile `
        --exclude="node_modules" `
        --exclude="*.xlsx" `
        --exclude="scratch_*" `
        --exclude="vite_*" `
        --exclude=".git" `
        src package.json package-lock.json .env deploy
    Write-Host "Archive created: $ArchiveFile" -ForegroundColor Green
}
finally {
    Pop-Location
}

Write-Host "`n[2/4] Uploading archive to server ($ServerIP)..." -ForegroundColor Yellow
scp -P $Port $ArchiveFile "${User}@${ServerIP}:/tmp/vcct-backend-deploy.tar.gz"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to upload archive to ${ServerIP} via scp."
}

Write-Host "`n[3/4] Extracting archive and executing deploy.sh on server..." -ForegroundColor Yellow
$RemoteCmd = @"
mkdir -p /tmp/vcct-deploy && \
tar -xzf /tmp/vcct-backend-deploy.tar.gz -C /tmp/vcct-deploy && \
chmod +x /tmp/vcct-deploy/deploy/deploy.sh && \
sudo /tmp/vcct-deploy/deploy/deploy.sh
"@

ssh -p $Port -t "${User}@${ServerIP}" $RemoteCmd

Write-Host "`n[4/4] Verification check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://${ServerIP}:5000/" -TimeoutSec 5
    Write-Host "Backend API is LIVE and responding!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
}
catch {
    Write-Host "Could not query http://${ServerIP}:5000/ directly from this workstation: $_" -ForegroundColor DarkYellow
    Write-Host "Check status on server: ssh ${User}@${ServerIP} 'sudo systemctl status vcct-backend'" -ForegroundColor DarkYellow
}

Write-Host "`n Deployment script completed!" -ForegroundColor Cyan

