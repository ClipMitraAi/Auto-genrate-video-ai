import React from 'react';
import { Smartphone, Monitor, Download, Sparkles, FolderKanban } from 'lucide-react';

interface TopNavProps {
  activeTab: 'studio' | 'storyboard' | 'voice' | 'audio' | 'subtitles' | 'projects' | 'apkGuide';
  setActiveTab: (tab: 'studio' | 'storyboard' | 'voice' | 'audio' | 'subtitles' | 'projects' | 'apkGuide') => void;
  onOpenRender: () => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  onOpenSettings: () => void;
  projectTitle: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenRender,
  isMobileFrame,
  setIsMobileFrame,
  onOpenSettings,
  projectTitle,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-8 px-4 sm:px-6">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('studio')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-sky-400 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <span className="text-base font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors whitespace-nowrap">
                Vivek AI Video Studio
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Single-line Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('studio')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'studio' ? 'text-white font-semibold' : ''
            }`}
          >
            Studio
          </button>
          <button
            onClick={() => setActiveTab('storyboard')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'storyboard' ? 'text-white font-semibold' : ''
            }`}
          >
            Storyboard
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'voice' ? 'text-white font-semibold' : ''
            }`}
          >
            AI Voice
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'audio' ? 'text-white font-semibold' : ''
            }`}
          >
            Audio & Music
          </button>
          <button
            onClick={() => setActiveTab('subtitles')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'subtitles' ? 'text-white font-semibold' : ''
            }`}
          >
            Subtitles
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'projects' ? 'text-white font-semibold' : ''
            }`}
          >
            My Projects
          </button>
          <button
            onClick={() => setActiveTab('apkGuide')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-sky-400 flex items-center gap-1.5 ${
              activeTab === 'apkGuide' ? 'text-sky-400 font-semibold' : ''
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            Android APK
          </button>
        </nav>

        {/* Zone 3: Primary Action & View Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile frame toggle */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            title={isMobileFrame ? 'Switch to Desktop Layout' : 'Simulate Android Phone Screen'}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="h-3.5 w-3.5 text-sky-400" />
                <span>Desktop</span>
              </>
            ) : (
              <>
                <Smartphone className="h-3.5 w-3.5 text-indigo-400" />
                <span>Android View</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Settings
          </button>

          <button
            onClick={onOpenRender}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-sky-500 rounded-lg hover:from-indigo-500 hover:to-sky-400 shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Render Video</span>
          </button>
        </div>
      </div>
    </header>
  );
};
