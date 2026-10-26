import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Maximize2, Volume2, VolumeX } from 'lucide-react';
import { VideoProject } from '../types';
import { VideoRenderer } from '../utils/videoRenderer';

interface VideoPlayerCanvasProps {
  project: VideoProject;
  className?: string;
}

export const VideoPlayerCanvas: React.FC<VideoPlayerCanvasProps> = ({ project, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<VideoRenderer | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);

  // Calculate total project duration
  const totalDuration =
    project.scenes.reduce((acc, s) => acc + s.duration, 0) +
    (project.openingTitle ? 2.0 : 0) +
    (project.closingTitle ? 2.5 : 0);

  // Initialize renderer and preload media
  useEffect(() => {
    if (canvasRef.current) {
      const renderer = new VideoRenderer(canvasRef.current);
      renderer.setDimensions(project.aspectRatio);
      renderer.preloadMedia(project).then(() => {
        renderer.renderFrame(project, currentTime, totalDuration);
      });
      rendererRef.current = renderer;
    }
  }, [project.aspectRatio, project.scenes, project.subtitles, project.subtitleStyle]);

  // Frame animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      return;
    }

    lastTimestampRef.current = performance.now();

    const loop = (now: number) => {
      const delta = (now - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = now;

      setCurrentTime((prev) => {
        const next = prev + delta;
        if (next >= totalDuration) {
          setIsPlaying(false);
          return 0;
        }
        if (rendererRef.current) {
          rendererRef.current.renderFrame(project, next, totalDuration);
        }
        return next;
      });

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying, totalDuration, project]);

  // Render on manual seek
  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (rendererRef.current) {
      rendererRef.current.renderFrame(project, time, totalDuration);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    handleSeek(0);
    setIsPlaying(true);
  };

  // Determine canvas aspect ratio CSS class
  const getAspectRatioClasses = () => {
    if (project.aspectRatio === '9:16') {
      return 'aspect-[9/16] max-h-[460px] sm:max-h-[520px]';
    } else if (project.aspectRatio === '16:9') {
      return 'aspect-[16/9] w-full max-h-[380px]';
    }
    return 'aspect-square max-h-[420px]';
  };

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      {/* Video Viewport Frame */}
      <div
        className={`relative overflow-hidden rounded-xl border border-slate-800 bg-black shadow-2xl flex items-center justify-center ${getAspectRatioClasses()}`}
      >
        <canvas
          ref={canvasRef}
          className="h-full w-full object-contain cursor-pointer"
          onClick={togglePlay}
        />

        {/* Play/Pause Overlay indicator */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600/80 text-white backdrop-blur-sm transition-transform hover:scale-110 shadow-lg cursor-pointer"
          >
            <Play className="h-6 w-6 fill-current ml-0.5" />
          </button>
        )}
      </div>

      {/* Scrub & Playback Controls Bar */}
      <div className="w-full max-w-md rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={totalDuration || 1}
            step={0.1}
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer h-1.5"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="flex items-center justify-center h-7 w-7 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current ml-0.5" />}
            </button>
            <button
              onClick={handleRestart}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
              title="Restart"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="font-mono text-xs text-slate-400">
            <span className="text-white font-semibold">{currentTime.toFixed(1)}s</span>
            <span> / </span>
            <span>{totalDuration.toFixed(1)}s</span>
          </div>

          <span className="text-[11px] font-medium text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-900/40">
            {project.aspectRatio}
          </span>
        </div>
      </div>
    </div>
  );
};
