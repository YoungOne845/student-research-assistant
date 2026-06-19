$ErrorActionPreference = "Stop"
if (!(Test-Path ".env")) { Copy-Item ".env.example" ".env" }
Write-Host "Created .env from .env.example. Edit it before production deployment." -ForegroundColor Green
Write-Host "Next: docker compose up --build" -ForegroundColor Cyan
