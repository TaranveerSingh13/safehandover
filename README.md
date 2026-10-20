# safehandover.ae

Marketing site for Safe Handover — property snagging and handover inspections in Dubai.
Plain HTML/CSS/JS, no build step. Hosted on GitHub Pages (`CNAME` → safehandover.ae).

```
index.html                              Home: services, checklist, price calculator, FAQ, lead form
handover-snagging/index.html            Service page (SEO: "handover snagging Dubai")
move-in-move-out-inspection/index.html  Service page (SEO: "move in inspection Dubai")
404.html
assets/styles.css  assets/main.js  assets/favicon.svg
robots.txt  sitemap.xml  CNAME
```

## Before launch — fill these in

All live settings are at the top of `assets/main.js`:

| Setting | Where | Notes |
|---|---|---|
| `CONFIG.whatsapp` / `CONFIG.phone` | main.js | WhatsApp number, digits only (e.g. `9715XXXXXXXX`) |
| `CONFIG.email` | main.js | Needs a mailbox on the domain (e.g. Zoho Mail free / Google Workspace) |
| `CONFIG.gaId` | main.js | New GA4 property for safehandover.ae (`G-…`) |
| `CONFIG.formspreeId` | main.js | Optional. Empty = form opens WhatsApp with the details prefilled |
| `PRICING` | main.js | Per-sq-ft rate + minimum per service/property type. **Placeholder values — confirm with inspection partner** |

Claims to confirm with the inspection partner (they appear in the copy): report in 24–48h,
re-inspection available, tools listed under "Tools on site", working hours in the JSON-LD.

GA4 events sent: `whatsapp_click`, `phone_click`, `price_calculated`, `generate_lead`.
Mark `generate_lead` and `whatsapp_click` as key events in GA4.

## Local preview

```bash
python3 -m http.server 4173
```

## Adding a page

Copy an existing service page folder, change title/description/canonical/JSON-LD and content,
then add the URL to `sitemap.xml`.
