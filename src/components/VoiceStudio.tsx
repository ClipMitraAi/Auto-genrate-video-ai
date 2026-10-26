import React, { useState, useEffect } from 'react';
import {
  Mic,
  Volume2,
  Square,
  Play,
  Languages,
  Sliders,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { VideoProject } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface VoiceStudioProps {
  project: VideoProject;
  onUpdateProject: (updated: Partial<VideoProject>) => void;
}

export const VoiceStudio: React.FC<VoiceStudioProps> = ({
  project,
  onUpdateProject,
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>(project.ttsVoice || '');
  const [rate, setRate] = useState<number>(project.ttsRate || 1.0);
  const [pitch, setPitch] = useState<number>(project.ttsPitch || 1.0);
  const [testText, setTestText] = useState<string>(
    project.language === 'Hindi'
      ? 'नमस्ते! विवेक एआई वीडियो स्टूडियो में आपका स्वागत है।'
      : 'Discipline is choosing between what you want now and what you want most.'
  );
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [neuralTtsLoading, setNeuralTtsLoading] = useState<boolean>(false);
  const [neuralAudioUrl, setNeuralAudioUrl] = useState<string | null>(null);
  const [neuralError, setNeuralError] = useState<string | null>(null);

  useEffect(() => {
    audioEngine.getInstalledVoices().then((loadedVoices) => {
      setVoices(loadedVoices);
      if (!selectedVoice && loadedVoices.length > 0) {
        // Find best match for project language
        const targetLang = project.language === 'Hindi' ? 'hi' : 'en';
        const matched = loadedVoices.find((v) => v.lang.startsWith(targetLang));
        if (matched) {
          setSelectedVoice(matched.name);
          onUpdateProject({ ttsVoice: matched.name });
        } else {
          setSelectedVoice(loadedVoices[0].name);
        }
      }
    });
  }, [project.language]);

  const handleSpeakPreview = () => {
    if (!testText.trim()) return;
    setIsSpeaking(true);

    audioEngine.speak(testText, {
      voiceName: selectedVoice,
      rate,
      pitch,
      lang: project.language === 'Hindi' ? 'hi-IN' : 'en-US',
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleStopSpeaking = () => {
    audioEngine.stopSpeaking();
    setIsSpeaking(false);
  };

  // Optional Neural TTS via Gemini endpoint
  const handleGenerateNeuralTts = async () => {
    setNeuralTtsLoading(true);
    setNeuralError(null);
    try {
      const res = await fetch('/api/gemini/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: testText,
          voiceName: 'Kore',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to synthesize neural audio.');
      }

      if (data.audioBase64) {
        const audioSrc = `data:${data.format || 'audio/wav'};base64,${data.audioBase64}`;
        setNeuralAudioUrl(audioSrc);
        const audio = new Audio(audioSrc);
        audio.play();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Neural TTS failed';
      setNeuralError(msg);
    } finally {
      setNeuralTtsLoading(false);
    }
  };

  // Preview all project scenes narration
  const handlePreviewFullScript = () => {
    const fullScript = project.scenes.map((s) => s.text).join('. ');
    if (!fullScript) return;
    setIsSpeaking(true);

    audioEngine.speak(fullScript, {
      voiceName: selectedVoice,
      rate,
      pitch,
      lang: project.language === 'Hindi' ? 'hi-IN' : 'en-US',
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 sm:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-sky-400">Offline-First Speech Studio</span>
          <span className="text-xs text-slate-500">·</span>
          <span className="text-xs text-slate-400">Hindi & English Engines</span>
        </div>
        <h2 className="text-xl font-bold text-white">AI Voice & Narration Engine</h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Vivek AI Video Studio integrates native Android on-device Text-to-Speech so your video narration generates 100% offline with zero cloud latency and no recurring subscription costs.
        </p>
      </div>

      {/* Voice Selection & Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls Column */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Select Installed Voice ({voices.length} detected)
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => {
                setSelectedVoice(e.target.value);
                onUpdateProject({ ttsVoice: e.target.value });
              }}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
              {voices.length === 0 && (
                <option value="">Default Android Native Voice</option>
              )}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-sky-400" />
                <span>Speech Rate</span>
              </span>
              <span className="font-mono text-sky-400 font-bold">{rate.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={1.8}
              step={0.1}
              value={rate}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setRate(val);
                onUpdateProject({ ttsRate: val });
              }}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-indigo-400" />
                <span>Voice Pitch</span>
              </span>
              <span className="font-mono text-indigo-400 font-bold">{pitch.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={0.6}
              max={1.5}
              step={0.1}
              value={pitch}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setPitch(val);
                onUpdateProject({ ttsPitch: val });
              }}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Test Speech Preview Column */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-400">Preview Sentence</label>
            <textarea
              rows={3}
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
            />

            {/* Audio Waveform Simulator */}
            <div className="h-12 w-full rounded-lg bg-slate-950 border border-slate-800/80 p-2 flex items-center justify-center gap-1">
              {[40, 65, 30, 85, 50, 95, 45, 70, 35, 60, 90, 40, 75, 50].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isSpeaking
                      ? 'bg-gradient-to-t from-indigo-500 to-sky-400 animate-pulse'
                      : 'bg-slate-800'
                  }`}
                  style={{
                    height: isSpeaking ? `${h}%` : '20%',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={isSpeaking ? handleStopSpeaking : handleSpeakPreview}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                {isSpeaking ? (
                  <>
                    <Square className="h-3.5 w-3.5 fill-current" />
                    <span>Stop Speech</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>Speak Preview</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePreviewFullScript}
                className="px-3 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                Read All Scenes
              </button>
            </div>

            {/* Optional Neural TTS button */}
            <div className="pt-2 border-t border-slate-800/80">
              <button
                disabled={neuralTtsLoading}
                onClick={handleGenerateNeuralTts}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-sky-400 hover:text-sky-300 bg-sky-950/40 hover:bg-sky-950/70 border border-sky-800/50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{neuralTtsLoading ? 'Synthesizing Neural Audio...' : 'Optional Gemini Neural TTS'}</span>
              </button>

              {neuralError && (
                <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{neuralError}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
