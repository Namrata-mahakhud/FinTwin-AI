@echo off
echo Installing required dependencies...
cd /d "%~dp0"
call npm install --save-dev ts-node tsconfig-paths
echo.
echo Starting backend server...
call npx ts-node -r tsconfig-paths/register src/server.ts

@REM Made with Bob
