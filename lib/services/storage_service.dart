import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/project.dart';

class StorageService {
  static const String _projectsKey = 'vivek_studio_projects';

  static Future<List<VideoProject>> loadProjects() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = prefs.getString(_projectsKey);
      if (jsonString == null || jsonString.isEmpty) {
        return [];
      }
      final List<dynamic> list = jsonDecode(jsonString);
      return list.map((item) => VideoProject.fromJson(item as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  static Future<void> saveProjects(List<VideoProject> projects) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final list = projects.map((p) => p.toJson()).toList();
      await prefs.setString(_projectsKey, jsonEncode(list));
    } catch (_) {}
  }

  static Future<void> saveProject(VideoProject project) async {
    final projects = await loadProjects();
    final index = projects.indexWhere((p) => p.id == project.id);
    project.updatedAt = DateTime.now();

    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.insert(0, project);
    }
    await saveProjects(projects);
  }

  static Future<void> deleteProject(String id) async {
    final projects = await loadProjects();
    projects.removeWhere((p) => p.id == id);
    await saveProjects(projects);
  }
}
