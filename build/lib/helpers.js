/* ==========================================================================
   Amazo Publishers — shared build helpers.
   Small utilities every component and page template needs: icon rendering,
   text escaping, and the service lookups the nav and grids are built from.
   ========================================================================== */

const { site, icons, services } = require('../site.data.js');

/* ---------- markup helpers ---------- */
const icon = (name, cls) =>
  `<svg${cls ? ` class="${cls}"` : ''} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || ''}</svg>`;

const solidStar =
  `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${icons.star}</svg>`;

// Strip the <em> markup when a heading is reused as a plain-text meta value.
const plain = (s) => s.replace(/<[^>]+>/g, '');
const attr = (s) => plain(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/* ---------- service lookups ---------- */
const bySlug = Object.fromEntries(services.map((s) => [s.slug, s]));
const href = (s) => `${s.slug}.html`;

// Which services get a slot in the top bar, and the shorter labels they use
// there so the bar fits without wrapping. Full titles are used everywhere else.
const NAV_PRIMARY = [
  'ghostwriting',
  'book-editing-proofreading',
  'amazon-book-publishing',
  'book-marketing',
  'book-cover-design'
];
const NAV_SHORT = {
  'ghostwriting': 'Ghostwriting',
  'book-editing-proofreading': 'Editing',
  'amazon-book-publishing': 'Amazon Publishing',
  'book-marketing': 'Marketing',
  'book-cover-design': 'Cover Design'
};
const navPrimary = NAV_PRIMARY.map((s) => bySlug[s]);
const navOther = services.filter((s) => !NAV_PRIMARY.includes(s.slug));

const gridServices = services.filter((s) => s.primary);
const extraServices = ['audio-book', 'website-content-writing', 'book-video-trailer', 'author-website']
  .map((s) => bySlug[s]);

/* ---------- brand mark ----------
   wordmark(cls, variant) → the linked logo image.
     variant 'light' picks site.logo.light, for use on the dark footer.
   Swap the files or the paths in site.data.js to change the logo everywhere.
   The header logo is eager + high priority because it is above the fold; the
   footer copy is lazy. width/height are set so the bar reserves its space
   before the image arrives. */
const wordmark = (cls, variant) => {
  const l = site.logo;
  const src = variant === 'light' && l.light ? l.light : l.src;
  const lazy = variant === 'light'
    ? ' loading="lazy" decoding="async"'
    : ' fetchpriority="high" decoding="async"';

  return `
<a class="wordmark${cls ? ` ${cls}` : ''}" href="index.html" aria-label="${site.name} — home">
  <img class="wordmark__img" src="${src}" alt="${attr(l.alt || site.name)}" width="${l.width}" height="${l.height}"${lazy}>
</a>`;
};

module.exports = {
  icon,
  solidStar,
  plain,
  attr,
  bySlug,
  href,
  NAV_PRIMARY,
  NAV_SHORT,
  navPrimary,
  navOther,
  gridServices,
  extraServices,
  wordmark
};
