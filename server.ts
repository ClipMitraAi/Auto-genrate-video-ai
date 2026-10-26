import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health and provider status
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    name: 'Vivek AI Video Studio',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI Script Generation / Enhancement
app.post('/api/gemini/script', async (req: Request, res: Response) => {
  try {
    const { topic, language = 'English', style = 'Motivational', targetDuration = 60 } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. You can use manual script entry or local templates in offline mode without an API key.',
      });
    }

    const prompt = `You are a professional video scriptwriter for short-form & long-form video content (Reels, Shorts, YouTube).
Create a complete, highly engaging video script about: "${topic}".
Language requested: ${language} (if Hindi or Hinglish, write natural Romanized Hinglish or Devnagari Hindi as appropriate).
Style: ${style}
Target duration: ~${targetDuration} seconds.

Return a JSON object with this exact structure:
{
  "title": "A catchy video title",
  "language": "${language}",
  "estimatedDurationSeconds": ${targetDuration},
  "scenes": [
    {
      "sceneIndex": 1,
      "text": "The spoken voiceover sentence or phrase for this scene.",
      "visualKeyword": "Cinematic visual description (e.g. dramatic mountain sunrise, lone runner in rain)",
      "duration": 4.5
    }
  ]
}
Ensure there are between 4 and 10 punchy scenes that fit the target duration.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({ error: 'Empty response from Gemini model.' });
    }

    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown generation error';
    console.error('Gemini Script Error:', message);
    return res.status(500).json({ error: message });
  }
});

// AI Scene Keyword Extraction
app.post('/api/gemini/scene-keywords', async (req: Request, res: Response) => {
  try {
    const { scriptSentences } = req.body;
    if (!Array.isArray(scriptSentences) || scriptSentences.length === 0) {
      return res.status(400).json({ error: 'scriptSentences array is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      // Offline fallback: basic heuristic keyword extraction
      const fallbackResults = scriptSentences.map((sentence: string, idx: number) => {
        const words = sentence.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3);
        return {
          sceneIndex: idx + 1,
          visualKeywords: words.slice(0, 3).join(', ') || 'cinematic abstract background',
          suggestedTone: 'neutral',
        };
      });
      return res.json({ scenes: fallbackResults, source: 'offline_fallback' });
    }

    const prompt = `Analyze each of these script sentences and provide 2-3 precise visual keywords or search phrases for video footage or high-resolution imagery:
${JSON.stringify(scriptSentences, null, 2)}

Return JSON:
{
  "scenes": [
    {
      "sceneIndex": 1,
      "visualKeywords": "exact visual query (e.g. golden hour skyline, programmer typing fast)",
      "suggestedTone": "inspirational"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ scenes: parsed.scenes || [], source: 'gemini' });
  } catch (err: unknown) {
    console.warn('Gemini keyword error, switching to offline fallback');
    const { scriptSentences = [] } = req.body;
    const fallbackResults = (scriptSentences as string[]).map((sentence: string, idx: number) => {
      const words = sentence.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter((w) => w.length > 3);
      return {
        sceneIndex: idx + 1,
        visualKeywords: words.slice(0, 3).join(', ') || 'cinematic background',
        suggestedTone: 'neutral',
      };
    });
    return res.json({ scenes: fallbackResults, source: 'offline_fallback' });
  }
});

// Optional Neural Text-To-Speech
app.post('/api/gemini/tts', async (req: Request, res: Response) => {
  try {
    const { text, voiceName = 'Kore' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'text is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key not configured. Using Android/browser native Text-to-Speech.',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [{ text: text.trim() }],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio returned from TTS engine.' });
    }

    return res.json({ audioBase64: base64Audio, format: 'audio/wav' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'TTS generation error';
    return res.status(500).json({ error: message });
  }
});

// Vite middleware or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        port: PORT,
        host: '0.0.0.0',
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vivek AI Video Studio server listening on port ${PORT}`);
  });
}

startServer();
