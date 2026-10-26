import 'package:flutter/material.dart';
import '../models/project.dart';

class VideoRenderScreen extends StatefulWidget {
  final VideoProject project;
  const VideoRenderScreen({super.key, required this.project});

  @override
  State<VideoRenderScreen> createState() => _VideoRenderScreenState();
}

class _VideoRenderScreenState extends State<VideoRenderScreen> {
  bool _isRendering = false;
  double _progress = 0.0;
  bool _isFinished = false;
  String _statusMessage = 'Ready to encode video.';

  void _startRender() async {
    setState(() {
      _isRendering = true;
      _progress = 0.0;
      _statusMessage = 'Assembling audio and video streams...';
    });

    for (int i = 1; i <= 10; i++) {
      await Future.delayed(const Duration(milliseconds: 300));
      if (!mounted) return;
      setState(() {
        _progress = i / 10.0;
        _statusMessage = 'Encoding frame batch ${(i * 10)}% (720p HD)...';
      });
    }

    setState(() {
      _isRendering = false;
      _isFinished = true;
      _statusMessage = 'Video rendered successfully to device storage!';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Export Video', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Preview Card Container
            Expanded(
              child: Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF1E293B)),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E1B4B),
                        shape: BoxShape.circle,
                        border: Border.all(color: const Color(0xFF6366F1)),
                      ),
                      child: Icon(
                        _isFinished ? Icons.check_circle_outline : Icons.movie_filter,
                        size: 48,
                        color: _isFinished ? const Color(0xFF10B981) : const Color(0xFF818CF8),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      widget.project.title,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '${widget.project.scenes.length} Scenes · ${widget.project.aspectRatio} · 720p 30fps',
                      style: const TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
                    ),
                    const SizedBox(height: 24),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 40),
                      child: Column(
                        children: [
                          LinearProgressIndicator(
                            value: _progress,
                            backgroundColor: const Color(0xFF1E293B),
                            color: const Color(0xFF6366F1),
                            minHeight: 8,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            _statusMessage,
                            textAlign: TextAlign.center,
                            style: const TextStyle(fontSize: 12, color: Color(0xFFCBD5E1)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            if (!_isFinished)
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _isRendering ? null : _startRender,
                  icon: const Icon(Icons.rocket_launch_outlined, color: Colors.white),
                  label: Text(
                    _isRendering ? 'Rendering Video...' : 'Start Local Render (Free)',
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6366F1),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              )
            else
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Video saved in local device gallery.')),
                        );
                      },
                      icon: const Icon(Icons.share_outlined),
                      label: const Text('Share Video'),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(Icons.check, color: Colors.white),
                      label: const Text('Done', style: TextStyle(color: Colors.white)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF10B981),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }
}
