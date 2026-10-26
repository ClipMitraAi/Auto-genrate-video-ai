import 'package:flutter/material.dart';
import '../models/project.dart';
import '../services/storage_service.dart';
import 'script_editor_screen.dart';

class ProjectsScreen extends StatefulWidget {
  const ProjectsScreen({super.key});

  @override
  State<ProjectsScreen> createState() => _ProjectsScreenState();
}

class _ProjectsScreenState extends State<ProjectsScreen> {
  List<VideoProject> _projects = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final list = await StorageService.loadProjects();
    setState(() {
      _projects = list;
      _loading = false;
    });
  }

  void _duplicate(VideoProject p) async {
    final dup = VideoProject(
      id: 'proj-${DateTime.now().millisecondsSinceEpoch}',
      title: '${p.title} (Copy)',
      aspectRatio: p.aspectRatio,
      language: p.language,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      scenes: p.scenes.map((s) => s).toList(),
      openingTitle: p.openingTitle,
      closingTitle: p.closingTitle,
    );
    await StorageService.saveProject(dup);
    _load();
  }

  void _delete(String id) async {
    await StorageService.deleteProject(id);
    _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Projects', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _projects.isEmpty
              ? const Center(
                  child: Text('No saved projects found.', style: TextStyle(color: Color(0xFF94A3B8))),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _projects.length,
                  itemBuilder: (ctx, i) {
                    final p = _projects[i];
                    return Card(
                      color: const Color(0xFF0F172A),
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: const Border.all(color: Color(0xFF1E293B)),
                      ),
                      child: ListTile(
                        title: Text(p.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text(
                          '${p.scenes.length} scenes · ${p.aspectRatio} · ${p.totalDuration.toStringAsFixed(1)}s',
                          style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                        ),
                        trailing: PopupMenuButton<String>(
                          onSelected: (val) {
                            if (val == 'open') {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => ScriptEditorScreen(project: p)),
                              ).then((_) => _load());
                            } else if (val == 'duplicate') {
                              _duplicate(p);
                            } else if (val == 'delete') {
                              _delete(p.id);
                            }
                          },
                          itemBuilder: (_) => const [
                            PopupMenuItem(value: 'open', child: Text('Open & Edit')),
                            PopupMenuItem(value: 'duplicate', child: Text('Duplicate')),
                            PopupMenuItem(value: 'delete', child: Text('Delete', style: TextStyle(color: Colors.red))),
                          ],
                        ),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => ScriptEditorScreen(project: p)),
                          ).then((_) => _load());
                        },
                      ),
                    );
                  },
                ),
    );
  }
}
