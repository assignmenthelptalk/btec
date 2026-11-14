# Visual semantics: audit and notes

Branch `feat/visual-semantics`, from `main` at `8e1931e`. Written before any page or component was changed.

The aim: for each visual, the image, its alt text, its caption, its labels and the heading above it all point at the same BTEC entity.

## 1. New image files in `public/`

All five are untracked JPEGs dropped into `public/`. They are left exactly where they are and are not committed. Nothing in the site references them.

| File | Format | Pixels | Size | Which visual | Text, letters or logos? |
|---|---|---|---|---|---|
| `Gemini_Generated_Image_9150rp9150rp9150.jpg` | JPEG, sRGB | 2400 x 1792 | 1,629,685 B | **1. Grade ladder.** Three steps in teal, amber and indigo, each with an empty circle on top and an empty panel inside, and an arrow underneath. | None |
| `Gemini_Generated_Image_yuxecsyuxecsyuxe.jpg` | JPEG, sRGB | 2400 x 1792 | 1,581,373 B | **2. Level pathway.** Four small rising steps with an empty label box above each, a large fifth step, and two arrows leaving it to two empty boxes. | None |
| `Gemini_Generated_Image_vtesgevtesgevtes.jpg` | JPEG, sRGB | 2400 x 1792 | 1,597,944 B | **3. Assessment flow.** Seven empty boxes: four on the top row, then a connector down and three on the bottom row, with a return arrow from the last box up to the third. The sixth box is filled teal. | None |
| `Gemini_Generated_Image_ybftjaybftjaybft.jpg` | JPEG, sRGB | 2400 x 1792 | 1,701,651 B | **4. Subject icons.** A 4 x 3 grid with eleven icons and an empty twelfth cell. | None |
| `Gemini_Generated_Image_y8s9b0y8s9b0y8s9.jpg` | JPEG, sRGB | 2400 x 1792 | 1,674,962 B | **Not one of the five.** A composite sheet of four small sketches (a ladder, a five-chevron pathway, a seven-icon flow strip and a 3 x 3 matrix with icons). | None (symbols only: stars, ticks, document and stamp glyphs) |

No image contains letters, words, numbers or logos, so none was rejected on that ground.

Decisions about the images:

- **Subject icons are one sheet, and they are cleanly separated** (clear white space between every icon). They are sliced into eleven separate icons. The reading order on the sheet matches the site's subject order: Business, Health and Social Care, Engineering, IT, then Sport, Public Services, Childcare and Early Years, Construction, then Art and Design, Travel and Tourism, Media Production.
- **The composite sheet (`y8s9b0...`) is not used.** It duplicates the other four at thumbnail size, and the criteria matrix is meant to be an HTML table with no image. It is left untouched.
- **The flow artwork has a baked-in teal fill on the sixth box.** That would read as a permanent highlight that cannot be turned off, which clashes with the optional "highlight one step" prop. In the optimised copy only, that fill is recoloured to the same pale grey as the neighbouring boxes. The original is unchanged.
- **The flow artwork has a small render glitch** on the right edge of the fourth box (a smeared, white-streaked section of the connector). It is minor at page size. A regenerated image would fix it.
- **The level pathway has five shapes but six slots.** Four label boxes sit above the four small steps. The large fifth step has two arrows leaving it to two boxes. So "Degree top-up or work" is shown as `Degree top-up`, `or`, `work` across those two boxes. In the text list it reads as one label, exactly as written in the brief.

### Optimised copies (`public/images/btec/`)

Made by `scripts/optimise-btec-visuals.mjs`, which uses `sharp`. `sharp` is already installed as an Astro dependency (it is in `package-lock.json` and `node_modules`), so nothing was added to the project. The figures are cropped to their content, and the pale off-white paper colour is stretched to pure white so they sit on white pages.

| Name | Pixels | Before | After |
|---|---|---|---|
| `btec-grade-ladder-pass-merit-distinction.webp` | 1200 x 851 | 1,629,685 B | 11,980 B |
| `btec-level-pathway-level-2-to-level-5.webp` | 1200 x 352 | 1,581,373 B | 11,726 B |
| `btec-assessment-flow-brief-to-resubmission.webp` | 1200 x 718 | 1,597,944 B | 13,002 B |
| `btec-subject-icon-<subject>.webp` (11 files) | 192 x 192 each | one 1,701,651 B sheet | 1,250 to 4,532 B each, 30,458 B in all |

## 2. How the site is built

- Home page: `src/pages/index.astro` builds the page from `site-config.json` and components. The hero is `src/components/Hero.astro`. Its right column is a photo, `/images/hero-student.png` (108,723 B, 600 x 480, eager, `fetchpriority="high"`), with a "UK-Based BTEC Experts" flag badge overlaid on the photo. On screens under 900px the photo moves above the text (`order: -1`).
- The home page "qualification cards" are `QualificationsGrid.astro`. They take an emoji `icon` string from `site-config.json`. There are five cards: BTEC Assignment Help, National, HNC, HND and Business. Only Business is a subject. (The Business card is unlinked since the body-link trim.)
- Inner pages: `src/pages/[...slug].astro` reads `content.json` and the body HTML in `src/content/pages/<slug>.html`, and passes them to `src/components/ServicePage.astro`. The body HTML is injected as raw HTML with `set:html`, so Astro components cannot live inside those `.html` files. The placement therefore happens in `ServicePage.astro`, by splitting the HTML after a named heading.
- 35 of 39 inner pages have a header photo (`/images/header_<slug>.webp`, eager). One page (the resubmission guide) and the assignment brief guide already contain an SVG infographic from `public/infographics/`.

### Named pages

All eight pages named in the brief exist, so none is skipped:

`/btec-grading-system-explained/`, `/how-to-achieve-distinction-in-btec-assignments/`, `/btec-assignment-grading-criteria-explained/`, `/what-is-btec/`, `/btec-higher-national-explained/`, `/how-btec-internal-assessment-works/`, `/btec-assignment-resubmission-guide/`, `/btec-internal-verification-appeal/`.

All eleven subject pages exist as `/btec-<subject>-assignment-help/`.

### Things I noticed and did not change

- `ServicePage.astro` shows "Need expert help with your ATHE assignment?" in the mid-page call to action on every inner page. This is a BTEC site, so "ATHE" looks like a copy-over from another site. Calls to action are out of scope, so it is untouched. Worth fixing separately.
- The hero's "UK-Based BTEC Experts" badge is a trust badge. It stays on the page when the hero photo is replaced.

## 3. What the site already says (the only source for command words and cell text)

**Command words by grade band**

- `/btec-assignment-grading-criteria-explained/`: "In the criteria grids we checked, Pass criteria often ask for descriptions or explanations, Merit criteria for analysis or comparison, and Distinction criteria for evaluation."
- Same page: "Pearson does not tie each verb to one grade band. The unit's own criteria do."
- `/how-to-achieve-distinction-in-btec-assignments/`: "Distinction criteria often start with verbs such as evaluate, assess or justify, though the unit's own grid decides which verb applies."

So the typical command words used are: **Pass: describe, explain. Merit: analyse, compare. Distinction: evaluate, assess, justify.**

**What each band asks and what to show**

- `/btec-assignment-grading-criteria-explained/`: "To achieve a Distinction you must satisfy all the Distinction criteria and all the Pass and Merit criteria, and to achieve a Merit you must satisfy all the Merit criteria and all the Pass criteria. To achieve a Pass you must satisfy all the Pass criteria for the learning aims."
- `/how-to-achieve-distinction-in-btec-assignments/`: "A Pass answer says what something is. A Merit answer says how and why. A Distinction answer usually has to say how far, with what justification, and reach a position the evidence supports."

**Assessment steps**

- `/how-btec-internal-assessment-works/`: "your centre sets the assignment brief, your tutor (the assessor) judges your evidence against the unit's assessment criteria, and the result is recorded and confirmed."
- Same page: "Every assignment must be internally verified after it is submitted, and not only at the end of the unit" and "Your assessor formally records the achievement of each criterion on an assessment record".
- `/btec-assignment-resubmission-guide/`: "Pearson's rules allow one resubmission of evidence for each assignment. It is not automatic".
- `/btec-internal-verification-appeal/`: "An appeal challenges whether the original marking decision was correct. Resubmission is a second attempt at unmet criteria after a unit is not passed".

Gap to be aware of: the site does not describe a "Draft" step as part of Pearson's process. "Draft" is one of the seven labels given in the brief, so it is used, and the caption tells readers to check their own centre's policy.

**Cells with no existing wording:** none. Every cell of the criteria matrix is filled from the sentences above, lightly reworded (for example "A Pass answer says what something is" becomes the cell "What something is."). No command word was added beyond those the site already names.

## 4. Decisions

1. **Colour tokens.** Pass teal `#0F766E`, Merit amber `#B45309`, Distinction indigo `#4338CA`, defined once in `src/styles/btec-visuals.css`. All three pass 4.5:1 on white (5.5, 5.0 and 7.5). They sit next to the words Pass, Merit and Distinction, so colour is never the only signal.
2. **Labels are real HTML**, an ordered list positioned over the empty spaces as percentages of the image. A container query switches each figure to the image with the same list below it when the figure is narrower than 480px (ladder and flow) or 600px (pathway). That is the fallback for 375px screens.
3. **Placement** is configured in `src/data/visuals.ts` by page slug and the exact text of an existing `<h2>`. If a heading is ever renamed, the build fails loudly rather than dropping the visual.
4. **Home hero.** The photo is replaced by the ladder and the pathway, and the "UK-Based BTEC Experts" badge is kept. On small screens the visuals now sit below the headline and buttons, so the heading and calls to action stay in the first screen.
5. **Home cards.** Only the Business card has a matching subject icon. The other four cards (overview, National, HNC, HND) are not subjects, so they keep their emoji.
6. **Subject pages.** The subject's own icon is placed beside the H1 in the page hero. It is decorative (`alt=""`, `aria-hidden`) because the H1 already names the subject.
