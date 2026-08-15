import type { ContentPage } from "./contentTypes";

export const contentPages: Record<string, ContentPage> = {
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
          "The easiest way to learn Markdown is to write a real document instead of reading syntax charts for an hour. Start with a title, a few headings, and one short list. Then preview the document and adjust the structure.",
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
      "Markdown began in 2004 as a readable plain-text format for web writing. John Gruber wrote the first converter in Perl, Aaron Swartz helped shape the syntax, and later CommonMark tried to reduce the ambiguity that accumulated across implementations.",
    updated: "July 31, 2026",
    directory: [
      { label: "Timeline", href: "#timeline" },
      { label: "2004 and the first release", href: "#2004-and-the-first-release" },
      { label: "Aaron Swartz and early feedback", href: "#aaron-swartz-and-early-feedback" },
      { label: "Why it spread", href: "#why-it-spread" },
      { label: "Why variants and CommonMark", href: "#why-variants-and-commonmark" },
      { label: "What stayed useful", href: "#what-stayed-useful" },
      { label: "Modern editor lessons", href: "#modern-editor-lessons" },
    ],
    sections: [
      {
        id: "timeline",
        title: "Timeline",
        body: [
          "2004: John Gruber introduces Markdown as a text-to-HTML tool for readable plain-text writing.",
          "December 17, 2004: Markdown 1.0.1 is published as the early public release.",
          "Later: Aaron Swartz's feedback helps shape the syntax, and CommonMark appears to reduce ambiguity across implementations.",
        ],
      },
      {
        id: "2004-and-the-first-release",
        title: "2004 and the first release",
        body: [
          "Markdown was introduced in 2004 by John Gruber as a text-to-HTML tool for web writers. The first public release, Markdown 1.0.1, was published on December 17, 2004.",
          "Its core idea was simple: keep the source readable as plain text, then convert that source into HTML when needed. A heading still looks like a heading, a list still looks like a list, and a link is still understandable before it is rendered.",
        ],
        example: {
          label: "Plain text that still has structure",
          markdown:
            "# Release Notes\n\n## Fixed\n\n- Faster preview rendering\n- Clearer history restore state\n\n[Download the preview](https://velowrite.app/download)",
          note: "The source is readable in any text editor, while the preview becomes a structured page.",
        },
      },
      {
        id: "aaron-swartz-and-early-feedback",
        title: "Aaron Swartz and early feedback",
        body: [
          "Aaron Swartz gave Markdown a lot of the feedback and testing that helped the syntax settle into something practical. Gruber credits Aaron directly in the original Markdown page acknowledgements.",
          "That matters historically because Markdown was never just a solo syntax design. It was shaped early by real use, discussion, and iteration around how people naturally write in plain text.",
        ],
      },
      {
        id: "why-it-spread",
        title: "Why Markdown spread",
        body: [
          "Markdown spread because it did not ask people to change their whole setup. It worked in simple text editors, email drafts, issue trackers, code comments, Git repositories, documentation generators, and static-site tools.",
          "That portability matters. A Markdown file can live in a folder, move through Git, become a blog post, or sit inside a project repository without needing a proprietary database.",
        ],
      },
      {
        id: "why-variants-and-commonmark",
        title: "Why variants and CommonMark appeared",
        body: [
          "Markdown was intentionally small, so many platforms and tools extended it for their own needs. Over time, syntax drift made the same document render differently across implementations.",
          "CommonMark was later created to give Markdown a stronger, testable specification. In practice, that meant trying to reduce ambiguity that had built up around the original syntax and its buggy first implementation.",
        ],
      },
      {
        id: "what-stayed-useful",
        title: "What stayed useful after all these years",
        body: [
          "The most durable Markdown idea is not a specific symbol. It is the belief that source text should remain understandable without the editor. That is why Markdown still feels trustworthy for notes, specs, drafts, and long-lived documentation.",
          "Another durable idea is separation of writing from presentation. You can draft in a clean plain-text structure, then export to HTML, print to PDF, publish to a site, or apply a style later.",
        ],
      },
      {
        id: "modern-editor-lessons",
        title: "What this history means for modern editors",
        body: [
          "A good Markdown editor should not make the file feel trapped. It should make writing faster while preserving plain text ownership. Preview, history recovery, export, and navigation should support the file instead of replacing it.",
          "VeloWrite follows that direction: quick browser editing for first contact, a lightweight desktop path for serious local files, and a roadmap that adds AI, export, and publishing only after the editing foundation feels dependable.",
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
      "Markdown will stay useful because the files are portable. The editor around it is changing: better local files, safer recovery, AI that works inside the document, and clearer rules about what stays on the user's device.",
    updated: "August 1, 2026",
    directory: [
      { label: "Local files", href: "#local-files" },
      { label: "Recovery", href: "#recovery" },
      { label: "AI inside writing", href: "#ai-inside-writing" },
      { label: "Export readiness", href: "#export-readiness" },
      { label: "Publishing", href: "#publishing" },
      { label: "What should not change", href: "#what-should-not-change" },
    ],
    sections: [
      {
        id: "local-files",
        title: "Local files remain the source of truth",
        body: [
          "People trust Markdown because the file is inspectable. You can open it in another editor, store it in Git, copy it to a folder, or keep it in a private vault. Future editors should preserve that trust instead of forcing every note through an account system.",
          "For VeloWrite, that means desktop local files, recent documents, and local history stay part of the free editor.",
        ],
        example: {
          label: "A source file you can reopen",
          markdown:
            "# Project Brief\n\n## Source of truth\n\nKeep the Markdown file in the project folder.\n\n## Why it matters\n\n- It can be backed up\n- It can be opened by another editor\n- It can become HTML, PDF, or a docs page later",
          note: "The source file should remain useful even if the publishing target changes.",
        },
      },
      {
        id: "recovery",
        title: "Recovery becomes part of the writing surface",
        body: [
          "The future of Markdown editing is not only about faster rendering. It is also about helping users trust long edits. A local history panel, clear restore preview, and visible snapshot limits make the editor feel safer without forcing every document into a cloud account.",
          "This is why VeloWrite keeps basic local history in the free preview foundation. Recovery is part of document safety, not a luxury feature that should be hidden until the user pays.",
        ],
      },
      {
        id: "ai-inside-writing",
        title: "AI should work inside the document flow",
        body: [
          "AI is useful when it can polish a paragraph, summarize a section, continue a draft, explain code, or generate Mermaid diagrams from context. It is less useful when it feels like a separate chat window pasted onto the side.",
          "That is why AI commands are on the VeloWrite Pro roadmap only after the basic editor feels trustworthy.",
        ],
        example: {
          label: "Task-based AI prompt shape",
          markdown:
            "## Draft task\n\nTurn these meeting notes into a short update for the team.\n\n### Source notes\n\n- Decision made\n- Risk still open\n- Follow-up owner assigned\n\n### Output style\n\nConcise, factual, and ready to paste into a project channel.",
          note: "AI is most useful when the document already contains the task, source, and target style.",
        },
      },
      {
        id: "export-readiness",
        title: "Editors will explain whether a draft is ready to export",
        body: [
          "Many writers do not need a complex publishing system on day one. They need to know whether the current draft has a title, enough structure, working links, readable code blocks, and the right output path.",
          "VeloWrite now treats export preparation as part of the free foundation: Markdown download, HTML export, dedicated PDF export, and an export readiness panel that makes basic document shape visible before the user shares the file.",
        ],
        example: {
          label: "Export readiness checklist",
          markdown:
            "## Before sharing\n\n- [ ] The document has one clear H1 title\n- [ ] The sections match the reader's path\n- [ ] Links and images have context\n- [ ] Code blocks have language labels\n- [ ] The chosen export format matches the next step",
          note: "The goal is not to block export. The goal is to make the document state visible before sharing.",
        },
      },
      {
        id: "publishing",
        title: "Publishing should become a natural last step",
        body: [
          "Many Markdown documents eventually become blog posts, docs pages, release notes, or knowledge-base articles. The future editor should help export and publish without making the writing surface heavier.",
          "VeloWrite keeps this as later work: write and preview first, then add publishing once the editor is stable.",
        ],
      },
      {
        id: "what-should-not-change",
        title: "What should not change",
        body: [
          "Markdown should not lose the boring advantages that made it durable: readable source, predictable structure, and the ability to move files between tools. New AI, sync, and publishing features should support that foundation instead of replacing it.",
          "A good future Markdown editor should feel modern without making the user's notes feel captured. That is the line VeloWrite should keep.",
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
      "Developers use Markdown because it works with code, Git, issue trackers, docs systems, and release notes. A good Markdown file keeps technical notes close to the commands, examples, and decisions they explain.",
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
          "Every document does not need to be formal. It just needs to be easy to start, review, and maintain.",
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
          "This is why VeloWrite keeps basic local recovery in the free preview. Draft safety belongs in the editor, not only in a paid tier.",
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
      "Advanced Markdown is not about obscure syntax. It is about files that stay readable in review, survive a move between tools, and still make sense six months later.",
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
          "That changes the question you ask before adding syntax: does this make the source clearer, or only make this one preview look clever? For documents that will live beyond one draft, prefer the source.",
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
      "Math support makes Markdown useful for study notes, engineering docs, product analysis, and research drafts. VeloWrite renders math with KaTeX in the preview, so formulas can stay beside the plain text that explains them.",
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
      "Typora helped make focused Markdown editing feel mainstream. VeloWrite starts from a different place: browser trial first, lightweight Tauri desktop builds, local files, visible recovery, and a public AI roadmap.",
    updated: "July 31, 2026",
    directory: [
      { label: "Who this is for", href: "#who-this-is-for" },
      { label: "Different path", href: "#different-path" },
      { label: "Useful today", href: "#useful-today" },
      { label: "Where it is early", href: "#where-it-is-early" },
      { label: "Decision guide", href: "#decision-guide" },
      { label: "Try the workflow", href: "#try-the-workflow" },
    ],
    sections: [
      {
        id: "who-this-is-for",
        title: "Who should consider a Typora alternative",
        body: [
          "You may not need a different Markdown editor if your current setup is stable and already fits your workflow. A useful alternative should earn attention by solving a specific problem, not by claiming every mature editor is wrong.",
          "VeloWrite is most relevant if you want a quick browser trial before installing anything, a lightweight Tauri desktop app, local files, basic recovery history, and a roadmap that says what is ready and what is not.",
        ],
      },
      {
        id: "different-path",
        title: "What VeloWrite is trying to improve",
        body: [
          "The goal is not to copy every mature Typora feature immediately. The early goal is a fast preview editor with a clear path: try it online, download desktop when local files matter, and check the public roadmap before expecting Pro features.",
          "That gives new users a low-risk first step. Paste Markdown into the web editor, check rendering, export or download a file, then decide whether the desktop app belongs in your daily setup.",
        ],
        example: {
          label: "Evaluate an editor with a real note",
          markdown:
            "# Editor Trial Note\n\n## What matters\n\n- Opens quickly\n- Keeps Markdown readable\n- Shows preview clearly\n- Saves a local copy\n- Makes recovery understandable\n\n## Decision\n\nUse the editor only if the file still feels like yours.",
          note: "A practical comparison starts with a document you would actually keep, not only a feature list.",
        },
      },
      {
        id: "useful-today",
        title: "Where VeloWrite is already useful",
        body: [
          "The current preview supports browser editing, live preview, Markdown download, HTML export, desktop open and save, recent files, local history snapshots, math rendering, code highlighting, and tabbed examples.",
          "For quick notes, README drafts, technical snippets, study notes, and article outlines, that is enough to test the core flow. The desktop app is the better path when the draft becomes a real file you plan to reopen.",
        ],
      },
      {
        id: "where-it-is-early",
        title: "Where Typora is still ahead",
        body: [
          "VeloWrite is still preview software. Continuous sync scrolling, richer image handling, Mermaid, advanced PDF export, signed installers, and deeper polish are still on the roadmap.",
          "That transparency matters: users should know what is ready before depending on a new editor.",
        ],
      },
      {
        id: "decision-guide",
        title: "A practical decision guide",
        body: [
          "Choose the editor that gets out of the way for the documents you actually write. If you need a mature paid desktop editor today, keep using the tool that already works. If you want to follow a lighter local-file Markdown editor while it is being built in public, VeloWrite is worth testing.",
          "For teams and creators, the question is not only price. It is whether the editor keeps source files portable, makes recovery visible, and exports predictably without turning every note into a cloud account.",
        ],
        example: {
          label: "Comparison checklist",
          markdown:
            "| Question | Why it matters |\n| --- | --- |\n| Can I try it without installing? | Low-friction evaluation |\n| Can I keep a real .md file? | File ownership |\n| Can I recover a bad edit? | Writing safety |\n| Can I export when finished? | Sharing workflow |\n| Is the roadmap public? | Preview trust |",
          note: "A clear checklist helps users compare workflows without pretending one editor fits everyone.",
        },
      },
      {
        id: "try-the-workflow",
        title: "Try the workflow before switching",
        body: [
          "Start with the web editor. Paste a real Markdown draft, switch between Write, Split, and Preview, then export HTML or download the Markdown copy. If the draft becomes important, move it to the desktop app for local files and history.",
          "This keeps the decision reversible. You can evaluate the writing surface without moving your whole note system on day one.",
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
        title: "Draft for readers before search engines",
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
          "Export PDF when someone needs a readable review copy, a handout, or an attachment. VeloWrite generates a dedicated PDF document instead of printing the editor interface.",
        ],
        example: {
          label: "Output decision",
          markdown:
            "| Need | Best next step |\n| --- | --- |\n| Keep editing later | Download Markdown |\n| Move into a CMS or static site | Export HTML |\n| Send a review copy | Export PDF |\n| Publish automatically | Keep the source and wait for a later publishing workflow |",
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
      "Windows users can try VeloWrite in the browser first, then install the desktop preview for native local files, recent documents, local history, offline writing, and Open with workflows.",
    updated: "July 31, 2026",
    directory: [
      { label: "Quick test", href: "#quick-test" },
      { label: "Desktop files", href: "#desktop-files" },
      { label: "Open with", href: "#open-with" },
      { label: "If it does not appear", href: "#missing-open-with" },
      { label: "Old app cleanup", href: "#old-app-cleanup" },
      { label: "Installer status", href: "#installer-status" },
    ],
    sections: [
      {
        id: "quick-test",
        title: "Use the web editor for a quick test",
        body: [
          "If you only need to paste Markdown, preview it, and download a copy, the browser editor is the fastest starting point. No account is required.",
          "This is useful before installing anything on a work machine. You can confirm the preview style, code blocks, math rendering, and export flow first.",
        ],
      },
      {
        id: "desktop-files",
        title: "Use desktop for real files",
        body: [
          "The Windows preview adds native open and save, recent files, HTML export, and local history snapshots. It is better for documents you plan to keep editing.",
          "Once installed, the app can receive Markdown files from the operating system. Opening a .md file with VeloWrite should load the file directly into the editor instead of showing the marketing website.",
        ],
        example: {
          label: "A local Windows note",
          markdown:
            "# Windows Test Note\n\n## Verify\n\n- Open this file with VeloWrite\n- Edit a line\n- Save the file\n- Reopen it from the recent list\n\n## Expected result\n\nThe file path is visible and the editor shows local history status.",
          note: "Use a small test file first so you can verify open, save, recent files, and history without risking important notes.",
        },
      },
      {
        id: "open-with",
        title: "How Open with should work",
        body: [
          "The preview installer declares Markdown file associations for .md, .markdown, and .mdown files. Windows may still require you to choose VeloWrite once from the Open with menu before it appears as a familiar option.",
          "A normal test is simple: right-click a Markdown file, choose Open with, select VeloWrite, and confirm the document opens in the editor. If the app is already running, the existing window should focus and open the selected file.",
        ],
      },
      {
        id: "missing-open-with",
        title: "If VeloWrite does not appear in Open with",
        body: [
          "First confirm that the current VeloWrite preview is installed. Windows can hide newly installed apps from the short Open with list, so choose More apps or Choose another app, then browse for VeloWrite if needed.",
          "If the file association still looks wrong, reinstall the current preview build and test with a new .md file. Corporate Windows policies can also restrict default-app changes, so a work computer may behave differently from a personal machine.",
        ],
        example: {
          label: "Open with checklist",
          markdown:
            "## Windows Open with check\n\n1. Install the current VeloWrite preview\n2. Create `open-with-test.md`\n3. Right-click the file\n4. Choose Open with -> VeloWrite\n5. Confirm the editor opens the file path\n6. Save and reopen from Recent",
          note: "This checklist separates app behavior from Windows default-app registration.",
        },
      },
      {
        id: "old-app-cleanup",
        title: "Remove old app remnants if you tested earlier builds",
        body: [
          "Early testers may still see old VeloMD shortcuts or app names if an older preview was installed before the rename. Those entries are separate from the current VeloWrite installer and can confuse Open with testing.",
          "Uninstall older preview builds from Windows Apps, remove stale desktop shortcuts, then install the current VeloWrite release again. After that, retest Open with using a fresh Markdown file.",
        ],
      },
      {
        id: "installer-status",
        title: "Installer status",
        body: [
          "The current Windows installer is unsigned, so SmartScreen may warn during install. That is expected for the preview stage and will be revisited before broader stable promotion.",
          "Unsigned status does not mean the file association is disabled. It only means Windows may ask for extra confirmation before install or first launch.",
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
      "Mac users often want a Markdown editor that feels quiet, fast, and local. This guide explains how to evaluate VeloWrite on macOS while the desktop build is still a preview.",
    updated: "August 7, 2026",
    directory: [
      { label: "Browser first", href: "#browser-first" },
      { label: "DMG status", href: "#dmg-status" },
      { label: "Local workflow", href: "#local-workflow" },
      { label: "What to test", href: "#what-to-test" },
      { label: "Update checks", href: "#update-checks" },
      { label: "Preview limits", href: "#preview-limits" },
    ],
    sections: [
      {
        id: "browser-first",
        title: "Start in the browser before installing",
        body: [
          "The web editor is the quickest way to decide whether VeloWrite fits your writing style. Paste Markdown, switch between Write, Split, and Preview, then download a Markdown or HTML copy without creating an account.",
          "This browser-first path is useful on a shared or locked-down Mac because it avoids installation friction. Once a draft becomes something you want to keep editing, the desktop app is the better place for local files and offline work.",
        ],
        example: {
          label: "A quick Mac test note",
          markdown:
            "# Mac Writing Check\n\n## What I want to verify\n\n- The editor opens quickly\n- Split preview keeps up while I scroll\n- Code blocks and tables stay readable\n- Export gives me a clean file\n\n## Next step\n\nIf this draft matters, move it to the desktop app and save it as a local `.md` file.",
          note: "Use a short document first, then test a longer file with headings, tables, and code.",
        },
      },
      {
        id: "dmg-status",
        title: "Understand the current DMG status",
        body: [
          "The Apple Silicon DMG is published only after a successful GitHub Actions build and after the release asset exists. The download page should not show a placeholder asset that users cannot actually install.",
          "The current macOS preview is unsigned and not notarized. Gatekeeper may require an explicit open action during early testing. That is a release-trust limitation, not a Markdown editing limitation.",
        ],
      },
      {
        id: "local-workflow",
        title: "Use desktop when the Markdown file matters",
        body: [
          "The desktop app is designed for native open and save, recent files, offline work, and local history snapshots. Those features matter more on real documents than on quick browser drafts.",
          "A good Mac Markdown workflow should make the file path clear, keep the source text portable, and avoid hiding your notes inside an account-only database. VeloWrite keeps that local-first direction visible in the current preview.",
        ],
        example: {
          label: "Local-first file habit",
          markdown:
            "# Project Notes\n\n## Local file\n\nSave this document as `project-notes.md` inside a folder that is backed up by your normal system.\n\n## Recovery habit\n\nBefore major edits, save once so the previous version becomes available in local history.",
          note: "The goal is not to replace your backup system. It is to make everyday editing less fragile.",
        },
      },
      {
        id: "what-to-test",
        title: "What Mac testers should check first",
        body: [
          "Start with the practical path: open a Markdown file, edit a paragraph, save it, reopen it from Recent, export HTML, export PDF, and verify local history after a second save.",
          "Also test long reading sessions. Switch the reading palette and preview font in Settings, then use Preview mode on a longer document. A Markdown editor should stay comfortable after the first five minutes, not only look good in a screenshot.",
        ],
      },
      {
        id: "update-checks",
        title: "Version visibility matters on desktop",
        body: [
          "A desktop preview should tell users what version they are running and whether a newer release exists. VeloWrite shows the installed version in About, and the download page lists the latest public installer version with its release date.",
          "Automatic update installation will require a signed update channel before it becomes a fully trusted stable workflow. Until then, the safer preview path is visible update detection plus a clear link back to the official download page.",
        ],
      },
      {
        id: "preview-limits",
        title: "Preview limits to keep in mind",
        body: [
          "Treat the current DMG as an early preview. Back up important Markdown files, expect extra Gatekeeper friction, and report any file handling, export, or layout issue through the feedback form.",
          "The priority is to make the free preview dependable for reading, editing, export, and recovery before paid Pro workflows become the main focus.",
        ],
      },
    ],
    cta: {
      primary: { href: "/download?utm_source=mac_article_cta&utm_medium=cta", label: "Download Mac Preview" },
      secondary: { href: "/web?utm_source=mac_article_cta&utm_medium=resource", label: "Try Web Editor" },
    },
  },
  markdownEditorForLinux: {
    eyebrow: "Platform guide",
    title: "Markdown Editor for Linux",
    intro:
      "Linux users are a natural fit for a lightweight Markdown editor because they often value portable files, local-first workflows, predictable packages, and low-overhead desktop software.",
    updated: "August 3, 2026",
    directory: [
      { label: "Package choices", href: "#package-choices" },
      { label: "Local files", href: "#local-files" },
      { label: "Preview workflow", href: "#preview-workflow" },
      { label: "Export checks", href: "#export-checks" },
      { label: "When desktop wins", href: "#when-desktop-wins" },
    ],
    sections: [
      {
        id: "package-choices",
        title: "Choose the package that fits your system",
        body: [
          "VeloWrite publishes Linux preview builds as AppImage, DEB, and RPM assets. AppImage is portable, DEB fits Debian and Ubuntu families, and RPM fits Fedora, RHEL, and similar distributions.",
          "The practical choice is usually simple: use DEB or RPM when you want normal package-manager behavior, and use AppImage when you want to test the app without installing it system-wide.",
        ],
        example: {
          label: "Package decision note",
          markdown:
            "| Package | Best fit |\n| --- | --- |\n| AppImage | Portable testing |\n| DEB | Debian and Ubuntu families |\n| RPM | Fedora, RHEL, and similar systems |",
          note: "Keep package notes close to the project README so future testers know which file to download.",
        },
      },
      {
        id: "local-files",
        title: "Keep Markdown files in normal folders",
        body: [
          "A good Linux Markdown workflow should not fight the file system. Keep project notes beside code, keep drafts in a writing folder, or keep documentation inside the repository where it belongs.",
          "This keeps backups, Git, search tools, and shell scripts useful. The editor should add comfort, preview, export, and recovery without taking ownership away from the user.",
        ],
      },
      {
        id: "preview-workflow",
        title: "Why Tauri matters on Linux",
        body: [
          "A Tauri desktop app can keep the package smaller than many Electron-style tools while still offering a modern interface. The goal is a fast Markdown surface without a heavy runtime feel.",
          "For a writing tool, that matters because the app may stay open beside a terminal, browser, source tree, or PDF viewer for hours. Lower overhead changes whether the tool feels welcome in a daily workspace.",
        ],
      },
      {
        id: "export-checks",
        title: "Check export before the document matters",
        body: [
          "Before a Markdown file becomes important, test the export path with the kinds of content you actually write: numbered lists, tables, code blocks, links, and long headings.",
          "VeloWrite's dedicated PDF export is designed to avoid browser print headers. The current preview also keeps wide tables readable and preserves explicit ordered-list numbering.",
        ],
        example: {
          label: "Export sanity check",
          markdown:
            "# Export Check\n\n1. First numbered item.\n\n2. Second numbered item.\n\n| Area | Check |\n| --- | --- |\n| PDF | No browser headers |\n| Table | Borders stay visible |\n\n```bash\n./VeloWrite_0.2.6_amd64.AppImage\n```",
          note: "A small export test catches layout problems before the real document is due.",
        },
      },
      {
        id: "when-desktop-wins",
        title: "When the desktop app is better than the browser",
        body: [
          "The web editor is still the quickest way to try VeloWrite. The desktop app becomes the better choice when the document should live as a real local file, reopen later, work offline, or keep local history snapshots.",
          "That split is intentional. Use the browser for low-friction evaluation, then move serious Markdown files into a local-first desktop workflow.",
        ],
      },
    ],
    cta: {
      primary: { href: "/download?utm_source=linux_article_cta&utm_medium=cta", label: "Download Linux" },
      secondary: { href: "/docs/local-first-markdown?utm_source=linux_article_cta&utm_medium=resource", label: "Local-First Workflow" },
    },
  },
  previewReleasePolicy: {
    eyebrow: "Release trust",
    title: "How VeloWrite Preview Releases Work",
    intro:
      "VeloWrite is still in preview, so it is important to separate code changes, local builds, GitHub Releases, installer assets, and the download page. This guide explains what users can trust when deciding whether to download or update.",
    updated: "August 7, 2026",
    directory: [
      { label: "What counts", href: "#what-counts-as-a-release" },
      { label: "Why commits differ", href: "#why-commits-and-downloads-can-differ" },
      { label: "Version checks", href: "#how-to-check-your-version" },
      { label: "Release dates", href: "#what-the-download-date-means" },
      { label: "Known fixes", href: "#when-a-fix-is-in-code-but-not-in-the-installer" },
      { label: "User checklist", href: "#download-checklist" },
    ],
    sections: [
      {
        id: "what-counts-as-a-release",
        title: "What counts as a VeloWrite preview release?",
        body: [
          "A VeloWrite preview release means a versioned GitHub Release exists and its installer assets are attached for the supported platforms. A commit on the main branch is not enough. A successful local build is not enough. A GitHub Actions artifact is also not enough unless it is uploaded to the release that the download page links to.",
          "For users, the practical rule is simple: the version on the download page should match the latest GitHub Release tag, and the installer file name should use that same version number.",
        ],
      },
      {
        id: "why-commits-and-downloads-can-differ",
        title: "Why can today's commits differ from the downloadable app?",
        body: [
          "During preview development, the website, web editor, documentation, and desktop app can move at different speeds. A documentation fix can go live on the website quickly, while a desktop installer needs a new version, platform builds, release assets, and download links before users can install it.",
          "That distinction matters for bug fixes. For example, a PDF export fix may be present in source code after a commit, but Windows, macOS, and Linux users will not receive it until a new installer release is published.",
        ],
      },
      {
        id: "how-to-check-your-version",
        title: "How do I check whether I have the newest app?",
        body: [
          "Open VeloWrite Desktop and check the About panel for the installed version. Then compare it with the version shown on the download page and the latest GitHub Release. If all three agree, you are on the current public preview build.",
          "If the website mentions a fix but your installed app still behaves like the older version, check the changelog date and the release tag. The fix may be documented as shipped in source code but not yet packaged into a new installer.",
        ],
      },
      {
        id: "what-the-download-date-means",
        title: "What does the download page release date mean?",
        body: [
          "The download page release date should describe the public installer assets, not every website edit. If the site receives a wording change today but the installer files were uploaded earlier, the download date should remain tied to the release assets users actually download.",
          "The changelog has a separate Last updated field because release notes can be clarified after the installer was published. That page update date should be honest about documentation changes, while the download card should be honest about installer age.",
        ],
      },
      {
        id: "when-a-fix-is-in-code-but-not-in-the-installer",
        title: "What if a fix is in code but not in the installer yet?",
        body: [
          "This can happen in a preview product. The honest answer is to say where the fix currently lives: main branch, local build, GitHub Actions artifact, or public release. Only the last one is a normal user download.",
          "When the fix affects a user-visible desktop bug, VeloWrite should usually create the next patch release instead of leaving users to guess. That is especially true for export bugs, data safety bugs, save problems, close behavior, update visibility, and platform installer issues.",
        ],
      },
      {
        id: "download-checklist",
        title: "A quick checklist before downloading",
        body: [
          "Check the download page version, open the linked GitHub Release, and confirm the installer file name matches your platform. On Windows, expect SmartScreen warnings until code signing is ready. On macOS, expect Gatekeeper friction until signing and notarization are ready.",
          "If you are testing an important fix, read the latest changelog entry before downloading. If the changelog says a fix is planned or present only in source, wait for the next installer release or use the web editor where the fix is already deployed.",
        ],
      },
    ],
    cta: {
      primary: { href: "/download?utm_source=release_policy_cta&utm_medium=cta", label: "Check Downloads" },
      secondary: { href: "/changelog?utm_source=release_policy_cta&utm_medium=resource", label: "Read Changelog" },
    },
  },
  pdfExportNotes: {
    eyebrow: "Release trust",
    title: "PDF Export Notes for Markdown Documents",
    intro:
      "PDF export matters when a draft needs to leave the editor. This page explains what VeloWrite exports today, what to check before sending a file, and which parts are still preview behavior.",
    updated: "August 12, 2026",
    directory: [
      { label: "Use cases", href: "#use-cases" },
      { label: "Current export", href: "#current-export" },
      { label: "Tables", href: "#tables" },
      { label: "Chinese text", href: "#chinese-text" },
      { label: "Settings", href: "#settings" },
      { label: "Preview limits", href: "#preview-limits" },
      { label: "Checklist", href: "#checklist" },
    ],
    sections: [
      {
        id: "use-cases",
        title: "What PDF export is for",
        body: [
          "Markdown works well while a document is still changing. PDF works better when the document needs to be shared, reviewed, archived, or printed with a stable layout.",
          "The export should keep the document structure intact. Headings, contents, tables, code, page numbers, and mixed-language text all need to survive the move from Markdown source to PDF.",
        ],
      },
      {
        id: "current-export",
        title: "What VeloWrite exports today",
        body: [
          "The desktop preview uses a dedicated PDF export path instead of a raw browser print dialog. It avoids browser headers, local URLs, and page chrome that should not appear in a document.",
          "VeloWrite can add a cover page, generate a contents page from headings, keep page numbers visible, and remember the PDF choices you used last time.",
        ],
        example: {
          label: "Export review source",
          markdown:
            "# Export Review\n\n## Before sharing\n\n- Check the title\n- Check tables\n- Check numbered lists\n- Check Chinese or mixed-language paragraphs\n\n| Area | What to verify |\n| --- | --- |\n| Cover | Title and document summary look right |\n| Contents | Major sections appear |\n| Tables | Borders and header rows remain readable |\n| Text | Chinese and English text render correctly |",
          note: "Use a small review block like this when testing a new export style.",
        },
      },
      {
        id: "tables",
        title: "Tables need clearer rules than normal preview",
        body: [
          "Tables reveal PDF problems quickly. A table may look fine in a resizable preview pane, then become cramped, lose contrast, or wrap awkwardly on a fixed PDF page.",
          "VeloWrite includes table styling choices for PDF export, including header treatment and alternating row style. The default keeps borders and headers visible. You can adjust the table style in Settings.",
        ],
        example: {
          label: "Table export check",
          markdown:
            "| Document area | PDF risk | What to check |\n| --- | --- | --- |\n| Long headings | Unexpected wrapping | Scan the contents page |\n| Wide tables | Missing right edge | Check page width and margins |\n| Dense rows | Low readability | Try alternating row color |\n| Code blocks | Horizontal overflow | Keep examples short when possible |",
          note: "Tables should be tested with real content, not only short placeholder cells.",
        },
      },
      {
        id: "chinese-text",
        title: "Chinese and mixed-language text must be checked explicitly",
        body: [
          "Chinese, Japanese, Korean, and mixed English-Chinese documents expose font problems quickly. If the PDF engine cannot find a usable Unicode font, the result can become missing glyphs, boxes, or unreadable text.",
          "VeloWrite includes stricter Unicode font handling for Chinese and other non-Latin text. Even so, open important PDFs after export and check them on the machine where they will be shared or printed.",
        ],
      },
      {
        id: "settings",
        title: "PDF settings should match the document",
        body: [
          "There is no single perfect PDF style. A study note, product spec, Chinese manuscript, README handout, and customer report may need different page sizes, margins, page numbers, table contrast, and watermark choices.",
          "VeloWrite keeps PDF options inside Settings so the export button stays simple. After you choose paper size, margins, page numbering, table style, or watermark behavior, the app remembers those choices for the next export.",
        ],
      },
      {
        id: "preview-limits",
        title: "What is still preview behavior",
        body: [
          "VeloWrite PDF export is still part of the public preview. Windows and macOS installers are not code-signed yet, and the free preview may include a watermark depending on your PDF settings.",
          "Advanced export presets, team templates, brand kits, and no-watermark Pro export are planned candidates, not active features in the current free preview. For now, review important PDFs before sending them.",
        ],
      },
      {
        id: "checklist",
        title: "A quick checklist before sending a PDF",
        body: [
          "Open the PDF after exporting. Check the cover, contents page, first long section, every wide table, numbered lists, code blocks, page numbers, and any Chinese or mixed-language paragraphs.",
          "For long documents, skim page transitions instead of only checking the first page. Export issues often show up at section boundaries, around tables, or near long inline code and URLs.",
        ],
        example: {
          label: "Final export checklist",
          markdown:
            "## PDF Review\n\n1. Open the exported PDF.\n2. Check cover and contents pages.\n3. Review the widest table.\n4. Review Chinese and mixed-language text.\n5. Confirm page numbers and watermark choices.\n6. Save the Markdown source beside the exported PDF.",
          note: "A repeatable checklist makes export quality easier to trust.",
        },
      },
    ],
    cta: {
      primary: { href: "/download?utm_source=pdf_export_notes_cta&utm_medium=cta", label: "Download Desktop" },
      secondary: { href: "/changelog?utm_source=pdf_export_notes_cta&utm_medium=resource", label: "Read Changelog" },
    },
  },
  previewBuildLimitations: {
    eyebrow: "Release trust",
    title: "Preview Build Limitations",
    intro:
      "VeloWrite is usable today, but it is still preview software. This page explains what you can rely on, what still needs caution, and how to test a build before putting important documents into it.",
    updated: "August 14, 2026",
    directory: [
      { label: "What works", href: "#what-works" },
      { label: "Install warnings", href: "#install-warnings" },
      { label: "Data safety", href: "#data-safety" },
      { label: "Export limits", href: "#export-limits" },
      { label: "Not active yet", href: "#not-active-yet" },
      { label: "How to test", href: "#how-to-test" },
    ],
    sections: [
      {
        id: "what-works",
        title: "What the preview is good for today",
        body: [
          "Use the web editor for quick Markdown drafts, live preview, Markdown download, and HTML export. It is a low-risk way to check whether the writing surface fits you before installing anything.",
          "Use the desktop app when you want real local files, direct save, offline work, recent files, local history snapshots, and PDF export. That is the main preview workflow we are hardening first.",
        ],
        example: {
          label: "Safe first test",
          markdown:
            "# VeloWrite Test\n\n## Try first\n\n- Open a copy of a Markdown file\n- Switch between Write, Split, and Preview\n- Save the file\n- Export HTML or PDF\n- Reopen the file and check history",
          note: "Start with a copy. Once the workflow feels safe, move to documents you care about.",
        },
      },
      {
        id: "install-warnings",
        title: "Installer warnings are expected in preview builds",
        body: [
          "The Windows installer is not code-signed yet, so SmartScreen may show a warning. The macOS DMG is also unsigned, so Gatekeeper may require a manual open action.",
          "That warning does not mean the file was modified, but it does mean you should download only from the official VeloWrite download page or GitHub Releases. Do not rely on mirrored installer files while the project is still unsigned.",
        ],
      },
      {
        id: "data-safety",
        title: "Back up important Markdown files yourself",
        body: [
          "The preview includes local history, but history is not a full backup system. It helps with recent mistakes such as a bad paste, an accidental rewrite, or a saved edit you want to compare.",
          "For important work, keep the Markdown file in a normal folder you already back up. Git, cloud drive folders, Syncthing, Time Machine, Windows File History, or a simple copied folder can all protect files outside VeloWrite.",
        ],
        example: {
          label: "Folder habit",
          markdown:
            "# Backup note\n\n## Source\n\nKeep the real `.md` file in a project folder.\n\n## Recovery\n\nUse VeloWrite history for recent edits.\nUse your normal backup for device loss or older versions.",
          note: "Local history is a recovery layer inside the editor. A backup protects the file outside the editor.",
        },
      },
      {
        id: "export-limits",
        title: "Export is useful, but still needs review",
        body: [
          "HTML export and PDF export work for ordinary Markdown documents, but preview builds should still be checked before a file is sent to clients, coworkers, teachers, or readers.",
          "Open the exported file and review the title, contents page, tables, numbered lists, code blocks, page numbers, images, and any Chinese or mixed-language text. Export bugs are easiest to catch with the real document, not a short placeholder.",
        ],
      },
      {
        id: "not-active-yet",
        title: "What is not active yet",
        body: [
          "AI writing commands, managed sync, accounts, encrypted sharing, team collaboration, one-click publishing, automatic update installation, signed releases, and paid checkout are not active in the current public build.",
          "Some may become Pro later. Before that, the free preview needs to feel dependable for ordinary Markdown work: reading, editing, saving, previewing, exporting, and recovering files.",
        ],
      },
      {
        id: "how-to-test",
        title: "How to test a preview build",
        body: [
          "Use a real sample file, but not your only copy. Open it, edit a few sections, jump through the outline, switch view modes, save, export, close, reopen, and check whether recent files and history behave as expected.",
          "If something feels wrong, report the platform, VeloWrite version, file type, what you clicked, what you expected, and what happened instead. A short reproducible report is more useful than a broad complaint.",
        ],
        example: {
          label: "Useful feedback format",
          markdown:
            "## Issue\n\nPreview pane scrolls differently from the editor.\n\n## Environment\n\n- Windows 11\n- VeloWrite 0.2.6\n- Split mode\n\n## Steps\n\n1. Open a long Markdown file.\n2. Click a heading in the outline.\n3. Scroll the preview pane.\n\n## Expected\n\nThe editor should stay near the same section.",
          note: "Good reports shorten the time between feedback and a usable fix.",
        },
      },
    ],
    cta: {
      primary: { href: "/download?utm_source=preview_limits_cta&utm_medium=cta", label: "Download Preview" },
      secondary: { href: "/feedback?utm_source=preview_limits_cta&utm_medium=resource", label: "Send Feedback" },
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
      "This changelog tracks what shipped in each preview build, what got better, and what is still left for later. Older releases stay below so you can compare versions without guessing.",
    updated: "August 12, 2026",
    directory: [
      { label: "0.2.6", href: "#v026" },
      { label: "0.2.5", href: "#v025" },
      { label: "0.2.4", href: "#v024" },
      { label: "0.2.3", href: "#v023" },
      { label: "0.2.2", href: "#v022" },
      { label: "0.2.1", href: "#v021" },
      { label: "0.2.0", href: "#v020" },
      { label: "Planned next", href: "#planned-next" },
      { label: "0.1.13", href: "#v0113" },
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
        id: "v026",
        title: "0.2.6 preview",
        body: [
          "Resolved local relative image paths in Markdown preview so nearby assets render from the current file folder on Windows, macOS, and Linux.",
          "Kept Split view scroll syncing limited to Split mode and reduced stale scroll handoff between the editor and preview panes.",
          "Made history restore previews easier to read with clearer restored and replaced labels, stronger change markers, and preserved long-line layout.",
          "Expanded automated tests for relative images, Windows paths, rendered image alt text, and Markdown rendering stability.",
        ],
      },
      {
        id: "v025",
        title: "0.2.5 preview",
        body: [
          "Improved PDF export so long Markdown documents start with a real cover page and a stable contents page.",
          "Saved PDF choices such as paper size, margins, page numbers, page position, page style, watermark, and table styling for the next export.",
          "Split Settings into Writing, Reading, PDF, and Tables tabs so the panel is easier to scan.",
          "Updated the download page and release notes for the 0.2.5 preview build.",
        ],
      },
      {
        id: "v024",
        title: "0.2.4 preview",
        body: [
          "Made PDF export refuse to continue if the bundled Unicode font is missing, so Chinese text does not turn into gibberish.",
          "Turned font-loading failures into clear export errors instead of a broken-looking PDF.",
          "Added automated PDF checks for Chinese text.",
          "Added a release policy article that explains how commits, local builds, GitHub Actions artifacts, GitHub Releases, installer assets, download dates, and changelog updates fit together.",
          "Updated the download page and release notes for the 0.2.4 preview build.",
        ],
      },
      {
        id: "v023",
        title: "0.2.3 preview",
        body: [
          "Added focused long-form reading preferences with Focus, Paper, Mist, Night, and high-contrast palettes plus system, serif, and monospace preview fonts.",
          "Kept reading preferences locally so a chosen palette and font return in the next session.",
          "Added bidirectional split scrolling so moving through the preview also moves the editor to the corresponding document position.",
          "Kept wide Markdown tables inside an internal scroll area in preview and split mode instead of allowing them to push content beyond the window.",
          "Fixed dedicated PDF export to preserve explicit ordered-list numbering across separate Markdown lists.",
          "Reduced broad active-line fills and widened the focused desktop writing column for calmer large-screen writing.",
        ],
      },
      {
        id: "v022",
        title: "0.2.2 preview",
        body: [
          "Added a dedicated VeloWrite PDF layout engine so Markdown exports no longer depend on browser print headers or WebView page chrome.",
          "Added native desktop PDF saving after the app generates validated PDF bytes.",
          "Changed wide Markdown tables in PDF exports into readable report-style cards on A4 pages.",
          "Replaced generic HTML and PDF toolbar icons with direct file-format icons.",
          "Fixed PDF output so tauri.localhost and browser print headers no longer appear in VeloWrite-generated PDF exports.",
        ],
      },
      {
        id: "v021",
        title: "0.2.1 preview",
        body: [
          "Made the desktop preview open directly into the writing workspace so the first impression feels more like a focused app than a website shell.",
          "Upgraded HTML export and Print / Save PDF output with a polished standalone document layout, cover metadata, print rules, table handling, code styling, and a VeloWrite export footer.",
          "Added export readiness actions and next-step guidance for Markdown, HTML, and PDF review copies inside the editor sidebar.",
          "Improved history comparison for longer documents with focused diff mode plus a Jump to first change control.",
          "Published The Future of Markdown Writing and updated SEO, sitemap, and llms.txt metadata for the new document route.",
          "Added public preview regression checks for Windows, macOS Apple Silicon, and Linux on the download page so testers know exactly what to verify.",
          "Updated the public roadmap to show the free preview quality bar before Pro work becomes the main focus.",
        ],
      },
      {
        id: "planned-next",
        title: "Planned next",
        body: [
          "Future updates will continue improving document structure, desktop polish, web-to-desktop handoff, export workflows, and the Pro feature path after the free preview foundation stays stable.",
        ],
      },
      {
        id: "v020",
        title: "0.2.0 preview",
        body: [
          "Published A Short History of Markdown, Typora Alternative, and Markdown Editor for Windows as user-facing documentation and SEO pages.",
          "Added a Roadmap status map that groups feedback into shipped, in-progress, next/designing, and Pro-candidate work.",
          "Improved the web-to-desktop handoff prompt with direct Open in Desktop, Markdown backup, and app download options.",
          "Added a desktop current-file status strip showing file name, path or draft state, local history scope, and save state.",
          "Improved docs article sharing so side share buttons only appear on wide screens with enough spacing from the article body.",
          "Renamed docs example actions to Try this in VeloWrite and covered the handoff into the web editor with end-to-end tests.",
          "Expanded Windows Open with guidance for Markdown file associations, old VeloMD shortcut cleanup, and unsigned installer expectations.",
          "Raised automated coverage around editor history helpers, recent files, docs publishing, roadmap grouping, and desktop status UI.",
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
