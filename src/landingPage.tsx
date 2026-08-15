import React from "react";
import {
  ChevronRight,
  CheckCircle2,
  Clock3,
  Code2,
  Download,
  FileText,
  FolderOpen,
  GitBranch,
  Github,
  HardDrive,
  ListChecks,
  LockKeyhole,
  Mail,
  PanelLeft,
  PlayCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

const webEditorHref = "/web?utm_source=landing&utm_medium=cta";
const downloadHref = "/download?utm_source=landing&utm_medium=cta";

const landingFaqs = [
  {
    question: "What is VeloWrite?",
    answer: "VeloWrite is a Markdown editor with a browser version for quick drafts and a lightweight desktop app for local files, PDF export, and history.",
  },
  {
    question: "Is VeloWrite free to use today?",
    answer: "The current public build is a free preview. AI writing, advanced export, and deeper recovery are candidates for Pro.",
  },
  {
    question: "Is VeloWrite a Typora alternative?",
    answer: "VeloWrite follows a focused writing direction while adding a browser editor, lightweight desktop builds, local files, and a public roadmap.",
  },
  {
    question: "Can I edit Markdown online without uploading files?",
    answer: "Yes. Normal web editing and preview keep document content in the browser rather than uploading it to VeloWrite servers.",
  },
  {
    question: "Does VeloWrite upload my Markdown documents?",
    answer: "Normal web editing and preview do not upload Markdown document content. Browser drafts stay in local storage.",
  },
  {
    question: "Can I try VeloWrite without installing anything?",
    answer: "Yes. Open the web editor and start writing immediately in a modern browser.",
  },
  {
    question: "Does VeloWrite work offline?",
    answer: "The desktop preview is the offline path for real local files. The web editor is for browser-based drafts and exports.",
  },
  {
    question: "What is the difference between the web editor and desktop app?",
    answer: "The web editor is faster to try. Desktop adds native local files, offline work, recent documents, PDF export, and history.",
  },
  {
    question: "Does VeloWrite handle math, tables, and code highlighting?",
    answer: "Yes. The preview supports tables, KaTeX math, highlighted code blocks, and multi-language examples.",
  },
  {
    question: "Will the desktop installer trigger a warning?",
    answer: "Preview installers are currently unsigned, so Windows SmartScreen or macOS Gatekeeper may require manual approval.",
  },
] as const;

function EditorPreviewSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "editor-skeleton compact" : "editor-skeleton"} aria-label="Editor preview loading">
      <div className="skeleton-topbar">
        <span />
        <span />
        <span />
        <div />
      </div>
      <div className="skeleton-grid">
        <section aria-label="Markdown skeleton">
          <strong>Markdown</strong>
          <p># Start Writing</p>
          <p>Use VeloWrite for quick drafts, live preview, and clean Markdown export.</p>
          <p>- Draft fast</p>
          <p>- Preview clearly</p>
          <p>- Move serious files to Desktop</p>
        </section>
        <section aria-label="Preview skeleton">
          <strong>Live Preview</strong>
          <h3>Start Writing</h3>
          <p>Use VeloWrite for quick drafts, live preview, and clean Markdown export.</p>
          <ul>
            <li>Draft fast</li>
            <li>Preview clearly</li>
            <li>Move serious files to Desktop</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

function LandingEditorPreview() {
  return (
    <div className="landing-editor-image-shell" aria-label="Markdown editor preview">
      <img
        className="landing-editor-image"
        src="/home-preview.png"
        alt="VeloWrite web editor preview"
        width="738"
        height="720"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    </div>
  );
}

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
          <h1>Write Markdown. Keep files.</h1>
          <p>
            Start in the browser to read, edit, preview, and export Markdown.
            Move to the desktop app when the document needs a real folder,
            direct save, offline access, or local history.
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
              Local desktop files
            </span>
            <span>
              <PanelLeft size={15} />
              Clean split preview
            </span>
          </div>
          <div className="hero-trust" aria-label="Privacy and workflow notes">
            <span>
              <ShieldCheck size={15} />
              Browser drafts stay local
            </span>
            <span>
              <FolderOpen size={15} />
              Desktop opens native files
            </span>
          </div>
        </div>
        <div className="product-frame" aria-label="VeloWrite online editor">
          <div className="frame-toolbar">
            <span>Live web editor</span>
            <a href={webEditorHref}>
              Full screen <ChevronRight size={14} />
            </a>
          </div>
          <LandingEditorPreview />
        </div>
      </section>

      <section className="mode-compare" aria-label="Web and desktop comparison">
        <div className="section-heading">
          <span>Choose the right workspace</span>
          <h2>Start in the browser. Keep important files on your computer.</h2>
        </div>
        <div className="compare-grid">
          <article className="compare-card">
            <div className="compare-icon">
              <Code2 size={20} />
            </div>
            <h3>Online editor</h3>
            <p>Open a draft quickly, check the rendered result, and download the source when you are done.</p>
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
            <p>Use it for documents that live on your computer and need to be opened again later.</p>
            <ul>
              <li>Open and save real files directly</li>
              <li>Work offline with files on your device</li>
              <li>Use local history snapshots for recovery</li>
              <li>AI, sync, and publishing remain on the roadmap</li>
            </ul>
            <a className="primary-link" href="/download?utm_source=compare&utm_medium=desktop">
              Download desktop <Download size={15} />
            </a>
          </article>
        </div>
      </section>

      <section className="trust-band" aria-label="Why people can trust VeloWrite">
        <div className="section-heading">
          <span>What to expect</span>
          <h2>Know what stays private, what is limited, and what you can recover.</h2>
        </div>
        <div className="trust-grid">
          <article>
            <ShieldCheck size={20} />
            <h3>Private by default</h3>
            <p>Browser drafts stay in local browser storage. Desktop files stay on your own disk unless you choose to export or share them.</p>
          </article>
          <article>
            <GitBranch size={20} />
            <h3>Recover recent edits</h3>
            <p>The preview includes local history and compare views for recovering accidental edits.</p>
          </article>
          <article>
            <ListChecks size={20} />
            <h3>See what is planned</h3>
            <p>Early feedback is tracked on the roadmap, with free preview work separated from future Pro features.</p>
          </article>
          <article>
            <LockKeyhole size={20} />
            <h3>Know before installing</h3>
            <p>The download page lists unsigned installers, missing features, and planned paid work before you install.</p>
          </article>
        </div>
      </section>

      <section className="video-showcase" aria-label="VeloWrite product video">
        <div className="section-heading">
          <span>Watch the workflow</span>
          <h2>See the path from a browser draft to a saved file.</h2>
        </div>
        <div className="video-shell">
          <div className="video-copy">
            <div className="compare-icon">
              <PlayCircle size={20} />
            </div>
            <h3>From browser draft to desktop app</h3>
            <p>
              This short demo shows the web editor, live preview, exports,
              local files, and the boundary between the free preview and Pro.
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
            <video controls preload="none" src="/product-hunt-demo.mp4">
              <a href="/product-hunt-demo.mp4">Watch the VeloWrite demo video</a>
            </video>
          </div>
        </div>
      </section>

      <section className="feature-band" aria-label="Core features">
        <div>
          <Sparkles size={21} />
          <h2>Start quickly</h2>
          <p>Start in the browser. Use the desktop app for files you keep locally.</p>
        </div>
        <div>
          <GitBranch size={21} />
          <h2>Recoverable writing</h2>
          <p>Desktop history snapshots give you a rollback point before a save replaces the file.</p>
        </div>
        <div>
          <Download size={21} />
          <h2>Move files when ready</h2>
          <p>Move to desktop when you need local folders, offline work, and history.</p>
        </div>
      </section>

      <section className="landing-faq" aria-label="VeloWrite FAQ">
        <div className="section-heading">
          <span>FAQ</span>
          <h2>Questions people ask before trying VeloWrite.</h2>
        </div>
        <div className="faq-grid">
          {landingFaqs.map((item) => (
            <article className="faq-item" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
        <div className="faq-cta-bar">
          <a className="text-link" href="/faq?utm_source=homepage_faq&utm_medium=cta">
            View all FAQ <ChevronRight size={15} />
          </a>
        </div>
      </section>

      <section className="resource-band" aria-label="Guides and release notes">
        <div className="section-heading">
          <span>Resources</span>
          <h2>Learn Markdown and see what changed.</h2>
        </div>
        <div className="resource-grid">
          <article className="resource-card">
            <FileText size={21} />
          <h3>Markdown Library</h3>
            <p>Read practical guides on syntax, long documents, editor choices, and local files.</p>
            <a className="text-link" href="/docs?utm_source=homepage_resources&utm_medium=resource">
              Open library <ChevronRight size={15} />
            </a>
          </article>
          <article className="resource-card">
            <Code2 size={21} />
            <h3>Online Markdown Editor</h3>
            <p>Learn when a browser Markdown editor is enough and when to move serious files to desktop.</p>
            <a className="text-link" href="/docs/online-markdown-editor?utm_source=homepage_resources&utm_medium=resource">
              Read article <ChevronRight size={15} />
            </a>
          </article>
          <article className="resource-card">
            <GitBranch size={21} />
            <h3>Release Notes</h3>
            <p>See what changed in the current preview and which features are still being considered for Pro.</p>
            <a className="text-link" href="/changelog?utm_source=homepage_resources&utm_medium=resource">
              Read changelog <ChevronRight size={15} />
            </a>
          </article>
          <article className="resource-card">
            <ListChecks size={21} />
            <h3>Public Roadmap</h3>
            <p>See recorded user requests, what stays free, and which features may become Pro later.</p>
            <a className="text-link" href="/roadmap?utm_source=homepage_resources&utm_medium=resource">
              View roadmap <ChevronRight size={15} />
            </a>
          </article>
        </div>
      </section>

      <section className="landing-waitlist" aria-label="Private beta signup">
          <div>
            <span>Desktop beta updates</span>
          <h2>Get an email when the next build is ready.</h2>
        </div>
        <WaitlistForm />
      </section>
      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  const footerGroups = [
    {
      title: "Product",
      links: [
        { label: "Web Editor", href: "/web" },
        { label: "Download", href: "/download" },
        { label: "Pro", href: "/pro" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Docs", href: "/docs" },
        { label: "Guide", href: "/guide" },
        { label: "Changelog", href: "/changelog" },
        { label: "Roadmap", href: "/roadmap" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "Feedback", href: "/feedback" },
        { label: "FAQ", href: "/faq" },
        { label: "GitHub", href: "https://github.com/ken-water/velowrite", external: true },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Refund", href: "/refund" },
        { label: "License", href: "/license" },
      ],
    },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <strong>VeloWrite</strong>
        <span>Write in the browser, then keep the Markdown file on your device.</span>
      </div>
      <nav className="footer-links" aria-label="Footer links">
        {footerGroups.map((group) => (
          <div className="footer-group" key={group.title}>
            <span>{group.title}</span>
            {group.links.map((link) => (
              <a
                href={link.href}
                key={link.href}
                {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </nav>
    </footer>
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

export { LandingPage };
