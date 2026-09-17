/* ==========================================================================
   Header component — sticky top bar, used by every page via layout().

   header(current) → HTML string
     current: the URL of the page being rendered (e.g. '/about').
              Used to mark the matching nav link with aria-current="page";
              pass nothing on pages with no nav entry of their own.

   Every service sits behind one "Services" item that opens a mega panel:
   categories down the left, that category's services on the right. The
   categories and their contents are SERVICE_GROUPS in lib/helpers.js, which
   fails the build if a service is missing from all of them.
   ========================================================================== */

const {
  href, attr, icon, wordmark, bySlug, SERVICE_GROUPS
} = require('../lib/helpers.js');

const header = (current) => {
  const isCur = (h) => (current === h ? ' aria-current="page"' : '');

  /* The panel is one tablist plus one panel per category. Only the first is
     shown; the rest are marked hidden so that with no JS the menu still
     offers a complete, readable set of links rather than an empty shell. */
  const tabs = SERVICE_GROUPS.map((g, i) => `
            <button class="mega__tab${i === 0 ? ' is-active' : ''}" type="button"
                    role="tab" id="mega-tab-${i}" aria-controls="mega-panel-${i}"
                    aria-selected="${i === 0 ? 'true' : 'false'}" tabindex="${i === 0 ? '0' : '-1'}">
              <span class="mega__tab-icon">${icon(g.icon)}</span>
              <span>${g.label}</span>
              <span class="mega__tab-chev">${icon('arrow')}</span>
            </button>`).join('');

  const panels = SERVICE_GROUPS.map((g, i) => {
    const links = g.slugs
      .map((slug) => {
        const s = bySlug[slug];
        return `<li><a href="${href(s)}"${isCur(href(s))} title="${attr(s.title)}">${s.nav}</a></li>`;
      })
      .join('\n                ');

    return `
          <div class="mega__panel${i === 0 ? ' is-active' : ''}" role="tabpanel"
               id="mega-panel-${i}" aria-labelledby="mega-tab-${i}"${i === 0 ? '' : ' hidden'}>
            <p class="mega__heading">${g.label}</p>
            <ul class="mega__links">
                ${links}
            </ul>
          </div>`;
  }).join('');

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
        <li class="nav__item"><a class="nav__link" href="/"${isCur('/')}>Home</a></li>
        <li class="nav__item"><a class="nav__link" href="/about"${isCur('/about')}>About</a></li>
        <li class="nav__item nav__item--has-panel nav__item--mega">
          <button class="nav__link" type="button" aria-expanded="false" aria-haspopup="true">
            Services
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="mega nav__panel">
            <div class="mega__inner">
              <div class="mega__rail" role="tablist" aria-label="Service categories">${tabs}
              </div>
              <div class="mega__panels">${panels}
              </div>
            </div>
          </div>
        </li>
        <li class="nav__item"><a class="nav__link" href="/contact"${isCur('/contact')}>Contact</a></li>
      </ul>
      <div class="nav__mobile-cta">
        <a class="btn btn--solid" href="/contact">Get Started</a>
      </div>
    </nav>

    <a class="btn btn--solid header-cta" href="/contact">Get Started</a>
  </div>
  <span class="scroll-progress" aria-hidden="true"></span>
</header>`;
};

module.exports = { header };
