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
const downloadVersion = "0.1.7";
const releaseBaseUrl = `https://github.com/ken-water/velowrite/releases/download/v${downloadVersion}`;
const webEditorHref = "/web?utm_source=landing&utm_medium=cta";
const downloadHref = "/download?utm_source=landing&utm_medium=cta";
const analyticsConsentKey = "velowrite:analytics-consent";
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

const docArticleSeo: Record<keyof typeof docPageRoutes, { title: string; description: string }> = {
  "/docs/markdown": {
    title: "What Is Markdown? Plain Text Writing for Notes, Docs, and Blogs",
    description:
      "Learn what Markdown is, why plain text writing still matters, and how VeloWrite helps you write, preview, and export Markdown quickly.",
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
      "A practical Markdown basics guide for headings, lists, links, images, tables, code fences, math blocks, and clean document structure.",
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
    title: "Advanced Markdown - Complex Documents, Tables, Math, and Code Tabs",
    description:
      "Advanced Markdown patterns for complex documents with tables, math, callouts, code tabs, local files, and long-form preview behavior.",
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
  const articleSeo = docArticleSeo[normalizedPath as keyof typeof docArticleSeo];
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
      title: "Download VeloWrite - Windows and Linux Markdown App",
      description:
        "Download the VeloWrite desktop preview for Windows, AppImage, Debian, and RPM Linux workflows. The macOS DMG is added after the GitHub build finishes.",
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
        "Explore the planned VeloWrite Pro path for AI writing commands, private sync, publishing automation, advanced exports, and team workflows.",
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
        "See which VeloWrite user requests have been recorded, what belongs in the free preview, and which future workflows may become Pro features.",
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
      config.canonicalPath === "/docs/online-markdown-editor"
    ) {
      setStructuredData("content-article", {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${siteUrl}${config.canonicalPath}#article`,
        headline: config.title,
        description: config.description,
        dateModified: "2026-07-19",
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
    note: "Unsigned preview installer for Windows x64.",
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
];

const publicRoadmapItems = [
  {
    title: "Markdown learning library",
    request: "Users should understand Markdown basics, advanced syntax, platform support, and where VeloWrite fits before downloading the desktop app.",
    status: "Shipped",
    target: "0.1.x",
    classification: "Free education and discovery",
    decision:
      "The planned Markdown article set is now published under /docs. This supports SEO, GEO, onboarding, and honest conversion from learning to trying the editor.",
  },
  {
    title: "Editor and preview sync scrolling",
    request: "Long Markdown documents should keep the editor and preview aligned while writing.",
    status: "In progress",
    target: "0.1.x / 0.2.x",
    classification: "Free core editor work",
    decision:
      "Outline clicks now align both panes in the preview build. Continuous stable scroll matching for long documents remains core editor work and should not become Pro-only.",
  },
  {
    title: "Better local history recovery",
    request: "Users want confidence that accidental paste mistakes or rewrites can be recovered.",
    status: "Planned for Preview",
    target: "0.2.x",
    classification: "Free desktop workflow",
    decision:
      "Basic local history stays free. The next step is better discoverability and a diff preview before restore.",
  },
  {
    title: "Web to desktop draft handoff",
    request: "Start quickly in the browser, then continue in the desktop app without manual copy and paste.",
    status: "Designing",
    target: "0.2.x",
    classification: "Free handoff first",
    decision:
      "The desktop shell now starts in a focused writing surface without website analytics prompts. A simple handoff path should be free; automatic cross-device sync may become Pro only after the local-first workflow is proven.",
  },
  {
    title: "Private, no-account sync",
    request: "Sync should not force a heavy cloud account or take ownership away from local files.",
    status: "Researching",
    target: "0.3.x+",
    classification: "Pro candidate for managed sync",
    decision:
      "Folder-based local workflows should remain lightweight. Managed encrypted sync and conflict handling are stronger Pro candidates.",
  },
  {
    title: "More complete Markdown rendering",
    request: "Complex documents need reliable math, code tabs, tables, images, and long-form preview behavior.",
    status: "In progress",
    target: "0.1.x / 0.2.x",
    classification: "Free preview quality",
    decision:
      "Rendering trust is part of the preview foundation. The work should be backed by tests before broader promotion.",
  },
  {
    title: "AI writing, publishing, and advanced export",
    request: "Some users want higher-value workflows once the basic editor is stable.",
    status: "Later",
    target: "0.3.x+",
    classification: "Pro candidate",
    decision:
      "These features add ongoing value or infrastructure cost, so they are reasonable future Pro workflows after the free editor feels complete.",
  },
];

const docGroups = [
  {
    title: "Understand Markdown",
    description: "Foundational articles for people comparing writing formats and editor workflows.",
    items: [
      { title: "What Is Markdown?", href: "/docs/markdown", status: "Published" },
      { title: "A Short History of Markdown", href: "/docs/markdown-history", status: "Published" },
      { title: "The Future of Markdown Writing", href: "/docs/future-of-markdown", status: "Published" },
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
      { title: "Advanced Markdown", href: "/docs/advanced-markdown", status: "Published" },
      { title: "Markdown Math with KaTeX", href: "/docs/markdown-math", status: "Published" },
      { title: "Markdown Code Blocks and Tabs", href: "/docs/markdown-code-blocks", status: "Published" },
      { title: "Local-First Markdown Editing", href: "/docs/local-first-markdown", status: "Published" },
    ],
  },
  {
    title: "Choose a Markdown Editor",
    description: "Conversion-focused pages for users searching by platform, workflow, or alternative.",
    items: [
      { title: "Typora Alternative", href: "/docs/typora-alternative", status: "Published" },
      { title: "Online Markdown Editor", href: "/docs/online-markdown-editor", status: "Published" },
      { title: "Markdown to Blog", href: "/docs/markdown-to-blog", status: "Published" },
      { title: "Markdown Editor for Windows", href: "/docs/markdown-editor-for-windows", status: "Published" },
      { title: "Markdown Editor for Mac", href: "/docs/markdown-editor-for-mac", status: "Published" },
      { title: "Markdown Editor for Linux", href: "/docs/markdown-editor-for-linux", status: "Published" },
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
          "VeloWrite currently offers a web editor plus preview desktop installers for Windows x64, Linux AppImage, Debian, and RPM-based Linux distributions. The macOS DMG is published after the GitHub macOS build succeeds.",
      },
      {
        question: "Will the desktop installer trigger a warning?",
        answer:
          "Yes. The current Windows preview installer is unsigned, so SmartScreen may warn. The macOS DMG will also be treated as an unsigned preview build until Apple signing and notarization are ready.",
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
        question: "Is VeloWrite free to use today?",
        answer:
          "The current public build is a free preview for early testers. Future AI, private sync, publishing automation, advanced exports, and team workflows may become Pro features.",
      },
      {
        question: "What will VeloWrite Pro include?",
        answer:
          "The planned Pro direction includes AI writing commands, private sync, one-click publishing, advanced exports, themes, and commercial workflows. Pricing will be published before checkout opens.",
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
  faqByQuestion("Does VeloWrite upload my Markdown documents?"),
  faqByQuestion("Can I try VeloWrite without installing anything?"),
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
      "Markdown is a plain text writing format that lets you create readable documents with simple symbols instead of heavy formatting controls. It is popular because the source stays clean, portable, and easy to edit in almost any tool.",
    updated: "July 21, 2026",
    directory: [
      { label: "Definition", href: "#definition" },
      { label: "Why it works", href: "#why-it-works" },
      { label: "Where it fits", href: "#where-it-fits" },
    ],
    sections: [
      {
        id: "definition",
        title: "Markdown is readable source plus structured output",
        body: [
          "A Markdown document is still plain text. A heading starts with #, a list starts with - or a number, links use brackets and parentheses, and code blocks use fences. The same file can be read directly or rendered into HTML, PDF, documentation, or a blog post.",
          "That balance is the reason Markdown survived. It is simple enough for notes and powerful enough for technical documentation.",
        ],
        example: {
          label: "Readable Markdown source",
          markdown:
            "# Product Notes\n\n## Goals\n\n- Write quickly\n- Preview clearly\n- Keep files portable\n\n[Open VeloWrite](https://velowrite.app)",
          note: "The source is readable even before it is rendered.",
        },
      },
      {
        id: "why-it-works",
        title: "Why plain text still matters",
        body: [
          "Plain text files are easy to back up, compare, search, version, and move between tools. Developers like Markdown because it fits Git. Writers like it because the formatting does not interrupt the draft.",
          "VeloWrite keeps that idea intact: try the workflow in the browser, then move serious files into the desktop app when local storage and history matter.",
        ],
      },
      {
        id: "where-it-fits",
        title: "Where Markdown fits best",
        body: [
          "Markdown works well for notes, READMEs, specs, changelogs, study guides, knowledge-base articles, product docs, launch copy, and blog drafts.",
          "It is less ideal when the document needs page-perfect print layout from the first minute. In that case, Markdown is still useful as a clean drafting format before final design.",
        ],
      },
    ],
    cta: {
      primary: { href: "/web?utm_source=markdown_article&utm_medium=cta", label: "Open Web Editor" },
      secondary: { href: "/guide?utm_source=markdown_article&utm_medium=resource", label: "Read Guide" },
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
      "You can write useful Markdown with a small set of patterns: headings, paragraphs, lists, links, images, tables, code blocks, and math. This guide gives you the practical set first.",
    updated: "July 21, 2026",
    sections: [
      {
        title: "Headings, lists, and links",
        body: [
          "Use headings to create structure, lists to make actions scannable, and links to connect readers to related material. Most useful Markdown documents are built from these three parts.",
        ],
        example: {
          label: "Basic Markdown",
          markdown:
            "# Project Plan\n\n## Tasks\n\n1. Draft the outline\n2. Review the preview\n3. Export the file\n\nRead the [VeloWrite guide](/guide).",
          note: "Start with structure before adding advanced formatting.",
        },
      },
      {
        title: "Tables, code, and math",
        body: [
          "Tables compare information, code fences preserve formatting, and math blocks help technical documents stay precise. VeloWrite supports all three in the current preview.",
        ],
        example: {
          label: "Technical Markdown",
          markdown:
            "| Feature | Status |\n| --- | --- |\n| Preview | Ready |\n| Sync scroll | In progress |\n\n```bash\nnpm run build\n```\n\n$$a^2 + b^2 = c^2$$",
          note: "Use preview mode to confirm complex Markdown renders as expected.",
        },
      },
      {
        title: "Keep documents easy to scan",
        body: [
          "Short sections beat giant paragraphs. Consistent heading levels beat visual decoration. If a document needs to be maintained, readable source is as important as rendered output.",
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
      "Markdown helps writers draft without formatting drag. It keeps outlines, notes, essays, articles, newsletters, and blog posts readable while leaving room for export or publishing later.",
    updated: "July 21, 2026",
    sections: [
      {
        title: "Write the shape before the style",
        body: [
          "A good draft starts with structure: title, sections, notes, and open questions. Markdown lets you shape that without choosing fonts, margins, or page layout too early.",
          "This is especially useful for long-form writing because headings and lists make the source easy to scan.",
        ],
      },
      {
        title: "Use Markdown as a clean drafting layer",
        body: [
          "Writers can use Markdown for outlines, research notes, first drafts, editorial comments, and publishable copy. The same text can become HTML, a static site page, or a final document after editing.",
        ],
        example: {
          label: "Writer-friendly outline",
          markdown:
            "# Essay Draft\n\n## Thesis\n\nOne clear argument in two sentences.\n\n## Evidence\n\n- Source note one\n- Source note two\n\n## Revision notes\n\n> Tighten the introduction after the first full draft.",
          note: "Blockquotes are useful for revision notes and pulled references.",
        },
      },
      {
        title: "Move important drafts to desktop",
        body: [
          "The browser editor is useful for quick starts. When a draft becomes important, move to desktop so the file lives locally, can be reopened, and can benefit from local history snapshots.",
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
      "Developers use Markdown because it works with code, Git, issue trackers, documentation systems, and release workflows. The best Markdown setup makes technical writing feel close to the tools developers already use.",
    updated: "July 21, 2026",
    sections: [
      {
        title: "Use Markdown for repeatable technical documents",
        body: [
          "READMEs, architecture notes, API drafts, runbooks, changelogs, release plans, and onboarding guides all benefit from Markdown because the source is diffable and reviewable.",
        ],
        example: {
          label: "Developer document",
          markdown:
            "# API Change\n\n## Migration\n\n```bash\nnpm run test\nnpm run build\n```\n\n## Compatibility\n\n| Runtime | Status |\n| --- | --- |\n| Node 22 | Supported |",
          note: "Code fences and tables make technical context easier to review.",
        },
      },
      {
        title: "Keep examples close to explanation",
        body: [
          "Good developer docs explain the intent, then show the command, request, or code block. VeloWrite supports highlighted code and tabbed examples so multi-language docs stay compact.",
        ],
      },
      {
        title: "Why local history matters",
        body: [
          "Developers already understand version control, but not every draft belongs in Git immediately. Local history snapshots help recover accidental edits before the document is committed or shared.",
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
    title: "Advanced Markdown",
    intro:
      "Advanced Markdown is less about rare syntax and more about complex documents: tables, math, code examples, images, navigation, and long-form preview behavior.",
    updated: "July 21, 2026",
    sections: [
      {
        title: "Complex documents need predictable structure",
        body: [
          "Use stable heading levels, short sections, and consistent examples. Long documents become hard to edit when the source has visual tricks but no outline discipline.",
          "VeloWrite's document outline and split preview are designed around that structure.",
        ],
      },
      {
        title: "Use tables, math, and code carefully",
        body: [
          "Tables should compare a small number of fields. Math should be isolated when it needs attention. Code examples should be labeled by language and kept close to the explanation.",
        ],
        example: {
          label: "Advanced block set",
          markdown:
            "## Model Notes\n\n| Symbol | Meaning |\n| --- | --- |\n| x | Input |\n| y | Output |\n\n$$y = f(x) + \\epsilon$$\n\n```python\nprint('preview first')\n```",
          note: "A clear preview makes advanced Markdown easier to trust.",
        },
      },
      {
        title: "Preview behavior is part of the feature",
        body: [
          "Advanced Markdown is only useful if the editor renders it reliably. That is why math, code tabs, tables, images, and long-document sync are tracked as preview-completion work rather than Pro-only work.",
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
      "Math support turns Markdown into a better format for study notes, engineering docs, product analysis, and research drafts. VeloWrite renders math with KaTeX in the preview.",
    updated: "July 21, 2026",
    sections: [
      {
        title: "Use inline math for small expressions",
        body: [
          "Inline math belongs inside a sentence, where the formula is short enough not to interrupt reading. Use it for symbols, variables, and compact expressions.",
        ],
        example: {
          label: "Inline math",
          markdown: "The term $x_i$ represents one input sample, and $n$ is the total number of samples.",
          note: "Inline math is best when it supports the sentence instead of replacing it.",
        },
      },
      {
        title: "Use block math when the formula is the point",
        body: [
          "Block math should stand on its own. It is better for equations that readers need to inspect, copy, or compare.",
        ],
        example: {
          label: "Block math",
          markdown: "$$\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n}x_i$$",
          note: "Preview the rendered result before sharing technical documents.",
        },
      },
      {
        title: "Keep surrounding explanation clear",
        body: [
          "A formula without context is hard to use. Explain what each variable means, then show the equation, then describe how it affects the document's conclusion.",
        ],
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
      "Code blocks are one of the main reasons Markdown works so well for technical writing. Language labels, syntax highlighting, and tabbed examples make docs easier to scan.",
    updated: "July 21, 2026",
    sections: [
      {
        title: "Use fenced code blocks",
        body: [
          "A fenced code block starts and ends with three backticks. Add a language name after the first fence so the preview can highlight syntax correctly.",
        ],
        example: {
          label: "Fenced code",
          markdown:
            "```js\nconst message = 'Write, preview, export';\nconsole.log(message);\n```",
          note: "Language labels improve readability for readers and renderers.",
        },
      },
      {
        title: "Use tabs for multi-language examples",
        body: [
          "When the same idea needs Python, Bash, JavaScript, and Java versions, tabs are easier to read than four stacked blocks. VeloWrite's demo uses this pattern for compact technical examples.",
        ],
        example: {
          label: "Tabbed examples",
          markdown:
            "```python\nprint('VeloWrite')\n```\n\n```bash\necho VeloWrite\n```\n\n```java\nSystem.out.println(\"VeloWrite\");\n```",
          note: "Tabbed code is best when each block explains the same action in a different language.",
        },
      },
      {
        title: "Keep code blocks focused",
        body: [
          "A code example should prove one idea. If a block grows too long, split it into smaller examples and explain the transition between them.",
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
      "Local-first Markdown editing means your files stay usable on your machine first. Cloud, sync, and AI can add value later, but the core document should not depend on a remote account.",
    updated: "July 21, 2026",
    sections: [
      {
        title: "Why local-first matters",
        body: [
          "Markdown users often care about ownership. A local file can be backed up, searched, versioned, copied, and opened in another editor. That makes it safer for notes, documentation, and long-lived writing.",
          "VeloWrite's desktop preview is designed around native open and save, recent files, and local history snapshots.",
        ],
      },
      {
        title: "Use the browser for trials, desktop for durable work",
        body: [
          "The web editor is useful when you want to start immediately. The desktop app is better when the document needs a real path on disk, offline access, or repeated editing.",
        ],
      },
      {
        title: "Sync should not take ownership away",
        body: [
          "Private sync is on the roadmap, but it should be designed after the local workflow is proven. Folder-based workflows should remain simple; managed encrypted sync is a stronger Pro candidate later.",
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
      "Markdown is a strong drafting format for blog posts because it keeps writing portable. The practical workflow is draft, preview, export, then publish through the platform you trust.",
    updated: "July 21, 2026",
    sections: [
      {
        title: "Draft in Markdown first",
        body: [
          "Start with the article title, a short promise, section headings, and examples. Markdown keeps the draft readable while you focus on the argument instead of the publishing tool.",
        ],
      },
      {
        title: "Preview before publishing",
        body: [
          "Preview catches broken structure, awkward tables, long code blocks, and math that does not render as expected. VeloWrite is built to make that check fast.",
        ],
        example: {
          label: "Blog draft structure",
          markdown:
            "# How to Write Better Markdown\n\n## Problem\n\nExplain the pain.\n\n## Workflow\n\n1. Draft\n2. Preview\n3. Export\n4. Publish",
          note: "A simple outline is enough to start a useful blog draft.",
        },
      },
      {
        title: "Publishing automation belongs later",
        body: [
          "One-click publishing to GitHub Pages, Vercel, CMS tools, or static blogs is a strong future Pro workflow. It should be added after editing and export feel stable.",
        ],
      },
    ],
    cta: {
      primary: { href: "/web?utm_source=markdown_to_blog_cta&utm_medium=cta", label: "Draft Online" },
      secondary: { href: "/pro?utm_source=markdown_to_blog_cta&utm_medium=resource", label: "Publishing Roadmap" },
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
      "An online Markdown editor should be fast enough for a quick note, clear enough for a technical document, and honest about when a desktop app is the better tool. VeloWrite starts in the browser so you can write immediately, then gives you a desktop path when local files, offline work, and recovery history matter.",
    updated: "July 19, 2026",
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
          "The main reason is speed. You can open a browser page, paste a rough draft, check the rendered result, and download a clean Markdown file without installing another app or creating an account.",
          "This is useful for temporary notes, README drafts, documentation snippets, support replies, launch copy, and technical writing that needs structure before it needs a full workspace.",
        ],
      },
      {
        id: "core-workflow",
        title: "The basic workflow",
        body: [
          "A practical online Markdown editor should support three actions immediately: write on the left, preview on the right, and export when the document is ready.",
          "VeloWrite supports live preview, Markdown download, HTML export, local browser drafts, tables, math rendering, highlighted code blocks, and tabbed code examples for multi-language documentation.",
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
          "Normal VeloWrite web editing does not upload Markdown document content to VeloWrite servers. Browser drafts are kept in localStorage on the same device so a refresh can recover the current draft.",
          "That makes the web editor a good place for quick work, but sensitive long-term files still belong in a local workflow you control.",
        ],
      },
      {
        id: "desktop-handoff",
        title: "When should you move to desktop?",
        body: [
          "Move to the VeloWrite desktop preview when the document becomes a real file you want to keep, reopen, save directly, edit offline, or recover through local history snapshots.",
          "This is the intended product path: use the web editor to try the workflow quickly, then use the desktop app for serious local-first Markdown writing.",
        ],
      },
      {
        id: "faq",
        title: "Online Markdown editor FAQ",
        body: [
          "Can I use VeloWrite without signing in? Yes. The current web editor is available without an account.",
          "Can I download my file? Yes. You can download a Markdown copy and export HTML from the browser.",
          "Is the desktop app required? No. It is recommended when you need native files, offline work, recent files, and local history snapshots.",
          "Will AI and sync be free? Basic writing stays free in the preview. AI, managed private sync, publishing automation, and advanced export are future Pro candidates.",
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
    updated: "July 21, 2026",
    directory: [
      { label: "Unreleased", href: "#unreleased" },
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
          "Published all planned Markdown library articles under /docs.",
          "Added article-specific SEO metadata and sitemap entries for Markdown basics, history, writers, developers, math, code blocks, local-first editing, Typora alternative, publishing, and platform pages.",
          "Added stricter docs routing so unknown /docs/* paths use the friendly 404 page.",
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
          <h1>User feedback we have recorded and what happens next.</h1>
          <p>
            VeloWrite is still in preview, so early feedback directly shapes the product.
            This page shows which requests are core editor work, which stay free, and which
            high-value workflows may become Pro later.
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
            <p>Editing, preview, rendering trust, file handling, and recovery must feel solid before Pro work expands.</p>
          </article>
          <article>
            <span>Free by default</span>
            <strong>Basic writing</strong>
            <p>Markdown editing, preview, import, download, local files, and basic history should remain free.</p>
          </article>
          <article>
            <span>Pro later</span>
            <strong>High-value workflows</strong>
            <p>AI, managed private sync, publishing automation, advanced export, and commercial use are Pro candidates.</p>
          </article>
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
                <button disabled>Building</button>
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
              <li>Windows and Linux preview packages</li>
              <li>Privacy policy, cookie consent, and waitlist email handling</li>
            </ul>
          </article>
          <article>
            <h2>Preview Limits</h2>
            <ul>
              <li>No code signing yet for Windows, and future macOS preview DMGs will also require signing and notarization work</li>
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

        <section className="download-notes" aria-label="Preview notes">
          <h2>Preview Notes</h2>
          <ul>
            <li>VeloWrite is currently a free preview for early testers.</li>
            <li>Windows builds are not code-signed yet, so your system may show a security warning during install.</li>
            <li>The macOS DMG is built on GitHub Actions and will be added after the current Apple Silicon build succeeds.</li>
            <li>Keep backups of important Markdown files while testing preview builds.</li>
            <li>AI commands, private sync, and one-click publishing are planned but not included in this release.</li>
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
            {content.sections.map((section) => (
              <section id={section.id} key={section.title}>
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.example && (
                  <div className="content-example">
                    <span>{section.example.label}</span>
                    <pre>{section.example.markdown}</pre>
                    <p>{section.example.note}</p>
                  </div>
                )}
              </section>
            ))}

            <section className="content-cta" aria-label="Next action">
              <a className="primary-link" href={content.cta.primary.href}>
                {content.cta.primary.label} <ChevronRight size={17} />
              </a>
              <a className="secondary-link" href={content.cta.secondary.href}>
                {content.cta.secondary.label} <FileText size={17} />
              </a>
            </section>
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
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
        <p className="legal-updated">Last updated: July 19, 2026</p>
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
          <a className="primary-link" href="/docs/online-markdown-editor?utm_source=docs_cta&utm_medium=resource">
            Read Today's Article <ChevronRight size={17} />
          </a>
          <a className="secondary-link" href="/guide?utm_source=docs_cta&utm_medium=resource">
            Open Starter Guide <FileText size={17} />
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
          <h1>Answers about the web editor, desktop app, privacy, and Pro path.</h1>
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
            <h2>Try the browser editor first, then move to desktop when local files matter.</h2>
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
      <nav className="download-nav" aria-label="Not found navigation">
        <a href="/">VeloWrite</a>
        <a href="/web?utm_source=not_found_nav&utm_medium=cta">
          Open Web Editor <ChevronRight size={16} />
        </a>
      </nav>

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
  const normalizedPath = normalizePath(window.location.pathname);
  const docPage = docPageRoutes[normalizedPath as keyof typeof docPageRoutes];
  const seo = routeSeo(window.location.pathname);
  let page: React.ReactNode;

  if (matchesRoute(window.location.pathname, "/web")) {
    page = (
      <React.Suspense fallback={<div className="loading-screen">Loading web editor</div>}>
        <EditorApp
          surface="web"
          initialMarkdown={demoFrame ? complexDemoMarkdown : undefined}
          initialViewMode={demoFrame ? "split" : undefined}
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
  } else if (docPage) {
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
  const isDesktopShell = matchesRoute(window.location.pathname, "/app") || "__TAURI_INTERNALS__" in window;
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
