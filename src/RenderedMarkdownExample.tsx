import { renderMarkdown } from "./markdown";

type MarkdownExample = {
  label: string;
  markdown: string;
  note: string;
};

export default function RenderedMarkdownExample({ example }: { example: MarkdownExample }) {
  return (
    <div className="content-example">
      <div className="content-example-header">
        <span>{example.label}</span>
      </div>
      <div className="content-example-grid">
        <div className="content-example-panel">
          <strong>Markdown input</strong>
          <pre>{example.markdown}</pre>
        </div>
        <div className="content-example-panel">
          <strong>Rendered preview</strong>
          <div
            className="content-example-preview markdown-body"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(example.markdown) }}
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
