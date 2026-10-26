import React from 'react';
import {
  FileText,
  Mic,
  Subtitles,
  Music,
  Download,
  FolderOpen,
  ArrowRight,
  Layers,
  Sparkles,
  Smartphone,
  Play,
} from 'lucide-react';
import { VideoProject, FacelessTemplate } from '../types';
import { FACELESS_TEMPLATES } from '../data/sampleMedia';

interface HomeDashboardProps {
  project: VideoProject;
  onSelectTab: (tab: 'studio' | 'storyboard' | 'voice' | 'audio' | 'subtitles' | 'projects' | 'apkGuide') => void;
  onApplyTemplate: (template: FacelessTemplate) => void;
  onOpenRender: () => void;
  onNewProject: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  project,
  onSelectTab,
  onApplyTemplate,
  onOpenRender,
  onNewProject,
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Hero Studio Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-950/80 bg-gradient-to-br from-indigo-950/50 via-slate-900/80 to-slate-950 p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-400">
            <span>Offline-First</span>
            <span aria-hidden="true">·</span>
            <span>Hindi & English Support</span>
            <span aria-hidden="true">·</span>
            <span>Free Android APK Build</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Create Engaging Faceless Videos in Seconds
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Write or paste a script, automatically generate timed scenes with smart keywords, synthesize natural speech, overlay custom subtitles, and render 720p/1080p video directly on your device.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectTab('studio')}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              <span>Open Script to Video</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => onSelectTab('apkGuide')}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs font-semibold text-sky-400 transition-colors hover:bg-slate-800 hover:text-sky-300 cursor-pointer"
            >
              <Smartphone className="h-4 w-4" />
              <span>Get Android APK</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-40 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      {/* Primary Studio Action Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <button
          onClick={() => onSelectTab('studio')}
          className="group flex flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 text-left transition-all hover:border-indigo-500/50 hover:bg-slate-850 hover:shadow-md cursor-pointer"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:scale-105 transition-transform">
            <FileText className="h-5 w-5" />
          </div>
          <div className="mt-4">
            <span className="block text-sm font-semibold text-white">Script to Video</span>
            <span className="block text-xs text-slate-400 mt-0.5">Auto scene splitting</span>
          </div>
        </button>

        <button
          onClick={() => onSelectTab('voice')}
          className="group flex flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 text-left transition-all hover:border-sky-500/50 hover:bg-slate-850 hover:shadow-md cursor-pointer"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 group-hover:bg-sky-500/20 group-hover:scale-105 transition-transform">
            <Mic className="h-5 w-5" />
          </div>
          <div className="mt-4">
            <span className="block text-sm font-semibold text-white">AI Voice Studio</span>
            <span className="block text-xs text-slate-400 mt-0.5">Hindi & English TTS</span>
          </div>
        </button>

        <button
          onClick={() => onSelectTab('subtitles')}
          className="group flex flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 text-left transition-all hover:border-purple-500/50 hover:bg-slate-850 hover:shadow-md cursor-pointer"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 group-hover:scale-105 transition-transform">
            <Subtitles className="h-5 w-5" />
          </div>
          <div className="mt-4">
            <span className="block text-sm font-semibold text-white">Auto Subtitles</span>
            <span className="block text-xs text-slate-400 mt-0.5">SRT import & export</span>
          </div>
        </button>

        <button
          onClick={() => onSelectTab('audio')}
          className="group flex flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 text-left transition-all hover:border-emerald-500/50 hover:bg-slate-850 hover:shadow-md cursor-pointer"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-105 transition-transform">
            <Music className="h-5 w-5" />
          </div>
          <div className="mt-4">
            <span className="block text-sm font-semibold text-white">Audio to Video</span>
            <span className="block text-xs text-slate-400 mt-0.5">Synthesized tracks</span>
          </div>
        </button>
      </div>

      {/* Current Working Project Banner */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-indigo-400">Active Project</span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400">{project.language}</span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400">{project.aspectRatio}</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">{project.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {project.scenes.length} scenes · ~{project.targetDuration}s duration · {project.subtitles.length} timed captions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectTab('storyboard')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              <span>Storyboard</span>
            </button>
            <button
              onClick={onOpenRender}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Render Video</span>
            </button>
          </div>
        </div>
      </div>

      {/* Faceless Video Templates */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Faceless Video Templates</h2>
            <p className="text-xs text-slate-400">1-click presets for YouTube Shorts, Reels, and TikTok</p>
          </div>
          <span className="text-xs font-medium text-slate-500">{FACELESS_TEMPLATES.length} Templates</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FACELESS_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="flex flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 transition-all hover:border-slate-700 hover:bg-slate-850"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-xs font-medium text-sky-400">{tmpl.category}</span>
                  <span className="text-xs text-slate-400">{tmpl.defaultAspectRatio}</span>
                </div>
                <h4 className="text-sm font-bold text-white leading-snug">{tmpl.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{tmpl.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-xs text-slate-400">{tmpl.sampleScenes.length} scenes · ~{tmpl.suggestedDuration}s</span>
                <button
                  onClick={() => onApplyTemplate(tmpl)}
                  className="px-2.5 py-1 text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-600/80 border border-indigo-800/50 rounded-lg transition-colors cursor-pointer"
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
