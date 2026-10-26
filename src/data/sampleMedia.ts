import { FacelessTemplate } from '../types';

export interface VisualPreset {
  id: string;
  name: string;
  category: 'Cinematic' | 'Nature' | 'Tech' | 'Dark Minimal' | 'Cosmic';
  gradient: [string, string];
  accent: string;
  pattern: 'mesh' | 'grid' | 'aurora' | 'particles' | 'geometric';
  sampleKeyword: string;
}

export const VISUAL_PRESETS: VisualPreset[] = [
  {
    id: 'cinematic-dark',
    name: 'Cinematic Obsidian',
    category: 'Cinematic',
    gradient: ['#0f172a', '#1e1b4b'],
    accent: '#6366f1',
    pattern: 'aurora',
    sampleKeyword: 'dramatic dark cinema lighting with deep violet tones',
  },
  {
    id: 'cyber-neon',
    name: 'Cyberpunk Cobalt',
    category: 'Tech',
    gradient: ['#030712', '#0c4a6e'],
    accent: '#38bdf8',
    pattern: 'grid',
    sampleKeyword: 'futuristic matrix tech grid in glowing neon blue',
  },
  {
    id: 'golden-hour',
    name: 'Golden Peak Horizon',
    category: 'Nature',
    gradient: ['#1c1917', '#78350f'],
    accent: '#f59e0b',
    pattern: 'aurora',
    sampleKeyword: 'golden sunrise over high mountain ridges, sun flare',
  },
  {
    id: 'cosmic-nebula',
    name: 'Deep Cosmos Nebula',
    category: 'Cosmic',
    gradient: ['#020617', '#3b0764'],
    accent: '#c084fc',
    pattern: 'particles',
    sampleKeyword: 'deep space nebula with swirling interstellar dust',
  },
  {
    id: 'ocean-abyss',
    name: 'Bioluminescent Abyss',
    category: 'Nature',
    gradient: ['#042f2e', '#0f172a'],
    accent: '#2dd4bf',
    pattern: 'mesh',
    sampleKeyword: 'calm deep ocean depths with glowing bioluminescent rays',
  },
  {
    id: 'minimal-slate',
    name: 'Executive Slate',
    category: 'Dark Minimal',
    gradient: ['#0f172a', '#334155'],
    accent: '#94a3b8',
    pattern: 'geometric',
    sampleKeyword: 'clean luxury minimalist dark slate background with soft rim light',
  },
  {
    id: 'crimson-fire',
    name: 'Crimson Energy',
    category: 'Cinematic',
    gradient: ['#450a0a', '#18181b'],
    accent: '#ef4444',
    pattern: 'particles',
    sampleKeyword: 'high energy embers and glowing sparks rising in darkness',
  },
  {
    id: 'emerald-focus',
    name: 'Forest Canopy',
    category: 'Nature',
    gradient: ['#022c22', '#0f172a'],
    accent: '#34d399',
    pattern: 'mesh',
    sampleKeyword: 'dense mist floating through ancient pine forest canopy',
  },
];

export interface BgMusicTrack {
  id: string;
  name: string;
  mood: string;
  bpm: number;
  synthesizerPreset: 'cinematicDrone' | 'lofiChords' | 'epicPulsar' | 'ambientAir';
}

export const BG_MUSIC_TRACKS: BgMusicTrack[] = [
  {
    id: 'cinematic-depth',
    name: 'Cinematic Depth & Horizon',
    mood: 'Dramatic & Inspiring',
    bpm: 75,
    synthesizerPreset: 'cinematicDrone',
  },
  {
    id: 'lofi-midnight',
    name: 'Midnight Focus Lo-Fi',
    mood: 'Chill & Thoughtful',
    bpm: 82,
    synthesizerPreset: 'lofiChords',
  },
  {
    id: 'epic-momentum',
    name: 'Epic Momentum Pulsar',
    mood: 'High Energy & Action',
    bpm: 110,
    synthesizerPreset: 'epicPulsar',
  },
  {
    id: 'serene-zen',
    name: 'Serene Atmosphere',
    mood: 'Calm & Documentary',
    bpm: 60,
    synthesizerPreset: 'ambientAir',
  },
];

export const FACELESS_TEMPLATES: FacelessTemplate[] = [
  {
    id: 'motivational-grind',
    title: 'The Discipline Blueprint',
    category: 'Motivational',
    description: 'High-impact motivational reels with bold uppercase kinetic captions and dramatic pacing.',
    defaultAspectRatio: '9:16',
    suggestedDuration: 30,
    language: 'English',
    defaultVisualTheme: 'cinematic-dark',
    sampleScript:
      'Most people quit right before the breakthrough happens.\nDiscipline is choosing between what you want now and what you want most.\nWhen motivation fades, your daily routine takes over.\nPut in the silent work. Let your results make the noise.',
    sampleScenes: [
      {
        text: 'Most people quit right before the breakthrough happens.',
        visualKeyword: 'Athlete training in rain, silhouette at dusk',
        mediaUrl: '',
        mediaType: 'gradient',
        gradientColors: ['#0f172a', '#1e1b4b'],
        duration: 5.5,
        transition: 'zoom',
      },
      {
        text: 'Discipline is choosing between what you want now and what you want most.',
        visualKeyword: 'Clock ticking forward, cinematic macro lens',
        mediaUrl: '',
        mediaType: 'gradient',
        gradientColors: ['#18181b', '#3b0764'],
        duration: 6.0,
        transition: 'fade',
      },
      {
        text: 'When motivation fades, your daily routine takes over.',
        visualKeyword: 'Early morning city streets before sunrise, lone runner',
        mediaUrl: '',
        mediaType: 'gradient',
        gradientColors: ['#0f172a', '#0369a1'],
        duration: 5.5,
        transition: 'slide',
      },
      {
        text: 'Put in the silent work. Let your results make the noise.',
        visualKeyword: 'Mountain summit vista touching the clouds in sunlight',
        mediaUrl: '',
        mediaType: 'gradient',
        gradientColors: ['#1c1917', '#78350f'],
        duration: 6.0,
        transition: 'zoom',
      },
    ],
  },
  {
    id: 'hindi-motivation',
    title: 'सफलता की शुरुआत (Success Mindset)',
    category: 'Motivational',
    description: 'Powerful Hindi motivational speech crafted for YouTube Shorts and Instagram Reels.',
    defaultAspectRatio: '9:16',
    suggestedDuration: 28,
    language: 'Hindi',
    defaultVisualTheme: 'golden-hour',
    sampleScript:
      'सफलता एक दिन में नहीं मिलती, लेकिन एक दिन ज़रूर मिलती है।\nअपने सपनों को पाने के लिए मेहनत से कभी मत डरो।\nजब दुनिया कहे कि तुम नहीं कर सकते, वही सही समय है साबित करने का।\nआज से ही अपनी नई मंज़िल का आगाज़ करो।',
    sampleScenes: [
      {
        text: 'सफलता एक दिन में नहीं मिलती, लेकिन एक दिन ज़रूर मिलती है।',
        visualKeyword: 'Golden sunrise illuminating a lone traveler on path',
        mediaUrl: '',
        mediaType: 'gradient',
        gradientColors: ['#1c1917', '#78350f'],
        duration: 6.0,
        transition: 'zoom',
      },
      {
        text: 'अपने सपनों को पाने के लिए मेहनत से कभी मत डरो।',
        visualKeyword: 'Artisan crafting metal with bright glowing sparks',
        mediaUrl: '',
        mediaType: 'gradient',
        gradientColors: ['#450a0a', '#18181b'],
        duration: 6.0,
        transition: 'fade',
      },
      {
        text: 'जब दुनिया कहे कि तुम नहीं कर सकते, वही सही समय है साबित करने का।',
        visualKeyword: 'Dramatic thunderstorm clouds parting with brilliant light',
        mediaUrl: '',
        mediaType: 'gradient',
        gradientColors: ['#0f172a', '#1e1b4b'],
        duration: 6.5,
        transition: 'slide',
      },
      {
        text: 'आज से ही अपनी नई मंज़िल का आगाज़ करो।',
        visualKeyword: 'High altitude mountain summit flag fluttering in wind',
        mediaUrl: '',
        mediaType: 'gradient',
        gradientColors: ['#022c22', '#0f172a'],
        duration: 5.5,
        transition: 'zoom',
      },
    ],
  },
  {
    id: 'mindblowing-facts',
    title: '3 Mind-Bending Space Facts',
    category: 'Facts & Knowledge',
    description: 'Engaging cosmic and educational video format with high retention visuals.',
    defaultAspectRatio: '9:16',
    suggestedDuration: 32,
    language: 'English',
    defaultVisualTheme: 'cosmic-nebula',
    sampleScript:
      'Did you know that a day on Venus is longer than a year on Venus?\nIt takes Venus 243 Earth days to rotate once on its axis.\nMeanwhile, there is a giant cloud of alcohol in Sagittarius B2 containing billions of liters.\nAnd if two pieces of the same metal touch in outer space, they permanently fuse together.',
    sampleScenes: [
      {
        text: 'Did you know that a day on Venus is longer than a year on Venus?',
        visualKeyword: 'Swirling golden atmosphere of planet Venus in space',
        mediaUrl: '',
        mediaType: 'gradient',
        gradientColors: ['#451a03', '#1c1917'],
        duration: 6.0,
        transition: 'zoom',
      },
      {
        text: 'It takes Venus 243 Earth days to rotate once on its axis.',
        visualKeyword: 'Planetary orbit simulation around blazing sun',
        mediaUrl: '',
        mediaType: 'gradient',
        gradientColors: ['#020617', '#3b0764'],
        duration: 6.0,
        transition: 'fade',
      },
      {
        text: 'Meanwhile, there is a giant cloud of alcohol in Sagittarius B2 containing billions of liters.',
        visualKeyword: 'Deep space cosmic nebula glowing purple and cyan',
        mediaUrl: '',
        mediaType: 'gradient',
        gradientColors: ['#030712', '#0c4a6e'],
        duration: 6.5,
        transition: 'slide',
      },
      {
        text: 'And if two pieces of the same metal touch in outer space, they permanently fuse together.',
        visualKeyword: 'Cold welding of satellite parts in orbital darkness',
        mediaUrl: '',
        mediaType: 'gradient',
        gradientColors: ['#0f172a', '#334155'],
        duration: 6.5,
        transition: 'zoom',
      },
    ],
  },
  {
    id: 'youtube-landscape-tech',
    title: 'The AI Revolution Explained',
    category: 'Educational',
    description: 'Widescreen 16:9 documentary style video for YouTube essays and explainers.',
    defaultAspectRatio: '16:9',
    suggestedDuration: 36,
    language: 'English',
    defaultVisualTheme: 'cyber-neon',
    sampleScript:
      'We are living through the greatest technological leap in human history.\nArtificial intelligence is transforming how we write, create, and build tools.\nMachines can now reason across languages, images, and complex code.\nThe future will not belong to AI alone, but to humans who master it.',
    sampleScenes: [
      {
        text: 'We are living through the greatest technological leap in human history.',
        visualKeyword: 'Digital brain neural network activating with blue light',
        mediaUrl: '',
        mediaType: 'gradient',
        gradientColors: ['#030712', '#0c4a6e'],
        duration: 7.0,
        transition: 'fade',
      },
      {
        text: 'Artificial intelligence is transforming how we write, create, and build tools.',
        visualKeyword: 'Modern high-tech creative studio with code and screens',
        mediaUrl: '',
        mediaType: 'gradient',
        gradientColors: ['#0f172a', '#1e1b4b'],
        duration: 7.5,
        transition: 'slide',
      },
      {
        text: 'Machines can now reason across languages, images, and complex code.',
        visualKeyword: 'Multilingual data streams flowing into silicon processor',
        mediaUrl: '',
        mediaType: 'gradient',
        gradientColors: ['#18181b', '#3b0764'],
        duration: 7.5,
        transition: 'zoom',
      },
      {
        text: 'The future will not belong to AI alone, but to humans who master it.',
        visualKeyword: 'Human silhouette looking toward sunrise from glass skyscraper',
        mediaUrl: '',
        mediaType: 'gradient',
        gradientColors: ['#042f2e', '#0f172a'],
        duration: 7.0,
        transition: 'fade',
      },
    ],
  },
];
