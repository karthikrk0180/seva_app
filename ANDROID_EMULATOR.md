# Android Emulator – Fix "OFFLINE" & "Emulator quit before opening"

## What’s going wrong

1. **Terminal 2 / 6**: `Task :app:installDebug FAILED`  
   - **Cause**: `Skipping device 'emulator-5554': Device is OFFLINE` → ADB sees the emulator but it’s in a bad state.
2. **Terminal 6**: `The emulator (Medium_Phone_API_36.1) quit before it finished opening`  
   - **Cause**: Emulator crashes or doesn’t finish booting when React Native tries to start it automatically.

So: either the emulator never comes up, or it comes up as OFFLINE. Both lead to **No online devices found** and install fails.

---

## Fix (do this every time before `npm run android`)

### Step 1: Reset ADB (fix OFFLINE)

In **Command Prompt** or **PowerShell**:

```bat
adb kill-server
adb start-server
```

If `adb` is not in PATH, use full path (adjust if your SDK is elsewhere):

```bat
%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe kill-server
%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe start-server
```

### Step 2: Start emulator manually (fix “quit before opening”)

Start the emulator **yourself** and wait until the **home screen** is fully visible. Don’t run `npm run android` until then.

**Option A – Script (recommended)**  
From project root:

```bat
scripts\start-emulator.bat
```

**Option B – Command line**  
List AVDs:

```bat
%LOCALAPPDATA%\Android\Sdk\emulator\emulator.exe -list-avds
```

Start your AVD (use the exact name from the list, e.g. `Medium_Phone_API_36.1`):

```bat
%LOCALAPPDATA%\Android\Sdk\emulator\emulator.exe -avd Medium_Phone_API_36.1 -no-snapshot-load
```

**Option C – Android Studio**  
Device Manager → pick an AVD → Run. Wait until it’s fully booted.

### Step 3: Check device is “device” (not offline)

In a **new** terminal:

```bat
adb devices
```

You want something like:

```text
List of devices attached
emulator-5554   device
```

If you see `emulator-5554   offline`, repeat Step 1 and Step 2 (close emulator, run script or command again, wait for home screen, then `adb devices` again).

### Step 4: Run the app

With Metro already running in one terminal (e.g. `npm start`), in another:

```bat
cd D:\karthik\seva_app
npm run android
```

The app should install and open on the emulator.

---

## If emulator still “quits before opening”

- **Different AVD**: In Android Studio → Device Manager, create an AVD with **API 34** (or 33) and **x86_64** image. Use that AVD name in the script or command.
- **Cold boot**: In Device Manager, edit the AVD → Show Advanced Settings → set “Boot option” to **Cold boot**, then start it again.
- **Less RAM**: Edit AVD → reduce RAM to 2048 MB and try again.
- **Disable snapshot**: Use `-no-snapshot-load` (script already does this) or in AVD settings disable “Quick Boot” / snapshot.

---

## Quick checklist

1. `adb kill-server` then `adb start-server`
2. Start emulator manually (script or Android Studio) and wait for home screen
3. `adb devices` → `emulator-5554   device`
4. `npm run android` (with Metro running if needed)

After this, the “Device is OFFLINE” and “emulator quit before it finished opening” errors should be resolved and the app should install and run.
