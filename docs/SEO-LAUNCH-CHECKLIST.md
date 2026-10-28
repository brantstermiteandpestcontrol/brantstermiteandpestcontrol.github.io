# SEO & AI-search launch checklist

The site already covers the technical side: titles, schema, sitemap, `llms.txt`, IndexNow, and speed. Rankings in Google's map pack and in AI answers depend mostly on things **outside** the website. Work through this list once the domain is live.

## Day 1 — search engines

- [ ] **Google Search Console** (<https://search.google.com/search-console>): add a **Domain** property for `brantstermiteandpest.com` (verified by a TXT record at ClouDNS), then submit `https://www.brantstermiteandpest.com/sitemap.xml`.
- [ ] **Bing Webmaster Tools** (<https://www.bing.com/webmasters>): use **Import from Google Search Console**, which takes about a minute. **Bing powers ChatGPT search, Microsoft Copilot, and DuckDuckGo**, so this step is how the business shows up in AI answers.
- [ ] In Search Console, use **URL Inspection → Request indexing** for the home page, `/services/`, and `/service-areas/`.
- [ ] Unpublish the old GoDaddy site (`brantstermiteandpestcontrol.godaddysites.com`).

## Day 1 — business listings (where AI assistants and maps get their facts)

Use the exact same name, phone, and city everywhere: **Brant's Termite & Pest Control · 660-909-7284 · Warrensburg, MO** · `https://www.brantstermiteandpest.com`

- [ ] **Google Business Profile**: set the website to `https://www.brantstermiteandpest.com`. Primary category **Pest Control Service**. Secondary categories **Termite Control Service**, **Exterminator**, **Animal Control Service**. Add all 19 cities as service areas. Then paste the profile's share link into the CMS under **Business Info → Google Business Profile link**, and the "ask for reviews" link into **Google review link**.
- [ ] **Bing Places** (<https://www.bingplaces.com>): import from Google Business Profile. This feeds Copilot and ChatGPT local answers.
- [ ] **Apple Business Connect** (<https://businessconnect.apple.com>): claim the listing. This feeds Apple Maps and Siri.
- [ ] **Facebook page**: set the website URL, then add the page link in the CMS (**Business Info → Facebook page link**).
- [ ] **Yelp**, **BBB**, **MapQuest**, **Yahoo Local**: update the website URL and hours on each existing listing.
- [ ] **Knob Noster business directory** (`cityofkn.net`) lists the company as "**Brent's** Termite and Pest Control". Ask the city to correct the spelling, because mismatched names weaken local rankings.

## Week 1 — reviews (the #1 ranking factor for "near me")

- [ ] Text every recent customer the Google review link. Script:
  > Hey, this is Tyler with Brant's Termite & Pest Control. If you were happy with the service, would you mind leaving a quick Google review? Mentioning the service and your town really helps. [link]
- [ ] Reply to every review within a day or two.
- [ ] Add your best reviews to the website (**CMS → Shared sections → Customer reviews**).

## Ongoing (15 minutes a week)

- [ ] One Google Business Profile post a week, with a photo and a town name.
- [ ] Upload new job photos to Google Business Profile.
- [ ] Check Search Console monthly to see which searches you show up for, then strengthen those pages.
- [ ] Every few months, ask ChatGPT, Perplexity, and Google "who does termite control in Sedalia MO?" to see whether Brant's comes up. If it doesn't, more reviews and listings are the fix.

## Already built into the site

- A unique title and description on every page, plus service + city pages for the 5 main services × 5 main cities.
- `LocalBusiness`, `Service`, `BreadcrumbList`, and `FAQPage` structured data.
- `sitemap.xml`, `robots.txt` (welcomes AI search crawlers), and `/llms.txt`.
- IndexNow pings Bing automatically on every publish.
- Fast mobile pages with click-to-call everywhere and a sticky call bar on phones.
