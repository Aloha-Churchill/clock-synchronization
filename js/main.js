function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Replace ::artifact[file.html]{height=N} with iframe HTML before marked sees it.
// Double newlines ensure marked treats the block as an HTML block, not a paragraph.
function preprocessArtifacts(md) {
  return md.replace(
    /::artifact\[([^\]]+)\]\{([^}]*)\}/g,
    (_, filename, attrs) => {
      const m = attrs.match(/height=(\d+)/);
      const height = m ? m[1] : '400';
      return (
        '\n\n<div class="artifact-container">' +
        `<iframe src="artifacts/${filename}" height="${height}"></iframe>` +
        '</div>\n\n'
      );
    }
  );
}

// Protect math spans from marked's inline processing (underscores, backslashes).
// Replace $...$ and $$...$$ with placeholders, restore after marked runs.
function extractMath(md) {
  const stash = [];

  // Display math first ($$...$$), including multiline
  let out = md.replace(/\$\$([\s\S]*?)\$\$/g, (match) => {
    stash.push(match);
    return `MATHSTASH${stash.length - 1}DISPLAY`;
  });

  // Inline math ($...$) — single line only, non-greedy
  out = out.replace(/\$([^$\n]+?)\$/g, (match) => {
    stash.push(match);
    return `MATHSTASH${stash.length - 1}INLINE`;
  });

  return { out, stash };
}

function restoreMath(html, stash) {
  return html.replace(/MATHSTASH(\d+)(DISPLAY|INLINE)/g, (_, idx) => stash[+idx]);
}

function buildTOC(contentEl) {
  const headings = contentEl.querySelectorAll('h2, h3');
  const list = document.getElementById('toc-list');

  headings.forEach((h) => {
    const id = slugify(h.textContent);
    h.id = id;

    const li = document.createElement('li');
    li.className = h.tagName.toLowerCase();

    const a = document.createElement('a');
    a.href = '#' + id;
    a.textContent = h.textContent;

    li.appendChild(a);
    list.appendChild(li);
  });
}

async function init() {
  const contentEl = document.getElementById('content');
  try {
    const res = await fetch('content.md');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.text();

    const { out: mathProtected, stash } = extractMath(raw);
    const withArtifacts = preprocessArtifacts(mathProtected);
    const renderedHtml = marked.parse(withArtifacts);
    const finalHtml = restoreMath(renderedHtml, stash);

    contentEl.innerHTML = finalHtml;

    buildTOC(contentEl);

    renderMathInElement(contentEl, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ],
      throwOnError: false,
    });
  } catch (err) {
    contentEl.innerHTML =
      '<p class="error">Could not load <code>content.md</code>. ' +
      'A local HTTP server is required (fetch does not work over <code>file://</code>). ' +
      'Run <code>python3 -m http.server</code> or <code>npx serve .</code> in this directory.</p>';
    console.error(err);
  }
}

init();
