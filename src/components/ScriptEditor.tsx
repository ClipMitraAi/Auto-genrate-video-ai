import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  SplitSquareVertical,
  Clock,
  Ratio,
  Languages,
  Check,
  AlertCircle,
  FileCode,
  ArrowRight,
} from 'lucide-react';
import { VideoProject, AspectRatio, LanguageCode, Scene, SubtitleItem } from '../types';

interface ScriptEditorProps {
  project: VideoProject;
  onUpdateProject: (updated: Partial<VideoProject>) => void;
  onNavigateToStoryboard: () => void;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  project,
  onUpdateProject,
  onNavigateToStoryboard,
}) => {
  const [scriptText, setScriptText] = useState(
    project.scenes.length > 0
      ? project.scenes.map((s) => s.text).join('\n\n')
      : 'Most people quit right before the breakthrough happens.\nDiscipline is choosing between what you want now and what you want most.\nWhen motivation fades, your daily routine takes over.\nPut in the silent work. Let your results make the noise.'
  );

  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Handle TXT File Upload
  const handleTxtUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setScriptText(content);
      }
    };
    reader.readAsText(file);
  };

  // Convert Script into Scenes and Subtitles
  const handleSplitToStoryboard = () => {
    const trimmed = scriptText.trim();
    if (!trimmed) return;

    // Normalizing text
    const normalized = trimmed
        .replace(/\r\n/g, '\n')
        .replace(/।/g, '. ')
        .replace(/;/g, '. ')
        .replace(/\?/g, '? ')
        .replace(/!/g, '! ');

    // Extract sentences
    const lines = normalized.split('\n');
    const sentences: string[] = [];

    for (const line of lines) {
      const cleanedLine = line.trim();
      if (!cleanedLine) continue;
      const parts = cleanedLine.split(/(?<=[.!?])\s+/);
      for (const part of parts) {
        const c = part.trim();
        if (c.length > 0) sentences.push(c);
      }
    }

    if (sentences.length === 0) return;

    // Word count calculation
    const wordCounts = sentences.map((s) => s.split(/\s+/).filter(Boolean).length);
    const totalWords = wordCounts.reduce((a, b) => a + b, 0);

    const generatedScenes: Scene[] = [];
    const generatedSubtitles: SubtitleItem[] = [];
    let currentTimelineTime = project.openingTitle ? 2.0 : 0;

    sentences.forEach((sentence, idx) => {
      const words = wordCounts[idx] || 1;
      let duration = (words / Math.max(1, totalWords)) * project.targetDuration;
      duration = Math.max(3.0, Math.min(9.0, duration));
      duration = parseFloat(duration.toFixed(1));

      // Visual keyword
      const keywordList = sentence
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 3);
      const visualKeyword = keywordList.slice(0, 3).join(' ') || 'cinematic background';

      const sceneId = 'scene-' + Math.random().toString(36).substring(2, 9);
      generatedScenes.push({
        id: sceneId,
        order: idx,
        text: sentence,
        visualKeyword,
        mediaUrl: '',
        mediaType: 'gradient',
        gradientColors: idx % 2 === 0 ? ['#0f172a', '#1e1b4b'] : ['#030712', '#0c4a6e'],
        duration,
        transition: idx % 2 === 0 ? 'fade' : 'zoom',
      });

      // Synchronize subtitle item
      generatedSubtitles.push({
        id: 'sub-' + Math.random().toString(36).substring(2, 9),
        startTime: parseFloat(currentTimelineTime.toFixed(2)),
        endTime: parseFloat((currentTimelineTime + duration).toFixed(2)),
        text: sentence,
      });

      currentTimelineTime += duration;
    });

    onUpdateProject({
      scenes: generatedScenes,
      subtitles: generatedSubtitles,
    });

    onNavigateToStoryboard();
  };

  // Optional AI Script Generator
  const handleGenerateAiScript = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch('/api/gemini/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiPrompt.trim(),
          language: project.language,
          targetDuration: project.targetDuration,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate script');
      }

      if (data.scenes && Array.isArray(data.scenes)) {
        const fullScript = data.scenes.map((s: { text: string }) => s.text).join('\n\n');
        setScriptText(fullScript);
        if (data.title) {
          onUpdateProject({ title: data.title });
        }
        setShowAiModal(false);
      } else {
        throw new Error('Invalid format returned by AI model.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Generation failed';
      setAiError(msg);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Script Header Settings */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 mb-1">Project Title</label>
            <input
              type="text"
              value={project.title}
              onChange={(e) => onUpdateProject({ title: e.target.value })}
              placeholder="e.g. 5 Habits of High Achievers"
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-3.5 py-2 text-sm font-semibold text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAiModal(true)}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-700/50 bg-indigo-950/60 px-3 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/60 transition-colors cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>AI Script Writer</span>
            </button>

            <label className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer">
              <Upload className="h-3.5 w-3.5 text-sky-400" />
              <span>Import TXT</span>
              <input type="file" accept=".txt" onChange={handleTxtUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Configuration Row: Language, Aspect Ratio, Duration Target */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2 border-t border-slate-800/80">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-1.5">
              <Languages className="h-3.5 w-3.5 text-sky-400" />
              <span>Script Language</span>
            </label>
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              {(['English', 'Hindi', 'Hinglish'] as LanguageCode[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onUpdateProject({ language: lang })}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                    project.language === lang
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-1.5">
              <Ratio className="h-3.5 w-3.5 text-purple-400" />
              <span>Aspect Ratio</span>
            </label>
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              {(
                [
                  { id: '9:16', label: '9:16 Shorts' },
                  { id: '16:9', label: '16:9 YT' },
                  { id: '1:1', label: '1:1 Square' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  onClick={() => onUpdateProject({ aspectRatio: item.id as AspectRatio })}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                    project.aspectRatio === item.id
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                <span>Target Duration</span>
              </span>
              <span className="text-sky-400 font-mono font-bold">{project.targetDuration}s</span>
            </div>
            <input
              type="range"
              min={15}
              max={120}
              step={5}
              value={project.targetDuration}
              onChange={(e) => onUpdateProject({ targetDuration: parseInt(e.target.value, 10) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Script Textarea Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">
            Script Content <span className="text-slate-500 font-normal">(Sentences automatically become scenes)</span>
          </label>
          <span className="text-xs text-slate-500">
            {scriptText.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>

        <textarea
          rows={10}
          value={scriptText}
          onChange={(e) => setScriptText(e.target.value)}
          placeholder="Paste or write your video script here...&#10;&#10;Supports English, Hindi (हिंदी), and Hinglish.&#10;Each period, question mark, or Hindi purna viram (।) splits into an individual scene."
          className="w-full rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-sm leading-relaxed text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* Opening & Closing Title Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Opening Title Card (Optional 2s)</label>
          <input
            type="text"
            value={project.openingTitle || ''}
            onChange={(e) => onUpdateProject({ openingTitle: e.target.value })}
            placeholder="e.g. THE DISCIPLINE FORMULA"
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Closing Screen Title (Optional 2.5s)</label>
          <input
            type="text"
            value={project.closingTitle || ''}
            onChange={(e) => onUpdateProject({ closingTitle: e.target.value })}
            placeholder="e.g. Subscribe for Daily Inspiration"
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSplitToStoryboard}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-sky-400 transition-all cursor-pointer"
        >
          <SplitSquareVertical className="h-4 w-4" />
          <span>Split into Scenes & Open Storyboard</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* AI Script Writer Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <h3 className="text-base font-bold text-white">AI Script Generator</h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Enter any topic, theme, or story idea. Gemini 3.8 Flash will construct a high-retention script with timed scenes tailored for {project.language}.
            </p>

            <div>
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. 3 psychology tricks to stay focused when studying"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {aiError && (
              <div className="flex items-center gap-2 rounded-lg bg-amber-950/40 border border-amber-800/60 p-2.5 text-xs text-amber-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{aiError}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={isAiLoading || !aiPrompt.trim()}
                onClick={handleGenerateAiScript}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
              >
                {isAiLoading ? 'Writing Script...' : 'Generate Script'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
