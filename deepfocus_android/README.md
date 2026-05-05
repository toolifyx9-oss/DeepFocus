# DeepFocus – Stay Locked, Stay Productive

A premium Android productivity tool designed to help you stay focused by blocking distracting apps.

## 🚀 Features
- **App Blocking**: Select apps to block during your focus sessions.
- **Overlay System**: A full-screen overlay that prevents you from using blocked apps.
- **Usage Tracking**: Monitor your daily screen time and focus progress.
- **Foreground Service**: Continuous monitoring even when the app is closed.
- **Boot Recovery**: Automatically restarts monitoring after device reboot.

## 🛠️ Setup Instructions

1. **Prerequisites**:
   - Android Studio (Hedgehog or later)
   - Android SDK 34
   - Kotlin 1.9.x

2. **Importing the Project**:
   - Open Android Studio.
   - Select "Open" and navigate to the `deepfocus_android` directory.
   - Wait for Gradle to sync.

3. **Permissions**:
   - The app requires **Usage Access** and **Overlay Permission**.
   - Upon first launch, the app will guide you to the system settings to enable these.

4. **Running the App**:
   - Connect an Android device or start an emulator (Android 10+ recommended).
   - Click the "Run" button in Android Studio.

## 🏗️ Architecture
- **Language**: Kotlin
- **Pattern**: MVVM (Model-View-ViewModel)
- **Database**: Room DB for local storage
- **Service**: Foreground Service for app monitoring
- **UI**: Material Design with a custom "Black + Red" premium theme.

## 🔒 Security
- **Strict Mode**: Prevents easy exit from focus sessions.
- **PIN Protection**: (Planned) Optional PIN to unlock focus mode early.

---
*Stay Focused. Stay Productive.*
