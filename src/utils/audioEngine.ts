/**
 * Web Audio and Speech Engine for Vivek AI Video Studio
 * Provides zero-external-dependency background music synthesis
 * and native browser/Android Text-To-Speech integration.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private bgGainNode: GainNode | null = null;
  private bgOscillators: OscillatorNode[] = [];
  private isBgPlaying: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getContext(): AudioContext {
    this.initContext();
    return this.ctx!;
  }

  // Synthesizes royalty-free background soundtrack on the fly
  public playBackgroundMusic(preset: 'cinematicDrone' | 'lofiChords' | 'epicPulsar' | 'ambientAir', volume: number = 0.25) {
    this.stopBackgroundMusic();
    this.initContext();
    if (!this.ctx) return;

    this.bgGainNode = this.ctx.createGain();
    this.bgGainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.bgGainNode.gain.linearRampToValueAtTime(Math.max(0.01, volume), this.ctx.currentTime + 1.5);
    this.bgGainNode.connect(this.ctx.destination);

    this.bgOscillators = [];
    const now = this.ctx.currentTime;

    if (preset === 'cinematicDrone') {
      // Deep sub bass + fifth + warm sine
      const freqs = [55, 82.4, 110, 164.8];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const filter = this.ctx!.createBiquadFilter();
        const oscGain = this.ctx!.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, now);

        oscGain.gain.setValueAtTime(0.25 / freqs.length, now);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(this.bgGainNode!);

        osc.start();
        this.bgOscillators.push(osc);
      });
    } else if (preset === 'lofiChords') {
      // Warm jazz chord root (D minor 9: D, F, A, C, E)
      const freqs = [146.83, 174.61, 220.0, 261.63, 329.63];
      freqs.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const filter = this.ctx!.createBiquadFilter();
        const lfo = this.ctx!.createOscillator();
        const lfoGain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);

        // subtle tape flutter
        lfo.frequency.setValueAtTime(1.5, now);
        lfoGain.gain.setValueAtTime(1.8, now);
        lfo.connect(osc.frequency);
        lfo.start();

        osc.connect(filter);
        filter.connect(this.bgGainNode!);

        osc.start();
        this.bgOscillators.push(osc, lfo);
      });
    } else if (preset === 'epicPulsar') {
      const freqs = [65.41, 130.81, 196.0];
      freqs.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(240, now);
        filter.Q.setValueAtTime(3, now);

        osc.connect(filter);
        filter.connect(this.bgGainNode!);

        osc.start();
        this.bgOscillators.push(osc);
      });
    } else {
      // ambientAir
      const freqs = [110, 164.81, 246.94, 329.63];
      freqs.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(this.bgGainNode!);
        osc.start();
        this.bgOscillators.push(osc);
      });
    }

    this.isBgPlaying = true;
  }

  public setBackgroundVolume(volume: number) {
    if (this.bgGainNode && this.ctx) {
      this.bgGainNode.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime + 0.1);
    }
  }

  public stopBackgroundMusic() {
    if (this.bgGainNode && this.ctx) {
      this.bgGainNode.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
      setTimeout(() => {
        this.bgOscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // Already stopped
          }
        });
        this.bgOscillators = [];
        this.isBgPlaying = false;
      }, 350);
    } else {
      this.bgOscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      this.bgOscillators = [];
      this.isBgPlaying = false;
    }
  }

  public getIsBgPlaying(): boolean {
    return this.isBgPlaying;
  }

  // Native Speech Synthesis (Web Speech API / Android native TTS)
  public getInstalledVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        return resolve([]);
      }
      let voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        return resolve(voices);
      }
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        resolve(voices);
      };
      // Fallback timeout in case onvoiceschanged does not fire
      setTimeout(() => {
        resolve(window.speechSynthesis.getVoices());
      }, 500);
    });
  }

  public speak(
    text: string,
    options: {
      voiceName?: string;
      lang?: string;
      rate?: number;
      pitch?: number;
      onEnd?: () => void;
      onError?: (err: unknown) => void;
    } = {}
  ): SpeechSynthesisUtterance | null {
    if (!('speechSynthesis' in window)) return null;

    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    if (options.rate) utterance.rate = options.rate;
    if (options.pitch) utterance.pitch = options.pitch;

    if (options.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const matched = voices.find((v) => v.name === options.voiceName);
      if (matched) {
        utterance.voice = matched;
      }
    }

    if (options.lang) {
      utterance.lang = options.lang;
    }

    if (options.onEnd) {
      utterance.onend = () => options.onEnd?.();
    }
    if (options.onError) {
      utterance.onerror = (e) => options.onError?.(e);
    }

    window.speechSynthesis.speak(utterance);
    return utterance;
  }

  public stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioEngine = new AudioEngine();
