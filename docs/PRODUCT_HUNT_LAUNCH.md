# VeloWrite Product Hunt Launch Kit

This document prepares copy, assets, and launch workflow for introducing VeloWrite on Product Hunt.

## Positioning

VeloWrite is a fast, privacy-minded Markdown editor with an instantly usable web editor and a lightweight Tauri desktop preview for local-first writing.

The Product Hunt launch should not position VeloWrite as a finished paid product yet. Lead with what users can try today:

- Web Markdown editor: edit, preview, import, download, and export HTML.
- Desktop preview: native open/save, recent files, local history snapshots, offline-first workflow.
- Product direction: AI-native writing, private sync, and one-click publishing.

## Product Hunt Fields

### Product Name

VeloWrite

### Tagline Options

Preferred:

Fast Markdown writing in your browser and on desktop

Alternatives:

- A lightweight Markdown editor for web and desktop
- Local-first Markdown writing, without the heavy editor feel
- Try Markdown online, move serious writing to desktop
- A Tauri-powered Markdown editor built for speed

### Short Description

VeloWrite is a lightweight Markdown editor that starts in the browser and grows into a local-first desktop workflow. Use the free web editor to write, preview, import, and download Markdown instantly. Download the Tauri desktop preview when you need native file access, offline work, recent files, and local history snapshots.

### Product URL

https://velowrite.app/?utm_source=producthunt&utm_medium=launch

### Direct Demo URL

https://velowrite.app/web?utm_source=producthunt&utm_medium=demo

### Download URL

https://velowrite.app/download?utm_source=producthunt&utm_medium=download

### Pro Roadmap URL

https://velowrite.app/pro?utm_source=producthunt&utm_medium=roadmap

### Suggested Topics

- Productivity
- Writing
- Developer Tools
- Open Source
- Mac
- Windows
- Linux
- Artificial Intelligence

Use only the topics Product Hunt currently exposes in the submission form.

## Maker First Comment

Hi Product Hunt,

I am building VeloWrite, a lightweight Markdown editor for people who want a fast writing surface without the heavy editor feel.

The first preview has two parts:

1. A free web editor you can use immediately for Markdown editing, live preview, import, download, and HTML export.
2. A Tauri desktop preview for native file open/save, offline writing, recent files, and local history snapshots.

The goal is simple: let casual users try Markdown editing in the browser, then give serious writers a local-first desktop app when privacy, file access, and offline work matter.

VeloWrite is still early. AI commands, private sync, and one-click publishing are on the roadmap, but they are not active paid features yet. I am launching early to learn which workflow matters most: faster local editing, browser-based temporary writing, AI-native Markdown, sync, or publishing.

What I would love feedback on:

- Would you use a browser Markdown editor if it felt fast and private?
- What would make you download the desktop app instead of staying in the browser?
- Which Pro workflow is actually worth paying for: AI, sync, publishing, export, or something else?

You can try the web editor now, download the desktop preview, or join the Pro interest list if the roadmap matches your workflow.

Thanks for taking a look.

## Gallery Asset Plan

Product Hunt launches perform better when the gallery explains the product visually in a few seconds. Prepare 4-6 images.

Product Hunt currently recommends gallery images at 1270x760, and the post needs at least two gallery images before the gallery is visible on the post page.

### Required Assets

1. Thumbnail
   - Size target: square, high contrast.
   - Content: VeloWrite logo mark, product name, short phrase like "Fast Markdown".

2. Hero screenshot
   - URL/state: https://velowrite.app/
   - Show the landing page with the embedded editor visible.
   - Caption: "Start writing instantly in the browser."

3. Web editor screenshot
   - URL/state: https://velowrite.app/web
   - Show split editor and preview.
   - Caption: "Edit, preview, import, and download Markdown without installing anything."

4. Desktop download screenshot
   - URL/state: https://velowrite.app/download
   - Show platform installers and Preview Limits.
   - Caption: "Move to desktop for native files, offline work, and local history."

5. Pro roadmap screenshot
   - URL/state: https://velowrite.app/pro
   - Show free preview vs future Pro.
   - Caption: "AI, private sync, and publishing are planned after the local-first foundation."

6. Privacy screenshot
   - URL/state: https://velowrite.app/privacy
   - Show privacy/cookie messaging.
   - Caption: "Markdown content is not uploaded for normal web editing."

## Demo Video

A local Product Hunt demo video generator is available:

```bash
npm run launch:video
```

Default output:

```text
launch/product-hunt-video/velowrite-product-hunt-demo.mp4
launch/product-hunt-video/voiceover.txt
launch/product-hunt-video/captions.srt
launch/product-hunt-video/slides/
```

The default local voiceover uses ffmpeg's built-in `flite` voice so the video can be generated without paid services. The result is acceptable for an internal draft, but a more natural Product Hunt launch video should use a higher-quality TTS or a real maker voice.

### CatRouter TTS

The generator can use CatRouter's Gemini TTS-compatible API when credentials are available:

```bash
CATROUTER_API_KEY=... npm run launch:video
```

Optional settings:

```bash
CATROUTER_BASE_URL=https://api.catrouter.net
CATROUTER_TTS_VOICE=Kore
```

The script calls:

```text
POST /v1beta/models/gemini-2.5-flash-preview-tts:generateContent
```

with `responseModalities: ["AUDIO"]` and a `prebuiltVoiceConfig.voiceName`. If `CATROUTER_API_KEY` is not set, the script falls back to local flite audio.

Product Hunt accepts an optional YouTube or Loom video URL. Upload the generated MP4 to Loom or YouTube first, then paste that URL into Product Hunt.

## Website Checklist Before Launch

- Landing page loads fast on desktop and mobile.
- `/web` opens directly and lets users edit without signup.
- `/download` explains unsigned installer warnings clearly.
- `/pro` says Pro is roadmap/interest, not paid checkout.
- `/privacy`, `/terms`, `/refund`, `/license` return 200.
- Waitlist form works on landing and `/pro`.
- Product Hunt UTM links are used in launch copy.
- Vercel Analytics consent banner does not block first interaction.

## FAQ

### Is VeloWrite free?

The current public preview is free. The web editor is available without signup. Desktop preview builds are downloadable from GitHub Releases. Future AI, sync, publishing, advanced export, or commercial workflows may become Pro features.

### Is this another Electron Markdown editor?

No. The desktop app is built with Tauri and Rust. The goal is a smaller, faster local-first editor with a clean web-to-desktop adoption path.

### Does VeloWrite upload my Markdown?

Normal web editing, preview, and download run in the browser. Markdown content is not uploaded to VeloWrite servers for those actions. Browser drafts and settings use localStorage. Waitlist emails are processed through Loops.so.

### Is the desktop app signed?

Not yet. The Windows and macOS preview builds are unsigned, so SmartScreen or Gatekeeper may warn. The download page states this clearly.

### What platforms are available?

Current preview assets include Windows, Linux AppImage, Debian/Ubuntu DEB, Fedora/RHEL RPM, and unsigned Apple Silicon macOS DMG.

### What is planned next?

The roadmap focuses on AI-native Markdown commands, private sync, one-click publishing, better export, signing/notarization, and stronger desktop polish.

## Outreach Copy

### Twitter/X

Launching VeloWrite on Product Hunt today.

It is a lightweight Markdown editor with:

- Instant web editor
- Live preview and HTML export
- Tauri desktop preview
- Native file open/save
- Local history snapshots

AI, sync, and publishing are on the roadmap.

Try it: https://velowrite.app/web?utm_source=twitter&utm_medium=launch

### Reddit / Hacker News Style

I am building VeloWrite, a lightweight Markdown editor with an instantly usable web editor and a Tauri desktop preview.

The current preview supports Markdown editing, live preview, import/download, HTML export, native desktop open/save, recent files, and local history snapshots. It is intentionally early: no account system, no cloud sync, no active AI assistant yet.

I am looking for feedback from people who write Markdown daily: what would make you switch from a browser editor to a desktop app, and what features would actually be worth paying for later?

Demo: https://velowrite.app/web
Download: https://velowrite.app/download

### Email to Waitlist

Subject: VeloWrite is live on Product Hunt

Hi,

VeloWrite is now ready for early public feedback.

You can try the browser Markdown editor immediately, or download the desktop preview if you want native files, offline writing, recent files, and local history snapshots.

Try the web editor:
https://velowrite.app/web?utm_source=email&utm_medium=launch

Download desktop preview:
https://velowrite.app/download?utm_source=email&utm_medium=launch

If AI writing, private sync, or one-click publishing would make VeloWrite worth paying for, join the Pro interest list:
https://velowrite.app/pro?utm_source=email&utm_medium=launch

Thanks for testing an early build.

## Launch Day Workflow

### T-3 Days

- Capture gallery screenshots.
- Verify all links and waitlist forms.
- Ask 5-10 trusted users to test `/web` and `/download`.
- Prepare one short demo video or GIF if possible.

### T-1 Day

- Schedule or draft the Product Hunt post.
- Re-check legal pages and download warnings.
- Confirm Loops contact filtering works for `waitlist` and `pro-interest`.
- Prepare Twitter/X, Reddit, and email copy.

### Launch Day

- Publish Product Hunt post.
- Post maker first comment immediately.
- Share direct demo link, not just homepage.
- Reply to every serious comment with specific details.
- Track traffic, download clicks, waitlist signups, and Pro interest signups.

### T+1 Day

- Summarize feedback into GitHub issues.
- Identify the top 3 reasons users did or did not download desktop.
- Compare regular waitlist signups vs `pro-interest`.
- Decide the next release focus: desktop polish, sharing, AI, sync, or publishing.

## Metrics to Watch

- Product Hunt visits to `/`
- Click-through to `/web`
- Click-through to `/download`
- Installer download clicks
- Waitlist conversion rate
- Pro interest conversion rate
- Comments asking about signing, privacy, sync, AI, or publishing

## Current Honest Product Status

Use this wording when asked whether VeloWrite is production-ready:

VeloWrite is an early public preview. The browser editor is usable today for lightweight Markdown writing and preview. The desktop app is ready for dogfooding local Markdown workflows, but it is not yet a polished production release. Signing, notarization, sync, AI commands, and publishing workflows are still planned.
