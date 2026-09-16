/* Vercel serves this at /api/contact.

   Vercel's Node runtime hands a CommonJS handler Node's own (req, res) pair,
   not a Web Request — so this file is the bridge. The logic itself lives in
   _enquiry.js in Web Request/Response terms, which is what Netlify, Deno and
   Cloudflare pass natively. The leading underscore keeps Vercel from
   publishing that file as a route of its own. */

const enquiry = require('./_enquiry.js');

const readBody = (req) => new Promise((resolve, reject) => {
  /* Some platforms parse the body for us and leave req.body set; the rest
     leave the stream for us to drain. Handle both rather than assuming. */
  if (req.body !== undefined && req.body !== null) {
    resolve(typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
    return;
  }
  let raw = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    raw += chunk;
    /* A body this size is not a form submission. Stop reading rather than
       buffering whatever is being sent. */
    if (raw.length > 100000) { req.destroy(); reject(new Error('body too large')); }
  });
  req.on('end', () => resolve(raw));
  req.on('error', reject);
});

module.exports = async (req, res) => {
  let body;
  try {
    body = await readBody(req);
  } catch (err) {
    res.statusCode = 413;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ ok: false, error: 'That message is too long to send.' }));
    return;
  }

  const method = (req.method || 'GET').toUpperCase();
  const request = new Request('https://' + (req.headers.host || 'localhost') + (req.url || '/api/contact'), {
    method,
    headers: req.headers,
    body: method === 'GET' || method === 'HEAD' ? undefined : (body || '')
  });

  const response = await enquiry(request);

  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.end(await response.text());
};
