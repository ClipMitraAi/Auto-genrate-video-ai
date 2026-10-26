import 'package:flutter/material.dart';
import '../models/project.dart';
import '../services/script_splitter_service.dart';
import '../services/storage_service.dart';
import 'storyboard_screen.dart';

class ScriptEditorScreen extends StatefulWidget {
  final VideoProject project;
  const ScriptEditorScreen({super.key, required this.project});

  @override
  State<ScriptEditorScreen> createState() => _ScriptEditorScreenState();
}

class _ScriptEditorScreenState extends State<ScriptEditorScreen> {
  late TextEditingController _titleController;
  late TextEditingController _scriptController;
  String _selectedLanguage = 'English';
  String _selectedAspectRatio = '9:16';
  double _targetDuration = 30.0;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.project.title);
    final initialScript = widget.project.scenes.map((s) => s.text).join('\n\n');
    _scriptController = TextEditingController(
      text: initialScript.isNotEmpty
          ? initialScript
          : 'Most people quit right before the breakthrough happens.\nDiscipline is choosing between what you want now and what you want most.\nWhen motivation fades, your daily routine takes over.\nPut in the silent work. Let your results make the noise.',
    );
    _selectedLanguage = widget.project.language;
    _selectedAspectRatio = widget.project.aspectRatio;
  }

  @override
  void dispose() {
    _titleController.dispose();
    _scriptController.dispose();
    super.dispose();
  }

  void _generateStoryboard() {
    final script = _scriptController.text.trim();
    if (script.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter or paste your script first.')),
      );
      return;
    }

    widget.project.title = _titleController.text.trim().isNotEmpty
        ? _titleController.text.trim()
        : 'Untitled Video';
    widget.project.language = _selectedLanguage;
    widget.project.aspectRatio = _selectedAspectRatio;

    final scenes = ScriptSplitterService.createScenesFromScript(
      script,
      targetDurationSeconds: _targetDuration,
    );
    widget.project.scenes = scenes;

    StorageService.saveProject(widget.project);

    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => StoryboardScreen(project: widget.project)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Script to Video', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
        actions: [
          TextButton.icon(
            onPressed: _generateStoryboard,
            icon: const Icon(Icons.auto_awesome, color: Color(0xFF38BDF8), size: 18),
            label: const Text('Storyboard', style: TextStyle(color: Color(0xFF38BDF8), fontWeight: FontWeight.bold)),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Project Title
          TextField(
            controller: _titleController,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            decoration: InputDecoration(
              labelText: 'Project Title',
              filled: true,
              fillColor: const Color(0xFF0F172A),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF1E293B))),
            ),
          ),
          const SizedBox(height: 16),

          // Settings Row: Language & Aspect Ratio
          Row(
            children: [
              Expanded(
                child: DropdownButtonFormField<String>(
                  value: _selectedLanguage,
                  decoration: InputDecoration(
                    labelText: 'Language',
                    filled: true,
                    fillColor: const Color(0xFF0F172A),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  items: const [
                    DropdownMenuItem(value: 'English', child: Text('English')),
                    DropdownMenuItem(value: 'Hindi', child: Text('हिंदी (Hindi)')),
                    DropdownMenuItem(value: 'Hinglish', child: Text('Hinglish')),
                  ],
                  onChanged: (val) => setState(() => _selectedLanguage = val!),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: DropdownButtonFormField<String>(
                  value: _selectedAspectRatio,
                  decoration: InputDecoration(
                    labelText: 'Aspect Ratio',
                    filled: true,
                    fillColor: const Color(0xFF0F172A),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  items: const [
                    DropdownMenuItem(value: '9:16', child: Text('9:16 (Shorts/Reels)')),
                    DropdownMenuItem(value: '16:9', child: Text('16:9 (YouTube)')),
                    DropdownMenuItem(value: '1:1', child: Text('1:1 (Square)')),
                  ],
                  onChanged: (val) => setState(() => _selectedAspectRatio = val!),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Target Duration Slider
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: const Color(0xFF1E293B)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    const Text('Target Video Duration', style: TextStyle(fontSize: 13, color: Color(0xFF94A3B8))),
                    Text('${_targetDuration.toInt()} seconds', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF38BDF8))),
                  ],
                ),
                Slider(
                  value: _targetDuration,
                  min: 15,
                  max: 120,
                  divisions: 21,
                  activeColor: const Color(0xFF6366F1),
                  onChanged: (val) => setState(() => _targetDuration = val),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Script Editor Text Area
          const Text('Voiceover Script (Sentences will become video scenes):', style: TextStyle(fontSize: 13, color: Color(0xFF94A3B8))),
          const SizedBox(height: 8),
          TextField(
            controller: _scriptController,
            maxLines: 10,
            style: const TextStyle(fontSize: 14, height: 1.5),
            decoration: InputDecoration(
              hintText: 'Enter your script here...\nEach sentence will automatically split into a storyboard scene with keywords.',
              filled: true,
              fillColor: const Color(0xFF0F172A),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF1E293B))),
            ),
          ),
          const SizedBox(height: 20),

          // Bottom Action
          ElevatedButton.icon(
            onPressed: _generateStoryboard,
            icon: const Icon(Icons.view_carousel_outlined, color: Colors.white),
            label: const Text('Split Into Scenes & Storyboard', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF6366F1),
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
          ),
        ],
      ),
    );
  }
}
