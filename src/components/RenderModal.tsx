import React, { useState } from 'react';
import {
  Download,
  CheckCircle2,
  AlertCircle,
  Play,
  Share2,
  X,
  Sparkles,
  Film,
} from 'lucide-react';
import { VideoProject } from '../types';
import { VideoRenderer, RenderProgress } from '../utils/videoRenderer';

interface RenderModalProps {
  project: VideoProject;
  onClose: () => void;
}

export const RenderModal: React.FC<RenderModalProps> = ({ project, onClose }) => {
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [progress, setProgress] = useState<RenderProgress>({
    percent: 0,
    currentScene: 1,
    totalScenes: project.scenes.length,
    statusText: 'Ready to render.',
  });
  const [exportedVideoUrl, setExportedVideoUrl] = useState<string | null>(null);
  const [exportedVideoBlob, setExportedVideoBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartRender = async () => {
    setIsRendering(true);
    setError(null);
    setExportedVideoUrl(null);

    try {
      const renderer = new VideoRenderer();
      const videoBlob = await renderer.exportVideo(project, (p) => {
        setProgress(p);
      });

      const url = URL.createObjectURL(videoBlob);
      setExportedVideoBlob(videoBlob);
      setExportedVideoUrl(url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Video export failed';
      setError(msg);
    } finally {
      setIsRendering(false);
    }
  };

  const handleDownloadVideo = () => {
    if (!exportedVideoUrl || !exportedVideoBlob) return;

    const ext = exportedVideoBlob.type.includes('mp4') ? 'mp4' : 'webm';
    const filename = `${project.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_720p.${ext}`;

    const a = document.createElement('a');
    a.href = exportedVideoUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Export Video</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Project Overview Details */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-950 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Project: {project.title}</span>
            <span className="font-mono text-sky-400">{project.aspectRatio}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{project.scenes.length} Scenes · {project.subtitles.length} Subtitles</span>
            <span className="text-emerald-400 font-medium">720p HD @ 30 FPS</span>
          </div>
        </div>

        {/* Progress or Render Action */}
        {isRendering && (
          <div className="space-y-3 py-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>{progress.statusText}</span>
              <span className="font-mono text-indigo-400 font-bold">{progress.percent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-150"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-950/40 border border-red-800/60 p-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Finished Video Player & Download */}
        {exportedVideoUrl && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-black aspect-video flex items-center justify-center">
              <video
                src={exportedVideoUrl}
                controls
                autoPlay
                className="max-h-full max-w-full"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadVideo}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 hover:from-indigo-500 hover:to-sky-400 transition-all cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Download Video File ({exportedVideoBlob?.type.includes('mp4') ? 'MP4' : 'WebM'})</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        {!exportedVideoUrl && !isRendering && (
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleStartRender}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Start Rendering (Free & Offline)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
