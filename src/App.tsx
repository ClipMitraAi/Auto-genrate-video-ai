import React, { useState, useEffect } from 'react';
import { VideoProject, FacelessTemplate } from './types';
import { FACELESS_TEMPLATES } from './data/sampleMedia';
import { TopNav } from './components/TopNav';
import { HomeDashboard } from './components/HomeDashboard';
import { ScriptEditor } from './components/ScriptEditor';
import { StoryboardView } from './components/StoryboardView';
import { VoiceStudio } from './components/VoiceStudio';
import { AudioStudio } from './components/AudioStudio';
import { SubtitleStudio } from './components/SubtitleStudio';
import { VideoPlayerCanvas } from './components/VideoPlayerCanvas';
import { RenderModal } from './components/RenderModal';
import { ProjectsManager } from './components/ProjectsManager';
import { ApkBuilderGuide } from './components/ApkBuilderGuide';
import { SettingsModal } from './components/SettingsModal';
import { downloadTextFile } from './utils/srtParser';

const STORAGE_KEY = 'vivek_video_studio_projects_v1';

export default function App() {
  // Initial default project created from first faceless template
  const createDefaultProject = (): VideoProject => {
    const tmpl = FACELESS_TEMPLATES[0];
    return {
      id: 'proj-' + Date.now(),
      title: tmpl.title,
      description: tmpl.description,
      aspectRatio: tmpl.defaultAspectRatio,
      language: tmpl.language,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      targetDuration: tmpl.suggestedDuration,
      scenes: tmpl.sampleScenes.map((s, idx) => ({
        ...s,
        id: 'scene-' + idx,
        order: idx,
      })),
      subtitles: tmpl.sampleScenes.map((s, idx) => ({
        id: 'sub-' + idx,
        startTime: idx * 6.0,
        endTime: (idx + 1) * 6.0,
        text: s.text,
      })),
      subtitleStyle: {
        fontSize: 32,
        color: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0.65)',
        outlineColor: '#000000',
        position: 'bottom',
        bold: true,
        uppercase: true,
      },
      audioConfig: {
        narrationVolume: 1.0,
        backgroundMusicVolume: 0.25,
        backgroundMusicName: 'Cinematic Depth & Horizon',
        fadeInSeconds: 1.5,
        fadeOutSeconds: 2.0,
      },
      openingTitle: 'VIVEK AI VIDEO STUDIO',
      closingTitle: 'SUBSCRIBE FOR DAILY WISDOM',
      ttsRate: 1.0,
      ttsPitch: 1.0,
    };
  };

  // State initialization
  const [projects, setProjects] = useState<VideoProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return [createDefaultProject()];
  });

  const [currentProjectId, setCurrentProjectId] = useState<string>(() => {
    return projects[0]?.id || '';
  });

  const [activeTab, setActiveTab] = useState<
    'studio' | 'storyboard' | 'voice' | 'audio' | 'subtitles' | 'projects' | 'apkGuide'
  >('studio');

  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [showRenderModal, setShowRenderModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Active project
  const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0] || createDefaultProject();

  // Save to localStorage whenever projects change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // ignore quota errors
    }
  }, [projects]);

  // Update active project
  const handleUpdateProject = (updated: Partial<VideoProject>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === currentProject.id ? { ...p, ...updated, updatedAt: Date.now() } : p))
    );
  };

  // Create brand new project
  const handleNewProject = () => {
    const newProj = createDefaultProject();
    newProj.id = 'proj-' + Date.now();
    newProj.title = 'Untitled Video Project';
    setProjects((prev) => [newProj, ...prev]);
    setCurrentProjectId(newProj.id);
    setActiveTab('studio');
  };

  // Apply Faceless template
  const handleApplyTemplate = (tmpl: FacelessTemplate) => {
    const newProj: VideoProject = {
      ...createDefaultProject(),
      id: 'proj-' + Date.now(),
      title: tmpl.title,
      description: tmpl.description,
      aspectRatio: tmpl.defaultAspectRatio,
      language: tmpl.language,
      targetDuration: tmpl.suggestedDuration,
      scenes: tmpl.sampleScenes.map((s, idx) => ({
        ...s,
        id: 'scene-' + idx,
        order: idx,
      })),
      subtitles: tmpl.sampleScenes.map((s, idx) => ({
        id: 'sub-' + idx,
        startTime: idx * 6.0,
        endTime: (idx + 1) * 6.0,
        text: s.text,
      })),
    };
    setProjects((prev) => [newProj, ...prev]);
    setCurrentProjectId(newProj.id);
    setActiveTab('storyboard');
  };

  // Duplicate project
  const handleDuplicateProject = (p: VideoProject) => {
    const clone: VideoProject = {
      ...p,
      id: 'proj-' + Date.now(),
      title: `${p.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setProjects((prev) => [clone, ...prev]);
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    setProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length === 0) return [createDefaultProject()];
      if (currentProjectId === id) setCurrentProjectId(filtered[0].id);
      return filtered;
    });
  };

  // Backup export / restore
  const handleExportAllProjects = () => {
    const data = JSON.stringify(projects, null, 2);
    downloadTextFile('vivek_video_studio_backup.json', data, 'application/json');
  };

  const handleImportBackup = (imported: VideoProject[]) => {
    setProjects(imported);
    if (imported[0]) setCurrentProjectId(imported[0].id);
  };

  // Render content according to active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'studio':
        return (
          <div className="space-y-8">
            <HomeDashboard
              project={currentProject}
              onSelectTab={setActiveTab}
              onApplyTemplate={handleApplyTemplate}
              onOpenRender={() => setShowRenderModal(true)}
              onNewProject={handleNewProject}
            />
            <div className="pt-6 border-t border-slate-800/80">
              <h2 className="text-base font-bold text-white mb-4">Script to Video Workflow</h2>
              <ScriptEditor
                project={currentProject}
                onUpdateProject={handleUpdateProject}
                onNavigateToStoryboard={() => setActiveTab('storyboard')}
              />
            </div>
          </div>
        );
      case 'storyboard':
        return (
          <StoryboardView
            project={currentProject}
            onUpdateProject={handleUpdateProject}
            onOpenRender={() => setShowRenderModal(true)}
            onSelectTab={setActiveTab}
          />
        );
      case 'voice':
        return (
          <VoiceStudio
            project={currentProject}
            onUpdateProject={handleUpdateProject}
          />
        );
      case 'audio':
        return (
          <AudioStudio
            project={currentProject}
            onUpdateProject={handleUpdateProject}
          />
        );
      case 'subtitles':
        return (
          <SubtitleStudio
            project={currentProject}
            onUpdateProject={handleUpdateProject}
          />
        );
      case 'projects':
        return (
          <ProjectsManager
            projects={projects}
            currentProjectId={currentProject.id}
            onSelectProject={(id) => {
              setCurrentProjectId(id);
              setActiveTab('storyboard');
            }}
            onNewProject={handleNewProject}
            onDuplicateProject={handleDuplicateProject}
            onDeleteProject={handleDeleteProject}
            onExportAllProjects={handleExportAllProjects}
            onImportBackup={handleImportBackup}
          />
        );
      case 'apkGuide':
        return <ApkBuilderGuide />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRender={() => setShowRenderModal(true)}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        onOpenSettings={() => setShowSettingsModal(true)}
        projectTitle={currentProject.title}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Android Mobile Phone Simulation Viewport */}
        {isMobileFrame ? (
          <div className="flex justify-center py-4">
            <div className="relative w-full max-w-[412px] h-[860px] rounded-[44px] border-[10px] border-slate-800 bg-slate-950 shadow-2xl shadow-indigo-950/40 overflow-hidden flex flex-col">
              {/* Android Notch / Punch-hole Camera */}
              <div className="h-6 w-full bg-slate-950 flex items-center justify-between px-6 text-[10px] font-mono text-slate-400 select-none z-30 shrink-0">
                <span>09:41</span>
                <div className="h-3.5 w-3.5 rounded-full bg-slate-900 border border-slate-700" />
                <span>5G · 100%</span>
              </div>

              {/* Scrollable Mobile App Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {renderTabContent()}
              </div>

              {/* Android Navigation Gesture Bar */}
              <div className="h-4 w-full bg-slate-950 flex items-center justify-center shrink-0">
                <div className="h-1 w-32 rounded-full bg-slate-700" />
              </div>
            </div>
          </div>
        ) : (
          /* Desktop Split Studio Viewport */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Interactive Studio & Editors */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              {renderTabContent()}
            </div>

            {/* Right Column: Live Sticky Video Preview Canvas */}
            <aside className="lg:col-span-5 xl:col-span-4 sticky top-20 space-y-4">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Live Video Preview
                  </span>
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-900/50">
                    {currentProject.aspectRatio}
                  </span>
                </div>

                <VideoPlayerCanvas project={currentProject} />
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* Render Video Modal */}
      {showRenderModal && (
        <RenderModal
          project={currentProject}
          onClose={() => setShowRenderModal(false)}
        />
      )}

      {/* Settings & Privacy Modal */}
      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
}
