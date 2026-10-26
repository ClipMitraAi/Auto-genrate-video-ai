import React, { useState } from 'react';
import {
  Music,
  Volume2,
  VolumeX,
  Play,
  Square,
  Upload,
  CheckCircle2,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { VideoProject } from '../types';
import { BG_MUSIC_TRACKS, BgMusicTrack } from '../data/sampleMedia';
import { audioEngine } from '../utils/audioEngine';

interface AudioStudioProps {
  project: VideoProject;
  onUpdateProject: (updated: Partial<VideoProject>) => void;
}

export const AudioStudio: React.FC<AudioStudioProps> = ({
  project,
  onUpdateProject,
}) => {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const handleToggleTrack = (track: BgMusicTrack) => {
    if (playingTrackId === track.id) {
      audioEngine.stopBackgroundMusic();
      setPlayingTrackId(null);
    } else {
      audioEngine.playBackgroundMusic(track.synthesizerPreset, project.audioConfig.backgroundMusicVolume);
      setPlayingTrackId(track.id);
      onUpdateProject({
        audioConfig: {
          ...project.audioConfig,
          backgroundMusicName: track.name,
        },
      });
    }
  };

  const handleVolumeChange = (vol: number) => {
    audioEngine.setBackgroundVolume(vol);
    onUpdateProject({
      audioConfig: {
        ...project.audioConfig,
        backgroundMusicVolume: vol,
      },
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Audio Studio Header */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 sm:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-emerald-400">Web Audio Synthesizer</span>
          <span className="text-xs text-slate-500">·</span>
          <span className="text-xs text-slate-400">Zero Copyright Issues</span>
          <span className="text-xs text-slate-500">·</span>
          <span className="text-xs text-slate-400">Custom Audio Import</span>
        </div>
        <h2 className="text-xl font-bold text-white">Audio & Music Mixing Studio</h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Mix background scores with voiceover narration. Choose from real-time synthesized soundtracks or upload custom MP3/WAV tracks with independent volume and fade controls.
        </p>
      </div>

      {/* Volume Mix Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-semibold">
              <Music className="h-4 w-4 text-emerald-400" />
              <span>Background Music Volume</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              {Math.round(project.audioConfig.backgroundMusicVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={project.audioConfig.backgroundMusicVolume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-semibold">
              <Volume2 className="h-4 w-4 text-indigo-400" />
              <span>Voice Narration Volume</span>
            </span>
            <span className="font-mono text-indigo-400 font-bold">
              {Math.round(project.audioConfig.narrationVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={project.audioConfig.narrationVolume}
            onChange={(e) =>
              onUpdateProject({
                audioConfig: {
                  ...project.audioConfig,
                  narrationVolume: parseFloat(e.target.value),
                },
              })
            }
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Background Soundtracks List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">Synthesized Background Tracks (Royalty-Free)</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BG_MUSIC_TRACKS.map((track) => {
            const isPlaying = playingTrackId === track.id;
            const isSelected = project.audioConfig.backgroundMusicName === track.name;

            return (
              <div
                key={track.id}
                className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                  isSelected
                    ? 'border-emerald-500/60 bg-emerald-950/20'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{track.name}</span>
                    {isSelected && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-medium">
                        Active
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5 block">
                    {track.mood} · {track.bpm} BPM
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleTrack(track)}
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      isPlaying
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Square className="h-3 w-3 fill-current" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 fill-current" />
                        <span>Play</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
