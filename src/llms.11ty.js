// /llms.txt — a plain-text summary of the business for AI assistants (ChatGPT, Claude, Perplexity, etc.).
// Built from the same data as the website, so it stays current automatically.

export const data = {
  permalink: "/llms.txt",
  eleventyExcludeFromCollections: true,
};

export function render({ site, collections }) {
  const abs = (path) => new URL(path, site.url).href;
  const home = collections.all.find((p) => p.url === "/");
  const faqs = (home && home.data.faqs) || [];
  const a = site.address;

  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.tagline} ${site.name} is a locally owned, licensed and insured pest control company based in ${a.city}, Missouri, providing residential and commercial pest control across ${site.region} and the eastern Kansas City metro.`,
    "",
    `- Owner: ${site.owner} (${site.ownerTitle})`,
    `- Phone: ${site.phone}`,
    `- Website: ${site.url}`,
    site.email ? `- Email: ${site.email}` : null,
    site.showAddress ? `- Address: ${a.street}, ${a.city}, ${a.state} ${a.zip}` : `- Based in: ${a.city}, ${a.state}`,
    `- Hours: ${site.hours.map((h) => `${h.days} ${h.time}`).join("; ")}`,
    `- Free quotes: call ${site.phone} or ${abs("/contact/")}`,
    "- Customers: homeowners, renters, landlords, apartment complexes, restaurants, offices, warehouses, and city/municipal properties",
    "",
    "## Services",
    "",
    ...collections.services.map((s) => `- [${s.data.title}](${abs(s.url)}): ${s.data.summary}`),
    `- [Residential pest control](${abs("/residential/")}): Interior and exterior treatments, preventative barrier protection, and monthly service plans.`,
    `- [Commercial pest control](${abs("/commercial/")}): Customized, discreet programs for apartments, restaurants, offices, warehouses, and municipal properties.`,
    "",
    "## Service Areas (Missouri)",
    "",
    ...collections.areas.map(
      (ar) => `- [${ar.data.name}, MO](${abs(ar.url)})${ar.data.county ? ` — ${ar.data.county}` : ""}`
    ),
    "",
    "## Common Questions",
    "",
    ...faqs.flatMap((f) => [`### ${f.q}`, f.a, ""]),
    "## Optional",
    "",
    `- [About ${site.name}](${abs("/about/")})`,
    `- [All service areas](${abs("/service-areas/")})`,
    `- [Sitemap](${abs("/sitemap.xml")})`,
    "",
  ];
  return lines.filter((l) => l !== null).join("\n");
}
