/* ==========================================================================
   Enquiry handler — takes a form POST and sends it through Resend.

   Written against the Web Fetch API (Request in, Response out) so the same
   function runs on Vercel, Netlify Functions v2, Cloudflare Workers and Deno
   without an adapter. api/contact.js and netlify/functions/contact.mjs are
   both two-line re-exports of this.

   Configuration lives entirely in the environment — see .env.example. The
   API key must never be committed, and must never reach the browser: this is
   the reason the forms POST to a function at all instead of calling Resend
   directly from main.js.
   ========================================================================== */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

/* Kept deliberately short. Every one of these is a real limit on Resend's
   side or a sanity bound — they are not an attempt to guess what a genuine
   enquiry looks like, because rejecting a real one is worse than accepting
   a strange one. */
const LIMITS = { name: 200, email: 320, phone: 60, service: 120, message: 8000 };

const clean = (v, max) => String(v == null ? '' : v).trim().slice(0, max);

/* Good enough to catch a typo and nothing more. Anything stricter starts
   rejecting addresses that are perfectly valid. */
const looksLikeEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });

/* Escaped for the HTML part. The text part carries the same content
   unescaped, so a client that renders neither still shows something sane. */
const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const rows = (fields) => fields
  .filter((f) => f[1])
  .map((f) => `<tr><td style="padding:4px 14px 4px 0;color:#6b6b63;white-space:nowrap">${esc(f[0])}</td><td style="padding:4px 0;color:#141410">${esc(f[1])}</td></tr>`)
  .join('');

const handler = async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { allow: 'POST, OPTIONS' } });
  }
  if (request.method !== 'POST') {
    return json(405, { ok: false, error: 'Use POST.' });
  }

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return json(400, { ok: false, error: 'Expected a JSON body.' });
  }

  /* Honeypot. A field no human sees and no human fills. Answer 200 so a bot
     gets no signal that it was caught, but send nothing. */
  if (clean(body.company, 200)) {
    return json(200, { ok: true });
  }

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const phone = clean(body.phone, LIMITS.phone);
  const service = clean(body.service, LIMITS.service);
  const message = clean(body.message, LIMITS.message);
  const source = clean(body.source, 200) || 'the website';

  if (!name) return json(422, { ok: false, error: 'Please give us your name.' });
  if (!looksLikeEmail(email)) return json(422, { ok: false, error: 'That email address does not look right.' });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO;
  const from = process.env.ENQUIRY_FROM;

  /* 503 rather than 500: the request was fine, the mailbox is not wired up
     yet. The client treats it as "fall back to the mail client" rather than
     "something broke", so the enquiry still has somewhere to go. */
  if (!apiKey || !to || !from) {
    return json(503, {
      ok: false,
      configured: false,
      error: 'Email delivery is not configured yet.'
    });
  }

  const subject = `Enquiry from ${name} — ${source}`;
  const lines = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone],
    ['Service', service],
    ['Sent from', source]
  ];

  const text = lines.filter((l) => l[1]).map((l) => `${l[0]}: ${l[1]}`).join('\n')
    + (message ? `\n\n${message}` : '');

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6">
  <table style="border-collapse:collapse;margin-bottom:18px">${rows(lines)}</table>
  ${message ? `<div style="white-space:pre-wrap;padding-top:14px;border-top:1px solid #e6e3dc;color:#141410">${esc(message)}</div>` : ''}
</div>`;

  let res;
  try {
    res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: to.split(',').map((a) => a.trim()).filter(Boolean),
        subject,
        text,
        html,
        /* So hitting reply in the inbox goes to the author, not to us. */
        reply_to: email
      })
    });
  } catch (err) {
    return json(502, { ok: false, error: 'Could not reach the email service.' });
  }

  if (!res.ok) {
    /* Resend's own message is useful in the logs and useless to a visitor,
       so it goes to the console and not into the response. */
    let detail = '';
    try { detail = JSON.stringify(await res.json()); } catch (err) { detail = await res.text().catch(() => ''); }
    console.error('Resend rejected the enquiry:', res.status, detail);
    return json(502, { ok: false, error: 'The email service rejected the message.' });
  }

  return json(200, { ok: true });
};

module.exports = handler;
module.exports.default = handler;
