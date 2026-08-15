import React from "react";
import { renderMarkdown, renderMermaidDiagrams } from "./markdown";

type MarkdownExample = {
  label: string;
  markdown: string;
  note: string;
};

const exampleMarkdownKey = "velowrite:example-markdown";

export default function RenderedMarkdownExample({ example }: { example: MarkdownExample }) {
  const previewRef = React.useRef<HTMLDivElement>(null);
  const rendered = React.useMemo(() => renderMarkdown(example.markdown, undefined, 1), [example.markdown]);

  React.useEffect(() => {
    if (!previewRef.current) return;
    void renderMermaidDiagrams(previewRef.current);
  }, [rendered]);

  function openInEditor() {
    window.sessionStorage.setItem(exampleMarkdownKey, example.markdown);
    window.location.href = "/web?utm_source=docs_example&utm_medium=cta&example=docs";
  }

  return (
    <div className="content-example">
      <div className="content-example-header">
        <span>{example.label}</span>
        <button type="button" onClick={openInEditor}>
          Try this in VeloWrite
        </button>
      </div>
      <div className="content-example-grid">
        <div className="content-example-panel">
          <strong>Markdown input</strong>
          <pre>{example.markdown}</pre>
        </div>
        <div className="content-example-panel">
          <strong>Rendered preview</strong>
          <div
            ref={previewRef}
            className="content-example-preview markdown-body"
            dangerouslySetInnerHTML={{ __html: rendered }}
          />
        </div>
      </div>
      <p className="content-example-note">
        <strong>Note</strong>
        {example.note}
      </p>
    </div>
  );
}
