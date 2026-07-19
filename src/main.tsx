import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
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
const downloadVersion = "0.1.6";
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

function routeSeo(pathname: string): SeoConfig {
  if (pathname.startsWith("/web")) {
    return {
      title: "VeloWrite Web Editor - Private Online Markdown Editing",
      description:
        "Open VeloWrite in the browser to write Markdown, preview rendered output, export HTML, and download .md files without creating an account.",
      canonicalPath: "/web",
    };
  }

  if (pathname.startsWith("/download")) {
    return {
      title: "Download VeloWrite - Windows, macOS, and Linux Markdown App",
      description:
        "Download the VeloWrite desktop preview for Windows, Apple Silicon macOS, AppImage, Debian, and RPM Linux workflows.",
      canonicalPath: "/download",
    };
  }

  if (pathname.startsWith("/demo")) {
    return {
      title: "VeloWrite Demo - Markdown Editing, Preview, Math, and Code Tabs",
      description:
        "Try the VeloWrite interactive demo with complex Markdown, live preview, math rendering, tables, and multi-language code tabs.",
      canonicalPath: "/demo",
    };
  }

  if (pathname.startsWith("/pro")) {
    return {
      title: "VeloWrite Pro Roadmap - AI, Sync, and Publishing Workflows",
      description:
        "Explore the planned VeloWrite Pro path for AI writing commands, private sync, publishing automation, advanced exports, and team workflows.",
      canonicalPath: "/pro",
    };
  }

  if (pathname.startsWith("/roadmap")) {
    return {
      title: "VeloWrite Public Roadmap - User Feedback and Planned Improvements",
      description:
        "See which VeloWrite user requests have been recorded, what belongs in the free preview, and which future workflows may become Pro features.",
      canonicalPath: "/roadmap",
    };
  }

  if (pathname.startsWith("/guide")) {
    return {
      title: "VeloWrite Markdown Guide - Practical Writing Examples",
      description:
        "A practical Markdown guide showing headings, lists, tables, math, code tabs, and desktop workflows for VeloWrite users.",
      canonicalPath: "/guide",
    };
  }

  if (pathname.startsWith("/changelog")) {
    return {
      title: "VeloWrite Changelog - Release Notes and Preview Updates",
      description:
        "Read the VeloWrite changelog for preview release notes, UI updates, SEO changes, guide improvements, and future roadmap notes.",
      canonicalPath: "/changelog",
    };
  }

  if (pathname.startsWith("/faq")) {
    return {
      title: "VeloWrite FAQ - Markdown Editor, Privacy, Desktop, and Pro",
      description:
        "Answers about VeloWrite's online Markdown editor, Tauri desktop app, privacy model, platform support, preview limits, and future Pro workflows.",
      canonicalPath: "/faq",
    };
  }

  if (pathname.startsWith("/privacy")) {
    return {
      title: "VeloWrite Privacy Policy",
      description:
        "How VeloWrite handles Markdown content, browser drafts, local storage, analytics consent, waitlist emails, and feedback submissions.",
      canonicalPath: "/privacy",
    };
  }

  if (pathname.startsWith("/terms")) {
    return {
      title: "VeloWrite Terms of Service",
      description:
        "Preview terms for using VeloWrite web editor and desktop builds during early product validation.",
      canonicalPath: "/terms",
    };
  }

  if (pathname.startsWith("/refund")) {
    return {
      title: "VeloWrite Refund Policy",
      description:
        "Current refund expectations for the free VeloWrite preview and future paid desktop or subscription plans.",
      canonicalPath: "/refund",
    };
  }

  if (pathname.startsWith("/license")) {
    return {
      title: "VeloWrite License",
      description:
        "Preview license terms for evaluating VeloWrite before commercial licensing and paid plans are finalized.",
      canonicalPath: "/license",
    };
  }

  if (pathname.startsWith("/feedback")) {
    return {
      title: "VeloWrite Feedback",
      description:
        "Send feedback about VeloWrite web editor, desktop preview builds, Markdown workflows, packaging, and future Pro features.",
      canonicalPath: "/feedback",
      robots: "noindex, follow",
    };
  }

  if (pathname.startsWith("/app")) {
    return {
      title: "VeloWrite Desktop App Shell",
      description: defaultSeoDescription,
      canonicalPath: "/app",
      robots: "noindex, nofollow",
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

    if (config.canonicalPath === "/guide" || config.canonicalPath === "/changelog" || config.canonicalPath === "/roadmap") {
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
  {
    platform: "macOS",
    format: "DMG",
    fileName: `VeloWrite_${downloadVersion}_aarch64.dmg`,
    note: "Unsigned preview build for Apple Silicon Macs.",
  },
];

const publicRoadmapItems = [
  {
    title: "Editor and preview sync scrolling",
    request: "Long Markdown documents should keep the editor and preview aligned while writing.",
    status: "Planned for Preview",
    target: "0.2.x",
    classification: "Free core editor work",
    decision:
      "This belongs in the core editor experience. It should not be a Pro-only feature because split editing feels incomplete without it.",
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
      "A simple handoff path should be free. Automatic cross-device sync may become Pro only after the local-first workflow is proven.",
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
          "VeloWrite currently offers a web editor plus preview desktop installers for Windows x64, Apple Silicon macOS, Linux AppImage, Debian, and RPM-based Linux distributions.",
      },
      {
        question: "Will the desktop installer trigger a warning?",
        answer:
          "Not yet. The current Windows and macOS preview installers are unsigned, so SmartScreen or Gatekeeper may show security warnings until code signing and notarization are ready.",
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

const contentPages: Record<"guide" | "changelog", ContentPage> = {
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
  changelog: {
    eyebrow: "Release notes",
    title: "VeloWrite Changelog",
    intro:
      "This changelog keeps the preview history readable. It shows what changed, why it changed, and which parts are still intentionally incomplete. Older preview versions are kept below so you can scan the release history at a glance.",
    updated: "July 19, 2026",
    directory: [
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
          "We use Vercel Web Analytics to understand basic site usage, such as page views and download-link clicks. On this site, the analytics script is only loaded after you choose Allow analytics in the cookie banner.",
          "VeloWrite uses localStorage to remember your analytics choice. If you decline analytics, the analytics script is not loaded by this React app. You can clear your browser site data to reset the choice.",
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
            <h3>Markdown Starter Guide</h3>
            <p>Practical examples for headings, lists, tables, math, code blocks, export, and local-first desktop work.</p>
            <a className="text-link" href="/guide?utm_source=homepage_resources&utm_medium=resource">
              Read guide <ChevronRight size={15} />
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
                <button disabled>Planned</button>
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
              <li>Windows, Linux, and Apple Silicon macOS preview packages</li>
              <li>Privacy policy, cookie consent, and waitlist email handling</li>
            </ul>
          </article>
          <article>
            <h2>Preview Limits</h2>
            <ul>
              <li>No code signing yet on Windows or macOS</li>
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
            <li>Windows and macOS builds are not code-signed yet, so your system may show a security warning during install.</li>
            <li>The macOS DMG currently supports Apple Silicon. Intel Mac support will be evaluated based on feedback.</li>
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

      <main className="content-shell">
        <div className="eyebrow">
          <FileText size={16} />
          {content.eyebrow}
        </div>
        <h1>{content.title}</h1>
        <p className="legal-updated">Last updated: {content.updated}</p>
        <p className="legal-intro">{content.intro}</p>

        {content.directory && (
          <nav className="content-directory" aria-label="Changelog directory">
            <span>Versions</span>
            <div>
              {content.directory.map((item) => (
                <a href={item.href} key={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}

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
  return (
    <footer className="site-footer">
      <div>
        <strong>VeloWrite</strong>
        <span>Local-first Markdown writing, with a web preview path.</span>
      </div>
      <nav aria-label="Legal and product links">
        <a href="/guide">Guide</a>
        <a href="/roadmap">Roadmap</a>
        <a href="/changelog">Changelog</a>
        <a href="/faq">FAQ</a>
        <a href="/feedback">Feedback</a>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/refund">Refund</a>
        <a href="/license">License</a>
        <a href="/pro">Pro</a>
        <a href="/download">Download</a>
        <a href="https://github.com/ken-water/velowrite" target="_blank" rel="noreferrer">
          GitHub
        </a>
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

function Router() {
  const searchParams = new URLSearchParams(window.location.search);
  const demoFrame = searchParams.get("utm_source") === "demo_frame";
  const seo = routeSeo(window.location.pathname);
  let page: React.ReactNode;

  if (window.location.pathname.startsWith("/web")) {
    page = (
      <React.Suspense fallback={<div className="loading-screen">Loading web editor</div>}>
        <EditorApp
          surface="web"
          initialMarkdown={demoFrame ? complexDemoMarkdown : undefined}
          initialViewMode={demoFrame ? "split" : undefined}
        />
      </React.Suspense>
    );
  } else if (window.location.pathname.startsWith("/app")) {
    page = (
      <React.Suspense fallback={<div className="loading-screen">Loading editor</div>}>
        <EditorApp surface="desktop" />
      </React.Suspense>
    );
  } else if (window.location.pathname.startsWith("/download")) {
    page = <DownloadPage />;
  } else if (window.location.pathname.startsWith("/demo")) {
    page = <InteractiveDemoPage />;
  } else if (window.location.pathname.startsWith("/pro")) {
    page = <ProPage />;
  } else if (window.location.pathname.startsWith("/roadmap")) {
    page = <RoadmapPage />;
  } else if (window.location.pathname.startsWith("/guide")) {
    page = <ContentPage page="guide" />;
  } else if (window.location.pathname.startsWith("/changelog")) {
    page = <ContentPage page="changelog" />;
  } else if (window.location.pathname.startsWith("/faq")) {
    page = <FAQPage />;
  } else if (window.location.pathname.startsWith("/privacy")) {
    page = <LegalPage page="privacy" />;
  } else if (window.location.pathname.startsWith("/terms")) {
    page = <LegalPage page="terms" />;
  } else if (window.location.pathname.startsWith("/refund")) {
    page = <LegalPage page="refund" />;
  } else if (window.location.pathname.startsWith("/license")) {
    page = <LegalPage page="license" />;
  } else if (window.location.pathname.startsWith("/feedback")) {
    page = <FeedbackPage />;
  } else {
    page = <LandingPage />;
  }

  return (
    <>
      <SeoManager config={seo} />
      {page}
    </>
  );
}

function AppRoot() {
  const [analyticsConsent, setAnalyticsConsent] = React.useState<string | null>(() => {
    return window.localStorage.getItem(analyticsConsentKey);
  });

  function updateAnalyticsConsent(nextValue: "accepted" | "declined") {
    window.localStorage.setItem(analyticsConsentKey, nextValue);
    setAnalyticsConsent(nextValue);
  }

  return (
    <>
      <Router />
      {analyticsConsent === "accepted" && <Analytics />}
      <CookieConsent value={analyticsConsent} onChange={updateAnalyticsConsent} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>,
);
