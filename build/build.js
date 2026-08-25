/* ==========================================================================
   Amazo Publishers — static site generator.
   Usage:  node build/build.js
   Writes flat .html files into the project root so the site can be opened
   directly from disk or dropped onto any static host.
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const { site, services, home, legal } = require('./site.data.js');

/* Shared helpers and the two site-wide components. Every page goes through
   layout(), which renders header() and footer() — so editing either file
   updates all pages at once. */
const {
  icon, solidStar, plain, attr, bySlug, href, gridServices, extraServices
} = require('./lib/helpers.js');
const { header } = require('./components/header.js');
const { footer } = require('./components/footer.js');

const ROOT = path.join(__dirname, '..');

/* ---------- entry popup ----------
   Rendered inert (hidden, aria-hidden) and only opened by main.js, so a
   visitor without JS never gets a modal they cannot dismiss. */
const popup = () => {
  const p = site.popup;
  if (!p || !p.enabled) return '';
  return `
<div class="modal" id="entry-modal" hidden aria-hidden="true" data-delay="${p.delay}">
  <div class="modal__backdrop" data-modal-close></div>
  <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="entry-modal-title">
    ${bookStackArt()}
    <button class="modal__close" type="button" data-modal-close aria-label="Close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>
    <div class="modal__body">
      <h2 class="modal__title" id="entry-modal-title">
        <span class="modal__lead">${p.lead}</span>
        <span class="modal__title-rest">${p.title}</span>
      </h2>
      ${p.offer ? `<p class="modal__offer">${p.offer}</p>` : ''}
      <p class="modal__sub">${p.sub}</p>
      <form class="modal__form" data-mailto-form="${site.email}" data-subject="Enquiry from the website popup">
        <input type="text" name="name" required aria-label="Full name" autocomplete="name" placeholder="Full name *">
        <div class="modal__row">
          <input type="tel"   name="phone"          aria-label="Phone number" autocomplete="tel"   placeholder="Phone">
          <input type="email" name="email" required aria-label="Email address" autocomplete="email" placeholder="Email address *">
        </div>
        <textarea name="message" rows="3" aria-label="About your book" placeholder="Tell us briefly about your project — where the book is now, and what it needs."></textarea>
        <button class="btn btn--solid modal__submit" type="submit">Submit ${icon('arrow')}</button>
        <p class="modal__note">${p.note}</p>
        <p class="form-status" role="status"></p>
      </form>
    </div>
  </div>
</div>`;
};

/* ---------- page shell ---------- */
const layout = ({ title, desc, current, body }) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.name}">
<meta name="theme-color" content="#F2830A">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;1,6..72,500;1,6..72,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
${popup()}
${header(current)}
<main id="main">
${body}
</main>
${footer()}
<button class="to-top" type="button" aria-label="Back to top">${icon('arrow')}</button>
<script src="assets/js/main.js"></script>
</body>
</html>
`;

/* ---------- shared section partials ---------- */

/* Four tapered petals radiating off the corner of the right-hand book. */
const burstArt = () => `
      <svg class="cta-burst" viewBox="0 0 130 120" aria-hidden="true" fill="currentColor">
        <path d="M64 4c7 16 8 27 3 34s-16 5-21-2 1-19 18-32z"/>
        <path d="M104 20c-4 17-10 26-18 29s-17-3-17-12 10-14 35-17z"/>
        <path d="M122 62c-14 6-24 7-30 3s-6-14 0-18 15 2 30 15z"/>
        <path d="M96 100c-11-8-16-16-15-23s9-11 16-7 6 14-1 30z"/>
      </svg>`;

/* Full-bleed dark band with books tilting in from both edges. `seed` shifts
   which showcase covers appear, so the four instances on the site differ. */
const ctaBand = (title, lede, seed = 0) => {
  const pickCover = (n) => coverArt(home.books[(seed + n) % home.books.length], seed + n);

  return `
<section class="cta-band reveal">
  <div class="cta-band__art cta-band__art--left" aria-hidden="true">
    <span class="cta-book cta-book--a">${pickCover(0)}</span>
    <span class="cta-book cta-book--b">${pickCover(1)}</span>
  </div>
  <div class="cta-band__art cta-band__art--right" aria-hidden="true">
    ${burstArt()}
    <span class="cta-book cta-book--c">${pickCover(2)}</span>
  </div>
  <div class="shell cta-band__body">
    <h2 class="h2">${title}</h2>
    <p class="lede">${lede}</p>
    <div class="btn-row" style="justify-content:center">
      <a class="btn btn--solid" href="contact.html">Get Started ${icon('arrow')}</a>
      <a class="btn btn--light" href="mailto:${site.email}">Email us</a>
    </div>
  </div>
</section>`;
};

/* Short lead-capture band. Inputs are labelled with aria-label rather than
   <label for>, so the band can appear more than once on a page without
   colliding on element ids. */
const leadBand = (title, lede) => `
<section class="section section--tight">
  <div class="shell">
    <div class="lead-band reveal">
      <div class="lead-band__head">
        <h2 class="h2">${title}</h2>
        <p class="lede">${lede}</p>
      </div>
      <form class="lead-form" data-mailto-form="${site.email}" data-subject="Quick enquiry from the website">
        <div class="lead-form__row">
          <input type="text"  name="name"  required aria-label="Your name"     autocomplete="name"  placeholder="Your name">
          <input type="email" name="email" required aria-label="Email address" autocomplete="email" placeholder="Email address">
          <input type="tel"   name="phone"          aria-label="Phone number (optional)" autocomplete="tel" placeholder="Phone (optional)">
          <button class="btn btn--solid" type="submit">Let&rsquo;s start ${icon('arrow')}</button>
        </div>
        <p class="lead-form__note">No obligation, and no sales call unless you ask for one. We reply within one business day.</p>
        <p class="form-status" role="status"></p>
      </form>
    </div>
  </div>
</section>`;

/* ==========================================================================
   BOOK COVER ARTWORK
   Every showcase title gets a drawn cover rather than an empty rectangle.
   Palette follows the genre, layout rotates through four templates, so a
   shelf of them reads like a catalogue instead of a set of placeholders.
   ========================================================================== */
/* Only used when a title has no cover file — every genre still needs one so
   the fallback never lands on the default. */
const COVER_PALETTES = {
  'Fiction':       { bg: '#14140F', fg: '#FDFDFB', accent: '#F2830A' },
  'Fantasy':       { bg: '#241A3C', fg: '#F4F1EA', accent: '#9B7BD4' },
  'Romance':       { bg: '#5B2333', fg: '#F7EDE8', accent: '#E0A05C' },
  'Short Stories': { bg: '#1E3A3C', fg: '#F4F1EA', accent: '#E8A33D' },
  'Non-Fiction':   { bg: '#F0EDE5', fg: '#14140F', accent: '#D4700A' },
  'Biography':     { bg: '#1E3A3C', fg: '#F4F1EA', accent: '#E8A33D' },
  'Memoir':        { bg: '#5B2333', fg: '#F7EDE8', accent: '#E0A05C' },
  'Children’s':    { bg: '#F2830A', fg: '#FFFFFF', accent: '#14140F' }
};
const FALLBACK_PALETTE = { bg: '#14140F', fg: '#FDFDFB', accent: '#F2830A' };

// Greedy wrap — SVG has no text flow, so lines are worked out at build time.
const wrapText = (str, maxChars) => {
  const lines = [];
  let line = '';
  str.split(' ').forEach((word) => {
    const next = line ? line + ' ' + word : word;
    if (next.length > maxChars && line) { lines.push(line); line = word; }
    else line = next;
  });
  if (line) lines.push(line);
  return lines;
};

/* Cover files may be saved as .jpg, .jpeg, .png or .webp. site.data.js gives
   the path without an extension and this probes for whichever one is there,
   so the file's extension never has to match what the data says. A path that
   already carries an extension is used as given. */
const COVER_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

const resolveCover = (base) => {
  if (!base) return null;
  if (path.extname(base)) {
    return fs.existsSync(path.join(ROOT, base)) ? base : null;
  }
  for (const ext of COVER_EXTS) {
    if (fs.existsSync(path.join(ROOT, base + ext))) return base + ext;
  }
  return null;
};

/* coverArt(book, i) — `book` is a row from home.books:
     [genre, title, author, rating, image?]
   When a real cover file is found it is used; otherwise the title falls back
   to drawn artwork, so a missing or mistyped path never ships a broken image.
   Delete the 5th field to force drawn art for that title. */
const coverArt = (book, i) => {
  const [genre, title, author, , image] = book;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const label = `Cover of ${esc(title)} by ${esc(author)}`;

  const src = resolveCover(image);
  if (src) {
    return `<img class="book__art" src="${src}" alt="${label}" loading="lazy" decoding="async">`;
  }

  const p = COVER_PALETTES[genre] || FALLBACK_PALETTE;
  const tpl = i % 4;

  const lines = wrapText(title, title.length > 18 ? 12 : 11);
  const size = lines.length > 3 ? 19 : lines.length > 2 ? 22 : 25;
  const startY = 150 - ((lines.length - 1) * size * 0.58);
  const titleFill = tpl === 1 ? p.bg : p.fg;

  const titleBlock = lines
    .map((l, n) => `<text x="100" y="${(startY + n * size * 1.16).toFixed(1)}" text-anchor="middle" font-family="Newsreader, Georgia, serif" font-style="italic" font-size="${size}" fill="${titleFill}">${esc(l)}</text>`)
    .join('');

  // Per-template background furniture, drawn under the title.
  const furniture = [
    `<rect x="34" y="${startY - size - 26}" width="132" height="2" fill="${p.accent}"/>
     <rect x="76" y="196" width="48" height="2" fill="${p.accent}"/>`,
    `<rect x="0" y="${startY - size - 8}" width="200" height="${lines.length * size * 1.16 + 26}" fill="${p.accent}"/>`,
    `<path d="M0 0h200v104H0z" fill="${p.accent}"/>
     <circle cx="100" cy="62" r="26" fill="${p.bg}" opacity=".22"/>`,
    `<rect x="16" y="16" width="168" height="268" fill="none" stroke="${p.accent}" stroke-width="1.5"/>
     <rect x="86" y="${startY - size - 22}" width="28" height="2" fill="${p.accent}"/>`
  ][tpl];

  return `<svg class="book__art" viewBox="0 0 200 300" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="300" fill="${p.bg}"/>
      ${furniture}
      ${titleBlock}
      <text x="100" y="238" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" letter-spacing="1.6" fill="${p.fg}" opacity=".72">${esc(author.toUpperCase())}</text>
      <text x="100" y="276" text-anchor="middle" font-family="Inter, sans-serif" font-size="7" letter-spacing="2.4" fill="${p.fg}" opacity=".42">AMAZO PUBLISHERS</text>
      <rect x="0" y="0" width="14" height="300" fill="#000" opacity=".16"/>
      <rect x="14" y="0" width="2" height="300" fill="#fff" opacity=".10"/>
    </svg>`;
};

/* ==========================================================================
   PORTRAIT AVATARS
   Drawn, deliberately abstract figures for the testimonial cards — enough
   warmth to read as a person, no invented likeness of a real one.
   ========================================================================== */
const AVATAR_SETS = [
  { bg: '#F4E3CE', skin: '#C9955F', hair: '#3B2A1E', top: '#1E3A3C' },
  { bg: '#E4EEE8', skin: '#8A5A3B', hair: '#241812', top: '#5B2333' },
  { bg: '#FBE6D2', skin: '#E0B189', hair: '#8A5122', top: '#14140F' },
  { bg: '#E8E4F0', skin: '#6B4430', hair: '#15100C', top: '#D4700A' },
  { bg: '#DCE9EC', skin: '#F0C9A4', hair: '#5C3A21', top: '#1E3A3C' },
  { bg: '#F6E2E2', skin: '#A2703F', hair: '#2B1D14', top: '#14140F' }
];

const avatarArt = (name, i) => {
  const a = AVATAR_SETS[i % AVATAR_SETS.length];
  // Three hair silhouettes, rotated independently of the palette.
  const hair = [
    `<path d="M14 21c0-6 4.6-10 12-10s12 4 12 10c0 2-.6 3.4-1.4 4.2-.5-4.6-4.4-6.6-10.6-6.6S15.9 20.6 15.4 25.2C14.6 24.4 14 23 14 21z" fill="${a.hair}"/>`,
    `<path d="M13.6 24c0-7.2 5-12 12.4-12s12.4 4.8 12.4 12c0 3-1 5-1 5l-1.8-8.6-16.6-1.6-2.6 10s-2.8-2.4-2.8-4.8z" fill="${a.hair}"/>`,
    `<path d="M15 22.5C15 16 19.8 12 26 12s11 4 11 10.5c0 1.6-.3 2.9-.8 3.7-1-3.9-4.7-5.9-10.2-5.9-5.5 0-9.2 2-10.2 5.9-.5-.8-.8-2.1-.8-3.7z" fill="${a.hair}"/><path d="M35.4 21c2.6.7 3.9 3 3.4 5.8-.4 2.3-1.7 3.6-3.2 3.5z" fill="${a.hair}"/>`
  ][i % 3];

  return `<svg class="avatar-art" viewBox="0 0 52 52" role="img" aria-label="Portrait of ${String(name).replace(/&/g,'&amp;').replace(/</g,'&lt;')}">
      <circle cx="26" cy="26" r="26" fill="${a.bg}"/>
      <path d="M26 30c8.4 0 15 5.6 15 13.4V52H11v-8.6C11 35.6 17.6 30 26 30z" fill="${a.top}"/>
      <path d="M20.4 27.6h11.2v6.8a5.6 5.6 0 0 1-11.2 0z" fill="${a.skin}"/>
      <ellipse cx="26" cy="23" rx="8.4" ry="9.4" fill="${a.skin}"/>
      ${hair}
    </svg>`;
};

/* ==========================================================================
   EDITORIAL ILLUSTRATION
   A desk scene for the about column: open book, stacked spines, pen, lamp.
   ========================================================================== */
const deskArt = () => `
  <svg class="desk-art" viewBox="0 0 420 340" role="img" aria-label="An open manuscript on a desk beside a stack of books">
    <defs>
      <linearGradient id="deskPage" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FDFDFB"/><stop offset="1" stop-color="#F0EDE5"/>
      </linearGradient>
    </defs>

    <circle cx="214" cy="150" r="132" fill="#F2830A" opacity=".08"/>

    <!-- lamp -->
    <path d="M330 44h44l16 40h-76z" fill="#14140F"/>
    <path d="M330 44h44l16 40h-76z" fill="#F2830A" opacity=".22"/>
    <path d="M352 84v128" stroke="#14140F" stroke-width="5" stroke-linecap="round"/>
    <path d="M318 214h68" stroke="#14140F" stroke-width="7" stroke-linecap="round"/>
    <path d="M334 86l-26 96h88l-26-96z" fill="#F2830A" opacity=".13"/>

    <!-- stacked books -->
    <rect x="24" y="188" width="132" height="17" rx="4" fill="#1E3A3C"/>
    <rect x="32" y="205" width="124" height="17" rx="4" fill="#F2830A"/>
    <rect x="26" y="222" width="130" height="17" rx="4" fill="#5B2333"/>
    <rect x="38" y="239" width="118" height="17" rx="4" fill="#14140F"/>
    <g fill="#FDFDFB" opacity=".5">
      <rect x="36" y="195" width="30" height="3" rx="1.5"/>
      <rect x="44" y="212" width="30" height="3" rx="1.5"/>
      <rect x="38" y="229" width="30" height="3" rx="1.5"/>
      <rect x="50" y="246" width="30" height="3" rx="1.5"/>
    </g>

    <!-- open book -->
    <path d="M96 268c38-22 76-22 114 0 38-22 76-22 114 0v-96c-38-22-76-22-114 0-38-22-76-22-114 0z" fill="url(#deskPage)" stroke="#14140F" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M210 172v96" stroke="#14140F" stroke-width="2.4"/>
    <g stroke="#6B6A63" stroke-width="2.6" stroke-linecap="round" opacity=".55">
      <path d="M116 194h74M116 208h74M116 222h58M116 236h68"/>
      <path d="M230 194h74M230 208h74M230 222h58M230 236h68"/>
    </g>
    <path d="M210 172c-38-22-76-22-114 0v96" fill="none" stroke="#F2830A" stroke-width="2.8"/>

    <!-- pen -->
    <path d="M286 300l82-52 13 20-82 52-17 5z" fill="#14140F"/>
    <path d="M355 256l13 20 13-8-13-20z" fill="#F2830A"/>
    <path d="M282 325l17-5-13-20z" fill="#FDFDFB" stroke="#14140F" stroke-width="2"/>

    <!-- desk line -->
    <path d="M12 300h250" stroke="#14140F" stroke-width="3" stroke-linecap="round" opacity=".18"/>
  </svg>`;

/* ==========================================================================
   HERO BACKDROP
   Rows of stacked books drawn dark and warm. Blurred and dimmed in CSS it
   reads as an out-of-focus library, standing in for the photographic
   background on the reference without needing a licensed photo.
   Placement is seeded so every build emits identical markup.
   ========================================================================== */
const bookStackArt = () => {
  let seed = 20240824;
  const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;

  const spines = ['#3A2418', '#4A2E1C', '#5B2333', '#2A2118', '#6B3A1E', '#1E3A3C', '#42301F', '#7A4420', '#8A5A22'];
  const pick = () => spines[Math.floor(rnd() * spines.length)];
  const parts = [];

  // Back wall: upright spines across the full width.
  let x = -20;
  while (x < 1640) {
    const w = 16 + rnd() * 26;
    const h = 210 + rnd() * 170;
    parts.push(`<rect x="${x.toFixed(1)}" y="${(430 - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="3" fill="${pick()}"/>`);
    x += w + 2 + rnd() * 5;
  }

  // Foreground: horizontal stacks of laid-flat books along the bottom.
  for (let col = 0; col < 13; col++) {
    const cx = -40 + col * 132 + rnd() * 30;
    let y = 700;
    const tall = 4 + Math.floor(rnd() * 6);
    for (let n = 0; n < tall; n++) {
      const w = 118 + rnd() * 78;
      const h = 20 + rnd() * 15;
      y -= h + 2;
      parts.push(`<rect x="${(cx - rnd() * 16).toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="4" fill="${pick()}"/>`);
    }
  }

  return `<svg class="hero__backdrop" viewBox="0 0 1600 700" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <rect width="1600" height="700" fill="#14100B"/>
      ${parts.join('\n      ')}
    </svg>`;
};

/* ==========================================================================
   3D BOOK
   The flat cover art tilted on its Y axis with a page block down the near
   edge, so the hero shows objects rather than rectangles.
   ========================================================================== */
const book3d = (book, i) => `
      <div class="book3d" style="--n:${i}">
        <div class="book3d__inner">
          <span class="book3d__edge" aria-hidden="true"></span>
          <span class="book3d__face">${coverArt(book, i)}</span>
        </div>
      </div>`;

/* Three showcase covers fanned out — used to give the inner page heroes
   something to look at. `seed` shifts which titles appear per page. */
const coverFan = (seed) => {
  const picks = [0, 1, 2].map((n) => home.books[(seed + n * 3) % home.books.length]);
  return `
    <div class="fan" aria-hidden="true">
      ${picks.map((bk, n) =>
        `<div class="fan__item">${coverArt(bk, seed + n)}</div>`).join('\n      ')}
    </div>`;
};

/* ==========================================================================
   RETAIL LISTING MOCKUP
   A tablet showing a book's product page. Deliberately generic store chrome —
   no retailer's logo, nav or trade dress — so it reads as "your book, listed"
   without borrowing anyone's interface.
   ========================================================================== */
const deviceArt = () => {
  const thumb = (x, bg, accent) => `
      <g transform="translate(${x} 404)">
        <rect width="44" height="60" rx="3" fill="${bg}"/>
        <rect x="4" y="4" width="36" height="2.5" rx="1.25" fill="${accent}" opacity=".8"/>
        <rect x="4" y="40" width="26" height="2" rx="1" fill="${accent}" opacity=".55"/>
        <rect x="4" y="46" width="18" height="2" rx="1" fill="${accent}" opacity=".4"/>
      </g>`;

  return `
  <svg class="device-art" viewBox="0 0 420 560" role="img" aria-label="A book listed for sale on an online bookstore">
    <!-- body -->
    <rect x="2" y="2" width="416" height="556" rx="28" fill="#14140F"/>
    <rect x="12" y="12" width="396" height="536" rx="20" fill="#2A2A24"/>
    <rect x="20" y="20" width="380" height="520" rx="14" fill="#FDFDFB"/>

    <!-- store chrome: search pill and a few generic controls -->
    <rect x="20" y="20" width="380" height="40" rx="14" fill="#F0EDE5"/>
    <rect x="34" y="32" width="250" height="16" rx="8" fill="#FDFDFB" stroke="#DCD7CB"/>
    <circle cx="46" cy="40" r="4" fill="none" stroke="#8A8880" stroke-width="1.6"/>
    <path d="M49 43l4 4" stroke="#8A8880" stroke-width="1.6" stroke-linecap="round"/>
    <rect x="300" y="33" width="34" height="14" rx="7" fill="#DCD7CB"/>
    <rect x="344" y="33" width="42" height="14" rx="7" fill="#F2830A"/>

    <!-- the listed book -->
    <g transform="translate(36 78)">
      <rect width="104" height="150" rx="4" fill="#14140F"/>
      <rect x="0" y="0" width="7" height="150" rx="3" fill="#F2830A"/>
      <rect x="20" y="52" width="66" height="4" rx="2" fill="#FDFDFB" opacity=".92"/>
      <rect x="26" y="64" width="54" height="4" rx="2" fill="#FDFDFB" opacity=".92"/>
      <rect x="34" y="112" width="38" height="3" rx="1.5" fill="#F2830A"/>
    </g>

    <!-- title, author, rating, price, buy -->
    <g transform="translate(158 84)">
      <rect width="188" height="9" rx="4.5" fill="#14140F"/>
      <rect y="16" width="132" height="9" rx="4.5" fill="#14140F"/>
      <rect y="38" width="96" height="6" rx="3" fill="#6B6A63" opacity=".7"/>
      <g transform="translate(0 56)" fill="#F2830A">
        <path d="M6 0l1.8 3.7L12 4.3 9 7.1l.7 4L6 9.3 2.3 11.1 3 7.1 0 4.3l4.2-.6z"/>
        <path d="M24 0l1.8 3.7 4.2.6-3 2.8.7 4L24 9.3l-3.7 1.8.7-4-3-2.8 4.2-.6z"/>
        <path d="M42 0l1.8 3.7 4.2.6-3 2.8.7 4L42 9.3l-3.7 1.8.7-4-3-2.8 4.2-.6z"/>
        <path d="M60 0l1.8 3.7 4.2.6-3 2.8.7 4L60 9.3l-3.7 1.8.7-4-3-2.8 4.2-.6z"/>
        <path d="M78 0l1.8 3.7 4.2.6-3 2.8.7 4L78 9.3l-3.7 1.8.7-4-3-2.8 4.2-.6z"/>
      </g>
      <rect y="80" width="70" height="14" rx="4" fill="#14140F" opacity=".9"/>
      <rect y="106" width="120" height="26" rx="13" fill="#F2830A"/>
      <rect x="30" y="116" width="60" height="6" rx="3" fill="#FFF" opacity=".9"/>
    </g>

    <rect x="36" y="256" width="348" height="1" fill="#E4DFD4"/>

    <!-- blurb lines -->
    <g fill="#6B6A63" opacity=".45">
      <rect x="36" y="274" width="330" height="5" rx="2.5"/>
      <rect x="36" y="288" width="348" height="5" rx="2.5"/>
      <rect x="36" y="302" width="300" height="5" rx="2.5"/>
      <rect x="36" y="316" width="326" height="5" rx="2.5"/>
    </g>

    <!-- "also viewed" strip -->
    <rect x="36" y="378" width="120" height="7" rx="3.5" fill="#14140F" opacity=".8"/>
    ${thumb(36, '#1E3A3C', '#E8A33D')}
    ${thumb(106, '#5B2333', '#E0A05C')}
    ${thumb(176, '#F2830A', '#14140F')}
    ${thumb(246, '#14140F', '#F2830A')}
    ${thumb(316, '#F0EDE5', '#D4700A')}

    <rect x="36" y="486" width="348" height="34" rx="10" fill="#F0EDE5"/>
    <rect x="50" y="498" width="150" height="5" rx="2.5" fill="#6B6A63" opacity=".5"/>
    <rect x="50" y="509" width="96" height="5" rx="2.5" fill="#6B6A63" opacity=".35"/>
  </svg>`;
};

/* Cover standing behind the tablet — the physical book beside its listing.
   With a real screenshot available the tablet becomes a CSS bezel around it;
   without one it falls back to the drawn store page. */
const listingArt = () => {
  const shot = site.listingShot && resolveCover(site.listingShot.src);
  const device = shot
    ? `<div class="device">
        <div class="device__screen">
          <img src="${shot}" alt="${attr(site.listingShot.alt)}" loading="lazy" decoding="async">
        </div>
      </div>`
    : deviceArt();

  return `
    <div class="listing-art reveal">
      <div class="listing-art__book">${coverArt(home.books[0], 0)}</div>
      <div class="listing-art__device">${device}</div>
    </div>`;
};

/* Small decorative motif behind each selling-point tile. */
const uspMotif = (i) => [
  `<circle cx="80" cy="30" r="58"/><circle cx="80" cy="30" r="38"/><circle cx="80" cy="30" r="18"/>`,
  `<path d="M0 60L60 0M24 60L84 0M48 60l60-60M72 60l60-60M96 60l60-60"/>`,
  `<rect x="16" y="0" width="26" height="72" rx="4"/><rect x="50" y="10" width="26" height="62" rx="4"/><rect x="84" y="-6" width="26" height="78" rx="4"/>`,
  `<path d="M0 46c26-34 52-34 78 0s52 34 78 0"/><path d="M0 66c26-34 52-34 78 0s52 34 78 0"/>`,
  `<circle cx="30" cy="26" r="22"/><circle cx="86" cy="26" r="22"/><circle cx="58" cy="62" r="22"/>`
][i % 5];

/* Continuous ticker. The track holds two identical runs of the list so the
   translate can loop at -50% without a visible seam; the copy is hidden from
   assistive tech so the names are not announced twice. */
const marquee = (items, label) => {
  const run = (hidden) =>
    `<ul class="marquee__run"${hidden ? ' aria-hidden="true"' : ''}>
        ${items.map((p) => `<li class="platform">${p}</li>`).join('\n        ')}
      </ul>`;
  return `
    <div class="marquee" role="group" aria-label="${label}">
      <div class="marquee__track">
        ${run(false)}
        ${run(true)}
      </div>
    </div>`;
};

/* Testimonial tiles on a continuous track, same two-run trick as marquee().
   The drawn avatar sits in the corner the selling-point tiles used for their
   icon, so the two share a shape even though only this one is still used. */
const quoteMarquee = (items) => {
  const tile = ([text, name, role], i) => `<li class="qtile">
          <svg class="qtile__motif" viewBox="0 0 156 72" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2">${uspMotif(i)}</svg>
          <div class="qtile__stars">${solidStar.repeat(5)}</div>
          <blockquote class="qtile__text">&ldquo;${text}&rdquo;</blockquote>
          <figcaption class="qtile__who">
            <span class="qtile__avatar">${avatarArt(name, i)}</span>
            <span>
              <span class="qtile__name">${name}</span><br>
              <span class="qtile__role">${role}</span>
            </span>
          </figcaption>
        </li>`;
  const run = (hidden) =>
    `<ul class="qtile-run"${hidden ? ' aria-hidden="true"' : ''}>
        ${items.map(tile).join('\n        ')}
      </ul>`;
  return `
    <div class="marquee qtile-marquee" role="group" aria-label="What our authors say">
      <div class="marquee__track">
        ${run(false)}
        ${run(true)}
      </div>
    </div>`;
};

const serviceCard = (s) => `
      <a class="card reveal" href="${href(s)}">
        <span class="card__icon">${icon(s.icon)}</span>
        <h3 class="card__title">${s.title}</h3>
        <p class="card__text">${s.short}</p>
        <span class="card__more">Explore ${icon('arrow')}</span>
      </a>`;

/* ==========================================================================
   HOME
   ========================================================================== */
const homePage = () => {
  const stats = home.about.stats.map((s) => `
        <div class="stat">
          <span class="stat__num" data-count="${s.num}" data-suffix="${s.suffix}">0</span>
          <span class="stat__label">${s.label}</span>
        </div>`).join('');

  const stepCard = ([t, d], i) => `
        <div class="step reveal" data-num="${String(i + 1).padStart(2, '0')}">
          <span class="step__num">Step ${String(i + 1).padStart(2, '0')}</span>
          <h3 class="step__title">${t}</h3>
          <p class="step__text">${d}</p>
        </div>`;

  // The approach section runs two columns, so the six stages split down the middle.
  const allSteps = home.process.steps.map(stepCard);
  const half = Math.ceil(allSteps.length / 2);
  const stepsA = allSteps.slice(0, half).join('');
  const stepsB = allSteps.slice(half).join('');

  const genreCards = home.genreDetail.items.map(([ic, t, d]) => `
        <div class="genre reveal">
          <span class="genre__icon">${icon(ic)}</span>
          <div>
            <h3 class="genre__title">${t}</h3>
            <p class="genre__text">${d}</p>
          </div>
        </div>`).join('');

  const tabs = ['all', ...home.genres].map((g, i) => `
        <button class="tab${i === 0 ? ' is-active' : ''}" type="button" role="tab" aria-selected="${i === 0}" data-genre="${g}">${g === 'all' ? 'All' : g}</button>`).join('');

  const books = home.books.map((bk, i) => {
    const [genre, name, author, rating] = bk;
    return `
        <div class="book reveal" data-genre="${genre}">
          <div class="book__cover">
            ${coverArt(bk, i)}
            <span class="book__tag">${genre}</span>
          </div>
          <div class="book__meta">
            <span class="book__name">${name}</span>
            <span class="book__rating">${solidStar}${rating}</span>
          </div>
          <span class="book__author">${author}</span>
        </div>`;
  }).join('');

  const faqs = home.faq.map(([q, a]) => `
      <div class="faq__item">
        <button class="faq__q" type="button" aria-expanded="false">
          ${q}
          ${icon('plus', 'faq__icon')}
        </button>
        <div class="faq__a"><div><p>${a}</p></div></div>
      </div>`).join('');

  const body = `
<section class="hero">
  ${bookStackArt()}
  <div class="shell hero__grid">
    <div class="hero__copy">
      <span class="kicker">Ghostwriting · Editing · Publishing</span>
      <h1 class="hero__title">${home.hero.title}</h1>
      <p class="lede hero__lede">${home.hero.lede}</p>
      <p class="hero__points-label">${home.hero.pointsLabel}</p>
      <ul class="hero__points">
        ${home.hero.points.map((p) => `<li>${icon('check')}<span>${p}</span></li>`).join('\n        ')}
      </ul>
      <div class="btn-row">
        <a class="btn btn--solid" href="contact.html">Get Started ${icon('arrow')}</a>
        <a class="btn btn--light" href="#services">See our services</a>
      </div>
    </div>
    <div class="hero__art" aria-hidden="true">
      <div class="hero__stack">
        ${home.books.slice(0, 3).map((bk, i) => book3d(bk, i)).join('')}
      </div>
      <div class="hero__badge">
        <span class="hero__badge-stars">${solidStar.repeat(5)}</span>
        <span class="hero__badge-text">Authors keep <strong>100%</strong> of royalties</span>
      </div>
    </div>
  </div>
</section>

<section class="section section--warm">
  <div class="shell split">
    ${listingArt()}
    <div>
      <span class="kicker">${home.about.kicker}</span>
      <h2 class="h2">${home.about.title}</h2>
      ${home.about.body.map((p) => `<p class="lede">${p}</p>`).join('\n      ')}
      <div class="btn-row" style="margin-top:30px">
        <a class="btn btn--solid" href="contact.html">Get Started ${icon('arrow')}</a>
        <a class="btn" href="about.html">More about us</a>
      </div>
    </div>
  </div>
</section>

<section class="section section--tight stats-band">
  <div class="shell">
    <div class="stats-band__head">
      <span class="kicker kicker--orange">By the numbers</span>
      <h2 class="h3">A team that has done this <em>before</em></h2>
      <p class="stats-band__lede">Editors, designers and production staff who work on books full time — not a marketplace of freelancers assembled per project.</p>
    </div>
    <div class="stats reveal">${stats}
    </div>
  </div>
</section>

<section class="section" id="services">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="kicker">${home.servicesIntro.kicker}</span>
      <h2 class="h2">${home.servicesIntro.title}</h2>
      <p class="lede">${home.servicesIntro.lede}</p>
    </div>
    <div class="grid grid--4">${gridServices.map(serviceCard).join('')}
    </div>
  </div>
</section>

${ctaBand('Are you ready to become a <em>published</em> author?', 'Amazo Publishers is your route to a book that exists — properly made, and entirely yours.', 0)}

<section class="section">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="kicker">${home.genreDetail.kicker}</span>
      <h2 class="h2">${home.genreDetail.title}</h2>
      <p class="lede">${home.genreDetail.lede}</p>
    </div>
    <div class="genres">${genreCards}
    </div>
  </div>
</section>

<section class="section section--warm">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="kicker">${home.extraIntro.kicker}</span>
      <h2 class="h2">${home.extraIntro.title}</h2>
      <p class="lede">${home.extraIntro.lede}</p>
    </div>
    <div class="circles">
      ${extraServices.map((s) => `<a class="circle-item reveal" href="${href(s)}">
        <span class="circle-item__ring">${icon(s.icon)}</span>
        <span class="circle-item__label">${s.title}</span>
        <span class="circle-item__text">${s.short}</span>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="kicker">Our shelf</span>
      <h2 class="h2">Look at our <em>bestsellers</em></h2>
      <p class="lede">A sample of the books our authors have published.</p>
    </div>
    <div class="tabs" role="tablist">${tabs}
    </div>
    <div class="books">${books}
    </div>
  </div>
</section>

<section class="section section--tight section--warm">
  <div class="shell">
    <div class="section-head section-head--center" style="margin-bottom:34px">
      <span class="kicker">Distribution</span>
      <h2 class="h3" style="font-family:var(--serif)">Sell your book with</h2>
    </div>
  </div>
  ${marquee(home.platforms, 'Distribution platforms')}
</section>

<section class="section">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="kicker">${home.process.kicker}</span>
      <h2 class="h2">${home.process.title}</h2>
      <p class="lede">${home.process.lede}</p>
    </div>
    <div class="approach">
      <div class="approach__col">${stepsA}
      </div>
      <div class="approach__col">${stepsB}
      </div>
    </div>
  </div>
</section>

<section class="section section--tight section--ink qtile-section">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="kicker">Testimonials</span>
      <h2 class="h2" style="color:var(--paper)">What our <em>authors</em> say</h2>
    </div>
  </div>
  ${quoteMarquee(home.testimonials)}
</section>

<section class="section">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="kicker">Answers</span>
      <h2 class="h2">Frequently asked <em>questions</em></h2>
    </div>
    <div class="faq">${faqs}
    </div>
  </div>
</section>

${leadBand('Tell your story to the <em>world</em>', 'Leave us three details and we will come back with an honest read on your book — scope, timeline and cost, before you commit to anything.')}
`;

  return layout({
    title: `${site.name} — Ghostwriting, Book Editing & Publishing Services`,
    desc: 'Amazo Publishers helps authors write, edit, design and publish their books — ghostwriting, editing, cover design, formatting, Amazon publishing, audiobooks and marketing. You keep every right.',
    current: 'index.html',
    body
  });
};

/* ==========================================================================
   SERVICE PAGES
   ========================================================================== */
const servicePage = (s) => {
  const related = services.filter((x) => x.slug !== s.slug).slice(0, 4);

  const body = `
<section class="page-hero">
  <div class="shell">
    <p class="crumbs"><a href="index.html">Home</a> &nbsp;/&nbsp; <a href="index.html#services">Services</a> &nbsp;/&nbsp; <span>${s.title}</span></p>
    <div class="page-hero__grid">
      <div>
        <span class="kicker kicker--orange">${s.title}</span>
        <h1 class="display">${s.heroTitle}</h1>
        <p class="lede" style="margin-top:18px">${s.lede}</p>
        <div class="btn-row" style="margin-top:30px">
          <a class="btn btn--solid" href="contact.html?service=${encodeURIComponent(s.title)}">Get a quote ${icon('arrow')}</a>
          <a class="btn" href="mailto:${site.email}">Ask a question</a>
        </div>
      </div>
      ${coverFan(services.findIndex((x) => x.slug === s.slug))}
    </div>
  </div>
</section>

<section class="section">
  <div class="shell layout-aside">

    <div class="prose">
      <h2>What this is</h2>
      <p>${s.intro}</p>

      <h2>What’s included</h2>
      <ul>
        ${s.includes.map((i) => `<li>${i}</li>`).join('\n        ')}
      </ul>

      <h2>How it runs</h2>
      ${s.process.map(([t, d], i) => `
      <h3><span class="prose__step-num">${String(i + 1).padStart(2, '0')}</span>${t}</h3>
      <p>${d}</p>`).join('')}

      <h2>Why it matters</h2>
      <p>${s.why}</p>
    </div>

    <aside class="sticky-aside">
      <div class="aside-card">
        <h3>Talk to us about ${s.title.toLowerCase()}</h3>
        <p>Tell us where the book is now. We will tell you what it needs and what that costs — before you commit to anything.</p>
        <a class="btn btn--solid" href="contact.html?service=${encodeURIComponent(s.title)}" style="width:100%">Get Started</a>
      </div>

      <div class="aside-card" style="margin-top:20px">
        <h3>Other services</h3>
        <ul class="aside-links">
          ${related.map((r) => `<li><a href="${href(r)}">${r.nav} ${icon('arrow')}</a></li>`).join('\n          ')}
        </ul>
      </div>
    </aside>

  </div>
</section>

${ctaBand('Ready when <em>you</em> are', 'One conversation is usually enough to tell you whether this is the right next step.', 5)}
`;

  return layout({
    title: `${s.title} Services — ${site.name}`,
    desc: attr(s.short),
    current: href(s),
    body
  });
};

/* ==========================================================================
   ABOUT
   ========================================================================== */
const aboutPage = () => {
  const stats = home.about.stats.map((s) => `
        <div class="stat">
          <span class="stat__num" data-count="${s.num}" data-suffix="${s.suffix}">0</span>
          <span class="stat__label">${s.label}</span>
        </div>`).join('');

  // Compact stage list — the full step cards live on the homepage.
  const stages = home.process.steps.map(([t], i) => `
        <li class="stage">
          <span class="stage__num">${String(i + 1).padStart(2, '0')}</span>
          <span class="stage__name">${t}</span>
        </li>`).join('');

  const body = `
<section class="page-hero">
  <div class="shell">
    <p class="crumbs"><a href="index.html">Home</a> &nbsp;/&nbsp; <span>About</span></p>
    <div class="page-hero__grid">
      <div>
        <span class="kicker kicker--orange">About us</span>
        <h1 class="display">We exist for the books that would otherwise stay in <em>a drawer</em></h1>
        <p class="lede" style="margin-top:18px">Amazo Publishers is a working team of ghostwriters, editors, designers and publishing specialists. We do one thing: turn finished and half-finished manuscripts into books that are properly made and genuinely findable.</p>
      </div>
      <div class="page-hero__art">${deskArt()}</div>
    </div>
  </div>
</section>

<section class="section">
  <div class="shell split">
    <div class="prose">
      <h2>What we believe</h2>
      <p>Publishing has never been more open, and it has never been easier to do badly. Anyone can upload a file. Far fewer people can produce a book that a stranger will pick up, trust, and finish.</p>
      <p>The distance between those two outcomes is craft — structural editing, typesetting, cover design, metadata — and it is almost entirely invisible to readers when it is done well. That invisible work is what we sell.</p>
      <p>We also believe an author should finish the process owning everything. <strong>Your rights, your accounts, your royalties, your name.</strong> We take a fee for work performed and no ongoing interest in what you have made.</p>
    </div>
    <div class="stats reveal">${stats}
    </div>
  </div>
</section>

${/* The six stages are set out in full on the homepage; here they are a
      compact reference so the page does not restate a whole section. */''}
<section class="section section--tight section--warm">
  <div class="shell">
    <div class="section-head section-head--center" style="margin-bottom:28px">
      <span class="kicker">${home.process.kicker}</span>
      <h2 class="h3" style="font-family:var(--serif)">${home.process.title}</h2>
    </div>
    <ol class="stage-list reveal">${stages}
    </ol>
    <p class="stage-list__note"><a href="index.html#services">See how each stage works ${icon('arrow')}</a></p>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="section-head section-head--center">
      <span class="kicker">Straight answers</span>
      <h2 class="h2">Things we will <em>not</em> tell you</h2>
      <p class="lede">Every publishing service makes promises. These are the ones we refuse to make.</p>
    </div>
    <div class="grid grid--3">
      <div class="card reveal">
        <span class="card__icon">${icon('money')}</span>
        <h3 class="card__title">That you will get rich</h3>
        <p class="card__text">Most books do not earn out. We can make yours as good and as findable as it can be. We cannot promise a number, and anyone who does is guessing.</p>
      </div>
      <div class="card reveal">
        <span class="card__icon">${icon('star')}</span>
        <h3 class="card__title">That we can buy reviews</h3>
        <p class="card__text">We run legitimate ARC and reader outreach. We do not purchase reviews. It violates every retailer’s terms and it gets books delisted.</p>
      </div>
      <div class="card reveal">
        <span class="card__icon">${icon('rocket')}</span>
        <h3 class="card__title">That bestseller status is guaranteed</h3>
        <p class="card__text">Narrow categories can be targeted honestly, and we do target them. But a guarantee of rank is a guarantee nobody can keep.</p>
      </div>
    </div>
  </div>
</section>

${ctaBand('Let’s talk about your <em>book</em>', 'Send us the manuscript, the outline, or just the idea. We will give you a straight assessment.', 6)}
`;

  return layout({
    title: `About — ${site.name}`,
    desc: 'Amazo Publishers is a team of ghostwriters, editors, designers and publishing specialists helping authors produce books that are properly made and genuinely findable.',
    current: 'about.html',
    body
  });
};

/* ==========================================================================
   CONTACT
   ========================================================================== */
const contactPage = () => {
  const options = services
    .map((s) => `<option value="${attr(s.title)}">${s.title}</option>`)
    .join('\n            ');

  const details = [
    `<li>${icon('mail')}<span><strong style="color:var(--ink)">Email</strong><br><a href="mailto:${site.email}">${site.email}</a></span></li>`,
    site.phone ? `<li>${icon('phone')}<span><strong style="color:var(--ink)">Phone</strong><br><a href="tel:${site.phone.replace(/[^+\d]/g, '')}">${site.phone}</a></span></li>` : '',
    site.address ? `<li>${icon('pin')}<span><strong style="color:var(--ink)">Office</strong><br>${site.address}</span></li>` : ''
  ].filter(Boolean).join('\n          ');

  const body = `
<section class="page-hero">
  <div class="shell">
    <p class="crumbs"><a href="index.html">Home</a> &nbsp;/&nbsp; <span>Contact</span></p>
    <div style="max-width:720px">
      <span class="kicker kicker--orange">Contact</span>
      <h1 class="display">Tell us what you are <em>working on</em></h1>
      <p class="lede" style="margin-top:18px">Send the manuscript, the outline, or a paragraph describing the idea. You will get a real reply from a person who has read it — usually within one business day.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="shell layout-aside">

    <form class="form-card" data-mailto-form="${site.email}" data-subject="Website enquiry — Amazo Publishers">
      <h2 class="h3" style="margin-bottom:24px">Start your project</h2>

      <div class="field-row">
        <div class="field">
          <label for="name">Your name</label>
          <input type="text" id="name" name="name" required autocomplete="name" placeholder="Jane Doe">
        </div>
        <div class="field">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required autocomplete="email" placeholder="jane@example.com">
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label for="phone">Phone <span style="text-transform:none;letter-spacing:0">(optional)</span></label>
          <input type="tel" id="phone" name="phone" autocomplete="tel" placeholder="+1 555 000 0000">
        </div>
        <div class="field">
          <label for="service">Service</label>
          <select id="service" name="service">
            <option value="">I'm not sure yet</option>
            ${options}
          </select>
        </div>
      </div>

      <div class="field">
        <label for="message">About your book</label>
        <textarea id="message" name="message" required placeholder="Where is the book now — an idea, a draft, or finished? What do you need help with?"></textarea>
      </div>

      <button class="btn btn--solid" type="submit" style="width:100%">Send enquiry ${icon('arrow')}</button>

      <div class="form-status" role="status"></div>
      <p class="form-note">We reply to every enquiry. Your manuscript and your details stay confidential — see our <a href="privacy.html" style="color:var(--orange-deep)">privacy policy</a>.</p>
    </form>

    <aside class="sticky-aside">
      <div class="aside-card">
        <h3>Direct details</h3>
        <ul class="footer-contact" style="color:var(--paper-dim)">
          ${details}
        </ul>
      </div>

      <div class="aside-card" style="margin-top:20px">
        <h3>What happens next</h3>
        <ul class="aside-links">
          <li><span>1 — We read what you sent</span></li>
          <li><span>2 — A straight assessment of what it needs</span></li>
          <li><span>3 — A written scope and a fixed quote</span></li>
          <li><span>4 — You decide, with no pressure</span></li>
        </ul>
      </div>
    </aside>

  </div>
</section>
`;

  return layout({
    title: `Contact — ${site.name}`,
    desc: `Talk to Amazo Publishers about ghostwriting, editing, cover design, formatting, publishing or marketing your book. Email ${site.email}.`,
    current: 'contact.html',
    body
  });
};

/* ==========================================================================
   LEGAL PAGES
   ========================================================================== */
const legalPage = (p) => {
  const content = p.body
    .map(([tag, text]) => (tag === 'h2' ? `<h2>${text}</h2>` : `<p>${text}</p>`))
    .join('\n      ');

  const body = `
<section class="page-hero">
  <div class="shell">
    <p class="crumbs"><a href="index.html">Home</a> &nbsp;/&nbsp; <span>${p.title}</span></p>
    <div style="max-width:720px">
      <h1 class="display">${p.title}</h1>
      <p class="lede" style="margin-top:18px">${p.lede}</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="prose">
      ${content}
      <p style="margin-top:2.4em;font-size:14px">Last updated: <span data-year>2026</span>. These pages are a starting point and should be reviewed by a qualified lawyer before launch.</p>
    </div>
  </div>
</section>
`;

  return layout({
    title: `${p.title} — ${site.name}`,
    desc: attr(p.lede),
    current: `${p.slug}.html`,
    body
  });
};

/* ==========================================================================
   FAVICON
   ========================================================================== */
/* An "A" drawn as strokes rather than <text> — a favicon is an isolated
   document and does not inherit the page's fonts, so type here would fall
   back to whatever the OS has. Paths render identically everywhere and stay
   legible at 16px. */
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#14140F"/>
  <path d="M8.5 24.5 16 7.5l7.5 17" fill="none" stroke="#F2830A" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12.1 19.4h7.8" stroke="#F2830A" stroke-width="3.1" stroke-linecap="round"/>
</svg>
`;

/* ==========================================================================
   LOGO PLACEHOLDER
   Stand-in art until the real logo lands. Written only when the file is
   absent (see writeIfMissing), so replacing assets/img/logo.svg with the
   real thing survives every rebuild.
   ========================================================================== */
const logoPlaceholder = (onDark) => {
  const ink   = onDark ? '#FDFDFB' : '#14140F';
  const dim   = onDark ? '#FDFDFB' : '#6B6A63';
  const box   = onDark ? 'fill="#FDFDFB" fill-opacity=".06"' : 'fill="#F0EDE5"';
  const edge  = onDark ? ' stroke-opacity=".55"' : ' opacity=".85"';
  const sub   = onDark ? ' fill-opacity=".55"' : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 48" width="200" height="48" role="img" aria-label="Logo placeholder">
  <rect x="1" y="1" width="198" height="46" rx="8" ${box} stroke="${ink}" stroke-width="1.5" stroke-dasharray="6 5"${edge}/>
  <g transform="translate(14 11)">
    <path d="M1 2.2A1.4 1.4 0 0 1 2.4.8H10v22.4H2.4A1.4 1.4 0 0 1 1 21.8V2.2Z" fill="${ink}" opacity="${onDark ? '.2' : '.16'}"/>
    <path d="M1 2.2A1.4 1.4 0 0 1 2.4.8H10v22.4H2.4A1.4 1.4 0 0 1 1 21.8V2.2Z" fill="none" stroke="${ink}" stroke-width="1.5"/>
    <path d="M21 2.2A1.4 1.4 0 0 0 19.6.8H12v22.4h7.6a1.4 1.4 0 0 0 1.4-1.4V2.2Z" fill="none" stroke="#F2830A" stroke-width="1.5"/>
    <path d="M14.8 7h3.4M14.8 10.8h3.4" stroke="#F2830A" stroke-width="1.5" stroke-linecap="round"/>
  </g>
  <text x="48" y="23" font-family="Inter, Segoe UI, sans-serif" font-size="13" font-weight="600" letter-spacing="2.6" fill="${ink}">YOUR LOGO</text>
  <text x="48" y="37" font-family="Inter, Segoe UI, sans-serif" font-size="8.5" letter-spacing="1.2" fill="${dim}"${sub}>PLACEHOLDER · 200 × 48</text>
</svg>
`;
};

/* ==========================================================================
   WRITE EVERYTHING
   ========================================================================== */
const write = (file, contents) => {
  fs.writeFileSync(path.join(ROOT, file), contents, 'utf8');
  console.log('  ✓ ' + file);
};

/* Used for the logo placeholders: restores them if they go missing, but never
   overwrites a real logo that has been dropped in at the same path. */
const writeIfMissing = (file, contents) => {
  const full = path.join(ROOT, file);
  if (fs.existsSync(full)) { console.log('  · ' + file + ' (kept)'); return; }
  fs.writeFileSync(full, contents, 'utf8');
  console.log('  ✓ ' + file + ' (placeholder created)');
};

fs.mkdirSync(path.join(ROOT, 'assets', 'img'), { recursive: true });

console.log('\nBuilding Amazo Publishers…\n');

write('index.html', homePage());
write('about.html', aboutPage());
write('contact.html', contactPage());
services.forEach((s) => write(href(s), servicePage(s)));
legal.forEach((p) => write(`${p.slug}.html`, legalPage(p)));
write(path.join('assets', 'img', 'favicon.svg'), favicon);
writeIfMissing(path.join('assets', 'img', 'logo.svg'), logoPlaceholder(false));
writeIfMissing(path.join('assets', 'img', 'logo-light.svg'), logoPlaceholder(true));

console.log(`\nDone — ${3 + services.length + legal.length} pages.\n`);
