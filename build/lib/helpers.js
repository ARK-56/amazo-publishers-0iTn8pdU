/* ==========================================================================
   Amazo Publishers — shared build helpers.
   Small utilities every component and page template needs: icon rendering,
   text escaping, and the service lookups the nav and grids are built from.
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const { site, icons, services } = require('../site.data.js');

const ROOT = path.join(__dirname, '..', '..');

/* The declared logo size reserves space before the file loads, so a stale
   number shifts the header or footer as the image arrives. Logo files get
   swapped often here — read the real size out of the PNG and fail the build
   rather than let the two drift apart silently. Non-PNGs are skipped: an SVG
   scales to whatever the CSS gives it. */
const assertLogoSize = (file, w, h_, label) => {
  const full = path.join(ROOT, file);
  if (!/.png$/i.test(file) || !fs.existsSync(full)) return;
  const b = fs.readFileSync(full);
  if (b.slice(0, 8).toString('hex') !== '89504e470d0a1a0a') return;
  const real = { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (real.w !== w || real.h !== h_) {
    throw new Error(
      'site.logo ' + label + ' says ' + w + 'x' + h_ + ' but ' + file + ' is ' +
      real.w + 'x' + real.h + '. Update the numbers in site.data.js.'
    );
  }
};
assertLogoSize(site.logo.src, site.logo.width, site.logo.height, 'width/height');
if (site.logo.light) {
  assertLogoSize(
    site.logo.light,
    site.logo.lightWidth || site.logo.width,
    site.logo.lightHeight || site.logo.height,
    'lightWidth/lightHeight'
  );
}

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
/* Pages are written as <slug>/index.html, so a URL carries no extension and
   is root-relative — the same string works from any page, at any depth. The
   site is served from the domain root; a sub-path deployment would need these
   made relative instead. */
const pageHref = (slug) => (slug === 'index' ? '/' : `/${slug}`);
const href = (s) => pageHref(s.slug);

/* Assets are addressed from the root for the same reason. */
const asset = (p) => (p ? '/' + String(p).replace(/^\/+/, '') : p);


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
  const useLight = variant === 'light' && !!l.light;
  const src = useLight ? l.light : l.src;
  const w = useLight && l.lightWidth ? l.lightWidth : l.width;
  const h = useLight && l.lightHeight ? l.lightHeight : l.height;
  const lazy = variant === 'light'
    ? ' loading="lazy" decoding="async"'
    : ' fetchpriority="high" decoding="async"';

  return `
<a class="wordmark${cls ? ` ${cls}` : ''}" href="/" aria-label="${site.name} — home">
  <img class="wordmark__img" src="${asset(src)}" alt="${attr(l.alt || site.name)}" width="${w}" height="${h}"${lazy}>
</a>`;
};

/* ---------- mega menu ---------- */
/* The header collapses every service behind one "Services" item, with these
   three categories down the left of the panel. Hand-ordered rather than
   derived, so a newly added service can silently miss the menu — the check
   below fails the build instead, the same way the footer does. */
const SERVICE_GROUPS = [
  {
    label: 'Writing Services',
    icon: 'pen',
    slugs: [
      'ghostwriting',
      'childrens-books',
      'comics-graphic-novels',
      'romance-love-stories',
      'website-content-writing',
      'blog-article-writing'
    ]
  },
  {
    label: 'Editing & Publishing',
    icon: 'edit',
    slugs: [
      'book-editing-proofreading',
      'book-publishing',
      'book-formatting',
      'amazon-book-publishing',
      'hassle-free-publishing',
      'audio-book'
    ]
  },
  {
    label: 'Design, Printing & Marketing',
    icon: 'palette',
    slugs: [
      'book-cover-design',
      'book-marketing',
      'book-promotion',
      'book-video-trailer',
      'author-website'
    ]
  }
];

{
  const grouped = SERVICE_GROUPS.flatMap((g) => g.slugs);
  const missing = services.filter((s) => !grouped.includes(s.slug)).map((s) => s.slug);
  const unknown = grouped.filter((slug) => !bySlug[slug]);
  const duplicated = grouped.filter((slug, n) => grouped.indexOf(slug) !== n);
  if (missing.length || unknown.length || duplicated.length) {
    throw new Error(
      'helpers.js SERVICE_GROUPS: ' + [
        missing.length ? 'not in any group, so unreachable from the header: ' + missing.join(', ') : '',
        unknown.length ? 'listed but not a service: ' + unknown.join(', ') : '',
        duplicated.length ? 'in more than one group: ' + duplicated.join(', ') : ''
      ].filter(Boolean).join('; ')
    );
  }
}

module.exports = {
  icon,
  solidStar,
  plain,
  attr,
  bySlug,
  href,
  pageHref,
  asset,
  gridServices,
  extraServices,
  wordmark,
  SERVICE_GROUPS
};
