import React, { useRef } from 'react';
import {
  FolderKanban,
  Plus,
  Trash2,
  Copy,
  Download,
  Upload,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { VideoProject } from '../types';

interface ProjectsManagerProps {
  projects: VideoProject[];
  currentProjectId: string;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onDuplicateProject: (p: VideoProject) => void;
  onDeleteProject: (id: string) => void;
  onExportAllProjects: () => void;
  onImportBackup: (imported: VideoProject[]) => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({
  projects,
  currentProjectId,
  onSelectProject,
  onNewProject,
  onDuplicateProject,
  onDeleteProject,
  onExportAllProjects,
  onImportBackup,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImportBackup(json);
        } else if (json.id && json.scenes) {
          onImportBackup([json]);
        }
      } catch (err) {
        alert('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-emerald-400">Local Persistence</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">{projects.length} Saved Projects</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">My Projects & Backups</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Your projects are saved in your local browser storage. You can create duplicates, export JSON backups, or restore on any device.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onExportAllProjects}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            <span>Export Backup</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5 text-sky-400" />
            <span>Restore Backup</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={onNewProject}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Projects List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => {
          const isCurrent = p.id === currentProjectId;
          const totalSecs = p.scenes.reduce((acc, s) => acc + s.duration, 0);

          return (
            <div
              key={p.id}
              className={`flex flex-col justify-between rounded-xl border p-4 sm:p-5 transition-all ${
                isCurrent
                  ? 'border-indigo-500/80 bg-indigo-950/20 shadow-md'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-400 font-mono">{p.aspectRatio}</span>
                    <span className="text-xs text-slate-600">·</span>
                    <span className="text-xs text-slate-400">{p.language}</span>
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                      Currently Active
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{p.title}</h3>

                <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Layers className="h-3 w-3 text-slate-500" />
                    <span>{p.scenes.length} Scenes</span>
                  </span>
                  <span>·</span>
                  <span>{totalSecs.toFixed(1)}s Duration</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDuplicateProject(p)}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Duplicate Project"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>

                  {projects.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete project "${p.title}"?`)) {
                          onDeleteProject(p.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => onSelectProject(p.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Open Project</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
