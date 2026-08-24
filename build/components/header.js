/* ==========================================================================
   Header component — sticky top bar, used by every page via layout().

   header(current) → HTML string
     current: the filename of the page being rendered (e.g. 'about.html').
              Used to mark the matching nav link with aria-current="page";
              pass nothing on pages with no nav entry of their own.
   ========================================================================== */

const {
  href, attr, wordmark, navPrimary, navOther, NAV_SHORT
} = require('../lib/helpers.js');

const header = (current) => {
  const isCur = (h) => (current === h ? ' aria-current="page"' : '');

  const primaryItems = navPrimary
    .map(
      (s) =>
        `<li class="nav__item"><a class="nav__link" href="${href(s)}"${isCur(href(s))} title="${attr(s.title)}">${NAV_SHORT[s.slug] || s.nav}</a></li>`
    )
    .join('\n            ');

  const otherItems = navOther
    .map((s) => `<li><a href="${href(s)}"${isCur(href(s))}>${s.nav}</a></li>`)
    .join('\n                ');

  return `
<header class="site-header">
  <div class="shell header-inner">
    ${wordmark()}

    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Toggle navigation">
      <svg class="icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>

    <nav class="nav" id="site-nav" aria-label="Main">
      <ul class="nav__list">
            ${primaryItems}
        <li class="nav__item nav__item--has-panel">
          <button class="nav__link" type="button" aria-expanded="false" aria-haspopup="true">
            Other Services
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <ul class="nav__panel">
                ${otherItems}
          </ul>
        </li>
        <li class="nav__item"><a class="nav__link" href="about.html"${isCur('about.html')}>About</a></li>
        <li class="nav__item"><a class="nav__link" href="contact.html"${isCur('contact.html')}>Contact</a></li>
      </ul>
      <div class="nav__mobile-cta">
        <a class="btn btn--solid" href="contact.html">Get Started</a>
      </div>
    </nav>

    <a class="btn btn--solid header-cta" href="contact.html">Get Started</a>
  </div>
  <span class="scroll-progress" aria-hidden="true"></span>
</header>`;
};

module.exports = { header };
