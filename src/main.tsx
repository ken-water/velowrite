import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import {
  ChevronRight,
  Clock3,
  Cloud,
  Code2,
  Cookie,
  Download,
  FileText,
  FolderOpen,
  GitBranch,
  Github,
  HardDrive,
  LockKeyhole,
  Mail,
  PanelLeft,
  PlayCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";
import "./styles.css";
import "katex/dist/katex.min.css";

const EditorApp = React.lazy(() => import("./EditorApp"));
const DemoCodeTabs = React.lazy(() => import("./DemoCodeTabs"));
const appVersion = "0.1.3";
const downloadVersion = "0.1.1";
const releaseBaseUrl = `https://github.com/ken-water/velowrite/releases/download/v${downloadVersion}`;
const webEditorHref = "/web?utm_source=landing&utm_medium=cta";
const downloadHref = "/download?utm_source=landing&utm_medium=cta";
const analyticsConsentKey = "velowrite:analytics-consent";

const downloads = [
  {
    platform: "Windows",
    format: "NSIS installer",
    fileName: `VeloWrite_${downloadVersion}_x64-setup.exe`,
    note: "Unsigned MVP installer for Windows x64.",
  },
  {
    platform: "Linux AppImage",
    format: "Portable package",
    fileName: `VeloWrite_${downloadVersion}_amd64.AppImage`,
    note: "Portable Linux build. Make it executable before running.",
  },
  {
    platform: "Ubuntu / Debian",
    format: "DEB package",
    fileName: `VeloWrite_${downloadVersion}_amd64.deb`,
    note: "For Debian-based Linux distributions.",
  },
  {
    platform: "Fedora / RHEL",
    format: "RPM package",
    fileName: `VeloWrite-${downloadVersion}-1.x86_64.rpm`,
    note: "For RPM-based Linux distributions.",
  },
  {
    platform: "macOS",
    format: "DMG",
    fileName: `VeloWrite_${downloadVersion}_aarch64.dmg`,
    note: "Unsigned Apple Silicon test build for macOS.",
  },
];

const legalPages = {
  privacy: {
    eyebrow: "Privacy and cookies",
    title: "Privacy Policy",
    intro: "How VeloWrite handles Markdown content, waitlist emails, analytics, and local storage in the current preview.",
    sections: [
      {
        title: "What VeloWrite is",
        body: [
          "VeloWrite provides a browser-based Markdown preview editor and a downloadable desktop app. The web editor is designed for quick drafting and previewing; the desktop app is designed for local-first file work.",
        ],
      },
      {
        title: "Markdown document content",
        body: [
          "VeloWrite does not upload the Markdown text you type in the web editor to our servers for normal editing, preview, or download. Web drafts and editor preferences may be saved in your own browser using localStorage so your draft can survive a refresh on the same device.",
          "The desktop app works with files on your computer through the Tauri runtime. Local history snapshots are stored on your device and are not sent to VeloWrite by default.",
        ],
      },
      {
        title: "Waitlist emails",
        body: [
          "If you join the waitlist, we collect the email address you submit and send it to Loops.so so we can manage beta invitations and product updates. Waitlist records may include simple metadata such as product name, source, and user group.",
          "You can ask to be removed from the waitlist by contacting us through the project repository or by using the unsubscribe link in any email we send.",
        ],
      },
      {
        title: "Analytics and cookies",
        body: [
          "We use Vercel Web Analytics to understand basic site usage, such as page views and download-link clicks. On this site, the analytics script is only loaded after you choose Allow analytics in the cookie banner.",
          "VeloWrite uses localStorage to remember your analytics choice. If you decline analytics, the analytics script is not loaded by this React app. You can clear your browser site data to reset the choice.",
        ],
      },
      {
        title: "Third-party services",
        body: [
          "Downloads are hosted by GitHub Releases. Site hosting is provided by Vercel. Waitlist processing is provided by Loops.so. These services may process technical request data such as IP address, browser, and timestamp according to their own policies.",
        ],
      },
      {
        title: "Current preview limitations",
        body: [
          "VeloWrite is still an early preview. Sync, AI commands, encrypted sharing, accounts, and paid plans are not active in the current public build. We will update this policy before launching features that materially change what data is processed.",
        ],
      },
    ],
  },
  terms: {
    eyebrow: "Preview terms",
    title: "Terms of Service",
    intro: "The current VeloWrite preview is provided for evaluation, feedback, and early product validation.",
    sections: [
      {
        title: "Preview access",
        body: [
          "The web editor and desktop builds are early preview software. You may use them to read, write, preview, export, and test Markdown workflows, but they are not yet guaranteed for production-critical work.",
        ],
      },
      {
        title: "Your content",
        body: [
          "You keep ownership of the Markdown documents and files you create or edit with VeloWrite. You are responsible for keeping backups of important files, especially while testing preview builds.",
        ],
      },
      {
        title: "Acceptable use",
        body: [
          "Do not use VeloWrite or its hosted services to distribute illegal content, abuse infrastructure, interfere with other users, or attempt to reverse engineer hosted waitlist or analytics systems.",
        ],
      },
      {
        title: "No warranty",
        body: [
          "The preview is provided as-is, without warranties of availability, data recovery, compatibility, or fitness for a particular purpose. Features may change as the product moves toward beta and paid plans.",
        ],
      },
      {
        title: "Future paid features",
        body: [
          "AI commands, private sync, publishing automation, team workflows, commercial licensing, and advanced exports may become paid features. We will publish pricing and plan terms before charging users.",
        ],
      },
    ],
  },
  refund: {
    eyebrow: "Purchases and refunds",
    title: "Refund Policy",
    intro: "VeloWrite does not currently sell paid licenses. This policy sets expectations before paid plans are introduced.",
    sections: [
      {
        title: "Current status",
        body: [
          "There are no paid VeloWrite plans in the current public preview, so there are no active purchases or refunds to process today.",
        ],
      },
      {
        title: "Future desktop licenses",
        body: [
          "When paid desktop licenses are introduced, we plan to offer a clear trial or preview window before purchase. Refund terms will be published before checkout becomes available.",
        ],
      },
      {
        title: "Future subscriptions",
        body: [
          "If sync, AI, publishing, or hosted services are sold as subscriptions, cancellation and renewal rules will be shown at purchase time. Refund eligibility may depend on billing period, usage, and local consumer rules.",
        ],
      },
      {
        title: "Accidental purchase handling",
        body: [
          "After payments launch, users should contact VeloWrite support with the order email, transaction identifier, and purchase date so we can review refund requests.",
        ],
      },
    ],
  },
  license: {
    eyebrow: "Desktop and web license",
    title: "License",
    intro: "A simple preview license for testing VeloWrite before the commercial model is finalized.",
    sections: [
      {
        title: "Preview use",
        body: [
          "You may download and use current VeloWrite preview builds for personal evaluation, feedback, and non-critical writing workflows.",
        ],
      },
      {
        title: "Redistribution",
        body: [
          "Please link to the official GitHub Releases page or velowrite.app download page instead of redistributing installer files, so users see the latest safety notes and platform limitations.",
        ],
      },
      {
        title: "Commercial use",
        body: [
          "Commercial and team licensing terms are not finalized. If you want to evaluate VeloWrite inside a company, treat the current build as preview software and avoid relying on it as a required production tool.",
        ],
      },
      {
        title: "Third-party code",
        body: [
          "VeloWrite depends on open-source libraries including React, Tauri, CodeMirror, markdown-it, and lucide-react. Their licenses continue to apply to those components.",
        ],
      },
      {
        title: "Brand and assets",
        body: [
          "The VeloWrite name, site copy, product positioning, and visual identity are reserved for the VeloWrite project unless a separate written permission is granted.",
        ],
      },
    ],
  },
} as const;

function LandingPage() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <a className="wordmark" href="/">
          <span className="brand-mark">V</span>
          VeloWrite
        </a>
        <div className="nav-actions">
          <a href="https://github.com/ken-water/velowrite" aria-label="GitHub">
            <Github size={18} />
          </a>
          <a href="/demo?utm_source=nav&utm_medium=cta">
            Demo <Rocket size={16} />
          </a>
          <a href={downloadHref}>
            Download <Download size={16} />
          </a>
          <a href="/pro?utm_source=nav&utm_medium=cta">
            Pro <Sparkles size={16} />
          </a>
          <a href={webEditorHref}>
            Try web editor <ChevronRight size={16} />
          </a>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <Zap size={16} />
            Start writing in the browser
          </div>
          <h1>Online Markdown editor, desktop when it matters.</h1>
          <p>
            Open the web editor instantly for reading, editing, preview, and
            HTML export. Move to the lightweight desktop app when you need
            native folders, direct save, offline work, and recoverable history.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href={webEditorHref}>
              Open Web Editor <ChevronRight size={17} />
            </a>
            <a className="secondary-link" href={downloadHref}>
              Download Desktop <Download size={17} />
            </a>
            <a className="secondary-link" href="/demo?utm_source=hero&utm_medium=cta">
              Interactive Demo <Rocket size={17} />
            </a>
          </div>
          <div className="proof-row" aria-label="Product promises">
            <span>
              <Clock3 size={15} />
              No install needed
            </span>
            <span>
              <HardDrive size={15} />
              Local-first desktop
            </span>
            <span>
              <PanelLeft size={15} />
              Clean split preview
            </span>
          </div>
        </div>
        <div className="product-frame" aria-label="VeloWrite online editor">
          <div className="frame-toolbar">
            <span>Web editor preview</span>
            <a href={webEditorHref}>
              Full screen <ChevronRight size={14} />
            </a>
          </div>
          <React.Suspense fallback={<div className="loading-preview">Loading editor</div>}>
            <EditorApp surface="web" />
          </React.Suspense>
        </div>
      </section>

      <section className="mode-compare" aria-label="Web and desktop comparison">
        <div className="section-heading">
          <span>Choose the right workspace</span>
          <h2>Web for a quick draft. Desktop for serious local work.</h2>
        </div>
        <div className="compare-grid">
          <article className="compare-card">
            <div className="compare-icon">
              <Code2 size={20} />
            </div>
            <h3>Online editor</h3>
            <p>Best for opening a draft fast, editing Markdown, checking preview, and downloading a copy.</p>
            <ul>
              <li>Runs directly in the browser</li>
              <li>Drafts autosave locally in this browser</li>
              <li>Export Markdown or HTML without signup</li>
              <li>Limited by browser file-system access</li>
            </ul>
            <a className="text-link" href="/web?utm_source=compare&utm_medium=web">
              Try online <ChevronRight size={15} />
            </a>
          </article>
          <article className="compare-card desktop-card">
            <div className="compare-icon">
              <FolderOpen size={20} />
            </div>
            <h3>Desktop app</h3>
            <p>Best for private writing, local Markdown vaults, offline editing, and native save workflows.</p>
            <ul>
              <li>Open and save real files directly</li>
              <li>Work offline with local-first storage</li>
              <li>Use local history snapshots for recovery</li>
              <li>Prepared for AI, sync, and publishing workflows</li>
            </ul>
            <a className="primary-link" href="/download?utm_source=compare&utm_medium=desktop">
              Download desktop <Download size={15} />
            </a>
          </article>
        </div>
      </section>

      <section className="video-showcase" aria-label="VeloWrite product video">
        <div className="section-heading">
          <span>Watch the workflow</span>
          <h2>See VeloWrite in about a minute.</h2>
        </div>
        <div className="video-shell">
          <div className="video-copy">
            <div className="compare-icon">
              <PlayCircle size={20} />
            </div>
            <h3>From browser draft to desktop workflow</h3>
            <p>
              A short Product Hunt demo covering the web editor, live preview,
              export flow, privacy boundary, desktop preview, and future Pro
              direction.
            </p>
            <div className="hero-actions">
              <a className="primary-link" href="/web?utm_source=homepage_video&utm_medium=cta">
                Try Web Editor <ChevronRight size={17} />
              </a>
              <a className="secondary-link" href="/demo?utm_source=homepage_video&utm_medium=cta">
                Open Interactive Demo <Rocket size={17} />
              </a>
            </div>
          </div>
          <div className="video-frame">
            <video controls preload="metadata" src="/product-hunt-demo.mp4">
              <a href="/product-hunt-demo.mp4">Watch the VeloWrite demo video</a>
            </video>
          </div>
        </div>
      </section>

      <section className="feature-band" aria-label="Core features">
        <div>
          <Sparkles size={21} />
          <h2>Fast first</h2>
          <p>Use the web editor immediately, then keep a tiny native app for daily local work.</p>
        </div>
        <div>
          <GitBranch size={21} />
          <h2>Recoverable writing</h2>
          <p>Desktop history snapshots make rollback part of the writing workflow.</p>
        </div>
        <div>
          <Download size={21} />
          <h2>Clear upgrade path</h2>
          <p>The browser is the first touch; native folders, offline work, and history drive desktop adoption.</p>
        </div>
      </section>

      <section className="landing-waitlist" aria-label="Private beta signup">
        <div>
          <span>Follow the desktop beta</span>
          <h2>Get updates when sync, AI commands, and publishing land.</h2>
        </div>
        <WaitlistForm />
      </section>
      <SiteFooter />
    </div>
  );
}

const demoSteps = [
  {
    title: "Write full screen",
    label: "Focused writing",
    copy: "Open a dense Markdown document in write mode and edit without losing context.",
    focus: "Full-screen Markdown editing",
  },
  {
    title: "Split view",
    label: "Edit and preview",
    copy: "Use split mode to compare complex Markdown with the rendered result in real time.",
    focus: "Live split preview",
  },
  {
    title: "Preview full screen",
    label: "Rendered output",
    copy: "Switch to preview mode to inspect equations, tables, Mermaid code, and structured writing.",
    focus: "Full-screen rendered preview",
  },
  {
    title: "Export your work",
    label: "Take it with you",
    copy: "Download Markdown or export clean HTML from the online editor.",
    focus: "Markdown and HTML export",
  },
  {
    title: "Move to desktop",
    label: "Local-first upgrade",
    copy: "When you need real file access, offline work, recent files, and history snapshots, move to the Tauri desktop app.",
    focus: "Desktop preview path",
  },
] as const;

const demoModes = [
  { mode: "write", label: "Write" },
  { mode: "split", label: "Split" },
  { mode: "preview", label: "Preview" },
] as const;
type DemoMode = (typeof demoModes)[number]["mode"];

function getDemoModeForStep(index: number): DemoMode {
  if (index === 0) return "write";
  if (index === 2) return "preview";
  return "split";
}

const complexDemoMarkdown = `# Research Memo: VeloWrite Launch

This document is intentionally dense so the demo can show real Markdown editing, not just a tiny note.

## Executive Summary

VeloWrite starts as a free online Markdown editor, then converts serious writers to a lightweight Tauri desktop app.

> The web editor is for instant trust. The desktop app is for local-first daily work.

## Mathematical Notes

Inline math works inside normal text: $E = mc^2$, $a^2 + b^2 = c^2$, and $\\Delta G = \\Delta H - T\\Delta S$.

Block equations are rendered cleanly:

$$
\\int_0^\\infty e^{-x^2}\\,dx = \\frac{\\sqrt{\\pi}}{2}
$$

$$
\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\varepsilon_0}
\\qquad
P(\\theta \\mid D) = \\frac{P(D \\mid \\theta)P(\\theta)}{P(D)}
$$

## Launch Metrics

| Funnel step | Current preview | Desktop conversion |
| --- | ---: | ---: |
| Open editor | Instant web page | Native app launch |
| Save workflow | Download copy | Direct local save |
| Privacy | Browser storage | Local-first files |
| Recovery | Browser draft | History snapshots |

## Product Flow

\`\`\`mermaid
flowchart LR
  Visitor[Product Hunt visitor] --> Web[Web editor]
  Web --> Preview[Live preview]
  Preview --> Export[Markdown / HTML export]
  Preview --> Desktop[Desktop preview]
  Desktop --> Pro[Future Pro: AI + Sync + Publish]
\`\`\`

## Engineering Checklist

- [x] Web editor loads without signup
- [x] Split preview supports tables, code, and math
- [x] Desktop preview supports native files
- [ ] AI-native commands
- [ ] Private sync
- [ ] One-click publishing

## Code Sample

\`\`\`ts
type Workflow = "write" | "preview" | "publish";

function nextStep(step: Workflow) {
  return step === "write" ? "preview" : "publish";
}
\`\`\`

## Language Gallery

\`\`\`python
from pathlib import Path

def count_words(text: str) -> int:
    return len(text.split())

print(count_words(Path("launch.md").read_text()))
\`\`\`

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

npm run build
npm run package:linux
\`\`\`

\`\`\`java
public record LaunchStep(String title, boolean done) {
    public String label() {
        return done ? "[x] " + title : "[ ] " + title;
    }
}
\`\`\`

\`\`\`javascript
const steps = ["write", "preview", "publish"];
const ready = steps.filter(Boolean).length > 0;
console.log({ ready });
\`\`\`
`;

function InteractiveDemoPage() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [activeMode, setActiveMode] = React.useState<DemoMode>("split");
  const step = demoSteps[activeStep];

  return (
    <div className="demo-page">
      <header className="landing-nav">
        <a className="wordmark" href="/">
          <span className="brand-mark">V</span>
          VeloWrite
        </a>
        <div className="nav-actions">
          <a href="/web?utm_source=demo_nav&utm_medium=cta">
            Web editor <ChevronRight size={16} />
          </a>
          <a href={downloadHref}>
            Download <Download size={16} />
          </a>
          <a href="/pro?utm_source=demo_nav&utm_medium=cta">
            Pro <Sparkles size={16} />
          </a>
        </div>
      </header>

      <main className="demo-shell">
        <section className="demo-hero">
          <div>
            <div className="eyebrow">
              <Rocket size={16} />
              Interactive Product Hunt demo
            </div>
            <h1>Try the VeloWrite workflow before you download.</h1>
            <p>
              Walk through the core writing flow: open the web editor, write
              Markdown, preview the rendered document, export your work, then
              move serious local files to desktop.
            </p>
          </div>
          <div className="demo-cta-panel">
            <span>Current step</span>
            <strong>{step.label}</strong>
            <p>{step.focus}</p>
            <div className="hero-actions">
              <a className="primary-link" href="/web?utm_source=demo_hero&utm_medium=cta">
                Open Full Editor <ChevronRight size={17} />
              </a>
              <a className="secondary-link" href="/download?utm_source=demo_hero&utm_medium=cta">
                Download Desktop <Download size={17} />
              </a>
            </div>
          </div>
        </section>

        <section className="demo-workspace" aria-label="Interactive VeloWrite demo">
          <aside className="demo-steps" aria-label="Demo steps">
            {demoSteps.map((item, index) => (
              <button
                className={index === activeStep ? "active" : ""}
                key={item.title}
                type="button"
                onClick={() => {
                  setActiveStep(index);
                  setActiveMode(getDemoModeForStep(index));
                }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.title}</strong>
                <small>{item.copy}</small>
              </button>
            ))}
          </aside>

          <div className="demo-product demo-product-fullscreen">
            <div className="frame-toolbar">
              <span>{step.focus}</span>
              <div className="demo-mode-tabs" aria-label="Demo view mode">
                {demoModes.map((item) => (
                  <button
                    className={activeMode === item.mode ? "active" : ""}
                    key={item.mode}
                    type="button"
                    onClick={() => setActiveMode(item.mode)}
                  >
                    {item.label}
                  </button>
                ))}
                <a href="/web?utm_source=demo_frame&utm_medium=cta&demo=complex">
                  Full editor <ChevronRight size={14} />
                </a>
              </div>
            </div>
            <React.Suspense fallback={<div className="loading-preview">Loading editor</div>}>
              <EditorApp
                key={activeMode}
                surface="web"
                initialMarkdown={complexDemoMarkdown}
                initialViewMode={activeMode}
              />
            </React.Suspense>
          </div>
        </section>

        <React.Suspense fallback={<div className="loading-preview">Loading code tabs</div>}>
          <DemoCodeTabs />
        </React.Suspense>

        <section className="demo-conversion" aria-label="Why desktop conversion matters">
          <article>
            <Code2 size={21} />
            <h2>Free online editor</h2>
            <p>
              Perfect for first contact: instant Markdown editing, live preview,
              import, and export from the browser.
            </p>
          </article>
          <article>
            <FolderOpen size={21} />
            <h2>Desktop preview</h2>
            <p>
              The natural next step for real files, offline writing, recent
              documents, and local history snapshots.
            </p>
          </article>
          <article>
            <Sparkles size={21} />
            <h2>Future Pro</h2>
            <p>
              AI-native writing, private sync, and one-click publishing are the
              paid workflow direction we want users to help shape.
            </p>
          </article>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function ProPage() {
  return (
    <div className="pro-page">
      <header className="landing-nav">
        <a className="wordmark" href="/">
          <span className="brand-mark">V</span>
          VeloWrite
        </a>
        <div className="nav-actions">
          <a href="/web?utm_source=pro_nav&utm_medium=cta">
            Web editor <ChevronRight size={16} />
          </a>
          <a href={downloadHref}>
            Download <Download size={16} />
          </a>
        </div>
      </header>

      <main className="pro-shell">
        <section className="pro-hero">
          <div>
            <div className="eyebrow">
              <Rocket size={16} />
              Pro roadmap
            </div>
            <h1>Free preview now. Pro workflows when the foundation is ready.</h1>
            <p>
              VeloWrite is currently free to test. Pro will focus on the expensive,
              high-value workflows that go beyond a local Markdown editor: AI,
              private sync, publishing, and advanced export.
            </p>
            <div className="hero-actions">
              <a className="primary-link" href="/web?utm_source=pro_hero&utm_medium=cta">
                Try Free Web Editor <ChevronRight size={17} />
              </a>
              <a className="secondary-link" href="/download?utm_source=pro_hero&utm_medium=cta">
                Download Preview <Download size={17} />
              </a>
            </div>
          </div>
          <div className="pro-panel" aria-label="Planned VeloWrite plans">
            <div>
              <span>Preview</span>
              <strong>Free</strong>
              <p>Markdown editing, preview, local files, browser drafts, and desktop history snapshots.</p>
            </div>
            <div>
              <span>Future Pro</span>
              <strong>TBD</strong>
              <p>AI commands, private sync, one-click publishing, advanced export, and commercial workflows.</p>
            </div>
          </div>
        </section>

        <section className="pro-grid" aria-label="Future Pro capabilities">
          <article>
            <WandSparkles size={22} />
            <h2>AI-native writing</h2>
            <p>Draft, rewrite, summarize, convert outlines, and generate Mermaid diagrams from Markdown context.</p>
          </article>
          <article>
            <Cloud size={22} />
            <h2>Private sync</h2>
            <p>Bring local-first notes across machines without forcing users into a heavy hosted workspace.</p>
          </article>
          <article>
            <Rocket size={22} />
            <h2>One-click publishing</h2>
            <p>Turn a Markdown file into a GitHub Pages or Vercel-backed static site from the editor workflow.</p>
          </article>
          <article>
            <LockKeyhole size={22} />
            <h2>Commercial controls</h2>
            <p>Licensing, export polish, and privacy-first defaults for people writing work documents every day.</p>
          </article>
        </section>

        <section className="pro-compare" aria-label="Free preview and future Pro comparison">
          <div className="section-heading">
            <span>Clear boundaries</span>
            <h2>What users can rely on today, and what they can follow next.</h2>
          </div>
          <div className="pro-table">
            <div className="pro-row pro-row-head">
              <span>Capability</span>
              <span>Free preview today</span>
              <span>Future Pro direction</span>
            </div>
            {[
              ["Markdown writing", "Web and desktop editing", "More structured writing workflows"],
              ["Local files", "Native desktop open/save", "Vault workflows and stronger recovery"],
              ["AI", "Not active", "Rewrite, summarize, continue, convert"],
              ["Sync", "Not active", "Private multi-device sync"],
              ["Publishing", "HTML export today", "Deploy to GitHub Pages or Vercel"],
              ["Pricing", "Free preview", "Published before checkout opens"],
            ].map(([capability, preview, pro]) => (
              <div className="pro-row" key={capability}>
                <span>{capability}</span>
                <span>{preview}</span>
                <span>{pro}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="pro-waitlist" aria-label="Pro interest signup">
          <div>
            <span>Shape Pro before pricing</span>
            <h2>Join the list if AI, sync, or publishing would make VeloWrite worth paying for.</h2>
          </div>
          <WaitlistForm source="pro" label="Join the Pro interest list" />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function DownloadPage() {
  return (
    <div className="download-page">
      <header className="landing-nav">
        <a className="wordmark" href="/">
          <span className="brand-mark">V</span>
          VeloWrite
        </a>
        <div className="nav-actions">
          <a href="/web?utm_source=download_nav&utm_medium=cta">
            Web editor <ChevronRight size={16} />
          </a>
          <a href="https://github.com/ken-water/velowrite/releases" target="_blank" rel="noreferrer">
            Releases <Github size={16} />
          </a>
        </div>
      </header>

      <main className="download-shell">
        <section className="download-hero">
          <div className="eyebrow">
            <Download size={16} />
            Desktop MVP
          </div>
          <h1>Download VeloWrite</h1>
          <p>
            Get the current preview build for native Markdown reading, editing,
            preview, HTML export, recent files, and local history snapshots.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="/web?utm_source=download_hero&utm_medium=cta">
              Try Web Editor <ChevronRight size={17} />
            </a>
          </div>
        </section>

        <section className="download-grid" aria-label="Download installers">
          {downloads.map((item) => (
            <article className="download-card" key={item.fileName}>
              <div>
                <h2>{item.platform}</h2>
                <span>{item.format}</span>
              </div>
              <p>{item.note}</p>
              {item.fileName ? (
                <a href={`${releaseBaseUrl}/${item.fileName}?utm_source=download_page&utm_medium=installer&utm_campaign=v${downloadVersion}`}>
                  <Download size={16} />
                  {item.fileName}
                </a>
              ) : (
                <button disabled>Planned</button>
              )}
            </article>
          ))}
        </section>

        <section className="preview-status" aria-label="Preview version status">
          <article>
            <h2>Works Today</h2>
            <ul>
              <li>Online Markdown editing, preview, and local browser draft autosave</li>
              <li>Desktop open, save, export HTML, recent files, and local history snapshots</li>
              <li>Windows, Linux, and unsigned Apple Silicon macOS test packages</li>
              <li>Privacy policy, cookie consent, and waitlist email handling</li>
            </ul>
          </article>
          <article>
            <h2>Preview Limits</h2>
            <ul>
              <li>No code signing yet on Windows or macOS</li>
              <li>No account system, cloud sync, encrypted sharing, or team workspace</li>
              <li>No active AI assistant or publishing automation in the public build</li>
              <li>Important writing should still be backed up outside the app</li>
            </ul>
          </article>
          <article>
            <h2>Planned Pro Path</h2>
            <ul>
              <li>AI writing commands, rewrite tools, and Mermaid generation</li>
              <li>Private sync and multi-device workflows</li>
              <li>One-click publishing to GitHub Pages or Vercel</li>
              <li>Advanced export, themes, and commercial licensing</li>
            </ul>
          </article>
        </section>

        <section className="download-notes" aria-label="Release notes">
          <h2>Before Testing</h2>
          <ul>
            <li>Website version {appVersion} adds preview legal pages and analytics consent.</li>
            <li>Current installer assets are version {downloadVersion}; new installers will be built only when requested.</li>
            <li>The Windows installer is not code-signed yet, so SmartScreen may warn during install.</li>
            <li>The macOS DMG is an unsigned Apple Silicon build; Gatekeeper may warn until signing and notarization are ready.</li>
            <li>Temporary read-only sharing is planned for a future web release.</li>
            <li>Installers are hosted on GitHub Releases; no VPS or custom download server is required.</li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function LegalPage({ page }: { page: keyof typeof legalPages }) {
  const content = legalPages[page];

  return (
    <div className="legal-page">
      <header className="landing-nav">
        <a className="wordmark" href="/">
          <span className="brand-mark">V</span>
          VeloWrite
        </a>
        <div className="nav-actions">
          <a href="/web?utm_source=privacy_nav&utm_medium=cta">
            Web editor <ChevronRight size={16} />
          </a>
          <a href={downloadHref}>
            Download <Download size={16} />
          </a>
        </div>
      </header>

      <main className="legal-shell">
        <div className="eyebrow">
          {page === "privacy" ? <ShieldCheck size={16} /> : <FileText size={16} />}
          {content.eyebrow}
        </div>
        <h1>{content.title}</h1>
        <p className="legal-updated">Last updated: July 18, 2026</p>
        <p className="legal-intro">{content.intro}</p>

        {content.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </main>

      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>VeloWrite</strong>
        <span>Local-first Markdown writing, with a web preview path.</span>
      </div>
      <nav aria-label="Legal and product links">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/refund">Refund</a>
        <a href="/license">License</a>
        <a href="/pro">Pro</a>
        <a href="/download">Download</a>
        <a href="https://github.com/ken-water/velowrite" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </nav>
    </footer>
  );
}

function CookieConsent({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (nextValue: "accepted" | "declined") => void;
}) {
  if (value) return null;

  return (
    <aside className="cookie-banner" aria-label="Cookie and analytics consent">
      <div className="cookie-copy">
        <Cookie size={19} />
        <p>
          We keep drafts in your browser and load analytics only if you allow it.
          Markdown content is not uploaded for normal web editing.
        </p>
      </div>
      <div className="cookie-actions">
        <a href="/privacy">Privacy</a>
        <button type="button" onClick={() => onChange("declined")}>
          Decline
        </button>
        <button type="button" className="allow-button" onClick={() => onChange("accepted")}>
          Allow analytics
        </button>
      </div>
    </aside>
  );
}

function WaitlistForm({
  source = "waitlist",
  label = "Join the private beta",
}: {
  source?: string;
  label?: string;
}) {
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || state === "loading") return;

    const endpoint = import.meta.env.VITE_WAITLIST_ENDPOINT || "/api/waitlist";

    setState("loading");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, product: "velowrite", source }),
      });
      setState(response.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <form className="waitlist" onSubmit={submit}>
      <label htmlFor={`email-${source}`}>{label}</label>
      <div className="input-row">
        <Mail size={18} />
        <input
          id={`email-${source}`}
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button type="submit">
          {state === "loading" ? "Joining" : "Join waitlist"}
        </button>
      </div>
      <p aria-live="polite">
        {state === "done" && "You're on the list. We'll send the beta invite soon."}
        {state === "error" && "Signup failed. Please try again."}
      </p>
    </form>
  );
}

function Router() {
  const searchParams = new URLSearchParams(window.location.search);
  const demoFrame = searchParams.get("utm_source") === "demo_frame";

  if (window.location.pathname.startsWith("/web")) {
    return (
      <React.Suspense fallback={<div className="loading-screen">Loading web editor</div>}>
        <EditorApp
          surface="web"
          initialMarkdown={demoFrame ? complexDemoMarkdown : undefined}
          initialViewMode={demoFrame ? "split" : undefined}
        />
      </React.Suspense>
    );
  }

  if (window.location.pathname.startsWith("/app")) {
    return (
      <React.Suspense fallback={<div className="loading-screen">Loading editor</div>}>
        <EditorApp surface="desktop" />
      </React.Suspense>
    );
  }

  if (window.location.pathname.startsWith("/download")) {
    return <DownloadPage />;
  }

  if (window.location.pathname.startsWith("/demo")) {
    return <InteractiveDemoPage />;
  }

  if (window.location.pathname.startsWith("/pro")) {
    return <ProPage />;
  }

  if (window.location.pathname.startsWith("/privacy")) {
    return <LegalPage page="privacy" />;
  }

  if (window.location.pathname.startsWith("/terms")) {
    return <LegalPage page="terms" />;
  }

  if (window.location.pathname.startsWith("/refund")) {
    return <LegalPage page="refund" />;
  }

  if (window.location.pathname.startsWith("/license")) {
    return <LegalPage page="license" />;
  }

  return <LandingPage />;
}

function AppRoot() {
  const [analyticsConsent, setAnalyticsConsent] = React.useState<string | null>(() => {
    return window.localStorage.getItem(analyticsConsentKey);
  });

  function updateAnalyticsConsent(nextValue: "accepted" | "declined") {
    window.localStorage.setItem(analyticsConsentKey, nextValue);
    setAnalyticsConsent(nextValue);
  }

  return (
    <>
      <Router />
      {analyticsConsent === "accepted" && <Analytics />}
      <CookieConsent value={analyticsConsent} onChange={updateAnalyticsConsent} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>,
);
