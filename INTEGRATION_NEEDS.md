# Integration & Technology Stack

## Mobile App (Android + iOS)
- **Framework**: React Native (TypeScript)
- **Navigation**: `@react-navigation/bottom-tabs`
- **State Management**: Zustand (Current) / Redux Toolkit (Option)
- **Offline Storage**: AsyncStorage
- **Forms**: `react-hook-form` + `yup`
- **i18n**: `i18next` (English + Kannada)
- **Charts**: `victory-native` or `react-native-svg-charts`
- **Voice Search**: `react-native-voice` (Google STT / iOS Speech)

## Web Client (Public + Admin)
- **Framework**: React.js (TypeScript)
- **UI Lib**: MUI or Ant Design
- **Maps**: Google Maps JS SDK
- **Auth Guard**: Role-based routing

## Backend Layer (Core System)
- **Stack**: Java 21 + Spring Boot 4.0.2
- **Modules**:
  - Auth Service (OTP)
  - Content Service (news, history, gallery)
  - Events & Panchanga
  - Seva & Booking
  - Payments
  - Notifications
  - Admin APIs

## Database
- **Primary DB**: PostgreSQL (Preferred) / MySQL
- **Search**: OpenSearch / Elasticsearch
  - Artefacts search
  - Voice-to-text search
  - Publications

## Cloud & Infrastructure
- **Storage**: AWS S3 (Images, Videos, PDFs, Audio Pravachana)
- **Monitoring**: AWS CloudWatch, Spring Actuator
- **Analytics**: Firebase Analytics (Custom DB metrics)

## External Integrations
- **Authentication**: Firebase Auth (Phone OTP)
- **Payments**: Razorpay, UPI, Cards, NetBanking
- **Notifications**: Firebase Cloud Messaging (FCM)
- **Voice**: Google Speech-to-Text API

## Non-Functional Requirements
- **Performance**: <2s loads; Support 1000+ concurrent users.
- **Accessibility**: VoiceOver, High-contrast.
- **Privacy**: Explicit consent (DPDP Act).
