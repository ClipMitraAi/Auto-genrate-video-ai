# Vivek AI Video Studio — Free Android APK

> **Transform Hindi & English Scripts into Professional Faceless Videos with Offline Text-to-Speech, Auto-Subtitles, Smart Storyboards, and Automated GitHub Actions APK Builds.**

---

## 🌟 Overview

**Vivek AI Video Studio** is an open-source, full-stack video creation platform designed for Android devices and modern web browsers. It provides functionality comparable to modern script-to-video platforms with original branding, zero subscription gates for local features, and an automated GitHub Actions pipeline that builds a downloadable Android APK directly in the cloud.

### ✨ Key Capabilities
- **Script to Video Engine**: Enter or paste scripts in **Hindi**, **English**, or **Hinglish**. Split automatically into timed scenes with pacing calculations.
- **Smart Scene Matching**: Automatically extracts keywords, visual prompts, and pairs scenes with cinematic backgrounds or local images.
- **Faceless Video Maker**: Pre-built templates for Motivational Reels, Space & Science Facts, Hindi Quotes, YouTube Tech Explainers, and Instagram Shorts.
- **Offline Text-to-Speech**: Full Android native speech synthesis engine for Hindi (`hi-IN`) and English (`en-IN`, `en-US`), with pitch, rate, and preview controls. Zero cloud charges.
- **Auto Subtitles & SRT Studio**: Sentence-by-sentence subtitle timing, customizable font styling, colors, background boxes, outlines, and instant `.srt` export/import.
- **Timeline & Canvas Video Renderer**: Real 720p/1080p video rendering with smooth Ken Burns camera pan/zoom motion, crossfades, burned-in subtitles, and Web Audio mixing.
- **Audio to Video**: Synthesize background soundtracks (Cinematic, Lo-Fi, Ambient, Epic Pulsar) or import custom MP3/WAV narration.
- **Project Manager**: Local storage, autosave, backup/restore, duplicate, and export.
- **Automated GitHub Actions APK Build**: Generates `Vivek-AI-Video-Studio-debug.apk` directly via GitHub Actions without requiring a desktop computer!

---

## 📱 How to Build & Download the Android APK from Your Phone (No Computer Needed)

You can build and install the APK entirely from an Android phone using GitHub Actions:

### Step 1: Fork or Push this Repository to GitHub
1. Open [GitHub.com](https://github.com) on your Android phone's web browser.
2. Sign in or create a free GitHub account.
3. Create a new repository named `vivek-ai-video-studio` and push this codebase (or use the one-click **"Download Full Project ZIP"** button inside the Studio web app and upload it).

### Step 2: Run the GitHub Actions Build Workflow
1. Navigate to the **Actions** tab in your GitHub repository.
2. Under "Workflows", select **Vivek AI Video Studio - Android APK Build**.
3. Tap the **"Run workflow"** button, select branch `main`, and tap **"Run workflow"**.
4. GitHub Actions will allocate an Ubuntu cloud runner, install Java 17 and Flutter 3.29, run unit tests, and compile the Android APK in ~4-6 minutes.

### Step 3: Download and Install the APK
1. When the workflow run completes with a green checkmark, tap on it.
2. Scroll to the **Artifacts** section at the bottom.
3. Tap on **`Vivek-AI-Video-Studio-debug.apk`** to download it to your Android phone.
4. Open the downloaded `.zip` or `.apk` on your phone and tap **Install** (enable "Install unknown apps" in Android Settings if prompted).

---

## 🛠 Local Flutter Development

### Prerequisites
- Flutter SDK `>=3.16.0` (Recommended: `3.29.0`)
- Android Studio / Android SDK (API 34, minimum API 24)
- Java JDK 17

### Commands
```bash
# Clone the repository
git clone https://github.com/your-username/vivek-ai-video-studio.git
cd vivek-ai-video-studio

# Install dependencies
flutter pub get

# Run static analysis
flutter analyze

# Run unit tests
flutter test

# Run on connected Android device or emulator
flutter run

# Build the debug APK locally
flutter build apk --debug

# The generated APK is at:
# build/app/outputs/flutter-apk/app-debug.apk
```

---

## 🌐 Web Studio & Full-Stack API Server

In addition to the Flutter Android APK, this repository includes an interactive full-stack Web Studio in React 19, TypeScript, Express, and Tailwind CSS.

### Run Web Studio Locally:
```bash
npm install
npm run dev
```
The Web Studio will be accessible at `http://localhost:3000`.

---

## 🔒 Privacy & Free-First Architecture
- **Offline by Default**: All scripts, scenes, and projects remain stored locally on your device.
- **No Secret Leaks**: Optional AI enhancements (such as Google Gemini 3.8 Flash for AI script generation or neural TTS) use server-side proxies and never expose API keys to client bundles.
- **No Watermarks**: Videos produced by Vivek AI Video Studio do not inject intrusive third-party watermarks.

---

## 📄 License
This project is licensed under the Apache License 2.0. Open-source, freely forkable, and redistributable.
