# Enquiry endpoint

The three forms on the site (pop-up, homepage band, contact page) POST JSON
here. This function passes it to [Resend](https://resend.com) and replies
`{"ok":true}`.

```
api/_enquiry.js              the logic, in Web Request/Response terms
api/contact.js               Vercel adapter — bridges Node's (req, res)
netlify/functions/contact.mjs  Netlify adapter — re-exports the handler
```

## It does nothing until you set three environment variables

Copy `.env.example` and fill it in, then set the same three in your host's
dashboard. **`.env` is gitignored — never commit a real key, and never put one
in `build/site.data.js` or under `assets/`, because everything there is served
to the browser.**

| variable | value |
|---|---|
| `RESEND_API_KEY` | from <https://resend.com/api-keys>, starts with `re_` |
| `ENQUIRY_TO` | where enquiries land; comma-separated for more than one |
| `ENQUIRY_FROM` | a **verified** sender — see below |

`ENQUIRY_FROM` cannot be a Gmail or Outlook address. Resend only sends from a
domain you have verified with them, so verify `amazopublishers.com` at
<https://resend.com/domains> first and use an address on it. A display name is
fine: `Amazo Publishers <enquiries@amazopublishers.com>`.

## Nothing breaks before then

Until all three are set the endpoint answers `503`, and the forms fall back to
opening the visitor's mail client exactly as they did before. The same happens
on a host with no function runtime, where this path simply 404s. So the site
keeps collecting enquiries throughout the switch-over — but note that a
mail-client handoff still depends on the visitor pressing Send themselves.

## Deploying

**Vercel** — `api/contact.js` is picked up automatically; no config needed.

**Netlify** — functions are served from `/.netlify/functions/contact`, so
point `site.formEndpoint` in `build/site.data.js` at that path and rebuild.
Or keep `/api/contact` and add a redirect:

```toml
# netlify.toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

**GitHub Pages or any plain static host** — there is no function runtime, so
this endpoint cannot run. The forms stay on the mail-client handoff.

## Checking it works

```bash
curl -X POST https://your-site/api/contact \
  -H 'content-type: application/json' \
  -d '{"name":"Test","email":"you@example.com","message":"Hello"}'
```

`{"ok":true}` means it sent. `503` means the variables are not set on the
host. `502` means Resend rejected it — the reason is in the function logs,
most often an unverified `ENQUIRY_FROM` domain.

## Spam

Every form carries a honeypot field named `company`, positioned off-screen and
hidden from assistive tech. If it arrives filled, the endpoint answers `200`
and sends nothing, so a bot gets no signal that it was caught. There is no
rate limiting — add it at the platform edge if the honeypot stops being enough.
