// Computed SEO data for every page: <title>, meta description, breadcrumbs,
// Service schema, and FAQs (hand-written + auto-generated for city pages).

const svcName = (s) => s.shortTitle || s.title;
const lower = (str) => String(str).toLowerCase();
const sentence = (str) => { const l = lower(str); return l.charAt(0).toUpperCase() + l.slice(1); };

export default {
  crumbs(d) {
    const url = d.page && d.page.url;
    if (!url || url === "/" || d.noindex) return null;
    if (d.combo) {
      return [
        { label: "Service Areas", url: "/service-areas/" },
        { label: `${d.combo.area.name}, MO`, url: d.combo.areaUrl },
        { label: svcName(d.combo.service), url },
      ];
    }
    if (d.servicePage) return [{ label: "Services", url: "/services/" }, { label: d.title, url }];
    if (d.areaPage) return [{ label: "Service Areas", url: "/service-areas/" }, { label: `${d.name}, MO`, url }];
    return [{ label: d.navTitle || d.title, url }];
  },

  metaTitle(d) {
    if (d.combo) {
      const s = d.combo.service;
      return `${s.seoName || svcName(s)} ${d.combo.area.name} MO | ${s.seoSuffix || d.site.name}`;
    }
    if (d.seoTitle) return d.seoTitle;
    if (d.areaPage) return `Pest Control ${d.name} MO | ${d.site.name}`;
    if (d.servicePage) return `${d.title} Warrensburg MO | ${d.seoSuffix || d.site.name}`;
    return d.title ? `${d.title} | ${d.site.name}` : d.site.name;
  },

  metaDesc(d) {
    if (d.combo) {
      const s = d.combo.service;
      const a = d.combo.area;
      return `${sentence(svcName(s))} in ${a.name}, MO. ${s.metaPitch || "Residential and commercial service."} Local & owner-operated. Call ${d.site.phone}.`;
    }
    if (d.metaDescription) return d.metaDescription;
    if (d.areaPage) {
      return `Local pest control in ${d.name}, MO — termites, bed bugs, mosquitoes, ants, roaches, spiders & wildlife. Homes & businesses. Call ${d.site.phone}.`;
    }
    return `${d.site.name} provides residential and commercial pest control across ${d.site.region}. Call ${d.site.phone}.`;
  },

  serviceSchema(d) {
    if (d.combo) {
      return {
        name: `${svcName(d.combo.service)} in ${d.combo.area.name}, MO`,
        type: d.combo.service.title,
        area: { "@type": "City", name: `${d.combo.area.name}, MO` },
      };
    }
    if (d.servicePage) {
      return {
        name: d.title,
        type: d.title,
        area: { "@type": "AdministrativeArea", name: `${d.site.region}` },
      };
    }
    return null;
  },

  // FAQs shown on the page and published as FAQPage structured data.
  allFaqs(d) {
    const own = Array.isArray(d.faqs) ? d.faqs : [];
    const phone = d.site.phone;
    const company = d.site.name;

    if (d.combo) {
      const s = d.combo.service;
      const a = d.combo.area;
      const name = svcName(s);
      const fill = (t) => String(t).replaceAll("{city}", a.name);
      const generated = [
        {
          q: `Do you provide ${lower(name)} in ${a.name}, MO?`,
          a: `Yes. ${company} provides ${lower(name)} for homes and businesses in ${a.name} and throughout ${a.county || "the surrounding area"}. Call ${phone} for a free quote.`,
        },
      ];
      return generated.concat((s.faqs || []).map((f) => ({ q: fill(f.q), a: fill(f.a) })));
    }

    if (d.areaPage) {
      const generated = [
        {
          q: `Do you offer pest control in ${d.name}, MO?`,
          a: `Yes. ${company} provides residential and commercial pest control in ${d.name}${d.county ? ` and across ${d.county}` : ""}, including termite control, bed bug treatments, mosquito and tick control, ant and cockroach control, spider control, wasp and hornet removal, live trapping, wildlife control, and snake removal.`,
        },
        {
          q: `Do you service businesses in ${d.name}?`,
          a: `Yes. We work with apartment complexes, restaurants, offices, warehouses, and city and municipal properties in ${d.name}, with flexible scheduling and ongoing maintenance plans.`,
        },
        {
          q: `How do I schedule pest control in ${d.name}?`,
          a: `Call ${phone} or request a free quote online. We're open Monday through Friday, 8 AM to 5 PM.`,
        },
      ];
      return generated.concat(own);
    }

    return own;
  },
};
