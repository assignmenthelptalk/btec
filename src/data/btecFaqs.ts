/**
 * btecFaqs.ts
 * Source of truth for the BTEC FAQ hub (/btec-faqs/) and every FAQ page (/btec-faqs/<slug>/).
 *
 * To add a FAQ: add one entry to FAQS below, then run `npm run build`.
 *  - `answer` is published word for word. Keep it as one paragraph; the page splits it
 *    into shorter paragraphs without changing any word.
 *  - `slug` should match the question, so the URL matches what students type.
 *  - `guides` are the contextual links to existing site pages. Keep them to 2 or fewer:
 *    each FAQ page links to at most 4 pages in its body (docs/body-link-rule.md),
 *    and the "All BTEC FAQs" link already uses one.
 *  - `sources` are external links (they do not count towards the body-link limit).
 */

import content from '../../content.json';

export type CategoryId = 'basics' | 'ai-rules' | 'ai-tools' | 'free-tools';

export interface Category {
  id: CategoryId;
  heading: string;
}

export const CATEGORIES: Category[] = [
  { id: 'basics', heading: 'BTEC assignment basics' },
  { id: 'ai-rules', heading: 'Using AI on a BTEC assignment: rules and risks' },
  { id: 'ai-tools', heading: 'Which AI tool should you use?' },
  { id: 'free-tools', heading: 'Free apps and study help' },
];

export interface Source {
  label: string;
  url: string;
}

export interface Faq {
  slug: string;
  question: string;
  category: CategoryId;
  metaDescription: string;
  answer: string;
  guides: string[];
  sources?: Source[];
}

const PEARSON_RESUB: Source = {
  label: 'Pearson: Quick Guide to Internal Assessment for BTEC Nationals (resubmission of evidence)',
  url: 'https://qualifications.pearson.com/content/dam/pdf/about/btec/delivering-btec/btec-nationals-quick-guide-internal-assessment.pdf',
};

export const FAQS: Faq[] = [
  {
    slug: 'how-to-structure-a-btec-assignment',
    question: 'How to structure a BTEC assignment?',
    category: 'basics',
    metaDescription:
      'Follow your task sheet: one heading for each Pass, Merit and Distinction criterion, the exact command word under each, real examples and Harvard references.',
    answer: `Start with the task sheet, because your structure should follow it. At BTECAssignment.Help, we use a criteria-first approach. Break the brief into the Pearson Pass, Merit and Distinction criteria, then give each one its own heading in the order the task sheet lists them. Open with a short introduction that names the unit and scenario. Under each heading, use the exact command word, such as describe, explain, analyse or evaluate. Support every point with a real example from the scenario and a proper reference, usually Harvard. Finish with a conclusion that links back to the brief, then add your reference list and appendices. Before you submit, tick off each criterion one by one. Our criteria maps and draft feedback make this step simple.`,
    guides: [
      'btec-assignment-brief-how-to-read-and-interpret-it',
      'btec-assignment-grading-criteria-explained',
    ],
  },
  {
    slug: 'can-chatgpt-do-my-assignment',
    question: 'Can ChatGPT do my assignment?',
    category: 'ai-rules',
    metaDescription:
      'ChatGPT can write text, but it is not a safe way to finish a BTEC assignment. Your centre needs your own work, and unacknowledged AI use can count as malpractice.',
    answer: `ChatGPT can produce text, but that does not make it a safe way to complete a BTEC assignment. Your centre needs the work to be your own, and JCQ guidance treats unacknowledged AI use as malpractice. AI also tends to miss task-sheet wording, invent references and write in a flat, generic voice that tutors notice quickly. A smarter use is as a study helper. Ask it to explain a theory in plain words, suggest a plan or quiz you on a topic. Then write the answer yourself, using real sources. At BTECAssignment.Help, we offer criteria maps, model answers and draft feedback so you learn the standard and submit your own work. Always check your centre's AI policy first.`,
    guides: ['btec-academic-malpractice-policy'],
  },
  {
    slug: 'what-happens-if-you-fail-a-btec-assignment',
    question: 'What happens if you fail a BTEC assignment?',
    category: 'basics',
    metaDescription:
      'A failed BTEC assignment usually means a Referral. Learn about resubmission, the 15 working day limit on BTEC Nationals, and what to do next.',
    answer: `Failing usually means a Referral, which means at least one Pass criterion was not met. Do not panic. On BTEC Nationals, learners are normally allowed one resubmission, often within 15 working days, but your centre's policy has the final say. At HNC and HND level, you usually get one reassessment, and the grade is capped at Pass. Your tutor will explain which criteria are missing. Read that feedback carefully, then make a short action list: what evidence is missing, which command word you missed, and where you need examples or references. Fix what is needed, keep your own voice and resubmit on time. We offer feedback reviews, resubmission action lists and tutoring to help your next attempt hit the criteria.`,
    guides: ['btec-assignment-resubmission-guide', 'btec-higher-national-explained'],
    sources: [PEARSON_RESUB],
  },
  {
    slug: 'can-ai-do-my-assignments',
    question: 'Can AI do my assignments?',
    category: 'ai-rules',
    metaDescription:
      'AI can help you plan, understand and check your work, but it should not do the whole BTEC assignment. Most centres treat copied AI text as malpractice.',
    answer: `AI can help with parts of the process, but it should not do the whole assignment for you. It can explain tricky ideas, suggest headings, check grammar and help you plan your time. It does not know your task sheet, your centre's rules or your tutor's expectations unless you tell it, and it often gets facts, dates and references wrong. Most centres also treat copied AI text as malpractice, and tutors can spot work that does not sound like you. The best approach is to use AI for support, then write in your own words, with real sources and correct Harvard referencing. If you are unsure what is allowed, ask your tutor. Our guidance is written by people, so you stay in control of your submission.`,
    guides: ['btec-academic-malpractice-policy'],
  },
  {
    slug: 'which-ai-is-better-than-chatgpt-for-writing',
    question: 'Which AI is better than ChatGPT for writing?',
    category: 'ai-tools',
    metaDescription:
      'No single AI wins every writing task. Compare Claude, Gemini, Copilot and Perplexity, then treat the result as a rough draft and write the final answer yourself.',
    answer: `No single AI wins every task, so the best choice depends on what you need. Claude is often liked for natural, careful writing and long documents. Gemini works well if you use Google Docs and Drive. Microsoft Copilot suits students who already work in Word. Perplexity helps you find sources quickly. Features and free limits change often, so test two or three tools on the same prompt and compare the results. Whichever you pick, treat the output as a rough draft, not finished work. Check facts, add your own examples and write the final answer yourself. For BTEC work, the biggest gain comes from matching the Pass, Merit and Distinction criteria, which is what our guidance and draft feedback focus on.`,
    guides: ['btec-assignment-grading-criteria-explained'],
  },
  {
    slug: 'which-ai-app-is-best-for-assignments',
    question: 'Which AI app is best for assignments?',
    category: 'ai-tools',
    metaDescription:
      'The best AI app supports your learning without replacing your effort. See which tools suit brainstorming, finding sources, grammar and revision.',
    answer: `The best AI app is the one that supports your learning without replacing your effort. For brainstorming and explaining topics, ChatGPT, Claude and Gemini are all popular choices. For finding sources, Perplexity can help, but always open the links and check them yourself. For grammar and clarity, a tool like Grammarly is useful. For revision, NotebookLM can turn your own notes into summaries and practice questions. None of these knows your BTEC task sheet, so paste in the criteria and ask for a plan, not a finished answer. Then write in your own voice and reference properly. If you want human help with criteria, feedback or resubmission planning, BTECAssignment.Help offers criteria maps and tutor support.`,
    guides: ['btec-assignment-grading-criteria-explained'],
  },
  {
    slug: 'which-ai-app-is-better-than-chatgpt',
    question: 'Which AI app is better than ChatGPT?',
    category: 'ai-tools',
    metaDescription:
      '"Better" depends on the job: Claude for long writing, Perplexity for sources, Gemini for Google apps, Copilot for Word. Test two apps on the same question.',
    answer: `"Better" depends on the job. For writing and editing long text, many students prefer Claude. For searching the web with sources, Perplexity is strong. If you live in Google apps, Gemini connects neatly with Docs, Gmail and Drive. If you work in Word, Copilot sits inside Microsoft apps. ChatGPT is still a solid all-rounder with many features. Instead of looking for one winner, ask the same question in two apps and see which explains it more clearly. Remember that every AI can make mistakes, so check names, dates and references. In BTEC work, the app matters less than following the Pearson criteria and using the right command word. Our criteria maps show what each grade expects.`,
    guides: ['btec-assignment-grading-criteria-explained'],
  },
  {
    slug: 'which-app-can-i-use-to-do-my-assignments',
    question: 'Which app can I use to do my assignments?',
    category: 'free-tools',
    metaDescription:
      'Use a few simple apps, each for one job: Word or Google Docs to write, Zotero for Harvard references, Grammarly to check, and Notion or Trello to plan deadlines.',
    answer: `Use a mix of simple apps, each for one job. Write in Microsoft Word or Google Docs, which also let you track changes and keep version history. Use Zotero or Mendeley to save sources and build Harvard references. Use Grammarly or the built-in spell checker to fix mistakes. Use Notion, Trello or a calendar app to plan deadlines for each unit. Use Forest or a similar timer to stay focused. AI chat apps can help you understand a topic or plan a structure, but the final writing should be yours. Always follow the task sheet and your centre's rules. If you get stuck on criteria or feedback, BTECAssignment.Help offers tutoring, draft reviews and referencing checks.`,
    guides: ['academic-referencing-for-btec-hnc-hnd'],
  },
  {
    slug: 'which-ai-is-better-for-writing-assignments',
    question: 'Which AI is better for writing assignments?',
    category: 'ai-tools',
    metaDescription:
      'Pick an AI that follows instructions and handles long task sheets. Paste in your criteria and ask for a plan or feedback on your own draft, not a finished answer.',
    answer: `Look for an AI that follows instructions closely, keeps a plain tone and handles long task sheets without losing track. Claude, ChatGPT and Gemini are the common options, and each has strengths, so try the same prompt in two of them and compare. Paste in your assignment criteria and ask for a plan, key points to cover or feedback on your own draft. Do not paste in the output as your final answer. AI can invent facts and references, and it rarely sounds like a student's real voice. Your tutor expects your own understanding, linked to the scenario. Use AI to learn, then write it yourself. For Pearson P, M and D guidance written by people, our tutors can help.`,
    guides: ['btec-assignment-grading-criteria-explained'],
  },
  {
    slug: 'what-is-a-good-free-app-for-assignment-writing',
    question: 'What is a good free app for assignment writing?',
    category: 'free-tools',
    metaDescription:
      'Google Docs, LibreOffice Writer, Zotero and the free version of Grammarly cost nothing and cover writing, referencing and proofreading for BTEC assignments.',
    answer: `Several free tools can help. Google Docs and LibreOffice Writer cost nothing and handle essays, reports and reference lists well. Zotero is free and makes Harvard referencing much easier. The free version of Grammarly catches spelling and grammar slips. Free plans of ChatGPT, Claude and Gemini can explain topics and help you plan, though limits change often. NotebookLM can turn your own notes into summaries and quiz questions. A free app helps with tools and ideas, but it cannot replace understanding your task sheet. Keep your wording natural, use real sources and answer each Pass, Merit and Distinction criterion separately. If you want a human check, we offer draft feedback and referencing checks.`,
    guides: ['academic-referencing-for-btec-hnc-hnd'],
  },
  {
    slug: 'which-ai-tool-is-best-for-academic-writing',
    question: 'Which AI tool is best for academic writing?',
    category: 'ai-tools',
    metaDescription:
      'Use different tools for different jobs: AI chat to plan and simplify, Google Scholar or Elicit to find research, Zotero for references. Check every source yourself.',
    answer: `For academic writing, use different tools for different jobs. Claude, ChatGPT and Gemini can help you plan, simplify hard ideas and improve clarity. For finding research, Google Scholar, Elicit and Consensus point you to real papers, but you must open and read them yourself. Zotero keeps your references organised. Grammarly helps with grammar and tone. The biggest risk with AI is made-up sources and confident but wrong claims, so check every fact and link. Academic writing also needs your own argument, which means comparing ideas, weighing strengths and weaknesses and reaching a justified judgement. That is what Distinction criteria ask for. Our criteria maps and draft feedback help you see where your own writing needs more depth.`,
    guides: ['how-to-achieve-distinction-in-btec-assignments', 'academic-referencing-for-btec-hnc-hnd'],
  },
  {
    slug: 'what-is-the-best-free-ai-tool-for-studying',
    question: 'What is the best free AI tool for studying?',
    category: 'free-tools',
    metaDescription:
      'NotebookLM works from your own notes to make summaries and practice questions. Free ChatGPT, Claude and Gemini plans can also quiz you. Ask it to test you.',
    answer: `For studying, NotebookLM is a strong free option because it works from your own notes and sources, then makes summaries and practice questions. The free plans of ChatGPT, Claude and Gemini are also useful for explaining topics in simple words, creating quizzes and testing your understanding. Quizlet and Anki are good for flashcards and revision. Free limits change often, so check each app's current plan. The best way to study with AI is to ask it to question you, not just give answers. Try to explain a topic back in your own words, then check it against your course notes. For BTEC units, link every idea to the scenario and the criteria. Our tutors can help if you get stuck.`,
    guides: ['how-to-achieve-distinction-in-btec-assignments'],
  },
  {
    slug: 'which-ai-has-free-for-students',
    question: 'Which AI has free for students?',
    category: 'free-tools',
    metaDescription:
      'ChatGPT, Claude, Gemini, Copilot and Perplexity all have free tiers. Limits and student offers change, so check each official pricing page before you rely on one.',
    answer: `Most major AI tools offer a free tier, including ChatGPT, Claude, Gemini, Microsoft Copilot and Perplexity. Free plans usually have message limits or fewer features, and they change often. Some companies also run student offers or discounts, which may need a verified student email, and these differ by country and time. Check each tool's official pricing page rather than trusting old posts. NotebookLM is another useful free option for revision. Whatever you choose, use it to understand your course, not to replace your own work. Your centre may have rules about AI, so read them first. If you are struggling with a unit, BTECAssignment.Help offers tutoring, criteria maps and feedback that suit your budget, with prices shown before payment.`,
    guides: ['btec-academic-malpractice-policy'],
  },
  {
    slug: 'is-chatgpt-still-the-best-ai',
    question: 'Is ChatGPT still the best AI?',
    category: 'ai-tools',
    metaDescription:
      'ChatGPT is still a popular all-rounder, but "best" depends on the task. Test your own prompt in two or three tools and compare clarity, accuracy and tone.',
    answer: `ChatGPT is still one of the most popular AI tools, but "best" depends on the task. It is a strong all-rounder with a wide set of features. Claude is often praised for careful writing and long documents. Gemini is handy for Google users. Perplexity is useful for sourced web searches, and Copilot fits Microsoft apps. New versions arrive often, so rankings shift quickly. The practical way to judge is to test your own prompt in two or three tools and compare the clarity, accuracy and tone. For students, accuracy matters most, so always check facts and references. No AI can replace understanding your BTEC criteria and writing in your own voice. Use AI as a helper, not a ghostwriter.`,
    guides: ['btec-assignment-grading-criteria-explained'],
  },
  {
    slug: 'is-chatgpt-good-for-studying',
    question: 'Is ChatGPT good for studying?',
    category: 'free-tools',
    metaDescription:
      'Yes, if you use it actively: have it explain ideas, plan revision and quiz you, then check answers against your notes. Beware wrong facts and made-up references.',
    answer: `Yes, it can be very good for studying when you use it the right way. It can explain difficult ideas in plain words, give examples, build revision plans and quiz you on a unit. Ask it to test you, then check your answers against your notes. It can also give feedback on a draft you wrote, which helps you improve without handing over the work. The risks are wrong facts, made-up references and answers that sound sure but are false. It also does not know your task sheet unless you paste it in. Always verify against your course materials, and keep your final assignment in your own words. Our criteria maps can show you what Pass, Merit and Distinction look like.`,
    guides: ['how-to-achieve-distinction-in-btec-assignments'],
  },
  {
    slug: 'what-should-you-not-ask-chatgpt',
    question: 'What should you not ask ChatGPT?',
    category: 'ai-rules',
    metaDescription:
      'Do not ask ChatGPT to write your whole assignment, get around AI checks, or handle passwords and private details. Ask it to explain, plan, quiz or review your draft.',
    answer: `Do not ask it to write your whole assignment to submit as your own, because your centre needs your work and your own understanding. Do not ask it to get around AI checks, which is dishonest and risky. Do not share private details such as passwords, ID numbers or confidential school or work information. Do not rely on it for final medical, legal or financial decisions. Be careful asking for exact statistics, quotes or references, because it can invent them, so check anything it gives you. Instead, ask it to explain a topic, suggest a structure, test your knowledge or review your own draft. If you need help matching the Pearson criteria, our tutors give human-written guidance.`,
    guides: ['btec-academic-malpractice-policy'],
  },
  {
    slug: 'which-is-better-gemini-or-gpt',
    question: 'Which is better, Gemini or GPT?',
    category: 'ai-tools',
    metaDescription:
      'Gemini suits Google Docs, Gmail and Drive; GPT is a flexible all-rounder. Test the same prompt in both, check facts, then write your own answer to the criteria.',
    answer: `Both are strong, and the better one depends on how you work. Gemini fits well if you use Google Docs, Gmail and Drive, and it can bring in current web information. GPT, the model behind ChatGPT, is a flexible all-rounder with many tools for writing, explaining and planning. Results vary by task and change with each update, so test the same prompt in both and compare the clarity, accuracy and tone. Both can make mistakes and invent references, so always check facts. For students, the key point is not the tool but how you use it. Use either one to understand your unit, then write your own answer to the Pearson criteria. We can review your draft for gaps.`,
    guides: ['btec-assignment-grading-criteria-explained'],
  },
  {
    slug: 'can-teachers-tell-if-you-use-chatgpt',
    question: 'Can teachers tell if you use ChatGPT?',
    category: 'ai-rules',
    metaDescription:
      'Often, yes. Tutors know your usual voice, and AI text can feel generic or include fake references. Detection tools are not perfect, so honesty is the safest path.',
    answer: `Often, yes. Tutors know your usual voice, so a sudden change in style, vocabulary or depth stands out. AI text can also feel generic, repeat itself, miss the scenario and include references that do not exist. Some centres use detection software, but these tools are not perfect and can be wrong, so never rely on them either way. Your tutor may also ask you to explain your work in person. The safest path is honesty: follow your centre's AI policy, write in your own words and keep notes and drafts. If your work was flagged or you leaned on AI, BTECAssignment.Help offers honest rewrite coaching to help you rebuild it in your own voice.`,
    guides: ['btec-academic-malpractice-policy'],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const HUB_PATH = 'btec-faqs';
export const HUB_TITLE = 'BTEC FAQs';

const pageTitles = new Map<string, string>(
  (content as { pages: { slug: string; title: string }[] }).pages.map((p) => [p.slug, p.title])
);

/** Title of an existing site page. Fails the build if the page does not exist. */
export function siteGuideTitle(slug: string): string {
  const title = pageTitles.get(slug);
  if (!title) throw new Error(`btecFaqs: guide "${slug}" is not a page in content.json`);
  return title;
}

export function faqPath(slug: string): string {
  return `/${HUB_PATH}/${slug}/`;
}

/** Up to 4 other FAQs: same category first, then the rest in order. */
export function relatedFaqs(faq: Faq): Faq[] {
  const others = FAQS.filter((f) => f.slug !== faq.slug);
  const same = others.filter((f) => f.category === faq.category);
  const rest = others.filter((f) => f.category !== faq.category);
  return [...same, ...rest].slice(0, 4);
}

/**
 * Splits one paragraph into 2 or 3 shorter paragraphs at sentence ends.
 * No word is added, removed or changed: joining the parts with a space gives the original text.
 */
export function splitParagraphs(text: string, target = 55): string[] {
  const sentences = text.match(/(?:[^.!?]|\.(?=\S))+[.!?]+(?:["')\]]+)?(?:\s+|$)/g)?.map((s) => s.trim()) ?? [text];
  if (sentences.join(' ') !== text.trim()) return [text.trim()];
  const parts: string[] = [];
  let current: string[] = [];
  let words = 0;
  for (const s of sentences) {
    current.push(s);
    words += s.split(/\s+/).length;
    if (words >= target) {
      parts.push(current.join(' '));
      current = [];
      words = 0;
    }
  }
  if (current.length) {
    // Avoid a very short last paragraph: attach it to the one before it.
    if (parts.length && words < 20) parts[parts.length - 1] += ' ' + current.join(' ');
    else parts.push(current.join(' '));
  }
  return parts;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
