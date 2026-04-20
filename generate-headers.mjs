import sharp from 'sharp';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { resolve } from 'path';

const OUT = 'public/images';
const W = 1200, H = 400;

// Shared BTEC brand colours
const PRIMARY   = '#0D2B6B';
const DARK      = '#091E4A';
const DARKER    = '#06122E';
const ACCENT    = '#F97316';
const GOLD      = '#F59E0B';
const FONT      = "Inter,'Segoe UI',Arial,sans-serif";

// ─── shared SVG helpers ────────────────────────────────────────────────────
function base(glowX, accentCircle1, accentCircle2, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${PRIMARY}"/>
      <stop offset="60%" stop-color="${DARK}"/>
      <stop offset="100%" stop-color="${DARKER}"/>
    </linearGradient>
    <radialGradient id="glow" cx="${glowX}%" cy="50%" r="44%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <filter id="sh" x="-10%" y="-10%" width="130%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.22"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <g opacity="0.035" stroke="#fff" stroke-width="1" fill="none">
    <line x1="0" y1="80" x2="${W}" y2="80"/><line x1="0" y1="160" x2="${W}" y2="160"/>
    <line x1="0" y1="240" x2="${W}" y2="240"/><line x1="0" y1="320" x2="${W}" y2="320"/>
    <line x1="200" y1="0" x2="200" y2="${H}"/><line x1="400" y1="0" x2="400" y2="${H}"/>
    <line x1="600" y1="0" x2="600" y2="${H}"/>
  </g>
  <circle cx="80" cy="80" r="140" fill="none" stroke="${ACCENT}" stroke-width="1" opacity="0.07"/>
  <circle cx="80" cy="80" r="210" fill="none" stroke="${ACCENT}" stroke-width="1" opacity="0.04"/>
  ${accentCircle1}${accentCircle2}
  ${content}
  <rect x="0" y="392" width="${W}" height="8" fill="${ACCENT}" opacity="0.5"/>
  <rect x="0" y="394" width="460" height="6" fill="${ACCENT}"/>
</svg>`;
}

function badge(label) {
  const w = label.length * 7.2 + 28;
  return `<rect x="60" y="52" width="${w}" height="28" rx="14" fill="${ACCENT}"/>
  <text x="${60 + w/2}" y="71" font-family="${FONT}" font-size="11" font-weight="700" fill="#fff" text-anchor="middle" letter-spacing="0.08em">${label}</text>`;
}

function headline(line1, line2, sub) {
  return `<text x="60" y="122" font-family="${FONT}" font-size="34" font-weight="800" fill="#fff" letter-spacing="-0.02em">${line1}</text>
  <text x="60" y="158" font-family="${FONT}" font-size="34" font-weight="800" fill="${ACCENT}" letter-spacing="-0.02em">${line2}</text>
  <text x="60" y="192" font-family="${FONT}" font-size="15" fill="rgba(255,255,255,0.68)">${sub}</text>`;
}

function gradeBadges(y = 268) {
  return `<g transform="translate(60,${y})">
    <rect x="0" y="0" width="90" height="34" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <text x="45" y="12" font-family="${FONT}" font-size="8" font-weight="600" fill="rgba(255,255,255,0.45)" text-anchor="middle" letter-spacing="0.06em">GRADE</text>
    <text x="45" y="27" font-family="${FONT}" font-size="13" font-weight="700" fill="rgba(255,255,255,0.82)" text-anchor="middle">Pass</text>
    <rect x="100" y="0" width="90" height="34" rx="8" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.35)" stroke-width="1"/>
    <text x="145" y="12" font-family="${FONT}" font-size="8" font-weight="600" fill="rgba(245,158,11,0.6)" text-anchor="middle" letter-spacing="0.06em">GRADE</text>
    <text x="145" y="27" font-family="${FONT}" font-size="13" font-weight="700" fill="${GOLD}" text-anchor="middle">Merit</text>
    <rect x="200" y="0" width="116" height="34" rx="8" fill="rgba(249,115,22,0.15)" stroke="rgba(249,115,22,0.4)" stroke-width="1"/>
    <text x="258" y="12" font-family="${FONT}" font-size="8" font-weight="600" fill="rgba(249,115,22,0.6)" text-anchor="middle" letter-spacing="0.06em">GRADE</text>
    <text x="258" y="27" font-family="${FONT}" font-size="13" font-weight="700" fill="${ACCENT}" text-anchor="middle">Distinction</text>
  </g>`;
}

function card(x, y, label, line1, line2, sub, highlight = false) {
  const fill   = highlight ? `rgba(249,115,22,0.10)` : `rgba(255,255,255,0.07)`;
  const stroke = highlight ? `rgba(249,115,22,0.28)`  : `rgba(255,255,255,0.12)`;
  const col2   = highlight ? ACCENT : '#fff';
  return `<g transform="translate(${x},${y})" filter="url(#sh)">
    <rect width="200" height="80" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="1"/>
    <text x="16" y="26" font-family="${FONT}" font-size="9" font-weight="700" fill="rgba(249,115,22,0.8)" letter-spacing="0.08em">${label}</text>
    <text x="16" y="44" font-family="${FONT}" font-size="13" font-weight="700" fill="#fff">${line1}</text>
    <text x="16" y="60" font-family="${FONT}" font-size="13" font-weight="700" fill="${col2}">${line2}</text>
    <text x="16" y="74" font-family="${FONT}" font-size="10" fill="rgba(255,255,255,0.5)">${sub}</text>
  </g>`;
}

function pills(startX, startY, items) {
  let out = `<g transform="translate(${startX},${startY})">`;
  let xOff = 0;
  items.forEach(({ label, accent }) => {
    const w = label.length * 7 + 24;
    const fill   = accent ? `rgba(249,115,22,0.15)` : `rgba(255,255,255,0.07)`;
    const stroke = accent ? `rgba(249,115,22,0.35)` : `rgba(255,255,255,0.14)`;
    const col    = accent ? ACCENT : `rgba(255,255,255,0.80)`;
    out += `<rect x="${xOff}" y="0" width="${w}" height="26" rx="13" fill="${fill}" stroke="${stroke}" stroke-width="1"/>
    <text x="${xOff + w/2}" y="17" font-family="${FONT}" font-size="10" font-weight="500" fill="${col}" text-anchor="middle">${label}</text>`;
    xOff += w + 10;
  });
  return out + '</g>';
}

function ticks(items, x = 730, y = 368) {
  let out = `<g transform="translate(${x},${y})" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.72)">`;
  items.forEach(([t, col2 = false], i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    out += `<text x="${col * 224}" y="${row * 18 + 16}"><tspan fill="${ACCENT}" font-weight="700">✓ </tspan>${t}</text>`;
  });
  return out + '</g>';
}

function divider(y) {
  return `<line x1="714" y1="${y}" x2="1168" y2="${y}" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>`;
}

function sectionLabel(text, y) {
  return `<text x="730" y="${y}" font-family="${FONT}" font-size="9" font-weight="700" fill="rgba(255,255,255,0.38)" letter-spacing="0.1em">${text}</text>`;
}

// ═══════════════════════════════════════════════════════════════════
// PAGE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════

const pages = [

  // 1 ── Health & Social Care
  {
    slug: 'btec-health-and-social-care-assignment-help',
    alt: 'BTEC Health and Social Care Assignment Help — expert guidance for National, HNC and HND',
    title: 'BTEC Health and Social Care Assignment Help',
    svg: base('72',
      `<circle cx="1160" cy="340" r="110" fill="none" stroke="${ACCENT}" stroke-width="1" opacity="0.06"/>`,
      '',
      badge('PEARSON BTEC · ALL LEVELS') +
      headline('Health &amp; Social Care', 'Assignment Help', 'Criterion-specific guidance · National · HNC · HND') +
      `<g transform="translate(60,212)">
        <rect x="0" y="0" width="100" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="50" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="rgba(255,255,255,0.88)" text-anchor="middle">National L3</text>
        <text x="109" y="20" font-family="${FONT}" font-size="13" fill="rgba(249,115,22,0.8)" text-anchor="middle">→</text>
        <rect x="118" y="0" width="70" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="153" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="rgba(255,255,255,0.88)" text-anchor="middle">HNC L4</text>
        <text x="197" y="20" font-family="${FONT}" font-size="13" fill="rgba(249,115,22,0.8)" text-anchor="middle">→</text>
        <rect x="206" y="0" width="70" height="30" rx="6" fill="rgba(249,115,22,0.18)" stroke="${ACCENT}" stroke-width="1"/>
        <text x="241" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="${ACCENT}" text-anchor="middle">HND L5</text>
      </g>` +
      gradeBadges(268) +
      `<g transform="translate(60,332)">
        <text x="0" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">All Internal</text>
        <text x="0" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">No external exams</text>
        <line x1="106" y1="0" x2="106" y2="38" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="120" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">1 Resub</text>
        <text x="120" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Per referred unit</text>
        <line x1="230" y1="0" x2="230" y2="38" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="244" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">24/7</text>
        <text x="244" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Expert support</text>
      </g>` +
      card(730, 44, 'UNIT 1', 'Human Lifespan', 'Development', 'PIES · Theories · Factors') +
      card(946, 44, 'SAFEGUARDING', 'Care Act 2014', 'MCA · Children Acts', 'Legislation + procedures', true) +
      card(730, 142, 'REFLECTIVE', 'Gibbs\' Cycle', 'Distinction Evidence', '6 stages · Self-evaluation') +
      card(946, 142, 'ANATOMY', 'Body Systems', 'HNC / HND Level', 'Homeostasis + pathophysiology') +
      divider(246) +
      sectionLabel('KEY THEORIES ASSESSED', 272) +
      pills(730, 282, [
        { label: 'Bowlby' }, { label: 'Piaget' }, { label: 'Vygotsky' },
        { label: 'Bronfenbrenner' }, { label: 'Person-Centred', accent: true }
      ]) +
      divider(356) +
      ticks(['Criterion-mapped guidance', 'Harvard ref (HNC+)', 'Case study support', 'Resubmission help'])
    )
  },

  // 2 ── Engineering
  {
    slug: 'btec-engineering-assignment-help',
    alt: 'BTEC Engineering Assignment Help — Mechanical, Electrical, Civil and Manufacturing guidance',
    title: 'BTEC Engineering Assignment Help',
    svg: base('70',
      `<circle cx="1160" cy="330" r="110" fill="none" stroke="${ACCENT}" stroke-width="1" opacity="0.06"/>`,
      '',
      badge('BTEC PEARSON · ENGINEERING') +
      headline('Engineering', 'Assignment Help', 'Lab reports · Calculations · Design justification') +
      `<g transform="translate(60,212)">
        <rect x="0" y="0" width="108" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="54" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="rgba(255,255,255,0.88)" text-anchor="middle">Mechanical</text>
        <rect x="116" y="0" width="94" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="163" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="rgba(255,255,255,0.88)" text-anchor="middle">Electrical</text>
        <rect x="218" y="0" width="62" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="249" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="rgba(255,255,255,0.88)" text-anchor="middle">Civil</text>
        <rect x="288" y="0" width="122" height="30" rx="6" fill="rgba(249,115,22,0.18)" stroke="${ACCENT}" stroke-width="1"/>
        <text x="349" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="${ACCENT}" text-anchor="middle">Manufacturing</text>
      </g>` +
      gradeBadges(268) +
      `<g transform="translate(60,332)">
        <text x="0" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">National</text>
        <text x="0" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Level 3</text>
        <line x1="88" y1="0" x2="88" y2="38" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="102" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">HNC L4</text>
        <text x="102" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Harvard referencing req.</text>
        <line x1="242" y1="0" x2="242" y2="38" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="256" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">HND L5</text>
        <text x="256" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Research project included</text>
      </g>` +
      card(730, 44, 'LAB REPORTS', 'Practical Evidence', 'Full Working Shown', 'Method · Results · Analysis') +
      card(946, 44, 'CALCULATIONS', 'Step-by-Step', 'With Interpretation', 'Correct units · Merit context', true) +
      card(730, 142, 'DESIGN WORK', 'Technical Drawings', 'BS / ISO Standard', 'Specification · Justification') +
      card(946, 142, 'PRINCIPLES', 'Statics · Dynamics', 'Thermodynamics', 'Electrical · Materials') +
      divider(246) + sectionLabel('EVERY ORDER INCLUDES', 272) +
      ticks(['Full working for all calcs', 'BS/ISO notation', 'Distinction error analysis', 'Harvard ref (HNC+)'])
    )
  },

  // 3 ── IT
  {
    slug: 'btec-it-assignment-help',
    alt: 'BTEC IT Assignment Help — Programming, Networking, Database and Cybersecurity guidance',
    title: 'BTEC IT Assignment Help',
    svg: base('70',
      `<circle cx="1160" cy="330" r="110" fill="none" stroke="${ACCENT}" stroke-width="1" opacity="0.06"/>`,
      '',
      badge('BTEC PEARSON · INFORMATION TECHNOLOGY') +
      headline('IT &amp; Computing', 'Assignment Help', 'Programming · Networking · Databases · Cybersecurity') +
      `<g transform="translate(60,212)">
        <rect x="0" y="0" width="100" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="50" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="rgba(255,255,255,0.88)" text-anchor="middle">National L3</text>
        <text x="109" y="20" font-family="${FONT}" font-size="13" fill="rgba(249,115,22,0.8)" text-anchor="middle">→</text>
        <rect x="118" y="0" width="94" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="165" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="rgba(255,255,255,0.88)" text-anchor="middle">HNC Computing</text>
        <text x="221" y="20" font-family="${FONT}" font-size="13" fill="rgba(249,115,22,0.8)" text-anchor="middle">→</text>
        <rect x="230" y="0" width="96" height="30" rx="6" fill="rgba(249,115,22,0.18)" stroke="${ACCENT}" stroke-width="1"/>
        <text x="278" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="${ACCENT}" text-anchor="middle">HND Computing</text>
      </g>` +
      gradeBadges(268) +
      `<g transform="translate(60,332)">
        <text x="0" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">Code+</text>
        <text x="0" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Working code + analysis</text>
        <line x1="90" y1="0" x2="90" y2="38" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="104" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">Test Plans</text>
        <text x="104" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Valid · invalid · boundary</text>
        <line x1="238" y1="0" x2="238" y2="38" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="252" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">24/7</text>
        <text x="252" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Expert support</text>
      </g>` +
      card(730, 44, 'PROGRAMMING', 'Working Code', 'OOP + Evaluation', 'Python · Java · C#') +
      card(946, 44, 'NETWORKING', 'Design + Config', 'Security Analysis', 'OSI · TCP/IP · Subnetting', true) +
      card(730, 142, 'DATABASES', 'ER Diagrams', 'SQL + Normalisation', '1NF · 2NF · 3NF covered') +
      card(946, 142, 'CYBERSECURITY', 'Threat Analysis', 'ISO 27001 · NIST', 'Frameworks + policies') +
      divider(246) + sectionLabel('EVERY ORDER INCLUDES', 272) +
      ticks(['Working + annotated code', 'Formal test plans', 'Network diagrams + config', 'Harvard ref (HNC+)'])
    )
  },

  // 4 ── Sport
  {
    slug: 'btec-sport-assignment-help',
    alt: 'BTEC Sport Assignment Help — Anatomy, Fitness, Coaching and Performance Analysis guidance',
    title: 'BTEC Sport Assignment Help',
    svg: base('70',
      `<circle cx="1160" cy="330" r="110" fill="none" stroke="${ACCENT}" stroke-width="1" opacity="0.06"/>`,
      '',
      badge('BTEC PEARSON · SPORT SCIENCE') +
      headline('Sport &amp; Exercise Science', 'Assignment Help', 'Anatomy · Fitness · Coaching · Performance Analysis') +
      `<g transform="translate(60,212)">
        <rect x="0" y="0" width="106" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="53" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="rgba(255,255,255,0.88)" text-anchor="middle">National L3</text>
        <text x="115" y="20" font-family="${FONT}" font-size="13" fill="rgba(249,115,22,0.8)" text-anchor="middle">→</text>
        <rect x="124" y="0" width="94" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="171" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="rgba(255,255,255,0.88)" text-anchor="middle">HNC Sport</text>
        <text x="227" y="20" font-family="${FONT}" font-size="13" fill="rgba(249,115,22,0.8)" text-anchor="middle">→</text>
        <rect x="236" y="0" width="94" height="30" rx="6" fill="rgba(249,115,22,0.18)" stroke="${ACCENT}" stroke-width="1"/>
        <text x="283" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="${ACCENT}" text-anchor="middle">HND Sport</text>
      </g>` +
      gradeBadges(268) +
      `<g transform="translate(60,332)">
        <text x="0" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">External</text>
        <text x="0" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">A&amp;P exam — no resub</text>
        <line x1="94" y1="0" x2="94" y2="38" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="108" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">FITT</text>
        <text x="108" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Training programme support</text>
        <line x1="242" y1="0" x2="242" y2="38" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="256" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">24/7</text>
        <text x="256" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Expert support</text>
      </g>` +
      card(730, 44, 'ANATOMY &amp; PHYSIOLOGY', 'External Exam', 'Command Word Guide', 'Describe · Analyse · Evaluate') +
      card(946, 44, 'FITNESS', 'Training Programmes', 'FITT + Periodisation', 'VO2 max · Normative data', true) +
      card(730, 142, 'COACHING', 'Session Plans', 'SMARTER Objectives', 'Autocratic · Democratic') +
      card(946, 142, 'PERFORMANCE', 'Match Analysis', 'Notation Systems', 'Stats + athlete profiling') +
      divider(246) + sectionLabel('KEY ENERGY SYSTEMS COVERED', 272) +
      pills(730, 282, [
        { label: 'ATP-PC' }, { label: 'Glycolytic' }, { label: 'Aerobic', accent: true },
        { label: 'VO2 max' }, { label: 'Cardiac Output' }
      ]) +
      divider(356) +
      ticks(['A&amp;P exam technique prep', 'Periodised programmes', 'Coaching session plans', 'Performance notation'])
    )
  },

  // 5 ── Public Services
  {
    slug: 'btec-public-services-assignment-help',
    alt: 'BTEC Public Services Assignment Help — Police, Fire, Army, NHS and Civil Service guidance',
    title: 'BTEC Public Services Assignment Help',
    svg: base('70',
      `<circle cx="1160" cy="330" r="110" fill="none" stroke="${ACCENT}" stroke-width="1" opacity="0.06"/>`,
      '',
      badge('BTEC PEARSON · PUBLIC SERVICES') +
      headline('Public Services', 'Assignment Help', 'Government · Citizenship · Discipline · Crime') +
      `<g transform="translate(60,212)">
        <rect x="0" y="0" width="60" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="30" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="rgba(255,255,255,0.88)" text-anchor="middle">Police</text>
        <rect x="68" y="0" width="60" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="98" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="rgba(255,255,255,0.88)" text-anchor="middle">Fire</text>
        <rect x="136" y="0" width="64" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="168" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="rgba(255,255,255,0.88)" text-anchor="middle">Army</text>
        <rect x="208" y="0" width="56" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="236" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="rgba(255,255,255,0.88)" text-anchor="middle">NHS</text>
        <rect x="272" y="0" width="100" height="30" rx="6" fill="rgba(249,115,22,0.18)" stroke="${ACCENT}" stroke-width="1"/>
        <text x="322" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="${ACCENT}" text-anchor="middle">Civil Service</text>
      </g>` +
      gradeBadges(268) +
      `<g transform="translate(60,332)">
        <text x="0" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">All Internal</text>
        <text x="0" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">No external exams</text>
        <line x1="106" y1="0" x2="106" y2="38" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="120" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">PACE · EQA</text>
        <text x="120" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Legislation expertise</text>
        <line x1="258" y1="0" x2="258" y2="38" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="272" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">24/7</text>
        <text x="272" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Expert support</text>
      </g>` +
      card(730, 44, 'GOVERNMENT', 'Policies &amp; the', 'Public Services', 'Parliament · Devolution') +
      card(946, 44, 'CITIZENSHIP', 'Diversity &amp; Equality', 'Equality Act 2010', 'Protected characteristics', true) +
      card(730, 142, 'CRIME', 'Criminology Theory', 'Merton · Becker · Hirschi', 'Criminal justice process') +
      card(946, 142, 'DISCIPLINE', 'Physical Fitness', 'Service Standards', 'PFT · Leadership styles') +
      divider(246) + sectionLabel('KEY LEGISLATION COVERED', 272) +
      pills(730, 282, [
        { label: 'PACE 1984' }, { label: 'Equality Act 2010' }, { label: 'HRA 1998', accent: true },
        { label: 'Children Act' }, { label: 'Crime &amp; Disorder Act' }
      ]) +
      divider(356) +
      ticks(['Legislation analysis', 'Criminology theory app.', 'Distinction evaluations', 'Physical fitness support'])
    )
  },

  // 6 ── Grading Criteria
  {
    slug: 'btec-assignment-grading-criteria-explained',
    alt: 'BTEC Assignment Grading Criteria Explained — Pass Merit Distinction criterion codes and verb taxonomy',
    title: 'BTEC Grading Criteria Explained',
    svg: base('70',
      `<circle cx="1160" cy="330" r="110" fill="none" stroke="${ACCENT}" stroke-width="1" opacity="0.06"/>`,
      '',
      badge('BTEC PEARSON · GRADING GUIDE') +
      headline('BTEC Grading Criteria', 'Fully Explained', 'P · M · D criterion codes · Verb taxonomy · Referral rules') +
      `<g transform="translate(60,212)">
        <rect x="0" y="0" width="54" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="27" y="20" font-family="${FONT}" font-size="14" font-weight="700" fill="rgba(255,255,255,0.88)" text-anchor="middle">P1</text>
        <rect x="62" y="0" width="54" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="89" y="20" font-family="${FONT}" font-size="14" font-weight="700" fill="rgba(255,255,255,0.88)" text-anchor="middle">P2</text>
        <text x="129" y="20" font-family="${FONT}" font-size="13" fill="rgba(249,115,22,0.8)" text-anchor="middle">→</text>
        <rect x="138" y="0" width="54" height="30" rx="6" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.4)" stroke-width="1"/>
        <text x="165" y="20" font-family="${FONT}" font-size="14" font-weight="700" fill="${GOLD}" text-anchor="middle">M1</text>
        <rect x="200" y="0" width="54" height="30" rx="6" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.4)" stroke-width="1"/>
        <text x="227" y="20" font-family="${FONT}" font-size="14" font-weight="700" fill="${GOLD}" text-anchor="middle">M2</text>
        <text x="267" y="20" font-family="${FONT}" font-size="13" fill="rgba(249,115,22,0.8)" text-anchor="middle">→</text>
        <rect x="276" y="0" width="54" height="30" rx="6" fill="rgba(249,115,22,0.18)" stroke="${ACCENT}" stroke-width="1"/>
        <text x="303" y="20" font-family="${FONT}" font-size="14" font-weight="700" fill="${ACCENT}" text-anchor="middle">D1</text>
        <rect x="338" y="0" width="54" height="30" rx="6" fill="rgba(249,115,22,0.18)" stroke="${ACCENT}" stroke-width="1"/>
        <text x="365" y="20" font-family="${FONT}" font-size="14" font-weight="700" fill="${ACCENT}" text-anchor="middle">D2</text>
      </g>` +
      `<rect x="60" y="256" width="320" height="38" rx="8" fill="rgba(255,50,50,0.12)" stroke="rgba(255,80,80,0.35)" stroke-width="1"/>
      <text x="220" y="271" font-family="${FONT}" font-size="11" font-weight="700" fill="#FCA5A5" text-anchor="middle">⚠ CRITICAL RULE</text>
      <text x="220" y="286" font-family="${FONT}" font-size="10" fill="rgba(255,255,255,0.72)" text-anchor="middle">1 missed Pass criterion = Referral, regardless of Distinction quality</text>` +
      `<g transform="translate(60,316)">
        <text x="0" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">No Marks</text>
        <text x="0" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Criteria only — binary</text>
        <line x1="106" y1="0" x2="106" y2="38" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="120" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">No Comp.</text>
        <text x="120" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">No compensatory marking</text>
        <line x1="270" y1="0" x2="270" y2="38" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="284" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">Verb</text>
        <text x="284" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Determines grade level</text>
      </g>` +
      card(730, 44, 'PASS VERBS', 'Describe · Identify', 'Explain · Outline', 'Knowledge + comprehension') +
      card(946, 44, 'MERIT VERBS', 'Analyse · Compare', 'Discuss · Justify', 'Analysis + justification', true) +
      card(730, 142, 'DISTINCTION VERBS', 'Evaluate · Appraise', 'Synthesise · Assess', 'Evaluation + synthesis') +
      card(946, 142, 'REFERRAL RULES', '1 Resubmission', 'Internal only', 'External = resit only') +
      divider(246) + sectionLabel('COGNITIVE LEVELS (BLOOM\'S TAXONOMY)', 272) +
      pills(730, 282, [
        { label: 'Remember' }, { label: 'Understand' }, { label: 'Apply' },
        { label: 'Analyse' }, { label: 'Evaluate', accent: true }, { label: 'Create', accent: true }
      ]) +
      divider(356) +
      ticks(['Criterion-by-criterion mapping', 'Verb-level guidance', 'Referral gap analysis', 'Resubmission support'])
    )
  },

  // 7 ── How to Achieve Distinction
  {
    slug: 'how-to-achieve-distinction-in-btec-assignments',
    alt: 'How to Achieve Distinction in BTEC Assignments — evaluation depth, sourcing and structural strategy',
    title: 'How to Achieve Distinction in BTEC',
    svg: base('70',
      `<circle cx="1160" cy="330" r="110" fill="none" stroke="${ACCENT}" stroke-width="1" opacity="0.06"/>`,
      '',
      badge('BTEC DISTINCTION GUIDE') +
      headline('How to Achieve', 'Distinction in BTEC', 'Evaluation depth · Academic sourcing · Structural strategy') +
      `<g transform="translate(60,212)">
        <rect x="0" y="0" width="60" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="30" y="20" font-family="${FONT}" font-size="12" font-weight="600" fill="rgba(255,255,255,0.88)" text-anchor="middle">National</text>
        <text x="69" y="20" font-family="${FONT}" font-size="13" fill="rgba(249,115,22,0.8)" text-anchor="middle">→</text>
        <rect x="78" y="0" width="56" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="106" y="20" font-family="${FONT}" font-size="12" font-weight="600" fill="rgba(255,255,255,0.88)" text-anchor="middle">HNC</text>
        <text x="143" y="20" font-family="${FONT}" font-size="13" fill="rgba(249,115,22,0.8)" text-anchor="middle">→</text>
        <rect x="152" y="0" width="56" height="30" rx="6" fill="rgba(249,115,22,0.18)" stroke="${ACCENT}" stroke-width="1"/>
        <text x="180" y="20" font-family="${FONT}" font-size="12" font-weight="600" fill="${ACCENT}" text-anchor="middle">HND</text>
      </g>` +
      gradeBadges(258) +
      `<g transform="translate(60,316)">
        <text x="0" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">Evaluate</text>
        <text x="0" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Don't just describe or analyse</text>
        <line x1="106" y1="0" x2="106" y2="38" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="120" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">Justify</text>
        <text x="120" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Evidence every claim</text>
        <line x1="218" y1="0" x2="218" y2="38" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="232" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">Synthesise</text>
        <text x="232" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Multi-source argument</text>
      </g>` +
      card(730, 44, '1. EVALUATION', 'Weigh Evidence', 'Reach a Verdict', 'Don\'t just present both sides') +
      card(946, 44, '2. CRITERION COVER', 'Every P · M · D', 'Explicitly Met', 'Missing 1 P = Referral', true) +
      card(730, 142, '3. ACADEMIC SOURCES', 'Harvard References', 'Journals + Textbooks', 'Mandatory at HNC+') +
      card(946, 142, '4. RECOMMENDATIONS', 'Specific + Evidenced', 'From your analysis only', 'No generic advice') +
      divider(246) + sectionLabel('5 PILLARS OF DISTINCTION', 272) +
      pills(730, 282, [
        { label: 'Evaluation' }, { label: 'Criterion Cover' }, { label: 'Academic Sources' },
        { label: 'Synthesis' }, { label: 'Recommendations', accent: true }
      ]) +
      divider(356) +
      ticks(['Verb-by-verb D guidance', 'Harvard referencing', 'Subject-specific strategy', 'Pre-submission checking'])
    )
  },

  // 8 ── Resubmission Guide
  {
    slug: 'btec-assignment-resubmission-guide',
    alt: 'BTEC Assignment Resubmission Guide — referral process, targeted brief and external resit',
    title: 'BTEC Resubmission Guide',
    svg: base('70',
      `<circle cx="1160" cy="330" r="110" fill="none" stroke="${ACCENT}" stroke-width="1" opacity="0.06"/>`,
      '',
      badge('BTEC RESUBMISSION GUIDE') +
      headline('BTEC Resubmission', 'Complete Guide', 'Referral rules · Targeted brief · External resit process') +
      `<g transform="translate(60,212)">
        <rect x="0" y="0" width="80" height="30" rx="6" fill="rgba(255,80,80,0.15)" stroke="rgba(255,80,80,0.35)" stroke-width="1"/>
        <text x="40" y="20" font-family="${FONT}" font-size="11" font-weight="700" fill="#FCA5A5" text-anchor="middle">Referral</text>
        <text x="89" y="20" font-family="${FONT}" font-size="13" fill="rgba(249,115,22,0.8)" text-anchor="middle">→</text>
        <rect x="98" y="0" width="100" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="148" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="rgba(255,255,255,0.88)" text-anchor="middle">Targeted Brief</text>
        <text x="207" y="20" font-family="${FONT}" font-size="13" fill="rgba(249,115,22,0.8)" text-anchor="middle">→</text>
        <rect x="216" y="0" width="100" height="30" rx="6" fill="rgba(249,115,22,0.18)" stroke="${ACCENT}" stroke-width="1"/>
        <text x="266" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="${ACCENT}" text-anchor="middle">Resubmission</text>
        <text x="325" y="20" font-family="${FONT}" font-size="13" fill="rgba(249,115,22,0.8)" text-anchor="middle">→</text>
        <rect x="334" y="0" width="60" height="30" rx="6" fill="rgba(22,163,74,0.18)" stroke="rgba(22,163,74,0.4)" stroke-width="1"/>
        <text x="364" y="20" font-family="${FONT}" font-size="11" font-weight="700" fill="#86EFAC" text-anchor="middle">Pass ✓</text>
      </g>` +
      `<rect x="60" y="256" width="340" height="38" rx="8" fill="rgba(255,50,50,0.10)" stroke="rgba(255,80,80,0.3)" stroke-width="1"/>
      <text x="230" y="271" font-family="${FONT}" font-size="10" font-weight="700" fill="#FCA5A5" text-anchor="middle">ONE RESUBMISSION ONLY — Internal assessment units</text>
      <text x="230" y="286" font-family="${FONT}" font-size="10" fill="rgba(255,255,255,0.68)" text-anchor="middle">External assessment = resit in next Pearson window (no resubmission)</text>` +
      `<g transform="translate(60,316)">
        <text x="0" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">Targeted</text>
        <text x="0" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Only unmet criteria</text>
        <line x1="94" y1="0" x2="94" y2="38" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="108" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">1 Attempt</text>
        <text x="108" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">No third chance</text>
        <line x1="234" y1="0" x2="234" y2="38" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="248" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">Same Year</text>
        <text x="248" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Cannot carry over</text>
      </g>` +
      card(730, 44, 'STEP 1', 'Referral Issued', 'Unmet P Criteria', 'Tutor confirms which') +
      card(946, 44, 'STEP 2', 'Targeted Brief', 'Issued by Tutor', 'Specific criteria only', true) +
      card(730, 142, 'STEP 3', 'Write Response', 'Address Gap Only', 'Do not redo whole work') +
      card(946, 142, 'EXTERNAL UNITS', 'No Resubmission', 'Pearson Resit Only', 'Jan/Feb or May/Jun window') +
      divider(246) + sectionLabel('RESUBMISSION SUCCESS STRATEGY', 272) +
      pills(730, 282, [
        { label: 'Read tutor feedback' }, { label: 'Identify verb gap' },
        { label: 'Target brief only', accent: true }, { label: 'Pre-submit check' }
      ]) +
      divider(356) +
      ticks(['Referral gap analysis', 'Targeted brief guidance', 'External resit prep', 'Grade ceiling advice'])
    )
  },

  // 9 ── Assignment Brief
  {
    slug: 'btec-assignment-brief-how-to-read-and-interpret-it',
    alt: 'How to Read and Interpret a BTEC Assignment Brief — sections, criteria grid and 5-step strategy',
    title: 'How to Read Your BTEC Assignment Brief',
    svg: base('70',
      `<circle cx="1160" cy="330" r="110" fill="none" stroke="${ACCENT}" stroke-width="1" opacity="0.06"/>`,
      '',
      badge('BTEC ASSIGNMENT BRIEF GUIDE') +
      headline('How to Read Your', 'BTEC Assignment Brief', 'Unit info · Criteria grid · Task instructions · 5-step strategy') +
      `<g transform="translate(60,212)">
        <rect x="0" y="0" width="90" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="45" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="rgba(255,255,255,0.88)" text-anchor="middle">Unit Header</text>
        <text x="99" y="20" font-family="${FONT}" font-size="13" fill="rgba(249,115,22,0.8)" text-anchor="middle">→</text>
        <rect x="108" y="0" width="74" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="145" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="rgba(255,255,255,0.88)" text-anchor="middle">LOs</text>
        <text x="191" y="20" font-family="${FONT}" font-size="13" fill="rgba(249,115,22,0.8)" text-anchor="middle">→</text>
        <rect x="200" y="0" width="100" height="30" rx="6" fill="rgba(249,115,22,0.18)" stroke="${ACCENT}" stroke-width="1"/>
        <text x="250" y="20" font-family="${FONT}" font-size="11" font-weight="700" fill="${ACCENT}" text-anchor="middle">Criteria Grid ★</text>
        <text x="309" y="20" font-family="${FONT}" font-size="13" fill="rgba(249,115,22,0.8)" text-anchor="middle">→</text>
        <rect x="318" y="0" width="90" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="363" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="rgba(255,255,255,0.88)" text-anchor="middle">Tasks</text>
      </g>` +
      gradeBadges(258) +
      `<g transform="translate(60,316)">
        <text x="0" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">Read Criteria</text>
        <text x="0" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Grid first — always</text>
        <line x1="120" y1="0" x2="120" y2="38" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="134" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">Highlight</text>
        <text x="134" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Every verb in brief</text>
        <line x1="244" y1="0" x2="244" y2="38" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="258" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">Checklist</text>
        <text x="258" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Every P · M · D code</text>
      </g>` +
      card(730, 44, 'STEP 1', 'Read Criteria Grid', 'Before Task Page', 'Know what is marked first') +
      card(946, 44, 'STEP 2', 'Highlight Verbs', 'In Every Criterion', 'Describe vs Evaluate', true) +
      card(730, 142, 'STEP 3', 'Criterion Checklist', 'P1 · M1 · D1 codes', 'Tick off as you write') +
      card(946, 142, 'STEPS 4–5', 'Map to Tasks', 'Pre-submit Check', 'Can you point to each?') +
      divider(246) + sectionLabel('BRIEF SECTIONS EXPLAINED', 272) +
      pills(730, 282, [
        { label: 'Unit Header' }, { label: 'Learning Outcomes' }, { label: 'Criteria Grid', accent: true },
        { label: 'Task Instructions' }, { label: 'Submission Req.' }
      ]) +
      divider(356) +
      ticks(['Brief anatomy walkthrough', 'Verb identification', 'Criterion mapping', 'Pre-submission checklist'])
    )
  },

  // 10 ── Childcare
  {
    slug: 'btec-childcare-and-early-years-assignment-help',
    alt: 'BTEC Childcare and Early Years Assignment Help — EYFS, child development theory and observation methods',
    title: 'BTEC Childcare and Early Years Assignment Help',
    svg: base('70',
      `<circle cx="1160" cy="330" r="110" fill="none" stroke="${ACCENT}" stroke-width="1" opacity="0.06"/>`,
      '',
      badge('BTEC PEARSON · CHILDCARE &amp; EARLY YEARS') +
      headline('Childcare &amp; Early Years', 'Assignment Help', 'EYFS · Child Development · Safeguarding · Observation') +
      `<g transform="translate(60,212)">
        <rect x="0" y="0" width="100" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="50" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="rgba(255,255,255,0.88)" text-anchor="middle">National L3</text>
        <text x="109" y="20" font-family="${FONT}" font-size="13" fill="rgba(249,115,22,0.8)" text-anchor="middle">→</text>
        <rect x="118" y="0" width="90" height="30" rx="6" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
        <text x="163" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="rgba(255,255,255,0.88)" text-anchor="middle">CPLD Diploma</text>
        <text x="217" y="20" font-family="${FONT}" font-size="13" fill="rgba(249,115,22,0.8)" text-anchor="middle">→</text>
        <rect x="226" y="0" width="96" height="30" rx="6" fill="rgba(249,115,22,0.18)" stroke="${ACCENT}" stroke-width="1"/>
        <text x="274" y="20" font-family="${FONT}" font-size="11" font-weight="600" fill="${ACCENT}" text-anchor="middle">Early Years L5</text>
      </g>` +
      gradeBadges(268) +
      `<g transform="translate(60,332)">
        <text x="0" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">All Internal</text>
        <text x="0" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">No external exams</text>
        <line x1="106" y1="0" x2="106" y2="38" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="120" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">EYFS 2021</text>
        <text x="120" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Statutory framework</text>
        <line x1="242" y1="0" x2="242" y2="38" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="256" y="16" font-family="${FONT}" font-size="19" font-weight="800" fill="${ACCENT}">24/7</text>
        <text x="256" y="33" font-family="${FONT}" font-size="11" fill="rgba(255,255,255,0.5)">Expert support</text>
      </g>` +
      card(730, 44, 'CHILD DEVELOPMENT', 'Piaget · Vygotsky', 'Bowlby · Bronfenbrenner', 'PIES model · 0–8 years') +
      card(946, 44, 'SAFEGUARDING', 'Children Act 2004', 'Working Together 2018', 'Disclosure procedures', true) +
      card(730, 142, 'EYFS FRAMEWORK', '7 Areas of Learning', 'Prime + Specific', 'COEL · Observation cycle') +
      card(946, 142, 'OBSERVATION', 'Narrative · Time Sample', 'Event Sample · Sociogram', 'Analyse + evaluate method') +
      divider(246) + sectionLabel('KEY THEORIES ASSESSED', 272) +
      pills(730, 282, [
        { label: 'Piaget' }, { label: 'Vygotsky' }, { label: 'Bowlby' },
        { label: 'Bronfenbrenner' }, { label: 'Parten', accent: true }, { label: 'Gibbs', accent: true }
      ]) +
      divider(356) +
      ticks(['Theory application guide', 'EYFS 2021 analysis', 'Safeguarding legislation', 'Observation write-ups'])
    )
  }
];

// ═══════════════════════════════════════════════════════════════════
// GENERATE WEBP FILES
// ═══════════════════════════════════════════════════════════════════
async function run() {
  for (const { slug, alt, svg } of pages) {
    const outPath = resolve(OUT, `header_${slug}.webp`);
    await sharp(Buffer.from(svg), { density: 150 })
      .resize(W, H)
      .webp({ quality: 92, effort: 6 })
      .toFile(outPath);
    console.log(`✓ ${slug}.webp`);
  }
  console.log('\nAll header images generated.');
}

run().catch(e => { console.error(e); process.exit(1); });
