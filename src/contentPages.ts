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
          "Learn the structures you use every day first. Add math, code tabs, reference links, and templates only when the document needs them.",
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
          "Markdown fits notes, READMEs, specs, changelogs, study guides, knowledge-base articles, product docs, launch copy, and blog drafts. It is strongest when the document needs to stay editable and searchable.",
          "It also helps when a document may have several destinations. The same source can start as a private note, become a review draft, and later turn into a public article or support document.",
        ],
        example: {
          label: "One source, several outputs",
          markdown:
            "| Source document | Possible output |\n| --- | --- |\n| README draft | GitHub project page |\n| Product note | Help center article |\n| Launch checklist | Internal runbook |\n| Blog outline | Published article |",
          note: "Markdown helps when the source needs to outlive one export format.",
        },
      },
      {
        id: "limits",
        title: "Know what Markdown does not try to solve",
        body: [
          "Markdown is not a full design system, database, spreadsheet, whiteboard, or collaborative workspace by itself. Some editors add those layers, but the format remains strongest when the plain text file is still understandable.",
          "Tool choice depends on the job. For heavy collaboration, complex permissions, or database views, a larger workspace product may fit better. For private writing, readable files, preview, export, and local history, Markdown is a lighter base.",
        ],
      },
      {
        id: "start-writing",
        title: "Start in the browser, then move important files local",
        body: [
          "The easiest way to learn Markdown is to write a real document instead of reading syntax charts for an hour. Start with a title, a few headings, and one short list. Then preview the document and adjust the structure.",
          "VeloWrite's web editor handles that first draft. When the document becomes important, the desktop app is the better place for native open and save, offline writing, recent files, and local history snapshots.",
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
          "That early feedback is part of why Markdown stayed practical. It grew around the way people were already writing plain text.",
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
          "The most durable Markdown idea is simple: the source still makes sense without the editor. That keeps Markdown practical for notes, specs, drafts, and long-lived documentation.",
          "Another durable idea is separation of writing from presentation. You can draft in a clean plain-text structure, then export to HTML, print to PDF, publish to a site, or apply a style later.",
        ],
      },
      {
        id: "modern-editor-lessons",
        title: "What this history means for modern editors",
        body: [
          "A good Markdown editor should not make the file feel trapped. It should make writing faster while preserving plain text ownership. Preview, history recovery, export, and navigation should support the file instead of replacing it.",
          "VeloWrite follows that direction: quick browser editing for a first draft, a lightweight desktop app for files you keep, and a roadmap that puts everyday editing before AI, export, and publishing.",
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
          "For VeloWrite, desktop local files, recent documents, and local history stay in the free editor.",
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
          "Future Markdown editors need more than fast rendering. Long edits also need clear recovery. A local history panel, a readable restore preview, and visible snapshot limits help without forcing every document into a cloud account.",
          "VeloWrite keeps basic local history in the free preview because recovery is part of writing, not an add-on.",
        ],
      },
      {
        id: "ai-inside-writing",
        title: "AI should work inside the document flow",
        body: [
          "AI helps when it can polish a paragraph, summarize a section, continue a draft, explain code, or generate Mermaid diagrams from context. It works less well when it feels like a separate chat window pasted onto the side.",
          "AI commands stay on the VeloWrite Pro roadmap until the basic editor feels solid.",
        ],
        example: {
          label: "Task-based AI prompt shape",
          markdown:
            "## Draft task\n\nTurn these meeting notes into a short update for the team.\n\n### Source notes\n\n- Decision made\n- Risk still open\n- Follow-up owner assigned\n\n### Output style\n\nConcise, factual, and ready to paste into a project channel.",
          note: "AI works best when the document already contains the task, source, and target style.",
        },
      },
      {
        id: "export-readiness",
        title: "Editors will explain whether a draft is ready to export",
        body: [
          "Many writers do not need a complex publishing system on day one. They need to know whether the current draft has a title, enough structure, working links, readable code blocks, and the right output path.",
          "VeloWrite includes export preparation in the free preview: Markdown download, HTML export, dedicated PDF export, and a readiness panel for common document problems.",
        ],
        example: {
          label: "Export readiness checklist",
          markdown:
            "## Before sharing\n\n- [ ] The document has one clear H1 title\n- [ ] The sections match the reader's path\n- [ ] Links and images have context\n- [ ] Code blocks have language labels\n- [ ] The chosen export format matches the next step",
          note: "Export stays available. The document state remains visible before sharing.",
        },
      },
      {
        id: "publishing",
        title: "Publishing can become a natural last step",
        body: [
          "Many Markdown documents eventually become blog posts, docs pages, release notes, or knowledge-base articles. The future editor should help export and publish without making the writing surface heavier.",
          "VeloWrite keeps this as later work. First the editor needs to handle writing and preview well.",
        ],
      },
      {
        id: "what-should-not-change",
        title: "What should not change",
        body: [
          "Markdown should keep the ordinary advantages that made it durable: readable source, predictable structure, and files that move between tools. New AI, sync, and publishing features should support those advantages instead of replacing them.",
          "A future Markdown editor can feel modern without making notes feel captured. That is the line VeloWrite should keep.",
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
          note: "Readable source is easier to edit later.",
        },
      },
      {
        id: "lists",
        title: "Choose the right list",
        body: [
          "Use bullet lists when order does not matter. Use numbered lists when the reader should follow steps in sequence. Avoid deep nesting unless the structure really helps.",
          "A list works best when every item has the same shape. If one item turns into a long paragraph, it may deserve its own section instead.",
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
          "When a document becomes something you want to keep, move it from a temporary browser draft to a local file. That is where the desktop app is better than a tab.",
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
          "For long drafts, headings and lists make the source easier to scan.",
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
          "Markdown is a good publishing handoff because the same source can become HTML, documentation, a newsletter draft, or a blog post.",
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
          "For essays, client drafts, product copy, and long articles, a local file is easier to back up, compare, and keep under your own control.",
        ],
      },
      {
        id: "writer-habits",
        title: "Keep the writing surface quiet",
        body: [
          "A quiet writing surface still needs tools. The editor gives you headings, preview, export, and recovery without pulling attention away from the draft.",
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
          "READMEs, architecture notes, API drafts, runbooks, changelogs, release plans, and onboarding guides fit Markdown because the source is readable, diffable, and reviewable.",
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
          label: "Highlighted code examples",
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
          "Small decision notes save time later. They explain why a tradeoff was made, what alternatives were rejected, and what to revisit when the system changes.",
          "Markdown fits this work because the source can live near code, be reviewed in Git, or stay as a local draft until the decision is ready to share.",
        ],
        example: {
          label: "Decision note",
          markdown:
            "## Decision\n\nUse local browser storage for quick web drafts.\n\n## Why\n\n- No account is required for the first trial.\n- Drafts survive a refresh on the same device.\n- Sensitive long-term files still belong on desktop.\n\n## Revisit when\n\nPrivate sync moves from roadmap to implementation.",
          note: "Decision notes explain the constraint as well as the final choice.",
        },
      },
      {
        id: "runbooks",
        title: "Write runbooks as steps, checks, and rollback notes",
        body: [
          "A runbook can be boring in a good way. The next person needs to know what to check, what command to run, and what rollback path exists if something goes wrong.",
          "Numbered lists fit ordered procedures. Tables fit short status checks. Keep long explanations outside the emergency path.",
        ],
        example: {
          label: "Runbook fragment",
          markdown:
            "## Deploy check\n\n1. Confirm CI is green.\n2. Build the app locally.\n3. Publish the release notes.\n\n| Check | Expected |\n| --- | --- |\n| Tests | Passing |\n| Build | Complete |\n| Rollback | Previous release tag |",
          note: "Runbooks favor clarity over clever formatting.",
        },
      },
      {
        id: "release-notes",
        title: "Keep release notes close to real changes",
        body: [
          "Release notes are easier to write when they are updated near the work, not reconstructed at the end. Use short bullets and name the behavior users will notice.",
          "A changelog does not need every internal detail. It should tell users what changed, what improved, and what remains preview work.",
        ],
        example: {
          label: "Release note draft",
          markdown:
            "## Added\n\n- Copy Markdown and rendered HTML from the editor toolbar.\n- Open documentation examples directly in the web editor.\n\n## Fixed\n\n- Kept basics content focused on beginner Markdown patterns.",
          note: "Specific release notes help users decide whether to try the update.",
        },
      },
      {
        id: "local-history",
        title: "Why local history matters",
        body: [
          "Developers already understand version control, but not every draft belongs in Git immediately. Local history snapshots help recover accidental edits before the document is committed or shared.",
          "Basic local recovery stays in the free preview because draft safety belongs in the editor.",
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
          "A polished preview matters, but the source file is the durable asset. A careful Markdown workflow keeps the .md file editable in a plain text editor, reviewable in Git, and usable in another publishing tool.",
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
          "They help in engineering proposals, research notes, and onboarding guides where readers need the link but editors still need readable prose.",
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
          note: "A repeatable structure often beats a more complicated Markdown extension.",
        },
      },
      {
        id: "portable-syntax",
        title: "Know where portable Markdown ends",
        body: [
          "Headings, paragraphs, lists, links, blockquotes, fenced code, and reference links travel well between Markdown tools. Tables, math, task lists, diagrams, front matter, and custom callouts depend more on the renderer and publishing target.",
          "VeloWrite supports tables, KaTeX math, highlighted code, and tabbed previews for adjacent language examples. When a file must move between editors, test it in the destination tool and keep the source understandable even if an extension is unavailable.",
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
      "Math support helps with study notes, engineering docs, product analysis, and research drafts. VeloWrite renders math with KaTeX in the preview, so formulas can stay beside the plain text that explains them.",
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
          "A good pattern is simple: introduce the idea, show the formula, then explain the variables. The document stays readable even for someone scanning before reading closely.",
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
          note: "A short table helps when symbols appear more than once.",
        },
      },
      {
        id: "tables",
        title: "Use tables for small math references",
        body: [
          "Tables fit compact reference material: symbol definitions, parameter ranges, model assumptions, or before-and-after values. Keep cells short so the Markdown source remains readable.",
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
          "The best math note is the one you can reopen later and understand quickly. Use headings for the problem, assumptions, formula, and conclusion.",
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
  writeMathInMarkdown: {
    eyebrow: "Technical writing",
    title: "How to Write Math in Markdown",
    intro:
      "Markdown can handle useful math notes when the formula, explanation, and preview stay close together. This guide shows a practical way to write equations for study notes, engineering drafts, product analysis, and technical docs.",
    updated: "September 1, 2026",
    directory: [
      { label: "Quick answer", href: "#quick-answer" },
      { label: "Inline or block", href: "#inline-or-block" },
      { label: "Explain variables", href: "#explain-variables" },
      { label: "Common mistakes", href: "#common-mistakes" },
      { label: "Use preview", href: "#use-preview" },
      { label: "How VeloWrite helps", href: "#how-velowrite-helps" },
    ],
    sections: [
      {
        id: "quick-answer",
        title: "The quick answer",
        body: [
          "Use inline math when the expression belongs inside a sentence. Use block math when the equation needs its own line and should be checked carefully.",
          "In VeloWrite, write inline formulas with single dollar signs and block formulas with double dollar signs. The preview renders formulas with KaTeX, a fast TeX-compatible math renderer. KaTeX documents its supported functions and symbols in its official support table, so unsupported LaTeX commands should be simplified before sharing.",
        ],
        example: {
          label: "Inline and block math",
          markdown:
            "The energy relation $E = mc^2$ is short enough for one sentence.\n\nA longer equation is easier to review as a block:\n\n$$a^2 + b^2 = c^2$$",
          note: "Use inline math for small expressions and block math when the equation needs attention.",
        },
      },
      {
        id: "inline-or-block",
        title: "Choose inline or block math by reading flow",
        body: [
          "The choice is not only visual. Inline math keeps a small expression attached to the sentence. Block math tells the reader to stop and inspect the formula.",
          "A useful rule: if you need to explain the formula after writing it, give it a block. If it only names a variable, unit, or short relationship, inline is usually enough.",
        ],
        example: {
          label: "Reading flow",
          markdown:
            "Use $r$ for the monthly growth rate.\n\nThe projected value after $t$ periods is:\n\n$$P_t = P_0(1+r)^t$$\n\nThis works when growth is compounded at the same rate each period.",
          note: "The source stays readable, and the preview gives the equation room.",
        },
      },
      {
        id: "explain-variables",
        title: "Explain variables near the equation",
        body: [
          "Most formula-heavy notes fail because the symbols are not explained where readers need them. Keep a short variable list close to the equation instead of assuming people will remember earlier definitions.",
          "For classroom notes, define the variables before the example. For engineering notes, define the variables before the decision. For product analysis, define the variables before the conclusion.",
        ],
        example: {
          label: "Variable list",
          markdown:
            "We estimate activated users from visitors and activation rate:\n\n$$A = V \\times r$$\n\n| Symbol | Meaning |\n| --- | --- |\n| $A$ | Activated users |\n| $V$ | Visitors |\n| $r$ | Activation rate |",
          note: "A small table is easier to reread than a paragraph full of repeated definitions.",
        },
      },
      {
        id: "common-mistakes",
        title: "Watch for the mistakes that break math preview",
        body: [
          "Most rendering problems come from small syntax mistakes: one missing closing dollar sign, an unclosed brace, a command that KaTeX does not support, or a dollar sign used for currency inside a normal sentence.",
          "If a document mixes prices and formulas, write currency in words or escape the dollar sign when needed. Keep long formulas out of table cells unless the table is only a compact symbol reference.",
        ],
        example: {
          label: "Safer currency text",
          markdown:
            "The price is USD 29 per year, not a math expression.\n\nThe annual revenue estimate is:\n\n$$ARR = customers \\times price$$",
          note: "Clear prose around formulas prevents accidental math parsing.",
        },
      },
      {
        id: "use-preview",
        title: "Use preview as a formula checker",
        body: [
          "Math preview is useful because it catches errors while you still see the source. Split view is the fastest mode for this: the left side keeps the Markdown, and the right side shows whether the formula, table, and surrounding explanation render correctly.",
          "Before exporting or sharing a technical document, scan every block formula, every variable table, and every paragraph that uses inline math. A rendered formula should support the sentence, not hide a missing explanation.",
        ],
        example: {
          label: "Review checklist",
          markdown:
            "## Math review\n\n- [ ] Inline math is short\n- [ ] Block formulas render correctly\n- [ ] Variables are explained nearby\n- [ ] Currency is not parsed as math\n- [ ] The conclusion is written in plain language",
          note: "A small review checklist catches the most common math-document mistakes.",
        },
      },
      {
        id: "how-velowrite-helps",
        title: "How VeloWrite can help someone writing formulas",
        body: [
          "Today, VeloWrite helps by keeping the source and rendered result together. The web editor is useful for a quick formula check, while the desktop app is better for local study notes, research drafts, engineering docs, and documents that need history snapshots.",
          "The next useful helpers are practical, not flashy: a math snippet menu for common expressions, a visible warning when a delimiter is unclosed, a small variable-table template, and export checks that compare the preview with PDF and HTML output.",
          "Those helpers fit the preview direction because they improve normal Markdown writing. More advanced AI formula explanation or automatic derivation cleanup can wait for the Pro roadmap after the basic editing experience stays reliable.",
        ],
        example: {
          label: "Reusable math-note template",
          markdown:
            "# Math Note\n\n## Problem\n\nState the problem in plain language.\n\n## Formula\n\n$$y = mx + b$$\n\n## Variables\n\n| Symbol | Meaning |\n| --- | --- |\n| $m$ | Slope |\n| $b$ | Intercept |\n\n## Conclusion\n\nWrite what the formula means for this document.",
          note: "A template is often more helpful than a longer syntax chart.",
        },
      },
    ],
    cta: {
      primary: { href: "/web?utm_source=write_math_markdown_cta&utm_medium=cta", label: "Try Math Preview" },
      secondary: { href: "/docs/markdown-math?utm_source=write_math_markdown_cta&utm_medium=resource", label: "Read KaTeX Guide" },
    },
  },
  markdownCodeBlocks: {
    eyebrow: "Technical writing",
    title: "Markdown Code Blocks and Tabs",
    intro:
      "Code blocks are one reason Markdown fits technical writing. A good code example is easy to copy, easy to compare with the explanation, and short enough that readers do not lose the point.",
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
  longMarkdownWorkflow: {
    eyebrow: "Writing workflow",
    title: "How to Work Faster in Long Markdown Drafts",
    intro:
      "Long Markdown files get slow when you need to jump between sections, clean up tables, compare images, or return to a paragraph you edited five minutes ago. The fix is not more decoration. It is better movement, better context, and fewer lost edits.",
    updated: "August 29, 2026",
    directory: [
      { label: "What slows drafts down", href: "#what-slows-drafts-down" },
      { label: "Keyboard shortcuts", href: "#keyboard-shortcuts" },
      { label: "Tables and images", href: "#tables-and-images" },
      { label: "Marks for long files", href: "#marks-for-long-files" },
      { label: "A practical sequence", href: "#a-practical-sequence" },
      { label: "What to cover next", href: "#what-to-cover-next" },
    ],
    sections: [
      {
        id: "what-slows-drafts-down",
        title: "Long drafts slow down when context disappears",
        body: [
          "A short note is easy to hold in your head. A long draft is different. You start in one section, open a table, insert an image, then scroll back to the paragraph you were fixing. If the editor jumps away or loses your place, the document feels heavier than the writing itself.",
          "VeloWrite keeps source and preview close together, keeps tables and images visible in the rendered view, and keeps recent edits attached to the file instead of a browser tab you might forget to reopen.",
          "The same problem appears in product specs, scripts, release notes, research notes, and long README files. The content is not difficult because it is Markdown. It is difficult because the author has to keep several locations in mind at the same time.",
        ],
        example: {
          label: "A draft that needs movement",
          markdown:
            "# Launch Plan\n\n## Hook\n\nWrite the reader-facing line here.\n\n## Table\n\n| Item | Status |\n| --- | --- |\n| Draft | In progress |\n| Review | Pending |\n\n## Image\n\n![Concept](./assets/concept.png)\n\n## Next pass\n\nReturn to the hook after the table is clean.",
          note: "The draft is easier to read when the structure is visible and the file stays local.",
        },
      },
      {
        id: "keyboard-shortcuts",
        title: "Use shortcuts for actions you repeat every day",
        body: [
          "The shortest path is usually the one you do not have to think about. Save, open, switch view mode, toggle focus, and close the current tab should all be one gesture away on every desktop platform.",
          "In VeloWrite, the common shortcuts follow the platform's normal pattern: Cmd on macOS, Ctrl on Windows and Linux, with the same command mapped in the menu. That means the app behaves like a real desktop tool instead of a web page in a frame.",
          "The best shortcut set is small. A writer needs to save, switch between write and preview, move between tabs, and return to marked lines without learning a command language first.",
        ],
        example: {
          label: "Common editing shortcuts",
          markdown:
            "Use keyboard shortcuts to reduce friction:\n\n- `Ctrl/Cmd + S` saves the file\n- `Ctrl/Cmd + W` closes the current tab\n- `Ctrl/Cmd + 1/2/3` switches the view mode\n- `Alt + 1/2/3` selects a quick mark slot\n- `Alt + M` stores the current slot\n- `Alt + J` jumps back to it",
          note: "Shortcuts matter most when the file is already long enough to make a mouse trip feel expensive.",
        },
      },
      {
        id: "tables-and-images",
        title: "Tables and images should stay close to the text they support",
        body: [
          "Tables help when readers need a compact comparison, but badly aligned tables waste space and attention. Image paths help when they stay portable, but they become a problem when the editor cannot tell whether the file will still work after a move or a sync.",
          "The document tools panel checks table formatting, image path risk, and code block labels. It is not trying to turn the editor into a validator. It is there to spot cases that usually break later.",
          "A good long-form workflow treats tables and images as part of the document, not as decorations added at the end. If a table is hard to scan or an image path is fragile, the problem needs to be visible while the author is still editing.",
        ],
        example: {
          label: "A compact comparison",
          markdown:
            "| Action | Why it helps |\n| --- | --- |\n| Format tables | Keeps columns readable |\n| Check image paths | Reduces broken previews |\n| Label code blocks | Makes examples easier to scan |",
          note: "A clean table is faster to review than a larger paragraph full of repeated words.",
        },
      },
      {
        id: "marks-for-long-files",
        title: "Marks help when you need to return to a place later",
        body: [
          "Long files usually make you move in circles. You check the intro, jump to a table, fix an image caption, then return to the section you were writing. A mark gives you a cheap way to return without searching again.",
          "VeloWrite now supports multiple quick mark slots per tab. That is enough for the common case: keep one mark near the opening section, one near a table or checklist, and one near the place you are actively revising.",
          "This works better than a single bookmark because the file itself often has more than one active problem. The slot stays local to the tab, so switching documents does not mix up positions.",
        ],
        example: {
          label: "Three useful marks",
          markdown:
            "# Draft\n\n## M1\nUse this near the opening summary.\n\n## M2\nUse this near the table or checklist.\n\n## M3\nUse this near the paragraph you are actively rewriting.",
          note: "A few slots are usually enough for one long draft session.",
        },
      },
      {
        id: "a-practical-sequence",
        title: "A practical sequence for a long drafting session",
        body: [
          "Start in the section that matters most. Add the rough text first, then use a mark before you move away. Format the table. Check the image paths. Switch to preview. Return to the saved mark and finish the paragraph.",
          "This sequence is boring on purpose. Boring is good when the file is important. The editor should preserve your place while you do the actual editing work.",
          "For a longer pass, set M1 near the top-level thesis, M2 near the table or source material, and M3 near the paragraph you are actively rewriting. After that, use the outline for large jumps and marks for return trips.",
          "When the draft is ready to share, preview it before export. Check tables, code fences, math, Mermaid diagrams, and images in the same visual context where the reader will see them.",
        ],
      },
      {
        id: "what-to-cover-next",
        title: "What we should explain next",
        body: [
          "The next useful articles should go deeper on four areas: shortcut habits for desktop editing, image handling for portable documents, table cleanup for readable comparisons, and multi-mark navigation for long drafts.",
          "Those articles should use real examples rather than feature lists. A shortcut guide should show a writing session. An image guide should show broken and fixed paths. A table guide should show messy and formatted tables. A marks guide should show how to move between several active editing points.",
          "That gives the docs a clean path: first learn Markdown, then learn how to write faster in long files, then learn the advanced pieces that make the file easier to keep and reuse.",
        ],
      },
    ],
    cta: {
      primary: { href: "/web?utm_source=long_workflow_cta&utm_medium=cta", label: "Open Web Editor" },
      secondary: { href: "/download?utm_source=long_workflow_cta&utm_medium=cta", label: "Download Desktop" },
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
          "The browser is the right place to test an idea quickly. Paste Markdown, check the preview, export HTML, or download a copy without signing in. That low-friction start fits documents you may not keep.",
          "The desktop app becomes the better home when the draft turns into a real file: a README, a runbook, class notes, meeting notes, a product spec, or a blog draft you will revise more than once. Native open and save, offline access, recent files, and local history are the difference between a quick tool and a daily writing workspace.",
        ],
      },
      {
        id: "history-recovery",
        title: "Local history is part of document safety",
        body: [
          "Undo is not enough for real writing. A mistake may be saved, the app may be reopened later, or a large paste may change a long document in a way that is hard to inspect. Local history gives the editor a safety net that is closer to how people actually work.",
          "VeloWrite keeps basic local history in the free preview. Accidental recovery should not be treated as a luxury feature.",
          "The rule needs to be easy to understand: how many snapshots are kept, what happens when the limit is reached, and how to protect important files outside the app.",
        ],
        example: {
          label: "History-friendly revision note",
          markdown:
            "# Draft Review\n\n## Before editing\n\nKeep the current argument short.\n\n## After editing\n\nExpand only the examples that support the main point.\n\n## Recovery rule\n\nIf the edit gets worse, compare with the previous saved version before restoring.",
          note: "Recovery should show what changed before it replaces the current draft.",
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
            "# Notes Folder\n\n## Structure\n\n- `inbox.md`\n- `project-plan.md`\n- `meeting-notes.md`\n- `archive/`\n\n## Sync rule\n\nKeep the folder visible so another backup or sync tool can protect it.",
          note: "A visible folder keeps the workflow understandable even when sync tools are involved.",
        },
      },
      {
        id: "recovery-rules",
        title: "Recovery rules need to be visible",
        body: [
          "History and sync overlap. If two devices edit the same file, the editor should help users see which version changed, when it changed, and what can be restored. Silent overwrites are worse than asking the user to make a choice.",
          "Before VeloWrite adds any advanced sync behavior, it should document the basic recovery model: where snapshots live, how restore works, whether deleted snapshots can be recovered, and what users should back up themselves.",
          "This is part of the everyday editor. Clear recovery rules reduce support questions and make the desktop app safer for daily documents.",
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
          "VeloWrite is not trying to copy every mature Typora feature immediately. The early target is a fast preview editor with a clear path: try it online, download desktop when local files matter, and check the public roadmap before expecting Pro features.",
          "That gives new users a low-risk first step. Paste Markdown into the web editor, check rendering, export or download a file, then decide whether the desktop app belongs in your daily setup.",
        ],
        example: {
          label: "Evaluate an editor with a real note",
          markdown:
            "# Editor Trial Note\n\n## What matters\n\n- Opens quickly\n- Keeps Markdown readable\n- Shows preview clearly\n- Saves a local copy\n- Makes recovery understandable\n\n## Decision\n\nUse the editor only if the file still feels like yours.",
          note: "Compare the tools with a document you would actually keep, not a feature checklist.",
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
          "For teams and creators, price is only part of the decision. The editor also needs portable source files, visible recovery, and predictable exports without turning every note into a cloud account.",
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
          note: "Use the preview to review the argument as well as the Markdown syntax.",
        },
      },
      {
        id: "preview-before-export",
        title: "Preview before export",
        body: [
          "Preview catches broken structure, awkward tables, long code blocks, and math that does not render as expected. Read the document from top to bottom at least once before you export it.",
          "In VeloWrite, switch to Preview for a clean reading pass, then return to Split when you need to fix the source beside the result. This helps most with technical posts that have tables, formulas, or multi-language code examples.",
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
    title: "How to Open, View, and Edit .md Files on Windows",
    intro:
      "If you need to open a .md file on Windows, view Markdown files, or edit a local document without fighting the file association dialog, this guide shows the fastest path.",
    updated: "July 31, 2026",
    directory: [
      { label: "Quick answer", href: "#quick-answer" },
      { label: "Open a .md file", href: "#open-a-md-file" },
      { label: "View Markdown files", href: "#view-markdown-files" },
      { label: "Edit local files", href: "#edit-local-files" },
      { label: "Open with", href: "#open-with" },
      { label: "If it does not appear", href: "#missing-open-with" },
      { label: "Old app cleanup", href: "#old-app-cleanup" },
      { label: "Installer status", href: "#installer-status" },
    ],
    sections: [
      {
        id: "quick-answer",
        title: "The short answer",
        body: [
          "Use the browser editor if you only need to paste Markdown, preview it, and download a copy. No account is required.",
          "Install the desktop app if you need to open real local files, use Open with, keep recent files, or recover from local history.",
        ],
      },
      {
        id: "open-a-md-file",
        title: "How to open a .md file on Windows",
        body: [
          "The easiest path is to right-click the file, choose Open with, and select VeloWrite.",
          "When the association is set, opening a .md file should load it directly into the editor, not the marketing website.",
        ],
        example: {
          label: "Windows open check",
          markdown:
            "# Windows Open Test\n\n## Verify\n\n- Open this file with VeloWrite\n- Edit a line\n- Save the file\n- Reopen it from Recent\n\n## Expected result\n\nThe file path is visible and the editor keeps the file open.",
          note: "Use a small test file first so you can verify open, save, recent files, and history without risking important notes.",
        },
      },
      {
        id: "view-markdown-files",
        title: "How to view .md files on Windows",
        body: [
          "If you only want to read Markdown, open the file in VeloWrite and switch to Preview or Split view.",
          "That gives you a clean rendered view for notes, READMEs, and documentation without leaving the file on disk.",
        ],
      },
      {
        id: "edit-local-files",
        title: "How to edit Markdown files locally",
        body: [
          "Use the desktop app when the document matters. Native open and save, recent files, and local history snapshots make repeated edits easier to trust.",
          "That is better than copying the text into a browser tab when you plan to keep the same Markdown file over time.",
        ],
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
  openMdFilesOnWindows: {
    eyebrow: "Windows help",
    title: "How to Open, View, and Edit .md Files on Windows 11",
    intro:
      "If you searched for how to open a .md file on Windows or how to view .md files on Windows, this short guide gives the direct path and shows when the desktop app matters more than the browser.",
    updated: "August 30, 2026",
    directory: [
      { label: "Quick answer", href: "#quick-answer" },
      { label: "Open a file", href: "#open-a-file" },
      { label: "View the content", href: "#view-the-content" },
      { label: "Edit the file", href: "#edit-the-file" },
      { label: "Troubleshoot Open with", href: "#troubleshoot-open-with" },
      { label: "Why use desktop", href: "#why-use-desktop" },
    ],
    sections: [
      {
        id: "quick-answer",
        title: "The quick answer",
        body: [
          "Open the .md file with VeloWrite. If you just need to read it, use Preview or Split mode. If you need to keep editing the same file, use the desktop app so the file stays local.",
          "You do not need a database or a cloud account to read a Markdown file on Windows.",
        ],
      },
      {
        id: "open-a-file",
        title: "How to open a .md file on Windows",
        body: [
          "Right-click the file, choose Open with, and select VeloWrite.",
          "If you want the file to open there again later, keep using the same app for that file type so Windows remembers the association.",
        ],
        example: {
          label: "Simple open test",
          markdown:
            "# Open Test\n\n1. Create a file named `note.md`\n2. Right-click it\n3. Choose Open with -> VeloWrite\n4. Confirm the file opens in the editor\n5. Save and reopen it from Recent",
          note: "Use a tiny test file first so you can check the flow without risking important notes.",
        },
      },
      {
        id: "view-the-content",
        title: "How to view .md files on Windows",
        body: [
          "Use Preview mode if you want the rendered result. Use Split mode if you want to keep the Markdown source beside the preview.",
          "That is the easiest way to see headings, lists, tables, code blocks, and math without leaving the editor.",
        ],
      },
      {
        id: "edit-the-file",
        title: "How to edit Markdown files without losing the source",
        body: [
          "The Markdown source stays readable in the editor, so you can keep the file portable and continue editing it later.",
          "That makes VeloWrite useful for notes, READMEs, meeting notes, and drafts that should stay in normal folders instead of a browser-only tab.",
        ],
      },
      {
        id: "troubleshoot-open-with",
        title: "If Open with does not show VeloWrite",
        body: [
          "Choose More apps or Browse for another app, then point Windows at VeloWrite again. Preview builds can take one manual selection before Windows shows the app in the short list.",
          "If the app still does not show up, reinstall the current preview build and test with a new file. Some work computers also restrict default-app changes.",
        ],
      },
      {
        id: "why-use-desktop",
        title: "Why the desktop app is better for real files",
        body: [
          "The desktop app adds native open and save, offline work, recent files, and local history snapshots. That is better for a file you plan to keep editing.",
          "The web editor is still useful for quick drafts, but the desktop path is the right place once the file becomes important.",
        ],
      },
    ],
    cta: {
      primary: { href: "/download?utm_source=windows_long_tail_cta&utm_medium=cta", label: "Download Windows" },
      secondary: { href: "/docs/markdown-editor-for-windows?utm_source=windows_long_tail_cta&utm_medium=resource", label: "Windows Guide" },
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
          "The desktop app handles native open and save, recent files, offline work, and local history snapshots. Those features matter more on real documents than on quick browser drafts.",
          "A good Mac Markdown workflow should make the file path clear, keep the source text portable, and avoid hiding your notes inside an account-only database. VeloWrite keeps that local-first direction visible in the current preview.",
        ],
        example: {
          label: "Local-first file habit",
          markdown:
            "# Project Notes\n\n## Local file\n\nSave this document as `project-notes.md` inside a folder that is backed up by your normal system.\n\n## Recovery habit\n\nBefore major edits, save once so the previous version becomes available in local history.",
          note: "This does not replace your backup system. It makes everyday editing less fragile.",
        },
      },
      {
        id: "what-to-test",
        title: "What Mac testers should check first",
        body: [
          "Start with the practical path: open a Markdown file, edit a paragraph, save it, reopen it from Recent, export HTML, export PDF, and verify local history after a second save.",
          "Test a longer reading session too. Switch the reading palette and preview font in Settings, then use Preview mode on a longer document. A Markdown editor needs to stay comfortable after five minutes, beyond the first screenshot.",
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
          "A Tauri desktop app can keep the package smaller than many Electron-style tools while still offering a modern interface. The target is a fast Markdown surface without a heavy runtime feel.",
          "For a writing tool, that matters because the app may stay open beside a terminal, browser, source tree, or PDF viewer for hours. Lower overhead changes whether the tool feels welcome in a daily workspace.",
        ],
      },
      {
        id: "export-checks",
        title: "Check export before the document matters",
        body: [
          "Before a Markdown file becomes important, test the export path with the kinds of content you actually write: numbered lists, tables, code blocks, links, and long headings.",
          "VeloWrite's dedicated PDF export avoids browser print headers. The current preview also keeps wide tables readable and preserves explicit ordered-list numbering.",
        ],
        example: {
          label: "Export sanity check",
          markdown:
            "# Export Check\n\n1. First numbered item.\n\n2. Second numbered item.\n\n| Area | Check |\n| --- | --- |\n| PDF | No browser headers |\n| Table | Borders stay visible |\n\n```bash\n./VeloWrite_0.2.8_amd64.AppImage\n```",
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
      "VeloWrite is still in preview, so code changes, local builds, GitHub Releases, installer assets, and the download page need to stay separate. This guide explains what users can check before downloading or updating.",
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
          "The changelog has a separate Last updated field because release notes can be clarified after the installer was published. That page date tracks documentation changes, while the download card tracks installer age.",
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
    updated: "August 15, 2026",
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
          "Markdown fits a document that is still changing. PDF fits a document that needs to be shared, reviewed, archived, or printed with a stable layout.",
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
          note: "Test tables with real content rather than short placeholder cells.",
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
          "If something feels wrong, report the platform, VeloWrite version, file type, what you clicked, what you expected, and what happened instead. A short reproducible report helps more than a broad complaint.",
        ],
        example: {
          label: "Useful feedback format",
          markdown:
            "## Issue\n\nPreview pane scrolls differently from the editor.\n\n## Environment\n\n- Windows 11\n- VeloWrite 0.2.8\n- Split mode\n\n## Steps\n\n1. Open a long Markdown file.\n2. Click a heading in the outline.\n3. Scroll the preview pane.\n\n## Expected\n\nThe editor should stay near the same section.",
          note: "Good reports shorten the time between feedback and a usable fix.",
        },
      },
    ],
    cta: {
      primary: { href: "/download?utm_source=preview_limits_cta&utm_medium=cta", label: "Download Preview" },
      secondary: { href: "/feedback?utm_source=preview_limits_cta&utm_medium=resource", label: "Send Feedback" },
    },
  },
  downloadSafety: {
    eyebrow: "Release trust",
    title: "Download Safety for VeloWrite Preview Builds",
    intro:
      "VeloWrite preview installers are still unsigned. Use this checklist to download from the right place, confirm the version, and report anything that looks wrong.",
    updated: "August 15, 2026",
    directory: [
      { label: "Official sources", href: "#official-sources" },
      { label: "Version match", href: "#version-match" },
      { label: "System warnings", href: "#system-warnings" },
      { label: "First run", href: "#first-run" },
      { label: "When to stop", href: "#when-to-stop" },
      { label: "Report issues", href: "#report-issues" },
    ],
    sections: [
      {
        id: "official-sources",
        title: "Download only from the official page or GitHub Releases",
        body: [
          "Use velowrite.app/download or the GitHub Releases page linked from it. Those pages show the current preview version, platform package names, release date, and notes before you install.",
          "Avoid random mirrors, reuploaded installers, shortened links, and files shared in chat. While VeloWrite is unsigned, the safest habit is to start from the official download page every time.",
        ],
      },
      {
        id: "version-match",
        title: "Check the version before installing",
        body: [
          "The download card, file name, GitHub release tag, changelog entry, and desktop About panel should all point to the same version. If the website says v0.2.8, the installer file and release page should also be for v0.2.8.",
          "If a fix is mentioned in the changelog but the installer version is older, wait for the next public release or use the web editor where website fixes are already live.",
        ],
        example: {
          label: "Version check",
          markdown:
            "## Before installing\n\n- Download page version: v0.2.8\n- GitHub release tag: v0.2.8\n- Installer file name: VeloWrite_0.2.8...\n- Desktop About panel after install: 0.2.8",
          note: "A simple version match catches most stale-download confusion.",
        },
      },
      {
        id: "system-warnings",
        title: "Unsigned installer warnings are expected for now",
        body: [
          "Windows SmartScreen and macOS Gatekeeper may warn because the current preview builds are not code-signed or notarized yet. That is a trust limitation of the preview, not a feature users should ignore forever.",
          "The current workaround is to verify the source and version before installing. Paid signing and notarization remain release trust work for a later budget stage.",
        ],
      },
      {
        id: "first-run",
        title: "Test with a copy of a Markdown file first",
        body: [
          "Open a copied Markdown file, switch between Write, Split, and Preview, save once, export HTML or PDF, then reopen the file and check History. This tests the core desktop path without putting your only copy at risk.",
          "Keep important files in a folder you already back up. VeloWrite local history helps with recent edits, but it is not a replacement for Git, Time Machine, Windows File History, Syncthing, or a normal cloud-drive backup.",
        ],
      },
      {
        id: "when-to-stop",
        title: "Stop if anything looks inconsistent",
        body: [
          "Do not install if the file name, version, release page, or source link does not match what the download page says. Do not keep using a build if it cannot close, save, reopen, or export a simple test document reliably.",
          "If you already installed an old VeloMD preview, uninstall it separately so old shortcuts do not make it look like VeloWrite installed twice.",
        ],
      },
      {
        id: "report-issues",
        title: "Report download or install issues with the exact file name",
        body: [
          "When reporting a download issue, include your operating system, installer file name, version shown in About, where you downloaded it, and what warning or error appeared.",
          "That information makes the issue actionable. It also helps keep the public download page honest when a build asset, release note, or platform package falls behind.",
        ],
      },
    ],
    cta: {
      primary: { href: "/download?utm_source=download_safety_cta&utm_medium=cta", label: "Open Downloads" },
      secondary: { href: "/feedback?utm_source=download_safety_cta&utm_medium=cta", label: "Report a Problem" },
    },
  },
  privateOnlineMarkdownEditor: {
    eyebrow: "Private Markdown editing",
    title: "Private Online Markdown Editor: What Stays in Your Browser?",
    intro:
      "An online Markdown editor should make it clear what happens to your draft. This guide explains browser-local editing, analytics consent, downloads, and when a desktop app is the better choice for long-term files.",
    updated: "August 15, 2026",
    directory: [
      { label: "The short answer", href: "#the-short-answer" },
      { label: "Browser-local drafts", href: "#browser-local-drafts" },
      { label: "Analytics consent", href: "#analytics-consent" },
      { label: "Downloads and exports", href: "#downloads-and-exports" },
      { label: "When desktop is better", href: "#when-desktop-is-better" },
      { label: "A practical privacy check", href: "#a-practical-privacy-check" },
    ],
    sections: [
      {
        id: "the-short-answer",
        title: "The short answer",
        body: [
          "VeloWrite's normal web editor does not upload the Markdown you type to VeloWrite servers. The browser keeps the working draft in local storage on the same device, which lets a refresh recover the draft without creating an account.",
          "That is useful for a quick draft, but it is not the same as a backup. Browser storage can be cleared, is tied to one browser profile, and should not be the only copy of an important document.",
        ],
        example: {
          label: "A simple privacy boundary",
          markdown:
            "# Draft boundary\n\n## In the browser\n\n- Type and preview a Markdown draft\n- Keep the working copy in local browser storage\n- Download the source when it matters\n\n## On your device\n\n- Keep the real `.md` file in a folder you control\n- Use the desktop app for local open and save",
          note: "The browser is a convenient starting point. The downloaded Markdown file is the durable source.",
        },
      },
      {
        id: "browser-local-drafts",
        title: "Browser-local drafts are convenient, not permanent",
        body: [
          "Local browser storage is a good fit for a short note, a temporary outline, or a document you are still deciding whether to keep. It avoids an account and keeps the first step low friction.",
          "It is a weaker fit for a long manuscript, a client document, or a project knowledge base. Download the Markdown source regularly, or move the document to the desktop app once it becomes part of your normal work.",
        ],
      },
      {
        id: "analytics-consent",
        title: "Analytics is separate from your Markdown draft",
        body: [
          "VeloWrite asks before loading its optional analytics and performance scripts. If you decline or do not choose, those scripts are not loaded. This can make traffic and performance dashboards show fewer visits than the actual site receives.",
          "That consent choice does not upload the text of your Markdown draft. It controls whether basic site usage and performance signals are sent to the analytics service. You can review the policy before making a choice.",
        ],
        example: {
          label: "Consent is a separate decision",
          markdown:
            "| Action | What it affects |\n| --- | --- |\n| Write a draft | Your local browser editing state |\n| Download Markdown | A file saved by your browser |\n| Allow analytics | Optional site usage and performance signals |\n| Decline analytics | No optional analytics scripts for that browser |",
          note: "The document workflow and the optional measurement workflow are separate.",
        },
      },
      {
        id: "downloads-and-exports",
        title: "Download the source before you share the result",
        body: [
          "Markdown download preserves the editable source. HTML export helps when another tool needs rendered markup, and PDF export gives you a fixed review copy. Each output serves a different purpose.",
          "For an important document, keep the `.md` source beside any HTML or PDF export. If the export needs correction later, the source is the file you can edit instead of trying to recover text from a finished PDF.",
        ],
        example: {
          label: "Keep source and outputs together",
          markdown:
            "```text\nproject-notes/\n├── project-notes.md\n├── project-notes.html\n└── project-notes.pdf\n```",
          note: "The Markdown file remains the editable source; HTML and PDF are review or delivery copies.",
        },
      },
      {
        id: "when-desktop-is-better",
        title: "When a desktop Markdown editor is the better choice",
        body: [
          "Use the VeloWrite desktop preview when you need to open and save files in a local folder, work without a network connection, keep recent files, or review local history snapshots.",
          "The desktop app does not turn the document into a cloud record by default. It works with files on your device, so your normal backup habits still matter: Git, a backup drive, File History, Time Machine, or a synced folder can protect the source outside the editor.",
        ],
      },
      {
        id: "a-practical-privacy-check",
        title: "A practical privacy check before you start",
        body: [
          "Decide how sensitive the document is, whether the browser is an appropriate place for the first draft, and where the durable source will live. For a private note, local browser editing may be enough. For a work document, download the source and keep it in the project folder.",
          "If you are unsure, start with a non-sensitive sample. Confirm the editor behavior, export the file, inspect the result, and then choose the workflow you want for real documents.",
        ],
        example: {
          label: "A five-step check",
          markdown:
            "## Before writing something important\n\n1. Decide whether a browser draft is appropriate.\n2. Keep personal or confidential details out of a disposable test.\n3. Download the `.md` source before closing the tab.\n4. Store the source in a folder you already back up.\n5. Use the desktop app when local files and offline work matter.",
          note: "Privacy is easier to manage when the storage decision is made before the document becomes important.",
        },
      },
    ],
    cta: {
      primary: { href: "/web?utm_source=private_markdown_cta&utm_medium=cta", label: "Try the Web Editor" },
      secondary: { href: "/docs/local-first-markdown?utm_source=private_markdown_cta&utm_medium=resource", label: "Read Local-First Guide" },
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
  markdownMeetingNotes: {
    eyebrow: "Practical Markdown workflow",
    title: "Markdown Meeting Notes Template",
    intro:
      "A meeting note is easier to use when the decision, the owner, and the next action are easy to find. This Markdown template gives you a small structure that works for project meetings, one-to-ones, and follow-up notes.",
    updated: "August 20, 2026",
    directory: [
      { label: "Why use a template", href: "#why-use-a-template" },
      { label: "The basic template", href: "#the-basic-template" },
      { label: "Keep decisions separate", href: "#keep-decisions-separate" },
      { label: "Write useful action items", href: "#write-useful-action-items" },
      { label: "Review and share", href: "#review-and-share" },
      { label: "Use it in VeloWrite", href: "#use-it-in-velowrite" },
    ],
    sections: [
      {
        id: "why-use-a-template",
        title: "Why use a meeting note template?",
        body: [
          "Meeting notes often fail after the meeting, not during it. The notes contain plenty of discussion, but nobody can quickly tell what was decided or who needs to do what.",
          "A small template gives every note the same shape. That makes it easier to scan later, search across a folder, and hand the work to someone who was not in the room.",
        ],
        example: {
          label: "Start with the shape",
          markdown:
            "# Project check-in\n\n**Date:** 2026-08-20\n**People:** Alex, Sam, Priya\n\n## Decision\n\nChoose the smaller release scope for this week.\n\n## Next actions\n\n- Alex: update the release checklist by Friday\n- Sam: test the Windows installer\n\n## Open questions\n\n- Do we need a separate Linux package note?",
          note: "The headings make the important parts easy to find before you add more detail.",
        },
      },
      {
        id: "the-basic-template",
        title: "The basic template",
        body: [
          "Keep the top of the file factual: date, people, project, and purpose. Then separate decisions from discussion and actions. You can add a short context section when the note will be read by someone who missed the meeting.",
          "The template does not need to be long. Its job is to make the next useful fact easy to locate.",
        ],
        example: {
          label: "Reusable meeting notes",
          markdown:
            "# Meeting title\n\n**Date:** YYYY-MM-DD\n**People:**\n**Project:**\n\n## Context\n\nWhy did we meet?\n\n## Discussion\n\n- Point worth keeping\n- Constraint or risk\n\n## Decisions\n\n- Decision and the reason for it\n\n## Next actions\n\n- Person: action, due date\n\n## Open questions\n\n- Question that still needs an answer",
          note: "Copy this structure for the next meeting, then remove sections that do not help.",
        },
      },
      {
        id: "keep-decisions-separate",
        title: "Keep decisions separate from discussion",
        body: [
          "Discussion records what people considered. A decision records what the group chose. Mixing the two makes old notes hard to trust because readers have to reconstruct the outcome from the conversation.",
          "Put the decision near the top when it affects the rest of the note. Keep the reason short, and link to a longer specification or issue when the details belong elsewhere.",
        ],
        example: {
          label: "Decision with context",
          markdown:
            "## Decision\n\nUse local Markdown files as the source of truth for the preview workflow.\n\n**Reason:** The team needs files that can be backed up and opened outside one service.\n\n**Related:** [Local-first Markdown editing](/docs/local-first-markdown)",
          note: "A short reason helps a future reader understand why the decision was made.",
        },
      },
      {
        id: "write-useful-action-items",
        title: "Write action items someone can act on",
        body: [
          "An action item needs an owner and a concrete verb. " +
            "Write \"Priya: check the PDF output on Windows\" instead of \"PDF testing\". Add a due date when the timing matters.",
          "Keep open questions separate from actions. An unanswered question may need research before anyone can take responsibility for it.",
        ],
        example: {
          label: "Action items and questions",
          markdown:
            "## Next actions\n\n- Jordan: add the missing screenshot to the guide by 2026-08-22\n- Mei: review the table layout in the exported PDF\n\n## Open questions\n\n- Should the next release keep the current PDF watermark?",
          note: "The owner and verb tell the reader what happens next.",
        },
      },
      {
        id: "review-and-share",
        title: "Review the note before sharing it",
        body: [
          "Read the note once from top to bottom. Remove repeated discussion, check names and dates, and make sure each decision has enough context to stand on its own.",
          "Then preview the rendered document. Tables, links, code blocks, and long headings can look different from the source. Download the Markdown file before you close the browser, or save the document locally when it needs to be kept.",
        ],
        example: {
          label: "A short review checklist",
          markdown:
            "## Before sharing\n\n- [ ] The title and date are correct\n- [ ] Decisions are separate from discussion\n- [ ] Each action has an owner\n- [ ] Open questions are still open\n- [ ] Links and tables render correctly\n- [ ] The Markdown source is saved",
          note: "A short checklist catches the mistakes that are easiest to miss after a busy meeting.",
        },
      },
      {
        id: "use-it-in-velowrite",
        title: "Use the template in VeloWrite",
        body: [
          "Open the web editor when you need a quick note during or after a meeting. The split view lets you check the source beside the rendered result, and the Markdown download keeps a copy you can move into your project folder.",
          "Use the desktop app when the notes belong with local project files or need offline access. Local history gives you a few recovery points while you clean up the note after the meeting.",
        ],
      },
    ],
    cta: {
      primary: { href: "/web?utm_source=markdown_meeting_notes_cta&utm_medium=cta", label: "Open Web Editor" },
      secondary: { href: "/docs/markdown-for-developers?utm_source=markdown_meeting_notes_cta&utm_medium=resource", label: "Read Developer Guide" },
    },
  },
  changelog: {
    eyebrow: "Release notes",
    title: "VeloWrite Changelog",
    intro:
      "This changelog lists what shipped in each preview build and what is still planned. Older releases stay below so you can compare versions.",
    updated: "September 1, 2026",
    directory: [
      { label: "0.2.12", href: "#v0212" },
      { label: "0.2.11", href: "#v0211" },
      { label: "0.2.10", href: "#v0210" },
      { label: "0.2.9", href: "#v029" },
      { label: "0.2.8", href: "#v028" },
      { label: "0.2.7", href: "#v027" },
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
        id: "v0212",
        title: "0.2.12 preview",
        body: [
          "Added a practical guide for writing math in Markdown, with inline formulas, block formulas, variable tables, and review checks.",
          "Fixed live preview math styling so expressions such as a^2 + b^2 = c^2 render with visible superscripts instead of flattened text.",
          "Added an Insert math tool that places a reusable formula and variable-table template at the current cursor.",
          "Added Document tools math diagnostics for unmatched inline dollar signs and unclosed block math delimiters.",
          "Expanded automated coverage for math rendering, visible superscripts, formula templates, and math warning states.",
        ],
      },
      {
        id: "v0211",
        title: "0.2.11 preview",
        body: [
          "Added a Windows search-focused guide for opening, viewing, and editing .md files on Windows 11.",
          "Improved the Windows editor page and download page so users can see local files, Open with, recent files, history, and platform support more quickly.",
          "Kept docs, FAQ, llms.txt, sitemap, and static SEO snapshots aligned with the new Windows .md file workflow.",
          "Included recent desktop preview work for multiple document tabs, recent files, quick marks, local history, export readiness, image handling, and long-document editing polish.",
          "Expanded automated coverage around desktop tabs, recent files, PDF export behavior, docs routing, and preview acceptance checks.",
        ],
      },
      {
        id: "v0210",
        title: "0.2.10 preview",
        body: [
          "Added a new long-form docs article for long Markdown drafts, with practical coverage of shortcuts, tables, images, and marks.",
          "Added planned docs topics for daily shortcuts, image handling, table cleanup, and multi-mark navigation.",
          "Upgraded quick marks to three per tab so long drafts can keep more than one return point.",
          "Updated the download page and public release metadata to reflect the new preview build.",
          "Kept the docs and SEO routing in sync so the new long-draft article is rendered in static output.",
          "Fixed quick mark actions so the selected slot is preserved when setting or jumping.",
        ],
      },
      {
        id: "v029",
        title: "0.2.9 preview",
        body: [
          "Added browser-local workspace recovery for multiple Web editor tabs, including each tab's content, active view, and saved draft state.",
          "Added browser-local image embedding for dropped and pasted images, with refresh persistence for supported image sizes.",
          "Added per-tab browser history so compare and restore actions stay attached to the document being edited.",
          "Kept native folders, offline file monitoring, and direct local file saving in the desktop workflow while making the Web editor more complete for browser-only work.",
        ],
      },
      {
        id: "v028",
        title: "0.2.8 preview",
        body: [
          "Added native File > Recent Files access with up to ten recent Markdown documents and a clear action.",
          "Added multiple document tabs with independent writing, split, and preview modes, so open drafts no longer change each other.",
          "Normalized recent-file labels to show readable full paths while keeping the original Windows paths available for opening.",
          "Improved the left-edge workspace tooltip, published the Markdown meeting notes template, and expanded regression coverage for tabs, recent files, and narrow windows.",
        ],
      },
      {
        id: "v027",
        title: "0.2.7 preview",
        body: [
          "Added full Mermaid rendering support in Markdown preview, HTML export, and the dedicated PDF export path.",
          "Improved PDF export so inline math and block equations render as formatted KaTeX output instead of raw Markdown math source.",
          "Added Download Safety guidance so users can verify official sources, version matches, unsigned installer warnings, and first-run checks before installing.",
          "Added update-check status to the desktop About panel so users can see whether the installed build is current or a newer release is available.",
          "Reduced false external-file-change prompts after saving from the desktop app.",
          "Expanded automated coverage for Mermaid, math PDF export, download safety, static SEO pages, and desktop trust UI.",
        ],
      },
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
      "Next work covers document structure, desktop polish, web-to-desktop handoff, export, and the Pro feature path after the free preview is stable.",
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
          "Updated the roadmap status for outline and structure map work to show that the free version now includes the first pass.",
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
          "Added homepage sections explaining privacy, recovery, the public roadmap, and preview limits.",
          "Reworked download preview notes into clearer install safety guidance for official sources, unsigned installer warnings, backups, and web-first evaluation.",
          "Added the macOS Apple Silicon DMG to the download page now that the release asset is available.",
          "Published Local-First Markdown Editing as the sixth staged Markdown library article, covering file ownership, recovery, and local-first sync design.",
          "Expanded the public roadmap with clearer sync and recovery policy notes, while keeping advanced paid-plan framing on the Pro page.",
          "Fixed the web editor tablet and small-desktop layout so the preview no longer clips when the browser is around 834-1024px wide.",
          "Refined the homepage product section, footer link hierarchy, cookie consent banner, mobile landing header, desktop focused editor width, responsive editor toolbar, and documentation code examples.",
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
          "Added the first support for recent files, history snapshots, HTML export, and browser fallback imports.",
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
