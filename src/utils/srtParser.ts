import { SubtitleItem } from '../types';

export function formatSrtTimestamp(seconds: number): string {
  const pad = (n: number, z: number = 2) => ('00' + n).slice(-z);
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)},${pad(ms, 3)}`;
}

export function generateSrtContent(subtitles: SubtitleItem[]): string {
  return subtitles
    .map((sub, idx) => {
      const start = formatSrtTimestamp(sub.startTime);
      const end = formatSrtTimestamp(sub.endTime);
      return `${idx + 1}\n${start} --> ${end}\n${sub.text.trim()}\n`;
    })
    .join('\n');
}

export function parseSrtContent(srtText: string): SubtitleItem[] {
  const items: SubtitleItem[] = [];
  const normalized = srtText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const blocks = normalized.split(/\n\s*\n/).filter((b) => b.trim().length > 0);

  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length < 2) continue;

    // Line 0 is usually index, line 1 is timestamp, or line 0 is timestamp
    let timeLine = lines[0].includes('-->') ? lines[0] : lines[1];
    let textLines = lines[0].includes('-->') ? lines.slice(1) : lines.slice(2);

    if (!timeLine || !timeLine.includes('-->')) continue;

    const [startStr, endStr] = timeLine.split('-->').map((s) => s.trim());
    const startTime = parseTimestampSeconds(startStr);
    const endTime = parseTimestampSeconds(endStr);
    const text = textLines.join(' ');

    if (!isNaN(startTime) && !isNaN(endTime) && text) {
      items.push({
        id: 'sub-' + Math.random().toString(36).substring(2, 9),
        startTime,
        endTime,
        text,
      });
    }
  }

  return items;
}

function parseTimestampSeconds(ts: string): number {
  // 00:00:05,250 or 00:00:05.250
  const clean = ts.replace(',', '.');
  const parts = clean.split(':');
  if (parts.length === 3) {
    const h = parseFloat(parts[0]);
    const m = parseFloat(parts[1]);
    const s = parseFloat(parts[2]);
    return h * 3600 + m * 60 + s;
  }
  return 0;
}

export function downloadTextFile(filename: string, content: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
