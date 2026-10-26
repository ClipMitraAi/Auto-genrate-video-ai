import React, { useEffect, useState } from 'react';
import {
  X,
  ShieldCheck,
  Cpu,
  Wifi,
  WifiOff,
  CheckCircle2,
  Info,
  Smartphone,
} from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [healthStatus, setHealthStatus] = useState<{
    hasGeminiKey: boolean;
    name: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealthStatus(data))
      .catch(() => {
        setHealthStatus({
          hasGeminiKey: false,
          name: 'Vivek AI Video Studio',
          status: 'offline',
        });
      });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Settings & Privacy</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Engine Status Strip */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Engine Architecture</span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Offline-First (Active)</span>
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs text-slate-400">
            <span>Optional Cloud AI (Gemini 3.8 Flash):</span>
            <span className={healthStatus?.hasGeminiKey ? 'text-indigo-400 font-medium' : 'text-slate-400'}>
              {healthStatus?.hasGeminiKey ? 'Configured & Ready' : 'Free Local Fallback Enabled'}
            </span>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Privacy & Storage Policy</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Vivek AI Video Studio is committed to full user privacy:
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>Projects, scripts, and media remain strictly on your local device or browser.</li>
            <li>No user scripts or audio recordings are transmitted to analytics servers.</li>
            <li>No recurring subscription fees for core local video editing and generation.</li>
          </ul>
        </div>

        {/* Android Permissions Documented */}
        <div className="space-y-3 pt-2 border-t border-slate-800/80">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Smartphone className="h-3.5 w-3.5 text-sky-400" />
            <span>Documented Android Permissions</span>
          </h4>
          <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 space-y-1.5 font-mono text-[11px] text-slate-400">
            <div>• <code className="text-sky-300">INTERNET</code>: Optional cloud generation & stock search</div>
            <div>• <code className="text-indigo-300">READ_MEDIA_IMAGES</code>: Selecting images for video clips</div>
            <div>• <code className="text-purple-300">READ_MEDIA_AUDIO</code>: Importing narration & custom soundtracks</div>
            <div>• <code className="text-emerald-300">RECORD_AUDIO</code>: Microphone recording in Voice Studio</div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
