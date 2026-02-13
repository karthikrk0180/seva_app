@echo off
REM Reset ADB to fix "Device is OFFLINE" - run before starting emulator.
set SDK=%LOCALAPPDATA%\Android\Sdk
if not "%ANDROID_HOME%"=="" set SDK=%ANDROID_HOME%
set ADB=%SDK%\platform-tools\adb.exe
"%ADB%" kill-server 2>nul
"%ADB%" start-server
echo ADB reset done. Run "adb devices" to verify.
