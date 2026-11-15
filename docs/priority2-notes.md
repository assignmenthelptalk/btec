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
- All 38 pages that have a hand-written FAQ use the same unheaded `<section class="faq">` with H3 questions and `FAQPage` microdata. This brief only changes the grading criteria page. The other 37 are reported here, not changed.

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
