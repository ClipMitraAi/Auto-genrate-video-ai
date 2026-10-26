import 'package:flutter_tts/flutter_tts.dart';

class TtsService {
  static final TtsService _instance = TtsService._internal();
  factory TtsService() => _instance;
  TtsService._internal();

  final FlutterTts _flutterTts = FlutterTts();
  bool _isInitialized = false;

  Future<void> init() async {
    if (_isInitialized) return;
    try {
      await _flutterTts.setSpeechRate(0.5);
      await _flutterTts.setPitch(1.0);
      _isInitialized = true;
    } catch (e) {
      // Graceful fallback if TTS engine is disabled or on simulator
    }
  }

  Future<List<dynamic>> getVoices() async {
    try {
      final voices = await _flutterTts.getVoices;
      return voices is List ? voices : [];
    } catch (_) {
      return [];
    }
  }

  Future<List<dynamic>> getLanguages() async {
    try {
      final languages = await _flutterTts.getLanguages;
      return languages is List ? languages : ['en-US', 'hi-IN'];
    } catch (_) {
      return ['en-US', 'hi-IN'];
    }
  }

  Future<void> speak(
    String text, {
    String language = 'en-US',
    double rate = 0.5,
    double pitch = 1.0,
  }) async {
    await init();
    try {
      await _flutterTts.setLanguage(language);
      await _flutterTts.setSpeechRate(rate);
      await _flutterTts.setPitch(pitch);
      await _flutterTts.speak(text);
    } catch (e) {
      // Fallback
    }
  }

  Future<void> stop() async {
    try {
      await _flutterTts.stop();
    } catch (_) {}
  }
}
