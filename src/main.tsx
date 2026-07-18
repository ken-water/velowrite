import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import {
  ChevronRight,
  Clock3,
  Code2,
  Download,
  FolderOpen,
  GitBranch,
  Github,
  HardDrive,
  Mail,
  PanelLeft,
  Sparkles,
  Zap,
} from "lucide-react";
import "./styles.css";

const EditorApp = React.lazy(() => import("./EditorApp"));
const releaseVersion = "0.1.1";
const releaseBaseUrl = `https://github.com/ken-water/velowrite/releases/download/v${releaseVersion}`;
const webEditorHref = "/web?utm_source=landing&utm_medium=cta";
const downloadHref = "/download?utm_source=landing&utm_medium=cta";

const downloads = [
  {
    platform: "Windows",
    format: "NSIS installer",
    fileName: `VeloWrite_${releaseVersion}_x64-setup.exe`,
    note: "Unsigned MVP installer for Windows x64.",
  },
  {
    platform: "Linux AppImage",
    format: "Portable package",
    fileName: `VeloWrite_${releaseVersion}_amd64.AppImage`,
    note: "Portable Linux build. Make it executable before running.",
  },
  {
    platform: "Ubuntu / Debian",
    format: "DEB package",
    fileName: `VeloWrite_${releaseVersion}_amd64.deb`,
    note: "For Debian-based Linux distributions.",
  },
  {
    platform: "Fedora / RHEL",
    format: "RPM package",
    fileName: `VeloWrite-${releaseVersion}-1.x86_64.rpm`,
    note: "For RPM-based Linux distributions.",
  },
  {
    platform: "macOS",
    format: "DMG",
    fileName: "",
    note: "Planned after a macOS host, signing, and notarization path are ready.",
  },
];

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
          <a href={downloadHref}>
            Download <Download size={16} />
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
            Get the current dogfooding build for native Markdown reading,
            editing, preview, HTML export, recent files, and local history snapshots.
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
                <a href={`${releaseBaseUrl}/${item.fileName}?utm_source=download_page&utm_medium=installer&utm_campaign=v${releaseVersion}`}>
                  <Download size={16} />
                  {item.fileName}
                </a>
              ) : (
                <button disabled>Planned</button>
              )}
            </article>
          ))}
        </section>

        <section className="download-notes" aria-label="Release notes">
          <h2>Before Testing</h2>
          <ul>
            <li>Version {releaseVersion} fixes native Open, Save, and Export dialog permissions.</li>
            <li>The Windows installer is not code-signed yet, so SmartScreen may warn during install.</li>
            <li>AppImage is available for portable Linux testing; macOS DMG is planned.</li>
            <li>Temporary read-only sharing is planned for a future web release.</li>
            <li>Installers are hosted on GitHub Releases; no VPS or custom download server is required.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

function WaitlistForm() {
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
        body: JSON.stringify({ email, product: "velowrite" }),
      });
      setState(response.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <form className="waitlist" onSubmit={submit}>
      <label htmlFor="email">Join the private beta</label>
      <div className="input-row">
        <Mail size={18} />
        <input
          id="email"
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
  if (window.location.pathname.startsWith("/web")) {
    return (
      <React.Suspense fallback={<div className="loading-screen">Loading web editor</div>}>
        <EditorApp surface="web" />
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

  return <LandingPage />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router />
    <Analytics />
  </React.StrictMode>,
);
