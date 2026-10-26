import React from 'react';
import {
  Subtitles,
  Download,
  Upload,
  Plus,
  Trash2,
  Clock,
  Type,
  FileText,
  Sliders,
} from 'lucide-react';
import { VideoProject, SubtitleItem, SubtitleStyle } from '../types';
import { generateSrtContent, parseSrtContent, downloadTextFile } from '../utils/srtParser';

interface SubtitleStudioProps {
  project: VideoProject;
  onUpdateProject: (updated: Partial<VideoProject>) => void;
}

export const SubtitleStudio: React.FC<SubtitleStudioProps> = ({
  project,
  onUpdateProject,
}) => {
  const style = project.subtitleStyle;

  const handleUpdateStyle = (partial: Partial<SubtitleStyle>) => {
    onUpdateProject({
      subtitleStyle: {
        ...project.subtitleStyle,
        ...partial,
      },
    });
  };

  const handleUpdateSubtitle = (id: string, partial: Partial<SubtitleItem>) => {
    const updated = project.subtitles.map((s) => (s.id === id ? { ...s, ...partial } : s));
    onUpdateProject({ subtitles: updated });
  };

  const handleAddSubtitle = () => {
    const lastSub = project.subtitles[project.subtitles.length - 1];
    const newStart = lastSub ? lastSub.endTime : 0;
    const newSub: SubtitleItem = {
      id: 'sub-' + Math.random().toString(36).substring(2, 9),
      startTime: parseFloat(newStart.toFixed(2)),
      endTime: parseFloat((newStart + 4.0).toFixed(2)),
      text: 'New subtitle text here.',
    };
    onUpdateProject({ subtitles: [...project.subtitles, newSub] });
  };

  const handleDeleteSubtitle = (id: string) => {
    const filtered = project.subtitles.filter((s) => s.id !== id);
    onUpdateProject({ subtitles: filtered });
  };

  const handleExportSrt = () => {
    const srtText = generateSrtContent(project.subtitles);
    const filename = `${project.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_subtitles.srt`;
    downloadTextFile(filename, srtText, 'application/x-subrip');
  };

  const handleExportTxt = () => {
    const txtContent = project.subtitles.map((s) => s.text).join('\n\n');
    const filename = `${project.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_script.txt`;
    downloadTextFile(filename, txtContent, 'text/plain');
  };

  const handleImportSrt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseSrtContent(text);
        if (parsed.length > 0) {
          onUpdateProject({ subtitles: parsed });
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Subtitles Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-purple-400">Subtitle Studio</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">{project.subtitles.length} Timed Captions</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Automatic Subtitles & SRT Editor</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Burn-in modern kinetic subtitles on your exported video, or download standard `.srt` files for YouTube and social platforms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportSrt}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-purple-400" />
            <span>Export SRT</span>
          </button>

          <button
            onClick={handleExportTxt}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5 text-sky-400" />
            <span>Export TXT</span>
          </button>

          <label className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer">
            <Upload className="h-3.5 w-3.5 text-indigo-400" />
            <span>Import SRT</span>
            <input type="file" accept=".srt" onChange={handleImportSrt} className="hidden" />
          </label>
        </div>
      </div>

      {/* Subtitle Visual Style Configuration Strip */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Burned-In Subtitle Styling</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Font Size</span>
              <span className="font-mono text-purple-400 font-bold">{style.fontSize}px</span>
            </div>
            <input
              type="range"
              min={20}
              max={44}
              step={2}
              value={style.fontSize}
              onChange={(e) => handleUpdateStyle({ fontSize: parseInt(e.target.value, 10) })}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Position</label>
            <select
              value={style.position}
              onChange={(e) => handleUpdateStyle({ position: e.target.value as 'bottom' | 'middle' | 'top' })}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="bottom">Bottom (Standard Shorts/Reels)</option>
              <option value="middle">Center / Focus</option>
              <option value="top">Top Header</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Text Color</label>
            <div className="flex items-center gap-2">
              {[
                { label: 'White', color: '#ffffff' },
                { label: 'Yellow', color: '#facc15' },
                { label: 'Cyan', color: '#38bdf8' },
                { label: 'Green', color: '#4ade80' },
              ].map((c) => (
                <button
                  key={c.color}
                  onClick={() => handleUpdateStyle({ color: c.color })}
                  className={`h-6 w-6 rounded-full border-2 transition-transform cursor-pointer ${
                    style.color === c.color ? 'border-purple-400 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.color }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 sm:pt-0">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={style.uppercase}
                onChange={(e) => handleUpdateStyle({ uppercase: e.target.checked })}
                className="rounded accent-purple-500"
              />
              <span>UPPERCASE</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={style.bold}
                onChange={(e) => handleUpdateStyle({ bold: e.target.checked })}
                className="rounded accent-purple-500"
              />
              <span>Bold</span>
            </label>
          </div>
        </div>
      </div>

      {/* Subtitles Timeline List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white">Captions List</span>
          <button
            onClick={handleAddSubtitle}
            className="flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Caption</span>
          </button>
        </div>

        <div className="space-y-2">
          {project.subtitles.map((sub, idx) => (
            <div
              key={sub.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3 transition-colors hover:border-slate-700"
            >
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-mono text-slate-500 w-6">#{idx + 1}</span>
                <div className="flex items-center gap-1 font-mono text-xs text-purple-300">
                  <input
                    type="number"
                    step={0.1}
                    value={sub.startTime}
                    onChange={(e) => handleUpdateSubtitle(sub.id, { startTime: parseFloat(e.target.value) || 0 })}
                    className="w-16 rounded border border-slate-800 bg-slate-950 px-1.5 py-0.5 text-center text-xs focus:outline-none"
                  />
                  <span>➔</span>
                  <input
                    type="number"
                    step={0.1}
                    value={sub.endTime}
                    onChange={(e) => handleUpdateSubtitle(sub.id, { endTime: parseFloat(e.target.value) || 0 })}
                    className="w-16 rounded border border-slate-800 bg-slate-950 px-1.5 py-0.5 text-center text-xs focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">sec</span>
                </div>
              </div>

              <input
                type="text"
                value={sub.text}
                onChange={(e) => handleUpdateSubtitle(sub.id, { text: e.target.value })}
                className="flex-1 rounded border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
              />

              <button
                onClick={() => handleDeleteSubtitle(sub.id)}
                className="p-1 text-slate-500 hover:text-red-400 self-end sm:self-center cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
