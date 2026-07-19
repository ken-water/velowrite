# Markdown in VeloWrite

Use this guide as a quick visual reference. Each section shows what you type on the Markdown side and what VeloWrite turns it into in the preview.

## Beginner

### 1. Headings Create Structure

Headings make long documents easy to scan. VeloWrite also uses them to build the outline in the left sidebar.

<div class="example-grid">
  <div class="example-card source-card">
    <div class="example-title">Type this</div>
    <pre><code># Product Notes
## Goals
### This Week</code></pre>
  </div>
  <div class="example-card preview-card">
    <div class="example-title">VeloWrite preview</div>
    <div class="mini-preview">
      <h1>Product Notes</h1>
      <h2>Goals</h2>
      <h3>This Week</h3>
    </div>
  </div>
</div>

### 2. Paragraphs, Bold, Italic, And Inline Code

Plain text stays readable. Add emphasis only when it helps the reader.

<div class="example-grid">
  <div class="example-card source-card">
    <div class="example-title">Type this</div>
    <pre><code>This is a normal paragraph.

This is **important**.
This is *subtle emphasis*.
Use `inline code` for commands or values.</code></pre>
  </div>
  <div class="example-card preview-card">
    <div class="example-title">VeloWrite preview</div>
    <div class="mini-preview">
      <p>This is a normal paragraph.</p>
      <p>This is <strong>important</strong>.</p>
      <p>This is <em>subtle emphasis</em>.</p>
      <p>Use <code>inline code</code> for commands or values.</p>
    </div>
  </div>
</div>

### 3. Lists And Checklists

Lists are ideal for notes, todos, meeting summaries, and release checklists.

<div class="example-grid">
  <div class="example-card source-card">
    <div class="example-title">Type this</div>
    <pre><code>- Draft the outline
- Review the examples
- Export the final document

1. Open VeloWrite
2. Write in split mode
3. Save or export

- [x] First draft
- [ ] Final review</code></pre>
  </div>
  <div class="example-card preview-card">
    <div class="example-title">VeloWrite preview</div>
    <div class="mini-preview">
      <ul>
        <li>Draft the outline</li>
        <li>Review the examples</li>
        <li>Export the final document</li>
      </ul>
      <ol>
        <li>Open VeloWrite</li>
        <li>Write in split mode</li>
        <li>Save or export</li>
      </ol>
      <ul class="task-list">
        <li>[x] First draft</li>
        <li>[ ] Final review</li>
      </ul>
    </div>
  </div>
</div>

### 4. Links And Images

Links are rendered as clickable text. Image syntax stays portable across Markdown tools.

<div class="example-grid">
  <div class="example-card source-card">
    <div class="example-title">Type this</div>
    <pre><code>[Open VeloWrite](https://velowrite.app)

![Editor screenshot](./images/editor.png)</code></pre>
  </div>
  <div class="example-card preview-card">
    <div class="example-title">VeloWrite preview</div>
    <div class="mini-preview">
      <p><a href="https://velowrite.app">Open VeloWrite</a></p>
      <div class="image-placeholder">Editor screenshot</div>
    </div>
  </div>
</div>

## Intermediate

### 5. Tables

Tables help with product specs, comparison notes, plans, and release decisions.

<div class="example-grid">
  <div class="example-card source-card">
    <div class="example-title">Type this</div>
    <pre><code>| Task | Web Editor | Desktop App |
| --- | --- | --- |
| Quick draft | Instant start | Native app |
| Save | Download copy | Direct local save |
| Recovery | Browser draft | Local history |</code></pre>
  </div>
  <div class="example-card preview-card">
    <div class="example-title">VeloWrite preview</div>
    <table>
      <thead>
        <tr><th>Task</th><th>Web Editor</th><th>Desktop App</th></tr>
      </thead>
      <tbody>
        <tr><td>Quick draft</td><td>Instant start</td><td>Native app</td></tr>
        <tr><td>Save</td><td>Download copy</td><td>Direct local save</td></tr>
        <tr><td>Recovery</td><td>Browser draft</td><td>Local history</td></tr>
      </tbody>
    </table>
  </div>
</div>

### 6. Quotes And Callouts

Blockquotes are useful for decisions, references, and comments.

<div class="example-grid">
  <div class="example-card source-card">
    <div class="example-title">Type this</div>
    <pre><code>> Keep quick drafts in the browser.
> Move serious files to desktop.</code></pre>
  </div>
  <div class="example-card preview-card">
    <div class="example-title">VeloWrite preview</div>
    <blockquote>
      <p>Keep quick drafts in the browser.<br />Move serious files to desktop.</p>
    </blockquote>
  </div>
</div>

### 7. Code Blocks

Add a language name after the opening fence for syntax highlighting.

<div class="example-grid">
  <div class="example-card source-card">
    <div class="example-title">Type this</div>
    <pre><code>```python
def summarize(items):
    return len(items)

print(summarize(["draft", "review"]))
```</code></pre>
  </div>
  <div class="example-card preview-card">
    <div class="example-title">VeloWrite preview</div>
    <pre><code>def summarize(items):
    return len(items)

print(summarize(["draft", "review"]))</code></pre>
  </div>
</div>

### 8. Math

VeloWrite renders inline and block math with KaTeX.

<div class="example-grid">
  <div class="example-card source-card">
    <div class="example-title">Type this</div>
    <pre><code>Inline math: $E = mc^2$.

$$
\int_0^\infty e^{-x^2}\,dx = \frac{\sqrt{\pi}}{2}
$$</code></pre>
  </div>
  <div class="example-card preview-card">
    <div class="example-title">VeloWrite preview</div>
    <p>Inline math: [[MATHINLINE:E = mc^2]].</p>
    <div>[[MATHDISPLAY:\int_0^\infty e^{-x^2}\,dx = \frac{\sqrt{\pi}}{2}]]</div>
  </div>
</div>

## Advanced

### 9. Multi-Language Code Tabs

When VeloWrite sees consecutive Python, Bash, Java, and JavaScript code fences, it groups them into a tabbed preview. This is useful for API docs, tutorials, and release notes that compare languages.

<div class="example-grid">
  <div class="example-card source-card">
    <div class="example-title">Type this</div>
    <pre><code>```python
print("hello")
```
```bash
echo "hello"
```
```java
System.out.println("hello");
```
```javascript
console.log("hello");
```</code></pre>
  </div>
  <div class="example-card preview-card">
    <div class="example-title">VeloWrite preview</div>
    <div class="tab-preview">
      <div class="tab-row">
        <span class="active-tab">Python</span>
        <span>Bash</span>
        <span>Java</span>
        <span>JavaScript</span>
      </div>
      <pre><code>print("hello")</code></pre>
    </div>
    <p class="small-note">Click a tab in VeloWrite to switch language without scrolling through four separate code blocks.</p>
  </div>
</div>

### 10. Mermaid Diagram Source

Mermaid source stays readable in Markdown. Diagram rendering is planned, and VeloWrite currently keeps the source visible and portable.

<div class="example-grid">
  <div class="example-card source-card">
    <div class="example-title">Type this</div>
    <pre><code>```mermaid
flowchart LR
  Draft --> Preview
  Preview --> Export
  Export --> Share
```</code></pre>
  </div>
  <div class="example-card preview-card">
    <div class="example-title">VeloWrite preview today</div>
    <pre><code>flowchart LR
  Draft --> Preview
  Preview --> Export
  Export --> Share</code></pre>
    <p class="small-note">Future versions will focus on richer diagram rendering.</p>
  </div>
</div>

### 11. Outline Navigation

Use headings for long documents. The outline lets you jump to a section, and VeloWrite keeps the editor and preview aligned.

<div class="workflow-preview">
  <div class="outline-mini">
    <strong>Outline</strong>
    <span>Product Notes</span>
    <span>Goals</span>
    <span class="selected">This Week</span>
    <span>Launch Checklist</span>
  </div>
  <div class="editor-mini">
    <strong>Markdown editor</strong>
    <pre><code>## Goals

### This Week

- Fix close behavior
- Improve PDF guide
- Ship preview build</code></pre>
  </div>
  <div class="preview-mini">
    <strong>Rendered preview</strong>
    <h3>This Week</h3>
    <ul>
      <li>Fix close behavior</li>
      <li>Improve PDF guide</li>
      <li>Ship preview build</li>
    </ul>
  </div>
</div>

### 12. Recommended VeloWrite Workflow

Use the browser editor for quick drafts. Use the desktop app for real local files, offline work, recent documents, and recoverable local history.

1. Start in split mode so source and preview stay visible.
2. Use headings early so the outline becomes useful.
3. Use tables for decisions and code blocks for technical details.
4. Export HTML or download Markdown when sharing from the web editor.
5. Move important files to the desktop app for native save and history snapshots.

Try it online: https://velowrite.app/web

Download desktop preview: https://velowrite.app/download
