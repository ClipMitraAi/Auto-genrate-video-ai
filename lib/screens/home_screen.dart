import 'package:flutter/material.dart';
import '../models/project.dart';
import '../services/storage_service.dart';
import 'script_editor_screen.dart';
import 'voice_studio_screen.dart';
import 'subtitle_editor_screen.dart';
import 'settings_screen.dart';
import 'projects_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<VideoProject> _recentProjects = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final list = await StorageService.loadProjects();
    if (mounted) {
      setState(() {
        _recentProjects = list;
        _isLoading = false;
      });
    }
  }

  void _createNewProject() {
    final project = VideoProject(
      id: 'proj-${DateTime.now().millisecondsSinceEpoch}',
      title: 'New Video Project',
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      scenes: [],
    );
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => ScriptEditorScreen(project: project)),
    ).then((_) => _loadData());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF6366F1), Color(0xFF38BDF8)],
                ),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.movie_creation_outlined, size: 20, color: Colors.white),
            ),
            const SizedBox(width: 10),
            const Text(
              'Vivek AI Video Studio',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.folder_outlined),
            tooltip: 'My Projects',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ProjectsScreen()),
              ).then((_) => _loadData());
            },
          ),
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            tooltip: 'Settings',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const SettingsScreen()),
              );
            },
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadData,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Hero creation banner
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF1E1B4B), Color(0xFF0F172A)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFF312E81)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Transform Scripts into Cinematic Videos',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          'Hindi & English scripts, auto smart scenes, offline Text-to-Speech, auto subtitles, and direct export.',
                          style: TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          onPressed: _createNewProject,
                          icon: const Icon(Icons.add, color: Colors.white),
                          label: const Text('Start Script to Video', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF6366F1),
                            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Quick Action Hub Grid
                  const Text(
                    'Studio Tools',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Color(0xFFE2E8F0)),
                  ),
                  const SizedBox(height: 12),
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    mainAxisSpacing: 12,
                    crossAxisSpacing: 12,
                    childAspectRatio: 1.25,
                    children: [
                      _buildActionCard(
                        title: 'Script to Video',
                        subtitle: 'Multi-lingual storyboards',
                        icon: Icons.subtitles_outlined,
                        color: const Color(0xFF6366F1),
                        onTap: _createNewProject,
                      ),
                      _buildActionCard(
                        title: 'AI Voice Studio',
                        subtitle: 'Hindi & English TTS',
                        icon: Icons.mic_none_outlined,
                        color: const Color(0xFF38BDF8),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const VoiceStudioScreen()),
                          );
                        },
                      ),
                      _buildActionCard(
                        title: 'Auto Subtitles',
                        subtitle: 'SRT & Timed Captions',
                        icon: Icons.closed_caption_outlined,
                        color: const Color(0xFFA855F7),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const SubtitleEditorScreen()),
                          );
                        },
                      ),
                      _buildActionCard(
                        title: 'My Projects',
                        subtitle: '${_recentProjects.length} saved projects',
                        icon: Icons.video_library_outlined,
                        color: const Color(0xFF10B981),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const ProjectsScreen()),
                          ).then((_) => _loadData());
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 28),

                  // Recent Projects Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      const Text(
                        'Recent Projects',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Color(0xFFE2E8F0)),
                      ),
                      if (_recentProjects.isNotEmpty)
                        TextButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const ProjectsScreen()),
                            ).then((_) => _loadData());
                          },
                          child: const Text('View All', style: TextStyle(color: Color(0xFF38BDF8))),
                        ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  if (_recentProjects.isEmpty)
                    Container(
                      padding: const EdgeInsets.all(28),
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: const Color(0xFF0F172A),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFF1E293B)),
                      ),
                      child: Column(
                        children: [
                          const Icon(Icons.movie_filter_outlined, size: 40, color: Color(0xFF475569)),
                          const SizedBox(height: 10),
                          const Text(
                            'No projects created yet',
                            style: TextStyle(color: Color(0xFF94A3B8), fontWeight: FontWeight.w500),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'Tap "Start Script to Video" above to craft your first video.',
                            style: TextStyle(color: Color(0xFF64748B), fontSize: 12),
                          ),
                        ],
                      ),
                    )
                  else
                    ..._recentProjects.take(3).map((p) => Card(
                          color: const Color(0xFF0F172A),
                          margin: const EdgeInsets.only(bottom: 8),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                            side: const Border.all(color: Color(0xFF1E293B)),
                          ),
                          child: ListTile(
                            leading: Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: const Color(0xFF1E1B4B),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Icon(Icons.play_arrow, color: Color(0xFF818CF8)),
                            ),
                            title: Text(p.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                            subtitle: Text(
                              '${p.scenes.length} scenes · ${p.aspectRatio} · ${p.totalDuration.toStringAsFixed(1)}s',
                              style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                            ),
                            trailing: const Icon(Icons.chevron_right, color: Color(0xFF64748B)),
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => ScriptEditorScreen(project: p)),
                              ).then((_) => _loadData());
                            },
                          ),
                        )),
                ],
              ),
            ),
    );
  }

  Widget _buildActionCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF0F172A),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFF1E293B)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withOpacity(0.15),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
