import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings & Info', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF1E293B)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.verified_outlined, color: Color(0xFF10B981)),
                    SizedBox(width: 8),
                    Text('Vivek AI Video Studio', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  ],
                ),
                const SizedBox(height: 8),
                const Text(
                  'Version 1.0.0 (Debug APK build)\nFree core offline features. Built with Flutter and automated by GitHub Actions.',
                  style: TextStyle(fontSize: 13, color: Color(0xFF94A3B8), height: 1.5),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          const Text('Configuration & Policies', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
          const SizedBox(height: 8),

          ListTile(
            tileColor: const Color(0xFF0F172A),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            leading: const Icon(Icons.offline_bolt_outlined, color: Color(0xFF38BDF8)),
            title: const Text('Offline-First Mode', style: TextStyle(fontSize: 14)),
            subtitle: const Text('Scripts, TTS, and video rendering run on-device without cloud costs.', style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
          ),
          const SizedBox(height: 8),

          ListTile(
            tileColor: const Color(0xFF0F172A),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            leading: const Icon(Icons.security_outlined, color: Color(0xFFA855F7)),
            title: const Text('Privacy & Local Media', style: TextStyle(fontSize: 14)),
            subtitle: const Text('No user scripts or audio are uploaded without explicit user consent.', style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
          ),
          const SizedBox(height: 8),

          ListTile(
            tileColor: const Color(0xFF0F172A),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            leading: const Icon(Icons.build_circle_outlined, color: Color(0xFF6366F1)),
            title: const Text('GitHub Actions Workflow', style: TextStyle(fontSize: 14)),
            subtitle: const Text('Workflow: .github/workflows/android-apk.yml outputs Vivek-AI-Video-Studio-debug.apk', style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
          ),
        ],
      ),
    );
  }
}
