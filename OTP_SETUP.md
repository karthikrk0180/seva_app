# OTP (Phone Auth) Setup Guide

Your app uses **Firebase Phone Authentication** for OTP. Follow these steps to enable real OTP.

---

## 1. Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/) and select your project (or create one).
2. In the left menu: **Build → Authentication**.
3. Open the **Sign-in method** tab.
4. Click **Phone** and **Enable** it, then **Save**.

---

## 2. Android: Add SHA Keys to Firebase

Phone Auth on Android requires your app’s SHA-1 and SHA-256.

### Get debug SHA-1 and SHA-256

**Windows (PowerShell or CMD):**
```bat
cd D:\karthik\seva_app\android
.\gradlew signingReport
```

Look for **Variant: debug** and copy:
- **SHA-1**
- **SHA-256**

**Or using keytool (if Java is installed):**
```bat
keytool -list -v -keystore android\app\debug.keystore -alias androiddebugkey -storepass android -keypass android
```

### Add SHAs in Firebase

1. Firebase Console → **Project settings** (gear icon).
2. Under **Your apps**, select your **Android app** (package name: `com.sodeapp`).
3. Click **Add fingerprint**.
4. Paste **SHA-1**, save.
5. Add **SHA-256** the same way.

---

## 3. google-services.json

1. Firebase Console → **Project settings** → **Your apps**.
2. Download **google-services.json** for your Android app.
3. Put it in:
   ```
   D:\karthik\seva_app\android\app\google-services.json
   ```
4. If you already have one, replace it so it includes the correct package name and SHAs.

---

## 4. App Code (Already Done)

- **Auth service** is wired to Firebase Phone Auth:
  - `loginWithPhone(phone)` sends OTP via Firebase.
  - `verifyOtp(verificationId, code)` confirms the OTP and signs the user in.
- **LoginScreen** calls `authService.loginWithPhone('+91' + phone)` and navigates to OTP screen.
- **OtpScreen** calls `authStore.login(phoneNumber, otp, verificationId)` to verify.

No extra code changes are needed for basic OTP flow.

---

## 5. Phone Number Format

- Use **E.164**: country code + number, no spaces (e.g. `+919876543210`).
- Your app already prefixes Indian numbers with `+91` on the Login screen.

---

## 6. Testing OTP

### Option A: Real phone

- Use a real mobile number.
- You will receive an SMS with the OTP from Firebase.

### Option B: Test phone numbers (no SMS)

1. Firebase Console → **Authentication** → **Sign-in method** → **Phone**.
2. Open **Phone numbers for testing**.
3. Add a number, e.g. `+91 9876543210`, and a **Verification code**, e.g. `123456`.
4. In the app, use that number and enter the code you set (e.g. `123456`).

---

## 7. Resend OTP

- OtpScreen has a **Resend OTP** button after the 30s countdown.
- It calls `authService.loginWithPhone(phoneNumber)` again.
- **Note:** After switching to real Firebase, the in-memory `confirmationResult` is replaced on resend; the new code from the latest SMS must be used.

---

## 8. Troubleshooting

| Issue | What to do |
|-------|------------|
| "This app is not authorized to use Firebase Authentication" | Add correct SHA-1/SHA-256 in Firebase Console (step 2). Re-download `google-services.json` if needed. |
| "Invalid phone number" | Use E.164 format, e.g. `+919876543210`. |
| No SMS received | Check Firebase quota; use test phone numbers (step 6B) for development. |
| "No verification in progress" | User went to OTP screen without completing "Send OTP" on Login, or session expired. Send OTP again from Login. |

---

## 9. Quick Checklist

- [ ] Firebase project created
- [ ] Phone sign-in method enabled in Authentication
- [ ] SHA-1 and SHA-256 added in Project settings → Android app
- [ ] `google-services.json` in `android/app/`
- [ ] App rebuilt after adding SHAs: `cd android && .\gradlew clean` then `npm run android`
- [ ] Test with a real number or a test phone number in Firebase

After this, OTP send and verify will work with Firebase.
