# CodeSpire Backend Quick Start Script for Windows PowerShell
# Run with: .\quick-start.ps1

Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                        ║" -ForegroundColor Cyan
Write-Host "║   🚀 CodeSpire Backend Quick Start    ║" -ForegroundColor Cyan
Write-Host "║                                        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

Write-Host ""

# Step 2: Check if .env exists
if (-Not (Test-Path ".env")) {
    Write-Host "⚙️  No .env file found. Running setup..." -ForegroundColor Yellow
    npm run setup
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Setup failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ .env file exists" -ForegroundColor Green
}

Write-Host ""

# Step 3: Check if MongoDB is running (optional check)
Write-Host "🔍 Checking MongoDB..." -ForegroundColor Yellow
$mongoProcess = Get-Process -Name mongod -ErrorAction SilentlyContinue

if ($mongoProcess) {
    Write-Host "✅ MongoDB is running (PID: $($mongoProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB is not running locally" -ForegroundColor Yellow
    Write-Host "   Options:" -ForegroundColor Yellow
    Write-Host "   1. Start MongoDB: mongod" -ForegroundColor Yellow
    Write-Host "   2. Use MongoDB Atlas (cloud) - update MONGO_URI in .env" -ForegroundColor Yellow
    Write-Host "   3. Continue anyway (server has fallback defaults)" -ForegroundColor Yellow
}

Write-Host ""

# Step 4: Start the server with increased header size
Write-Host "🚀 Starting CodeSpire backend server..." -ForegroundColor Cyan
Write-Host "   Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

$env:NODE_OPTIONS = '--max-http-header-size=65536'
npm run server
