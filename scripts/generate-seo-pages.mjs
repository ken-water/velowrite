import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(repoRoot, "dist");
const indexPath = path.join(distDir, "index.html");
const version = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version;
const siteUrl = "https://velowrite.app";
const today = "2026-08-01";

const defaultTitle = "VeloWrite - Online Markdown Editor and Lightweight Desktop App";
const defaultDescription =
  "VeloWrite is a private online Markdown editor and lightweight Tauri desktop app for fast writing, live preview, export, local history, and native file workflows.";

const faqItems = [
  {
    question: "What is VeloWrite?",
    answer:
      "VeloWrite is a private online Markdown editor and lightweight Tauri desktop app for fast writing, live preview, export, local history, and native file workflows.",
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
      "VeloWrite follows a Typora-like writing direction but starts with a fast browser editor, lightweight Tauri desktop builds, local-first files, visible preview limits, and a public roadmap for AI, sync, and publishing workflows.",
  },
  {
    question: "Does VeloWrite work offline?",
    answer:
      "The desktop preview is the offline path for real local files. The web editor is best for quick drafts, Markdown download, and HTML export while the browser is available.",
  },
  {
    question: "Is VeloWrite safe for private notes?",
    answer:
      "VeloWrite is designed around private, local-first writing. Browser drafts stay in localStorage, and desktop files plus local history snapshots stay on the user's device by default.",
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
      "Download the VeloWrite desktop preview for Windows, macOS Apple Silicon, AppImage, Debian, and RPM Linux workflows.",
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
      "Explore the planned VeloWrite Pro path for AI writing commands, private sync, publishing automation, advanced exports, and team workflows.",
    priority: "0.7",
    changefreq: "monthly",
  },
  {
    path: "/roadmap",
    title: "VeloWrite Public Roadmap - User Feedback and Planned Improvements",
    description:
      "See which VeloWrite user requests have been recorded, which preview fixes have shipped, and what local-first editor improvements are being researched next.",
    priority: "0.7",
    changefreq: "weekly",
    schema: ["article"],
  },
  {
    path: "/guide",
    title: "VeloWrite Markdown Guide - Practical Writing Examples",
    description:
      "A practical Markdown guide showing headings, lists, tables, math, code tabs, and desktop workflows for VeloWrite users.",
    priority: "0.8",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs",
    title: "VeloWrite Markdown Library - Guides, Workflows, and Advanced Markdown",
    description:
      "Explore VeloWrite Markdown articles covering basics, history, writing workflows, code blocks, math, local-first editing, and editor comparisons.",
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
    title: "A Short History of Markdown - From Plain Text to Modern Writing",
    description:
      "A practical history of Markdown, why it became popular with writers and developers, why variants exist, and what modern Markdown editors should preserve.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/future-of-markdown",
    title: "The Future of Markdown Writing - Local Files, AI, and Export Readiness",
    description:
      "Explore where Markdown writing is heading: local-first files, safer recovery, AI inside the document flow, export readiness, and publishing workflows.",
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
      "A developer-focused Markdown guide for README files, technical specs, API notes, code examples, changelogs, and documentation workflows.",
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
      "Compare VeloWrite as a Typora alternative for quick browser trials, lightweight Tauri desktop builds, local files, recovery history, and public roadmap transparency.",
    priority: "0.75",
    changefreq: "monthly",
    schema: ["article"],
  },
  {
    path: "/docs/markdown-editor-for-windows",
    title: "Markdown Editor for Windows - VeloWrite Desktop Preview",
    description:
      "Try VeloWrite on Windows for Markdown editing, native local files, recent documents, local history, Open with workflows, and preview installer guidance.",
    priority: "0.75",
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
