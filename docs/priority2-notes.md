# Priority 2: broken and inconsistent items

Branch `fix/priority-2-broken-items`, cut from main `27c9b48`. Section 1 is the audit, written before any change.
The audit was run against a fresh build of that commit. Sections 2 onwards are filled in as each item is done.

## 1. Audit (read-only)

### 1a. Anchors and the hero image

- `id="contact"` **exists** on the home page. It is on the "Ready to Level Up Your BTEC Grades?" section (`src/components/FinalCTA.astro:16`). On inner pages it is on the matching closing section (`src/components/ServicePage.astro:262`).
- The three home-page calls that point to `#contact` are: the header button "Get Help Now" (repeated in the mobile menu), the hero button "Get Your Assignment Done", and the closing button "Start Your Order Today" (`site-config.json`: `header.ctaButton`, `hero.primaryCta`, `finalCta.button`).
- **The target is a dead end.** The section holds a heading, one sentence and the button "Start Your Order Today", and that button itself links to `#contact`, so it links to its own section. There is no WhatsApp link, no email and no form in the section. The only contact routes on the home page are the top bar, the header WhatsApp button, the floating WhatsApp button and the footer "Contact" column.
- Inner pages behave the same way. Their `#contact` links (header, hero, mid-page banner, sidebar, closing) all land on the closing section, whose button links to itself.
- `id="how-it-works"` exists (`HowItWorks.astro`, from `howItWorks.sectionId`), and the hero link "See how it works →" points to it.
- The old hero photo `/images/hero-student.png` is no longer referenced by the home page (replaced by the visuals). The file is still in `public/`. The new hero visuals load (200) on the live site.

### 1b. FAQ sections

| Where | Source | Heading levels | Structured data |
|---|---|---|---|
| Home | Component `src/components/FAQ.astro`, fed from `site-config.json` `faq` | H2 "Frequently Asked Questions" **already exists** (`section-heading`). The six questions are `<span>` text inside `<details><summary>`, not headings. | None (no JSON-LD, no microdata) |
| Grading criteria | Hand-written in `src/content/pages/btec-assignment-grading-criteria-explained.html` lines 61-96: a `<section class="faq">` with **no heading**, four `<h3 itemprop="name">` questions | H3 only, no H2 | Yes, `FAQPage` microdata (`itemscope`/`itemprop`), matching the visible text |
| Grading criteria, bold question | Lines 48-50 `<div class="contextual-border">`: `<strong>What is the single most important rule in BTEC criteria?</strong>` with its answer in the same paragraph | Bold text, not a heading | None |
| All inner pages | Site-wide strip in `ServicePage.astro` lines 236-258: H2 "Common Questions", first 4 items of the home FAQ in `<details>` | H2, questions are `<span>` | None |

- The H3 questions are **not nested under "Higher National Grading"**. That section ends at line 59 and the FAQ section follows it with no heading, so it reads as part of "Higher National Grading". It already is the last thing in the article.
- All 39 inner pages have a hand-written FAQ using the same unheaded `<section class="faq">` with H3 questions and `FAQPage` microdata. This brief only changes the grading criteria page. The other 38 are reported here, not changed.

### 1c. ATHE

- The only ATHE text in the site source is `src/components/ServicePage.astro:194`: `<p class="inline-cta__text">Need expert help with your ATHE assignment?</p>`, the mid-page banner.
- It is in the shared inner-page template, so it appears on **39 of 40 built pages** (every inner page; not the home page).
- No content file, `content.json` field or `site-config.json` value mentions ATHE.
- **Every page is Pearson BTEC.** None is about ATHE, so none keeps the mention.

### 1d. Level 2

Mentions (file:line):

- `site-config.json:4` meta description, `:45` header menu "BTEC Level 2", `:122` hero subtext, `:157` stats "L2–L5", `:176` About text, `:189` qualifications subheading, `:194` overview card text, `:359` FAQ answer, `:365` mission, `:377` footer description
- `src/components/About.astro:34` ("Level 2 to Level 5 support") and `:38` ("L2–5")

A Level 2 **page exists**: `/btec-level-2-explained/` (`src/content/pages/btec-level-2-explained.html`). It is linked from the header "Levels" menu. The home page has **no Level 2 card**. The qualifications grid has five cards: overview, National, HNC, HND and Business. The home page body does not link to the Level 2 page. Only the header menu does.

### 1e. Calls to action

Counted on the built pages (content calls, excluding the header, top bar and footer). The floating WhatsApp button is on every page.

| Page | Content calls |
|---|---|
| Home | Hero "Get Your Assignment Done" → `#contact`; hero "See how it works →" → `#how-it-works`; closing "Start Your Order Today" → `#contact` (3 to `#contact`, plus the header "Get Help Now") |
| Grading criteria (guide) | Hero "Get Help Now →"; mid-page "Get Help Now" (with the ATHE sentence); sidebar "Get Help Now"; closing "Start Your Order Today" (4, all `#contact`) |
| What is BTEC (guide) | Same four |
| UCAS points (guide) | Same four |
| Business, HNC (subject and level pages) | Same four |

Counting the header button, its mobile-menu copy, the header and top-bar WhatsApp links, the floating button and the footer WhatsApp link, a guide page has about 12 call-style links.

### 1f. Header and footer links (home page, built)

- **Header:** 19 anchors, 17 distinct internal pages: Home, Assignment Help, What Is BTEC?, BTEC Level 2, National, HNC, HND, five subjects plus All BTEC Subjects, four guides (Grading Criteria Explained, How to Achieve Distinction, Resubmission Guide, BTEC UCAS Points), plus the WhatsApp link and "Get Help Now". The mobile menu repeats these.
- **Footer:** 2 anchors, both in one "Contact" column: `mailto:support@btecassignment.help` and `https://wa.me/447916696894`. **No internal page links.** The Subjects and Grading and Assessment columns no longer exist (removed earlier in the slim-template change).
- WhatsApp is also in the header, so every footer link target is also on the page header. The email is only in the footer.
- Home page internal link instances: **37** (17 distinct). The "about 117" figure in the brief is from before the slim template.
- The header "Guides" menu lists **four** guides, not five.

### 1g. Claims inventory (read-only, nothing changed)

`site-config.json` (home page text, FAQ, testimonials) unless stated.

| Text | Where |
|---|---|
| "100% Plagiarism Free" (hero badge) | `site-config.json:134` |
| "UK-Based BTEC Experts" (hero badge) | `src/components/Hero.astro:74` |
| "qualified writers" | no hit |
| "within 30 minutes" | `site-config.json:319` ("We assign your order to a specialist BTEC writer within 30 minutes.") |
| "fixed prices" | no hit |
| "under 2 minutes" | `site-config.json:369` (closing section: "Get started in under 2 minutes.") |
| "the difference between a Pass and a Distinction" | `site-config.json:365` (mission) |
| "plagiarism free" / "Plagiarism-free" | `site-config.json:342` (FAQ question), `src/components/ServicePage.astro:211` (sidebar trust list on every inner page) |
| "Turnitin originality report included" | `site-config.json:182`, `:234`; FAQ answer `:343` ("run through Turnitin before delivery. You receive a copy of the originality report") |
| "Standard turnaround is 5–7 days." | `site-config.json:347` |
| "On-Time Delivery" badge, "on time, every time" | `site-config.json:138`, `:122` |
| "Monitor your assignment in real-time" | `site-config.json:324` |
| "Absolutely. We never share your personal information…" | `site-config.json:355`; a testimonial "Absolutely worth every penny." `:288` |
| "Expert BTEC Writers" (hero badge), "Expert writers" (sidebar), "Get Expert Help" (sidebar heading), "Expert Guide" (page badge on every non-core page), "Expert support…", "Expert guidance…", "expert guidance" (mission) | `site-config.json:142`, `:189`, `:194`, `:365`; `ServicePage.astro:124`, `:203`, `:214` |
| "specialist writers deliver…" (hero), "BTEC-specialist writers" | `site-config.json:122`, `:179` |
| "An expert reviews the criteria…" | `src/content/pages/` art-and-design:20, assignment-help:60, construction:20, media-production:20, travel-and-tourism:20 |
| H1 includes "Expert": `btec-assignment-help`, `btec-hnd-assignment-help` | `content.json` |
| Testimonials and star ratings | `site-config.json` (Testimonials component) |
| Page-body mentions of Turnitin as a fact about centres (not a claim about this service) | academic-referencing, malpractice policy, assignment brief pages |

None of these were changed in this step.

## 2. Changes

| Item | Commit | What changed |
|---|---|---|
| 0 Audit | `665c3c3` | This file, section 1. |
| 1 Contact anchor | `a0b5da1` | New `src/components/ContactSection.astro`: H2 "Contact us", the existing WhatsApp link ("WhatsApp Us", `https://wa.me/447916696894`) and the existing support email, both read from the footer config. It sits after the closing call to action, above the footer, and now carries `id="contact"`. The id is removed from `FinalCTA.astro` (an id must be unique), so the closing button "Start Your Order Today" now scrolls to the new section. The header, hero and closing `#contact` links all resolve to it. No other copy. |
| 2 FAQ structure | `5eecfa3` | Home: the H2 "Frequently Asked Questions" already existed. Each of the six questions is now an H3 inside its existing `<summary>`; the accordion works as before. Grading criteria: the FAQ section gets the H2 "Frequently Asked Questions". See the detail below about the one bold question that moved. |
| 3 ATHE banner | `edea97a` | Removed the hard-coded banner block from `ServicePage.astro`. 0 built pages contain "ATHE" now. |
| 4 Level 2 | none | Report only, section 5. |
| 5 Calls to action | `c4b8d12` | Sidebar button removed on the 24 informational guide pages (the mid-page banner went with item 3). Grading page: repeated sentence and duplicate link fixed. |
| 6 Footer | none | No change needed, section 6. |
| Follow-up | `d9af2e0` | Found in testing: at 375px the `#how-it-works` heading scrolled in behind the sticky header, so the home page gets `scroll-padding-top: 4rem` (it ships only in the home stylesheet). The home FAQ rows get an explicit visible focus ring. |

### Item 2 detail: grading criteria page

- Added the H2 "Frequently Asked Questions" to the existing `<section class="faq">`. That section was already the last block in the article and was not nested under "Higher National Grading". It only looked like part of it because it had no heading.
- **Moved:** the bold question "What is the single most important rule in BTEC criteria?" was in a boxed callout in the middle of the article (before "Higher National Grading"). It is now the fifth H3 in the FAQ section, with the same wording for question and answer. It was the only bold question on the page.
- **Structured data:** the section already had `FAQPage` microdata. The moved question has matching `Question`/`Answer` microdata, so the section has 5 questions and the visible text and microdata agree. Nothing was added where there was none (the home FAQ has no structured data and still has none).
- Nothing was moved out from under "Higher National Grading", because no FAQ question was there.

### Item 5 detail

- **Which pages count as informational guides:** the 24 inner pages that are neither one of the 11 subject pages nor one of the four Core Service pages (`btec-assignment-help`, `-national-`, `-hnc-`, `-hnd-`). On those, the sidebar button is not rendered. They keep the hero call to action ("Get Help Now →") and the closing one ("Start Your Order Today"), with the same text and target. The sidebar card keeps its heading, blurb and trust list.
- The mid-page banner was the other call to action. It is gone from every inner page (item 3), including the subject and service pages, because it was the ATHE sentence itself and I could not keep the button without changing its text.
- The floating WhatsApp button is untouched. The header and mobile menu are untouched.
- **Grading page, repeated sentence:** "Pearson does not tie each verb to one grade band. The unit's own criteria do." now appears once. In document order the first copy is the note under the criteria table (part of the visuals, which I did not edit) and the second was the opening of the paragraph under "What Pearson Says the Command Verbs Mean". I removed the second.
- **Grading page, external assessment links:** the brief said three. The page has **two** in the article (and none in the sidebar). The first, in "How Criterion-Based Grading Differs from Marks", stays as a link. The second, under "Related reading" in "Higher National Grading", is now plain text.

## 3. Pages that differ from main (`27c9b48`)

Compared page by page, ignoring line endings, whitespace, scoped-style ids and stylesheet file names. For each page, its expected edits were removed from main's HTML first and the rest was compared. 0 unexpected differences.

| Pages | Why |
|---|---|
| `/` (home) | Contact section added, `id="contact"` moved onto it, FAQ questions are now H3, scroll padding and FAQ focus style in the stylesheet. |
| `/btec-assignment-grading-criteria-explained/` | FAQ H2 and fifth H3, callout removed from the middle of the article, repeated sentence removed, duplicate link made plain text, ATHE banner gone, sidebar button gone (guide). |
| 23 other guide pages | ATHE banner removed; sidebar button removed. |
| 15 subject and Core Service pages | ATHE banner removed only. |

That is all 40 built pages: the home page and every inner page differ, none is identical. Titles, meta descriptions, canonicals and structured data are unchanged on all 40.

## 4. Link counts before and after

| | Before | After |
|---|---|---|
| Home page internal link instances | 37 | 37 |
| Site-wide internal link instances | 1666 | 1665 |
| Targets whose number of distinct linking pages changed | | 0 |
| Targets whose total instances changed | | 1: `/btec-external-assessment-explained/` 7 → 6 (the duplicate link on the grading page) |

No page lost or gained a linking page. The header, mobile menu and footer links are unchanged.

## 5. Level 2 (item 4: report only, nothing changed)

- A Level 2 page **exists**: `/btec-level-2-explained/`. It is linked from the header "Levels" menu ("BTEC Level 2").
- The home page mentions Level 2 in the hero text, About section, qualifications subheading and overview card, stats bar ("L2–L5"), FAQ answer, mission and footer description (full list in 1d).
- The home page has **no Level 2 card** in the qualifications grid (overview, National, HNC, HND, Business), and the home page body does not link to the Level 2 page. **Decision for you:** whether to add a Level 2 card or a body link.

## 6. Footer (item 6: no change at first; superseded by section 9, which adds the Qualification Levels column)

- The footer already has one column, "Contact" (support email and WhatsApp), and **no internal page links**. The Subjects and Grading and Assessment columns were removed in the earlier slim-template change, so the footer has fewer links than the target in the brief.
- Adding "Qualification Levels" and five guides would add about nine links and reverse that. I left it unchanged. **Decision for you:** if you want those lists back, note that the header "Guides" menu lists only four guides (Grading Criteria Explained, How to Achieve Distinction, Resubmission Guide, BTEC UCAS Points), so there is no fifth to pick without your choice.
- Every footer link target is also on the page header except the email address.

## 7. Decisions and things to know

1. **`#contact` was not missing, it was a dead end.** The id existed. I moved it onto the new section instead of adding a second id.
2. **(Resolved in section 9, decision 3.) Inner pages still used the old target.** On all 39 inner pages `#contact` is the closing call-to-action section, whose button links to itself. The brief covered only the home page, so I did not add a Contact section there. The footer Contact column sits directly below it. Say if you want the same section on inner pages.
3. **The moved FAQ question** (item 2 detail above) is a judgement call. If you would rather keep the callout where it was, it is one commit to revert.
4. **Sidebar card on guides** keeps its heading ("Get Expert Help"), blurb and trust list; only the button is gone. I did not remove the trust list because the brief says not to change trust badges.
5. **Other FAQ sections (listed in section 10):** 38 other pages have the same unheaded FAQ block (H3 questions with microdata and no H2). Not changed here.
6. **Unused CSS:** the `.inline-cta` rules remain in `ServicePage.astro`, now unused. I removed the markup only.

## 8. Checks run

- Build: 40 pages. Link check across all pages: 984 references, 0 broken, one canonical and one H1 each.
- Body-link rule: 40 of 40 within 4. The 9 body-link tests pass.
- Browser, 375px and desktop: all four `#contact` links and `#how-it-works` scroll to their sections with the heading clear of the sticky header; the FAQ has 6 H3 questions in the accordion, Enter on a focused row opens it, with a visible 3px focus ring; the contact links are focusable and 44px tall; no horizontal overflow on any of the 40 pages at 375px; no console errors apart from the existing Tawk.to widget failing its CORS check on localhost.

## 9. Review decisions (second round)

| Decision | Commit | Result |
|---|---|---|
| 1. Footer: add Qualification Levels back, no guides | `4b520ac` | New footer column "Qualification Levels" with the four level pages: BTEC Level 2, BTEC National, BTEC HNC, BTEC HND (the same labels as the header Levels menu). "What Is BTEC?" is in the header Levels menu but is not a level page, so it is not included. No guides were added. The footer is now two columns, Qualification Levels and Contact, and is identical on all 40 pages. |
| 2. Level 2 | none | No change. No card and no body link were added. The findings in section 5 stand. The one new Level 2 link is the footer link from decision 1 ("all level pages"). |
| 3. Inner-page `#contact` | `6b5b908` | The footer Contact column (email and WhatsApp) now has `id="contact"` on every inner page, with a scroll margin so it clears the sticky header. The closing call-to-action section on inner pages no longer carries the id (an id must be unique). The home page keeps its own "Contact us" section: its footer is told not to set the id (`contactAnchor={false}` in `index.astro`). Every one of the 40 pages has exactly one `id="contact"`. |
| 4. Other FAQ blocks | none | Not changed on this branch. Listed in section 10. |

### Footer link counts (decision 1)

- Distinct linking pages: **0 targets changed**. The header already linked the four level pages from every page.
- Total link instances: Level 2 81 → 120, National 108 → 147, HNC 97 → 136, HND 96 → 135 (+39 each, one from every other page). The external-assessment page is 7 → 6 (the earlier grading-page fix).
- Home page internal link instances: 37 → 41. Site-wide: 1666 → 1821.
- The footer is outside `<main>`, so the body-link rule (4 per page) is unaffected: 40 of 40 within the limit.

### Decision 3 behaviour

- On inner pages the header "Get Help Now", hero "Get Help Now →", sidebar button (where still shown) and closing "Start Your Order Today" all scroll to the footer Contact column. The closing button sits directly above it.
- Tested in a real browser at 375px and 1280px on a guide page, a subject page and the home page: the heading is clear of the sticky header and fully in view, and the page does not scroll sideways at 375px on any of the 40 pages.

## 10. Inner pages with an unheaded FAQ block (for a separate branch)

These 38 pages have a hand-written `<section class="faq">` in their content file with H3 questions and `FAQPage` microdata but **no H2** above the questions, so the questions read as part of whichever section comes before them (last column). The 39th inner page, `/btec-assignment-grading-criteria-explained/`, was fixed on this branch.

**Proposed fix, if you approve it:** add `<h2>Frequently Asked Questions</h2>` as the first child of that section in each of the 38 files in `src/content/pages/`, exactly as on the grading page. Question and answer wording and the microdata would not change. The home page already has this heading and is not in the list.

Unheaded FAQ blocks: 38 of 39 inner pages. Pages with a heading or no block: btec-assignment-grading-criteria-explained (has H2).

| # | Page | Type | H3 questions | `FAQPage` microdata | Heading it currently sits under |
|---|---|---|---|---|---|
| 1 | `/academic-referencing-for-btec-hnc-hnd/` | Guide | 4 | yes | Referencing and Academic Integrity |
| 2 | `/btec-academic-malpractice-policy/` | Guide | 4 | yes | Our Position on Academic Integrity |
| 3 | `/btec-art-and-design-assignment-help/` | Subject | 4 | yes | BTEC Art and Design Within the Wider BTEC Framework |
| 4 | `/btec-assignment-brief-how-to-read-and-interpret-it/` | Guide | 4 | yes | When the Assignment Brief Is Unclear: What Students Can Do |
| 5 | `/btec-assignment-help/` | Core Service | 4 | yes | BTEC vs A-Level: Understanding the Assessment Difference |
| 6 | `/btec-assignment-help-international-students/` | Guide | 4 | yes | Studying BTEC as an International Student in the UK |
| 7 | `/btec-assignment-help-mature-students/` | Guide | 4 | yes | Funding Support for Adult BTEC Learners |
| 8 | `/btec-assignment-resubmission-guide/` | Guide | 4 | yes | BTEC Resubmission and Academic Integrity |
| 9 | `/btec-assignment-submission-rules/` | Guide | 3 | yes | If Something Goes Wrong After Submission |
| 10 | `/btec-business-assignment-help/` | Subject | 4 | yes | Progression and Registration Dates |
| 11 | `/btec-childcare-and-early-years-assignment-help/` | Subject | 4 | yes | Progression and Registration Dates |
| 12 | `/btec-construction-assignment-help/` | Subject | 4 | yes | BTEC Construction and Related Technical Subjects |
| 13 | `/btec-engineering-assignment-help/` | Subject | 4 | yes | Progression and Registration Dates |
| 14 | `/btec-external-assessment-explained/` | Guide | 4 | yes | Preparing for a Pearson-Set External Assessment |
| 15 | `/btec-grading-system-explained/` | Guide | 4 | yes | BTEC Grade Combinations by Qualification Size |
| 16 | `/btec-health-and-social-care-assignment-help/` | Subject | 4 | yes | Progression and Registration Dates |
| 17 | `/btec-higher-national-explained/` | Guide | 4 | yes | Referencing at Higher National Level |
| 18 | `/btec-hnc-assignment-help/` | Core Service | 4 | yes | Progression from the HNC |
| 19 | `/btec-hnd-assignment-help/` | Core Service | 4 | yes | Progression from the HND |
| 20 | `/btec-internal-verification-appeal/` | Guide | 4 | yes | Appeal vs Resubmission: What's the Difference? |
| 21 | `/btec-it-assignment-help/` | Subject | 4 | yes | Progression and Registration Dates |
| 22 | `/btec-level-2-explained/` | Guide | 3 | yes | Before You Rely on This Page |
| 23 | `/btec-media-production-assignment-help/` | Subject | 4 | yes | BTEC Media Production and Related Creative Subjects |
| 24 | `/btec-national-assignment-help/` | Core Service | 4 | yes | Progressing from BTEC National to Higher Nationals |
| 25 | `/btec-public-services-assignment-help/` | Subject | 4 | yes | Progression from BTEC National Uniformed Protective Services |
| 26 | `/btec-sport-assignment-help/` | Subject | 4 | yes | Progression and Registration Dates |
| 27 | `/btec-subjects-list/` | Guide | 4 | yes | How to Check Your Own Qualification |
| 28 | `/btec-travel-and-tourism-assignment-help/` | Subject | 4 | yes | BTEC Travel and Tourism and Its Overlap With BTEC Business |
| 29 | `/btec-ucas-points/` | Guide | 4 | yes | Where BTEC and A-Level Points Diverge in Practice |
| 30 | `/btec-uniformed-public-services-vs-public-services/` | Guide | 4 | yes | Getting Help With Your Public Services Assignments |
| 31 | `/btec-vs-a-level/` | Guide | 4 | yes | Subject Availability: What You Can (and Can't) Study on Each Route |
| 32 | `/btec-vs-nvq/` | Guide | 4 | yes | NVQ Today: Apprenticeship Standards and Vocational Related Qualifications |
| 33 | `/careers-after-btec/` | Guide | 4 | yes | Grades and Your Options |
| 34 | `/how-btec-internal-assessment-works/` | Guide | 4 | yes | If You Think Something Went Wrong |
| 35 | `/how-to-achieve-distinction-in-btec-assignments/` | Guide | 4 | yes | Distinction on External Units and Higher Nationals |
| 36 | `/pearson-btec-examiner-feedback-reports/` | Guide | 4 | yes | Preparing for BTEC External Assessment With This in Mind |
| 37 | `/universities-that-accept-btec/` | Guide | 4 | yes | Your BTEC Grades and UCAS Points |
| 38 | `/what-is-btec/` | Guide | 4 | yes | How BTEC Compares to A-Levels |
