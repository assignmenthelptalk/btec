// Makes the optimised WebP copies of the BTEC visual artwork in public/images/btec/.
//
//   node scripts/optimise-btec-visuals.mjs <folder holding the original Gemini JPGs>
//
// The originals are only read, never changed or moved. The script uses sharp, which is already
// installed as an Astro dependency, so nothing new is added to the project.
//
// Crop boxes are written in the coordinates of the 2213 x 1652 preview of each 2400 x 1792 original
// (multiply by 2400 / 2213 to get original pixels). Label positions in the components are
// percentages of these crops, so changing a crop means re-checking the labels.

import { mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const SRC = process.argv[2] ?? 'public';
const OUT = 'public/images/btec';
const SCALE = 2400 / 2213;
const WEBP = { quality: 82, effort: 6 };

const FILES = {
  ladder: 'Gemini_Generated_Image_9150rp9150rp9150.jpg',
  flow: 'Gemini_Generated_Image_vtesgevtesgevtes.jpg',
  icons: 'Gemini_Generated_Image_ybftjaybftjaybft.jpg',
  pathway: 'Gemini_Generated_Image_yuxecsyuxecsyuxe.jpg',
};

// Crop boxes: [left, top, right, bottom] in preview coordinates.
export const CROPS = {
  ladder: [230, 275, 1985, 1520],
  pathway: [70, 520, 2150, 1130],
  flow: [110, 215, 2140, 1430],
};

const OUTPUT_WIDTH = { ladder: 1200, pathway: 1200, flow: 1200 };

const NAMES = {
  ladder: 'btec-grade-ladder-pass-merit-distinction',
  pathway: 'btec-level-pathway-level-2-to-level-5',
  flow: 'btec-assessment-flow-brief-to-resubmission',
};

// Subject icons, in the order they sit on the sheet (row by row), with the preview box of each.
export const ICONS = [
  ['business', [135, 155, 470, 455]],
  ['health-and-social-care', [670, 155, 1010, 450]],
  ['engineering', [1205, 135, 1545, 470]],
  ['it', [1745, 180, 2080, 430]],
  ['sport', [155, 655, 450, 995]],
  ['public-services', [700, 655, 980, 995]],
  ['childcare-and-early-years', [1205, 675, 1545, 980]],
  ['construction', [1745, 700, 2080, 950]],
  ['art-and-design', [135, 1180, 470, 1510]],
  ['travel-and-tourism', [670, 1190, 1010, 1500]],
  ['media-production', [1205, 1180, 1545, 1510]],
];
const ICON_SIZE = 192;
const ICON_MARGIN = 38;

const region = ([l, t, r, b]) => ({
  left: Math.round(l * SCALE),
  top: Math.round(t * SCALE),
  width: Math.round((r - l) * SCALE),
  height: Math.round((b - t) * SCALE),
});

const report = [];
async function save(pipeline, name, originalPath) {
  const file = join(OUT, name + '.webp');
  const info = await pipeline.webp(WEBP).toFile(file);
  report.push({ name: name + '.webp', width: info.width, height: info.height, bytes: info.size, original: originalPath });
}

// Pale off-white paper colour of the artwork. Stretching it to pure white lets the icons sit on white cards.
const whiten = (img) => img.linear(255 / 252, 0);

async function figure(key) {
  const original = join(SRC, FILES[key]);
  return sharp(original).extract(region(CROPS[key])).resize({ width: OUTPUT_WIDTH[key] });
}

mkdirSync(OUT, { recursive: true });

await save(whiten(await figure('ladder')), NAMES.ladder, FILES.ladder);
await save(whiten(await figure('pathway')), NAMES.pathway, FILES.pathway);

// Assessment flow: the artwork bakes a teal fill into the sixth box ("Result"). That would read as a
// permanent highlight, so the fill is swapped for the same pale grey as the neighbouring boxes.
{
  const { data, info } = await (await figure('flow')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const grey = [238, 239, 245];
  let swapped = 0;
  for (let i = 0; i < data.length; i += 3) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    if (g - r > 55 && b - r > 55 && g > 90) {
      data[i] = grey[0]; data[i + 1] = grey[1]; data[i + 2] = grey[2];
      swapped++;
    }
  }
  const img = sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } });
  await save(whiten(img), NAMES.flow, FILES.flow);
  report.push({ note: `flow: ${swapped} teal pixels recoloured to pale grey` });
}

// Subject icons: the sheet has clear white space between icons, so each one is cut out separately,
// squared with even padding and resized.
for (const [subject, box] of ICONS) {
  const r = region(box);
  const side = Math.max(r.width, r.height) + Math.round(ICON_MARGIN * SCALE * 2);
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const left = Math.max(0, Math.round(cx - side / 2));
  const top = Math.max(0, Math.round(cy - side / 2));
  const pipeline = sharp(join(SRC, FILES.icons))
    .extract({ left, top, width: Math.min(side, 2400 - left), height: Math.min(side, 1792 - top) })
    .resize(ICON_SIZE, ICON_SIZE, { fit: 'contain', background: '#fdfdfb' });
  await save(whiten(pipeline), `btec-subject-icon-${subject}`, FILES.icons);
}

for (const row of report) {
  if (row.note) console.log(row.note);
  else console.log(`${String(row.bytes).padStart(7)} B  ${row.width}x${row.height}  ${row.name}  <- ${row.original} (${statSync(join(SRC, row.original)).size} B)`);
}
