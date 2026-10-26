import { VideoProject, SubtitleItem } from '../types';
import { audioEngine } from './audioEngine';

export interface RenderProgress {
  percent: number;
  currentScene: number;
  totalScenes: number;
  statusText: string;
}

export class VideoRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private loadedImages: Map<string, HTMLImageElement> = new Map();

  constructor(canvas?: HTMLCanvasElement) {
    this.canvas = canvas || document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d', { alpha: false })!;
  }

  public setDimensions(aspectRatio: '9:16' | '16:9' | '1:1') {
    if (aspectRatio === '9:16') {
      this.canvas.width = 720;
      this.canvas.height = 1280;
    } else if (aspectRatio === '16:9') {
      this.canvas.width = 1280;
      this.canvas.height = 720;
    } else {
      this.canvas.width = 1080;
      this.canvas.height = 1080;
    }
  }

  public async preloadMedia(project: VideoProject): Promise<void> {
    const promises: Promise<void>[] = [];
    for (const scene of project.scenes) {
      if (scene.mediaUrl && !this.loadedImages.has(scene.mediaUrl)) {
        promises.push(
          new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              this.loadedImages.set(scene.mediaUrl, img);
              resolve();
            };
            img.onerror = () => {
              // Silently ignore broken images; fallback gradient will render
              resolve();
            };
            img.src = scene.mediaUrl;
          })
        );
      }
    }
    await Promise.all(promises);
  }

  public renderFrame(
    project: VideoProject,
    currentTime: number,
    totalDuration: number
  ) {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    // Clear
    ctx.fillStyle = '#050811';
    ctx.fillRect(0, 0, width, height);

    // Opening Title Screen
    if (currentTime < 2.0 && project.openingTitle) {
      this.drawOpeningTitle(project.openingTitle, currentTime, 2.0);
      return;
    }

    // Closing Title Screen
    const closingDuration = 2.5;
    if (currentTime > totalDuration - closingDuration && project.closingTitle) {
      this.drawClosingTitle(project.closingTitle, currentTime - (totalDuration - closingDuration), closingDuration);
      return;
    }

    // Determine current scene
    let accumulatedTime = project.openingTitle ? 2.0 : 0;
    let currentScene = project.scenes[0];
    let sceneStartTime = accumulatedTime;
    let sceneIndex = 0;

    for (let i = 0; i < project.scenes.length; i++) {
      const scene = project.scenes[i];
      if (currentTime >= accumulatedTime && currentTime <= accumulatedTime + scene.duration) {
        currentScene = scene;
        sceneStartTime = accumulatedTime;
        sceneIndex = i;
        break;
      }
      accumulatedTime += scene.duration;
    }

    if (!currentScene) {
      currentScene = project.scenes[project.scenes.length - 1];
      sceneIndex = project.scenes.length - 1;
    }

    const sceneProgress = Math.min(1, Math.max(0, (currentTime - sceneStartTime) / (currentScene.duration || 1)));

    // Draw Background Scene Media (with Ken Burns subtle movement)
    this.drawSceneBackground(currentScene, sceneProgress);

    // Scene Transition effect if near boundary
    const transitionWindow = 0.4;
    const timeIntoScene = currentTime - sceneStartTime;
    if (timeIntoScene < transitionWindow && sceneIndex > 0) {
      const alpha = 1 - timeIntoScene / transitionWindow;
      ctx.fillStyle = `rgba(5, 8, 17, ${alpha * 0.7})`;
      ctx.fillRect(0, 0, width, height);
    }

    // Draw Active Subtitle
    this.drawSubtitles(project, currentTime);

    // Subtle Brand Watermark (Vivek AI Video Studio)
    this.drawWatermark();
  }

  private drawSceneBackground(scene: { mediaUrl?: string; gradientColors?: [string, string]; text: string; visualKeyword?: string }, progress: number) {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    ctx.save();

    // Check if custom image exists
    const img = scene.mediaUrl ? this.loadedImages.get(scene.mediaUrl) : null;
    if (img && img.complete && img.naturalWidth > 0) {
      // Ken Burns slow zoom
      const zoom = 1 + progress * 0.08;
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-width / 2, -height / 2);

      // Cover scaling
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = width / height;
      let drawW = width;
      let drawH = height;
      let offX = 0;
      let offY = 0;

      if (imgRatio > canvasRatio) {
        drawW = height * imgRatio;
        offX = (width - drawW) / 2;
      } else {
        drawH = width / imgRatio;
        offY = (height - drawH) / 2;
      }

      ctx.drawImage(img, offX, offY, drawW, drawH);

      // Dark cinematic vignette
      ctx.restore();
      ctx.save();
      const vignette = ctx.createRadialGradient(width / 2, height / 2, width * 0.3, width / 2, height / 2, width * 0.85);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.65)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
      return;
    }

    // Gradient Fallback with Animated Procedural Aurora / Grid
    const colors = scene.gradientColors || ['#0f172a', '#1e1b4b'];
    const grad = ctx.createLinearGradient(0, 0, width * Math.cos(progress * Math.PI * 0.5), height);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(1, colors[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Geometric lines / subtle particle grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    const gridSize = 60;
    const shift = (progress * 25) % gridSize;

    for (let x = -gridSize; x < width + gridSize; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x + shift, 0);
      ctx.lineTo(x + shift, height);
      ctx.stroke();
    }
    for (let y = -gridSize; y < height + gridSize; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y + shift);
      ctx.lineTo(width, y + shift);
      ctx.stroke();
    }

    // Ambient Center Glow
    const glow = ctx.createRadialGradient(
      width / 2 + Math.sin(progress * Math.PI) * 40,
      height / 2 + Math.cos(progress * Math.PI) * 40,
      20,
      width / 2,
      height / 2,
      width * 0.6
    );
    glow.addColorStop(0, 'rgba(99, 102, 241, 0.18)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // Visual topic badge in scene background
    if (scene.visualKeyword) {
      ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.textAlign = 'center';
      ctx.fillText(scene.visualKeyword.toUpperCase(), width / 2, 70);
    }

    ctx.restore();
  }

  private drawSubtitles(project: VideoProject, currentTime: number) {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    // Find active subtitle
    let activeSub: SubtitleItem | null = null;
    for (const sub of project.subtitles) {
      if (currentTime >= sub.startTime && currentTime <= sub.endTime) {
        activeSub = sub;
        break;
      }
    }

    if (!activeSub) return;

    const style = project.subtitleStyle;
    const fontSize = style.fontSize || 32;
    const isBold = style.bold ? 'bold' : '600';
    ctx.font = `${isBold} ${fontSize}px "Outfit", "Plus Jakarta Sans", sans-serif`;

    const displayText = style.uppercase ? activeSub.text.toUpperCase() : activeSub.text;
    const lines = this.wrapText(displayText, width - 80);

    let yPos = height - 120;
    if (style.position === 'top') {
      yPos = 160;
    } else if (style.position === 'middle') {
      yPos = height / 2;
    }

    const lineHeight = fontSize * 1.35;
    const totalBlockHeight = lines.length * lineHeight;
    const startY = yPos - totalBlockHeight / 2;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    lines.forEach((line, i) => {
      const lineY = startY + i * lineHeight;
      const textMetrics = ctx.measureText(line);
      const textWidth = textMetrics.width;

      // Background highlight pill
      if (style.backgroundColor && style.backgroundColor !== 'transparent') {
        ctx.fillStyle = style.backgroundColor;
        const padX = 18;
        const padY = 8;
        const pillX = width / 2 - textWidth / 2 - padX;
        const pillY = lineY - lineHeight / 2 + padY / 2;
        const pillW = textWidth + padX * 2;
        const pillH = lineHeight - padY;

        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 8);
        ctx.fill();
      }

      // Stroke outline
      if (style.outlineColor) {
        ctx.strokeStyle = style.outlineColor;
        ctx.lineWidth = 5;
        ctx.lineJoin = 'round';
        ctx.strokeText(line, width / 2, lineY);
      }

      // Main Text
      ctx.fillStyle = style.color || '#ffffff';
      ctx.fillText(line, width / 2, lineY);
    });

    ctx.restore();
  }

  private drawOpeningTitle(title: string, progress: number, duration: number) {
    const { width, height } = this.canvas;
    const ctx = this.ctx;
    const alpha = Math.min(1, Math.sin((progress / duration) * Math.PI));

    ctx.save();
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.font = '800 48px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = this.wrapText(title, width - 100);
    const lineHeight = 58;
    const startY = height / 2 - (lines.length * lineHeight) / 2;

    lines.forEach((l, i) => {
      ctx.fillText(l, width / 2, startY + i * lineHeight);
    });

    ctx.restore();
  }

  private drawClosingTitle(closing: string, progress: number, duration: number) {
    const { width, height } = this.canvas;
    const ctx = this.ctx;
    const alpha = Math.min(1, Math.sin((progress / duration) * Math.PI));

    ctx.save();
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.font = '700 40px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = this.wrapText(closing, width - 100);
    const lineHeight = 50;
    const startY = height / 2 - (lines.length * lineHeight) / 2;

    lines.forEach((l, i) => {
      ctx.fillText(l, width / 2, startY + i * lineHeight);
    });

    ctx.restore();
  }

  private drawWatermark() {
    const { width, height } = this.canvas;
    const ctx = this.ctx;
    ctx.save();
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.textAlign = 'right';
    ctx.fillText('VIVEK AI VIDEO STUDIO', width - 24, height - 20);
    ctx.restore();
  }

  private wrapText(text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = this.ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  // Real offline video exporter utilizing MediaRecorder API
  public async exportVideo(
    project: VideoProject,
    onProgress: (p: RenderProgress) => void
  ): Promise<Blob> {
    this.setDimensions(project.aspectRatio);
    await this.preloadMedia(project);

    // Compute total duration
    const openingTime = project.openingTitle ? 2.0 : 0;
    const closingTime = project.closingTitle ? 2.5 : 0;
    const scenesDuration = project.scenes.reduce((acc, s) => acc + (s.duration || 5), 0);
    const totalDuration = openingTime + scenesDuration + closingTime;

    // Set up canvas capture stream
    const stream = this.canvas.captureStream(30);

    // Audio mixing
    const audioCtx = audioEngine.getContext();
    const dest = audioCtx.createMediaStreamDestination();

    // Start background music synthesizer if configured
    if (project.audioConfig.backgroundMusicName) {
      audioEngine.playBackgroundMusic('cinematicDrone', project.audioConfig.backgroundMusicVolume);
    }

    // Add audio tracks to stream
    const combinedTracks = [...stream.getVideoTracks(), ...dest.stream.getAudioTracks()];
    const combinedStream = new MediaStream(combinedTracks);

    // Check supported MIME type
    const mimeTypes = ['video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
    let selectedMime = 'video/webm';
    for (const m of mimeTypes) {
      if (MediaRecorder.isTypeSupported(m)) {
        selectedMime = m;
        break;
      }
    }

    const recorder = new MediaRecorder(combinedStream, {
      mimeType: selectedMime,
      videoBitsPerSecond: 3_500_000,
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    return new Promise((resolve, reject) => {
      recorder.onstop = () => {
        audioEngine.stopBackgroundMusic();
        const finalBlob = new Blob(chunks, { type: selectedMime });
        resolve(finalBlob);
      };

      recorder.onerror = (e) => {
        audioEngine.stopBackgroundMusic();
        reject(e);
      };

      recorder.start(100);

      // Render frames at 30 FPS
      const fps = 30;
      const totalFrames = Math.floor(totalDuration * fps);
      let currentFrame = 0;

      const renderInterval = setInterval(() => {
        const currentTime = currentFrame / fps;
        this.renderFrame(project, currentTime, totalDuration);

        currentFrame++;
        const percent = Math.min(100, Math.round((currentFrame / totalFrames) * 100));

        onProgress({
          percent,
          currentScene: Math.min(
            project.scenes.length,
            Math.floor((currentFrame / totalFrames) * project.scenes.length) + 1
          ),
          totalScenes: project.scenes.length,
          statusText: `Encoding frame ${currentFrame} / ${totalFrames} (${percent}%)`,
        });

        if (currentFrame >= totalFrames) {
          clearInterval(renderInterval);
          setTimeout(() => {
            recorder.stop();
          }, 300);
        }
      }, 1000 / fps);
    });
  }
}
