// Checks the "max 4 body outward links per page" rule against the built site in dist/.
//
//   npm run check:body-links                 report every page over the limit
//   npm run check:body-links -- --strict     exit 1 if a page is over the limit and
//                                            is not allowed by the baseline, or has
//                                            more links than its baseline allows
//   npm run check:body-links -- --write-baseline
//                                            record today's counts for pages over the
//                                            limit (run after trimming a page to lower it)
//
// Rule and definitions: docs/body-link-rule.md

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { countBodyLinks, MAX_BODY_LINKS } from './body-links-lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');
const baselinePath = join(root, 'scripts', 'body-links-baseline.json');
const args = new Set(process.argv.slice(2));

function builtPages(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return builtPages(full);
    return name === 'index.html' ? [full] : [];
  });
}

function pagePathOf(file) {
  const relative = file.slice(distDir.length).split(sep).join('/');
  return relative.replace(/index\.html$/, '') || '/';
}

function loadBaseline() {
  if (!existsSync(baselinePath)) return {};
  return JSON.parse(readFileSync(baselinePath, 'utf8')).pages ?? {};
}

if (!existsSync(distDir)) {
  console.error('dist/ not found. Run "npm run build" first.');
  process.exit(2);
}

const counts = builtPages(distDir)
  .map((file) => {
    const page = pagePathOf(file);
    return { page, targets: countBodyLinks(readFileSync(file, 'utf8'), page) };
  })
  .sort((a, b) => b.targets.length - a.targets.length || a.page.localeCompare(b.page));

const over = counts.filter((c) => c.targets.length > MAX_BODY_LINKS);

if (args.has('--write-baseline')) {
  const pages = Object.fromEntries(
    over.map((c) => [c.page, c.targets.length]).sort(([a], [b]) => a.localeCompare(b))
  );
  writeFileSync(baselinePath, JSON.stringify({ max: MAX_BODY_LINKS, pages }, null, 2) + '\n');
  console.log(`Baseline written: ${over.length} pages over ${MAX_BODY_LINKS}.`);
  process.exit(0);
}

const baseline = loadBaseline();
const violations = over.filter((c) => c.targets.length > (baseline[c.page] ?? MAX_BODY_LINKS));
const lowerable = Object.entries(baseline).filter(([page, allowed]) => {
  const found = counts.find((c) => c.page === page);
  return !found || found.targets.length < allowed;
});

console.log(`Body outward links (unique internal pages linked from <main>, excluding <aside>). Limit: ${MAX_BODY_LINKS}.`);
console.log(`${counts.length} pages checked, ${counts.length - over.length} within the limit, ${over.length} over it.\n`);
for (const c of over) {
  const allowed = baseline[c.page];
  const note = allowed === undefined ? 'NEW, no baseline' : `baseline ${allowed}`;
  console.log(`${String(c.targets.length).padStart(3)}  ${c.page}  (${note})`);
}
if (lowerable.length) {
  console.log(`\n${lowerable.length} baseline entries are now higher than the page needs. Run with --write-baseline to lower them.`);
}

if (violations.length) {
  console.log(`\n${violations.length} page(s) break the rule: new pages must have ${MAX_BODY_LINKS} or fewer, and existing pages must not gain links.`);
  if (args.has('--strict')) process.exit(1);
} else {
  console.log('\nNo page is over its allowance.');
}
