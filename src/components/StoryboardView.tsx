import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Clock,
  Sparkles,
  Move,
  Film,
  Upload,
} from 'lucide-react';
import { VideoProject, Scene } from '../types';
import { VISUAL_PRESETS, VisualPreset } from '../data/sampleMedia';

interface StoryboardViewProps {
  project: VideoProject;
  onUpdateProject: (updated: Partial<VideoProject>) => void;
  onOpenRender: () => void;
  onSelectTab: (tab: 'studio' | 'storyboard' | 'voice' | 'audio' | 'subtitles' | 'projects' | 'apkGuide') => void;
}

export const StoryboardView: React.FC<StoryboardViewProps> = ({
  project,
  onUpdateProject,
  onOpenRender,
  onSelectTab,
}) => {
  const [selectedPresetModalSceneId, setSelectedPresetModalSceneId] = useState<string | null>(null);

  const totalDuration = project.scenes.reduce((acc, s) => acc + s.duration, 0) +
    (project.openingTitle ? 2.0 : 0) +
    (project.closingTitle ? 2.5 : 0);

  const handleUpdateScene = (sceneId: string, partial: Partial<Scene>) => {
    const updated = project.scenes.map((s) => (s.id === sceneId ? { ...s, ...partial } : s));
    onUpdateProject({ scenes: updated });
  };

  const handleAddScene = () => {
    const newScene: Scene = {
      id: 'scene-' + Math.random().toString(36).substring(2, 9),
      order: project.scenes.length,
      text: 'Add your narration here.',
      visualKeyword: 'cinematic horizon',
      mediaUrl: '',
      mediaType: 'gradient',
      gradientColors: ['#0f172a', '#1e1b4b'],
      duration: 5.0,
      transition: 'fade',
    };
    onUpdateProject({ scenes: [...project.scenes, newScene] });
  };

  const handleDeleteScene = (sceneId: string) => {
    const filtered = project.scenes.filter((s) => s.id !== sceneId);
    onUpdateProject({ scenes: filtered });
  };

  const handleDuplicateScene = (scene: Scene) => {
    const clone: Scene = {
      ...scene,
      id: 'scene-' + Math.random().toString(36).substring(2, 9),
      order: scene.order + 1,
    };
    const scenes = [...project.scenes];
    const idx = scenes.findIndex((s) => s.id === scene.id);
    scenes.splice(idx + 1, 0, clone);
    onUpdateProject({ scenes });
  };

  const handleMoveScene = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= project.scenes.length) return;
    const scenes = [...project.scenes];
    const temp = scenes[index];
    scenes[index] = scenes[newIdx];
    scenes[newIdx] = temp;
    onUpdateProject({ scenes });
  };

  // Custom Image Upload for a scene
  const handleCustomImageUpload = (sceneId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        handleUpdateScene(sceneId, {
          mediaUrl: dataUrl,
          mediaType: 'image',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Storyboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-indigo-400">Storyboard Studio</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">{project.scenes.length} Scenes</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs font-mono text-sky-400">{totalDuration.toFixed(1)}s Total Duration</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-0.5">{project.title}</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab('voice')}
            className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Voice Narration
          </button>
          <button
            onClick={handleAddScene}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Scene</span>
          </button>
        </div>
      </div>

      {/* Scenes List */}
      <div className="space-y-4">
        {project.scenes.map((scene, idx) => (
          <div
            key={scene.id}
            className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5 transition-all hover:border-slate-700"
          >
            <div className="flex flex-col md:flex-row items-start gap-4">
              {/* Scene Visual Preview Thumbnail Box */}
              <div className="w-full md:w-44 shrink-0 space-y-2">
                <div
                  className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner"
                  style={{
                    background: scene.mediaUrl
                      ? `url(${scene.mediaUrl}) center/cover no-repeat`
                      : `linear-gradient(135deg, ${scene.gradientColors?.[0] || '#0f172a'}, ${
                          scene.gradientColors?.[1] || '#1e1b4b'
                        })`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/25 flex flex-col justify-between p-2">
                    <span className="text-[10px] font-mono font-bold bg-black/60 px-1.5 py-0.5 rounded text-white self-start">
                      #{idx + 1} · {scene.duration}s
                    </span>
                    <span className="text-[10px] text-white/80 truncate font-medium">
                      {scene.visualKeyword || 'Scene Visual'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedPresetModalSceneId(scene.id)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 text-[11px] font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3 text-sky-400" />
                    <span>Visual Theme</span>
                  </button>

                  <label className="flex items-center justify-center p-1.5 text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer">
                    <Upload className="h-3 w-3 text-indigo-400" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCustomImageUpload(scene.id, e)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Scene Content & Duration Controls */}
              <div className="flex-1 w-full space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Scene #{idx + 1}</span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-400">Transition: {scene.transition}</span>
                  </div>

                  {/* Actions: Move Up, Move Down, Duplicate, Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveScene(idx, 'up')}
                      title="Move Scene Up"
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      disabled={idx === project.scenes.length - 1}
                      onClick={() => handleMoveScene(idx, 'down')}
                      title="Move Scene Down"
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDuplicateScene(scene)}
                      title="Duplicate Scene"
                      className="p-1 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteScene(scene.id)}
                      title="Delete Scene"
                      className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Editable Voiceover Text */}
                <textarea
                  rows={2}
                  value={scene.text}
                  onChange={(e) => handleUpdateScene(scene.id, { text: e.target.value })}
                  placeholder="Scene voiceover text..."
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                />

                {/* Duration Slider and Visual Keyword */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-sky-400" />
                        <span>Duration</span>
                      </span>
                      <span className="font-mono text-sky-400 font-bold">{scene.duration}s</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={12}
                      step={0.5}
                      value={scene.duration}
                      onChange={(e) =>
                        handleUpdateScene(scene.id, { duration: parseFloat(e.target.value) })
                      }
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Visual Keyword / Prompt</label>
                    <input
                      type="text"
                      value={scene.visualKeyword}
                      onChange={(e) => handleUpdateScene(scene.id, { visualKeyword: e.target.value })}
                      placeholder="e.g. runner at sunset"
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-slate-300 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Preset Selection Modal */}
      {selectedPresetModalSceneId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Choose Cinematic Visual Theme</h3>
              <button
                onClick={() => setSelectedPresetModalSceneId(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {VISUAL_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    handleUpdateScene(selectedPresetModalSceneId, {
                      gradientColors: preset.gradient,
                      mediaUrl: '',
                      mediaType: 'gradient',
                      visualKeyword: preset.sampleKeyword,
                    });
                    setSelectedPresetModalSceneId(null);
                  }}
                  className="rounded-xl border border-slate-800 p-3 text-left transition-all hover:border-indigo-500 hover:scale-[1.02] cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${preset.gradient[0]}, ${preset.gradient[1]})`,
                  }}
                >
                  <span className="block text-xs font-bold text-white drop-shadow-sm">{preset.name}</span>
                  <span className="block text-[10px] text-white/70 mt-1">{preset.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
