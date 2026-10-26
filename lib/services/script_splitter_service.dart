import '../models/scene.dart';

class ScriptSplitterService {
  /// Splits raw text (English, Hindi, or Hinglish) into coherent scene sentences.
  /// Handles punctuation marks like '.', '!', '?', Hindi purna viram '।', and line breaks.
  static List<String> splitScriptToSentences(String script) {
    if (script.trim().isEmpty) return [];

    final normalized = script
        .replaceAll('\r\n', '\n')
        .replaceAll('\r', '\n')
        .replaceAll('।', '. ')
        .replaceAll(';', '. ')
        .replaceAll('?', '? ')
        .replaceAll('!', '! ');

    final rawLines = normalized.split('\n');
    final List<String> sentences = [];

    for (var line in rawLines) {
      line = line.trim();
      if (line.isEmpty) continue;

      // Split line by sentence terminators
      final parts = line.split(RegExp(r'(?<=[.!?])\s+'));
      for (var part in parts) {
        final clean = part.trim();
        if (clean.isNotEmpty) {
          sentences.add(clean);
        }
      }
    }

    return sentences;
  }

  /// Automatically generates scene models from script sentences,
  /// estimating duration based on speech pacing (~2.5 to 3 words per second).
  static List<VideoScene> createScenesFromScript(
    String script, {
    double targetDurationSeconds = 30.0,
  }) {
    final sentences = splitScriptToSentences(script);
    if (sentences.isEmpty) {
      return [
        VideoScene(
          id: 'scene-1',
          order: 0,
          text: 'Welcome to your new video project.',
          duration: 5.0,
        )
      ];
    }

    // Calculate word counts for proportional time allocation
    final wordCounts = sentences.map((s) => s.split(RegExp(r'\s+')).length).toList();
    final totalWords = wordCounts.fold<int>(0, (sum, c) => sum + c);

    final List<VideoScene> scenes = [];
    for (int i = 0; i < sentences.length; i++) {
      final sentence = sentences[i];
      final words = wordCounts[i];
      // Allocate duration proportionally, clamped between 3.0s and 8.0s
      double duration = (totalWords > 0)
          ? (words / totalWords) * targetDurationSeconds
          : targetDurationSeconds / sentences.length;

      if (duration < 3.0) duration = 3.0;
      if (duration > 9.0) duration = 9.0;

      // Extract basic keyword for scene matching
      final cleanWords = sentence
          .replaceAll(RegExp(r'[^a-zA-Z0-9\s]'), '')
          .split(RegExp(r'\s+'))
          .where((w) => w.length > 3)
          .toList();
      final keyword = cleanWords.take(3).join(' ');

      scenes.add(VideoScene(
        id: 'scene-${i + 1}',
        order: i,
        text: sentence,
        visualKeyword: keyword.isNotEmpty ? keyword : 'cinematic landscape',
        duration: double.parse(duration.toStringAsFixed(1)),
        mediaType: 'gradient',
        transition: i % 2 == 0 ? 'fade' : 'zoom',
      ));
    }

    return scenes;
  }
}
