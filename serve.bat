@echo off
setlocal
cd /d "%~dp0"

REM Try Python launcher first
where py >nul 2>nul
if %ERRORLEVEL%==0 (
  start "" http://localhost:5173/
  py -m http.server 5173
  goto :eof
)

REM Fallback to python
where python >nul 2>nul
if %ERRORLEVEL%==0 (
  start "" http://localhost:5173/
  python -m http.server 5173
  goto :eof
)

echo Python не найден. Установите Python или запустите вручную: py -m http.server 5173
pause
