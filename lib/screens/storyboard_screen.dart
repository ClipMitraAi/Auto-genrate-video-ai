import 'package:flutter/material.dart';
import '../models/project.dart';
import '../models/scene.dart';
import '../services/storage_service.dart';
import 'video_render_screen.dart';

class StoryboardScreen extends StatefulWidget {
  final VideoProject project;
  const StoryboardScreen({super.key, required this.project});

  @override
  State<StoryboardScreen> createState() => _StoryboardScreenState();
}

class _StoryboardScreenState extends State<StoryboardScreen> {
  late List<VideoScene> _scenes;

  @override
  void initState() {
    super.initState();
    _scenes = List.from(widget.project.scenes);
  }

  void _saveChanges() {
    widget.project.scenes = _scenes;
    StorageService.saveProject(widget.project);
  }

  void _addNewScene() {
    setState(() {
      _scenes.add(VideoScene(
        id: 'scene-${DateTime.now().millisecondsSinceEpoch}',
        order: _scenes.length,
        text: 'Add narration text here.',
        visualKeyword: 'cinematic scene',
        duration: 5.0,
      ));
    });
    _saveChanges();
  }

  void _editScene(int index) {
    final scene = _scenes[index];
    final textCtrl = TextEditingController(text: scene.text);
    final keywordCtrl = TextEditingController(text: scene.visualKeyword);
    double duration = scene.duration;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF0F172A),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(16))),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) => Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 16,
            left: 16,
            right: 16,
            top: 16,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Edit Scene #${index + 1}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 12),
              TextField(
                controller: textCtrl,
                maxLines: 3,
                decoration: const InputDecoration(labelText: 'Scene Voiceover / Subtitle', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: keywordCtrl,
                decoration: const InputDecoration(labelText: 'Visual Keyword / Prompt', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  const Text('Scene Duration'),
                  Text('${duration.toStringAsFixed(1)}s', style: const TextStyle(fontWeight: FontWeight.bold)),
                ],
              ),
              Slider(
                value: duration,
                min: 2.0,
                max: 15.0,
                divisions: 26,
                onChanged: (v) => setSheetState(() => duration = v),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(ctx),
                      child: const Text('Cancel'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6366F1)),
                      onPressed: () {
                        setState(() {
                          scene.text = textCtrl.text.trim();
                          scene.visualKeyword = keywordCtrl.text.trim();
                          scene.duration = double.parse(duration.toStringAsFixed(1));
                        });
                        _saveChanges();
                        Navigator.pop(ctx);
                      },
                      child: const Text('Save Scene', style: TextStyle(color: Colors.white)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final totalDuration = _scenes.fold(0.0, (acc, s) => acc + s.duration);

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Storyboard', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
            Text(
              '${_scenes.length} scenes · ${totalDuration.toStringAsFixed(1)}s total',
              style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
            ),
          ],
        ),
        actions: [
          TextButton.icon(
            onPressed: () {
              _saveChanges();
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => VideoRenderScreen(project: widget.project)),
              );
            },
            icon: const Icon(Icons.movie_outlined, color: Color(0xFF38BDF8), size: 18),
            label: const Text('Render', style: TextStyle(color: Color(0xFF38BDF8), fontWeight: FontWeight.bold)),
          ),
        ],
      ),
      body: ReorderableListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _scenes.length,
        onReorder: (oldIndex, newIndex) {
          setState(() {
            if (newIndex > oldIndex) newIndex -= 1;
            final item = _scenes.removeAt(oldIndex);
            _scenes.insert(newIndex, item);
          });
          _saveChanges();
        },
        itemBuilder: (context, idx) {
          final scene = _scenes[idx];
          return Card(
            key: ValueKey(scene.id),
            color: const Color(0xFF0F172A),
            margin: const EdgeInsets.only(bottom: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: const Border.all(color: Color(0xFF1E293B)),
            ),
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF1E1B4B),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          'Scene #${idx + 1} · ${scene.duration.toStringAsFixed(1)}s',
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF818CF8)),
                        ),
                      ),
                      Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.edit_outlined, size: 18, color: Color(0xFF94A3B8)),
                            onPressed: () => _editScene(idx),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete_outline, size: 18, color: Color(0xFFEF4444)),
                            onPressed: () {
                              setState(() {
                                _scenes.removeAt(idx);
                              });
                              _saveChanges();
                            },
                          ),
                          const Icon(Icons.drag_handle, color: Color(0xFF475569)),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    scene.text,
                    style: const TextStyle(fontSize: 14, height: 1.4),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF030712),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: const Color(0xFF1E293B)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.image_search, size: 14, color: Color(0xFF38BDF8)),
                        const SizedBox(width: 6),
                        Text(
                          scene.visualKeyword.isNotEmpty ? scene.visualKeyword : 'Default visual',
                          style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _addNewScene,
        backgroundColor: const Color(0xFF6366F1),
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Add Scene', style: TextStyle(color: Colors.white)),
      ),
    );
  }
}
