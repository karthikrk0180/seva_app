# Required npm Packages (Used in Codebase)

All packages used in `src/` are listed below. They must be in `package.json` (dependencies or devDependencies).

## Dependencies (runtime)

| Package | Used In | In package.json |
|---------|---------|-----------------|
| `@hookform/resolvers` | LoginScreen, RoomBookingScreen, SevaBookingScreen | ✓ |
| `@react-native-async-storage/async-storage` | storage.ts (commented) | ✓ |
| `@react-native-firebase/app` | Firebase | ✓ |
| `@react-native-firebase/auth` | firebase.service.ts | ✓ |
| `@react-native-firebase/messaging` | firebase.service.ts (commented) | ✓ |
| `@react-native-voice/voice` | voice.service.ts | ✓ |
| `@react-navigation/bottom-tabs` | BottomTabs.tsx | ✓ |
| `@react-navigation/native` | Multiple screens | ✓ |
| `@react-navigation/native-stack` | RootNavigator, AuthStack, screens | ✓ |
| `date-fns` | RoomBookingScreen.tsx, utils/date.ts | ✓ (added) |
| `i18next` | i18n/index.ts | ✓ |
| `react` | All components | ✓ |
| `react-hook-form` | LoginScreen, RoomBookingScreen, SevaBookingScreen | ✓ |
| `react-i18next` | i18n/index.ts | ✓ |
| `react-native` | All screens | ✓ |
| `react-native-safe-area-context` | Multiple screens | ✓ |
| `react-native-screens` | Navigation | ✓ |
| `react-native-svg` | (if used) | ✓ |
| `react-native-vector-icons` | VoiceSearchModal (commented) | ✓ |
| `victory-native` | SimpleChart.tsx | ✓ |
| `yup` | LoginScreen, RoomBookingScreen, SevaBookingScreen | ✓ |
| `zustand` | Stores, voice.service.ts | ✓ |

## After adding a new package

1. Run: `npm install`
2. Restart Metro with cache clear: `npm start -- --reset-cache`
3. Run app: `npm run android`

## If "Unable to resolve module X" appears

1. Add the package: `npm install <package-name>`
2. Restart Metro: `Ctrl+C` then `npm start -- --reset-cache`
3. Run app again: `npm run android`
