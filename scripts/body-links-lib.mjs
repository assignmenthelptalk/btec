// Counts the "body outward links" on a built page: unique internal pages linked
// from inside <main>, excluding <aside>. Header, nav, footer, anchors, mailto,
// tel, WhatsApp, external links and file links do not count.
// The rule and how to use it are in docs/body-link-rule.md.

export const MAX_BODY_LINKS = 4;

const SITE_HOSTS = ['www.btecassignment.help', 'btecassignment.help'];
const BASE = 'https://www.btecassignment.help';
const FILE_EXTENSION = /\.[a-z0-9]{2,5}$/i;
const TOKEN = /<(\/?)(main|aside)\b[^>]*>|<a\b([^>]*)>/gi;

function stripNonContent(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
}

function internalPath(href, pagePath) {
  if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(href)) return null;
  let url;
  try {
    url = new URL(href, BASE + pagePath);
  } catch {
    return null;
  }
  if (!SITE_HOSTS.includes(url.hostname)) return null;
  let path = url.pathname;
  if (FILE_EXTENSION.test(path)) return null;
  if (!path.endsWith('/')) path += '/';
  return path === pagePath ? null : path;
}

/** Returns the sorted, unique internal paths linked from the body of one page. */
export function countBodyLinks(html, pagePath) {
  const targets = new Set();
  const open = { main: 0, aside: 0 };
  const re = new RegExp(TOKEN.source, 'gi');
  const clean = stripNonContent(html);
  let match;
  while ((match = re.exec(clean))) {
    const tag = match[2] && match[2].toLowerCase();
    if (tag) {
      open[tag] = Math.max(0, open[tag] + (match[1] ? -1 : 1));
      continue;
    }
    if (open.main === 0 || open.aside > 0) continue;
    const href = (match[3].match(/href\s*=\s*"([^"]*)"/i) || [])[1];
    const target = internalPath(href, pagePath);
    if (target) targets.add(target);
  }
  return [...targets].sort();
}
