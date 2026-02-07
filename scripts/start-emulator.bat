@echo off
REM Fix "Device is OFFLINE" and "emulator quit before opening"
REM Run this BEFORE "npm run android" - then run android in another terminal.

set SDK=%LOCALAPPDATA%\Android\Sdk
if not "%ANDROID_HOME%"=="" set SDK=%ANDROID_HOME%
set ADB=%SDK%\platform-tools\adb.exe
set EMULATOR=%SDK%\emulator\emulator.exe

echo [1/3] Killing ADB server...
"%ADB%" kill-server 2>nul

echo [2/3] Starting ADB server...
"%ADB%" start-server

echo [3/3] Starting emulator (wait until home screen appears)...
"%EMULATOR%" -avd Medium_Phone_API_36.1 -no-snapshot-load
REM If your AVD has a different name, run: emulator -list-avds
REM Then change Medium_Phone_API_36.1 above to your AVD name.

pause
