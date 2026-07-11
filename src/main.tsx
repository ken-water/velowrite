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

function LandingPage() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <a className="wordmark" href="/">
          <span className="brand-mark">V</span>
          VeloMD
        </a>
        <div className="nav-actions">
          <a href="https://github.com/" aria-label="GitHub">
            <Github size={18} />
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

  return <LandingPage />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
);
