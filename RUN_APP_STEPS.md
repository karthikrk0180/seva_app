# How to Run the App – Step by Step (Fresh Start)

Do these in order. Use **two terminals** (e.g. two tabs in VS Code or Cursor).

---

## Terminal 1 – Reset ADB & Start Emulator

**1. Open Terminal 1** (e.g. Ctrl+` or Terminal → New Terminal).

**2. Go to project folder:**
```bat
cd D:\karthik\seva_app
```

**3. Reset ADB (fix “Device is OFFLINE”):**
```bat
npm run adb-reset
```
*(Or: `adb kill-server` then `adb start-server`)*

**4. Start the emulator:**
```bat
npm run android:emulator
```
*(Or double‑click `scripts\start-emulator.bat`)*

**5. Wait** until the emulator shows the **Android home screen** (not boot animation). Leave this terminal open; the emulator keeps running.

---

## Terminal 2 – Metro & Run App

**6. Open Terminal 2** (new terminal; keep Terminal 1 open).

**7. Go to project folder:**
```bat
cd D:\karthik\seva_app
```

**8. Start Metro (JS bundler):**
```bat
npm start
```
*(Or: `npx react-native start`)*

**9. Wait** until you see something like:
```
Metro waiting on port 8081
```
Leave this terminal open.

**10. Open Terminal 3** (or another new terminal).

**11. Go to project folder again:**
```bat
cd D:\karthik\seva_app
```

**12. Run the app on the emulator:**
```bat
npm run android
```
*(Or: `npx react-native run-android`)*

**13. Wait** for “BUILD SUCCESSFUL” and “Installed on 1 device”. The app should open on the emulator.

---

## Quick Reference – All Commands in Order

| Step | Terminal | Command |
|------|----------|---------|
| 1 | 1 | `cd D:\karthik\seva_app` |
| 2 | 1 | `npm run adb-reset` |
| 3 | 1 | `npm run android:emulator` |
| 4 | 1 | *(Wait for emulator home screen)* |
| 5 | 2 | `cd D:\karthik\seva_app` |
| 6 | 2 | `npm start` |
| 7 | 2 | *(Wait for “Metro waiting on port 8081”)* |
| 8 | 3 | `cd D:\karthik\seva_app` |
| 9 | 3 | `npm run android` |

---

## If Something Fails

- **“Device is OFFLINE”**  
  In Terminal 1: `npm run adb-reset`, then start the emulator again and wait for the home screen.

- **“Cannot find module 'babel-plugin-module-resolver'”**  
  In any terminal: `cd D:\karthik\seva_app` then `npm install`. Then in the Metro terminal press Ctrl+C, run `npm start` again, then run `npm run android` again.

- **Emulator doesn’t start**  
  Start it from Android Studio: Device Manager → pick an AVD → Run. Wait for the home screen, then run `npm run android` from Terminal 3.

- **Metro port 8081 in use**  
  Stop the other process using 8081, or run: `npx react-native start --port 8082` and then `npm run android` (it will use 8082).

---

## One-Line Reminder

**Terminal 1:** `cd D:\karthik\seva_app` → `npm run adb-reset` → `npm run android:emulator` (wait for home screen)  
**Terminal 2:** `cd D:\karthik\seva_app` → `npm start` (wait for Metro)  
**Terminal 3:** `cd D:\karthik\seva_app` → `npm run android`
