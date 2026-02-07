# How to Restart Metro Server & App

## Quick Restart (Metro Auto-Reloads)

If Metro is already running and you just changed code:
- **Metro will automatically reload** when you save files
- **Shake device/emulator** → "Reload" to refresh the app
- Or press **`r`** in the Metro terminal to reload

---

## Full Restart (When Things Break)

### Option 1: Restart Metro Only (Fastest)

**In Metro Terminal (Terminal 2):**
1. Press **`Ctrl+C`** to stop Metro
2. Run:
   ```bat
   npm start
   ```
   (Or: `npx react-native start`)

**In App Terminal (Terminal 3):**
- Press **`r`** in Metro terminal, OR
- Shake device → "Reload", OR
- Run `npm run android` again

---

### Option 2: Restart Metro with Cache Clear (When Bundling Errors)

**In Metro Terminal (Terminal 2):**
1. Press **`Ctrl+C`** to stop Metro
2. Run:
   ```bat
   npm start -- --reset-cache
   ```
   (Or: `npx react-native start --reset-cache`)

**In App Terminal (Terminal 3):**
- Run `npm run android` again

---

### Option 3: Full Restart (Everything)

**Step 1: Stop Metro**
- In Metro Terminal (Terminal 2): Press **`Ctrl+C`**

**Step 2: Stop App (if running)**
- Close the app on emulator/device, OR
- In App Terminal (Terminal 3): Press **`Ctrl+C`** (if running)

**Step 3: Restart Metro**
- In Terminal 2:
  ```bat
  cd D:\karthik\seva_app
  npm start
  ```
- Wait for "Metro waiting on port 8081"

**Step 4: Restart App**
- In Terminal 3:
  ```bat
  cd D:\karthik\seva_app
  npm run android
  ```

---

## Restart After Code Changes

### If Metro is Running:
- **Just save your file** → Metro auto-reloads
- **Shake device** → "Reload" to see changes

### If Metro Stopped:
1. **Terminal 2:** `npm start`
2. **Terminal 3:** `npm run android` (or shake device → Reload)

---

## Restart After Installing Packages

**After `npm install`:**
1. **Stop Metro** (Ctrl+C in Terminal 2)
2. **Restart Metro:**
   ```bat
   npm start -- --reset-cache
   ```
3. **Restart App:**
   ```bat
   npm run android
   ```

---

## Restart After Syntax Errors Fixed

**After fixing code errors:**
1. **Metro should auto-reload** (if running)
2. If not, **shake device** → "Reload"
3. Or press **`r`** in Metro terminal

---

## Keyboard Shortcuts in Metro Terminal

| Key | Action |
|-----|--------|
| `r` | Reload app |
| `d` | Open developer menu |
| `Ctrl+C` | Stop Metro |
| `Ctrl+M` | Open developer menu (Android) |

---

## Common Restart Scenarios

### "Bundling failed" or "Cannot find module"
```bat
# Terminal 2 (Metro)
Ctrl+C
npm start -- --reset-cache

# Terminal 3 (App)
npm run android
```

### "Metro port 8081 already in use"
```bat
# Find and kill process using port 8081
netstat -ano | findstr :8081
taskkill /PID <PID_NUMBER> /F

# Then restart Metro
npm start
```

### App crashed or frozen
```bat
# Terminal 3 (App)
npm run android

# Or shake device → "Reload"
```

### Need fresh start (everything)
```bat
# Terminal 1: Reset ADB
npm run adb-reset

# Terminal 2: Restart Metro
Ctrl+C
npm start -- --reset-cache

# Terminal 3: Rebuild & Run
npm run android
```

---

## Quick Reference

**Just reload app:** Shake device → "Reload" OR press `r` in Metro terminal  
**Restart Metro:** `Ctrl+C` then `npm start`  
**Clear cache:** `Ctrl+C` then `npm start -- --reset-cache`  
**Full restart:** Follow "Option 3: Full Restart" above
