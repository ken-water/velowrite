import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(repoRoot, "dist");
const indexPath = path.join(distDir, "index.html");
const version = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version;
const siteUrl = "https://velowrite.app";
const today = new Date().toISOString().slice(0, 10);

const defaultTitle = "VeloWrite - Markdown Editor for Web and Desktop";
const defaultDescription =
  "VeloWrite is a Markdown editor for browser drafts and local files, with preview, export, and history recovery.";

const breadcrumbLabels = new Map([
  ["/web", "Web Editor"],
  ["/download", "Download"],
  ["/demo", "Demo"],
  ["/pro", "Pro"],
  ["/roadmap", "Roadmap"],
  ["/guide", "Markdown Guide"],
  ["/docs", "Markdown Library"],
  ["/docs/markdown", "What Is Markdown"],
  ["/docs/markdown-history", "Markdown History"],
  ["/docs/future-of-markdown", "Future of Markdown"],
  ["/docs/online-markdown-editor", "Online Markdown Editor"],
  ["/docs/markdown-basics", "Markdown Basics"],
  ["/docs/markdown-for-writers", "Markdown for Writers"],
  ["/docs/markdown-for-developers", "Markdown for Developers"],
  ["/docs/advanced-markdown", "Advanced Markdown"],
  ["/docs/markdown-code-blocks", "Markdown Code Blocks"],
  ["/docs/long-markdown-workflow", "Long Markdown Workflow"],
  ["/docs/markdown-shortcuts", "Markdown Shortcuts"],
  ["/docs/local-first-markdown", "Local-First Markdown"],
  ["/docs/typora-alternative", "Typora Alternative"],
  ["/docs/markdown-math", "Markdown Math"],
  ["/docs/write-math-in-markdown", "Write Math in Markdown"],
  ["/docs/markdown-to-blog", "Markdown to Blog"],
  ["/docs/markdown-editor-for-windows", "Markdown Editor for Windows"],
  ["/docs/open-md-files-on-windows", "Open MD Files on Windows"],
  ["/docs/markdown-editor-for-mac", "Markdown Editor for Mac"],
  ["/docs/markdown-editor-for-linux", "Markdown Editor for Linux"],
  ["/docs/preview-release-policy", "Preview Release Policy"],
  ["/docs/pdf-export-notes", "PDF Export Notes"],
  ["/docs/preview-build-limitations", "Preview Build Limitations"],
  ["/docs/private-online-markdown-editor", "Private Online Markdown Editor"],
  ["/docs/download-safety", "Download Safety"],
  ["/docs/markdown-meeting-notes", "Markdown Meeting Notes"],
  ["/changelog", "Changelog"],
  ["/faq", "FAQ"],
  ["/privacy", "Privacy Policy"],
  ["/terms", "Terms of Service"],
  ["/license", "License"],
  ["/refund", "Refund Policy"],
  ["/feedback", "Feedback"],
]);

const docsLinks = [
  ["/docs/markdown", "What Is Markdown?"],
  ["/docs/markdown-history", "A Short History of Markdown"],
  ["/docs/online-markdown-editor", "Online Markdown Editor"],
  ["/docs/markdown-basics", "Markdown Basics"],
  ["/docs/markdown-for-developers", "Markdown for Developers"],
  ["/docs/advanced-markdown", "Advanced Markdown"],
  ["/docs/markdown-code-blocks", "Markdown Code Blocks and Tabs"],
  ["/docs/markdown-math", "Markdown Math with KaTeX"],
  ["/docs/write-math-in-markdown", "How to Write Math in Markdown"],
  ["/docs/markdown-to-blog", "Markdown to Blog"],
  ["/docs/markdown-editor-for-windows", "Markdown Editor for Windows"],
  ["/docs/open-md-files-on-windows", "How to Open .md Files on Windows"],
  ["/docs/markdown-editor-for-mac", "Markdown Editor for Mac"],
  ["/docs/markdown-editor-for-linux", "Markdown Editor for Linux"],
  ["/docs/pdf-export-notes", "PDF Export Notes"],
  ["/docs/preview-build-limitations", "Preview Build Limitations"],
  ["/docs/private-online-markdown-editor", "Private Online Markdown Editor"],
  ["/docs/download-safety", "Download Safety"],
  ["/docs/markdown-meeting-notes", "Markdown Meeting Notes Template"],
];

const articleModifiedDates = new Map([
  ["/guide", "2026-07-19"],
  ["/docs/markdown", "2026-07-30"],
  ["/docs/markdown-history", "2026-07-31"],
  ["/docs/future-of-markdown", "2026-08-01"],
  ["/docs/markdown-basics", "2026-07-21"],
  ["/docs/markdown-for-writers", "2026-07-22"],
  ["/docs/markdown-for-developers", "2026-07-23"],
  ["/docs/advanced-markdown", "2026-07-28"],
  ["/docs/markdown-math", "2026-07-26"],
  ["/docs/write-math-in-markdown", "2026-09-01"],
  ["/docs/markdown-code-blocks", "2026-07-24"],
  ["/docs/long-markdown-workflow", "2026-08-29"],
  ["/docs/markdown-shortcuts", "2026-09-05"],
  ["/docs/local-first-markdown", "2026-07-25"],
  ["/docs/typora-alternative", "2026-07-31"],
  ["/docs/markdown-to-blog", "2026-07-27"],
  ["/docs/markdown-editor-for-windows", "2026-07-31"],
  ["/docs/open-md-files-on-windows", "2026-08-30"],
  ["/docs/markdown-editor-for-mac", "2026-08-07"],
  ["/docs/markdown-editor-for-linux", "2026-08-03"],
  ["/docs/preview-release-policy", "2026-08-07"],
  ["/docs/pdf-export-notes", "2026-08-15"],
  ["/docs/preview-build-limitations", "2026-08-14"],
  ["/docs/private-online-markdown-editor", "2026-08-15"],
  ["/docs/download-safety", "2026-08-15"],
  ["/docs/markdown-meeting-notes", "2026-08-20"],
  ["/roadmap", "2026-08-20"],
  ["/changelog", "2026-08-20"],
]);

const faqItems = [
  {
    question: "What is VeloWrite?",
    answer:
      "VeloWrite is a Markdown editor with a browser version for drafts and a desktop app for local files, PDF export, and history.",
  },
  {
    question: "What is the best lightweight Markdown editor for Windows?",
    answer:
      "VeloWrite is a Windows Markdown editor with browser preview, desktop files, recent documents, local history snapshots, and export.",
  },
  {
    question: "How do I open a .md file on Windows?",
    answer:
      "Right-click the .md file, choose Open with, and select VeloWrite. The desktop app opens local Markdown files directly in the editor.",
  },
  {
    question: "Can I edit Markdown online without uploading files?",
    answer:
      "Yes. Normal VeloWrite web editing and preview keep Markdown content in your browser.",
  },
  {
    question: "How is VeloWrite different from Typora?",
    answer:
      "VeloWrite has a Typora-style writing surface plus a browser editor, desktop builds, local files, preview limits, and a public roadmap.",
  },
  {
    question: "Does VeloWrite work offline?",
    answer:
      "The desktop app handles real local files offline. The web editor is better for drafts, Markdown download, and HTML export while the browser is available.",
  },
  {
    question: "Is VeloWrite safe for private notes?",
    answer:
      "VeloWrite keeps the normal editing path private. Browser drafts stay in localStorage, and desktop files plus local history snapshots stay on your device by default.",
  },
];

const routes = [
  {
    path: "/",
    title: defaultTitle,
    description: defaultDescription,
    priority: "1.0",
    changefreq: "weekly",
    schema: ["software", "faq"],
  },
  {
    path: "/web",
    title: "VeloWrite Web Editor - Markdown Drafts and Preview",
    description:
      "Open VeloWrite in the browser to write Markdown, preview the result, export HTML, and download .md files without an account.",
    priority: "0.9",
    changefreq: "weekly",
    schema: ["software"],
  },
  {
    path: "/download",
    title: "Download VeloWrite - Windows, macOS, and Linux",
    description:
      "Download the VeloWrite desktop app for Windows, macOS Apple Silicon, AppImage, Debian, and RPM Linux.",
    priority: "0.9",
    changefreq: "weekly",
    schema: ["software"],
  },
  {
    path: "/demo",
    title: "VeloWrite Demo - Markdown Editing, Math, and Code Tabs",
    description:
      "Try the VeloWrite demo with complex Markdown, live preview, math rendering, tables, and multi-language code tabs.",
    priority: "0.8",
    changefreq: "monthly",
    schema: ["software"],
  },
  {
    path: "/pro",
    title: "VeloWrite Pro - AI, Sync, and Publishing",
    description:
      "See Pro pricing, AI writing commands, advanced export, recovery controls, sync, and publishing.",
    priority: "0.7",
    changefreq: "monthly",
  },
  {
    path: "/roadmap",
    title: "VeloWrite Roadmap - Feedback and Planned Improvements",
    description:
      "See what shipped, what is improving, and what is still under research.",
    priority: "0.7",
    changefreq: "weekly",
    schema: ["article"],
  },
  {
    path: "/guide",
    title: "VeloWrite Markdown Guide - Practical Examples",
    description:
      "A Markdown guide with headings, lists, tables, math, code tabs, and desktop use for VeloWrite users.",
    priority: "0.8",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs",
    title: "VeloWrite Markdown Library - Basics, Guides, and Workflows",
    description:
      "Read VeloWrite Markdown articles about basics, history, writing, code blocks, math, local files, editor comparisons, and platform guides.",
    priority: "0.8",
    changefreq: "weekly",
  },
  {
    path: "/docs/markdown",
    title: "What Is Markdown? Plain Text for Notes and Docs",
    description:
      "Learn what Markdown is, how it compares with rich text and HTML, where it works best, and how to start writing portable Markdown documents.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-history",
    title: "A Short History of Markdown - 2004 to CommonMark",
    description:
      "A short history of Markdown's 2004 origin, its first Perl converter, Aaron Swartz's influence, and why CommonMark later became necessary.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/future-of-markdown",
    title: "The Future of Markdown Writing - Local Files and AI",
    description:
      "Read how Markdown writing is changing around local files, safer recovery, AI inside the document, export checks, and publishing.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/online-markdown-editor",
    title: "Online Markdown Editor - Write, Preview, Download",
    description:
      "Use VeloWrite as a free online Markdown editor for quick drafts, live preview, Markdown download, HTML export, and a desktop path for local files.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-basics",
    title: "Markdown Basics - Headings, Lists, Links, and Images",
    description:
      "A plain Markdown basics guide for headings, lists, links, images, simple document structure, and what the rendered result looks like.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-for-writers",
    title: "Markdown for Writers - Clean Drafts Without Drag",
    description:
      "How writers can use Markdown for essays, articles, notes, outlines, and publishable drafts without fighting a heavy word processor.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-for-developers",
    title: "Markdown for Developers - READMEs, Specs, and Docs",
    description:
      "A Markdown guide for README files, technical specs, API notes, code examples, changelogs, and documentation.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/advanced-markdown",
    title: "Advanced Markdown - Portable and Maintainable",
    description:
      "Advanced Markdown practices for portable, reviewable documents: semantic line breaks, reference links, escaped text, stable anchors, and reusable templates.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-math",
    title: "Markdown Math with KaTeX - Inline and Block Examples",
    description:
      "Use Markdown math with KaTeX for inline formulas, block equations, technical notes, study guides, and engineering documentation.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/write-math-in-markdown",
    title: "How to Write Math in Markdown - Formulas and Preview",
    description:
      "Learn how to write inline and block math in Markdown, explain variables, avoid formula mistakes, and preview equations before export.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-to-blog",
    title: "Markdown to Blog - Draft, Preview, Publish",
    description:
      "Draft blog posts in Markdown, preview the structure, export HTML, and keep the source file ready for later publishing.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-code-blocks",
    title: "Markdown Code Blocks and Tabs - Multi-Language Docs",
    description:
      "Write better Markdown code examples with fenced code blocks, syntax highlighting, language labels, and tabbed multi-language snippets.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/long-markdown-workflow",
    title: "How to Work Faster in Long Markdown Drafts",
    description:
      "Learn how shortcuts, tables, images, and quick marks help long Markdown files stay readable and easy to revisit.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-shortcuts",
    title: "Markdown Shortcuts for Daily Editing",
    description:
      "Learn practical Markdown editing shortcuts, platform key combos, and quick marks that help long drafts stay easy to manage.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/local-first-markdown",
    title: "Local-First Markdown Editing - Private Files and Offline",
    description:
      "Understand local-first Markdown editing, why user-owned files matter, and when to move from a browser editor to a desktop app.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/typora-alternative",
    title: "Typora Alternative - Lightweight Local-First Markdown",
    description:
      "Compare VeloWrite with Typora for browser drafts, lightweight Tauri desktop builds, local files, recovery history, and a public roadmap.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-editor-for-windows",
    title: "Markdown Editor for Windows - Open and Edit .md Files",
    description:
      "Try VeloWrite on Windows for Markdown editing, local files, recent documents, local history, Open with support, and installer notes.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/open-md-files-on-windows",
    title: "How to Open .md Files on Windows 11",
    description:
      "Learn the quickest way to open a .md file on Windows, view Markdown content, edit local files, and troubleshoot Open with behavior.",
    priority: "0.78",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-editor-for-mac",
    title: "Markdown Editor for Mac - Local-First Markdown",
    description:
      "Evaluate VeloWrite on macOS with browser-first Markdown editing, Apple Silicon DMG preview notes, local files, history, export checks, and update visibility.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-editor-for-linux",
    title: "Markdown Editor for Linux - AppImage, DEB, and RPM",
    description:
      "Use VeloWrite on Linux with AppImage, DEB, RPM, browser editing, local files, export checks, and a lightweight Tauri desktop app.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/preview-release-policy",
    title: "How VeloWrite Preview Releases Work",
    description:
      "Understand how VeloWrite preview versions, GitHub Releases, installer assets, changelog entries, and download page dates fit together.",
    priority: "0.72",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/pdf-export-notes",
    title: "Markdown to PDF Export Notes - Tables and Chinese Text",
    description:
      "Understand VeloWrite PDF export for Markdown documents, including cover pages, contents, tables, Chinese text, page settings, watermarks, and preview limits.",
    priority: "0.72",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/preview-build-limitations",
    title: "Preview Build Limitations - What VeloWrite Still Needs",
    description:
      "See what the current VeloWrite preview can do, what still needs work, and what to check before relying on a build.",
    priority: "0.72",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/private-online-markdown-editor",
    title: "Private Online Markdown Editor - Browser Drafts and Consent",
    description:
      "Understand what stays in your browser when you use a private online Markdown editor, how analytics consent works, and when to move important files to desktop.",
    priority: "0.72",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/download-safety",
    title: "Download Safety for VeloWrite Preview Builds",
    description:
      "Check official VeloWrite download sources, version matching, unsigned installer warnings, first-run testing, and how to report suspicious files.",
    priority: "0.72",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-meeting-notes",
    title: "Markdown Meeting Notes Template - Decisions and Actions",
    description:
      "Use a reusable Markdown meeting notes template for decisions, action items, open questions, project context, and follow-up work.",
    priority: "0.72",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/changelog",
    title: "VeloWrite Changelog - Release Notes and Preview Updates",
    description:
      "Read the VeloWrite changelog for preview release notes, UI updates, SEO changes, guide improvements, and future roadmap notes.",
    priority: "0.7",
    changefreq: "weekly",
    schema: ["article"],
  },
  {
    path: "/faq",
    title: "VeloWrite FAQ - Markdown Editor, Privacy, Desktop, and Pro",
    description:
      "Answers about VeloWrite's online Markdown editor, Tauri desktop app, privacy model, platform support, preview limits, and future Pro workflows.",
    priority: "0.7",
    changefreq: "monthly",
    schema: ["faq"],
  },
  {
    path: "/privacy",
    title: "VeloWrite Privacy Policy",
    description:
      "How VeloWrite handles Markdown content, browser drafts, local storage, analytics consent, waitlist emails, and feedback submissions.",
    priority: "0.5",
    changefreq: "monthly",
  },
  {
    path: "/terms",
    title: "VeloWrite Terms of Service",
    description:
      "Preview terms for using VeloWrite web editor and desktop builds during early product validation.",
    priority: "0.5",
    changefreq: "monthly",
  },
  {
    path: "/license",
    title: "VeloWrite License",
    description:
      "Preview license terms for evaluating VeloWrite before commercial licensing and paid plans are finalized.",
    priority: "0.5",
    changefreq: "monthly",
  },
  {
    path: "/refund",
    title: "VeloWrite Refund Policy",
    description:
      "Current refund expectations for the free VeloWrite preview and future paid desktop or subscription plans.",
    priority: "0.4",
    changefreq: "monthly",
  },
];

const noindexRoutes = [
  {
    path: "/feedback",
    title: "VeloWrite Feedback",
    description:
      "Send feedback about VeloWrite web editor, desktop preview builds, Markdown workflows, packaging, and future Pro features.",
    robots: "noindex, follow",
  },
  {
    path: "/app",
    title: "VeloWrite Desktop App Shell",
    description: defaultDescription,
    robots: "noindex, nofollow",
  },
];

const notFoundRoute = {
  path: "/404",
  title: "Page Not Found - VeloWrite",
  description:
    "This VeloWrite page could not be found. Open the web editor, download the desktop preview, read the Markdown library, or send feedback.",
  robots: "noindex, follow",
};

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function softwareSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#software`,
    name: "VeloWrite",
    applicationCategory: "ProductivityApplication",
    applicationSubCategory: "Markdown editor",
    operatingSystem: "Web, Windows, macOS, Linux",
    url: `${siteUrl}/`,
    downloadUrl: `${siteUrl}/download`,
    softwareVersion: version,
    releaseNotes: `${siteUrl}/changelog`,
    softwareRequirements: "Modern browser for the web editor. Desktop preview installers are available for Windows, macOS Apple Silicon, and Linux.",
    description: defaultDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

function webPageSchema(route) {
  const canonical = `${siteUrl}${route.path === "/" ? "/" : route.path}`;
  return {
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    name: route.title,
    url: canonical,
    description: route.description,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: route.schema?.includes("software") ? { "@id": `${siteUrl}/#software` } : { "@id": `${siteUrl}/#organization` },
    inLanguage: "en",
  };
}

function baseGraph() {
  return [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "VeloWrite",
      url: `${siteUrl}/`,
      logo: `${siteUrl}/icons/icon-512.png`,
      sameAs: ["https://github.com/ken-water/velowrite"],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "VeloWrite",
      url: `${siteUrl}/`,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en",
    },
  ];
}

function schemaFor(route) {
  const graph = baseGraph();
  graph.push(webPageSchema(route));
  if (route.schema?.includes("software")) graph.push(softwareSchema());
  if (route.schema?.includes("article")) {
    graph.push({
      "@type": "Article",
      "@id": `${siteUrl}${route.path}#article`,
      headline: route.title,
      description: route.description,
      dateModified: articleModifiedDates.get(route.path) ?? today,
      mainEntityOfPage: `${siteUrl}${route.path}`,
      author: { "@id": `${siteUrl}/#organization` },
      publisher: { "@id": `${siteUrl}/#organization` },
    });
  }
  if (route.schema?.includes("faq")) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${siteUrl}${route.path === "/" ? "" : route.path}#faq`,
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }
  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

function breadcrumbSchemaFor(route) {
  if (route.path === "/" || !breadcrumbLabels.has(route.path)) return null;
  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: "VeloWrite",
      item: `${siteUrl}/`,
    },
  ];

  if (route.path.startsWith("/docs/") && route.path !== "/docs") {
    itemListElement.push({
      "@type": "ListItem",
      position: 2,
      name: "Markdown Library",
      item: `${siteUrl}/docs`,
    });
    itemListElement.push({
      "@type": "ListItem",
      position: 3,
      name: breadcrumbLabels.get(route.path),
      item: `${siteUrl}${route.path}`,
    });
  } else {
    itemListElement.push({
      "@type": "ListItem",
      position: 2,
      name: breadcrumbLabels.get(route.path),
      item: `${siteUrl}${route.path}`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}

function listItems(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function linkList(items) {
  return items
    .map(([href, label]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`)
    .join("");
}

function routeHighlights(route) {
  if (route.path === "/") {
    return [
      "Start in the browser without installing.",
      "Move important Markdown files to the desktop app.",
      "Use preview, export, local history, and release notes without creating an account first.",
    ];
  }
  if (route.path === "/web") {
    return [
      "Write Markdown in the browser and preview the rendered result.",
      "Download a Markdown file or export HTML when the draft is ready.",
      "Keep browser drafts local unless you choose to submit feedback or join the waitlist.",
    ];
  }
  if (route.path === "/download") {
    return [
      "Windows preview installer, unsigned macOS Apple Silicon DMG, Linux AppImage, DEB, and RPM packages.",
      "Use the Windows desktop app to open .md files, view Markdown documents, edit local files, and reopen recent work.",
      "Release notes and safety notes explain what changed before installation.",
    ];
  }
  if (route.path === "/docs/open-md-files-on-windows") {
    return [
      "Right-click a .md file on Windows, choose Open with, and select VeloWrite.",
      "Use Preview mode to view Markdown files, or Split mode to edit the source beside the rendered result.",
      "Install the desktop app when local files, recent files, offline work, and history snapshots matter.",
    ];
  }
  if (route.path === "/faq") {
    return faqItems.map((item) => `${item.question} ${item.answer}`);
  }
  if (route.path === "/docs") {
    return [
      "Start with basics, history, and the online editor guide.",
      "Move into writer workflows, developer notes, code blocks, math, and local-first editing.",
      "Use platform articles for Windows, macOS, and Linux before deciding whether to install.",
    ];
  }
  if (route.path.startsWith("/docs/")) {
    return [
      "Read the concept in plain language before opening the editor.",
      "Use examples to connect Markdown source with the rendered result.",
      "Move from the guide to the web editor or desktop download when the workflow matters.",
    ];
  }
  if (route.path === "/roadmap") {
    return [
      "See what shipped, what is improving, and what is still under research.",
      "Track which user requests are recorded and which ones belong to the free preview.",
      "Use feedback links to tell the team what should improve before paid work expands.",
    ];
  }
  if (route.path === "/pro") {
    return [
      "Pro is planned for AI writing, advanced export, deeper recovery, sync, and publishing.",
      "The preview stays free for editing, preview, local files, and basic recovery.",
      "Pricing is shown early so users can judge whether the paid work feels fair.",
    ];
  }
  if (route.path === "/demo") {
    return [
      "Review the write, split, and preview modes with complex Markdown.",
      "Inspect math, tables, and multi-language code examples before installing.",
      "Use the demo as a low-friction path into the web editor and desktop preview.",
    ];
  }
  if (route.path === "/guide") {
    return [
      "Practice headings, lists, links, images, tables, math, and code tabs.",
      "See how the same Markdown source becomes readable preview output.",
      "Use the guide as a starter document for VeloWrite desktop testing.",
    ];
  }
  if (route.path === "/changelog") {
    return [
      "Check the current preview version before downloading.",
      "Review UI, export, packaging, documentation, and roadmap changes by release.",
      "Use release notes to confirm whether a reported issue has shipped.",
    ];
  }
  if (route.path === "/license") {
    return [
      "Use current preview builds for personal evaluation and early feedback.",
      "Link to the official download page or GitHub Releases instead of redistributing installers.",
      "Commercial licensing terms are not finalized while the preview remains free.",
    ];
  }

  return [
    "Understand what this page covers before using the VeloWrite preview.",
    "Follow linked pages for editor access, downloads, documentation, and feedback.",
    "Use the public roadmap and changelog to track what has shipped.",
  ];
}

function staticSnapshotFor(route) {
  const pageLabel = route.path === "/" ? "Home" : (breadcrumbLabels.get(route.path) ?? route.title);
  const relatedLinks = route.path === "/docs"
    ? docsLinks
    : route.path.startsWith("/docs/")
      ? [["/docs", "Markdown Library"], ["/web", "Open Web Editor"], ["/download", "Download Desktop"]]
      : [["/web", "Open Web Editor"], ["/download", "Download Desktop"], ["/docs", "Read Markdown Library"], ["/changelog", "Read Changelog"]];

  return `
      <main class="seo-snapshot" aria-label="${escapeHtml(pageLabel)}">
        <nav aria-label="Breadcrumb">
          <a href="/">VeloWrite</a>${route.path === "/" ? "" : ` / <span>${escapeHtml(pageLabel)}</span>`}
        </nav>
        <article>
          <h1>${escapeHtml(route.title)}</h1>
          <p>${escapeHtml(route.description)}</p>
          <section>
            <h2>What this page covers</h2>
            <ul>${listItems(routeHighlights(route))}</ul>
          </section>
          <section>
            <h2>Useful VeloWrite links</h2>
            <ul>${linkList(relatedLinks)}</ul>
          </section>
        </article>
      </main>`;
}

function replaceTag(html, regex, replacement) {
  return html.replace(regex, replacement);
}

function buildHtml(baseHtml, route) {
  const canonical = `${siteUrl}${route.path === "/" ? "/" : route.path}`;
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const robots = route.robots || "index, follow";

  let html = baseHtml;
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = replaceTag(
    html,
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="description" content="${description}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+name="robots"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="robots" content="${escapeHtml(robots)}" />`,
  );
  html = replaceTag(
    html,
    /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/>/,
    `<link rel="canonical" href="${canonical}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/>/,
    `<meta property="og:title" content="${title}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta property="og:description" content="${description}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/>/,
    `<meta property="og:url" content="${canonical}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="twitter:title" content="${title}" />`,
  );
  html = replaceTag(
    html,
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="twitter:description" content="${description}" />`,
  );
  html = replaceTag(
    html,
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n${JSON.stringify(schemaFor(route), null, 6)}\n    </script>`,
  );
  const breadcrumbSchema = breadcrumbSchemaFor(route);
  if (breadcrumbSchema) {
    html = html.replace(
      "</head>",
      `    <script type="application/ld+json" data-structured-id="breadcrumbs">\n${JSON.stringify(
        breadcrumbSchema,
        null,
        6,
      )}\n    </script>\n  </head>`,
    );
  }
  html = html.replace('<div id="root"></div>', `<div id="root">${staticSnapshotFor(route)}\n    </div>`);
  return html;
}

function writeRouteHtml(route, html) {
  const routePath = route.path === "/" ? indexPath : path.join(distDir, route.path.slice(1), "index.html");
  fs.mkdirSync(path.dirname(routePath), { recursive: true });
  fs.writeFileSync(routePath, html);
}

function writeSitemap() {
  const body = routes
    .map(
      (route) => `  <url>
    <loc>${siteUrl}${route.path === "/" ? "/" : route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
  fs.writeFileSync(path.join(distDir, "sitemap.xml"), xml);
  fs.writeFileSync(path.join(repoRoot, "public", "sitemap.xml"), xml);
}

if (!fs.existsSync(indexPath)) {
  throw new Error("dist/index.html does not exist. Run vite build first.");
}

const baseHtml = fs.readFileSync(indexPath, "utf8");
for (const route of [...routes, ...noindexRoutes]) {
  writeRouteHtml(route, buildHtml(baseHtml, route));
}

fs.writeFileSync(path.join(distDir, "404.html"), buildHtml(baseHtml, notFoundRoute));
writeSitemap();

console.log(`Generated SEO HTML for ${routes.length + noindexRoutes.length} routes plus 404.`);
