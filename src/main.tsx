import React from "react";
import ReactDOM from "react-dom/client";
import { Cookie } from "lucide-react";
import "./styles.css";
import type { FaqItem } from "./contentTypes";

const PublicPageRouter = React.lazy(() => import("./publicPages").then((module) => ({ default: module.PublicPageRouter })));
const LandingPage = React.lazy(() => import("./landingPage").then((module) => ({ default: module.LandingPage })));
const VercelInsights = React.lazy(async () => {
  const [{ Analytics }, { SpeedInsights }] = await Promise.all([
    import("@vercel/analytics/react"),
    import("@vercel/speed-insights/react"),
  ]);

  return {
    default: function VercelInsightsLoader() {
      return (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      );
    },
  };
});
const downloadVersion = "0.2.10";
const downloadReleaseDate = "August 29, 2026";
const seoDate = "2026-08-29";
const releaseBaseUrl = `https://github.com/ken-water/velowrite/releases/download/v${downloadVersion}`;
const releaseTagUrl = `https://github.com/ken-water/velowrite/releases/tag/v${downloadVersion}`;
const webEditorHref = "/web?utm_source=landing&utm_medium=cta";
const downloadHref = "/download?utm_source=landing&utm_medium=cta";
const analyticsConsentKey = "velowrite:analytics-consent";
const exampleMarkdownKey = "velowrite:example-markdown";
const siteUrl = "https://velowrite.app";
const defaultSeoTitle = "VeloWrite - Online Markdown Editor and Lightweight Desktop App";
const defaultSeoDescription =
  "VeloWrite is a free online Markdown editor and desktop app for private drafts, live preview, PDF export, local files, and history recovery.";
const breadcrumbLabels: Record<string, string> = {
  "/web": "Web Editor",
  "/download": "Download",
  "/demo": "Demo",
  "/pro": "Pro Roadmap",
  "/roadmap": "Feedback Roadmap",
  "/docs": "Markdown Library",
  "/docs/markdown": "What Is Markdown",
  "/docs/markdown-history": "Markdown History",
  "/docs/future-of-markdown": "Future of Markdown",
  "/docs/online-markdown-editor": "Online Markdown Editor",
  "/docs/markdown-basics": "Markdown Basics",
  "/docs/markdown-for-writers": "Markdown for Writers",
  "/docs/markdown-for-developers": "Markdown for Developers",
  "/docs/advanced-markdown": "Advanced Markdown",
  "/docs/markdown-math": "Markdown Math",
  "/docs/markdown-code-blocks": "Markdown Code Blocks",
  "/docs/long-markdown-workflow": "Long Markdown Workflow",
  "/docs/local-first-markdown": "Local-First Markdown",
  "/docs/typora-alternative": "Typora Alternative",
  "/docs/markdown-to-blog": "Markdown to Blog",
  "/docs/markdown-editor-for-windows": "Markdown Editor for Windows",
  "/docs/markdown-editor-for-mac": "Markdown Editor for Mac",
  "/docs/markdown-editor-for-linux": "Markdown Editor for Linux",
  "/docs/preview-release-policy": "Preview Release Policy",
  "/docs/pdf-export-notes": "PDF Export Notes",
  "/docs/preview-build-limitations": "Preview Build Limitations",
  "/docs/private-online-markdown-editor": "Private Online Markdown Editor",
  "/docs/download-safety": "Download Safety",
  "/docs/markdown-meeting-notes": "Markdown Meeting Notes",
  "/guide": "Markdown Guide",
  "/changelog": "Changelog",
  "/faq": "FAQ",
  "/privacy": "Privacy Policy",
  "/terms": "Terms of Service",
  "/refund": "Refund Policy",
  "/license": "License",
  "/feedback": "Feedback",
};

const faqItems: readonly FaqItem[] = [
  {
    question: "What is VeloWrite?",
    answer: "VeloWrite is a Markdown editor with a browser editor for quick drafts and a desktop app for local files, PDF export, and history.",
  },
  {
    question: "What is the difference between web and desktop?",
    answer: "Use the web editor for quick drafts, preview, Markdown download, and HTML export. Use desktop for local files, direct save, offline work, recent files, PDF export, and history snapshots.",
  },
  {
    question: "Is VeloWrite free to use today?",
    answer: "Yes. The current public build is a free preview. AI writing, advanced export, and deeper recovery are planned for Pro.",
  },
  {
    question: "Can I edit Markdown online without uploading files?",
    answer: "Yes. Normal VeloWrite web editing and preview do not upload Markdown document content to VeloWrite servers. Browser drafts stay in localStorage on the same device.",
  },
  {
    question: "Does VeloWrite work offline?",
    answer: "The desktop preview is the offline path for real local files. Use the web editor for quick drafts, Markdown download, and HTML export.",
  },
];

const faqSchemaItems = faqItems.map((item) => ({
  "@type": "Question",
  name: item.question,
  acceptedAnswer: {
    "@type": "Answer",
    text: item.answer,
  },
}));

type SeoConfig = {
  title: string;
  description: string;
  canonicalPath: string;
  robots?: string;
};

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

function isTauriRuntime() {
  return "__TAURI_INTERNALS__" in window;
}

const docPageRoutes = {
  "/docs/markdown": "markdown",
  "/docs/markdown-history": "markdownHistory",
  "/docs/future-of-markdown": "futureOfMarkdown",
  "/docs/markdown-basics": "markdownBasics",
  "/docs/markdown-for-writers": "markdownForWriters",
  "/docs/markdown-for-developers": "markdownForDevelopers",
  "/docs/advanced-markdown": "advancedMarkdown",
  "/docs/markdown-math": "markdownMath",
  "/docs/markdown-code-blocks": "markdownCodeBlocks",
  "/docs/long-markdown-workflow": "longMarkdownWorkflow",
  "/docs/local-first-markdown": "localFirstMarkdown",
  "/docs/typora-alternative": "typoraAlternative",
  "/docs/online-markdown-editor": "onlineMarkdownEditor",
  "/docs/markdown-to-blog": "markdownToBlog",
  "/docs/markdown-editor-for-windows": "markdownEditorForWindows",
  "/docs/markdown-editor-for-mac": "markdownEditorForMac",
  "/docs/markdown-editor-for-linux": "markdownEditorForLinux",
  "/docs/preview-release-policy": "previewReleasePolicy",
  "/docs/pdf-export-notes": "pdfExportNotes",
  "/docs/preview-build-limitations": "previewBuildLimitations",
  "/docs/private-online-markdown-editor": "privateOnlineMarkdownEditor",
  "/docs/download-safety": "downloadSafety",
  "/docs/markdown-meeting-notes": "markdownMeetingNotes",
} as const;

const publishedDocPageRoutes = new Set<keyof typeof docPageRoutes>([
  "/docs/local-first-markdown",
  "/docs/markdown",
  "/docs/markdown-history",
  "/docs/future-of-markdown",
  "/docs/markdown-basics",
  "/docs/markdown-code-blocks",
  "/docs/long-markdown-workflow",
  "/docs/markdown-for-developers",
  "/docs/markdown-for-writers",
  "/docs/advanced-markdown",
  "/docs/markdown-math",
  "/docs/markdown-to-blog",
  "/docs/online-markdown-editor",
  "/docs/typora-alternative",
  "/docs/markdown-editor-for-windows",
  "/docs/markdown-editor-for-mac",
  "/docs/markdown-editor-for-linux",
  "/docs/preview-release-policy",
  "/docs/pdf-export-notes",
  "/docs/preview-build-limitations",
  "/docs/private-online-markdown-editor",
  "/docs/download-safety",
  "/docs/markdown-meeting-notes",
]);

const docArticleSeo: Record<keyof typeof docPageRoutes, { title: string; description: string }> = {
  "/docs/markdown": {
    title: "What Is Markdown? Plain Text Writing for Notes, Docs, and Blogs",
    description:
      "Learn what Markdown is, how it compares with rich text and HTML, where it works best, and how to start writing portable Markdown documents.",
  },
  "/docs/markdown-history": {
    title: "A Short History of Markdown - 2004, Aaron Swartz, and CommonMark",
    description:
      "A short history of Markdown's 2004 origin, its first Perl converter, Aaron Swartz's influence, and why CommonMark later became necessary.",
  },
  "/docs/future-of-markdown": {
    title: "The Future of Markdown Writing - Local Files, AI, and Export Readiness",
    description:
      "Read how Markdown writing is changing around local files, safer recovery, AI inside the document, export checks, and publishing.",
  },
  "/docs/markdown-basics": {
    title: "Markdown Basics - Headings, Lists, Links, Tables, Code, and Math",
    description:
      "A plain Markdown basics guide for headings, lists, links, images, tables, code fences, math blocks, and simple document structure.",
  },
  "/docs/markdown-for-writers": {
    title: "Markdown for Writers - Clean Drafts Without Formatting Drag",
    description:
      "How writers can use Markdown for essays, articles, notes, outlines, and publishable drafts without fighting a heavy word processor.",
  },
  "/docs/markdown-for-developers": {
    title: "Markdown for Developers - READMEs, Specs, Docs, and Release Notes",
    description:
      "A Markdown guide for README files, technical specs, API notes, code examples, changelogs, and documentation.",
  },
  "/docs/advanced-markdown": {
    title: "Advanced Markdown - Portable, Reviewable, Maintainable Documents",
    description:
      "Advanced Markdown practices for portable, reviewable documents: semantic line breaks, reference links, escaped text, stable anchors, and reusable templates.",
  },
  "/docs/markdown-math": {
    title: "Markdown Math with KaTeX - Inline and Block Formula Examples",
    description:
      "Use Markdown math with KaTeX for inline formulas, block equations, technical notes, study guides, and engineering documentation.",
  },
  "/docs/markdown-code-blocks": {
    title: "Markdown Code Blocks and Tabs - Multi-Language Documentation",
    description:
      "Write better Markdown code examples with fenced code blocks, syntax highlighting, language labels, and tabbed multi-language snippets.",
  },
  "/docs/long-markdown-workflow": {
    title: "How to Work Faster in Long Markdown Drafts",
    description:
      "Learn how shortcuts, tables, images, and quick marks help long Markdown files stay readable and easy to revisit.",
  },
  "/docs/local-first-markdown": {
    title: "Local-First Markdown Editing - Private Files and Offline Writing",
    description:
      "Understand local-first Markdown editing, why user-owned files matter, and when to move from a browser editor to a desktop app.",
  },
  "/docs/typora-alternative": {
    title: "Typora Alternative - Lightweight Local-First Markdown Editing",
    description:
      "Compare VeloWrite with Typora for browser drafts, lightweight Tauri desktop builds, local files, recovery history, and a public roadmap.",
  },
  "/docs/online-markdown-editor": {
    title: "Online Markdown Editor - Write, Preview, and Download Markdown",
    description:
      "Use VeloWrite as a free online Markdown editor for quick drafts, live preview, Markdown download, HTML export, and a desktop path for local files.",
  },
  "/docs/markdown-to-blog": {
    title: "Markdown to Blog - Draft Locally, Preview Clearly, Publish Later",
    description:
      "Draft blog posts in Markdown, preview the structure, export HTML, and keep the source file ready for later publishing.",
  },
  "/docs/markdown-editor-for-windows": {
    title: "Markdown Editor for Windows - VeloWrite Desktop Preview",
    description:
      "Try VeloWrite on Windows for Markdown editing, local files, recent documents, local history, Open with support, and installer notes.",
  },
  "/docs/markdown-editor-for-mac": {
    title: "Markdown Editor for Mac - Local-First Markdown Writing",
    description:
      "What Mac users should expect from VeloWrite, including Apple Silicon DMG status, local files, preview limits, and future signing plans.",
  },
  "/docs/markdown-editor-for-linux": {
    title: "Markdown Editor for Linux - AppImage, DEB, RPM, and Local Files",
    description:
      "Use VeloWrite on Linux with AppImage, DEB, RPM, browser editing, local files, and a lightweight Tauri desktop app.",
  },
  "/docs/preview-release-policy": {
    title: "How VeloWrite Preview Releases Work - Versions, Downloads, and Changelog",
    description:
      "Understand how VeloWrite preview versions, GitHub Releases, installer assets, changelog entries, and download page dates fit together.",
  },
  "/docs/pdf-export-notes": {
    title: "Markdown to PDF Export Notes - Tables, Chinese Text, and Preview Limits",
    description:
      "Understand VeloWrite PDF export for Markdown documents, including cover pages, contents, tables, Chinese text, page settings, watermarks, and preview limits.",
  },
  "/docs/preview-build-limitations": {
    title: "Preview Build Limitations - What VeloWrite Still Needs",
    description:
      "See what the current VeloWrite preview can do, what still needs work, and what to check before relying on a build.",
  },
  "/docs/private-online-markdown-editor": {
    title: "Private Online Markdown Editor - Browser Drafts, Consent, and Local Files",
    description:
      "Understand what stays in your browser when you use a private online Markdown editor, how analytics consent works, and when to move important files to desktop.",
  },
  "/docs/download-safety": {
    title: "Download Safety for VeloWrite Preview Builds",
    description:
      "Check official VeloWrite download sources, version matching, unsigned installer warnings, first-run testing, and how to report suspicious files.",
  },
  "/docs/markdown-meeting-notes": {
    title: "Markdown Meeting Notes Template - Decisions, Actions, and Follow-up",
    description:
      "Use a reusable Markdown meeting notes template for decisions, action items, open questions, project context, and follow-up work.",
  },
};

function routeSeo(pathname: string): SeoConfig {
  const normalizedPath = normalizePath(pathname);
  const articleSeo = publishedDocPageRoutes.has(normalizedPath as keyof typeof docPageRoutes)
    ? docArticleSeo[normalizedPath as keyof typeof docArticleSeo]
    : undefined;
  if (articleSeo) {
    return {
      title: articleSeo.title,
      description: articleSeo.description,
      canonicalPath: normalizedPath,
    };
  }

  if (matchesRoute(pathname, "/web")) {
    return {
      title: "VeloWrite Web Editor - Private Online Markdown Editing",
      description:
        "Open VeloWrite in the browser to write Markdown, preview rendered output, export HTML, and download .md files without creating an account.",
      canonicalPath: "/web",
    };
  }

  if (matchesRoute(pathname, "/download")) {
    return {
      title: "Download VeloWrite - Windows, macOS, and Linux Markdown App",
      description:
        "Download the VeloWrite desktop preview for Windows, macOS Apple Silicon, AppImage, Debian, and RPM Linux.",
      canonicalPath: "/download",
    };
  }

  if (matchesRoute(pathname, "/demo")) {
    return {
      title: "VeloWrite Demo - Markdown Editing, Preview, Math, and Code Tabs",
      description:
        "Try the VeloWrite interactive demo with complex Markdown, live preview, math rendering, tables, and multi-language code tabs.",
      canonicalPath: "/demo",
    };
  }

  if (matchesRoute(pathname, "/pro")) {
    return {
      title: "VeloWrite Pro Roadmap - AI, Sync, and Publishing Workflows",
      description:
        "See VeloWrite Pro plans for pricing, AI writing commands, advanced exports, recovery controls, sync, and publishing.",
      canonicalPath: "/pro",
    };
  }

  if (matchesRoute(pathname, "/docs/online-markdown-editor")) {
    return {
      title: "Online Markdown Editor - Write, Preview, and Download Markdown",
      description:
        "Use VeloWrite as a free online Markdown editor for quick drafts, live preview, Markdown download, HTML export, and a desktop path for local files.",
      canonicalPath: "/docs/online-markdown-editor",
    };
  }

  if (normalizedPath === "/docs") {
    return {
      title: "VeloWrite Markdown Library - Guides, Workflows, and Advanced Markdown",
      description:
        "Read Markdown articles about basics, history, writing, code blocks, math, local files, and editor comparisons.",
      canonicalPath: "/docs",
    };
  }

  if (matchesRoute(pathname, "/roadmap")) {
    return {
      title: "VeloWrite Public Roadmap - User Feedback and Planned Improvements",
      description:
        "See recorded user requests, shipped preview fixes, and the editor improvements being planned next.",
      canonicalPath: "/roadmap",
    };
  }

  if (matchesRoute(pathname, "/guide")) {
    return {
      title: "VeloWrite Markdown Guide - Practical Writing Examples",
      description:
        "A Markdown guide with examples for headings, lists, tables, math, code tabs, and desktop use.",
      canonicalPath: "/guide",
    };
  }

  if (matchesRoute(pathname, "/changelog")) {
    return {
      title: "VeloWrite Changelog - Release Notes and Preview Updates",
      description:
        "Read preview release notes, UI fixes, SEO changes, guide updates, and roadmap notes.",
      canonicalPath: "/changelog",
    };
  }

  if (matchesRoute(pathname, "/faq")) {
    return {
      title: "VeloWrite FAQ - Markdown Editor, Privacy, Desktop, and Pro",
      description:
        "Answers about the online Markdown editor, desktop app, privacy model, platform support, preview limits, and planned Pro features.",
      canonicalPath: "/faq",
    };
  }

  if (matchesRoute(pathname, "/privacy")) {
    return {
      title: "VeloWrite Privacy Policy",
      description:
        "How VeloWrite handles Markdown content, browser drafts, local storage, analytics consent, waitlist emails, and feedback submissions.",
      canonicalPath: "/privacy",
    };
  }

  if (matchesRoute(pathname, "/terms")) {
    return {
      title: "VeloWrite Terms of Service",
      description:
        "Preview terms for using VeloWrite web editor and desktop builds during early product validation.",
      canonicalPath: "/terms",
    };
  }

  if (matchesRoute(pathname, "/refund")) {
    return {
      title: "VeloWrite Refund Policy",
      description:
        "Current refund expectations for the free preview and future paid desktop or subscription plans.",
      canonicalPath: "/refund",
    };
  }

  if (matchesRoute(pathname, "/license")) {
    return {
      title: "VeloWrite License",
      description:
        "Preview license terms for evaluating VeloWrite before commercial licensing and paid plans are finalized.",
      canonicalPath: "/license",
    };
  }

  if (matchesRoute(pathname, "/feedback")) {
    return {
      title: "VeloWrite Feedback",
      description:
        "Send feedback about the web editor, desktop preview builds, Markdown editing, installers, and planned Pro features.",
      canonicalPath: "/feedback",
      robots: "noindex, follow",
    };
  }

  if (matchesRoute(pathname, "/app")) {
    return {
      title: "VeloWrite Desktop App Shell",
      description: defaultSeoDescription,
      canonicalPath: "/app",
      robots: "noindex, nofollow",
    };
  }

  if (pathname !== "/" && pathname !== "") {
    return {
      title: "Page Not Found - VeloWrite",
      description:
        "This VeloWrite page could not be found. Open the web editor, download the desktop preview, read the Markdown library, or send feedback.",
      canonicalPath: "/404",
      robots: "noindex, follow",
    };
  }

  return {
    title: defaultSeoTitle,
    description: defaultSeoDescription,
    canonicalPath: "/",
  };
}

function setMeta(name: string, content: string, attribute: "name" | "property" = "name") {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.content = content;
}

function setCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }

  element.href = href;
}

function setStructuredData(id: string, data: unknown) {
  const existingFaqGraph = Array.from(
    document.head.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'),
  ).some((script) => script.textContent?.includes("https://velowrite.app/#faq"));

  if (id === "homepage-faq" && existingFaqGraph) {
    return;
  }

  let element = document.head.querySelector<HTMLScriptElement>(`script[data-structured-id="${id}"]`);

  if (!element) {
    element = document.createElement("script");
    element.type = "application/ld+json";
    element.dataset.structuredId = id;
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
}

function SeoManager({ config }: { config: SeoConfig }) {
  React.useEffect(() => {
    const canonicalUrl = `${siteUrl}${config.canonicalPath}`;

    document.title = config.title;
    setCanonical(canonicalUrl);
    setMeta("description", config.description);
    setMeta("robots", config.robots || "index, follow");
    setMeta("og:title", config.title, "property");
    setMeta("og:description", config.description, "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("twitter:title", config.title);
    setMeta("twitter:description", config.description);

    if (config.canonicalPath !== "/" && breadcrumbLabels[config.canonicalPath]) {
      setStructuredData("breadcrumbs", {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "VeloWrite",
            item: `${siteUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: breadcrumbLabels[config.canonicalPath],
            item: canonicalUrl,
          },
        ],
      });
    }

    if (
      config.canonicalPath === "/guide" ||
      config.canonicalPath === "/changelog" ||
      config.canonicalPath === "/roadmap" ||
      publishedDocPageRoutes.has(config.canonicalPath as keyof typeof docPageRoutes)
    ) {
      setStructuredData("content-article", {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${siteUrl}${config.canonicalPath}#article`,
        headline: config.title,
        description: config.description,
        dateModified: seoDate,
        mainEntityOfPage: `${siteUrl}${config.canonicalPath}`,
        author: { "@id": `${siteUrl}/#organization` },
        publisher: { "@id": `${siteUrl}/#organization` },
      });
    }

    if (config.canonicalPath === "/" || config.canonicalPath === "/faq") {
      setStructuredData(config.canonicalPath === "/" ? "homepage-faq" : "faq-page", {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${siteUrl}${config.canonicalPath}#faq`,
        mainEntity: faqSchemaItems,
      });
    }
  }, [config]);

  return null;
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
        <p>Drafts stay in your browser. Analytics loads only if you allow it.</p>
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

function Router() {
  const seo = routeSeo(window.location.pathname);
  const isHomeRoute =
    !("__TAURI_INTERNALS__" in window) &&
    (window.location.pathname === "/" || window.location.pathname === "");

  return (
    <>
      <SeoManager config={seo} />
      <React.Suspense fallback={<div className="loading-screen">Loading page</div>}>
        {isHomeRoute ? <LandingPage /> : <PublicPageRouter />}
      </React.Suspense>
    </>
  );
}

function AppRoot() {
  const isDesktopShell = matchesRoute(window.location.pathname, "/app") || isTauriRuntime();
  const [analyticsConsent, setAnalyticsConsent] = React.useState<string | null>(() => {
    if (isDesktopShell) return "declined";
    return window.localStorage.getItem(analyticsConsentKey);
  });

  function updateAnalyticsConsent(nextValue: "accepted" | "declined") {
    window.localStorage.setItem(analyticsConsentKey, nextValue);
    setAnalyticsConsent(nextValue);
  }

  return (
    <>
      <Router />
      {!isDesktopShell && analyticsConsent === "accepted" && (
        <React.Suspense fallback={null}>
          <VercelInsights />
        </React.Suspense>
      )}
      {!isDesktopShell && <CookieConsent value={analyticsConsent} onChange={updateAnalyticsConsent} />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>,
);
