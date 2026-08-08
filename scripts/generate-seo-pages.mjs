import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(repoRoot, "dist");
const indexPath = path.join(distDir, "index.html");
const version = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version;
const siteUrl = "https://velowrite.app";
const today = new Date().toISOString().slice(0, 10);

const defaultTitle = "VeloWrite - Online Markdown Editor and Lightweight Desktop App";
const defaultDescription =
  "VeloWrite is a free online Markdown editor and lightweight desktop app for private drafts, live preview, PDF export, local files, and history recovery.";

const breadcrumbLabels = new Map([
  ["/web", "Web Editor"],
  ["/download", "Download"],
  ["/demo", "Demo"],
  ["/pro", "Pro Roadmap"],
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
  ["/docs/local-first-markdown", "Local-First Markdown"],
  ["/docs/typora-alternative", "Typora Alternative"],
  ["/docs/markdown-math", "Markdown Math"],
  ["/docs/markdown-to-blog", "Markdown to Blog"],
  ["/docs/markdown-editor-for-windows", "Markdown Editor for Windows"],
  ["/docs/markdown-editor-for-mac", "Markdown Editor for Mac"],
  ["/docs/markdown-editor-for-linux", "Markdown Editor for Linux"],
  ["/docs/preview-release-policy", "Preview Release Policy"],
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
  ["/docs/markdown-to-blog", "Markdown to Blog"],
  ["/docs/markdown-editor-for-windows", "Markdown Editor for Windows"],
  ["/docs/markdown-editor-for-mac", "Markdown Editor for Mac"],
  ["/docs/markdown-editor-for-linux", "Markdown Editor for Linux"],
];

const faqItems = [
  {
    question: "What is VeloWrite?",
    answer:
      "VeloWrite is a private Markdown editor for browser drafts, live preview, clean export, local history, and lightweight desktop files.",
  },
  {
    question: "What is the best lightweight Markdown editor for Windows?",
    answer:
      "VeloWrite is designed for people who want a lightweight Markdown editor for Windows with browser preview, desktop files, recent documents, local history snapshots, and HTML export.",
  },
  {
    question: "Can I edit Markdown online without uploading files?",
    answer:
      "Yes. Normal VeloWrite web editing and preview do not upload Markdown document content to VeloWrite servers. Browser drafts stay in localStorage on the same device.",
  },
  {
    question: "How is VeloWrite different from Typora?",
    answer:
      "VeloWrite follows a Typora-like writing direction but starts with a quick browser editor, lightweight Tauri desktop builds, local files, visible preview limits, and a public roadmap for AI, sync, and publishing.",
  },
  {
    question: "Does VeloWrite work offline?",
    answer:
      "The desktop preview is the offline path for real local files. The web editor is better for quick drafts, Markdown download, and HTML export while the browser is available.",
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
    title: "VeloWrite Web Editor - Private Online Markdown Editing",
    description:
      "Open VeloWrite in the browser to write Markdown, preview rendered output, export HTML, and download .md files without creating an account.",
    priority: "0.9",
    changefreq: "weekly",
    schema: ["software"],
  },
  {
    path: "/download",
    title: "Download VeloWrite - Windows, macOS, and Linux Markdown App",
    description:
      "Download the VeloWrite desktop preview for Windows, macOS Apple Silicon, AppImage, Debian, and RPM Linux.",
    priority: "0.9",
    changefreq: "weekly",
    schema: ["software"],
  },
  {
    path: "/demo",
    title: "VeloWrite Demo - Markdown Editing, Preview, Math, and Code Tabs",
    description:
      "Try the VeloWrite interactive demo with complex Markdown, live preview, math rendering, tables, and multi-language code tabs.",
    priority: "0.8",
    changefreq: "monthly",
    schema: ["software"],
  },
  {
    path: "/pro",
    title: "VeloWrite Pro Roadmap - AI, Sync, and Publishing Workflows",
    description:
      "See the planned VeloWrite Pro path: early pricing, AI writing commands, advanced exports, recovery controls, sync, and publishing.",
    priority: "0.7",
    changefreq: "monthly",
  },
  {
    path: "/roadmap",
    title: "VeloWrite Public Roadmap - User Feedback and Planned Improvements",
    description:
      "See recorded VeloWrite user requests, shipped preview fixes, and the local-file editor improvements being researched next.",
    priority: "0.7",
    changefreq: "weekly",
    schema: ["article"],
  },
  {
    path: "/guide",
    title: "VeloWrite Markdown Guide - Practical Writing Examples",
    description:
      "A Markdown guide with headings, lists, tables, math, code tabs, and desktop use for VeloWrite users.",
    priority: "0.8",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs",
    title: "VeloWrite Markdown Library - Guides, Workflows, and Advanced Markdown",
    description:
      "Read VeloWrite Markdown articles about basics, history, writing, code blocks, math, local files, and editor comparisons.",
    priority: "0.8",
    changefreq: "weekly",
  },
  {
    path: "/docs/markdown",
    title: "What Is Markdown? Plain Text Writing for Notes, Docs, and Blogs",
    description:
      "Learn what Markdown is, how it compares with rich text and HTML, where it works best, and how to start writing portable Markdown documents.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-history",
    title: "A Short History of Markdown - 2004, Aaron Swartz, and CommonMark",
    description:
      "A short history of Markdown's 2004 origin, its first Perl converter, Aaron Swartz's influence, and why CommonMark later became necessary.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/future-of-markdown",
    title: "The Future of Markdown Writing - Local Files, AI, and Export Readiness",
    description:
      "Read how Markdown writing is changing around local files, safer recovery, AI inside the document, export checks, and publishing.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/online-markdown-editor",
    title: "Online Markdown Editor - Write, Preview, and Download Markdown",
    description:
      "Use VeloWrite as a free online Markdown editor for quick drafts, live preview, Markdown download, HTML export, and a desktop path for local files.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-basics",
    title: "Markdown Basics - Headings, Lists, Links, Images, and Documents",
    description:
      "A plain Markdown basics guide for headings, lists, links, images, simple document structure, and what the rendered result looks like.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-for-writers",
    title: "Markdown for Writers - Clean Drafts Without Formatting Drag",
    description:
      "How writers can use Markdown for essays, articles, notes, outlines, and publishable drafts without fighting a heavy word processor.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-for-developers",
    title: "Markdown for Developers - READMEs, Specs, Docs, and Release Notes",
    description:
      "A Markdown guide for README files, technical specs, API notes, code examples, changelogs, and documentation.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/advanced-markdown",
    title: "Advanced Markdown - Portable, Reviewable, Maintainable Documents",
    description:
      "Advanced Markdown practices for portable, reviewable documents: semantic line breaks, reference links, escaped text, stable anchors, and reusable templates.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-math",
    title: "Markdown Math with KaTeX - Inline and Block Formula Examples",
    description:
      "Use Markdown math with KaTeX for inline formulas, block equations, technical notes, study guides, and engineering documentation.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-to-blog",
    title: "Markdown to Blog - Draft Locally, Preview Clearly, Publish Later",
    description:
      "Draft blog posts in Markdown, preview the structure, export HTML, and keep the source file ready for later publishing.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-code-blocks",
    title: "Markdown Code Blocks and Tabs - Multi-Language Documentation",
    description:
      "Write better Markdown code examples with fenced code blocks, syntax highlighting, language labels, and tabbed multi-language snippets.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/local-first-markdown",
    title: "Local-First Markdown Editing - Private Files and Offline Writing",
    description:
      "Understand local-first Markdown editing, why user-owned files matter, and when to move from a browser editor to a desktop app.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/typora-alternative",
    title: "Typora Alternative - Lightweight Local-First Markdown Editing",
    description:
      "Compare VeloWrite as a Typora alternative for browser trials, lightweight desktop builds, local files, recovery history, and roadmap notes.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-editor-for-windows",
    title: "Markdown Editor for Windows - VeloWrite Desktop Preview",
    description:
      "Try VeloWrite on Windows for Markdown editing, local files, recent documents, local history, Open with support, and installer notes.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-editor-for-mac",
    title: "Markdown Editor for Mac - Local-First Markdown Writing",
    description:
      "Evaluate VeloWrite on macOS with browser-first Markdown editing, Apple Silicon DMG preview notes, local files, history, export checks, and update visibility.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-editor-for-linux",
    title: "Markdown Editor for Linux - AppImage, DEB, RPM, and Local Files",
    description:
      "Use VeloWrite on Linux with AppImage, DEB, RPM, browser editing, local files, export checks, and a lightweight Tauri desktop app.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/preview-release-policy",
    title: "How VeloWrite Preview Releases Work - Versions, Downloads, and Changelog",
    description:
      "Understand how VeloWrite preview versions, GitHub Releases, installer assets, changelog entries, and download page dates fit together.",
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
  if (route.schema?.includes("software")) graph.push(softwareSchema());
  if (route.schema?.includes("article")) {
    graph.push({
      "@type": "Article",
      "@id": `${siteUrl}${route.path}#article`,
      headline: route.title,
      description: route.description,
      dateModified: today,
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
      "Start in the browser without installing anything.",
      "Move important Markdown files to the lightweight desktop app.",
      "Use preview, export, local history, and release notes without an account-first workflow.",
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
      "Release notes and safety notes explain what changed before users install.",
      "Desktop builds unlock local files, offline writing, recent files, and local history snapshots.",
    ];
  }
  if (route.path === "/faq") {
    return faqItems.map((item) => `${item.question} ${item.answer}`);
  }
  if (route.path === "/docs") {
    return [
      "Learn Markdown basics, history, writer workflows, developer docs, code blocks, math, and local-first editing.",
      "Use the library as a practical route from learning Markdown to trying VeloWrite in the browser.",
      "Follow platform-specific articles for Windows, macOS, and Linux preview expectations.",
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
      "See shipped preview work, active free-preview improvements, researched items, and future Pro candidates.",
      "Track which user requests have been recorded and which workflows are being hardened next.",
      "Use feedback links to shape the editor before paid workflows expand.",
    ];
  }
  if (route.path === "/pro") {
    return [
      "Future Pro work is expected to focus on AI writing workflows, advanced export, recovery controls, sync, and publishing.",
      "The preview remains free while core editing, privacy, file handling, and recovery are hardened.",
      "Pricing is introduced early so users can judge whether future paid work feels fair.",
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
