import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  Github,
  CheckCircle2,
  Copy,
  Terminal,
  ShieldCheck,
  FileCode,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import JSZip from 'jszip';

export const ApkBuilderGuide: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const workflowYaml = `name: Vivek AI Video Studio - Android APK Build

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build-apk:
    name: Build Android APK
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.29.0'
          channel: 'stable'
      - run: flutter pub get
      - run: flutter analyze --no-fatal-infos
      - run: flutter test
      - run: flutter build apk --debug
      - uses: actions/upload-artifact@v4
        with:
          name: Vivek-AI-Video-Studio-debug.apk
          path: build/app/outputs/flutter-apk/app-debug.apk`;

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(workflowYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // One-click full Flutter project ZIP downloader powered by JSZip
  const handleDownloadProjectZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Workflows
      zip.file('.github/workflows/android-apk.yml', workflowYaml);

      // Pubspec & config
      zip.file(
        'pubspec.yaml',
        `name: vivek_ai_video_studio
description: "Vivek AI Video Studio - Free Android APK"
version: 1.0.0+1
environment:
  sdk: '>=3.2.0 <4.0.0'
  flutter: '>=3.16.0'
dependencies:
  flutter:
    sdk: flutter
  flutter_tts: ^4.2.2
  audioplayers: ^6.1.0
  shared_preferences: ^2.3.2
  path_provider: ^2.1.4
  file_picker: ^8.1.4
  share_plus: ^10.1.2
  permission_handler: ^11.3.1
  google_fonts: ^6.2.1
dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0
flutter:
  uses-material-design: true`
      );

      zip.file(
        'analysis_options.yaml',
        `include: package:flutter_lints/flutter.yaml\nlinter:\n  rules:\n    prefer_const_constructors: true\n`
      );

      zip.file(
        'README.md',
        `# Vivek AI Video Studio\nFree Android APK buildable with GitHub Actions.\nArtifact: Vivek-AI-Video-Studio-debug.apk`
      );

      // Dart source files
      const lib = zip.folder('lib');
      lib?.file(
        'main.dart',
        `import 'package:flutter/material.dart';\nimport 'app.dart';\nvoid main() {\n  WidgetsFlutterBinding.ensureInitialized();\n  runApp(const VivekVideoStudioApp());\n}`
      );

      lib?.file(
        'app.dart',
        `import 'package:flutter/material.dart';\nimport 'screens/home_screen.dart';\nclass VivekVideoStudioApp extends StatelessWidget {\n  const VivekVideoStudioApp({super.key});\n  @override\n  Widget build(BuildContext context) {\n    return MaterialApp(\n      title: 'Vivek AI Video Studio',\n      themeMode: ThemeMode.dark,\n      theme: ThemeData.dark(useMaterial3: true),\n      home: const HomeScreen(),\n    );\n  }\n}`
      );

      // Generate blob
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vivek-ai-video-studio-flutter-source.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to bundle project ZIP.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header */}
      <div className="rounded-xl border border-sky-950/80 bg-gradient-to-br from-slate-900 via-sky-950/30 to-slate-950 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
          <Smartphone className="h-4 w-4" />
          <span>Android APK Automation Hub</span>
          <span aria-hidden="true">·</span>
          <span>No Computer Required</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
          Download Your Free Android APK File
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          You do not need a laptop or Android Studio to build this application. With our automated GitHub Actions workflow, GitHub compiles <span className="font-mono text-sky-300">Vivek-AI-Video-Studio-debug.apk</span> in the cloud and provides a direct download link right to your phone!
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            disabled={isZipping}
            onClick={handleDownloadProjectZip}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-indigo-500 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{isZipping ? 'Bundling Source Code...' : 'Download Full Flutter Source Code (ZIP)'}</span>
          </button>
        </div>
      </div>

      {/* 3 Step Walkthrough */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-400 font-mono">
              01
            </span>
            <Github className="h-4 w-4 text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Fork or Push to GitHub</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Upload this codebase to a repository on GitHub from your phone browser or desktop. All Flutter files and workflow configs are already in place.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-400 font-mono">
              02
            </span>
            <Terminal className="h-4 w-4 text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Run GitHub Actions Workflow</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Go to the <strong>Actions</strong> tab in your repository and tap <strong>"Run workflow"</strong>. The cloud runner builds the APK in ~4-5 minutes.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400 font-mono">
              03
            </span>
            <Smartphone className="h-4 w-4 text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Download APK & Install</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Download the output artifact named <span className="font-mono text-emerald-300">Vivek-AI-Video-Studio-debug.apk</span> directly to your Android device and install it!
          </p>
        </div>
      </div>

      {/* GitHub Actions YAML Preview */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="h-4 w-4 text-sky-400" />
            <span className="text-xs font-bold text-white">
              .github/workflows/android-apk.yml
            </span>
          </div>

          <button
            onClick={handleCopyYaml}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy YAML</span>
              </>
            )}
          </button>
        </div>

        <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 font-mono text-[11px] leading-relaxed text-slate-300 border border-slate-800/80">
          {workflowYaml}
        </pre>
      </div>
    </div>
  );
};
