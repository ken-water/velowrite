import React from "react";
import ReactDOM from "react-dom/client";
import {
  ChevronRight,
  Clock3,
  Code2,
  Download,
  GitBranch,
  Github,
  Mail,
  PanelLeft,
  Sparkles,
  Zap,
} from "lucide-react";
import "./styles.css";

const EditorApp = React.lazy(() => import("./EditorApp"));
const releaseVersion = "0.1.1";
const releaseBaseUrl = `https://github.com/ken-water/velomd/releases/download/v${releaseVersion}`;

const downloads = [
  {
    platform: "Windows",
    format: "NSIS installer",
    fileName: `VeloMD_${releaseVersion}_x64-setup.exe`,
    note: "Unsigned MVP installer for Windows x64.",
  },
  {
    platform: "Linux AppImage",
    format: "Portable package",
    fileName: `VeloMD_${releaseVersion}_amd64.AppImage`,
    note: "Portable Linux build. Make it executable before running.",
  },
  {
    platform: "Ubuntu / Debian",
    format: "DEB package",
    fileName: `VeloMD_${releaseVersion}_amd64.deb`,
    note: "For Debian-based Linux distributions.",
  },
  {
    platform: "Fedora / RHEL",
    format: "RPM package",
    fileName: `VeloMD-${releaseVersion}-1.x86_64.rpm`,
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
          VeloMD
        </a>
        <div className="nav-actions">
          <a href="https://github.com/ken-water/velomd" aria-label="GitHub">
            <Github size={18} />
          </a>
          <a href="/download">
            Download <Download size={16} />
          </a>
          <a href="/app">
            Open editor <ChevronRight size={16} />
          </a>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <Zap size={16} />
            Rust-speed Markdown for AI-native writers
          </div>
          <h1>VeloMD</h1>
          <p>
            Tired of heavy, slow Electron editors? VeloMD is a lightweight
            Markdown editor built with Tauri for instant launch, low memory, AI
            commands, local Git history, and one-click publishing.
          </p>
          <WaitlistForm />
          <div className="proof-row" aria-label="Product promises">
            <span>
              <Clock3 size={15} />
              Instant launch target
            </span>
            <span>
              <Download size={15} />
              Tiny desktop bundle
            </span>
            <span>
              <PanelLeft size={15} />
              Clean Typora-like flow
            </span>
          </div>
        </div>
        <div className="product-frame" aria-label="VeloMD editor preview">
          <React.Suspense fallback={<div className="loading-preview">Loading editor</div>}>
            <EditorApp />
          </React.Suspense>
        </div>
      </section>

      <section className="feature-band" aria-label="Core features">
        <div>
          <Sparkles size={21} />
          <h2>AI-native writing</h2>
          <p>Use /ai to continue, polish, summarize, and generate Mermaid diagrams.</p>
        </div>
        <div>
          <GitBranch size={21} />
          <h2>Invisible versioning</h2>
          <p>Local Git snapshots keep rollback and diff history close to the editor.</p>
        </div>
        <div>
          <Code2 size={21} />
          <h2>Publish pipeline</h2>
          <p>Turn Markdown into a fast static site for Vercel or GitHub Pages.</p>
        </div>
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
          VeloMD
        </a>
        <div className="nav-actions">
          <a href="/app">
            Open editor <ChevronRight size={16} />
          </a>
          <a href="https://github.com/ken-water/velomd/releases" target="_blank" rel="noreferrer">
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
          <h1>Download VeloMD</h1>
          <p>
            Get the current dogfooding build for Markdown reading, editing,
            preview, HTML export, recent files, and local history snapshots.
          </p>
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
                <a href={`${releaseBaseUrl}/${item.fileName}`}>
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

    const endpoint = import.meta.env.VITE_WAITLIST_ENDPOINT;
    if (!endpoint) {
      setState("done");
      return;
    }

    setState("loading");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, product: "velomd" }),
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
  if (window.location.pathname.startsWith("/app")) {
    return (
      <React.Suspense fallback={<div className="loading-screen">Loading editor</div>}>
        <EditorApp />
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
  </React.StrictMode>,
);
