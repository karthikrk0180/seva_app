

## Technology Stack
- **Mobile**: React Native (TypeScript), Zustand, React Navigation
- **Backend / DB**: Java Spring Boot + PostgreSQL/MySQL
- **Integrations**: Firebase (Auth/FCM), Razorpay, Google Maps

Since this is a React Native app skeleton, you need to set up the Native Platforms (Android/iOS) to run it.

## 1. Install Dependencies
Open a terminal in `d:\karthik\seva_app` and run:
```bash
npm install
```

## 2. Initialize Native Folders (Important!)
Since the `android` and `ios` folders are platform-specific binaries that cannot be purely text-generated, you must generate them locally:

1.  **Rename** this current folder momentarily (e.g., `seva_app_src`).
2.  Run `npx react-native init SodeApp --version 0.73.1` in `d:\karthik`.
3.  **Delete** the `src`, `App.tsx`, etc. from the newly created `SodeApp`.
4.  **Copy** the `src` folder and config files (`tsconfig.json`, `babel.config.js`, `package.json`) from `seva_app_src` into `SodeApp`.
5.  Now you have a full runnable project.

## 3. Start the App
Once you have the native folders:

**Android:**
```bash
npm run android
```

**iOS (Mac only):**
```bash
cd ios && pod install && cd ..
npm run ios
```

**Metro Bundler (JS only):**
```bash
npm start
```
