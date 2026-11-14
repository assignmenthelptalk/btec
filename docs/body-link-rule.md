# Body link rule: at most 4 per page

**Every page links to at most 4 other pages of this site from its body.**

## What counts

- The links count if they are inside `<main>`, outside `<aside>`, and point to another page of this site.
- Each target counts once, however many times the page links to it.
- These do not count: the header, nav and footer, the sidebar (`<aside>`), links to the page itself, `#anchors`, `mailto:`, `tel:`, WhatsApp, external links (for example Pearson sources), and links to files such as images and PDFs.

Source citations to Pearson are external, so they never use up a slot.

## Why

The header and footer already send every page to every other page. Body links are the only place the site can say which pages matter, so they are limited to the 4 that a reader most needs next.

## How it is enforced

Every page is now within the limit, so the baseline in `scripts/body-links-baseline.json` is empty. It remains as an allowance list: if a page ever needs to go over 4, the check records how many links it had and blocks any further increase.

```bash
npm run build
npm run check:body-links
```

- `npm run check:body-links` lists every page over 4.
- `npm run check:body-links -- --strict` exits with an error if a page is over 4 and not in the baseline, or has gained links since the baseline. A new page has no baseline, so it must have 4 or fewer.
- After trimming a page, run `npm run check:body-links -- --write-baseline` to lower the baseline. It only ever records pages that are still over 4, so the baseline shrinks to nothing as pages are trimmed.
- `npm run test:body-links` runs the unit tests for the counting rules.

The counting code is in `scripts/body-links-lib.mjs`, and the baseline is `scripts/body-links-baseline.json`.
