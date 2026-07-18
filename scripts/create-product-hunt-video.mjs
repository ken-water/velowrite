import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = "launch/product-hunt-video";
const slideDir = join(outDir, "slides");
const audioDir = join(outDir, "audio");
const segmentDir = join(outDir, "segments");

mkdirSync(slideDir, { recursive: true });
mkdirSync(audioDir, { recursive: true });
mkdirSync(segmentDir, { recursive: true });

const width = 1280;
const height = 720;
const font = "Noto Sans";

const slides = [
  {
    id: "01",
    kicker: "Product Hunt preview",
    title: "VeloWrite",
    subtitle: "Fast Markdown writing in your browser and on desktop.",
    bullets: [
      "Free web editor for instant Markdown work",
      "Tauri desktop preview for local-first files",
      "Built toward AI, sync, and publishing workflows",
    ],
    visual: "hero",
    voice:
      "Meet VeloWrite. Open fast. Write Markdown. Preview instantly. Ship clean documents without a heavy editor in your way.",
    captions: ["Meet VeloWrite.", "Open fast.", "Write Markdown.", "Preview instantly.", "No heavy editor in your way."],
  },
  {
    id: "02",
    kicker: "Try it instantly",
    title: "Web Markdown",
    subtitle: "Open the web editor, type Markdown, and preview the final document side by side.",
    bullets: [
      "Live split preview",
      "Import Markdown files",
      "Download Markdown or export HTML",
    ],
    visual: "web",
    voice:
      "Start in the browser. Type Markdown on the left. See the finished page on the right. Import files, then download Markdown or clean HTML.",
    captions: ["Start in the browser.", "Type Markdown on the left.", "Preview on the right.", "Download Markdown or clean HTML."],
  },
  {
    id: "03",
    kicker: "When browser limits get in the way",
    title: "Move serious writing to desktop",
    subtitle: "The desktop preview gives Markdown writers native file access and offline work.",
    bullets: [
      "Native open and save",
      "Recent files",
      "Local history snapshots before overwrite",
    ],
    visual: "desktop",
    voice:
      "When the work gets serious, move to desktop. Open real local files. Keep writing offline. Return to recent documents and recover earlier versions.",
    captions: ["Move serious writing to desktop.", "Open real local files.", "Keep writing offline.", "Recover earlier versions."],
  },
  {
    id: "04",
    kicker: "Privacy-first preview",
    title: "Your Markdown stays in your workflow",
    subtitle: "Normal web editing and preview do not upload your document text to VeloWrite servers.",
    bullets: [
      "Browser drafts use local storage",
      "Analytics loads only after consent",
      "Desktop history stays on your device by default",
    ],
    visual: "privacy",
    voice:
      "VeloWrite keeps the privacy boundary clear. Normal web editing does not upload your document text. Drafts stay in browser storage. Analytics loads only after consent.",
    captions: ["A clear privacy boundary.", "Normal editing does not upload text.", "Drafts stay in browser storage.", "Analytics loads only after consent."],
  },
  {
    id: "05",
    kicker: "Future Pro direction",
    title: "Future Pro roadmap",
    subtitle: "The current preview is free. Pro will focus on workflows beyond basic editing.",
    bullets: [
      "AI rewrite, summarize, and continue",
      "Private sync across machines",
      "One-click publishing to GitHub Pages or Vercel",
    ],
    visual: "pro",
    voice:
      "The current preview is free. Future Pro goes beyond basic editing. AI-native writing. Private sync. One-click publishing to GitHub Pages or Vercel.",
    captions: ["The preview is free.", "Future Pro goes further.", "AI-native writing.", "Private sync.", "One-click publishing."],
  },
  {
    id: "06",
    kicker: "Looking for feedback",
    title: "What would make you switch?",
    subtitle: "Try the web editor, download the preview, or join the Pro interest list.",
    bullets: [
      "velowrite.app/web",
      "velowrite.app/download",
      "velowrite.app/pro",
    ],
    visual: "cta",
    voice:
      "Try VeloWrite today. Tell us what would make you switch. AI, sync, publishing, or simply a Markdown editor that stays out of your way.",
    captions: ["Try VeloWrite today.", "Tell us what would make you switch.", "AI, sync, publishing.", "Or an editor that stays out of your way."],
  },
];

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function text(x, y, content, size, fill = "#17201c", weight = "600", anchor = "start") {
  return `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${escapeXml(content)}</text>`;
}

function bullet(x, y, content) {
  return `
    <circle cx="${x}" cy="${y - 8}" r="5" fill="#3d8a68"/>
    ${text(x + 18, y, content, 27, "#33443e", "500")}
  `;
}

function wrapText(content, maxChars) {
  const words = content.split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function multilineText(x, y, content, options) {
  const {
    maxChars,
    size,
    fill = "#17201c",
    weight = "600",
    lineHeight = Math.round(size * 1.16),
  } = options;

  return wrapText(content, maxChars)
    .map((line, index) => text(x, y + index * lineHeight, line, size, fill, weight))
    .join("\n");
}

function mockEditor() {
  return `
    <rect x="680" y="112" width="500" height="430" rx="10" fill="#ffffff" stroke="#d7ddd6"/>
    <rect x="680" y="112" width="500" height="42" rx="10" fill="#15362d"/>
    ${text(706, 140, "VeloWrite web editor", 18, "#ffffff", "700")}
    <line x1="930" y1="154" x2="930" y2="542" stroke="#d7ddd6"/>
    ${text(706, 196, "# Launch Notes", 22, "#15362d", "800")}
    ${text(706, 236, "- Write Markdown", 19, "#3c4d47", "500")}
    ${text(706, 270, "- Preview instantly", 19, "#3c4d47", "500")}
    ${text(706, 304, "- Export HTML", 19, "#3c4d47", "500")}
    ${text(956, 198, "Launch Notes", 24, "#17201c", "800")}
    ${text(956, 240, "Write Markdown", 18, "#3c4d47", "700")}
    ${text(956, 274, "Preview instantly", 18, "#3c4d47", "700")}
    ${text(956, 308, "Export HTML", 18, "#3c4d47", "700")}
  `;
}

function desktopMock() {
  return `
    <rect x="704" y="118" width="450" height="392" rx="10" fill="#ffffff" stroke="#d7ddd6"/>
    <rect x="704" y="118" width="450" height="44" rx="10" fill="#22342e"/>
    <circle cx="728" cy="140" r="6" fill="#d84f2a"/>
    <circle cx="750" cy="140" r="6" fill="#e0b84c"/>
    <circle cx="772" cy="140" r="6" fill="#3d8a68"/>
    ${text(728, 206, "Recent files", 24, "#17201c", "800")}
    <rect x="728" y="230" width="170" height="34" rx="6" fill="#eef3ee"/>
    ${text(746, 253, "product-plan.md", 17, "#33443e", "700")}
    <rect x="728" y="276" width="170" height="34" rx="6" fill="#eef3ee"/>
    ${text(746, 299, "launch-notes.md", 17, "#33443e", "700")}
    <rect x="930" y="214" width="180" height="166" rx="8" fill="#f8f5ee" stroke="#d7ddd6"/>
    ${text(952, 248, "History", 22, "#17201c", "800")}
    ${text(952, 286, "Snapshot 12:02", 17, "#4f5f59", "600")}
    ${text(952, 318, "Snapshot 11:42", 17, "#4f5f59", "600")}
    ${text(952, 350, "Snapshot 10:58", 17, "#4f5f59", "600")}
  `;
}

function proMock() {
  return `
    <rect x="700" y="120" width="420" height="330" rx="10" fill="#ffffff" stroke="#d7ddd6"/>
    ${text(730, 172, "Preview", 22, "#47635b", "800")}
    ${text(730, 222, "Free", 48, "#15362d", "850")}
    <line x1="730" y1="260" x2="1090" y2="260" stroke="#d7ddd6"/>
    ${text(730, 308, "Future Pro", 22, "#47635b", "800")}
    ${text(730, 358, "AI + Sync + Publish", 38, "#d84f2a", "850")}
  `;
}

function makeVisual(slide) {
  if (slide.visual === "web") return mockEditor();
  if (slide.visual === "desktop") return desktopMock();
  if (slide.visual === "pro") return proMock();
  if (slide.visual === "privacy") {
    return `
      <rect x="728" y="120" width="360" height="330" rx="10" fill="#ffffff" stroke="#d7ddd6"/>
      <circle cx="908" cy="224" r="72" fill="#edf5ef"/>
      ${text(908, 236, "100%", 52, "#15362d", "850", "middle")}
      ${text(908, 294, "local-first preview", 24, "#47635b", "800", "middle")}
      <rect x="778" y="360" width="260" height="42" rx="7" fill="#15362d"/>
      ${text(908, 388, "Analytics only after consent", 18, "#ffffff", "800", "middle")}
    `;
  }
  if (slide.visual === "cta") {
    return `
      <rect x="720" y="128" width="390" height="260" rx="10" fill="#ffffff" stroke="#d7ddd6"/>
      ${text(915, 196, "Try it today", 42, "#15362d", "850", "middle")}
      <rect x="792" y="238" width="246" height="46" rx="8" fill="#15362d"/>
      ${text(915, 268, "Open Web Editor", 19, "#ffffff", "850", "middle")}
      <rect x="792" y="306" width="246" height="46" rx="8" fill="#d84f2a"/>
      ${text(915, 336, "Join Pro Interest", 19, "#ffffff", "850", "middle")}
    `;
  }
  return `
    <rect x="748" y="145" width="260" height="260" rx="32" fill="#15362d"/>
    ${text(878, 313, "V", 156, "#ffffff", "850", "middle")}
    ${text(878, 456, "VeloWrite", 42, "#15362d", "850", "middle")}
  `;
}

function makeSvg(slide) {
  const bullets = slide.bullets.map((item, index) => bullet(88, 392 + index * 48, item)).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#f4f1eb"/>
      <stop offset="1" stop-color="#e8eee4"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#1e2a25" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect x="54" y="44" width="1172" height="632" rx="18" fill="#ffffff" opacity="0.52" stroke="#d8ddd7"/>
  ${text(88, 96, "VeloWrite", 24, "#15362d", "850")}
  ${text(88, 150, slide.kicker.toUpperCase(), 18, "#47635b", "850")}
  ${multilineText(88, 226, slide.title, { maxChars: 23, size: 54, fill: "#0f251f", weight: "850", lineHeight: 58 })}
  ${multilineText(88, 324, slide.subtitle, { maxChars: 48, size: 24, fill: "#4a5a55", weight: "500", lineHeight: 34 })}
  ${bullets}
  <g filter="url(#shadow)">
    ${makeVisual(slide)}
  </g>
  ${text(1166, 640, `0${Number(slide.id)} / 06`, 18, "#66756f", "800", "end")}
</svg>`;
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed`);
  }
}

function getAudioMime(response) {
  return (
    response?.candidates?.[0]?.content?.parts?.find((part) => part.inlineData || part.inline_data)
      ?.inlineData?.mimeType ||
    response?.candidates?.[0]?.content?.parts?.find((part) => part.inlineData || part.inline_data)
      ?.inline_data?.mime_type ||
    ""
  );
}

function getAudioBase64(response) {
  return (
    response?.candidates?.[0]?.content?.parts?.find((part) => part.inlineData || part.inline_data)
      ?.inlineData?.data ||
    response?.candidates?.[0]?.content?.parts?.find((part) => part.inlineData || part.inline_data)
      ?.inline_data?.data
  );
}

function sampleRateFromMime(mimeType) {
  const match = mimeType.match(/rate=(\d+)/i);
  return match ? Number(match[1]) : 24000;
}

async function synthesizeWithCatRouter(text, wavPath, rawPath) {
  const apiKey = process.env.CATROUTER_API_KEY;
  if (!apiKey) return false;

  const baseUrl = (process.env.CATROUTER_BASE_URL || "https://api.catrouter.net").replace(/\/$/, "");
  const url = `${baseUrl}/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `Read this like a clear, confident middle-aged male product launch voiceover. Keep it energetic, premium, and natural, not flat. Text: ${text}`,
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: process.env.CATROUTER_TTS_VOICE || "Kore",
            },
          },
        },
      },
      model: "gemini-2.5-flash-preview-tts",
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`CatRouter TTS failed: ${response.status} ${message}`);
  }

  const json = await response.json();
  const mimeType = getAudioMime(json);
  const audioBase64 = getAudioBase64(json);
  if (!audioBase64) {
    throw new Error("CatRouter TTS response did not include audio data");
  }

  const audioBuffer = Buffer.from(audioBase64, "base64");
  writeFileSync(rawPath, audioBuffer);

  if (/wav|wave/i.test(mimeType)) {
    writeFileSync(wavPath, audioBuffer);
    return true;
  }

  const sampleRate = sampleRateFromMime(mimeType);
  run("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-f", "s16le", "-ar", String(sampleRate), "-ac", "1", "-i", rawPath, wavPath]);
  return true;
}

async function synthesizeVoice(text, voicePath, wavPath, rawPath) {
  if (await synthesizeWithCatRouter(text, wavPath, rawPath)) {
    return;
  }

  writeFileSync(voicePath, text);
  run("ffmpeg", [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-f",
    "lavfi",
    "-i",
    `flite=textfile=${voicePath}:voice=${process.env.LOCAL_TTS_VOICE || "awb"}`,
    "-af",
    "highpass=f=80,lowpass=f=12000,acompressor=threshold=-18dB:ratio=2.4:attack=18:release=220,loudnorm=I=-16:TP=-1.5:LRA=11,apad=pad_dur=0.7",
    wavPath,
  ]);
}

function splitSentences(text) {
  const sentences = text
    .replace(/\s+/g, " ")
    .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
    ?.map((sentence) => sentence.trim())
    .filter(Boolean);

  return sentences?.length ? sentences : [text];
}

function splitLongCaption(text, maxChars = 42) {
  if (text.length <= maxChars) return [text];

  const clauses = text
    .split(/(?<=[,:;])\s+/)
    .map((clause) => clause.trim())
    .filter(Boolean);
  const lines = [];
  let current = "";

  for (const clause of clauses) {
    const next = current ? `${current} ${clause}` : clause;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = clause;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);

  return lines.flatMap((line) => {
    if (line.length <= maxChars) return [line];

    const words = line.split(/\s+/);
    const chunks = [];
    let chunk = "";
    for (const word of words) {
      const next = chunk ? `${chunk} ${word}` : word;
      if (next.length > maxChars && chunk) {
        chunks.push(chunk);
        chunk = word;
      } else {
        chunk = next;
      }
    }
    if (chunk) chunks.push(chunk);
    return chunks;
  });
}

function addSentenceCaptions(lines, text, start, duration) {
  const sentences = Array.isArray(text)
    ? text
    : splitSentences(text).flatMap((sentence) => splitLongCaption(sentence));
  const usableDuration = Math.max(1, duration - 0.25);
  const totalWeight = sentences.reduce((sum, sentence) => sum + Math.max(sentence.length, 18), 0);
  let sentenceStart = start;

  sentences.forEach((sentence, index) => {
    const isLast = index === sentences.length - 1;
    const weight = Math.max(sentence.length, 18);
    const sentenceDuration = isLast
      ? start + usableDuration - sentenceStart
      : Math.max(1.35, (usableDuration * weight) / totalWeight);
    const sentenceEnd = Math.min(start + usableDuration, sentenceStart + sentenceDuration);

    lines.push(
      String(lines.filter((line) => /^\d+$/.test(line)).length + 1),
      `${secondsToSrtTime(sentenceStart)} --> ${secondsToSrtTime(sentenceEnd)}`,
      sentence,
      "",
    );

    sentenceStart = sentenceEnd;
  });
}

function secondsToSrtTime(seconds) {
  const ms = Math.round((seconds % 1) * 1000);
  const total = Math.floor(seconds);
  const s = total % 60;
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

const concatLines = [];
const srtLines = [];
let cursor = 0;

for (const slide of slides) {
  const svgPath = join(slideDir, `${slide.id}.svg`);
  const pngPath = join(slideDir, `${slide.id}.png`);
  const voicePath = join(audioDir, `${slide.id}.txt`);
  const wavPath = join(audioDir, `${slide.id}.wav`);
  const rawPath = join(audioDir, `${slide.id}.audio`);
  const segmentPath = join(segmentDir, `${slide.id}.mp4`);

  writeFileSync(svgPath, makeSvg(slide));
  writeFileSync(voicePath, slide.voice);

  run("convert", ["-background", "none", svgPath, pngPath]);
  await synthesizeVoice(slide.voice, voicePath, wavPath, rawPath);
  run("ffmpeg", [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-loop",
    "1",
    "-i",
    pngPath,
    "-i",
    wavPath,
    "-c:v",
    "libx264",
    "-tune",
    "stillimage",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "160k",
    "-shortest",
    segmentPath,
  ]);

  const duration = Number(
    execFileSync("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      segmentPath,
    ]).toString().trim(),
  );

  concatLines.push(`file '${join("segments", `${slide.id}.mp4`)}'`);
  addSentenceCaptions(srtLines, slide.captions || slide.voice, cursor, duration);
  cursor += duration;
}

writeFileSync(join(outDir, "concat.txt"), concatLines.join("\n"));
writeFileSync(join(outDir, "captions.srt"), srtLines.join("\n"));
writeFileSync(
  join(outDir, "voiceover.txt"),
  slides.map((slide) => `${slide.id}. ${slide.voice}`).join("\n\n"),
);

run("ffmpeg", [
  "-y",
  "-hide_banner",
  "-loglevel",
  "error",
  "-f",
  "concat",
  "-safe",
  "0",
  "-i",
  join(outDir, "concat.txt"),
  "-vf",
  `subtitles=${join(outDir, "captions.srt")}:force_style='FontName=Noto Sans,FontSize=15,PrimaryColour=&H00FFFFFF,BackColour=&HAA000000,BorderStyle=4,Outline=0,Shadow=0,MarginV=24'`,
  "-c:v",
  "libx264",
  "-pix_fmt",
  "yuv420p",
  "-c:a",
  "aac",
  "-b:a",
  "160k",
  "-movflags",
  "+faststart",
  join(outDir, "velowrite-product-hunt-demo.mp4"),
]);

console.log(`Created ${join(outDir, "velowrite-product-hunt-demo.mp4")}`);
console.log(`Voiceover script: ${join(outDir, "voiceover.txt")}`);
console.log(`Captions: ${join(outDir, "captions.srt")}`);
