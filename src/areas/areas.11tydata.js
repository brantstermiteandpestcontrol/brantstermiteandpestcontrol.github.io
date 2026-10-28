export default {
  layout: "layouts/area.njk",
  areaPage: true,
  eleventyComputed: {
    permalink: (data) => (data.hidden ? false : `/service-areas/${data.page.fileSlug}/`),
    title: (data) => `Pest Control in ${data.name}, MO`,
  },
};
