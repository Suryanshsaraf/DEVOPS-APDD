# Start both Backend and Frontend for ML Prediction API

Write-Host "🚀 Starting ML Prediction API (Backend)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", ".\venv\Scripts\activate; uvicorn app.main:app --host 0.0.0.0 --port 8000"

Write-Host "🚀 Starting React Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "✅ Both services have been started in separate windows." -ForegroundColor Green
Write-Host "Backend: http://localhost:8000/docs"
Write-Host "Frontend: http://localhost:5173"
