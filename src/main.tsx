import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
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
  ListChecks,
  LockKeyhole,
  Mail,
  MessageSquare,
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
import { complexDemoMarkdown } from "./sampleMarkdown";

const EditorApp = React.lazy(() => import("./EditorApp"));
const DemoCodeTabs = React.lazy(() => import("./DemoCodeTabs"));
const RenderedMarkdownExample = React.lazy(() => import("./RenderedMarkdownExample"));
const downloadVersion = "0.1.13";
const releaseBaseUrl = `https://github.com/ken-water/velowrite/releases/download/v${downloadVersion}`;
const webEditorHref = "/web?utm_source=landing&utm_medium=cta";
const downloadHref = "/download?utm_source=landing&utm_medium=cta";
const analyticsConsentKey = "velowrite:analytics-consent";
const exampleMarkdownKey = "velowrite:example-markdown";
const siteUrl = "https://velowrite.app";
const defaultSeoTitle = "VeloWrite - Online Markdown Editor and Lightweight Desktop App";
const defaultSeoDescription =
  "VeloWrite is a private online Markdown editor and lightweight Tauri desktop app for fast writing, live preview, export, local history, and native file workflows.";
const breadcrumbLabels: Record<string, string> = {
  "/web": "Web Editor",
  "/download": "Download",
  "/demo": "Demo",
  "/pro": "Pro Roadmap",
  "/roadmap": "Feedback Roadmap",
  "/docs": "Markdown Library",
  "/docs/online-markdown-editor": "Online Markdown Editor",
  "/docs/markdown-basics": "Markdown Basics",
  "/docs/markdown-for-writers": "Markdown for Writers",
  "/docs/markdown-for-developers": "Markdown for Developers",
  "/docs/markdown-math": "Markdown Math",
  "/docs/markdown-to-blog": "Markdown to Blog",
  "/guide": "Markdown Guide",
  "/changelog": "Changelog",
  "/faq": "FAQ",
  "/privacy": "Privacy Policy",
  "/terms": "Terms of Service",
  "/refund": "Refund Policy",
  "/license": "License",
  "/feedback": "Feedback",
};

type SeoConfig = {
  title: string;
  description: string;
  canonicalPath: string;
  robots?: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type FaqGroup = {
  title: string;
  items: readonly FaqItem[];
};

type ContentSection = {
  id?: string;
  title: string;
  body: readonly string[];
  example?: {
    label: string;
    markdown: string;
    note: string;
  };
};

type ContentPage = {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  directory?: readonly { label: string; href: string }[];
  sections: readonly ContentSection[];
  cta: {
    primary: { href: string; label: string };
    secondary: { href: string; label: string };
  };
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
  "/docs/local-first-markdown": "localFirstMarkdown",
  "/docs/typora-alternative": "typoraAlternative",
  "/docs/online-markdown-editor": "onlineMarkdownEditor",
  "/docs/markdown-to-blog": "markdownToBlog",
  "/docs/markdown-editor-for-windows": "markdownEditorForWindows",
  "/docs/markdown-editor-for-mac": "markdownEditorForMac",
  "/docs/markdown-editor-for-linux": "markdownEditorForLinux",
} as const;

const publishedDocPageRoutes = new Set<keyof typeof docPageRoutes>([
  "/docs/local-first-markdown",
  "/docs/markdown",
  "/docs/markdown-basics",
  "/docs/markdown-code-blocks",
  "/docs/markdown-for-developers",
  "/docs/markdown-for-writers",
  "/docs/advanced-markdown",
  "/docs/markdown-math",
  "/docs/markdown-to-blog",
  "/docs/online-markdown-editor",
]);

const docArticleSeo: Record<keyof typeof docPageRoutes, { title: string; description: string }> = {
  "/docs/markdown": {
    title: "What Is Markdown? Plain Text Writing for Notes, Docs, and Blogs",
    description:
      "Learn what Markdown is, how it compares with rich text and HTML, where it works best, and how to start writing portable Markdown documents.",
  },
  "/docs/markdown-history": {
    title: "A Short History of Markdown - From Plain Text to Modern Writing",
    description:
      "A practical history of Markdown, why it became popular with writers and developers, and where modern Markdown editors are heading.",
  },
  "/docs/future-of-markdown": {
    title: "The Future of Markdown Writing - Local Files, AI, and Publishing",
    description:
      "Explore how Markdown writing is evolving around local-first files, AI assistance, publishing workflows, and cross-platform editors.",
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
      "A developer-focused Markdown guide for README files, technical specs, API notes, code examples, changelogs, and documentation workflows.",
  },
  "/docs/advanced-markdown": {
    title: "Advanced Markdown - Portable, Reviewable, Maintainable Documents",
    description:
      "Advanced Markdown practices for portable, reviewable documents: semantic line breaks, reference links, escaped technical text, stable anchors, and reusable document templates.",
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
  "/docs/local-first-markdown": {
    title: "Local-First Markdown Editing - Private Files and Offline Writing",
    description:
      "Understand local-first Markdown editing, why user-owned files matter, and when to move from a browser editor to a desktop app.",
  },
  "/docs/typora-alternative": {
    title: "Typora Alternative - A Lightweight Markdown Workflow with VeloWrite",
    description:
      "Compare VeloWrite with Typora-style Markdown editing for browser trials, local-first desktop work, preview builds, and future AI workflows.",
  },
  "/docs/online-markdown-editor": {
    title: "Online Markdown Editor - Write, Preview, and Download Markdown",
    description:
      "Use VeloWrite as a free online Markdown editor for quick drafts, live preview, Markdown download, HTML export, and a desktop path for local files.",
  },
  "/docs/markdown-to-blog": {
    title: "Markdown to Blog - Draft Locally, Preview Clearly, Publish Later",
    description:
      "A practical Markdown-to-blog workflow for drafting, previewing, exporting HTML, and preparing future static publishing automation.",
  },
  "/docs/markdown-editor-for-windows": {
    title: "Markdown Editor for Windows - Fast Local Writing with VeloWrite",
    description:
      "Use VeloWrite as a lightweight Markdown editor for Windows with browser preview, desktop files, local history, and HTML export.",
  },
  "/docs/markdown-editor-for-mac": {
    title: "Markdown Editor for Mac - Local-First Markdown Writing",
    description:
      "What Mac users should expect from VeloWrite's Markdown workflow, Apple Silicon DMG status, local-first editing, and future signing plans.",
  },
  "/docs/markdown-editor-for-linux": {
    title: "Markdown Editor for Linux - AppImage, DEB, RPM, and Local Files",
    description:
      "Use VeloWrite as a Linux Markdown editor with AppImage, DEB, RPM, browser editing, local files, and a lightweight Tauri desktop workflow.",
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
        "Download the VeloWrite desktop preview for Windows, macOS Apple Silicon, AppImage, Debian, and RPM Linux workflows.",
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
        "Explore the planned VeloWrite Pro path, early pricing preview, AI writing commands, advanced exports, recovery controls, and future workflow features.",
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
        "Explore VeloWrite Markdown articles covering basics, history, writing workflows, code blocks, math, local-first editing, and editor comparisons.",
      canonicalPath: "/docs",
    };
  }

  if (matchesRoute(pathname, "/roadmap")) {
    return {
      title: "VeloWrite Public Roadmap - User Feedback and Planned Improvements",
      description:
        "See which VeloWrite user requests have been recorded, which preview fixes have shipped, and what local-first editor improvements are being researched next.",
      canonicalPath: "/roadmap",
    };
  }

  if (matchesRoute(pathname, "/guide")) {
    return {
      title: "VeloWrite Markdown Guide - Practical Writing Examples",
      description:
        "A practical Markdown guide showing headings, lists, tables, math, code tabs, and desktop workflows for VeloWrite users.",
      canonicalPath: "/guide",
    };
  }

  if (matchesRoute(pathname, "/changelog")) {
    return {
      title: "VeloWrite Changelog - Release Notes and Preview Updates",
      description:
        "Read the VeloWrite changelog for preview release notes, UI updates, SEO changes, guide improvements, and future roadmap notes.",
      canonicalPath: "/changelog",
    };
  }

  if (matchesRoute(pathname, "/faq")) {
    return {
      title: "VeloWrite FAQ - Markdown Editor, Privacy, Desktop, and Pro",
      description:
        "Answers about VeloWrite's online Markdown editor, Tauri desktop app, privacy model, platform support, preview limits, and future Pro workflows.",
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
        "Current refund expectations for the free VeloWrite preview and future paid desktop or subscription plans.",
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
        "Send feedback about VeloWrite web editor, desktop preview builds, Markdown workflows, packaging, and future Pro features.",
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
        dateModified: "2026-07-30",
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

const downloads = [
  {
    platform: "Windows",
    format: "NSIS installer",
    fileName: `VeloWrite_${downloadVersion}_x64-setup.exe`,
    note: "Best choice for most Windows testers.",
    detail: "Windows x64. SmartScreen may warn because preview builds are not signed yet.",
    badge: "Recommended",
  },
  {
    platform: "macOS Apple Silicon",
    format: "DMG package",
    fileName: `VeloWrite_${downloadVersion}_aarch64.dmg`,
    note: "For M-series Macs that want to test the native workflow.",
    detail: "Unsigned Apple Silicon build. Gatekeeper may require manual approval.",
    badge: "Apple Silicon",
  },
  {
    platform: "Linux AppImage",
    format: "Portable package",
    fileName: `VeloWrite_${downloadVersion}_amd64.AppImage`,
    note: "Portable Linux build without package installation.",
    detail: "Make it executable before running. Works well for quick Linux testing.",
    badge: "Portable",
  },
  {
    platform: "Ubuntu / Debian",
    format: "DEB package",
    fileName: `VeloWrite_${downloadVersion}_amd64.deb`,
    note: "Native package for Debian-based distributions.",
    detail: "Use this for Ubuntu, Debian, Linux Mint, and related distributions.",
    badge: "DEB",
  },
  {
    platform: "Fedora / RHEL",
    format: "RPM package",
    fileName: `VeloWrite-${downloadVersion}-1.x86_64.rpm`,
    note: "Native package for RPM-based distributions.",
    detail: "Use this for Fedora, RHEL, openSUSE, and related distributions.",
    badge: "RPM",
  },
];

const roadmapRecommendations = [
  {
    priority: "Next best free improvement",
    title: "Sharper outline and structure map",
    reason:
      "It improves long-document writing immediately, supports writers and developers, and builds on the outline sync work already in the preview.",
  },
  {
    priority: "Next quality pass",
    title: "More app-like desktop polish",
    reason:
      "First impressions still matter for a desktop writing tool. Reducing chrome, improving focus mode, and making resume behavior clearer should raise trust before Pro work.",
  },
  {
    priority: "Next workflow proof",
    title: "Cleaner web-to-desktop handoff",
    reason:
      "The browser is the acquisition surface and desktop is the retention surface. A clearer handoff turns trial users into serious local-file users without requiring accounts.",
  },
];

const publicRoadmapItems = [
  {
    title: "Markdown learning library",
    request: "Users should understand Markdown basics, advanced syntax, platform support, and where VeloWrite fits before downloading the desktop app.",
    status: "Shipped",
    target: "0.1.x",
    classification: "Free education and discovery",
    decision:
      "The staged article library is now active under /docs, including a top-level Markdown introduction, local-first workflow guidance, advanced maintainability practices, code blocks, math, and Markdown-to-blog workflow guidance. Example blocks can open directly in the web editor, so readers can move from learning to trying without copying text manually.",
  },
  {
    title: "Editor and preview sync scrolling",
    request: "Long Markdown documents should keep the editor and preview aligned while writing.",
    status: "In progress",
    target: "0.1.x / 0.2.x",
    classification: "Free core editor work",
    decision:
      "Outline clicks now align both panes in the preview build. Continuous stable scroll matching for long documents should stay core editor work because it affects daily writing quality.",
  },
  {
    title: "Focused writing polish",
    request: "The desktop app should feel like a calm native writing tool, not a website inside a window.",
    status: "In progress",
    target: "0.1.x / 0.2.x",
    classification: "Free core experience",
    decision:
      "The desktop preview now opens directly into the editor and now prepares a last-local-file restore path so returning writers can resume faster. The next polish pass should keep reducing chrome, tighten hover states, improve first-run templates, and make focus mode feel natural for daily writing.",
  },
  {
    title: "Outline and structure map",
    request: "Writers need a clearer way to understand document structure before turning notes into a finished draft.",
    status: "Free foundation shipped",
    target: "0.1.x / 0.2.x",
    classification: "Free structure workflow first",
    decision:
      "The editor now includes a read-only structure map with total H1/H2/H3 counts plus active heading clarity after outline navigation. Folding, richer section diagnostics, editable visual mapping, and AI-assisted outline expansion can be evaluated later.",
  },
  {
    title: "Better local history recovery",
    request: "Users want confidence that accidental paste mistakes or rewrites can be recovered.",
    status: "Free foundation shipped",
    target: "0.1.x / 0.2.x",
    classification: "Free safety workflow",
    decision:
      "Basic local history and restore preview stay free because recovery is part of document safety. The current free preview keeps the latest 3 local snapshots so the rule is clear before deeper Pro history controls are designed.",
  },
  {
    title: "Advanced history and recovery controls",
    request: "Power users may need deeper restore history, longer retention, cross-device history, and clearer comparison for long documents.",
    status: "Designing",
    target: "0.2.x / 0.3.x",
    classification: "Recovery policy design",
    decision:
      "The free preview now keeps 3 local snapshots. Longer retention, richer recovery review, cross-device history, and exportable recovery archives remain candidates for later Pro design.",
  },
  {
    title: "Web to desktop draft handoff",
    request: "Start quickly in the browser, then continue in the desktop app without manual copy and paste.",
    status: "Direct import prepared",
    target: "0.1.x / 0.2.x",
    classification: "Free handoff first",
    decision:
      "The web editor can download the current Markdown draft and now has a velowrite:// direct-import path for the next desktop build. The next useful step is a clearer handoff model before any heavier account-based sync is considered.",
  },
  {
    title: "Private, no-account sync",
    request: "Sync should not force a heavy cloud account or take ownership away from local files.",
    status: "Researching",
    target: "0.3.x+",
    classification: "Local-first sync research",
    decision:
      "The first sync direction should preserve folder-based ownership: clear import/export, predictable conflict handling, no hidden lock-in, and a documented path for users who already use Git, Syncthing, iCloud, Dropbox, or OneDrive.",
  },
  {
    title: "More complete Markdown rendering",
    request: "Complex documents need reliable math, code tabs, tables, images, and long-form preview behavior.",
    status: "In progress",
    target: "0.1.x / 0.2.x",
    classification: "Free preview quality",
    decision:
      "Rendering trust is part of the preview foundation. The published math and code-block guides now exercise KaTeX, tables, code highlighting, and tabbed examples, and the work should keep gaining tests before broader promotion.",
  },
  {
    title: "Better export and publishing preparation",
    request: "Users need finished documents that look good when shared outside the editor.",
    target: "0.2.x / 0.3.x",
    classification: "Free export baseline, Pro workflow later",
    status: "In progress",
    decision:
      "The web editor now opens a clean rendered Print / Save PDF document, alongside Markdown download and HTML export. DOCX, branded templates, batch export, and one-click publishing are stronger candidates for future workflow packaging.",
  },
  {
    title: "AI writing, publishing, and advanced export research",
    request: "Some users want richer workflows once the basic editor is stable.",
    status: "Later",
    target: "0.3.x+",
    classification: "Future workflow research",
    decision:
      "These workflows should stay behind core editor quality. The public roadmap tracks the user need; detailed packaging can live on the dedicated Pro page when it is ready.",
  },
];

const docGroups = [
  {
    title: "Understand Markdown",
    description: "Foundational articles for people comparing writing formats and editor workflows.",
    items: [
      { title: "What Is Markdown?", href: "/docs/markdown", status: "Published" },
      { title: "A Short History of Markdown", href: "/docs/markdown-history", status: "Planned" },
      { title: "The Future of Markdown Writing", href: "/docs/future-of-markdown", status: "Planned" },
    ],
  },
  {
    title: "Use Markdown Better",
    description: "Practical guides for daily writing, documentation, notes, and technical drafts.",
    items: [
      { title: "Markdown Basics", href: "/docs/markdown-basics", status: "Published" },
      { title: "Markdown for Writers", href: "/docs/markdown-for-writers", status: "Published" },
      { title: "Markdown for Developers", href: "/docs/markdown-for-developers", status: "Published" },
    ],
  },
  {
    title: "Advanced Markdown",
    description: "Deep dives for complex documents with math, code, tables, tabs, and local-first workflows.",
    items: [
      { title: "Markdown Code Blocks and Tabs", href: "/docs/markdown-code-blocks", status: "Published" },
      { title: "Local-First Markdown Editing", href: "/docs/local-first-markdown", status: "Published" },
      { title: "Advanced Markdown", href: "/docs/advanced-markdown", status: "Published" },
      { title: "Markdown Math with KaTeX", href: "/docs/markdown-math", status: "Published" },
    ],
  },
  {
    title: "Choose a Markdown Editor",
    description: "Conversion-focused pages for users searching by platform, workflow, or alternative.",
    items: [
      { title: "Online Markdown Editor", href: "/docs/online-markdown-editor", status: "Published" },
      { title: "Typora Alternative", href: "/docs/typora-alternative", status: "Planned" },
      { title: "Markdown to Blog", href: "/docs/markdown-to-blog", status: "Published" },
      { title: "Markdown Editor for Windows", href: "/docs/markdown-editor-for-windows", status: "Planned" },
      { title: "Markdown Editor for Mac", href: "/docs/markdown-editor-for-mac", status: "Planned" },
      { title: "Markdown Editor for Linux", href: "/docs/markdown-editor-for-linux", status: "Planned" },
    ],
  },
] as const;

const faqGroups: readonly FaqGroup[] = [
  {
    title: "Product Basics",
    items: [
      {
        question: "What is VeloWrite?",
        answer:
          "VeloWrite is a private online Markdown editor and lightweight Tauri desktop app for fast writing, live preview, export, local history, and native file workflows.",
      },
      {
        question: "Is VeloWrite a Typora alternative?",
        answer:
          "VeloWrite is built for users who want a clean Typora-like Markdown workflow with a browser trial, lightweight desktop packaging, local-first files, and a planned AI-native path.",
      },
      {
        question: "What is the best lightweight Markdown editor for Windows?",
        answer:
          "VeloWrite is designed for people who want a lightweight Markdown editor for Windows with browser preview, desktop files, recent documents, local history snapshots, and HTML export.",
      },
      {
        question: "Who is VeloWrite for?",
        answer:
          "VeloWrite is for developers, technical writers, students, founders, and teams who write Markdown notes, documentation, specs, guides, blog drafts, or knowledge-base content.",
      },
    ],
  },
  {
    title: "Web Editor and Desktop App",
    items: [
      {
        question: "Can I try VeloWrite without installing anything?",
        answer:
          "Yes. Open the web editor in your browser and start writing immediately. It is the fastest way to test the Markdown workflow before deciding whether the desktop app is worth installing.",
      },
      {
        question: "Can I edit Markdown online without uploading files?",
        answer:
          "Yes. Normal VeloWrite web editing and preview do not upload Markdown document content to VeloWrite servers. Browser drafts stay in localStorage on the same device.",
      },
      {
        question: "What happens if I refresh the browser while editing?",
        answer:
          "Your draft stays in localStorage in the same browser, so a refresh on the same device can bring it back. That is useful for a quick trial, but it is not a substitute for real local files or backups.",
      },
      {
        question: "What is the difference between the web editor and desktop app?",
        answer:
          "The web editor is best for quick drafts, preview, Markdown download, and HTML export. The desktop app is better for real local files, native open and save, offline work, recent files, and local history snapshots.",
      },
      {
        question: "Do I need an account to use it?",
        answer:
          "No. The current web editor can be used without an account, and browser drafts are saved locally in the same browser. Desktop preview builds also work without a cloud account.",
      },
      {
        question: "Which platforms can I download right now?",
        answer:
          "VeloWrite currently offers a web editor plus preview desktop installers for Windows x64, macOS Apple Silicon, Linux AppImage, Debian, and RPM-based Linux distributions.",
      },
      {
        question: "Does VeloWrite work offline?",
        answer:
          "The desktop preview is the offline path for real local files. The web editor is best for quick drafts, Markdown download, and HTML export while the browser is available.",
      },
      {
        question: "Will the desktop installer trigger a warning?",
        answer:
          "Yes. The current Windows preview installer is unsigned, so SmartScreen may warn. The macOS DMG is also treated as an unsigned preview build until Apple signing and notarization are ready.",
      },
    ],
  },
  {
    title: "Markdown Features",
    items: [
      {
        question: "Does VeloWrite handle math, tables, and code highlighting?",
        answer:
          "Yes. The preview supports Markdown tables, KaTeX math rendering, syntax-highlighted code blocks, and tabbed previews for multi-language code examples.",
      },
      {
        question: "Can I download my work as Markdown or HTML?",
        answer:
          "Yes. The web editor can download Markdown files and export clean HTML. The desktop app also supports local files and HTML export in the current preview.",
      },
      {
        question: "Can the desktop app help me recover older versions?",
        answer:
          "The desktop preview includes local history snapshots so writers can recover prior versions while working with local Markdown files.",
      },
    ],
  },
  {
    title: "Privacy, Preview, and Pro",
    items: [
      {
        question: "Does VeloWrite upload my Markdown documents?",
        answer:
          "Normal web editing and preview do not upload Markdown document content to VeloWrite servers. Browser drafts stay in localStorage, and desktop files and history snapshots stay on your device by default.",
      },
      {
        question: "Is VeloWrite safe for private notes?",
        answer:
          "VeloWrite is designed around private, local-first writing. Browser drafts stay in localStorage, and desktop files plus local history snapshots stay on the user's device by default.",
      },
      {
        question: "Is VeloWrite free to use today?",
        answer:
          "The current public build is a free preview for early testers. The first Pro direction focuses on AI writing workflows, advanced export, and deeper recovery while heavier cloud features remain later candidates.",
      },
      {
        question: "What will VeloWrite Pro include?",
        answer:
          "The planned early Pro direction is $29/year with a $99 lifetime local-Pro option. It is expected to include AI writing actions with fair-use credits, BYOK AI, advanced export, and deeper local recovery. Checkout is not open yet.",
      },
      {
        question: "Where do I send feedback if something feels off?",
        answer:
          "Use the feedback page to report rough edges, missing workflows, download problems, or features that would make VeloWrite worth paying for.",
      },
    ],
  },
] as const;

const faqItems: readonly FaqItem[] = faqGroups.flatMap((group) => group.items);
function faqByQuestion(question: string) {
  const item = faqItems.find((candidate) => candidate.question === question);
  if (!item) throw new Error(`Missing FAQ item: ${question}`);
  return item;
}

const landingFaqs = [
  faqByQuestion("What is VeloWrite?"),
  faqByQuestion("Is VeloWrite free to use today?"),
  faqByQuestion("Is VeloWrite a Typora alternative?"),
  faqByQuestion("Can I edit Markdown online without uploading files?"),
  faqByQuestion("Does VeloWrite upload my Markdown documents?"),
  faqByQuestion("Can I try VeloWrite without installing anything?"),
  faqByQuestion("Does VeloWrite work offline?"),
  faqByQuestion("What is the difference between the web editor and desktop app?"),
  faqByQuestion("Does VeloWrite handle math, tables, and code highlighting?"),
  faqByQuestion("Will the desktop installer trigger a warning?"),
] as const;

const conversationalFaqCards = [
  {
    prompt: "I just need to edit a Markdown file quickly.",
    answer: "Use the web editor first. It opens instantly, previews Markdown, and lets you download a .md or HTML copy without signing in.",
  },
  {
    prompt: "I care about private local notes.",
    answer: "Use the desktop app when you need native open and save, offline work, recent files, and local history snapshots on your own machine.",
  },
  {
    prompt: "I want to know what is not ready yet.",
    answer: "AI commands, private sync, publishing automation, account-based sharing, and signed installers are still preview or roadmap items.",
  },
] as const;

const faqSchemaItems = faqItems.map((item: FaqItem) => ({
  "@type": "Question",
  name: item.question,
  acceptedAnswer: {
    "@type": "Answer",
    text: item.answer,
  },
}));

const contentPages: Record<string, ContentPage> = {
  markdown: {
    eyebrow: "Markdown fundamentals",
    title: "What Is Markdown?",
    intro:
      "Markdown is a plain text writing format for notes, documentation, articles, READMEs, and drafts that need to stay easy to read before and after rendering.",
    updated: "July 30, 2026",
    directory: [
      { label: "Definition", href: "#definition" },
      { label: "Why it works", href: "#why-it-works" },
      { label: "Markdown vs rich text", href: "#markdown-vs-rich-text" },
      { label: "Core syntax", href: "#core-syntax" },
      { label: "Where it fits", href: "#where-it-fits" },
      { label: "Limits", href: "#limits" },
      { label: "Start writing", href: "#start-writing" },
    ],
    sections: [
      {
        id: "definition",
        title: "Markdown is readable source plus structured output",
        body: [
          "A Markdown document is still plain text. You write a small amount of structure into the file: a heading starts with #, a list starts with - or a number, links use brackets and parentheses, and code blocks use fences.",
          "That source can be read directly, but it can also be rendered into HTML, documentation pages, blog posts, PDF-style output, or a clean preview inside an editor. The format works because the source and the output both remain useful.",
        ],
        example: {
          label: "Readable Markdown source",
          markdown:
            "# Product Notes\n\n## Goals\n\n- Write quickly\n- Preview clearly\n- Keep files portable\n\nRead the [VeloWrite guide](/guide) when the draft needs more structure.",
          note: "The source is readable before it is rendered, and the preview still has clear structure.",
        },
      },
      {
        id: "why-it-works",
        title: "Why plain text still matters",
        body: [
          "Plain text files are easy to back up, compare, search, version, and move between tools. They do not depend on one account, one database, or one vendor-specific document format.",
          "Developers like Markdown because it fits Git and code review. Writers like it because the formatting does not interrupt the draft. Teams like it because the same file can move from a note to a README, a help article, or a release note without being rewritten from scratch.",
        ],
      },
      {
        id: "markdown-vs-rich-text",
        title: "Markdown is not the same job as a rich text editor",
        body: [
          "A rich text editor asks you to style while you write: font size, spacing, colors, page breaks, pasted formatting, and layout controls. Markdown asks you to describe structure first: this is a heading, this is a list, this is a link, this is code.",
          "That makes Markdown a better drafting format for documents that change often. It is usually not the best final layout tool for page-perfect brochures or heavily designed reports. A practical workflow is to draft in Markdown, preview while writing, then export or publish when the content is stable.",
        ],
        example: {
          label: "Structure instead of styling",
          markdown:
            "## Decision\n\nUse Markdown for the draft because the content will change during review.\n\n## Final output\n\nExport the finished version only after the structure and wording are stable.",
          note: "Markdown keeps the decision and the final output as separate concerns.",
        },
      },
      {
        id: "core-syntax",
        title: "The core syntax is small on purpose",
        body: [
          "Most daily Markdown work uses a small set of patterns: headings, paragraphs, lists, links, blockquotes, fenced code blocks, images, and tables. You do not need to memorize everything before writing useful documents.",
          "The better habit is to learn the few structures you use every day, then add math, code tabs, reference links, and document templates when the document genuinely needs them.",
        ],
        example: {
          label: "Small daily syntax set",
          markdown:
            "## Meeting notes\n\n> Keep the note short enough to review later.\n\n1. Confirm the decision\n2. Record the owner\n3. Link the follow-up issue\n\n```bash\nnpm run build\n```",
          note: "A few reliable patterns cover most working documents.",
        },
      },
      {
        id: "where-it-fits",
        title: "Where Markdown fits best",
        body: [
          "Markdown works well for notes, READMEs, specs, changelogs, study guides, knowledge-base articles, product docs, launch copy, and blog drafts. It is strongest when the document needs to stay editable and searchable.",
          "It also works well when a document may have several destinations. The same source can start as a private note, become a review draft, and later turn into a public article or support document.",
        ],
        example: {
          label: "One source, several outputs",
          markdown:
            "| Source document | Possible output |\n| --- | --- |\n| README draft | GitHub project page |\n| Product note | Help center article |\n| Launch checklist | Internal runbook |\n| Blog outline | Published article |",
          note: "Markdown is useful when the source needs to outlive one export format.",
        },
      },
      {
        id: "limits",
        title: "Know what Markdown does not try to solve",
        body: [
          "Markdown is not a full design system, database, spreadsheet, whiteboard, or collaborative workspace by itself. Some editors add those layers, but the format remains strongest when the plain text file is still understandable.",
          "This matters when choosing tools. If you need heavy real-time collaboration, complex permissions, or database views, a larger workspace product may fit better. If you need private writing, readable files, preview, export, and local history, Markdown is a lighter and more durable base.",
        ],
      },
      {
        id: "start-writing",
        title: "Start in the browser, then move important files local",
        body: [
          "The fastest way to learn Markdown is to write a real document, not read a syntax chart for an hour. Start with a title, a few headings, and one short list. Then preview the document and adjust the structure.",
          "VeloWrite's web editor is designed for that first draft. When the document becomes important, the desktop app is the better place for native open and save, offline writing, recent files, and local history snapshots.",
        ],
        example: {
          label: "First useful draft",
          markdown:
            "# Draft title\n\n## What changed\n\nWrite the short version first.\n\n## Why it matters\n\nAdd the reason readers should care.\n\n## Next step\n\n- Review the preview\n- Save the Markdown file\n- Share or export when ready",
          note: "A useful Markdown document starts with shape, not decoration.",
        },
      },
    ],
    cta: {
      primary: { href: "/web?utm_source=markdown_article&utm_medium=cta", label: "Open Web Editor" },
      secondary: { href: "/docs/markdown-basics?utm_source=markdown_article&utm_medium=resource", label: "Read Markdown Basics" },
    },
  },
  markdownHistory: {
    eyebrow: "Markdown fundamentals",
    title: "A Short History of Markdown",
    intro:
      "Markdown became popular because it solved a practical problem: people wanted to write for the web without writing raw HTML all day. Its best ideas are still useful in modern editors.",
    updated: "July 21, 2026",
    sections: [
      {
        title: "The original need was web writing",
        body: [
          "Markdown was created to make structured writing easier to read as plain text and easier to convert to HTML. That origin still shapes the format: headings, links, lists, quotes, and code all map naturally to web content.",
          "The format spread because it was easy to type in email, text editors, issue trackers, READMEs, and documentation sites.",
        ],
      },
      {
        title: "Developers made Markdown a documentation standard",
        body: [
          "GitHub, static site generators, documentation platforms, and code hosting pushed Markdown into daily developer work. READMEs, release notes, API docs, design notes, and runbooks all became natural Markdown documents.",
          "This is why modern Markdown editors need strong code blocks, tables, math, and preview behavior, not only basic headings.",
        ],
      },
      {
        title: "The next step is local-first and workflow-aware",
        body: [
          "The future is not just another syntax variant. The useful direction is better writing flow: instant preview, local files, history recovery, export, publishing, and eventually AI commands that respect user-owned content.",
          "VeloWrite is built around that path: fast web trial first, then a lightweight desktop app for serious local Markdown work.",
        ],
      },
    ],
    cta: {
      primary: { href: "/docs/future-of-markdown?utm_source=markdown_history_cta&utm_medium=resource", label: "Read Future" },
      secondary: { href: "/web?utm_source=markdown_history_cta&utm_medium=cta", label: "Try Markdown" },
    },
  },
  futureOfMarkdown: {
    eyebrow: "Markdown direction",
    title: "The Future of Markdown Writing",
    intro:
      "Markdown will stay useful because it is portable, but the editor around it is changing. The next wave is local-first, AI-assisted, and publishing-aware without hiding files behind a heavy cloud workspace.",
    updated: "July 21, 2026",
    sections: [
      {
        title: "Local files remain the source of truth",
        body: [
          "People trust Markdown because the file is inspectable. You can open it in another editor, store it in Git, copy it to a folder, or keep it in a private vault. Future editors should preserve that trust instead of forcing every note through an account system.",
          "For VeloWrite, that means desktop local files, recent documents, and local history stay part of the free core workflow.",
        ],
      },
      {
        title: "AI should work inside the document flow",
        body: [
          "AI is useful when it can polish a paragraph, summarize a section, continue a draft, explain code, or generate Mermaid diagrams from context. It is less useful when it feels like a separate chat window pasted onto the side.",
          "That is why AI commands are on the VeloWrite Pro roadmap only after the basic editor feels trustworthy.",
        ],
      },
      {
        title: "Publishing should become a natural last step",
        body: [
          "Many Markdown documents eventually become blog posts, docs pages, release notes, or knowledge-base articles. The future editor should help export and publish without making the writing surface heavier.",
          "VeloWrite's roadmap keeps this as a later workflow: write and preview first, then add publishing automation when the core editor is stable.",
        ],
      },
    ],
    cta: {
      primary: { href: "/roadmap?utm_source=future_markdown_cta&utm_medium=resource", label: "View Roadmap" },
      secondary: { href: "/pro?utm_source=future_markdown_cta&utm_medium=resource", label: "View Pro Path" },
    },
  },
  markdownBasics: {
    eyebrow: "Markdown basics",
    title: "Markdown Basics",
    intro:
      "Markdown is easiest to learn when you start with the few patterns you will use every day: headings, paragraphs, lists, links, images, tables, code blocks, and the occasional math block. This guide keeps the examples small so you can copy them into the editor and see the result immediately.",
    updated: "July 21, 2026",
    directory: [
      { label: "Document shape", href: "#document-shape" },
      { label: "Paragraphs", href: "#paragraphs" },
      { label: "Lists", href: "#lists" },
      { label: "Links and images", href: "#links-images" },
      { label: "Tables and code blocks", href: "#tables-code" },
      { label: "Preview habits", href: "#preview-habits" },
    ],
    sections: [
      {
        id: "document-shape",
        title: "Start with the document shape",
        body: [
          "A readable Markdown file usually starts with one title, a few section headings, and short paragraphs below each heading. You do not need to decide final styling before the document has a useful shape.",
          "Use one top-level heading for the page title. Use second-level headings for the main sections. If you need a third level, make sure the document is long enough to justify it.",
        ],
        example: {
          label: "Simple document shape",
          markdown:
            "# Project Plan\n\n## Goal\n\nWrite the goal in one short paragraph.\n\n## Tasks\n\n- Draft the outline\n- Review the preview\n- Export the file\n\n## Notes\n\nKeep decisions and open questions here.",
          note: "Headings give the document a map before you add detail.",
        },
      },
      {
        id: "paragraphs",
        title: "Use blank lines for paragraphs",
        body: [
          "Markdown treats blank lines as real structure. If two thoughts belong in separate paragraphs, leave an empty line between them. This makes the source easier to read and gives the preview a clean rhythm.",
          "Line breaks inside the same paragraph are usually less important than blank lines. For most writing, keep paragraphs short and let the preview wrap lines naturally.",
        ],
        example: {
          label: "Paragraph spacing",
          markdown:
            "This is the first paragraph. It can be one sentence or a few short sentences.\n\nThis is the second paragraph. The blank line between them matters.\n\n> A quote also reads better when it is separated from nearby text.",
          note: "When the source is easy to read, editing later is easier too.",
        },
      },
      {
        id: "lists",
        title: "Choose the right list",
        body: [
          "Use bullet lists when order does not matter. Use numbered lists when the reader should follow steps in sequence. Avoid deep nesting unless the structure really helps.",
          "A list is most useful when every item has the same shape. If one item turns into a long paragraph, it may deserve its own section instead.",
        ],
        example: {
          label: "Bullet and numbered lists",
          markdown:
            "Things to check:\n\n- Title is clear\n- Links work\n- Preview looks right\n\nSteps to publish:\n\n1. Finish the draft\n2. Export HTML\n3. Review the final page",
          note: "Lists are for scanning. Keep them tight.",
        },
      },
      {
        id: "links-images",
        title: "Add links and images plainly",
        body: [
          "A Markdown link has readable text in brackets and the URL in parentheses. The link text should explain where the reader is going instead of saying only \"click here\".",
          "Images use almost the same shape, but start with an exclamation mark. The text in brackets becomes alt text, so write a short description that would still help if the image does not load.",
        ],
        example: {
          label: "Links and images",
          markdown:
            "Read the [VeloWrite Markdown guide](/guide) for a longer walkthrough.\n\n![A Markdown editor showing source and preview](/icons/icon-512.png)",
          note: "Good link text and useful alt text help both readers and search engines.",
        },
      },
      {
        id: "tables-code",
        title: "Use simple tables and code blocks",
        body: [
          "Tables are useful for short comparisons, status lists, and small sets of facts. Keep table cells short. If the table becomes hard to edit, convert it into headings and paragraphs.",
          "Code fences preserve spacing and can include a language label for highlighting. For a basics page, it is enough to know the three-backtick shape and where the language name goes.",
        ],
        example: {
          label: "Tables and code blocks",
          markdown:
            "| Feature | Status |\n| --- | --- |\n| Preview | Ready |\n| Export | Ready |\n\n```bash\nnpm run build\n```",
          note: "Math, diagrams, and tabbed code examples belong in the advanced guides.",
        },
      },
      {
        id: "preview-habits",
        title: "Keep documents easy to scan",
        body: [
          "Short sections are easier to scan than long paragraphs. Consistent heading levels are easier to follow than visual decoration. If a document needs to be maintained, readable source matters as much as rendered output.",
          "A practical habit is to write a section, check the preview, then continue. This catches broken tables, missing blank lines, awkward links, and code fences that were not closed.",
          "When a document becomes something you want to keep, move it from a temporary browser draft to a local file. That is where the desktop app is more useful than a tab.",
        ],
      },
    ],
    cta: {
      primary: { href: "/web?utm_source=markdown_basics_cta&utm_medium=cta", label: "Practice Online" },
      secondary: { href: "/docs/advanced-markdown?utm_source=markdown_basics_cta&utm_medium=resource", label: "Advanced Markdown" },
    },
  },
  markdownForWriters: {
    eyebrow: "Writing workflow",
    title: "Markdown for Writers",
    intro:
      "Markdown helps writers keep a draft readable before it becomes a finished page. It is useful for outlines, notes, essays, articles, newsletters, and blog posts because the source stays simple while the preview gives enough structure to review the work.",
    updated: "July 22, 2026",
    directory: [
      { label: "Draft shape", href: "#draft-shape" },
      { label: "Research notes", href: "#research-notes" },
      { label: "Revision passes", href: "#revision-passes" },
      { label: "Publishable copy", href: "#publishable-copy" },
      { label: "Browser or desktop", href: "#browser-desktop" },
      { label: "Writer habits", href: "#writer-habits" },
    ],
    sections: [
      {
        id: "draft-shape",
        title: "Write the shape before the style",
        body: [
          "A good draft starts with structure: title, sections, notes, and open questions. Markdown lets you shape that without choosing fonts, margins, or page layout too early.",
          "This is especially useful for long-form writing because headings and lists make the source easy to scan.",
        ],
        example: {
          label: "Article skeleton",
          markdown:
            "# Article Draft\n\n## Working idea\n\nState the argument in one plain paragraph.\n\n## Reader problem\n\n- What is confusing today?\n- What does the reader want to finish?\n\n## Draft notes\n\nKeep rough notes here until they become sections.",
          note: "A skeleton keeps the draft moving before the final wording is ready.",
        },
      },
      {
        id: "research-notes",
        title: "Keep research notes close to the draft",
        body: [
          "Research notes are easier to use when they live near the paragraph they support. Use lists for source notes, blockquotes for copied excerpts you still need to rewrite, and links for material you will revisit.",
          "Keep rough notes visibly rough. That makes it easier to separate finished copy from supporting material during revision.",
        ],
        example: {
          label: "Research notes",
          markdown:
            "## Evidence\n\n- Interview note: users want fewer formatting choices.\n- Product note: preview should make structure obvious.\n- Link: [Markdown guide](/guide)\n\n> Rewrite this quote before publishing.",
          note: "Blockquotes are useful for temporary notes, but rewrite them before final copy.",
        },
      },
      {
        id: "revision-passes",
        title: "Use small revision passes",
        body: [
          "A full rewrite is hard to manage in one pass. It is usually easier to revise structure first, then clarity, then examples, then final wording.",
          "Markdown helps because the source stays visible. You can move sections, split paragraphs, and keep a small checklist without fighting layout.",
        ],
        example: {
          label: "Revision checklist",
          markdown:
            "## Revision pass\n\n- [ ] Does the title match the draft?\n- [ ] Does each section answer one question?\n- [ ] Are examples close to the claims they support?\n- [ ] Can one paragraph be removed?",
          note: "Checkboxes make editing tasks visible without turning the draft into a project tracker.",
        },
      },
      {
        id: "publishable-copy",
        title: "Move from rough notes to publishable copy",
        body: [
          "When the draft starts to settle, remove notes that only helped you think. Keep headings, short paragraphs, useful links, and examples that support the reader.",
          "Markdown works well as a publishing handoff because the same source can become HTML, documentation, a newsletter draft, or a blog post.",
        ],
        example: {
          label: "Clean publishable section",
          markdown:
            "## Why the preview matters\n\nA preview catches structure problems before readers see them. Long paragraphs, broken lists, and missing links are easier to fix while the draft is still in Markdown.\n\nRead the [Markdown Basics](/docs/markdown-basics) guide if the source format is new to you.",
          note: "Finished sections should read naturally even before final styling.",
        },
      },
      {
        id: "browser-desktop",
        title: "Move important drafts to desktop",
        body: [
          "The browser editor is useful for quick starts. When a draft becomes important, move to desktop so the file lives locally, can be reopened, and can benefit from local history snapshots.",
          "This matters for essays, client drafts, product copy, and long articles. A local file is easier to back up, compare, and keep under your own control.",
        ],
      },
      {
        id: "writer-habits",
        title: "Keep the writing surface quiet",
        body: [
          "A quiet writing surface does not mean an empty one. It means the editor gives you headings, preview, export, and recovery without pulling attention away from the draft.",
          "A practical habit is to write in small sections, preview often, and move stable drafts into local files. That keeps the browser useful for starting and the desktop app useful for finishing.",
        ],
      },
    ],
    cta: {
      primary: { href: "/web?utm_source=markdown_writers_cta&utm_medium=cta", label: "Start a Draft" },
      secondary: { href: "/download?utm_source=markdown_writers_cta&utm_medium=cta", label: "Download Desktop" },
    },
  },
  markdownForDevelopers: {
    eyebrow: "Developer workflow",
    title: "Markdown for Developers",
    intro:
      "Developers use Markdown because it works with code, Git, issue trackers, documentation systems, and release workflows. A good Markdown workflow keeps technical notes close to the commands, examples, and decisions they explain.",
    updated: "July 23, 2026",
    directory: [
      { label: "Repeatable docs", href: "#repeatable-docs" },
      { label: "Syntax highlighting", href: "#syntax-highlighting" },
      { label: "Multi-language docs", href: "#multi-language-docs" },
      { label: "Technical decisions", href: "#technical-decisions" },
      { label: "Runbooks", href: "#runbooks" },
      { label: "Release notes", href: "#release-notes" },
      { label: "Local history", href: "#local-history" },
    ],
    sections: [
      {
        id: "repeatable-docs",
        title: "Use Markdown for repeatable technical documents",
        body: [
          "READMEs, architecture notes, API drafts, runbooks, changelogs, release plans, and onboarding guides all benefit from Markdown because the source is readable, diffable, and reviewable.",
          "The goal is not to make every document formal. The goal is to make useful technical writing easy to start and easy to maintain.",
        ],
        example: {
          label: "Technical document shell",
          markdown:
            "# API Change\n\n## Summary\n\nExplain the change in two or three sentences.\n\n## Migration\n\n```bash\nnpm run test\nnpm run build\n```\n\n## Compatibility\n\n| Runtime | Status |\n| --- | --- |\n| Node 22 | Supported |",
          note: "A shell like this is enough to start a reviewable technical note.",
        },
      },
      {
        id: "syntax-highlighting",
        title: "Use language labels for syntax highlighting",
        body: [
          "Good developer docs explain the intent, then show the command, request, or code block. Put examples near the paragraph they support, not at the end of the document.",
          "Add a language label after the opening fence so the preview can highlight syntax. VeloWrite currently highlights common documentation languages including Bash, JavaScript, TypeScript, Python, and Java.",
        ],
        example: {
          label: "Syntax-highlighted examples",
          markdown:
            "Run the checks before opening the release PR:\n\n```bash\nnpm test\nnpm run build\n```\n\nThen document the changed option:\n\n```ts\ntype ExportMode = \"markdown\" | \"html\";\n\nfunction labelFor(mode: ExportMode) {\n  return mode === \"html\" ? \"Rendered HTML\" : \"Markdown source\";\n}\n```",
          note: "The language name after the opening fence controls syntax highlighting.",
        },
      },
      {
        id: "multi-language-docs",
        title: "Keep multi-language examples compact",
        body: [
          "Some developer docs need to show the same idea in more than one language. Stacking every version vertically can make the page hard to scan.",
          "VeloWrite groups adjacent Python, Bash, JavaScript, and Java code blocks into tabs, so readers can switch language without losing the surrounding explanation.",
        ],
        example: {
          label: "Tabbed language examples",
          markdown:
            "The same quick check can be shown in several languages:\n\n```python\nprint(\"VeloWrite\")\n```\n\n```bash\necho VeloWrite\n```\n\n```javascript\nconsole.log(\"VeloWrite\");\n```\n\n```java\nSystem.out.println(\"VeloWrite\");\n```",
          note: "Use tabs when each block shows the same idea in a different language.",
        },
      },
      {
        id: "technical-decisions",
        title: "Record technical decisions while they are fresh",
        body: [
          "Small decision notes save time later. They explain why a tradeoff was made, what alternatives were rejected, and what should be revisited when the system changes.",
          "Markdown works well here because the source can live near code, be reviewed in Git, or stay as a local draft until the decision is ready to share.",
        ],
        example: {
          label: "Decision note",
          markdown:
            "## Decision\n\nUse local browser storage for quick web drafts.\n\n## Why\n\n- No account is required for the first trial.\n- Drafts survive a refresh on the same device.\n- Sensitive long-term files still belong on desktop.\n\n## Revisit when\n\nPrivate sync moves from roadmap to implementation.",
          note: "Decision notes should explain the constraint, not only the final choice.",
        },
      },
      {
        id: "runbooks",
        title: "Write runbooks as steps, checks, and rollback notes",
        body: [
          "A runbook should be boring in a good way. The next person should know what to check, what command to run, and what rollback path exists if something goes wrong.",
          "Numbered lists are useful for ordered procedures. Tables are useful for short status checks. Keep long explanations outside the emergency path.",
        ],
        example: {
          label: "Runbook fragment",
          markdown:
            "## Deploy check\n\n1. Confirm CI is green.\n2. Build the app locally.\n3. Publish the release notes.\n\n| Check | Expected |\n| --- | --- |\n| Tests | Passing |\n| Build | Complete |\n| Rollback | Previous release tag |",
          note: "Runbooks should favor clarity over clever formatting.",
        },
      },
      {
        id: "release-notes",
        title: "Keep release notes close to real changes",
        body: [
          "Release notes are easier to write when they are updated near the work, not reconstructed at the end. Use short bullets and name the behavior users will notice.",
          "A changelog does not need to include every internal detail. It should help a user understand what changed, what improved, and what remains preview work.",
        ],
        example: {
          label: "Release note draft",
          markdown:
            "## Added\n\n- Copy Markdown and rendered HTML from the editor toolbar.\n- Open documentation examples directly in the web editor.\n\n## Fixed\n\n- Kept basics content focused on beginner Markdown patterns.",
          note: "Release notes should be specific enough to help users decide whether to try the update.",
        },
      },
      {
        id: "local-history",
        title: "Why local history matters",
        body: [
          "Developers already understand version control, but not every draft belongs in Git immediately. Local history snapshots help recover accidental edits before the document is committed or shared.",
          "This is one reason VeloWrite keeps better local recovery in the free preview roadmap. Draft safety is part of the editor foundation, not a Pro-only luxury.",
        ],
      },
    ],
    cta: {
      primary: { href: "/docs/markdown-code-blocks?utm_source=markdown_developers_cta&utm_medium=resource", label: "Code Blocks" },
      secondary: { href: "/web?utm_source=markdown_developers_cta&utm_medium=cta", label: "Try Editor" },
    },
  },
  advancedMarkdown: {
    eyebrow: "Advanced Markdown",
    title: "Advanced Markdown for Maintainable Documents",
    intro:
      "The advanced part of Markdown is not obscure syntax. It is writing files that stay readable in review, survive a move between tools, and still make sense six months later.",
    updated: "July 28, 2026",
    directory: [
      { label: "A source-first mindset", href: "#source-first" },
      { label: "One sentence per line", href: "#semantic-lines" },
      { label: "Reference links", href: "#reference-links" },
      { label: "Escaping technical text", href: "#escaping" },
      { label: "Stable anchors", href: "#stable-anchors" },
      { label: "Document contracts", href: "#document-contracts" },
      { label: "Portable syntax", href: "#portable-syntax" },
    ],
    sections: [
      {
        id: "source-first",
        title: "Think source-first, not preview-first",
        body: [
          "A polished preview matters, but the source file is the durable asset. An advanced Markdown workflow treats the .md file as something another person can edit in a plain text editor, review in Git, and publish through a different tool without a rescue operation.",
          "That changes the question you ask before adding syntax: does this make the source clearer, or only make this one preview look clever? Prefer the first option for documents that will live beyond a single draft.",
        ],
      },
      {
        id: "semantic-lines",
        title: "Write one sentence per line for reviewable prose",
        body: [
          "For notes that will be reviewed in Git or revised often, put each sentence on its own source line. Markdown renders those lines as one normal paragraph, while a diff shows exactly which sentence changed.",
          "This is especially useful for product specifications, contributor guides, policies, and release notes. It looks unusual in a plain editor for a few minutes, then becomes much easier to scan and revise.",
        ],
        example: {
          label: "Semantic line breaks",
          markdown:
            "VeloWrite keeps the source file local by default.\nEvery revision should leave the document easier to reopen.\nA short sentence per line makes review changes easier to isolate.",
          note: "The preview reads as one paragraph, while version control can track sentence-level changes.",
        },
      },
      {
        id: "reference-links",
        title: "Use reference links when citations repeat",
        body: [
          "Inline URLs make a source file noisy when the same destination appears several times. Reference links keep the paragraph readable and collect destinations at the bottom of the relevant section or document.",
          "They are useful for engineering proposals, research notes, and onboarding guides where readers need the link but editors need to focus on the words around it.",
        ],
        example: {
          label: "Reference links",
          markdown:
            "Read the [release checklist][checklist] before publishing.\nThe same [checklist][] is useful when reviewing a pull request.\n\n[checklist]: https://example.com/release-checklist",
          note: "Define a destination once, then reuse the short label wherever it helps the reader.",
        },
      },
      {
        id: "escaping",
        title: "Escape punctuation when technical prose looks like Markdown",
        body: [
          "Technical documents often need to show literal characters that Markdown would otherwise interpret. A backslash keeps an asterisk, hash, bracket, or underscore visible as text instead of turning it into emphasis, a heading, a link, or another construct.",
          "Use inline code for a compact command or filename. Use a fenced code block when punctuation, whitespace, or multiple lines must be copied exactly.",
        ],
        example: {
          label: "Literal Markdown characters",
          markdown:
            "Use \\*literal asterisks\\* when explaining emphasis.\n\nUse \\# not a heading when documenting a shell comment.\n\nUse `docs/release-notes.md` for a filename that readers may copy.",
          note: "Escape only what needs to stay literal. Too many escapes make source harder to read.",
        },
      },
      {
        id: "stable-anchors",
        title: "Treat headings as stable links, not decorative labels",
        body: [
          "Most Markdown tools generate section anchors from headings. That means a heading such as \"Install on Linux\" may already be a link used by an internal table of contents, another document, or a shared message.",
          "Choose headings that describe a durable concept, and avoid renaming them for style alone after people have started linking to them. When a section needs a new angle, add a subheading instead of silently changing the destination.",
        ],
        example: {
          label: "Heading hierarchy",
          markdown:
            "# Deployment guide\n\n## Install on Linux\n\nUse the package that matches the distribution.\n\n### Debian and Ubuntu\n\nInstall the `.deb` package.\n\n### Fedora and openSUSE\n\nInstall the `.rpm` package.",
          note: "Stable, descriptive headings make outlines and copied section links more reliable.",
        },
      },
      {
        id: "document-contracts",
        title: "Give recurring documents a small contract",
        body: [
          "A document contract is a short agreement about what a recurring file contains and how it is maintained. For example, a decision record may always include context, the decision, consequences, and an owner. A release note may always include user impact and upgrade notes.",
          "The contract can be a lightweight template at the top of the file. It removes blank-page friction and makes a folder of Markdown documents easier for a team to navigate.",
        ],
        example: {
          label: "Decision record template",
          markdown:
            "# Decision: Store documents as local Markdown\n\n## Context\n\nThe team needs files that remain readable without a specific service.\n\n## Decision\n\nKeep source documents as Markdown in the project folder.\n\n## Consequences\n\nUse a browser editor for quick drafts and desktop files for ongoing work.\n\n## Owner\n\nWriting workflow team",
          note: "A repeatable structure is often more valuable than a more complicated Markdown extension.",
        },
      },
      {
        id: "portable-syntax",
        title: "Know where portable Markdown ends",
        body: [
          "Headings, paragraphs, lists, links, blockquotes, fenced code, and reference links travel well between Markdown tools. Tables, math, task lists, diagrams, front matter, and custom callouts depend more on the renderer and publishing target.",
          "VeloWrite supports tables, KaTeX math, syntax-highlighted code, and tabbed previews for adjacent language examples. When a file must move between editors, test it in the destination tool and keep the source understandable even if an extension is unavailable.",
        ],
      },
    ],
    cta: {
      primary: { href: "/docs/markdown-math?utm_source=advanced_markdown_cta&utm_medium=resource", label: "Markdown Math" },
      secondary: { href: "/docs/markdown-code-blocks?utm_source=advanced_markdown_cta&utm_medium=resource", label: "Code Blocks" },
    },
  },
  markdownMath: {
    eyebrow: "Technical writing",
    title: "Markdown Math with KaTeX",
    intro:
      "Math support makes Markdown useful for study notes, engineering docs, product analysis, and research drafts. VeloWrite renders math with KaTeX in the preview, so you can keep formulas beside the plain-text source that explains them.",
    updated: "July 26, 2026",
    directory: [
      { label: "Inline math", href: "#inline-math" },
      { label: "Block math", href: "#block-math" },
      { label: "Variables", href: "#variables" },
      { label: "Tables", href: "#tables" },
      { label: "Readable notes", href: "#readable-notes" },
      { label: "Preview workflow", href: "#preview-workflow" },
    ],
    sections: [
      {
        id: "inline-math",
        title: "Use inline math for small expressions",
        body: [
          "Inline math belongs inside a sentence, where the expression is short enough not to interrupt reading. Use it for variables, units, compact equations, and short references that need to stay close to the surrounding words.",
          "If the expression needs its own explanation, do not force it inline. Put it in a block and use the paragraph before or after the formula to explain what the reader should notice.",
        ],
        example: {
          label: "Inline math",
          markdown:
            "The term $x_i$ represents one input sample, and $n$ is the total number of samples.\n\nA simple average can be written as $\\bar{x}$ when the full equation is explained nearby.",
          note: "Inline math is best when it supports the sentence instead of replacing it.",
        },
      },
      {
        id: "block-math",
        title: "Use block math when the formula is the point",
        body: [
          "Block math should stand on its own. It is better for equations that readers need to inspect, copy, compare, or discuss in a review.",
          "A useful pattern is: introduce the idea, show the formula, then explain the variables. That keeps the document readable even for someone who is scanning before they study the details.",
        ],
        example: {
          label: "Block math",
          markdown:
            "The arithmetic mean is the sum of all samples divided by the sample count:\n\n$$\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n}x_i$$\n\nHere, $x_i$ is one sample and $n$ is the total number of samples.",
          note: "Preview the rendered result before sharing technical documents.",
        },
      },
      {
        id: "variables",
        title: "Keep surrounding explanation clear",
        body: [
          "A formula without context is hard to use. Explain what each variable means, then show the equation, then describe how it affects the document's conclusion.",
          "Do not assume future readers will remember why a symbol was chosen. In team docs, study notes, and product analysis, a small variable list can save time later.",
        ],
        example: {
          label: "Variables beside a formula",
          markdown:
            "We use a weighted score when recent signals matter more than older ones:\n\n$$S = \\sum_{i=1}^{n} w_i x_i$$\n\n| Symbol | Meaning |\n| --- | --- |\n| $S$ | Final score |\n| $w_i$ | Weight for signal $i$ |\n| $x_i$ | Signal value |",
          note: "A short table is useful when symbols appear more than once.",
        },
      },
      {
        id: "tables",
        title: "Use tables for small math references",
        body: [
          "Tables work well for compact reference material: symbol definitions, parameter ranges, model assumptions, or before-and-after values. Keep cells short so the Markdown source remains readable.",
          "If a formula, explanation, or derivation becomes long, move it out of the table and into a normal section. Long math inside table cells is hard to edit and easy to break.",
        ],
        example: {
          label: "Math reference table",
          markdown:
            "| Term | Meaning | Example |\n| --- | --- | --- |\n| $r$ | Growth rate | $r = 0.08$ |\n| $t$ | Time period | $t = 12$ months |\n| $P_t$ | Projected value | $P_t = P_0(1+r)^t$ |",
          note: "Tables are for reference, not for long derivations.",
        },
      },
      {
        id: "readable-notes",
        title: "Write math notes for rereading",
        body: [
          "The best math note is not the one with the most notation. It is the one you can reopen later and understand quickly. Use headings for the problem, assumptions, formula, and conclusion.",
          "For study notes, keep one concept per section. For engineering notes, include the decision that the formula supports. For product analysis, write the conclusion in words before the equation becomes too detailed.",
        ],
        example: {
          label: "Rereadable math note",
          markdown:
            "## Conversion estimate\n\nWe estimate monthly paid users from traffic, activation, and paid conversion.\n\n$$P = V \\times a \\times c$$\n\nWhere:\n\n- $V$ is monthly visitors\n- $a$ is editor activation rate\n- $c$ is activated-to-paid conversion\n\nIf $V = 10,000$, $a = 0.15$, and $c = 0.03$, then $P = 45$ new paid users.",
          note: "The formula is easier to trust when the assumptions are visible.",
        },
      },
      {
        id: "preview-workflow",
        title: "Preview formulas before sharing",
        body: [
          "Math syntax is easy to mistype. A missing brace or an unclosed delimiter can make a clean note look broken. Split preview helps you catch those mistakes while the source is still visible.",
          "In VeloWrite, use the web editor for quick math checks and the desktop app for local technical documents you will revise. Local files, recent documents, and history snapshots matter more once the note becomes part of a real project.",
        ],
        example: {
          label: "Formula check workflow",
          markdown:
            "# Formula Check\n\n## Source\n\nThe expected value is:\n\n$$E[X] = \\sum_x x \\cdot P(X=x)$$\n\n## Review\n\n- Does the formula render?\n- Are variables explained?\n- Is the conclusion written in plain language?",
          note: "Preview is not decoration. It is part of reviewing a technical draft.",
        },
      },
    ],
    cta: {
      primary: { href: "/web?utm_source=markdown_math_cta&utm_medium=cta", label: "Try Math Preview" },
      secondary: { href: "/docs/advanced-markdown?utm_source=markdown_math_cta&utm_medium=resource", label: "Advanced Markdown" },
    },
  },
  markdownCodeBlocks: {
    eyebrow: "Technical writing",
    title: "Markdown Code Blocks and Tabs",
    intro:
      "Code blocks are one of the main reasons Markdown works well for technical writing. A good code example should be easy to copy, easy to compare with the explanation, and short enough that readers do not lose the point.",
    updated: "July 24, 2026",
    directory: [
      { label: "Fenced blocks", href: "#fenced-blocks" },
      { label: "Language labels", href: "#language-labels" },
      { label: "Long code", href: "#long-code" },
      { label: "Tabbed examples", href: "#tabbed-examples" },
      { label: "When not to use tabs", href: "#skip-tabs" },
      { label: "Preview in VeloWrite", href: "#preview-in-velowrite" },
    ],
    sections: [
      {
        id: "fenced-blocks",
        title: "Use fenced code blocks",
        body: [
          "A fenced code block starts and ends with three backticks. It is the most reliable way to show commands, configuration, source code, log fragments, and API examples in Markdown.",
          "Keep a short sentence before the block so the reader knows why the code is there. The block should support the paragraph, not replace it.",
        ],
        example: {
          label: "Fenced code",
          markdown:
            "Use a small JavaScript example when the document explains browser behavior:\n\n```js\nconst message = \"Write, preview, export\";\nconsole.log(message);\n```",
          note: "The explanation before the block tells readers what to look for.",
        },
      },
      {
        id: "language-labels",
        title: "Add language labels for syntax highlighting",
        body: [
          "The word after the opening fence tells the renderer how to highlight the block. Use common labels such as bash, js, ts, python, java, json, yaml, or markdown.",
          "Do not invent labels just for decoration. If the language is unknown, a plain code block is better than misleading highlighting.",
        ],
        example: {
          label: "Language labels",
          markdown:
            "Run the release checks first:\n\n```bash\nnpm test\nnpm run build\n```\n\nThen document the option in TypeScript:\n\n```ts\ntype ExportMode = \"markdown\" | \"html\";\n\nfunction labelFor(mode: ExportMode) {\n  return mode === \"html\" ? \"Rendered HTML\" : \"Markdown source\";\n}\n```",
          note: "Labels make the preview easier to scan and reduce mistakes when examples are copied.",
        },
      },
      {
        id: "long-code",
        title: "Make long code blocks readable",
        body: [
          "Long code blocks are sometimes necessary, but they should not dominate the whole page. Prefer the smallest complete example that proves the idea.",
          "If a line is long because it includes a URL, command, or nested object, place it in a block where horizontal scrolling or wrapping is expected. Avoid squeezing code into tables.",
        ],
        example: {
          label: "Readable command block",
          markdown:
            "A command is easier to read as a code block than inside a paragraph:\n\n```bash\ncurl -X POST https://api.example.com/documents \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"title\":\"Release notes\",\"format\":\"markdown\"}'\n```",
          note: "Break long shell commands with line continuations when that makes the steps clearer.",
        },
      },
      {
        id: "tabbed-examples",
        title: "Use tabs for multi-language examples",
        body: [
          "When the same idea needs Python, Bash, JavaScript, and Java versions, tabs are easier to read than four stacked blocks. The reader can pick the language they need while the surrounding explanation stays in one place.",
          "VeloWrite groups adjacent supported language blocks into a tabbed preview when the blocks look like parallel examples.",
        ],
        example: {
          label: "Multi-language tab example",
          markdown:
            "Show the same quick check in several languages:\n\n```python\nprint(\"VeloWrite\")\n```\n\n```bash\necho VeloWrite\n```\n\n```javascript\nconsole.log(\"VeloWrite\");\n```\n\n```java\nSystem.out.println(\"VeloWrite\");\n```",
          note: "Tabbed code is best when each block explains the same action in a different language.",
        },
      },
      {
        id: "skip-tabs",
        title: "Do not use tabs for unrelated code",
        body: [
          "Tabs are useful for alternatives, not for a sequence. If the reader must run one command, then edit a file, then start a service, keep those blocks vertical and ordered.",
          "A good rule is simple: use tabs for choices, use stacked blocks for steps.",
        ],
        example: {
          label: "Stacked steps",
          markdown:
            "Install dependencies, then build the project:\n\n```bash\nnpm ci\n```\n\n```bash\nnpm run build\n```\n\nThese are separate steps, so they should stay stacked.",
          note: "Sequential work should remain visible from top to bottom.",
        },
      },
      {
        id: "preview-in-velowrite",
        title: "Keep code blocks focused",
        body: [
          "A code example should prove one idea. If a block grows too long, split it into smaller examples and explain the transition between them.",
          "In VeloWrite, use split mode when you are writing technical docs. The editor keeps the source visible while the preview shows syntax highlighting, copyable blocks, math, tables, and tabbed language examples.",
          "For serious local documentation, move the draft to the desktop app so the file has a real path, can be backed up, and can use local history snapshots while you revise.",
        ],
      },
    ],
    cta: {
      primary: { href: "/demo?utm_source=code_blocks_cta&utm_medium=resource", label: "Open Demo" },
      secondary: { href: "/web?utm_source=code_blocks_cta&utm_medium=cta", label: "Try Editor" },
    },
  },
  localFirstMarkdown: {
    eyebrow: "Local-first workflow",
    title: "Local-First Markdown Editing",
    intro:
      "Local-first Markdown editing means your files stay useful on your own machine first. Cloud, sync, and AI can add value later, but the core document should stay readable, portable, and recoverable without a remote account.",
    updated: "July 25, 2026",
    directory: [
      { label: "What it means", href: "#what-it-means" },
      { label: "Browser vs desktop", href: "#browser-vs-desktop" },
      { label: "History recovery", href: "#history-recovery" },
      { label: "Sync design", href: "#sync-design" },
      { label: "Recovery rules", href: "#recovery-rules" },
      { label: "Practical workflow", href: "#practical-workflow" },
    ],
    sections: [
      {
        id: "what-it-means",
        title: "Local-first starts with a real file you control",
        body: [
          "A local-first Markdown workflow treats the file on your computer as the source of truth. The document is not trapped inside a private database, a browser session, or a hosted workspace that only one product can read.",
          "That matters because Markdown is supposed to be boring in the best way. You can copy a .md file to another folder, put it in Git, search it with normal tools, attach it to an issue, or open it in a different editor years later.",
        ],
        example: {
          label: "A portable project note",
          markdown:
            "# Launch Notes\n\n## Decision\n\nKeep the Markdown source in the project folder.\n\n## Why\n\n- The file can be backed up\n- The team can review it later\n- Another editor can still open it\n\n## Next\n\nSave a local copy before publishing.",
          note: "The value is not a special format. The value is that the source stays readable and movable.",
        },
      },
      {
        id: "browser-vs-desktop",
        title: "Use the browser for speed, desktop for durable work",
        body: [
          "The browser is the right place to test an idea quickly. Paste Markdown, check the preview, export HTML, or download a copy without signing in. That low-friction start is useful when the document is still disposable.",
          "The desktop app becomes the better home when the draft turns into a real file: a README, a runbook, class notes, meeting notes, a product spec, or a blog draft you will revise more than once. Native open and save, offline access, recent files, and local history are the difference between a quick tool and a daily writing workspace.",
        ],
      },
      {
        id: "history-recovery",
        title: "Local history is part of document safety",
        body: [
          "Undo is not enough for real writing. A mistake may be saved, the app may be reopened later, or a large paste may change a long document in a way that is hard to inspect. Local history gives the editor a safety net that is closer to how people actually work.",
          "VeloWrite's preview keeps basic local history recovery in the free foundation. The reason is simple: users should not feel that accidental recovery is a luxury feature. A Markdown editor earns trust by helping people avoid losing work.",
          "The product rule should be understandable before it becomes enforceable. Users should know how many snapshots are kept, what happens when the limit is reached, and how to protect important files outside the app.",
        ],
        example: {
          label: "History-friendly revision note",
          markdown:
            "# Draft Review\n\n## Before editing\n\nKeep the current argument short.\n\n## After editing\n\nExpand only the examples that support the main point.\n\n## Recovery rule\n\nIf the edit gets worse, compare with the previous saved version before restoring.",
          note: "Good recovery is not only about restoring. It is about seeing what changed before you replace the current draft.",
        },
      },
      {
        id: "sync-design",
        title: "Sync should preserve folder ownership",
        body: [
          "A good sync layer should not make local files feel less local. The folder should remain visible, backup-friendly, and usable in other tools. Sync should move changes between devices, not turn a Markdown vault into an opaque account-only workspace.",
          "Many users already have a sync habit: Git for project docs, Syncthing for private machines, iCloud or OneDrive for everyday files, Dropbox for shared folders. VeloWrite should respect those choices before introducing anything heavier.",
          "The most useful near-term work is not a hosted sync service. It is predictable file behavior: clear save paths, recent files, import/export, conflict explanation, and documentation that tells users what is stored locally.",
        ],
        example: {
          label: "Sync-friendly folder layout",
          markdown:
            "# Notes Folder\n\n## Structure\n\n- inbox.md\n- project-plan.md\n- meeting-notes.md\n- archive/\n\n## Sync rule\n\nKeep the folder visible so another backup or sync tool can protect it.",
          note: "A visible folder keeps the workflow understandable even when sync tools are involved.",
        },
      },
      {
        id: "recovery-rules",
        title: "Recovery rules should be visible",
        body: [
          "History and sync overlap. If two devices edit the same file, the editor should help users see which version changed, when it changed, and what can be restored. Silent overwrites are worse than asking the user to make a choice.",
          "Before VeloWrite adds any advanced sync behavior, it should document the basic recovery model: where snapshots live, how restore works, whether deleted snapshots can be recovered, and what users should back up themselves.",
          "This is still part of the ordinary product foundation. Clear recovery rules reduce support burden and make the desktop app feel safer for daily documents.",
        ],
      },
      {
        id: "practical-workflow",
        title: "A practical local-first Markdown workflow",
        body: [
          "Start in the web editor when the document is only an idea. Move to desktop once the file deserves a name and a folder. Keep important documents in a project folder, a synced folder you control, or a Git repository if version history matters.",
          "Use preview while drafting, export only when the document is ready to share, and treat local history as a recovery layer rather than your only backup. That keeps the workflow lightweight without pretending the editor should own everything.",
        ],
      },
    ],
    cta: {
      primary: { href: "/download?utm_source=local_first_cta&utm_medium=cta", label: "Download Desktop" },
      secondary: { href: "/roadmap?utm_source=local_first_cta&utm_medium=resource", label: "View Roadmap" },
    },
  },
  typoraAlternative: {
    eyebrow: "Editor comparison",
    title: "Typora Alternative",
    intro:
      "Typora helped make focused Markdown editing feel mainstream. VeloWrite takes a different early path: browser trial first, lightweight Tauri desktop builds, local-first files, and a roadmap for AI-native workflows.",
    updated: "July 21, 2026",
    sections: [
      {
        title: "What VeloWrite is trying to improve",
        body: [
          "The goal is not to copy every mature Typora feature immediately. The early goal is a fast preview editor that feels honest: try it online, download desktop when local files matter, and see public roadmap status before expecting Pro workflows.",
        ],
      },
      {
        title: "Where VeloWrite is already useful",
        body: [
          "The current preview supports browser editing, live preview, Markdown download, HTML export, desktop open and save, recent files, local history snapshots, math rendering, code highlighting, and tabbed examples.",
        ],
      },
      {
        title: "Where Typora is still ahead",
        body: [
          "VeloWrite is still preview software. Continuous sync scrolling, history diff preview, richer image handling, Mermaid, PDF export, signed installers, and advanced polish are still on the roadmap.",
          "That transparency matters: users should know what is ready before depending on a new editor.",
        ],
      },
    ],
    cta: {
      primary: { href: "/web?utm_source=typora_alternative_cta&utm_medium=cta", label: "Try VeloWrite" },
      secondary: { href: "/roadmap?utm_source=typora_alternative_cta&utm_medium=resource", label: "Check Roadmap" },
    },
  },
  markdownToBlog: {
    eyebrow: "Publishing workflow",
    title: "Markdown to Blog",
    intro:
      "Markdown is a practical way to draft a blog post before a CMS, theme, or publishing platform gets involved. Keep the source portable, use preview to review the reading flow, then export or print when the draft is ready to leave your editor.",
    updated: "July 27, 2026",
    directory: [
      { label: "Start with structure", href: "#start-with-structure" },
      { label: "Draft for reading", href: "#draft-for-reading" },
      { label: "Preview before export", href: "#preview-before-export" },
      { label: "Choose an output", href: "#choose-an-output" },
      { label: "Keep a source of truth", href: "#source-of-truth" },
      { label: "Publishing later", href: "#publishing-later" },
    ],
    sections: [
      {
        id: "start-with-structure",
        title: "Start with structure, not the editor chrome",
        body: [
          "Begin with a working title, the promise to the reader, and a few section headings. That is enough structure to decide whether the article has a useful path before you spend time polishing sentences.",
          "Markdown is helpful here because headings, lists, links, quotes, code, tables, and images stay visible in the source. The draft remains easy to move between a browser, a local file, and the publishing tool you eventually choose.",
        ],
        example: {
          label: "A blog post skeleton",
          markdown:
            "# A practical title\n\nA one-paragraph promise that explains who this is for and what they will take away.\n\n## The problem\n\nDescribe the situation the reader recognizes.\n\n## The workflow\n\nShow the steps with a concrete example.\n\n## What to do next\n\nEnd with one decision or action.",
          note: "A useful outline makes it easier to spot missing ideas before the draft gets long.",
        },
      },
      {
        id: "draft-for-reading",
        title: "Draft for reading, not just for search",
        body: [
          "A good blog draft should make sense to a person before it tries to rank for a phrase. Use a direct opening, headings that describe real questions, short paragraphs, and examples that prove the point.",
          "Search terms still matter, but they belong in the natural language of the article: the title, a relevant heading, the introduction, and the places where the topic is genuinely explained. Avoid repeating a phrase when a clearer sentence would do.",
        ],
        example: {
          label: "A readable section",
          markdown:
            "## Why a preview matters\n\nA preview lets you read the draft as a reader will see it. It catches headings that are too vague, lists that belong in prose, and code blocks that need an explanation before someone copies them.\n\n> Write the conclusion in plain language before you add more formatting.",
          note: "The preview should help you review the argument, not only check Markdown syntax.",
        },
      },
      {
        id: "preview-before-export",
        title: "Preview before export",
        body: [
          "Preview catches broken structure, awkward tables, long code blocks, and math that does not render as expected. Read the document from top to bottom at least once before you export it.",
          "In VeloWrite, switch to Preview for a clean reading pass, then return to Split when you need to fix the source beside the result. This is especially useful for technical posts with tables, formulas, or multi-language code examples.",
        ],
        example: {
          label: "A short publishing checklist",
          markdown:
            "## Before export\n\n- [ ] The title says what the reader will learn\n- [ ] Every heading earns the section below it\n- [ ] Links point to the right place\n- [ ] Code and math render correctly\n- [ ] The conclusion gives a real next step",
          note: "A short check is more reliable than trying to remember every detail at the end.",
        },
      },
      {
        id: "choose-an-output",
        title: "Choose the output that fits the next step",
        body: [
          "Download Markdown when the next tool accepts source files or when you want a durable local copy. Export HTML when you need to paste a structured draft into a site builder, documentation tool, or static site workflow.",
          "Use Print / Save PDF when someone needs a readable review copy, a handout, or an attachment. It opens a clean document instead of printing the editor interface, and your browser can save that document as a PDF.",
        ],
        example: {
          label: "Output decision",
          markdown:
            "| Need | Best next step |\n| --- | --- |\n| Keep editing later | Download Markdown |\n| Move into a CMS or static site | Export HTML |\n| Send a review copy | Print or Save PDF |\n| Publish automatically | Keep the source and wait for a later publishing workflow |",
          note: "The output should match the next job, not force every draft into the same format.",
        },
      },
      {
        id: "source-of-truth",
        title: "Keep one source of truth",
        body: [
          "The Markdown file should remain the source you can reopen and revise. Exported HTML and PDFs are useful delivery formats, but they are not the best place to continue editing a living article.",
          "For important posts, keep the Markdown file in a folder you back up. The desktop app is the better path once the draft becomes a real file: it supports native open and save, recent files, local history snapshots, and offline work.",
        ],
      },
      {
        id: "publishing-later",
        title: "Publishing automation belongs later",
        body: [
          "One-click publishing to GitHub Pages, Vercel, CMS tools, or static blogs can save time, but it should not replace a trustworthy editor and export workflow. VeloWrite keeps that work on the later Pro roadmap instead of pretending it is ready today.",
          "The useful workflow now is simple: write, preview, export or print, then publish through the platform you already trust. That keeps your files portable and the current preview honest.",
        ],
      },
    ],
    cta: {
      primary: { href: "/web?utm_source=markdown_to_blog_cta&utm_medium=cta", label: "Draft and Export" },
      secondary: { href: "/roadmap?utm_source=markdown_to_blog_cta&utm_medium=resource", label: "Publishing Roadmap" },
    },
  },
  markdownEditorForWindows: {
    eyebrow: "Platform guide",
    title: "Markdown Editor for Windows",
    intro:
      "Windows users can try VeloWrite in the browser first, then install the desktop preview for native local files, recent documents, local history, and offline writing.",
    updated: "July 21, 2026",
    sections: [
      {
        title: "Use the web editor for a quick test",
        body: [
          "If you only need to paste Markdown, preview it, and download a copy, the browser editor is the fastest starting point. No account is required.",
        ],
      },
      {
        title: "Use desktop for real files",
        body: [
          "The Windows preview adds native open and save, recent files, HTML export, and local history snapshots. It is better for documents you plan to keep editing.",
        ],
      },
      {
        title: "Installer status",
        body: [
          "The current Windows installer is unsigned, so SmartScreen may warn during install. That is expected for the preview stage and will be revisited before broader stable promotion.",
        ],
      },
    ],
    cta: {
      primary: { href: "/download?utm_source=windows_article_cta&utm_medium=cta", label: "Download Windows" },
      secondary: { href: "/web?utm_source=windows_article_cta&utm_medium=cta", label: "Try Web Editor" },
    },
  },
  markdownEditorForMac: {
    eyebrow: "Platform guide",
    title: "Markdown Editor for Mac",
    intro:
      "VeloWrite is designed to support Mac users with a lightweight local-first Markdown workflow. The Apple Silicon DMG is built through GitHub Actions and appears on the download page after a successful build.",
    updated: "July 21, 2026",
    sections: [
      {
        title: "Start in the browser today",
        body: [
          "Mac users can use the web editor immediately for writing, preview, Markdown download, and HTML export. It is the safest way to evaluate the workflow before installing anything.",
        ],
      },
      {
        title: "Desktop expectations",
        body: [
          "The desktop direction is the same as other platforms: local files, offline writing, recent documents, and local history snapshots. The preview is not code-signed or notarized yet.",
        ],
      },
      {
        title: "DMG status",
        body: [
          "The macOS DMG is intentionally only shown on the download page after the release asset exists. That avoids broken links and keeps the public download page honest.",
        ],
      },
    ],
    cta: {
      primary: { href: "/web?utm_source=mac_article_cta&utm_medium=cta", label: "Try Web Editor" },
      secondary: { href: "/download?utm_source=mac_article_cta&utm_medium=resource", label: "Check Downloads" },
    },
  },
  markdownEditorForLinux: {
    eyebrow: "Platform guide",
    title: "Markdown Editor for Linux",
    intro:
      "Linux users are a natural fit for a lightweight Markdown editor because they often value portable files, local-first workflows, and low-overhead desktop software.",
    updated: "July 21, 2026",
    sections: [
      {
        title: "Choose the package that fits your system",
        body: [
          "VeloWrite publishes Linux preview builds as AppImage, DEB, and RPM assets. AppImage is portable, DEB fits Debian and Ubuntu families, and RPM fits Fedora, RHEL, and similar distributions.",
        ],
      },
      {
        title: "Why Tauri matters on Linux",
        body: [
          "A Tauri desktop app can keep the package smaller than many Electron-style tools while still offering a modern interface. The goal is a fast Markdown surface without a heavy runtime feel.",
        ],
      },
      {
        title: "Use local files as the foundation",
        body: [
          "Linux users often already have strong backup, Git, and folder workflows. VeloWrite should fit those habits instead of hiding documents behind a cloud-only account model.",
        ],
      },
    ],
    cta: {
      primary: { href: "/download?utm_source=linux_article_cta&utm_medium=cta", label: "Download Linux" },
      secondary: { href: "/docs/local-first-markdown?utm_source=linux_article_cta&utm_medium=resource", label: "Local-First Workflow" },
    },
  },
  guide: {
    eyebrow: "Practical Markdown guide",
    title: "Markdown Starter Guide",
    intro:
      "This guide is written for people who want a usable Markdown workflow, not a wall of theory. Start with the web editor, try the examples, then move to desktop when local files and offline work matter.",
    updated: "July 19, 2026",
    sections: [
      {
        title: "Start with a simple draft",
        body: [
          "Open the web editor if you want the fastest path from blank page to rendered output. You can write without signing in, preview instantly, and download Markdown or HTML when you are done.",
          "A useful first draft usually needs only a title, a short summary, and one or two structured sections. That is enough for notes, docs, blog posts, and release summaries.",
        ],
        example: {
          label: "Example draft",
          markdown:
            "# Project Notes\n\n## Summary\n\nWrite a short paragraph.\n\n- Keep it readable\n- Keep it local\n- Export when ready",
          note: "Use short headings and short lists first. Structure beats decoration.",
        },
      },
      {
        title: "Use the parts Markdown is good at",
        body: [
          "Headings help readers skim. Lists help them scan actions. Tables help compare options. Code blocks help explain commands. Math helps when you write formulas or technical notes.",
          "VeloWrite also supports tabbed code examples, so you can show Python, Bash, JavaScript, or Java in one place without turning the page into a long stack of blocks.",
        ],
        example: {
          label: "Example structure",
          markdown:
            "| Field | Value |\n| --- | --- |\n| Status | Preview |\n| Export | Markdown / HTML |\n\n```bash\nnpm run build\n```\n\n$$E = mc^2$$",
          note: "Tables, code fences, and math are often enough for technical writing.",
        },
      },
      {
        title: "Move to desktop when the file matters",
        body: [
          "The browser is best for quick drafts and public sharing. The desktop app is the better home for real files, local folders, offline work, recent files, and local history snapshots.",
          "If you care about keeping a Markdown vault on your own machine, the desktop app is the one that fits that workflow better than a browser tab.",
        ],
      },
    ],
    cta: {
      primary: { href: "/web?utm_source=guide_cta&utm_medium=cta", label: "Open Web Editor" },
      secondary: { href: "/download?utm_source=guide_cta&utm_medium=cta", label: "Download Desktop" },
    },
  },
  onlineMarkdownEditor: {
    eyebrow: "Online Markdown editor",
    title: "Online Markdown Editor for Fast Drafts and Live Preview",
    intro:
      "An online Markdown editor should open quickly, keep the layout easy to read, and get out of the way. VeloWrite starts in the browser so you can write right away, then gives you a desktop path when local files, offline work, and saved history matter.",
    updated: "July 21, 2026",
    directory: [
      { label: "Why online", href: "#why-online" },
      { label: "Core workflow", href: "#core-workflow" },
      { label: "Privacy", href: "#privacy" },
      { label: "Desktop handoff", href: "#desktop-handoff" },
      { label: "FAQ", href: "#faq" },
    ],
    sections: [
      {
        id: "why-online",
        title: "Why use an online Markdown editor?",
        body: [
          "The main reason is speed. You can open a browser page, paste a rough draft, check the rendered result, and download a Markdown file without installing anything or creating an account.",
          "That makes it useful for short notes, README drafts, documentation snippets, support replies, launch copy, and technical writing that needs structure before it needs a full workspace.",
        ],
      },
      {
        id: "core-workflow",
        title: "The basic workflow",
        body: [
          "A useful online Markdown editor needs three things right away: write on the left, preview on the right, and export when the document is ready.",
          "VeloWrite supports live preview, Markdown download, HTML export, local browser drafts, tables, math rendering, highlighted code blocks, and tabbed examples for multi-language documentation.",
        ],
        example: {
          label: "Markdown example",
          markdown:
            "# Release Plan\n\n## Goals\n\n- Keep the editor fast\n- Make preview trustworthy\n- Move serious files to desktop\n\n```bash\nnpm run build\n```\n\n$$a^2 + b^2 = c^2$$",
          note: "A browser editor is best when you want to shape content quickly and verify the rendered output.",
        },
      },
      {
        id: "privacy",
        title: "What happens to your Markdown content?",
        body: [
          "Normal VeloWrite web editing does not upload Markdown content to VeloWrite servers. Browser drafts are kept in localStorage on the same device so a refresh can recover the current draft.",
          "That makes the web editor handy for quick work, while sensitive long-term files still belong in a local workflow you control.",
        ],
      },
      {
        id: "desktop-handoff",
        title: "When should you move to desktop?",
        body: [
          "Move to the VeloWrite desktop preview when the document becomes a real file you want to keep, reopen, save directly, edit offline, or recover through local history snapshots.",
          "The product path is simple: use the web editor to try the workflow quickly, then use the desktop app for local-first Markdown writing.",
        ],
      },
      {
        id: "faq",
        title: "Online Markdown editor FAQ",
        body: [
          "Can I use VeloWrite without signing in? Yes. The current web editor is available without an account.",
          "Can I download my file? Yes. You can download a Markdown copy and export HTML from the browser.",
          "Is the desktop app required? No. It is recommended when you need native files, offline work, recent files, and local history snapshots.",
          "Will AI be free? Basic writing stays free in the preview. AI writing actions, advanced export, and deeper recovery are likely Pro features, while sync and publishing remain later candidates.",
        ],
      },
    ],
    cta: {
      primary: { href: "/web?utm_source=online_markdown_editor_cta&utm_medium=cta", label: "Open Web Editor" },
      secondary: { href: "/download?utm_source=online_markdown_editor_cta&utm_medium=cta", label: "Download Desktop" },
    },
  },
  changelog: {
    eyebrow: "Release notes",
    title: "VeloWrite Changelog",
    intro:
      "This changelog keeps the preview history readable. It shows what changed, why it changed, and which parts are still intentionally incomplete. Older preview versions are kept below so you can scan the release history at a glance.",
    updated: "July 25, 2026",
    directory: [
      { label: "0.1.13", href: "#v0113" },
      { label: "Unreleased", href: "#unreleased" },
      { label: "0.1.12", href: "#v0112" },
      { label: "0.1.11", href: "#v0111" },
      { label: "0.1.10", href: "#v0110" },
      { label: "0.1.9", href: "#v019" },
      { label: "0.1.8", href: "#v018" },
      { label: "0.1.7", href: "#v017" },
      { label: "0.1.6", href: "#v016" },
      { label: "0.1.5", href: "#v015" },
      { label: "0.1.4", href: "#v014" },
      { label: "0.1.3", href: "#v013" },
      { label: "0.1.2", href: "#v012" },
      { label: "0.1.1", href: "#v011" },
      { label: "0.1.0", href: "#v010" },
    ],
    sections: [
      {
        id: "unreleased",
        title: "Unreleased",
        body: [
          "Next preview work will continue improving document structure workflows, desktop polish, and web-to-desktop handoff clarity.",
        ],
      },
      {
        id: "v0113",
        title: "0.1.13 preview",
        body: [
          "Added article sharing links to Markdown docs with side and bottom share surfaces for X, LinkedIn, Reddit, Facebook, and Hacker News.",
          "Published the top-level What Is Markdown article and added static SEO HTML for the route.",
          "Added Roadmap recommended priorities so visitors can see the next practical product direction before reading the full list.",
          "Added a document structure map to the editor outline with total H1/H2/H3 counts and active heading clarity after outline navigation.",
          "Updated the roadmap status for outline and structure map work to show that the free foundation has shipped.",
          "Kept the security hardening from the previous preview line, including stricter desktop file safety, CSP, API input limits, and waitlist/feedback protections.",
        ],
      },
      {
        id: "v0112",
        title: "0.1.12 preview",
        body: [
          "Added Windows Markdown file association metadata for .md, .markdown, and .mdown documents.",
          "Added system Open With handling so VeloWrite can receive a Markdown file path when launched from Windows Explorer.",
          "Added single-instance file handoff so opening another Markdown file while VeloWrite is already running focuses the app and opens the requested file.",
          "Added a VeloWrite Start Menu folder for the Windows NSIS installer.",
        ],
      },
      {
        id: "v0111",
        title: "0.1.11 preview",
        body: [
          "Set the free preview history policy to the latest 3 local snapshots across browser drafts, unsaved desktop drafts, and native desktop file history.",
          "Added a clearer desktop Continue Draft start panel with current draft name and 3-snapshot recovery status.",
          "Changed the editor status bar to show history as 0 / 3, 1 / 3, 2 / 3, or 3 / 3 snapshots instead of an open-ended count.",
          "Improved desktop save feedback so users know when the previous version was kept or when the oldest snapshot rotated out.",
          "Added the installed app version to the desktop About panel.",
          "Added clearer history panel copy so users understand what is kept locally and why older snapshots rotate out.",
          "Improved global control spacing on the website and editor surfaces so compact buttons and text links feel less crowded.",
          "Improved download page CTA spacing and moved the analytics consent banner away from the primary platform cards on desktop.",
          "Kept the SEO/GEO static rendering improvements from the previous unreleased work in this preview line.",
        ],
      },
      {
        id: "v0110",
        title: "0.1.10 preview",
        body: [
          "Fixed desktop history so unsaved drafts can keep local recovery snapshots before the document has been saved as a real file.",
          "Reworked the history restore dialog so long diffs reserve space for the actual changed lines instead of letting summary text dominate the panel.",
          "Changed matching history snapshots to show a clear No differences state in the default Changes view instead of showing unchanged document text.",
          "Fixed outline navigation timing so the editor and preview panes stay aligned when jumping between headings after changing view modes.",
          "Improved dark-mode preview code blocks with readable syntax colors, stronger code backgrounds, and dark-aware tabbed-code styling.",
        ],
      },
      {
        id: "v019",
        title: "0.1.9 preview",
        body: [
          "Added a desktop start panel with local file actions, recent-file recovery, history access, and practical templates before a real file is opened.",
          "Added a real desktop Focus Mode that hides application chrome while keeping a visible exit control.",
          "Reworked the editor status bar into a file trust strip showing storage scope, save state, and available history snapshots.",
          "Fixed Tauri startup so the installed desktop app opens the desktop editor shell instead of the marketing homepage.",
          "Changed the homepage embedded editor to open in preview mode so first-time visitors see polished rendered Markdown immediately.",
          "Made desktop focused writing feel less like a code editor by reducing toolbar noise and visually de-emphasizing line gutters.",
          "Tightened the mobile analytics consent banner so it stays compliant without covering as much of the first screen.",
          "Replaced the heavy default sample document with a friendlier starter draft for first-time web and desktop users.",
          "Improved the homepage and interactive demo loading state with an editor-shaped skeleton instead of a large blank loading panel.",
          "Changed first-time mobile web editing to open in write mode instead of split mode for better small-screen usability.",
          "Added contextual desktop upgrade prompts after browser-only save/export and local-file-limited actions.",
          "Added practical editor templates for quick notes, meeting notes, README files, and article drafts in the web and desktop shells.",
          "Added an explicit confirmation step before restoring a history snapshot and clarified the diff legend for older versus current lines.",
          "Added homepage trust signals for privacy, recovery, public roadmap tracking, and visible preview limits.",
          "Reworked download preview notes into clearer install safety guidance for official sources, unsigned installer warnings, backups, and web-first evaluation.",
          "Added the macOS Apple Silicon DMG to the download page now that the release asset is available.",
          "Published Local-First Markdown Editing as the sixth staged Markdown library article, covering file ownership, recovery, and local-first sync design.",
          "Expanded the public roadmap with clearer sync and recovery policy notes, while keeping advanced paid-plan framing on the Pro page.",
          "Fixed the web editor tablet and small-desktop layout so the preview no longer clips when the browser is around 834-1024px wide.",
          "Refined the homepage product showcase, footer link hierarchy, cookie consent banner, mobile landing header, desktop focused editor width, responsive editor toolbar, and documentation code examples.",
          "Improved the download page platform cards and added a mobile web editor brand link back to the homepage.",
        ],
      },
      {
        id: "v018",
        title: "0.1.8 preview",
        body: [
          "Published Markdown for Writers as the third staged Markdown library article under /docs.",
          "Published Markdown for Developers as the fourth staged Markdown library article under /docs.",
          "Published Markdown Basics as the second staged Markdown library article under /docs.",
          "Published Markdown Code Blocks and Tabs as the fifth staged Markdown library article with examples for fenced code, syntax highlighting, long commands, and tabbed multi-language snippets.",
          "Added article-specific SEO metadata and sitemap entries for the four public articles while keeping the remaining article queue planned.",
          "Updated the public roadmap to show four staged learning articles and docs examples that open in the web editor.",
          "Added a web-to-desktop draft handoff button that downloads the current Markdown draft before opening desktop downloads.",
          "Prepared velowrite:// desktop handoff links so the next desktop build can import web drafts directly, with Markdown download kept as the fallback.",
          "Added a line-level desktop history restore preview so users can review changes before restoring a snapshot.",
          "Added browser-local web history snapshots with compare, restore, and delete actions.",
          "Added immediate CSS tooltips for desktop toolbar icon buttons.",
          "Added stricter docs routing so unknown /docs/* paths use the friendly 404 page.",
          "Revised the first two public Markdown articles with plainer wording.",
          "Made desktop history easier to find from the sidebar, toolbar, and File menu, including an empty-state explanation before snapshots exist.",
          "Changed the desktop shell to open in a focused editing layout by default, with a workspace toggle for the sidebar and outline.",
          "Fixed tabbed code previews so separate rendered examples no longer interfere with each other's default selected tab.",
          "Fixed the web editor brand link so clicking VeloWrite returns to the homepage.",
        ],
      },
      {
        id: "v017",
        title: "0.1.7 preview",
        body: [
          "Added the public Markdown library index and the first long-tail article for online Markdown editing.",
          "Added Product Hunt feedback follow-up copy, Speed Insights support, and grouped footer navigation.",
          "Improved the desktop shell so it opens in a focused writing surface without website analytics prompts.",
          "Fixed desktop close handling and improved outline clicks so the editor and preview panes align from the document outline.",
          "Updated the public roadmap to show shipped preview polish while keeping continuous sync scrolling marked as in progress.",
        ],
      },
      {
        id: "v016",
        title: "0.1.6 preview",
        body: [
          "Added a dedicated FAQ page for natural search and AI retrieval.",
          "Added SEO and GEO support with canonical metadata, FAQPage schema, llms.txt, sitemap entries, and breadcrumb data.",
          "Improved the homepage and interactive demo so the embedded editor is easier to scan and no longer clips the right edge.",
          "Kept the free preview focused on browser editing, desktop downloads, guide links, and feedback collection.",
        ],
      },
      {
        id: "v015",
        title: "0.1.5 preview",
        body: [
          "Added the feedback loop with Loops so visitors can report friction or join the beta.",
          "Published privacy language for feedback submissions and installed the public feedback page across the site.",
          "Expanded preview hardening with smoke checks for the landing page, web editor modes, demo tabs, download page, and feedback form.",
          "Added the first Markdown quick start guide for new users in both source and PDF form.",
        ],
      },
      {
        id: "v014",
        title: "0.1.4 preview",
        body: [
          "Shared a complex Markdown sample across the web demo and desktop first-run document.",
          "Added KaTeX math, highlighted code fences, and tabbed multi-language code examples to the preview renderer.",
          "Improved the Product Hunt demo with dedicated frame content, homepage video placement, and a stronger browser-first story.",
          "Added browser favicon, app icons, and download assets for Windows, Linux, and Apple Silicon macOS.",
        ],
      },
      {
        id: "v013",
        title: "0.1.3 preview",
        body: [
          "Launched the Pro roadmap page and the Pro interest waitlist path.",
          "Defined the first product-launch kit for the Product Hunt rollout.",
          "Started separating current preview behavior from the future paid workflow direction.",
        ],
      },
      {
        id: "v012",
        title: "0.1.2 preview",
        body: [
          "Added privacy, terms, refund, and license pages.",
          "Mounted the cookie and analytics consent banner before loading Vercel Analytics.",
          "Expanded the download page with preview status sections and clearer limits.",
        ],
      },
      {
        id: "v011",
        title: "0.1.1 preview",
        body: [
          "Added the download page with direct GitHub Release installer links.",
          "Documented the local install guide for Linux and Windows testers.",
          "Prepared local packaging scripts and fixed native dialog permissions for Tauri builds.",
        ],
      },
      {
        id: "v010",
        title: "0.1.0 baseline",
        body: [
          "Shipped the first Tauri desktop shell, React/Vite frontend, and Markdown editing core.",
          "Added split, writing-only, and preview-only modes with document outline, stats, and local file workflows.",
          "Laid the foundation for recent files, history snapshots, HTML export, and browser fallback imports.",
        ],
      },
      {
        id: "meaning",
        title: "What this release means",
        body: [
          "This release is about making the product explain itself better. A visitor should understand what VeloWrite is, what the browser can do, what the desktop app adds, and why a download is worth trying.",
          "For search engines and AI tools, the site now has enough structure to describe the product without guessing.",
        ],
      },
      {
        id: "planned",
        title: "Still planned",
        body: [
          "AI commands, private sync, publishing automation, commercial licensing, signed installers, and richer examples are still roadmap items.",
          "Release notes will keep growing as the preview matures, so users can see both progress and deliberate limits.",
        ],
      },
    ],
    cta: {
      primary: { href: "/download?utm_source=changelog_cta&utm_medium=cta", label: "Download Preview" },
      secondary: { href: "/faq?utm_source=changelog_cta&utm_medium=cta", label: "Read FAQ" },
    },
  },
};

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
        title: "Waitlist emails and feedback",
        body: [
          "If you join the waitlist, we collect the email address you submit and send it to Loops.so so we can manage beta invitations and product updates. Waitlist records may include basic context such as which page or form you used.",
          "If you submit feedback, we collect the email address, selected context fields, and message you provide. Feedback records are also sent to Loops.so so we can group product feedback and reply when requested.",
          "You can ask to be removed from the waitlist by using the unsubscribe link in any email we send or by sending a feedback request.",
        ],
      },
      {
        title: "Analytics and cookies",
        body: [
          "We use Vercel Web Analytics and Speed Insights to understand basic site usage and page performance, such as page views, download-link clicks, loading behavior, and interaction responsiveness. On this site, analytics and speed scripts are only loaded after you choose Allow analytics in the cookie banner.",
          "VeloWrite uses localStorage to remember your analytics choice. If you decline analytics, the analytics and speed scripts are not loaded by this React app. You can clear your browser site data to reset the choice.",
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
          <h1>Markdown that stays yours.</h1>
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
          <div className="hero-trust" aria-label="Privacy and workflow notes">
            <span>
              <ShieldCheck size={15} />
              Browser drafts stay local
            </span>
            <span>
              <FolderOpen size={15} />
              Desktop unlocks native files
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
          <React.Suspense fallback={<EditorPreviewSkeleton />}>
            <EditorApp surface="web" initialViewMode="preview" />
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
            <p>Best when Markdown becomes real work: private files, local folders, offline editing, and native save workflows.</p>
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

      <section className="trust-band" aria-label="Why people can trust VeloWrite">
        <div className="section-heading">
          <span>Trust signals</span>
          <h2>A preview build should still be clear about privacy, limits, and recovery.</h2>
        </div>
        <div className="trust-grid">
          <article>
            <ShieldCheck size={20} />
            <h3>Private by default</h3>
            <p>Browser drafts stay in local browser storage. Desktop files stay on your own disk unless you choose to export or share them.</p>
          </article>
          <article>
            <GitBranch size={20} />
            <h3>Recovery is part of the foundation</h3>
            <p>Local history and compare views are preview features today, because writers need rollback before they need cloud features.</p>
          </article>
          <article>
            <ListChecks size={20} />
            <h3>Roadmap is public</h3>
            <p>Feedback from early users is tracked on the roadmap, with free preview work separated from future Pro workflows.</p>
          </article>
          <article>
            <LockKeyhole size={20} />
            <h3>Limits are visible</h3>
            <p>Unsigned installers, preview gaps, and planned paid features are documented before download so testers know what they are getting.</p>
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
              A short product demo covering the web editor, live preview,
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
          <h2>Learn the workflow and track what changed.</h2>
        </div>
        <div className="resource-grid">
          <article className="resource-card">
            <FileText size={21} />
            <h3>Markdown Library</h3>
            <p>See the full article list: basics, advanced writing, editor comparisons, and today&apos;s published piece.</p>
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
            <p>See what changed in the current preview, what is stable today, and which Pro workflows are still planned.</p>
            <a className="text-link" href="/changelog?utm_source=homepage_resources&utm_medium=resource">
              Read changelog <ChevronRight size={15} />
            </a>
          </article>
          <article className="resource-card">
            <ListChecks size={21} />
            <h3>Public Roadmap</h3>
            <p>See which user requests are recorded, what stays free, and which workflows may become Pro later.</p>
            <a className="text-link" href="/roadmap?utm_source=homepage_resources&utm_medium=resource">
              View roadmap <ChevronRight size={15} />
            </a>
          </article>
        </div>
      </section>

      <section className="landing-waitlist" aria-label="Private beta signup">
        <div>
          <span>Follow the desktop beta</span>
          <h2>Get updates when bigger workflows land.</h2>
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
              Interactive demo
            </div>
            <h1>See the writing flow before you download.</h1>
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
            <React.Suspense fallback={<EditorPreviewSkeleton compact />}>
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
  const proPlans = [
    {
      name: "Free Preview",
      price: "$0",
      note: "Try the editor before trusting it with daily work.",
      features: [
        "Web and desktop Markdown editing",
        "Live preview and HTML export",
        "Native file open/save",
        "Latest 3 local history snapshots",
      ],
    },
    {
      name: "Pro Yearly",
      price: "$29/year",
      note: "Planned early-access price for the first paid users.",
      features: [
        "AI writing actions with fair-use credits",
        "Deeper local history and named checkpoints",
        "Advanced export styles",
        "BYOK AI support",
      ],
    },
    {
      name: "Lifetime Early",
      price: "$99",
      note: "Planned early local-Pro license for people who prefer ownership.",
      features: [
        "Lifetime local Pro features",
        "Advanced recovery and export features",
        "BYOK AI included",
        "Hosted AI credits are limited, not unlimited",
      ],
    },
  ];

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
            <h1>Free now. Pro when it earns it.</h1>
            <p>
              VeloWrite is currently free to test. The first Pro direction is
              intentionally focused: AI writing workflows, better export, and
              deeper local recovery before heavier cloud features.
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
              <p>Markdown editing, preview, local files, browser drafts, and basic desktop history recovery.</p>
            </div>
            <div>
              <span>Pricing preview</span>
              <strong>$29/year</strong>
              <p>Early Pro pricing is planned before checkout opens, with a $99 lifetime local-Pro option.</p>
            </div>
          </div>
        </section>

        <section className="pro-pricing" aria-label="Planned Pro pricing">
          <div className="section-heading">
            <span>Pricing preview</span>
            <h2>Simple early pricing, with clear AI limits.</h2>
            <p>
              These prices are a planning preview, not an active checkout. The
              goal is to set expectations early and avoid surprising users when
              Pro opens.
            </p>
          </div>
          <div className="pro-price-grid">
            {proPlans.map((plan) => (
              <article key={plan.name}>
                <span>{plan.name}</span>
                <strong>{plan.price}</strong>
                <p>{plan.note}</p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="pro-pricing-note">
            Hosted AI will use fair-use credits to keep the product sustainable.
            Lifetime access is planned for local Pro features; unlimited hosted
            AI is not planned.
          </p>
        </section>

        <section className="pro-grid" aria-label="Future Pro capabilities">
          <article>
            <WandSparkles size={22} />
            <h2>AI writing workflows</h2>
            <p>Turn notes into articles, generate READMEs, polish technical sections, summarize meetings, and expand outlines.</p>
          </article>
          <article>
            <FileText size={22} />
            <h2>Advanced export</h2>
            <p>Improve PDF output, add DOCX export, and support cleaner article, README, newsletter, and documentation templates.</p>
          </article>
          <article>
            <GitBranch size={22} />
            <h2>Advanced recovery</h2>
            <p>Longer retention, named checkpoints, richer diff review, and safer restore workflows after the free baseline is stable.</p>
          </article>
          <article>
            <LockKeyhole size={22} />
            <h2>Local-first by default</h2>
            <p>Keep basic files local while optional paid workflows add value without forcing every user into a hosted workspace.</p>
          </article>
          <article>
            <Rocket size={22} />
            <h2>Later workflow options</h2>
            <p>Private sync, one-click publishing, and team workflows remain possible after the individual writing workflow proves demand.</p>
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
              ["Local files", "Native desktop open/save", "Vault workflows and workspace polish"],
              ["History recovery", "Basic local snapshots and restore preview", "Longer retention, more restore points, and cross-device recovery"],
              ["AI", "Not active", "Task-based writing actions with fair-use credits and BYOK"],
              ["Export", "Markdown download and HTML export", "Better PDF, DOCX, templates, and custom styling"],
              ["Sync", "Not active", "Later only if paid users prove demand"],
              ["Pricing", "Free preview", "$29/year early Pro and $99 lifetime local-Pro planned"],
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
            <span>Shape Pro before checkout</span>
            <h2>What would make Pro worth it for you?</h2>
          </div>
          <WaitlistForm source="pro" label="Join the Pro interest list" />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function RoadmapPage() {
  return (
    <div className="roadmap-page">
      <header className="landing-nav">
        <a className="wordmark" href="/">
          <span className="brand-mark">V</span>
          VeloWrite
        </a>
        <div className="nav-actions">
          <a href="/web?utm_source=roadmap_nav&utm_medium=cta">
            Web editor <ChevronRight size={16} />
          </a>
          <a href="/feedback?utm_source=roadmap_nav&utm_medium=cta">
            Feedback <Mail size={16} />
          </a>
          <a href="/download?utm_source=roadmap_nav&utm_medium=cta">
            Download <Download size={16} />
          </a>
        </div>
      </header>

      <main className="roadmap-shell">
        <section className="roadmap-hero">
          <div className="eyebrow">
            <ListChecks size={16} />
            Public roadmap
          </div>
          <h1>What we are building next.</h1>
          <p>
            VeloWrite is still in preview, so early feedback directly shapes the product.
            This page shows which requests are core editor work, which preview fixes have
            shipped, and which local-first workflows are still being researched.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="/feedback?utm_source=roadmap_hero&utm_medium=cta">
              Send Feedback <MessageSquare size={17} />
            </a>
            <a className="secondary-link" href="/changelog?utm_source=roadmap_hero&utm_medium=resource">
              Read Changelog <FileText size={17} />
            </a>
          </div>
        </section>

        <section className="roadmap-summary" aria-label="Roadmap rules">
          <article>
            <span>Preview first</span>
            <strong>Core quality</strong>
            <p>Editing, preview, rendering trust, file handling, and recovery must feel solid before broader workflow expansion.</p>
          </article>
          <article>
            <span>Free by default</span>
            <strong>Basic writing</strong>
            <p>Markdown editing, preview, import, download, local files, and basic history should remain free.</p>
          </article>
          <article>
            <span>Research next</span>
            <strong>Local-first workflows</strong>
            <p>Sync, handoff, publishing, and advanced export should preserve file ownership and explain their limits before they ship.</p>
          </article>
        </section>

        <section className="roadmap-recommendations" aria-label="Recommended roadmap priorities">
          <div className="section-heading">
            <span>Recommended next</span>
            <h2>The next work should make daily writing feel safer and clearer.</h2>
            <p>
              These priorities are intentionally practical: improve the free editor foundation
              first, then use that trust to decide which Pro workflows deserve deeper work.
            </p>
          </div>
          <div className="roadmap-recommendation-grid">
            {roadmapRecommendations.map((item) => (
              <article key={item.title}>
                <span>{item.priority}</span>
                <h3>{item.title}</h3>
                <p>{item.reason}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="roadmap-list" aria-label="Recorded user requests">
          {publicRoadmapItems.map((item) => (
            <article className="roadmap-item" key={item.title}>
              <div className="roadmap-item-head">
                <div>
                  <span>{item.status}</span>
                  <h2>{item.title}</h2>
                </div>
                <strong>{item.target}</strong>
              </div>
              <div className="roadmap-item-grid">
                <div>
                  <span>User request</span>
                  <p>{item.request}</p>
                </div>
                <div>
                  <span>Product decision</span>
                  <p>{item.decision}</p>
                </div>
              </div>
              <div className="roadmap-tag">{item.classification}</div>
            </article>
          ))}
        </section>

        <section className="roadmap-followup" aria-label="How feedback is handled">
          <div>
            <span>Follow-up loop</span>
            <h2>When a request ships, we can reply to the users who asked for it.</h2>
            <p>
              If users leave an email through the feedback form, we can group their requests,
              update the public roadmap, and send a focused reply when the relevant feature is
              implemented or ready for testing.
            </p>
          </div>
          <div className="hero-actions">
            <a className="primary-link" href="/feedback?utm_source=roadmap_footer&utm_medium=cta">
              Add Your Request <ChevronRight size={17} />
            </a>
            <a className="secondary-link" href="/pro?utm_source=roadmap_footer&utm_medium=resource">
              View Pro Direction <Rocket size={17} />
            </a>
          </div>
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
          <a href="/feedback?utm_source=download_nav&utm_medium=cta">
            Feedback <Mail size={16} />
          </a>
        </div>
      </header>

      <main className="download-shell">
        <section className="download-hero">
          <div className="eyebrow">
            <Download size={16} />
            Desktop preview
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
              <div className="download-card-head">
                <div className="download-platform-mark" aria-hidden="true">
                  {item.platform.charAt(0)}
                </div>
                <div>
                  <span>{item.badge}</span>
                  <h2>{item.platform}</h2>
                  <small>{item.format}</small>
                </div>
              </div>
              <p>{item.note}</p>
              <p className="download-detail">{item.detail}</p>
              {item.fileName ? (
                <a
                  className="download-action"
                  href={`${releaseBaseUrl}/${item.fileName}?utm_source=download_page&utm_medium=installer&utm_campaign=v${downloadVersion}`}
                >
                  <Download size={16} />
                  Download
                </a>
              ) : (
                <button className="download-action" disabled>Building</button>
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
              <li>Windows, macOS Apple Silicon, and Linux preview packages</li>
              <li>Privacy policy, cookie consent, and waitlist email handling</li>
            </ul>
          </article>
          <article>
            <h2>Preview Limits</h2>
            <ul>
              <li>No code signing yet for Windows, and future macOS preview DMGs will also require signing and notarization work</li>
              <li>No account system, cloud sync, encrypted sharing, or team workspace</li>
              <li>No active AI assistant or publishing automation in the public build</li>
              <li>Free preview keeps the latest 3 local history snapshots for recovery</li>
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

        <section className="download-notes" aria-label="Install safety notes">
          <h2>Install Safety Notes</h2>
          <ul>
            <li>Use this download page or the official GitHub Releases page as the source for installers.</li>
            <li>Windows builds are not code-signed yet, so SmartScreen may show a warning during install.</li>
            <li>The macOS Apple Silicon DMG is unsigned today, so Gatekeeper may require an explicit open action.</li>
            <li>Back up important Markdown files while testing preview builds.</li>
            <li>If you only want to evaluate the editor first, use the web editor before installing the desktop app.</li>
          </ul>
        </section>

        <section className="download-notes" aria-label="Markdown guide">
          <h2>Markdown Starter Guide</h2>
          <ul>
            <li>Learn headings, lists, tables, links, code blocks, math, and practical writing workflows.</li>
            <li>The guide is written for people who want to use Markdown productively with VeloWrite.</li>
          </ul>
          <div className="feedback-actions">
            <a className="primary-link" href="/guide?utm_source=download_page&utm_medium=resource">
              Read Online Guide <ChevronRight size={17} />
            </a>
            <a className="primary-link" href="/markdown-guide.pdf">
              Download PDF Guide <Download size={17} />
            </a>
            <a className="secondary-link" href="/changelog?utm_source=download_page&utm_medium=resource">
              Read Changelog <FileText size={17} />
            </a>
          </div>
        </section>

        <section className="download-notes" aria-label="Feedback prompt">
          <h2>Send Feedback</h2>
          <ul>
            <li>Tell us what felt slow, confusing, missing, or surprisingly useful.</li>
            <li>Share whether you care most about the web editor, desktop app, or future Pro workflows.</li>
            <li>Leave your email if you want a reply or want to follow the beta.</li>
          </ul>
          <div className="feedback-actions">
            <a className="primary-link" href="/feedback?utm_source=download_page&utm_medium=cta">
              Open Feedback Form <ChevronRight size={17} />
            </a>
            <a className="secondary-link" href="/roadmap?utm_source=download_page&utm_medium=resource">
              View Public Roadmap <ListChecks size={17} />
            </a>
          </div>
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
          <a href="/feedback?utm_source=privacy_nav&utm_medium=cta">
            Feedback <Mail size={16} />
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

function ContentPage({ page }: { page: keyof typeof contentPages }) {
  const content = contentPages[page];
  const shareUrl = `${siteUrl}${normalizePath(window.location.pathname)}`;
  const shareTitle = content.title;
  const shareDescription = content.intro;
  const showShareLinks = page !== "changelog";

  return (
    <div className="content-page">
      <header className="landing-nav">
        <a className="wordmark" href="/">
          <span className="brand-mark">V</span>
          VeloWrite
        </a>
        <div className="nav-actions">
          <a href="/web?utm_source=content_nav&utm_medium=cta">
            Web editor <ChevronRight size={16} />
          </a>
          <a href="/download?utm_source=content_nav&utm_medium=cta">
            Download <Download size={16} />
          </a>
          <a href="/faq?utm_source=content_nav&utm_medium=cta">
            FAQ <FileText size={16} />
          </a>
        </div>
      </header>

      <main className={content.directory ? "content-shell content-shell-wide" : "content-shell"}>
        <div className="eyebrow">
          <FileText size={16} />
          {content.eyebrow}
        </div>
        <h1>{content.title}</h1>
        <p className="legal-updated">Last updated: {content.updated}</p>
        <p className="legal-intro">{content.intro}</p>

        <div className={content.directory ? "content-layout" : "content-layout content-layout-simple"}>
          {content.directory && (
            <aside className="content-sidebar">
              <nav className="content-directory" aria-label="Page directory">
                <span>{page === "changelog" ? "Versions" : "On this page"}</span>
                <div>
                  {content.directory.map((item) => (
                    <a href={item.href} key={item.href}>
                      {item.label}
                    </a>
                  ))}
                </div>
              </nav>
            </aside>
          )}

          <article className="content-article">
            {content.sections.map((section, index) =>
              page === "changelog" ? (
                <details
                  id={section.id}
                  className="changelog-entry"
                  key={section.title}
                  open={index <= 2}
                >
                  <summary>
                    <span>{section.title}</span>
                    <small>{section.body.length} updates</small>
                  </summary>
                  <div>
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </details>
              ) : (
                <section id={section.id} key={section.title}>
                  <h2>{section.title}</h2>
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.example && (
                    <React.Suspense
                      fallback={
                        <div className="content-example">
                          <div className="content-example-header">
                            <span>{section.example.label}</span>
                          </div>
                          <div className="content-example-loading">Loading rendered preview</div>
                        </div>
                      }
                    >
                      <RenderedMarkdownExample example={section.example} />
                    </React.Suspense>
                  )}
                </section>
              ),
            )}

            <section className="content-cta" aria-label="Next action">
              <a className="primary-link" href={content.cta.primary.href}>
                {content.cta.primary.label} <ChevronRight size={17} />
              </a>
              <a className="secondary-link" href={content.cta.secondary.href}>
                {content.cta.secondary.label} <FileText size={17} />
              </a>
            </section>
            {showShareLinks && (
              <ArticleShareLinks
                layout="bottom"
                title={shareTitle}
                url={shareUrl}
                description={shareDescription}
              />
            )}
          </article>
        </div>
      </main>

      {showShareLinks && (
        <ArticleShareLinks
          layout="side"
          title={shareTitle}
          url={shareUrl}
          description={shareDescription}
        />
      )}
      <SiteFooter />
    </div>
  );
}

function ArticleShareLinks({
  description,
  layout,
  title,
  url,
}: {
  description: string;
  layout: "side" | "bottom";
  title: string;
  url: string;
}) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedSummary = encodeURIComponent(description);
  const links = [
    {
      label: "X",
      mark: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: "LinkedIn",
      mark: "in",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}`,
    },
    {
      label: "Reddit",
      mark: "R",
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    },
    {
      label: "Facebook",
      mark: "f",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "Hacker News",
      mark: "HN",
      href: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`,
    },
  ];

  return (
    <nav
      className={`article-share article-share-${layout}`}
      aria-label={layout === "side" ? "Share article links" : "Share"}
    >
      <span>Share</span>
      <div>
        {links.map((link) => (
          <a
            className="article-share-link"
            href={link.href}
            key={link.label}
            target="_blank"
            rel="noreferrer"
            aria-label={`Share on ${link.label}`}
            title={`Share on ${link.label}`}
          >
            <strong>{link.mark}</strong>
            <small>{link.label}</small>
          </a>
        ))}
      </div>
    </nav>
  );
}

function DocsIndexPage() {
  return (
    <div className="content-page">
      <header className="landing-nav">
        <a className="wordmark" href="/">
          <span className="brand-mark">V</span>
          VeloWrite
        </a>
        <div className="nav-actions">
          <a href="/web?utm_source=docs_nav&utm_medium=cta">
            Web editor <ChevronRight size={16} />
          </a>
          <a href="/roadmap?utm_source=docs_nav&utm_medium=resource">
            Roadmap <ListChecks size={16} />
          </a>
          <a href="/download?utm_source=docs_nav&utm_medium=cta">
            Download <Download size={16} />
          </a>
        </div>
      </header>

      <main className="content-shell docs-shell">
        <div className="eyebrow">
          <FileText size={16} />
          Markdown library
        </div>
        <h1>Markdown articles we are building for VeloWrite users.</h1>
        <p className="legal-updated">Last updated: July 23, 2026</p>
        <p className="legal-intro">
          This library is the public version of the VeloWrite content plan. Published
          articles are available now; planned articles show what we will write next
          for Markdown users, search visitors, and AI answer engines.
        </p>

        <section className="docs-grid" aria-label="Markdown article plan">
          {docGroups.map((group) => (
            <article className="docs-group" key={group.title}>
              <div>
                <span>Article group</span>
                <h2>{group.title}</h2>
                <p>{group.description}</p>
              </div>
              <div className="docs-list">
                {group.items.map((item) =>
                  item.status === "Published" ? (
                    <a href={item.href} key={item.href}>
                      <span>{item.title}</span>
                      <strong>{item.status}</strong>
                    </a>
                  ) : (
                    <div key={item.href}>
                      <span>{item.title}</span>
                      <strong>{item.status}</strong>
                    </div>
                  ),
                )}
              </div>
            </article>
          ))}
        </section>

        <section className="content-cta" aria-label="Next action">
          <a className="primary-link" href="/docs/markdown-for-developers?utm_source=docs_cta&utm_medium=resource">
            Read Markdown for Developers <ChevronRight size={17} />
          </a>
          <a className="secondary-link" href="/docs/markdown-for-writers?utm_source=docs_cta&utm_medium=resource">
            Read Markdown for Writers <FileText size={17} />
          </a>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function FAQPage() {
  return (
    <div className="faq-page">
      <header className="landing-nav">
        <a className="wordmark" href="/">
          <span className="brand-mark">V</span>
          VeloWrite
        </a>
        <div className="nav-actions">
          <a href="/web?utm_source=faq_nav&utm_medium=cta">
            Web editor <ChevronRight size={16} />
          </a>
          <a href="/download?utm_source=faq_nav&utm_medium=cta">
            Download <Download size={16} />
          </a>
          <a href="/feedback?utm_source=faq_nav&utm_medium=cta">
            Feedback <Mail size={16} />
          </a>
          <a href="/roadmap?utm_source=faq_nav&utm_medium=resource">
            Roadmap <ListChecks size={16} />
          </a>
        </div>
      </header>

      <main className="faq-shell">
        <section className="faq-hero">
          <div className="eyebrow">
            <Sparkles size={16} />
            FAQ
          </div>
          <h1>Answers before you try VeloWrite.</h1>
          <p>
            This page collects the questions people usually ask before trying VeloWrite.
            Use it to understand the preview boundaries, installation notes, and how the
            browser and desktop workflows fit together.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="/web?utm_source=faq_hero&utm_medium=cta">
              Open Web Editor <ChevronRight size={17} />
            </a>
            <a className="secondary-link" href="/download?utm_source=faq_hero&utm_medium=cta">
              Download Desktop <Download size={17} />
            </a>
          </div>
        </section>

        <section className="faq-conversation" aria-label="Quick answers">
          {conversationalFaqCards.map((item) => (
            <article key={item.prompt}>
              <span>{item.prompt}</span>
              <p>{item.answer}</p>
            </article>
          ))}
        </section>

        <section className="faq-outline" aria-label="FAQ topics">
          {faqGroups.map((group) => (
            <article className="faq-group" key={group.title}>
              <div className="section-heading">
                <span>Topic</span>
                <h2>{group.title}</h2>
              </div>
              <div className="faq-grid faq-grid-large">
                {group.items.map((item) => (
                  <article className="faq-item" key={item.question}>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </article>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="faq-note">
          <div>
            <span>Next step</span>
            <h2>Start on web. Move to desktop when files matter.</h2>
          </div>
          <div className="hero-actions">
            <a className="primary-link" href="/web?utm_source=faq_footer&utm_medium=cta">
              Try Web Editor <ChevronRight size={17} />
            </a>
            <a className="secondary-link" href="/download?utm_source=faq_footer&utm_medium=cta">
              Download Desktop <Download size={17} />
            </a>
            <a className="secondary-link" href="/roadmap?utm_source=faq_footer&utm_medium=resource">
              View Roadmap <ListChecks size={17} />
            </a>
          </div>
        </section>
      </main>

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
        <span>Local-first Markdown writing, with a web preview path.</span>
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
          Drafts stay in your browser. Analytics loads only if you allow it.
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

function FeedbackPage() {
  return (
    <div className="feedback-page">
      <header className="landing-nav">
        <a className="wordmark" href="/">
          <span className="brand-mark">V</span>
          VeloWrite
        </a>
        <div className="nav-actions">
          <a href="/web?utm_source=feedback_nav&utm_medium=cta">
            Web editor <ChevronRight size={16} />
          </a>
          <a href="/download?utm_source=feedback_nav&utm_medium=cta">
            Download <Download size={16} />
          </a>
          <a href="/roadmap?utm_source=feedback_nav&utm_medium=resource">
            Roadmap <ListChecks size={16} />
          </a>
        </div>
      </header>

      <main className="feedback-shell">
        <section className="feedback-hero">
          <div className="eyebrow">
            <Mail size={16} />
            Feedback
          </div>
          <h1>Tell us what blocked you.</h1>
          <p>
            Use this form to report what felt slow, confusing, missing, or worth paying for.
            Your feedback helps us decide what to improve next across the web editor,
            desktop app, and future Pro workflows.
          </p>
        </section>
        <section className="feedback-roadmap-card">
          <div>
            <span>Already recorded</span>
            <h2>See what early users have asked for.</h2>
            <p>
              The public roadmap separates core preview fixes from future Pro candidates,
              so feedback does not disappear after it is submitted.
            </p>
          </div>
          <a className="secondary-link" href="/roadmap?utm_source=feedback_page&utm_medium=resource">
            View Roadmap <ListChecks size={17} />
          </a>
        </section>
        <FeedbackForm />
      </main>

      <SiteFooter />
    </div>
  );
}

function FeedbackForm() {
  const [state, setState] = React.useState<"idle" | "loading" | "done" | "error">("idle");
  const [form, setForm] = React.useState({
    email: "",
    surface: "web",
    role: "writer",
    useCase: "",
    friction: "",
    message: "",
    wantsDesktop: true,
    wantsPro: false,
    wantsReply: true,
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "loading") return;

    setState("loading");
    try {
      const response = await fetch(import.meta.env.VITE_FEEDBACK_ENDPOINT || "/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          product: "velowrite",
          source: "feedback",
          userGroup: "feedback",
          signupPath: "/feedback",
        }),
      });
      setState(response.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <form className="feedback-form" onSubmit={submit}>
      <div className="feedback-grid">
        <label>
          Email
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
          />
        </label>
        <label>
          Where did this happen?
          <select
            value={form.surface}
            onChange={(event) => update("surface", event.target.value as typeof form.surface)}
          >
            <option value="web">Web</option>
            <option value="desktop">Desktop</option>
            <option value="download">Download page</option>
            <option value="demo">Demo</option>
          </select>
        </label>
        <label>
          Your role
          <select
            value={form.role}
            onChange={(event) => update("role", event.target.value as typeof form.role)}
          >
            <option value="writer">Writer</option>
            <option value="developer">Developer</option>
            <option value="student">Student</option>
            <option value="founder">Founder</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Main use case
          <input
            type="text"
            placeholder="Notes, docs, blog posts, knowledge base..."
            value={form.useCase}
            onChange={(event) => update("useCase", event.target.value)}
          />
        </label>
        <label className="feedback-span">
          What felt rough?
          <input
            type="text"
            placeholder="Layout, save flow, preview, download, onboarding..."
            value={form.friction}
            onChange={(event) => update("friction", event.target.value)}
          />
        </label>
        <label className="feedback-span">
          Your feedback
          <textarea
            rows={7}
            placeholder="Tell us what happened and what you expected instead."
            value={form.message}
            onChange={(event) => update("message", event.target.value)}
          />
        </label>
      </div>

      <div className="feedback-toggles">
        <label>
          <input
            type="checkbox"
            checked={form.wantsDesktop}
            onChange={(event) => update("wantsDesktop", event.target.checked)}
          />
          <span>I want the desktop app</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.wantsPro}
            onChange={(event) => update("wantsPro", event.target.checked)}
          />
          <span>I may pay for Pro</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.wantsReply}
            onChange={(event) => update("wantsReply", event.target.checked)}
          />
          <span>Reply to me by email</span>
        </label>
      </div>

      <div className="feedback-actions">
        <button type="submit" className="primary-link">
          {state === "loading" ? "Sending" : "Send feedback"}
        </button>
        <a className="secondary-link" href="/web?utm_source=feedback_page&utm_medium=cta">
          Open Web Editor <ChevronRight size={17} />
        </a>
      </div>

      <p className="feedback-status" aria-live="polite">
        {state === "done" && "Thanks. Your feedback was sent."}
        {state === "error" && "Submission failed. Please try again."}
      </p>
    </form>
  );
}

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <header className="landing-nav">
        <a className="wordmark" href="/">
          <span className="brand-mark">V</span>
          VeloWrite
        </a>
        <div className="nav-actions">
          <a href="https://github.com/ken-water/velowrite" aria-label="GitHub">
            <Github size={18} />
          </a>
          <a href="/demo?utm_source=not_found_nav&utm_medium=cta">
            Demo <Rocket size={16} />
          </a>
          <a href="/download?utm_source=not_found_nav&utm_medium=cta">
            Download <Download size={16} />
          </a>
          <a href="/pro?utm_source=not_found_nav&utm_medium=cta">
            Pro <Sparkles size={16} />
          </a>
          <a href="/web?utm_source=not_found_nav&utm_medium=cta">
            Try web editor <ChevronRight size={16} />
          </a>
        </div>
      </header>

      <main className="not-found-shell">
        <section className="not-found-hero">
          <span>404 error</span>
          <strong aria-hidden="true">404</strong>
          <h1>This page is not available.</h1>
          <p>
            The link may be outdated, the file may not be published yet, or the
            address may have been typed incorrectly.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="/web?utm_source=not_found_hero&utm_medium=cta">
              Open Web Editor <ChevronRight size={17} />
            </a>
            <a className="secondary-link" href="/download?utm_source=not_found_hero&utm_medium=cta">
              Download Desktop <Download size={17} />
            </a>
          </div>
        </section>

        <section className="not-found-grid" aria-label="Helpful links">
          <article>
            <FileText size={20} />
            <h2>Read Markdown guides</h2>
            <p>Browse practical Markdown articles and examples for writing, preview, math, tables, and code.</p>
            <a href="/docs?utm_source=not_found_card&utm_medium=resource">Open docs</a>
          </article>
          <article>
            <ListChecks size={20} />
            <h2>Check the roadmap</h2>
            <p>See which preview fixes have shipped and which feedback items are still in progress.</p>
            <a href="/roadmap?utm_source=not_found_card&utm_medium=resource">View roadmap</a>
          </article>
          <article>
            <MessageSquare size={20} />
            <h2>Report a broken link</h2>
            <p>Send the missing URL and what you expected to find so the preview site can be corrected.</p>
            <a href="/feedback?utm_source=not_found_card&utm_medium=cta">Send feedback</a>
          </article>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Router() {
  const searchParams = new URLSearchParams(window.location.search);
  const demoFrame = searchParams.get("utm_source") === "demo_frame";
  const isTauriRoot = isTauriRuntime() && (window.location.pathname === "/" || window.location.pathname === "");
  const docsExampleMarkdown =
    searchParams.get("example") === "docs"
      ? window.sessionStorage.getItem(exampleMarkdownKey)
      : null;
  if (docsExampleMarkdown) {
    window.sessionStorage.removeItem(exampleMarkdownKey);
  }
  const normalizedPath = normalizePath(window.location.pathname);
  const docPage = docPageRoutes[normalizedPath as keyof typeof docPageRoutes];
  const seo = routeSeo(window.location.pathname);
  let page: React.ReactNode;

  if (isTauriRoot) {
    page = (
      <React.Suspense fallback={<div className="loading-screen">Loading editor</div>}>
        <EditorApp surface="desktop" initialViewMode="write" />
      </React.Suspense>
    );
  } else if (matchesRoute(window.location.pathname, "/web")) {
    page = (
      <React.Suspense fallback={<div className="loading-screen">Loading web editor</div>}>
        <EditorApp
          surface="web"
          initialMarkdown={docsExampleMarkdown ?? (demoFrame ? complexDemoMarkdown : undefined)}
          initialViewMode={docsExampleMarkdown || demoFrame ? "split" : undefined}
        />
      </React.Suspense>
    );
  } else if (matchesRoute(window.location.pathname, "/app")) {
    page = (
      <React.Suspense fallback={<div className="loading-screen">Loading editor</div>}>
        <EditorApp surface="desktop" initialViewMode="write" />
      </React.Suspense>
    );
  } else if (matchesRoute(window.location.pathname, "/download")) {
    page = <DownloadPage />;
  } else if (matchesRoute(window.location.pathname, "/demo")) {
    page = <InteractiveDemoPage />;
  } else if (matchesRoute(window.location.pathname, "/pro")) {
    page = <ProPage />;
  } else if (matchesRoute(window.location.pathname, "/roadmap")) {
    page = <RoadmapPage />;
  } else if (docPage && publishedDocPageRoutes.has(normalizedPath as keyof typeof docPageRoutes)) {
    page = <ContentPage page={docPage} />;
  } else if (normalizedPath === "/docs") {
    page = <DocsIndexPage />;
  } else if (matchesRoute(window.location.pathname, "/guide")) {
    page = <ContentPage page="guide" />;
  } else if (matchesRoute(window.location.pathname, "/changelog")) {
    page = <ContentPage page="changelog" />;
  } else if (matchesRoute(window.location.pathname, "/faq")) {
    page = <FAQPage />;
  } else if (matchesRoute(window.location.pathname, "/privacy")) {
    page = <LegalPage page="privacy" />;
  } else if (matchesRoute(window.location.pathname, "/terms")) {
    page = <LegalPage page="terms" />;
  } else if (matchesRoute(window.location.pathname, "/refund")) {
    page = <LegalPage page="refund" />;
  } else if (matchesRoute(window.location.pathname, "/license")) {
    page = <LegalPage page="license" />;
  } else if (matchesRoute(window.location.pathname, "/feedback")) {
    page = <FeedbackPage />;
  } else if (window.location.pathname === "/" || window.location.pathname === "") {
    page = <LandingPage />;
  } else {
    page = <NotFoundPage />;
  }

  return (
    <>
      <SeoManager config={seo} />
      {page}
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
        <>
          <Analytics />
          <SpeedInsights />
        </>
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
