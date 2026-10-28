export default {
  layout: "layouts/service.njk",
  servicePage: true,
  eleventyComputed: {
    permalink: (data) => (data.hidden ? false : `/services/${data.page.fileSlug}/`),
  },
};
