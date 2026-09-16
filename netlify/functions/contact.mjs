/* Netlify Functions v2 — served at /.netlify/functions/contact.

   Netlify insists functions live under netlify/functions/, so this is a
   re-export rather than a second copy of the logic. If you deploy here,
   point site.formEndpoint in build/site.data.js at the path above (or add a
   redirect from /api/* in netlify.toml) and rebuild. */

import handler from '../../api/_enquiry.js';

export default handler;
