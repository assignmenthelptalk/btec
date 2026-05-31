// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const CORE_T1 = new Set([
  'btec-assignment-help',
  'btec-national-assignment-help',
  'btec-hnc-assignment-help',
  'btec-hnd-assignment-help',
  'btec-business-assignment-help',
]);

const CORE_T2_GRADING = new Set([
  'btec-assignment-grading-criteria-explained',
  'how-to-achieve-distinction-in-btec-assignments',
  'btec-assignment-resubmission-guide',
  'btec-assignment-brief-how-to-read-and-interpret-it',
]);

const CORE_T2_SUBJECTS = new Set([
  'btec-health-and-social-care-assignment-help',
  'btec-engineering-assignment-help',
  'btec-it-assignment-help',
  'btec-sport-assignment-help',
  'btec-public-services-assignment-help',
  'btec-childcare-and-early-years-assignment-help',
]);

function getSlug(url) {
  return url.replace(/^https?:\/\/[^/]+\//, '').replace(/\/$/, '');
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.btecassignment.help',
  integrations: [
    sitemap({
      serialize(item) {
        const slug = getSlug(item.url);

        if (slug === '') {
          // Homepage
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (CORE_T1.has(slug)) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (CORE_T2_GRADING.has(slug)) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (CORE_T2_SUBJECTS.has(slug)) {
          item.priority = 0.75;
          item.changefreq = 'monthly';
        } else {
          item.priority = 0.6;
          item.changefreq = 'monthly';
        }

        return item;
      },
    }),
  ],
});
