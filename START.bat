@echo off
echo =============================================
echo  ResumeIQ - Setup and Start
echo =============================================
echo.
echo [1/3] Installing root dependencies...
call npm install
echo.
echo [2/3] Installing server dependencies...
cd server
call npm install
cd ..
echo.
echo [3/3] Installing client dependencies...
cd client
call npm install
cd ..
echo.
echo =============================================
echo  Starting app...
echo  Frontend: http://localhost:8080
echo  Backend:  http://localhost:5000
echo =============================================
npm run dev
pause
