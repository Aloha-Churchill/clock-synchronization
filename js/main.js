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

  setupScrollSpy(headings);
}

function setupScrollSpy(headings) {
  if (!headings.length) return;

  const tocLinks = document.querySelectorAll('#toc-list a');

  function setActive(id) {
    tocLinks.forEach((a) => {
      const isActive = a.getAttribute('href') === '#' + id;
      a.classList.toggle('toc-active', isActive);
    });
  }

  // Track which headings are visible; highlight the topmost one.
  const visible = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visible.add(entry.target.id);
        } else {
          visible.delete(entry.target.id);
        }
      });

      // Pick the heading that appears first in document order.
      let activeId = null;
      headings.forEach((h) => {
        if (visible.has(h.id) && activeId === null) activeId = h.id;
      });

      // If nothing visible (scrolled past all), keep the last heading before viewport.
      if (!activeId) {
        const scrollY = window.scrollY + window.innerHeight / 2;
        let best = null;
        headings.forEach((h) => {
          if (h.getBoundingClientRect().top + window.scrollY <= scrollY) best = h.id;
        });
        activeId = best;
      }

      if (activeId) setActive(activeId);
    },
    { rootMargin: '0px 0px -60% 0px', threshold: 0 }
  );

  headings.forEach((h) => observer.observe(h));
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
