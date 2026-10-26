export type AspectRatio = '9:16' | '16:9' | '1:1';

export type LanguageCode = 'English' | 'Hindi' | 'Hinglish';

export interface Scene {
  id: string;
  order: number;
  text: string;
  visualKeyword: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'gradient';
  gradientColors?: [string, string];
  duration: number; // in seconds
  transition: 'fade' | 'slide' | 'zoom' | 'none';
  customTitle?: string;
}

export interface SubtitleItem {
  id: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  text: string;
}

export interface SubtitleStyle {
  fontSize: number; // e.g. 28
  color: string; // e.g. '#ffffff'
  backgroundColor: string; // e.g. 'rgba(0,0,0,0.65)' or 'transparent'
  outlineColor: string; // e.g. '#000000'
  position: 'bottom' | 'middle' | 'top';
  bold: boolean;
  uppercase: boolean;
}

export interface AudioTrackConfig {
  narrationVolume: number; // 0 to 1
  backgroundMusicUrl?: string;
  backgroundMusicName?: string;
  backgroundMusicVolume: number; // 0 to 1
  fadeInSeconds: number;
  fadeOutSeconds: number;
  recordedNarrationBlob?: string; // base64 or blob URL
}

export interface VideoProject {
  id: string;
  title: string;
  description: string;
  aspectRatio: AspectRatio;
  language: LanguageCode;
  createdAt: number;
  updatedAt: number;
  scenes: Scene[];
  subtitles: SubtitleItem[];
  subtitleStyle: SubtitleStyle;
  audioConfig: AudioTrackConfig;
  targetDuration: number;
  openingTitle?: string;
  closingTitle?: string;
  ttsVoice?: string;
  ttsPitch?: number;
  ttsRate?: number;
}

export interface FacelessTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  defaultAspectRatio: AspectRatio;
  suggestedDuration: number;
  sampleScript: string;
  language: LanguageCode;
  defaultVisualTheme: string;
  sampleScenes: Omit<Scene, 'id' | 'order'>[];
}
