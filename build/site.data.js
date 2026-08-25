/* ==========================================================================
   Amazo Publishers — single source of truth for all page content.
   Edit here, then run `node build/build.js` to regenerate the HTML.
   ========================================================================== */

const site = {
  name: 'Amazo Publishers',
  tagline: 'Ghostwriting, editing and publishing for authors who mean it.',
  email: 'hello@amazopublishers.com',

  /* ---- PLACEHOLDERS — replace with Amazo's real details before launch ---- */
  phone: '',                       // e.g. '(000) 000-0000'
  address: '',                     // e.g. '123 Example St, Suite 100, Austin, TX'
  social: {
    facebook: 'https://www.facebook.com/amazopublishers',
    instagram: 'https://www.instagram.com/amazopublishers'
  },
  /* ----------------------------------------------------------------------- */

  url: 'https://amazopublishers.com',

  /* ---- LOGO — currently placeholder art in assets/img/ ----
     Drop the real files in and point these at them. Any format works
     (.svg, .png, .webp). `src` sits on the light header, `light` on the
     dark footer; if the real logo reads well on both, point them at the
     same file. width/height are the intrinsic pixel size and are used to
     reserve space so the header does not shift while the image loads. */
  logo: {
    src:    'assets/img/logo.png',
    light:  'assets/img/logo.png',
    width:  286,
    height: 56,
    alt:    'Amazo Publishers'
  },

  /* Screenshot shown on the tablet in the About composition — a real store
     listing for one of the titles. Extension is probed like the book covers,
     and if no file is found the tablet falls back to drawn artwork. */
  listingShot: {
    src: 'assets/img/amz-ss',
    alt: 'The Weirdos by Chinmay Chakravarty listed for sale on Amazon'
  },

  /* Entry popup, mirroring the reference site's lead modal. Set enabled:false
     to switch it off site-wide. `offer` is deliberately empty — put a real,
     honoured offer here or leave it out; do not advertise a discount the
     business will not actually give. */
  popup: {
    enabled: true,
    delay: 0,             // ms before it appears; 0 = as soon as the DOM is ready
    lead: 'Launch',       // the oversized first word
    title: 'Your <em>Book</em>',
    /* The banner across the middle. This one is true — the editing service
       already includes a free sample edit. If you swap in a discount, make
       sure it is one the business will actually honour. Empty hides the bar. */
    offer: 'Free sample edit',
    sub: 'Get your name on the cover of a <em>properly made book</em>',
    note: 'No obligation. We reply within one business day.'
  }
};

/* --------------------------------------------------------------------------
   Icon set — 24x24 stroke icons, inherit currentColor.
   -------------------------------------------------------------------------- */
const icons = {
  pen:      '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/>',
  edit:     '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  book:     '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  layout:   '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>',
  cart:     '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  palette:  '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
  megaphone:'<path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  article:  '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
  audio:    '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
  globe:    '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  video:    '<path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
  rocket:   '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  shield:   '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
  handshake:'<path d="M11 17l2 2a1 1 0 0 0 1.5 0l3-3"/><path d="M2 12l4-4 4 4"/><path d="M14 6l4 4 4-4"/><path d="M6 8v6l5 5"/><path d="M18 10v6l-3 3"/>',
  clock:    '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  search:   '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>',
  star:     '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  check:    '<circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/>',
  arrow:    '<path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>',
  mail:     '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
  phone:    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  pin:      '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  money:    '<circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M15 9.5c0-1.38-1.34-2.5-3-2.5s-3 1.12-3 2.5S10.34 12 12 12s3 1.12 3 2.5-1.34 2.5-3 2.5-3-1.12-3-2.5"/>',
  plus:     '<path d="M12 5v14"/><path d="M5 12h14"/>'
};

/* --------------------------------------------------------------------------
   SERVICES — the full line-up carried over from the reference site.
   `primary: true` puts it in the main nav and the 8-card home grid.
   -------------------------------------------------------------------------- */
const services = [
  {
    slug: 'ghostwriting',
    title: 'Ghostwriting',
    nav: 'Ghostwriting',
    primary: true,
    icon: 'pen',
    short: 'Unlock your story’s potential with professional ghostwriters who write in your voice, not theirs.',
    heroTitle: 'Your story, in <em>your</em> voice',
    lede: 'You have the story. We have the writers who can put it on the page without flattening what makes it yours. Fiction, memoir, business, or leadership — you stay the author, we do the drafting.',
    intro: 'A ghostwriter is not a substitute for your voice. They are a way of getting it out of your head and onto the page faster and more cleanly than most people manage alone. Our writers interview you, absorb how you actually talk, and then draft chapters you recognise as your own.',
    includes: [
      'A dedicated writer matched to your genre and register',
      'Structured interview sessions to capture voice, detail and chronology',
      'A chapter-by-chapter outline you approve before drafting begins',
      'Full manuscript drafting with unlimited revisions inside the agreed scope',
      'A developmental pass before the manuscript goes to editing',
      'Complete confidentiality — your name is the only one on the book'
    ],
    process: [
      ['Discovery', 'We talk through the book you want, who it is for, and what it has to do for you.'],
      ['Voice capture', 'Recorded interviews and any material you already have become the raw source.'],
      ['Outline', 'A chapter map you sign off on, so nobody writes 60,000 words in the wrong direction.'],
      ['Drafting', 'Chapters arrive in batches for your notes as they are written, not all at the end.']
    ],
    why: 'Because a book that sounds like a press release will not hold a reader for 300 pages. We write to be read.'
  },
  {
    slug: 'book-editing-proofreading',
    title: 'Book Editing & Proofreading',
    nav: 'Book Editing & Proofreading',
    primary: true,
    icon: 'edit',
    short: 'Refine your writing with developmental, line and copy editing — plus a final proofread that catches what everyone else missed.',
    heroTitle: 'Editing that respects the <em>draft</em> you wrote',
    lede: 'Three levels of editing, clearly separated, so you buy the pass your manuscript actually needs — not a bundle you do not.',
    intro: 'Most manuscripts do not need everything. A tight draft with a structural problem needs a developmental editor, not a comma hunt. A finished, well-shaped book needs a proofreader, not a rewrite. We tell you which one you are looking at before you pay for anything.',
    includes: [
      'Developmental editing — structure, pacing, argument, character and arc',
      'Line editing — rhythm, clarity and voice at the sentence level',
      'Copy editing — grammar, consistency, style-sheet adherence (CMOS by default)',
      'Proofreading — the final read on formatted pages before print',
      'A written editorial report explaining every substantive change',
      'Tracked changes so you keep the final say on all of it'
    ],
    process: [
      ['Sample edit', 'We edit a few pages free so you can see the hand before committing.'],
      ['Scope', 'We recommend the level of edit and quote against the real word count.'],
      ['The pass', 'Your editor works through the manuscript with tracked changes and margin notes.'],
      ['Review', 'You accept, reject or query. One round of follow-up questions is included.']
    ],
    why: 'A good editor makes the book more like itself. That is the whole job.'
  },
  {
    slug: 'amazon-book-publishing',
    title: 'Amazon Book Publishing',
    nav: 'Amazon Book Publishing',
    primary: true,
    icon: 'cart',
    short: 'Maximise your book’s reach on the world’s largest bookstore — set up properly, categorised properly, launched properly.',
    heroTitle: 'Publish on Amazon <em>properly</em>',
    lede: 'KDP is free to use and easy to get wrong. Metadata, categories, keywords and pricing decide whether your book is findable. We set all of it deliberately.',
    intro: 'Anyone can upload a file to Kindle Direct Publishing. Far fewer people set up the listing so that Amazon’s search actually surfaces it. The difference between a book nobody finds and one that sells steadily is usually not the writing — it is the twenty fields underneath it.',
    includes: [
      'KDP and KDP Print account setup, or publishing under your existing account',
      'Kindle eBook and paperback file preparation to Amazon’s current specs',
      'Category and keyword research targeting reachable bestseller lists',
      'Description copy written and formatted for the Amazon listing',
      'Pricing, royalty tier and territory configuration',
      'A+ Content and Author Central profile setup',
      'Post-launch checks on live listing, look-inside and print proof'
    ],
    process: [
      ['Audit', 'We review your manuscript, cover and any existing listing.'],
      ['Metadata', 'Category, keyword and pricing research, delivered as a plan you approve.'],
      ['Upload', 'Files prepared, uploaded and proofed — digital and print.'],
      ['Live', 'We watch the first week and fix anything Amazon flags.']
    ],
    why: 'You keep the account, the rights and the royalties. We just make the listing work.'
  },
  {
    slug: 'book-marketing',
    title: 'Book Marketing',
    nav: 'Book Marketing',
    primary: true,
    icon: 'megaphone',
    short: 'Strategic marketing that finds the readers who were already looking for a book like yours.',
    heroTitle: 'Marketing aimed at <em>readers</em>, not vanity metrics',
    lede: 'A launch plan built on where your readers already are — not a scattergun campaign measured in impressions nobody acted on.',
    intro: 'Book marketing goes wrong when it optimises for the wrong number. Impressions are cheap. What matters is whether a person who would genuinely enjoy your book ever encounters it. Every plan we write starts from that reader and works backwards.',
    includes: [
      'Reader and comparable-title research — who buys books like yours',
      'A dated launch plan covering pre-order, launch week and the long tail',
      'Amazon Ads and Meta Ads setup, managed against a budget you set',
      'Review generation through legitimate ARC and reader channels',
      'Newsletter, podcast and bookstagram outreach lists with pitch copy',
      'Monthly reporting on sales, rank and cost per copy sold'
    ],
    process: [
      ['Positioning', 'We work out who the book is for and what shelf it sits on.'],
      ['Plan', 'A written campaign with dates, channels and a budget.'],
      ['Run', 'We execute, monitor and reallocate spend toward what converts.'],
      ['Report', 'Plain numbers every month. No dashboards that hide the truth.']
    ],
    why: 'We will tell you when a campaign is not working. That is worth more than a nicer chart.'
  },
  {
    slug: 'book-cover-design',
    title: 'Book Cover Design',
    nav: 'Book Cover Design',
    primary: true,
    icon: 'palette',
    short: 'Covers that read correctly at thumbnail size and hold up in print.',
    heroTitle: 'A cover that signals the <em>right</em> book',
    lede: 'Your cover has about one second to tell a browsing reader what genre they are looking at. We design for that second, then make sure it survives print.',
    intro: 'A cover is a genre signal before it is a piece of art. Readers scanning a category page decide in a moment whether a book is for them, and they decide on visual convention — typeface, palette, composition. We design covers that use those conventions deliberately, then break them only where it helps.',
    includes: [
      'Genre and comparable-cover research before anything is drawn',
      'Three distinct initial concepts, not three versions of one idea',
      'Unlimited refinement on your chosen direction',
      'Front cover, full print wrap (spine and back), and 3D mockups',
      'Thumbnail legibility testing at real Amazon display sizes',
      'Print-ready CMYK PDF plus RGB files for every retailer',
      'Full commercial rights to the final artwork, transferred to you'
    ],
    process: [
      ['Brief', 'Genre, tone, comps, and anything you already love or hate.'],
      ['Concepts', 'Three directions to react to.'],
      ['Refine', 'We take one forward and polish it until it is right.'],
      ['Deliver', 'Every file format you will ever be asked for.']
    ],
    why: 'Designers who have never read your genre make beautiful covers that sell nothing. Ours have.'
  },
  {
    slug: 'book-publishing',
    title: 'Book Publishing',
    nav: 'Book Publishing',
    primary: true,
    icon: 'book',
    short: 'End-to-end publishing: manuscript to distributed book, across every major retailer.',
    heroTitle: 'Manuscript to <em>published</em>, end to end',
    lede: 'One project manager, one plan, and a finished book distributed everywhere readers actually buy.',
    intro: 'Full-service publishing means you hand over a manuscript and get back a book that exists in the world — with an ISBN, a cover, correct interiors, retailer listings and a copyright registration. You keep the rights and the royalties throughout.',
    includes: [
      'Editorial, design, formatting and proofing under one project manager',
      'ISBN assignment for each edition and format',
      'Distribution to Amazon, Apple Books, Barnes & Noble, Kobo and Ingram',
      'Print-on-demand setup in paperback and hardback',
      'Copyright registration guidance',
      'Retail listings, descriptions and author profiles set up across platforms'
    ],
    process: [
      ['Onboarding', 'A dedicated project manager and a written scope.'],
      ['Production', 'Editing, cover, interior and proofs, in sequence, with your sign-off at each gate.'],
      ['Distribution', 'Files go out to every retailer and aggregator in your plan.'],
      ['Handover', 'Accounts, files and rights are all in your name at the end.']
    ],
    why: 'You should own your book when this is over. With us, you do.'
  },
  {
    slug: 'book-formatting',
    title: 'Book Formatting',
    nav: 'Book Formatting',
    primary: true,
    icon: 'layout',
    short: 'Interiors typeset to professional standards for print and every eBook reader.',
    heroTitle: 'Interiors that <em>disappear</em>',
    lede: 'Good typesetting is invisible. Bad typesetting is the reason someone puts a book down at page four.',
    intro: 'Formatting is where self-published books most often give themselves away: inconsistent chapter openers, widows and orphans, a table of contents that does not link, margins that fight the gutter. None of it is difficult. All of it is noticeable.',
    includes: [
      'Print interior typeset to trim size with correct gutters and bleed',
      'Reflowable EPUB tested on Kindle, Apple Books and Kobo',
      'Linked, navigable table of contents',
      'Chapter openers, drop caps, running heads and folios',
      'Image placement and resolution checks for print',
      'Front and back matter — title page, copyright, dedication, about the author'
    ],
    process: [
      ['Spec', 'Trim size, typeface, and any design references you like.'],
      ['Typeset', 'We set the interior and send a full PDF proof.'],
      ['Proof', 'You mark it up. We correct. Repeat until clean.'],
      ['Files', 'Print PDF and EPUB, both retailer-ready.']
    ],
    why: 'Readers cannot tell you why a book felt professional. This is usually why.'
  },
  {
    slug: 'hassle-free-publishing',
    title: 'Hassle-Free Publishing',
    nav: 'Hassle-Free Publishing',
    primary: false,
    icon: 'handshake',
    short: 'The whole thing handled — one manager, one timeline, minimal demands on your calendar.',
    heroTitle: 'Publishing without the <em>project management</em>',
    lede: 'For authors who want the book to exist without learning what a CMYK bleed is. You approve at four points. We do everything between them.',
    intro: 'Most publishing services hand you a to-do list. This one does not. You get a single point of contact, a fixed timeline, and four decision points where your approval is genuinely required. Everything else happens without you.',
    includes: [
      'A single dedicated project manager for the whole book',
      'Editing, cover, formatting, ISBN and distribution all coordinated for you',
      'Four scheduled approval gates instead of constant back-and-forth',
      'A fixed written timeline with dates you can plan around',
      'One invoice, one scope, no per-stage upselling',
      'Everything registered in your name from the beginning'
    ],
    process: [
      ['Kick-off', 'One call. We take the manuscript and everything you have.'],
      ['Gate 1 & 2', 'You approve the edit, then the cover.'],
      ['Gate 3 & 4', 'You approve the interior proof, then the live listings.'],
      ['Done', 'The book is on sale and every account belongs to you.']
    ],
    why: 'The fewer decisions we hand back to you, the better we have done our job.'
  },
  {
    slug: 'book-promotion',
    title: 'Book Promotion',
    nav: 'Book Promotion',
    primary: false,
    icon: 'rocket',
    short: 'Targeted promotion campaigns for launch weeks, price drops and backlist revivals.',
    heroTitle: 'Promotion with a <em>date</em> on it',
    lede: 'Short, sharp, measurable campaigns — built around a launch, a discount or a backlist title that deserves another run.',
    intro: 'Promotion is different from ongoing marketing. It is a concentrated push around a moment: a release, a price promotion, an award listing, a seasonal window. It works when the timing, the offer and the audience line up.',
    includes: [
      'Campaign built around a specific date and goal',
      'Placement on reader newsletters and promotion sites appropriate to your genre',
      'Countdown and free-promotion scheduling for Kindle titles',
      'Social assets — quote cards, teasers, launch graphics',
      'Coordinated review pushes timed to the campaign window',
      'A post-campaign report with sales, rank movement and cost per copy'
    ],
    process: [
      ['Target', 'Pick the moment and the number we are trying to move.'],
      ['Book', 'Placements reserved, assets produced, schedule locked.'],
      ['Run', 'The campaign goes live and we monitor daily.'],
      ['Report', 'What it cost, what it returned, what to do next time.']
    ],
    why: 'A promotion with no measurable goal is just spending. We set the number first.'
  },
  {
    slug: 'audio-book',
    title: 'Audio Book',
    nav: 'Audio Book',
    primary: false,
    icon: 'audio',
    short: 'Studio narration and full audiobook production, distributed to Audible and beyond.',
    heroTitle: 'Your book, <em>narrated</em>',
    lede: 'Audio is the fastest-growing format in publishing. We handle casting, recording, mastering and distribution.',
    intro: 'An audiobook is a genuinely different performance of the same text. Casting matters enormously — the wrong narrator can undo a good book in a chapter. We audition against your manuscript, not against a generic sample.',
    includes: [
      'Narrator casting with auditions read from your actual manuscript',
      'Professional studio recording and direction',
      'Full post-production — editing, mastering and ACX-compliant levels',
      'Quality control listen-through against the manuscript',
      'Distribution to Audible, Apple Books, Spotify, Google Play and libraries',
      'Retail audio sample selection and upload'
    ],
    process: [
      ['Casting', 'Three to five narrator auditions from your text.'],
      ['Record', 'Studio sessions with a director, not a solo read.'],
      ['Master', 'Edited, mastered and QC’d to retailer spec.'],
      ['Distribute', 'Live across the major audio retailers and library systems.']
    ],
    why: 'Audiobook listeners are loyal and underserved. If your genre performs in audio, you should be there.'
  },
  {
    slug: 'website-content-writing',
    title: 'Website Content Writing',
    nav: 'Website Content Writing',
    primary: false,
    icon: 'globe',
    short: 'Clear, search-aware website copy that sounds like a person wrote it.',
    heroTitle: 'Website copy that <em>says</em> something',
    lede: 'Pages written to be read and to be found — in that order.',
    intro: 'Most website copy is written to fill a layout. Ours is written to answer the question the visitor arrived with. Search visibility follows from that far more reliably than it follows from keyword density.',
    includes: [
      'Full page suites — home, about, services, contact and landing pages',
      'Keyword and search-intent research before drafting',
      'Metadata, titles and descriptions written for each page',
      'A consistent tone-of-voice guide you can hand to anyone later',
      'Two rounds of revision on every page',
      'Copy delivered in whatever format your build needs'
    ],
    process: [
      ['Brief', 'Who visits, what they want, what you need them to do.'],
      ['Research', 'Search intent, competitors and the language your audience uses.'],
      ['Draft', 'Page by page, in a shared document you can comment on.'],
      ['Revise', 'Two rounds included, plus metadata for every page.']
    ],
    why: 'If a visitor cannot tell what you do in ten seconds, the design is not the problem.'
  },
  {
    slug: 'book-video-trailer',
    title: 'Book Video Trailer',
    nav: 'Book Video Trailer',
    primary: false,
    icon: 'video',
    short: 'Short, sharp video trailers cut for social feeds and retail pages.',
    heroTitle: 'A trailer built for the <em>feed</em>',
    lede: 'Thirty seconds, sound-off legible, formatted for every aspect ratio you will actually post in.',
    intro: 'Book trailers fail when they imitate film trailers. A feed is not a cinema: it is muted, vertical and thumb-driven. The good ones establish premise and tone within a few seconds and are readable without audio.',
    includes: [
      'Scripting and storyboarding from your manuscript and cover',
      'Motion graphics, licensed footage or animation as the book calls for',
      'Licensed music and professional voiceover where it helps',
      'Burned-in captions for sound-off viewing',
      'Cuts in 16:9, 1:1, 9:16 plus a 6-second bumper',
      'Full commercial usage rights for all delivered files'
    ],
    process: [
      ['Script', 'A short script and storyboard you approve before production.'],
      ['Produce', 'Footage, motion, music and voice assembled.'],
      ['Review', 'Two revision rounds on the cut.'],
      ['Deliver', 'Every aspect ratio, captioned, ready to post.']
    ],
    why: 'A trailer nobody watches to the end is a cost. We cut for retention.'
  },
  {
    slug: 'author-website',
    title: 'Author Website',
    nav: 'Author Website',
    primary: false,
    icon: 'layout',
    short: 'A fast, permanent home for your books, your list and your readers.',
    heroTitle: 'A home you <em>own</em>',
    lede: 'Social platforms change their rules constantly. Your website and your mailing list are the only reader relationships you actually control.',
    intro: 'An author website does three jobs: it makes you findable, it sells your books, and it captures email addresses so you are not renting your audience from a platform. Everything else is decoration.',
    includes: [
      'Custom design in your book’s visual language, not a stock template',
      'Books, about, blog, events and contact pages',
      'Mailing list capture wired to your email provider',
      'Buy links routed to every retailer that carries you',
      'Mobile-first build, fast loading, accessible markup',
      'Search fundamentals and analytics configured at launch',
      'A CMS you can update yourself, plus a walkthrough'
    ],
    process: [
      ['Plan', 'Sitemap, goals and the look you want.'],
      ['Design', 'Homepage design first, for approval, then the inner pages.'],
      ['Build', 'Developed, populated with your real content, tested on real devices.'],
      ['Launch', 'Domain, analytics, list integration and a handover session.']
    ],
    why: 'Your list is the asset. Everything else is a channel you are borrowing.'
  },
  {
    slug: 'blog-article-writing',
    title: 'Blog & Article Writing',
    nav: 'Blog & Article Writing',
    primary: true,
    icon: 'article',
    short: 'Regular, well-researched articles that build an audience between book releases.',
    heroTitle: 'Stay <em>visible</em> between books',
    lede: 'Books arrive every year or two. Articles keep you findable in the eighteen months in between.',
    intro: 'Consistent publishing between releases is how authors stay discoverable, grow a mailing list, and arrive at their next launch with an audience already assembled. It only works if the writing is worth reading.',
    includes: [
      'Content plan mapped to search demand and your publishing calendar',
      'Researched long-form articles, 800–2,500 words',
      'Original angles and sourced claims — not rewritten competitor posts',
      'Internal linking, metadata and headings handled',
      'Guest-post placement and pitching on request',
      'Monthly, fortnightly or weekly cadences'
    ],
    process: [
      ['Plan', 'A quarter of topics agreed up front.'],
      ['Write', 'Drafts delivered on a fixed schedule.'],
      ['Edit', 'One revision round per piece, included.'],
      ['Publish', 'Formatted and uploaded, or handed over ready to post.']
    ],
    why: 'One good article a month beats thirty thin ones. We write the one.'
  }
];

/* --------------------------------------------------------------------------
   HOME PAGE CONTENT
   -------------------------------------------------------------------------- */
const home = {
  hero: {
    title: 'Unlock your imagination with <em>Amazo Publishers</em>',
    lede: 'We give writers a place to turn a manuscript, an outline, or a half-formed idea into a book that exists in the world — edited properly, designed properly, and published under your own name.',
    pointsLabel: 'Here’s what’s in store',
    points: [
      'Unlimited rewrites within your agreed scope',
      'A dedicated project manager from day one',
      'Two-day turnaround on revisions'
    ]
  },

  about: {
    kicker: 'Who we are',
    title: 'Hire expert book writers to bring your <em>literary vision</em> to life',
    body: [
      'Amazo Publishers exists because too many good manuscripts die in a drawer between finishing and publishing. That gap is full of technical work — editing, typesetting, ISBNs, metadata, distribution — and none of it is why you started writing.',
      'We handle that part. Your ideas stay yours: we safeguard the creative integrity of the work while doing the unglamorous production that stands between a draft and a book on a shelf.',
      'You wrote the book. We do the part that stands between the draft and the shelf — and when it goes on sale, your name is the only one on the cover.'
    ],
    pullquote: 'You wrote the book. We do the part that stands between the draft and the shelf — and your name is the only one on the cover.',
    /* PLACEHOLDER FIGURES — replace with Amazo's verified numbers before launch */
    stats: [
      { num: 12, suffix: '+', label: 'Years of experience' },
      { num: 850, suffix: '+', label: 'Books published' },
      { num: 60, suffix: '+', label: 'Creative writers' }
    ]
  },

  servicesIntro: {
    kicker: 'What we do',
    title: 'Join forces with skilled writers to share your story with <em>the world</em>',
    lede: 'Our writing and publishing specialists work on one book at a time, in the genres they actually read.'
  },

  extraIntro: {
    kicker: 'And also',
    title: 'Unlock your book’s full <em>potential</em>',
    lede: 'The work that continues after publication day.'
  },

  /* Genres the writing and editorial teams actually take on. */
  genreDetail: {
    kicker: 'What we take on',
    title: 'Genres our editors <em>actually read</em>',
    lede: 'We match every book to someone who knows the shelf it belongs on — the conventions, the comparable titles and the readers who buy them.',
    items: [
      ['book', 'Literary &amp; upmarket fiction', 'Voice-led novels where the sentences carry as much weight as the plot.'],
      ['pen', 'Commercial fiction', 'Crime, thriller, romance and speculative work, edited to genre expectation.'],
      ['article', 'Business &amp; leadership', 'Books that carry an argument and have to survive a sceptical reader.'],
      ['clock', 'Memoir &amp; biography', 'Chronology, distance and the hard question of what to leave out.'],
      ['search', 'History &amp; popular science', 'Structural editing plus a sourcing and citation pass.'],
      ['palette', 'Children’s &amp; middle grade', 'Reading-age calibration, illustration briefs and page-turn planning.'],
      ['audio', 'Poetry &amp; short forms', 'Sequencing, spacing and typesetting that respects the line break.'],
      ['globe', 'Faith, self-help &amp; wellbeing', 'Claims checked, tone kept warm, and no promises the book cannot keep.']
    ]
  },

  process: {
    kicker: 'How it works',
    title: 'The meticulous approach of <em>Amazo Publishers</em>',
    lede: 'Six stages, every one of them visible to you.',
    steps: [
      ['Onboarding', 'When you place an order you are assigned a dedicated project manager who stays with the book to the end.'],
      ['Strategy', 'We draft a written strategy setting out how the book gets made and what success looks like.'],
      ['Milestones', 'The project is broken into milestones with dates, so progress is never a guess.'],
      ['Production', 'A team matched to your genre executes the work, following your instructions and your voice.'],
      ['Originality', 'Everything is written by people. AI drafting does not carry emotion, and readers can tell.'],
      ['Results', 'We deliver what was scoped, on the dates agreed. Your satisfaction is the only measure that counts.']
    ]
  },

  why: {
    kicker: 'Why Amazo',
    title: 'Reasons authors <em>stay</em>',
    items: [
      ['search', 'Findable by design', 'Metadata, categories and keywords researched before your book goes live.'],
      ['pen', 'Unique strategies', 'No template plans. Every book gets a strategy written for that book.'],
      ['money', 'Money-back guarantee', 'Under qualifying terms, set out in writing before you pay anything.'],
      ['clock', 'Fast delivery', 'Milestone dates agreed up front, and a two-day turnaround on revisions.'],
      ['shield', 'Total ownership', 'Rights, accounts and royalties stay in your name from day one.']
    ]
  },

  /* Tabs on the bestsellers shelf. Must match the genre field on `books`
     below — a tab with no matching title filters to an empty grid. */
  genres: ['Fantasy', 'Fiction', 'Romance', 'Children’s', 'Short Stories'],

  /* Showcase shelf.  [genre, title, author, rating, coverImage?]
     The cover path carries NO extension — the build probes for .jpg/.jpeg/
     .png/.webp/.avif and uses whichever is on disk, so the filename you save
     does not have to match. If no file is found the title falls back to drawn
     artwork rather than shipping a broken image.
     RATINGS ARE PLACEHOLDER — put the real figures in before launch. */
  books: [
    ['Fiction',       'The Weirdos',                  'Chinmay Chakravarty',        '4.5', 'assets/img/books/the-weirdos'],
    ['Romance',       'Romeo Returns',                'Angan Mandal',               '4.3', 'assets/img/books/romeo-returns'],
    ['Fiction',       'The Visionaries',              'JT Beleno',                  '4.4', 'assets/img/books/the-visionaries'],
    ['Children’s',    'Boojum: Portal Guardians',     'Judy Shank Cyg',             '4.6', 'assets/img/books/boojum-portal-guardians'],
    ['Fantasy',       'Simple as Time',               'Judy Shank Cyg & William Horn', '4.4', 'assets/img/books/simple-as-time'],
    ['Fantasy',       'Emrys',                        'Judy Shank Cyg',             '4.5', 'assets/img/books/emrys'],
    ['Fantasy',       'Sword of the Healer',          'Judy Shank Cyg',             '4.6', 'assets/img/books/sword-of-the-healer'],
    ['Fantasy',       'How to Replace a King',        'Judy Shank Cyg',             '4.4', 'assets/img/books/how-to-replace-a-king'],
    ['Fantasy',       'Fae Blessed',                  'Jenna Marie Sims',           '4.5', 'assets/img/books/fae-blessed'],
    ['Fiction',       'The Girl Who Waited for Karma','Emmeline Costa-Wagner',      '4.3', 'assets/img/books/the-girl-who-waited-for-karma'],
    ['Short Stories', 'A Silent Figure',              'Gaurav S Kaintura',          '4.4', 'assets/img/books/a-silent-figure']
  ],

  platforms: [
    'Amazon Kindle', 'Apple Books', 'Barnes & Noble', 'Kobo',
    'Ingram Spark', 'Audible', 'Google Play Books', 'Smashwords'
  ],

  /* PLACEHOLDER TESTIMONIALS — replace with real, attributable client quotes.
     Do not ship invented reviews under real-sounding names. */
  testimonials: [
    ['The publishing side always intimidated me. Having one person who knew the whole process and answered plainly made the difference.', 'D. L.', 'Debut novelist'],
    ['Turning the book into an audiobook was the best decision of the launch. The casting process was genuinely thorough.', 'L. M.', 'Non-fiction author'],
    ['I came in with an outline and no idea how any of it worked. The chapter map alone was worth the engagement.', 'M. J.', 'Memoirist'],
    ['I wanted a ghostwriter who would not sand the edges off the story. That is what I got.', 'J. B.', 'Historical fiction'],
    ['Every step was explained before it happened. No surprise invoices, no vanishing project manager.', 'H. J.', 'Business author'],
    ['The cover tested better at thumbnail than anything I had commissioned before. That is what actually moved sales.', 'J. K.', 'Thriller author']
  ],

  faq: [
    ['Why choose Amazo Publishers?', 'You get a plagiarism-free guarantee, a money-back guarantee under qualifying terms set out in writing, and complete confidentiality. Every account, ISBN and royalty stream is registered in your name, not ours.'],
    ['Can I change my team or point of contact if I am not satisfied?', 'Yes. If the assigned team or project manager is not working for you, tell us and we will reassign the project to someone with genuine expertise in your genre. There is no charge for this.'],
    ['Will I own the rights to my book?', 'Always. Once the project is complete and approved, every right to the content remains with you. We do not take a share of royalties and we do not hold your accounts.'],
    ['What services do you offer?', 'End-to-end publishing support: ghostwriting, developmental and copy editing, proofreading, formatting, cover design, ISBN assignment, distribution across all major platforms, audiobook production, and post-launch marketing.'],
    ['How long does publishing take?', 'It depends entirely on scope. A proofread and format on a finished manuscript can take two to three weeks. Full-service publishing usually runs four to twelve weeks. Ghostwriting a full manuscript typically takes four to nine months. You get real dates in writing before you commit.'],
    ['Do you use AI to write books?', 'No. Drafting is done by human writers. We may use software for research, transcription and consistency checking, but the prose is written by a person, and we will tell you exactly who.']
  ]
};

/* --------------------------------------------------------------------------
   LEGAL / STATIC PAGES
   -------------------------------------------------------------------------- */
const legal = [
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    lede: 'The terms that govern engagements with Amazo Publishers.',
    body: [
      ['h2', 'Agreement'],
      ['p', 'These terms apply to all services provided by Amazo Publishers. By commissioning work you accept them. Each project is additionally governed by a written scope of work that sets out deliverables, milestones, dates and fees. Where the scope and these terms conflict, the scope prevails.'],
      ['h2', 'Scope and revisions'],
      ['p', 'Revisions are unlimited within the agreed scope. Work that materially changes the brief — a new direction, a substantially different manuscript, or added deliverables — is quoted separately before it begins.'],
      ['h2', 'Intellectual property'],
      ['p', 'All rights in the finished work transfer to you on final payment. Amazo Publishers claims no ongoing interest in your manuscript, your royalties or your retailer accounts. We will request permission before naming you or your book in any portfolio or case study.'],
      ['h2', 'Confidentiality'],
      ['p', 'Your manuscript, your identity as a client, and the fact of our engagement are confidential. Ghostwriting engagements are anonymous by default: our writers assert no authorship and are bound by written non-disclosure agreements.'],
      ['h2', 'Payment'],
      ['p', 'Projects are invoiced against milestones set out in the scope. Work on a milestone begins once the preceding invoice is settled. All fees are quoted in US dollars unless stated otherwise.'],
      ['h2', 'Limitation of liability'],
      ['p', 'We do not guarantee sales figures, bestseller rankings, review counts or revenue. No publishing service honestly can. Our liability in any matter is limited to the fees paid for the service concerned.'],
      ['h2', 'Contact'],
      ['p', 'Questions about these terms should go to hello@amazopublishers.com.']
    ]
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    lede: 'What we collect, why we collect it, and what we never do with it.',
    body: [
      ['h2', 'What we collect'],
      ['p', 'We collect only what we need to quote for and deliver your project: your name, email address, telephone number where you provide one, and the manuscript or material you send us. Enquiry forms on this site collect a name, an email address, an optional phone number and your message.'],
      ['h2', 'How we use it'],
      ['p', 'Your information is used to respond to your enquiry, to produce and deliver the work you commission, and to invoice you. We contact you about your own project. We do not add you to a marketing list without your explicit consent.'],
      ['h2', 'What we do not do'],
      ['p', 'We do not sell, rent or trade your personal information. We do not share your manuscript with anyone outside the team assigned to your project. We do not use your manuscript to train machine learning models, and we do not license it to anyone who does.'],
      ['h2', 'Retention'],
      ['p', 'Project files are retained for two years after completion so we can help with reprints, corrections and new editions. You may ask us to delete them sooner and we will, subject to the records we are legally required to keep for accounting purposes.'],
      ['h2', 'Your rights'],
      ['p', 'You can ask to see the personal data we hold about you, ask us to correct it, or ask us to delete it. Write to hello@amazopublishers.com and we will respond within thirty days.'],
      ['h2', 'Cookies and analytics'],
      ['p', 'This site uses only what is needed to make pages work and to count visits in aggregate. We do not run advertising trackers or build profiles of visitors.']
    ]
  },
  {
    slug: 'refund-policy',
    title: 'Refund Policy',
    lede: 'When you are entitled to money back, stated plainly.',
    body: [
      ['h2', 'Before work begins'],
      ['p', 'If you cancel before any work has started on a milestone, that milestone is refunded in full. There is no cancellation charge.'],
      ['h2', 'During a milestone'],
      ['p', 'If you cancel while a milestone is in progress, you are charged for the work genuinely completed to that point and refunded the balance. We will show you the completed work so you can see what you are paying for.'],
      ['h2', 'If the work is not right'],
      ['p', 'Revisions are unlimited within the agreed scope. If, after a reasonable revision process, the deliverable still does not meet the written scope, you may request reassignment to a different team at no cost, or a refund of that milestone.'],
      ['h2', 'What is not refundable'],
      ['p', 'Costs already paid to third parties on your behalf — ISBN registrations, ARC and promotion site placements, advertising spend already delivered, narrator session fees, stock licences — cannot be recovered once committed. We always tell you before committing such costs.'],
      ['h2', 'Results'],
      ['p', 'Refunds are not available on the basis of sales performance, review counts or ranking. We sell the work, not an outcome no honest publisher can promise.'],
      ['h2', 'Making a claim'],
      ['p', 'Email hello@amazopublishers.com with your project reference and what went wrong. We respond within five business days and settle approved refunds within fourteen.']
    ]
  }
];

module.exports = { site, icons, services, home, legal };
