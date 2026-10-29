# Brant's Termite & Pest Control — website

Source for **www.brantstermiteandpest.com**.

- **Static site** built with [Eleventy](https://www.11ty.dev/) 3. Output is plain HTML/CSS with almost no JavaScript, so it loads fast and ranks well.
- **Hosting:** GitHub Pages (free). Every push to `main` builds and publishes through `.github/workflows/deploy.yml`.
- **Editing:** [Pages CMS](https://pagescms.org) (free) gives Brant a form-based editor on top of this repo. The config is in `.pages.yml`, and his guide is in [docs/EDITING-GUIDE.md](docs/EDITING-GUIDE.md).
- **Quote form:** [Web3Forms](https://web3forms.com) (free, 250 submissions/month) emails each request. Until a key is set in Business Info, the form asks visitors to call.

## Run locally

```bash
npm install
npm start          # http://localhost:8080, reloads on save
npm run build      # writes the site to _site/
```

Requires Node 20 or newer.

## What's where

| Path | What it is |
|---|---|
| `src/_data/site.json` | Business info: phone, hours, address, badges, form key. One change updates the whole site. |
| `src/index.md`, `residential.md`, `commercial.md`, `about.md` | Page content (front matter plus Markdown). |
| `src/services/*.md` | One file per service, which becomes `/services/<file>/`. |
| `src/areas/*.md` | One file per city, which becomes `/service-areas/<file>/`. |
| `src/combos.njk` | Generates the service + city pages, e.g. `/service-areas/sedalia/termite-control/`. |
| `src/_data/why.json`, `process.json`, `reviews.json` | Shared sections. Reviews are hidden until at least one is added. |
| `src/_data/eleventyComputed.js` | Per-page SEO: titles, descriptions, breadcrumbs, FAQ and Service schema. |
| `src/_includes/` | Layouts and partials. `partials/icons.njk` holds the inline SVG icon set. |
| `src/assets/` | CSS, JS, self-hosted fonts, images. |
| `src/robots.njk`, `sitemap.njk`, `llms.11ty.js` | `robots.txt`, `sitemap.xml`, `llms.txt`. |

### Service + city pages

A page is generated for **every service with `cityPages: true` × every city with `featured: true`**. Right now that's 5 services × 5 cities = 25 pages, the set from the original plan. Both flags are toggles in the CMS.

Keep the number modest. Google treats large sets of near-identical "{service} in {city}" pages as doorway spam. Each generated page pulls the city's own `intro` text, so every featured city needs a genuinely local intro. Don't mark every city as featured.

## Launch steps

### 1. GitHub

- Org: <https://github.com/brantstermiteandpestcontrol>. Brant needs his own free GitHub account added as an org **owner** so he holds the keys after hand-off.
- Repo: **`brantstermiteandpestcontrol.github.io`**, which must be **public** for free Pages. Naming it `<org>.github.io` serves the site from the root, so the preview works before the domain is connected.

1. Push this folder to `main` (see the commands below).
2. Go to **Repo Settings → Pages → Build and deployment → Source** and select **GitHub Actions**. If the first workflow run failed because Pages wasn't enabled yet, re-run it from the **Actions** tab.
3. The preview goes live at <https://brantstermiteandpestcontrol.github.io>.

```bash
git remote add origin git@github.com:brantstermiteandpestcontrol/brantstermiteandpestcontrol.github.io.git
git push -u origin main
```

> Don't enter the custom domain in Pages settings until the DNS change in step 3 is done. Once a custom domain is set, the `github.io` preview redirects to it.

### 2. Verify the domain (prevents takeover)

Go to **Org Settings → Pages → Add a domain** and enter `brantstermiteandpest.com`. GitHub shows a TXT record. Add it at the DNS host (below) and click Verify.

### 3. DNS: point the domain at GitHub Pages

The domain is **registered at GoDaddy**, but its **DNS is hosted at ClouDNS** (nameservers `dns41–44.cloudns.net`). Make the changes in ClouDNS. If nobody has the ClouDNS login, either recover it or switch the nameservers back to GoDaddy in GoDaddy's domain settings, then recreate *all* the records below there.

> ⚠️ **The domain has Microsoft 365 email** (bought through GoDaddy). **Do not touch** the `MX`, the `TXT` records (`MS=ms37143154` and the `v=spf1 …` SPF record), the `autodiscover` CNAME, or `_dmarc`. Change only the website records.

| Type | Host | Value | Action |
|---|---|---|---|
| A | `@` | `13.248.243.5` | **Delete** (old GoDaddy site) |
| A | `@` | `185.199.108.153` | Add |
| A | `@` | `185.199.109.153` | Add |
| A | `@` | `185.199.110.153` | Add |
| A | `@` | `185.199.111.153` | Add |
| AAAA | `@` | `2606:50c0:8000::153`, `…8001::153`, `…8002::153`, `…8003::153` | Add (optional, IPv6) |
| CNAME | `www` | `brantstermiteandpestcontrol.github.io` | Replace the current `www` record |
| TXT | `_github-pages-challenge-brantstermiteandpestcontrol` | *(code from step 2)* | Add |

Then in the repo go to **Settings → Pages → Custom domain**, enter `www.brantstermiteandpest.com`, save, wait for the certificate, and tick **Enforce HTTPS**. The bare domain redirects to `www` automatically, and `www` matches the QR code on his business cards.

### 4. Editor (Pages CMS)

1. Go to <https://app.pagescms.org> and sign in with GitHub.
2. Install the Pages CMS GitHub app on the `brantstermiteandpestcontrol` org when prompted (an org owner has to approve it), then open the repo. The menu (Business Info, Pages, Services, Service Areas, Shared sections) comes from `.pages.yml`.
3. To give Brant access without a GitHub login, add him as a collaborator by email in Pages CMS.

### 5. Quote form

Get a free access key at <https://web3forms.com> using the inbox that should receive leads, probably his `@brantstermiteandpest.com` Microsoft 365 address. Paste it into **Business Info → Quote form → Web3Forms access key**. Submissions are emailed and the visitor lands on `/thank-you/`.

### 6. Retire the old GoDaddy site

After the new site is live, unpublish the GoDaddy Websites + Marketing site (`brantstermiteandpestcontrol.godaddysites.com`) so Google doesn't see two versions of the business. Then cancel that plan. **Keep the domain registration and the Microsoft 365 email.** The domain renews **2027-05-27**.

Then work through [docs/SEO-LAUNCH-CHECKLIST.md](docs/SEO-LAUNCH-CHECKLIST.md).

## SEO & AI-search features built in

- A unique `<title>` and meta description on every page. Service pages target the region, and service + city pages target "{service} {city} MO".
- JSON-LD: `LocalBusiness` (name, phone, address, hours, every service city, service catalog) on every page, plus `Service`, `BreadcrumbList`, and `FAQPage` where relevant.
- `sitemap.xml`, canonical URLs, Open Graph/Twitter cards with a branded share image.
- `robots.txt` explicitly allows AI search crawlers (OAI-SearchBot/ChatGPT, Claude, Perplexity, Google-Extended, Applebot, Bing). To opt out of AI *training* while staying in AI *search*, remove `GPTBot`, `ClaudeBot`, `Google-Extended`, and `Applebot-Extended` from that list.
- `/llms.txt`: a plain-text summary of the business for AI assistants, generated from the same data.
- **IndexNow**: after each deploy the workflow pings Bing and others with every URL. Bing's index feeds ChatGPT search, Copilot, and DuckDuckGo. The key file is served at `/<indexNowKey>.txt`.
- Fast by default: self-hosted fonts, responsive WebP images, about 3 KB of JS, and no third-party scripts.
