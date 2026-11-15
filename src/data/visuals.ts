// Where each visual is placed. Placement is by page slug and the exact text of an existing <h2>:
// the visual is inserted directly under that heading. No heading is added or changed.

export type FlowStep =
  | 'brief'
  | 'draft'
  | 'submit'
  | 'assessor-grades'
  | 'internal-verification'
  | 'result'
  | 'resubmission-or-appeal';

export type PageVisual =
  | { kind: 'ladder'; afterHeading: string }
  | { kind: 'pathway'; afterHeading: string }
  | { kind: 'matrix'; afterHeading: string }
  | { kind: 'flow'; afterHeading: string; highlight: FlowStep };

export const PAGE_VISUALS: Record<string, PageVisual> = {
  'btec-grading-system-explained': {
    kind: 'ladder',
    afterHeading: 'What Pass, Merit, and Distinction Mean at Unit Level',
  },
  'how-to-achieve-distinction-in-btec-assignments': {
    kind: 'ladder',
    afterHeading: 'What Pearson Says Distinction Requires',
  },
  'btec-assignment-grading-criteria-explained': {
    kind: 'matrix',
    afterHeading: 'How BTEC Criterion Codes Work: P, M and D Explained',
  },
  'what-is-btec': {
    kind: 'pathway',
    afterHeading: 'BTEC Qualification Levels Explained: First, National, HNC and HND',
  },
  'btec-higher-national-explained': {
    kind: 'pathway',
    afterHeading: 'Is an HNC or HND a Degree?',
  },
  'how-btec-internal-assessment-works': {
    kind: 'flow',
    afterHeading: 'What Is Internal Verification (IV)?',
    highlight: 'internal-verification',
  },
  'btec-assignment-resubmission-guide': {
    kind: 'flow',
    afterHeading: 'The BTEC Resubmission Process for Internally Assessed Units',
    highlight: 'resubmission-or-appeal',
  },
  'btec-internal-verification-appeal': {
    kind: 'flow',
    afterHeading: 'The BTEC Centre Appeals Process, Step by Step',
    highlight: 'resubmission-or-appeal',
  },
};

// Each subject page shows its own subject's icon beside the H1.
export const SUBJECT_BY_SLUG = {
  'btec-business-assignment-help': 'business',
  'btec-health-and-social-care-assignment-help': 'health-and-social-care',
  'btec-engineering-assignment-help': 'engineering',
  'btec-it-assignment-help': 'it',
  'btec-sport-assignment-help': 'sport',
  'btec-public-services-assignment-help': 'public-services',
  'btec-childcare-and-early-years-assignment-help': 'childcare-and-early-years',
  'btec-construction-assignment-help': 'construction',
  'btec-art-and-design-assignment-help': 'art-and-design',
  'btec-travel-and-tourism-assignment-help': 'travel-and-tourism',
  'btec-media-production-assignment-help': 'media-production',
} as const;

export type SubjectKey = (typeof SUBJECT_BY_SLUG)[keyof typeof SUBJECT_BY_SLUG];

export const SUBJECT_NAMES: Record<SubjectKey, string> = {
  business: 'Business',
  'health-and-social-care': 'Health and Social Care',
  engineering: 'Engineering',
  it: 'IT',
  sport: 'Sport',
  'public-services': 'Public Services',
  'childcare-and-early-years': 'Childcare and Early Years',
  construction: 'Construction',
  'art-and-design': 'Art and Design',
  'travel-and-tourism': 'Travel and Tourism',
  'media-production': 'Media Production',
};
