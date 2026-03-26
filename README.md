# Clock Synchronization

An educational page about clock synchronization in distributed systems,
deployed as a GitHub Pages project site at
`https://username.github.io/clock-synchronization/`.

## Editing content

Edit `content.md`. It supports:

- Standard markdown (headings, lists, code blocks, links)
- Math via KaTeX: inline `$...$` and display `$$...$$`
- Interactive widget embeds: `::artifact[filename.html]{height=400}`

## Adding an artifact

1. Save Claude's HTML output as a single `.html` file in `artifacts/`.
   The file must be fully self-contained (inline `<style>` and `<script>`,
   no external references).
2. Embed it in `content.md`:
   ```
   ::artifact[your-widget.html]{height=400}
   ```

## Previewing locally

A local HTTP server is required (`fetch` does not work over `file://`):

```bash
python3 -m http.server
# or
npx serve .
```

Then open `http://localhost:8000`.

## Deploying to GitHub Pages

1. Push to the `main` branch of a repo named `clock-synchronization`.
2. Go to **Settings → Pages → Source**: Deploy from branch → `main` / `/(root)`.
3. The site will be live at `https://username.github.io/clock-synchronization/`.

No build step required — everything runs client-side via CDN.
