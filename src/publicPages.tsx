import React from "react";
import {
  ChevronRight,
  CheckCircle2,
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
import type { ContentPage as ContentPageData, FaqGroup, FaqItem } from "./contentTypes";
const RenderedMarkdownExample = React.lazy(() => import("./RenderedMarkdownExample"));
const DemoCodeTabs = React.lazy(() => import("./DemoCodeTabs"));
const EditorApp = React.lazy(() => import("./EditorApp"));

const downloadVersion = "0.3.0";
const downloadReleaseDate = "September 5, 2026";
const releaseBaseUrl = `https://github.com/ken-water/velowrite/releases/download/v${downloadVersion}`;
const releaseTagUrl = `https://github.com/ken-water/velowrite/releases/tag/v${downloadVersion}`;
const webEditorHref = "/web?utm_source=landing&utm_medium=cta";
const downloadHref = "/download?utm_source=landing&utm_medium=cta";
const siteUrl = "https://velowrite.app";
const exampleMarkdownKey = "velowrite:example-markdown";

const docPageRoutes = {
  "/docs/markdown": "markdown",
  "/docs/markdown-history": "markdownHistory",
  "/docs/future-of-markdown": "futureOfMarkdown",
  "/docs/markdown-basics": "markdownBasics",
  "/docs/markdown-for-writers": "markdownForWriters",
  "/docs/markdown-for-developers": "markdownForDevelopers",
  "/docs/advanced-markdown": "advancedMarkdown",
  "/docs/markdown-math": "markdownMath",
  "/docs/write-math-in-markdown": "writeMathInMarkdown",
  "/docs/markdown-code-blocks": "markdownCodeBlocks",
  "/docs/long-markdown-workflow": "longMarkdownWorkflow",
  "/docs/markdown-shortcuts": "markdownShortcuts",
  "/docs/local-first-markdown": "localFirstMarkdown",
  "/docs/typora-alternative": "typoraAlternative",
  "/docs/online-markdown-editor": "onlineMarkdownEditor",
  "/docs/markdown-to-blog": "markdownToBlog",
  "/docs/markdown-editor-for-windows": "markdownEditorForWindows",
  "/docs/open-md-files-on-windows": "openMdFilesOnWindows",
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
  "/docs/markdown-shortcuts",
  "/docs/markdown-for-developers",
  "/docs/markdown-for-writers",
  "/docs/advanced-markdown",
  "/docs/markdown-math",
  "/docs/write-math-in-markdown",
  "/docs/markdown-to-blog",
  "/docs/online-markdown-editor",
  "/docs/typora-alternative",
  "/docs/markdown-editor-for-windows",
  "/docs/open-md-files-on-windows",
  "/docs/markdown-editor-for-mac",
  "/docs/markdown-editor-for-linux",
  "/docs/preview-release-policy",
  "/docs/pdf-export-notes",
  "/docs/preview-build-limitations",
  "/docs/private-online-markdown-editor",
  "/docs/download-safety",
  "/docs/markdown-meeting-notes",
]);

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function isTauriRuntime() {
  return "__TAURI_INTERNALS__" in window;
}

type SeoConfig = {
  title: string;
  description: string;
  canonicalPath: string;
  robots?: string;
};

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

function useComplexDemoMarkdown(shouldLoad: boolean) {
  const [markdown, setMarkdown] = React.useState<string | undefined>();

  React.useEffect(() => {
    if (!shouldLoad) return;

    let active = true;
    import("./sampleMarkdown").then(({ complexDemoMarkdown }) => {
      if (active) setMarkdown(complexDemoMarkdown);
    });

    return () => {
      active = false;
    };
  }, [shouldLoad]);

  return shouldLoad ? markdown : undefined;
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
    platform: "macOS Apple Silicon preview",
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

const platformRegressionChecks = [
  {
    platform: "Windows 11",
    checks: [
      "Install with the NSIS package from GitHub Releases.",
      "Open a .md file through Open with -> VeloWrite.",
      "Save, close from the window button or File -> Exit, and reopen the same file.",
      "Confirm local history keeps the latest 3 snapshots after repeated saves.",
    ],
  },
  {
    platform: "macOS Apple Silicon",
    checks: [
      "Install from the DMG and use the explicit open action while the preview remains unsigned.",
      "Open a local Markdown file and verify the editor starts directly in the writing workspace.",
      "Export HTML and PDF for clean review copies.",
      "Confirm recent files and history are visible after reopening the app.",
    ],
  },
  {
    platform: "Linux",
    checks: [
      "Test AppImage for portable use and DEB/RPM packages for native install flows.",
      "Open, edit, save, and reopen a Markdown file from a normal user folder.",
      "Check dark mode readability for preview code blocks and tabbed examples.",
      "Confirm the app closes without leaving a terminal-owned process behind.",
    ],
  },
];

const roadmapRecommendations = [
  {
    priority: "Best next free improvement",
    title: "Make the desktop app feel native",
    reason:
      "The app should open like a writing tool, not a website in a window. It already starts in the editor. Next we are tightening file actions, window behavior, and first-run details.",
  },
  {
    priority: "Next quality pass",
    title: "Make long-document recovery easier to read",
    reason:
      "Basic history is free. Compare and restore should make changed lines easy to find in a long draft before deeper Pro history is added.",
  },
  {
    priority: "Next export check",
    title: "Help users catch export problems",
    reason:
      "Users need to know whether a Markdown file is ready to share. The free readiness panel comes before branded templates, DOCX, and publishing.",
  },
];

const previewAcceptanceChecks = [
  "Open directly into the editor without a marketing-style first screen.",
  "Open, save, close, and reopen Markdown files on Windows, Linux, and macOS preview builds.",
  "Keep editor, outline, and rendered preview aligned well enough for long-document navigation.",
  "Compare and restore the latest 3 local snapshots without hiding the important changes.",
  "Export Markdown, HTML, and dedicated PDF review copies.",
  "Keep the public docs, roadmap, changelog, and feedback loop current after each release.",
];

const publicRoadmapItems = [
  {
    title: "Markdown learning library",
    request: "Users should understand Markdown basics, advanced syntax, platform support, and where VeloWrite fits before downloading the desktop app.",
    status: "Shipped",
    target: "0.1.x",
    classification: "Free education and discovery",
    decision:
      "The article library is live under /docs. It covers Markdown basics, history, local files, maintainable documents, code blocks, math, and Markdown-to-blog writing. Example blocks open in the web editor, so readers can try the syntax without copying it by hand.",
  },
  {
    title: "Editor and preview sync scrolling",
    request: "Long Markdown documents should keep the editor and preview aligned while writing.",
    status: "In progress",
    target: "0.1.x / 0.2.x",
    classification: "Free core editor work",
    decision:
      "Outline clicks align both panes in the preview build. Stable scroll matching for long documents remains core editor work because it affects everyday writing.",
  },
  {
    title: "Focused writing polish",
    request: "The desktop app should feel like a calm native writing tool, not a website inside a window.",
    status: "Free preview shipped",
    target: "0.1.x / 0.2.x",
    classification: "Free core experience",
    decision:
      "The desktop preview opens directly into the editor, keeps the workspace sidebar hidden by default, and prepares a last-file restore path. More native polish is still needed.",
  },
  {
    title: "Outline and structure map",
    request: "Writers need a clearer way to understand document structure before turning notes into a finished draft.",
    status: "Free preview shipped",
    target: "0.1.x / 0.2.x",
    classification: "Free structure workflow first",
    decision:
      "The editor now has a read-only structure map with H1/H2/H3 counts and active-heading feedback after outline navigation. Folding, section diagnostics, editable mapping, and AI outline expansion can be evaluated later.",
  },
  {
    title: "Better local history recovery",
    request: "Users want confidence that accidental paste mistakes or rewrites can be recovered.",
    status: "Free preview shipped",
    target: "0.1.x / 0.2.x",
    classification: "Free safety workflow",
    decision:
      "Basic local history and restore preview stay free because recovery is part of document safety. The free preview keeps the latest 3 local snapshots, and the history dialog can jump to the first change in longer drafts.",
  },
  {
    title: "Advanced history and recovery controls",
    request: "Power users may need deeper restore history, longer retention, cross-device history, and clearer comparison for long documents.",
    status: "Designing",
    target: "0.2.x / 0.3.x",
    classification: "Recovery policy design",
    decision:
      "The free preview keeps 3 local snapshots. Longer retention, deeper review, cross-device history, and exportable recovery archives remain candidates for Pro.",
  },
  {
    title: "Web to desktop draft handoff",
    request: "Start quickly in the browser, then continue in the desktop app without manual copy and paste.",
    status: "Free preview shipped",
    target: "0.1.x / 0.2.x",
    classification: "Free handoff first",
    decision:
      "The web editor can download the current Markdown draft and offers a desktop handoff with a velowrite:// import path plus a Markdown backup fallback. Account-based sync remains a later decision.",
  },
  {
    title: "Private, no-account sync",
    request: "Sync should not force a heavy cloud account or take ownership away from local files.",
    status: "Researching",
    target: "0.3.x+",
    classification: "Local-first sync research",
    decision:
      "The first sync design should preserve folder ownership. It needs clear import and export, predictable conflict handling, and a documented path for users who already use Git, Syncthing, iCloud, Dropbox, or OneDrive.",
  },
  {
    title: "More complete Markdown rendering",
    request: "Complex documents need reliable math, code tabs, tables, images, and long-form preview behavior.",
    status: "In progress",
    target: "0.1.x / 0.2.x",
    classification: "Free preview quality",
    decision:
      "The preview needs to render real documents reliably. The math and code-block guides cover KaTeX, tables, code highlighting, and tabbed examples. This area still needs broader tests.",
  },
  {
    title: "Better export and publishing preparation",
    request: "Users need finished documents that look good when shared outside the editor.",
    target: "0.2.x / 0.3.x",
    classification: "Free export baseline, Pro workflow later",
    status: "Free preview shipped",
    decision:
      "The editor now includes Markdown download, HTML export, dedicated PDF export, and an export readiness panel for title, structure, links, images, and code blocks. DOCX, branded templates, batch export, and one-click publishing remain candidates for later packaging.",
  },
  {
    title: "AI writing, publishing, and advanced export research",
    request: "Some users want richer workflows once the basic editor is stable.",
    status: "Later",
    target: "0.3.x+",
    classification: "Future workflow research",
    decision:
      "These features can wait until the core editor is dependable. The roadmap records the request, and the Pro page will describe packaging when there is something users can try.",
  },
];

const roadmapStages = [
  {
    label: "Shipped",
    description: "Available now in the free preview or public docs.",
    items: publicRoadmapItems.filter((item) => ["Shipped", "Free preview shipped"].includes(item.status)),
  },
  {
    label: "In progress",
    description: "Free editor work we are still tightening.",
    items: publicRoadmapItems.filter((item) => item.status === "In progress"),
  },
  {
    label: "Next / designing",
    description: "Useful work that needs more product detail before release.",
    items: publicRoadmapItems.filter((item) => ["Designing", "Researching"].includes(item.status)),
  },
  {
    label: "Pro candidates",
    description: "Larger features that may become paid after the free editor is stable.",
    items: publicRoadmapItems.filter((item) => item.status === "Later"),
  },
];

const docGroups = [
  {
    title: "Understand Markdown",
    description: "Basic articles on writing formats and Markdown editors.",
    items: [
      { title: "What Is Markdown?", href: "/docs/markdown", status: "Published" },
      { title: "A Short History of Markdown", href: "/docs/markdown-history", status: "Published" },
      { title: "The Future of Markdown Writing", href: "/docs/future-of-markdown", status: "Published" },
    ],
  },
  {
    title: "Use Markdown Better",
    description: "Guides for daily writing, meeting notes, documentation, and technical drafts.",
    items: [
      { title: "Markdown Basics", href: "/docs/markdown-basics", status: "Published" },
      { title: "Markdown for Writers", href: "/docs/markdown-for-writers", status: "Published" },
      { title: "Markdown for Developers", href: "/docs/markdown-for-developers", status: "Published" },
      { title: "Markdown Meeting Notes Template", href: "/docs/markdown-meeting-notes", status: "Published" },
    ],
  },
  {
    title: "Advanced Markdown",
    description: "Longer guides for math, code, tables, tabs, and local files.",
    items: [
      { title: "Markdown Code Blocks and Tabs", href: "/docs/markdown-code-blocks", status: "Published" },
      { title: "How to Work Faster in Long Markdown Drafts", href: "/docs/long-markdown-workflow", status: "Published" },
      { title: "Markdown Shortcuts for Daily Editing", href: "/docs/markdown-shortcuts", status: "Published" },
      { title: "Markdown Image Paths and Assets", href: "/docs/markdown-images", status: "Planned" },
      { title: "Markdown Tables That Stay Readable", href: "/docs/markdown-tables", status: "Planned" },
      { title: "Local-First Markdown Editing", href: "/docs/local-first-markdown", status: "Published" },
      { title: "Advanced Markdown", href: "/docs/advanced-markdown", status: "Published" },
      { title: "Markdown Math with KaTeX", href: "/docs/markdown-math", status: "Published" },
      { title: "How to Write Math in Markdown", href: "/docs/write-math-in-markdown", status: "Published" },
    ],
  },
  {
    title: "Choose a Markdown Editor",
    description: "Pages for people comparing platforms, browser editors, and desktop alternatives.",
    items: [
      { title: "Online Markdown Editor", href: "/docs/online-markdown-editor", status: "Published" },
      { title: "Typora Alternative", href: "/docs/typora-alternative", status: "Published" },
      { title: "Markdown to Blog", href: "/docs/markdown-to-blog", status: "Published" },
      { title: "How to Open .md Files on Windows 11", href: "/docs/open-md-files-on-windows", status: "Published" },
      { title: "Markdown Editor for Windows", href: "/docs/markdown-editor-for-windows", status: "Published" },
      { title: "Markdown Editor for Mac", href: "/docs/markdown-editor-for-mac", status: "Published" },
      { title: "Markdown Editor for Linux", href: "/docs/markdown-editor-for-linux", status: "Published" },
    ],
  },
  {
    title: "Release Trust",
    description: "Preview notes for downloads, installer assets, PDF export, and troubleshooting.",
    items: [
      { title: "How VeloWrite Preview Releases Work", href: "/docs/preview-release-policy", status: "Published" },
      { title: "PDF Export Notes", href: "/docs/pdf-export-notes", status: "Published" },
      { title: "Preview Build Limitations", href: "/docs/preview-build-limitations", status: "Published" },
      {
        title: "Private Online Markdown Editor",
        href: "/docs/private-online-markdown-editor",
        status: "Published",
      },
      { title: "Download Safety", href: "/docs/download-safety", status: "Published" },
      { title: "Troubleshooting Guide", href: "/docs/troubleshooting", status: "Planned" },
    ],
  },
] as const;

const faqGroups: readonly FaqGroup[] = [
  {
    title: "Product Basics",
    items: [
      {
        question: "What is VeloWrite?",
        answer: "VeloWrite is a Markdown editor for browser drafts, preview, export, local history, and local files on desktop.",
      },
      {
        question: "Is VeloWrite a Typora alternative?",
        answer: "VeloWrite is for people who want a Markdown editor with browser access, desktop files, and a public roadmap.",
      },
      {
        question: "What is the best lightweight Markdown editor for Windows?",
        answer: "VeloWrite is a Windows Markdown editor with browser preview, desktop files, recent documents, local history snapshots, and export.",
      },
      {
        question: "How do I open a .md file on Windows?",
        answer:
          "Right-click the .md file, choose Open with, and select VeloWrite. The desktop app opens local Markdown files directly in the editor.",
      },
      {
        question: "Who is VeloWrite for?",
        answer:
          "VeloWrite is for developers, technical writers, students, founders, and teams who write notes, documentation, specs, guides, blog drafts, or knowledge-base articles in Markdown.",
      },
    ],
  },
  {
    title: "Web Editor and Desktop App",
    items: [
      {
        question: "Can I try VeloWrite without installing anything?",
        answer: "Yes. Open the web editor and start writing.",
      },
      {
        question: "Can I edit Markdown online without uploading files?",
        answer:
          "Yes. Normal VeloWrite web editing and preview do not upload Markdown document content to VeloWrite servers. Browser drafts stay in localStorage on the same device.",
      },
      {
        question: "What happens if I refresh the browser while editing?",
        answer:
          "Your draft stays in localStorage in the same browser, so a refresh on the same device can bring it back.",
      },
      {
        question: "What is the difference between the web editor and desktop app?",
        answer: "Use the web editor for drafts, preview, Markdown download, and HTML export. Use the desktop app for local files, direct save, offline work, recent files, and history snapshots.",
      },
      {
        question: "Do I need an account to use it?",
        answer:
          "No. The current web editor works without an account, and browser drafts are saved locally in the same browser.",
      },
      {
        question: "Which platforms can I download right now?",
        answer: "VeloWrite has a web editor plus preview installers for Windows x64, macOS Apple Silicon, Linux AppImage, Debian, and RPM-based Linux distributions.",
      },
      {
        question: "Does VeloWrite work offline?",
        answer: "The desktop app is the offline option for real local files. Use the web editor for drafts, Markdown download, and HTML export.",
      },
      {
        question: "Will the desktop installer trigger a warning?",
        answer: "Yes. The current Windows preview installer is unsigned, so SmartScreen may warn. The macOS DMG is also treated as an unsigned preview build until Apple signing and notarization are ready.",
      },
    ],
  },
  {
    title: "Markdown Features",
    items: [
      {
        question: "Does VeloWrite handle math, tables, and code highlighting?",
        answer:
          "Yes. The preview supports Markdown tables, KaTeX math, highlighted code blocks, and tabs for multi-language examples.",
      },
      {
        question: "Can I download my work as Markdown or HTML?",
        answer:
          "Yes. The web editor can download Markdown files and export HTML. The desktop app also supports local files, HTML export, and PDF export in the current preview.",
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
          "VeloWrite keeps the normal editing path private. Browser drafts stay in localStorage, and desktop files plus local history snapshots stay on your device by default.",
      },
      {
        question: "Is VeloWrite free to use today?",
        answer:
          "The current public build is a free preview. Pro is planned for AI writing actions, advanced export, and deeper recovery.",
      },
      {
        question: "What will VeloWrite Pro include?",
        answer:
          "The planned early Pro price is $29/year, with a $99 lifetime option. Pro candidates include AI writing actions, advanced export, and deeper local recovery.",
      },
      {
        question: "Where do I send feedback if something feels off?",
        answer:
          "Use the feedback page to report rough edges, missing features, download problems, or anything that would make VeloWrite worth paying for.",
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
  faqByQuestion("How do I open a .md file on Windows?"),
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
    prompt: "I need to edit a Markdown file quickly.",
    answer: "Start with the web editor. You can preview Markdown and download .md or HTML without signing in.",
  },
  {
    prompt: "I care about keeping notes on my machine.",
    answer: "Use the desktop app for native open and save, offline work, recent files, and local history.",
  },
  {
    prompt: "What is not ready yet?",
    answer: "AI commands, private sync, publishing, account sharing, and signed installers are still planned.",
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

const legalPages = {
  privacy: {
    eyebrow: "Privacy and cookies",
    title: "Privacy Policy",
    intro: "How VeloWrite handles Markdown content, waitlist emails, analytics, and local storage in the current preview.",
    sections: [
      {
        title: "What VeloWrite is",
        body: [
          "VeloWrite has a browser Markdown editor for quick drafts and a downloadable desktop app for local-first file work.",
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
            Start in the browser
          </div>
          <h1>Write Markdown. Keep files.</h1>
          <p>
            Start in the browser to read, edit, preview, and export Markdown.
            Move to the desktop app when you need a real folder, offline work,
            or local history.
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
              Browser first
            </span>
            <span>
              <HardDrive size={15} />
              Local desktop files
            </span>
            <span>
              <PanelLeft size={15} />
              Split view
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
            <p>Open a draft, check the rendered result, and download the source when you are done.</p>
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
          <h2>See what stays local and what the preview can do.</h2>
        </div>
        <div className="trust-grid">
          <article>
            <ShieldCheck size={20} />
            <h3>Private by default</h3>
            <p>Browser drafts stay in local browser storage. Desktop files stay on your own disk unless you export or share them.</p>
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
              local files, and the line between the free preview and Pro.
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
            <FolderOpen size={21} />
            <h3>Open .md files on Windows</h3>
            <p>Get the direct steps for opening, viewing, and editing Markdown files on Windows 11.</p>
            <a className="text-link" href="/docs/open-md-files-on-windows?utm_source=homepage_resources&utm_medium=resource">
              Read Windows guide <ChevronRight size={15} />
            </a>
          </article>
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
            <h3>Roadmap</h3>
            <p>See recorded user requests, what stays free, and which features may become Pro later.</p>
            <a className="text-link" href="/roadmap?utm_source=homepage_resources&utm_medium=resource">
              View roadmap <ChevronRight size={15} />
            </a>
          </article>
        </div>
      </section>

      <section className="landing-waitlist" aria-label="Private beta signup">
          <div>
            <span>Follow the desktop beta</span>
          <h2>Get release and beta updates.</h2>
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
    copy: "Open a dense Markdown document in write mode and edit without losing your place.",
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
    copy: "Switch to preview mode to inspect equations, tables, Mermaid, and structured writing.",
    focus: "Full-screen rendered preview",
  },
  {
    title: "Export your work",
    label: "Take it with you",
    copy: "Download Markdown or export HTML from the online editor.",
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
  const demoMarkdown = useComplexDemoMarkdown(true);
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
              move local files to desktop when they matter.
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
            {demoMarkdown ? (
              <React.Suspense fallback={<EditorPreviewSkeleton compact />}>
                <EditorApp
                  key={activeMode}
                  surface="web"
                  initialMarkdown={demoMarkdown}
                  initialViewMode={activeMode}
                />
              </React.Suspense>
            ) : (
              <EditorPreviewSkeleton compact />
            )}
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
              Good for a first test: Markdown editing, live preview, import,
              and export from the browser.
            </p>
          </article>
          <article>
            <FolderOpen size={21} />
            <h2>Desktop preview</h2>
            <p>
              The better next step for real files, offline writing, recent
              documents, and local history snapshots.
            </p>
          </article>
          <article>
            <Sparkles size={21} />
            <h2>Future Pro</h2>
            <p>
              AI writing, private sync, and one-click publishing are the paid
              direction we want users to help shape.
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
      note: "Planned early price for the first paid users.",
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
      note: "Planned local-Pro license for people who prefer ownership.",
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
              Pro preview
            </div>
            <h1>Pro is for work the free editor should not carry.</h1>
            <p>
              The preview stays free for writing, preview, local files, and
              short history. Pro is reserved for AI commands, deeper recovery,
              and export work that needs more support.
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
              <p>Markdown editing, live preview, local files, browser drafts, and three desktop history snapshots.</p>
            </div>
            <div>
              <span>Pricing preview</span>
              <strong>$29/year</strong>
              <p>The early plan is expected to cost $29 per year, with a $99 lifetime option for local Pro features.</p>
            </div>
          </div>
        </section>

        <section className="pro-pricing" aria-label="Planned Pro pricing">
          <div className="section-heading">
            <span>Pricing preview</span>
            <h2>Simple pricing, with a cap on hosted AI use.</h2>
            <p>
              These prices are only a preview. Checkout is not open yet, and
              the hosted AI pool will be limited.
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
            Hosted AI uses fair-use credits. The lifetime plan is for local Pro
            features. Unlimited hosted AI is not planned.
          </p>
        </section>

        <section className="pro-grid" aria-label="Future Pro capabilities">
          <article>
            <WandSparkles size={22} />
            <h2>AI writing workflows</h2>
            <p>Turn notes into articles, make READMEs, polish technical sections, summarize meetings, or expand outlines.</p>
          </article>
          <article>
            <FileText size={22} />
            <h2>Advanced export</h2>
            <p>Improve PDF output, add DOCX export, and add templates for articles, READMEs, newsletters, and documentation.</p>
          </article>
          <article>
            <GitBranch size={22} />
            <h2>Advanced recovery</h2>
            <p>Keep history longer, name checkpoints, review diffs more easily, and restore safely after the free baseline is stable.</p>
          </article>
          <article>
            <LockKeyhole size={22} />
            <h2>Local-first by default</h2>
            <p>Keep basic files local while paid features add value without forcing every user into a hosted workspace.</p>
          </article>
          <article>
            <Rocket size={22} />
            <h2>Later workflow options</h2>
            <p>Private sync, one-click publishing, and team workflows can follow if the individual writing flow proves useful.</p>
          </article>
        </section>

        <section className="pro-compare" aria-label="Free preview and future Pro comparison">
          <div className="section-heading">
            <span>Clear boundaries</span>
            <h2>What works today and what may come later</h2>
          </div>
          <div className="pro-table">
            <div className="pro-row pro-row-head">
              <span>Capability</span>
              <span>Free preview today</span>
              <span>Future Pro direction</span>
            </div>
            {[
              ["Markdown writing", "Web and desktop editing", "More structured writing"],
              ["Local files", "Native desktop open/save", "Vault-style workflows and workspace polish"],
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
            <span>Help decide what belongs in Pro</span>
            <h2>Which paid feature would you actually use?</h2>
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
          <h1>What we plan to build next</h1>
          <p>
            VeloWrite is still in preview, so early feedback can change the order.
            This page shows what has shipped, what is being improved, and which
            local-file ideas still need research.
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
            <h2>Next, we are working on the parts that make everyday writing safer and easier.</h2>
            <p>
              The order is practical: make the free editor dependable first, then decide which
              paid features solve a problem users will pay to remove.
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

        <section className="roadmap-stages" aria-label="Roadmap by stage">
          <div className="section-heading">
            <span>Status map</span>
            <h2>See what is free now, what is being improved, and what may come later as Pro.</h2>
            <p>
              Each request has a status so you can tell whether it is free, being improved,
              still in design, or reserved for a later paid feature.
            </p>
          </div>
          <div className="roadmap-stage-grid">
            {roadmapStages.map((stage) => (
              <article key={stage.label}>
                <span>{stage.label}</span>
                <strong>{stage.items.length} items</strong>
                <p>{stage.description}</p>
                <ul>
                  {stage.items.slice(0, 4).map((item) => (
                    <li key={item.title}>{item.title}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="preview-acceptance" aria-label="Preview acceptance checklist">
          <div>
            <span>Preview quality bar</span>
            <h2>What needs to be reliable before Pro becomes the main focus.</h2>
            <p>
              The free preview should handle everyday Markdown reading, editing, recovery,
              and export without surprises. These checks come before larger paid features.
            </p>
          </div>
          <ul>
            {previewAcceptanceChecks.map((check) => (
              <li key={check}>
                <CheckCircle2 size={16} />
                <span>{check}</span>
              </li>
            ))}
          </ul>
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
            Download the current preview for Windows, macOS, and Linux. Open
            .md files, edit local folders, and keep recent work on your device.
          </p>
          <div className="download-release-summary" aria-label="Latest release information">
            <div>
              <span>Latest version</span>
              <strong>v{downloadVersion}</strong>
            </div>
            <div>
              <span>Released</span>
              <strong>{downloadReleaseDate}</strong>
            </div>
            <a href={releaseTagUrl} target="_blank" rel="noreferrer">
              View release <Github size={15} />
            </a>
          </div>
          <div className="download-highlights" aria-label="Latest improvements">
            <div className="download-highlights-copy">
              <span>Latest improvements</span>
              <p>
                Math formulas now render with full KaTeX styling, the editor can insert a reusable math template,
                and Document tools can warn about unmatched math delimiters before export.
              </p>
            </div>
            <a href="/changelog?utm_source=download_page&utm_medium=resource#v0213">
              See changelog details <ChevronRight size={15} />
            </a>
          </div>
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
              <p className="download-version-line">Version v{downloadVersion} · {downloadReleaseDate}</p>
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
            <h2>Included now</h2>
            <ul>
            <li>Online Markdown editing and preview with local browser draft autosave</li>
            <li>Desktop open and save, HTML export, dedicated PDF export, recent files, and local history snapshots</li>
              <li>Windows, macOS Apple Silicon, and Linux preview packages</li>
              <li>Privacy policy, cookie consent, and waitlist email handling</li>
            </ul>
          </article>
          <article>
            <h2>Still preview</h2>
            <ul>
              <li>No code signing yet for Windows, and future macOS preview DMGs will also require signing and notarization work</li>
              <li>No account system, cloud sync, encrypted sharing, or team workspace</li>
              <li>No active AI assistant or publishing automation in the public build</li>
              <li>Free preview keeps the latest 3 local history snapshots for recovery</li>
              <li>Important writing should still be backed up outside the app</li>
            </ul>
          </article>
          <article>
            <h2>Planned Pro path</h2>
            <ul>
              <li>AI writing commands, rewrite tools, and Mermaid generation</li>
              <li>Private sync and multi-device workflows</li>
              <li>One-click publishing to GitHub Pages or Vercel</li>
              <li>DOCX export, themes, custom styling, and commercial licensing</li>
            </ul>
          </article>
        </section>

        <section className="platform-checks" aria-label="Platform preview checks">
          <div className="section-heading">
            <span>Preview regression checks</span>
            <h2>What we check before publishing a desktop preview.</h2>
            <p>
              These checks focus on the free preview: install, open local Markdown,
              save safely, close normally, reopen recent work, and recover from local
              history. Signing and notarization remain separate release trust work.
            </p>
          </div>
          <div className="platform-check-grid">
            {platformRegressionChecks.map((group) => (
              <article key={group.platform}>
                <h3>{group.platform}</h3>
                <ul>
                  {group.checks.map((check) => (
                    <li key={check}>
                      <CheckCircle2 size={15} />
                      <span>{check}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="download-notes" aria-label="Install safety notes">
          <h2>Before you install</h2>
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
            <li>Includes practical paths for opening, viewing, and editing .md files on Windows.</li>
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

function ContentPage({ page }: { page: string }) {
  const [content, setContent] = React.useState<ContentPageData | null>(null);
  const [loadFailed, setLoadFailed] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    setContent(null);
    setLoadFailed(false);

    import("./contentPages")
      .then(({ contentPages }) => {
        if (!active) return;
        const nextContent = contentPages[page];
        if (nextContent) {
          setContent(nextContent);
        } else {
          setLoadFailed(true);
        }
      })
      .catch(() => {
        if (active) setLoadFailed(true);
      });

    return () => {
      active = false;
    };
  }, [page]);

  if (!content && loadFailed) {
    return <NotFoundPage />;
  }

  if (!content) {
    return (
      <div className="content-page">
        <header className="landing-nav">
          <a className="wordmark" href="/">
            <span className="brand-mark">V</span>
            VeloWrite
          </a>
        </header>
        <main className="content-shell">
          <div className="content-loading">Loading article</div>
        </main>
      </div>
    );
  }

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
        <h1>Markdown articles for VeloWrite users.</h1>
        <p className="legal-updated">Last updated: August 30, 2026</p>
        <p className="legal-intro">
          Start with the basics, then move into history, code blocks, math, local files,
          and platform-specific notes. Published articles are live. Planned titles are
          queued for later.
        </p>

        <section className="roadmap-summary" aria-label="How to use the library">
          <article>
            <span>Start here</span>
            <strong>Basics first</strong>
            <p>Read Markdown basics, history, and the online editor guide before the longer workflow articles.</p>
          </article>
          <article>
            <span>Write better</span>
            <strong>Daily use</strong>
            <p>Move to writers, developers, code blocks, math, shortcuts, and meeting notes when you want practical examples.</p>
          </article>
          <article>
            <span>Choose by need</span>
            <strong>Platform pages</strong>
            <p>Use the Windows, Mac, Linux, and local-file articles when you are deciding whether to install the desktop app.</p>
          </article>
        </section>

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
            Quick answers on what VeloWrite does, what the preview includes, and
            when the desktop app is the better fit.
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
        <span>Write in the browser, then keep the Markdown file local.</span>
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

export function PublicPageRouter() {
  const searchParams = new URLSearchParams(window.location.search);
  const demoFrame = searchParams.get("utm_source") === "demo_frame";
  const isTauriRoot = isTauriRuntime() && (window.location.pathname === "/" || window.location.pathname === "");
  const [docsExampleMarkdown] = React.useState(() =>
    searchParams.get("example") === "docs"
      ? window.sessionStorage.getItem(exampleMarkdownKey)
      : null,
  );
  const demoMarkdown = useComplexDemoMarkdown(demoFrame && !docsExampleMarkdown);
  React.useEffect(() => {
    if (docsExampleMarkdown) {
      window.sessionStorage.removeItem(exampleMarkdownKey);
    }
  }, [docsExampleMarkdown]);
  const normalizedPath = normalizePath(window.location.pathname);
  const docPage = docPageRoutes[normalizedPath as keyof typeof docPageRoutes];
  let page: React.ReactNode;

  if (isTauriRoot) {
    page = (
      <React.Suspense fallback={<div className="loading-screen">Loading editor</div>}>
        <EditorApp surface="desktop" initialViewMode="write" />
      </React.Suspense>
    );
  } else if (matchesRoute(window.location.pathname, "/web")) {
    page =
      demoFrame && !docsExampleMarkdown && !demoMarkdown ? (
        <div className="loading-screen">Loading web editor</div>
      ) : (
        <React.Suspense fallback={<div className="loading-screen">Loading web editor</div>}>
          <EditorApp
            surface="web"
            initialMarkdown={docsExampleMarkdown ?? demoMarkdown}
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

  return page;
}
