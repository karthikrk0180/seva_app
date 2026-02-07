# Firebase on Android – Full Setup (Add Firebase + Phone Auth)

This guide covers **adding Firebase to your Android project** and then **enabling Phone Authentication** for OTP sign-in. Do the steps in order.

> **Privacy:** Phone numbers are sent and stored by Google for spam/abuse prevention. Get user consent (e.g. Terms & Privacy) before using phone sign-in.

> **Play Integrity:** Enabling phone auth on Android means you agree to [Google's Play Integrity API terms](https://firebase.google.com/support/guides/phone-auth#play-integrity).

---

## Prerequisites

- **Android Studio** – install or update to the latest version.
- **Project requirements:**
  - Targets **API level 23 (Marshmallow)** or higher (your project uses `minSdkVersion 21`; consider 23+ if you need it).
  - **AndroidX (Jetpack)** – React Native uses this.
  - **compileSdkVersion 28+** – your project uses 34.
- **Device:** Use a physical device or an emulator. For Phone Auth, devices with **Google Play services** use Play Integrity; emulators without it will use reCAPTCHA.
- **Google account** to sign into the [Firebase Console](https://console.firebase.google.com/).

---

## Part 1: Add Firebase to your Android project

Follow the Firebase Console workflow, then add the config file and Gradle plugin in your project.

### Step 1.1 – Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. **Create a project** (or select an existing one).
3. Add Google Analytics if you want (optional).

### Step 1.2 – Register your Android app with Firebase

1. In the project overview, click the **Android icon** or **Add app** → **Android**.
2. **Android package name:** enter **`seva.App.v`** (must match `applicationId` in `android/app/build.gradle`). It is case-sensitive and cannot be changed later for this app. (This project uses **Seva App** as the Firebase app nickname.)
3. (Optional) **App nickname** – internal label only.
4. Click **Register app**.

### Step 1.3 – Add the Firebase config file and Gradle plugin

**A. Download and add `google-services.json`**

1. In the setup workflow, click **Download google-services.json**.
2. Move the file into your **app (module) root**:
   ```
   android/app/google-services.json
   ```

**B. Add the Google services Gradle plugin**

The plugin reads `google-services.json` and makes the config available to Firebase SDKs. It is already added in this project:

- **Root Gradle** (`android/build.gradle`):  
  `classpath("com.google.gms:google-services:4.4.4")` in `buildscript.dependencies`.
- **App Gradle** (`android/app/build.gradle`):  
  `apply plugin: "com.google.gms.google-services"` at the bottom.

If you start from a fresh clone, ensure both are present as above.

### Step 1.4 – Firebase SDKs (React Native)

You do **not** add Firebase dependencies manually in Gradle. **React Native Firebase** (`@react-native-firebase/app`, `@react-native-firebase/auth`) brings in the Firebase Android SDK (including BoM and `firebase-auth`) via native modules. Just keep those npm packages installed.

**Sync and run:**

```powershell
cd D:\karthik\seva_app\android
.\gradlew clean
cd ..
npm run android
```

---

## Part 2: Add SHA-1 and SHA-256 (required for Phone Auth)

Firebase must identify your app. Phone Auth needs **SHA-1** and **SHA-256**. **SHA-256** is required for **Play Integrity** (recommended).

**Get fingerprints – Gradle:**

```powershell
cd D:\karthik\seva_app\android
.\gradlew signingReport
```

Under **Variant: debug**, copy **SHA-1** and **SHA-256**.

**Get fingerprints – keytool:**

```powershell
keytool -list -v -keystore android\app\debug.keystore -alias androiddebugkey -storepass android -keypass android
```

**Add in Firebase:**

1. **Project settings** (gear) → **Your apps** → select your **Android app**.
2. **Add fingerprint** → paste **SHA-1** → Save.
3. **Add fingerprint** → paste **SHA-256** → Save.
4. If you had just registered the app, you can (re)download `google-services.json` after adding fingerprints.

---

## Part 3: Enable Phone sign-in in Firebase Console

1. **Build → Authentication**.
2. **Sign-in method** → **Phone** → **Enable** → **Save**.
3. (Optional) **Authentication → Settings** → set **SMS region policy** to limit where SMS can be sent. If you use “Allow only selected regions”, add the countries you need (e.g. India); otherwise sign-in from those regions can fail with “operation not allowed”.

---

## Part 4: App verification (Android) – no extra code

Firebase verifies that requests come from your app:

| Method | When used | You need |
|--------|-----------|----------|
| **Play Integrity API** | Default when device has Google Play services. | SHA-256 in Firebase (Part 2). |
| **reCAPTCHA** | Fallback (no Play services, emulator without Play, app not from Play Store). | SHA-1 in Firebase; API key allows `PROJECT_ID.firebaseapp.com`. |

Your app only calls `auth().signInWithPhoneNumber(phoneNumber)`; the SDK chooses the method. No extra code for production.

- **Play Integrity** does not use your project’s Play Integrity quota.
- If users complete reCAPTCHA in a browser, they must be able to return to the app (e.g. on **Firefox for Android**, enable opening links in the native app to avoid “Missing initial state”).

---

## Part 5: How the app uses Phone Auth (code overview)

The app already implements the full flow. No code changes are required for basic OTP sign-in.

- **Send OTP:** User enters phone on **LoginScreen** → `authService.loginWithPhone('+91' + phone)` → Firebase sends SMS (or uses test number) → navigate to OTP screen.
- **SMS language:** Set at startup in `app.tsx` via `firebaseService.setAuthLanguage(i18n.language || 'en')` (same idea as Android’s `auth.setLanguageCode(...)`).
- **Verify:** User enters 6-digit code on **OtpScreen** → `authStore.login(phoneNumber, otp, verificationId)` → `authService.verifyOtp(verificationId, code)` → signed in.

Phone numbers must be **E.164** (e.g. `+919876543210`). Your app uses `+91` for Indian numbers.

---

## Part 6: Test with fictional phone numbers

- **Authentication → Sign-in method → Phone** → **Phone numbers for testing**.
- Add a number and a **6-digit code** (e.g. `123456`). Up to 10 numbers. Use **E.164 with no spaces** (e.g. `+16505553434` or `+911111111111`).
- **Use only fictitious numbers.** Firebase does **not** allow real phone numbers as test numbers (you’ll get an error). Use made-up numbers, e.g.:
  - US: `+1 650-555-3434` (555 is reserved for fiction), or `+1 111-111-1111`
  - India: e.g. `+91 1111111111` (a number that isn’t a real user’s)
- **If you still get an error adding a test number:** delete any **User** in **Authentication → Users** that has that phone number. You can’t add a number as “test” if it’s already registered as a real user. After deleting the user, add the test number again.
- No real SMS is sent for test numbers; sign in with the code you set. Works on emulators without Google Play services (reCAPTCHA is used).

**Optional – testing only (do not use in production):**

- **Force reCAPTCHA:** `auth().settings.forceRecaptchaFlowForTesting = true` before `signInWithPhoneNumber`.
- **Disable app verification** (e.g. integration tests): `auth().settings.appVerificationDisabledForTesting = true`; use only with test numbers.
- **Auto-retrieve code:** `await auth().settings.setAutoRetrievedSmsCodeForPhoneNumber(testPhone, testCode)` to simulate instant verification with a test number.

---

## Part 7: Troubleshooting

| Issue | What to do |
|-------|------------|
| **"This app is not authorized to use Firebase Authentication"** | Add **SHA-1** and **SHA-256** (Part 2). Put **google-services.json** in `android/app/` and rebuild. |
| **Build fails about google-services** | Ensure root `build.gradle` has `classpath("com.google.gms:google-services:4.4.4")` and app `build.gradle` has `apply plugin: "com.google.gms.google-services"`. |
| **"Missing initial state"** after reCAPTCHA | User didn’t return to the app from the browser. On Firefox for Android, enable opening links in the native app. |
| **Invalid phone number** | Use E.164 (e.g. `+919876543210`). |
| **SMS not received** | Use **test phone numbers** for dev; check Firebase SMS quotas. |
| **Too many requests** | Firebase throttles per number. Use another number or a test number; wait before retrying. |
| **Invalid or expired OTP** | Only the latest OTP is valid after resend. Don’t mix verification IDs. |
| **"Error updating Phone"** when saving | (1) Enable Phone **without** adding a test number first, then Save. (2) Test numbers must be E.164 with **no spaces** (e.g. `+918867757777` not `+91 88677 57777`). (3) Ensure SHA-1 and SHA-256 are in Project settings → Your apps → Seva App. (4) Retry in incognito or another browser. |
| **Can't add phone number for testing** | (1) Use **fictitious** numbers only (e.g. `+16505553434`, `+911111111111`). Real phone numbers are rejected. (2) If that number was used to sign in before, delete the **User** in **Authentication → Users** (by that phone number), then add the number again under Phone numbers for testing. |
| **[auth/billing-not] BILLING_NOT_ENABLED** | New projects often require a **billing account** (Blaze) for Phone Auth. You are not charged if you stay within free quotas. Firebase: **Usage and billing** → **Modify plan** → **Blaze** → link billing. Or [Google Cloud Console](https://console.cloud.google.com/) → project **seva-3c9d2** → **Billing** → link. Set a budget alert (e.g. $0). Then retry. |
| **17006 / "This operation is not allowed"** (Android only) | Usually means the Phone provider isn’t enabled or the app isn’t recognized. (1) Confirm **Phone** is **Enabled** under Authentication → Sign-in method. (2) Ensure **SHA-1** and **SHA-256** are in Project settings → Your apps → Seva App. (3) Use a **recent Google services plugin**: in root `build.gradle`, `classpath("com.google.gms:google-services:4.4.4")`; in app `build.gradle`, `apply plugin: "com.google.gms.google-services"` at the end. (4) Re-download **google-services.json** and replace `android/app/google-services.json`, then **clean and rebuild**. (5) If you use **SMS region policy** (Authentication → Settings), ensure the region/country you’re testing from (e.g. India) is **allowed**; if it’s “Allow only selected”, add your region. |

---

## Rebuild after config changes

After changing SHAs or `google-services.json`:

```powershell
cd D:\karthik\seva_app\android
.\gradlew clean
cd ..
npm run android
```

---

## Overall checklist

**Add Firebase to Android**

- [ ] Firebase project created
- [ ] Android app registered with package name **`seva.App.v`** (Seva App)
- [ ] **google-services.json** downloaded and placed in **`android/app/`**
- [ ] Google services plugin in root and app **build.gradle** (already done in this repo)
- [ ] Project syncs and builds (`.\gradlew clean` then `npm run android`)

**Phone Auth**

- [ ] **SHA-1** and **SHA-256** added in Project settings → Android app
- [ ] Phone sign-in **enabled** (Authentication → Sign-in method → Phone)
- [ ] (Optional) Test phone numbers added
- [ ] Test sign-in with a test number or real number

After this, Firebase is added to your Android project and Phone Auth works with the existing React Native code (Play Integrity or reCAPTCHA as applicable).
