import 'package:flutter/material.dart';
import '../services/tts_service.dart';

class VoiceStudioScreen extends StatefulWidget {
  const VoiceStudioScreen({super.key});

  @override
  State<VoiceStudioScreen> createState() => _VoiceStudioScreenState();
}

class _VoiceStudioScreenState extends State<VoiceStudioScreen> {
  final TextEditingController _textController = TextEditingController(
    text: 'नमस्ते! विवेक एआई वीडियो स्टूडियो में आपका स्वागत है। Welcome to Vivek AI Video Studio.',
  );
  String _selectedLang = 'hi-IN';
  double _speechRate = 0.5;
  double _pitch = 1.0;
  bool _isPlaying = false;

  void _speak() async {
    final text = _textController.text.trim();
    if (text.isEmpty) return;

    setState(() => _isPlaying = true);
    await TtsService().speak(
      text,
      language: _selectedLang,
      rate: _speechRate,
      pitch: _pitch,
    );
    setState(() => _isPlaying = false);
  }

  void _stop() async {
    await TtsService().stop();
    setState(() => _isPlaying = false);
  }

  @override
  void dispose() {
    _textController.dispose();
    TtsService().stop();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Voice Studio', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
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
                const Text('Android Native Text-to-Speech (Free & Offline)',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white)),
                const SizedBox(height: 4),
                const Text(
                  'Uses high-performance on-device TTS engine. Works 100% offline with zero cloud charges.',
                  style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          DropdownButtonFormField<String>(
            value: _selectedLang,
            decoration: InputDecoration(
              labelText: 'Voice Language',
              filled: true,
              fillColor: const Color(0xFF0F172A),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
            ),
            items: const [
              DropdownMenuItem(value: 'hi-IN', child: Text('Hindi (India) - हिंदी')),
              DropdownMenuItem(value: 'en-IN', child: Text('English (India)')),
              DropdownMenuItem(value: 'en-US', child: Text('English (United States)')),
              DropdownMenuItem(value: 'en-GB', child: Text('English (United Kingdom)')),
            ],
            onChanged: (val) => setState(() => _selectedLang = val!),
          ),
          const SizedBox(height: 16),

          // Speech Controls
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: const Color(0xFF1E293B)),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    const Text('Speech Rate', style: TextStyle(fontSize: 13, color: Color(0xFF94A3B8))),
                    Text('${(_speechRate * 2).toStringAsFixed(1)}x', style: const TextStyle(fontWeight: FontWeight.bold)),
                  ],
                ),
                Slider(
                  value: _speechRate,
                  min: 0.1,
                  max: 1.0,
                  activeColor: const Color(0xFF38BDF8),
                  onChanged: (v) => setState(() => _speechRate = v),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    const Text('Voice Pitch', style: TextStyle(fontSize: 13, color: Color(0xFF94A3B8))),
                    Text(_pitch.toStringAsFixed(1), style: const TextStyle(fontWeight: FontWeight.bold)),
                  ],
                ),
                Slider(
                  value: _pitch,
                  min: 0.5,
                  max: 2.0,
                  activeColor: const Color(0xFF6366F1),
                  onChanged: (v) => setState(() => _pitch = v),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          TextField(
            controller: _textController,
            maxLines: 5,
            decoration: InputDecoration(
              labelText: 'Voiceover Text',
              filled: true,
              fillColor: const Color(0xFF0F172A),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
            ),
          ),
          const SizedBox(height: 20),

          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: _speak,
                  icon: const Icon(Icons.volume_up, color: Colors.white),
                  label: const Text('Preview Voice', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6366F1),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              OutlinedButton.icon(
                onPressed: _stop,
                icon: const Icon(Icons.stop),
                label: const Text('Stop'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 18),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
