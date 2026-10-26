import 'scene.dart';

class VideoProject {
  final String id;
  String title;
  String description;
  String aspectRatio; // '9:16', '16:9', '1:1'
  String language; // 'English', 'Hindi', 'Hinglish'
  DateTime createdAt;
  DateTime updatedAt;
  List<VideoScene> scenes;
  String? openingTitle;
  String? closingTitle;
  double backgroundMusicVolume;
  String? backgroundMusicName;

  VideoProject({
    required this.id,
    required this.title,
    this.description = '',
    this.aspectRatio = '9:16',
    this.language = 'English',
    required this.createdAt,
    required this.updatedAt,
    required this.scenes,
    this.openingTitle,
    this.closingTitle,
    this.backgroundMusicVolume = 0.25,
    this.backgroundMusicName,
  });

  double get totalDuration {
    double duration = scenes.fold(0.0, (sum, s) => sum + s.duration);
    if (openingTitle != null && openingTitle!.isNotEmpty) duration += 2.0;
    if (closingTitle != null && closingTitle!.isNotEmpty) duration += 2.5;
    return duration;
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'description': description,
        'aspectRatio': aspectRatio,
        'language': language,
        'createdAt': createdAt.toIso8601String(),
        'updatedAt': updatedAt.toIso8601String(),
        'scenes': scenes.map((s) => s.toJson()).toList(),
        'openingTitle': openingTitle,
        'closingTitle': closingTitle,
        'backgroundMusicVolume': backgroundMusicVolume,
        'backgroundMusicName': backgroundMusicName,
      };

  factory VideoProject.fromJson(Map<String, dynamic> json) => VideoProject(
        id: json['id'] as String? ?? 'proj-${DateTime.now().millisecondsSinceEpoch}',
        title: json['title'] as String? ?? 'Untitled Video',
        description: json['description'] as String? ?? '',
        aspectRatio: json['aspectRatio'] as String? ?? '9:16',
        language: json['language'] as String? ?? 'English',
        createdAt: DateTime.tryParse(json['createdAt'] as String? ?? '') ?? DateTime.now(),
        updatedAt: DateTime.tryParse(json['updatedAt'] as String? ?? '') ?? DateTime.now(),
        scenes: (json['scenes'] as List<dynamic>? ?? [])
            .map((e) => VideoScene.fromJson(e as Map<String, dynamic>))
            .toList(),
        openingTitle: json['openingTitle'] as String?,
        closingTitle: json['closingTitle'] as String?,
        backgroundMusicVolume: (json['backgroundMusicVolume'] as num?)?.toDouble() ?? 0.25,
        backgroundMusicName: json['backgroundMusicName'] as String?,
      );
}
