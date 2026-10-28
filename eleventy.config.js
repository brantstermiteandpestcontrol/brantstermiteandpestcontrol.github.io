import markdownIt from "markdown-it";

const md = markdownIt({ html: true, linkify: false, typographer: true });

const byOrder = (a, b) =>
  (a.data.order ?? 999) - (b.data.order ?? 999) ||
  String(a.data.title || a.data.name).localeCompare(String(b.data.title || b.data.name));

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addPassthroughCopy({ "src/assets/img/favicon-32.png": "favicon.png" });

  eleventyConfig.addGlobalData("year", () => new Date().getFullYear());

  // ---- Collections -------------------------------------------------------
  eleventyConfig.addCollection("services", (api) =>
    api.getFilteredByGlob("src/services/*.md").filter((s) => !s.data.hidden).sort(byOrder)
  );

  eleventyConfig.addCollection("areas", (api) =>
    api.getFilteredByGlob("src/areas/*.md").filter((a) => !a.data.hidden).sort(byOrder)
  );

  // Service + city pages, e.g. /service-areas/sedalia/termite-control/
  // Generated for every service with "cityPages" on × every city marked "featured".
  eleventyConfig.addCollection("combos", (api) => {
    const services = api
      .getFilteredByGlob("src/services/*.md")
      .filter((s) => !s.data.hidden && s.data.cityPages)
      .sort(byOrder);
    const areas = api
      .getFilteredByGlob("src/areas/*.md")
      .filter((a) => !a.data.hidden && a.data.featured)
      .sort(byOrder);
    const combos = [];
    for (const area of areas) {
      for (const service of services) {
        combos.push({
          areaSlug: area.fileSlug,
          serviceSlug: service.fileSlug,
          area: area.data,
          service: service.data,
          areaUrl: area.url,
          serviceUrl: service.url,
          url: `/service-areas/${area.fileSlug}/${service.fileSlug}/`,
        });
      }
    }
    return combos;
  });

  // ---- Filters -----------------------------------------------------------
  eleventyConfig.addFilter("md", (str) => (str ? md.render(String(str)) : ""));
  eleventyConfig.addFilter("mdInline", (str) => (str ? md.renderInline(String(str)) : ""));

  // Swap {city} placeholders in service copy for the city name.
  eleventyConfig.addFilter("fillCity", (str, city) =>
    String(str || "").replaceAll("{city}", city || "your area")
  );

  eleventyConfig.addFilter("telHref", (phone) => "tel:+1" + String(phone).replace(/\D/g, "").slice(-10));

  eleventyConfig.addFilter("absoluteUrl", (path, base) => new URL(path, base).href);

  eleventyConfig.addFilter("comboFor", (combos, { area, service } = {}) =>
    (combos || []).filter((c) => (!area || c.areaSlug === area) && (!service || c.serviceSlug === service))
  );

  eleventyConfig.addFilter("comboUrl", (combos, areaSlug, serviceSlug) => {
    const hit = (combos || []).find((c) => c.areaSlug === areaSlug && c.serviceSlug === serviceSlug);
    return hit ? hit.url : null;
  });

  eleventyConfig.addFilter("without", (items, slug) => (items || []).filter((i) => i.fileSlug !== slug));

  eleventyConfig.addFilter("sameCounty", (areas, county, slug) =>
    (areas || []).filter((a) => a.data.county === county && a.fileSlug !== slug)
  );

  eleventyConfig.addFilter("cityList", (areas) => {
    const names = (areas || []).map((a) => a.data.name);
    if (names.length < 2) return names.join("");
    return names.slice(0, -1).join(", ") + ", and " + names.at(-1);
  });

  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));

  eleventyConfig.addFilter("getHomeFaqs", (all) => {
    const home = (all || []).find((p) => p.url === "/");
    return (home && home.data.faqs) || [];
  });

  eleventyConfig.addFilter("compact",(arr) => (arr || []).filter(Boolean));

  eleventyConfig.addFilter("milesFromHq", (name, areas) => {
    const list = areas || [];
    const hq = list.find((a) => a.data.hq) || list[0];
    const me = list.find((a) => a.data.name === name);
    if (!hq || !me || me === hq || !me.data.lat || !hq.data.lat) return null;
    const k = Math.cos((hq.data.lat * Math.PI) / 180);
    const dx = (me.data.lng - hq.data.lng) * 69.17 * k;
    const dy = (me.data.lat - hq.data.lat) * 69.0;
    return Math.max(5, Math.round(Math.hypot(dx, dy) / 5) * 5);
  });

  eleventyConfig.addFilter("featuredOnly",(items) => (items || []).filter((i) => i.data.featured));

  // Lay out the service-area "radar" map: miles from the home-base city, scaled to SVG units.
  eleventyConfig.addFilter("mapLayout", (areas) => {
    const pts = (areas || []).filter((a) => a.data.lat && a.data.lng);
    if (!pts.length) return null;
    const hq = pts.find((a) => a.data.hq) || pts[0];
    const lat0 = hq.data.lat;
    const lng0 = hq.data.lng;
    const k = Math.cos((lat0 * Math.PI) / 180);
    const scale = 6.3; // SVG units per mile
    const points = pts.map((a) => {
      const x = (a.data.lng - lng0) * 69.17 * k * scale;
      const y = -(a.data.lat - lat0) * 69.0 * scale;
      return {
        name: a.data.name,
        url: a.url,
        featured: !!a.data.featured,
        hq: a === hq,
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        label: a.data.mapLabel || "right",
        miles: Math.round(Math.hypot(x, y) / scale),
      };
    });
    const pad = 78;
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const minX = Math.min(...xs) - pad;
    const maxX = Math.max(...xs) + pad;
    const minY = Math.min(...ys) - pad * 0.55;
    const maxY = Math.max(...ys) + pad * 0.55;
    return {
      viewBox: [minX, minY, maxX - minX, maxY - minY].map((n) => Math.round(n)).join(" "),
      rings: [20, 40, 60].map((mi) => ({ mi, r: mi * scale })),
      points,
      bounds: { minX, maxX, minY, maxY },
    };
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    // Page text edited in the CMS is plain Markdown — no template code runs inside it.
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html", "11ty.js"],
  };
}
