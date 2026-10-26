class VideoScene {
  final String id;
  int order;
  String text;
  String visualKeyword;
  String mediaPath;
  String mediaType; // 'image', 'video', 'gradient'
  double duration; // seconds
  String transition; // 'fade', 'slide', 'zoom', 'none'

  VideoScene({
    required this.id,
    required this.order,
    required this.text,
    this.visualKeyword = '',
    this.mediaPath = '',
    this.mediaType = 'gradient',
    this.duration = 5.0,
    this.transition = 'fade',
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'order': order,
        'text': text,
        'visualKeyword': visualKeyword,
        'mediaPath': mediaPath,
        'mediaType': mediaType,
        'duration': duration,
        'transition': transition,
      };

  factory VideoScene.fromJson(Map<String, dynamic> json) => VideoScene(
        id: json['id'] as String? ?? 'scene-${DateTime.now().millisecondsSinceEpoch}',
        order: json['order'] as int? ?? 0,
        text: json['text'] as String? ?? '',
        visualKeyword: json['visualKeyword'] as String? ?? '',
        mediaPath: json['mediaPath'] as String? ?? '',
        mediaType: json['mediaType'] as String? ?? 'gradient',
        duration: (json['duration'] as num?)?.toDouble() ?? 5.0,
        transition: json['transition'] as String? ?? 'fade',
      );
}
