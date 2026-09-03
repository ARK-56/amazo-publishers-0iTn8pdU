/* ==========================================================================
   Footer component — contact strip plus the footer columns, used by every
   page via layout().

   footer() → HTML string

   Both the strip and the "Get in touch" column render phone and address
   only once site.phone / site.address actually have values, so the
   placeholders in site.data.js never reach the page as empty rows.
   ========================================================================== */

const { site, services } = require('../site.data.js');
const { icon, href, bySlug, wordmark } = require('../lib/helpers.js');

/* Which services appear under each footer heading. Kept balanced — the column
   height is set by whichever list is longest, so an even split keeps rows off
   the footer on every page. */
const WRITING_LINKS = [
  'ghostwriting',
  'book-editing-proofreading',
  'book-publishing',
  'book-formatting',
  'amazon-book-publishing',
  'childrens-books',
  'comics-graphic-novels',
  'blog-article-writing'
];
const OTHER_LINKS = [
  'book-cover-design',
  'audio-book',
  'book-marketing',
  'hassle-free-publishing',
  'book-promotion',
  'book-video-trailer',
  'author-website',
  'website-content-writing'
];

/* These two lists are hand-ordered rather than derived, so a newly added
   service can silently miss the footer. Fail the build instead. */
const listed = new Set([...WRITING_LINKS, ...OTHER_LINKS]);
const unlisted = services.filter((s) => !listed.has(s.slug)).map((s) => s.slug);
if (unlisted.length) {
  throw new Error(
    'footer.js: these services are not in WRITING_LINKS or OTHER_LINKS and would ' +
    'be unreachable from the footer: ' + unlisted.join(', ')
  );
}

const telHref = () => site.phone.replace(/[^+\d]/g, '');

const footer = () => {
  const linkList = (slugs) =>
    slugs.map((s) => `<li><a href="${href(bySlug[s])}">${bySlug[s].nav}</a></li>`).join('\n          ');

  const writingLinks = linkList(WRITING_LINKS);
  const otherLinks = linkList(OTHER_LINKS);

  const contactRows = [
    `<li>${icon('mail')}<a href="mailto:${site.email}">${site.email}</a></li>`,
    site.phone ? `<li>${icon('phone')}<a href="tel:${telHref()}">${site.phone}</a></li>` : '',
    site.address ? `<li>${icon('pin')}<span>${site.address}</span></li>` : ''
  ].filter(Boolean).join('\n          ');

  return `
<footer class="site-footer">
  <div class="shell">
    <div class="footer-grid">

      <div class="footer-brand">
        ${wordmark('', 'light')}
        <p>${site.tagline} You keep the rights, the royalties and the accounts every time.</p>
        <div class="socials">
          <a href="${site.social.facebook}" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg></a>
          <a href="${site.social.instagram}" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg></a>
        </div>
      </div>

      <div class="footer-col">
        <h4>Writing Services</h4>
        <ul>
          ${writingLinks}
        </ul>
      </div>

      <div class="footer-col">
        <h4>Other Services</h4>
        <ul>
          ${otherLinks}
        </ul>
      </div>

      <div class="footer-col">
        <h4>Get in touch</h4>
        <ul class="footer-contact">
          ${contactRows}
        </ul>
      </div>

    </div>

    <div class="footer-bar">
      <p>&copy; <span data-year>2026</span> ${site.name}. All rights reserved.</p>
      <ul>
        <li><a href="about.html">About</a></li>
        <li><a href="contact.html">Contact</a></li>
        <li><a href="terms.html">Terms &amp; Conditions</a></li>
        <li><a href="privacy.html">Privacy Policy</a></li>
        <li><a href="refund-policy.html">Refund Policy</a></li>
      </ul>
    </div>
  </div>
</footer>`;
};

module.exports = { footer };
