import 'package:flutter/material.dart';

class SubtitleEditorScreen extends StatefulWidget {
  const SubtitleEditorScreen({super.key});

  @override
  State<SubtitleEditorScreen> createState() => _SubtitleEditorScreenState();
}

class _SubtitleEditorScreenState extends State<SubtitleEditorScreen> {
  final List<Map<String, dynamic>> _captions = [
    {
      'start': '00:00:00,000',
      'end': '00:00:05,500',
      'text': 'Most people quit right before the breakthrough happens.',
    },
    {
      'start': '00:00:05,500',
      'end': '00:00:11,500',
      'text': 'Discipline is choosing between what you want now and what you want most.',
    },
    {
      'start': '00:00:11,500',
      'end': '00:00:17,000',
      'text': 'When motivation fades, your daily routine takes over.',
    },
  ];

  String _fontSize = 'Medium';
  String _position = 'Bottom';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Auto Subtitles Studio', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
        actions: [
          IconButton(
            icon: const Icon(Icons.file_download_outlined),
            tooltip: 'Export SRT',
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('SRT Subtitles exported to Downloads folder.')),
              );
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Row(
            children: [
              Expanded(
                child: DropdownButtonFormField<String>(
                  value: _fontSize,
                  decoration: InputDecoration(
                    labelText: 'Font Size',
                    filled: true,
                    fillColor: const Color(0xFF0F172A),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  items: const [
                    DropdownMenuItem(value: 'Small', child: Text('Small (24pt)')),
                    DropdownMenuItem(value: 'Medium', child: Text('Medium (32pt)')),
                    DropdownMenuItem(value: 'Large', child: Text('Large (42pt)')),
                  ],
                  onChanged: (v) => setState(() => _fontSize = v!),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: DropdownButtonFormField<String>(
                  value: _position,
                  decoration: InputDecoration(
                    labelText: 'Position',
                    filled: true,
                    fillColor: const Color(0xFF0F172A),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  items: const [
                    DropdownMenuItem(value: 'Bottom', child: Text('Bottom 15%')),
                    DropdownMenuItem(value: 'Center', child: Text('Center')),
                    DropdownMenuItem(value: 'Top', child: Text('Top 15%')),
                  ],
                  onChanged: (v) => setState(() => _position = v!),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          const Text('Timed Captions', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
          const SizedBox(height: 8),

          ..._captions.asMap().entries.map((entry) {
            final idx = entry.key;
            final item = entry.value;
            return Card(
              color: const Color(0xFF0F172A),
              margin: const EdgeInsets.only(bottom: 10),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
                side: const Border.all(color: Color(0xFF1E293B)),
              ),
              child: ListTile(
                title: Text(item['text'], style: const TextStyle(fontSize: 14)),
                subtitle: Text(
                  '${item['start']} ➔ ${item['end']}',
                  style: const TextStyle(fontSize: 11, color: Color(0xFF38BDF8), fontFamily: 'monospace'),
                ),
                trailing: IconButton(
                  icon: const Icon(Icons.delete_outline, size: 18, color: Color(0xFFEF4444)),
                  onPressed: () {
                    setState(() => _captions.removeAt(idx));
                  },
                ),
              ),
            );
          }),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          setState(() {
            _captions.add({
              'start': '00:00:17,000',
              'end': '00:00:22,000',
              'text': 'Put in the silent work. Let your results make the noise.',
            });
          });
        },
        backgroundColor: const Color(0xFF6366F1),
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Add Caption', style: TextStyle(color: Colors.white)),
      ),
    );
  }
}
