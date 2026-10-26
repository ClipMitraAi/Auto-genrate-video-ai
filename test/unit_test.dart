import 'package:flutter_test/flutter_test.dart';
import 'package:vivek_ai_video_studio/models/project.dart';
import 'package:vivek_ai_video_studio/models/scene.dart';
import 'package:vivek_ai_video_studio/services/script_splitter_service.dart';

void main() {
  group('ScriptSplitterService Unit Tests', () {
    test('Splits English multi-sentence script properly', () {
      const script = 'Never give up on your dreams. Every day is a fresh opportunity! Keep pushing forward.';
      final sentences = ScriptSplitterService.splitScriptToSentences(script);

      expect(sentences.length, 3);
      expect(sentences[0], 'Never give up on your dreams.');
      expect(sentences[1], 'Every day is a fresh opportunity!');
      expect(sentences[2], 'Keep pushing forward.');
    });

    test('Splits Hindi text with purna viram ।', () {
      const script = 'सफलता एक दिन में नहीं मिलती। मेहनत हमेशा रंग लाती है।';
      final sentences = ScriptSplitterService.splitScriptToSentences(script);

      expect(sentences.length, 2);
    });

    test('Creates scenes with estimated duration', () {
      const script = 'First sentence here. Second longer sentence that describes the action clearly.';
      final scenes = ScriptSplitterService.createScenesFromScript(script, targetDurationSeconds: 20.0);

      expect(scenes.length, 2);
      expect(scenes.first.duration, greaterThanOrEqualTo(3.0));
      expect(scenes.first.visualKeyword.isNotEmpty, true);
    });
  });

  group('VideoProject Model Tests', () {
    test('Serializes and deserializes project correctly', () {
      final now = DateTime.now();
      final project = VideoProject(
        id: 'test-123',
        title: 'Master Motivation Video',
        createdAt: now,
        updatedAt: now,
        scenes: [
          VideoScene(
            id: 's1',
            order: 0,
            text: 'Hello world',
            duration: 4.5,
          ),
          VideoScene(
            id: 's2',
            order: 1,
            text: 'Keep coding',
            duration: 5.5,
          ),
        ],
        openingTitle: 'Start',
      );

      final json = project.toJson();
      final restored = VideoProject.fromJson(json);

      expect(restored.id, 'test-123');
      expect(restored.title, 'Master Motivation Video');
      expect(restored.scenes.length, 2);
      expect(restored.totalDuration, closeTo(12.0, 0.1)); // 4.5 + 5.5 + 2.0 opening
    });
  });
}
