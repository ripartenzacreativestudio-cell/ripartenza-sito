module.exports = {
  layout: "progetto.njk",
  tags: "lavori",
  eleventyComputed: {
    permalink: (data) => (data.page.fileSlug === "lavori" ? data.permalink : data.pubblicato ? `/lavori/${data.page.fileSlug}/` : false),
  },
};
